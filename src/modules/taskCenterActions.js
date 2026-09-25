import { desktopBridge } from '../services/desktopBridge.js';
import { openExternalLink } from '../services/externalLinkService.js';
import { dispatchCompletionClick } from '../services/completionNotificationService.js';
import { getProviderTaskConsoleUrl } from '../config/providerTaskConsole.js';
import { cancelDreaminaVideoQueueTask } from '../../api/dreaminaGenApi.js';
import { ACTIVE_TASK_STATUSES } from './taskCenterModel.js';
export async function executeTaskCenterAction(_0x3c6020, _0x561e97, _0x112cbb, _0x5376af, _0x155bd8) {
  if (_0x561e97 === "locate") {
    if (_0x112cbb?.["navigation"]) {
      dispatchCompletionClick(_0x112cbb["navigation"]);
    }
    return;
  }
  if (_0x561e97 === "api-console") {
    const _0x37061e = getProviderTaskConsoleUrl(_0x112cbb);
    if (_0x37061e) {
      const _0x5146f5 = await openExternalLink(_0x37061e, {
        'label': _0x155bd8("actions.apiConsole")
      });
      if (_0x5146f5?.['ok'] === ![] || _0x5146f5?.["success"] === ![]) {
        throw new Error(_0x5146f5["error"] || _0x155bd8("actionFailed"));
      }
    }
    return;
  }
  if (_0x561e97 === 'reveal') {
    if (_0x5376af && desktopBridge["shell"]["canShowItemInFolder"]()) {
      await desktopBridge["shell"]["showItemInFolder"]({
        'localPath': _0x5376af
      });
    }
    return;
  }
  if (_0x561e97 === 'copy-error' || _0x561e97 === 'copy-task-id') {
    const _0x30c998 = _0x561e97 === 'copy-error' ? _0x112cbb?.["error"] : _0x112cbb?.["remoteTaskId"];
    if (!_0x30c998) {
      return;
    }
    if (desktopBridge['clipboard']['canUseText']()) {
      await desktopBridge['clipboard']["writeText"]({
        'text': _0x30c998
      });
    } else {
      if (globalThis["navigator"]?.['clipboard']?.['writeText']) {
        await navigator["clipboard"]["writeText"](_0x30c998);
      } else {
        throw new Error(_0x155bd8('copyFailed'));
      }
    }
    globalThis["window"]?.['showToast']?.(_0x155bd8(_0x561e97 === 'copy-error' ? "copySuccess" : "copyTaskIdSuccess"), "success");
    return;
  }
  if (_0x561e97 !== "cancel" || !_0x112cbb?.["cancellable"] || !ACTIVE_TASK_STATUSES["has"](_0x112cbb["status"])) {
    return;
  }
  let _0x9d8026;
  if (_0x112cbb["source"] === "generation" && _0x112cbb['kind'] === "dreaminaVideo") {
    _0x9d8026 = await cancelDreaminaVideoQueueTask(_0x112cbb["taskId"]);
  } else {
    _0x112cbb['source'] === "generation" ? _0x9d8026 = await _0x3c6020["generationCancelTask"](_0x112cbb["nodeId"], {
      'store': _0x3c6020['generationStore'],
      'taskCenterTaskId': _0x112cbb['taskId'],
      'cancellable': !![],
      'abortLocal': !![],
      'taskId': _0x112cbb["remoteTaskId"]
    }) : _0x9d8026 = await desktopBridge["mediaTask"]["cancel"]({
      'taskId': _0x112cbb["taskId"]
    });
  }
  if (_0x9d8026?.['ok'] === ![] || _0x9d8026?.["success"] === ![]) {
    throw new Error(_0x9d8026['reason'] || _0x155bd8("cancelFailed"));
  }
  const _0x48ce7f = _0x3c6020["tasks"]["get"](_0x112cbb['taskId']);
  if (_0x48ce7f && ACTIVE_TASK_STATUSES["has"](_0x48ce7f["status"])) {
    _0x3c6020["upsertTask"]({
      ..._0x48ce7f,
      'status': "cancelled",
      'progress': null,
      'error': '',
      'message': _0x155bd8("cancelledMessage"),
      'finishedAt': Date["now"]()
    });
  }
}