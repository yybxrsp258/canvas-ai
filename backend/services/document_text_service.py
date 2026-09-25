"""剧本文档的纯文本抽取。

支持 txt / docx / pdf 三种格式（与渲染层 validateStoryDocumentFile 的白名单一致）。

- pdf 用 pypdf
- docx 用标准库解析（docx 就是一个 zip，正文在 word/document.xml），
  因此不引入 python-docx 依赖
- txt 做多编码兜底：中文剧本常见 GBK/GB18030，直接按 UTF-8 读会报错或乱码
"""
from __future__ import annotations

import io
import zipfile
from xml.etree import ElementTree

# 按可能性排序；gb18030 是 GBK 的超集，覆盖简体中文脚本的绝大多数情况
_TEXT_ENCODINGS = ("utf-8-sig", "utf-8", "gb18030", "big5", "utf-16", "latin-1")

_WORD_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

SUPPORTED_EXTENSIONS = ("txt", "md", "docx", "pdf")

# 单次抽取的文本上限，避免超大文档把后续 LLM 请求撑爆
MAX_TEXT_CHARACTERS = 4_000_000


class DocumentExtractionError(Exception):
    """文档无法解析。message 会直接展示给用户，故使用中文。"""

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


def _decode_text(data: bytes) -> tuple[str, list[str]]:
    warnings: list[str] = []
    for encoding in _TEXT_ENCODINGS:
        try:
            return data.decode(encoding), warnings
        except (UnicodeDecodeError, LookupError):
            continue
    # latin-1 一定能解码，走不到这里；保险起见
    return data.decode("utf-8", "replace"), ["文本编码无法确定，已用替换字符处理。"]


def _extract_pdf(data: bytes) -> tuple[str, list[str]]:
    try:
        from pypdf import PdfReader
    except ImportError as exc:  # pragma: no cover - 依赖缺失时给出可操作提示
        raise DocumentExtractionError(
            "服务端缺少 pypdf，无法解析 PDF。请安装 requirements.base.txt 中的依赖。"
        ) from exc

    warnings: list[str] = []
    try:
        reader = PdfReader(io.BytesIO(data))
        if getattr(reader, "is_encrypted", False):
            try:
                reader.decrypt("")
            except Exception:  # noqa: BLE001
                raise DocumentExtractionError("该 PDF 已加密，无法解析。") from None

        pages: list[str] = []
        skipped = 0
        for page in reader.pages:
            try:
                pages.append(page.extract_text() or "")
            except Exception:  # noqa: BLE001 - 单页失败不应中断整篇
                skipped += 1
        if skipped:
            warnings.append(f"有 {skipped} 页解析失败，已跳过。")
        return "\n".join(pages), warnings
    except DocumentExtractionError:
        raise
    except Exception as exc:  # noqa: BLE001
        raise DocumentExtractionError(f"PDF 解析失败：{exc}") from exc


def _extract_docx(data: bytes) -> tuple[str, list[str]]:
    warnings: list[str] = []
    try:
        archive = zipfile.ZipFile(io.BytesIO(data))
    except zipfile.BadZipFile as exc:
        raise DocumentExtractionError("DOCX 文件已损坏或不是有效的 Word 文档。") from exc

    try:
        with archive:
            try:
                xml_bytes = archive.read("word/document.xml")
            except KeyError as exc:
                raise DocumentExtractionError("DOCX 中缺少正文（word/document.xml）。") from exc
    except zipfile.BadZipFile as exc:
        raise DocumentExtractionError("DOCX 文件已损坏。") from exc

    try:
        root = ElementTree.fromstring(xml_bytes)
    except ElementTree.ParseError as exc:
        raise DocumentExtractionError(f"DOCX 正文 XML 解析失败：{exc}") from exc

    paragraphs: list[str] = []
    for para in root.iter(f"{_WORD_NS}p"):
        pieces: list[str] = []
        # 直接遍历所有节点，保留 tab / br 的相对位置
        for node in para.iter():
            tag = node.tag
            if tag == f"{_WORD_NS}t":
                pieces.append(node.text or "")
            elif tag == f"{_WORD_NS}tab":
                pieces.append("\t")
            elif tag in (f"{_WORD_NS}br", f"{_WORD_NS}cr"):
                pieces.append("\n")
        paragraphs.append("".join(pieces))

    text = "\n".join(paragraphs)
    if not text.strip():
        warnings.append("文档正文为空，可能内容位于图片或文本框中。")
    return text, warnings


def extract_document_text(filename: str, data: bytes) -> tuple[str, str, list[str]]:
    """按扩展名抽取文本。返回 (文本, 扩展名, 警告列表)。"""
    name = str(filename or "").strip()
    extension = name.rsplit(".", 1)[-1].lower() if "." in name else ""

    if not data:
        raise DocumentExtractionError("文件内容为空。")
    if extension not in SUPPORTED_EXTENSIONS:
        raise DocumentExtractionError(
            f"不支持的文档格式：{extension or '(无扩展名)'}。支持 txt / docx / pdf。"
        )
    if extension == "doc":
        raise DocumentExtractionError("暂不支持旧版 DOC 文件，请先另存为 DOCX、PDF 或 TXT。")

    if extension == "pdf":
        text, warnings = _extract_pdf(data)
        # 走到这里没抛错就说明是 PDF；pdf 模块可能给出非致命警告
        normalized = extension
    elif extension == "docx":
        text, warnings = _extract_docx(data)
        normalized = extension
    else:
        text, warnings = _decode_text(data)
        normalized = extension

    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if len(text) > MAX_TEXT_CHARACTERS:
        text = text[:MAX_TEXT_CHARACTERS]
        warnings.append(f"文档过长，已截断至 {MAX_TEXT_CHARACTERS} 字符。")

    if not text.strip():
        raise DocumentExtractionError("文档解析结果没有可用文本。")

    return text, normalized, warnings
