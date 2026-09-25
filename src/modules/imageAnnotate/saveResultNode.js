import a1081_0x1cdbdd from '../../core/stores/appStore.js';
import { generateId } from '../../core/math.js';
import { buildGenerationStartPatch } from '../../core/generationTaskLifecycle.js';
import { commit } from '../history.js';
import { calcSafeSpawnPosNearNode } from '../nodeSpawn.js';
import { saveOutputBlob } from '../project.js';
import { buildSourceMediaNodePayload } from '../../services/fileService.js';
import { buildCanvasLocalImageFields } from '../../services/canvasMediaLocalService.js';
import { localPathToUrl, pickResultLocalPath } from '../../utils/localMediaPath.js';
import { buildImageGenerationFailurePatch, buildImageGenerationResultPatch } from '../../components/aigenImage/imageGenerationResultRenderer.js';
import { addToolbarPendingResultNodes, persistToolbarResultNodes, selectToolbarResultNodes, updateToolbarResultNode } from '../toolbarPendingResultNodes.js';
import { t } from '../../i18n/index.js';
function imageAnnotateOutputText(_0x1cfad8, _0x24a483 = {}) {
  return t("imageAnnotate.output." + _0x1cfad8, _0x24a483);
}
function imageAnnotateActionText(_0xe110e2, _0x1522b3 = {}) {
  return t("imageAnnotate.actions." + _0xe110e2, _0x1522b3);
}
export const getSavedAnnotateNodeName = (_0x41d20f, _0xb6c83f) => {
  const _0x36bca1 = _0xb6c83f || imageAnnotateOutputText("baseImage");
  if (_0x41d20f === "repaint") {
    return imageAnnotateOutputText('repaintName', {
      'baseName': _0x36bca1
    });
  }
  if (_0x41d20f === "erase") {
    return imageAnnotateOutputText("eraseName", {
      'baseName': _0x36bca1
    });
  }
  return imageAnnotateOutputText('annotateName', {
    'baseName': _0x36bca1
  });
};
export const getSavedAnnotateSuccessLabel = _0x389cb6 => {
  if (_0x389cb6 === "repaint") {
    return imageAnnotateOutputText("repaintCreated");
  }
  if (_0x389cb6 === 'erase') {
    return imageAnnotateOutputText("eraseCreated");
  }
  return imageAnnotateOutputText("annotateCreated");
};
function resolveAnnotateResultBaseNode(_0x56d44d, _0x4f5f46) {
  return a1081_0x1cdbdd["getState"]()["nodes"]?.[_0x56d44d] || _0x4f5f46 || {};
}
function resolveAnnotateResultLayout(_0x359eb0, _0x1ecdda, _0x14a648) {
  const _0x1a4699 = resolveAnnotateResultBaseNode(_0x359eb0, _0x1ecdda);
  const _0x31f4ee = _0x14a648?.["width"] || _0x1a4699["width"] || 0x104;
  const _0x36d4e2 = _0x14a648?.["height"] || _0x1a4699["height"] || 0x104;
  const _0x4f58c8 = calcSafeSpawnPosNearNode(a1081_0x1cdbdd['getState']()["nodes"], _0x1a4699, _0x31f4ee, _0x36d4e2);
  return {
    'baseNode': _0x1a4699,
    'width': _0x31f4ee,
    'height': _0x36d4e2,
    'x': _0x4f58c8['x'],
    'y': _0x4f58c8['y']
  };
}
export const createPendingAnnotateExportNode = ({
  scene: _0x1b53ae,
  sourceNodeId: _0x42cfdc,
  baseNode: _0x16cb44,
  startedAt = Date["now"](),
  outputSize: _0x87448d
} = {}) => {
  const _0x46d7ca = resolveAnnotateResultLayout(_0x42cfdc, _0x16cb44, _0x87448d);
  const _0x1bfe6e = generateId("source-image");
  const _0x1b01fd = buildSourceMediaNodePayload({
    'id': _0x1bfe6e,
    'type': "source-image",
    'x': _0x46d7ca['x'],
    'y': _0x46d7ca['y'],
    'width': _0x46d7ca["width"],
    'height': _0x46d7ca["height"],
    'name': getSavedAnnotateNodeName(_0x1b53ae, _0x46d7ca["baseNode"]["name"]),
    'src': '',
    'outputText': imageAnnotateActionText("saving"),
    ...buildGenerationStartPatch({
      'startedAt': startedAt
    }),
    'fixedSize': !![],
    'needsAutoResize': ![]
  });
  addToolbarPendingResultNodes({
    'nodes': [_0x1b01fd]
  });
  return {
    'newNodeId': _0x1bfe6e,
    'baseNode': _0x46d7ca["baseNode"],
    'startedAt': startedAt
  };
};
function buildSavedAnnotateResultPatch({
  scene: _0x140db4,
  baseNode: _0x258534,
  saveResult: _0x386ddc,
  fileName: _0xc5fff3,
  startedAt = 0x0
}) {
  const _0x1a6545 = pickResultLocalPath(_0x386ddc);
  const _0x381459 = buildCanvasLocalImageFields({
    ..._0x386ddc,
    'localPath': _0x1a6545,
    'imageUrl': _0x386ddc?.["displayUrl"] || _0x386ddc?.['thumbUrl'] || localPathToUrl(_0x1a6545) || String(_0x386ddc?.['url'] || '')["trim"](),
    'sourceUrl': _0x386ddc?.["originalUrl"] || _0x386ddc?.["url"] || localPathToUrl(_0x1a6545),
    'thumbUrl': _0x386ddc?.['thumbUrl'],
    'fileName': _0xc5fff3
  }, {
    'includeSrc': !![]
  });
  const _0x1b321a = _0x381459["src"] || _0x381459['imageUrl'] || localPathToUrl(_0x1a6545) || String(_0x386ddc?.["url"] || '')["trim"]();
  const _0x8ba22f = buildImageGenerationResultPatch({
    ..._0x386ddc,
    ..._0x381459,
    'imageUrl': _0x381459["imageUrl"] || _0x1b321a,
    'sourceUrl': _0x381459["sourceUrl"] || _0x1b321a,
    'thumbUrl': _0x381459["thumbUrl"] || _0x1b321a,
    'localPath': _0x381459['localPath'] || _0x1a6545,
    'fileName': _0xc5fff3
  }, {
    'startedAt': startedAt
  }) || {};
  return {
    'name': getSavedAnnotateNodeName(_0x140db4, _0x258534?.['name']),
    ..._0x8ba22f,
    ..._0x381459,
    'src': _0x1b321a,
    'localPath': _0x381459["localPath"] || _0x1a6545,
    'fileName': _0xc5fff3,
    'outputText': '',
    'fixedSize': !![],
    'needsAutoResize': ![]
  };
}
export const markAnnotateExportNodeFailed = ({
  targetNodeId: _0x1eb113,
  error: _0x22568e,
  startedAt = 0x0
} = {}) => {
  const _0x566e85 = String(_0x1eb113 || '')["trim"]();
  if (!_0x566e85) {
    return ![];
  }
  const _0x1593af = updateToolbarResultNode(_0x566e85, buildImageGenerationFailurePatch({
    'error': _0x22568e instanceof Error ? _0x22568e['message'] : String(_0x22568e || ''),
    'startedAt': startedAt
  }) || {});
  if (_0x1593af) {
    persistToolbarResultNodes();
  }
  return _0x1593af;
};
export const saveAnnotateExportResult = async ({
  blob: _0x17e4cf,
  exportType: _0x4c8ed5,
  scene: _0xdc8d07,
  sourceNodeId: _0x475671,
  baseNode: _0x3ef771,
  notify = (_0x4f67f3, _0x578ab3) => window["showToast"]?.(_0x4f67f3, _0x578ab3),
  triggerLocalCacheSave = () => window['_triggerLocalCacheSave']?.(),
  targetNodeId = '',
  startedAt = 0x0,
  saveOutputBlobImpl = saveOutputBlob,
  outputSize: _0x239b26,
  naturalWidth: _0x5df937,
  naturalHeight: _0x533ff1
} = {}) => {
  const _0xfda4b0 = _0x4c8ed5 === "image/png" ? 'png' : "jpg";
  const _0x3ab859 = generateId("annotate");
  const _0x1ab3c7 = new File([_0x17e4cf], "annotate_" + _0x3ab859 + '.' + _0xfda4b0, {
    'type': _0x4c8ed5
  });
  const _0x19a731 = await saveOutputBlobImpl(_0x1ab3c7, {
    'ext': _0xfda4b0
  });
  const _0x39774d = pickResultLocalPath(_0x19a731);
  const _0x381a55 = resolveAnnotateResultBaseNode(_0x475671, _0x3ef771);
  const _0x5c45b1 = String(targetNodeId || '')["trim"]();
  const _0x57a21e = _0x5c45b1 || generateId('source-image');
  const _0x15a057 = buildSavedAnnotateResultPatch({
    'scene': _0xdc8d07,
    'baseNode': _0x381a55,
    'saveResult': _0x19a731,
    'fileName': _0x19a731["filename"] || _0x1ab3c7["name"],
    'startedAt': startedAt
  });
  _0x239b26?.["width"] > 0x0 && _0x239b26?.["height"] > 0x0 && (_0x15a057["width"] = _0x239b26["width"], _0x15a057['height'] = _0x239b26["height"]);
  _0x5df937 > 0x0 && _0x533ff1 > 0x0 && (_0x15a057["imageWidth"] = _0x5df937, _0x15a057['imageHeight'] = _0x533ff1);
  if (_0x5c45b1) {
    updateToolbarResultNode(_0x57a21e, _0x15a057);
  } else {
    const _0x213f38 = resolveAnnotateResultLayout(_0x475671, _0x381a55, _0x239b26);
    a1081_0x1cdbdd["addNode"](buildSourceMediaNodePayload({
      'id': _0x57a21e,
      'type': "source-image",
      'x': _0x213f38['x'],
      'y': _0x213f38['y'],
      'width': _0x213f38["width"],
      'height': _0x213f38['height'],
      ..._0x15a057
    }));
  }
  selectToolbarResultNodes([_0x57a21e]);
  commit();
  triggerLocalCacheSave();
  notify(getSavedAnnotateSuccessLabel(_0xdc8d07), 'success');
  return {
    'newNodeId': _0x57a21e,
    'localPath': _0x39774d,
    'srcUrl': _0x15a057['src'],
    'response': _0x19a731
  };
};