import { deleteAssetFromServer, deleteOutputFilesFromServer, fetchAssetsFromServer, fetchOutputFilesFromServer, saveAssetToServer, saveOutputVideoThumbnailToServer } from '../../api/projectsV2Api.js';
import { ensureVideoResultThumbnail } from '../../api/videoResultThumbnailApi.js';
import a1058_0x55effd from '../core/stores/appStore.js';
import { findAvailablePosition, generateId, screenToWorld } from '../core/math.js';
import { getNodeDefaultSize } from '../services/fileService.js';
import { GENERATION_HISTORY_EVENT, GENERATION_HISTORY_MEDIA_KINDS, buildGenerationHistoryAssetsFromNode, isGenerationHistoryAsset } from './generationHistoryAssets.js';
import { normalizeFileManagerSourceNodeForCanvas } from './generationHistoryFileManagerSizing.js';
import { applyGenerationHistoryVideoThumbnail, createVideoThumbnailRequestQueue, resolveGenerationHistoryVideoPresentation } from './generationHistoryVideoThumbnails.js';
import { buildFileManagerHistoryEntryKey, dedupeFileManagerHistoryRecords, getFileManagerMenuActions, getFileManagerSelectionAfterClick, isFileManagerBackfillDuplicate, isFileManagerHistoryRecordVisible, isActionableFileManagerMediaKind, resolveFileManagerBackfillStartedAt } from './generationHistoryFileManagerSelection.js';
import { registerSidebarSubmenu } from './sidebarSubmenuController.js';
import { showContextMenu } from './interaction/contextMenuPresenter.js';
import { openImagePreview, openVideoPreview } from './imagePreview.js';
import { canShowItemInFolder, showItemInFolder } from '../services/nativeFileActionService.js';
import { localPathToUrl, normalizeLocalPath } from '../utils/localMediaPath.js';
import { attachMediaElementPlaybackSource, clearDesktopMediaPlaybackSourceMetadata } from '../services/desktopMediaBlobSource.js';
import { onLocaleChange, t } from '../i18n/index.js';
const FILE_FILTERS = Object["freeze"]([{
  'key': "all",
  'labelKey': "filters.all"
}, {
  'key': 'image',
  'labelKey': "filters.image"
}, {
  'key': "video",
  'labelKey': 'filters.video'
}, {
  'key': "audio",
  'labelKey': 'filters.audio'
}]);
const FILE_SOURCES = Object['freeze']([{
  'key': 'current-canvas',
  'labelKey': 'sources.currentCanvas'
}, {
  'key': "history",
  'labelKey': "sources.history"
}, {
  'key': 'output',
  'labelKey': 'sources.output'
}]);
const FILE_MANAGER_SIDEBAR_KEY = "files";
const FILE_MANAGER_KEEP_OPEN_SELECTOR = "[data-sidebar-submenu-owner=\"" + FILE_MANAGER_SIDEBAR_KEY + '\x22],\x20#file-manager-delete-confirm-overlay';
const FILE_PANEL_RESIZE = Object['freeze']({
  'minWidth': 0x230,
  'defaultWidth': 0x2f8,
  'maxViewportGap': 0x18
});
const FILE_MASONRY = Object["freeze"]({
  'gap': 0x10,
  'placementStep': 0x8,
  'fixedShortSide': 0x96,
  'defaultShortSide': 0x104,
  'maxLongSide': 0x230
});
const FILE_HISTORY_PAGE_SIZE = 0x50;
const FILE_OUTPUT_PAGE_SIZE = 0x50;
const FILE_HISTORY_SCROLL_PREFETCH_PX = 0x168;
function fileManagerText(_0x384787, _0x3ef665 = {}) {
  return t('generationHistoryFileManager.' + _0x384787, _0x3ef665);
}
function isHistorySource(_0x52ad16) {
  const _0x3d699e = String(_0x52ad16 || '')['trim']();
  return _0x3d699e === "current-canvas" || _0x3d699e === "history";
}
function normalizeProjectId(_0xff5257) {
  return String(_0xff5257 || '')["trim"]() || "default_v2_project";
}
function resolveThumbSrc(_0x4ab3aa) {
  if (!resolveMediaSrc(_0x4ab3aa)) {
    return '';
  }
  const _0x71d7df = Array['isArray'](_0x4ab3aa?.["items"]) ? _0x4ab3aa['items'][0x0] : null;
  const _0x5126c6 = Array['isArray'](_0x4ab3aa?.['nodes']) ? _0x4ab3aa['nodes'][0x0] : null;
  return String(_0x4ab3aa?.['coverUrl'] || _0x71d7df?.['thumbSrc'] || _0x5126c6?.['thumbUrl'] || _0x5126c6?.["videoThumbSrc"] || _0x5126c6?.["imageUrl"] || _0x5126c6?.["videoUrl"] || _0x5126c6?.["src"] || '')["trim"]();
}
function resolveMediaSrc(_0xaa0278) {
  const _0x4c9634 = Array["isArray"](_0xaa0278?.['nodes']) ? _0xaa0278['nodes'][0x0] : null;
  return String(_0x4c9634?.["imageUrl"] || _0x4c9634?.["sourceUrl"] || _0x4c9634?.["videoUrl"] || _0x4c9634?.["audioUrl"] || _0x4c9634?.["src"] || '')['trim']();
}
function getRecordMediaKind(_0x1cdb9c) {
  const _0x159f2a = String(_0x1cdb9c?.['mediaKind'] || '')['trim']()["toLowerCase"]();
  if (_0x159f2a === 'image' || _0x159f2a === "video" || _0x159f2a === "audio" || _0x159f2a === "folder" || _0x159f2a === "file") {
    return _0x159f2a;
  }
  const _0x57c59d = String(_0x1cdb9c?.["coverType"] || '')["trim"]()["toLowerCase"]();
  if (_0x57c59d === "image" || _0x57c59d === 'video' || _0x57c59d === "audio" || _0x57c59d === "folder" || _0x57c59d === "file") {
    return _0x57c59d;
  }
  const _0x10b44f = Array["isArray"](_0x1cdb9c?.["nodes"]) ? _0x1cdb9c["nodes"][0x0] : null;
  const _0x3a7ef0 = String(_0x10b44f?.["type"] || '')["trim"]()["toLowerCase"]();
  if (_0x3a7ef0['includes']("video")) {
    return 'video';
  }
  if (_0x3a7ef0["includes"]('audio')) {
    return 'audio';
  }
  return "image";
}
function getMediaLabel(_0xf3bd1a) {
  if (_0xf3bd1a === "video") {
    return fileManagerText("mediaKinds.video");
  }
  if (_0xf3bd1a === "audio") {
    return fileManagerText("mediaKinds.audio");
  }
  if (_0xf3bd1a === "folder") {
    return fileManagerText("mediaKinds.folder");
  }
  if (_0xf3bd1a === 'file') {
    return fileManagerText("mediaKinds.file");
  }
  return fileManagerText("mediaKinds.image");
}
function isSupportedOutputMediaKind(_0x1662df) {
  return isActionableFileManagerMediaKind(_0x1662df);
}
function isFileManagerActionableRecord(_0x560a48) {
  const _0x161615 = getRecordMediaKind(_0x560a48);
  if (!isSupportedOutputMediaKind(_0x161615)) {
    return ![];
  }
  return Array["isArray"](_0x560a48?.["nodes"]) && _0x560a48["nodes"]["length"] > 0x0;
}
function resolveRecordLocalPath(_0x53a425) {
  const _0x5a9c5c = Array["isArray"](_0x53a425?.["nodes"]) ? _0x53a425["nodes"][0x0] : null;
  return normalizeLocalPath(_0x53a425?.["localPath"] || _0x53a425?.['outputItem']?.["localPath"] || _0x5a9c5c?.["originalLocalPath"] || _0x5a9c5c?.['localPath'] || _0x5a9c5c?.["displayLocalPath"] || _0x5a9c5c?.["thumbLocalPath"] || _0x5a9c5c?.["src"] || _0x5a9c5c?.["imageUrl"] || _0x5a9c5c?.["videoUrl"] || _0x5a9c5c?.["audioUrl"]);
}
function buildHistoryRecordIdentityKey(_0x4f1c7f) {
  return buildFileManagerHistoryEntryKey({
    'projectId': normalizeProjectId(_0x4f1c7f?.['projectId']),
    'canvasId': String(_0x4f1c7f?.["canvasId"] || '')["trim"](),
    'generationRunId': String(_0x4f1c7f?.["generationRunId"] || '')["trim"](),
    'mediaKind': getRecordMediaKind(_0x4f1c7f),
    'sourceIndex': _0x4f1c7f?.["sourceIndex"],
    'localPath': resolveRecordLocalPath(_0x4f1c7f),
    'resultFingerprint': _0x4f1c7f?.['resultFingerprint']
  });
}
function dedupeHistoryRecords(_0x28fed9) {
  return dedupeFileManagerHistoryRecords(_0x28fed9, {
    'getMediaKind': getRecordMediaKind,
    'getLocalPath': resolveRecordLocalPath
  });
}
function getOutputRecordIdForItem(_0x4136f3) {
  if (_0x4136f3?.["isDir"]) {
    return "folder:" + String(_0x4136f3?.['relPath'] || '');
  }
  if (isSupportedOutputMediaKind(String(_0x4136f3?.["mediaKind"] || '')['trim']()["toLowerCase"]())) {
    return 'output:' + String(_0x4136f3?.["relPath"] || _0x4136f3?.["localPath"] || '');
  }
  return 'file:' + String(_0x4136f3?.["relPath"] || _0x4136f3?.["name"] || '');
}
function outputFileToRecord(_0x448f02) {
  const _0x583f3e = String(_0x448f02?.['mediaKind'] || '')['trim']()['toLowerCase']();
  if (!isSupportedOutputMediaKind(_0x583f3e)) {
    return null;
  }
  const _0x9c4f19 = normalizeLocalPath(_0x448f02?.["localPath"] || _0x448f02?.["url"]);
  const _0x44f8a7 = String(_0x448f02?.["url"] || localPathToUrl(_0x9c4f19))["trim"]();
  if (!_0x44f8a7) {
    return null;
  }
  const _0x123860 = normalizeLocalPath(_0x448f02?.['displayLocalPath']);
  const _0x557397 = normalizeLocalPath(_0x448f02?.["thumbLocalPath"]);
  const _0x10361a = localPathToUrl(_0x123860);
  const _0x571e86 = localPathToUrl(_0x557397);
  const _0x5354d9 = String(_0x448f02?.["name"] || '')["trim"]() || _0x9c4f19['split'](/[\\/]/)["pop"]() || fileManagerText("fallback.outputFile");
  const _0x54963b = _0x583f3e === 'video' ? "source-video" : _0x583f3e === "audio" ? "source-audio" : "source-image";
  const _0x273b59 = Number(_0x448f02?.['videoWidth'] || _0x448f02?.["originalWidth"] || _0x448f02?.['width'] || 0x0) || 0x0;
  const _0x27c64b = Number(_0x448f02?.["videoHeight"] || _0x448f02?.["originalHeight"] || _0x448f02?.["height"] || 0x0) || 0x0;
  const _0x4f3629 = {
    'id': _0x54963b + "-output-" + String(_0x448f02?.["relPath"] || _0x9c4f19)["replace"](/[^\w-]+/g, '_'),
    'type': _0x54963b,
    'name': _0x5354d9,
    'x': 0x0,
    'y': 0x0,
    ...getNodeDefaultSize(_0x54963b),
    'src': _0x44f8a7,
    'localPath': _0x9c4f19,
    'displayLocalPath': _0x123860,
    'thumbLocalPath': _0x557397,
    'fileName': _0x5354d9,
    'needsAutoResize': _0x583f3e !== 'audio'
  };
  if (_0x583f3e === 'image') {
    _0x4f3629['imageUrl'] = _0x44f8a7;
    _0x4f3629["sourceUrl"] = _0x44f8a7;
    _0x4f3629["thumbUrl"] = _0x571e86;
    _0x273b59 > 0x0 && (_0x4f3629["originalWidth"] = _0x273b59, _0x4f3629['imageWidth'] = _0x273b59);
    _0x27c64b > 0x0 && (_0x4f3629['originalHeight'] = _0x27c64b, _0x4f3629["imageHeight"] = _0x27c64b);
  } else {
    if (_0x583f3e === "video") {
      _0x4f3629["videoUrl"] = _0x44f8a7;
      _0x4f3629["posterUrl"] = _0x571e86;
      _0x4f3629["thumbUrl"] = _0x571e86;
      _0x4f3629["posterLocalPath"] = _0x557397;
      _0x4f3629['videoThumbSrc'] = _0x44f8a7;
      if (_0x273b59 > 0x0) {
        _0x4f3629["videoWidth"] = _0x273b59;
      }
      if (_0x27c64b > 0x0) {
        _0x4f3629['videoHeight'] = _0x27c64b;
      }
      if (Number(_0x448f02?.["duration"] || 0x0) > 0x0) {
        _0x4f3629['duration'] = Number(_0x448f02['duration']);
      }
    } else {
      _0x583f3e === 'audio' && (_0x4f3629["audioUrl"] = _0x44f8a7);
    }
  }
  return {
    'id': "output:" + String(_0x448f02?.["relPath"] || _0x9c4f19),
    'mediaKind': _0x583f3e,
    'coverType': _0x583f3e,
    'coverUrl': _0x583f3e === 'audio' ? '' : _0x583f3e === "video" ? _0x571e86 : _0x571e86 || _0x10361a || _0x44f8a7,
    'name': _0x5354d9,
    'localPath': _0x9c4f19,
    'updatedAt': Number(_0x448f02?.["mtime"] || 0x0) || 0x0,
    'nodes': [_0x4f3629]
  };
}
function outputFileToDisplayRecord(_0x4d8391) {
  if (_0x4d8391?.["isDir"]) {
    return {
      'id': "folder:" + String(_0x4d8391?.["relPath"] || _0x4d8391?.['name'] || ''),
      'mediaKind': "folder",
      'coverType': 'folder',
      'name': String(_0x4d8391?.["name"] || fileManagerText("fallback.folder")),
      'updatedAt': Number(_0x4d8391?.["mtime"] || 0x0) || 0x0,
      'outputItem': _0x4d8391,
      'nodes': []
    };
  }
  const _0x51140d = outputFileToRecord(_0x4d8391);
  if (_0x51140d) {
    return {
      ..._0x51140d,
      'outputItem': _0x4d8391
    };
  }
  return {
    'id': "file:" + String(_0x4d8391?.["relPath"] || _0x4d8391?.["name"] || ''),
    'mediaKind': "file",
    'coverType': 'file',
    'name': String(_0x4d8391?.["name"] || fileManagerText("fallback.file")),
    'updatedAt': Number(_0x4d8391?.["mtime"] || 0x0) || 0x0,
    'outputItem': _0x4d8391,
    'nodes': []
  };
}
function resolveRecordSize(_0x5be7b8, _0x5bbcb9) {
  const _0xf962a9 = Array["isArray"](_0x5be7b8?.['nodes']) ? _0x5be7b8["nodes"][0x0] : null;
  const _0x5fea59 = Array["isArray"](_0x5be7b8?.["items"]) ? _0x5be7b8['items'][0x0] : null;
  const _0xc25b49 = _0x5fea59?.["nodeData"] || {};
  const _0x40d449 = Number(_0xf962a9?.["videoWidth"] || _0xf962a9?.["imageWidth"] || _0xf962a9?.['originalWidth'] || _0xf962a9?.["width"] || _0xc25b49['width'] || 0x0) || 0x0;
  const _0x5809cd = Number(_0xf962a9?.["videoHeight"] || _0xf962a9?.["imageHeight"] || _0xf962a9?.["originalHeight"] || _0xf962a9?.["height"] || _0xc25b49["height"] || 0x0) || 0x0;
  if (_0x40d449 > 0x0 && _0x5809cd > 0x0) {
    return {
      'width': _0x40d449,
      'height': _0x5809cd
    };
  }
  if (_0x5bbcb9 === GENERATION_HISTORY_MEDIA_KINDS["VIDEO"]) {
    return {
      'width': Math["round"](FILE_MASONRY['defaultShortSide'] * 0x10 / 0x9),
      'height': FILE_MASONRY["defaultShortSide"]
    };
  }
  if (_0x5bbcb9 === GENERATION_HISTORY_MEDIA_KINDS['AUDIO']) {
    return {
      'width': 0x140,
      'height': 0x8c
    };
  }
  if (_0x5bbcb9 === "folder") {
    return {
      'width': 0x96,
      'height': 0x76
    };
  }
  if (_0x5bbcb9 === "file") {
    return {
      'width': 0x96,
      'height': 0x84
    };
  }
  return {
    'width': FILE_MASONRY["defaultShortSide"],
    'height': FILE_MASONRY["defaultShortSide"]
  };
}
function resolveRecordAspect(_0xc7e5c8, _0x246def) {
  const {
    width: _0x3b40b3,
    height: _0xabca27
  } = resolveRecordSize(_0xc7e5c8, _0x246def);
  return _0x3b40b3 + '\x20/\x20' + _0xabca27;
}
class GenerationHistoryFileManager {
  constructor() {
    this["panel"] = null;
    this["titleEl"] = null;
    this["contentEl"] = null;
    this["records"] = [];
    this['_loading'] = ![];
    this["_savingIds"] = new Set();
    this["_savingRecordKeys"] = new Set();
    this["_backfillInFlight"] = ![];
    this["_activeFilter"] = 'all';
    this['_activeSource'] = "current-canvas";
    this["_sortOrder"] = "desc";
    this["outputItems"] = [];
    this['_outputDir'] = '';
    this['_outputParent'] = '';
    this["_outputBreadcrumbs"] = [{
      'name': "output",
      'dir': ''
    }];
    this["_outputLoading"] = ![];
    this["_outputLoaded"] = ![];
    this["_outputNextOffset"] = 0x0;
    this["_outputHasMore"] = !![];
    this["_outputTotalItems"] = 0x0;
    this["_outputLoadToken"] = 0x0;
    this['_panelWidth'] = 0x0;
    this["_resizeState"] = null;
    this['_recordsLoaded'] = ![];
    this["_recordsDirty"] = ![];
    this['_nextOffset'] = 0x0;
    this["_hasMore"] = !![];
    this["_totalRecords"] = 0x0;
    this["_loadToken"] = 0x0;
    this["_selectedRecordIds"] = new Set();
    this["_selectionDrag"] = null;
    this["_suppressNextClick"] = ![];
    this["_unsubscribeLocale"] = null;
    this["_videoThumbnailQueue"] = createVideoThumbnailRequestQueue({
      'concurrency': 0x1
    });
    this["_videoThumbnailObserver"] = null;
    this["_videoThumbnailTargets"] = new WeakMap();
    this["_videoThumbnailBackfills"] = new Map();
    this["_mediaPreviewDisposers"] = new Set();
    this["_initPanel"]();
    this['_bindButton']();
    this['_bindLocaleChange']();
    this["_bindGenerationEvents"]();
  }
  ['_isOpen']() {
    return this["panel"]?.["classList"]["contains"]("show") === !![];
  }
  ['_getCurrentProjectId']() {
    return normalizeProjectId(window['currentProjectId']);
  }
  ['_getCurrentCanvasId']() {
    const _0xe9c765 = window['CanvasTabManager'];
    return String(_0xe9c765?.["getActiveCanvasId"]?.() || '')["trim"]() || String(_0xe9c765?.["_activeId"] || '')["trim"]() || "canvas_1";
  }
  ["_getCanvasCenterWorld"]() {
    const {
      viewport: _0x9eb42f
    } = a1058_0x55effd["getState"]();
    const _0x4128fd = window["innerWidth"] / 0x2;
    const _0x9db7a5 = window["innerHeight"] / 0x2;
    const _0x451367 = document["documentElement"]?.['clientWidth'] || window["innerWidth"] || 0x0;
    const _0x17fe57 = document['documentElement']?.['clientHeight'] || window["innerHeight"] || 0x0;
    if (!_0x451367 || !_0x17fe57) {
      return screenToWorld(_0x4128fd, _0x9db7a5, _0x9eb42f);
    }
    let _0x4dda31 = 0x0;
    let _0x4ea28c = 0x0;
    let _0x21ee19 = _0x451367;
    let _0x27527a = _0x17fe57;
    const _0x43dd43 = [];
    const _0x14153d = document["querySelector"]("header");
    const _0x5a8895 = document["querySelector"](".sidebar-floating");
    if (_0x14153d) {
      _0x43dd43["push"](_0x14153d);
    }
    if (_0x5a8895) {
      _0x43dd43["push"](_0x5a8895);
    }
    if (this["panel"]?.['classList']["contains"]("show")) {
      _0x43dd43['push'](this["panel"]);
    }
    const _0x23c398 = 0x8;
    for (const _0x347068 of _0x43dd43) {
      if (!_0x347068?.['isConnected']) {
        continue;
      }
      const _0x1922b4 = _0x347068["getBoundingClientRect"]();
      const _0x232083 = Math["max"](_0x4dda31, _0x1922b4["left"]);
      const _0x49f7a6 = Math['max'](_0x4ea28c, _0x1922b4['top']);
      const _0x592cce = Math["min"](_0x21ee19, _0x1922b4["right"]);
      const _0x4975da = Math["min"](_0x27527a, _0x1922b4['bottom']);
      if (_0x592cce <= _0x232083 || _0x4975da <= _0x49f7a6) {
        continue;
      }
      if (_0x1922b4["left"] <= _0x4dda31 + _0x23c398 && _0x1922b4["right"] > _0x4dda31 + _0x23c398) {
        _0x4dda31 = Math["max"](_0x4dda31, _0x1922b4['right']);
        continue;
      }
      if (_0x1922b4['right'] >= _0x21ee19 - _0x23c398 && _0x1922b4["left"] < _0x21ee19 - _0x23c398) {
        _0x21ee19 = Math['min'](_0x21ee19, _0x1922b4["left"]);
        continue;
      }
      if (_0x1922b4["top"] <= _0x4ea28c + _0x23c398 && _0x1922b4["bottom"] > _0x4ea28c + _0x23c398) {
        _0x4ea28c = Math["max"](_0x4ea28c, _0x1922b4["bottom"]);
        continue;
      }
      _0x1922b4["bottom"] >= _0x27527a - _0x23c398 && _0x1922b4["top"] < _0x27527a - _0x23c398 && (_0x27527a = Math['min'](_0x27527a, _0x1922b4["top"]));
    }
    const _0x7e30b9 = _0x21ee19 - _0x4dda31;
    const _0x32f26e = _0x27527a - _0x4ea28c;
    const _0x379a40 = _0x7e30b9 > 0x28 ? _0x4dda31 + _0x7e30b9 / 0x2 : _0x4128fd;
    const _0x36f474 = _0x32f26e > 0x28 ? _0x4ea28c + _0x32f26e / 0x2 : _0x9db7a5;
    return screenToWorld(_0x379a40, _0x36f474, _0x9eb42f);
  }
  ['_hasRecord'](_0x2878cd) {
    const _0x281f5b = buildHistoryRecordIdentityKey(_0x2878cd);
    if (!_0x281f5b) {
      return ![];
    }
    return this["records"]["some"](_0xc5b082 => buildHistoryRecordIdentityKey(_0xc5b082) === _0x281f5b);
  }
  ["_visibleRecords"]() {
    if (this['_activeSource'] === "output") {
      return this["_visibleOutputRecords"]();
    }
    const _0x2f24c7 = this['_getCurrentProjectId']();
    const _0x1f13f8 = this["_getCurrentCanvasId"]();
    const _0x5466e6 = this['_sortOrder'] === "asc" ? dedupeHistoryRecords(this['records'])["reverse"]() : dedupeHistoryRecords(this["records"]);
    return _0x5466e6['filter'](_0x1b87d0 => isFileManagerHistoryRecordVisible({
      'record': _0x1b87d0,
      'source': this["_activeSource"],
      'projectId': _0x2f24c7,
      'canvasId': _0x1f13f8,
      'activeFilter': this["_activeFilter"],
      'getMediaKind': getRecordMediaKind
    }));
  }
  ["_visibleOutputRecords"]() {
    const _0x154080 = (Array['isArray'](this["outputItems"]) ? this['outputItems'] : [])["map"](outputFileToDisplayRecord)["filter"](Boolean)["filter"](_0x300cdb => {
      const _0x3705cf = getRecordMediaKind(_0x300cdb);
      if (_0x300cdb?.["outputItem"]?.['isDir']) {
        return !![];
      }
      if (this['_activeFilter'] === "all") {
        return _0x3705cf !== "file";
      }
      return _0x3705cf === this["_activeFilter"];
    });
    _0x154080['sort']((_0x45fef0, _0x597b21) => {
      const _0x2d5d41 = _0x45fef0?.['outputItem']?.["isDir"] ? 0x0 : 0x1;
      const _0x40f467 = _0x597b21?.["outputItem"]?.['isDir'] ? 0x0 : 0x1;
      if (_0x2d5d41 !== _0x40f467) {
        return _0x2d5d41 - _0x40f467;
      }
      const _0x550c64 = Number(_0x45fef0?.["updatedAt"] || 0x0);
      const _0x1e442e = Number(_0x597b21?.["updatedAt"] || 0x0);
      const _0x4dfae3 = this['_sortOrder'] === 'asc' ? _0x550c64 - _0x1e442e : _0x1e442e - _0x550c64;
      if (_0x4dfae3 !== 0x0) {
        return _0x4dfae3;
      }
      return String(_0x45fef0?.["name"] || '')['localeCompare'](String(_0x597b21?.["name"] || ''), "zh-CN");
    });
    return _0x154080;
  }
  ['_findVisibleRecordById'](_0xcd7172) {
    const _0x23959e = String(_0xcd7172 || '');
    if (!_0x23959e) {
      return null;
    }
    return this["_visibleRecords"]()["find"](_0xe27d32 => String(_0xe27d32?.['id'] || '') === _0x23959e) || null;
  }
  ["_findOutputItemByRecordId"](_0x3e6121) {
    const _0x368b2a = String(_0x3e6121 || '');
    if (!_0x368b2a) {
      return null;
    }
    return (Array["isArray"](this["outputItems"]) ? this["outputItems"] : [])['find'](_0x5a7d1c => getOutputRecordIdForItem(_0x5a7d1c) === _0x368b2a) || null;
  }
  ["_clearSelection"]() {
    if (this['_selectedRecordIds']["size"] === 0x0) {
      return;
    }
    this["_selectedRecordIds"]["clear"]();
    this['_syncSelectionClasses']();
  }
  ["_selectRecord"](_0x4e63ee, {
    shiftKey = ![]
  } = {}) {
    const _0x5e9d38 = this["_findVisibleRecordById"](_0x4e63ee);
    const _0x29b3bb = getFileManagerSelectionAfterClick({
      'current': Array['from'](this["_selectedRecordIds"]),
      'recordId': _0x4e63ee,
      'shiftKey': shiftKey,
      'actionable': isFileManagerActionableRecord(_0x5e9d38)
    });
    this["_selectedRecordIds"] = new Set(_0x29b3bb);
    this["_syncSelectionClasses"]();
  }
  ["_setSelection"](_0x41f34e) {
    const _0x1f3e81 = (Array['isArray'](_0x41f34e) ? _0x41f34e : [])['filter'](_0x19dbab => isFileManagerActionableRecord(this["_findVisibleRecordById"](_0x19dbab)));
    this['_selectedRecordIds'] = new Set(_0x1f3e81);
    this["_syncSelectionClasses"]();
  }
  ["_syncSelectionClasses"]() {
    if (!this["contentEl"]) {
      return;
    }
    this["contentEl"]['querySelectorAll'](".v2-file-history-card")["forEach"](_0x235c52 => {
      _0x235c52["classList"]["toggle"]("is-selected", this["_selectedRecordIds"]['has'](String(_0x235c52["dataset"]["recordId"] || '')));
    });
  }
  ["_pruneSelectionToVisibleRecords"]() {
    if (this["_selectedRecordIds"]['size'] === 0x0) {
      return;
    }
    const _0x5f573f = new Set(this['_visibleRecords']()["filter"](isFileManagerActionableRecord)['map'](_0x3c1145 => String(_0x3c1145?.['id'] || '')));
    let _0x5b5256 = ![];
    for (const _0x16426c of Array["from"](this["_selectedRecordIds"])) {
      !_0x5f573f["has"](_0x16426c) && (this['_selectedRecordIds']['delete'](_0x16426c), _0x5b5256 = !![]);
    }
    if (_0x5b5256) {
      this["_syncSelectionClasses"]();
    }
  }
  ["_initPanel"]() {
    this["panel"] = document["createElement"]("div");
    this["panel"]["className"] = "v2-file-history-panel canvas-toolbar-panel-surface";
    this["panel"]["innerHTML"] = "\n      <div class=\"v2-file-history-header\">\n        <div class=\"v2-file-history-title\"></div>\n        <div class=\"v2-file-history-source-tabs\" role=\"tablist\"></div>\n        <div class=\"v2-file-history-subtitle\"></div>\n        <div class=\"v2-file-history-toolbar\">\n        <div class=\"v2-file-history-filters\" role=\"tablist\"></div>\n          <div class=\"v2-file-history-order\" role=\"tablist\"></div>\n        </div>\n        <div class=\"v2-file-history-breadcrumbs\"></div>\n      </div>\n      <div class=\"v2-file-history-content\"></div>\n      <div class=\"v2-file-history-resize-handle\" aria-hidden=\"true\"></div>\n    ";
    this["titleEl"] = this["panel"]["querySelector"](".v2-file-history-title");
    this['contentEl'] = this["panel"]['querySelector'](".v2-file-history-content");
    this["sourceTabsEl"] = this["panel"]["querySelector"](".v2-file-history-source-tabs");
    this["subtitleEl"] = this["panel"]["querySelector"](".v2-file-history-subtitle");
    this["filterEl"] = this["panel"]["querySelector"](".v2-file-history-filters");
    this["orderEl"] = this["panel"]["querySelector"](".v2-file-history-order");
    this["breadcrumbsEl"] = this["panel"]["querySelector"](".v2-file-history-breadcrumbs");
    this["resizeHandleEl"] = this["panel"]["querySelector"]('.v2-file-history-resize-handle');
    this["_syncPanelStaticTexts"]();
    this["_bindContentWheelGuard"]();
    this["_bindContentPaging"]();
    this["_bindMarqueeSelection"]();
    this["_bindContextMenu"]();
    this["_bindDoubleClickToCanvas"]();
    this["panel"]["addEventListener"]('click', _0x2ed5cb => {
      if (this['_suppressNextClick']) {
        _0x2ed5cb["preventDefault"]();
        _0x2ed5cb["stopPropagation"]();
        this["_suppressNextClick"] = ![];
        return;
      }
      const _0x1209da = _0x2ed5cb["target"]["closest"]("[data-file-action]");
      const _0x363a97 = _0x1209da?.["dataset"]?.["fileAction"] || '';
      if (_0x363a97 === "filter") {
        _0x2ed5cb["preventDefault"]();
        _0x2ed5cb["stopPropagation"]();
        const _0x15886a = String(_0x1209da["dataset"]["filter"] || "all")["trim"]();
        FILE_FILTERS['some'](_0x4cb355 => _0x4cb355['key'] === _0x15886a) && _0x15886a !== this["_activeFilter"] && (this["_activeFilter"] = _0x15886a, this["_clearSelection"](), this["render"](), isHistorySource(this['_activeSource']) && (this["_resetPageState"](), void this['loadRecords']({
          'reset': !![]
        })));
        return;
      }
      if (_0x363a97 === "source") {
        _0x2ed5cb["preventDefault"]();
        _0x2ed5cb["stopPropagation"]();
        const _0x41a276 = String(_0x1209da["dataset"]["source"] || 'history')["trim"]();
        if (FILE_SOURCES['some'](_0x484f9a => _0x484f9a["key"] === _0x41a276) && _0x41a276 !== this["_activeSource"]) {
          this['_activeSource'] = _0x41a276;
          this["_clearSelection"]();
          this["render"]();
          if (isHistorySource(_0x41a276)) {
            void this['loadRecords']({
              'backfillAfterLoad': !![],
              'reset': !![]
            });
          } else {
            _0x41a276 === 'output' && !this["_outputLoaded"] && void this['loadOutputFiles']({
              'dir': this["_outputDir"],
              'reset': !![]
            });
          }
        }
        return;
      }
      if (_0x363a97 === 'order') {
        _0x2ed5cb["preventDefault"]();
        _0x2ed5cb["stopPropagation"]();
        this["_sortOrder"] = this["_sortOrder"] === "asc" ? "desc" : "asc";
        this["_clearSelection"]();
        this["render"]();
        isHistorySource(this["_activeSource"]) ? (this["_resetPageState"](), void this["loadRecords"]({
          'reset': !![]
        })) : void this['loadOutputFiles']({
          'dir': this["_outputDir"],
          'reset': !![]
        });
        return;
      }
      if (_0x363a97 === "output-dir") {
        _0x2ed5cb["preventDefault"]();
        _0x2ed5cb['stopPropagation']();
        this['_clearSelection']();
        void this['loadOutputFiles']({
          'dir': _0x1209da["dataset"]["dir"] || '',
          'reset': !![]
        });
        return;
      }
      const _0x37fe7b = _0x2ed5cb['target']['closest'](".v2-file-history-card");
      if (!_0x37fe7b || !_0x37fe7b["dataset"]["recordId"]) {
        return;
      }
      if (this["_activeSource"] === "output") {
        const _0x52da01 = this["_findOutputItemByRecordId"](_0x37fe7b['dataset']["recordId"]);
        if (_0x52da01?.["isDir"]) {
          void this['loadOutputFiles']({
            'dir': _0x52da01["dir"] || _0x52da01["relPath"] || '',
            'reset': !![]
          });
          return;
        }
      }
      this['_selectRecord'](_0x37fe7b["dataset"]['recordId'], {
        'shiftKey': _0x2ed5cb["shiftKey"]
      });
    });
    const _0x483c92 = document["querySelector"](".sidebar-floating") || document["body"];
    _0x483c92['appendChild'](this["panel"]);
    this['_bindResizeHandle']();
  }
  ["_bindContentWheelGuard"]() {
    if (!this["panel"] || !this['contentEl']) {
      return;
    }
    this["panel"]["addEventListener"]("wheel", _0x2bbc73 => {
      if (!this["panel"]?.["classList"]["contains"]('show')) {
        return;
      }
      _0x2bbc73["stopPropagation"]();
      _0x2bbc73['stopImmediatePropagation']?.();
    }, {
      'passive': ![],
      'capture': !![]
    });
  }
  ['_bindContentPaging']() {
    if (!this["contentEl"]) {
      return;
    }
    this["contentEl"]["addEventListener"]('scroll', () => {
      const _0x15e0b7 = this['contentEl']["scrollHeight"] - this["contentEl"]["scrollTop"] - this["contentEl"]['clientHeight'];
      if (this['_isOpen']() && isHistorySource(this["_activeSource"]) && !this["_loading"] && this["_hasMore"] && this['_recordsLoaded'] && _0x15e0b7 <= FILE_HISTORY_SCROLL_PREFETCH_PX) {
        void this["loadRecords"]({
          'reset': ![]
        });
        return;
      }
      this["_isOpen"]() && this["_activeSource"] === 'output' && !this['_outputLoading'] && this["_outputHasMore"] && this["_outputLoaded"] && _0x15e0b7 <= FILE_HISTORY_SCROLL_PREFETCH_PX && void this["loadOutputFiles"]({
        'dir': this["_outputDir"],
        'reset': ![]
      });
    }, {
      'passive': !![]
    });
  }
  ["_bindMarqueeSelection"]() {
    if (!this["contentEl"]) {
      return;
    }
    this["contentEl"]["addEventListener"]("pointerdown", _0x34cc94 => {
      if (_0x34cc94['button'] !== 0x0 || !this["_isOpen"]()) {
        return;
      }
      if (_0x34cc94["target"]['closest']('[data-file-action],\x20.v2-file-history-resize-handle')) {
        return;
      }
      const _0x50d8c0 = _0x34cc94['clientX'];
      const _0x14f296 = _0x34cc94['clientY'];
      const _0x507a43 = {
        'startX': _0x50d8c0,
        'startY': _0x14f296,
        'active': ![],
        'marqueeEl': null
      };
      this["_selectionDrag"] = _0x507a43;
      const _0x23f231 = _0x3dcb20 => {
        if (this["_selectionDrag"] !== _0x507a43) {
          return;
        }
        const _0x5c7b63 = _0x3dcb20["clientX"] - _0x50d8c0;
        const _0x94a8ae = _0x3dcb20["clientY"] - _0x14f296;
        if (!_0x507a43["active"] && Math['hypot'](_0x5c7b63, _0x94a8ae) < 0x6) {
          return;
        }
        !_0x507a43['active'] && (_0x507a43['active'] = !![], _0x507a43["marqueeEl"] = document['createElement']("div"), _0x507a43["marqueeEl"]["className"] = "v2-file-history-marquee", this['contentEl']["appendChild"](_0x507a43["marqueeEl"]));
        const _0x2d9beb = this["contentEl"]['getBoundingClientRect']();
        const _0x2dcb18 = Math["min"](_0x50d8c0, _0x3dcb20["clientX"]) - _0x2d9beb["left"] + this['contentEl']['scrollLeft'];
        const _0x219a7a = Math['min'](_0x14f296, _0x3dcb20['clientY']) - _0x2d9beb["top"] + this["contentEl"]["scrollTop"];
        const _0x395a98 = Math["abs"](_0x3dcb20["clientX"] - _0x50d8c0);
        const _0x100f56 = Math["abs"](_0x3dcb20["clientY"] - _0x14f296);
        Object['assign'](_0x507a43["marqueeEl"]['style'], {
          'left': _0x2dcb18 + 'px',
          'top': _0x219a7a + 'px',
          'width': _0x395a98 + 'px',
          'height': _0x100f56 + 'px'
        });
      };
      const _0xb65436 = () => {
        window['removeEventListener']("pointermove", _0x23f231, !![]);
        window["removeEventListener"]("pointerup", _0xb65436, !![]);
        window['removeEventListener']("pointercancel", _0xb65436, !![]);
        if (this["_selectionDrag"] !== _0x507a43) {
          return;
        }
        this['_selectionDrag'] = null;
        if (!_0x507a43["active"] || !_0x507a43["marqueeEl"]) {
          return;
        }
        const _0x469133 = _0x507a43['marqueeEl']["getBoundingClientRect"]();
        const _0x380dde = Array['from'](this['contentEl']["querySelectorAll"](".v2-file-history-card"))["filter"](_0x39612e => {
          const _0x57347a = _0x39612e["getBoundingClientRect"]();
          return !(_0x57347a['right'] < _0x469133['left'] || _0x57347a["left"] > _0x469133["right"] || _0x57347a["bottom"] < _0x469133["top"] || _0x57347a['top'] > _0x469133["bottom"]);
        })["map"](_0x29ce6d => String(_0x29ce6d["dataset"]["recordId"] || ''))["filter"](Boolean);
        _0x507a43["marqueeEl"]['remove']();
        this['_suppressNextClick'] = !![];
        this["_setSelection"](_0x380dde);
      };
      window["addEventListener"]("pointermove", _0x23f231, !![]);
      window["addEventListener"]('pointerup', _0xb65436, !![]);
      window["addEventListener"]("pointercancel", _0xb65436, !![]);
    });
  }
  ["_bindContextMenu"]() {
    if (!this["panel"]) {
      return;
    }
    this["panel"]["addEventListener"]("contextmenu", _0x2a494e => {
      const _0x2c0176 = _0x2a494e['target']["closest"](".v2-file-history-card");
      if (!_0x2c0176 || !this['panel']["contains"](_0x2c0176)) {
        return;
      }
      _0x2a494e["preventDefault"]();
      _0x2a494e["stopPropagation"]();
      const _0x2664ca = String(_0x2c0176['dataset']["recordId"] || '');
      const _0x527b03 = this["_findVisibleRecordById"](_0x2664ca);
      if (!isFileManagerActionableRecord(_0x527b03)) {
        return;
      }
      if (!this["_selectedRecordIds"]["has"](_0x2664ca)) {
        this["_setSelection"]([_0x2664ca]);
      }
      const _0x49f442 = this['_getSelectedRecords']();
      const _0x28636b = this['_buildContextMenuItems'](_0x49f442);
      if (_0x28636b["length"] === 0x0) {
        return;
      }
      showContextMenu(_0x2a494e["clientX"], _0x2a494e["clientY"], _0x28636b, {
        'ensureItemIcons': !![],
        'includeNodePicker': ![],
        'ownerElement': _0x2c0176,
        'ownerRoot': this["panel"],
        'sidebarSubmenuOwner': FILE_MANAGER_SIDEBAR_KEY
      });
    });
  }
  ["_bindDoubleClickToCanvas"]() {
    if (!this["panel"]) {
      return;
    }
    this["panel"]["addEventListener"]("dblclick", _0x2e7c8c => {
      const _0x569bbf = _0x2e7c8c["target"]["closest"]('.v2-file-history-card');
      if (!_0x569bbf || !this["panel"]['contains'](_0x569bbf)) {
        return;
      }
      const _0x3cf87a = String(_0x569bbf["dataset"]['recordId'] || '');
      const _0x1fc98f = this["_findVisibleRecordById"](_0x3cf87a);
      if (!isFileManagerActionableRecord(_0x1fc98f)) {
        return;
      }
      _0x2e7c8c["preventDefault"]();
      _0x2e7c8c["stopPropagation"]();
      const _0x410b02 = this['_selectedRecordIds']["has"](_0x3cf87a) && this["_getSelectedRecords"]()["length"] > 0x0 ? this["_getSelectedRecords"]() : [_0x1fc98f];
      this["restoreRecordsToCanvas"](_0x410b02);
    });
  }
  ['_getSelectedRecords']() {
    const _0x49fc0d = this["_visibleRecords"]();
    const _0x1fb1b8 = this["_selectedRecordIds"];
    return _0x49fc0d["filter"](_0x4f4b23 => _0x1fb1b8['has'](String(_0x4f4b23?.['id'] || '')));
  }
  ["_buildContextMenuItems"](_0x26fef6) {
    const _0x498f09 = (Array['isArray'](_0x26fef6) ? _0x26fef6 : [])["filter"](isFileManagerActionableRecord);
    const _0x5bd4c7 = _0x498f09[0x0] || null;
    const _0xa0cf26 = _0x498f09["length"] === 0x1 ? resolveRecordLocalPath(_0x5bd4c7) : '';
    const _0x1e573a = getFileManagerMenuActions({
      'records': _0x498f09,
      'canRevealInFolder': canShowItemInFolder(_0xa0cf26),
      'getMediaKind': getRecordMediaKind,
      'isActionableRecord': isFileManagerActionableRecord
    });
    const _0x3219c5 = [];
    for (const _0x341016 of _0x1e573a) {
      if (_0x341016 === "delete" && _0x3219c5["length"] > 0x0) {
        _0x3219c5["push"]("sep");
      }
      if (_0x341016 === 'add-to-canvas') {
        _0x3219c5["push"]({
          'label': _0x498f09["length"] > 0x1 ? fileManagerText('contextMenu.addManyToCanvas', {
            'count': _0x498f09["length"]
          }) : fileManagerText('contextMenu.addToCanvas'),
          'icon': 'add-to-canvas',
          'shortcutActionId': "context-history-add-to-canvas",
          'action': () => this["restoreRecordsToCanvas"](_0x498f09)
        });
      } else {
        if (_0x341016 === 'fullscreen') {
          _0x3219c5['push']({
            'label': fileManagerText("contextMenu.fullscreen"),
            'icon': "fullscreen",
            'shortcutActionId': "context-history-fullscreen",
            'action': () => this["_openRecordPreview"](_0x5bd4c7)
          });
        } else {
          if (_0x341016 === 'reveal') {
            _0x3219c5["push"]({
              'label': fileManagerText("contextMenu.reveal"),
              'icon': "reveal",
              'shortcutActionId': "context-history-reveal",
              'action': () => this['_showRecordInFolder'](_0x5bd4c7)
            });
          } else {
            _0x341016 === 'delete' && _0x3219c5["push"]({
              'label': _0x498f09['length'] > 0x1 ? fileManagerText("contextMenu.deleteMany", {
                'count': _0x498f09["length"]
              }) : fileManagerText("contextMenu.delete"),
              'icon': "delete",
              'danger': !![],
              'shortcutActionId': "context-history-delete",
              'action': () => void this["_deleteRecords"](_0x498f09)
            });
          }
        }
      }
    }
    return _0x3219c5;
  }
  ["_clampContentScroll"]() {
    if (!this["contentEl"]) {
      return;
    }
    const _0x282edd = Math["max"](0x0, this['contentEl']["scrollHeight"] - this["contentEl"]["clientHeight"]);
    if (_0x282edd <= 0x0) {
      this['contentEl']["scrollTop"] = 0x0;
      return;
    }
    this["contentEl"]["scrollTop"] > _0x282edd && (this["contentEl"]["scrollTop"] = _0x282edd);
  }
  ["_bindResizeHandle"]() {
    if (!this["panel"] || !this["resizeHandleEl"]) {
      return;
    }
    const _0x4a0a1f = () => {
      if (!this["_resizeState"]) {
        return;
      }
      window["removeEventListener"]("pointermove", _0x191bbc, !![]);
      window["removeEventListener"]('pointerup', _0x4a0a1f, !![]);
      window["removeEventListener"]('pointercancel', _0x4a0a1f, !![]);
      this["panel"]["classList"]['remove']("is-resizing");
      this["_resizeState"] = null;
    };
    const _0x191bbc = _0xa578fb => {
      if (!this["_resizeState"]) {
        return;
      }
      _0xa578fb['preventDefault']();
      const _0x1aa6e1 = Math["max"](FILE_PANEL_RESIZE["minWidth"], window['innerWidth'] - this["_resizeState"]["left"] - FILE_PANEL_RESIZE["maxViewportGap"]);
      const _0x5952b3 = Math["max"](FILE_PANEL_RESIZE['minWidth'], Math["min"](_0x1aa6e1, this["_resizeState"]['startWidth'] + _0xa578fb["clientX"] - this["_resizeState"]["startX"]));
      this["_panelWidth"] = Math["round"](_0x5952b3);
      this["panel"]['style']["width"] = this['_panelWidth'] + 'px';
      this["_relayoutMasonry"]();
      this["_clampContentScroll"]();
    };
    this['resizeHandleEl']["addEventListener"]('pointerdown', _0x406934 => {
      if (_0x406934["button"] !== 0x0) {
        return;
      }
      _0x406934['preventDefault']();
      _0x406934["stopPropagation"]();
      const _0xa618a7 = this["panel"]["getBoundingClientRect"]();
      this["_resizeState"] = {
        'startX': _0x406934["clientX"],
        'startWidth': _0xa618a7["width"] || FILE_PANEL_RESIZE["defaultWidth"],
        'left': _0xa618a7['left']
      };
      this['panel']["classList"]['add']("is-resizing");
      this['resizeHandleEl']['setPointerCapture']?.(_0x406934["pointerId"]);
      window["addEventListener"]("pointermove", _0x191bbc, !![]);
      window["addEventListener"]('pointerup', _0x4a0a1f, !![]);
      window["addEventListener"]("pointercancel", _0x4a0a1f, !![]);
    });
  }
  ["_bindLocaleChange"]() {
    this['_unsubscribeLocale'] = onLocaleChange(() => {
      this["_syncPanelStaticTexts"]();
      this['render']();
    });
  }
  ["_syncPanelStaticTexts"]() {
    this["panel"]?.["setAttribute"]("aria-label", fileManagerText("panel.ariaLabel"));
    if (this["titleEl"]) {
      this['titleEl']['textContent'] = fileManagerText("panel.title");
    }
    this["sourceTabsEl"]?.["setAttribute"]("aria-label", fileManagerText('panel.sourceTabsAria'));
    this["filterEl"]?.["setAttribute"]("aria-label", fileManagerText("panel.filtersAria"));
    this["orderEl"]?.["setAttribute"]("aria-label", fileManagerText("panel.orderAria"));
  }
  ['_bindButton']() {
    const _0x17642c = document["getElementById"]("btnFiles");
    if (!_0x17642c) {
      return;
    }
    const _0x3ae821 = () => {
      this["show"]();
    };
    registerSidebarSubmenu({
      'key': FILE_MANAGER_SIDEBAR_KEY,
      'button': _0x17642c,
      'panel': this["panel"],
      'open': _0x3ae821,
      'close': () => this["hide"](),
      'isOpen': () => this["panel"]["classList"]['contains']('show'),
      'ignorePointerDown': _0x3be8f1 => this["_shouldKeepOpenForExternalPointerDown"](_0x3be8f1)
    });
  }
  ["_shouldKeepOpenForExternalPointerDown"](_0x26114e) {
    const _0x58e3dd = _0x26114e?.['target'];
    if (!_0x58e3dd?.["closest"]) {
      return ![];
    }
    return !!_0x58e3dd["closest"](FILE_MANAGER_KEEP_OPEN_SELECTOR);
  }
  ["_bindGenerationEvents"]() {
    window["addEventListener"](GENERATION_HISTORY_EVENT, _0x462238 => {
      const _0x57bd8a = _0x462238?.["detail"] || {};
      const _0x15f4d3 = {
        ...(_0x57bd8a["nodeData"] || {})
      };
      !String(_0x15f4d3['id'] || '')["trim"]() && String(_0x57bd8a["sourceNodeId"] || '')['trim']() && (_0x15f4d3['id'] = String(_0x57bd8a["sourceNodeId"])["trim"]());
      const _0x5d8f35 = buildGenerationHistoryAssetsFromNode({
        'images': Array["isArray"](_0x57bd8a["images"]) ? _0x57bd8a["images"] : [],
        'videos': Array["isArray"](_0x57bd8a["videos"]) ? _0x57bd8a["videos"] : [],
        'audios': Array["isArray"](_0x57bd8a["audios"]) ? _0x57bd8a["audios"] : [],
        'nodeData': _0x15f4d3,
        'projectId': this["_getCurrentProjectId"](),
        'canvasId': this["_getCurrentCanvasId"](),
        'generationStartedAt': Number(_0x57bd8a["startedAt"] || _0x15f4d3['generationStartTime'] || 0x0) || undefined,
        'now': Number(_0x57bd8a["createdAt"] || Date["now"]()) || Date["now"]()
      });
      void this["_saveRecords"](_0x5d8f35, {
        'captureSource': "event"
      });
    });
  }
  ["_resetPageState"]() {
    this["records"] = [];
    this["_recordsLoaded"] = ![];
    this['_recordsDirty'] = ![];
    this["_nextOffset"] = 0x0;
    this['_hasMore'] = !![];
    this['_totalRecords'] = 0x0;
    if (this["contentEl"]) {
      this["contentEl"]["scrollTop"] = 0x0;
    }
  }
  ['_resetOutputPageState']() {
    this['outputItems'] = [];
    this["_outputLoaded"] = ![];
    this["_outputNextOffset"] = 0x0;
    this['_outputHasMore'] = !![];
    this['_outputTotalItems'] = 0x0;
    if (this["contentEl"]) {
      this["contentEl"]['scrollTop'] = 0x0;
    }
  }
  ["_normalizeOutputPageResponse"](_0x1f6911, _0x53f821) {
    const _0x58cd74 = Array["isArray"](_0x1f6911?.["items"]) ? _0x1f6911["items"] : [];
    return {
      'items': _0x58cd74,
      'total': Number(_0x1f6911?.['total'] || 0x0) || _0x58cd74["length"],
      'nextOffset': _0x1f6911?.['nextOffset'] === null || _0x1f6911?.["nextOffset"] === undefined ? null : Number(_0x1f6911["nextOffset"]) || Number(_0x53f821) + _0x58cd74["length"],
      'hasMore': Boolean(_0x1f6911?.["hasMore"])
    };
  }
  async ["loadOutputFiles"]({
    dir = this['_outputDir'],
    reset = !![]
  } = {}) {
    if (this['_outputLoading'] && !reset) {
      return;
    }
    const _0x5b4bb6 = String(dir || '')['trim']();
    const _0x1607be = _0x5b4bb6 !== String(this["_outputDir"] || '')["trim"]();
    if (reset || _0x1607be) {
      this["_resetOutputPageState"]();
    } else {
      if (!this["_outputHasMore"] && this["_outputLoaded"]) {
        return;
      }
    }
    this['_activeSource'] = "output";
    this["_outputLoading"] = !![];
    const _0xcb91bd = ++this["_outputLoadToken"];
    if (this["_isOpen"]()) {
      this["render"]();
    }
    const _0x23b0f9 = reset || _0x1607be ? 0x0 : this["_outputNextOffset"];
    try {
      const _0x595ade = await fetchOutputFilesFromServer({
        'dir': _0x5b4bb6,
        'order': this["_sortOrder"],
        'offset': _0x23b0f9,
        'limit': FILE_OUTPUT_PAGE_SIZE
      });
      if (_0xcb91bd !== this["_outputLoadToken"]) {
        return;
      }
      const _0x2f9ceb = this["_normalizeOutputPageResponse"](_0x595ade, _0x23b0f9);
      if (_0x23b0f9 === 0x0) {
        this["outputItems"] = _0x2f9ceb["items"];
      } else {
        const _0x587c57 = new Set(this["outputItems"]["map"](_0x3ff986 => getOutputRecordIdForItem(_0x3ff986)));
        this["outputItems"] = [...this["outputItems"], ..._0x2f9ceb['items']['filter'](_0x5d490f => {
          const _0x5ddb67 = getOutputRecordIdForItem(_0x5d490f);
          if (!_0x5ddb67 || _0x587c57['has'](_0x5ddb67)) {
            return ![];
          }
          _0x587c57["add"](_0x5ddb67);
          return !![];
        })];
      }
      this["_outputDir"] = String(_0x595ade?.["dir"] || '')["trim"]();
      this["_outputParent"] = String(_0x595ade?.["parent"] || '')['trim']();
      this["_outputBreadcrumbs"] = Array["isArray"](_0x595ade?.["breadcrumbs"]) && _0x595ade["breadcrumbs"]["length"] > 0x0 ? _0x595ade["breadcrumbs"] : [{
        'name': 'output',
        'dir': ''
      }];
      this["_outputNextOffset"] = _0x2f9ceb["nextOffset"] === null || _0x2f9ceb["nextOffset"] === undefined ? this['outputItems']['length'] : _0x2f9ceb["nextOffset"];
      this["_outputHasMore"] = _0x2f9ceb["hasMore"];
      this['_outputTotalItems'] = _0x2f9ceb["total"];
      this["_outputLoaded"] = !![];
    } catch (_0x3e6895) {
      if (_0xcb91bd !== this["_outputLoadToken"]) {
        return;
      }
      console['error']("[GenerationHistoryFileManager] 加载输出文件夹失败:", _0x3e6895);
      if (_0x23b0f9 === 0x0) {
        this["outputItems"] = [];
      }
      this["_outputLoaded"] = !![];
    } finally {
      if (_0xcb91bd === this["_outputLoadToken"]) {
        this['_outputLoading'] = ![];
        if (this["_isOpen"]()) {
          this["render"]();
        }
      }
    }
  }
  ['_buildAssetPageParams'](_0xd48c24) {
    const _0x571d5c = {
      'kind': "generation-history",
      'projectId': this["_getCurrentProjectId"](),
      'offset': Number(_0xd48c24) || 0x0,
      'limit': FILE_HISTORY_PAGE_SIZE
    };
    this["_activeSource"] === "current-canvas" && (_0x571d5c["canvasId"] = this["_getCurrentCanvasId"]());
    if (this["_activeFilter"] !== "all") {
      _0x571d5c["mediaKind"] = this["_activeFilter"];
    }
    _0x571d5c["order"] = this['_sortOrder'];
    return _0x571d5c;
  }
  ["_normalizeAssetsPageResponse"](_0x3ff372, _0x515cb3) {
    if (Array["isArray"](_0x3ff372)) {
      return {
        'items': _0x3ff372["filter"](isGenerationHistoryAsset),
        'total': _0x3ff372["length"],
        'nextOffset': null,
        'hasMore': ![]
      };
    }
    const _0x258175 = Array["isArray"](_0x3ff372?.['items']) ? _0x3ff372["items"]['filter'](isGenerationHistoryAsset) : [];
    return {
      'items': _0x258175,
      'total': Number(_0x3ff372?.["total"] || 0x0) || _0x258175["length"],
      'nextOffset': _0x3ff372?.["nextOffset"] === null || _0x3ff372?.["nextOffset"] === undefined ? null : Number(_0x3ff372["nextOffset"]) || Number(_0x515cb3) + _0x258175["length"],
      'hasMore': Boolean(_0x3ff372?.["hasMore"])
    };
  }
  async ["loadRecords"]({
    backfillAfterLoad = ![],
    reset = ![]
  } = {}) {
    if (this["_loading"] && !reset) {
      return;
    }
    if (reset) {
      this["_resetPageState"]();
    }
    if (!this["_hasMore"] && this["_recordsLoaded"]) {
      return;
    }
    const _0x277fb5 = ++this["_loadToken"];
    this["_loading"] = !![];
    if (this['_isOpen']()) {
      this['render']();
    }
    let _0x1a5675 = ![];
    const _0x47ff31 = reset ? 0x0 : this["_nextOffset"];
    try {
      const _0x4bf8df = await fetchAssetsFromServer(this["_buildAssetPageParams"](_0x47ff31));
      if (_0x277fb5 !== this["_loadToken"]) {
        return;
      }
      const _0x138de7 = this['_normalizeAssetsPageResponse'](_0x4bf8df, _0x47ff31);
      const _0x23340 = _0x47ff31 === 0x0 ? _0x138de7["items"] : [...this['records'], ..._0x138de7["items"]["filter"](_0x4ed0ab => !this["records"]["some"](_0x20dc3e => String(_0x20dc3e?.['id'] || '') === String(_0x4ed0ab?.['id'] || '')))];
      this['records'] = dedupeHistoryRecords(_0x23340);
      this["_nextOffset"] = _0x138de7['nextOffset'] === null || _0x138de7["nextOffset"] === undefined ? this['records']["length"] : _0x138de7["nextOffset"];
      this["_hasMore"] = _0x138de7['hasMore'];
      this["_totalRecords"] = _0x138de7["total"];
      this["_recordsLoaded"] = !![];
      this['_recordsDirty'] = ![];
      _0x1a5675 = backfillAfterLoad && _0x47ff31 === 0x0;
    } catch (_0x2a3f86) {
      if (_0x277fb5 !== this["_loadToken"]) {
        return;
      }
      console['error']("[GenerationHistoryFileManager] 加载生成媒体历史失败:", _0x2a3f86);
    } finally {
      if (_0x277fb5 === this["_loadToken"]) {
        this["_loading"] = ![];
        if (this['_isOpen']()) {
          this["render"]();
        }
      }
    }
    _0x277fb5 === this["_loadToken"] && _0x1a5675 && this["_isOpen"]() && void this['_backfillCurrentCanvas']();
  }
  async ["_saveRecords"](_0x500593, {
    captureSource = ''
  } = {}) {
    const _0x4cbea9 = String(captureSource || '')["trim"]();
    const _0x1c751b = (Array["isArray"](_0x500593) ? _0x500593 : [])["map"](_0x26caf9 => _0x4cbea9 ? {
      ..._0x26caf9,
      'historyCaptureSource': _0x4cbea9
    } : _0x26caf9);
    const _0x5f2f24 = new Set();
    const _0x22503c = _0x1c751b["filter"](_0x12e348 => {
      const _0xcf78f3 = String(_0x12e348?.["resultFingerprint"] || '')["trim"]();
      const _0x4b1044 = resolveRecordLocalPath(_0x12e348);
      if (!_0x12e348?.['id'] || !_0xcf78f3 && !_0x4b1044) {
        return ![];
      }
      const _0x2c65b3 = buildHistoryRecordIdentityKey(_0x12e348);
      if (_0x5f2f24["has"](_0x2c65b3)) {
        return ![];
      }
      _0x5f2f24["add"](_0x2c65b3);
      if (this['_savingIds']["has"](_0x12e348['id'])) {
        return ![];
      }
      if (this["_savingRecordKeys"]["has"](_0x2c65b3)) {
        return ![];
      }
      if (_0x4cbea9 === "backfill" && this["records"]["some"](_0x394ac2 => isFileManagerBackfillDuplicate(_0x394ac2, _0x12e348, {
        'getMediaKind': getRecordMediaKind,
        'getLocalPath': resolveRecordLocalPath
      }))) {
        return ![];
      }
      return !this["_hasRecord"](_0x12e348);
    });
    if (_0x22503c["length"] === 0x0) {
      return 0x0;
    }
    let _0x5c64b1 = 0x0;
    for (const _0x295427 of _0x22503c) {
      const _0x51ec32 = buildHistoryRecordIdentityKey(_0x295427);
      this["_savingIds"]['add'](_0x295427['id']);
      if (_0x51ec32) {
        this["_savingRecordKeys"]["add"](_0x51ec32);
      }
      try {
        await saveAssetToServer(_0x295427);
        this["records"] = dedupeHistoryRecords([_0x295427, ...this['records']["filter"](_0x3cf3eb => _0x3cf3eb['id'] !== _0x295427['id'])]);
        _0x5c64b1 += 0x1;
      } catch (_0x18b209) {
        console["error"]("[GenerationHistoryFileManager] 保存生成媒体历史失败:", _0x18b209);
      } finally {
        this['_savingIds']["delete"](_0x295427['id']);
        if (_0x51ec32) {
          this["_savingRecordKeys"]["delete"](_0x51ec32);
        }
      }
    }
    if (_0x5c64b1 > 0x0) {
      if (this["_isOpen"]()) {
        this["render"]();
      } else {
        this["_recordsDirty"] = !![];
      }
    }
    return _0x5c64b1;
  }
  async ["_backfillCurrentCanvas"]() {
    if (this['_backfillInFlight']) {
      return;
    }
    this["_backfillInFlight"] = !![];
    try {
      const _0x461a69 = this["_getCurrentProjectId"]();
      const _0xb7500 = this["_getCurrentCanvasId"]();
      const _0x3ae9cf = a1058_0x55effd["getStateRaw"]?.()["nodes"] || a1058_0x55effd["getState"]()['nodes'] || {};
      const _0x29bb8f = [];
      for (const _0x4ef4e9 of Object["values"](_0x3ae9cf || {})) {
        if (!_0x4ef4e9) {
          continue;
        }
        const _0xdafd99 = String(_0x4ef4e9['type'] || '');
        if (!["ai-image", "ai-video", "ai-audio"]["includes"](_0xdafd99)) {
          continue;
        }
        const _0x390512 = _0xdafd99 === "ai-image" && Array["isArray"](_0x4ef4e9["images"]) ? _0x4ef4e9["images"] : [];
        const _0x25b81e = Array["isArray"](_0x4ef4e9["videos"]) ? _0x4ef4e9["videos"] : [];
        const _0xf0622b = _0xdafd99 === "ai-video" ? _0x25b81e["length"] > 0x0 ? _0x25b81e : String(_0x4ef4e9['videoUrl'] || _0x4ef4e9["localPath"] || '')["trim"]() ? [_0x4ef4e9] : [] : [];
        const _0x4802bd = _0xdafd99 === "ai-audio" && String(_0x4ef4e9['audioUrl'] || _0x4ef4e9["localPath"] || '')["trim"]() ? [_0x4ef4e9] : [];
        if (_0x390512["length"] === 0x0 && _0xf0622b["length"] === 0x0 && _0x4802bd['length'] === 0x0) {
          continue;
        }
        const _0x534f65 = resolveFileManagerBackfillStartedAt(_0x4ef4e9);
        _0x29bb8f['push'](...buildGenerationHistoryAssetsFromNode({
          'images': _0x390512,
          'videos': _0xf0622b,
          'audios': _0x4802bd,
          'nodeData': _0x4ef4e9,
          'projectId': _0x461a69,
          'canvasId': _0xb7500,
          'generationStartedAt': _0x534f65,
          'now': _0x534f65
        }));
      }
      await this['_saveRecords'](_0x29bb8f, {
        'captureSource': "backfill"
      });
    } finally {
      this["_backfillInFlight"] = ![];
    }
  }
  ["show"]() {
    this["panel"]?.["classList"]['add']("show");
    this['panel'] && !this["_panelWidth"] && (this["_panelWidth"] = FILE_PANEL_RESIZE['defaultWidth'], this["panel"]["style"]["width"] = this["_panelWidth"] + 'px');
    if (this['_activeSource'] === 'output') {
      !this["_outputLoaded"] && !this['_outputLoading'] ? void this["loadOutputFiles"]({
        'dir': this["_outputDir"],
        'reset': !![]
      }) : this["render"]();
      return;
    }
    if (!this["_recordsLoaded"] || this["_recordsDirty"]) {
      if (!this['_loading']) {
        void this["loadRecords"]({
          'backfillAfterLoad': !![],
          'reset': !![]
        });
      } else {
        this["render"]();
      }
      return;
    }
    void this['_backfillCurrentCanvas']();
    this["_recordsDirty"] = ![];
    this["render"]();
  }
  ["hide"]() {
    this["_releaseVideoUiResources"]();
    this['panel']?.["classList"]["remove"]("show");
    document["getElementById"]("btnFiles")?.["classList"]["remove"]("active");
  }
  ["render"]() {
    if (!this["contentEl"] || !this['_isOpen']()) {
      return;
    }
    this['_releaseVideoUiResources']();
    this["_renderSourceTabs"]();
    this["_renderFilters"]();
    this["_renderOrderControls"]();
    this["_renderSubtitle"]();
    this["_renderBreadcrumbs"]();
    this["contentEl"]["replaceChildren"]();
    if (isHistorySource(this["_activeSource"]) && this['_loading'] && !this["_recordsLoaded"] || this["_activeSource"] === 'output' && this["_outputLoading"] && !this["_outputLoaded"]) {
      const _0x51f6c1 = document["createElement"]('div');
      _0x51f6c1['className'] = "v2-file-history-empty";
      _0x51f6c1["textContent"] = fileManagerText('loading.initial');
      this["contentEl"]["appendChild"](_0x51f6c1);
      return;
    }
    const _0x157ef6 = this["_visibleRecords"]();
    this['_pruneSelectionToVisibleRecords']();
    if (_0x157ef6["length"] === 0x0) {
      const _0x516425 = document["createElement"]('div');
      _0x516425["className"] = "v2-file-history-empty";
      _0x516425['textContent'] = this["_activeFilter"] === "all" ? this["_activeSource"] === "output" ? fileManagerText('empty.output') : this["_activeSource"] === "current-canvas" ? fileManagerText("empty.currentCanvas") : fileManagerText("empty.history") : fileManagerText("empty.filtered", {
        'label': getMediaLabel(this["_activeFilter"])
      });
      this["contentEl"]["appendChild"](_0x516425);
      this["_clampContentScroll"]();
      return;
    }
    this["_renderMasonry"](_0x157ef6);
    if (isHistorySource(this['_activeSource']) && this["_loading"] && this["_recordsLoaded"] || this["_activeSource"] === 'output' && this['_outputLoading'] && this["_outputLoaded"]) {
      const _0x18f6ea = document["createElement"]("div");
      _0x18f6ea["className"] = "v2-file-history-page-status";
      _0x18f6ea["textContent"] = fileManagerText("loading.more");
      this["contentEl"]["appendChild"](_0x18f6ea);
    }
    this["_clampContentScroll"]();
  }
  ["_renderSourceTabs"]() {
    if (!this["sourceTabsEl"]) {
      return;
    }
    const _0x8eca82 = document["createDocumentFragment"]();
    for (const _0x38313b of FILE_SOURCES) {
      const _0x594447 = document["createElement"]("button");
      _0x594447['type'] = "button";
      _0x594447['className'] = "v2-file-history-source-tab";
      _0x594447["dataset"]["fileAction"] = "source";
      _0x594447["dataset"]['source'] = _0x38313b['key'];
      _0x594447["setAttribute"]("role", "tab");
      _0x594447["setAttribute"]("aria-selected", this["_activeSource"] === _0x38313b["key"] ? "true" : "false");
      _0x594447["classList"]["toggle"]("is-active", this['_activeSource'] === _0x38313b["key"]);
      _0x594447["textContent"] = fileManagerText(_0x38313b["labelKey"]);
      _0x8eca82["appendChild"](_0x594447);
    }
    this["sourceTabsEl"]["replaceChildren"](_0x8eca82);
  }
  ["_renderOrderControls"]() {
    if (!this['orderEl']) {
      return;
    }
    const _0x326ddf = document["createElement"]("button");
    _0x326ddf['type'] = "button";
    _0x326ddf["className"] = "v2-file-history-order-btn";
    _0x326ddf["dataset"]['fileAction'] = "order";
    _0x326ddf["dataset"]["order"] = this["_sortOrder"];
    _0x326ddf["setAttribute"]("aria-label", this["_sortOrder"] === "asc" ? fileManagerText('sort.ascAria') : fileManagerText("sort.descAria"));
    _0x326ddf['title'] = this['_sortOrder'] === "asc" ? fileManagerText("sort.ascTitle") : fileManagerText("sort.descTitle");
    _0x326ddf["innerHTML"] = "\n      <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" class=\"" + (this["_sortOrder"] === 'asc' ? "is-asc" : "is-desc") + "\">\n        <path d=\"M8 5v14\" />\n        <path d=\"M4.5 8.5 8 5l3.5 3.5\" />\n        <path d=\"M16 19V5\" />\n        <path d=\"m12.5 15.5 3.5 3.5 3.5-3.5\" />\n      </svg>\n    ";
    this["orderEl"]['replaceChildren'](_0x326ddf);
  }
  ['_renderSubtitle']() {
    if (!this["subtitleEl"]) {
      return;
    }
    this["subtitleEl"]["textContent"] = this['_activeSource'] === "output" ? fileManagerText("subtitle.output") : this["_activeSource"] === "current-canvas" ? fileManagerText("subtitle.currentCanvas") : fileManagerText("subtitle.history");
  }
  ["_renderBreadcrumbs"]() {
    if (!this['breadcrumbsEl']) {
      return;
    }
    this["breadcrumbsEl"]["replaceChildren"]();
    this['breadcrumbsEl']['classList']['toggle']("is-visible", this["_activeSource"] === 'output');
    if (this['_activeSource'] !== "output") {
      return;
    }
    const _0x47f3d1 = Array['isArray'](this["_outputBreadcrumbs"]) ? this["_outputBreadcrumbs"] : [{
      'name': 'output',
      'dir': ''
    }];
    if (this["_outputDir"]) {
      const _0x3983fd = document["createElement"]("button");
      _0x3983fd["type"] = 'button';
      _0x3983fd["className"] = 'v2-file-history-crumb';
      _0x3983fd["dataset"]["fileAction"] = 'output-dir';
      _0x3983fd["dataset"]['dir'] = this["_outputParent"] || '';
      _0x3983fd["textContent"] = fileManagerText('breadcrumbs.up');
      this["breadcrumbsEl"]["appendChild"](_0x3983fd);
    }
    for (const _0x11c011 of _0x47f3d1) {
      const _0x5de6f2 = document["createElement"]("button");
      _0x5de6f2["type"] = 'button';
      _0x5de6f2['className'] = "v2-file-history-crumb";
      _0x5de6f2["dataset"]["fileAction"] = "output-dir";
      _0x5de6f2["dataset"]["dir"] = String(_0x11c011?.["dir"] || '');
      _0x5de6f2['textContent'] = String(_0x11c011?.["name"] || "output");
      this["breadcrumbsEl"]['appendChild'](_0x5de6f2);
    }
  }
  ['_getMasonryMetrics']() {
    if (!this["contentEl"]) {
      return {
        'contentWidth': 0x1
      };
    }
    const _0x479eab = window["getComputedStyle"](this["contentEl"]);
    const _0x43cab0 = (Number['parseFloat'](_0x479eab["paddingLeft"]) || 0x0) + (Number["parseFloat"](_0x479eab['paddingRight']) || 0x0);
    return {
      'contentWidth': Math['max'](0x1, (this["contentEl"]["clientWidth"] || 0x1) - _0x43cab0)
    };
  }
  ["_getRecordDisplaySize"](_0x2902d0, _0x224fad) {
    const _0x5bb656 = getRecordMediaKind(_0x2902d0);
    const {
      width: _0x1f17b9,
      height: _0x4f8c93
    } = resolveRecordSize(_0x2902d0, _0x5bb656);
    const _0x3ed807 = Math['max'](0x1, _0x1f17b9);
    const _0x2c389f = Math['max'](0x1, _0x4f8c93);
    const _0x592662 = Math['min'](_0x3ed807, _0x2c389f);
    const _0x3ae738 = Math["max"](_0x3ed807, _0x2c389f);
    const _0x13296b = FILE_MASONRY["fixedShortSide"];
    const _0xb51bbc = Math["min"](_0x13296b / _0x592662, FILE_MASONRY["maxLongSide"] / _0x3ae738, _0x3ed807 > _0x224fad ? _0x224fad / _0x3ed807 : 0x1);
    return {
      'width': Math["max"](0x1, Math["round"](_0x3ed807 * _0xb51bbc)),
      'height': Math["max"](0x1, Math["round"](_0x2c389f * _0xb51bbc))
    };
  }
  ["_findMasonrySlot"](_0x110e82, _0x37e471, _0x59820f) {
    const _0x29a42f = FILE_MASONRY["gap"];
    const _0x3a6888 = Math['max'](0x0, _0x59820f - _0x37e471["width"]);
    const _0x182fbc = [];
    for (let _0x23b40d = 0x0; _0x23b40d <= _0x3a6888; _0x23b40d += FILE_MASONRY['placementStep']) {
      _0x182fbc["push"](_0x23b40d);
    }
    if (_0x182fbc[_0x182fbc["length"] - 0x1] !== _0x3a6888) {
      _0x182fbc["push"](_0x3a6888);
    }
    let _0x3b705a = null;
    for (const _0x352a97 of _0x182fbc) {
      let _0x5a401c = 0x0;
      for (const _0x1d1a8b of _0x110e82) {
        const _0x3f1427 = _0x352a97 < _0x1d1a8b['x'] + _0x1d1a8b["width"] + _0x29a42f && _0x352a97 + _0x37e471["width"] + _0x29a42f > _0x1d1a8b['x'];
        if (_0x3f1427) {
          _0x5a401c = Math["max"](_0x5a401c, _0x1d1a8b['y'] + _0x1d1a8b["height"] + _0x29a42f);
        }
      }
      (!_0x3b705a || _0x5a401c < _0x3b705a['y'] || _0x5a401c === _0x3b705a['y'] && _0x352a97 < _0x3b705a['x']) && (_0x3b705a = {
        'x': _0x352a97,
        'y': _0x5a401c
      });
    }
    return _0x3b705a || {
      'x': 0x0,
      'y': 0x0
    };
  }
  ["_renderMasonry"](_0x492100) {
    const {
      contentWidth: _0x1de41f
    } = this["_getMasonryMetrics"]();
    const _0x1945e4 = document['createElement']("div");
    _0x1945e4["className"] = "v2-file-history-masonry-canvas";
    this["contentEl"]['appendChild'](_0x1945e4);
    const _0x582f1a = [];
    let _0x4e7b3c = 0x0;
    for (const _0x37299b of _0x492100) {
      const _0x3ed6da = this["_getRecordDisplaySize"](_0x37299b, _0x1de41f);
      const _0x22e5a3 = this["_findMasonrySlot"](_0x582f1a, _0x3ed6da, _0x1de41f);
      const _0x51a696 = this["_renderCard"](_0x37299b);
      _0x51a696["style"]['left'] = _0x22e5a3['x'] + 'px';
      _0x51a696["style"]["top"] = _0x22e5a3['y'] + 'px';
      _0x51a696["style"]['width'] = _0x3ed6da["width"] + 'px';
      _0x51a696["style"]["height"] = _0x3ed6da["height"] + 'px';
      _0x1945e4['appendChild'](_0x51a696);
      this["_observeVideoThumbnail"](_0x37299b, _0x51a696);
      _0x582f1a["push"]({
        ..._0x22e5a3,
        ..._0x3ed6da
      });
      _0x4e7b3c = Math['max'](_0x4e7b3c, _0x22e5a3['y'] + _0x3ed6da["height"]);
    }
    _0x1945e4["style"]["height"] = _0x4e7b3c + 'px';
  }
  ["_observeVideoThumbnail"](_0x2f6439, _0x32a045) {
    if (getRecordMediaKind(_0x2f6439) !== GENERATION_HISTORY_MEDIA_KINDS["VIDEO"]) {
      return;
    }
    const _0x2dadb6 = resolveGenerationHistoryVideoPresentation(_0x2f6439);
    if (!_0x2dadb6['needsBackfill']) {
      return;
    }
    const _0x28bbb9 = () => {
      if (!_0x32a045?.["isConnected"] || !this["_isOpen"]()) {
        return;
      }
      void this["_ensureVideoThumbnailForRecord"](_0x2f6439)["then"](_0x1781e3 => {
        if (!_0x1781e3 || !_0x32a045?.['isConnected']) {
          return;
        }
        if (String(_0x32a045["dataset"]["recordId"] || '') !== String(_0x2f6439?.['id'] || '')) {
          return;
        }
        const _0x4d3d70 = resolveGenerationHistoryVideoPresentation(_0x1781e3);
        this['_setVideoPosterOnCard'](_0x32a045, _0x4d3d70['posterSrc']);
      });
    };
    const _0xca5c1d = window["IntersectionObserver"];
    if (typeof _0xca5c1d !== "function") {
      queueMicrotask(_0x28bbb9);
      return;
    }
    !this["_videoThumbnailObserver"] && (this["_videoThumbnailObserver"] = new _0xca5c1d(_0x510d7e => {
      for (const _0x3e2279 of _0x510d7e) {
        if (!_0x3e2279?.["isIntersecting"]) {
          continue;
        }
        const _0x5a230b = _0x3e2279['target'];
        const _0x30c60b = this['_videoThumbnailTargets']["get"](_0x5a230b);
        this['_videoThumbnailObserver']?.["unobserve"](_0x5a230b);
        if (!_0x30c60b || !_0x5a230b?.["isConnected"] || !this["_isOpen"]()) {
          continue;
        }
        void this["_ensureVideoThumbnailForRecord"](_0x30c60b)["then"](_0x2e1f81 => {
          if (!_0x2e1f81 || !_0x5a230b?.['isConnected']) {
            return;
          }
          if (String(_0x5a230b["dataset"]['recordId'] || '') !== String(_0x30c60b?.['id'] || '')) {
            return;
          }
          const _0x24e52c = resolveGenerationHistoryVideoPresentation(_0x2e1f81);
          this["_setVideoPosterOnCard"](_0x5a230b, _0x24e52c["posterSrc"]);
        });
      }
    }, {
      'root': this["contentEl"],
      'rootMargin': "240px 0px"
    }));
    this["_videoThumbnailTargets"]["set"](_0x32a045, _0x2f6439);
    this["_videoThumbnailObserver"]['observe'](_0x32a045);
  }
  ["_ensureVideoThumbnailForRecord"](_0x38dfcb) {
    const _0x1fb8ce = resolveGenerationHistoryVideoPresentation(_0x38dfcb);
    if (!_0x1fb8ce["needsBackfill"]) {
      return Promise["resolve"](_0x38dfcb);
    }
    const _0x35dbaa = String(_0x38dfcb?.['id'] || '') + ':' + _0x1fb8ce["mediaSrc"];
    const _0x532dab = this["_videoThumbnailBackfills"]["get"](_0x35dbaa);
    if (_0x532dab) {
      return _0x532dab;
    }
    const _0x4749ca = Array["isArray"](_0x38dfcb?.["nodes"]) ? _0x38dfcb["nodes"][0x0] || {} : {};
    const _0x2820ea = {
      ..._0x4749ca,
      'localPath': resolveRecordLocalPath(_0x38dfcb),
      'videoUrl': _0x1fb8ce["mediaSrc"]
    };
    let _0xb750d5;
    _0xb750d5 = this["_videoThumbnailQueue"]["enqueue"](_0x1fb8ce["mediaSrc"], () => ensureVideoResultThumbnail(_0x2820ea))['then'](_0x4188fe => {
      const _0x53beb5 = applyGenerationHistoryVideoThumbnail(_0x38dfcb, _0x4188fe);
      this["_rememberVideoThumbnail"](_0x53beb5, _0x38dfcb);
      void this["_persistVideoThumbnail"](_0x53beb5, _0x38dfcb);
      return _0x53beb5;
    })["catch"](_0x5bf12b => {
      console["warn"]("[GenerationHistoryFileManager] video thumbnail backfill failed", _0x5bf12b);
      return null;
    })["finally"](() => {
      this["_videoThumbnailBackfills"]["get"](_0x35dbaa) === _0xb750d5 && this['_videoThumbnailBackfills']['delete'](_0x35dbaa);
    });
    this["_videoThumbnailBackfills"]['set'](_0x35dbaa, _0xb750d5);
    return _0xb750d5;
  }
  ["_rememberVideoThumbnail"](_0x371af9, _0x47bf2b) {
    const _0x161fa9 = String(_0x47bf2b?.['id'] || '');
    if (_0x47bf2b?.["outputItem"]) {
      const _0x285c0a = Array["isArray"](_0x371af9?.["nodes"]) ? _0x371af9["nodes"][0x0] || {} : {};
      const _0x139a24 = normalizeLocalPath(_0x285c0a?.["thumbLocalPath"]);
      if (!_0x139a24) {
        return;
      }
      this["outputItems"] = (Array["isArray"](this["outputItems"]) ? this["outputItems"] : [])["map"](_0x1fdda7 => getOutputRecordIdForItem(_0x1fdda7) === _0x161fa9 ? {
        ..._0x1fdda7,
        'thumbLocalPath': _0x139a24
      } : _0x1fdda7);
      return;
    }
    this["records"] = (Array["isArray"](this['records']) ? this['records'] : [])['map'](_0x3c466a => String(_0x3c466a?.['id'] || '') === _0x161fa9 ? _0x371af9 : _0x3c466a);
  }
  async ['_persistVideoThumbnail'](_0x4bb7c5, _0x3c6bc6) {
    try {
      if (_0x3c6bc6?.["outputItem"]) {
        const _0x13a61d = Array["isArray"](_0x4bb7c5?.["nodes"]) ? _0x4bb7c5["nodes"][0x0] || {} : {};
        const _0x650f1c = resolveRecordLocalPath(_0x3c6bc6);
        const _0x1d834b = normalizeLocalPath(_0x13a61d?.["thumbLocalPath"]);
        if (!_0x650f1c || !_0x1d834b) {
          return;
        }
        await saveOutputVideoThumbnailToServer({
          'localPath': _0x650f1c,
          'thumbLocalPath': _0x1d834b
        });
        return;
      }
      await saveAssetToServer(_0x4bb7c5);
    } catch (_0x20f5f6) {
      console["warn"]("[GenerationHistoryFileManager] video thumbnail persistence failed", _0x20f5f6);
    }
  }
  ["_releaseVideoUiResources"]() {
    this['_videoThumbnailObserver']?.["disconnect"]();
    this["_videoThumbnailObserver"] = null;
    this["_videoThumbnailTargets"] = new WeakMap();
    for (const _0x26c625 of this['_mediaPreviewDisposers']) {
      _0x26c625();
    }
    this["_mediaPreviewDisposers"]['clear']();
  }
  ["_relayoutMasonry"]() {
    if (!this["contentEl"] || !this["_isOpen"]()) {
      return ![];
    }
    const _0x558723 = this["contentEl"]["querySelector"]('.v2-file-history-masonry-canvas');
    if (!_0x558723) {
      this["render"]();
      return ![];
    }
    const _0x47f1e9 = this['_visibleRecords']();
    const _0x5c50d3 = new Map(Array["from"](_0x558723["querySelectorAll"](".v2-file-history-card"))["map"](_0x5646bd => [String(_0x5646bd["dataset"]["recordId"] || ''), _0x5646bd]));
    if (_0x47f1e9["length"] !== _0x5c50d3['size']) {
      this["render"]();
      return ![];
    }
    const {
      contentWidth: _0x522562
    } = this["_getMasonryMetrics"]();
    const _0x26dd1d = [];
    let _0x121ce0 = 0x0;
    for (const _0x4f1131 of _0x47f1e9) {
      const _0x5bad33 = String(_0x4f1131?.['id'] || '');
      const _0x3ad4f8 = _0x5c50d3['get'](_0x5bad33);
      if (!_0x3ad4f8) {
        this["render"]();
        return ![];
      }
      const _0x5d38d2 = this['_getRecordDisplaySize'](_0x4f1131, _0x522562);
      const _0x11de43 = this["_findMasonrySlot"](_0x26dd1d, _0x5d38d2, _0x522562);
      _0x3ad4f8["style"]['left'] = _0x11de43['x'] + 'px';
      _0x3ad4f8["style"]["top"] = _0x11de43['y'] + 'px';
      _0x3ad4f8["style"]['width'] = _0x5d38d2["width"] + 'px';
      _0x3ad4f8["style"]["height"] = _0x5d38d2["height"] + 'px';
      _0x26dd1d["push"]({
        ..._0x11de43,
        ..._0x5d38d2
      });
      _0x121ce0 = Math["max"](_0x121ce0, _0x11de43['y'] + _0x5d38d2["height"]);
    }
    _0x558723["style"]["height"] = _0x121ce0 + 'px';
    return !![];
  }
  ['_renderFilters']() {
    if (!this["filterEl"]) {
      return;
    }
    const _0x2bbcb7 = new Map(Array["from"](this["filterEl"]["querySelectorAll"](".v2-file-history-filter"))["map"](_0x448e1a => [_0x448e1a["dataset"]["filter"] || '', _0x448e1a]));
    const _0x17322d = document["createDocumentFragment"]();
    for (const _0x158cd1 of FILE_FILTERS) {
      const _0x514012 = _0x2bbcb7['get'](_0x158cd1["key"]) || document['createElement']("button");
      !_0x514012["dataset"]["filter"] && (_0x514012["type"] = 'button', _0x514012["className"] = "v2-file-history-filter", _0x514012["dataset"]["fileAction"] = "filter", _0x514012["dataset"]['filter'] = _0x158cd1["key"]);
      _0x514012["setAttribute"]('role', 'tab');
      _0x514012["setAttribute"]("aria-selected", this['_activeFilter'] === _0x158cd1["key"] ? "true" : 'false');
      _0x514012["classList"]["toggle"]("is-active", this["_activeFilter"] === _0x158cd1["key"]);
      _0x514012["textContent"] = fileManagerText(_0x158cd1["labelKey"]);
      _0x17322d['appendChild'](_0x514012);
    }
    this["filterEl"]["replaceChildren"](_0x17322d);
  }
  ["_renderCard"](_0x31080f) {
    const _0x24cb87 = document["createElement"]('div');
    _0x24cb87["className"] = "v2-file-history-card";
    _0x24cb87['dataset']['recordId'] = String(_0x31080f?.['id'] || '');
    const _0x34041b = getRecordMediaKind(_0x31080f);
    _0x24cb87["dataset"]["mediaKind"] = _0x34041b;
    _0x24cb87["classList"]["toggle"]('is-selected', this["_selectedRecordIds"]["has"](String(_0x31080f?.['id'] || '')));
    const _0x159422 = document['createElement']("div");
    _0x159422['className'] = 'v2-file-history-thumb\x20is-' + _0x34041b;
    const _0x3ccc28 = resolveRecordAspect(_0x31080f, _0x34041b);
    if (_0x3ccc28) {
      _0x159422["style"]['aspectRatio'] = _0x3ccc28;
    }
    const _0x57d795 = _0x34041b === GENERATION_HISTORY_MEDIA_KINDS['VIDEO'] ? resolveGenerationHistoryVideoPresentation(_0x31080f) : null;
    const _0x58f604 = _0x57d795 ? _0x57d795['posterSrc'] : resolveThumbSrc(_0x31080f);
    const _0x3941fe = _0x57d795?.["mediaSrc"] || resolveMediaSrc(_0x31080f);
    if (_0x34041b === "folder") {
      _0x159422["appendChild"](this["_renderFolderThumb"](_0x31080f));
    } else {
      if (_0x34041b === 'file') {
        _0x159422["appendChild"](this["_renderFileThumb"](_0x31080f));
      } else {
        if (_0x34041b === GENERATION_HISTORY_MEDIA_KINDS["VIDEO"]) {
          _0x24cb87["dataset"]['videoMediaSrc'] = _0x3941fe;
          _0x24cb87['dataset']['videoPosterSrc'] = _0x58f604;
          _0x58f604 ? _0x159422['appendChild'](this["_createVideoPosterImage"](_0x58f604)) : _0x159422['appendChild'](this['_renderVideoPosterPlaceholder']());
          if (_0x3941fe) {
            _0x159422["appendChild"](this["_renderVideoPreviewOverlay"]());
          }
        } else {
          if (_0x34041b === GENERATION_HISTORY_MEDIA_KINDS["AUDIO"]) {
            _0x159422['appendChild'](this["_renderAudioThumb"](_0x3941fe));
          } else {
            if (_0x58f604) {
              const _0x3f7ab5 = document["createElement"]("img");
              _0x3f7ab5["src"] = _0x58f604;
              _0x3f7ab5["alt"] = fileManagerText("alt.imageHistory");
              _0x3f7ab5['draggable'] = ![];
              _0x3f7ab5["decoding"] = "async";
              _0x3f7ab5["loading"] = "lazy";
              _0x159422["appendChild"](_0x3f7ab5);
            }
          }
        }
      }
    }
    _0x24cb87["appendChild"](_0x159422);
    this['_bindHoverPreview'](_0x24cb87, _0x34041b, _0x3941fe);
    return _0x24cb87;
  }
  ["_bindHoverPreview"](_0x4c4bc0, _0x5b0d8f, _0x56f7a4 = '') {
    if (!_0x4c4bc0) {
      return;
    }
    if (_0x5b0d8f === GENERATION_HISTORY_MEDIA_KINDS["VIDEO"]) {
      const _0x267ee5 = _0x4c4bc0['querySelector'](".v2-file-history-video-progress-fill");
      const _0x1a4b9d = String(_0x56f7a4 || _0x4c4bc0["dataset"]["videoMediaSrc"] || '')["trim"]();
      if (!_0x1a4b9d) {
        return;
      }
      let _0x576e3c = null;
      const _0x59d1db = () => {
        if (_0x267ee5) {
          _0x267ee5["style"]["transform"] = "scaleX(0)";
        }
      };
      const _0x178f73 = () => {
        if (!_0x267ee5 || !_0x576e3c) {
          return;
        }
        const _0x18874a = Number(_0x576e3c["duration"] || 0x0);
        const _0x4a1b27 = Number(_0x576e3c["currentTime"] || 0x0);
        const _0x1e03a2 = _0x18874a > 0x0 ? Math['min'](Math["max"](_0x4a1b27 / _0x18874a, 0x0), 0x1) : 0x0;
        _0x267ee5['style']["transform"] = 'scaleX(' + _0x1e03a2 + ')';
      };
      const _0x58ca94 = () => {
        if (!_0x576e3c) {
          return;
        }
        const _0x9490b5 = _0x576e3c;
        _0x576e3c = null;
        _0x9490b5['removeEventListener']("timeupdate", _0x178f73);
        _0x9490b5["removeEventListener"]("loadedmetadata", _0x178f73);
        _0x9490b5['pause']();
        try {
          _0x9490b5['currentTime'] = 0x0;
        } catch {}
        _0x9490b5["removeAttribute"]('src');
        _0x9490b5["load"]?.();
        _0x9490b5["remove"]();
      };
      const _0xb90a93 = () => {
        if (_0x576e3c) {
          return;
        }
        const _0x3951a6 = _0x4c4bc0["querySelector"](".v2-file-history-thumb");
        if (!_0x3951a6) {
          return;
        }
        const _0x25000c = document['createElement']("video");
        _0x25000c["className"] = "v2-file-history-hover-video";
        _0x25000c['src'] = _0x1a4b9d;
        const _0x315f28 = String(_0x4c4bc0['dataset']["videoPosterSrc"] || '')["trim"]();
        if (_0x315f28) {
          _0x25000c["poster"] = _0x315f28;
        }
        _0x25000c["muted"] = ![];
        _0x25000c["volume"] = 0.72;
        _0x25000c['loop'] = !![];
        _0x25000c["playsInline"] = !![];
        _0x25000c["preload"] = "metadata";
        _0x25000c["draggable"] = ![];
        _0x25000c["addEventListener"]('timeupdate', _0x178f73);
        _0x25000c["addEventListener"]('loadedmetadata', _0x178f73);
        const _0x3828ee = _0x3951a6["querySelector"](".v2-file-history-video-preview-overlay");
        _0x3951a6["insertBefore"](_0x25000c, _0x3828ee || null);
        _0x576e3c = _0x25000c;
        _0x4c4bc0["classList"]["add"]("is-preview-playing");
        const _0x487827 = _0x25000c['play']();
        _0x487827 && typeof _0x487827["catch"] === 'function' && _0x487827["catch"](() => {
          if (_0x576e3c !== _0x25000c) {
            return;
          }
          _0x25000c["muted"] = !![];
          const _0x4d63cd = _0x25000c["play"]();
          _0x4d63cd && typeof _0x4d63cd['catch'] === "function" && _0x4d63cd["catch"](() => {
            if (_0x576e3c !== _0x25000c) {
              return;
            }
            _0x4c4bc0["classList"]["remove"]("is-preview-playing");
            _0x59d1db();
            _0x58ca94();
          });
        });
      };
      const _0x9d3bfb = () => {
        _0x58ca94();
        _0x59d1db();
        _0x4c4bc0["classList"]["remove"]('is-preview-playing');
      };
      _0x4c4bc0["addEventListener"]("mouseenter", _0xb90a93);
      _0x4c4bc0["addEventListener"]("mouseleave", _0x9d3bfb);
      const _0x1adde1 = () => {
        _0x4c4bc0["removeEventListener"]("mouseenter", _0xb90a93);
        _0x4c4bc0["removeEventListener"]("mouseleave", _0x9d3bfb);
        _0x58ca94();
        _0x59d1db();
        _0x4c4bc0["classList"]['remove']("is-preview-playing");
      };
      this['_mediaPreviewDisposers']['add'](_0x1adde1);
      return;
    }
    if (_0x5b0d8f === GENERATION_HISTORY_MEDIA_KINDS["AUDIO"]) {
      const _0x1b3804 = String(_0x56f7a4 || '')["trim"]();
      if (!_0x1b3804) {
        return;
      }
      let _0x35882e = null;
      let _0x17efe5 = 0x0;
      const _0x5fb18e = () => {
        _0x17efe5 += 0x1;
        const _0x6c3ea7 = _0x35882e;
        _0x35882e = null;
        _0x4c4bc0["classList"]["remove"]("is-preview-playing");
        if (!_0x6c3ea7) {
          return;
        }
        try {
          _0x6c3ea7["pause"]?.();
        } catch {}
        try {
          _0x6c3ea7["removeAttribute"]?.("src");
          clearDesktopMediaPlaybackSourceMetadata(_0x6c3ea7);
          _0x6c3ea7["preload"] = "none";
          _0x6c3ea7["load"]?.();
        } catch {}
        _0x6c3ea7["remove"]?.();
      };
      const _0x5d895c = () => {
        if (_0x35882e) {
          return;
        }
        const _0x107912 = _0x4c4bc0["querySelector"](".v2-file-history-thumb");
        if (!_0x107912) {
          return;
        }
        const _0xdac0c3 = document["createElement"]("audio");
        const _0x5916b5 = _0x17efe5 + 0x1;
        _0x17efe5 = _0x5916b5;
        _0xdac0c3["preload"] = "auto";
        _0xdac0c3['className'] = "v2-file-history-preview-audio";
        _0xdac0c3['volume'] = 0.72;
        _0x107912["appendChild"](_0xdac0c3);
        _0x35882e = _0xdac0c3;
        void attachMediaElementPlaybackSource(_0xdac0c3, _0x1b3804, {
          'preload': "auto",
          'shouldAssign': () => _0x35882e === _0xdac0c3 && _0x17efe5 === _0x5916b5 && _0x4c4bc0["isConnected"] !== ![]
        })["then"](async _0x5e6efc => {
          if (!_0x5e6efc || _0x35882e !== _0xdac0c3 || _0x17efe5 !== _0x5916b5) {
            return ![];
          }
          await _0xdac0c3["play"]?.();
          return !![];
        })["then"](_0x167ce9 => {
          _0x167ce9 === !![] && _0x35882e === _0xdac0c3 && _0x17efe5 === _0x5916b5 && _0x4c4bc0["classList"]["add"]('is-preview-playing');
        })["catch"](() => {
          _0x35882e === _0xdac0c3 && _0x17efe5 === _0x5916b5 && _0x5fb18e();
        });
      };
      const _0x1b6bbb = () => {
        _0x5fb18e();
      };
      _0x4c4bc0["addEventListener"]("mouseenter", _0x5d895c);
      _0x4c4bc0["addEventListener"]("mouseleave", _0x1b6bbb);
      const _0x2cdecb = () => {
        _0x4c4bc0["removeEventListener"]("mouseenter", _0x5d895c);
        _0x4c4bc0["removeEventListener"]("mouseleave", _0x1b6bbb);
        _0x5fb18e();
      };
      this["_mediaPreviewDisposers"]["add"](_0x2cdecb);
    }
  }
  ["_createVideoPosterImage"](_0xafd803) {
    const _0x476c4b = document["createElement"]('img');
    _0x476c4b["className"] = "v2-file-history-video-poster";
    _0x476c4b['src'] = String(_0xafd803 || '')['trim']();
    _0x476c4b["alt"] = fileManagerText("alt.videoHistory");
    _0x476c4b["draggable"] = ![];
    _0x476c4b["decoding"] = "async";
    _0x476c4b['loading'] = "lazy";
    return _0x476c4b;
  }
  ["_renderVideoPosterPlaceholder"]() {
    const _0x1fd991 = document["createElement"]("div");
    _0x1fd991["className"] = "v2-file-history-video-poster-placeholder";
    _0x1fd991['setAttribute']("aria-hidden", "true");
    _0x1fd991["innerHTML"] = "\n      <svg viewBox=\"0 0 48 48\">\n        <rect x=\"7\" y=\"10\" width=\"34\" height=\"28\" rx=\"5\"></rect>\n        <path d=\"m21 18 10 6-10 6z\"></path>\n      </svg>\n    ";
    return _0x1fd991;
  }
  ['_setVideoPosterOnCard'](_0x3605c0, _0x8900e7) {
    const _0x2568cb = String(_0x8900e7 || '')["trim"]();
    if (!_0x3605c0 || !_0x2568cb) {
      return;
    }
    _0x3605c0["dataset"]["videoPosterSrc"] = _0x2568cb;
    const _0x32451f = _0x3605c0['querySelector']('.v2-file-history-video-poster');
    if (_0x32451f) {
      _0x32451f["src"] = _0x2568cb;
      return;
    }
    const _0x130194 = _0x3605c0["querySelector"]('.v2-file-history-video-poster-placeholder');
    const _0x218a02 = this['_createVideoPosterImage'](_0x2568cb);
    if (_0x130194) {
      _0x130194['replaceWith'](_0x218a02);
      return;
    }
    const _0x4620c8 = _0x3605c0["querySelector"]('.v2-file-history-thumb');
    if (_0x4620c8) {
      _0x4620c8["insertBefore"](_0x218a02, _0x4620c8["firstChild"] || null);
    }
  }
  ['_renderFolderThumb'](_0x13bd53) {
    const _0x362131 = document["createElement"]("div");
    _0x362131["className"] = "v2-file-history-folder-thumb";
    const _0x24fc2d = document["createElement"]('div');
    _0x24fc2d["className"] = "v2-file-history-folder-name";
    _0x24fc2d['textContent'] = _0x13bd53?.["name"] || fileManagerText("fallback.folder");
    _0x362131["innerHTML"] = "\n      <svg viewBox=\"0 0 96 72\" aria-hidden=\"true\">\n        <path d=\"M8 22h28l8 9h44v31a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V22z\" class=\"folder-body\"/>\n        <path d=\"M8 18a8 8 0 0 1 8-8h19l8 9h37a8 8 0 0 1 8 8v6H8V18z\" class=\"folder-tab\"/>\n      </svg>\n    ";
    _0x362131["appendChild"](_0x24fc2d);
    return _0x362131;
  }
  ["_renderVideoPreviewOverlay"]() {
    const _0x5ed864 = document["createElement"]("div");
    _0x5ed864["className"] = 'v2-file-history-video-preview-overlay';
    _0x5ed864["innerHTML"] = "\n      <div class=\"v2-file-history-video-progress\" aria-hidden=\"true\">\n        <div class=\"v2-file-history-video-progress-fill\"></div>\n      </div>\n    ";
    return _0x5ed864;
  }
  ["_renderFileThumb"](_0x23ee1f) {
    const _0xf9af4 = document["createElement"]("div");
    _0xf9af4['className'] = "v2-file-history-file-thumb";
    _0xf9af4["innerHTML"] = "\n      <svg viewBox=\"0 0 72 88\" aria-hidden=\"true\">\n        <path d=\"M14 4h30l14 14v66H14z\" class=\"file-page\"/>\n        <path d=\"M44 4v15h14\" class=\"file-fold\"/>\n      </svg>\n    ";
    const _0x38a320 = document['createElement']('div');
    _0x38a320["className"] = "v2-file-history-folder-name";
    _0x38a320["textContent"] = _0x23ee1f?.["name"] || fileManagerText("fallback.file");
    _0xf9af4["appendChild"](_0x38a320);
    return _0xf9af4;
  }
  ["_renderAudioThumb"]() {
    const _0x48e26d = document["createElement"]("div");
    _0x48e26d["className"] = "v2-file-history-audio-thumb";
    _0x48e26d["innerHTML"] = "\n      <svg viewBox=\"0 0 120 72\" aria-hidden=\"true\">\n        <path d=\"M12 38h8m8 0h8m8 0h8m8 0h8m8 0h8m8 0h8m8 0h8\" class=\"wave-line\"/>\n        <path d=\"M20 48V28m16 28V20m16 36V26m16 30V18m16 38V24m16 26V32\" class=\"wave-bars\"/>\n      </svg>\n      <div class=\"v2-file-history-audio-progress-line\" aria-hidden=\"true\"></div>\n    ";
    return _0x48e26d;
  }
  ["_buildCanvasNodeFromRecord"](_0x361c5b, {
    center: _0x22133f,
    occupiedNodes: _0x49622b,
    index = 0x0
  } = {}) {
    const _0x4cebac = Array["isArray"](_0x361c5b?.['nodes']) ? _0x361c5b["nodes"][0x0] : null;
    if (!_0x4cebac) {
      return null;
    }
    const _0x243e45 = getRecordMediaKind(_0x361c5b);
    const _0x210cde = _0x243e45 === GENERATION_HISTORY_MEDIA_KINDS["VIDEO"] ? "source-video" : _0x243e45 === GENERATION_HISTORY_MEDIA_KINDS["AUDIO"] ? "source-audio" : 'source-image';
    const _0x26ef76 = String(_0x4cebac['type'] || _0x210cde)['trim']() || _0x210cde;
    const _0x5ac55d = normalizeFileManagerSourceNodeForCanvas({
      ..._0x4cebac,
      'type': _0x26ef76
    });
    const _0x4b725e = Number(_0x5ac55d['width'] ?? _0x5ac55d['w']) || (_0x26ef76 === "source-audio" ? 0x140 : 0x104);
    const _0x564e03 = Number(_0x5ac55d['height'] ?? _0x5ac55d['h']) || (_0x26ef76 === "source-audio" ? 0x8c : 0x104);
    const _0x196580 = _0x22133f || this["_getCanvasCenterWorld"]();
    const _0x515923 = findAvailablePosition(_0x49622b || a1058_0x55effd["getState"]()['nodes'], _0x196580['x'] - _0x4b725e / 0x2 + index * 0x18, _0x196580['y'] - _0x564e03 / 0x2 + index * 0x18, _0x4b725e, _0x564e03, 0x18, "right");
    const _0x312b49 = JSON["parse"](JSON['stringify'](_0x5ac55d));
    _0x312b49['id'] = generateId(_0x26ef76);
    _0x312b49["type"] = _0x26ef76;
    _0x312b49['x'] = _0x515923['x'];
    _0x312b49['y'] = _0x515923['y'];
    return _0x312b49;
  }
  ["restoreRecordsToCanvas"](_0x13d287) {
    const _0x15922c = (Array["isArray"](_0x13d287) ? _0x13d287 : [])["filter"](isFileManagerActionableRecord);
    if (_0x15922c['length'] === 0x0) {
      return;
    }
    const _0x19d9e5 = this["_getCanvasCenterWorld"]();
    const _0x469e2d = {
      ...(a1058_0x55effd["getState"]()["nodes"] || {})
    };
    const _0x275410 = [];
    _0x15922c["forEach"]((_0x176743, _0x4375ca) => {
      const _0x286493 = this["_buildCanvasNodeFromRecord"](_0x176743, {
        'center': _0x19d9e5,
        'occupiedNodes': _0x469e2d,
        'index': _0x4375ca
      });
      if (!_0x286493) {
        return;
      }
      _0x469e2d[_0x286493['id']] = _0x286493;
      _0x275410["push"](_0x286493);
    });
    if (_0x275410['length'] === 0x0) {
      return;
    }
    a1058_0x55effd['batch'](() => {
      _0x275410["forEach"](_0x33267f => a1058_0x55effd["addNode"](_0x33267f));
      a1058_0x55effd["setSelectedNodes"](_0x275410["map"](_0x52eb62 => _0x52eb62['id']));
    });
    const _0x1da238 = _0x275410['length'] > 0x1 ? fileManagerText('toasts.addedMany', {
      'count': _0x275410["length"]
    }) : this["_activeSource"] === "output" ? fileManagerText("toasts.addedOutput") : fileManagerText("toasts.addedHistory", {
      'label': getMediaLabel(getRecordMediaKind(_0x15922c[0x0]))
    });
    window["showToast"]?.(_0x1da238, "success");
  }
  ["_openRecordPreview"](_0x1fe4f8) {
    if (!isFileManagerActionableRecord(_0x1fe4f8)) {
      return;
    }
    const _0x4430bc = getRecordMediaKind(_0x1fe4f8);
    const _0x36f19f = resolveMediaSrc(_0x1fe4f8);
    if (_0x4430bc === "image") {
      const _0x42fbc3 = _0x36f19f || resolveThumbSrc(_0x1fe4f8);
      if (_0x42fbc3) {
        openImagePreview(_0x42fbc3, {
          'sidebarSubmenuOwner': FILE_MANAGER_SIDEBAR_KEY
        });
      }
      return;
    }
    _0x4430bc === "video" && _0x36f19f && openVideoPreview(_0x36f19f, {
      'sidebarSubmenuOwner': FILE_MANAGER_SIDEBAR_KEY
    });
  }
  async ["_showRecordInFolder"](_0x40ce26) {
    const _0x5e9c83 = resolveRecordLocalPath(_0x40ce26);
    if (!canShowItemInFolder(_0x5e9c83)) {
      return;
    }
    try {
      await showItemInFolder(_0x5e9c83);
    } catch (_0x444467) {
      console["warn"]("[GenerationHistoryFileManager] 打开资源管理器失败:", _0x444467);
      window["showToast"]?.(fileManagerText("toasts.revealFailed"), 'error');
    }
  }
  ["_showDeleteRecordsConfirm"](_0x5178ad) {
    if (typeof document === "undefined" || !document["body"]) {
      return Promise["resolve"](![]);
    }
    document["getElementById"]("file-manager-delete-confirm-overlay")?.["remove"]();
    return new Promise(_0x24992a => {
      const _0xd57c0b = document["createElement"]("div");
      _0xd57c0b['id'] = "file-manager-delete-confirm-overlay";
      _0xd57c0b["className"] = 'custom-confirm-overlay';
      const _0x157d89 = document["createElement"]("div");
      _0x157d89["className"] = "custom-confirm-box";
      _0x157d89["setAttribute"]("role", 'dialog');
      _0x157d89["setAttribute"]("aria-modal", 'true');
      _0x157d89["setAttribute"]("aria-label", fileManagerText("deleteConfirm.ariaLabel"));
      const _0x7f7830 = document["createElement"]('div');
      _0x7f7830['className'] = "confirm-title";
      _0x7f7830["textContent"] = fileManagerText("deleteConfirm.title");
      const _0x31b743 = document["createElement"]("div");
      _0x31b743["className"] = "confirm-msg";
      _0x31b743["textContent"] = _0x5178ad > 0x1 ? fileManagerText("deleteConfirm.messageMany", {
        'count': _0x5178ad
      }) : fileManagerText('deleteConfirm.messageOne');
      const _0x48514d = document["createElement"]("div");
      _0x48514d['className'] = 'confirm-btns';
      const _0x3b540e = document["createElement"]('button');
      _0x3b540e["type"] = "button";
      _0x3b540e["className"] = "confirm-btn confirm-cancel";
      _0x3b540e["textContent"] = fileManagerText("deleteConfirm.cancel");
      const _0x2f2671 = document["createElement"]("button");
      _0x2f2671["type"] = "button";
      _0x2f2671["className"] = "confirm-btn confirm-ok";
      _0x2f2671['textContent'] = fileManagerText("deleteConfirm.delete");
      _0x48514d["appendChild"](_0x3b540e);
      _0x48514d['appendChild'](_0x2f2671);
      _0x157d89["appendChild"](_0x7f7830);
      _0x157d89["appendChild"](_0x31b743);
      _0x157d89['appendChild'](_0x48514d);
      _0xd57c0b['appendChild'](_0x157d89);
      document["body"]["appendChild"](_0xd57c0b);
      let _0x5c3263 = ![];
      const _0x7e75d = _0x9b0d40 => {
        if (_0x5c3263) {
          return;
        }
        _0x5c3263 = !![];
        document["removeEventListener"]("keydown", _0x1a0d5c, !![]);
        _0xd57c0b['remove']();
        _0x24992a(_0x9b0d40);
      };
      const _0x1a0d5c = _0x5df029 => {
        if (_0x5df029['key'] === "Escape") {
          _0x5df029["preventDefault"]();
          _0x7e75d(![]);
          return;
        }
        _0x5df029['key'] === "Enter" && !_0x5df029["isComposing"] && (_0x5df029["preventDefault"](), _0x7e75d(!![]));
      };
      _0xd57c0b["addEventListener"]('click', _0x2836f0 => {
        if (_0x2836f0["target"] === _0xd57c0b) {
          _0x7e75d(![]);
        }
      });
      _0x3b540e['addEventListener']('click', () => _0x7e75d(![]));
      _0x2f2671["addEventListener"]("click", () => _0x7e75d(!![]));
      document['addEventListener']("keydown", _0x1a0d5c, !![]);
      _0x3b540e['focus']?.();
    });
  }
  async ["_deleteRecords"](_0x52edad) {
    const _0x4c2c0d = (Array["isArray"](_0x52edad) ? _0x52edad : [])["filter"](isFileManagerActionableRecord);
    if (_0x4c2c0d["length"] === 0x0) {
      return;
    }
    const _0x1b07d3 = await this['_showDeleteRecordsConfirm'](_0x4c2c0d["length"]);
    if (!_0x1b07d3) {
      return;
    }
    try {
      if (this['_activeSource'] === "output") {
        const _0x43e596 = _0x4c2c0d['map'](resolveRecordLocalPath)["filter"](Boolean);
        if (_0x43e596['length'] === 0x0) {
          return;
        }
        await deleteOutputFilesFromServer({
          'localPaths': _0x43e596
        });
        const _0x13df60 = new Set(_0x43e596["map"](_0xd617c1 => normalizeLocalPath(_0xd617c1)));
        this['outputItems'] = (Array["isArray"](this['outputItems']) ? this['outputItems'] : [])['filter'](_0x4bb13d => !_0x13df60["has"](normalizeLocalPath(_0x4bb13d?.["localPath"])));
      } else {
        const _0x144511 = _0x4c2c0d['map'](_0x5818ce => String(_0x5818ce?.['id'] || ''))["filter"](Boolean);
        const _0x55d120 = await Promise["all"](_0x144511['map'](_0x34a414 => deleteAssetFromServer(_0x34a414)));
        if (_0x55d120["some"](_0x56cb53 => _0x56cb53 === ![])) {
          throw new Error("delete asset failed");
        }
        const _0x40a703 = new Set(_0x144511);
        this['records'] = (Array["isArray"](this["records"]) ? this['records'] : [])["filter"](_0x13ef44 => !_0x40a703["has"](String(_0x13ef44?.['id'] || '')));
        this["_totalRecords"] = Math["max"](0x0, Number(this['_totalRecords'] || 0x0) - _0x144511['length']);
      }
      this["_selectedRecordIds"]["clear"]();
      if (this['_isOpen']()) {
        this['render']();
      }
      window["showToast"]?.(_0x4c2c0d["length"] > 0x1 ? fileManagerText("toasts.deletedMany") : fileManagerText('toasts.deletedOne'), "success");
    } catch (_0x469d16) {
      console["error"]("[GenerationHistoryFileManager] 删除文件失败:", _0x469d16);
      window["showToast"]?.(fileManagerText("toasts.deleteFailed"), "error");
    }
  }
  ["restoreRecordToCanvas"](_0x1adde4) {
    const _0x282793 = this["_activeSource"] === "output" ? this["_visibleOutputRecords"]()["find"](_0x559a9c => String(_0x559a9c?.['id'] || '') === String(_0x1adde4 || '')) : this["records"]["find"](_0x15ca55 => String(_0x15ca55?.['id'] || '') === String(_0x1adde4 || ''));
    this['restoreRecordsToCanvas'](_0x282793 ? [_0x282793] : []);
  }
}
export const generationHistoryFileManager = new GenerationHistoryFileManager();