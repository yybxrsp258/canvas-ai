import { normalizeWebPreviewFaviconUrl, normalizeWebPreviewUrl } from '../src/modules/webPreviewUrl.js';
import { resolveDouyinCurrentPageMedia } from './douyinWebPreviewResolver.js';
import { normalizeWebPreviewContextMenuShortcuts } from './contextMenuShortcutAccelerators.js';
const MIN_VIEW_SIZE = 0x10;
const WEB_PREVIEW_IMAGE_DROP_MIME = "application/x-ai-canvas-web-preview-image";
const DEFAULT_WEB_PREVIEW_BROWSER_PROFILE_ID = "default";
const WEB_PREVIEW_PARTITION_PREFIX = "persist:ai-canvas-web-preview";
const READY_SNAPSHOT_IDLE_DELAY_MS = 0xb4;
const POPUP_REGISTRATION_GRACE_MS = 0x1388;
const WEB_PREVIEW_IMAGE_EXTRACTION_LIMIT = 0x78;
const WEB_PREVIEW_VIDEO_EXTRACTION_LIMIT = 0x28;
const WEB_PREVIEW_EXTRACT_MIN_IMAGE_WIDTH = 0x60;
const WEB_PREVIEW_EXTRACT_MIN_IMAGE_HEIGHT = 0x60;
const WEB_PREVIEW_EXTRACT_MIN_IMAGE_AREA = 0x2ee0;
const WEB_PREVIEW_SELECTED_TEXT_LIMIT = 0x1388;
const WEB_PREVIEW_DIRECT_VIDEO_EXTENSION_RE = /\.(?:mp4|webm|mov|m4v|ogv)(?:[?#].*)?$/i;
const WEB_PREVIEW_STREAM_MEDIA_EXTENSION_RE = /\.(?:m3u8|mpd|m4s)(?:[?#].*)?$/i;
const WEB_PREVIEW_AUTH_POPUP_WIDTH = 0x208;
const WEB_PREVIEW_AUTH_POPUP_HEIGHT = 0x2a8;
const WEB_PREVIEW_AUTH_POPUP_MIN_WIDTH = 0x168;
const WEB_PREVIEW_AUTH_POPUP_MIN_HEIGHT = 0x1a4;
const WEB_PREVIEW_AUTH_POPUP_REQUEST_TTL_MS = 0x2710;
const WEB_PREVIEW_INPUT_BRIDGE_MESSAGE_PREFIX = "__AI_CANVAS_WEB_PREVIEW_INPUT__:";
const WEB_PREVIEW_CONTEXT_MENU_BRIDGE_DEDUPE_MS = 0x1f4;
const WEB_PREVIEW_TEXT_ACTION_PROMPT = "send-selected-text";
const WEB_PREVIEW_TEXT_ACTION_SOURCE = "send-selected-text-source";
const WEB_PREVIEW_TEXT_ACTION_IMAGE_PROMPT = "send-selected-text-to-image";
const WEB_PREVIEW_TEXT_ACTION_IMAGE_PROMPT_GENERATE = "send-selected-text-to-image-generate";
const WEB_PREVIEW_TEXT_ACTION_VIDEO_PROMPT = "send-selected-text-to-video";
const WEB_PREVIEW_TEXT_ACTION_VIDEO_PROMPT_GENERATE = "send-selected-text-to-video-generate";
function buildWebPreviewDragBridgeScript({
  nodeId = '',
  tabId = '',
  inputBridgeToken = ''
} = {}) {
  return "\n(() => {\n  const hasDragBridge = !!window.__AI_CANVAS_WEB_PREVIEW_DRAG_BRIDGE__;\n  if (!hasDragBridge) {\n    Object.defineProperty(window, \"__AI_CANVAS_WEB_PREVIEW_DRAG_BRIDGE__\", {\n      value: true,\n      configurable: false,\n    });\n  }\n  const MIME = " + JSON['stringify'](WEB_PREVIEW_IMAGE_DROP_MIME) + ';\x0a\x20\x20const\x20INPUT_PREFIX\x20=\x20' + JSON["stringify"](WEB_PREVIEW_INPUT_BRIDGE_MESSAGE_PREFIX) + ";\n  const INPUT_TOKEN = " + JSON["stringify"](String(inputBridgeToken || '')) + ";\n  const escapeHtml = (value) => String(value || \"\").replace(/[&<>\"']/g, (ch) => ({\n    \"&\": \"&amp;\",\n    \"<\": \"&lt;\",\n    \">\": \"&gt;\",\n    '\"': \"&quot;\",\n    \"'\": \"&#39;\",\n  })[ch]);\n  const normalizeUrl = (value) => {\n    try {\n      const url = new URL(String(value || \"\"), document.baseURI);\n      if (url.protocol !== \"http:\" && url.protocol !== \"https:\") return \"\";\n      url.username = \"\";\n      url.password = \"\";\n      return url.href;\n    } catch {\n      return \"\";\n    }\n  };\n  const parseSrcset = (value) => String(value || \"\")\n    .split(\",\")\n    .map((item) => normalizeUrl(item.trim().split(/\\s+/)[0] || \"\"))\n    .filter(Boolean);\n  const parseCssUrls = (value) => {\n    const urls = [];\n    const text = String(value || \"\");\n    const re = /url\\(([\"']?)(.*?)\\1\\)/g;\n    let match = null;\n    while ((match = re.exec(text))) {\n      const url = normalizeUrl(match[2] || \"\");\n      if (url) urls.push(url);\n    }\n    return urls;\n  };\n  const getImageUrl = (image) => normalizeUrl(\n    image?.currentSrc ||\n      image?.src ||\n      image?.getAttribute?.(\"src\") ||\n      image?.dataset?.src ||\n      image?.dataset?.original ||\n      image?.dataset?.lazySrc ||\n      parseSrcset(image?.srcset || image?.getAttribute?.(\"srcset\") || \"\")[0] ||\n      \"\",\n  );\n  const getElementTitle = (element, fallback = \"\") =>\n    String(\n      element?.alt ||\n        element?.title ||\n        element?.getAttribute?.(\"aria-label\") ||\n        fallback ||\n        document.title ||\n        \"网页图片\",\n    ).slice(0, 120);\n  const findImageElement = (target) => {\n    if (!target?.closest) return null;\n    return (\n      target.closest(\"img\") ||\n      target.closest(\"picture\")?.querySelector?.(\"img\") ||\n      target.querySelector?.(\"img, picture img\") ||\n      null\n    );\n  };\n  const findBackgroundImageSource = (target) => {\n    let element = target?.nodeType === 1 ? target : null;\n    for (let i = 0; element && i < 4; i += 1, element = element.parentElement) {\n      const url = parseCssUrls(window.getComputedStyle?.(element)?.backgroundImage || \"\")[0];\n      if (url) {\n        return {\n          element,\n          url,\n          title: getElementTitle(element),\n          width: Math.max(0, Math.round(Number(element.clientWidth || 0) || 0)),\n          height: Math.max(0, Math.round(Number(element.clientHeight || 0) || 0)),\n        };\n      }\n    }\n    return null;\n  };\n  const findImageSource = (target) => {\n    const image = findImageElement(target);\n    if (image) return { image, element: image, url: getImageUrl(image) };\n    return findBackgroundImageSource(target);\n  };\n  const findContextImageSource = (event) => {\n    const candidates = [];\n    try {\n      const pointElements = document.elementsFromPoint?.(\n        Number(event?.clientX || 0) || 0,\n        Number(event?.clientY || 0) || 0,\n      );\n      if (Array.isArray(pointElements)) candidates.push(...pointElements);\n    } catch {}\n    if (event?.target) candidates.push(event.target);\n    const seen = new Set();\n    for (const element of candidates) {\n      if (!element || seen.has(element)) continue;\n      seen.add(element);\n      const source = findImageSource(element);\n      if (source?.url) return source;\n    }\n    return null;\n  };\n  const buildImagePayload = (source) => {\n    const image = source?.image || null;\n    const element = source?.element || image || null;\n    const url = normalizeUrl(source?.url || getImageUrl(image));\n    if (!url) return null;\n    const title = getElementTitle(image || element, source?.title);\n    const pageUrl = normalizeUrl(location.href);\n    return {\n      kind: \"image\",\n      url,\n      title,\n      sourceUrl: pageUrl,\n      pageUrl,\n      nodeId: " + JSON["stringify"](toNodeId(nodeId)) + ",\n      tabId: " + JSON["stringify"](toTabId(tabId)) + ',\x0a\x20\x20\x20\x20\x20\x20width:\x20Math.max(0,\x20Math.round(Number(source?.width\x20||\x20image?.naturalWidth\x20||\x20image?.width\x20||\x20element?.clientWidth\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20height:\x20Math.max(0,\x20Math.round(Number(source?.height\x20||\x20image?.naturalHeight\x20||\x20image?.height\x20||\x20element?.clientHeight\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20};\x0a\x20\x20};\x0a\x20\x20const\x20emitImageContextMenuRequest\x20=\x20(payload,\x20event)\x20=>\x20{\x0a\x20\x20\x20\x20if\x20(!payload?.url\x20||\x20!INPUT_TOKEN)\x20return;\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20console.info(\x0a\x20\x20\x20\x20\x20\x20\x20\x20INPUT_PREFIX\x20+\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20JSON.stringify({\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20...payload,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20token:\x20INPUT_TOKEN,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20type:\x20\x22image-context-menu\x22,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contextX:\x20Math.max(0,\x20Math.round(Number(event?.clientX\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contextY:\x20Math.max(0,\x20Math.round(Number(event?.clientY\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}),\x0a\x20\x20\x20\x20\x20\x20);\x0a\x20\x20\x20\x20}\x20catch\x20{}\x0a\x20\x20};\x0a\x20\x20const\x20getSelectedText\x20=\x20()\x20=>\x20{\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20active\x20=\x20document.activeElement;\x0a\x20\x20\x20\x20\x20\x20if\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20active\x20&&\x0a\x20\x20\x20\x20\x20\x20\x20\x20typeof\x20active.value\x20===\x20\x22string\x22\x20&&\x0a\x20\x20\x20\x20\x20\x20\x20\x20Number.isFinite(active.selectionStart)\x20&&\x0a\x20\x20\x20\x20\x20\x20\x20\x20Number.isFinite(active.selectionEnd)\x20&&\x0a\x20\x20\x20\x20\x20\x20\x20\x20active.selectionEnd\x20>\x20active.selectionStart\x0a\x20\x20\x20\x20\x20\x20)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20String(active.value.slice(active.selectionStart,\x20active.selectionEnd)).trim();\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20return\x20String(window.getSelection?.()?.toString?.()\x20||\x20\x22\x22).trim();\x0a\x20\x20\x20\x20}\x20catch\x20{\x0a\x20\x20\x20\x20\x20\x20return\x20\x22\x22;\x0a\x20\x20\x20\x20}\x0a\x20\x20};\x0a\x20\x20const\x20stopContextMenuEvent\x20=\x20(event)\x20=>\x20{\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20Object.defineProperty(event,\x20\x22__AI_CANVAS_WEB_PREVIEW_CONTEXT_IMAGE_HANDLED__\x22,\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20value:\x20true,\x0a\x20\x20\x20\x20\x20\x20});\x0a\x20\x20\x20\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20try\x20{\x20event.preventDefault();\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20try\x20{\x20event.stopPropagation();\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20try\x20{\x20event.stopImmediatePropagation?.();\x20}\x20catch\x20{}\x0a\x20\x20};\x0a\x20\x20const\x20emitTextContextMenuRequest\x20=\x20(text,\x20event)\x20=>\x20{\x0a\x20\x20\x20\x20if\x20(!text\x20||\x20!INPUT_TOKEN)\x20return;\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20console.info(\x0a\x20\x20\x20\x20\x20\x20\x20\x20INPUT_PREFIX\x20+\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20JSON.stringify({\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20token:\x20INPUT_TOKEN,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20type:\x20\x22text-context-menu\x22,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20text,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20pageUrl:\x20normalizeUrl(location.href),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contextX:\x20Math.max(0,\x20Math.round(Number(event?.clientX\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contextY:\x20Math.max(0,\x20Math.round(Number(event?.clientY\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}),\x0a\x20\x20\x20\x20\x20\x20);\x0a\x20\x20\x20\x20}\x20catch\x20{}\x0a\x20\x20};\x0a\x20\x20if\x20(!window.__AI_CANVAS_WEB_PREVIEW_CONTEXT_IMAGE_BRIDGE__)\x20{\x0a\x20\x20\x20\x20Object.defineProperty(window,\x20\x22__AI_CANVAS_WEB_PREVIEW_CONTEXT_IMAGE_BRIDGE__\x22,\x20{\x0a\x20\x20\x20\x20\x20\x20value:\x20true,\x0a\x20\x20\x20\x20\x20\x20configurable:\x20false,\x0a\x20\x20\x20\x20});\x0a\x20\x20\x20\x20const\x20handleContextImageMenu\x20=\x20(event)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20if\x20(event.__AI_CANVAS_WEB_PREVIEW_CONTEXT_IMAGE_HANDLED__)\x20return;\x0a\x20\x20\x20\x20\x20\x20const\x20selectedText\x20=\x20getSelectedText();\x0a\x20\x20\x20\x20\x20\x20if\x20(selectedText\x20&&\x20INPUT_TOKEN)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20window.__AI_CANVAS_WEB_PREVIEW_LAST_CONTEXT_IMAGE__\x20=\x20null;\x0a\x20\x20\x20\x20\x20\x20\x20\x20stopContextMenuEvent(event);\x0a\x20\x20\x20\x20\x20\x20\x20\x20emitTextContextMenuRequest(selectedText,\x20event);\x0a\x20\x20\x20\x20\x20\x20\x20\x20return;\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20const\x20payload\x20=\x20buildImagePayload(findContextImageSource(event));\x0a\x20\x20\x20\x20\x20\x20window.__AI_CANVAS_WEB_PREVIEW_LAST_CONTEXT_IMAGE__\x20=\x20payload\x0a\x20\x20\x20\x20\x20\x20\x20\x20?\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20...payload,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contextX:\x20Math.max(0,\x20Math.round(Number(event.clientX\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20contextY:\x20Math.max(0,\x20Math.round(Number(event.clientY\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20capturedAt:\x20Date.now(),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20:\x20null;\x0a\x20\x20\x20\x20\x20\x20if\x20(!payload?.url)\x20return;\x0a\x20\x20\x20\x20\x20\x20stopContextMenuEvent(event);\x0a\x20\x20\x20\x20\x20\x20emitImageContextMenuRequest(payload,\x20event);\x0a\x20\x20\x20\x20};\x0a\x20\x20\x20\x20window.addEventListener(\x22contextmenu\x22,\x20handleContextImageMenu,\x20true);\x0a\x20\x20\x20\x20document.addEventListener(\x22contextmenu\x22,\x20handleContextImageMenu,\x20true);\x0a\x20\x20}\x0a\x20\x20if\x20(!hasDragBridge)\x20{\x0a\x20\x20\x20\x20document.addEventListener(\x22dragstart\x22,\x20(event)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20payloadObject\x20=\x20buildImagePayload(findImageSource(event.target));\x0a\x20\x20\x20\x20\x20\x20const\x20url\x20=\x20payloadObject?.url\x20||\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20if\x20(!url\x20||\x20!event.dataTransfer)\x20return;\x0a\x20\x20\x20\x20\x20\x20const\x20title\x20=\x20payloadObject.title\x20||\x20\x22网页图片\x22;\x0a\x20\x20\x20\x20\x20\x20const\x20payload\x20=\x20JSON.stringify(payloadObject);\x0a\x20\x20\x20\x20\x20\x20try\x20{\x20event.dataTransfer.setData(MIME,\x20payload);\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20\x20\x20try\x20{\x20event.dataTransfer.setData(\x22text/uri-list\x22,\x20url);\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20\x20\x20try\x20{\x20event.dataTransfer.setData(\x22text/plain\x22,\x20url);\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20event.dataTransfer.setData(\x22text/html\x22,\x20\x27<img\x20src=\x22\x27\x20+\x20escapeHtml(url)\x20+\x20\x27\x22\x20alt=\x22\x27\x20+\x20escapeHtml(title)\x20+\x20\x27\x22>\x27);\x0a\x20\x20\x20\x20\x20\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20\x20\x20event.dataTransfer.effectAllowed\x20=\x20\x22copy\x22;\x0a\x20\x20\x20\x20},\x20true);\x0a\x20\x20}\x0a\x20\x20if\x20(!window.__AI_CANVAS_WEB_PREVIEW_INPUT_BRIDGE__\x20&&\x20INPUT_TOKEN)\x20{\x0a\x20\x20\x20\x20Object.defineProperty(window,\x20\x22__AI_CANVAS_WEB_PREVIEW_INPUT_BRIDGE__\x22,\x20{\x0a\x20\x20\x20\x20\x20\x20value:\x20true,\x0a\x20\x20\x20\x20\x20\x20configurable:\x20false,\x0a\x20\x20\x20\x20});\x0a\x20\x20\x20\x20let\x20spaceHeld\x20=\x20false;\x0a\x20\x20\x20\x20let\x20lastPanStartAt\x20=\x200;\x0a\x20\x20\x20\x20let\x20lastPanStartButton\x20=\x20-1;\x0a\x20\x20\x20\x20const\x20isSpaceKey\x20=\x20(event)\x20=>\x0a\x20\x20\x20\x20\x20\x20event?.code\x20===\x20\x22Space\x22\x20||\x0a\x20\x20\x20\x20\x20\x20event?.key\x20===\x20\x22\x20\x22\x20||\x0a\x20\x20\x20\x20\x20\x20event?.key\x20===\x20\x22Spacebar\x22\x20||\x0a\x20\x20\x20\x20\x20\x20event?.key\x20===\x20\x22Space\x22;\x0a\x20\x20\x20\x20const\x20setSpaceHeld\x20=\x20(held)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20spaceHeld\x20=\x20held\x20===\x20true;\x0a\x20\x20\x20\x20};\x0a\x20\x20\x20\x20document.addEventListener(\x22keydown\x22,\x20(event)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20if\x20(isSpaceKey(event))\x20setSpaceHeld(true);\x0a\x20\x20\x20\x20},\x20true);\x0a\x20\x20\x20\x20document.addEventListener(\x22keyup\x22,\x20(event)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20if\x20(isSpaceKey(event))\x20setSpaceHeld(false);\x0a\x20\x20\x20\x20},\x20true);\x0a\x20\x20\x20\x20window.addEventListener(\x22blur\x22,\x20()\x20=>\x20setSpaceHeld(false),\x20true);\x0a\x20\x20\x20\x20const\x20emitPanStartPreview\x20=\x20(event)\x20=>\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20button\x20=\x20Number(event?.button);\x0a\x20\x20\x20\x20\x20\x20const\x20isMiddle\x20=\x20button\x20===\x201;\x0a\x20\x20\x20\x20\x20\x20const\x20isLeft\x20=\x20button\x20===\x200;\x0a\x20\x20\x20\x20\x20\x20if\x20(!isMiddle\x20&&\x20!isLeft)\x20return;\x0a\x20\x20\x20\x20\x20\x20const\x20now\x20=\x20Date.now();\x0a\x20\x20\x20\x20\x20\x20if\x20(button\x20===\x20lastPanStartButton\x20&&\x20now\x20-\x20lastPanStartAt\x20<\x2032)\x20return;\x0a\x20\x20\x20\x20\x20\x20lastPanStartAt\x20=\x20now;\x0a\x20\x20\x20\x20\x20\x20lastPanStartButton\x20=\x20button;\x0a\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20console.info(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20INPUT_PREFIX\x20+\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20JSON.stringify({\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20token:\x20INPUT_TOKEN,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20type:\x20\x22pan-start-preview\x22,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20button,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20spaceHeld:\x20isLeft\x20&&\x20spaceHeld\x20===\x20true,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20buttons:\x20Number(event?.buttons\x20||\x200)\x20||\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clientX:\x20Math.max(0,\x20Math.round(Number(event?.clientX\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20clientY:\x20Math.max(0,\x20Math.round(Number(event?.clientY\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}),\x0a\x20\x20\x20\x20\x20\x20\x20\x20);\x0a\x20\x20\x20\x20\x20\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20};\x0a\x20\x20\x20\x20window.addEventListener(\x22pointerdown\x22,\x20emitPanStartPreview,\x20true);\x0a\x20\x20\x20\x20window.addEventListener(\x22mousedown\x22,\x20emitPanStartPreview,\x20true);\x0a\x20\x20\x20\x20document.addEventListener(\x22pointerdown\x22,\x20emitPanStartPreview,\x20true);\x0a\x20\x20\x20\x20document.addEventListener(\x22mousedown\x22,\x20emitPanStartPreview,\x20true);\x0a\x20\x20}\x0a\x20\x20return\x20true;\x0a})()\x0a';
}
function buildWebPreviewContextImageProbeScript({
  nodeId = '',
  tabId = '',
  x = 0x0,
  y = 0x0
} = {}) {
  const _0x53b190 = Math['max'](0x0, Math["round"](Number(x || 0x0) || 0x0));
  const _0x14fbaa = Math['max'](0x0, Math["round"](Number(y || 0x0) || 0x0));
  return "\n(() => {\n  const nodeId = " + JSON["stringify"](toNodeId(nodeId)) + ";\n  const tabId = " + JSON['stringify'](toTabId(tabId)) + ';\x0a\x20\x20const\x20contextX\x20=\x20' + _0x53b190 + ";\n  const contextY = " + _0x14fbaa + ';\x0a\x20\x20const\x20normalizeUrl\x20=\x20(value)\x20=>\x20{\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20url\x20=\x20new\x20URL(String(value\x20||\x20\x22\x22),\x20document.baseURI);\x0a\x20\x20\x20\x20\x20\x20if\x20(url.protocol\x20!==\x20\x22http:\x22\x20&&\x20url.protocol\x20!==\x20\x22https:\x22)\x20return\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20url.username\x20=\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20url.password\x20=\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20return\x20url.href;\x0a\x20\x20\x20\x20}\x20catch\x20{\x0a\x20\x20\x20\x20\x20\x20return\x20\x22\x22;\x0a\x20\x20\x20\x20}\x0a\x20\x20};\x0a\x20\x20const\x20pageUrl\x20=\x20normalizeUrl(location.href);\x0a\x20\x20const\x20pageTitle\x20=\x20String(document.title\x20||\x20\x22\x22).slice(0,\x20160);\x0a\x20\x20const\x20parseSrcset\x20=\x20(value)\x20=>\x20String(value\x20||\x20\x22\x22)\x0a\x20\x20\x20\x20.split(\x22,\x22)\x0a\x20\x20\x20\x20.map((item)\x20=>\x20normalizeUrl(item.trim().split(/\x5cs+/)[0]\x20||\x20\x22\x22))\x0a\x20\x20\x20\x20.filter(Boolean);\x0a\x20\x20const\x20parseCssUrls\x20=\x20(value)\x20=>\x20{\x0a\x20\x20\x20\x20const\x20urls\x20=\x20[];\x0a\x20\x20\x20\x20const\x20text\x20=\x20String(value\x20||\x20\x22\x22);\x0a\x20\x20\x20\x20const\x20re\x20=\x20/url\x5c(([\x22\x27]?)(.*?)\x5c1\x5c)/g;\x0a\x20\x20\x20\x20let\x20match\x20=\x20null;\x0a\x20\x20\x20\x20while\x20((match\x20=\x20re.exec(text)))\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20url\x20=\x20normalizeUrl(match[2]\x20||\x20\x22\x22);\x0a\x20\x20\x20\x20\x20\x20if\x20(url)\x20urls.push(url);\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20return\x20urls;\x0a\x20\x20};\x0a\x20\x20const\x20getImageUrl\x20=\x20(image)\x20=>\x20normalizeUrl(\x0a\x20\x20\x20\x20image?.currentSrc\x20||\x0a\x20\x20\x20\x20\x20\x20image?.src\x20||\x0a\x20\x20\x20\x20\x20\x20image?.getAttribute?.(\x22src\x22)\x20||\x0a\x20\x20\x20\x20\x20\x20image?.dataset?.src\x20||\x0a\x20\x20\x20\x20\x20\x20image?.dataset?.original\x20||\x0a\x20\x20\x20\x20\x20\x20image?.dataset?.lazySrc\x20||\x0a\x20\x20\x20\x20\x20\x20parseSrcset(image?.srcset\x20||\x20image?.getAttribute?.(\x22srcset\x22)\x20||\x20\x22\x22)[0]\x20||\x0a\x20\x20\x20\x20\x20\x20\x22\x22,\x0a\x20\x20);\x0a\x20\x20const\x20getElementTitle\x20=\x20(element,\x20fallback\x20=\x20\x22\x22)\x20=>\x0a\x20\x20\x20\x20String(\x0a\x20\x20\x20\x20\x20\x20element?.alt\x20||\x0a\x20\x20\x20\x20\x20\x20\x20\x20element?.title\x20||\x0a\x20\x20\x20\x20\x20\x20\x20\x20element?.getAttribute?.(\x22aria-label\x22)\x20||\x0a\x20\x20\x20\x20\x20\x20\x20\x20fallback\x20||\x0a\x20\x20\x20\x20\x20\x20\x20\x20pageTitle\x20||\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x22网页图片\x22,\x0a\x20\x20\x20\x20).slice(0,\x20160);\x0a\x20\x20const\x20findImageElement\x20=\x20(target)\x20=>\x20{\x0a\x20\x20\x20\x20if\x20(!target?.closest)\x20return\x20null;\x0a\x20\x20\x20\x20return\x20(\x0a\x20\x20\x20\x20\x20\x20target.closest(\x22img\x22)\x20||\x0a\x20\x20\x20\x20\x20\x20target.closest(\x22picture\x22)?.querySelector?.(\x22img\x22)\x20||\x0a\x20\x20\x20\x20\x20\x20target.querySelector?.(\x22img,\x20picture\x20img\x22)\x20||\x0a\x20\x20\x20\x20\x20\x20null\x0a\x20\x20\x20\x20);\x0a\x20\x20};\x0a\x20\x20const\x20findBackgroundImageSource\x20=\x20(target)\x20=>\x20{\x0a\x20\x20\x20\x20let\x20element\x20=\x20target?.nodeType\x20===\x201\x20?\x20target\x20:\x20null;\x0a\x20\x20\x20\x20for\x20(let\x20i\x20=\x200;\x20element\x20&&\x20i\x20<\x204;\x20i\x20+=\x201,\x20element\x20=\x20element.parentElement)\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20url\x20=\x20parseCssUrls(window.getComputedStyle?.(element)?.backgroundImage\x20||\x20\x22\x22)[0];\x0a\x20\x20\x20\x20\x20\x20if\x20(url)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20element,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20url,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20title:\x20getElementTitle(element),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20width:\x20Math.max(0,\x20Math.round(Number(element.clientWidth\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20height:\x20Math.max(0,\x20Math.round(Number(element.clientHeight\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20\x20\x20};\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20return\x20null;\x0a\x20\x20};\x0a\x20\x20const\x20findImageSource\x20=\x20(target)\x20=>\x20{\x0a\x20\x20\x20\x20const\x20image\x20=\x20findImageElement(target);\x0a\x20\x20\x20\x20if\x20(image)\x20return\x20{\x20image,\x20element:\x20image,\x20url:\x20getImageUrl(image)\x20};\x0a\x20\x20\x20\x20return\x20findBackgroundImageSource(target);\x0a\x20\x20};\x0a\x20\x20const\x20findContextImageSource\x20=\x20()\x20=>\x20{\x0a\x20\x20\x20\x20const\x20candidates\x20=\x20[];\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20pointElements\x20=\x20document.elementsFromPoint?.(contextX,\x20contextY);\x0a\x20\x20\x20\x20\x20\x20if\x20(Array.isArray(pointElements))\x20candidates.push(...pointElements);\x0a\x20\x20\x20\x20}\x20catch\x20{}\x0a\x20\x20\x20\x20const\x20seen\x20=\x20new\x20Set();\x0a\x20\x20\x20\x20for\x20(const\x20element\x20of\x20candidates)\x20{\x0a\x20\x20\x20\x20\x20\x20if\x20(!element\x20||\x20seen.has(element))\x20continue;\x0a\x20\x20\x20\x20\x20\x20seen.add(element);\x0a\x20\x20\x20\x20\x20\x20const\x20source\x20=\x20findImageSource(element);\x0a\x20\x20\x20\x20\x20\x20if\x20(source?.url)\x20return\x20source;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20return\x20null;\x0a\x20\x20};\x0a\x20\x20const\x20buildImagePayload\x20=\x20(source)\x20=>\x20{\x0a\x20\x20\x20\x20const\x20image\x20=\x20source?.image\x20||\x20null;\x0a\x20\x20\x20\x20const\x20element\x20=\x20source?.element\x20||\x20image\x20||\x20null;\x0a\x20\x20\x20\x20const\x20url\x20=\x20normalizeUrl(source?.url\x20||\x20getImageUrl(image));\x0a\x20\x20\x20\x20if\x20(!url)\x20return\x20null;\x0a\x20\x20\x20\x20return\x20{\x0a\x20\x20\x20\x20\x20\x20kind:\x20\x22image\x22,\x0a\x20\x20\x20\x20\x20\x20url,\x0a\x20\x20\x20\x20\x20\x20title:\x20getElementTitle(image\x20||\x20element,\x20source?.title),\x0a\x20\x20\x20\x20\x20\x20alt:\x20String(image?.alt\x20||\x20\x22\x22).slice(0,\x20160),\x0a\x20\x20\x20\x20\x20\x20pageUrl,\x0a\x20\x20\x20\x20\x20\x20pageTitle,\x0a\x20\x20\x20\x20\x20\x20nodeId,\x0a\x20\x20\x20\x20\x20\x20tabId,\x0a\x20\x20\x20\x20\x20\x20contextX,\x0a\x20\x20\x20\x20\x20\x20contextY,\x0a\x20\x20\x20\x20\x20\x20width:\x20Math.max(0,\x20Math.round(Number(source?.width\x20||\x20image?.naturalWidth\x20||\x20image?.width\x20||\x20element?.clientWidth\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20\x20\x20height:\x20Math.max(0,\x20Math.round(Number(source?.height\x20||\x20image?.naturalHeight\x20||\x20image?.height\x20||\x20element?.clientHeight\x20||\x200)\x20||\x200)),\x0a\x20\x20\x20\x20};\x0a\x20\x20};\x0a\x20\x20const\x20stored\x20=\x20window.__AI_CANVAS_WEB_PREVIEW_LAST_CONTEXT_IMAGE__;\x0a\x20\x20if\x20(stored?.url)\x20{\x0a\x20\x20\x20\x20return\x20{\x0a\x20\x20\x20\x20\x20\x20ok:\x20true,\x0a\x20\x20\x20\x20\x20\x20image:\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20...stored,\x0a\x20\x20\x20\x20\x20\x20\x20\x20pageTitle:\x20String(stored.pageTitle\x20||\x20pageTitle\x20||\x20\x22\x22).slice(0,\x20160),\x0a\x20\x20\x20\x20\x20\x20\x20\x20contextX,\x0a\x20\x20\x20\x20\x20\x20\x20\x20contextY,\x0a\x20\x20\x20\x20\x20\x20},\x0a\x20\x20\x20\x20\x20\x20pageUrl,\x0a\x20\x20\x20\x20\x20\x20pageTitle,\x0a\x20\x20\x20\x20};\x0a\x20\x20}\x0a\x20\x20const\x20payload\x20=\x20buildImagePayload(findContextImageSource());\x0a\x20\x20return\x20{\x20ok:\x20!!payload,\x20image:\x20payload,\x20pageUrl,\x20pageTitle\x20};\x0a})()\x0a';
}
function buildWebPreviewImageExtractionScript({
  nodeId = '',
  tabId = ''
} = {}) {
  return "\n(() => {\n  const MAX = " + WEB_PREVIEW_IMAGE_EXTRACTION_LIMIT + ";\n  const MIN_WIDTH = " + WEB_PREVIEW_EXTRACT_MIN_IMAGE_WIDTH + ";\n  const MIN_HEIGHT = " + WEB_PREVIEW_EXTRACT_MIN_IMAGE_HEIGHT + ";\n  const MIN_AREA = " + WEB_PREVIEW_EXTRACT_MIN_IMAGE_AREA + ";\n  const nodeId = " + JSON["stringify"](toNodeId(nodeId)) + ";\n  const tabId = " + JSON["stringify"](toTabId(tabId)) + ";\n  const normalizeUrl = (value) => {\n    try {\n      const url = new URL(String(value || \"\"), document.baseURI);\n      if (url.protocol !== \"http:\" && url.protocol !== \"https:\") return \"\";\n      url.username = \"\";\n      url.password = \"\";\n      return url.href;\n    } catch {\n      return \"\";\n    }\n  };\n  const parseSrcset = (value) => String(value || \"\")\n    .split(\",\")\n    .map((item) => normalizeUrl(item.trim().split(/\\s+/)[0] || \"\"))\n    .filter(Boolean);\n  const parseCssUrls = (value) => {\n    const urls = [];\n    const text = String(value || \"\");\n    const re = /url\\(([\"']?)(.*?)\\1\\)/g;\n    let match = null;\n    while ((match = re.exec(text))) {\n      const url = normalizeUrl(match[2]);\n      if (url) urls.push(url);\n    }\n    return urls;\n  };\n  const pageUrl = normalizeUrl(location.href);\n  const pageTitle = String(document.title || \"\").slice(0, 160);\n  const seen = new Set();\n  const images = [];\n  const hasExtractableSize = (width, height) => {\n    const safeWidth = Math.max(0, Math.round(Number(width || 0) || 0));\n    const safeHeight = Math.max(0, Math.round(Number(height || 0) || 0));\n    if (!safeWidth || !safeHeight) return true;\n    return safeWidth >= MIN_WIDTH && safeHeight >= MIN_HEIGHT && safeWidth * safeHeight >= MIN_AREA;\n  };\n  const push = (url, source = {}) => {\n    const normalizedUrl = normalizeUrl(url);\n    const width = Math.max(0, Math.round(Number(source.width || 0) || 0));\n    const height = Math.max(0, Math.round(Number(source.height || 0) || 0));\n    if (!normalizedUrl || !hasExtractableSize(width, height) || seen.has(normalizedUrl) || images.length >= MAX) return;\n    seen.add(normalizedUrl);\n    images.push({\n      url: normalizedUrl,\n      title: String(source.title || pageTitle || \"网页图片\").slice(0, 160),\n      alt: String(source.alt || \"\").slice(0, 160),\n      width,\n      height,\n      pageUrl,\n      pageTitle,\n      nodeId,\n      tabId,\n    });\n  };\n  for (const img of Array.from(document.images || [])) {\n    if (images.length >= MAX) break;\n    const title = img.alt || img.title || img.getAttribute(\"aria-label\") || pageTitle || \"网页图片\";\n    const source = {\n      title,\n      alt: img.alt || \"\",\n      width: img.naturalWidth || img.width || img.clientWidth || 0,\n      height: img.naturalHeight || img.height || img.clientHeight || 0,\n    };\n    push(img.currentSrc || img.src || img.getAttribute(\"src\") || img.dataset?.src || \"\", source);\n    for (const url of parseSrcset(img.srcset || img.getAttribute(\"srcset\") || \"\")) push(url, source);\n    const picture = img.closest?.(\"picture\");\n    for (const sourceEl of Array.from(picture?.querySelectorAll?.(\"source[srcset]\") || [])) {\n      for (const url of parseSrcset(sourceEl.getAttribute(\"srcset\") || \"\")) push(url, source);\n    }\n  }\n  for (const el of Array.from(document.querySelectorAll(\"body *\"))) {\n    if (images.length >= MAX) break;\n    let backgroundImage = \"\";\n    try {\n      backgroundImage = getComputedStyle(el).backgroundImage;\n    } catch {}\n    for (const url of parseCssUrls(backgroundImage)) {\n      if (images.length >= MAX) break;\n      push(url, {\n        title: el.getAttribute?.(\"aria-label\") || el.getAttribute?.(\"title\") || pageTitle || \"网页图片\",\n        width: el.clientWidth || 0,\n        height: el.clientHeight || 0,\n      });\n    }\n  }\n  return { ok: true, images, pageUrl, pageTitle };\n})()\n";
}
function buildWebPreviewVideoExtractionScript({
  nodeId = '',
  tabId = ''
} = {}) {
  return '\x0a(()\x20=>\x20{\x0a\x20\x20const\x20MAX\x20=\x20' + WEB_PREVIEW_VIDEO_EXTRACTION_LIMIT + ";\n  const DIRECT_VIDEO_RE = " + WEB_PREVIEW_DIRECT_VIDEO_EXTENSION_RE + ';\x0a\x20\x20const\x20STREAM_MEDIA_RE\x20=\x20' + WEB_PREVIEW_STREAM_MEDIA_EXTENSION_RE + ';\x0a\x20\x20const\x20nodeId\x20=\x20' + JSON["stringify"](toNodeId(nodeId)) + ";\n  const tabId = " + JSON["stringify"](toTabId(tabId)) + ";\n  const normalizeUrl = (value) => {\n    try {\n      const url = new URL(String(value || \"\"), document.baseURI);\n      if (url.protocol !== \"http:\" && url.protocol !== \"https:\") return \"\";\n      url.username = \"\";\n      url.password = \"\";\n      return url.href;\n    } catch {\n      return \"\";\n    }\n  };\n  const isDirectVideoUrl = (value) => {\n    try {\n      return DIRECT_VIDEO_RE.test(new URL(value).pathname);\n    } catch {\n      return false;\n    }\n  };\n  const isStreamMediaUrl = (value) => {\n    try {\n      return STREAM_MEDIA_RE.test(new URL(value).pathname);\n    } catch {\n      return false;\n    }\n  };\n  const pageUrl = normalizeUrl(location.href);\n  const pageTitle = String(document.title || \"\").slice(0, 160);\n  const seen = new Set();\n  const videos = [];\n  const douyinDetailApiUrls = [];\n  const douyinDetailApiSeen = new Set();\n  const DOUYIN_DETAIL_API_RE = /\\/aweme\\/v1\\/web\\/aweme\\/detail\\//i;\n  const pushDouyinDetailApiUrl = (value) => {\n    const normalizedUrl = normalizeUrl(value);\n    if (!normalizedUrl || douyinDetailApiSeen.has(normalizedUrl)) return;\n    try {\n      const parsed = new URL(normalizedUrl);\n      const host = parsed.hostname.toLowerCase();\n      const isDouyinHost =\n        host === \"douyin.com\" ||\n        host.endsWith(\".douyin.com\") ||\n        host === \"iesdouyin.com\" ||\n        host.endsWith(\".iesdouyin.com\");\n      if (!isDouyinHost || !DOUYIN_DETAIL_API_RE.test(parsed.pathname)) return;\n      if (!/\\d{15,25}/.test(parsed.searchParams.get(\"aweme_id\") || \"\")) return;\n    } catch {\n      return;\n    }\n    douyinDetailApiSeen.add(normalizedUrl);\n    douyinDetailApiUrls.push(normalizedUrl);\n  };\n  const finiteNumber = (value) => {\n    const n = Number(value);\n    return Number.isFinite(n) && n > 0 ? n : 0;\n  };\n  const push = (url, source = {}) => {\n    const normalizedUrl = normalizeUrl(url);\n    if (!normalizedUrl || seen.has(normalizedUrl) || videos.length >= MAX) return;\n    if (isStreamMediaUrl(normalizedUrl)) return;\n    const type = String(source.type || \"\").trim().toLowerCase();\n    const recognizable = Boolean(\n      source.fromVideo ||\n        type.startsWith(\"video/\") ||\n        isDirectVideoUrl(normalizedUrl),\n    );\n    if (!recognizable) return;\n    seen.add(normalizedUrl);\n    videos.push({\n      kind: \"video\",\n      url: normalizedUrl,\n      title: String(source.title || pageTitle || \"网页视频\").slice(0, 160),\n      pageUrl,\n      pageTitle,\n      nodeId,\n      tabId,\n      width: Math.max(0, Math.round(finiteNumber(source.width))),\n      height: Math.max(0, Math.round(finiteNumber(source.height))),\n      duration: finiteNumber(source.duration),\n      sourceType: String(source.sourceType || \"media\").slice(0, 40),\n      mimeType: type,\n    });\n  };\n  for (const video of Array.from(document.querySelectorAll(\"video\"))) {\n    if (videos.length >= MAX) break;\n    const title =\n      video.getAttribute(\"aria-label\") ||\n      video.getAttribute(\"title\") ||\n      video.getAttribute(\"alt\") ||\n      pageTitle ||\n      \"网页视频\";\n    const source = {\n      fromVideo: true,\n      sourceType: \"video\",\n      title,\n      width: video.videoWidth || video.clientWidth || 0,\n      height: video.videoHeight || video.clientHeight || 0,\n      duration: video.duration,\n    };\n    push(video.currentSrc || video.src || video.getAttribute(\"src\") || \"\", source);\n    for (const sourceEl of Array.from(video.querySelectorAll(\"source[src]\"))) {\n      push(sourceEl.getAttribute(\"src\") || \"\", {\n        ...source,\n        type: sourceEl.getAttribute(\"type\") || \"\",\n        sourceType: \"video-source\",\n      });\n    }\n  }\n  for (const sourceEl of Array.from(document.querySelectorAll(\"source[src]\"))) {\n    if (videos.length >= MAX) break;\n    const type = sourceEl.getAttribute(\"type\") || \"\";\n    if (!String(type).toLowerCase().startsWith(\"video/\")) continue;\n    const media = sourceEl.closest?.(\"video\");\n    push(sourceEl.getAttribute(\"src\") || \"\", {\n      fromVideo: true,\n      type,\n      sourceType: \"source\",\n      title: media?.getAttribute?.(\"title\") || pageTitle || \"网页视频\",\n      width: media?.videoWidth || media?.clientWidth || 0,\n      height: media?.videoHeight || media?.clientHeight || 0,\n      duration: media?.duration,\n    });\n  }\n  for (const link of Array.from(document.querySelectorAll(\"a[href]\"))) {\n    if (videos.length >= MAX) break;\n    const href = link.getAttribute(\"href\") || \"\";\n    const normalizedUrl = normalizeUrl(href);\n    if (!normalizedUrl || !isDirectVideoUrl(normalizedUrl) || isStreamMediaUrl(normalizedUrl)) continue;\n    push(normalizedUrl, {\n      sourceType: \"link\",\n      title: link.textContent?.trim() || link.getAttribute(\"title\") || pageTitle || \"网页视频\",\n    });\n  }\n  for (const el of Array.from(document.querySelectorAll(\"[data-src], [data-url], [data-video-src]\"))) {\n    if (videos.length >= MAX) break;\n    const candidates = [\n      el.getAttribute(\"data-video-src\"),\n      el.getAttribute(\"data-play-url\"),\n      el.getAttribute(\"data-video-url\"),\n      el.getAttribute(\"data-src\"),\n      el.getAttribute(\"data-url\"),\n    ];\n    for (const candidate of candidates) {\n      if (videos.length >= MAX) break;\n      const normalizedUrl = normalizeUrl(candidate);\n      if (!normalizedUrl || !isDirectVideoUrl(normalizedUrl) || isStreamMediaUrl(normalizedUrl)) continue;\n      push(normalizedUrl, {\n        sourceType: \"data-attribute\",\n        title: el.getAttribute(\"aria-label\") || el.getAttribute(\"title\") || pageTitle || \"网页视频\",\n        width: el.clientWidth || 0,\n        height: el.clientHeight || 0,\n      });\n    }\n  }\n  for (const resource of Array.from(performance?.getEntriesByType?.(\"resource\") || [])) {\n    if (videos.length >= MAX) break;\n    const normalizedUrl = normalizeUrl(resource?.name);\n    if (!normalizedUrl || isStreamMediaUrl(normalizedUrl)) continue;\n    pushDouyinDetailApiUrl(normalizedUrl);\n    const initiatorType = String(resource?.initiatorType || \"\").trim().toLowerCase();\n    const fromMediaResource =\n      initiatorType === \"video\" ||\n      initiatorType === \"media\" ||\n      initiatorType === \"source\";\n    if (!fromMediaResource && !isDirectVideoUrl(normalizedUrl)) continue;\n    push(normalizedUrl, {\n      fromVideo: fromMediaResource,\n      sourceType: \"video-resource\",\n      title: pageTitle || \"网页视频\",\n    });\n  }\n  const normalizeEmbeddedUrl = (value) =>\n    normalizeUrl(\n      String(value || \"\")\n        .replace(/\\\\u002[fF]/g, \"/\")\n        .replace(/\\\\\\//g, \"/\"),\n    );\n  const embeddedUrlRe = /https?:\\\\?\\/\\\\?\\/[^\"'\\s<>]+/g;\n  for (const script of Array.from(document.scripts || [])) {\n    if (videos.length >= MAX) break;\n    const text = String(script.textContent || \"\").slice(0, 400000);\n    let match = null;\n    while ((match = embeddedUrlRe.exec(text))) {\n      if (videos.length >= MAX) break;\n      const normalizedUrl = normalizeEmbeddedUrl(match[0]);\n      pushDouyinDetailApiUrl(normalizedUrl);\n      if (!normalizedUrl || !isDirectVideoUrl(normalizedUrl) || isStreamMediaUrl(normalizedUrl)) continue;\n      push(normalizedUrl, {\n        sourceType: \"embedded-url\",\n        title: pageTitle || \"网页视频\",\n      });\n    }\n  }\n  const STRUCTURED_VIDEO_SOURCE_TYPE = \"structured-data\";\n  const DOUYIN_DETAIL_SOURCE_TYPE = \"douyin-detail\";\n  const STRUCTURED_VIDEO_KEY_RE =\n    /(?:video|play|download|stream|dash|media|aweme|xigua|note|vod|mp4|h264|h265|hevc|url[_-]?list|backup[_-]?urls|masterurl|baseurl|playurl|downloadurl)/i;\n  const STRUCTURED_URL_KEY_RE =\n    /^(?:url|uri|src|source|playurl|play_url|playaddr|play_addr|downloadurl|download_url|downloadaddr|download_addr|masterurl|master_url|baseurl|base_url|mainurl|main_url|file|contenturl)$/i;\n  const NON_VIDEO_ASSET_RE = /.(?:png|jpe?g|webp|gif|bmp|svg|avif|css|js)(?:[?#].*)?$/i;\n  const KNOWN_STATE_KEYS = [\n    \"__INITIAL_STATE__\",\n    \"__NEXT_DATA__\",\n    \"__NUXT__\",\n    \"__APOLLO_STATE__\",\n    \"__INITIAL_PROPS__\",\n    \"RENDER_DATA\",\n    \"SIGI_STATE\",\n    \"SSR_RENDER_DATA\",\n  ];\n  const unescapeStructuredUrlText = (value) =>\n    String(value || \"\")\n      .replace(/\\\\u002[fF]/g, \"/\")\n      .replace(/\\\\u0026/g, \"&\")\n      .replace(/\\\\u003[dD]/g, \"=\")\n      .replace(/\\\\\\//g, \"/\")\n      .replace(/&amp;/g, \"&\");\n  const extractUrlsFromText = (value) => {\n    const text = unescapeStructuredUrlText(value).trim();\n    if (!text) return [];\n    const urls = [];\n    const direct = normalizeUrl(text);\n    if (direct) urls.push(direct);\n    const urlRe = /https?:\\/\\/[^\"'\\s<>]+/g;\n    let match = null;\n    while ((match = urlRe.exec(text))) {\n      const url = normalizeUrl(match[0]);\n      if (url) urls.push(url);\n    }\n    return Array.from(new Set(urls));\n  };\n  const isNonVideoAssetUrl = (value) => {\n    try {\n      return NON_VIDEO_ASSET_RE.test(new URL(value).pathname);\n    } catch {\n      return false;\n    }\n  };\n  const hasStructuredVideoContext = (path = []) =>\n    path.some((key) => STRUCTURED_VIDEO_KEY_RE.test(String(key || \"\")));\n  const readStructuredNumber = (object, keys) => {\n    if (!object || typeof object !== \"object\") return 0;\n    for (const key of keys) {\n      const value = finiteNumber(object[key]);\n      if (value) return value;\n    }\n    return 0;\n  };\n  const normalizeDouyinDuration = (value) => {\n    const duration = finiteNumber(value);\n    if (!duration) return 0;\n    return duration >= 1000 ? duration / 1000 : duration;\n  };\n  const pickLastStructuredUrl = (items) => {\n    const urls = [];\n    const list = Array.isArray(items) ? items : [items];\n    for (const item of list) {\n      urls.push(...extractUrlsFromText(item));\n    }\n    return urls.filter(Boolean).at(-1) || \"\";\n  };\n  const readDouyinAddressUrl = (address) => {\n    if (!address) return \"\";\n    if (typeof address === \"string\") return pickLastStructuredUrl(address);\n    if (typeof address !== \"object\") return \"\";\n    const urlList = Array.isArray(address.url_list)\n      ? address.url_list\n      : Array.isArray(address.urlList)\n        ? address.urlList\n        : [];\n    return (\n      pickLastStructuredUrl(urlList) ||\n      pickLastStructuredUrl(address.url) ||\n      pickLastStructuredUrl(address.uri) ||\n      pickLastStructuredUrl(address.main_url) ||\n      pickLastStructuredUrl(address.mainUrl)\n    );\n  };\n  const hasDouyinVideoAddress = (video) =>\n    Boolean(\n      video &&\n        typeof video === \"object\" &&\n        (video.play_addr_h264 || video.play_addr_256 || video.play_addr || video.download_addr),\n    );\n  const readDouyinVideoUrl = (video) => {\n    if (!hasDouyinVideoAddress(video)) return \"\";\n    const sources = [video.play_addr_h264, video.play_addr_256, video.play_addr, video.download_addr];\n    for (const source of sources) {\n      const url = readDouyinAddressUrl(source);\n      if (url) return url;\n    }\n    return \"\";\n  };\n  const readDouyinTitle = (aweme) =>\n    String(\n      aweme?.desc ||\n        aweme?.item_title ||\n        aweme?.share_info?.share_title ||\n        pageTitle ||\n        \"网页视频\",\n    )\n      .trim()\n      .slice(0, 160);\n  const pushDouyinAwemeDetail = (aweme) => {\n    if (!aweme || typeof aweme !== \"object\" || !hasDouyinVideoAddress(aweme.video)) return;\n    const url = readDouyinVideoUrl(aweme.video);\n    if (!url || isStreamMediaUrl(url) || isNonVideoAssetUrl(url)) return;\n    push(url, {\n      fromVideo: true,\n      sourceType: DOUYIN_DETAIL_SOURCE_TYPE,\n      title: readDouyinTitle(aweme),\n      width: readStructuredNumber(aweme.video, [\"width\", \"w\", \"videoWidth\"]),\n      height: readStructuredNumber(aweme.video, [\"height\", \"h\", \"videoHeight\"]),\n      duration: normalizeDouyinDuration(\n        aweme.video.duration || aweme.duration || aweme.video.videoDuration,\n      ),\n    });\n  };\n  const visitedDouyinDetailObjects = new WeakSet();\n  const scanDouyinAwemeDetails = (value, depth = 0) => {\n    if (videos.length >= MAX || depth > 10 || !value || typeof value !== \"object\") return;\n    if (visitedDouyinDetailObjects.has(value)) return;\n    visitedDouyinDetailObjects.add(value);\n    if (value.aweme_detail) pushDouyinAwemeDetail(value.aweme_detail);\n    if (Array.isArray(value.aweme_list)) {\n      for (const aweme of value.aweme_list) pushDouyinAwemeDetail(aweme);\n    }\n    if (hasDouyinVideoAddress(value.video)) pushDouyinAwemeDetail(value);\n    for (const key of Object.keys(value).slice(0, 180)) {\n      if (videos.length >= MAX) break;\n      const item = value[key];\n      if (item && typeof item === \"object\") scanDouyinAwemeDetails(item, depth + 1);\n    }\n  };\n  const pushStructuredVideoUrl = (url, source = {}) => {\n    const normalizedUrl = normalizeUrl(url);\n    if (!normalizedUrl || isStreamMediaUrl(normalizedUrl) || isNonVideoAssetUrl(normalizedUrl)) {\n      return;\n    }\n    if (!isDirectVideoUrl(normalizedUrl)) return;\n    push(normalizedUrl, {\n      fromVideo: true,\n      sourceType: STRUCTURED_VIDEO_SOURCE_TYPE,\n      title: source.title || pageTitle || \"网页视频\",\n      width: source.width || 0,\n      height: source.height || 0,\n      duration: source.duration || 0,\n    });\n  };\n  const visitedStructuredObjects = new WeakSet();\n  let structuredObjectCount = 0;\n  const walkStructuredMedia = (value, path = [], depth = 0, inheritedContext = false) => {\n    if (videos.length >= MAX || structuredObjectCount > 3000 || depth > 10) return;\n    if (typeof value === \"string\") {\n      const context =\n        inheritedContext ||\n        hasStructuredVideoContext(path) ||\n        STRUCTURED_URL_KEY_RE.test(String(path.at(-1) || \"\"));\n      if (!context) return;\n      for (const url of extractUrlsFromText(value)) {\n        pushStructuredVideoUrl(url, { hasStructuredVideoContext: context });\n      }\n      return;\n    }\n    if (!value || typeof value !== \"object\") return;\n    if (visitedStructuredObjects.has(value)) return;\n    visitedStructuredObjects.add(value);\n    structuredObjectCount += 1;\n\n    const keys = Object.keys(value).slice(0, 180);\n    const objectContext =\n      inheritedContext ||\n      hasStructuredVideoContext(path) ||\n      keys.some((key) => STRUCTURED_VIDEO_KEY_RE.test(key));\n    const dimensions = {\n      width: readStructuredNumber(value, [\"width\", \"w\", \"videoWidth\"]),\n      height: readStructuredNumber(value, [\"height\", \"h\", \"videoHeight\"]),\n      duration: readStructuredNumber(value, [\"duration\", \"durationSec\", \"videoDuration\"]),\n    };\n    for (const key of keys) {\n      if (videos.length >= MAX) break;\n      const item = value[key];\n      const nextPath = path.concat(key);\n      const keyContext =\n        objectContext ||\n        STRUCTURED_VIDEO_KEY_RE.test(key) ||\n        STRUCTURED_URL_KEY_RE.test(key);\n      if (typeof item === \"string\") {\n        if (!keyContext) continue;\n        for (const url of extractUrlsFromText(item)) {\n          pushStructuredVideoUrl(url, {\n            ...dimensions,\n            hasStructuredVideoContext: keyContext,\n          });\n        }\n        continue;\n      }\n      if (item && typeof item === \"object\") {\n        walkStructuredMedia(item, nextPath, depth + 1, keyContext);\n      }\n    }\n  };\n  const tryParseStructuredJson = (value) => {\n    const text = String(value || \"\").trim();\n    if (!text) return null;\n    try {\n      return JSON.parse(text);\n    } catch {}\n    try {\n      return JSON.parse(decodeURIComponent(text));\n    } catch {}\n    return null;\n  };\n  const extractJsonValueAt = (text, startIndex) => {\n    let index = Math.max(0, Number(startIndex || 0) || 0);\n    while (index < text.length && /\\s/.test(text[index])) index += 1;\n    const open = text[index];\n    const close = open === \"{\" ? \"}\" : open === \"[\" ? \"]\" : \"\";\n    if (!close) return \"\";\n    let depth = 0;\n    let quote = \"\";\n    let escaped = false;\n    for (let i = index; i < text.length; i += 1) {\n      const ch = text[i];\n      if (quote) {\n        if (escaped) {\n          escaped = false;\n        } else if (ch === \"\\\\\") {\n          escaped = true;\n        } else if (ch === quote) {\n          quote = \"\";\n        }\n        continue;\n      }\n      if (ch === '\"' || ch === \"'\") {\n        quote = ch;\n        continue;\n      }\n      if (ch === open) {\n        depth += 1;\n      } else if (ch === close) {\n        depth -= 1;\n        if (depth === 0) return text.slice(index, i + 1);\n      }\n    }\n    return \"\";\n  };\n  const scanStructuredScriptText = (value) => {\n    const text = String(value || \"\").slice(0, 800000);\n    const parsed = tryParseStructuredJson(text);\n    if (parsed) {\n      scanDouyinAwemeDetails(parsed);\n      walkStructuredMedia(parsed, [\"script-json\"]);\n    }\n    const decodedText = unescapeStructuredUrlText(text);\n    const decoded = decodedText !== text ? tryParseStructuredJson(decodedText) : null;\n    if (decoded) {\n      scanDouyinAwemeDetails(decoded);\n      walkStructuredMedia(decoded, [\"script-json-decoded\"]);\n    }\n\n    const keyRe =\n      /[\"']?(aweme_detail|video_info(?:_v2)?|video|play_addr(?:_h(?:264|265)|_256)?|download_addr|url_list|backup_urls|dash|stream)[\"']?\\s*:/gi;\n    let match = null;\n    let scanned = 0;\n    while ((match = keyRe.exec(decodedText)) && scanned < 120 && videos.length < MAX) {\n      scanned += 1;\n      const colonIndex = decodedText.indexOf(\":\", match.index);\n      const jsonValue = extractJsonValueAt(decodedText, colonIndex + 1);\n      const partial = tryParseStructuredJson(jsonValue);\n      if (partial) {\n        scanDouyinAwemeDetails(partial);\n        walkStructuredMedia(partial, [match[1]]);\n      }\n    }\n  };\n  for (const key of KNOWN_STATE_KEYS) {\n    if (videos.length >= MAX) break;\n    try {\n      const value = window[key];\n      if (typeof value === \"string\") {\n        const parsed = tryParseStructuredJson(unescapeStructuredUrlText(value));\n        if (parsed) {\n          scanDouyinAwemeDetails(parsed);\n          walkStructuredMedia(parsed, [key]);\n        } else {\n          walkStructuredMedia(value, [key]);\n        }\n      } else if (value && typeof value === \"object\") {\n        scanDouyinAwemeDetails(value);\n        walkStructuredMedia(value, [key]);\n      }\n    } catch {}\n  }\n  for (const script of Array.from(document.scripts || [])) {\n    if (videos.length >= MAX) break;\n    const type = String(script.type || script.getAttribute?.(\"type\") || \"\").toLowerCase();\n    const id = String(script.id || \"\").toLowerCase();\n    const shouldScan =\n      type.includes(\"json\") ||\n      id.includes(\"data\") ||\n      id.includes(\"state\") ||\n      /play_addr|download_addr|url_list|backup_urls|video_info|aweme_detail/i.test(script.textContent || \"\");\n    if (!shouldScan) continue;\n    scanStructuredScriptText(script.textContent || \"\");\n  }\n  return { ok: true, videos, douyinDetailApiUrls, pageUrl, pageTitle };\n})()\n";
}
function buildWebPreviewReferenceSnapshotScript() {
  return '\x0a(()\x20=>\x20{\x0a\x20\x20const\x20normalizeUrl\x20=\x20(value)\x20=>\x20{\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20const\x20url\x20=\x20new\x20URL(String(value\x20||\x20\x22\x22),\x20document.baseURI);\x0a\x20\x20\x20\x20\x20\x20if\x20(url.protocol\x20!==\x20\x22http:\x22\x20&&\x20url.protocol\x20!==\x20\x22https:\x22)\x20return\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20url.username\x20=\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20url.password\x20=\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20return\x20url.href;\x0a\x20\x20\x20\x20}\x20catch\x20{\x0a\x20\x20\x20\x20\x20\x20return\x20\x22\x22;\x0a\x20\x20\x20\x20}\x0a\x20\x20};\x0a\x20\x20const\x20selectedText\x20=\x20String(window.getSelection?.().toString?.()\x20||\x20\x22\x22).trim();\x0a\x20\x20return\x20{\x0a\x20\x20\x20\x20ok:\x20true,\x0a\x20\x20\x20\x20pageUrl:\x20normalizeUrl(location.href),\x0a\x20\x20\x20\x20pageTitle:\x20String(document.title\x20||\x20\x22\x22).slice(0,\x20160),\x0a\x20\x20\x20\x20selectedText:\x20selectedText.slice(0,\x20' + WEB_PREVIEW_SELECTED_TEXT_LIMIT + "),\n  };\n})()\n";
}
function toNodeId(_0x148a3e) {
  return String(_0x148a3e || '')["trim"]();
}
function toTabId(_0x390ae7) {
  return String(_0x390ae7 || "default")["trim"]() || "default";
}
function normalizeExtractedImageDimension(_0x5b1067) {
  return Math["max"](0x0, Math["round"](Number(_0x5b1067 || 0x0) || 0x0));
}
function hasExtractableImageSize(_0x112c6f, _0x43ffc6) {
  const _0x1aa26a = normalizeExtractedImageDimension(_0x112c6f);
  const _0xcffb60 = normalizeExtractedImageDimension(_0x43ffc6);
  if (!_0x1aa26a || !_0xcffb60) {
    return !![];
  }
  return _0x1aa26a >= WEB_PREVIEW_EXTRACT_MIN_IMAGE_WIDTH && _0xcffb60 >= WEB_PREVIEW_EXTRACT_MIN_IMAGE_HEIGHT && _0x1aa26a * _0xcffb60 >= WEB_PREVIEW_EXTRACT_MIN_IMAGE_AREA;
}
function filterExtractedImageCandidates(_0x4492f2 = []) {
  if (!Array["isArray"](_0x4492f2)) {
    return [];
  }
  return _0x4492f2["filter"](_0x593993 => hasExtractableImageSize(_0x593993?.["width"], _0x593993?.["height"]));
}
function normalizeExtractedMediaUrl(_0x104fd7) {
  const _0x1ef5a9 = String(_0x104fd7 || '')['trim']();
  if (!_0x1ef5a9) {
    return '';
  }
  try {
    const _0x3695af = new URL(_0x1ef5a9);
    if (_0x3695af["protocol"] !== "http:" && _0x3695af["protocol"] !== 'https:') {
      return '';
    }
    _0x3695af['username'] = '';
    _0x3695af["password"] = '';
    return _0x3695af['href'];
  } catch {
    return '';
  }
}
function isDirectVideoMediaUrl(_0x2b381f) {
  const _0x1a52eb = normalizeExtractedMediaUrl(_0x2b381f);
  if (!_0x1a52eb) {
    return ![];
  }
  try {
    const _0xc61200 = new URL(_0x1a52eb)['pathname'];
    return WEB_PREVIEW_DIRECT_VIDEO_EXTENSION_RE["test"](_0xc61200) && !WEB_PREVIEW_STREAM_MEDIA_EXTENSION_RE['test'](_0xc61200);
  } catch {
    return ![];
  }
}
function filterExtractedVideoCandidates(_0x15a2cd = []) {
  if (!Array["isArray"](_0x15a2cd)) {
    return [];
  }
  const _0x13a517 = new Set();
  const _0xe6fb95 = [];
  for (const _0x2f3c69 of _0x15a2cd) {
    const _0x2b1412 = normalizeExtractedMediaUrl(_0x2f3c69?.['url']);
    if (!_0x2b1412 || _0x13a517["has"](_0x2b1412)) {
      continue;
    }
    let _0x5a6675 = '';
    try {
      _0x5a6675 = new URL(_0x2b1412)["pathname"];
    } catch {}
    if (WEB_PREVIEW_STREAM_MEDIA_EXTENSION_RE["test"](_0x5a6675)) {
      continue;
    }
    const _0x3c4367 = String(_0x2f3c69?.["mimeType"] || '')["trim"]()['toLowerCase']();
    const _0x232b34 = String(_0x2f3c69?.['sourceType'] || "media")["trim"]()["toLowerCase"]();
    const _0x5b0ae9 = _0x3c4367["startsWith"]('video/') || isDirectVideoMediaUrl(_0x2b1412) || _0x232b34 === "video" || _0x232b34 === "video-source" || _0x232b34 === "source" || _0x232b34 === "video-resource" || _0x232b34 === "douyin-detail";
    if (!_0x5b0ae9) {
      continue;
    }
    _0x13a517['add'](_0x2b1412);
    _0xe6fb95["push"]({
      'kind': "video",
      'url': _0x2b1412,
      'title': String(_0x2f3c69?.["title"] || _0x2f3c69?.["pageTitle"] || "网页视频")["trim"]()["slice"](0x0, 0xa0),
      'pageUrl': normalizeExtractedMediaUrl(_0x2f3c69?.["pageUrl"]),
      'pageTitle': String(_0x2f3c69?.["pageTitle"] || '')["trim"]()["slice"](0x0, 0xa0),
      'nodeId': String(_0x2f3c69?.["nodeId"] || '')["trim"](),
      'tabId': String(_0x2f3c69?.['tabId'] || '')['trim'](),
      'width': Math["max"](0x0, Math["round"](Number(_0x2f3c69?.['width'] || 0x0) || 0x0)),
      'height': Math["max"](0x0, Math["round"](Number(_0x2f3c69?.["height"] || 0x0) || 0x0)),
      'duration': Math["max"](0x0, Number(_0x2f3c69?.["duration"] || 0x0) || 0x0),
      'sourceType': _0x232b34["slice"](0x0, 0x28),
      'mimeType': _0x3c4367
    });
    if (_0xe6fb95["length"] >= WEB_PREVIEW_VIDEO_EXTRACTION_LIMIT) {
      break;
    }
  }
  return _0xe6fb95;
}
function mergeExtractedImageCandidates(..._0x2df6cb) {
  const _0x4daaec = new Set();
  const _0x1a7c64 = [];
  for (const _0x436836 of _0x2df6cb) {
    for (const _0x445929 of filterExtractedImageCandidates(_0x436836)) {
      const _0x175b54 = normalizeExtractedMediaUrl(_0x445929?.["url"]);
      if (!_0x175b54 || _0x4daaec["has"](_0x175b54)) {
        continue;
      }
      _0x4daaec["add"](_0x175b54);
      _0x1a7c64["push"]({
        ..._0x445929,
        'url': _0x175b54
      });
      if (_0x1a7c64["length"] >= WEB_PREVIEW_IMAGE_EXTRACTION_LIMIT) {
        return _0x1a7c64;
      }
    }
  }
  return _0x1a7c64;
}
function mergeExtractedVideoCandidates(..._0x1389f5) {
  const _0x34b7ec = new Set();
  const _0x332f11 = [];
  for (const _0x1eb804 of _0x1389f5) {
    for (const _0x295824 of filterExtractedVideoCandidates(_0x1eb804)) {
      if (!_0x295824?.['url'] || _0x34b7ec["has"](_0x295824["url"])) {
        continue;
      }
      _0x34b7ec["add"](_0x295824['url']);
      _0x332f11["push"](_0x295824);
      if (_0x332f11["length"] >= WEB_PREVIEW_VIDEO_EXTRACTION_LIMIT) {
        return _0x332f11;
      }
    }
  }
  return _0x332f11;
}
function toEntryKey(_0x1a1a24, _0x506ba5 = "default") {
  return toNodeId(_0x1a1a24) + '\x0a' + toTabId(_0x506ba5);
}
function toBrowserProfileId(_0x37835a) {
  const _0x227ab4 = String(_0x37835a || '')['trim']()['replace'](/[^a-zA-Z0-9_-]/g, '-')["replace"](/-+/g, '-')["replace"](/^-|-$/g, '')["slice"](0x0, 0x50);
  return _0x227ab4 || DEFAULT_WEB_PREVIEW_BROWSER_PROFILE_ID;
}
function toPersistentPartitionId(_0x2babd9) {
  return WEB_PREVIEW_PARTITION_PREFIX + '-' + toBrowserProfileId(_0x2babd9);
}
function isBlankPopupUrl(_0x57aafd) {
  const _0x433961 = String(_0x57aafd || '')["trim"]()["toLowerCase"]();
  return !_0x433961 || _0x433961 === "about:blank" || _0x433961['startsWith']("about:blank#") || _0x433961['startsWith']("about:blank?");
}
function isGoogleAccountsUrl(_0x30e3c0) {
  const _0x3be0e1 = normalizeWebPreviewUrl(_0x30e3c0);
  if (!_0x3be0e1) {
    return ![];
  }
  try {
    const _0x54fde6 = new URL(_0x3be0e1)["hostname"]['toLowerCase']();
    return _0x54fde6 === 'accounts.google.com' || _0x54fde6["startsWith"]("accounts.google.");
  } catch {
    return ![];
  }
}
function shouldUseNativeAuthPopup(_0x64e978) {
  return isBlankPopupUrl(_0x64e978) || isGoogleAccountsUrl(_0x64e978);
}
function normalizeBounds(_0xf8720e = {}) {
  const _0x310289 = Math["round"](Number(_0xf8720e['x']));
  const _0xb09c59 = Math['round'](Number(_0xf8720e['y']));
  const _0x9b366a = Math["round"](Number(_0xf8720e['width']));
  const _0x3d6395 = Math["round"](Number(_0xf8720e["height"]));
  if (!Number['isFinite'](_0x310289) || !Number["isFinite"](_0xb09c59) || !Number['isFinite'](_0x9b366a) || !Number["isFinite"](_0x3d6395) || _0x9b366a < MIN_VIEW_SIZE || _0x3d6395 < MIN_VIEW_SIZE) {
    return null;
  }
  return {
    'x': _0x310289,
    'y': _0xb09c59,
    'width': _0x9b366a,
    'height': _0x3d6395
  };
}
function normalizeZoomFactor(_0x3668fb) {
  const _0x2d42b7 = Number(_0x3668fb);
  if (!Number["isFinite"](_0x2d42b7) || _0x2d42b7 <= 0x0) {
    return 0x1;
  }
  return Math["min"](0x5, Math["max"](0.25, _0x2d42b7));
}
function boundsEqual(_0x4f05c1, _0x2f7cf7) {
  return _0x4f05c1?.['x'] === _0x2f7cf7?.['x'] && _0x4f05c1?.['y'] === _0x2f7cf7?.['y'] && _0x4f05c1?.["width"] === _0x2f7cf7?.["width"] && _0x4f05c1?.['height'] === _0x2f7cf7?.["height"];
}
function zoomFactorEqual(_0x5ea746, _0x3ec635) {
  return Math["abs"](Number(_0x5ea746 || 0x1) - Number(_0x3ec635 || 0x1)) < 0.001;
}
function getViewsPayload(_0x58a6ef) {
  return Array["isArray"](_0x58a6ef?.["views"]) ? _0x58a6ef['views'] : [];
}
function getNavigationState(_0x239824) {
  return {
    'canGoBack': Boolean(_0x239824?.["canGoBack"]?.()),
    'canGoForward': Boolean(_0x239824?.['canGoForward']?.())
  };
}
function createInputBridgeToken() {
  return Date['now']()['toString'](0x24) + '-' + Math["random"]()["toString"](0x24)["slice"](0x2);
}
function getConsoleMessageFromArgs(_0x10fdf8 = []) {
  for (const _0x3a4ba8 of _0x10fdf8) {
    if (typeof _0x3a4ba8 === "string") {
      return _0x3a4ba8;
    }
    if (_0x3a4ba8 && typeof _0x3a4ba8['message'] === "string") {
      return _0x3a4ba8["message"];
    }
  }
  return '';
}
function parseWebPreviewInputBridgeMessage(_0x445823 = '') {
  const _0xce3e54 = String(_0x445823 || '');
  if (!_0xce3e54['startsWith'](WEB_PREVIEW_INPUT_BRIDGE_MESSAGE_PREFIX)) {
    return null;
  }
  try {
    const _0x13fb5b = JSON["parse"](_0xce3e54["slice"](WEB_PREVIEW_INPUT_BRIDGE_MESSAGE_PREFIX["length"]));
    if (_0x13fb5b?.["type"] !== "pan-start-preview" && _0x13fb5b?.["type"] !== 'image-context-menu' && _0x13fb5b?.["type"] !== 'text-context-menu') {
      return null;
    }
    return _0x13fb5b;
  } catch {
    return null;
  }
}
export function createWebPreviewViewManager({
  WebContentsView: _0x34b371,
  BrowserWindow: _0x34f1b7,
  getMainWindow: _0x523d09,
  openExternalUrl: _0x41e7d4,
  createContextMenu: _0x590c4a,
  createContextMenuIcon: _0x5346fa,
  logDiagnosticEvent: _0x1e2ca8,
  resolveDouyinMedia = resolveDouyinCurrentPageMedia,
  setTimeoutFn = globalThis["setTimeout"]?.['bind'](globalThis),
  clearTimeoutFn = globalThis["clearTimeout"]?.["bind"](globalThis),
  readySnapshotDelayMs = READY_SNAPSHOT_IDLE_DELAY_MS
} = {}) {
  const _0x36ab9b = new Map();
  const _0x8002c = new Set();
  const _0x30ca5b = new Set();
  let _0xadd5ab = {};
  let _0x413156 = 0x0;
  function _0x3ff188() {
    const _0x57c9a0 = typeof _0x523d09 === "function" ? _0x523d09() : null;
    return _0x57c9a0 && !_0x57c9a0["isDestroyed"]?.() ? _0x57c9a0 : null;
  }
  function _0x202356(_0xc287eb, _0xe2a865, _0x20eedb = '') {
    const _0x3791f1 = _0x3ff188();
    if (!_0x3791f1?.["webContents"] || _0x3791f1["webContents"]["isDestroyed"]?.()) {
      return;
    }
    _0x3791f1["webContents"]["send"]("webPreview:event", {
      'nodeId': _0xc287eb,
      ...(_0x20eedb ? {
        'tabId': _0x20eedb
      } : {}),
      ..._0xe2a865
    });
  }
  function _0xa49be8(_0x36e312, _0x298bbc, _0x55254b = '') {
    _0x202356(_0x36e312, {
      'type': 'blocked',
      'url': String(_0x298bbc || ''),
      'message': "浏览器节点仅允许打开 http/https 链接"
    }, _0x55254b);
  }
  function _0x3bfa50(_0x338232, _0x2cfc00, _0x4dc647 = '') {
    _0x202356(_0x338232, {
      'type': "navigation-state",
      ...getNavigationState(_0x2cfc00)
    }, _0x4dc647);
  }
  function _0x30b309(_0x209d3e) {
    let _0x40671a = '';
    do {
      _0x413156 += 0x1;
      _0x40671a = "popup-" + Date["now"]() + '-' + _0x413156;
    } while (_0x36ab9b['has'](toEntryKey(_0x209d3e, _0x40671a)));
    return _0x40671a;
  }
  function _0x272e50(_0x225be3) {
    return {
      'nodeIntegration': ![],
      'contextIsolation': !![],
      'sandbox': !![],
      'partition': _0x225be3
    };
  }
  function _0xa61ebc(_0x33732f = []) {
    if (!Array["isArray"](_0x33732f)) {
      return '';
    }
    for (const _0x1ddc6b of _0x33732f) {
      const _0x5654ac = normalizeWebPreviewFaviconUrl(_0x1ddc6b);
      if (_0x5654ac) {
        return _0x5654ac;
      }
    }
    return '';
  }
  function _0x6560de(_0x579005) {
    if (!_0x579005?.['readySnapshotTimer']) {
      return;
    }
    clearTimeoutFn?.(_0x579005['readySnapshotTimer']);
    _0x579005["readySnapshotTimer"] = null;
  }
  function _0x34cf40(_0x2928bf, _0x4a8310, _0x20f7ae, _0x275df7, _0x4ee42f = '', _0x33f6b7 = _0x4a8310?.["snapshotEpoch"] || 0x0) {
    const _0x572adb = _0x4a8310?.["view"]?.["webContents"];
    if (!_0x572adb || _0x572adb["isDestroyed"]?.()) {
      return ![];
    }
    if (typeof _0x572adb["capturePage"] !== "function") {
      return ![];
    }
    const _0x3b0d67 = _0x4ee42f || _0x4a8310?.["url"] || _0x4a8310?.["requestedUrl"] || '';
    let _0x2adf9e = null;
    try {
      _0x2adf9e = _0x572adb["capturePage"]();
    } catch (_0x3b89ab) {
      _0x1e2ca8?.({
        'type': "web_preview.snapshot_failed",
        'level': 'warn',
        'source': "main",
        'message': "Web preview snapshot capture failed",
        'error': _0x3b89ab,
        'context': {
          'nodeId': _0x2928bf,
          'freezeToken': _0x20f7ae
        }
      });
      return ![];
    }
    Promise["resolve"](_0x2adf9e)["then"](_0x3e76e7 => {
      const _0x4c65f8 = _0x3e76e7?.["toDataURL"]?.();
      if (!_0x4c65f8) {
        return;
      }
      if (_0x4a8310 && _0x4a8310["snapshotEpoch"] !== _0x33f6b7) {
        return;
      }
      if (_0x3b0d67 && _0x4a8310?.["requestedUrl"] && _0x4a8310['requestedUrl'] !== _0x3b0d67) {
        return;
      }
      _0x4a8310["hasSnapshot"] = !![];
      _0x4a8310["snapshotUrl"] = _0x3b0d67;
      _0x4a8310["snapshotFreezeToken"] = String(_0x20f7ae || '');
      _0x202356(_0x2928bf, {
        'type': "snapshot",
        'dataUrl': _0x4c65f8,
        'freezeToken': _0x20f7ae,
        'width': _0x4a8310['bounds']?.['width'] || 0x0,
        'height': _0x4a8310["bounds"]?.['height'] || 0x0,
        'zoomFactor': _0x4a8310["zoomFactor"] || 0x1
      }, _0x4a8310["tabId"]);
    })['catch'](_0x4ae4cb => {
      _0x1e2ca8?.({
        'type': "web_preview.snapshot_failed",
        'level': "warn",
        'source': "main",
        'message': "Web preview snapshot capture failed",
        'error': _0x4ae4cb,
        'context': {
          'nodeId': _0x2928bf,
          'freezeToken': _0x20f7ae
        }
      });
    })["finally"](() => {
      _0x275df7?.();
    });
    return !![];
  }
  function _0x1eeab7(_0x211420, _0x8d1252, _0x3f62c4 = _0x8d1252?.["snapshotEpoch"] || 0x0) {
    const _0x3725da = _0x8d1252?.["url"] || _0x8d1252?.["requestedUrl"] || '';
    if (!_0x8d1252?.["bounds"] || !_0x3725da || _0x8d1252["readySnapshotPending"]) {
      return ![];
    }
    if (_0x8d1252['hasSnapshot'] && _0x8d1252['snapshotUrl'] === _0x3725da) {
      return ![];
    }
    _0x8d1252["readySnapshotPending"] = !![];
    const _0x5b9327 = _0x34cf40(_0x211420, _0x8d1252, "ready", () => {
      _0x8d1252["readySnapshotPending"] = ![];
    }, _0x3725da, _0x3f62c4);
    if (!_0x5b9327) {
      _0x8d1252["readySnapshotPending"] = ![];
    }
    return _0x5b9327;
  }
  function _0xa54887(_0x1724e4, _0x1e2a1f) {
    const _0x51a1fa = _0x1e2a1f?.["url"] || _0x1e2a1f?.["requestedUrl"] || '';
    if (!_0x1e2a1f?.['loaded'] || !_0x1e2a1f["bounds"] || !_0x51a1fa || _0x1e2a1f["visible"] !== !![] || _0x1e2a1f["freezeToken"] || _0x1e2a1f["readySnapshotPending"] || _0x1e2a1f["readySnapshotTimer"]) {
      return ![];
    }
    if (_0x1e2a1f['hasSnapshot'] && _0x1e2a1f["snapshotUrl"] === _0x51a1fa) {
      return ![];
    }
    if (typeof setTimeoutFn !== 'function') {
      return _0x1eeab7(_0x1724e4, _0x1e2a1f);
    }
    const _0x10ea7b = _0x1e2a1f["snapshotEpoch"];
    const _0x284582 = Math["max"](0x0, Number(readySnapshotDelayMs) || 0x0);
    _0x1e2a1f["readySnapshotTimer"] = setTimeoutFn(() => {
      _0x1e2a1f["readySnapshotTimer"] = null;
      const _0x5dbce4 = _0x36ab9b["get"](toEntryKey(_0x1724e4, _0x1e2a1f['tabId']));
      const _0x2d095e = _0x5dbce4?.["url"] || _0x5dbce4?.["requestedUrl"] || '';
      if (_0x5dbce4 !== _0x1e2a1f || _0x5dbce4["snapshotEpoch"] !== _0x10ea7b || _0x2d095e !== _0x51a1fa || _0x5dbce4["loaded"] !== !![] || _0x5dbce4["visible"] !== !![]) {
        return;
      }
      if (_0x5dbce4["freezeToken"]) {
        _0xa54887(_0x1724e4, _0x5dbce4);
        return;
      }
      _0x1eeab7(_0x1724e4, _0x5dbce4, _0x10ea7b);
    }, _0x284582);
    return !![];
  }
  function _0x3516b3(_0x447e1e, _0x3a9262, _0x362bd6 = '', _0x396e1b = '') {
    if (typeof _0x3a9262?.["executeJavaScript"] !== "function") {
      return;
    }
    _0x3a9262['executeJavaScript'](buildWebPreviewDragBridgeScript({
      'nodeId': _0x447e1e,
      'tabId': _0x362bd6,
      'inputBridgeToken': _0x396e1b
    }), !![])["catch"](_0x565d9f => {
      _0x1e2ca8?.({
        'type': "web_preview.drag_bridge_failed",
        'level': "warn",
        'source': "main",
        'message': "Web preview drag bridge injection failed",
        'error': _0x565d9f,
        'context': {
          'nodeId': _0x447e1e,
          'tabId': _0x362bd6
        }
      });
    });
  }
  function _0x29a8d1(_0x1d63ac, _0x597aa9, _0x1010f0, _0x396cfd = {}, _0x33b9ce = WEB_PREVIEW_TEXT_ACTION_PROMPT) {
    const _0x51e540 = String(_0x396cfd?.["selectionText"] || '')["trim"]();
    if (!_0x51e540) {
      return ![];
    }
    const _0x3f21db = _0x36ab9b["get"](toEntryKey(_0x1d63ac, _0x597aa9));
    const _0x310cc5 = normalizeWebPreviewUrl(_0x396cfd?.['pageURL']) || normalizeWebPreviewUrl(_0x3f21db?.["url"]) || normalizeWebPreviewUrl(_0x3f21db?.["requestedUrl"]) || '';
    const _0x399b34 = String(_0x1010f0?.["getTitle"]?.() || '')["trim"]();
    _0x202356(_0x1d63ac, {
      'type': _0x33b9ce,
      'text': _0x51e540['slice'](0x0, WEB_PREVIEW_SELECTED_TEXT_LIMIT),
      'pageUrl': _0x310cc5,
      'webSourceTitle': _0x399b34["slice"](0x0, 0xa0),
      'contextX': Math["max"](0x0, Math["round"](Number(_0x396cfd?.['x'] || 0x0) || 0x0)),
      'contextY': Math["max"](0x0, Math['round'](Number(_0x396cfd?.['y'] || 0x0) || 0x0))
    }, _0x597aa9);
    return !![];
  }
  function _0x249d9e(_0x4b8952, _0x553d17 = {}) {
    const _0x3597c4 = String(_0x553d17?.["selectionText"] || '')['trim']();
    if (!_0x3597c4) {
      return ![];
    }
    try {
      if (typeof _0x4b8952?.['copy'] === "function") {
        _0x4b8952["copy"]();
        return !![];
      }
    } catch {}
    return ![];
  }
  function _0x5e0846(_0xcb0abe) {
    return Math["max"](0x0, Math["round"](Number(_0xcb0abe || 0x0) || 0x0));
  }
  function _0x6523f3(_0x5cc861 = {}, _0x551e6e = null) {
    const _0x5c8db2 = normalizeWebPreviewUrl(_0x5cc861?.['pageUrl']) || normalizeWebPreviewUrl(_0x5cc861?.["sourceUrl"]) || normalizeWebPreviewUrl(_0x551e6e?.["url"]) || normalizeWebPreviewUrl(_0x551e6e?.['requestedUrl']) || '';
    return {
      'mediaType': "image",
      'srcURL': normalizeWebPreviewUrl(_0x5cc861?.['url']) || '',
      'titleText': String(_0x5cc861?.['title'] || _0x5cc861?.["alt"] || '')["trim"]()["slice"](0x0, 0xa0),
      'pageURL': _0x5c8db2,
      'frameURL': _0x5c8db2,
      'x': _0x5e0846(_0x5cc861?.["contextX"] ?? _0x5cc861?.['clientX']),
      'y': _0x5e0846(_0x5cc861?.["contextY"] ?? _0x5cc861?.["clientY"])
    };
  }
  function _0x5d19da(_0x50e503 = {}, _0x1cf4b7 = null) {
    const _0x551416 = normalizeWebPreviewUrl(_0x50e503?.["pageUrl"]) || normalizeWebPreviewUrl(_0x50e503?.["sourceUrl"]) || normalizeWebPreviewUrl(_0x1cf4b7?.["url"]) || normalizeWebPreviewUrl(_0x1cf4b7?.["requestedUrl"]) || '';
    return {
      'selectionText': String(_0x50e503?.["text"] || '')['trim']()["slice"](0x0, WEB_PREVIEW_SELECTED_TEXT_LIMIT),
      'pageURL': _0x551416,
      'frameURL': _0x551416,
      'x': _0x5e0846(_0x50e503?.["contextX"] ?? _0x50e503?.["clientX"]),
      'y': _0x5e0846(_0x50e503?.["contextY"] ?? _0x50e503?.["clientY"])
    };
  }
  function _0x2c4b49(_0x22f302, _0x1117c7 = {}) {
    if (!_0x22f302) {
      return;
    }
    _0x22f302["lastBridgeImageContextMenuAt"] = Date["now"]();
    _0x22f302["lastBridgeImageContextMenuX"] = _0x5e0846(_0x1117c7?.['x']);
    _0x22f302["lastBridgeImageContextMenuY"] = _0x5e0846(_0x1117c7?.['y']);
  }
  function _0x2e9540(_0x3c402a, _0x411026 = {}) {
    const _0x30c3d4 = Number(_0x3c402a?.["lastBridgeImageContextMenuAt"] || 0x0);
    if (!_0x30c3d4 || Date["now"]() - _0x30c3d4 > WEB_PREVIEW_CONTEXT_MENU_BRIDGE_DEDUPE_MS) {
      return ![];
    }
    const _0x9c4c91 = _0x5e0846(_0x411026?.['x']);
    const _0x535f9f = _0x5e0846(_0x411026?.['y']);
    return Math["abs"](_0x9c4c91 - _0x5e0846(_0x3c402a?.['lastBridgeImageContextMenuX'])) <= 0x2 && Math["abs"](_0x535f9f - _0x5e0846(_0x3c402a?.["lastBridgeImageContextMenuY"])) <= 0x2;
  }
  function _0x580c1f(_0x26aad0, _0x38b639, _0x40b78d, _0x27a151 = {}, _0x5dfcfb = null) {
    const _0x42fbc5 = String(_0x27a151?.["mediaType"] || '')["toLowerCase"]() === "image" || Boolean(_0x5dfcfb?.["url"]);
    if (!_0x42fbc5) {
      return null;
    }
    const _0xc2b014 = normalizeWebPreviewUrl(_0x5dfcfb?.["url"] || _0x27a151?.["srcURL"]);
    if (!_0xc2b014) {
      return null;
    }
    const _0x163848 = _0x36ab9b["get"](toEntryKey(_0x26aad0, _0x38b639));
    const _0x4c38b6 = normalizeWebPreviewUrl(_0x5dfcfb?.["pageUrl"]) || normalizeWebPreviewUrl(_0x27a151?.["pageURL"]) || normalizeWebPreviewUrl(_0x27a151?.["frameURL"]) || normalizeWebPreviewUrl(_0x163848?.["url"]) || normalizeWebPreviewUrl(_0x163848?.["requestedUrl"]) || '';
    const _0x21a181 = String(_0x5dfcfb?.['pageTitle'] || _0x40b78d?.['getTitle']?.() || '')["trim"]()['slice'](0x0, 0xa0);
    const _0x53d0ac = String(_0x5dfcfb?.['title'] || _0x5dfcfb?.["alt"] || _0x27a151?.["titleText"] || _0x21a181 || "网页图片")['trim']()["slice"](0x0, 0xa0);
    const _0x2d9c97 = {
      'kind': "image",
      'url': _0xc2b014,
      'title': _0x53d0ac,
      'pageUrl': _0x4c38b6,
      'pageTitle': _0x21a181,
      'nodeId': _0x26aad0,
      'tabId': _0x38b639,
      'contextX': Math["max"](0x0, Math['round'](Number(_0x27a151?.['x'] || 0x0) || 0x0)),
      'contextY': Math["max"](0x0, Math["round"](Number(_0x27a151?.['y'] || 0x0) || 0x0))
    };
    const _0x566e46 = Math["max"](0x0, Math["round"](Number(_0x5dfcfb?.['width'] || 0x0) || 0x0));
    const _0x173293 = Math["max"](0x0, Math["round"](Number(_0x5dfcfb?.["height"] || 0x0) || 0x0));
    if (_0x566e46) {
      _0x2d9c97["width"] = _0x566e46;
    }
    if (_0x173293) {
      _0x2d9c97['height'] = _0x173293;
    }
    return _0x2d9c97;
  }
  async function _0x1b2f0b(_0x366e8f, _0x289903, _0x2f6f82, _0x365512 = {}) {
    if (typeof _0x2f6f82?.["executeJavaScript"] !== 'function') {
      return null;
    }
    try {
      const _0x5bdcfe = await _0x2f6f82["executeJavaScript"](buildWebPreviewContextImageProbeScript({
        'nodeId': _0x366e8f,
        'tabId': _0x289903,
        'x': _0x365512?.['x'],
        'y': _0x365512?.['y']
      }), !![]);
      const _0x14fe42 = _0x5bdcfe?.["image"] && typeof _0x5bdcfe["image"] === "object" ? _0x5bdcfe['image'] : _0x5bdcfe;
      return _0x580c1f(_0x366e8f, _0x289903, _0x2f6f82, _0x365512, _0x14fe42);
    } catch (_0x43dcbf) {
      _0x1e2ca8?.({
        'type': 'web_preview.context_image_probe_failed',
        'level': "warn",
        'source': "main",
        'message': "Web preview context image probe failed",
        'error': _0x43dcbf,
        'context': {
          'nodeId': _0x366e8f,
          'tabId': _0x289903
        }
      });
      return null;
    }
  }
  async function _0x50d2eb(_0x5687e1, _0x5c25c8, _0x462ff2, _0x1b6093 = {}) {
    if (String(_0x1b6093?.['mediaType'] || '')["toLowerCase"]() !== 'image') {
      return null;
    }
    const _0xe5a997 = await _0x1b2f0b(_0x5687e1, _0x5c25c8, _0x462ff2, _0x1b6093);
    return _0xe5a997 || _0x580c1f(_0x5687e1, _0x5c25c8, _0x462ff2, _0x1b6093);
  }
  function _0x266423(_0x32420b, _0x9e5e05, _0xb6441, _0xfc26fb = "send-image-to-canvas") {
    if (!_0xb6441) {
      return ![];
    }
    _0x202356(_0x32420b, {
      ..._0xb6441,
      'type': _0xfc26fb
    }, _0x9e5e05);
    return !![];
  }
  async function _0x604e15(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a = {}) {
    if (typeof _0x590c4a !== "function") {
      return;
    }
    const _0x3b0b76 = (_0x1fb135, _0x473bba) => {
      const _0x19ac5c = _0x5346fa?.(_0x1fb135);
      return _0x19ac5c ? {
        ..._0x473bba,
        'icon': _0x19ac5c
      } : _0x473bba;
    };
    const _0x5f1a32 = (_0x17b8fe, _0x498c5f) => {
      const _0x3a7d28 = _0xadd5ab[_0x17b8fe];
      return _0x3a7d28 ? {
        ..._0x498c5f,
        'accelerator': _0x3a7d28
      } : _0x498c5f;
    };
    const _0x89b471 = [];
    const _0x36f9ce = await _0x50d2eb(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a);
    _0x36f9ce && _0x89b471['push'](_0x5f1a32("context-web-image-add-to-canvas", _0x3b0b76("add-to-canvas", {
      'label': "加入到画布",
      'click': () => _0x266423(_0x13089c, _0x47186c, _0x36f9ce, "send-image-to-canvas")
    })), _0x5f1a32("context-web-image-reverse-create", _0x3b0b76("generated", {
      'label': "反推提示词-创建",
      'click': () => _0x266423(_0x13089c, _0x47186c, _0x36f9ce, "reverse-image-prompt")
    })), _0x5f1a32("context-web-image-reverse-generate", _0x3b0b76("generated", {
      'label': "反推提示词-生成",
      'click': () => _0x266423(_0x13089c, _0x47186c, _0x36f9ce, "reverse-image-prompt-generate")
    })));
    const _0x2a0931 = String(_0x2de56a?.["selectionText"] || '')["trim"]();
    if (_0x2a0931) {
      if (_0x89b471["length"]) {
        _0x89b471["push"]({
          'type': "separator"
        });
      }
      _0x89b471['push'](_0x5f1a32("context-web-copy-text", _0x3b0b76('copy', {
        'label': "复制文本",
        'click': () => _0x249d9e(_0x2bd208, _0x2de56a)
      })), _0x5f1a32("context-web-open-text-node-menu", _0x3b0b76("text", {
        'label': '发送到文本节点',
        'submenu': [_0x5f1a32('context-web-text-to-source', _0x3b0b76("source", {
          'label': "源节点",
          'click': () => _0x29a8d1(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a, WEB_PREVIEW_TEXT_ACTION_SOURCE)
        })), _0x5f1a32("context-web-text-to-generated", _0x3b0b76("generated", {
          'label': "生成文本",
          'click': () => _0x29a8d1(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a, WEB_PREVIEW_TEXT_ACTION_PROMPT)
        }))]
      })), _0x5f1a32("context-web-open-image-node-menu", _0x3b0b76("image", {
        'label': "发送到图像节点",
        'submenu': [_0x5f1a32("context-web-text-to-image-create", _0x3b0b76("add-to-canvas", {
          'label': '创建',
          'click': () => _0x29a8d1(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a, WEB_PREVIEW_TEXT_ACTION_IMAGE_PROMPT)
        })), _0x5f1a32("context-web-text-to-image-generate", _0x3b0b76('generated', {
          'label': '生成',
          'click': () => _0x29a8d1(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a, WEB_PREVIEW_TEXT_ACTION_IMAGE_PROMPT_GENERATE)
        }))]
      })), _0x5f1a32("context-web-open-video-node-menu", _0x3b0b76("video", {
        'label': '发送到视频节点',
        'submenu': [_0x5f1a32('context-web-text-to-video-create', _0x3b0b76('add-to-canvas', {
          'label': '创建',
          'click': () => _0x29a8d1(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a, WEB_PREVIEW_TEXT_ACTION_VIDEO_PROMPT)
        })), _0x5f1a32("context-web-text-to-video-generate", _0x3b0b76("generated", {
          'label': '生成',
          'click': () => _0x29a8d1(_0x13089c, _0x47186c, _0x2bd208, _0x2de56a, WEB_PREVIEW_TEXT_ACTION_VIDEO_PROMPT_GENERATE)
        }))]
      })));
    }
    if (!_0x89b471["length"]) {
      return;
    }
    const _0x509f36 = _0x590c4a(_0x89b471);
    _0x509f36?.["popup"]?.({
      'window': _0x3ff188()
    });
  }
  function _0x584362(_0x5dbc56, _0xc07f41, _0x23bbc7, _0x439bca) {
    if (!_0x23bbc7?.["isPopup"] || _0x23bbc7["popupOpened"] || !_0x439bca) {
      return ![];
    }
    _0x23bbc7["popupOpened"] = !![];
    _0x23bbc7['pendingPopup'] = ![];
    _0x23bbc7["url"] = _0x439bca;
    _0x23bbc7['requestedUrl'] = _0x439bca;
    _0x202356(_0x5dbc56, {
      'type': "open-popup",
      'url': _0x439bca,
      'popupTabId': _0xc07f41
    }, _0x23bbc7["openerTabId"] || '');
    return !![];
  }
  function _0x40ab75(_0x439d7d, _0x8edb51, _0x3ee94b) {
    if (!_0x3ee94b?.["isPopup"] || _0x3ee94b["popupOpened"]) {
      return ![];
    }
    _0x3ee94b["popupOpened"] = !![];
    _0x3ee94b['pendingPopup'] = !![];
    _0x3ee94b["url"] = '';
    _0x3ee94b['requestedUrl'] = '';
    _0x202356(_0x439d7d, {
      'type': "open-popup",
      'url': '',
      'popupTabId': _0x8edb51,
      'pendingPopup': !![]
    }, _0x3ee94b["openerTabId"] || '');
    return !![];
  }
  function _0x2e169b(_0x300da8) {
    const _0x1d6c17 = _0x3ff188();
    const _0x160fdf = {
      'parent': _0x1d6c17 || undefined,
      'modal': ![],
      'show': !![],
      'width': WEB_PREVIEW_AUTH_POPUP_WIDTH,
      'height': WEB_PREVIEW_AUTH_POPUP_HEIGHT,
      'minWidth': WEB_PREVIEW_AUTH_POPUP_MIN_WIDTH,
      'minHeight': WEB_PREVIEW_AUTH_POPUP_MIN_HEIGHT,
      'title': "Login",
      'autoHideMenuBar': !![],
      'webPreferences': _0x272e50(_0x300da8)
    };
    const _0x1d7b35 = _0x1d6c17?.["getBounds"]?.();
    if (_0x1d7b35 && Number['isFinite'](_0x1d7b35['x']) && Number["isFinite"](_0x1d7b35['y']) && Number["isFinite"](_0x1d7b35["width"]) && Number["isFinite"](_0x1d7b35["height"]) && _0x1d7b35["width"] > WEB_PREVIEW_AUTH_POPUP_MIN_WIDTH && _0x1d7b35["height"] > WEB_PREVIEW_AUTH_POPUP_MIN_HEIGHT) {
      const _0x78794f = Math['min'](WEB_PREVIEW_AUTH_POPUP_WIDTH, Math["max"](WEB_PREVIEW_AUTH_POPUP_MIN_WIDTH, _0x1d7b35["width"] - 0x30));
      const _0x458060 = Math["min"](WEB_PREVIEW_AUTH_POPUP_HEIGHT, Math["max"](WEB_PREVIEW_AUTH_POPUP_MIN_HEIGHT, _0x1d7b35['height'] - 0x30));
      _0x160fdf['width'] = _0x78794f;
      _0x160fdf["height"] = _0x458060;
      _0x160fdf['x'] = Math["round"](_0x1d7b35['x'] + (_0x1d7b35["width"] - _0x78794f) / 0x2);
      _0x160fdf['y'] = Math["round"](_0x1d7b35['y'] + (_0x1d7b35["height"] - _0x458060) / 0x2);
    }
    return _0x160fdf;
  }
  function _0x743903(_0x142056 = () => !![]) {
    for (const _0x2e3770 of [..._0x30ca5b]) {
      if (_0x142056(_0x2e3770)) {
        _0x30ca5b["delete"](_0x2e3770);
      }
    }
    for (const _0x35c216 of [..._0x8002c]) {
      if (!_0x142056(_0x35c216)) {
        continue;
      }
      _0x8002c["delete"](_0x35c216);
      try {
        _0x35c216["popupWindow"]?.['isDestroyed']?.() !== !![] && _0x35c216['popupWindow']?.["close"]?.();
      } catch {}
    }
  }
  function _0x1c53ee() {
    const _0x107d60 = Date['now']();
    for (const _0x5afdc1 of [..._0x30ca5b]) {
      if (_0x5afdc1["expiresAt"] <= _0x107d60) {
        _0x30ca5b['delete'](_0x5afdc1);
      }
    }
  }
  function _0x189576({
    nodeId: _0x3f88d3,
    tabId: _0x318019,
    partition: _0x49e422
  }) {
    _0x1c53ee();
    const _0x438db1 = {
      'nodeId': _0x3f88d3,
      'tabId': _0x318019,
      'partition': _0x49e422,
      'expiresAt': Date["now"]() + WEB_PREVIEW_AUTH_POPUP_REQUEST_TTL_MS
    };
    _0x30ca5b['add'](_0x438db1);
    return _0x438db1;
  }
  function _0x4ed8bd({
    nodeId: _0x3c4387,
    tabId: _0x15e376,
    url: _0x1e7574
  }) {
    _0x1c53ee();
    let _0x288712 = null;
    for (const _0x52e32b of _0x30ca5b) {
      if (_0x52e32b["nodeId"] !== _0x3c4387 || _0x52e32b["tabId"] !== _0x15e376) {
        continue;
      }
      _0x288712 = _0x52e32b;
      if (shouldUseNativeAuthPopup(_0x1e7574)) {
        break;
      }
    }
    if (_0x288712) {
      _0x30ca5b["delete"](_0x288712);
    }
    return _0x288712;
  }
  function _0x11ef71({
    nodeId: _0x467aa6,
    tabId: _0xd41c61,
    partition: _0x498752,
    webContents: _0x5b6421
  }) {
    _0x5b6421["setWindowOpenHandler"]?.(({
      url: _0x1ab91a
    } = {}) => {
      const _0x57289b = normalizeWebPreviewUrl(_0x1ab91a);
      if (!_0x57289b && !isBlankPopupUrl(_0x1ab91a)) {
        _0xa49be8(_0x467aa6, _0x1ab91a, _0xd41c61);
        return {
          'action': "deny"
        };
      }
      return {
        'action': "allow",
        'outlivesOpener': !![],
        'overrideBrowserWindowOptions': {
          'webPreferences': _0x272e50(_0x498752)
        }
      };
    });
    const _0x16d9d8 = (_0x18845b, _0x46b76c) => {
      if (isBlankPopupUrl(_0x46b76c) || normalizeWebPreviewUrl(_0x46b76c)) {
        return;
      }
      _0x18845b?.["preventDefault"]?.();
      _0xa49be8(_0x467aa6, _0x46b76c, _0xd41c61);
    };
    const _0x391400 = (_0x2627af, _0x4365b3, ..._0x3fda3f) => {
      const _0xa32061 = _0x3fda3f["some"](_0x190351 => _0x190351 === !![]);
      if (!_0xa32061) {
        return;
      }
      _0x16d9d8(_0x2627af, _0x4365b3);
    };
    _0x5b6421['on']?.("will-navigate", _0x16d9d8);
    _0x5b6421['on']?.("will-frame-navigate", _0x391400);
    _0x5b6421['on']?.("did-fail-load", (_0x29f52a, _0x46abf0, _0x5d5b64, _0xb8fbcf) => {
      _0x202356(_0x467aa6, {
        'type': 'failed',
        'url': String(_0xb8fbcf || ''),
        'errorCode': _0x46abf0,
        'message': String(_0x5d5b64 || "Login popup load failed")
      }, _0xd41c61);
    });
    const _0x205386 = _0x5b6421["session"];
    _0x205386?.["setPermissionRequestHandler"]?.((_0x458b43, _0x303167, _0x2431e2) => {
      _0x2431e2(![]);
    });
    _0x205386?.['on']?.("will-download", _0x5d9742 => {
      _0x5d9742?.["preventDefault"]?.();
    });
  }
  function _0x159828({
    nodeId: _0x39d3ed,
    tabId: _0x201e4e,
    partition: _0x4bcf40,
    popupWindow: _0x18113f
  }) {
    const _0x357ab9 = _0x18113f?.['webContents'];
    if (!_0x18113f || !_0x357ab9) {
      return ![];
    }
    const _0x129318 = {
      'nodeId': _0x39d3ed,
      'tabId': _0x201e4e,
      'popupWindow': _0x18113f
    };
    _0x8002c["add"](_0x129318);
    const _0x21a03a = () => _0x8002c["delete"](_0x129318);
    _0x18113f['on']?.("closed", _0x21a03a);
    _0x357ab9['on']?.('destroyed', _0x21a03a);
    _0x11ef71({
      'nodeId': _0x39d3ed,
      'tabId': _0x201e4e,
      'partition': _0x4bcf40,
      'webContents': _0x357ab9
    });
    return !![];
  }
  function _0xe65d02(_0x28c96d, _0x68752e, _0x191364, _0x450cf1 = '') {
    _0x191364["setWindowOpenHandler"]?.(({
      url: _0x3c2ed4
    } = {}) => {
      const _0x1727d7 = normalizeWebPreviewUrl(_0x3c2ed4);
      const _0x525e28 = isBlankPopupUrl(_0x3c2ed4);
      if (!_0x1727d7 && !_0x525e28) {
        _0xa49be8(_0x28c96d, _0x3c2ed4, _0x68752e);
        return {
          'action': "deny"
        };
      }
      const _0xaceebc = _0x36ab9b["get"](toEntryKey(_0x28c96d, _0x68752e));
      const _0x1adf8a = _0x30b309(_0x28c96d);
      const _0x264479 = _0xaceebc?.["browserProfileId"] || DEFAULT_WEB_PREVIEW_BROWSER_PROFILE_ID;
      const _0x308905 = _0xaceebc?.["partition"] || toPersistentPartitionId(_0x264479);
      if (shouldUseNativeAuthPopup(_0x3c2ed4) && typeof _0x34f1b7 === "function") {
        _0x189576({
          'nodeId': _0x28c96d,
          'tabId': _0x68752e,
          'partition': _0x308905
        });
        return {
          'action': "allow",
          'outlivesOpener': !![],
          'overrideBrowserWindowOptions': _0x2e169b(_0x308905)
        };
      }
      if (typeof _0x34b371 !== "function") {
        if (_0x1727d7) {
          _0x202356(_0x28c96d, {
            'type': 'open-popup',
            'url': _0x1727d7
          }, _0x68752e);
        }
        return {
          'action': 'deny'
        };
      }
      return {
        'action': 'allow',
        'outlivesOpener': !![],
        'overrideBrowserWindowOptions': {
          'webPreferences': _0x272e50(_0x308905)
        },
        'createWindow': () => {
          const _0xc1feba = _0x281f10({
            'nodeId': _0x28c96d,
            'tabId': _0x1adf8a,
            'browserProfileId': _0x264479,
            'partition': _0x308905,
            'url': _0x1727d7 || '',
            'openerTabId': _0x68752e
          });
          if (_0x1727d7) {
            _0x584362(_0x28c96d, _0x1adf8a, _0xc1feba, _0x1727d7);
          } else {
            _0x40ab75(_0x28c96d, _0x1adf8a, _0xc1feba);
          }
          return _0xc1feba["view"]['webContents'];
        }
      };
    });
    _0x191364['on']?.("did-create-window", (_0x4f7995, _0x320cd5 = {}) => {
      const _0x5b98ee = _0x4ed8bd({
        'nodeId': _0x28c96d,
        'tabId': _0x68752e,
        'url': _0x320cd5?.['url']
      });
      if (!_0x5b98ee) {
        return;
      }
      _0x159828({
        'nodeId': _0x28c96d,
        'tabId': _0x68752e,
        'partition': _0x5b98ee["partition"],
        'popupWindow': _0x4f7995
      });
    });
    const _0x48bb6f = (_0x48c3a7, _0x32eb6a) => {
      const _0x285e07 = _0x36ab9b['get'](toEntryKey(_0x28c96d, _0x68752e));
      if (_0x285e07?.["isPopup"] && isBlankPopupUrl(_0x32eb6a) && !_0x285e07["requestedUrl"]) {
        return;
      }
      if (normalizeWebPreviewUrl(_0x32eb6a)) {
        return;
      }
      _0x48c3a7?.["preventDefault"]?.();
      _0xa49be8(_0x28c96d, _0x32eb6a, _0x68752e);
    };
    const _0x58cba8 = (_0x290769, _0x3003f7, ..._0x512917) => {
      const _0x18bb83 = _0x512917["some"](_0x11d492 => _0x11d492 === !![]);
      if (!_0x18bb83) {
        return;
      }
      _0x48bb6f(_0x290769, _0x3003f7);
    };
    _0x191364['on']?.("will-navigate", _0x48bb6f);
    _0x191364['on']?.("will-frame-navigate", _0x58cba8);
    _0x191364['on']?.("dom-ready", () => _0x3516b3(_0x28c96d, _0x191364, _0x68752e, _0x450cf1));
    _0x191364['on']?.('did-start-loading', () => {
      const _0x37189f = _0x36ab9b["get"](toEntryKey(_0x28c96d, _0x68752e));
      let _0xd2769e = '';
      let _0x30950c = ![];
      if (_0x37189f) {
        const _0x3ce70c = _0x37189f["url"] || _0x37189f["requestedUrl"] || '';
        _0xd2769e = _0x3ce70c;
        const _0x260183 = _0x37189f["holdSnapshotOnNextLoadStart"] === !![] && _0x37189f['hasSnapshot'] === !![] && _0x37189f["snapshotUrl"] && _0x37189f["snapshotUrl"] === _0x3ce70c;
        _0x30950c = Boolean(_0x260183);
        _0x6560de(_0x37189f);
        _0x37189f['snapshotEpoch'] += 0x1;
        _0x37189f["loaded"] = ![];
        _0x30950c ? _0x37189f["snapshotStaleAfterLoad"] = !![] : (_0x37189f['hasSnapshot'] = ![], _0x37189f["snapshotUrl"] = '', _0x37189f["snapshotFreezeToken"] = '', _0x37189f['snapshotStaleAfterLoad'] = ![]);
        _0x37189f["readySnapshotPending"] = ![];
        _0x37189f["holdSnapshotOnNextLoadStart"] = ![];
      }
      _0x202356(_0x28c96d, {
        'type': "loading",
        'url': _0xd2769e,
        'holdSnapshot': _0x30950c
      }, _0x68752e);
    });
    _0x191364['on']?.('did-stop-loading', () => {
      _0x3516b3(_0x28c96d, _0x191364, _0x68752e, _0x450cf1);
      _0x202356(_0x28c96d, {
        'type': 'loaded'
      }, _0x68752e);
      _0x3bfa50(_0x28c96d, _0x191364, _0x68752e);
      const _0x25e46c = _0x36ab9b["get"](toEntryKey(_0x28c96d, _0x68752e));
      _0x25e46c && (_0x25e46c["loaded"] = !![], _0x25e46c["snapshotStaleAfterLoad"] && (_0x25e46c["hasSnapshot"] = ![], _0x25e46c["snapshotUrl"] = '', _0x25e46c["snapshotFreezeToken"] = '', _0x25e46c["snapshotStaleAfterLoad"] = ![]), _0xa54887(_0x28c96d, _0x25e46c));
    });
    _0x191364['on']?.("did-fail-load", (_0x54adbc, _0x3d66ee, _0x563a58, _0x4dcc99) => {
      _0x202356(_0x28c96d, {
        'type': "failed",
        'url': String(_0x4dcc99 || ''),
        'errorCode': _0x3d66ee,
        'message': String(_0x563a58 || '网页加载失败')
      }, _0x68752e);
    });
    _0x191364['on']?.("did-navigate", (_0x378c6b, _0x105a64) => {
      const _0x54034d = _0x36ab9b["get"](toEntryKey(_0x28c96d, _0x68752e));
      if (_0x54034d?.["isPopup"] && isBlankPopupUrl(_0x105a64) && !_0x54034d["requestedUrl"]) {
        return;
      }
      const _0x548b68 = normalizeWebPreviewUrl(_0x105a64) || String(_0x105a64 || '');
      const _0x40df4d = normalizeWebPreviewUrl(_0x548b68);
      if (_0x54034d && _0x40df4d) {
        if (_0x584362(_0x28c96d, _0x68752e, _0x54034d, _0x40df4d)) {
          return;
        }
        const _0x14c378 = _0x54034d["pendingPopup"] === !![];
        _0x54034d["url"] = _0x40df4d;
        if (_0x14c378) {
          _0x54034d["requestedUrl"] = _0x40df4d;
        }
        _0x54034d["loadIssuedUrl"] = _0x40df4d;
        _0x54034d["pendingPopup"] = ![];
      }
      _0x202356(_0x28c96d, {
        'type': "navigated",
        'url': _0x548b68
      }, _0x68752e);
      _0x3bfa50(_0x28c96d, _0x191364, _0x68752e);
    });
    _0x191364['on']?.('did-navigate-in-page', (_0x57a3ee, _0x37679a, _0x146906) => {
      if (_0x146906 === ![]) {
        return;
      }
      const _0x32a271 = _0x36ab9b["get"](toEntryKey(_0x28c96d, _0x68752e));
      if (_0x32a271?.["isPopup"] && isBlankPopupUrl(_0x37679a) && !_0x32a271["requestedUrl"]) {
        return;
      }
      const _0x367fb3 = normalizeWebPreviewUrl(_0x37679a) || String(_0x37679a || '');
      const _0x123645 = normalizeWebPreviewUrl(_0x367fb3);
      if (_0x32a271 && _0x123645) {
        if (_0x584362(_0x28c96d, _0x68752e, _0x32a271, _0x123645)) {
          return;
        }
        const _0x469ce6 = _0x32a271["pendingPopup"] === !![];
        _0x32a271["url"] = _0x123645;
        if (_0x469ce6) {
          _0x32a271["requestedUrl"] = _0x123645;
        }
        _0x32a271["loadIssuedUrl"] = _0x123645;
        _0x32a271["pendingPopup"] = ![];
      }
      _0x202356(_0x28c96d, {
        'type': "navigated",
        'url': _0x367fb3
      }, _0x68752e);
      _0x3bfa50(_0x28c96d, _0x191364, _0x68752e);
    });
    _0x191364['on']?.("page-favicon-updated", (_0x47904c, _0x422d54) => {
      const _0x521a11 = _0xa61ebc(_0x422d54);
      if (!_0x521a11) {
        return;
      }
      _0x202356(_0x28c96d, {
        'type': "favicon",
        'faviconUrl': _0x521a11
      }, _0x68752e);
    });
    _0x191364['on']?.('context-menu', (_0x3f21e7, _0xcd4901) => {
      const _0x5f002a = _0x36ab9b['get'](toEntryKey(_0x28c96d, _0x68752e));
      if (_0x2e9540(_0x5f002a, _0xcd4901)) {
        return;
      }
      void _0x604e15(_0x28c96d, _0x68752e, _0x191364, _0xcd4901)['catch'](_0x91f60e => {
        _0x1e2ca8?.({
          'type': "web_preview.context_menu_failed",
          'level': "warn",
          'source': "main",
          'message': "Web preview context menu failed",
          'error': _0x91f60e,
          'context': {
            'nodeId': _0x28c96d,
            'tabId': _0x68752e
          }
        });
      });
    });
    _0x191364['on']?.("console-message", (..._0xa3f355) => {
      const _0x3b0ffd = parseWebPreviewInputBridgeMessage(getConsoleMessageFromArgs(_0xa3f355));
      if (!_0x3b0ffd) {
        return;
      }
      const _0x16fd56 = _0x36ab9b["get"](toEntryKey(_0x28c96d, _0x68752e));
      if (!_0x16fd56 || _0x3b0ffd['token'] !== _0x16fd56["inputBridgeToken"]) {
        return;
      }
      if (_0x3b0ffd["type"] === 'text-context-menu') {
        const _0x332ef1 = _0x5d19da(_0x3b0ffd, _0x16fd56);
        _0x2c4b49(_0x16fd56, _0x332ef1);
        void _0x604e15(_0x28c96d, _0x68752e, _0x191364, _0x332ef1)["catch"](_0x3ae43d => {
          _0x1e2ca8?.({
            'type': 'web_preview.context_menu_failed',
            'level': 'warn',
            'source': "main",
            'message': 'Web\x20preview\x20context\x20menu\x20failed',
            'error': _0x3ae43d,
            'context': {
              'nodeId': _0x28c96d,
              'tabId': _0x68752e,
              'source': 'bridge'
            }
          });
        });
        return;
      }
      if (_0x3b0ffd["type"] === 'image-context-menu') {
        const _0x3e7bb6 = _0x6523f3(_0x3b0ffd, _0x16fd56);
        _0x2c4b49(_0x16fd56, _0x3e7bb6);
        void _0x604e15(_0x28c96d, _0x68752e, _0x191364, _0x3e7bb6)["catch"](_0xa17f0c => {
          _0x1e2ca8?.({
            'type': 'web_preview.context_menu_failed',
            'level': "warn",
            'source': "main",
            'message': "Web preview context menu failed",
            'error': _0xa17f0c,
            'context': {
              'nodeId': _0x28c96d,
              'tabId': _0x68752e,
              'source': "bridge"
            }
          });
        });
        return;
      }
      const _0x5c97ac = Number(_0x3b0ffd["button"]);
      const _0x161e98 = _0x5c97ac === 0x1;
      const _0x412879 = _0x5c97ac === 0x0 && (_0x3b0ffd["spaceHeld"] === !![] || _0x16fd56["canvasSpaceHeld"] === !![]);
      if (!_0x161e98 && !_0x412879) {
        return;
      }
      _0x202356(_0x28c96d, {
        'type': "pan-start-preview",
        'source': "web-contents-view",
        'button': _0x5c97ac,
        'spaceHeld': _0x412879,
        'clientX': Math["max"](0x0, Math["round"](Number(_0x3b0ffd["clientX"] || 0x0) || 0x0)),
        'clientY': Math["max"](0x0, Math["round"](Number(_0x3b0ffd["clientY"] || 0x0) || 0x0))
      }, _0x68752e);
    });
    _0x191364['on']?.("destroyed", () => {
      const _0x183e34 = toEntryKey(_0x28c96d, _0x68752e);
      const _0x39ed32 = _0x36ab9b['get'](_0x183e34);
      if (!_0x39ed32 || _0x39ed32["disposing"]) {
        return;
      }
      const _0x45177d = _0x3ff188();
      try {
        _0x45177d?.["contentView"]?.['removeChildView']?.(_0x39ed32["view"]);
      } catch {}
      _0x6560de(_0x39ed32);
      _0x36ab9b['delete'](_0x183e34);
      if (_0x39ed32["isPopup"]) {
        _0x202356(_0x28c96d, {
          'type': 'closed'
        }, _0x68752e);
      }
    });
    const _0x23e80e = _0x191364["session"];
    _0x23e80e?.["setPermissionRequestHandler"]?.((_0x46f2e6, _0xfc0b74, _0x3dcb43) => {
      _0x3dcb43(![]);
    });
    _0x23e80e?.['on']?.("will-download", _0x583fcb => {
      _0x583fcb?.['preventDefault']?.();
    });
  }
  function _0x170e5d({
    nodeId: _0x3f54c7,
    tabId: _0x7516e8,
    browserProfileId: _0x59eea6,
    partition: _0x4377e5,
    view: _0x5b1e54,
    url = '',
    isPopup = ![],
    openerTabId = '',
    pendingRegistrationUntil = 0x0
  }) {
    _0x5b1e54["setVisible"]?.(![]);
    const _0x28df4b = createInputBridgeToken();
    const _0x437a89 = {
      'nodeId': _0x3f54c7,
      'tabId': _0x7516e8,
      'browserProfileId': _0x59eea6,
      'partition': _0x4377e5,
      'view': _0x5b1e54,
      'url': url,
      'requestedUrl': url,
      'loadIssuedUrl': '',
      'attached': ![],
      'bounds': null,
      'visible': ![],
      'selected': ![],
      'freezeToken': '',
      'snapshotPending': ![],
      'freezeHiddenWithSnapshot': ![],
      'readySnapshotPending': ![],
      'readySnapshotTimer': null,
      'holdSnapshotOnNextLoadStart': ![],
      'snapshotStaleAfterLoad': ![],
      'snapshotEpoch': 0x0,
      'loaded': ![],
      'hasSnapshot': ![],
      'snapshotUrl': '',
      'snapshotFreezeToken': '',
      'zoomFactor': 0x1,
      'canvasSpaceHeld': ![],
      'inputBridgeToken': _0x28df4b,
      'isPopup': isPopup,
      'openerTabId': openerTabId,
      'popupOpened': !isPopup,
      'pendingPopup': ![],
      'disposing': ![],
      'pendingRegistrationUntil': pendingRegistrationUntil
    };
    _0x36ab9b["set"](toEntryKey(_0x3f54c7, _0x7516e8), _0x437a89);
    _0xe65d02(_0x3f54c7, _0x7516e8, _0x5b1e54['webContents'], _0x28df4b);
    return _0x437a89;
  }
  function _0x1c2b29(_0x5c8457, _0x2d277f, _0x51ea61) {
    if (typeof _0x34b371 !== "function") {
      throw new Error("当前 Electron 环境不支持 WebContentsView");
    }
    const _0x4f8c3a = toBrowserProfileId(_0x51ea61);
    const _0x4ed116 = toPersistentPartitionId(_0x4f8c3a);
    const _0x31517b = new _0x34b371({
      'webPreferences': _0x272e50(_0x4ed116)
    });
    return _0x170e5d({
      'nodeId': _0x5c8457,
      'tabId': _0x2d277f,
      'browserProfileId': _0x4f8c3a,
      'partition': _0x4ed116,
      'view': _0x31517b
    });
  }
  function _0x281f10({
    nodeId: _0x34b062,
    tabId: _0x20c669,
    browserProfileId: _0x34e821,
    partition: _0x130773,
    url: _0x216cb7,
    openerTabId = ''
  }) {
    const _0x125b9b = toBrowserProfileId(_0x34e821);
    const _0x633f74 = _0x130773 || toPersistentPartitionId(_0x125b9b);
    const _0x5a4863 = new _0x34b371({
      'webPreferences': _0x272e50(_0x633f74)
    });
    return _0x170e5d({
      'nodeId': _0x34b062,
      'tabId': _0x20c669,
      'browserProfileId': _0x125b9b,
      'partition': _0x633f74,
      'view': _0x5a4863,
      'url': _0x216cb7,
      'isPopup': !![],
      'openerTabId': openerTabId,
      'pendingRegistrationUntil': Date['now']() + POPUP_REGISTRATION_GRACE_MS
    });
  }
  function _0x2077c0(_0x187c5d) {
    const _0x3a5d75 = _0x36ab9b['get'](_0x187c5d);
    if (!_0x3a5d75) {
      return ![];
    }
    const _0x2434fb = _0x3ff188();
    _0x743903(_0x152fd6 => _0x152fd6["nodeId"] === _0x3a5d75["nodeId"] && _0x152fd6['tabId'] === _0x3a5d75["tabId"]);
    try {
      _0x2434fb?.["contentView"]?.['removeChildView']?.(_0x3a5d75['view']);
    } catch {}
    _0x6560de(_0x3a5d75);
    _0x3a5d75["attached"] = ![];
    _0x3a5d75['visible'] = ![];
    _0x3a5d75["disposing"] = !![];
    try {
      !_0x3a5d75["view"]?.["webContents"]?.["isDestroyed"]?.() && _0x3a5d75['view']?.["webContents"]?.["destroy"]?.();
    } catch {}
    _0x36ab9b['delete'](_0x187c5d);
    return !![];
  }
  function _0x2b4cbf(_0x380ffe, _0x2b24dd = null) {
    if (_0x2b24dd !== null && typeof _0x2b24dd !== "undefined") {
      return _0x2077c0(toEntryKey(_0x380ffe, _0x2b24dd));
    }
    let _0x13ff76 = ![];
    for (const [_0x1db6c7, _0x81ca40] of [..._0x36ab9b]) {
      if (_0x81ca40["nodeId"] === _0x380ffe && _0x2077c0(_0x1db6c7)) {
        _0x13ff76 = !![];
      }
    }
    return _0x13ff76;
  }
  function _0x168969(_0x3cd76e) {
    const _0x54d781 = _0x36ab9b["get"](_0x3cd76e);
    if (!_0x54d781) {
      return;
    }
    _0x54d781["visible"] !== ![] && (_0x54d781["view"]?.['setVisible']?.(![]), _0x54d781["visible"] = ![]);
  }
  async function _0xb16785(_0x1e99ff = {}) {
    const _0x2b9210 = _0x3ff188();
    if (!_0x2b9210?.["contentView"]) {
      return {
        'ok': ![],
        'error': "主窗口尚未就绪"
      };
    }
    _0xadd5ab = normalizeWebPreviewContextMenuShortcuts(_0x1e99ff?.["contextMenuShortcuts"]);
    const _0x1bcab6 = new Set();
    const _0x41c237 = getViewsPayload(_0x1e99ff);
    let _0x5a3f8f = 0x0;
    let _0x2b60c9 = ![];
    const _0x23752e = [];
    for (const _0x3d887b of _0x41c237) {
      const _0x203298 = toNodeId(_0x3d887b?.["nodeId"]);
      if (!_0x203298) {
        continue;
      }
      const _0x42bec4 = toTabId(_0x3d887b?.["tabId"]);
      const _0xebc7ec = toEntryKey(_0x203298, _0x42bec4);
      _0x1bcab6["add"](_0xebc7ec);
      const _0xa217e3 = normalizeWebPreviewUrl(_0x3d887b?.["webUrl"] || _0x3d887b?.["url"]);
      if (!_0xa217e3) {
        if (_0x3d887b?.["pendingPopup"] === !![]) {
          const _0x17d8d7 = _0x36ab9b["get"](_0xebc7ec);
          if (!_0x17d8d7?.["isPopup"] || _0x17d8d7["requestedUrl"]) {
            _0x202356(_0x203298, {
              'type': "failed",
              'message': '登录窗口尚未就绪'
            }, _0x42bec4);
            continue;
          }
          if (_0x3d887b?.["visible"] === ![]) {
            _0x168969(_0xebc7ec);
            continue;
          }
          const _0x4ac8ef = normalizeBounds(_0x3d887b?.["bounds"]);
          if (!_0x4ac8ef) {
            _0x168969(_0xebc7ec);
            continue;
          }
          _0x17d8d7['pendingRegistrationUntil'] = 0x0;
          const _0x2c809c = Boolean(_0x3d887b?.["selected"]);
          _0x17d8d7['selected'] !== _0x2c809c && (_0x17d8d7["selected"] = _0x2c809c, _0x2b60c9 = !![]);
          _0x17d8d7["canvasSpaceHeld"] = _0x3d887b?.["canvasSpaceHeld"] === !![];
          !_0x17d8d7["attached"] && (_0x2b9210["contentView"]["addChildView"](_0x17d8d7["view"]), _0x17d8d7["attached"] = !![], _0x2b60c9 = !![]);
          _0x23752e["push"](_0xebc7ec);
          !boundsEqual(_0x17d8d7["bounds"], _0x4ac8ef) && (_0x17d8d7["bounds"] = _0x4ac8ef, _0x17d8d7["view"]["setBounds"](_0x4ac8ef));
          const _0x551027 = normalizeZoomFactor(_0x3d887b?.["zoomFactor"]);
          _0x17d8d7["pendingZoomFactor"] = _0x551027;
          _0x3d887b?.["deferZoomFactor"] !== !![] && !zoomFactorEqual(_0x17d8d7['zoomFactor'], _0x551027) && (_0x17d8d7["zoomFactor"] = _0x551027, _0x17d8d7['view']["webContents"]["setZoomFactor"]?.(_0x551027));
          _0x17d8d7['visible'] !== !![] && (_0x17d8d7["view"]['setVisible']?.(!![]), _0x17d8d7['visible'] = !![]);
          _0x5a3f8f += 0x1;
          continue;
        }
        _0x2077c0(_0xebc7ec);
        _0x202356(_0x203298, {
          'type': "failed",
          'message': "网页地址无效"
        }, _0x42bec4);
        continue;
      }
      if (_0x3d887b?.["visible"] === ![]) {
        const _0x1cb643 = _0x36ab9b["get"](_0xebc7ec);
        if (_0x1cb643) {
          _0x1cb643['pendingRegistrationUntil'] = 0x0;
          const _0x1f2462 = _0x3d887b?.["frozen"] === !![] && _0x3d887b?.["showSnapshot"] === !![] && _0x1cb643["requestedUrl"] === _0xa217e3;
          if (_0x1f2462) {
            _0x6560de(_0x1cb643);
            const _0x262172 = String(_0x3d887b?.['freezeToken'] || '0');
            _0x1cb643["freezeToken"] !== _0x262172 && (_0x1cb643['freezeToken'] = _0x262172, _0x1cb643["freezeHiddenWithSnapshot"] = ![]);
            const _0x250b9f = _0x1cb643["hasSnapshot"] === !![] && _0x1cb643['snapshotUrl'] === _0xa217e3;
            const _0x4d0277 = _0x250b9f && _0x1cb643["snapshotFreezeToken"] === _0x262172;
            const _0x50e69c = _0x250b9f && _0x1cb643["snapshotFreezeToken"] === 'ready' && _0x3d887b?.["allowReusableSnapshot"] === !![] && _0x3d887b?.["snapshotReady"] === !![];
            const _0x38d81f = (_0x4d0277 || _0x50e69c) && (_0x3d887b?.['snapshotReady'] === !![] || _0x1cb643["freezeHiddenWithSnapshot"] === !![]);
            if (_0x38d81f) {
              _0x1cb643['snapshotPending'] = ![];
              _0x1cb643["freezeHiddenWithSnapshot"] = !![];
              _0x168969(_0xebc7ec);
              continue;
            }
            _0x1cb643['freezeHiddenWithSnapshot'] = ![];
            const _0x5c3a82 = normalizeBounds(_0x3d887b?.["snapshotBounds"]) || _0x1cb643["bounds"];
            if (_0x5c3a82) {
              !_0x1cb643["attached"] && (_0x2b9210["contentView"]["addChildView"](_0x1cb643["view"]), _0x1cb643["attached"] = !![], _0x2b60c9 = !![]);
              !boundsEqual(_0x1cb643['bounds'], _0x5c3a82) && (_0x1cb643["bounds"] = _0x5c3a82, _0x1cb643["view"]["setBounds"](_0x5c3a82));
              const _0x2e79e4 = normalizeZoomFactor(_0x3d887b?.['zoomFactor']);
              _0x1cb643["pendingZoomFactor"] = _0x2e79e4;
              _0x3d887b?.['deferZoomFactor'] !== !![] && !zoomFactorEqual(_0x1cb643["zoomFactor"], _0x2e79e4) && (_0x1cb643["zoomFactor"] = _0x2e79e4, _0x1cb643["view"]["webContents"]["setZoomFactor"]?.(_0x2e79e4));
              _0x1cb643["visible"] !== !![] && (_0x1cb643["view"]["setVisible"]?.(!![]), _0x1cb643["visible"] = !![]);
              if (_0x3d887b?.['snapshotHold'] !== !![] && _0x1cb643["snapshotPending"] !== !![] && !_0x4d0277) {
                const _0x5648b0 = _0x34cf40(_0x203298, _0x1cb643, _0x262172, () => {
                  const _0x1a85c4 = _0x36ab9b['get'](_0xebc7ec);
                  if (_0x1a85c4 === _0x1cb643) {
                    _0x1a85c4["snapshotPending"] = ![];
                  }
                }, _0xa217e3);
                _0x1cb643["snapshotPending"] = _0x5648b0;
              }
              _0x5a3f8f += 0x1;
              continue;
            }
          }
          _0x1cb643["freezeToken"] = '';
          _0x1cb643["snapshotPending"] = ![];
          _0x1cb643['freezeHiddenWithSnapshot'] = ![];
        }
        _0x168969(_0xebc7ec);
        continue;
      }
      const _0x2a5b52 = normalizeBounds(_0x3d887b?.["bounds"]);
      if (!_0x2a5b52) {
        _0x168969(_0xebc7ec);
        continue;
      }
      const _0x466699 = toBrowserProfileId(_0x3d887b?.["browserProfileId"]);
      const _0x36dbc1 = toPersistentPartitionId(_0x466699);
      let _0x2ab859 = _0x36ab9b["get"](_0xebc7ec);
      _0x2ab859 && _0x2ab859["partition"] !== _0x36dbc1 && (_0x2077c0(_0xebc7ec), _0x2ab859 = null, _0x2b60c9 = !![]);
      !_0x2ab859 && (_0x2ab859 = _0x1c2b29(_0x203298, _0x42bec4, _0x466699), _0x2b60c9 = !![]);
      _0x2ab859["pendingRegistrationUntil"] = 0x0;
      const _0xea6697 = Boolean(_0x3d887b?.["selected"]);
      _0x2ab859["selected"] !== _0xea6697 && (_0x2ab859['selected'] = _0xea6697, _0x2b60c9 = !![]);
      _0x2ab859['canvasSpaceHeld'] = _0x3d887b?.["canvasSpaceHeld"] === !![];
      !_0x2ab859['attached'] && (_0x2b9210['contentView']["addChildView"](_0x2ab859["view"]), _0x2ab859["attached"] = !![], _0x2b60c9 = !![]);
      _0x23752e["push"](_0xebc7ec);
      const _0xe5a439 = String(_0x3d887b?.["freezeToken"] || '0');
      const _0x289887 = _0x3d887b?.["frozen"] === !![] && _0x2ab859['requestedUrl'] === _0xa217e3;
      if (_0x289887) {
        _0x6560de(_0x2ab859);
        _0x2ab859["freezeToken"] !== _0xe5a439 && (_0x2ab859["freezeToken"] = _0xe5a439, _0x2ab859['freezeHiddenWithSnapshot'] = ![]);
        const _0x537027 = _0x2ab859["hasSnapshot"] === !![] && _0x2ab859['snapshotUrl'] === _0xa217e3;
        const _0x39201a = _0x537027 && _0x2ab859["snapshotFreezeToken"] === _0xe5a439;
        const _0x53cb6a = _0x537027 && _0x2ab859["snapshotFreezeToken"] === "ready" && _0x3d887b?.["snapshotReady"] === !![];
        const _0x216861 = (_0x39201a || _0x53cb6a) && (_0x3d887b?.['snapshotReady'] === !![] || _0x2ab859["freezeHiddenWithSnapshot"] === !![]);
        if (_0x216861) {
          _0x2ab859["snapshotPending"] = ![];
          _0x2ab859['freezeHiddenWithSnapshot'] = !![];
          _0x168969(_0xebc7ec);
        } else {
          _0x2ab859["freezeHiddenWithSnapshot"] = ![];
          !boundsEqual(_0x2ab859['bounds'], _0x2a5b52) && (_0x2ab859["bounds"] = _0x2a5b52, _0x2ab859["view"]["setBounds"](_0x2a5b52));
          _0x2ab859["visible"] !== !![] && (_0x2ab859['view']["setVisible"]?.(!![]), _0x2ab859['visible'] = !![]);
          if (_0x3d887b?.["snapshotHold"] !== !![] && _0x2ab859['snapshotPending'] !== !![] && !_0x39201a) {
            const _0x258e7d = _0x34cf40(_0x203298, _0x2ab859, _0xe5a439, () => {
              const _0x58724a = _0x36ab9b["get"](_0xebc7ec);
              if (_0x58724a === _0x2ab859) {
                _0x58724a["snapshotPending"] = ![];
              }
            }, _0xa217e3);
            _0x2ab859["snapshotPending"] = _0x258e7d;
          }
        }
        _0x5a3f8f += 0x1;
        continue;
      }
      _0x2ab859["freezeToken"] = '';
      _0x2ab859["snapshotPending"] = ![];
      _0x2ab859["freezeHiddenWithSnapshot"] = ![];
      !boundsEqual(_0x2ab859['bounds'], _0x2a5b52) && (_0x2ab859["bounds"] = _0x2a5b52, _0x2ab859['view']["setBounds"](_0x2a5b52));
      const _0x5376d0 = normalizeZoomFactor(_0x3d887b?.['zoomFactor']);
      _0x2ab859['pendingZoomFactor'] = _0x5376d0;
      _0x3d887b?.["deferZoomFactor"] !== !![] && !zoomFactorEqual(_0x2ab859["zoomFactor"], _0x5376d0) && (_0x2ab859["zoomFactor"] = _0x5376d0, _0x2ab859['view']["webContents"]["setZoomFactor"]?.(_0x5376d0));
      _0x2ab859['visible'] !== !![] && (_0x2ab859["view"]["setVisible"]?.(!![]), _0x2ab859['visible'] = !![]);
      _0xa54887(_0x203298, _0x2ab859);
      _0x5a3f8f += 0x1;
      const _0x498034 = _0x2ab859["url"] === _0xa217e3 || _0x2ab859['loadIssuedUrl'] === _0xa217e3;
      const _0x35b610 = _0x2ab859["requestedUrl"] !== _0xa217e3 && !_0x498034 || _0x2ab859["isPopup"] && _0x2ab859['requestedUrl'] === _0xa217e3 && _0x2ab859["loadIssuedUrl"] !== _0xa217e3 && _0x2ab859["loaded"] !== !![];
      !_0x35b610 && _0x2ab859['requestedUrl'] !== _0xa217e3 && _0x498034 && (_0x2ab859["requestedUrl"] = _0xa217e3);
      if (_0x35b610) {
        _0x6560de(_0x2ab859);
        _0x2ab859["requestedUrl"] = _0xa217e3;
        _0x2ab859["url"] = _0xa217e3;
        _0x2ab859["loadIssuedUrl"] = _0xa217e3;
        _0x2ab859["snapshotEpoch"] += 0x1;
        _0x2ab859['loaded'] = ![];
        _0x2ab859["hasSnapshot"] = ![];
        _0x2ab859["snapshotUrl"] = '';
        _0x2ab859["snapshotFreezeToken"] = '';
        _0x2ab859["readySnapshotPending"] = ![];
        _0x2ab859["holdSnapshotOnNextLoadStart"] = ![];
        _0x2ab859["snapshotStaleAfterLoad"] = ![];
        try {
          const _0x53bbd5 = _0x2ab859["view"]['webContents']['loadURL'](_0xa217e3);
          _0x53bbd5 && typeof _0x53bbd5["catch"] === "function" && void _0x53bbd5["catch"](_0x31986b => {
            _0x1e2ca8?.({
              'type': "web_preview.load_failed",
              'level': "warn",
              'source': "main",
              'message': "Web preview loadURL failed",
              'error': _0x31986b,
              'context': {
                'nodeId': _0x203298,
                'tabId': _0x42bec4
              }
            });
            _0x202356(_0x203298, {
              'type': "failed",
              'url': _0xa217e3,
              'message': String(_0x31986b?.["message"] || "网页加载失败")
            }, _0x42bec4);
          });
        } catch (_0x35ea46) {
          _0x1e2ca8?.({
            'type': "web_preview.load_failed",
            'level': "warn",
            'source': "main",
            'message': "Web preview loadURL failed",
            'error': _0x35ea46,
            'context': {
              'nodeId': _0x203298,
              'tabId': _0x42bec4
            }
          });
          _0x202356(_0x203298, {
            'type': "failed",
            'url': _0xa217e3,
            'message': String(_0x35ea46?.["message"] || "网页加载失败")
          }, _0x42bec4);
        }
      }
    }
    if (_0x2b60c9) {
      for (const _0x18d0f8 of _0x23752e) {
        const _0x21d6a9 = _0x36ab9b['get'](_0x18d0f8);
        _0x21d6a9?.["view"] && _0x21d6a9["attached"] && _0x2b9210['contentView']["addChildView"](_0x21d6a9["view"]);
      }
    }
    const _0x36daed = Date["now"]();
    for (const _0x3e9071 of [..._0x36ab9b["keys"]()]) {
      if (_0x1bcab6["has"](_0x3e9071)) {
        continue;
      }
      const _0x29c195 = _0x36ab9b['get'](_0x3e9071);
      if (_0x29c195?.["pendingRegistrationUntil"] > _0x36daed) {
        continue;
      }
      _0x2077c0(_0x3e9071);
    }
    return {
      'ok': !![],
      'count': _0x36ab9b["size"],
      'visibleCount': _0x5a3f8f
    };
  }
  function _0x3c4688(_0x49298a = {}) {
    const _0x2d00bf = Array["isArray"](_0x49298a?.["nodeIds"]) ? _0x49298a["nodeIds"]["map"](toNodeId)["filter"](Boolean) : [];
    const _0x3d2123 = Array["isArray"](_0x49298a?.["tabIds"]) ? _0x49298a['tabIds']['map'](toTabId)["filter"](Boolean) : [];
    let _0x416a6c = 0x0;
    if (_0x2d00bf['length'] > 0x0 && _0x3d2123["length"] > 0x0) {
      for (const _0x4b528c of _0x2d00bf) {
        for (const _0x385777 of _0x3d2123) {
          if (_0x2b4cbf(_0x4b528c, _0x385777)) {
            _0x416a6c += 0x1;
          }
        }
      }
      _0x743903(_0x3dca52 => _0x2d00bf["includes"](_0x3dca52["nodeId"]) && _0x3d2123['includes'](_0x3dca52["tabId"]));
    } else {
      if (_0x2d00bf["length"] > 0x0) {
        for (const _0x469b91 of _0x2d00bf) {
          for (const [_0x25b135, _0x3bc67d] of [..._0x36ab9b]) {
            if (_0x3bc67d["nodeId"] === _0x469b91 && _0x2077c0(_0x25b135)) {
              _0x416a6c += 0x1;
            }
          }
        }
        _0x743903(_0x318a4f => _0x2d00bf['includes'](_0x318a4f["nodeId"]));
      } else {
        for (const _0x3f87a5 of [..._0x36ab9b["keys"]()]) {
          if (_0x2077c0(_0x3f87a5)) {
            _0x416a6c += 0x1;
          }
        }
        _0x743903();
      }
    }
    return {
      'ok': !![],
      'disposed': _0x416a6c
    };
  }
  function _0x21de87(_0x57b726, _0x5c2e7b, _0x5203c7) {
    return Promise["resolve"](_0x57b726['executeJavaScript'](buildWebPreviewImageExtractionScript({
      'nodeId': _0x5c2e7b,
      'tabId': _0x5203c7
    }), !![]))["then"](_0x2eac6c => ({
      'ok': !![],
      'images': filterExtractedImageCandidates(_0x2eac6c?.["images"]),
      'pageUrl': String(_0x2eac6c?.["pageUrl"] || ''),
      'pageTitle': String(_0x2eac6c?.['pageTitle'] || '')
    }))['catch'](_0x233003 => {
      _0x1e2ca8?.({
        'type': "web_preview.extract_images_failed",
        'level': "warn",
        'source': 'main',
        'message': "Web preview image extraction failed",
        'error': _0x233003,
        'context': {
          'nodeId': _0x5c2e7b,
          'tabId': _0x5203c7
        }
      });
      return {
        'ok': ![],
        'error': "extract-failed",
        'images': []
      };
    });
  }
  function _0xa74697(_0x1053ab, _0x438c3c, _0x4248b0) {
    return Promise["resolve"](_0x1053ab["executeJavaScript"](buildWebPreviewVideoExtractionScript({
      'nodeId': _0x438c3c,
      'tabId': _0x4248b0
    }), !![]))["then"](_0x3a70cb => ({
      'ok': !![],
      'videos': filterExtractedVideoCandidates(_0x3a70cb?.["videos"]),
      'douyinDetailApiUrls': Array['isArray'](_0x3a70cb?.['douyinDetailApiUrls']) ? _0x3a70cb["douyinDetailApiUrls"] : [],
      'pageUrl': String(_0x3a70cb?.["pageUrl"] || ''),
      'pageTitle': String(_0x3a70cb?.["pageTitle"] || '')
    }))["catch"](_0x3ce03c => {
      _0x1e2ca8?.({
        'type': "web_preview.extract_videos_failed",
        'level': 'warn',
        'source': "main",
        'message': "Web preview video extraction failed",
        'error': _0x3ce03c,
        'context': {
          'nodeId': _0x438c3c,
          'tabId': _0x4248b0
        }
      });
      return {
        'ok': ![],
        'error': "extract-failed",
        'videos': [],
        'douyinDetailApiUrls': []
      };
    });
  }
  function _0x153580(_0x226cd0 = {}) {
    const _0x22eba9 = toNodeId(_0x226cd0?.['nodeId']);
    const _0x35d8c1 = toTabId(_0x226cd0?.["tabId"]);
    const _0x32e0dc = String(_0x226cd0?.["action"] || '')["trim"]();
    if (!_0x22eba9) {
      return {
        'ok': ![],
        'error': "missing-node"
      };
    }
    const _0x4c5853 = _0x36ab9b["get"](toEntryKey(_0x22eba9, _0x35d8c1));
    if (!_0x4c5853?.["view"]?.["webContents"] || _0x4c5853["view"]["webContents"]["isDestroyed"]?.()) {
      return {
        'ok': ![],
        'error': "missing-view"
      };
    }
    const _0x112e32 = _0x4c5853["view"]["webContents"];
    if (_0x32e0dc === 'back') {
      if (!_0x112e32["canGoBack"]?.()) {
        _0x202356(_0x22eba9, {
          'type': 'blocked',
          'message': "没有上一页"
        }, _0x35d8c1);
        return {
          'ok': ![],
          'error': "no-history",
          ...getNavigationState(_0x112e32)
        };
      }
      _0x112e32["goBack"]?.();
    } else {
      if (_0x32e0dc === "forward") {
        if (!_0x112e32['canGoForward']?.()) {
          _0x202356(_0x22eba9, {
            'type': 'blocked',
            'message': '没有下一页'
          }, _0x35d8c1);
          return {
            'ok': ![],
            'error': 'no-history',
            ...getNavigationState(_0x112e32)
          };
        }
        _0x112e32['goForward']?.();
      } else {
        if (_0x32e0dc === "reload") {
          const _0x47ef6f = _0x4c5853['url'] || _0x4c5853['requestedUrl'] || '';
          _0x4c5853['holdSnapshotOnNextLoadStart'] = Boolean(_0x4c5853["hasSnapshot"] === !![] && _0x4c5853["snapshotUrl"] && _0x47ef6f && _0x4c5853["snapshotUrl"] === _0x47ef6f);
          _0x4c5853["snapshotStaleAfterLoad"] = ![];
          if (typeof _0x112e32["reloadIgnoringCache"] === "function") {
            _0x112e32["reloadIgnoringCache"]();
          } else {
            if (typeof _0x112e32["reload"] === "function") {
              _0x112e32['reload']();
            } else {
              (_0x4c5853['url'] || _0x4c5853['requestedUrl']) && void _0x112e32['loadURL']?.(_0x4c5853["url"] || _0x4c5853["requestedUrl"]);
            }
          }
        } else {
          if (_0x32e0dc === "extract-media") {
            if (typeof _0x112e32["executeJavaScript"] !== "function") {
              return {
                'ok': ![],
                'error': "unsupported-action"
              };
            }
            return Promise["all"]([_0x21de87(_0x112e32, _0x22eba9, _0x35d8c1), _0xa74697(_0x112e32, _0x22eba9, _0x35d8c1)])["then"](async ([_0x509fcf, _0x4f065f]) => {
              if (_0x509fcf?.['ok'] === ![] && _0x4f065f?.['ok'] === ![]) {
                return {
                  'ok': ![],
                  'error': "extract-failed"
                };
              }
              const _0xc09a71 = String(_0x4f065f?.["pageUrl"] || _0x509fcf?.["pageUrl"] || _0x4c5853["url"] || _0x4c5853["requestedUrl"] || '');
              const _0x4f7916 = String(_0x4f065f?.["pageTitle"] || _0x509fcf?.['pageTitle'] || '');
              let _0x4cfae7 = {
                'images': [],
                'videos': [],
                'detailApiUrls': [],
                'fetchedCount': 0x0
              };
              if (typeof resolveDouyinMedia === "function") {
                try {
                  _0x4cfae7 = (await resolveDouyinMedia({
                    'pageUrl': _0xc09a71,
                    'pageTitle': _0x4f7916,
                    'nodeId': _0x22eba9,
                    'tabId': _0x35d8c1,
                    'imageResult': _0x509fcf,
                    'videoResult': _0x4f065f,
                    'webContents': _0x112e32,
                    'logDiagnosticEvent': _0x1e2ca8
                  })) || _0x4cfae7;
                } catch (_0x27deda) {
                  _0x1e2ca8?.({
                    'type': "web_preview.douyin_media_resolve_failed",
                    'level': 'warn',
                    'source': 'main',
                    'message': 'Douyin\x20media\x20resolver\x20failed',
                    'error': _0x27deda,
                    'context': {
                      'nodeId': _0x22eba9,
                      'tabId': _0x35d8c1,
                      'pageUrl': _0xc09a71
                    }
                  });
                }
              }
              return {
                'ok': !![],
                'action': _0x32e0dc,
                ...(_0x226cd0?.["tabId"] ? {
                  'tabId': _0x35d8c1
                } : {}),
                'images': mergeExtractedImageCandidates(_0x4cfae7?.["images"], _0x509fcf?.['images']),
                'videos': mergeExtractedVideoCandidates(_0x4cfae7?.["videos"], _0x4f065f?.["videos"]),
                'pageUrl': _0xc09a71,
                'pageTitle': _0x4f7916,
                'douyin': {
                  'detailApiUrls': Array["isArray"](_0x4cfae7?.["detailApiUrls"]) ? _0x4cfae7['detailApiUrls'] : [],
                  'fetchedCount': Number(_0x4cfae7?.["fetchedCount"] || 0x0) || 0x0
                },
                ...getNavigationState(_0x112e32)
              };
            });
          } else {
            if (_0x32e0dc === "extract-images") {
              if (typeof _0x112e32["executeJavaScript"] !== "function") {
                return {
                  'ok': ![],
                  'error': "unsupported-action"
                };
              }
              return _0x21de87(_0x112e32, _0x22eba9, _0x35d8c1)["then"](_0x22e393 => _0x22e393['ok'] === ![] ? {
                'ok': ![],
                'error': _0x22e393['error'] || "extract-failed"
              } : {
                'ok': !![],
                'action': _0x32e0dc,
                ...(_0x226cd0?.["tabId"] ? {
                  'tabId': _0x35d8c1
                } : {}),
                'images': _0x22e393["images"],
                'pageUrl': String(_0x22e393["pageUrl"] || _0x4c5853["url"] || _0x4c5853["requestedUrl"] || ''),
                'pageTitle': String(_0x22e393?.["pageTitle"] || ''),
                ...getNavigationState(_0x112e32)
              });
            } else {
              if (_0x32e0dc === "extract-videos") {
                if (typeof _0x112e32["executeJavaScript"] !== "function") {
                  return {
                    'ok': ![],
                    'error': 'unsupported-action'
                  };
                }
                return _0xa74697(_0x112e32, _0x22eba9, _0x35d8c1)["then"](_0x31b8cd => _0x31b8cd['ok'] === ![] ? {
                  'ok': ![],
                  'error': _0x31b8cd["error"] || "extract-failed"
                } : {
                  'ok': !![],
                  'action': _0x32e0dc,
                  ...(_0x226cd0?.["tabId"] ? {
                    'tabId': _0x35d8c1
                  } : {}),
                  'videos': _0x31b8cd["videos"],
                  'pageUrl': String(_0x31b8cd["pageUrl"] || _0x4c5853["url"] || _0x4c5853["requestedUrl"] || ''),
                  'pageTitle': String(_0x31b8cd?.["pageTitle"] || ''),
                  ...getNavigationState(_0x112e32)
                });
              } else {
                if (_0x32e0dc === "capture-reference") {
                  if (typeof _0x112e32["executeJavaScript"] !== "function" || typeof _0x112e32['capturePage'] !== "function") {
                    return {
                      'ok': ![],
                      'error': "unsupported-action"
                    };
                  }
                  return Promise["all"]([Promise["resolve"](_0x112e32['executeJavaScript'](buildWebPreviewReferenceSnapshotScript(), !![])), Promise["resolve"](_0x112e32["capturePage"]())['then'](_0x9e01ea => _0x9e01ea?.["toDataURL"]?.() || '')])["then"](([_0x28f7de, _0x3589aa]) => ({
                    'ok': !![],
                    'action': _0x32e0dc,
                    ...(_0x226cd0?.["tabId"] ? {
                      'tabId': _0x35d8c1
                    } : {}),
                    'pageUrl': String(_0x28f7de?.['pageUrl'] || _0x4c5853["url"] || _0x4c5853["requestedUrl"] || ''),
                    'pageTitle': String(_0x28f7de?.['pageTitle'] || _0x112e32['getTitle']?.() || ''),
                    'selectedText': String(_0x28f7de?.["selectedText"] || '')["slice"](0x0, WEB_PREVIEW_SELECTED_TEXT_LIMIT),
                    'screenshotDataUrl': String(_0x3589aa || ''),
                    'capturedAt': new Date()["toISOString"](),
                    ...getNavigationState(_0x112e32)
                  }))['catch'](_0x166a83 => {
                    _0x1e2ca8?.({
                      'type': "web_preview.capture_reference_failed",
                      'level': "warn",
                      'source': "main",
                      'message': 'Web\x20preview\x20reference\x20capture\x20failed',
                      'error': _0x166a83,
                      'context': {
                        'nodeId': _0x22eba9,
                        'tabId': _0x35d8c1
                      }
                    });
                    return {
                      'ok': ![],
                      'error': "capture-failed"
                    };
                  });
                } else {
                  return {
                    'ok': ![],
                    'error': "unknown-action"
                  };
                }
              }
            }
          }
        }
      }
    }
    _0x3bfa50(_0x22eba9, _0x112e32, _0x35d8c1);
    return {
      'ok': !![],
      'action': _0x32e0dc,
      ...(_0x226cd0?.["tabId"] ? {
        'tabId': _0x35d8c1
      } : {}),
      ...getNavigationState(_0x112e32)
    };
  }
  return {
    'syncViews': _0xb16785,
    'disposeViews': _0x3c4688,
    'controlView': _0x153580,
    'getEntryCount': () => _0x36ab9b["size"],
    '_getEntry': (_0x2d4f28, _0x3477d1 = "default") => _0x36ab9b["get"](toEntryKey(_0x2d4f28, _0x3477d1))
  };
}