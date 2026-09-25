"""用户数据的 JSON 文件存储。

后端把 /api/v2/user/* 、项目、清单等持久化对象按 JSON 文件落在用户目录下。
本模块负责路径收敛、原子写入与并发保护。
"""
from __future__ import annotations

import json
import os
import threading
from typing import Any

_MISSING = object()


class JsonFileStore:
    """根目录下的 JSON 文件读写。所有路径都被约束在根目录内。"""

    def __init__(self, root: str) -> None:
        self.root = os.path.abspath(root)
        # ThreadingHTTPServer 会并发处理请求，写操作需要串行化
        self._lock = threading.Lock()

    def resolve(self, name: str) -> str | None:
        """把相对名解析为根目录内的绝对路径；越界返回 None。"""
        candidate = os.path.abspath(os.path.join(self.root, name))
        if candidate != self.root and not candidate.startswith(self.root + os.sep):
            return None
        return candidate

    def read(self, name: str, default: Any = None) -> Any:
        """读取并解析；文件不存在返回 default，内容损坏同样返回 default。"""
        path = self.resolve(name)
        if path is None or not os.path.isfile(path):
            return default
        try:
            with open(path, "r", encoding="utf-8") as fh:
                return json.load(fh)
        except (OSError, UnicodeDecodeError, json.JSONDecodeError):
            return default

    def write(self, name: str, data: Any) -> bool:
        """原子写入（先写临时文件再替换），避免读到半截内容。"""
        path = self.resolve(name)
        if path is None:
            return False
        directory = os.path.dirname(path)
        try:
            with self._lock:
                os.makedirs(directory, exist_ok=True)
                tmp = f"{path}.{os.getpid()}.tmp"
                with open(tmp, "w", encoding="utf-8") as fh:
                    json.dump(data, fh, ensure_ascii=False, indent=2)
                os.replace(tmp, path)
            return True
        except OSError:
            return False

    def delete(self, name: str) -> bool:
        path = self.resolve(name)
        if path is None or not os.path.isfile(path):
            return False
        try:
            with self._lock:
                os.remove(path)
            return True
        except OSError:
            return False

    def list_names(self, suffix: str = ".json") -> list[str]:
        """列出根目录下（不含子目录）匹配后缀的文件名。"""
        try:
            entries = os.listdir(self.root)
        except OSError:
            return []
        return sorted(
            name for name in entries
            if name.endswith(suffix) and os.path.isfile(os.path.join(self.root, name))
        )
