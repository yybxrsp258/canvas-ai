import { buildGenerationSingleResultPatch, firstNonEmptyString, getFirstGenerationResultError, normalizeGenerationResultItems } from '../../core/generationResultRenderer.js';
import { t } from '../../i18n/index.js';
import { normalizeTextResultSources, normalizeTextToolUsage } from '../../utils/textResultMetadata.js';
import { normalizeTextResultImages } from '../../utils/textResultImages.js';
function asObject(_0x51684d) {
  return _0x51684d && typeof _0x51684d === "object" && !Array["isArray"](_0x51684d) ? _0x51684d : null;
}
function normalizeTextGenerationResultItem(_0x2c5a28) {
  const _0x47568b = asObject(_0x2c5a28);
  if (!_0x47568b) {
    throw new Error('[textGenerationResult]\x20item\x20must\x20be\x20an\x20object');
  }
  const _0x2b0f4e = {
    ..._0x47568b,
    'outputType': "text",
    'outputText': firstNonEmptyString(_0x47568b['outputText'], _0x47568b["text"], _0x47568b["output"], _0x47568b["content"], _0x47568b['message']),
    'metadata': _0x47568b["metadata"] && typeof _0x47568b["metadata"] === "object" ? {
      ..._0x47568b["metadata"]
    } : {}
  };
  const _0x380c81 = firstNonEmptyString(_0x47568b["error"]);
  if (_0x380c81) {
    _0x2b0f4e["error"] = _0x380c81;
  }
  return _0x2b0f4e;
}
function getErrorMessage(_0x3a4673, _0x3f485a = '') {
  if (typeof _0x3a4673 === 'string') {
    return firstNonEmptyString(_0x3a4673, _0x3f485a);
  }
  if (typeof _0x3a4673?.["getUserMessage"] === "function") {
    return firstNonEmptyString(_0x3a4673['getUserMessage'](![]), _0x3a4673?.["message"], _0x3f485a);
  }
  return firstNonEmptyString(_0x3a4673?.["message"], _0x3a4673?.['error'], _0x3a4673, _0x3f485a);
}
export function isTextGenerationTimeoutError(_0x2f4a83) {
  const _0x5155d4 = String(_0x2f4a83?.["type"] || _0x2f4a83?.["code"] || '')["trim"]()["toUpperCase"]();
  if (_0x5155d4 === "TIMEOUT" || _0x5155d4 === "TASK_TIMEOUT") {
    return !![];
  }
  const _0x1b6fd6 = getErrorMessage(_0x2f4a83);
  return /(?:timeout|timed\s*out|read\s+timed\s*out|aborterror|请求超时|超时)/i["test"](_0x1b6fd6);
}
export function buildTextGenerationTimeoutOutput(_0x2b67c4) {
  const _0x344dd9 = getErrorMessage(_0x2b67c4);
  return ['**' + t("aigenText.result.timeoutTitle") + '**', '', t('aigenText.result.timeoutReason'), t("aigenText.result.timeoutRetry"), _0x344dd9 ? '' : '', _0x344dd9 ? t("aigenText.result.errorDetail", {
    'detail': _0x344dd9
  }) : '']["filter"]((_0x4ee4d0, _0x2ec23a, _0x107287) => _0x4ee4d0 || _0x107287[_0x2ec23a - 0x1] !== '')["join"]('\x0a')["trim"]();
}
export function normalizeTextGenerationResult(_0x330fdf) {
  const _0x2c9cdc = normalizeGenerationResultItems(_0x330fdf, {
    'collectionField': "texts",
    'singleItemFields': ["outputText", 'text', "output", 'content', "message"]
  });
  if (_0x2c9cdc["length"] === 0x0 && typeof _0x330fdf === 'string') {
    return {
      'outputType': "text",
      'items': [normalizeTextGenerationResultItem({
        'text': _0x330fdf
      })]
    };
  }
  if (_0x2c9cdc["length"] === 0x0) {
    return {
      'outputType': 'text',
      'items': []
    };
  }
  return {
    'outputType': "text",
    'items': _0x2c9cdc["map"](_0x57ec1b => normalizeTextGenerationResultItem(_0x57ec1b))
  };
}
export function getTextGenerationResultError(_0x3599c5) {
  return getFirstGenerationResultError(_0x3599c5?.["outputType"] === "text" && Array['isArray'](_0x3599c5['items']) ? _0x3599c5["items"] : _0x3599c5, {
    'collectionField': "texts",
    'singleItemFields': ['outputText', 'text', "output", "content", "message"]
  });
}
export function buildTextGenerationResultPatch(_0x2c75ba, {
  startedAt = 0x0,
  duration = null
} = {}) {
  const _0x43b9be = _0x2c75ba?.["outputType"] === "text" && Array['isArray'](_0x2c75ba["items"]) ? _0x2c75ba : normalizeTextGenerationResult(_0x2c75ba);
  const _0x3a6afe = _0x43b9be['items']["length"] > 0x0 ? _0x43b9be : {
    'outputType': "text",
    'items': [{
      'outputText': ''
    }]
  };
  return buildGenerationSingleResultPatch(_0x3a6afe, {
    'startedAt': startedAt,
    'duration': duration,
    'buildItemPatch': _0x1031bf => {
      const _0x34630c = firstNonEmptyString(_0x1031bf["outputText"]);
      return _0x34630c ? {
        'outputText': _0x34630c,
        'outputSources': normalizeTextResultSources(_0x1031bf["sources"]),
        'outputImages': normalizeTextResultImages(_0x1031bf['images']),
        'outputImageSearchRequested': _0x1031bf["imageSearchRequested"] === !![],
        'outputToolUsage': normalizeTextToolUsage(_0x1031bf["toolUsage"]),
        'outputWebSearchRequested': _0x1031bf["webSearchRequested"] === !![]
      } : {};
    }
  });
}
export function buildTextGenerationFailurePatch({
  error = '',
  startedAt = 0x0,
  duration = null
} = {}) {
  const _0x4f994a = getErrorMessage(error, t("aigenText.task.generationFailed"));
  const _0x222605 = isTextGenerationTimeoutError(error) ? buildTextGenerationTimeoutOutput(error) : '';
  return buildGenerationSingleResultPatch({
    'outputType': "text",
    'items': [{
      'error': _0x4f994a,
      ...(_0x222605 ? {
        'outputText': _0x222605
      } : {})
    }]
  }, {
    'startedAt': startedAt,
    'duration': duration,
    'buildItemPatch': _0x5afb70 => {
      const _0x25bd41 = firstNonEmptyString(_0x5afb70["outputText"]);
      return _0x25bd41 ? {
        'outputText': _0x25bd41,
        'outputSources': [],
        'outputImages': [],
        'outputImageSearchRequested': ![],
        'outputToolUsage': null,
        'outputWebSearchRequested': ![]
      } : {};
    }
  });
}