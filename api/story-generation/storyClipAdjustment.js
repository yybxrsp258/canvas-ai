import { buildVideoReplicationAudioLanguageRule } from '../../src/domain/storyGeneration/videoReplicationLanguage.js';
import { buildStoryPromptLanguageRule, normalizeStoryPromptLanguage } from '../../src/domain/storyGeneration/promptLanguage.js';
import { getStoryPromptModeLabel, isStoryMinimaxH3PromptMode, isStorySeedance25PromptMode, isStoryWan30PromptMode, normalizeStoryMinimaxH3OfficialTags, normalizeStoryPromptMode } from '../../src/domain/storyGeneration/promptModes.js';
import { getStoryClipPromptModeRewriteRequirements } from '../../src/domain/storyGeneration/promptModeRules.js';
export const STORY_CLIP_ADJUSTMENT_SCHEMA_VERSION = 0x3;
export const STORY_CLIP_ADJUSTMENT_SYSTEM_PROMPT = ["你是一名专业的短剧分镜提示词编辑。", "你的任务是按照用户说明，只调整指定的视频提示词内容，不扩写整集、不创建新片段，也不生成视频。", '保持当前卡片中的人物、场景、道具、剧情事件、对白、画外音和上下文连续；按照用户说明调整镜头组织、节奏与时间，并细化当前情境能够自然呈现的表演。', "候选提示词采用可直接交给视频生成模型执行的画面描述。根据当前镜头选择有表达价值的环境层次、人物位置与朝向、动作过程、姿态或手势、面部表情与视线、道具互动、光影变化和动作落点。", "镜头语言根据剧情、动作和情绪选择观众的观察方式，可写对当前镜头有意义的景别、机位与角度、构图、运镜、焦点和落点。静止或运动都可以；中景、平视、固定镜头在适合当前叙事时也是有效选择。", "用户要求保持的资产引用必须逐字保留；不得为了缩短单镜时长而删除、概括或新增当前卡片的剧情内容。", '如请求包含\x20targetPromptMode，必须严格执行其中对应的目标提示词结构；不同模式的镜头时间语法不可混用。', "scope 为 selection 时，只返回选中文字的替换文本；scope 为 prompt 或 clip 时，返回完整的候选视频提示词。", '不要输出\x20HTML、Markdown、代码块、解释、修改说明或多个方案。MiniMax\x20H3\x20官方格式要求的\x20<Subject\x20N>、<Picture\x20N>、<Video\x20N>、<Audio\x20N>、<d>、<scenetrans>、<cutoff>\x20是提示词文本标签，不是\x20HTML。', '除目标提示词模式必要的英文字段名和官方结构标签外，candidateText\x20的叙述、对白、画外音、歌词和画面文字全部直接输出简体中文。返回\x20JSON\x20前先自行检查并把草稿中的英文正文改写为中文，不要把英文正文交给客户端处理。只返回严格\x20JSON\x20对象，且只能包含\x20candidateText、candidateDurationSeconds\x20两个字段；无需调整总时长时\x20candidateDurationSeconds\x20可以省略。']["join"]('\x0a');
export function createStoryClipAdjustmentApi({
  generateText: _0x200e36,
  parseStrictJson: _0x16a0f3,
  normalizeText: _0x39373c,
  normalizePositiveNumber: _0x211b67,
  getResultText: _0x363034,
  assertPlanningModel: _0x287259,
  buildStoryTextProviderProfilePayload: _0x310e7c,
  requestStrictResult: _0x3d44c2,
  requestTimeoutMs: _0x58e597
} = {}) {
  function _0x2afa74(_0x3865b0) {
    return ["selection", 'prompt', 'clip']["includes"](_0x3865b0) ? _0x3865b0 : "prompt";
  }
  function _0x28c8cd(_0x28595c) {
    return [...new Set((Array["isArray"](_0x28595c) ? _0x28595c : [])["map"](_0x39373c)["filter"](Boolean))]["slice"](0x0, 0x32);
  }
  function _0x16e360(_0x4b0cd4 = {}) {
    const _0x48455d = _0x4b0cd4 && typeof _0x4b0cd4 === "object" && !Array["isArray"](_0x4b0cd4) ? _0x4b0cd4 : {};
    return {
      'projectTitle': _0x39373c(_0x48455d["projectTitle"]),
      ...(_0x48455d["sourceMode"] === "video-replication" ? {
        'audioLanguage': buildVideoReplicationAudioLanguageRule({
          'targetLocale': _0x39373c(_0x48455d["targetLocale"]) || 'source',
          'sourceLanguage': _0x39373c(_0x48455d['sourceLanguage'])
        })
      } : {}),
      'storySummary': _0x39373c(_0x48455d["storySummary"]),
      'episodeNumber': Math["max"](0x1, Math['trunc'](Number(_0x48455d["episodeNumber"]) || 0x1)),
      'episodeTitle': _0x39373c(_0x48455d["episodeTitle"]),
      'episodeSynopsis': _0x39373c(_0x48455d["episodeSynopsis"]),
      'clipTitle': _0x39373c(_0x48455d["clipTitle"]),
      'clipScript': _0x39373c(_0x48455d["clipScript"]),
      'creativeIntent': _0x39373c(_0x48455d["creativeIntent"]),
      'transition': _0x39373c(_0x48455d['transition'])
    };
  }
  function _0x302f52({
    scope = 'prompt',
    instruction = '',
    currentPrompt = '',
    selectedText = '',
    preserveAssetRefs = !![],
    preserveDuration = !![],
    lockedAssetTokens = [],
    lockedDurationTokens = [],
    duration = '',
    maxDurationSeconds = 0x0,
    context = {},
    sourcePromptMode = '',
    targetPromptMode = '',
    targetLanguage = ''
  } = {}) {
    const _0x2c00b2 = _0x2afa74(scope);
    const _0x337aea = _0x211b67(maxDurationSeconds);
    const _0x78971a = preserveDuration !== !![] && _0x2c00b2 !== 'selection' && _0x337aea > 0x0;
    const _0x8d9d04 = Boolean(_0x39373c(targetPromptMode));
    const _0x34b91a = normalizeStoryPromptMode(sourcePromptMode, {
      'allowDeveloperModes': !![]
    });
    const _0x162418 = normalizeStoryPromptMode(targetPromptMode, {
      'allowDeveloperModes': !![]
    });
    const _0x59ccf3 = _0x8d9d04 ? getStoryClipPromptModeRewriteRequirements(_0x162418, {
      'hasAssetRefs': _0x28c8cd(lockedAssetTokens)['length'] > 0x0
    }) : [];
    return JSON['stringify']({
      'task': "adjust_story_clip_prompt",
      'schemaVersion': STORY_CLIP_ADJUSTMENT_SCHEMA_VERSION,
      'scope': _0x2c00b2,
      'instruction': _0x39373c(instruction),
      'targetLanguage': normalizeStoryPromptLanguage(targetLanguage),
      'currentPrompt': _0x39373c(currentPrompt),
      ...(_0x2c00b2 === "selection" ? {
        'selectedText': _0x39373c(selectedText)
      } : {}),
      'locked': {
        'preserveAssetRefs': preserveAssetRefs === !![],
        'preserveDuration': preserveDuration === !![],
        'assetTokens': preserveAssetRefs === !![] ? _0x28c8cd(lockedAssetTokens) : [],
        'durationTokens': preserveDuration === !![] ? _0x28c8cd(lockedDurationTokens) : [],
        'clipDuration': preserveDuration === !![] ? _0x39373c(duration) : ''
      },
      'timing': {
        'sourceDuration': _0x39373c(duration),
        'maxDurationSeconds': _0x337aea,
        'allowReallocation': _0x78971a,
        'minimumShotDurationSeconds': 0.5,
        'durationStepSeconds': 0.5
      },
      ...(_0x8d9d04 ? {
        'promptMode': {
          'source': _0x34b91a,
          'sourceLabel': getStoryPromptModeLabel(_0x34b91a),
          'target': _0x162418,
          'targetLabel': getStoryPromptModeLabel(_0x162418),
          'converting': _0x34b91a !== _0x162418
        }
      } : {}),
      'context': _0x16e360(context),
      'requirements': [buildStoryPromptLanguageRule(targetLanguage, {
        'translateOnly': !_0x39373c(instruction) && (!targetPromptMode || _0x162418 === _0x34b91a)
      }), _0x2c00b2 === "selection" ? "candidateText 只返回选中文字的替换内容，不要返回完整提示词。" : "candidateText 返回调整后的完整视频提示词。", '严格执行\x20instruction，不改变未要求修改的剧情事实。', _0x2c00b2 === 'selection' ? "在 selectedText 范围内补充 instruction 要求的可观察表演，选区外内容保持原样。" : "当 instruction 要求增强画面、电影感或情绪表现时，把原叙述转译成摄像机实际拍到的连续画面，并根据当前镜头选择有表达价值的环境、人物位置、动作过程、表情视线、道具、光影以及镜头观察方式。", _0x2c00b2 === "selection" ? "替换内容的信息密度与原镜头时长自然匹配。" : "镜头语言与动作节拍、情绪落点和对应时长自然匹配；静止或运动镜头都按当前表达需要选择。", preserveAssetRefs === !![] ? _0x78971a ? "assetTokens 中的每个引用必须在最终候选中逐字保留，不能改名或删除；因重新拆分镜头，可以在不同镜头中按需要重复引用同一资产。" : 'assetTokens\x20中的每个引用必须在最终候选中逐字保留，不能改名、删除或重复添加。' : "可以按用户说明调整资产引用。", ..._0x59ccf3, preserveDuration === !![] ? "保持 clipDuration 和 durationTokens，不增加超过当前时长的动作、对白或镜头节拍。" : _0x78971a ? _0x8d9d04 ? '根据\x20targetPromptMode\x20的时间语法重新组织完整提示词；候选总时长不得超过\x20' + _0x337aea + '\x20秒，candidateDurationSeconds\x20必须与目标模式的时间结构一致。完整保留\x20currentPrompt\x20的人物、场景、道具、剧情事件、动作、对白与声音内容。' : '根据\x20instruction\x20决定是否重新拆分镜头和分配时间；instruction\x20未要求改变节奏时，候选总时长应尽量接近\x20sourceDuration。完整保留\x20currentPrompt\x20的人物、场景、道具、剧情事件、动作、对白与声音内容。每个镜头使用“⏱\x20数字s”标记，单镜至少\x200.5\x20秒并按\x200.5\x20秒递增；总时长不得超过\x20' + _0x337aea + " 秒。candidateDurationSeconds 必须等于所有镜头时间标记之和。" : "可以按用户说明调整时间表达，但不得删减当前卡片内容。", _0x78971a ? '只返回\x20JSON：{\x22candidateText\x22:\x22...\x22,\x22candidateDurationSeconds\x22:15}。' : '只返回\x20JSON：{\x22candidateText\x22:\x22...\x22}。']
    });
  }
  function _0x21ffbb(_0x5a04ab) {
    const _0x5bed87 = String(_0x5a04ab ?? '')["match"](/\d+(?:\.\d+)?/);
    const _0xdb4228 = Number(_0x5bed87?.[0x0]);
    return Number["isFinite"](_0xdb4228) && _0xdb4228 > 0x0 ? Number(_0xdb4228["toFixed"](0x1)) : 0x0;
  }
  function _0x2a5d7d(_0x547a61) {
    const _0x51ec4d = [];
    const _0x2b1802 = /⏱\s*(\d+(?:\.\d+)?)\s*(?:s|秒)/gi;
    let _0x4d227d = null;
    while (_0x4d227d = _0x2b1802['exec'](String(_0x547a61 || ''))) {
      const _0x4b3f05 = Number(_0x4d227d[0x1]);
      if (Number["isFinite"](_0x4b3f05) && _0x4b3f05 > 0x0) {
        _0x51ec4d["push"](_0x4b3f05);
      }
    }
    return _0x51ec4d;
  }
  function _0x3bdbdc(_0x2152ab, {
    allowMinimaxH3Tags = ![]
  } = {}) {
    const _0x3bcb84 = [];
    const _0x5abb46 = _0xd75de8 => {
      const _0x4628d8 = "story-h3-tag-" + _0x3bcb84["length"] + '';
      _0x3bcb84["push"]({
        'token': _0x4628d8,
        'tag': _0xd75de8
      });
      return _0x4628d8;
    };
    let _0x149710 = String(_0x2152ab || '');
    allowMinimaxH3Tags && (_0x149710 = _0x149710["replace"](/<\/?d>|<(?:scenetrans|cutoff)>|<(?:Subject|Picture|Video|Audio)\s+\d+>/giu, _0x5abb46));
    _0x149710 = _0x149710["replace"](/<!--[\s\S]*?-->/gu, '')['replace'](/<\s*(script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/giu, '')["replace"](/<\s*\/?\s*(?:script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*>/giu, '')["replace"](/<\s*\/?\s*[a-z][^>]*>/giu, '');
    return _0x3bcb84["reduce"]((_0x3cdb68, {
      token: _0x14f765,
      tag: _0x28b398
    }) => _0x3cdb68["split"](_0x14f765)['join'](_0x28b398), _0x149710)["trim"]();
  }
  function _0x5985c7(_0x2ff12e, _0x2e6512, _0x31f003, _0x381651 = '') {
    const _0x1db8c7 = _0x211b67(_0x31f003);
    if (!_0x2e6512) {
      throw new Error("AI 没有返回候选片段总时长。");
    }
    if (_0x1db8c7 > 0x0 && _0x2e6512 > _0x1db8c7 + 0.001) {
      throw new Error("候选片段总时长不能超过 " + _0x1db8c7 + " 秒。");
    }
    const _0xef5602 = normalizeStoryPromptMode(_0x381651, {
      'allowDeveloperModes': !![]
    });
    if (isStorySeedance25PromptMode(_0xef5602) || isStoryWan30PromptMode(_0xef5602)) {
      const _0x2e05c2 = [...String(_0x2ff12e || '')["matchAll"](/(?:\[)?(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)秒(?:\])?/gu)]["map"](_0x59249e => ({
        'start': Number(_0x59249e[0x1]),
        'end': Number(_0x59249e[0x2])
      }));
      if (!_0x2e05c2['length']) {
        throw new Error("候选提示词没有连续时间区间。");
      }
      let _0x4657e6 = 0x0;
      _0x2e05c2['forEach'](({
        start: _0x5a01bb,
        end: _0x1e2c48
      }) => {
        if (_0x5a01bb !== _0x4657e6 || _0x1e2c48 <= _0x5a01bb) {
          throw new Error("候选提示词的时间区间不连续。");
        }
        _0x4657e6 = _0x1e2c48;
      });
      if (Math["abs"](_0x4657e6 - _0x2e6512) > 0.001) {
        throw new Error("candidateDurationSeconds 必须等于最后一个时间区间的终点。");
      }
      return;
    }
    if (isStoryMinimaxH3PromptMode(_0xef5602)) {
      if (!Number["isInteger"](_0x2e6512) || _0x2e6512 < 0x4 || _0x2e6512 > 0xf) {
        throw new Error("MiniMax H3 候选片段总时长必须为 4 至 15 秒的整数。");
      }
      if (!/(?:integrated_multimodal_description|detailed_description):/u["test"](_0x2ff12e)) {
        throw new Error("MiniMax H3 候选提示词缺少官方镜头描述段落。");
      }
      if (/⏱/u['test'](_0x2ff12e)) {
        throw new Error("MiniMax H3 候选提示词不能包含 ⏱ 时长标签。");
      }
      const _0x334b11 = [...String(_0x2ff12e || '')["matchAll"](/\[Shot\s+\d+\]\s+At\s+(\d{2}):(\d{2}(?:\.\d{3})?)/gu)]["map"](_0x11d021 => Number(_0x11d021[0x1]) * 0x3c + Number(_0x11d021[0x2]));
      if (_0x334b11["some"]((_0x59297f, _0x57fecc) => _0x59297f <= 0x0 || _0x59297f >= _0x2e6512 || _0x57fecc > 0x0 && _0x59297f <= _0x334b11[_0x57fecc - 0x1])) {
        throw new Error("MiniMax H3 候选提示词的切镜时间无效。");
      }
      return;
    }
    const _0x2a04a3 = _0x2a5d7d(_0x2ff12e);
    if (!_0x2a04a3['length']) {
      throw new Error("候选提示词没有为每个镜头分配时间标记。");
    }
    const _0xeca5cc = _0x2a04a3["find"](_0x5416ff => _0x5416ff < 0.5 || Math['abs'](_0x5416ff * 0x2 - Math["round"](_0x5416ff * 0x2)) > 0.001);
    if (_0xeca5cc !== undefined) {
      throw new Error("候选镜头时长必须至少为 0.5 秒，并按 0.5 秒递增。");
    }
    const _0x5e8037 = Number(_0x2a04a3['reduce']((_0x16011b, _0x51dea1) => _0x16011b + _0x51dea1, 0x0)['toFixed'](0x1));
    if (Math['abs'](_0x5e8037 - _0x2e6512) > 0.001) {
      throw new Error('candidateDurationSeconds\x20必须等于所有镜头时间标记之和。');
    }
  }
  function _0x35ea2f(_0x19eec5, {
    requireDuration = ![],
    maxDurationSeconds = 0x0,
    promptMode = ''
  } = {}) {
    const _0x49e8e9 = _0x16a0f3(_0x363034(_0x19eec5), 'AI\x20没有返回候选提示词。');
    let _0xb53db3 = _0x39373c(_0x49e8e9["candidateText"]);
    if (!_0xb53db3) {
      throw new Error('AI\x20返回的候选提示词为空。');
    }
    const _0x149442 = normalizeStoryPromptMode(promptMode, {
      'allowDeveloperModes': !![]
    });
    const _0x5a394e = isStoryMinimaxH3PromptMode(_0x149442);
    _0x5a394e && (_0xb53db3 = normalizeStoryMinimaxH3OfficialTags(_0xb53db3));
    _0xb53db3 = _0x3bdbdc(_0xb53db3, {
      'allowMinimaxH3Tags': _0x5a394e
    });
    if (!_0xb53db3) {
      throw new Error("AI 返回的候选提示词为空。");
    }
    const _0x2eb5b3 = _0x21ffbb(_0x49e8e9["candidateDurationSeconds"]);
    requireDuration && _0x5985c7(_0xb53db3, _0x2eb5b3, maxDurationSeconds, promptMode);
    return {
      'candidateText': _0xb53db3,
      'candidateDurationSeconds': _0x2eb5b3
    };
  }
  function _0x239714(_0x15e4ae, _0x53644e) {
    return String(_0x15e4ae || '')['split'](_0x53644e)["length"] - 0x1;
  }
  function _0x15a79d(_0x55f4ae, _0x2ff948, _0x4f89a9, _0x5609b3, {
    allowCountChange = ![]
  } = {}) {
    const _0x4d062c = _0x28c8cd(_0x4f89a9)['filter'](_0x2bfeba => allowCountChange ? _0x239714(_0x55f4ae, _0x2bfeba) < 0x1 : _0x239714(_0x55f4ae, _0x2bfeba) !== _0x239714(_0x2ff948, _0x2bfeba));
    if (_0x4d062c["length"]) {
      throw new Error(allowCountChange ? "候选内容缺少" + _0x5609b3 + '：' + _0x4d062c["join"]('、') : "候选内容没有原样保留" + _0x5609b3 + '：' + _0x4d062c["join"]('、'));
    }
  }
  async function _0xbea48e({
    scope = 'prompt',
    instruction = '',
    currentPrompt = '',
    selection = null,
    preserveAssetRefs = !![],
    preserveDuration = !![],
    lockedAssetTokens = [],
    lockedDurationTokens = [],
    duration = '',
    maxDurationSeconds = 0x0,
    context = {},
    sourcePromptMode = '',
    targetPromptMode = '',
    targetLanguage = '',
    model = '',
    provider = '',
    providerProfileId = '',
    request = _0x200e36,
    onProgress = null
  } = {}) {
    _0x287259(model, provider);
    const _0x33ec92 = _0x2afa74(scope);
    const _0x40d72b = _0x39373c(instruction);
    const _0x374440 = normalizeStoryPromptMode(sourcePromptMode, {
      'allowDeveloperModes': !![]
    });
    const _0x174ca8 = Boolean(_0x39373c(targetPromptMode));
    const _0x216eb2 = normalizeStoryPromptMode(targetPromptMode, {
      'allowDeveloperModes': !![]
    });
    const _0x4f8a44 = _0x39373c(currentPrompt);
    const _0x52e205 = _0x211b67(maxDurationSeconds);
    const _0x4cf5f1 = preserveDuration !== !![] && _0x33ec92 !== "selection" && _0x52e205 > 0x0;
    const _0x52942f = _0x21ffbb(duration);
    const _0x3fe43c = normalizeStoryPromptLanguage(targetLanguage);
    if (targetLanguage && !_0x3fe43c) {
      throw new Error("请选择支持的转换语言。");
    }
    if (!_0x40d72b && !_0x174ca8 && !_0x3fe43c) {
      throw new Error('请先填写希望\x20AI\x20如何调整，或选择提示词模式。');
    }
    if (!_0x4f8a44) {
      throw new Error("当前片段还没有可调整的视频提示词。");
    }
    let _0x2d4720 = '';
    let _0x1c4807 = 0x0;
    let _0x33b3cd = 0x0;
    if (_0x33ec92 === 'selection') {
      _0x1c4807 = Math["max"](0x0, Math["trunc"](Number(selection?.["start"]) || 0x0));
      _0x33b3cd = Math['max'](_0x1c4807, Math["trunc"](Number(selection?.["end"]) || 0x0));
      _0x2d4720 = _0x39373c(selection?.["text"] || _0x4f8a44["slice"](_0x1c4807, _0x33b3cd));
      if (!_0x2d4720 || _0x4f8a44["slice"](_0x1c4807, _0x33b3cd) !== _0x2d4720) {
        throw new Error("选中文字已经变化，请重新选择后再调整。");
      }
    }
    const _0x2fb997 = _0x302f52({
      'scope': _0x33ec92,
      'instruction': _0x40d72b,
      'currentPrompt': _0x4f8a44,
      'selectedText': _0x2d4720,
      'preserveAssetRefs': preserveAssetRefs,
      'preserveDuration': preserveDuration,
      'lockedAssetTokens': lockedAssetTokens,
      'lockedDurationTokens': lockedDurationTokens,
      'duration': duration,
      'maxDurationSeconds': _0x52e205,
      'context': context,
      'sourcePromptMode': _0x374440,
      'targetPromptMode': _0x174ca8 ? _0x216eb2 : '',
      'targetLanguage': _0x3fe43c
    });
    onProgress?.({
      'stage': "adjusting-story-clip",
      'current': 0x1,
      'total': 0x1,
      'message': "正在生成候选版本"
    });
    return await _0x3d44c2({
      'request': request,
      'requestPayload': {
        'model': _0x39373c(model),
        'provider': _0x39373c(provider),
        ..._0x310e7c(providerProfileId),
        'prompt': _0x2fb997,
        'systemPrompt': [STORY_CLIP_ADJUSTMENT_SYSTEM_PROMPT, buildStoryPromptLanguageRule(_0x3fe43c, {
          'translateOnly': !_0x40d72b && (!_0x174ca8 || _0x216eb2 === _0x374440)
        }) || _0x16e360(context)['audioLanguage']]["filter"](Boolean)["join"]('\x0a'),
        'temperature': 0.45,
        'timeoutMs': _0x58e597
      },
      'parse': _0x5f3441 => {
        const _0x53a9bf = _0x35ea2f(_0x5f3441, {
          'requireDuration': _0x4cf5f1,
          'maxDurationSeconds': _0x52e205,
          'promptMode': _0x174ca8 ? _0x216eb2 : ''
        });
        const _0x3172b6 = _0x33ec92 === "selection" ? _0x39373c('' + _0x4f8a44['slice'](0x0, _0x1c4807) + _0x53a9bf['candidateText'] + _0x4f8a44["slice"](_0x33b3cd)) : _0x53a9bf["candidateText"];
        preserveAssetRefs === !![] && _0x15a79d(_0x3172b6, _0x4f8a44, lockedAssetTokens, "资产引用", {
          'allowCountChange': _0x4cf5f1
        });
        preserveDuration === !![] && _0x15a79d(_0x3172b6, _0x4f8a44, lockedDurationTokens, "时间标记");
        return {
          'schemaVersion': STORY_CLIP_ADJUSTMENT_SCHEMA_VERSION,
          'scope': _0x33ec92,
          'candidateText': _0x3172b6,
          'targetLanguage': _0x3fe43c,
          'candidateDurationSeconds': _0x4cf5f1 ? _0x53a9bf["candidateDurationSeconds"] : _0x52942f || _0x53a9bf["candidateDurationSeconds"],
          'replacementText': _0x33ec92 === "selection" ? _0x53a9bf['candidateText'] : '',
          'sourcePromptMode': _0x374440,
          'targetPromptMode': _0x174ca8 ? _0x216eb2 : _0x374440
        };
      },
      'outputContract': _0x4cf5f1 ? _0x174ca8 ? "candidateText and candidateDurationSeconds; strictly use " + _0x216eb2 + " prompt structure; keep all source content and asset tokens; timing is within maxDurationSeconds" : "candidateText and candidateDurationSeconds; keep all source content and asset tokens; each shot uses a 0.5-second-step timing token; timing sum is within maxDurationSeconds" : "candidateText string; preserve every locked asset and duration token",
      'repairInstruction': _0x4cf5f1 ? _0x174ca8 ? '只修复候选提示词，使其严格符合\x20' + _0x216eb2 + " 的目标结构、资产引用与时间语法；完整保留当前卡片剧情信息，candidateDurationSeconds 不超过上限；不要解释。" : "只修复候选提示词的格式、资产引用与镜头时间分配；完整保留当前卡片内容，确保每镜至少 0.5 秒、按 0.5 秒递增，时间标记总和等于 candidateDurationSeconds 且不超过上限；不要解释。" : "只修复候选提示词的格式与锁定内容；不要解释。",
      'retryTemperature': 0.2
    });
  }
  return {
    'adjustStoryClipPrompt': _0xbea48e,
    'buildStoryClipAdjustmentPrompt': _0x302f52,
    'parseStoryClipAdjustmentResult': _0x35ea2f
  };
}