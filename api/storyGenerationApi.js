import { generateText } from './aiTextApi.js';
import { buildVideoReplicationSourceEvidence, buildVideoReplicationTimingGuidance } from '../src/domain/storyGeneration/videoReplicationSourceAnalysis.js';
import { extractCompleteJsonArrayItems, extractJsonStringProperty, parseStrictJson } from './utils/strictJson.js';
import { normalizePositiveNumber, normalizeStringArray, normalizeText } from './utils/storyGenerationValues.js';
import { normalizeStorySceneHeadingIdentity, storySceneIdentitiesOverlap } from './utils/storySceneIdentity.js';
import { enqueueStoryEpisodeExperimentalRequest } from './storyEpisodeExperimentalRequestQueue.js';
import { enqueueStoryEpisodeRequest } from './storyEpisodeRequestQueue.js';
import { STORY_CLIP_ADJUSTMENT_SCHEMA_VERSION, STORY_CLIP_ADJUSTMENT_SYSTEM_PROMPT, createStoryClipAdjustmentApi } from './story-generation/storyClipAdjustment.js';
import { createParallelStoryAssetExtractor } from './story-generation/storyAssetParallelExtraction.js';
import { createStoryAssetPromptContracts, createStoryAssetExtractionStructuredOutput } from './story-generation/storyAssetExtractionRequest.js';
import { STORY_ASSET_EXTRACTION_KINDS, STORY_ASSET_EXTRACTION_SCHEMA_VERSION, createStoryAssetCompactExtractionResponseSchema, createStoryAssetExtractionResponseSchema, normalizeStoryAssetReference as a158_0x4e1501, parseStoryAssetCompactExtractionResult, parseStoryAssetExtractionResult } from './story-generation/storyAssetExtractionResult.js';
import { createStoryEpisodeOutlinePlanningApi } from './story-generation/storyEpisodeOutlinePlanning.js';
import { createStoryInvocationLifecycle, invokeStoryGenerationRequest } from './story-generation/storyInvocationEvidence.js';
import { repairStoryEpisodeScriptMissingBodyTerminators } from './story-generation/storyEpisodeScriptResponseRecovery.js';
import { STORY_EPISODE_SCRIPT_CONTENT_REVISION_SYSTEM_PROMPT, STORY_EPISODE_SCRIPT_REPAIR_SYSTEM_PROMPT, STORY_EPISODE_SCRIPT_SYSTEM_PROMPT, createStoryEpisodeScriptPromptApi } from './story-generation/storyEpisodeScriptPrompt.js';
import { assertStoryEpisodeSplitTiming, createStoryEpisodeScriptRuntimeGuidance, ensureStoryEpisodeScriptTiming, preserveStoryEpisodeScriptWithoutTimingReview, requestStoryEpisodeScriptTimingReview, resolveStoryEpisodeSplitTimingBudget } from './story-generation/storyEpisodeScriptTiming.js';
import { STORY_MAX_SPOKEN_UNITS_PER_SECOND, countStorySpokenUnits } from './story-generation/storyEpisodeSpokenTiming.js';
import { appendStoryEpisodeSplitPartialRepairFailure, applyStoryEpisodeSplitPartialRepairs, buildStoryEpisodeSplitPartialRepairPrompt, canRepairStoryEpisodeSplitPartialDraft } from './story-generation/storyEpisodeSplitPartialRepair.js';
import { assertPlanningModel, buildStoryTextProviderProfilePayload, getResultText, requestStrictResult } from './story-generation/storyTextRequest.js';
import { STORY_SUMMARY_MAX_PLOT_BEATS, STORY_SUMMARY_SCHEMA_VERSION, STORY_SUMMARY_SYSTEM_PROMPT, createStorySummaryBlueprint } from './story-generation/storySummaryBlueprint.js';
import { createStorySummaryGenerationApi } from './story-generation/storySummaryGeneration.js';
import { isStoryContinuousTimelinePromptMode, isStoryMinimaxH3PromptMode } from '../src/domain/storyGeneration/promptModes.js';
import { createStoryEpisodeSplitCompactSceneCatalog, createStoryEpisodeSplitPromptSceneCatalog } from './story-generation/storyEpisodeScenePromptCatalog.js';
import { appendStoryEpisodePromptModeSystemPrompt, getStoryEpisodeTimelinePlanningRequirements, isStoryEpisodeTimelineGuidance, resolveStoryPromptModeClipMaxSeconds } from '../src/domain/storyGeneration/promptModeRules.js';
import { STORY_EPISODE_COUNT_MAX, STORY_EPISODE_COUNT_OPTIONS, STORY_SCENE_MAX_SECONDS_OPTIONS, STORY_SCRIPT_MODE_NARRATION, STORY_SCRIPT_MODE_PLOT, normalizeStoryPlanningConstraints, normalizeStoryScriptMode, validateStoryPlanningConstraints } from '../src/domain/storyGeneration/planningContract.js';
import { STORY_EPISODE_SPLIT_CAMERA_PRESETS, buildStoryEpisodeSplitBatchResponseSchema, buildStoryEpisodeSplitBlueprintResponseSchema, buildStoryEpisodeSplitSingleResponseSchema } from '../src/domain/storyGeneration/episodeSplitContract.js';
export { STORY_CLIP_ADJUSTMENT_SCHEMA_VERSION, STORY_CLIP_ADJUSTMENT_SYSTEM_PROMPT, STORY_ASSET_EXTRACTION_KINDS, STORY_ASSET_EXTRACTION_SCHEMA_VERSION, STORY_SUMMARY_SCHEMA_VERSION, STORY_SUMMARY_SYSTEM_PROMPT, parseStoryAssetExtractionResult };
export { STORY_EPISODE_COUNT_MAX, STORY_EPISODE_COUNT_OPTIONS, STORY_SCENE_MAX_SECONDS_OPTIONS, STORY_SCRIPT_MODE_NARRATION, STORY_SCRIPT_MODE_PLOT, buildStoryEpisodeSplitBatchResponseSchema, buildStoryEpisodeSplitBlueprintResponseSchema, buildStoryEpisodeSplitSingleResponseSchema, normalizeStoryPlanningConstraints, normalizeStoryScriptMode, validateStoryPlanningConstraints };
export const STORY_GENERATION_SCHEMA_VERSION = 0x2;
export const STORY_PLANNING_SCHEMA_VERSION = 0x1;
export const STORY_EPISODE_SPLIT_SCHEMA_VERSION = 0x3;
export const STORY_EPISODE_BATCHED_SPLIT_SCHEMA_VERSION = 0x3;
export const STORY_EPISODE_OUTLINE_SCHEMA_VERSION = 0x2;
export const STORY_EPISODE_SCRIPT_SCHEMA_VERSION = 0x2;
export const STORY_SOURCE_CHUNK_CHARACTERS = 0x5dc0;
export const STORY_CHAPTER_MIN_CHARACTERS = 0x5dc;
export const STORY_CHAPTER_MAX_CHARACTERS = 0xbb8;
export const STORY_TEXT_REQUEST_TIMEOUT_MS = 0xa * 0x3c * 0x3e8;
export const STORY_TEXT_MAX_OUTPUT_TOKENS = 0x4000;
export const STORY_EPISODE_SPLIT_MAX_OUTPUT_TOKENS = 0x8000;
export const STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS = 0xf * 0x3c * 0x3e8;
const STORY_EPISODE_DEV_RESPONSE_HISTORY_LIMIT = 0x6;
const STORY_EPISODE_OUTLINE_BATCH_SIZE = 0x4;
const STORY_CONTINUITY_MAX_CHARACTER_STATES = 0xc;
const STORY_CONTINUITY_MAX_PROP_STATES = 0xa;
const STORY_CONTINUITY_MAX_UNRESOLVED_THREADS = 0x8;
const STORY_CONTINUITY_MAX_FACTS = 0xc;
const STORY_EPISODE_EXPERIMENTAL_MAX_PLANS_PER_BATCH = 0x8;
const STORY_EPISODE_EXPERIMENTAL_BATCH_TARGET_DURATION_SECONDS = 0x4b;
const STORY_EPISODE_EXPERIMENTAL_FALLBACK_PLAN_DURATION_SECONDS = 0xf;
const STORY_EPISODE_EXPERIMENTAL_MAX_SHOTS_PER_CLIP = 0x0;
const STORY_EPISODE_EXPERIMENTAL_PREFERRED_SHOTS_PER_CLIP = 0x4;
const STORY_EPISODE_EXPERIMENTAL_MAX_FINAL_SHOTS_PER_CLIP = 0x5;
const STORY_EPISODE_EXPERIMENTAL_SOURCE_BEAT_TARGET_CHARACTERS = 0x1a4;
const STORY_EPISODE_SPLIT_TEMPERATURE = 0.2;
const STORY_EPISODE_EXPERIMENTAL_SOURCE_BEAT_MAX_CHARACTERS = 0x26c;
const STORY_EPISODE_EXPERIMENTAL_MAX_CONCURRENT_BATCHES = 0x3;
const STORY_EPISODE_EXPERIMENTAL_MIN_CLIP_DURATION_SECONDS = 0x4;
export const STORY_GENERATION_SYSTEM_PROMPT = ["你是一名专业的短剧故事策划与剧本编辑。", "你的任务仅是创建或整理故事剧情，不生成分镜、镜头提示词、角色绘图提示词、场景绘图提示词或分集方案。", "故事必须具备清晰的主角目标、人物动机、主要阻力、因果推进、关键转折、高潮和结局。", "不要使用空泛评价代替剧情，不要写创作说明，不要向用户提问。", "所有输出使用简体中文。", "只返回一个严格 JSON 对象；不要输出 Markdown、代码块、前后说明、注释或尾随逗号。", 'JSON\x20必须且只能包含\x20title、storyType、storySummary、storyBackground、storySetting、logline、chapters\x20七个字段。', "storySummary 是可独立阅读的故事梗概，概括主角、目标、核心冲突、主要转折和结局。", "storyBackground 说明故事发生的时代、地点、社会环境和初始处境。", "storySetting 说明世界规则、核心机制、人物必须遵守的限制和关键设定。", 'logline\x20用一句话概括主角、目标、阻力和故事钩子。', 'chapters\x20是章节数组，每章必须包含\x20title\x20和\x20content；title\x20是小说式主标题，content\x20使用自然段连续叙事。', "每章 content 必须为 " + STORY_CHAPTER_MIN_CHARACTERS + " 至 " + STORY_CHAPTER_MAX_CHARACTERS + " 个汉字，不能用提纲、重复句或无意义内容凑字数。", '所有章节合在一起必须完整覆盖故事的起因、发展、转折、高潮和结局，不能只输出片段或章节提纲。']["join"]('\x0a');
const STORY_SOURCE_DIGEST_SYSTEM_PROMPT = ["你是长篇剧本信息整理助手。", "只提取原文事实，不续写、不评价、不改变人物关系和事件结果。", "每个分段摘要的 JSON 总内容控制在 1500 个汉字以内。", "只返回严格 JSON，不要输出 Markdown 或其他说明。", 'JSON\x20必须包含\x20characters、settings、events、continuity、endingState。']["join"]('\x0a');
const STORY_ASSET_EXTRACTION_SYSTEM_PROMPT = ['你是专业的影视资产策划\x20Agent。', "你的任务是从已经确认的故事中提取需要保持视觉一致的角色、场景和关键道具资产。", "只依据输入故事提取，不续写剧情，不创建分集或分镜。", "角色的显著外观变化应拆成 appearances；普通情绪变化不要创建新形象。", '同一物理空间在不同年代、完好/损毁、正常/异变、干燥/积水等会明显改变参考画面的状态下，必须保留为同一个场景资产并拆成多个\x20appearances；普通镜头角度、短暂人物活动或不改变空间视觉基准的情绪氛围不拆形象。', "多形象角色的第一个 appearance 视为基础形象；每个 appearance name 都必须填写能区分视觉状态的通用具体名称，例如“日常装束”“正式装束”，禁止使用空值或笼统的“基础形象”。其他形象必须完整复述基础形象中的稳定身份特征，只改变剧情明确要求的服饰、年龄、伤势或状态。", "角色 name 只能填写原文姓名；原文没有姓名时使用不超过 6 个汉字的简短身份名，禁止写身份说明、剧情经历或逗号分隔的描述。", "原文中明确列入出场人物、登场人物或出场角色名单的每一个独立称谓，以及拥有对白、独立动作或被单独指代的每一个角色，都必须逐项返回；不同姓名、称谓或编号的角色不得合并。原文以群体身份出场且需要画面表现时，也必须返回对应的群体角色资产。", '角色\x20role\x20只能是“主角”“配角”“反派”“路人”之一：故事核心主人公标记为主角，推动剧情但不与主角长期对立的重要人物标记为配角，主要阻碍或敌对人物标记为反派，纯背景人物标记为路人。', "每个角色必须提供 voiceDescription 声音设定，并严格按“年龄、性别、身份、口音、情绪底色、声线、语速、说话方式、音色特征”九项描述；声音设定用于后续生成稳定一致的人物声音，不得写环境音、配乐或镜头音效。", "原文未明确的声音维度可依据角色身份、地域、年龄和性格合理设计，但不得改写或违背输入中已经明确的人物设定。", '角色提示词必须具体描述年龄与地域特征、脸型、眉眼、瞳色、鼻形、唇形、肤色与肤质、发型发色、身材体态、服装分层与材质、鞋履和必要穿戴细节，并使用正面全身人物设定图构图；禁止只写性别、年龄和服装等概括词。', '角色提示词只用于生成独立人设图，不是人物剧照：聚焦脸部、发型、体态、服装、鞋履和必要穿戴细节，采用自然站立的正面全身人物设定图构图，不写剧情道具、动作表演、地点、家具、其他人物或剧情场面。', "最终 prompt 只能写需要呈现的正向视觉内容，不得复述任何规则、限制、处理流程、模型说明或其他元说明措辞。", "每个场景资产只能表示一个可独立复用的物理空间；原文场景标题用“/”“／”等并列多个地点时，必须拆成多个原子场景资产，禁止把复合场景标题原样当作资产名称。", "场景提示词必须具体描述时代地点、空间用途、整体布局、前中后景、建筑或室内结构、表面材质、关键陈设、光源方向与色温、时间天气、色彩关系、镜头视角和景别，且默认无人；禁止只写地点与氛围。", "道具提示词必须具体描述用途、造型轮廓、尺寸比例、材质工艺、主辅颜色、纹样标识、磨损状态、关键结构和便于复用的产品设定构图，默认无人物手持。", "输入提供视觉风格时，每个 appearance prompt 必须逐字以完整视觉风格开头，后接资产描述；不得省略、改写或移动到提示词中部。", "所有引用的章节 ID 必须来自输入 chapters。", '所有输出使用简体中文，只返回严格\x20JSON，不要输出\x20Markdown、注释或说明。', "绝对不要复述、复制或改写输入剧本，也不要返回任务说明、输入参数或输出格式说明。", '返回\x20JSON\x20的顶层必须且只能包含\x20assets\x20字段；第一个字符必须是\x20{，最后一个字符必须是\x20}。']['join']('\x0a');
const STORY_EPISODE_PLANNING_SYSTEM_PROMPT = ['你是专业的短剧分集策划\x20Agent。', "你的任务是把已经确认的故事规划成若干连续分集，不生成镜头或视频提示词。", "每集必须有清晰的推进、冲突或信息增量，并在自然节奏点结束。", 'episodeCount\x20是目标分集数，不要求机械地精确凑满；应优先接近目标，通常保持在目标数的\x2090%\x20到\x20100%，且不得超过目标数。', "只有故事容量确实不足时才可低于建议范围；不得因输出篇幅、模型省略或提前收束剧情而大幅减少集数。", "sceneMaxSeconds 是后续单个视频片段的时长上限，不是整集时长。", "每集时长只能根据本集必要剧情、对白、动作、反应和自然停顿估算；不得套用固定集长，也不得为了接近某个秒数增加或删除剧情。", 'assetRefs\x20必须逐字使用输入资产\x20ref，不得编造不存在的资产引用。', "所有输出使用简体中文，只返回严格 JSON，不要输出 Markdown、注释或说明。"]["join"]('\x0a');
const STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE = "时长按当前人物把对白和表演自然完成所需来判断。口播字数只是参考之一，同时结合人物性格、语速、情绪、句式、呼吸、动作、停顿和反应；同样字数可以说得快，也可以说得慢，表情、动作与反应也可以同步发生。每个 shot.d 直接给出足以让该镜头 q 与 o 自然说完并完成必要动作和反应的时长；当前片段容纳不下时，在自然叙事位置续到下一 clip。不得依靠不自然的高速口播塞入对白，也不要按固定字数或固定每秒字数计算。";
const STORY_EPISODE_SPLIT_GROUPING_GUIDANCE = 'clip\x20表示一次可独立生成的连续叙事片段，shots\x20表示该片段内部按观看节奏切换的镜头。先确定\x20clip\x20的连续表演过程，再在每个\x20clip\x20内设计\x20shots；不要先逐个设计\x20shot\x20再把每个\x20shot\x20分别包装成\x20clip。相邻内容仍处于同一场景与时段，并共同完成一段连续动作、同一轮对话及其表情或反应时，把它们组织为同一\x20clip\x20的连续\x20shots。说话人、景别、机位、视角、构图、运镜、表情或反应镜头的变化属于\x20shot\x20层级，不会单独决定片段边界。进入新的场景或时空、动作与情绪自然转入新的叙事阶段，或继续组织将超过用户设置的单片最大时长时，再自然进入下一\x20clip；片段与镜头数量按正文实际结构自然决定。';
const STORY_EPISODE_SPLIT_CONTINUITY_CHAIN_GUIDANCE = "单片时长上限只是生成能力造成的技术切片边界，不是剧情重新开场。相邻内容仍在同一 sourceSceneRef 和连续时空时，后一片段必须从前一片段结束的可观察状态继续：继承人物位置、朝向、动作进度、情绪、视线、手持道具、车辆或设备状态及空间方向；不得让人物返回更早位置、重复已经完成的动作、复原已经改变的道具或重新建立场景，除非原文明确写出返回、重复、复原、换场或时间跳跃。";
const STORY_EPISODE_SPLIT_PLOT_MODE_GUIDANCE = "scriptMode 为 plot（剧情模式）时，剧本中未标注说话人的普通动作和环境叙述用于设计画面 v，不作为可听见的解说。只有原剧本明确标注为旁白、画外音、VO 或 O.S. 的文字才放入 o；没有这种明确标注时 o 为空字符串。";
const STORY_EPISODE_SPLIT_NARRATION_MODE_GUIDANCE = "scriptMode 为 narration（解说模式）时，所有“旁白：”文本逐字放入对应 shot.o；shot.q 只保留原剧本已经存在的关键人物对白。";
const STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE = 'q\x20中每段人物对白都必须明确保留原文说话人，使用“说话人姓名：对白原文”的格式；不得只写台词正文，也不得因画面中只有一个人物而省略姓名。没有人物对白时\x20q\x20为空字符串。';
const STORY_EPISODE_SPLIT_VISUAL_GUIDANCE = "shot.visual 是可直接交给 AI 视频模型执行的正向画面提示词，不是剧情摘要、文学描述或创作说明。把原文转译成摄像机实际可见、可连续生成的画面；每一个 shot.visual 都必须明确当前可见主体、人物位置与朝向、正在发生的具体动作或状态变化、表情与视线、必要的环境层次、道具互动、光影变化以及动作落点。环境、心理、背景和情绪信息只要有叙事价值，就必须转换为原文能够支持的可观察行为或画面变化；禁止只写“他很害怕”“气氛紧张”“她意识到危险”“内心挣扎”等抽象结论。对白或旁白镜头也必须有与语义同步的可见表演、听者反应或环境事件，不能只让人物站着说话或只复述台词。";
const STORY_EPISODE_SPLIT_CAMERA_GUIDANCE = "镜头语言根据当前剧情、动作和情绪选择观众的观察方式，可交代对本镜头有意义的景别、机位与角度、构图、运镜、焦点和落点。静止或运动镜头都可以；中景、平视、固定镜头在适合当前叙事时也是有效选择。";
const STORY_EPISODE_SPLIT_SYSTEM_PROMPT = ["把输入正文按原顺序直接整理为采用可执行视频描述方式的短剧视频片段，不分析、不续写。", '只返回一个完整、闭合的\x20JSON\x20对象；不要输出\x20Markdown、代码块、解释、注释或任何前后缀。', "格式只能是 {\"clips\":[{\"s\":\"场景代码\",\"shots\":[{\"d\":镜头秒数,\"v\":\"连续可观察画面\",\"c\":\"景别、机位与运镜\",\"q\":\"完整对白或空字符串\",\"o\":\"完整旁白或空字符串\",\"a\":\"必要音效或空字符串\"},{\"d\":后续镜头秒数,\"v\":\"后续连续可观察画面\",\"c\":\"后续景别、机位与运镜\",\"q\":\"完整对白或空字符串\",\"o\":\"完整旁白或空字符串\",\"a\":\"必要音效或空字符串\"}]}]}。示意中的两个 shot 只展示同一 clip 内的层级关系，实际数量按当前片段内容自然确定；不得增加其他键。", "clips 中每一项是一个最终视频片段；s 必须逐字使用输入 scenes 中的 code，不得填写场景名称或编造代码。", "人物对白按原文顺序放入 q，旁白按原文顺序放入 o，都必须逐字完整保留；说出口或画外叙述的文字不得放入 v。", '严格读取输入\x20scriptMode，并按剧情模式或解说模式分别处理普通动作叙述与明确画外音。', STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE, STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, STORY_EPISODE_SPLIT_GROUPING_GUIDANCE, STORY_EPISODE_SPLIT_VISUAL_GUIDANCE, STORY_EPISODE_SPLIT_CAMERA_GUIDANCE, "有对白时让人物表情、视线、姿态和动作与台词同步，听者反应按当前表演节拍自然安排；a 记录对画面有帮助的环境声、动作声和表演声。q、o、a 没有内容时返回空字符串。", "每镜内容与 d 保持自然匹配；保持原剧情事实和资产，不额外扩写事件、人物、能力、道具或结果，也不输出表头、序号、@、人物外貌或结构标签。", "忽略“（本集完）”“（全剧终）”“待续”等编辑标记；只有原文明示为屏幕字幕的文字才表现字幕。"]['join']('\x0a');
const STORY_EPISODES_SPLIT_SYSTEM_PROMPT = ["按输入剧本原顺序拆分分镜，不分析、不续写。", "严格读取输入 scriptMode，并按剧情模式或解说模式分别处理普通动作叙述与明确画外音。", STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE, STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, STORY_EPISODE_SPLIT_GROUPING_GUIDANCE, STORY_EPISODE_SPLIT_VISUAL_GUIDANCE, STORY_EPISODE_SPLIT_CAMERA_GUIDANCE, '只返回一个完整\x20JSON\x20对象。']["join"]('\x0a');
const getStoryEpisodeSplitRequestSystemPrompt = ({
  compactPrompt = ![],
  promptMode = "seedance-2.0"
} = {}) => appendStoryEpisodePromptModeSystemPrompt(compactPrompt ? STORY_EPISODES_SPLIT_SYSTEM_PROMPT : STORY_EPISODE_SPLIT_SYSTEM_PROMPT, promptMode, {
  'announceTimelineContract': !![]
});
const STORY_EPISODES_SPLIT_VALIDATION_SYSTEM_PROMPT = "只检查并修复已有分镜结果的 JSON 格式和字段包装。不得增删、改写或重新生成分镜内容。只返回修复后的完整 JSON。";
const STORY_EPISODE_BATCHED_BLUEPRINT_SYSTEM_PROMPT = ["你是专业的短剧分镜总规划 Agent。", '你的任务是先为一整集建立连续片段蓝图，不写具体分镜、镜头语言或最终视频提示词。', "必须按原剧本顺序完整覆盖全部 sourceBeats；每个 sourceBeatRef 必须且只能出现一次，每个 clipPlan 代表一个之后会独立生成的视频片段。", '每个\x20clipPlan\x20只能覆盖同一个\x20sourceSceneRef\x20中连续的\x20sourceBeatRefs，换场必须新建\x20clipPlan。', "sourceBeat 用于跟踪原文覆盖，不直接决定片段边界；一个 clipPlan 可以承载多个相互关联的动作、对白和反应。", STORY_EPISODE_SPLIT_GROUPING_GUIDANCE, STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, STORY_EPISODE_SPLIT_CONTINUITY_CHAIN_GUIDANCE, "entryState 与 exitState 必须明确记录人物位置、动作状态、情绪、视线、关键道具和空间方向，供后续分批生成保持连续。", "同一 sourceSceneRef 的相邻 clipPlan 必须形成状态链：后一项 entryState 逐项继承前一项 exitState，再从该状态推进当前 beat；禁止把每个 clipPlan 当成独立开场。", 'beat、entryState、exitState\x20各只写一句必要信息，不复述原文，不输出镜头细节。', '不得新增输入中不存在的人物、对白、资产、事件、规则或结局。', "只返回严格 JSON，不要输出 Markdown、注释、说明或具体 shots。"]["join"]('\x0a');
const STORY_EPISODE_BATCHED_EXPANSION_SYSTEM_PROMPT = ["你是专业的短剧分镜脚本 Agent。", "你当前只展开输入 batch.clipPlans，不重新规划整集；必须按给定顺序为每个计划准确返回一个同 ref 的 clip。", "返回的 clip 只是按 clipPlan 分开的中间展开容器，不直接提交给视频模型；客户端会把同场景的原子分镜按动作切点重组为最终视频段。", "每个 clip 只能绑定 clipPlan 指定的一个场景资产；至少一个 shot.assetUsages 必须引用该场景的 assetRef 和 appearanceRef。", "输出供客户端重组的原子分镜流，而不是最终视频段；正文中的完整对白或旁白发言单元在一个 shot.dialogue 或 shot.voiceover 中逐字保留。", STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE, STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, STORY_EPISODE_SPLIT_CONTINUITY_CHAIN_GUIDANCE, "只有正文已经明确写出说话人停顿、动作介入、他人插话或新的独立引号发言时，才能建立新的发言分镜；不得依据逗号、字数、时长偏好或镜头数量自行给正文断句。", '如实规划每个\x20shot\x20的\x20durationSec；实验分批不限制单个\x20clip\x20的总时长，不得为了凑时长压缩对白、动作或表演停顿。', "每个 shot 可返回 cutAfter：完整发言结束后可用 preferred 或 allowed；完整发言尚未结束时必须为 forbidden。客户端只会在完整发言之间结合场景边界和时长上限完成最终分组。", STORY_EPISODE_SPLIT_CAMERA_GUIDANCE, "每个分镜中，画面实际出现的已登记角色必须来自 clipPlan.characterAssetRefs，并逐个把具体 appearanceRef 写入 shot.assetRefs；资产没有形象时才写 assetRef。角色只在 visual 首次出现时使用 assets[].name，后续优先使用他/她/该角色；存在指代歧义时使用普通姓名。dialogue 的说话人标签始终使用普通姓名，任何文本字段都不要输出 @。", "只返回生成当前分镜必需的紧凑字段；script、creativeIntent、transition 和 time 由客户端依据蓝图本地补全。" + STORY_EPISODE_SPLIT_VISUAL_GUIDANCE + " camera 聚焦当前分镜的观察方式。", "shot.audio 只写必要的环境声、动作音效和可听见的表演声；允许呼吸、喘息、啜泣、衣物摩擦等与当前动作直接相关的声音。禁止固定人物音色设定、对白内容复述和脱离剧情的配乐分析；没有必要音效时返回空字符串。", "不得使用‘上一片段’‘下一片段’等外部上下文表达；连续状态要直接改写为当前 clip 内可观察的起始状态。", '不得新增输入中不存在的人物、对白、资产、事件、规则或结局。', "所有输出使用简体中文，只返回严格 JSON，不要输出 Markdown、注释或说明。"]['join']('\x0a');
const STORY_EPISODE_DIRECTOR_CONTINUITY_BLUEPRINT_SYSTEM_PROMPT = [STORY_EPISODE_BATCHED_BLUEPRINT_SYSTEM_PROMPT, "当前是开发测试专用的导演连续性提示词实验。", "除人物空间状态外，为每个 clipPlan 返回 openingShotIntent 与 closingShotIntent，用来表达镜头的叙事关注点和与相邻计划的画面关系；具体观察方式由剧情和表演决定。", "场景图片是固定空间锚点，人物位置必须使用可观察地标描述；镜头变化不得镜像或重构场景。"]["join"]('\x0a');
const STORY_EPISODE_DIRECTOR_CONTINUITY_EXPANSION_SYSTEM_PROMPT = [STORY_EPISODE_BATCHED_EXPANSION_SYSTEM_PROMPT, "当前是开发测试专用的导演连续性提示词实验。", "由你根据剧情和表演自主设计镜头数量、角度、构图、运镜和剪辑方式。", '每个\x20shot\x20必须返回\x20transitionFromPrevious，说明切镜、动作匹配、视线匹配、反应镜头、道具插入或连续长镜等衔接选择及叙事原因。', "避免无动机地连续重复同一主体、景别、机位和构图；也不要把普通争吵默认处理成双人纯侧面一镜到底。"]["join"]('\x0a');
const getStoryEpisodeExperimentalExpansionSystemPrompt = ({
  promptExperiment = ![],
  promptMode = "seedance-2.0"
} = {}) => appendStoryEpisodePromptModeSystemPrompt(promptExperiment ? STORY_EPISODE_DIRECTOR_CONTINUITY_EXPANSION_SYSTEM_PROMPT : STORY_EPISODE_BATCHED_EXPANSION_SYSTEM_PROMPT, promptMode);
function createStoryEpisodeExperimentalStructuredOutput(_0x4adf42, _0x23e24e) {
  return {
    'name': _0x4adf42,
    'schema': _0x23e24e,
    'strict': !![],
    'fallback': "prompt"
  };
}
function normalizeStoryContinuityFacts(_0x497c0d) {
  return normalizeStringArray(_0x497c0d)["slice"](0x0, STORY_CONTINUITY_MAX_FACTS);
}
function normalizeStoryContinuityState(_0xbdd4c2 = {}) {
  const _0x888958 = _0xbdd4c2 && typeof _0xbdd4c2 === "object" && !Array["isArray"](_0xbdd4c2) ? _0xbdd4c2 : {};
  return {
    'characters': normalizeStringArray(_0x888958['characters'] || _0x888958['characterStates'])["slice"](0x0, STORY_CONTINUITY_MAX_CHARACTER_STATES),
    'props': normalizeStringArray(_0x888958['props'] || _0x888958['propStates'] || _0x888958["items"])["slice"](0x0, STORY_CONTINUITY_MAX_PROP_STATES),
    'unresolvedThreads': normalizeStringArray(_0x888958["unresolvedThreads"] || _0x888958['threads'] || _0x888958["openThreads"])['slice'](0x0, STORY_CONTINUITY_MAX_UNRESOLVED_THREADS)
  };
}
function hasStoryContinuityState(_0x4e48f3 = {}) {
  const _0x21b2aa = normalizeStoryContinuityState(_0x4e48f3);
  return _0x21b2aa["characters"]["length"] > 0x0 || _0x21b2aa["props"]["length"] > 0x0 || _0x21b2aa["unresolvedThreads"]["length"] > 0x0;
}
function normalizeStoryProjectInput(_0x56d54d = {}) {
  const _0x13862f = Array["isArray"](_0x56d54d?.["chapters"]) ? _0x56d54d["chapters"]["map"]((_0x3d891a, _0x2534df) => ({
    'id': normalizeText(_0x3d891a?.['id']) || "chapter-" + (_0x2534df + 0x1),
    'title': normalizeText(_0x3d891a?.["title"]),
    'content': normalizeText(_0x3d891a?.['content'])
  }))["filter"](_0x357835 => _0x357835['title'] || _0x357835["content"]) : [];
  return {
    'title': normalizeText(_0x56d54d?.["title"]),
    'storyType': normalizeText(_0x56d54d?.['storyType']),
    'summary': normalizeText(_0x56d54d?.['summary'] || _0x56d54d?.['storySummary']),
    'background': normalizeText(_0x56d54d?.['background'] || _0x56d54d?.["storyBackground"]),
    'setting': normalizeText(_0x56d54d?.["setting"] || _0x56d54d?.["storySetting"]),
    'logline': normalizeText(_0x56d54d?.["logline"]),
    'scriptMode': normalizeStoryScriptMode(_0x56d54d?.["scriptMode"]),
    'aspectRatio': normalizeText(_0x56d54d?.["aspectRatio"]) || "16:9",
    'visualStyle': normalizeText(_0x56d54d?.['videoStylePrompt'] || _0x56d54d?.["visualStyle"] || _0x56d54d?.["videoStyle"]),
    'promptMode': normalizeText(_0x56d54d?.["planning"]?.["promptMode"])["toLowerCase"]() || "seedance-2.0",
    'chapters': _0x13862f,
    'planning': normalizeStoryPlanningConstraints(_0x56d54d?.['planning'])
  };
}
function assertStoryProjectInput(_0x26903b) {
  if (!_0x26903b['title'] || !_0x26903b['chapters']["length"]) {
    throw new Error("请先完成故事大纲和章节内容。");
  }
}
function resolveStoryPlanningConstraints(_0x26b5e2 = {}, _0x19f6fe = {}) {
  const _0x55159b = _0x19f6fe && typeof _0x19f6fe === "object" && (Object['prototype']["hasOwnProperty"]["call"](_0x19f6fe, 'episodeCount') || Object["prototype"]["hasOwnProperty"]['call'](_0x19f6fe, 'sceneMaxSeconds'));
  return validateStoryPlanningConstraints(_0x55159b ? _0x19f6fe : _0x26b5e2?.['planning']);
}
function resolveStoryPromptMode(_0x22102d = {}, _0x5a6c26 = {}) {
  const _0xf035de = normalizeText(_0x5a6c26?.["promptMode"])['toLowerCase']();
  return _0xf035de || normalizeText(_0x22102d?.["planning"]?.['promptMode'])["toLowerCase"]() || "seedance-2.0";
}
function normalizeStoryMode(_0x1eca2f) {
  return _0x1eca2f === "upload" ? "upload" : "generate";
}
function stringifyStoryEpisodeDevResponse(_0x4b6788) {
  if (typeof _0x4b6788 === "string") {
    return _0x4b6788;
  }
  try {
    return JSON["stringify"](_0x4b6788);
  } catch {
    return String(_0x4b6788 || '');
  }
}
export function captureStoryEpisodeScriptDevResponse({
  response: _0x48814e,
  attempt = 0x1,
  episodeRef = '',
  episodeNumber = 0x1,
  model = '',
  provider = '',
  windowObject = globalThis["window"],
  consoleObject = globalThis["console"],
  capturedAt = new Date()["toISOString"]()
} = {}) {
  if (windowObject?.["AI_CANVAS_IS_DEV_BUILD"] !== !![]) {
    return null;
  }
  const _0x105b3d = {
    'capturedAt': normalizeText(capturedAt),
    'attempt': Math["max"](0x1, Math["trunc"](Number(attempt) || 0x1)),
    'episodeRef': normalizeText(episodeRef),
    'episodeNumber': Math["max"](0x1, Math['trunc'](Number(episodeNumber) || 0x1)),
    'model': normalizeText(model),
    'provider': normalizeText(provider),
    'responseText': stringifyStoryEpisodeDevResponse(getResultText(_0x48814e))
  };
  const _0xc287d5 = Array['isArray'](windowObject['__AIC_DEV_EPISODE_SCRIPT_RESPONSES__']) ? windowObject["__AIC_DEV_EPISODE_SCRIPT_RESPONSES__"] : [];
  windowObject["__AIC_DEV_EPISODE_SCRIPT_RESPONSES__"] = [..._0xc287d5, _0x105b3d]["slice"](-STORY_EPISODE_DEV_RESPONSE_HISTORY_LIMIT);
  consoleObject?.["info"]?.('[storyWorkspace][episode-script][dev-response]', _0x105b3d);
  return _0x105b3d;
}
function countStoryChapterCharacters(_0x54b266) {
  return Array["from"](normalizeText(_0x54b266)['replace'](/\s/g, ''))['length'];
}
export function parseStoryGenerationResult(_0x499e04, {
  minChapters = 0x1,
  minChapterCharacters = 0x0,
  maxChapterCharacters = Number["POSITIVE_INFINITY"]
} = {}) {
  const _0x70d13a = parseStrictJson(getResultText(_0x499e04), "Agent 未返回剧情内容。");
  const _0x18463e = normalizeText(_0x70d13a["title"]);
  const _0x4925fa = normalizeText(_0x70d13a['storyType']);
  const _0x4f1a44 = normalizeText(_0x70d13a['storySummary']);
  const _0x3d526f = normalizeText(_0x70d13a["storyBackground"]);
  const _0x3a3edf = normalizeText(_0x70d13a["storySetting"]);
  const _0x3a5b87 = normalizeText(_0x70d13a["logline"]);
  const _0x573e8f = Array["isArray"](_0x70d13a["chapters"]) ? _0x70d13a["chapters"]["map"](_0x41624e => ({
    'title': normalizeText(_0x41624e?.["title"]),
    'content': normalizeText(_0x41624e?.["content"])
  }))["filter"](_0x239ac0 => _0x239ac0['title'] && _0x239ac0["content"]) : [];
  if (!_0x18463e) {
    throw new Error("Agent 返回结果缺少故事标题。");
  }
  if (!_0x4925fa) {
    throw new Error("Agent 返回结果缺少故事类型。");
  }
  if (!_0x4f1a44) {
    throw new Error("Agent 返回结果缺少故事梗概。");
  }
  if (!_0x3d526f) {
    throw new Error('Agent\x20返回结果缺少故事背景。');
  }
  if (!_0x3a3edf) {
    throw new Error("Agent 返回结果缺少故事设定。");
  }
  if (!_0x3a5b87) {
    throw new Error('Agent\x20返回结果缺少一句话故事。');
  }
  const _0x2a904a = Math["max"](0x1, Math['trunc'](Number(minChapters) || 0x1));
  if (_0x573e8f["length"] < _0x2a904a) {
    throw new Error('Agent\x20返回的有效章节不足\x20' + _0x2a904a + " 章。");
  }
  const _0x4df742 = Math["max"](0x0, Math["trunc"](Number(minChapterCharacters) || 0x0));
  const _0x148475 = Number(maxChapterCharacters);
  const _0x1abb1c = Number['isFinite'](_0x148475) ? Math["max"](_0x4df742, Math['trunc'](_0x148475)) : Number["POSITIVE_INFINITY"];
  for (const _0x285103 of _0x573e8f) {
    const _0x2b84ee = countStoryChapterCharacters(_0x285103['content']);
    if (_0x2b84ee < _0x4df742) {
      throw new Error("Agent 返回的章节“" + _0x285103["title"] + "”正文不足 " + _0x4df742 + " 个字（当前 " + _0x2b84ee + " 个字）。");
    }
    if (_0x2b84ee > _0x1abb1c) {
      throw new Error('Agent\x20返回的章节“' + _0x285103['title'] + "”正文超过 " + _0x1abb1c + " 个字（当前 " + _0x2b84ee + " 个字）。");
    }
  }
  return {
    'schemaVersion': STORY_GENERATION_SCHEMA_VERSION,
    'title': _0x18463e,
    'storyType': _0x4925fa,
    'storySummary': _0x4f1a44,
    'storyBackground': _0x3d526f,
    'storySetting': _0x3a3edf,
    'logline': _0x3a5b87,
    'chapters': _0x573e8f
  };
}
export function splitStorySourceText(_0x1f14b8, _0x367c54 = STORY_SOURCE_CHUNK_CHARACTERS) {
  const _0x3f5481 = normalizeText(_0x1f14b8);
  const _0x10a750 = Math["max"](0x7d0, Math['trunc'](Number(_0x367c54) || 0x0));
  if (!_0x3f5481) {
    return [];
  }
  if (_0x3f5481['length'] <= _0x10a750) {
    return [_0x3f5481];
  }
  const _0x5cc26a = [];
  let _0x552fdd = 0x0;
  while (_0x552fdd < _0x3f5481["length"]) {
    let _0x10c0db = Math["min"](_0x3f5481["length"], _0x552fdd + _0x10a750);
    if (_0x10c0db < _0x3f5481["length"]) {
      const _0x3eee57 = _0x3f5481["lastIndexOf"]('\x0a', _0x10c0db);
      if (_0x3eee57 > _0x552fdd + Math["floor"](_0x10a750 * 0.55)) {
        _0x10c0db = _0x3eee57;
      }
    }
    _0x5cc26a["push"](_0x3f5481["slice"](_0x552fdd, _0x10c0db)["trim"]());
    _0x552fdd = _0x10c0db;
    while (_0x3f5481[_0x552fdd] === '\x0a' || _0x3f5481[_0x552fdd] === '\x0d') {
      _0x552fdd += 0x1;
    }
  }
  return _0x5cc26a["filter"](Boolean);
}
export function buildStoryGenerationPrompt({
  mode = "generate",
  idea = '',
  sourceText = '',
  fileName = '',
  sourceDigests = [],
  aspectRatio = "16:9",
  visualStyle = '',
  planning = {}
} = {}) {
  const _0x4309b3 = normalizeStoryMode(mode);
  const _0x4aaa6b = normalizeText(idea);
  const _0x241659 = normalizeText(sourceText);
  const _0x52cbcf = Array['isArray'](sourceDigests) ? sourceDigests : [];
  const _0x92e82c = validateStoryPlanningConstraints(planning);
  if (_0x4309b3 === "generate" && !_0x4aaa6b) {
    throw new Error("请先输入故事设定。");
  }
  if (_0x4309b3 === "upload" && !_0x241659 && _0x52cbcf["length"] === 0x0) {
    throw new Error("没有可供整理的剧本文本。");
  }
  const _0x6e62ed = _0x4309b3 === 'upload' ? "在不改变原文人物姓名、人物关系、关键事件和结局的前提下，整理因果逻辑、补足必要衔接并统一表达；原文未明确的信息应保守处理，不得擅自重写核心剧情。" : "根据用户提供的故事设定扩写为完整剧情；可以补充必要人物与事件，但所有新增内容必须服务于主角目标和核心冲突。";
  return JSON['stringify']({
    'task': "create_story",
    'schemaVersion': STORY_GENERATION_SCHEMA_VERSION,
    'mode': _0x4309b3,
    'modeInstruction': _0x6e62ed,
    'visualDirection': {
      'aspectRatio': normalizeText(aspectRatio) || "16:9",
      'style': normalizeText(visualStyle),
      'instruction': "视觉方向仅用于让人物、场景与叙事氛围保持一致，不要输出绘图提示词或创作说明。"
    },
    'pacingConstraints': {
      ..._0x92e82c,
      'instruction': "episodeCount 和 sceneMaxSeconds 均为上限，仅用于控制故事容量和节奏；当前任务仍只输出完整故事，不输出分集或分镜。"
    },
    'writingRequirements': ["故事梗概建议 250 至 500 个汉字，必须包含结局，不能只写悬念。", "每章正文必须为 " + STORY_CHAPTER_MIN_CHARACTERS + " 至 " + STORY_CHAPTER_MAX_CHARACTERS + '\x20个汉字，每章都要有清晰主标题；不能用提纲、重复句或无意义内容凑字数。', "开篇尽快建立人物、处境和触发事件。", "中段通过行动与代价升级冲突，避免只有设定介绍。", "高潮必须由前文因果推动，结局回应主角目标并完成主要人物弧光。", '不要生成分镜编号、镜头语言、绘图提示词、资产清单或分集标题。', _0x4309b3 === "generate" ? "AI 写故事模式必须生成至少 3 章，每章都要有独立主标题和完整正文。" : "上传文案模式不固定章节数量，由原文结构与叙事节奏决定应拆成多少章，不得为了凑数强行拆章。"],
    'input': _0x4309b3 === "upload" ? {
      'fileName': normalizeText(fileName),
      'sourceText': _0x241659,
      'sourceDigests': _0x52cbcf
    } : {
      'idea': _0x4aaa6b
    },
    'outputSchema': {
      'title': "故事标题，字符串",
      'storyType': "故事类型，字符串，例如悬疑、都市奇幻、科幻",
      'storySummary': "故事梗概，字符串",
      'storyBackground': "故事背景，字符串",
      'storySetting': "故事设定，字符串",
      'logline': '一句话故事，字符串',
      'chapters': [{
        'title': "章节主标题",
        'content': "章节正文"
      }]
    }
  });
}
function buildStorySourceDigestPrompt(_0x4fb379, _0x5ed1ea, _0x5653ad) {
  return JSON["stringify"]({
    'task': "digest_story_source_chunk",
    'chunk': {
      'index': _0x5ed1ea + 0x1,
      'total': _0x5653ad,
      'text': _0x4fb379
    },
    'requirements': ["按原文记录本段出现的人物、身份、关系与动机。", "按发生顺序记录关键事件、选择、结果和伏笔。", "记录场景、时间及与前后文衔接所需的信息。", '不得续写，不得修改原文事实。'],
    'outputSchema': {
      'characters': ["人物及关系"],
      'settings': ["时间与场景"],
      'events': ["按顺序排列的事件"],
      'continuity': "未解决冲突、伏笔及承接信息",
      'endingState': "本段结束时人物与事件状态"
    }
  });
}
function parseStorySourceDigest(_0x503896) {
  const _0xa953cb = parseStrictJson(getResultText(_0x503896), "Agent 未返回剧本分段摘要。");
  return {
    'characters': Array['isArray'](_0xa953cb["characters"]) ? _0xa953cb['characters']["map"](normalizeText)["filter"](Boolean) : [],
    'settings': Array["isArray"](_0xa953cb['settings']) ? _0xa953cb["settings"]['map'](normalizeText)["filter"](Boolean) : [],
    'events': Array['isArray'](_0xa953cb["events"]) ? _0xa953cb['events']['map'](normalizeText)["filter"](Boolean) : [],
    'continuity': normalizeText(_0xa953cb["continuity"]),
    'endingState': normalizeText(_0xa953cb["endingState"])
  };
}
export async function generateStoryDraft({
  mode = 'generate',
  idea = '',
  sourceText = '',
  fileName = '',
  model = '',
  provider = '',
  providerProfileId = '',
  aspectRatio = "16:9",
  visualStyle = '',
  planning = {},
  request = generateText,
  onProgress = null
} = {}) {
  const _0x4d08af = normalizeStoryMode(mode);
  const _0x4efea5 = normalizeText(model);
  const _0x413f30 = normalizeText(provider);
  if (!_0x4efea5 || !_0x413f30) {
    throw new Error("请先选择可用的文本模型。");
  }
  let _0x27eeba = [];
  let _0x6bc471 = normalizeText(sourceText);
  if (_0x4d08af === "upload" && _0x6bc471['length'] > STORY_SOURCE_CHUNK_CHARACTERS) {
    const _0x5a1f09 = splitStorySourceText(_0x6bc471);
    for (let _0x188de4 = 0x0; _0x188de4 < _0x5a1f09["length"]; _0x188de4 += 0x1) {
      onProgress?.({
        'stage': "digesting",
        'current': _0x188de4 + 0x1,
        'total': _0x5a1f09["length"],
        'message': '正在整理剧本\x20' + (_0x188de4 + 0x1) + '/' + _0x5a1f09['length']
      });
      const _0x15c448 = buildStorySourceDigestPrompt(_0x5a1f09[_0x188de4], _0x188de4, _0x5a1f09["length"]);
      const _0x57834a = await requestStrictResult({
        'request': request,
        'requestPayload': {
          'model': _0x4efea5,
          'provider': _0x413f30,
          ...buildStoryTextProviderProfilePayload(providerProfileId),
          'prompt': _0x15c448,
          'systemPrompt': STORY_SOURCE_DIGEST_SYSTEM_PROMPT,
          'temperature': 0.1,
          'timeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
          'maxOutputTokens': STORY_TEXT_MAX_OUTPUT_TOKENS
        },
        'parse': parseStorySourceDigest,
        'outputContract': "characters/settings/events arrays and continuity/endingState strings"
      });
      _0x27eeba["push"]({
        'part': _0x188de4 + 0x1,
        ..._0x57834a
      });
    }
    _0x6bc471 = '';
  }
  onProgress?.({
    'stage': 'writing',
    'current': 0x1,
    'total': 0x1,
    'message': _0x4d08af === "upload" ? '正在整理故事内容' : '正在创建完整剧情'
  });
  const _0x52a545 = buildStoryGenerationPrompt({
    'mode': _0x4d08af,
    'idea': idea,
    'sourceText': _0x6bc471,
    'fileName': fileName,
    'sourceDigests': _0x27eeba,
    'aspectRatio': aspectRatio,
    'visualStyle': visualStyle,
    'planning': planning
  });
  return await requestStrictResult({
    'request': request,
    'requestPayload': {
      'model': _0x4efea5,
      'provider': _0x413f30,
      ...buildStoryTextProviderProfilePayload(providerProfileId),
      'prompt': _0x52a545,
      'systemPrompt': STORY_GENERATION_SYSTEM_PROMPT,
      'temperature': _0x4d08af === "upload" ? 0.35 : 0.7,
      'timeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
      'maxOutputTokens': STORY_TEXT_MAX_OUTPUT_TOKENS
    },
    'parse': _0x2e3cf9 => parseStoryGenerationResult(_0x2e3cf9, {
      'minChapters': _0x4d08af === 'generate' ? 0x3 : 0x1,
      'minChapterCharacters': STORY_CHAPTER_MIN_CHARACTERS,
      'maxChapterCharacters': STORY_CHAPTER_MAX_CHARACTERS
    }),
    'outputContract': _0x4d08af === 'generate' ? "title/storyType/storySummary/storyBackground/storySetting/logline strings and at least 3 chapters[{title,content}], with each content containing " + STORY_CHAPTER_MIN_CHARACTERS + '-' + STORY_CHAPTER_MAX_CHARACTERS + " characters" : "title/storyType/storySummary/storyBackground/storySetting/logline strings and agent-determined chapters[{title,content}], with each content containing " + STORY_CHAPTER_MIN_CHARACTERS + '-' + STORY_CHAPTER_MAX_CHARACTERS + " characters"
  });
}
const storySummaryBlueprint = createStorySummaryBlueprint({
  'normalizeStoryScriptMode': normalizeStoryScriptMode,
  'validateStoryPlanningConstraints': validateStoryPlanningConstraints,
  'continuityMaxFacts': STORY_CONTINUITY_MAX_FACTS
});
const {
  normalizeStoryContract,
  normalizeStoryPlotBeat,
  normalizeStorySummaryCharacter
} = storySummaryBlueprint;
export const buildStorySummaryPrompt = storySummaryBlueprint["buildStorySummaryPrompt"];
export const parseStorySummaryResult = storySummaryBlueprint["parseStorySummaryResult"];
const storySummaryGenerationApi = createStorySummaryGenerationApi({
  'generateText': generateText,
  'assertPlanningModel': assertPlanningModel,
  'normalizeText': normalizeText,
  'splitStorySourceText': splitStorySourceText,
  'sourceChunkCharacters': STORY_SOURCE_CHUNK_CHARACTERS,
  'buildStorySourceDigestPrompt': buildStorySourceDigestPrompt,
  'parseStorySourceDigest': parseStorySourceDigest,
  'sourceDigestSystemPrompt': STORY_SOURCE_DIGEST_SYSTEM_PROMPT,
  'summarySystemPrompt': STORY_SUMMARY_SYSTEM_PROMPT,
  'textRequestTimeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
  'textMaxOutputTokens': STORY_TEXT_MAX_OUTPUT_TOKENS,
  'buildStoryTextProviderProfilePayload': buildStoryTextProviderProfilePayload,
  'requestStrictResult': requestStrictResult,
  'createStoryInvocationLifecycle': createStoryInvocationLifecycle,
  'getResultText': getResultText,
  'storySummaryBlueprint': storySummaryBlueprint,
  'defaultScriptMode': STORY_SCRIPT_MODE_PLOT
});
export const generateStorySummary = storySummaryGenerationApi["generateStorySummary"];
const storyEpisodeScriptPromptApi = createStoryEpisodeScriptPromptApi({
  'normalizeText': normalizeText,
  'normalizeStringArray': normalizeStringArray,
  'normalizePositiveNumber': normalizePositiveNumber,
  'normalizeStoryScriptMode': normalizeStoryScriptMode,
  'normalizeStorySummaryCharacter': normalizeStorySummaryCharacter,
  'normalizeStoryContinuityFacts': normalizeStoryContinuityFacts,
  'normalizeStoryContinuityState': normalizeStoryContinuityState,
  'createStoryEpisodeScriptRuntimeGuidance': createStoryEpisodeScriptRuntimeGuidance,
  'schemaVersion': STORY_EPISODE_SCRIPT_SCHEMA_VERSION,
  'narrationMode': STORY_SCRIPT_MODE_NARRATION
});
export const buildStoryEpisodeScriptPrompt = storyEpisodeScriptPromptApi["buildPrompt"];
const buildStoryEpisodeScriptContentRevisionPrompt = storyEpisodeScriptPromptApi["buildContentRevisionPrompt"];
const storyClipAdjustmentApi = createStoryClipAdjustmentApi({
  'generateText': generateText,
  'parseStrictJson': parseStrictJson,
  'normalizeText': normalizeText,
  'normalizePositiveNumber': normalizePositiveNumber,
  'getResultText': getResultText,
  'assertPlanningModel': assertPlanningModel,
  'buildStoryTextProviderProfilePayload': buildStoryTextProviderProfilePayload,
  'requestStrictResult': requestStrictResult,
  'requestTimeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS
});
export const adjustStoryClipPrompt = storyClipAdjustmentApi['adjustStoryClipPrompt'];
export const buildStoryClipAdjustmentPrompt = storyClipAdjustmentApi['buildStoryClipAdjustmentPrompt'];
export const parseStoryClipAdjustmentResult = storyClipAdjustmentApi["parseStoryClipAdjustmentResult"];
const storyEpisodeOutlinePlanningApi = createStoryEpisodeOutlinePlanningApi({
  'generateText': generateText,
  'parseStrictJson': parseStrictJson,
  'normalizeText': normalizeText,
  'normalizeStringArray': normalizeStringArray,
  'normalizeStoryContinuityFacts': normalizeStoryContinuityFacts,
  'normalizeStoryContinuityState': normalizeStoryContinuityState,
  'hasStoryContinuityState': hasStoryContinuityState,
  'normalizePositiveNumber': normalizePositiveNumber,
  'normalizeStorySummaryCharacter': normalizeStorySummaryCharacter,
  'normalizeStoryContract': normalizeStoryContract,
  'normalizeStoryPlotBeat': normalizeStoryPlotBeat,
  'normalizeStoryScriptMode': normalizeStoryScriptMode,
  'normalizeStoryPlanningConstraints': normalizeStoryPlanningConstraints,
  'resolveStoryPlanningConstraints': resolveStoryPlanningConstraints,
  'getResultText': getResultText,
  'assertPlanningModel': assertPlanningModel,
  'buildStoryTextProviderProfilePayload': buildStoryTextProviderProfilePayload,
  'requestStrictResult': requestStrictResult,
  'STORY_EPISODE_OUTLINE_SCHEMA_VERSION': STORY_EPISODE_OUTLINE_SCHEMA_VERSION,
  'STORY_SCRIPT_MODE_NARRATION': STORY_SCRIPT_MODE_NARRATION,
  'STORY_EPISODE_OUTLINE_BATCH_SIZE': STORY_EPISODE_OUTLINE_BATCH_SIZE,
  'STORY_SUMMARY_MAX_PLOT_BEATS': STORY_SUMMARY_MAX_PLOT_BEATS,
  'STORY_CONTINUITY_MAX_FACTS': STORY_CONTINUITY_MAX_FACTS,
  'STORY_CONTINUITY_MAX_CHARACTER_STATES': STORY_CONTINUITY_MAX_CHARACTER_STATES,
  'STORY_CONTINUITY_MAX_PROP_STATES': STORY_CONTINUITY_MAX_PROP_STATES,
  'STORY_CONTINUITY_MAX_UNRESOLVED_THREADS': STORY_CONTINUITY_MAX_UNRESOLVED_THREADS,
  'STORY_TEXT_REQUEST_TIMEOUT_MS': STORY_TEXT_REQUEST_TIMEOUT_MS,
  'STORY_TEXT_MAX_OUTPUT_TOKENS': STORY_TEXT_MAX_OUTPUT_TOKENS
});
const {
  buildStoryNarrativeSummary
} = storyEpisodeOutlinePlanningApi;
export const buildStoryEpisodeOutlinePrompt = storyEpisodeOutlinePlanningApi['buildStoryEpisodeOutlinePrompt'];
export const parseStoryEpisodeOutlineSkeletonResult = storyEpisodeOutlinePlanningApi["parseStoryEpisodeOutlineSkeletonResult"];
export const createStoryEpisodeOutlineBatches = storyEpisodeOutlinePlanningApi["createStoryEpisodeOutlineBatches"];
export const buildStoryEpisodeOutlineBatchPrompt = storyEpisodeOutlinePlanningApi["buildStoryEpisodeOutlineBatchPrompt"];
export const parseStoryEpisodeOutlineBatchResult = storyEpisodeOutlinePlanningApi["parseStoryEpisodeOutlineBatchResult"];
export const parseStoryEpisodeOutlineResult = storyEpisodeOutlinePlanningApi['parseStoryEpisodeOutlineResult'];
export const planStoryEpisodeOutlines = storyEpisodeOutlinePlanningApi["planStoryEpisodeOutlines"];
function formatEpisodeSceneText(_0x2d6d5b, _0x42ad0a, _0xc38ee2) {
  const _0x5584ae = _0x2d6d5b["characters"]['length'] ? "\n出场人物：" + _0x2d6d5b["characters"]["join"]('、') : '';
  return "### 场" + _0x42ad0a + '-' + (_0xc38ee2 + 0x1) + '\x0a' + _0x2d6d5b['heading'] + _0x5584ae + '\x0a' + _0x2d6d5b['body'];
}
function normalizeStoryEpisodeScriptDialogueContent(_0x538248 = '') {
  const _0xa4dc82 = normalizeText(_0x538248);
  if (!_0xa4dc82) {
    return _0xa4dc82;
  }
  const _0x5c0ac1 = _0xa4dc82["match"](/^((?:(?:（[^）]*）|\([^)]*\))\s*)+)([\s\S]+)$/u);
  const _0x29fb8c = normalizeText(_0x5c0ac1?.[0x1]);
  const _0x3967ec = normalizeText(_0x5c0ac1?.[0x2] || _0xa4dc82);
  if (!_0x3967ec) {
    return _0xa4dc82;
  }
  const _0x101b89 = _0x3967ec["match"](/^(?:“([\s\S]*)”|「([\s\S]*)」|『([\s\S]*)』|"([\s\S]*)")$/u);
  if (_0x101b89) {
    const _0x1e7cd5 = normalizeText(_0x101b89[0x1] || _0x101b89[0x2] || _0x101b89[0x3] || _0x101b89[0x4]);
    return _0x29fb8c + '“' + _0x1e7cd5 + '”';
  }
  if (/[“”「」『』"]/u['test'](_0x3967ec)) {
    return _0xa4dc82;
  }
  return _0x29fb8c + '“' + _0x3967ec + '”';
}
function normalizeStoryEpisodeScriptSceneBody(_0x3fc726 = '', _0x4b110e = []) {
  const _0x519279 = new Set(normalizeStringArray(_0x4b110e));
  const _0x196dca = new Set(['旁白', "画外音", '音效', "屏幕字幕", '字幕', '时间', '地点', '场景']);
  return String(_0x3fc726 || '')["split"](/\r?\n/u)["flatMap"](_0x1dbd7d => {
    const _0xbd29fd = _0x1dbd7d["trim"]();
    if (!_0xbd29fd) {
      return [''];
    }
    if (isStoryEpisodeEditorialMarker(_0xbd29fd)) {
      return [];
    }
    const _0x47442e = _0xbd29fd["match"](/^([^：:\n]{1,40})[：:]\s*(.+)$/u);
    const _0x27d9a6 = normalizeText(_0x47442e?.[0x1]);
    if (!_0x47442e || !_0x519279["has"](_0x27d9a6) || _0x196dca["has"](_0x27d9a6)) {
      return [_0xbd29fd];
    }
    const _0x3335ab = normalizeStoryEpisodeScriptDialogueContent(_0x47442e[0x2]);
    return [_0x27d9a6 + '：' + _0x3335ab];
  })["join"]('\x0a')['replace'](/\n{2,}/gu, '\x0a')["trim"]();
}
function normalizeStoryEpisodeScriptCharacters(_0x28bf19) {
  if (Array['isArray'](_0x28bf19)) {
    return normalizeStringArray(_0x28bf19);
  }
  return normalizeStringArray(normalizeText(_0x28bf19)['split'](/[、，,;/|]+/u)["map"](_0x41894e => _0x41894e["trim"]()));
}
function normalizeStoryEpisodeScriptBodyValue(_0x1fb53a) {
  if (Array["isArray"](_0x1fb53a)) {
    return _0x1fb53a["map"](_0x1dfe53 => normalizeText(_0x1dfe53))["filter"](Boolean)["join"]('\x0a');
  }
  if (_0x1fb53a && typeof _0x1fb53a === "object") {
    return normalizeText(_0x1fb53a["text"] || _0x1fb53a["content"] || _0x1fb53a['body']);
  }
  return normalizeText(_0x1fb53a);
}
function getStoryEpisodeScriptSceneEntries(_0x3cd725 = {}) {
  const _0x4803e5 = _0x3cd725 && typeof _0x3cd725 === "object" && !Array["isArray"](_0x3cd725) ? _0x3cd725 : {};
  const _0x3cfc2f = [_0x4803e5["scenes"], _0x4803e5["sceneList"], _0x4803e5['scene_list'], _0x4803e5["scriptScenes"], _0x4803e5["script_scenes"]];
  return _0x3cfc2f["find"](Array['isArray']) || [];
}
function findStoryEpisodeScriptPayload(_0xd05d0f) {
  const _0x47d11a = [_0xd05d0f];
  const _0x30d120 = new Set();
  let _0x3c3d12 = null;
  while (_0x47d11a["length"]) {
    const _0x23a37e = _0x47d11a["shift"]();
    if (Array["isArray"](_0x23a37e)) {
      return {
        'scenes': _0x23a37e
      };
    }
    if (!_0x23a37e || typeof _0x23a37e !== "object" || _0x30d120["has"](_0x23a37e)) {
      continue;
    }
    _0x30d120['add'](_0x23a37e);
    _0x3c3d12 ||= _0x23a37e;
    if (getStoryEpisodeScriptSceneEntries(_0x23a37e)["length"]) {
      return _0x23a37e;
    }
    ['result', 'data', "output", 'response', "episode", "script"]['forEach'](_0x1ea19b => {
      const _0x2026f2 = _0x23a37e[_0x1ea19b];
      if (_0x2026f2 && typeof _0x2026f2 === "object") {
        _0x47d11a["push"](_0x2026f2);
      }
    });
  }
  return _0x3c3d12 || {};
}
function extractStoryEpisodeScriptStringProperty(_0x1b5e52, _0x5888bd = []) {
  for (const _0x3ca2b1 of _0x5888bd) {
    const _0x21fe3c = extractJsonStringProperty(_0x1b5e52, _0x3ca2b1);
    if (_0x21fe3c) {
      return _0x21fe3c;
    }
  }
  return '';
}
function isStoryEpisodeScriptArrayClosed(_0xb9a503, _0x41c682) {
  const _0x2e8cb5 = getResultText(_0xb9a503);
  if (typeof _0x2e8cb5 !== "string" || !_0x2e8cb5 || !_0x41c682) {
    return ![];
  }
  const _0x33c883 = '\x22' + _0x41c682 + '\x22';
  const _0x314447 = _0x2e8cb5["indexOf"](_0x33c883);
  if (_0x314447 < 0x0) {
    return ![];
  }
  const _0x4892c5 = _0x2e8cb5["indexOf"](':', _0x314447 + _0x33c883["length"]);
  const _0x11cdf9 = _0x4892c5 >= 0x0 ? _0x2e8cb5['indexOf']('[', _0x4892c5 + 0x1) : -0x1;
  if (_0x11cdf9 < 0x0) {
    return ![];
  }
  let _0x4bc48c = 0x0;
  let _0x157b70 = ![];
  let _0x200edb = ![];
  for (let _0x4e56cd = _0x11cdf9; _0x4e56cd < _0x2e8cb5['length']; _0x4e56cd += 0x1) {
    const _0x38779d = _0x2e8cb5[_0x4e56cd];
    if (_0x157b70) {
      if (_0x200edb) {
        _0x200edb = ![];
      } else {
        if (_0x38779d === '\x5c') {
          _0x200edb = !![];
        } else {
          if (_0x38779d === '\x22') {
            _0x157b70 = ![];
          }
        }
      }
      continue;
    }
    if (_0x38779d === '\x22') {
      _0x157b70 = !![];
      continue;
    }
    if (_0x38779d === '[') {
      _0x4bc48c += 0x1;
    } else {
      if (_0x38779d === ']') {
        _0x4bc48c -= 0x1;
        if (_0x4bc48c === 0x0) {
          return !![];
        }
      }
    }
  }
  return ![];
}
function parseStoryEpisodeScriptPayload(_0x47f1b7) {
  const _0x3bb6b1 = getResultText(_0x47f1b7);
  const _0x56df13 = repairStoryEpisodeScriptMissingBodyTerminators(_0x3bb6b1);
  const _0x64471f = _0x56df13["repairedCount"] ? _0x56df13["text"] : _0x3bb6b1;
  let _0x457e3c = null;
  let _0x17f313 = null;
  const _0x17c053 = _0x56df13["repairedCount"];
  try {
    _0x457e3c = parseStrictJson(_0x64471f, "Agent 未返回完整分集剧本。");
  } catch (_0x1c97bc) {
    _0x17f313 = _0x1c97bc;
  }
  let _0x3efbb5 = findStoryEpisodeScriptPayload(_0x457e3c);
  let _0x2c11a7 = getStoryEpisodeScriptSceneEntries(_0x3efbb5);
  let _0x3ebd1e = ![];
  let _0x191dc7 = ![];
  if (!_0x2c11a7["length"]) {
    for (const _0x359ece of ["scenes", 'sceneList', "scene_list", "scriptScenes", "script_scenes"]) {
      const _0x40a50f = extractCompleteJsonArrayItems(_0x64471f, _0x359ece);
      if (!_0x40a50f["length"]) {
        continue;
      }
      _0x2c11a7 = _0x40a50f;
      _0x191dc7 = isStoryEpisodeScriptArrayClosed(_0x64471f, _0x359ece);
      _0x3ebd1e = !_0x191dc7;
      break;
    }
  }
  if (!_0x2c11a7["length"] && _0x17f313) {
    throw _0x17f313;
  }
  return {
    'data': {
      ...(_0x3efbb5 && typeof _0x3efbb5 === "object" && !Array['isArray'](_0x3efbb5) ? _0x3efbb5 : {}),
      'episodeRef': normalizeText(_0x3efbb5?.["episodeRef"] || _0x3efbb5?.["episodeId"] || _0x3efbb5?.['episode_id'] || extractStoryEpisodeScriptStringProperty(_0x64471f, ["episodeRef", "episodeId", 'episode_id'])),
      'title': normalizeText(_0x3efbb5?.['title'] || _0x3efbb5?.["episodeTitle"] || _0x3efbb5?.['episode_title'] || extractStoryEpisodeScriptStringProperty(_0x64471f, ['title', "episodeTitle", "episode_title"])),
      'scenes': _0x2c11a7
    },
    'recovery': _0x17c053 && _0x457e3c ? {
      'mode': "missing-scene-body-string-terminators",
      'incompleteJson': ![],
      'repairedBodyTerminators': _0x17c053
    } : _0x3ebd1e || _0x191dc7 ? {
      'mode': _0x3ebd1e ? "complete-scenes-from-incomplete-json" : "complete-scenes-from-invalid-json-shell",
      'incompleteJson': _0x3ebd1e
    } : null
  };
}
export function parseStoryEpisodeScriptResult(_0xddddbc, {
  episodeRef = "episode-1",
  episodeNumber = 0x1,
  episodeTitle = '',
  requireEndingState = ![],
  fallbackContinuityFacts = [],
  fallbackEndingState = null
} = {}) {
  const {
    data: _0x43c57e,
    recovery: _0x5a4497
  } = parseStoryEpisodeScriptPayload(_0xddddbc);
  const _0x415c58 = normalizeText(_0x43c57e["episodeRef"] || _0x43c57e["episodeId"] || _0x43c57e['episode_id']) || normalizeText(episodeRef) || "episode-1";
  if (normalizeText(episodeRef) && _0x415c58 !== normalizeText(episodeRef)) {
    throw new Error("Agent 返回的分集引用与请求不一致。");
  }
  const _0x56a5b4 = normalizeText(_0x43c57e["title"] || _0x43c57e["episodeTitle"] || _0x43c57e['episode_title']) || normalizeText(episodeTitle) || '第\x20' + episodeNumber + '\x20集';
  const _0x579a8d = getStoryEpisodeScriptSceneEntries(_0x43c57e);
  const _0x2009aa = _0x579a8d["length"] ? _0x579a8d["map"]((_0x342042, _0x57367c) => {
    const _0x6b9486 = normalizeStoryEpisodeScriptCharacters(_0x342042?.["characters"] || _0x342042?.["characterNames"] || _0x342042?.['character_names'] || _0x342042?.["cast"] || _0x342042?.["roles"]);
    return {
      'ref': normalizeText(_0x342042?.["ref"] || _0x342042?.['sceneRef'] || _0x342042?.["scene_ref"] || _0x342042?.['id']) || _0x415c58 + "-scene-" + (_0x57367c + 0x1),
      'heading': normalizeText(_0x342042?.["heading"] || _0x342042?.["sceneHeading"] || _0x342042?.["scene_heading"] || _0x342042?.["location"] || _0x342042?.["title"]),
      'characters': _0x6b9486,
      'body': normalizeStoryEpisodeScriptSceneBody(normalizeStoryEpisodeScriptBodyValue(_0x342042?.["body"] || _0x342042?.["content"] || _0x342042?.['script'] || _0x342042?.['text']), _0x6b9486)
    };
  })["filter"](_0x5285d9 => _0x5285d9["heading"] && _0x5285d9['body']) : [];
  if (!_0x2009aa["length"]) {
    throw new Error("Agent 返回结果没有可用场次。");
  }
  const _0x1fd47f = Math["max"](0x1, Math["trunc"](Number(episodeNumber) || 0x1));
  const _0x465db1 = ['##\x20第' + _0x1fd47f + '集：' + _0x56a5b4, ..._0x2009aa['map']((_0x284b2d, _0x353ea2) => formatEpisodeSceneText(_0x284b2d, _0x1fd47f, _0x353ea2))]["join"]('\x0a');
  const _0x432b2d = normalizeStoryContinuityFacts(_0x43c57e['continuityFacts'] || _0x43c57e["facts"] || _0x43c57e['continuity_facts']);
  const _0x2ec54d = _0x432b2d["length"] ? _0x432b2d : normalizeStoryContinuityFacts(fallbackContinuityFacts);
  const _0x5d65ac = normalizeStoryContinuityState(_0x43c57e["endingState"] || _0x43c57e["finalState"] || _0x43c57e['continuityState'] || _0x43c57e["ending_state"]);
  const _0x2bbc50 = hasStoryContinuityState(_0x5d65ac) ? _0x5d65ac : normalizeStoryContinuityState(fallbackEndingState);
  if (requireEndingState && !hasStoryContinuityState(_0x2bbc50)) {
    throw new Error("Agent 返回的完整分集剧本缺少有效结束状态。");
  }
  return {
    'schemaVersion': STORY_EPISODE_SCRIPT_SCHEMA_VERSION,
    'episodeRef': _0x415c58,
    'title': _0x56a5b4,
    'scenes': _0x2009aa,
    'fullText': _0x465db1,
    'continuityFacts': _0x2ec54d,
    'endingState': _0x2bbc50,
    ...(_0x5a4497 ? {
      'recovery': _0x5a4497
    } : {})
  };
}
function getStoryEpisodeScriptFinishReason(_0x244eee) {
  return normalizeText(_0x244eee?.["finishReason"] || _0x244eee?.['finish_reason'] || _0x244eee?.["choices"]?.[0x0]?.["finish_reason"] || _0x244eee?.['data']?.["choices"]?.[0x0]?.['finish_reason'])["toLowerCase"]();
}
function serializeStoryEpisodeScriptResponse(_0x42379f) {
  const _0x4947c6 = getResultText(_0x42379f);
  return typeof _0x4947c6 === "string" ? _0x4947c6 : stringifyStoryEpisodeDevResponse(_0x4947c6);
}
function normalizeStoryEpisodeScriptRawResponses(_0x10652a = null) {
  const _0x56ae18 = Array['isArray'](_0x10652a?.["rawResponses"]) ? _0x10652a["rawResponses"] : normalizeText(_0x10652a?.["rawResponse"]) ? [{
    'attempt': _0x10652a?.['attempts'],
    'phase': 'generation',
    'finishReason': _0x10652a?.["finishReason"],
    'text': _0x10652a["rawResponse"]
  }] : [];
  return _0x56ae18['map']((_0xc9a2e0, _0x512012) => ({
    'attempt': Math["max"](0x1, Math["trunc"](Number(_0xc9a2e0?.['attempt']) || _0x512012 + 0x1)),
    'phase': normalizeText(_0xc9a2e0?.["phase"]) || (_0x512012 ? "repair" : "generation"),
    'finishReason': normalizeText(_0xc9a2e0?.['finishReason'])["toLowerCase"](),
    'text': typeof _0xc9a2e0?.["text"] === "string" ? _0xc9a2e0["text"] : stringifyStoryEpisodeDevResponse(_0xc9a2e0?.["text"])
  }));
}
function createStoryEpisodeScriptRawResponseRecord(_0x144eba, {
  attempt = 0x1,
  phase = "generation"
} = {}) {
  return {
    'attempt': Math["max"](0x1, Math['trunc'](Number(attempt) || 0x1)),
    'phase': normalizeText(phase) || "generation",
    'finishReason': getStoryEpisodeScriptFinishReason(_0x144eba),
    'text': serializeStoryEpisodeScriptResponse(_0x144eba)
  };
}
function selectStoryEpisodeScriptRepairSource(_0x162443 = []) {
  return _0x162443["reduce"]((_0x509ebd, _0x4ad773) => {
    if (!normalizeText(_0x4ad773?.["text"])) {
      return _0x509ebd;
    }
    if (!_0x509ebd || String(_0x4ad773['text'])["length"] >= String(_0x509ebd['text'])["length"]) {
      return _0x4ad773;
    }
    return _0x509ebd;
  }, null);
}
function buildStoryEpisodeScriptRepairPrompt({
  episode = {},
  episodeRef = "episode-1",
  episodeNumber = 0x1,
  rejectedResponse = '',
  finishReason = '',
  error = null
} = {}) {
  const _0x406b9b = normalizeStoryContinuityState(episode?.['endingState']);
  return JSON["stringify"]({
    'task': "repair_story_episode_script_response",
    'episode': {
      'ref': normalizeText(episodeRef) || "episode-" + episodeNumber,
      'number': Math["max"](0x1, Math["trunc"](Number(episodeNumber) || 0x1)),
      'title': normalizeText(episode?.["title"]),
      'synopsis': normalizeText(episode?.['synopsis']),
      'hook': normalizeText(episode?.["hook"]),
      'continuityFacts': normalizeStoryContinuityFacts(episode?.["continuityFacts"]),
      'requiredEndingState': _0x406b9b
    },
    'issue': {
      'reason': normalizeText(error?.["message"] || error) || "上一次返回无法完整解析",
      'finishReason': normalizeText(finishReason)
    },
    'rejectedResponse': String(rejectedResponse || ''),
    'instructions': ['优先做最小修改，完整保留\x20rejectedResponse\x20中已经存在的场次正文、动作和对白。', '如果只是\x20JSON\x20语法或字段名错误，只修复语法和字段名，不改写剧情。', "如果返回在中途截断，只从截断位置继续，补完当前场次、本集钩子、continuityFacts 和 endingState。", "返回内容包含 episodeRef、title、scenes、continuityFacts、endingState 即可；不要添加解释。"]
  });
}
function tryParseStoryEpisodeScriptResponse(_0x54dceb, _0x1a987c) {
  try {
    return {
      'result': parseStoryEpisodeScriptResult(_0x54dceb, _0x1a987c),
      'error': null
    };
  } catch (_0x2422c2) {
    return {
      'result': null,
      'error': _0x2422c2
    };
  }
}
function isCompleteStoryEpisodeScriptResponse(_0x36a332) {
  return Boolean(_0x36a332 && Array["isArray"](_0x36a332['scenes']) && _0x36a332['scenes']["length"] && normalizeText(_0x36a332['fullText']) && _0x36a332["recovery"]?.["incompleteJson"] !== !![]);
}
function chooseBestStoryEpisodeScriptResult(_0x963aa = []) {
  return _0x963aa["filter"](_0x20ac13 => _0x20ac13 && Array['isArray'](_0x20ac13["scenes"]) && _0x20ac13['scenes']["length"])["sort"]((_0x5f3b46, _0x400d7a) => Number(_0x400d7a["scenes"]["length"] || 0x0) - Number(_0x5f3b46["scenes"]['length'] || 0x0) || normalizeText(_0x400d7a["fullText"])["length"] - normalizeText(_0x5f3b46['fullText'])['length'])[0x0] || null;
}
function createStoryEpisodeScriptPartialError({
  episodeRef = "episode-1",
  rawResponses = [],
  attempts = 0x1,
  parseResults = [],
  cause = null
} = {}) {
  const _0x14558f = normalizeText(cause?.['message'] || cause) || "返回无法完整解析";
  const _0x585a15 = {
    'schemaVersion': STORY_EPISODE_SCRIPT_SCHEMA_VERSION,
    'status': 'failed',
    'episodeRef': normalizeText(episodeRef) || "episode-1",
    'attempts': Math["max"](0x1, Math["trunc"](Number(attempts) || 0x1), ...rawResponses["map"](_0x488d9a => Math["trunc"](Number(_0x488d9a?.['attempt']) || 0x0))),
    'rawResponses': rawResponses["map"](_0xbb2c2f => ({
      ..._0xbb2c2f
    })),
    'bestEffort': chooseBestStoryEpisodeScriptResult(parseResults),
    'lastError': {
      'message': _0x14558f,
      'code': normalizeText(cause?.["code"]),
      'type': normalizeText(cause?.["type"] || cause?.['name']) || 'Error'
    }
  };
  const _0xc28c76 = new Error("完整分集剧本返回仍不完整，已保存本次返回；再次点击时会优先修复，不会重新生成整集。" + (_0x14558f ? '\x20' + _0x14558f : ''));
  _0xc28c76["name"] = "StoryEpisodeScriptPartialError";
  _0xc28c76['code'] = "STORY_EPISODE_SCRIPT_PARTIAL";
  _0xc28c76['partialResult'] = _0x585a15;
  return _0xc28c76;
}
export async function generateStoryEpisodeScript({
  project = {},
  episode = {},
  previousEpisode = null,
  nextEpisode = null,
  model = '',
  provider = '',
  providerProfileId = '',
  request = generateText,
  onProgress = null,
  repairDraft = null,
  onInvocation = null
} = {}) {
  assertPlanningModel(model, provider);
  const _0x385343 = Math['max'](0x1, Math["trunc"](Number(episode?.["number"]) || 0x1));
  const _0x2f60dd = normalizeText(episode?.["ref"] || episode?.["planningRef"] || episode?.['id']) || "episode-" + _0x385343;
  const _0x2cf433 = buildStoryEpisodeScriptPrompt({
    'project': project,
    'episode': episode,
    'previousEpisode': previousEpisode,
    'nextEpisode': nextEpisode
  });
  const _0xd91bc = {
    'model': normalizeText(model),
    'provider': normalizeText(provider),
    ...buildStoryTextProviderProfilePayload(providerProfileId),
    'prompt': _0x2cf433,
    'systemPrompt': STORY_EPISODE_SCRIPT_SYSTEM_PROMPT,
    'temperature': normalizeStoryScriptMode(project?.["scriptMode"]) === STORY_SCRIPT_MODE_NARRATION ? 0.35 : 0.45,
    'timeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
    'maxOutputTokens': STORY_TEXT_MAX_OUTPUT_TOKENS
  };
  const _0x46833e = {
    'episodeRef': _0x2f60dd,
    'episodeNumber': _0x385343,
    'episodeTitle': episode?.["title"],
    'requireEndingState': !![],
    'fallbackContinuityFacts': episode?.["continuityFacts"],
    'fallbackEndingState': episode?.['endingState']
  };
  const _0x53d175 = normalizeStoryEpisodeScriptRawResponses(repairDraft);
  const _0x4d76a5 = Math['max'](Math["trunc"](Number(repairDraft?.["attempts"]) || 0x0), ..._0x53d175["map"](_0x47510f => Math["trunc"](Number(_0x47510f?.['attempt']) || 0x0)));
  const _0x469e5f = [];
  let _0x4bdf08 = 0x0;
  let _0x1e23ae = 0x0;
  const _0x41a6ee = () => _0x4d76a5 + ++_0x1e23ae;
  const _0x1fff52 = async (_0x9b7891, _0x495458) => {
    const _0x410247 = _0x41a6ee();
    const _0x2a2aa2 = await invokeStoryGenerationRequest({
      'request': request,
      'requestPayload': _0x9b7891,
      'stepId': _0x495458,
      'attempt': _0x410247,
      'onInvocation': onInvocation,
      'serializeResponse': serializeStoryEpisodeScriptResponse
    });
    _0x4bdf08 += 0x1;
    captureStoryEpisodeScriptDevResponse({
      'response': _0x2a2aa2,
      'attempt': _0x410247,
      'episodeRef': _0x2f60dd,
      'episodeNumber': _0x385343,
      'model': model,
      'provider': provider
    });
    _0x53d175["push"](createStoryEpisodeScriptRawResponseRecord(_0x2a2aa2, {
      'attempt': _0x410247,
      'phase': _0x495458
    }));
    return _0x2a2aa2;
  };
  const _0x26b4ff = _0x3f6194 => ensureStoryEpisodeScriptTiming({
    'scriptResult': _0x3f6194,
    'episode': episode,
    'review': (_0x23d998, _0x5d940d, _0x90ebd8) => requestStoryEpisodeScriptTimingReview({
      'request': request,
      'requestPayload': _0xd91bc,
      'episode': episode,
      'script': _0x23d998,
      'onInvocation': onInvocation,
      'attempt': _0x41a6ee(),
      'phase': _0x5d940d,
      'priorReview': _0x90ebd8
    })
  });
  const _0x7ec88d = JSON['parse'](_0x2cf433);
  const _0xa4f8eb = async _0x13425e => {
    const _0x1f435c = await _0x26b4ff(_0x13425e);
    if (normalizeText(_0x1f435c?.["timingReview"]?.['verdict']) !== "needs_revision") {
      return _0x1f435c;
    }
    onProgress?.({
      'stage': 'revising-episode-script-content',
      'current': _0x385343,
      'total': _0x385343,
      'message': '第\x20' + _0x385343 + '\x20集内容审查未通过，正在按分集大纲和连续性自动精简修订'
    });
    const _0x146eb3 = {
      ..._0xd91bc,
      'prompt': buildStoryEpisodeScriptContentRevisionPrompt({
        'grounding': _0x7ec88d,
        'script': _0x1f435c,
        'timingReview': _0x1f435c["timingReview"]
      }),
      'systemPrompt': STORY_EPISODE_SCRIPT_CONTENT_REVISION_SYSTEM_PROMPT,
      'temperature': 0.2
    };
    try {
      const _0x45caad = await _0x1fff52(_0x146eb3, 'content-revision');
      const _0x16ddf3 = tryParseStoryEpisodeScriptResponse(_0x45caad, _0x46833e);
      if (_0x16ddf3["result"]) {
        _0x469e5f["push"](_0x16ddf3["result"]);
      }
      if (!isCompleteStoryEpisodeScriptResponse(_0x16ddf3["result"])) {
        return preserveStoryEpisodeScriptWithoutTimingReview(_0x1f435c, episode, _0x16ddf3["error"] || new Error('内容修订返回不完整。'));
      }
      const _0x5303e9 = await _0x26b4ff(_0x16ddf3["result"]);
      if (normalizeText(_0x5303e9?.["timingReview"]?.["verdict"]) === "needs_revision") {
        return preserveStoryEpisodeScriptWithoutTimingReview(_0x1f435c, episode, new Error("自动内容修订后仍未通过：" + (normalizeText(_0x5303e9?.["timingReview"]?.["reason"]) || '存在重复内容')));
      }
      return _0x5303e9;
    } catch (_0x277d89) {
      return preserveStoryEpisodeScriptWithoutTimingReview(_0x1f435c, episode, _0x277d89);
    }
  };
  const _0x4c38fc = repairDraft?.["skipPostGenerationReview"] === !![];
  const _0x3d789e = async ({
    rejectedResponse: _0x10f4a7,
    finishReason = '',
    cause = null
  } = {}) => {
    onProgress?.({
      'stage': "repairing-episode-script",
      'current': _0x385343,
      'total': _0x385343,
      'message': '第\x20' + _0x385343 + " 集返回格式异常，正在修复已有正文"
    });
    const _0x56a979 = {
      ..._0xd91bc,
      'prompt': buildStoryEpisodeScriptRepairPrompt({
        'episode': episode,
        'episodeRef': _0x2f60dd,
        'episodeNumber': _0x385343,
        'rejectedResponse': _0x10f4a7,
        'finishReason': finishReason,
        'error': cause
      }),
      'systemPrompt': STORY_EPISODE_SCRIPT_REPAIR_SYSTEM_PROMPT,
      'temperature': 0.15
    };
    let _0x2224ae;
    try {
      _0x2224ae = await _0x1fff52(_0x56a979, "repair");
    } catch (_0x604ae1) {
      throw createStoryEpisodeScriptPartialError({
        'episodeRef': _0x2f60dd,
        'rawResponses': _0x53d175,
        'attempts': _0x4d76a5 + _0x4bdf08 + 0x1,
        'parseResults': _0x469e5f,
        'cause': _0x604ae1
      });
    }
    const _0x2c1e0d = tryParseStoryEpisodeScriptResponse(_0x2224ae, _0x46833e);
    if (_0x2c1e0d["result"]) {
      _0x469e5f["push"](_0x2c1e0d["result"]);
    }
    if (isCompleteStoryEpisodeScriptResponse(_0x2c1e0d["result"])) {
      return _0xa4f8eb(_0x2c1e0d["result"]);
    }
    throw createStoryEpisodeScriptPartialError({
      'episodeRef': _0x2f60dd,
      'rawResponses': _0x53d175,
      'attempts': _0x4d76a5 + _0x4bdf08,
      'parseResults': _0x469e5f,
      'cause': _0x2c1e0d["error"] || new Error("修复返回仍然被截断。")
    });
  };
  for (const _0x2c7880 of [..._0x53d175]["reverse"]()) {
    if (!_0x2c7880?.["text"]) {
      continue;
    }
    const _0x1b2091 = tryParseStoryEpisodeScriptResponse(_0x2c7880["text"], _0x46833e);
    if (_0x1b2091["result"]) {
      _0x469e5f["push"](_0x1b2091['result']);
    }
    if (isCompleteStoryEpisodeScriptResponse(_0x1b2091["result"])) {
      return _0x4c38fc ? preserveStoryEpisodeScriptWithoutTimingReview(_0x1b2091["result"], episode, new Error("上次正文生成后的时长审查被中断。")) : _0xa4f8eb(_0x1b2091["result"]);
    }
  }
  const _0x756da9 = selectStoryEpisodeScriptRepairSource(_0x53d175);
  if (_0x756da9?.["text"]) {
    const _0x1f852a = tryParseStoryEpisodeScriptResponse(_0x756da9["text"], _0x46833e);
    return _0x3d789e({
      'rejectedResponse': _0x756da9['text'],
      'finishReason': _0x756da9['finishReason'],
      'cause': _0x1f852a["error"] || new Error("上次返回在完整剧本结束前被截断。")
    });
  }
  onProgress?.({
    'stage': "writing-episode-script",
    'current': _0x385343,
    'total': _0x385343,
    'message': "正在生成第 " + _0x385343 + " 集完整剧本"
  });
  const _0x34eaa9 = await _0x1fff52(_0xd91bc, "generation");
  const _0x5cb1a5 = tryParseStoryEpisodeScriptResponse(_0x34eaa9, _0x46833e);
  if (_0x5cb1a5["result"]) {
    _0x469e5f["push"](_0x5cb1a5["result"]);
  }
  if (isCompleteStoryEpisodeScriptResponse(_0x5cb1a5['result'])) {
    return _0xa4f8eb(_0x5cb1a5['result']);
  }
  return _0x3d789e({
    'rejectedResponse': serializeStoryEpisodeScriptResponse(_0x34eaa9),
    'finishReason': getStoryEpisodeScriptFinishReason(_0x34eaa9),
    'cause': _0x5cb1a5["error"] || new Error("首次返回在完整剧本结束前被截断。")
  });
}
function normalizePlanningAssetSummary(_0xbdeb2a = {}, _0x77cc49 = 0x0) {
  const _0x14dbda = ["scene", 'prop']["includes"](_0xbdeb2a["kind"]) ? _0xbdeb2a["kind"] : "character";
  const _0x85c275 = Array['isArray'](_0xbdeb2a?.["appearances"]) ? _0xbdeb2a["appearances"] : [];
  const _0x4607d5 = _0x85c275["map"](_0xac4786 => ({
    'ref': a158_0x4e1501(_0xac4786?.["planningRef"] || _0xac4786?.['ref'] || _0xac4786?.['id'], ''),
    'name': normalizeText(_0xac4786?.["name"]),
    'description': normalizeText(_0xac4786?.["description"]),
    'prompt': normalizeText(_0xac4786?.["prompt"]),
    'sourceEpisodeRefs': normalizeStringArray(_0xac4786?.["sourceEpisodeRefs"]),
    'sourceSceneRefs': normalizeStringArray(_0xac4786?.["sourceSceneRefs"])
  }))['filter'](_0x8cc05f => _0x8cc05f["ref"] && (_0x8cc05f["name"] || _0x8cc05f["prompt"]));
  const _0x2abb48 = normalizeText(_0xbdeb2a?.["baseAppearanceRef"]);
  const _0x39f3e3 = normalizeText(_0xbdeb2a?.['baseAppearanceId']);
  const _0x35c288 = _0x2abb48 || _0x39f3e3;
  const _0x26d56e = _0x35c288 ? _0x85c275["find"](_0x5bde67 => [_0x5bde67?.['id'], _0x5bde67?.['ref'], _0x5bde67?.["planningRef"]]["some"](_0x2ff858 => normalizeText(_0x2ff858) === _0x35c288)) : null;
  const _0x553ae9 = a158_0x4e1501(_0x26d56e?.['planningRef'] || _0x26d56e?.['ref'] || _0x26d56e?.['id'], _0x4607d5["length"] === 0x1 ? _0x4607d5[0x0]["ref"] : '');
  return {
    'ref': a158_0x4e1501(_0xbdeb2a["ref"] || _0xbdeb2a["planningRef"] || _0xbdeb2a['id'], "asset-" + (_0x77cc49 + 0x1)),
    'kind': _0x14dbda,
    'name': normalizeText(_0xbdeb2a["name"]),
    'role': normalizeText(_0xbdeb2a['role']),
    'description': normalizeText(_0xbdeb2a["description"]),
    'baseAppearanceRef': _0x553ae9,
    'sourceEpisodeRefs': normalizeStringArray(_0xbdeb2a?.['sourceEpisodeRefs']),
    'sourceSceneRefs': normalizeStringArray(_0xbdeb2a?.["sourceSceneRefs"]),
    'appearances': _0x4607d5
  };
}
function compactStoryEpisodePromptAsset(_0x12dbfd = {}, {
  includeVisualDetails = ![],
  includeBindings = ![]
} = {}) {
  const _0xfa3912 = normalizeText(_0x12dbfd?.['kind']);
  const _0x4dfab3 = includeVisualDetails && _0xfa3912 !== "character";
  const _0x4dc0b6 = (Array['isArray'](_0x12dbfd?.["appearances"]) ? _0x12dbfd['appearances'] : [])["map"](_0x590e18 => ({
    'ref': normalizeText(_0x590e18?.["ref"]),
    'name': normalizeText(_0x590e18?.['name']),
    ...(includeBindings && normalizeStringArray(_0x590e18?.["sourceEpisodeRefs"])['length'] ? {
      'sourceEpisodeRefs': normalizeStringArray(_0x590e18["sourceEpisodeRefs"])
    } : {}),
    ...(includeBindings && normalizeStringArray(_0x590e18?.['sourceSceneRefs'])["length"] ? {
      'sourceSceneRefs': normalizeStringArray(_0x590e18["sourceSceneRefs"])
    } : {}),
    ...(_0x4dfab3 && normalizeText(_0x590e18?.["description"]) ? {
      'description': normalizeText(_0x590e18["description"])
    } : {}),
    ...(_0x4dfab3 && normalizeText(_0x590e18?.["prompt"]) ? {
      'prompt': normalizeText(_0x590e18["prompt"])
    } : {})
  }));
  return {
    'ref': normalizeText(_0x12dbfd?.['ref']),
    'kind': _0xfa3912,
    'name': normalizeText(_0x12dbfd?.['name']),
    ...(includeBindings && normalizeText(_0x12dbfd?.['baseAppearanceRef']) ? {
      'baseAppearanceRef': normalizeText(_0x12dbfd["baseAppearanceRef"])
    } : {}),
    ...(includeBindings && normalizeStringArray(_0x12dbfd?.["sourceEpisodeRefs"])["length"] ? {
      'sourceEpisodeRefs': normalizeStringArray(_0x12dbfd["sourceEpisodeRefs"])
    } : {}),
    ...(includeBindings && normalizeStringArray(_0x12dbfd?.["sourceSceneRefs"])["length"] ? {
      'sourceSceneRefs': normalizeStringArray(_0x12dbfd['sourceSceneRefs'])
    } : {}),
    ...(_0x4dfab3 && normalizeText(_0x12dbfd?.['description']) ? {
      'description': normalizeText(_0x12dbfd['description'])
    } : {}),
    'appearances': _0x4dc0b6
  };
}
function createStoryEpisodeSplitCompactAssetCatalog(_0x1f60f7 = []) {
  const _0x91de9d = [];
  (Array["isArray"](_0x1f60f7) ? _0x1f60f7 : [])["forEach"](_0x34ce3e => {
    const _0x5c896b = Array["isArray"](_0x34ce3e?.["appearances"]) ? _0x34ce3e["appearances"]["filter"](_0x541535 => normalizeText(_0x541535?.['ref'])) : [];
    const _0x5ecd24 = _0x5c896b["length"] ? [..._0x5c896b]["sort"]((_0x876c4e, _0x5caa60) => {
      const _0x15cb01 = normalizeText(_0x34ce3e?.["baseAppearanceRef"]);
      return Number(normalizeText(_0x5caa60?.["ref"]) === _0x15cb01) - Number(normalizeText(_0x876c4e?.["ref"]) === _0x15cb01);
    }) : [null];
    _0x5ecd24["forEach"](_0x42a8e4 => {
      const _0x168816 = 'a' + (_0x91de9d["length"] + 0x1);
      const _0x4cabab = normalizeText(_0x42a8e4?.['name']);
      _0x91de9d['push']({
        'code': _0x168816,
        'kind': normalizeText(_0x34ce3e?.['kind']),
        'name': [normalizeText(_0x34ce3e?.["name"]), _0x4cabab]["filter"](Boolean)["join"]('·'),
        'assetName': normalizeText(_0x34ce3e?.["name"]),
        'ref': normalizeText(_0x42a8e4?.["ref"]) || normalizeText(_0x34ce3e?.["ref"]),
        'assetRef': normalizeText(_0x34ce3e?.["ref"])
      });
    });
  });
  return _0x91de9d;
}
function createStoryEpisodeSplitCompactDialogueCatalog(_0x91955d = {}, _0x39207a = []) {
  let _0x375ddf = [];
  try {
    _0x375ddf = normalizeStoryEpisodeSplitSourceBeats(_0x91955d)["flatMap"](_0x1ff0b4 => Array['isArray'](_0x1ff0b4?.["dialogueUnits"]) ? _0x1ff0b4["dialogueUnits"] : []);
  } catch {
    _0x375ddf = extractStoryEpisodeDialogueUnits(_0x91955d?.["script"]?.["fullText"] || _0x91955d?.['fullScript'] || _0x91955d?.["scriptText"] || _0x91955d?.["synopsis"] || _0x91955d?.["content"], getStoryEpisodeReferenceAliases(_0x91955d)[0x0] || "episode-1");
  }
  const _0x2af1fe = createStoryEpisodeSplitCompactAssetCatalog(_0x39207a)['filter'](_0x5a7055 => _0x5a7055["kind"] === 'character');
  return _0x375ddf["map"]((_0x134a43, _0x39f73a) => {
    const _0xe40068 = normalizeText(_0x134a43?.['speaker']);
    const _0x39bb6c = _0xe40068 ? _0x2af1fe["filter"](_0x4c87da => getStoryEpisodeSplitAssetNameAliases(_0x4c87da['assetName'])['some'](_0x47195b => _0x47195b === _0xe40068)) : [];
    return {
      'code': 'q' + (_0x39f73a + 0x1),
      ...(_0xe40068 ? {
        'speaker': _0xe40068
      } : {}),
      ...(_0x39bb6c["length"] === 0x1 ? {
        'speakerAssetCode': _0x39bb6c[0x0]["code"]
      } : {}),
      'text': normalizeText(_0x134a43?.["text"])
    };
  })["filter"](_0x555ed8 => _0x555ed8["text"]);
}
function decodeStoryEpisodeSplitCompactDialogue(_0x5a6f61, {
  dialogueByCode = new Map(),
  assetByCode = new Map()
} = {}) {
  const _0x32ad35 = normalizeText(_0x5a6f61);
  if (!_0x32ad35) {
    return {
      'text': '',
      'assetCode': ''
    };
  }
  const [_0x3a8f0c, _0x4689b0 = ''] = _0x32ad35["split"]('@')['map'](normalizeText);
  const _0x480ed6 = dialogueByCode["get"](_0x3a8f0c);
  if (!_0x480ed6) {
    return {
      'text': _0x32ad35,
      'assetCode': ''
    };
  }
  const _0xbd342a = assetByCode["get"](_0x4689b0);
  const _0x378271 = _0xbd342a?.["kind"] === "character" ? _0x4689b0 : '';
  const _0x399ed0 = _0x378271 || normalizeText(_0x480ed6?.['speakerAssetCode']);
  const _0x4979ab = assetByCode["get"](_0x399ed0);
  const _0x327cce = normalizeText(_0x4979ab?.["assetName"]) || normalizeText(_0x480ed6?.["speaker"]) || '人物';
  return {
    'text': _0x327cce + '：“' + _0x480ed6["text"] + '”',
    'assetCode': _0x399ed0
  };
}
function expandStoryEpisodeSplitCompactData(_0x23e8a2 = {}, {
  episodeRef = '',
  episode = {},
  assets = []
} = {}) {
  if (!_0x23e8a2 || typeof _0x23e8a2 !== "object" || !Array["isArray"](_0x23e8a2["clips"])) {
    return _0x23e8a2;
  }
  const _0x2f5cfc = createStoryEpisodeSplitCompactAssetCatalog(assets);
  const _0x3781ea = createStoryEpisodeSplitCompactSceneCatalog(assets);
  const _0x4d41ee = new Map([..._0x2f5cfc, ..._0x3781ea]["map"](_0x22ac99 => [_0x22ac99["code"], _0x22ac99]));
  const _0xdb94a9 = _0x2f5cfc["filter"]((_0x211ccf, _0x3436cf) => _0x2f5cfc['findIndex'](_0x2a4d6b => _0x2a4d6b['assetRef'] === _0x211ccf["assetRef"]) === _0x3436cf);
  const _0x3e6c01 = createStoryEpisodeSplitCompactDialogueCatalog(episode, assets);
  const _0x469bd4 = new Map(_0x3e6c01['map'](_0x12f080 => [_0x12f080["code"], _0x12f080]));
  return {
    ..._0x23e8a2,
    'episodeRef': normalizeText(_0x23e8a2['episodeRef']) || episodeRef,
    'clips': _0x23e8a2["clips"]["map"]((_0xefa0fd, _0x2f7c8d) => ({
      ..._0xefa0fd,
      'ref': normalizeText(_0xefa0fd?.["ref"]) || "clip-" + (_0x2f7c8d + 0x1),
      'shots': (Array["isArray"](_0xefa0fd?.["shots"]) ? _0xefa0fd["shots"] : [])["map"](_0x374857 => {
        if (!_0x374857 || typeof _0x374857 !== "object" || Array["isArray"](_0x374857)) {
          return _0x374857;
        }
        const _0x427c35 = ['d', 'r', 'v', 'c', 'q', 'o', 'a']['some'](_0x687664 => Object["prototype"]["hasOwnProperty"]['call'](_0x374857, _0x687664));
        if (!_0x427c35) {
          return _0x374857;
        }
        const _0x1da7e2 = Math["trunc"](Number(_0x374857['c']));
        const _0x363b30 = Number["isInteger"](_0x1da7e2) && STORY_EPISODE_SPLIT_CAMERA_PRESETS[_0x1da7e2] ? STORY_EPISODE_SPLIT_CAMERA_PRESETS[_0x1da7e2] : normalizeText(_0x374857['c']) || STORY_EPISODE_SPLIT_CAMERA_PRESETS[0x0];
        const _0x3720e6 = decodeStoryEpisodeSplitCompactDialogue(_0x374857['q'], {
          'dialogueByCode': _0x469bd4,
          'assetByCode': _0x4d41ee
        });
        const _0x1b21d4 = normalizeText(_0x374857['v']);
        const _0x1cab70 = _0xdb94a9["filter"](_0x4c0303 => getStoryEpisodeSplitAssetNameAliases(_0x4c0303["assetName"])["some"](_0x241e59 => _0x241e59 && _0x1b21d4["includes"](_0x241e59)))["map"](_0x330713 => _0x330713['code']);
        const _0xd7c577 = normalizeStringArray([_0x3720e6['assetCode'], ..._0x1cab70, ...normalizeStringArray(_0x374857['r']), normalizeText(_0xefa0fd?.['s'])])["map"](_0x1918c7 => _0x4d41ee["get"](_0x1918c7))['filter'](Boolean);
        const _0x4d7b09 = [...new Map(_0xd7c577["map"](_0x3198bf => [_0x3198bf["assetRef"] + ':' + _0x3198bf["ref"], {
          'assetRef': _0x3198bf["assetRef"],
          'appearanceRef': _0x3198bf["ref"] === _0x3198bf['assetRef'] ? '' : _0x3198bf["ref"]
        }]))["values"]()];
        return {
          'durationSec': _0x374857['d'],
          ...(Object["prototype"]["hasOwnProperty"]["call"](_0x374857, "startSec") ? {
            'startSec': _0x374857["startSec"]
          } : {}),
          ...(Object["prototype"]["hasOwnProperty"]['call'](_0x374857, "endSec") ? {
            'endSec': _0x374857['endSec']
          } : {}),
          'assetUsages': _0x4d7b09,
          'visual': _0x1b21d4,
          'camera': _0x363b30,
          'dialogue': _0x3720e6["text"],
          'voiceover': normalizeText(_0x374857['o']),
          'audio': normalizeText(_0x374857['a'])
        };
      })
    }))
  };
}
function isStoryEpisodeEditorialMarker(_0x52dd1e = '') {
  return /^(?:[（(]\s*)?(?:本集完|本章完|全剧终|未完待续|待续|完)(?:\s*[）)])?[。.!！]?$/iu["test"](normalizeText(_0x52dd1e));
}
function sanitizeStoryEpisodeSplitSourceText(_0x544fec = '') {
  return String(_0x544fec || '')["split"](/\r?\n/u)["filter"](_0x3e4e40 => !isStoryEpisodeEditorialMarker(_0x3e4e40))["join"]('\x0a')["trim"]();
}
function getStoryEpisodeSplitSourceSceneMetadata(_0x4bc513 = {}) {
  return (Array['isArray'](_0x4bc513?.["script"]?.["scenes"]) ? _0x4bc513["script"]["scenes"] : [])['map'](_0x363fe2 => ({
    'heading': normalizeText(_0x363fe2?.["heading"]),
    'characters': normalizeStringArray(_0x363fe2?.["characters"])
  }))["filter"](_0x1c4de4 => _0x1c4de4["heading"] || _0x1c4de4["characters"]['length']);
}
function isStoryEpisodeSplitSourceMetadataLine(_0x39daa2 = '', _0x3e893d = {}) {
  const _0x5c83b1 = normalizeText(_0x39daa2);
  if (!_0x5c83b1) {
    return ![];
  }
  if (/[。！？!?；;“”「」]|\.(?:\s|$)/u["test"](_0x5c83b1)) {
    return ![];
  }
  const _0xd23433 = new Set(getStoryEpisodeSplitSourceSceneMetadata(_0x3e893d)['map'](_0x2a9614 => _0x2a9614['heading'])["filter"](Boolean));
  return _0xd23433["has"](_0x5c83b1) || /^#{1,6}\s*(?:第?\s*\d+\s*集|场(?:景)?\s*\d)/u["test"](_0x5c83b1) || /^(?:出场人物|人物列表|时间|地点|场景)[：:]/u["test"](_0x5c83b1);
}
function sanitizeStoryEpisodeSplitPromptText(_0xeace1e = '', _0x1f0903 = {}) {
  return sanitizeStoryEpisodeSplitSourceText(_0xeace1e)["split"](/\r?\n/u)["filter"](_0x40c03c => !isStoryEpisodeSplitSourceMetadataLine(_0x40c03c, _0x1f0903))["join"]('\x0a')['trim']();
}
function filterStoryEpisodeBlueprintEpisodeBindings(_0x4fb208 = [], _0x254282 = []) {
  const _0x35f68a = new Set(normalizeStringArray(_0x254282));
  return normalizeStringArray(_0x4fb208)["filter"](_0x8467e0 => _0x35f68a["has"](_0x8467e0));
}
function filterStoryEpisodeBlueprintSceneBindings(_0x3a84e1 = [], _0x413069 = [], {
  episodeRefs = []
} = {}) {
  const _0x1d5b95 = normalizeStringArray(_0x413069);
  return normalizeStringArray(_0x3a84e1)["filter"](_0x43a8e6 => _0x1d5b95["some"](_0x1d1d64 => storyEpisodeSourceSceneRefsMatch(_0x43a8e6, _0x1d1d64, episodeRefs)));
}
function compactStoryEpisodeBlueprintAsset(_0x47cb8b = {}, {
  episodeRefs = [],
  sourceSceneRefs = []
} = {}) {
  const _0x11adf6 = compactStoryEpisodePromptAsset(_0x47cb8b);
  const _0x15f7c5 = (_0x72f744 = {}) => {
    const _0x3d412a = normalizeStringArray(_0x72f744?.['sourceEpisodeRefs']);
    const _0x16cdbd = filterStoryEpisodeBlueprintEpisodeBindings(_0x3d412a, episodeRefs);
    const _0x3818f9 = _0x3d412a["length"] && !_0x16cdbd["length"] ? [] : filterStoryEpisodeBlueprintSceneBindings(_0x72f744?.["sourceSceneRefs"], sourceSceneRefs, {
      'episodeRefs': episodeRefs
    });
    return {
      ...(_0x16cdbd["length"] ? {
        'sourceEpisodeRefs': _0x16cdbd
      } : {}),
      ...(_0x3818f9["length"] ? {
        'sourceSceneRefs': _0x3818f9
      } : {})
    };
  };
  const _0x285129 = new Map((Array["isArray"](_0x47cb8b?.['appearances']) ? _0x47cb8b["appearances"] : [])['map'](_0x420938 => [normalizeText(_0x420938?.["ref"]), _0x420938]));
  return {
    ..._0x11adf6,
    ...(normalizeText(_0x47cb8b?.['baseAppearanceRef']) ? {
      'baseAppearanceRef': normalizeText(_0x47cb8b["baseAppearanceRef"])
    } : {}),
    ..._0x15f7c5(_0x47cb8b),
    'appearances': _0x11adf6["appearances"]["map"](_0x31eb92 => ({
      ..._0x31eb92,
      ..._0x15f7c5(_0x285129['get'](_0x31eb92['ref']))
    }))
  };
}
function buildStoryEpisodeSplitAssetCatalog(_0x2f30c0 = [], _0x9f0c22 = []) {
  const _0x487bcc = new Map();
  const _0x49c3d3 = new Map();
  for (const _0x8e1fda of Array['isArray'](_0x2f30c0) ? _0x2f30c0 : []) {
    const _0x481f93 = a158_0x4e1501(_0x8e1fda?.["ref"], '');
    if (!_0x481f93) {
      continue;
    }
    const _0x8a0398 = [];
    for (const _0x37812b of Array["isArray"](_0x8e1fda?.["appearances"]) ? _0x8e1fda['appearances'] : []) {
      const _0x3ea731 = a158_0x4e1501(_0x37812b?.["ref"], '');
      if (!_0x3ea731) {
        continue;
      }
      _0x8a0398['push'](_0x3ea731);
      const _0x1db7f4 = _0x49c3d3['get'](_0x3ea731) || new Set();
      _0x1db7f4["add"](_0x481f93);
      _0x49c3d3["set"](_0x3ea731, _0x1db7f4);
    }
    const _0x55c28e = ["scene", 'prop']["includes"](_0x8e1fda?.["kind"]) ? _0x8e1fda["kind"] : "character";
    const _0x482fd5 = _0x8a0398['includes'](_0x481f93 + "-appearance-1") ? _0x481f93 + "-appearance-1" : '';
    _0x487bcc['set'](_0x481f93, {
      'assetRef': _0x481f93,
      'kind': _0x55c28e,
      'name': normalizeText(_0x8e1fda?.["name"]),
      'appearanceRefs': _0x8a0398,
      'defaultAppearanceRef': a158_0x4e1501(_0x8e1fda?.["baseAppearanceRef"], '') || _0x482fd5 || (_0x8a0398['length'] === 0x1 ? _0x8a0398[0x0] : '')
    });
  }
  for (const _0x386f04 of normalizeStringArray(_0x9f0c22)) {
    !_0x487bcc['has'](_0x386f04) && _0x487bcc["set"](_0x386f04, {
      'assetRef': _0x386f04,
      'kind': "unknown",
      'name': '',
      'appearanceRefs': [],
      'defaultAppearanceRef': ''
    });
  }
  return {
    'assetByRef': _0x487bcc,
    'appearanceOwnerRefsByRef': _0x49c3d3
  };
}
function getStoryEpisodeSplitAssetNameAliases(_0x50dca3 = '') {
  const _0x18aa6e = normalizeText(_0x50dca3);
  if (!_0x18aa6e) {
    return [];
  }
  const _0xff6c0e = new Set([_0x18aa6e]);
  const _0x46275c = normalizeText(_0x18aa6e["split"](/[（(]/u, 0x1)[0x0]);
  if (_0x46275c) {
    _0xff6c0e['add'](_0x46275c);
  }
  const _0x58733e = [..._0x18aa6e["matchAll"](/[（(]([^）)]+)[）)]/gu)]['map'](_0x3c0cff => normalizeText(_0x3c0cff[0x1]))["filter"](Boolean);
  _0x58733e["forEach"](_0x492093 => _0xff6c0e["add"](_0x492093));
  const _0x4665db = _0x18aa6e["replace"](/^(?:实习生|调查记者|记者|刑警|警官|警察|房东|高中生|师父|掌门|宗主|老板|总编|编辑)/u, '');
  if (_0x4665db) {
    _0xff6c0e["add"](_0x4665db);
  }
  return [..._0xff6c0e];
}
function resolveStoryEpisodeSplitLegacyAppearanceOwner(_0x4068eb, _0x18d8fd, _0x3c6345, _0x561b26 = {}) {
  const _0x3f88f6 = [...(_0x18d8fd || [])];
  if (_0x3f88f6["length"] <= 0x1) {
    return _0x3f88f6[0x0] || '';
  }
  const _0x2a6ad0 = [_0x561b26?.["visual"], _0x561b26?.["camera"], _0x561b26?.["dialogue"], _0x561b26?.['voiceover']]["map"](normalizeText)["filter"](Boolean)["join"]('\x20');
  const _0x4aaea2 = _0x3f88f6["filter"](_0x118a8b => {
    const _0x5a28ee = _0x3c6345['assetByRef']["get"](_0x118a8b)?.["name"];
    return getStoryEpisodeSplitAssetNameAliases(_0x5a28ee)["some"](_0x415e38 => _0x415e38 && _0x2a6ad0['includes'](_0x415e38));
  });
  if (_0x4aaea2["length"] === 0x1) {
    return _0x4aaea2[0x0];
  }
  const _0x5e99e1 = _0x3f88f6["filter"](_0x2d3fb0 => _0x4068eb["startsWith"](_0x2d3fb0 + "-appearance-"));
  return _0x5e99e1['length'] === 0x1 ? _0x5e99e1[0x0] : '';
}
function resolveStoryEpisodeSplitUnknownLegacyAppearance(_0x101749, _0x44e3fc, _0x580d90 = {}) {
  const _0x3ac421 = [..._0x44e3fc["assetByRef"]['values']()];
  const _0x2e0078 = _0x3ac421["filter"](_0x13a835 => _0x101749["startsWith"](_0x13a835["assetRef"] + "-appearance-"));
  if (_0x2e0078['length'] === 0x1) {
    return _0x2e0078[0x0];
  }
  const _0xa65b04 = [_0x580d90?.["visual"], _0x580d90?.["camera"], _0x580d90?.["dialogue"], _0x580d90?.['voiceover']]['map'](normalizeText)["filter"](Boolean)['join']('\x20');
  const _0x191191 = _0x3ac421['filter'](_0x192686 => getStoryEpisodeSplitAssetNameAliases(_0x192686["name"])["some"](_0x430bce => _0x430bce && _0xa65b04["includes"](_0x430bce)));
  return _0x191191['length'] === 0x1 ? _0x191191[0x0] : null;
}
function assertKnownReferences(_0x26b1e2, _0x2daae7, _0xf1ff00) {
  const _0x451e67 = _0x26b1e2["filter"](_0x5ec8fa => !_0x2daae7["has"](_0x5ec8fa));
  if (_0x451e67["length"]) {
    throw new Error(_0xf1ff00 + '引用了不存在的资产：' + _0x451e67['join']('、') + '。');
  }
}
function normalizeStoryEpisodeSplitAssetUsage(_0x4135f9 = {}, _0x1d3c0a, _0xf40dd) {
  const _0x3acd37 = a158_0x4e1501(_0x4135f9?.['assetRef'], '');
  let _0x3aa9af = a158_0x4e1501(_0x4135f9?.["appearanceRef"], '');
  if (!_0x3acd37) {
    throw new Error(_0xf40dd + '缺少\x20assetRef。');
  }
  const _0x208106 = _0x1d3c0a['assetByRef']["get"](_0x3acd37);
  if (!_0x208106) {
    throw new Error(_0xf40dd + "引用了不存在的资产：" + _0x3acd37 + '。');
  }
  _0x3aa9af === _0x3acd37 && !_0x208106['appearanceRefs']['includes'](_0x3aa9af) && (_0x3aa9af = _0x208106["defaultAppearanceRef"]);
  if (_0x3aa9af) {
    const _0x29b96b = _0x1d3c0a['appearanceOwnerRefsByRef']["get"](_0x3aa9af);
    if (!_0x29b96b?.["size"]) {
      throw new Error(_0xf40dd + "引用了不存在的形象：" + _0x3aa9af + '。');
    }
    if (!_0x208106['appearanceRefs']["includes"](_0x3aa9af)) {
      throw new Error(_0xf40dd + "的形象“" + _0x3aa9af + "”不属于资产“" + _0x3acd37 + '”。');
    }
  } else {
    if (_0x208106["defaultAppearanceRef"]) {
      _0x3aa9af = _0x208106["defaultAppearanceRef"];
    } else {
      if (_0x208106["appearanceRefs"]['length']) {
        throw new Error(_0xf40dd + "必须为资产“" + _0x3acd37 + "”选择一个具体形象。");
      }
    }
  }
  return {
    'assetRef': _0x3acd37,
    'appearanceRef': _0x3aa9af
  };
}
export function buildStoryAssetExtractionPrompt({
  project = {},
  aspectRatio = '',
  visualStyle = '',
  assetKinds = STORY_ASSET_EXTRACTION_KINDS,
  requiredAssetNamesByKind = null,
  candidateAssetsByKind = null,
  requiredAssetsByKind = null,
  compactOutput = ![]
} = {}) {
  const _0xad2dee = resolveStoryPlanningConstraints(project);
  const _0x95ad7a = normalizeStoryProjectInput(project);
  _0x95ad7a["planning"] = _0xad2dee;
  assertStoryProjectInput(_0x95ad7a);
  const _0x1ac1ff = normalizeText(visualStyle) || _0x95ad7a['visualStyle'];
  const _0x3eb28b = normalizeStringArray(assetKinds)["filter"](_0x35eeb5 => STORY_ASSET_EXTRACTION_KINDS["includes"](_0x35eeb5));
  if (!_0x3eb28b['length']) {
    throw new Error('资产提取至少需要指定角色、场景或道具中的一种。');
  }
  const _0x232455 = {
    'character': '角色',
    'scene': '场景',
    'prop': '道具'
  };
  const _0x15d109 = createStoryAssetPromptContracts(_0x3eb28b, requiredAssetNamesByKind, candidateAssetsByKind, requiredAssetsByKind, {
    'includeClientKeys': compactOutput
  });
  const _0x56d8d2 = {
    'task': compactOutput ? 'complete_story_asset_visual_design_by_client_key' : _0x3eb28b["length"] === 0x1 ? "extract_story_assets_by_kind" : 'extract_story_assets',
    'schemaVersion': STORY_ASSET_EXTRACTION_SCHEMA_VERSION,
    'assetKinds': _0x3eb28b,
    'project': {
      'title': _0x95ad7a['title'],
      'chapters': _0x95ad7a["chapters"]
    },
    'visualDirection': {
      'aspectRatio': normalizeText(aspectRatio) || _0x95ad7a["aspectRatio"] || "16:9",
      'style': _0x1ac1ff
    },
    ..._0x15d109["payload"],
    'requirements': ['本次只返回\x20' + _0x3eb28b["map"](_0xada73a => _0x232455[_0xada73a])["join"]('、') + "资产，禁止返回其他 kind。", ..._0x15d109["requirements"], ...(compactOutput ? ['这是紧凑视觉裁决模式：requiredAssets\x20与\x20candidateAssets\x20中的每一个\x20clientKey\x20都必须恰好返回一行，顺序不限，禁止省略、重复或编造\x20clientKey。', "requiredAssets 必须 include=true；candidateAssets 必须逐项明确返回 include=true 或 include=false。即使 include=false，也必须保留 description、visualPrompt、voiceDescription 三个字符串字段，可返回空字符串。", "include=true 时，description 是可直接展示的最终资产简介，visualPrompt 是可直接提交图片模型的最终正向提示词；客户端不会补写、扩写或套用模板。", "角色必须在 voiceDescription 中完整填写年龄、性别、身份、口音、情绪底色、声线、语速、说话方式、音色特征九项；场景和道具的 voiceDescription 必须为空字符串。", '禁止返回或改写\x20name、ref、来源、集数或\x20appearance\x20等客户端权威字段。不要复述剧情、证据、检索过程或规则。'] : ["提取后续画面中需要保持视觉一致的全部角色、场景和关键道具；普通背景杂物不单独提取为道具。", "必须通读 project.chapters 中提供的剧本证据后自行识别资产；不得依赖输入之外的预置角色、题材词表或候选清单，也不得因为角色戏份少、没有姓名、属于群体身份或只在单场出现而省略证据中实际出场且需要画面表现的角色。", "提取角色时，原文出场人物、登场人物或出场角色名单中的每一个独立称谓，以及有对白、独立动作或单独指代的角色都必须逐项返回；不得合并不同姓名、称谓或编号，群体身份需要画面表现时也必须返回群体角色资产。", "所有身份、外观、关系、物品归属和连续性事实都以所提供的剧本证据为准；不得为了视觉效果改写原文事实。", "ref 使用简短且在本次响应内唯一的英文或数字标识；它只是本次规划引用，不是持久 ID。", "sourceChapterIds 只能引用 project.chapters 中存在的 id。", "角色 name 只能是姓名或简短身份名：优先使用原文姓名；没有姓名时给出不超过 6 个汉字的身份短称，不得写人物介绍。", "角色 role 只能是主角、配角、反派或路人，必须依据人物在完整故事中的实际叙事作用分类；任何身份、关系、经历和叙事说明都写入 description。", "每个角色必须提供 voiceDescription，并按固定标签完整填写：年龄、性别、身份、口音、情绪底色、声线、语速、说话方式、音色特征；场景和道具的 voiceDescription 留空。", '每项资产至少提供一个信息充分、可直接用于图片生成的\x20appearance\x20prompt，不得用‘符合设定’‘电影感人物’等空泛表述代替可见细节。', "角色 prompt 必须写清脸型、五官、肤色肤质、发型发色、身材体态、服装材质层次、鞋履和必要穿戴细节，并采用正面全身人物设定图构图。", "角色 prompt 只生成人设图，不生成人物剧照：聚焦脸部、发型、体态、服装、鞋履和必要穿戴细节，采用自然站立的正面全身人物设定图构图，不写剧情道具、动作表演、地点、家具、其他人物或剧情场面。", '最终\x20prompt\x20只能写需要呈现的正向视觉内容，不得复述任何规则、限制、处理流程、模型说明或其他元说明措辞。', "每个场景资产只能对应一个可独立复用的物理空间；遇到用“/”“／”等并列多个地点的复合场景标题，必须拆成多个原子场景资产，禁止直接复制复合标题作为资产名。", "场景 prompt 必须写清空间布局、结构材质、前中后景、关键陈设、光源与色温、时间天气、色彩、镜头视角及景别，并默认无人。", "道具 prompt 必须写清用途、轮廓、尺寸比例、材质工艺、颜色纹样、磨损、关键结构及产品设定构图，并默认无人手持。", "每个 appearance 都必须提供具体形象名称；角色首个形象也要按服装、身份或时期命名，禁止留空或使用笼统的‘基础形象’。角色显著换装、年龄变化或受伤状态可拆成多个 appearances；其他形象必须重复稳定的脸部、发型和体态特征，只修改剧情差异。同一物理空间在不同年代、完好/损毁、正常/异变、干燥/积水等显著状态下必须拆成多个场景 appearances；道具仍只保留一个形象。", _0x1ac1ff ? "每个 appearance prompt 必须逐字以 visualDirection.style 的完整内容开头，再续写资产描述；不得省略、改写或重复此前缀。" : '提示词遵循项目视觉方向，但不要把画面比例写进角色身份描述。'])],
    'outputSchema': compactOutput ? {
      'assets': [{
        'clientKey': '输入中原样提供的短键',
        'include': !![],
        'description': '可直接公开展示的最终资产简介；未采纳候选可为空字符串',
        'visualPrompt': "可直接提交图片模型的最终正向提示词；未采纳候选可为空字符串",
        'voiceDescription': "仅角色按九项完整填写；场景、道具和未采纳候选为空字符串"
      }]
    } : {
      'assets': [{
        'ref': "本次规划中的唯一引用",
        'kind': _0x3eb28b['join']('、'),
        'name': "角色姓名或简短身份名；场景或道具名称",
        'role': "角色只能是主角、配角、反派或路人；场景和道具使用简短叙事作用",
        'description': "故事内身份或空间说明",
        'voiceDescription': "仅角色填写。固定格式：年龄：…；性别：…；身份：…；口音：…；情绪底色：…；声线：…；语速：…；说话方式：…；音色特征：…",
        'occurrences': "人类可读的出现范围",
        'sourceChapterIds': ["chapter id"],
        'appearances': [{
          'ref': "资产内唯一形象引用",
          'name': "必填的具体形象名称；按服装、身份或时期命名，禁止使用笼统的基础形象",
          'description': '该形象与基础状态的差异',
          'occurrences': '人类可读的出现范围',
          'sourceChapterIds': ['chapter\x20id'],
          'prompt': "以完整视觉风格开头、可直接用于图片生成的中文提示词；角色采用自然站立的正面全身独立人设图，画面只呈现单个人物"
        }]
      }]
    }
  };
  return ['请执行影视资产提取，并直接返回最终\x20JSON\x20结果。', "不要复述、复制或改写输入剧本；不要返回任务说明、输入参数、规则或输出格式说明。", "本次仅提取：" + _0x3eb28b["map"](_0x56b37d => _0x232455[_0x56b37d])['join']('、') + '。', "返回 JSON 的顶层必须且只能包含 assets 字段。", "下面的 JSON 仅是待分析的输入数据，禁止在答案中复述：", "<story_input_json>", JSON['stringify'](_0x56d8d2), '</story_input_json>', "现在直接输出 {\"assets\":[...]}，不要输出输入内容。"]['join']('\x0a');
}
const STORY_ASSET_FORMAT_REPAIR_SYSTEM_PROMPT = ["你是严格的 JSON 结果修复器。", "只修复输入结果的 JSON 语法、字段名称、字段类型和必填字段，不重新分析剧本。", "不得返回原始请求、任务说明、校验说明或 Markdown。", "不得删除原结果中已经存在的资产；不得编造原结果无法支持的新人物、场景、道具或剧情事实。", '只返回一个顶层仅包含\x20assets\x20字段的严格\x20JSON\x20对象。']["join"]('\x0a');
function getStoryAssetExtractionFinishReason(_0x19f018) {
  return normalizeText(_0x19f018?.["finishReason"] || _0x19f018?.["finish_reason"] || _0x19f018?.["choices"]?.[0x0]?.['finish_reason'] || _0x19f018?.["data"]?.['choices']?.[0x0]?.["finish_reason"])["toLowerCase"]();
}
function isStoryAssetExtractionInputEcho(_0x5b7e6d, _0x219757) {
  const _0x2028e1 = normalizeText(getResultText(_0x5b7e6d));
  const _0x1339c0 = normalizeText(_0x219757);
  if (!_0x2028e1 || !_0x1339c0) {
    return ![];
  }
  if (_0x2028e1 === _0x1339c0) {
    return !![];
  }
  const _0xaadd15 = _0x1339c0['slice'](0x0, 0xf0);
  if (_0xaadd15["length"] >= 0x78 && _0x2028e1["startsWith"](_0xaadd15)) {
    return !![];
  }
  return _0x2028e1["includes"]("<story_input_json>") || /"task"\s*:\s*"extract_story_assets(?:_by_kind)?"/u["test"](_0x2028e1) && /"project"\s*:/u["test"](_0x2028e1) && /"outputSchema"\s*:/u["test"](_0x2028e1);
}
function classifyStoryAssetExtractionRecovery(_0x37196b, _0x2bdc5f, _0x3de47e) {
  const _0xffb54c = getStoryAssetExtractionFinishReason(_0x37196b);
  if (_0xffb54c === "length" || _0xffb54c === "max_tokens" || _0xffb54c === "max_output_tokens") {
    return {
      'mode': 'rerun',
      'reason': 'length'
    };
  }
  if (isStoryAssetExtractionInputEcho(_0x37196b, _0x3de47e)) {
    return {
      'mode': "rerun",
      'reason': "echo"
    };
  }
  const _0x3e5cc1 = normalizeText(getResultText(_0x37196b));
  if (!_0x3e5cc1) {
    return {
      'mode': "rerun",
      'reason': "empty"
    };
  }
  if (/没有可用的(?:角色|场景|角色或场景)资产/u["test"](normalizeText(_0x2bdc5f?.["message"] || _0x2bdc5f)) && Math["max"](0x0, Math["trunc"](Number(_0x2bdc5f?.["raw"]?.["returnedAssetCount"]) || 0x0)) === 0x0) {
    return {
      'mode': "rerun",
      'reason': 'missing-assets'
    };
  }
  return {
    'mode': 'format-repair',
    'reason': "invalid-structure"
  };
}
function buildStoryAssetExtractionFormatRepairPrompt({
  response: _0x117172,
  error: _0x1b12ac,
  assetKinds = STORY_ASSET_EXTRACTION_KINDS,
  chapterIds = [],
  outputContract = ''
} = {}) {
  return ["仅修复下面这份已返回结果的 JSON 格式和字段结构。", "不要重新分析剧本，不要复述原始请求，不要添加原结果中不存在的资产。", '允许的\x20kind：' + (normalizeStringArray(assetKinds)["join"]('、') || STORY_ASSET_EXTRACTION_KINDS['join']('、')) + '。', '允许的\x20sourceChapterIds：' + (normalizeStringArray(chapterIds)['join']('、') || '仅使用原结果已有值') + '。', '本地校验错误：' + (normalizeText(_0x1b12ac?.["message"] || _0x1b12ac) || "返回格式不合格"), '目标结构：' + normalizeText(outputContract), '<rejected_response>', normalizeText(getResultText(_0x117172)), "</rejected_response>", "输出前自行检查：顶层只能有 assets，JSON 必须闭合，所有必填字段必须存在。", "现在只返回修复后的 JSON。"]["join"]('\x0a');
}
function buildStoryAssetExtractionRerunPrompt(_0xb1051d, _0x5da509) {
  const _0x4e2569 = _0x5da509 === "length" ? "上一次输出被截断，缺失内容无法通过格式修复恢复。" : _0x5da509 === "echo" ? "上一次错误地复述了输入，没有生成资产结果。" : "上一次没有返回可用的资产内容。";
  return [_0x4e2569, "请重新执行当前这一类资产提取；这是唯一一次自动重试。", "输出前自行检查：不要复述输入，顶层只能有 assets，JSON 必须完整闭合。", _0xb1051d]["join"]('\x0a');
}
async function requestStoryAssetExtractionResult({
  request: _0x48de10,
  requestPayload: _0x27123a,
  parse: _0x146371,
  outputContract: _0x52f8ab,
  assetKinds: _0x215496,
  chapterIds: _0x599303,
  onProgress: _0x33ea50,
  automaticRecovery = ![]
}) {
  const _0x7afb8d = await _0x48de10(_0x27123a);
  try {
    return _0x146371(_0x7afb8d);
  } catch (_0x20eaf5) {
    if (!automaticRecovery) {
      throw _0x20eaf5;
    }
    const _0xb7a3c3 = classifyStoryAssetExtractionRecovery(_0x7afb8d, _0x20eaf5, _0x27123a["prompt"]);
    const _0x19ffe0 = {
      'character': '角色',
      'scene': '场景',
      'prop': '道具'
    };
    const _0x126554 = normalizeStringArray(_0x215496)['map'](_0x46bb60 => _0x19ffe0[_0x46bb60] || _0x46bb60)['join']('、') || '资产';
    const _0x1ae651 = _0xb7a3c3['mode'] === "format-repair";
    _0x33ea50?.({
      'stage': _0x1ae651 ? "repairing-assets" : "retrying-assets",
      'current': 0x1,
      'total': 0x1,
      'message': _0x1ae651 ? _0x126554 + "返回格式不合格，正在自动纠错（1/1）" : _0x126554 + "返回内容不完整，正在仅重试当前类别（1/1）"
    });
    const _0xe1d778 = _0x1ae651 ? {
      ..._0x27123a,
      'prompt': buildStoryAssetExtractionFormatRepairPrompt({
        'response': _0x7afb8d,
        'error': _0x20eaf5,
        'assetKinds': _0x215496,
        'chapterIds': _0x599303,
        'outputContract': _0x52f8ab
      }),
      'systemPrompt': STORY_ASSET_FORMAT_REPAIR_SYSTEM_PROMPT,
      'temperature': 0x0
    } : {
      ..._0x27123a,
      'prompt': buildStoryAssetExtractionRerunPrompt(_0x27123a["prompt"], _0xb7a3c3["reason"]),
      'temperature': 0.1
    };
    const _0x14b68e = await _0x48de10(_0xe1d778);
    try {
      return _0x146371(_0x14b68e);
    } catch (_0x7f4b3) {
      const _0x58e187 = classifyStoryAssetExtractionRecovery(_0x14b68e, _0x7f4b3, _0xe1d778["prompt"]);
      if (_0x58e187["reason"] === 'length') {
        const _0x261888 = new Error("自动纠错后输出仍被截断。");
        _0x261888['type'] = "OUTPUT_LENGTH";
        _0x261888["cause"] = _0x7f4b3;
        throw _0x261888;
      }
      if (_0x58e187["reason"] === "echo") {
        const _0x1241a8 = new Error("自动纠错后模型仍在复述输入。");
        _0x1241a8["type"] = "INPUT_ECHO";
        _0x1241a8["cause"] = _0x7f4b3;
        throw _0x1241a8;
      }
      _0x7f4b3["automaticRecovery"] = {
        'attempted': !![],
        'mode': _0xb7a3c3["mode"],
        'reason': _0xb7a3c3["reason"]
      };
      throw _0x7f4b3;
    }
  }
}
export async function extractStoryAssets({
  project = {},
  model = '',
  provider = '',
  providerProfileId = '',
  aspectRatio = '',
  visualStyle = '',
  assetKinds = STORY_ASSET_EXTRACTION_KINDS,
  requiredAssetNamesByKind = null,
  candidateAssetsByKind = null,
  requiredAssetsByKind = null,
  compactOutput = ![],
  maxOutputTokens = 0x0,
  allowOversizedPrompt = ![],
  automaticRecovery = ![],
  structuredOutputFallback = "none",
  request = generateText,
  onProgress = null
} = {}) {
  assertPlanningModel(model, provider);
  const _0x1135b4 = resolveStoryPlanningConstraints(project);
  const _0x11d249 = normalizeStoryProjectInput(project);
  _0x11d249['planning'] = _0x1135b4;
  assertStoryProjectInput(_0x11d249);
  onProgress?.({
    'stage': 'extracting-assets',
    'current': 0x1,
    'total': 0x1,
    'message': '正在提取角色、场景与道具'
  });
  const _0x529ede = buildStoryAssetExtractionPrompt({
    'project': project,
    'aspectRatio': aspectRatio,
    'visualStyle': visualStyle,
    'assetKinds': assetKinds,
    'requiredAssetNamesByKind': requiredAssetNamesByKind,
    'candidateAssetsByKind': candidateAssetsByKind,
    'requiredAssetsByKind': requiredAssetsByKind,
    'compactOutput': compactOutput
  });
  const _0x192c36 = _0x11d249["chapters"]['map'](_0x3eabed => _0x3eabed['id']);
  const _0x268a5c = normalizeStringArray(assetKinds)["filter"](_0x2304c4 => STORY_ASSET_EXTRACTION_KINDS["includes"](_0x2304c4));
  const _0x4b4b83 = _0x268a5c['length'] === 0x1 && Array['isArray'](requiredAssetNamesByKind?.[_0x268a5c[0x0]]) && requiredAssetNamesByKind[_0x268a5c[0x0]]["length"] === 0x0;
  const _0x4ec87e = compactOutput ? "assets[{clientKey,include,description,visualPrompt,voiceDescription}]" : "assets[{ref,kind(character|scene|prop),name,role(character: 主角|配角|反派|路人),description,voiceDescription(character: labeled 年龄/性别/身份/口音/情绪底色/声线/语速/说话方式/音色特征),occurrences,sourceChapterIds,appearances[{ref,name(required specific visual state),description,occurrences,sourceChapterIds,prompt}]}]";
  const _0xb50c38 = compactOutput ? createStoryAssetPromptContracts(assetKinds, requiredAssetNamesByKind, candidateAssetsByKind, requiredAssetsByKind, {
    'includeClientKeys': !![]
  })['payload'] : {};
  const _0x4ff952 = [...(_0xb50c38["requiredAssets"] || []), ...(_0xb50c38["candidateAssets"] || [])]['map'](_0xc59d0a => _0xc59d0a["clientKey"]);
  return await requestStoryAssetExtractionResult({
    'request': request,
    'requestPayload': {
      'model': normalizeText(model),
      'provider': normalizeText(provider),
      ...buildStoryTextProviderProfilePayload(providerProfileId),
      'prompt': _0x529ede,
      'systemPrompt': STORY_ASSET_EXTRACTION_SYSTEM_PROMPT,
      'structuredOutput': createStoryAssetExtractionStructuredOutput({
        'assetKinds': assetKinds,
        'schema': compactOutput ? createStoryAssetCompactExtractionResponseSchema(assetKinds, _0x4ff952) : createStoryAssetExtractionResponseSchema(assetKinds),
        'fallback': structuredOutputFallback,
        'mode': compactOutput ? "compact" : "detailed"
      }),
      'thinking': {
        'type': "disabled"
      },
      'temperature': 0.2,
      'timeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
      ...(Math["trunc"](Number(maxOutputTokens) || 0x0) > 0x0 ? {
        'maxOutputTokens': Math["trunc"](Number(maxOutputTokens))
      } : {}),
      ...(allowOversizedPrompt ? {
        'allowOversizedPrompt': !![]
      } : {})
    },
    'parse': _0x38802d => compactOutput ? parseStoryAssetCompactExtractionResult(_0x38802d, {
      'assetKinds': assetKinds,
      'chapterIds': _0x192c36,
      'requiredAssetNamesByKind': requiredAssetNamesByKind,
      'requiredAssetsByKind': requiredAssetsByKind,
      'candidateAssetsByKind': candidateAssetsByKind,
      'visualStyle': normalizeText(visualStyle) || _0x11d249['visualStyle']
    }) : parseStoryAssetExtractionResult(_0x38802d, {
      'chapterIds': _0x192c36,
      'allowedKinds': assetKinds,
      'allowEmptyResult': _0x4b4b83
    }),
    'outputContract': _0x4ec87e,
    'assetKinds': assetKinds,
    'chapterIds': _0x192c36,
    'onProgress': onProgress,
    'automaticRecovery': automaticRecovery
  });
}
export const extractStoryAssetsParallel = createParallelStoryAssetExtractor({
  'schemaVersion': STORY_ASSET_EXTRACTION_SCHEMA_VERSION,
  'assetKinds': STORY_ASSET_EXTRACTION_KINDS,
  'generateText': generateText,
  'normalizeText': normalizeText,
  'getResultText': getResultText,
  'normalizeStoryProjectInput': normalizeStoryProjectInput,
  'normalizeAssetReference': a158_0x4e1501,
  'parseStoryAssetExtractionResult': parseStoryAssetExtractionResult,
  'parseStoryAssetCompactExtractionResult': parseStoryAssetCompactExtractionResult,
  'extractStoryAssets': extractStoryAssets
});
export function buildStoryEpisodePlanningPrompt({
  project = {},
  assets = [],
  constraints = {}
} = {}) {
  const _0x4f59be = normalizeStoryProjectInput(project);
  assertStoryProjectInput(_0x4f59be);
  const _0x25e9aa = Array["isArray"](assets) ? assets["map"](normalizePlanningAssetSummary)["filter"](_0x19befb => _0x19befb["name"]) : [];
  if (!_0x25e9aa["length"]) {
    throw new Error("请先提取并确认角色、场景与道具资产。");
  }
  const _0x26fe33 = resolveStoryPlanningConstraints(project, constraints);
  const _0x5d95fd = _0x26fe33['episodeCount'];
  const _0x500f5b = Math["max"](0x1, Math['ceil'](_0x5d95fd * 0.9));
  return JSON["stringify"]({
    'task': "plan_story_episodes",
    'schemaVersion': STORY_PLANNING_SCHEMA_VERSION,
    'project': _0x4f59be,
    'assets': _0x25e9aa,
    'constraints': _0x26fe33,
    'requirements': ["目标规划约 " + _0x5d95fd + '\x20集，建议保持在\x20' + _0x500f5b + '-' + _0x5d95fd + " 集；不要求机械凑满，但不得超过 " + _0x5d95fd + " 集。", '先在内部完成全剧集数与主要剧情节点的分配，再输出分集；不得为了缩短输出而压缩中段或提前收束结局。', "只有故事容量确实不足时才可少于 " + _0x500f5b + " 集；模型输出限制不能作为大幅缩减集数的理由。", "后续每个视频片段的时长上限是 " + _0x26fe33['sceneMaxSeconds'] + " 秒；这不是整集时长限制。", '每集预计时长只能按该集必要剧情的自然表演时间估算；不设固定最低或最高集长，不得为接近某个秒数注水或删减必要剧情。', "覆盖完整故事起因、发展、高潮和结局，不遗漏结局。", "每集 sourceChapterIds 和 assetRefs 必须引用输入中真实存在的值。", '只规划分集，不生成\x20clips、分镜、镜头语言或视频提示词。'],
    'outputSchema': {
      'episodes': [{
        'ref': '本次规划中的唯一引用',
        'title': "分集标题",
        'synopsis': "本集完整剧情摘要",
        'sourceChapterIds': ["chapter id"],
        'assetRefs': ["asset ref"],
        'estimatedDurationSeconds': "可选；按本集必要剧情、对白、动作、反应和停顿自然估算的正数，不套固定集长"
      }]
    }
  });
}
export function parseStoryEpisodePlanningResult(_0x59f190, {
  constraints = {},
  chapterIds = [],
  assetRefs = []
} = {}) {
  const _0xa1ba02 = normalizeStoryPlanningConstraints(constraints);
  const _0x1198d3 = parseStrictJson(getResultText(_0x59f190), "Agent 未返回分集规划结果。");
  const _0x3858c1 = new Set(normalizeStringArray(chapterIds));
  const _0x118b77 = new Set(normalizeStringArray(assetRefs));
  const _0xd156c4 = Array["isArray"](_0x1198d3["episodes"]) ? _0x1198d3['episodes']["map"]((_0x564309, _0x5cd0f8) => {
    const _0x1a7949 = normalizeText(_0x564309?.['title']);
    const _0x315213 = normalizeText(_0x564309?.['synopsis']);
    if (!_0x1a7949 || !_0x315213) {
      return null;
    }
    const _0xa7e4f7 = normalizeStringArray(_0x564309?.["sourceChapterIds"]);
    const _0x348dc7 = normalizeStringArray(_0x564309?.['assetRefs']);
    if (_0x3858c1["size"]) {
      const _0x1b95fe = _0xa7e4f7["filter"](_0x5e6c46 => !_0x3858c1["has"](_0x5e6c46));
      if (_0x1b95fe["length"]) {
        throw new Error('分集“' + _0x1a7949 + "”引用了不存在的章节：" + _0x1b95fe["join"]('、') + '。');
      }
    }
    _0x118b77['size'] && assertKnownReferences(_0x348dc7, _0x118b77, '分集“' + _0x1a7949 + '”');
    const _0x8f5e8e = normalizePositiveNumber(_0x564309?.['estimatedDurationSeconds'] || _0x564309?.['durationSeconds']);
    return {
      'ref': a158_0x4e1501(_0x564309?.["ref"], 'episode-' + (_0x5cd0f8 + 0x1)),
      'title': _0x1a7949,
      'synopsis': _0x315213,
      'sourceChapterIds': _0xa7e4f7,
      'assetRefs': _0x348dc7,
      ...(_0x8f5e8e ? {
        'estimatedDurationSeconds': _0x8f5e8e
      } : {})
    };
  })['filter'](Boolean) : [];
  if (!_0xd156c4['length']) {
    throw new Error("Agent 返回结果没有可用分集。");
  }
  if (_0xd156c4["length"] > _0xa1ba02['episodeCount']) {
    throw new Error("Agent 返回了 " + _0xd156c4['length'] + '\x20集，超过\x20' + _0xa1ba02["episodeCount"] + " 集上限。");
  }
  const _0x3ab6e2 = _0xd156c4["map"](_0x3fc9ef => _0x3fc9ef['ref']);
  if (new Set(_0x3ab6e2)['size'] !== _0x3ab6e2["length"]) {
    throw new Error('Agent\x20返回了重复的分集引用。');
  }
  return {
    'schemaVersion': STORY_PLANNING_SCHEMA_VERSION,
    'constraints': _0xa1ba02,
    'episodes': _0xd156c4
  };
}
export async function planStoryEpisodes({
  project = {},
  assets = [],
  constraints = {},
  model = '',
  provider = '',
  providerProfileId = '',
  request = generateText,
  onProgress = null
} = {}) {
  assertPlanningModel(model, provider);
  const _0x310966 = normalizeStoryProjectInput(project);
  assertStoryProjectInput(_0x310966);
  const _0x265f6c = Array["isArray"](assets) ? assets["map"](normalizePlanningAssetSummary)['filter'](_0x126bc9 => _0x126bc9["name"]) : [];
  if (!_0x265f6c["length"]) {
    throw new Error("请先提取并确认角色、场景与道具资产。");
  }
  const _0x1336cd = resolveStoryPlanningConstraints(project, constraints);
  onProgress?.({
    'stage': "planning-episodes",
    'current': 0x1,
    'total': 0x1,
    'message': '正在规划分集'
  });
  const _0x35e1be = buildStoryEpisodePlanningPrompt({
    'project': _0x310966,
    'assets': _0x265f6c,
    'constraints': _0x1336cd
  });
  return await requestStrictResult({
    'request': request,
    'requestPayload': {
      'model': normalizeText(model),
      'provider': normalizeText(provider),
      ...buildStoryTextProviderProfilePayload(providerProfileId),
      'prompt': _0x35e1be,
      'systemPrompt': STORY_EPISODE_PLANNING_SYSTEM_PROMPT,
      'temperature': 0.35,
      'timeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
      'maxOutputTokens': STORY_TEXT_MAX_OUTPUT_TOKENS
    },
    'parse': _0xfc191e => parseStoryEpisodePlanningResult(_0xfc191e, {
      'constraints': _0x1336cd,
      'chapterIds': _0x310966["chapters"]["map"](_0xcb0bd9 => _0xcb0bd9['id']),
      'assetRefs': _0x265f6c["map"](_0xa380ce => _0xa380ce["ref"])
    }),
    'outputContract': "episodes (1-" + _0x1336cd["episodeCount"] + ") [{ref,title,synopsis,sourceChapterIds,assetRefs,estimatedDurationSeconds?}]"
  });
}
function buildStoryEpisodeSplitProjectContext(_0x500e36 = {}, _0x408b2b = {}, {
  sourceBeats = null
} = {}) {
  const _0x404092 = Array["isArray"](sourceBeats);
  const _0x3894f9 = new Set((Array['isArray'](sourceBeats) ? sourceBeats : [])["flatMap"](_0x5c07ea => normalizeStringArray(_0x5c07ea?.["characters"])));
  const _0x3ebb84 = (Array["isArray"](sourceBeats) ? sourceBeats : [])['flatMap'](_0x1e8fa3 => [_0x1e8fa3?.["heading"], _0x1e8fa3?.["body"]])["map"](normalizeText)["filter"](Boolean)["join"]('\x0a');
  return {
    'title': _0x408b2b["title"],
    'storyType': _0x408b2b['storyType'],
    'targetAudience': normalizeText(_0x500e36?.['targetAudience']),
    'summary': _0x408b2b["summary"],
    'background': _0x408b2b["background"],
    'setting': _0x408b2b["setting"],
    'coreHook': normalizeText(_0x500e36?.["coreHook"]),
    'logline': _0x408b2b["logline"],
    'scriptMode': _0x408b2b['scriptMode'],
    'aspectRatio': _0x408b2b["aspectRatio"],
    'visualStyle': _0x408b2b["visualStyle"],
    'characters': Array["isArray"](_0x500e36?.["characters"]) ? _0x500e36["characters"]["map"]((_0x203937, _0x598f46) => {
      const _0x5ac845 = normalizeStorySummaryCharacter(_0x203937, _0x598f46);
      if (!_0x5ac845) {
        return null;
      }
      if (_0x404092 && !_0x3894f9['has'](_0x5ac845["name"]) && !_0x3ebb84["includes"](_0x5ac845['name'])) {
        return null;
      }
      const _0xee8980 = {
        'ref': _0x5ac845['ref'],
        'name': _0x5ac845["name"],
        'roleType': _0x5ac845["roleType"]
      };
      return {
        ..._0xee8980,
        'coreTags': _0x5ac845["coreTags"],
        'profile': _0x5ac845["profile"],
        'motivation': _0x5ac845['motivation'],
        'relationships': _0x5ac845["relationships"],
        'personality': _0x5ac845["personality"],
        'arc': _0x5ac845["arc"]
      };
    })['filter'](Boolean) : [],
    'planning': _0x408b2b["planning"]
  };
}
function selectStoryEpisodeSplitAssets(_0x55a433 = [], _0x21ed74 = {}) {
  const _0xed2975 = (Array["isArray"](_0x55a433) ? _0x55a433 : [])["map"]((_0x1d9ffc, _0x598128) => ({
    'asset': _0x1d9ffc,
    'normalized': normalizePlanningAssetSummary(_0x1d9ffc, _0x598128)
  }))["filter"](({
    normalized: _0x29dedd
  }) => _0x29dedd["name"]);
  if (!_0xed2975["length"]) {
    return [];
  }
  const _0x3ca962 = new Set([...normalizeStringArray(_0x21ed74?.["assetRefs"]), ...normalizeStringArray(_0x21ed74?.['assetIds'])]['map'](_0x9151f9 => a158_0x4e1501(_0x9151f9, ''))['filter'](Boolean));
  const _0x10eb83 = new Set((Array["isArray"](_0x21ed74?.['script']?.["scenes"]) ? _0x21ed74["script"]["scenes"] : [])['map'](_0x54451e => a158_0x4e1501(_0x54451e?.["ref"] || _0x54451e?.['id'], ''))["filter"](Boolean));
  const _0x22ca16 = [_0x21ed74?.["title"], _0x21ed74?.["synopsis"], _0x21ed74?.["hook"], _0x21ed74?.['script']?.["fullText"], _0x21ed74?.['fullScript'], _0x21ed74?.["scriptText"], ...(Array["isArray"](_0x21ed74?.["script"]?.["scenes"]) ? _0x21ed74["script"]["scenes"]['flatMap'](_0x27e1b3 => [_0x27e1b3?.["heading"], ...(Array["isArray"](_0x27e1b3?.["characters"]) ? _0x27e1b3["characters"] : []), _0x27e1b3?.["body"]]) : [])]["map"](normalizeText)['filter'](Boolean)["join"]('\x0a');
  const _0x16dc55 = _0xed2975["filter"](({
    asset: _0x4d036f,
    normalized: _0x581396
  }) => {
    const _0x185196 = [_0x4d036f?.['ref'], _0x4d036f?.['planningRef'], _0x4d036f?.['id'], _0x581396["ref"]]["map"](_0x40f106 => a158_0x4e1501(_0x40f106, ''))["filter"](Boolean);
    return _0x185196['some'](_0x3490a6 => _0x3ca962["has"](_0x3490a6)) || _0x581396['name'] && _0x22ca16["includes"](_0x581396["name"]);
  });
  const _0x170edd = getStoryEpisodeReferenceAliases(_0x21ed74);
  const _0x261c46 = (_0x19e3a0, _0xf10b71) => normalizeStringArray([...normalizeStringArray(_0x19e3a0?.[_0xf10b71]), ...(Array['isArray'](_0x19e3a0?.["appearances"]) ? _0x19e3a0["appearances"]["flatMap"](_0xa1ecf5 => normalizeStringArray(_0xa1ecf5?.[_0xf10b71])) : [])]);
  const _0x2770d1 = _0xed2975["filter"](({
    normalized: _0x549541
  }) => _0x261c46(_0x549541, 'sourceSceneRefs')["some"](_0x440ce6 => [..._0x10eb83]["some"](_0x7e7213 => storyEpisodeSourceSceneRefsMatch(_0x440ce6, _0x7e7213, _0x170edd))));
  const _0x745ea4 = _0xed2975["filter"](({
    normalized: _0xf82139
  }) => _0x261c46(_0xf82139, 'sourceEpisodeRefs')["some"](_0x58d22a => _0x170edd['includes'](_0x58d22a)));
  const _0x3495c1 = new Set();
  return [..._0x16dc55, ..._0x2770d1, ..._0x745ea4]["map"](({
    normalized: _0x59d88f
  }) => _0x59d88f)["filter"](_0x56e363 => {
    if (_0x3495c1['has'](_0x56e363['ref'])) {
      return ![];
    }
    _0x3495c1["add"](_0x56e363["ref"]);
    return !![];
  });
}
function getStoryEpisodeReferenceAliases(_0x16d0d8 = {}) {
  return [...new Set([_0x16d0d8?.['id'], _0x16d0d8?.['ref'], _0x16d0d8?.['planningRef'], _0x16d0d8?.["script"]?.['episodeRef']]["map"](_0x5c47e0 => a158_0x4e1501(_0x5c47e0, ''))["filter"](Boolean))];
}
function storyEpisodeSourceSceneRefsMatch(_0x2493b1 = '', _0x5735bd = '', _0x2bda16 = []) {
  const _0x1fb742 = normalizeText(_0x2493b1);
  const _0x13f215 = normalizeText(_0x5735bd);
  if (!_0x1fb742 || !_0x13f215) {
    return ![];
  }
  if (_0x1fb742 === _0x13f215) {
    return !![];
  }
  const _0x5805e2 = normalizeStringArray(_0x2bda16);
  const _0x24a0da = _0x39389f => {
    for (const _0xe104f0 of _0x5805e2) {
      const _0x5db226 = _0xe104f0 + ':';
      if (_0x39389f["startsWith"](_0x5db226)) {
        return _0x39389f["slice"](_0x5db226["length"]);
      }
    }
    return _0x39389f;
  };
  return _0x24a0da(_0x1fb742) === _0x24a0da(_0x13f215);
}
function storyAssetMatchesEpisode(_0x2068e9 = {}, _0x482bbd = []) {
  const _0x5d559f = normalizeStringArray(_0x2068e9?.["sourceEpisodeRefs"]);
  if (!_0x5d559f["length"]) {
    return !![];
  }
  const _0x1b292d = new Set(normalizeStringArray(_0x482bbd));
  return _0x5d559f["some"](_0x3d1c44 => _0x1b292d["has"](_0x3d1c44));
}
function getStoryEpisodeSceneAssetCandidates(_0x32f2c9 = {}, _0x314eb5 = [], {
  episodeRefs = []
} = {}) {
  return (Array["isArray"](_0x314eb5) ? _0x314eb5 : [])["filter"](_0xfcef0d => {
    if (_0xfcef0d?.["kind"] !== "scene") {
      return ![];
    }
    if (!storyAssetMatchesEpisode(_0xfcef0d, episodeRefs)) {
      return ![];
    }
    const _0xfebcd8 = normalizeStringArray(_0xfcef0d?.["sourceSceneRefs"]);
    return _0xfebcd8["some"](_0x5a6c0 => storyEpisodeSourceSceneRefsMatch(_0x5a6c0, _0x32f2c9?.["ref"], episodeRefs));
  });
}
function getStoryEpisodeBlueprintSceneAssetRefs(_0x442810 = [], _0x3b8170 = [], _0x2f7ff0 = [], {
  episodeRefs = []
} = {}) {
  const _0x5aff21 = new Map((Array["isArray"](_0x3b8170) ? _0x3b8170 : [])['map'](_0x53e76c => [normalizeText(_0x53e76c?.["ref"]), _0x53e76c]));
  const _0x5dcb49 = new Map();
  normalizeStringArray(_0x442810)["forEach"](_0x423ff6 => {
    const _0x1eff96 = getStoryEpisodeSceneAssetCandidates(_0x5aff21["get"](_0x423ff6), _0x2f7ff0, {
      'episodeRefs': episodeRefs
    });
    _0x1eff96['length'] === 0x1 && _0x5dcb49["set"](_0x423ff6, normalizeText(_0x1eff96[0x0]?.["ref"]));
  });
  return _0x5dcb49;
}
function assertStoryEpisodeSceneAssetCoverage(_0x5025ca = [], _0xb2dd6 = [], {
  episodeRefs = []
} = {}) {
  const _0x82a1cb = (Array["isArray"](_0xb2dd6) ? _0xb2dd6 : [])["filter"](_0x1725fb => _0x1725fb?.["kind"] === "scene");
  if (!_0x82a1cb['some'](_0x77134f => normalizeStringArray(_0x77134f?.['sourceSceneRefs'])["length"])) {
    return;
  }
  const _0x570d3a = _0x5025ca["filter"](_0x1bcffb => !getStoryEpisodeSceneAssetCandidates(_0x1bcffb, _0x82a1cb, {
    'episodeRefs': episodeRefs
  })["length"]);
  if (_0x570d3a['length']) {
    const _0x41de69 = _0x570d3a["map"](_0xfcd699 => normalizeStorySceneHeadingIdentity(_0xfcd699?.['heading']) || normalizeText(_0xfcd699?.["heading"]))["filter"](Boolean)["join"]('、');
    throw new Error("场景资产未完整覆盖当前分集正文：" + (_0x41de69 || "存在未绑定场景") + "。请先重新提取场景资产；本次未调用模型。");
  }
  const _0x1dfc96 = _0x5025ca["filter"](_0x80a573 => getStoryEpisodeSceneAssetCandidates(_0x80a573, _0x82a1cb, {
    'episodeRefs': episodeRefs
  })["length"] > 0x1);
  if (_0x1dfc96["length"]) {
    const _0x5e1ba4 = _0x1dfc96['map'](_0x517989 => normalizeStorySceneHeadingIdentity(_0x517989?.["heading"]) || normalizeText(_0x517989?.["heading"]))['filter'](Boolean)["join"]('、');
    throw new Error("场景资产存在重复绑定：" + (_0x5e1ba4 || '存在多重绑定场景') + "。请先重新提取场景资产；本次未调用模型。");
  }
}
function normalizeStoryEpisodeSplitContinuityEpisode(_0x219ff1 = null, {
  includeEnding = ![]
} = {}) {
  if (!_0x219ff1 || typeof _0x219ff1 !== 'object') {
    return null;
  }
  const _0x4aa2c6 = Array["isArray"](_0x219ff1?.["script"]?.["scenes"]) ? _0x219ff1["script"]["scenes"] : [];
  const _0x152f14 = _0x4aa2c6['at'](-0x1);
  const _0x50eff2 = normalizeText(_0x219ff1?.["script"]?.["fullText"] || _0x219ff1?.["fullScript"] || _0x219ff1?.["scriptText"]);
  return {
    'number': Math["max"](0x1, Math["trunc"](Number(_0x219ff1?.["number"]) || 0x1)),
    'title': normalizeText(_0x219ff1?.["title"]),
    'synopsis': normalizeText(_0x219ff1?.['synopsis']),
    'hook': normalizeText(_0x219ff1?.["hook"]),
    ...(includeEnding && _0x152f14 ? {
      'endingScene': {
        'heading': normalizeText(_0x152f14?.['heading']),
        'characters': normalizeStringArray(_0x152f14?.['characters']),
        'body': normalizeText(_0x152f14?.["body"])
      }
    } : includeEnding && _0x50eff2 ? {
      'endingExcerpt': _0x50eff2["slice"](-0x4b0)
    } : {})
  };
}
function normalizeStoryEpisodeClipDurationConstraints(_0x2e68c0 = null) {
  if (!_0x2e68c0 || typeof _0x2e68c0 !== "object") {
    return null;
  }
  const _0x1efcd3 = [...new Set((Array["isArray"](_0x2e68c0["allowedSeconds"]) ? _0x2e68c0["allowedSeconds"] : [])["map"](_0x3d518d => normalizePositiveNumber(_0x3d518d))["filter"](Boolean))]['sort']((_0x1d54e5, _0x4a3efb) => _0x1d54e5 - _0x4a3efb);
  const _0x4090ce = normalizePositiveNumber(_0x2e68c0['minSeconds']) || _0x1efcd3[0x0] || 0x0;
  const _0x2383d0 = normalizePositiveNumber(_0x2e68c0['maxSeconds']) || _0x1efcd3['at'](-0x1) || 0x0;
  const _0x15a7b2 = normalizePositiveNumber(_0x2e68c0['stepSeconds']) || 0x0;
  if (!_0x4090ce && !_0x2383d0 && !_0x15a7b2 && !_0x1efcd3['length']) {
    return null;
  }
  return {
    'minSeconds': _0x4090ce,
    'maxSeconds': _0x2383d0,
    'stepSeconds': _0x15a7b2,
    'allowedSeconds': _0x1efcd3
  };
}
export function buildStoryEpisodeSplitPrompt({
  project = {},
  episode = {},
  assets = [],
  constraints = {}
} = {}) {
  const _0x51bd06 = normalizeStoryProjectInput(project);
  const _0x4a5d02 = getStoryEpisodeSplitSourceSceneMetadata(episode);
  const _0xd9b36d = {
    'ref': a158_0x4e1501(episode?.["ref"] || episode?.["planningRef"] || episode?.['id'], "episode-1"),
    'title': normalizeText(episode?.["title"]),
    'text': sanitizeStoryEpisodeSplitPromptText(episode?.['script']?.["fullText"] || episode?.["fullScript"] || episode?.["scriptText"] || episode?.["synopsis"] || episode?.["content"], episode),
    ...(_0x4a5d02["length"] ? {
      'sourceScenes': _0x4a5d02
    } : {})
  };
  if (!_0xd9b36d["title"] || !_0xd9b36d["text"]) {
    throw new Error("分集缺少标题或正文，无法生成分镜脚本。");
  }
  const _0x757231 = selectStoryEpisodeSplitAssets(assets, episode);
  if (!_0x757231["some"](_0x2e6e42 => _0x2e6e42["kind"] === "scene")) {
    throw new Error("分集缺少可用的场景资产，无法生成必需的片段场景设定。");
  }
  const _0x55d94d = resolveStoryPlanningConstraints(project, constraints);
  const _0x59530d = resolveStoryPromptMode(project, constraints);
  const _0xe189e5 = resolveStoryPromptModeClipMaxSeconds(_0x59530d, _0x55d94d['sceneMaxSeconds']);
  const _0x472085 = createStoryEpisodeSplitPromptSceneCatalog(_0x757231, _0x59530d);
  const _0x565642 = "每个 clip 的 shots 总时长不超过用户设置的 " + _0xe189e5 + '\x20秒。';
  return JSON["stringify"]({
    'task': "format_story_episode_as_compact_json",
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'scriptMode': _0x51bd06["scriptMode"],
    ...(_0x59530d !== "seedance-2.0" ? {
      'promptMode': _0x59530d
    } : {}),
    'episode': _0xd9b36d,
    ...(episode["replication"]?.["sourceAnalysis"] ? {
      'sourceVideoEvidence': buildVideoReplicationSourceEvidence(episode, project, assets)
    } : {}),
    'assets': _0x757231["map"](_0x3da272 => compactStoryEpisodePromptAsset(_0x3da272)),
    'scenes': _0x472085,
    'constraints': {
      'clipMaxSeconds': _0xe189e5
    },
    'requirements': [_0x565642, ...[buildVideoReplicationTimingGuidance(episode)]["filter"](Boolean), "完整覆盖正文从开头到结尾，对白逐字保留，原剧本明确标注的旁白也逐字保留，并保持剧情事件、因果、人物关系和结尾。整集总时长、片段数量与每片段的镜头数量由正文实际结构决定。" + STORY_EPISODE_SPLIT_GROUPING_GUIDANCE, STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE, 'assets\x20只包含本集已确认出场的角色、场景和道具；仅在当前镜头实际可见时使用对应资产，不得调用或编造其他集资产。', '' + STORY_EPISODE_SPLIT_VISUAL_GUIDANCE + STORY_EPISODE_SPLIT_CAMERA_GUIDANCE + "a 记录与当前画面同步的环境声、动作声和表演声。", _0x51bd06["scriptMode"] === STORY_SCRIPT_MODE_NARRATION ? STORY_EPISODE_SPLIT_NARRATION_MODE_GUIDANCE : STORY_EPISODE_SPLIT_PLOT_MODE_GUIDANCE, ...getStoryEpisodeTimelinePlanningRequirements(_0x59530d)],
    'outputFormat': isStoryContinuousTimelinePromptMode(_0x59530d) ? '{\x22clips\x22:[{\x22s\x22:\x22sceneCode\x22,\x22shots\x22:[{\x22d\x22:integerSeconds,\x22startSec\x22:0,\x22endSec\x22:integerSeconds,\x22v\x22:\x22visual\x22,\x22c\x22:\x22camera\x22,\x22q\x22:\x22dialogueOrEmpty\x22,\x22o\x22:\x22voiceoverOrEmpty\x22,\x22a\x22:\x22audioOrEmpty\x22},{\x22d\x22:integerSeconds,\x22startSec\x22:previousEndSec,\x22endSec\x22:integerSeconds,\x22v\x22:\x22nextVisual\x22,\x22c\x22:\x22nextCamera\x22,\x22q\x22:\x22dialogueOrEmpty\x22,\x22o\x22:\x22voiceoverOrEmpty\x22,\x22a\x22:\x22audioOrEmpty\x22}]}]}' : "{\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":seconds,\"v\":\"visual\",\"c\":\"camera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"},{\"d\":seconds,\"v\":\"nextVisual\",\"c\":\"nextCamera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}"
  });
}
function buildStoryEpisodeMinimalSplitPrompt({
  project = {},
  episode = {},
  assets = [],
  constraints = {}
} = {}) {
  const _0x14a919 = normalizeStoryProjectInput(project);
  const _0x164d5b = resolveStoryPlanningConstraints(project, constraints);
  const _0x55c5cc = resolveStoryPromptMode(project, constraints);
  const _0x2f4938 = resolveStoryPromptModeClipMaxSeconds(_0x55c5cc, _0x164d5b['sceneMaxSeconds']);
  const _0x125a2c = a158_0x4e1501(episode?.["ref"] || episode?.["planningRef"] || episode?.['id'], "episode-1");
  const _0x2b00b4 = normalizeText(episode?.['title']) || '本集';
  const _0x7c3ee4 = sanitizeStoryEpisodeSplitPromptText(episode?.['script']?.["fullText"] || episode?.['fullScript'] || episode?.["scriptText"] || episode?.["synopsis"] || episode?.["content"], episode);
  if (!_0x7c3ee4) {
    throw new Error("分集缺少正文，无法生成分镜脚本。");
  }
  const _0x476011 = selectStoryEpisodeSplitAssets(assets, episode);
  const _0x195849 = createStoryEpisodeSplitPromptSceneCatalog(_0x476011, _0x55c5cc);
  if (!_0x195849["length"]) {
    throw new Error("分集缺少可用的场景资产，无法生成分镜脚本。");
  }
  return JSON["stringify"]({
    'task': "split_story_episode",
    ...(episode['replication']?.["sourceAnalysis"] ? {
      'sourceVideoEvidence': buildVideoReplicationSourceEvidence(episode, project, assets)
    } : {}),
    'scriptMode': _0x14a919["scriptMode"],
    ...(_0x55c5cc !== "seedance-2.0" ? {
      'promptMode': _0x55c5cc
    } : {}),
    'episode': {
      'ref': _0x125a2c,
      'title': _0x2b00b4,
      'text': _0x7c3ee4,
      'scenes': _0x195849
    },
    'assets': _0x476011["map"](_0x5e9a54 => compactStoryEpisodePromptAsset(_0x5e9a54)),
    'clipMaxSeconds': _0x2f4938,
    'instruction': [...[buildVideoReplicationTimingGuidance(episode)]["filter"](Boolean), "按正文顺序完整拆分，场景变化时切换 s，原对白放 q。" + (_0x14a919["scriptMode"] === STORY_SCRIPT_MODE_NARRATION ? STORY_EPISODE_SPLIT_NARRATION_MODE_GUIDANCE : STORY_EPISODE_SPLIT_PLOT_MODE_GUIDANCE) + STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE + STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE + STORY_EPISODE_SPLIT_GROUPING_GUIDANCE + STORY_EPISODE_SPLIT_VISUAL_GUIDANCE + STORY_EPISODE_SPLIT_CAMERA_GUIDANCE, 'assets\x20只包含本集已确认出场的角色、场景和道具；不得调用或编造其他集资产。', ...getStoryEpisodeTimelinePlanningRequirements(_0x55c5cc)]["join"]('\x0a'),
    'output': isStoryContinuousTimelinePromptMode(_0x55c5cc) ? "{\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":integerSeconds,\"startSec\":0,\"endSec\":integerSeconds,\"v\":\"cameraVisibleAction\",\"c\":\"cameraViewAndMovement\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"},{\"d\":integerSeconds,\"startSec\":previousEndSec,\"endSec\":integerSeconds,\"v\":\"nextCameraVisibleAction\",\"c\":\"nextCameraViewAndMovement\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}" : "{\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":seconds,\"v\":\"cameraVisibleAction\",\"c\":\"cameraViewAndMovement\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"},{\"d\":seconds,\"v\":\"nextCameraVisibleAction\",\"c\":\"nextCameraViewAndMovement\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}"
  });
}
export function buildStoryEpisodesSplitPrompt({
  project = {},
  episodes = [],
  assets = [],
  constraints = {}
} = {}) {
  const _0x395737 = normalizeStoryProjectInput(project);
  const _0x171fac = resolveStoryPlanningConstraints(project, constraints);
  const _0x2e5259 = resolveStoryPromptMode(project, constraints);
  const _0x5a3f02 = resolveStoryPromptModeClipMaxSeconds(_0x2e5259, _0x171fac["sceneMaxSeconds"]);
  const _0x294fe3 = (Array["isArray"](episodes) ? episodes : [])['map']((_0x2447b5, _0x16525d) => {
    const _0x479ccb = a158_0x4e1501(_0x2447b5?.["ref"] || _0x2447b5?.['planningRef'] || _0x2447b5?.['id'], "episode-" + (_0x16525d + 0x1));
    const _0x204de3 = normalizeText(_0x2447b5?.["title"]) || '第\x20' + (_0x16525d + 0x1) + '\x20集';
    const _0x18d9f3 = sanitizeStoryEpisodeSplitPromptText(_0x2447b5?.["script"]?.["fullText"] || _0x2447b5?.['fullScript'] || _0x2447b5?.['scriptText'] || _0x2447b5?.["synopsis"] || _0x2447b5?.['content'], _0x2447b5);
    if (!_0x18d9f3) {
      throw new Error('第\x20' + (_0x16525d + 0x1) + " 集缺少正文，无法生成分镜脚本。");
    }
    const _0x7092c8 = selectStoryEpisodeSplitAssets(assets, _0x2447b5);
    const _0x474e72 = createStoryEpisodeSplitPromptSceneCatalog(_0x7092c8, _0x2e5259);
    if (!_0x474e72["length"]) {
      throw new Error('第\x20' + (_0x16525d + 0x1) + " 集缺少可用的场景资产，无法生成分镜脚本。");
    }
    return {
      'ref': _0x479ccb,
      'title': _0x204de3,
      'text': _0x18d9f3,
      'assets': _0x7092c8["map"](_0x5e7a30 => compactStoryEpisodePromptAsset(_0x5e7a30)),
      'scenes': _0x474e72,
      ...(_0x2447b5['replication']?.["sourceAnalysis"] ? {
        'sourceVideoEvidence': buildVideoReplicationSourceEvidence(_0x2447b5, project, assets)
      } : {})
    };
  });
  if (!_0x294fe3['length']) {
    throw new Error("没有可生成分镜的分集。");
  }
  return JSON["stringify"]({
    'task': 'split_story_episodes',
    'scriptMode': _0x395737["scriptMode"],
    ...(_0x2e5259 !== "seedance-2.0" ? {
      'promptMode': _0x2e5259
    } : {}),
    'episodes': _0x294fe3,
    'clipMaxSeconds': _0x5a3f02,
    'instruction': ["按正文顺序完整拆分，场景变化时切换 s，原对白放 q。" + (_0x395737["scriptMode"] === STORY_SCRIPT_MODE_NARRATION ? STORY_EPISODE_SPLIT_NARRATION_MODE_GUIDANCE : STORY_EPISODE_SPLIT_PLOT_MODE_GUIDANCE) + STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE + STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE + STORY_EPISODE_SPLIT_GROUPING_GUIDANCE + STORY_EPISODE_SPLIT_VISUAL_GUIDANCE + STORY_EPISODE_SPLIT_CAMERA_GUIDANCE, "每个 episode.assets 只包含该集已确认出场的角色、场景和道具；不得跨集调用资产。", ...getStoryEpisodeTimelinePlanningRequirements(_0x2e5259)]["join"]('\x0a'),
    'output': isStoryContinuousTimelinePromptMode(_0x2e5259) ? "{\"episodes\":[{\"episodeRef\":\"episodeRef\",\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":integerSeconds,\"startSec\":0,\"endSec\":integerSeconds,\"v\":\"cameraVisibleAction\",\"c\":\"cameraViewAndMovement\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"},{\"d\":integerSeconds,\"startSec\":previousEndSec,\"endSec\":integerSeconds,\"v\":\"nextCameraVisibleAction\",\"c\":\"nextCameraViewAndMovement\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}]}" : '{\x22episodes\x22:[{\x22episodeRef\x22:\x22episodeRef\x22,\x22clips\x22:[{\x22s\x22:\x22sceneCode\x22,\x22shots\x22:[{\x22d\x22:seconds,\x22v\x22:\x22cameraVisibleAction\x22,\x22c\x22:\x22cameraViewAndMovement\x22,\x22q\x22:\x22dialogueOrEmpty\x22,\x22o\x22:\x22voiceoverOrEmpty\x22,\x22a\x22:\x22audioOrEmpty\x22},{\x22d\x22:seconds,\x22v\x22:\x22nextCameraVisibleAction\x22,\x22c\x22:\x22nextCameraViewAndMovement\x22,\x22q\x22:\x22dialogueOrEmpty\x22,\x22o\x22:\x22voiceoverOrEmpty\x22,\x22a\x22:\x22audioOrEmpty\x22}]}]}]}'
  });
}
function buildStoryEpisodesSplitValidationPrompt({
  episodeRefs = [],
  result = '',
  promptMode = 'seedance-2.0'
} = {}) {
  return ['任务：检查下面的批量分镜返回，并修复\x20JSON\x20语法、外层包装或字段名称。', "必须完整保留已有剧集、片段以及每个镜头原本所属的 clip，只修复格式，不改变 shots 数量或归属；不要重新创作。", "剧集引用：" + normalizeStringArray(episodeRefs)["join"]('、'), isStoryContinuousTimelinePromptMode(promptMode) ? "必须保留每个 shot 的 startSec、endSec 和 d，只修复字段包装；不得删除或重算时间轴。" : '', isStoryContinuousTimelinePromptMode(promptMode) ? "返回格式：{\"episodes\":[{\"episodeRef\":\"episodeRef\",\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":integerSeconds,\"startSec\":0,\"endSec\":integerSeconds,\"v\":\"visual\",\"c\":\"camera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}]}。" : "返回格式：{\"episodes\":[{\"episodeRef\":\"episodeRef\",\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":seconds,\"v\":\"visual\",\"c\":\"camera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"},{\"d\":seconds,\"v\":\"nextVisual\",\"c\":\"nextCamera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}]}。示意中的两个 shot 只说明同一 clip 可以承载连续镜头，不代表固定数量。", "待检查结果：", String(result || '')]["join"]('\x0a');
}
function buildStoryEpisodeSplitValidationPrompt({
  episodeRef = '',
  result = '',
  promptMode = "seedance-2.0"
} = {}) {
  return ["任务：检查下面这一集的分镜返回，并修复 JSON 语法、外层包装或字段名称。", "必须完整保留已有片段以及每个镜头原本所属的 clip，只修复格式，不改变 shots 数量或归属；不要重新创作。", '剧集引用：' + normalizeText(episodeRef), isStoryContinuousTimelinePromptMode(promptMode) ? '必须保留每个\x20shot\x20的\x20startSec、endSec\x20和\x20d，只修复字段包装；不得删除或重算时间轴。' : '', isStoryContinuousTimelinePromptMode(promptMode) ? "返回格式：{\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":integerSeconds,\"startSec\":0,\"endSec\":integerSeconds,\"v\":\"visual\",\"c\":\"camera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}。" : "返回格式：{\"clips\":[{\"s\":\"sceneCode\",\"shots\":[{\"d\":seconds,\"v\":\"visual\",\"c\":\"camera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"},{\"d\":seconds,\"v\":\"nextVisual\",\"c\":\"nextCamera\",\"q\":\"dialogueOrEmpty\",\"o\":\"voiceoverOrEmpty\",\"a\":\"audioOrEmpty\"}]}]}。示意中的两个 shot 只说明同一 clip 可以承载连续镜头，不代表固定数量。", '待检查结果：', String(result || '')]['join']('\x0a');
}
function normalizeStoryEpisodeSplitSourceScenes(_0x497d9a = {}) {
  const _0x432051 = getStoryEpisodeReferenceAliases(_0x497d9a)[0x0] || "episode-1";
  const _0x2bdbdd = (Array["isArray"](_0x497d9a?.["script"]?.["scenes"]) ? _0x497d9a["script"]['scenes'] : [])["map"]((_0x1c433f, _0x13579c) => ({
    'ref': a158_0x4e1501(_0x1c433f?.["ref"] || _0x1c433f?.['id'], _0x432051 + "-scene-" + (_0x13579c + 0x1)),
    'heading': normalizeText(_0x1c433f?.["heading"]),
    'characters': normalizeStringArray(_0x1c433f?.["characters"]),
    'body': normalizeText(_0x1c433f?.["body"])
  }))['filter'](_0x18e13f => _0x18e13f["heading"] || _0x18e13f["body"]);
  if (_0x2bdbdd['length']) {
    return _0x2bdbdd;
  }
  const _0x2a6fc4 = normalizeText(_0x497d9a?.["script"]?.["fullText"] || _0x497d9a?.["fullScript"] || _0x497d9a?.["scriptText"] || _0x497d9a?.["synopsis"] || _0x497d9a?.['content']);
  return splitStorySourceText(_0x2a6fc4, 0xfa0)["map"]((_0x1c5cc6, _0x3af092) => ({
    'ref': _0x432051 + "-source-section-" + (_0x3af092 + 0x1),
    'heading': (normalizeText(_0x497d9a?.["title"]) || '本集') + "·文本段" + (_0x3af092 + 0x1),
    'characters': [],
    'body': _0x1c5cc6
  }));
}
function splitStoryEpisodeSourceBeatLine(_0x49b580 = '', _0x5050a1 = 0xf0) {
  const _0x4b43a7 = normalizeText(_0x49b580);
  if (!_0x4b43a7) {
    return [];
  }
  const _0x5da4a6 = Math["max"](0x50, Math["trunc"](Number(_0x5050a1) || 0xf0));
  if (_0x4b43a7["length"] <= _0x5da4a6) {
    return [_0x4b43a7];
  }
  const _0x4c0833 = _0x4b43a7['match'](/^[^：:\r\n]{1,24}[：:]\s*/u)?.[0x0] || '';
  const _0x1d4d3b = [];
  let _0x295ace = _0x4c0833 ? _0x4b43a7["slice"](_0x4c0833['length'])["trim"]() : _0x4b43a7;
  const _0x4ff9c7 = Math["max"](0x3c, _0x5da4a6 - _0x4c0833["length"]);
  while (_0x295ace["length"] > _0x4ff9c7) {
    const _0x26fdde = _0x295ace["slice"](0x0, _0x4ff9c7 + 0x1);
    const _0x33c7b7 = [..._0x26fdde["matchAll"](/[。！？；.!?;]/gu)];
    const _0x3afa2a = _0x33c7b7['map'](_0x3bc0ba => Number(_0x3bc0ba["index"]) + 0x1)["filter"](_0x3b3f91 => _0x3b3f91 >= Math["floor"](_0x4ff9c7 * 0.45) && _0x3b3f91 <= _0x4ff9c7)['at'](-0x1);
    const _0x1d038c = _0x3afa2a || _0x4ff9c7;
    _0x1d4d3b["push"]('' + _0x4c0833 + _0x295ace["slice"](0x0, _0x1d038c)["trim"]());
    _0x295ace = _0x295ace["slice"](_0x1d038c)["trim"]();
  }
  if (_0x295ace) {
    _0x1d4d3b["push"]('' + _0x4c0833 + _0x295ace);
  }
  return _0x1d4d3b['filter'](Boolean);
}
function extractStoryEpisodeDialogueUnits(_0x1c7afc = '', _0x41c924 = 'source-beat', _0x1b6e93 = []) {
  const _0xa4bd6d = [];
  const _0x151d14 = normalizeStringArray(_0x1b6e93);
  const _0x1f22f6 = new Set(['旁白', "出场人物", '人物', '时间', '地点', '场景', '音效']);
  String(_0x1c7afc || '')['split'](/\r?\n/u)["forEach"](_0x44d915 => {
    const _0x147649 = _0x44d915["trim"]();
    if (!_0x147649) {
      return;
    }
    const _0x1b4364 = _0x147649["match"](/^([^：:\n]{1,20})[：:]\s*(.+)$/u);
    const _0x339247 = normalizeText(_0x1b4364?.[0x1])["replace"](/\s*[（(][^）)]*[）)]\s*$/u, '');
    const _0xda50a = _0x147649["search"](/[“「『"]/u);
    const _0x1f5905 = _0xda50a >= 0x0 ? _0x147649['slice'](0x0, _0xda50a) : '';
    const _0x2e139f = _0x151d14["filter"](_0x36e551 => _0x36e551 && _0x1f5905["includes"](_0x36e551));
    const _0x1ff78f = _0x151d14['includes'](_0x339247) ? _0x339247 : _0x2e139f["length"] === 0x1 ? _0x2e139f[0x0] : _0x339247 && !_0x1f22f6["has"](_0x339247) && !/(?:说道|问道|答道|喊道|叫道|叫住[他她]|开口|低声道|高声道|轻声道|冷声道|厉声道|喃喃道|嘀咕道)$/u["test"](_0x339247) ? _0x339247 : '';
    const _0x574be2 = [];
    const _0x186a8f = /“([^”\n]+)”|「([^」\n]+)」|『([^』\n]+)』|"([^"\n]+)"/gu;
    for (const _0x2816b7 of _0x147649["matchAll"](_0x186a8f)) {
      const _0x23ca95 = normalizeText(_0x2816b7[0x1] || _0x2816b7[0x2] || _0x2816b7[0x3] || _0x2816b7[0x4]);
      if (_0x23ca95) {
        _0x574be2["push"]({
          'text': _0x23ca95,
          'sourceOffset': Number(_0x2816b7['index']) || 0x0
        });
      }
    }
    if (_0x574be2['length']) {
      _0xa4bd6d["push"](..._0x574be2["map"](_0x4f41f5 => ({
        ..._0x4f41f5,
        ...(_0x1ff78f ? {
          'speaker': _0x1ff78f
        } : {})
      })));
      return;
    }
    if (!_0x1b4364) {
      return;
    }
    const _0x49f0e7 = _0x1ff78f;
    const _0x39d9a8 = normalizeText(_0x1b4364[0x2])['replace'](/^(?:(?:（[^）]*）|\([^)]*\))\s*)+/u, '')['trim']();
    if (!_0x49f0e7 || !_0x39d9a8 || _0x1f22f6["has"](_0x49f0e7)) {
      return;
    }
    _0xa4bd6d["push"]({
      'speaker': _0x49f0e7,
      'text': _0x39d9a8,
      'sourceOffset': 0x0
    });
  });
  return _0xa4bd6d["map"]((_0x5c5393, _0x102cbd) => ({
    'ref': _0x41c924 + "-dialogue-" + (_0x102cbd + 0x1),
    ...(_0x5c5393['speaker'] ? {
      'speaker': _0x5c5393["speaker"]
    } : {}),
    'text': _0x5c5393['text']
  }));
}
function createStoryEpisodeSourceBeat({
  ref = '',
  sourceSceneRef = '',
  order = 0x0,
  heading = '',
  characters = [],
  body = ''
} = {}) {
  const _0x4a054 = normalizeText(ref);
  const _0x2d1d11 = normalizeText(body);
  return {
    'ref': _0x4a054,
    'sourceSceneRef': sourceSceneRef,
    'order': order,
    'heading': heading,
    'characters': characters,
    'body': _0x2d1d11,
    'dialogueUnits': extractStoryEpisodeDialogueUnits(_0x2d1d11, _0x4a054, characters)
  };
}
export function normalizeStoryEpisodeSplitSourceBeats(_0x38f64c = {}) {
  const _0x5a67f3 = normalizeStoryEpisodeSplitSourceScenes(_0x38f64c);
  const _0x189f55 = [];
  _0x5a67f3['forEach'](_0x10e85a => {
    const _0xe077cd = normalizeText(_0x10e85a["body"])['split'](/\r?\n/u)["map"](normalizeText)["filter"](Boolean)["flatMap"](_0x48e5f2 => splitStoryEpisodeSourceBeatLine(_0x48e5f2));
    const _0x24923b = _0xe077cd["length"] ? _0xe077cd : [normalizeText(_0x10e85a["heading"])]["filter"](Boolean);
    _0x24923b["forEach"]((_0x1e29a5, _0x21cc05) => {
      _0x189f55['push'](createStoryEpisodeSourceBeat({
        'ref': _0x10e85a["ref"] + '-beat-' + (_0x21cc05 + 0x1),
        'sourceSceneRef': _0x10e85a["ref"],
        'order': _0x189f55["length"] + 0x1,
        'heading': _0x10e85a['heading'],
        'characters': _0x10e85a["characters"],
        'body': _0x1e29a5
      }));
    });
  });
  if (!_0x189f55["length"]) {
    throw new Error("实验分批拆分没有找到可用的原文块。");
  }
  const _0x1de66f = _0x189f55['map'](_0x520e42 => _0x520e42['ref']);
  if (new Set(_0x1de66f)["size"] !== _0x1de66f['length']) {
    throw new Error("实验分批拆分生成了重复的原文块引用。");
  }
  return _0x189f55;
}
export function normalizeStoryEpisodeExperimentalSourceBeats(_0x2901e2 = {}) {
  const _0x3cb27a = normalizeStoryEpisodeSplitSourceBeats(_0x2901e2);
  if (_0x3cb27a['length'] <= STORY_EPISODE_EXPERIMENTAL_MAX_PLANS_PER_BATCH * 0x2) {
    return _0x3cb27a;
  }
  const _0x34131c = normalizeStoryEpisodeSplitSourceScenes(_0x2901e2);
  const _0x475e21 = [];
  _0x34131c["forEach"](_0x9173d1 => {
    const _0x3bbd12 = normalizeText(_0x9173d1["body"])["split"](/\r?\n/u)["map"](normalizeText)["filter"](Boolean)["flatMap"](_0x20ce82 => splitStoryEpisodeSourceBeatLine(_0x20ce82, STORY_EPISODE_EXPERIMENTAL_SOURCE_BEAT_MAX_CHARACTERS));
    const _0x20a279 = _0x3bbd12['length'] ? _0x3bbd12 : [normalizeText(_0x9173d1["heading"])]['filter'](Boolean);
    let _0xeb61cb = [];
    let _0x589a45 = 0x0;
    const _0x4a4ae6 = () => {
      if (!_0xeb61cb['length']) {
        return;
      }
      const _0x230ef4 = _0x475e21['filter'](_0x3d17c0 => _0x3d17c0["sourceSceneRef"] === _0x9173d1["ref"])["length"] + 0x1;
      const _0x3f7e2b = _0x9173d1["ref"] + "-semantic-beat-" + _0x230ef4;
      _0x475e21["push"](createStoryEpisodeSourceBeat({
        'ref': _0x3f7e2b,
        'sourceSceneRef': _0x9173d1["ref"],
        'order': _0x475e21['length'] + 0x1,
        'heading': _0x9173d1["heading"],
        'characters': _0x9173d1["characters"],
        'body': _0xeb61cb["join"]('\x0a')
      }));
      _0xeb61cb = [];
      _0x589a45 = 0x0;
    };
    _0x20a279["forEach"](_0x468449 => {
      const _0xe02b47 = _0x589a45 + (_0xeb61cb["length"] ? 0x1 : 0x0) + _0x468449['length'];
      _0xeb61cb['length'] && _0xe02b47 > STORY_EPISODE_EXPERIMENTAL_SOURCE_BEAT_MAX_CHARACTERS && _0x4a4ae6();
      _0xeb61cb['push'](_0x468449);
      _0x589a45 += (_0xeb61cb["length"] > 0x1 ? 0x1 : 0x0) + _0x468449["length"];
      _0x589a45 >= STORY_EPISODE_EXPERIMENTAL_SOURCE_BEAT_TARGET_CHARACTERS && _0x4a4ae6();
    });
    _0x4a4ae6();
  });
  if (!_0x475e21['length']) {
    throw new Error("实验分批拆分没有找到可用的语义原文块。");
  }
  return _0x475e21;
}
function normalizeStoryEpisodeSplitBlueprintAssetRefs(_0x29de9f, {
  assetsByRef = new Map(),
  kind = '',
  label = "片段计划"
} = {}) {
  return normalizeStringArray(_0x29de9f)["map"](_0x22f0a2 => {
    const _0x439389 = assetsByRef["get"](_0x22f0a2);
    if (!_0x439389 || kind && _0x439389["kind"] !== kind) {
      throw new Error(label + " 引用了无效的" + (kind === "character" ? '角色' : kind === "prop" ? '道具' : '') + "资产“" + _0x22f0a2 + '”。');
    }
    return _0x22f0a2;
  });
}
export function parseStoryEpisodeSplitBlueprint(_0x573f50, {
  episodeRef = '',
  episodeRefs = [],
  sourceScenes = [],
  sourceBeats = [],
  assets = [],
  constraints = {},
  enforceMaxDuration = !![],
  includeDirectorContinuity = ![]
} = {}) {
  const _0x313f21 = parseStrictJson(getResultText(_0x573f50), "Agent 未返回分镜蓝图。");
  const _0x4e6edf = a158_0x4e1501(episodeRef, 'episode-1');
  if (a158_0x4e1501(_0x313f21?.["episodeRef"], '') !== _0x4e6edf) {
    throw new Error('Agent\x20返回的分镜蓝图与当前分集不一致。');
  }
  const _0x1734e8 = normalizeStoryPlanningConstraints(constraints);
  const _0x421921 = new Set((Array['isArray'](sourceScenes) ? sourceScenes : [])['map'](_0x20cf2f => normalizeText(_0x20cf2f?.["ref"])));
  const _0x574317 = new Map((Array['isArray'](sourceScenes) ? sourceScenes : [])["map"](_0x56d661 => [normalizeText(_0x56d661?.['ref']), _0x56d661]));
  const _0x2d7627 = Array["isArray"](sourceBeats) ? sourceBeats : [];
  const _0x1ff1a2 = new Map(_0x2d7627["map"](_0x51e823 => [normalizeText(_0x51e823?.['ref']), _0x51e823]));
  if (!_0x1ff1a2["size"] || _0x1ff1a2["size"] !== _0x2d7627['length']) {
    throw new Error("实验分批拆分缺少唯一、有效的原文块引用。");
  }
  const _0x5ea270 = new Map((Array["isArray"](assets) ? assets : [])["map"](_0x12cf7f => [normalizeText(_0x12cf7f?.["ref"]), _0x12cf7f]));
  const _0x2a03a1 = (Array["isArray"](_0x313f21?.['clipPlans']) ? _0x313f21['clipPlans'] : [])['map']((_0x2e96ba, _0x5030f7) => {
    const _0x453a1b = "片段计划 " + (_0x5030f7 + 0x1);
    const _0x3928bf = a158_0x4e1501(_0x2e96ba?.['ref'], _0x4e6edf + "-plan-" + (_0x5030f7 + 0x1));
    const _0x2aa12a = (Array['isArray'](_0x2e96ba?.["sourceBeatRefs"]) ? _0x2e96ba["sourceBeatRefs"] : [])["map"](normalizeText)["filter"](Boolean);
    const _0xd191a6 = normalizeText(_0x2e96ba?.['beat']);
    const _0xd10528 = normalizeText(_0x2e96ba?.['time']);
    const _0xe76069 = normalizeText(_0x2e96ba?.['entryState']);
    const _0x53f5d0 = normalizeText(_0x2e96ba?.["exitState"]);
    const _0xa626c8 = normalizeText(_0x2e96ba?.["openingShotIntent"]);
    const _0x1387d1 = normalizeText(_0x2e96ba?.["closingShotIntent"]);
    const _0x28e782 = normalizeText(_0x2e96ba?.["continuityNotes"]) || "以相邻计划的 exitState 和 entryState 保持连续。";
    const _0x1e18af = normalizePositiveNumber(_0x2e96ba?.['targetDurationSec']);
    if (!_0x2aa12a["length"] || new Set(_0x2aa12a)["size"] !== _0x2aa12a["length"]) {
      throw new Error(_0x453a1b + '\x20缺少唯一、有效的\x20sourceBeatRefs。');
    }
    const _0x26daef = _0x2aa12a["find"](_0x11d36e => !_0x1ff1a2["has"](_0x11d36e));
    if (_0x26daef) {
      throw new Error(_0x453a1b + '\x20引用了不存在的原文块“' + _0x26daef + '”。');
    }
    const _0xdf42e5 = [...new Set(_0x2aa12a["map"](_0x587eb8 => normalizeText(_0x1ff1a2["get"](_0x587eb8)?.["sourceSceneRef"])))];
    if (_0xdf42e5["length"] !== 0x1 || !_0x421921['has'](_0xdf42e5[0x0])) {
      throw new Error(_0x453a1b + " 的 sourceBeatRefs 跨越或缺少有效场景。");
    }
    const _0x4b06e3 = normalizeText(_0x2e96ba?.["sourceSceneRef"]);
    const _0xc520aa = _0x4b06e3 || _0xdf42e5[0x0];
    if (_0xc520aa !== _0xdf42e5[0x0]) {
      throw new Error(_0x453a1b + " 的 sourceSceneRef 与 sourceBeatRefs 不一致。");
    }
    const _0x441600 = getStoryEpisodeSceneAssetCandidates(_0x574317["get"](_0xc520aa), assets, {
      'episodeRefs': episodeRefs
    });
    const _0x1749c9 = normalizeText(_0x2e96ba?.['sceneAssetRef']) || (_0x441600['length'] === 0x1 ? normalizeText(_0x441600[0x0]?.['ref']) : '');
    const _0xd781a8 = _0x5ea270["get"](_0x1749c9);
    if (!_0x3928bf) {
      throw new Error(_0x453a1b + '\x20缺少有效的\x20ref。');
    }
    if (!_0xd781a8 || _0xd781a8["kind"] !== "scene") {
      throw new Error(_0x453a1b + " 缺少有效的 sceneAssetRef。");
    }
    const _0x2fa0c4 = normalizeStringArray((Array["isArray"](_0xd781a8?.["appearances"]) ? _0xd781a8['appearances'] : [])["map"](_0x4b2ffe => _0x4b2ffe?.['ref']));
    const _0x8abcab = normalizeText(_0x2e96ba?.['sceneAppearanceRef']);
    const _0x61ccd0 = _0x2fa0c4['length'] ? _0x8abcab : '';
    if (_0x2fa0c4["length"] && !_0x2fa0c4["includes"](_0x61ccd0)) {
      throw new Error(_0x453a1b + " 缺少有效的 sceneAppearanceRef。");
    }
    if (!_0xd191a6 || !_0xe76069 || !_0x53f5d0) {
      throw new Error(_0x453a1b + '\x20缺少\x20beat、entryState\x20或\x20exitState。');
    }
    if (includeDirectorContinuity && (!_0xa626c8 || !_0x1387d1)) {
      throw new Error(_0x453a1b + " 缺少 openingShotIntent 或 closingShotIntent。");
    }
    if (!_0x1e18af || enforceMaxDuration && _0x1e18af > _0x1734e8["sceneMaxSeconds"]) {
      throw new Error(enforceMaxDuration ? _0x453a1b + " 的 targetDurationSec 必须大于 0 且不超过 " + _0x1734e8["sceneMaxSeconds"] + " 秒。" : _0x453a1b + " 的 targetDurationSec 必须大于 0。");
    }
    const _0x19fec9 = _0x2aa12a['flatMap'](_0x4120d7 => {
      const _0x554109 = _0x1ff1a2["get"](_0x4120d7);
      return Array['isArray'](_0x554109?.["dialogueUnits"]) ? _0x554109["dialogueUnits"] : [];
    })['map'](_0x5cf199 => ({
      'ref': normalizeText(_0x5cf199?.["ref"]),
      ...(normalizeText(_0x5cf199?.["speaker"]) ? {
        'speaker': normalizeText(_0x5cf199['speaker'])
      } : {}),
      'text': normalizeText(_0x5cf199?.["text"])
    }))["filter"](_0xd6136e => _0xd6136e["ref"] && _0xd6136e["text"]);
    return {
      'ref': _0x3928bf,
      'sourceSceneRef': _0xc520aa,
      'sourceBeatRefs': _0x2aa12a,
      'beat': _0xd191a6,
      'sceneAssetRef': _0x1749c9,
      'sceneAppearanceRef': _0x61ccd0,
      'time': _0xd10528,
      'entryState': _0xe76069,
      'exitState': _0x53f5d0,
      ...(includeDirectorContinuity ? {
        'openingShotIntent': _0xa626c8,
        'closingShotIntent': _0x1387d1
      } : {}),
      'continuityNotes': _0x28e782,
      'characterAssetRefs': normalizeStoryEpisodeSplitBlueprintAssetRefs(_0x2e96ba?.['characterAssetRefs'], {
        'assetsByRef': _0x5ea270,
        'kind': "character",
        'label': _0x453a1b
      }),
      'propAssetRefs': normalizeStoryEpisodeSplitBlueprintAssetRefs(_0x2e96ba?.["propAssetRefs"], {
        'assetsByRef': _0x5ea270,
        'kind': 'prop',
        'label': _0x453a1b
      }),
      'dialogueUnits': _0x19fec9,
      'targetDurationSec': _0x1e18af
    };
  });
  if (!_0x2a03a1['length']) {
    throw new Error("Agent 返回的分镜蓝图没有可用片段计划。");
  }
  const _0x3412da = _0x2a03a1["map"](_0x100674 => _0x100674["ref"]);
  if (new Set(_0x3412da)["size"] !== _0x3412da["length"]) {
    throw new Error("Agent 返回了重复的片段计划引用。");
  }
  const _0x4277e0 = _0x2d7627['map'](_0x4d38c4 => normalizeText(_0x4d38c4?.["ref"]));
  const _0x112882 = _0x2a03a1['flatMap'](_0x82938f => _0x82938f["sourceBeatRefs"]);
  if (_0x4277e0["length"] !== _0x112882["length"] || _0x4277e0["some"]((_0x30d12e, _0x1d20c9) => _0x30d12e !== _0x112882[_0x1d20c9])) {
    throw new Error("Agent 分镜蓝图未按原文顺序完整且唯一地覆盖全部 sourceBeats。");
  }
  return {
    'episodeRef': _0x4e6edf,
    'clipPlans': _0x2a03a1
  };
}
function createLocalStoryEpisodeSplitBlueprint({
  episodeRef = '',
  episodeRefs = [],
  sourceScenes = [],
  sourceBeats = [],
  assets = [],
  includeDirectorContinuity = ![]
} = {}) {
  const _0x4799c0 = a158_0x4e1501(episodeRef, 'episode-1');
  const _0x2ea260 = new Map((Array["isArray"](sourceScenes) ? sourceScenes : [])['map'](_0x2b6889 => [normalizeText(_0x2b6889?.['ref']), _0x2b6889]));
  const _0x3666cb = (Array["isArray"](assets) ? assets : [])["filter"](_0x3300ff => _0x3300ff?.["kind"] === "scene");
  const _0x434e9d = (Array['isArray'](assets) ? assets : [])["filter"](_0x48c682 => _0x48c682?.["kind"] === "character");
  const _0x4e98ec = (Array["isArray"](assets) ? assets : [])["filter"](_0x377c1f => _0x377c1f?.["kind"] === "prop");
  const _0x380221 = _0x3666cb["some"](_0x361843 => normalizeStringArray(_0x361843?.["sourceSceneRefs"])["length"]);
  const _0x63331f = (Array["isArray"](sourceBeats) ? sourceBeats : [])['map']((_0x5a0b94, _0x35b4b5) => {
    const _0x177d5c = normalizeText(_0x5a0b94?.["sourceSceneRef"]);
    const _0xf52ddc = _0x2ea260["get"](_0x177d5c) || {};
    const _0x7f75a7 = _0x380221 ? getStoryEpisodeSceneAssetCandidates(_0xf52ddc, _0x3666cb, {
      'episodeRefs': episodeRefs
    })[0x0] : _0x3666cb["find"](_0x182957 => storySceneIdentitiesOverlap(_0x182957?.["name"], _0xf52ddc?.["heading"])) || _0x3666cb[0x0];
    if (!_0x7f75a7) {
      throw new Error('无法为场景“' + (normalizeText(_0xf52ddc?.["heading"]) || _0x177d5c) + "”建立本地分镜蓝图。");
    }
    const _0x3974eb = Array['isArray'](_0x7f75a7?.["appearances"]) ? _0x7f75a7["appearances"] : [];
    const _0x401d11 = _0x3974eb['find'](_0x167d9e => normalizeStringArray(_0x167d9e?.["sourceSceneRefs"])["some"](_0x1c0c1c => storyEpisodeSourceSceneRefsMatch(_0x1c0c1c, _0x177d5c, episodeRefs))) || _0x3974eb['find'](_0x17a495 => normalizeText(_0x17a495?.["ref"]) === normalizeText(_0x7f75a7?.["baseAppearanceRef"])) || _0x3974eb[0x0];
    const _0x1ba8fc = normalizeText(_0x5a0b94?.["body"] || _0xf52ddc?.["body"] || _0xf52ddc?.['heading']);
    const _0x494c2f = new Set([...normalizeStringArray(_0xf52ddc?.["characters"]), ...normalizeStringArray(_0x5a0b94?.["characters"])]);
    const _0x21d43b = _0x434e9d["filter"](_0x304c1f => _0x494c2f["has"](_0x304c1f["name"]) || _0x1ba8fc["includes"](_0x304c1f['name']))["map"](_0x4b0904 => _0x4b0904["ref"]);
    const _0xc0d9dd = _0x4e98ec["filter"](_0x3f5b6b => _0x3f5b6b["name"] && _0x1ba8fc['includes'](_0x3f5b6b["name"]))["map"](_0x3b1005 => _0x3b1005["ref"]);
    const _0x34f13b = normalizeText(_0xf52ddc?.["heading"] || _0x5a0b94?.["heading"]);
    const _0x39257f = _0x1ba8fc["slice"](0x0, 0x78) || _0x34f13b || "原文块 " + (_0x35b4b5 + 0x1);
    return {
      'ref': _0x4799c0 + "-local-plan-" + (_0x35b4b5 + 0x1),
      'sourceSceneRef': _0x177d5c,
      'sourceBeatRefs': [normalizeText(_0x5a0b94?.["ref"])],
      'beat': _0x1ba8fc,
      'sceneAssetRef': _0x7f75a7["ref"],
      'sceneAppearanceRef': normalizeText(_0x401d11?.['ref']),
      'entryState': "从原文动作起点进入：" + _0x39257f,
      'exitState': "完整呈现该原文块后结束：" + _0x39257f,
      ...(includeDirectorContinuity ? {
        'openingShotIntent': "根据当前剧情、表演重点和相邻画面自主选择开场镜头。",
        'closingShotIntent': "根据当前动作结果与情绪落点自主选择结束镜头。"
      } : {}),
      'continuityNotes': "严格保持原文顺序、人物状态、场景方位和动作承接。",
      'characterAssetRefs': _0x21d43b,
      'propAssetRefs': _0xc0d9dd,
      'dialogueUnits': Array["isArray"](_0x5a0b94?.["dialogueUnits"]) ? _0x5a0b94["dialogueUnits"]['map'](_0x3682b3 => ({
        ..._0x3682b3
      })) : [],
      'targetDurationSec': Math["max"](0x4, Math["ceil"]([..._0x1ba8fc]["length"] / 0x8))
    };
  });
  if (!_0x63331f['length']) {
    throw new Error("无法从原文建立本地分镜蓝图。");
  }
  return {
    'episodeRef': _0x4799c0,
    'clipPlans': _0x63331f
  };
}
function distributeStoryEpisodePlanDurationTargets(_0x35d5a4 = [], _0xaba12c = 0x0) {
  const _0x36f8a5 = Array["isArray"](_0x35d5a4) ? _0x35d5a4 : [];
  const _0x8ff558 = normalizePositiveNumber(_0xaba12c);
  if (!_0x36f8a5["length"] || !_0x8ff558) {
    return _0x36f8a5;
  }
  const _0x18567e = _0x36f8a5["map"](_0x33293d => normalizePositiveNumber(_0x33293d?.["targetDurationSec"]) || 0x1);
  const _0x36056e = _0x18567e["reduce"]((_0x104b04, _0x386487) => _0x104b04 + _0x386487, 0x0);
  let _0x46487d = 0x0;
  return _0x36f8a5["map"]((_0x5a85d6, _0x4527f5) => {
    const _0x32930c = _0x4527f5 === _0x36f8a5["length"] - 0x1 ? Number((_0x8ff558 - _0x46487d)["toFixed"](0x1)) : Number((_0x8ff558 * (_0x18567e[_0x4527f5] / _0x36056e))["toFixed"](0x1));
    _0x46487d = Number((_0x46487d + _0x32930c)["toFixed"](0x1));
    return {
      ..._0x5a85d6,
      'targetDurationSec': Math["max"](0.1, _0x32930c)
    };
  });
}
function reconcileStoryEpisodeSplitBlueprintTiming(_0xb1c351 = {}, _0x212aa9 = {}) {
  const _0x373b28 = resolveStoryEpisodeSplitTimingBudget(_0x212aa9);
  const _0x41dce1 = Array["isArray"](_0xb1c351?.["clipPlans"]) ? _0xb1c351["clipPlans"] : [];
  if (!_0x373b28 || !_0x41dce1["length"]) {
    return _0xb1c351;
  }
  const _0x171f0a = _0x41dce1['reduce']((_0x11d9d2, _0x5dc97a) => _0x11d9d2 + (normalizePositiveNumber(_0x5dc97a?.["targetDurationSec"]) || 0x0), 0x0);
  const _0x20eb55 = _0x373b28["allowedProductionRangeSeconds"];
  if (_0x171f0a >= _0x20eb55["minimum"] && _0x171f0a <= _0x20eb55["maximum"]) {
    return _0xb1c351;
  }
  const _0x4b767f = new Map(_0x373b28["sceneTimings"]['map'](_0x1b7f70 => [normalizeText(_0x1b7f70?.["sceneRef"]), _0x1b7f70]));
  const _0x3c2428 = [...new Set(_0x41dce1["map"](_0xf57013 => normalizeText(_0xf57013?.['sourceSceneRef'])))];
  const _0x102b0b = _0x3c2428["length"] && _0x3c2428["every"](_0x13dc4b => _0x4b767f["has"](_0x13dc4b));
  let _0x33a02c;
  if (_0x102b0b) {
    const _0x1dcd82 = new Map();
    _0x41dce1["forEach"](_0xe4adf9 => {
      const _0x499524 = normalizeText(_0xe4adf9?.['sourceSceneRef']);
      const _0xc91349 = _0x1dcd82['get'](_0x499524) || [];
      _0xc91349["push"](_0xe4adf9);
      _0x1dcd82["set"](_0x499524, _0xc91349);
    });
    const _0x2d94d8 = new Map();
    _0x1dcd82["forEach"]((_0x3365a1, _0x6bd018) => {
      distributeStoryEpisodePlanDurationTargets(_0x3365a1, _0x4b767f["get"](_0x6bd018)?.["totalSeconds"])["forEach"](_0x99a6e5 => _0x2d94d8["set"](_0x99a6e5["ref"], _0x99a6e5));
    });
    _0x33a02c = _0x41dce1["map"](_0x44db29 => _0x2d94d8["get"](_0x44db29["ref"]) || _0x44db29);
  } else {
    _0x33a02c = distributeStoryEpisodePlanDurationTargets(_0x41dce1, _0x373b28["targetDurationSeconds"]);
  }
  return {
    ..._0xb1c351,
    'clipPlans': _0x33a02c
  };
}
export function buildStoryEpisodeSplitBlueprintPrompt({
  project = {},
  episode = {},
  previousEpisode = null,
  nextEpisode = null,
  assets = [],
  constraints = {},
  enforceMaxDuration = !![],
  sourceBeatsOverride = null,
  promptExperiment = ![],
  promptMode = ''
} = {}) {
  const _0x1c43d5 = normalizeStoryProjectInput(project);
  assertStoryProjectInput(_0x1c43d5);
  const _0x33f932 = selectStoryEpisodeSplitAssets(assets, episode);
  if (!_0x33f932["some"](_0x158287 => _0x158287["kind"] === "scene")) {
    throw new Error("分集缺少可用的场景资产，无法规划分镜蓝图。");
  }
  const _0xda18b2 = normalizeStoryEpisodeSplitSourceScenes(episode);
  const _0x40bb51 = Array['isArray'](sourceBeatsOverride) && sourceBeatsOverride["length"] ? sourceBeatsOverride : normalizeStoryEpisodeSplitSourceBeats(episode);
  if (!_0xda18b2["length"] || !_0x40bb51["length"] || !normalizeText(episode?.["title"])) {
    throw new Error("分集缺少标题或剧本正文，无法规划分镜蓝图。");
  }
  const _0x558ba3 = resolveStoryPlanningConstraints(project, constraints);
  const _0x48ef59 = normalizeText(promptMode)["toLowerCase"]() || resolveStoryPromptMode(project, constraints);
  const _0x50ab1d = resolveStoryPromptModeClipMaxSeconds(_0x48ef59, _0x558ba3["sceneMaxSeconds"]);
  const _0xfbfc1 = a158_0x4e1501(episode?.["ref"] || episode?.["planningRef"] || episode?.['id'], 'episode-1');
  const _0x239e8d = getStoryEpisodeReferenceAliases(episode);
  const _0x398846 = normalizeStringArray(_0x40bb51["map"](_0x2067ef => normalizeText(_0x2067ef?.["sourceSceneRef"])));
  const _0x2a1864 = getStoryEpisodeBlueprintSceneAssetRefs(_0x398846, _0xda18b2, _0x33f932, {
    'episodeRefs': _0x239e8d
  });
  const _0xd2552e = _0x398846["some"](_0x2d99c9 => !_0x2a1864["has"](_0x2d99c9));
  const _0x20bd28 = resolveStoryEpisodeSplitTimingBudget(episode);
  return JSON['stringify']({
    'task': "plan_story_episode_split_blueprint",
    ...(episode["replication"]?.['sourceAnalysis'] ? {
      'sourceVideoEvidence': buildVideoReplicationSourceEvidence(episode, project, assets)
    } : {}),
    'schemaVersion': STORY_EPISODE_BATCHED_SPLIT_SCHEMA_VERSION,
    'scriptMode': _0x1c43d5["scriptMode"],
    'project': buildStoryEpisodeSplitProjectContext(project, _0x1c43d5, {
      'sourceBeats': _0x40bb51
    }),
    'episode': {
      'ref': _0xfbfc1,
      'title': normalizeText(episode?.["title"]),
      'synopsis': normalizeText(episode?.['synopsis']),
      'sourceBeats': _0x40bb51,
      ...(_0x20bd28 ? {
        'timingBudget': _0x20bd28
      } : {})
    },
    'assets': _0x33f932['map'](_0x15bc68 => compactStoryEpisodeBlueprintAsset(_0x15bc68, {
      'episodeRefs': _0x239e8d,
      'sourceSceneRefs': _0x398846
    })),
    'continuity': {
      'previousEpisode': normalizeStoryEpisodeSplitContinuityEpisode(previousEpisode, {
        'includeEnding': !![]
      }),
      'nextEpisode': normalizeStoryEpisodeSplitContinuityEpisode(nextEpisode)
    },
    'constraints': enforceMaxDuration ? _0x558ba3 : {
      'episodeCount': _0x558ba3["episodeCount"]
    },
    'requirements': ["先只规划整集片段蓝图，不要返回 shots、camera、dialogue、voiceover 或 audio。", ...[buildVideoReplicationTimingGuidance(episode)]["filter"](Boolean), "按 sourceBeats 原顺序完整覆盖剧情；每个 sourceBeats[].ref 必须且只能在一个 clipPlan.sourceBeatRefs 中出现一次。", "sourceBeat 用于跟踪原文覆盖，不直接决定片段边界；一个 clipPlan 可以承载多个相互关联的动作、对白、表情和反应。", STORY_EPISODE_SPLIT_GROUPING_GUIDANCE, STORY_EPISODE_SPLIT_CONTINUITY_CHAIN_GUIDANCE, enforceMaxDuration ? 'targetDurationSec\x20体现当前连续叙事自然完成所需，并在视频模型的\x20' + _0x50ab1d + " 秒能力内安排。" + STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE : "targetDurationSec 体现当前连续叙事自然完成所需。" + STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, ...(_0x20bd28 ? ["episode.timingBudget 是正文完成后的独立逐场审时账本，不是大纲目标。全部 clipPlans.targetDurationSec 合计应接近 " + _0x20bd28["targetDurationSeconds"] + " 秒，并且必须落在制作允许区间 " + _0x20bd28["allowedProductionRangeSeconds"]['minimum'] + '-' + _0x20bd28['allowedProductionRangeSeconds']["maximum"] + " 秒。", '按\x20episode.timingBudget.sceneTimings\x20为对应\x20sourceSceneRef\x20分配时间；必须呈现账本中已经存在的对白、动作、等待、反应和转场，不得靠重复动作、空镜、慢动作或新增剧情凑时长。'] : []), "客户端会按 clipPlans 顺序本地生成 ref，并从 sourceBeatRefs 推导 sourceSceneRef；不要返回 ref、sourceSceneRef 或 continuityNotes。", _0xd2552e ? "每个 clipPlan 必须返回一个与 sourceBeatRefs 所属场景匹配的 kind=scene 的 assets[].ref。" : '当前\x20sourceSceneRef\x20均有唯一场景资产绑定，客户端会本地推导\x20sceneAssetRef；不要返回\x20sceneAssetRef。', "每个 clipPlan 必须返回该场景有效的 sceneAppearanceRef；场景没有形象时返回空字符串，多候选时不得猜测。", 'entryState\x20和\x20exitState\x20必须写成可观察状态，记录人物站位、动作、情绪、视线、道具和空间方向，供相邻计划直接承接。', '同一\x20sourceSceneRef\x20的相邻\x20clipPlan\x20必须组成一条连续状态链：后一项\x20entryState\x20完整继承前一项\x20exitState，再描述当前\x20beat\x20如何从该状态继续；15\x20秒等单片时长上限不得被理解成重新入场、重新走位或重新执行动作。', ...(promptExperiment ? ['场景图片是空间锚点；entryState\x20与\x20exitState\x20必须使用可见地标描述人物相对位置、朝向和移动结果，禁止只写抽象情绪或‘原地’。', "openingShotIntent 与 closingShotIntent 规划镜头叙事意图，由 Agent 根据剧情自主选择关注主体、景别层级和构图变化。", "相邻计划保持人物状态连续，画面衔接体现当前动作、视线或情绪关系。"] : []), "beat、entryState、exitState 各只写一句必要信息，不复述原文，不展开镜头语言。", "characterAssetRefs 与 propAssetRefs 只列当前计划实际出现的已登记资产；不得编造引用。", ...getStoryEpisodeTimelinePlanningRequirements(_0x48ef59)["filter"](_0x78221f => !isStoryEpisodeTimelineGuidance(_0x78221f))],
    'outputSchema': {
      'episodeRef': _0xfbfc1,
      'clipPlans': [{
        'sourceBeatRefs': ["按原顺序逐字使用一个或多个连续 sourceBeats[].ref"],
        'beat': '概括当前连续片段内相互关联的动作、对白推进与情绪变化，不展开镜头细节',
        ...(_0xd2552e ? {
          'sceneAssetRef': '逐字使用一个\x20kind=scene\x20的\x20assets[].ref'
        } : {}),
        'sceneAppearanceRef': "该场景有效的 appearances[].ref；没有形象时为空字符串",
        'entryState': '片段开头可观察的人物、动作、视线、道具与空间状态',
        'exitState': '片段结束可观察的人物、动作、视线、道具与空间状态',
        ...(promptExperiment ? {
          'openingShotIntent': 'AI\x20自主决定的开场镜头叙事意图，不写固定模板',
          'closingShotIntent': "AI 自主决定的结束镜头叙事意图，并考虑相邻计划衔接"
        } : {}),
        'characterAssetRefs': ['当前片段实际出现的角色\x20assets[].ref'],
        'propAssetRefs': ['当前片段实际出现的道具\x20assets[].ref'],
        'targetDurationSec': enforceMaxDuration ? "正数且不超过 " + _0x558ba3["sceneMaxSeconds"] : "按剧情内容如实估算的正数秒数，无硬上限"
      }]
    }
  });
}
export function createStoryEpisodeSplitBlueprintBatches(_0x490630 = [], {
  minSize = 0x1,
  maxSize = STORY_EPISODE_EXPERIMENTAL_MAX_PLANS_PER_BATCH
} = {}) {
  const _0x34e42c = Array["isArray"](_0x490630) ? _0x490630 : [];
  if (!_0x34e42c["length"]) {
    return [];
  }
  const _0x1f8572 = Math["max"](0x1, Math["trunc"](Number(minSize) || 0x1));
  const _0x7e30ea = Math["max"](_0x1f8572, Math["trunc"](Number(maxSize) || STORY_EPISODE_EXPERIMENTAL_MAX_PLANS_PER_BATCH));
  if (_0x34e42c["length"] <= _0x7e30ea) {
    return [_0x34e42c['slice']()];
  }
  const _0x20d540 = Math["ceil"](_0x34e42c["length"] / _0x7e30ea);
  const _0x251323 = Math['floor'](_0x34e42c["length"] / _0x20d540);
  const _0x1142f4 = _0x34e42c['length'] % _0x20d540;
  const _0x50535d = [];
  let _0x40deb4 = 0x0;
  for (let _0x186040 = 0x0; _0x186040 < _0x20d540; _0x186040 += 0x1) {
    const _0x2fff76 = _0x251323 + (_0x186040 < _0x1142f4 ? 0x1 : 0x0);
    _0x50535d["push"](_0x34e42c["slice"](_0x40deb4, _0x40deb4 + Math["max"](_0x1f8572, _0x2fff76)));
    _0x40deb4 += Math["max"](_0x1f8572, _0x2fff76);
  }
  if (_0x40deb4 < _0x34e42c["length"]) {
    _0x50535d['at'](-0x1)['push'](..._0x34e42c["slice"](_0x40deb4));
  }
  return _0x50535d['filter'](_0x35458f => _0x35458f['length']);
}
export function createStoryEpisodeExperimentalConcurrentBatches(_0x25068b = [], {
  maxPlansPerBatch = STORY_EPISODE_EXPERIMENTAL_MAX_PLANS_PER_BATCH,
  targetDurationSeconds = STORY_EPISODE_EXPERIMENTAL_BATCH_TARGET_DURATION_SECONDS
} = {}) {
  const _0xa61124 = Array["isArray"](_0x25068b) ? _0x25068b : [];
  if (!_0xa61124["length"]) {
    return [];
  }
  const _0x5d4d0f = Math["max"](0x1, Math["trunc"](Number(maxPlansPerBatch) || STORY_EPISODE_EXPERIMENTAL_MAX_PLANS_PER_BATCH));
  const _0x3d757f = Math["max"](0x1, normalizePositiveNumber(targetDurationSeconds) || STORY_EPISODE_EXPERIMENTAL_BATCH_TARGET_DURATION_SECONDS);
  const _0xda0bec = [];
  let _0x4d7ec0 = [];
  let _0x4458e5 = 0x0;
  const _0xd3cc79 = () => {
    if (!_0x4d7ec0['length']) {
      return;
    }
    _0xda0bec["push"](_0x4d7ec0);
    _0x4d7ec0 = [];
    _0x4458e5 = 0x0;
  };
  _0xa61124['forEach'](_0x5d0797 => {
    const _0x33b793 = normalizePositiveNumber(_0x5d0797?.["targetDurationSec"]) || STORY_EPISODE_EXPERIMENTAL_FALLBACK_PLAN_DURATION_SECONDS;
    _0x4d7ec0["length"] && (_0x4d7ec0["length"] >= _0x5d4d0f || _0x4458e5 + _0x33b793 > _0x3d757f) && _0xd3cc79();
    _0x4d7ec0["push"](_0x5d0797);
    _0x4458e5 += _0x33b793;
  });
  _0xd3cc79();
  return _0xda0bec;
}
function selectStoryEpisodeSplitBatchAssets(_0x176e89 = [], _0x281514 = [], _0x5ae0bd = [], _0xa43058 = []) {
  const _0x2d873b = new Set(_0x281514['flatMap'](_0x324494 => [_0x324494?.["sceneAssetRef"], ...(Array["isArray"](_0x324494?.['characterAssetRefs']) ? _0x324494["characterAssetRefs"] : []), ...(Array["isArray"](_0x324494?.["propAssetRefs"]) ? _0x324494["propAssetRefs"] : [])])["map"](normalizeText)["filter"](Boolean));
  const _0x45fc17 = _0x5ae0bd["flatMap"](_0x2ae45f => [_0x2ae45f?.["heading"], ...(Array['isArray'](_0x2ae45f?.["characters"]) ? _0x2ae45f["characters"] : []), _0x2ae45f?.["body"]])['map'](normalizeText)["filter"](Boolean)["join"]('\x0a');
  const _0x1d77c9 = _0x5ae0bd["map"](_0x3f7f71 => normalizeText(_0x3f7f71?.["ref"]));
  return (Array["isArray"](_0x176e89) ? _0x176e89 : [])["filter"](_0x5816da => _0x2d873b["has"](normalizeText(_0x5816da?.['ref'])) || storyAssetMatchesEpisode(_0x5816da, _0xa43058) && _0x5816da["sourceSceneRefs"]["some"](_0x13051d => _0x1d77c9["some"](_0x401da8 => storyEpisodeSourceSceneRefsMatch(_0x13051d, _0x401da8, _0xa43058))) || normalizeText(_0x5816da?.["name"]) && _0x45fc17["includes"](normalizeText(_0x5816da["name"])));
}
export function buildStoryEpisodeSplitBatchPrompt({
  project = {},
  episode = {},
  assets = [],
  constraints = {},
  blueprint = {},
  batchIndex = 0x0,
  batches = [],
  planBatch = null,
  batchNumber = 0x0,
  batchTotal = 0x0,
  enforceMaxDuration = !![],
  sourceBeatsOverride = null,
  promptExperiment = ![],
  promptMode = '',
  timingCorrection = null
} = {}) {
  const _0x3e7a8e = normalizeStoryProjectInput(project);
  const _0x1ed641 = resolveStoryPlanningConstraints(project, constraints);
  const _0x92170f = normalizeText(promptMode)['toLowerCase']() || resolveStoryPromptMode(project, constraints);
  const _0x3409cf = resolveStoryPromptModeClipMaxSeconds(_0x92170f, _0x1ed641['sceneMaxSeconds']);
  const _0x4ebc98 = (Array["isArray"](assets) ? assets : [])["map"]((_0x508ef1, _0x5370b7) => normalizePlanningAssetSummary(_0x508ef1, _0x5370b7))["filter"](_0x5c2164 => _0x5c2164['name']);
  const _0x51d427 = Array["isArray"](blueprint?.["clipPlans"]) ? blueprint['clipPlans'] : [];
  const _0x3fcbad = Array['isArray'](planBatch) && planBatch["length"] ? planBatch : Array["isArray"](batches?.[batchIndex]) ? batches[batchIndex] : [];
  if (!_0x3fcbad["length"]) {
    throw new Error("实验分批拆分缺少当前批次计划。");
  }
  const _0x5e1c16 = a158_0x4e1501(episode?.["ref"] || episode?.["planningRef"] || episode?.['id'], "episode-1");
  const _0x17a493 = Array["isArray"](sourceBeatsOverride) && sourceBeatsOverride["length"] ? sourceBeatsOverride : normalizeStoryEpisodeSplitSourceBeats(episode);
  const _0xf17524 = new Set(_0x3fcbad["flatMap"](_0x369c61 => Array["isArray"](_0x369c61?.["sourceBeatRefs"]) ? _0x369c61['sourceBeatRefs'] : []));
  const _0x4335b5 = _0x17a493["filter"](_0x55cad2 => _0xf17524["has"](_0x55cad2["ref"]));
  if (_0x4335b5["length"] !== _0xf17524['size']) {
    throw new Error("实验分批拆分当前批次缺少蓝图引用的原文块。");
  }
  const _0x25d7dc = selectStoryEpisodeSplitBatchAssets(_0x4ebc98, _0x3fcbad, _0x4335b5, getStoryEpisodeReferenceAliases(episode))["map"](_0xf36b54 => compactStoryEpisodePromptAsset(_0xf36b54, {
    'includeVisualDetails': !![],
    'includeBindings': Array['isArray'](sourceBeatsOverride)
  }));
  const _0x583cb7 = new Set(_0x25d7dc["filter"](_0x5b5a3d => _0x5b5a3d?.["kind"] === 'scene')['map'](_0x1bc6ba => normalizeText(_0x1bc6ba?.['ref'])));
  const _0x207267 = _0x3fcbad["map"](_0x5cfdc3 => normalizeText(_0x5cfdc3?.["sceneAssetRef"]))['find'](_0x29c210 => !_0x583cb7["has"](_0x29c210));
  if (_0x207267) {
    throw new Error("实验分批拆分缺少场景资产“" + _0x207267 + '”。');
  }
  const _0x39c608 = _0x51d427["findIndex"](_0x36ecc4 => _0x36ecc4?.["ref"] === _0x3fcbad[0x0]?.["ref"]);
  const _0xbd3baa = _0x51d427['findIndex'](_0x3c6297 => _0x3c6297?.["ref"] === _0x3fcbad['at'](-0x1)?.["ref"]);
  const _0x2bd83d = _0x39c608 > 0x0 ? _0x51d427[_0x39c608 - 0x1] : null;
  const _0x23a8d4 = _0xbd3baa >= 0x0 ? _0x51d427[_0xbd3baa + 0x1] || null : null;
  return JSON["stringify"]({
    'task': "expand_story_episode_split_batch",
    ...(episode["replication"]?.['sourceAnalysis'] ? {
      'sourceVideoEvidence': buildVideoReplicationSourceEvidence(episode, project, assets)
    } : {}),
    'schemaVersion': STORY_EPISODE_BATCHED_SPLIT_SCHEMA_VERSION,
    'scriptMode': _0x3e7a8e["scriptMode"],
    'episode': {
      'ref': _0x5e1c16,
      'title': normalizeText(episode?.["title"])
    },
    'batch': {
      'index': Math["max"](0x1, Math['trunc'](Number(batchNumber) || batchIndex + 0x1)),
      'total': Math['max'](0x1, Math["trunc"](Number(batchTotal) || batches["length"] || 0x1)),
      'clipPlans': _0x3fcbad
    },
    'sourceBeats': _0x4335b5,
    'assets': _0x25d7dc,
    'continuityLedger': {
      'previousBoundary': _0x2bd83d ? {
        'ref': _0x2bd83d["ref"],
        'exitState': _0x2bd83d["exitState"],
        'continuityNotes': _0x2bd83d['continuityNotes'],
        ...(promptExperiment ? {
          'closingShotIntent': normalizeText(_0x2bd83d['closingShotIntent'])
        } : {})
      } : null,
      'currentEntry': {
        'ref': _0x3fcbad[0x0]["ref"],
        'entryState': _0x3fcbad[0x0]['entryState'],
        ...(promptExperiment ? {
          'openingShotIntent': normalizeText(_0x3fcbad[0x0]["openingShotIntent"])
        } : {})
      },
      'nextBoundary': _0x23a8d4 ? {
        'ref': _0x23a8d4["ref"],
        'entryState': _0x23a8d4["entryState"],
        'continuityNotes': _0x23a8d4['continuityNotes'],
        ...(promptExperiment ? {
          'openingShotIntent': normalizeText(_0x23a8d4['openingShotIntent'])
        } : {})
      } : null
    },
    'constraints': enforceMaxDuration ? _0x1ed641 : {
      'episodeCount': _0x1ed641["episodeCount"]
    },
    'visualDirection': {
      'aspectRatio': _0x3e7a8e["aspectRatio"] || '16:9',
      'style': _0x3e7a8e["visualStyle"]
    },
    'timingBudget': {
      ...(!enforceMaxDuration ? {
        'preserveSourceDialogueUnits': !![]
      } : {}),
      'singleActionBeatPerShot': !![],
      'singleContinuousCameraPerShot': !![]
    },
    'durationBudgets': _0x3fcbad["map"](_0x1ea3c4 => ({
      'ref': _0x1ea3c4["ref"],
      'targetDurationSec': _0x1ea3c4['targetDurationSec'],
      ...(enforceMaxDuration ? {
        'maxDurationSec': _0x3409cf
      } : {})
    })),
    ...(timingCorrection ? {
      'timingCorrection': timingCorrection
    } : {}),
    'requirements': ['只展开\x20batch.clipPlans；按给定顺序为每个计划准确返回一个同\x20ref\x20的\x20clip，不得增加、合并、遗漏或重排。', ...[buildVideoReplicationTimingGuidance(episode)]["filter"](Boolean), ...(buildVideoReplicationTimingGuidance(episode) ? ["原片总时长是整集所有批次的合计参考，不是当前批次或单个片段的目标；本批只分配其覆盖内容所需的时间。"] : []), '只依据当前\x20sourceBeats\x20写剧情、对白和旁白；不得补写未提供的整集内容，也不得遗漏\x20clipPlan.sourceBeatRefs\x20对应的信息。', "返回的 clips 是按计划分开的中间展开容器，不直接提交给视频模型；按当前剧情和表演节拍展开原子分镜，客户端会依据用户设置的单片段最大时长重新分组。", enforceMaxDuration ? "根据当前连续叙事与表演节拍自主决定分镜组织方式；durationBudgets.targetDurationSec 用于安排参考，shots.durationSec 总和在视频模型的 " + _0x3409cf + " 秒能力内。" : "把每个 clip 展开为自然连贯的原子分镜流，每镜时长按当前表演需要判断，并在视频模型的 " + _0x3409cf + '\x20秒能力内。', ...(resolveStoryEpisodeSplitTimingBudget(episode) ? ["durationBudgets.targetDurationSec 来自正文逐场审时账本。每个计划全部 shots.durationSec 的合计必须落在对应 targetDurationSec 的 80%-120% 内；通过补全原文已有的动作过程、等待、反应和转场实现，不得重复内容或新增剧情。"] : []), ...(timingCorrection ? ["这是自动时长复检后的定点重做。先根据 timingCorrection.previousFailure 修正上一轮时长缺口，再逐项自算每个计划 shots.durationSec 合计，确认达到 durationBudgets 后才返回。"] : []), "batch.clipPlans[].dialogueUnits 是客户端从故事正文逐字提取的完整发言。每个 dialogueUnits[].text 必须且只能完整出现在一个 shot.dialogue 中；不得改写、删减、按逗号拆开或分散到多个 shots。正文通过动作、停顿、他人插话或独立引号形成的不同 dialogueUnits 才是允许的发言边界。", "每个 clip 只能使用其 clipPlan.sceneAssetRef 指定的一个场景；至少一个 shot.assetUsages 必须引用该场景及指定 sceneAppearanceRef。", "把 entryState 直接写入首镜可观察画面，把 exitState 落到末镜可观察结果；不得用‘承接上一片段’等外部上下文表达。", "把 batch.clipPlans 和 continuityLedger 视为同一场景时间线的连续部分。每个计划的首镜必须从给定 entryState 直接续演，计划内每个后续镜头必须从前一镜头的动作落点继续；不得因为进入新计划或新的 15 秒技术切片而重新建立人物、位置、道具、车辆、设备或场景。", ...(promptExperiment ? ['场景参考图是固定空间锚点。镜头变化只能改变观察方式，不得改变建筑、家具、出入口、固定地标和光线方向的相对关系，不得镜像场景。', '由\x20Agent\x20根据剧情、对白、人物反应、动作连续性和情绪变化自主决定镜头数量、景别、机位、构图、运镜和剪辑方式。', "侧脸、双人镜头、过肩、正反打、特写、一镜到底或静止观察都可以，选择服务当前剧情的表达方式。", "每个 shot.transitionFromPrevious 说明与前一原子分镜的衔接方式和叙事原因，可选择切镜、动作匹配、视线匹配、反应镜头、道具插入或连续长镜。", "相邻 shot 的观察方式根据动作连续性和情绪发展决定，可变化，也可有意保持。", "每个 shot.visual 都要写清当前可观察的人物位置、朝向、动作、视线和道具状态；人物换位必须通过连续移动完成，禁止瞬移、镜像换位和无动作的位置重置。"] : []), STORY_EPISODE_SPLIT_VISUAL_GUIDANCE, STORY_EPISODE_SPLIT_CAMERA_GUIDANCE, "每个分镜中，画面实际出现的已登记角色必须来自对应 clipPlan.characterAssetRefs，并逐个把具体 appearanceRef 写入 shot.assetRefs；资产没有形象时才写 assetRef。角色只在首次出现时使用 assets[].name，后续优先使用他/她/该角色；有指代歧义时继续使用普通姓名。dialogue 说话人标签使用普通姓名，任何文本字段都不要输出 @。", STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, "听者反应、说话人的表情落点和动作结果，根据当前表演节拍安排在口播镜头内或独立反应镜头中。", "每个分镜围绕清晰的表演节拍组织；连续动作可以在镜头内完成，也可以在有叙事动机时切换观察方式。", "由 Agent 根据正文已存在的动作完成、发言结束和情绪落点判断每镜 cutAfter：完整 dialogueUnit 结束后用 preferred 或 allowed；不得在 dialogueUnit 内建立切点。场景变化由客户端强制换片段。", "不要返回 script、creativeIntent、transition 或 shot.time，这些字段由客户端依据蓝图本地补全。visual、camera 只写当前分镜必需信息，不复述 clipPlan、资产描述或前后镜头。", "visual、camera 和 audio 保持紧凑完整，选择当前分镜真正有表达价值的信息；dialogue、voiceover、audio 没有内容时省略字段。", "audio 记录与当前画面相配的环境声、动作音效和可听见的表演声。", "不要返回 title 或已拼接 prompt；客户端会统一命名并构建最终视频提示词。", ...getStoryEpisodeTimelinePlanningRequirements(_0x92170f)],
    'outputSchema': {
      'episodeRef': _0x5e1c16,
      'clips': [{
        'ref': "必须逐字使用对应 batch.clipPlans[].ref",
        'shots': [{
          'durationSec': "当前原子分镜精确秒数；结合口播内容、人物语速、情绪、句式、呼吸、动作、停顿与反应判断，并在视频模型的 " + _0x3409cf + " 秒能力内",
          ...(isStoryContinuousTimelinePromptMode(_0x92170f) ? {
            'startSec': "当前 clip 内的整数开始秒数；首镜必须为 0，后续等于上一镜 endSec",
            'endSec': '当前\x20clip\x20内的整数结束秒数；必须大于\x20startSec，且\x20endSec-startSec\x20等于\x20durationSec'
          } : {}),
          'assetRefs': ["画面实际使用的 appearanceRef；资产没有形象时使用 assetRef"],
          'visual': "可直接交给 AI 视频模型执行的正向画面提示词；写清摄像机实际可见的主体、人物位置与朝向、具体动作或状态变化、表情与视线、环境层次、道具互动、光影变化和动作落点，不写抽象心理或气氛结论",
          'camera': '根据剧情、动作和情绪选择观察方式；写对本镜头有意义的景别、机位与角度、构图、运镜、焦点和落点，静止或运动均可',
          ...(promptExperiment ? {
            'transitionFromPrevious': 'AI\x20自主决定与前一原子分镜的衔接方式及叙事原因；首镜说明开场选择'
          } : {}),
          'dialogue': "角色名：正文中的一条完整 dialogueUnit 原文；禁止自行断句或改写；没有则为空字符串",
          'voiceover': '画外音或旁白；没有则为空字符串',
          'audio': "必要环境声、动作音效或可听见的表演声；允许呼吸、喘息、啜泣、衣物摩擦，禁止固定人物音色、对白复述与脱离剧情的配乐说明",
          'cutAfter': "preferred、allowed 或 forbidden；可省略，客户端按 allowed 处理"
        }]
      }]
    }
  });
}
function parseStoryEpisodeSplitBatchResult(_0x319638, {
  episodeRef = '',
  clipPlans = [],
  constraints = {},
  assets = [],
  promptMode = "seedance-2.0"
} = {}) {
  const _0x179fae = parseStoryEpisodeSplitResult(_0x319638, {
    'episodeRef': episodeRef,
    'constraints': isStoryMinimaxH3PromptMode(promptMode) ? {
      ...constraints,
      'sceneMaxSeconds': 0xf
    } : constraints,
    'assets': assets,
    'clipPlans': clipPlans,
    'promptMode': promptMode
  });
  const _0x51ae91 = clipPlans["map"](_0x2f886e => normalizeText(_0x2f886e?.['ref']));
  const _0x2f7503 = _0x179fae['clips']['map'](_0x3bb75a => normalizeText(_0x3bb75a?.["ref"]));
  if (_0x51ae91["length"] !== _0x2f7503["length"] || _0x51ae91["some"]((_0x599aa9, _0x1c7420) => _0x599aa9 !== _0x2f7503[_0x1c7420])) {
    throw new Error("Agent 未按当前批次计划逐项返回同 ref 的片段。");
  }
  return _0x179fae;
}
function stripStoryShotSpeakerLabels(_0x47df83 = '') {
  return normalizeText(_0x47df83)["replace"](/(^|[\n；;。！？!?])\s*[\p{Script=Han}A-Za-z0-9·_-]{1,16}\s*[：:]\s*/gu, '$1');
}
function normalizeStoryDialogueComparisonText(_0x4d0c4e = '') {
  return (stripStoryShotSpeakerLabels(_0x4d0c4e)['match'](/[\p{Script=Han}\p{L}\p{N}]/gu) || [])['join']('')["toLowerCase"]();
}
function getStoryDialogueSpeakerPrefix(_0x34a7d5 = '') {
  return String(_0x34a7d5 || '')["trim"]()["match"](/^([\p{Script=Han}A-Za-z0-9·_-]{1,16}\s*[：:]\s*)/u)?.[0x1] || '';
}
function completeStoryEpisodeSplitDialogueSpeaker(_0x1613e0 = '', _0x2d2186 = []) {
  const _0x31d48d = normalizeText(_0x1613e0);
  if (!_0x31d48d || getStoryDialogueSpeakerPrefix(_0x31d48d)) {
    return _0x31d48d;
  }
  const _0x284fbb = normalizeStoryDialogueComparisonText(_0x31d48d);
  if (!_0x284fbb) {
    return _0x31d48d;
  }
  const _0x284341 = [...new Set((Array["isArray"](_0x2d2186) ? _0x2d2186 : [])["filter"](_0xea2c09 => normalizeStoryDialogueComparisonText(_0xea2c09?.['text']) === _0x284fbb)["map"](_0x2765c2 => normalizeText(_0x2765c2?.['speaker']))["filter"](Boolean))];
  return _0x284341['length'] === 0x1 ? _0x284341[0x0] + '：' + _0x31d48d : _0x31d48d;
}
function mergeStoryEpisodeSplitDialogueFragments(_0x2220b1 = [], _0x1e7267 = []) {
  const _0x3f333f = Array['isArray'](_0x2220b1) ? _0x2220b1 : [];
  const _0x38549b = (Array["isArray"](_0x1e7267) ? _0x1e7267 : [])["map"](_0x23aaad => ({
    ..._0x23aaad,
    'text': normalizeText(_0x23aaad?.["text"]),
    'comparisonText': normalizeStoryDialogueComparisonText(_0x23aaad?.["text"])
  }))['filter'](_0x4cad43 => _0x4cad43['text'] && _0x4cad43["comparisonText"]);
  if (!_0x3f333f["length"] || !_0x38549b["length"]) {
    return _0x3f333f;
  }
  const _0xe3565a = new Map();
  let _0x59d6c2 = 0x0;
  _0x38549b["forEach"](_0x2e8734 => {
    let _0x3da8ff = -0x1;
    let _0x1b7aae = -0x1;
    let _0x1de30f = '';
    for (let _0x32d75e = _0x59d6c2; _0x32d75e < _0x3f333f["length"]; _0x32d75e += 0x1) {
      const _0xddffa = normalizeStoryDialogueComparisonText(_0x3f333f[_0x32d75e]?.["dialogue"]);
      if (!_0xddffa) {
        continue;
      }
      if (_0x3da8ff < 0x0) {
        if (!_0x2e8734['comparisonText']["startsWith"](_0xddffa)) {
          continue;
        }
        _0x3da8ff = _0x32d75e;
        _0x1de30f = _0xddffa;
      } else {
        const _0x58dd33 = '' + _0x1de30f + _0xddffa;
        if (!_0x2e8734["comparisonText"]["startsWith"](_0x58dd33)) {
          break;
        }
        _0x1de30f = _0x58dd33;
      }
      if (_0x1de30f === _0x2e8734["comparisonText"]) {
        _0x1b7aae = _0x32d75e;
        break;
      }
    }
    if (_0x3da8ff < 0x0 || _0x1b7aae < _0x3da8ff) {
      return;
    }
    const _0x527666 = _0x3f333f["slice"](_0x3da8ff, _0x1b7aae + 0x1);
    const _0x591589 = _0x527666[0x0];
    const _0x3eb396 = _0x527666['at'](-0x1);
    const _0x246545 = getStoryDialogueSpeakerPrefix(_0x591589?.["dialogue"]) || (normalizeText(_0x2e8734?.["speaker"]) ? normalizeText(_0x2e8734["speaker"]) + '：' : '');
    const _0x1376fc = [...new Map(_0x527666["flatMap"](_0x1c6be6 => Array["isArray"](_0x1c6be6?.["assetUsages"]) ? _0x1c6be6["assetUsages"] : [])['map'](_0x4561d7 => [normalizeText(_0x4561d7?.["assetRef"]) + '|' + normalizeText(_0x4561d7?.["appearanceRef"]), _0x4561d7]))["values"]()];
    const _0x263c3d = [...new Set(_0x527666["map"](_0xd52d60 => normalizeText(_0xd52d60?.['audio']))["filter"](Boolean))]["join"]('；');
    _0xe3565a["set"](_0x3da8ff, {
      'endIndex': _0x1b7aae,
      'shot': {
        ..._0x591589,
        'durationSec': Number(_0x527666['reduce']((_0x4d615e, _0x13940b) => _0x4d615e + Number(_0x13940b?.["durationSec"] || 0x0), 0x0)["toFixed"](0x1)),
        ...(Number["isInteger"](Number(_0x591589?.["startSec"])) && Number["isInteger"](Number(_0x3eb396?.['endSec'])) ? {
          'startSec': Number(_0x591589["startSec"]),
          'endSec': Number(_0x3eb396["endSec"])
        } : {}),
        'assetUsages': _0x1376fc,
        'assetRefs': [...new Set(_0x1376fc['map'](_0x219c34 => normalizeText(_0x219c34?.["assetRef"]))["filter"](Boolean))],
        'dialogue': '' + _0x246545 + _0x2e8734["text"],
        'audio': _0x263c3d,
        'cutAfter': normalizeText(_0x3eb396?.['cutAfter']) === "forbidden" ? "allowed" : normalizeText(_0x3eb396?.['cutAfter']) || "preferred"
      }
    });
    _0x59d6c2 = _0x1b7aae + 0x1;
  });
  if (!_0xe3565a["size"]) {
    return _0x3f333f;
  }
  const _0x2bcfb9 = [];
  for (let _0x4296d9 = 0x0; _0x4296d9 < _0x3f333f["length"]; _0x4296d9 += 0x1) {
    const _0x1f8432 = _0xe3565a["get"](_0x4296d9);
    if (!_0x1f8432) {
      _0x2bcfb9['push'](_0x3f333f[_0x4296d9]);
      continue;
    }
    _0x2bcfb9["push"](_0x1f8432["shot"]);
    _0x4296d9 = _0x1f8432["endIndex"];
  }
  return _0x2bcfb9;
}
function normalizeStoryEpisodeSplitShotCamera(_0x4f1e1b = '') {
  const _0x49462d = normalizeText(_0x4f1e1b);
  return _0x49462d["replace"](/再切(?:至|到)/gu, "，随后镜头连续调整构图至")['replace'](/再切/gu, "，随后镜头连续调整构图")["replace"](/转场(?:至|到)/gu, '，镜头平滑衔接至')["replace"](/转场/gu, "，镜头平滑衔接")["replace"](/镜头切换(?:至|到)|镜头切(?:至|到)/gu, "镜头连续调整构图至")["replace"](/切至|切到/gu, '，镜头连续调整构图至')["replace"](/镜头切换/gu, "镜头连续调整构图")["replace"](/，{2,}/gu, '，')['replace'](/^，/u, '');
}
function normalizeStoryEpisodeSplitShot(_0x16b722 = {}, {
  clipTitle = '片段',
  index = 0x0,
  assetCatalog = buildStoryEpisodeSplitAssetCatalog(),
  fallbacks = {},
  allowEmptyAudio = !![],
  includeCutAfter = ![],
  includeTimeline = ![]
} = {}) {
  const _0x9ded72 = normalizePositiveNumber(_0x16b722?.['durationSec'] || _0x16b722?.["durationSeconds"]) || normalizePositiveNumber(fallbacks?.['durationSec']);
  const _0x57d63e = normalizeText(_0x16b722?.["time"]) || normalizeText(fallbacks?.['time']);
  const _0x4f5bc2 = normalizeText(_0x16b722?.["visual"]) || normalizeText(fallbacks?.['visual']);
  const _0x1eea96 = normalizeText(_0x16b722?.["camera"]) || normalizeText(fallbacks?.['camera']);
  const _0x4058d2 = normalizeText(_0x16b722?.["audio"]) || normalizeText(fallbacks?.["audio"]);
  if (!_0x9ded72 || !_0x4f5bc2 || !_0x1eea96 || !allowEmptyAudio && !_0x4058d2) {
    throw new Error("片段“" + clipTitle + "”的分镜 " + (index + 0x1) + " 缺少 durationSec、visual、camera 或 audio。");
  }
  const _0x15e27e = "片段“" + clipTitle + "”的分镜 " + (index + 0x1);
  const _0x1d15c3 = normalizeStoryEpisodeSplitShotCamera(_0x1eea96);
  const _0x2df3a4 = normalizeText(_0x16b722?.["transitionFromPrevious"] || fallbacks?.["transitionFromPrevious"]);
  const _0x22a956 = normalizeText(_0x16b722?.["dialogue"]);
  const _0x1a8fa8 = normalizeText(_0x16b722?.["voiceover"]);
  const _0x1a9418 = normalizeText(_0x16b722?.['cutAfter'] || fallbacks?.['cutAfter'])["toLowerCase"]();
  const _0xecbdfd = ["preferred", "allowed", 'forbidden']["includes"](_0x1a9418) ? _0x1a9418 : "allowed";
  const _0x3b27bf = Number(_0x9ded72);
  const _0x2753fe = Number(_0x16b722?.["startSec"]);
  const _0x51b4b3 = Number(_0x16b722?.["endSec"]);
  if (includeTimeline && (!Number["isInteger"](_0x2753fe) || _0x2753fe < 0x0 || !Number["isInteger"](_0x51b4b3) || _0x51b4b3 <= _0x2753fe || _0x51b4b3 - _0x2753fe !== _0x3b27bf)) {
    throw new Error('片段“' + clipTitle + "”的分镜 " + (index + 0x1) + " 必须提供连续整数 startSec/endSec，且 durationSec 等于二者之差。");
  }
  const _0x4a9072 = Array["isArray"](_0x16b722?.["assetUsages"]) ? _0x16b722["assetUsages"] : normalizeStringArray(_0x16b722?.["assetRefs"])['map'](_0xf85aca => {
    const _0x207e83 = assetCatalog["assetByRef"]["get"](_0xf85aca);
    if (_0x207e83) {
      return {
        'assetRef': _0xf85aca,
        'appearanceRef': _0x207e83['appearanceRefs'][0x0] || ''
      };
    }
    const _0x2983df = assetCatalog['appearanceOwnerRefsByRef']['get'](_0xf85aca);
    if (_0x2983df?.['size'] === 0x1) {
      return {
        'assetRef': [..._0x2983df][0x0],
        'appearanceRef': _0xf85aca
      };
    }
    if (_0x2983df?.["size"] > 0x1) {
      const _0x26ec04 = resolveStoryEpisodeSplitLegacyAppearanceOwner(_0xf85aca, _0x2983df, assetCatalog, _0x16b722);
      if (_0x26ec04) {
        return {
          'assetRef': _0x26ec04,
          'appearanceRef': _0xf85aca
        };
      }
      throw new Error(_0x15e27e + "的旧形象引用“" + _0xf85aca + '”存在多个所属资产；请同时提供\x20assetRef\x20和\x20appearanceRef。');
    }
    const _0x5364b1 = resolveStoryEpisodeSplitUnknownLegacyAppearance(_0xf85aca, assetCatalog, _0x16b722);
    if (_0x5364b1) {
      return {
        'assetRef': _0x5364b1["assetRef"],
        'appearanceRef': _0x5364b1["defaultAppearanceRef"]
      };
    }
    return {
      'assetRef': _0xf85aca,
      'appearanceRef': ''
    };
  });
  const _0x4da7df = _0x4a9072["map"](_0x3c1f4e => normalizeStoryEpisodeSplitAssetUsage(_0x3c1f4e, assetCatalog, _0x15e27e));
  const _0x226e43 = [...new Set(_0x4da7df["map"](_0x49e2cf => _0x49e2cf["assetRef"]))];
  return {
    'durationSec': _0x3b27bf,
    ...(includeTimeline ? {
      'startSec': _0x2753fe,
      'endSec': _0x51b4b3
    } : {}),
    'time': _0x57d63e,
    'assetUsages': _0x4da7df,
    'assetRefs': _0x226e43,
    'visual': _0x4f5bc2,
    'camera': _0x1d15c3,
    ...(_0x2df3a4 ? {
      'transitionFromPrevious': _0x2df3a4
    } : {}),
    'dialogue': _0x22a956,
    'voiceover': _0x1a8fa8,
    'audio': _0x4058d2,
    ...(includeCutAfter ? {
      'cutAfter': _0xecbdfd
    } : {})
  };
}
const STORY_EPISODE_CHARACTER_SINGULAR_REFERENCE_PATTERN = /(?:他|她|此人|那人|对方|来者|男人|女人|男孩|女孩|少年|少女|老人|老者|人物|角色|人影|身影)/u;
const STORY_EPISODE_CHARACTER_GROUP_REFERENCE_PATTERN = /(?:他们|她们|两人|二人|双方|众人|人群|一行人)/u;
const STORY_EPISODE_CHARACTER_ACTION_PATTERN = /(?:面部|脸上|眼神|目光|手部|双手|手指|脚步|背影|呼吸|喘息|开口|说(?:道|话)?|回答|走|跑|转身|回头|抬头|低头|俯身|起身|检查|观察|看向|望向|握住|伸手|跪|站|坐)/u;
const STORY_EPISODE_EXPLICIT_ENVIRONMENT_SHOT_PATTERN = /(?:空镜|无人|纯环境镜头)/u;
const STORY_EPISODE_AUDIO_ONLY_CHARACTER_REFERENCE_PATTERN = /(?:O\.?S\.?|V\.?O\.?|画外音|旁白|声音|语音|录音|音频|电话|通话|广播|扬声器|耳机|对讲机|传声器)/iu;
const STORY_EPISODE_CHARACTER_VISUAL_PRESENCE_PATTERN = /(?:本人|本尊|出镜|入镜|现身|身影|面部|脸上|眼神|目光|手部|双手|手指|脚步|背影|走|跑|转身|回头|抬头|低头|俯身|起身|检查|观察|看向|望向|握住|伸手|跪|站|坐|躺|进入|离开)/u;
const STORY_EPISODE_INDIRECT_CHARACTER_REFERENCE_PATTERN = /(?:回忆|提到|提及|说起|谈及|复述|指出|说明|承认|表示|交代|声称|听见|得知|想到|想起|记得|名单|记录|编号|权限|办公室|命令|委托)/u;
const STORY_EPISODE_CHARACTER_VISIBLE_SUBJECT_PATTERN = /^(?:(?:本人|正|正在|随即|缓慢|突然|仍|继续|立刻|艰难|猛地|轻轻)\s*)?(?:盯|看|望|走|跑|站|坐|躺|跪|转身|回头|抬头|低头|俯身|起身|检查|观察|握住|伸手|扶住|抓住|推开|拉住|抱住|哭|笑|点头|摇头|开口|指向|面对|递出|接过|拿起|放下|冲向|进入|离开)/u;
const STORY_EPISODE_CHARACTER_VISIBLE_OBJECT_PATTERN = /(?:面对|看向|望向|盯着|扶住|抓住|推开|拉住|抱住|递给|靠近|转向|照片中的|屏幕中的)$/u;
function getStoryEpisodeSplitShotCharacterText(_0x5e3ac5 = {}) {
  return [_0x5e3ac5?.["visual"], _0x5e3ac5?.["camera"]]["map"](normalizeText)["filter"](Boolean)['join']('\x20');
}
function hasStoryEpisodeSplitVisualCharacterReference(_0x257c3a, _0x1a791e) {
  if (normalizeText(_0x257c3a?.["camera"])["includes"](_0x1a791e)) {
    return !![];
  }
  const _0x2b04c9 = normalizeText(_0x257c3a?.["visual"])["split"](/[，,。；;！？!?：:\r\n]+/u)['map'](_0x9a1d5b => _0x9a1d5b["trim"]())['filter'](_0x3de210 => _0x3de210["includes"](_0x1a791e));
  return _0x2b04c9["some"](_0x510c00 => {
    const _0x660df6 = _0x510c00["indexOf"](_0x1a791e);
    const _0x1e7bb6 = _0x510c00["slice"](0x0, _0x660df6);
    const _0x23aa6b = _0x510c00['slice'](_0x660df6 + _0x1a791e['length']);
    const _0x440144 = STORY_EPISODE_CHARACTER_VISIBLE_SUBJECT_PATTERN['test'](_0x23aa6b) || STORY_EPISODE_CHARACTER_VISIBLE_OBJECT_PATTERN["test"](_0x1e7bb6) || STORY_EPISODE_CHARACTER_VISUAL_PRESENCE_PATTERN["test"](_0x23aa6b["slice"](0x0, 0xc));
    if (_0x440144) {
      return !![];
    }
    if (STORY_EPISODE_AUDIO_ONLY_CHARACTER_REFERENCE_PATTERN["test"](_0x510c00)) {
      return ![];
    }
    return !STORY_EPISODE_INDIRECT_CHARACTER_REFERENCE_PATTERN["test"](_0x510c00);
  });
}
function completeStoryEpisodeSplitCharacterAssetUsages(_0xde7bf1 = [], {
  clipPlan = null,
  assetCatalog = buildStoryEpisodeSplitAssetCatalog(),
  clipTitle = '片段',
  requireAllPlanCharacters = !![]
} = {}) {
  const _0x28a84a = [...new Set(normalizeStringArray(clipPlan?.["characterAssetRefs"])["filter"](_0x56d58e => assetCatalog["assetByRef"]['get'](_0x56d58e)?.["kind"] === "character"))];
  const _0x4ba373 = [...assetCatalog["assetByRef"]["values"]()]["filter"](_0x4a0718 => _0x4a0718["kind"] === 'character')["map"](_0xeeafdb => _0xeeafdb["assetRef"]);
  if (!_0x4ba373["length"]) {
    return _0xde7bf1;
  }
  const _0x16208f = new Set();
  let _0x5a877b = [];
  const _0x12933a = _0xde7bf1["map"]((_0x262768, _0x4c3da2) => {
    const _0x2ef0c6 = getStoryEpisodeSplitShotCharacterText(_0x262768);
    const _0x4de10c = new Set(_0x262768["assetUsages"]["map"](_0x1923ff => _0x1923ff["assetRef"]));
    const _0x3e691a = _0x4ba373["filter"](_0x317035 => _0x4de10c["has"](_0x317035));
    const _0x41e952 = _0x4ba373["filter"](_0xbeda7d => {
      const _0x3035eb = assetCatalog["assetByRef"]["get"](_0xbeda7d)?.["name"];
      return _0x3035eb && hasStoryEpisodeSplitVisualCharacterReference(_0x262768, _0x3035eb);
    });
    let _0x3c2d51 = [...new Set([..._0x3e691a, ..._0x41e952])];
    if (!_0x3c2d51["length"]) {
      const _0x4d3b0f = STORY_EPISODE_EXPLICIT_ENVIRONMENT_SHOT_PATTERN['test'](_0x2ef0c6);
      if (!_0x4d3b0f && _0x28a84a["length"] === 0x1 && (STORY_EPISODE_CHARACTER_SINGULAR_REFERENCE_PATTERN['test'](_0x2ef0c6) || STORY_EPISODE_CHARACTER_ACTION_PATTERN["test"](_0x2ef0c6) || normalizeText(_0x262768?.["dialogue"]) || normalizeText(_0x262768?.["voiceover"]))) {
        _0x3c2d51 = [..._0x28a84a];
      } else {
        if (!_0x4d3b0f && _0x5a877b["length"] && STORY_EPISODE_CHARACTER_GROUP_REFERENCE_PATTERN["test"](_0x2ef0c6)) {
          _0x3c2d51 = [..._0x5a877b];
        } else {
          !_0x4d3b0f && _0x5a877b["length"] === 0x1 && STORY_EPISODE_CHARACTER_SINGULAR_REFERENCE_PATTERN['test'](_0x2ef0c6) && (_0x3c2d51 = [..._0x5a877b]);
        }
      }
    }
    const _0x3f3dcd = [..._0x262768["assetUsages"]];
    for (const _0x47b06e of _0x3c2d51) {
      _0x16208f["add"](_0x47b06e);
      if (_0x4de10c["has"](_0x47b06e)) {
        continue;
      }
      const _0x3841b3 = assetCatalog["assetByRef"]["get"](_0x47b06e)?.["name"] || _0x47b06e;
      _0x3f3dcd['push'](normalizeStoryEpisodeSplitAssetUsage({
        'assetRef': _0x47b06e,
        'appearanceRef': ''
      }, assetCatalog, '片段“' + clipTitle + "”的分镜 " + (_0x4c3da2 + 0x1) + '\x20自动补全人物“' + _0x3841b3 + '”'));
      _0x4de10c["add"](_0x47b06e);
    }
    if (_0x3c2d51["length"]) {
      _0x5a877b = _0x3c2d51;
    }
    return {
      ..._0x262768,
      'assetUsages': _0x3f3dcd,
      'assetRefs': [...new Set(_0x3f3dcd['map'](_0x3591a9 => _0x3591a9["assetRef"]))]
    };
  });
  const _0x16dd88 = _0x28a84a["filter"](_0x29a9bf => !_0x16208f["has"](_0x29a9bf));
  if (requireAllPlanCharacters && _0x16dd88["length"]) {
    const _0x540019 = _0x16dd88["map"](_0x2006da => assetCatalog['assetByRef']["get"](_0x2006da)?.["name"] || _0x2006da);
    throw new Error("片段“" + clipTitle + "”人物资产引用不完整：蓝图人物“" + _0x540019["join"]('、') + "”未出现在任何分镜的 assetUsages 中。");
  }
  return _0x12933a;
}
function completeStoryEpisodeSplitSceneAssetUsage(_0x211edd = [], {
  clipPlan = null,
  assetCatalog = buildStoryEpisodeSplitAssetCatalog(),
  clipTitle = '片段'
} = {}) {
  if (!_0x211edd['length']) {
    return _0x211edd;
  }
  const _0x40fef2 = normalizeText(clipPlan?.["sceneAssetRef"]);
  if (!_0x40fef2 || assetCatalog["assetByRef"]["get"](_0x40fef2)?.["kind"] !== "scene") {
    return _0x211edd;
  }
  const _0x26242a = _0x211edd["some"](_0x717f40 => _0x717f40["assetUsages"]["some"](_0x527ccd => _0x527ccd['assetRef'] === _0x40fef2));
  if (_0x26242a) {
    return _0x211edd;
  }
  const _0x34c853 = normalizeStoryEpisodeSplitAssetUsage({
    'assetRef': _0x40fef2,
    'appearanceRef': normalizeText(clipPlan?.["sceneAppearanceRef"])
  }, assetCatalog, "片段“" + clipTitle + '”自动补全场景');
  return _0x211edd["map"]((_0x2b9da0, _0x5d33e8) => {
    if (_0x5d33e8 !== 0x0) {
      return _0x2b9da0;
    }
    const _0x5ea729 = [_0x34c853, ..._0x2b9da0['assetUsages']];
    return {
      ..._0x2b9da0,
      'assetUsages': _0x5ea729,
      'assetRefs': [...new Set(_0x5ea729["map"](_0x317ad8 => _0x317ad8['assetRef']))]
    };
  });
}
function formatStoryEpisodeClipTitle(_0x7bc306 = 0x0) {
  return '片段' + String(_0x7bc306 + 0x1)["padStart"](0x2, '0');
}
function validateStoryEpisodeSplitClipIndependence({
  clipLabel = '片段',
  script = '',
  creativeIntent = '',
  transition = ''
} = {}) {
  const _0x4df0d3 = [script, creativeIntent, transition]["join"]('\x20');
  const _0x14ea96 = _0x4df0d3["match"](/当前为原片段第\s*\d+\s*\/\s*\d+\s*段|原片段第\s*\d+\s*\/\s*\d+\s*段|承接(?:上一|下一)片段|参见(?:上一|下一)片段/u);
  if (_0x14ea96) {
    throw new Error(clipLabel + '\x20包含依赖其他视频上下文的描述“' + _0x14ea96[0x0] + "”，每个片段必须独立完整。");
  }
}
function normalizeStoryEpisodeExperimentalStandaloneText(_0x73216f = '') {
  return normalizeText(_0x73216f)["replace"](/当前为原片段第\s*\d+\s*\/\s*\d+\s*段/gu, '当前剧情段落')["replace"](/原片段第\s*\d+\s*\/\s*\d+\s*段/gu, "当前剧情段落")["replace"](/承接(?:上一|下一)片段/gu, "从当前可观察状态开始")['replace'](/参见(?:上一|下一)片段/gu, '以当前画面状态为准')["replace"](/(?:上一|下一)片段/gu, "相邻剧情");
}
function getStoryEpisodeSplitShotsDuration(_0xa6dcb9 = []) {
  return _0xa6dcb9["reduce"]((_0x53431b, _0x5512d2) => _0x53431b + Number(_0x5512d2?.["durationSec"] || 0x0), 0x0);
}
function tokenizeStoryEpisodeExperimentalShotText(_0x34b153 = '', {
  preserveSpeaker = ![]
} = {}) {
  const _0x3ab847 = String(_0x34b153 || '')['trim']();
  if (!_0x3ab847) {
    return [];
  }
  const _0x414093 = [];
  const _0x4ad451 = preserveSpeaker ? _0x3ab847['split'](/\n+/u) : [_0x3ab847];
  _0x4ad451["forEach"](_0x1a0563 => {
    const _0x39e571 = _0x1a0563["trim"]();
    if (!_0x39e571) {
      return;
    }
    const _0x2177f1 = preserveSpeaker ? _0x39e571["match"](/^([^：:\n]{1,20}[：:])\s*(.*)$/u) : null;
    const _0x145fe7 = _0x2177f1?.[0x1] || '';
    const _0x41780c = _0x2177f1?.[0x2] || _0x39e571;
    const _0x24abcc = _0x41780c["match"](preserveSpeaker ? /[^。！？!?\n]+(?:[。！？!?]+|$)/gu : /[^。！？!?；;，,\n]+(?:[。！？!?；;，,]+|$)/gu) || [_0x41780c];
    _0x24abcc['map'](_0xe6a9f3 => _0xe6a9f3["trim"]())["filter"](Boolean)["forEach"](_0x2ae4e6 => {
      _0x414093["push"]('' + _0x145fe7 + _0x2ae4e6);
    });
  });
  return _0x414093;
}
function splitStoryEpisodeExperimentalClause(_0x126b2c = '', _0x129fc7 = ![]) {
  const _0x4bee3f = _0x129fc7 ? _0x126b2c["match"](/^([^：:\n]{1,20}[：:])(.*)$/u) : null;
  const _0x59301f = _0x4bee3f?.[0x1] || '';
  const _0x55609b = _0x4bee3f?.[0x2] || _0x126b2c;
  const _0x379d92 = [..._0x55609b];
  if (_0x379d92['length'] < 0x2) {
    return [_0x126b2c];
  }
  const _0x1041bd = Math['ceil'](_0x379d92["length"] / 0x2);
  return ['' + _0x59301f + _0x379d92["slice"](0x0, _0x1041bd)["join"](''), '' + _0x59301f + _0x379d92["slice"](_0x1041bd)["join"]('')];
}
function splitStoryEpisodeExperimentalShotText(_0x45c8ff = '', _0x5420e0 = 0x1, {
  preserveSpeaker = ![],
  splitFragments = !![]
} = {}) {
  const _0x2b608c = Math['max'](0x1, Math["trunc"](Number(_0x5420e0) || 0x1));
  const _0x358b91 = tokenizeStoryEpisodeExperimentalShotText(_0x45c8ff, {
    'preserveSpeaker': preserveSpeaker
  });
  while (splitFragments && _0x358b91['length'] && _0x358b91['length'] < _0x2b608c) {
    let _0x4df0c3 = 0x0;
    for (let _0x2dc92d = 0x1; _0x2dc92d < _0x358b91["length"]; _0x2dc92d += 0x1) {
      if ([..._0x358b91[_0x2dc92d]]["length"] > [..._0x358b91[_0x4df0c3]]["length"]) {
        _0x4df0c3 = _0x2dc92d;
      }
    }
    const _0x524445 = splitStoryEpisodeExperimentalClause(_0x358b91[_0x4df0c3], preserveSpeaker);
    if (_0x524445['length'] < 0x2) {
      break;
    }
    _0x358b91["splice"](_0x4df0c3, 0x1, ..._0x524445);
  }
  if (!_0x358b91['length']) {
    return Array["from"]({
      'length': _0x2b608c
    }, () => '');
  }
  if (!splitFragments && _0x358b91['length'] < _0x2b608c) {
    const _0x554f54 = Array["from"]({
      'length': _0x2b608c
    }, () => '');
    _0x358b91["forEach"]((_0x342dca, _0x407da4) => {
      const _0x8dc7d5 = Math["min"](_0x2b608c - 0x1, Math["floor"](_0x407da4 * _0x2b608c / _0x358b91["length"]));
      _0x554f54[_0x8dc7d5] = _0x554f54[_0x8dc7d5] ? _0x554f54[_0x8dc7d5] + '\x0a' + _0x342dca : _0x342dca;
    });
    return _0x554f54;
  }
  const _0x57afc2 = [];
  let _0xfc44c5 = 0x0;
  for (let _0x42906b = 0x0; _0x42906b < _0x2b608c; _0x42906b += 0x1) {
    const _0x18f8d1 = _0x2b608c - _0x42906b;
    const _0x5f53b1 = _0x358b91["length"] - _0xfc44c5;
    if (_0x5f53b1 <= 0x0) {
      _0x57afc2["push"]('');
      continue;
    }
    if (_0x18f8d1 === 0x1) {
      _0x57afc2["push"](_0x358b91['slice'](_0xfc44c5)["join"](preserveSpeaker ? '\x0a' : ''));
      _0xfc44c5 = _0x358b91['length'];
      continue;
    }
    const _0x11f8ea = Math["max"](0x1, _0x5f53b1 - (_0x18f8d1 - 0x1));
    const _0x4a70f1 = _0x358b91["slice"](_0xfc44c5)["reduce"]((_0x256507, _0x498377) => _0x256507 + [..._0x498377]["length"], 0x0);
    const _0x64edaf = _0x4a70f1 / _0x18f8d1;
    let _0x273618 = 0x1;
    let _0x59715b = [..._0x358b91[_0xfc44c5]]["length"];
    while (_0x273618 < _0x11f8ea && _0x59715b < _0x64edaf) {
      _0x59715b += [..._0x358b91[_0xfc44c5 + _0x273618]]["length"];
      _0x273618 += 0x1;
    }
    _0x57afc2["push"](_0x358b91["slice"](_0xfc44c5, _0xfc44c5 + _0x273618)['join'](preserveSpeaker ? '\x0a' : ''));
    _0xfc44c5 += _0x273618;
  }
  return _0x57afc2;
}
function splitStoryEpisodeExperimentalOverlongEntry(_0x3e2ddd = {}, {
  maximum = 0xf,
  targetMaximum = maximum,
  entryIndex = 0x0
} = {}) {
  const _0x186966 = _0x3e2ddd?.["shot"] || {};
  const _0x33d405 = normalizePositiveNumber(_0x186966?.["durationSec"]);
  if (!_0x33d405 || _0x33d405 <= maximum + 0.001) {
    return [_0x3e2ddd];
  }
  const _0x16cffc = Math['max'](0x1, normalizePositiveNumber(targetMaximum) || maximum);
  const _0x2c68bf = Math["max"](0x2, Math["ceil"](_0x33d405 / _0x16cffc));
  const _0x2e1f50 = splitStoryEpisodeExperimentalShotText(_0x186966['visual'], _0x2c68bf, {
    'splitFragments': ![]
  });
  const _0x5b6ed2 = splitStoryEpisodeExperimentalShotText(_0x186966["dialogue"], _0x2c68bf, {
    'preserveSpeaker': !![],
    'splitFragments': ![]
  });
  const _0x737a5c = splitStoryEpisodeExperimentalShotText(_0x186966["voiceover"], _0x2c68bf, {
    'preserveSpeaker': !![],
    'splitFragments': ![]
  });
  const _0x38ea3e = splitStoryEpisodeExperimentalShotText(_0x186966["audio"], _0x2c68bf, {
    'splitFragments': ![]
  });
  let _0x368467 = Number(_0x33d405["toFixed"](0x1));
  const _0x27df6e = normalizeText(_0x3e2ddd?.['sourceClip']?.["ref"]) || 'clip-' + (entryIndex + 0x1);
  return Array['from']({
    'length': _0x2c68bf
  }, (_0x3585fc, _0x14c8a3) => {
    const _0x21e681 = _0x2c68bf - _0x14c8a3;
    const _0x2c8e9e = _0x14c8a3 === _0x2c68bf - 0x1 ? _0x368467 : Number((_0x368467 / _0x21e681)["toFixed"](0x1));
    _0x368467 = Number((_0x368467 - _0x2c8e9e)["toFixed"](0x1));
    const _0x35f631 = _0x2e1f50[_0x14c8a3] || normalizeText(_0x186966["visual"]);
    const _0x252e43 = _0x5b6ed2[_0x14c8a3] || '';
    const _0x246bf6 = _0x737a5c[_0x14c8a3] || '';
    const _0x16ceff = _0x38ea3e[_0x14c8a3] || '';
    return {
      ..._0x3e2ddd,
      'sourceClip': {
        ..._0x3e2ddd["sourceClip"],
        'ref': _0x27df6e + "-local-part-" + (entryIndex + 0x1) + '-' + (_0x14c8a3 + 0x1),
        'script': [_0x35f631, _0x252e43, _0x246bf6]['filter'](Boolean)["join"]('\x20'),
        'transition': _0x14c8a3 === _0x2c68bf - 0x1 ? normalizeText(_0x3e2ddd?.['sourceClip']?.['transition']) : "当前动作在下一镜中连续完成。"
      },
      'shot': {
        ..._0x186966,
        'durationSec': _0x2c8e9e,
        'visual': _0x35f631,
        'dialogue': _0x252e43,
        'voiceover': _0x246bf6,
        'audio': _0x16ceff,
        'cutAfter': _0x14c8a3 === _0x2c68bf - 0x1 ? normalizeText(_0x186966?.["cutAfter"]) || "allowed" : "allowed"
      }
    };
  });
}
function compareStoryEpisodeExperimentalPartitionCandidate(_0x456e79, _0xbcfd36) {
  if (!_0xbcfd36) {
    return -0x1;
  }
  if (_0x456e79["groupCount"] !== _0xbcfd36["groupCount"]) {
    return _0x456e79['groupCount'] - _0xbcfd36['groupCount'];
  }
  return _0x456e79['penalty'] - _0xbcfd36["penalty"];
}
function partitionStoryEpisodeExperimentalSceneShots(_0x1ddbf8 = [], {
  maxDurationSeconds = 0xf,
  minDurationSeconds = STORY_EPISODE_EXPERIMENTAL_MIN_CLIP_DURATION_SECONDS
} = {}) {
  if (!_0x1ddbf8['length']) {
    return [];
  }
  const _0x5e5663 = Math['max'](0x1, normalizePositiveNumber(maxDurationSeconds) || 0xf);
  const _0x161b10 = Math["max"](0x0, normalizePositiveNumber(minDurationSeconds) || 0x0);
  _0x1ddbf8 = _0x1ddbf8["flatMap"]((_0x518f65, _0x1d2471) => splitStoryEpisodeExperimentalOverlongEntry(_0x518f65, {
    'maximum': _0x5e5663,
    'targetMaximum': _0x5e5663,
    'entryIndex': _0x1d2471
  }));
  const _0x8962d0 = Math['max'](_0x161b10, _0x5e5663 * 0.68);
  const _0x5b853e = new Map();
  const _0x5f45e0 = _0x3e94a8 => {
    if (_0x3e94a8 >= _0x1ddbf8["length"]) {
      return {
        'groupCount': 0x0,
        'penalty': 0x0,
        'groups': []
      };
    }
    if (_0x5b853e["has"](_0x3e94a8)) {
      return _0x5b853e["get"](_0x3e94a8);
    }
    let _0x498c02 = 0x0;
    let _0x4d4d88 = null;
    for (let _0x42161d = _0x3e94a8; _0x42161d < _0x1ddbf8['length']; _0x42161d += 0x1) {
      const _0x161c5b = _0x42161d - _0x3e94a8 + 0x1;
      if (_0x161c5b > STORY_EPISODE_EXPERIMENTAL_MAX_FINAL_SHOTS_PER_CLIP) {
        break;
      }
      _0x498c02 += Number(_0x1ddbf8[_0x42161d]?.["shot"]?.["durationSec"] || 0x0);
      if (_0x498c02 > _0x5e5663 + 0.001) {
        break;
      }
      const _0x19b979 = _0x5f45e0(_0x42161d + 0x1);
      if (!_0x19b979) {
        continue;
      }
      const _0x1d86ec = normalizeText(_0x1ddbf8[_0x42161d]?.['shot']?.["cutAfter"])["toLowerCase"]();
      const _0x10ec17 = _0x42161d === _0x1ddbf8["length"] - 0x1 || _0x1d86ec === "preferred" ? 0x0 : _0x1d86ec === "forbidden" ? 0x9c4 : 0x19;
      const _0xbd25d2 = _0x498c02 < _0x161b10 ? (_0x161b10 - _0x498c02) * 0x12c : 0x0;
      const _0x352a6e = (_0x498c02 - _0x8962d0) ** 0x2;
      const _0x4827fe = (_0x161c5b - STORY_EPISODE_EXPERIMENTAL_PREFERRED_SHOTS_PER_CLIP) ** 0x2 * 0x4b + (_0x161c5b < 0x3 ? (0x3 - _0x161c5b) * 0x1f4 : 0x0);
      const _0x108091 = {
        'groupCount': _0x19b979["groupCount"] + 0x1,
        'penalty': _0x19b979["penalty"] + _0x10ec17 + _0xbd25d2 + _0x352a6e + _0x4827fe,
        'groups': [_0x1ddbf8["slice"](_0x3e94a8, _0x42161d + 0x1), ..._0x19b979["groups"]]
      };
      compareStoryEpisodeExperimentalPartitionCandidate(_0x108091, _0x4d4d88) < 0x0 && (_0x4d4d88 = _0x108091);
    }
    _0x5b853e["set"](_0x3e94a8, _0x4d4d88);
    return _0x4d4d88;
  };
  const _0x78df22 = _0x5f45e0(0x0);
  if (!_0x78df22) {
    const _0x45e5dc = _0x1ddbf8["find"](_0x4f1d2e => Number(_0x4f1d2e?.["shot"]?.["durationSec"] || 0x0) > _0x5e5663 + 0.001);
    const _0x3bdd74 = Number(_0x45e5dc?.["shot"]?.["durationSec"] || 0x0);
    throw new Error(_0x3bdd74 ? "实验分镜存在单镜 " + _0x3bdd74['toFixed'](0x1) + " 秒，超过 " + _0x5e5663 + '\x20秒上限；单镜必须由\x20Agent\x20拆成连续镜头。' : "实验分镜无法在场景内组成有效视频片段。");
  }
  return _0x78df22["groups"];
}
function joinStoryEpisodeExperimentalClipText(_0x3d0ea0 = []) {
  return [...new Set(_0x3d0ea0["map"](normalizeText)["filter"](Boolean))]["join"]('；');
}
export function repackStoryEpisodeExperimentalClips({
  episodeRef = '',
  clipPlans = [],
  completedPlanResults = [],
  maxDurationSeconds = 0xf,
  minDurationSeconds = STORY_EPISODE_EXPERIMENTAL_MIN_CLIP_DURATION_SECONDS,
  promptExperiment = ![],
  preserveSourceGroups = ![]
} = {}) {
  const _0x19b1f1 = a158_0x4e1501(episodeRef, "episode-1");
  const _0x30d793 = new Map((Array["isArray"](clipPlans) ? clipPlans : [])["map"](_0x13558 => [normalizeText(_0x13558?.["ref"]), _0x13558]));
  const _0x26f286 = new Map((Array['isArray'](completedPlanResults) ? completedPlanResults : [])['map'](_0x918f27 => [normalizeText(_0x918f27?.["sourcePlanRef"]), _0x918f27]));
  const _0x4536fd = [];
  for (const _0x4e6fe8 of _0x30d793['values']()) {
    const _0x4bd325 = _0x26f286["get"](normalizeText(_0x4e6fe8?.["ref"]));
    for (const _0x5def1b of Array["isArray"](_0x4bd325?.["clips"]) ? _0x4bd325['clips'] : []) {
      const _0x53a4a1 = Array['isArray'](_0x5def1b?.["shots"]) ? _0x5def1b["shots"] : [];
      _0x53a4a1["forEach"]((_0xac116e, _0x15676b) => {
        _0x4536fd["push"]({
          'plan': _0x4e6fe8,
          'sourceClip': _0x5def1b,
          'shot': {
            ..._0xac116e,
            'cutAfter': normalizeText(_0xac116e?.["cutAfter"]) || (_0x15676b === _0x53a4a1['length'] - 0x1 ? 'preferred' : 'allowed')
          }
        });
      });
    }
  }
  if (!_0x4536fd["length"]) {
    throw new Error("实验分批没有可用于重组的分镜。");
  }
  if (preserveSourceGroups) {
    const _0x37bf13 = [];
    for (const _0x250fd0 of _0x30d793["values"]()) {
      const _0x4bd79f = _0x26f286["get"](normalizeText(_0x250fd0?.["ref"]));
      for (const _0x2045b8 of Array['isArray'](_0x4bd79f?.["clips"]) ? _0x4bd79f['clips'] : []) {
        const _0x44251b = Array["isArray"](_0x2045b8?.["shots"]) ? _0x2045b8["shots"] : [];
        if (!_0x44251b['length']) {
          continue;
        }
        _0x37bf13["push"]({
          ..._0x2045b8,
          'ref': _0x19b1f1 + "-experimental-clip-" + (_0x37bf13["length"] + 0x1),
          'title': formatStoryEpisodeClipTitle(_0x37bf13["length"]),
          'shots': _0x44251b,
          'contentDurationSec': Number(getStoryEpisodeSplitShotsDuration(_0x44251b)["toFixed"](0x1)),
          'durationSec': Number(getStoryEpisodeSplitShotsDuration(_0x44251b)['toFixed'](0x1)),
          'assetRefs': [...new Set(_0x44251b["flatMap"](_0x10c756 => _0x10c756?.["assetRefs"] || []))],
          'sourcePlanRefs': [normalizeText(_0x250fd0?.["ref"])]['filter'](Boolean)
        });
      }
    }
    return promptExperiment ? addStoryEpisodeDirectorContinuityHandoffs(_0x37bf13) : _0x37bf13;
  }
  const _0x58df60 = [];
  let _0x412afb = [];
  let _0x22aea2 = '';
  _0x4536fd['forEach'](_0x3689bb => {
    const _0x4a053d = [normalizeText(_0x3689bb["plan"]?.["sourceSceneRef"]), normalizeText(_0x3689bb["plan"]?.['sceneAssetRef']), normalizeText(_0x3689bb["plan"]?.['sceneAppearanceRef'])]["join"]('|');
    _0x412afb["length"] && _0x4a053d !== _0x22aea2 && (_0x58df60['push'](_0x412afb), _0x412afb = []);
    _0x22aea2 = _0x4a053d;
    _0x412afb["push"](_0x3689bb);
  });
  if (_0x412afb["length"]) {
    _0x58df60["push"](_0x412afb);
  }
  const _0x24626d = _0x58df60["flatMap"](_0x544931 => partitionStoryEpisodeExperimentalSceneShots(_0x544931, {
    'maxDurationSeconds': maxDurationSeconds,
    'minDurationSeconds': minDurationSeconds
  }));
  const _0x4086e8 = _0x24626d["map"]((_0x1c698b, _0x3bbbc9) => {
    const _0x3f3162 = [...new Map(_0x1c698b["map"](_0x54a132 => [normalizeText(_0x54a132["sourceClip"]?.['ref']), _0x54a132['sourceClip']]))["values"]()];
    const _0x1670c4 = [...new Set(_0x1c698b["map"](_0x33f59f => normalizeText(_0x33f59f["plan"]?.["ref"])))];
    const _0x237238 = _0x1c698b["map"](_0x42f1d7 => _0x42f1d7['shot']);
    const _0x2a3e6c = Number(getStoryEpisodeSplitShotsDuration(_0x237238)["toFixed"](0x1));
    const _0x22b2a5 = Number(Math["max"](normalizePositiveNumber(minDurationSeconds) || 0x0, _0x2a3e6c)['toFixed'](0x1));
    return {
      'ref': _0x19b1f1 + "-experimental-clip-" + (_0x3bbbc9 + 0x1),
      'title': formatStoryEpisodeClipTitle(_0x3bbbc9),
      'script': joinStoryEpisodeExperimentalClipText(_0x3f3162["map"](_0x6fe326 => _0x6fe326?.["script"])),
      'creativeIntent': joinStoryEpisodeExperimentalClipText(_0x3f3162['map'](_0x5f12fd => _0x5f12fd?.["creativeIntent"])),
      'transition': joinStoryEpisodeExperimentalClipText(_0x3f3162["map"](_0x395543 => _0x395543?.["transition"])),
      'shots': _0x237238,
      'contentDurationSec': _0x2a3e6c,
      'durationSec': _0x22b2a5,
      'assetRefs': [...new Set(_0x237238["flatMap"](_0x110e91 => _0x110e91?.["assetRefs"] || []))],
      'sourcePlanRefs': _0x1670c4
    };
  });
  if (!promptExperiment) {
    return _0x4086e8;
  }
  return addStoryEpisodeDirectorContinuityHandoffs(_0x4086e8);
}
function addStoryEpisodeDirectorContinuityHandoffs(_0xc8cb77 = []) {
  return _0xc8cb77["map"]((_0x14b347, _0x3bd33f) => {
    const _0x26b669 = _0x3bd33f > 0x0 ? _0xc8cb77[_0x3bd33f - 0x1] : null;
    const _0x541e4f = _0x26b669?.["shots"]?.['at'](-0x1) || null;
    const _0x336ab8 = _0x14b347?.["shots"]?.[0x0] || null;
    return {
      ..._0x14b347,
      'directorContinuityTest': !![],
      'continuityHandoff': {
        'previousExitState': normalizeText(_0x541e4f?.["visual"]),
        'previousEndCamera': normalizeText(_0x541e4f?.['camera']),
        'currentEntryState': normalizeText(_0x336ab8?.["visual"]),
        'currentOpeningCamera': normalizeText(_0x336ab8?.["camera"]),
        'transitionFromPrevious': normalizeText(_0x336ab8?.['transitionFromPrevious'])
      }
    };
  });
}
function createStoryEpisodeClipDurationError({
  clip = {},
  clipIndex = 0x0,
  clipCount = 0x0,
  sourceShots = [],
  shots = [],
  durationSec = 0x0,
  maxDurationSeconds = 0xf
} = {}) {
  const _0x1aabf4 = formatStoryEpisodeClipTitle(clipIndex);
  const _0x231a3b = Number(durationSec["toFixed"](0x1));
  const _0x418a2f = new Error('片段“' + _0x1aabf4 + "”片段总时长 " + _0x231a3b + " 秒超过 " + maxDurationSeconds + '\x20秒上限；需要由\x20Agent\x20按完整动作节拍、对白轮次或情绪转折重新规划。');
  _0x418a2f["validationDetails"] = {
    'type': "clip_duration_overflow",
    'clip': {
      'index': clipIndex + 0x1,
      'count': clipCount,
      'ref': a158_0x4e1501(clip?.["ref"], "clip-" + (clipIndex + 0x1)),
      'correctedDurationSec': _0x231a3b,
      'maxDurationSec': maxDurationSeconds,
      'overflowSeconds': Number((durationSec - maxDurationSeconds)["toFixed"](0x1)),
      'shots': shots["map"]((_0x2599fb, _0xac25e0) => ({
        'index': _0xac25e0 + 0x1,
        'providedDurationSec': normalizePositiveNumber(sourceShots[_0xac25e0]?.["durationSec"] || sourceShots[_0xac25e0]?.["durationSeconds"]),
        'correctedDurationSec': Number(Number(_0x2599fb["durationSec"])['toFixed'](0x1)),
        'time': _0x2599fb['time'],
        'visual': _0x2599fb["visual"],
        'dialogue': _0x2599fb["dialogue"],
        'voiceover': _0x2599fb['voiceover']
      }))
    }
  };
  return _0x418a2f;
}
function createStoryEpisodeClipDurationConstraintError({
  clip = {},
  clipIndex = 0x0,
  clipCount = 0x0,
  durationSec = 0x0,
  durationConstraints = {}
} = {}) {
  const _0x4dcd44 = formatStoryEpisodeClipTitle(clipIndex);
  const _0x323eef = Number(Number(durationSec)['toFixed'](0x1));
  const _0x27c761 = Array["isArray"](durationConstraints["allowedSeconds"]) ? durationConstraints["allowedSeconds"] : [];
  const _0x16061c = _0x27c761["length"] ? '只允许\x20' + _0x27c761["join"]('、') + '\x20秒' : (durationConstraints['minSeconds'] || 0x0) + " 至 " + (durationConstraints["maxSeconds"] || '不限') + '\x20秒' + (durationConstraints["stepSeconds"] ? "、步进 " + durationConstraints["stepSeconds"] + '\x20秒' : '');
  const _0x2effaf = new Error("片段“" + _0x4dcd44 + "”总时长 " + _0x323eef + '\x20秒不符合当前视频模型时长约束（' + _0x16061c + "）；必须由 Agent 重新分组，客户端未修改原始时长。");
  _0x2effaf["validationDetails"] = {
    'type': "clip_duration_unsupported",
    'clip': {
      'index': clipIndex + 0x1,
      'count': clipCount,
      'ref': a158_0x4e1501(clip?.['ref'], "clip-" + (clipIndex + 0x1)),
      'durationSec': _0x323eef,
      'minDurationSec': durationConstraints["minSeconds"] || 0x0,
      'maxDurationSec': durationConstraints["maxSeconds"] || 0x0,
      'stepDurationSec': durationConstraints["stepSeconds"] || 0x0,
      'allowedDurationSeconds': _0x27c761
    }
  };
  return _0x2effaf;
}
function isStoryEpisodeClipDurationSupported(_0x3666cd, _0x24c2b5 = null) {
  if (!_0x24c2b5) {
    return !![];
  }
  const _0x2452ac = Number(_0x3666cd);
  if (!Number["isFinite"](_0x2452ac) || _0x2452ac <= 0x0) {
    return ![];
  }
  const _0x1a633e = Array["isArray"](_0x24c2b5["allowedSeconds"]) ? _0x24c2b5["allowedSeconds"] : [];
  if (_0x1a633e["length"]) {
    return _0x1a633e["some"](_0x3248b4 => Math["abs"](Number(_0x3248b4) - _0x2452ac) < 0.000001);
  }
  if (_0x24c2b5["minSeconds"] && _0x2452ac < _0x24c2b5["minSeconds"]) {
    return ![];
  }
  if (_0x24c2b5['maxSeconds'] && _0x2452ac > _0x24c2b5["maxSeconds"]) {
    return ![];
  }
  if (_0x24c2b5['stepSeconds']) {
    const _0x4d973c = _0x24c2b5["minSeconds"] || 0x0;
    const _0x39e8c5 = (_0x2452ac - _0x4d973c) / _0x24c2b5['stepSeconds'];
    if (Math['abs'](_0x39e8c5 - Math["round"](_0x39e8c5)) >= 0.000001) {
      return ![];
    }
  }
  return !![];
}
function tokenizeStorySpokenTextAtAuthoredPauses(_0x409f9f = '') {
  const _0x7d4701 = normalizeText(_0x409f9f);
  if (!_0x7d4701) {
    return {
      'speakerPrefix': '',
      'units': []
    };
  }
  const _0x41303f = getStoryDialogueSpeakerPrefix(_0x7d4701);
  const _0x53db1e = _0x41303f ? _0x7d4701["slice"](_0x41303f['length']) : _0x7d4701;
  const _0xe98142 = /(?:…{2,}|\.{3,}|—{2,}|[。！？!?；;])(?:[”"’']+)?/gu;
  const _0x1ab21b = [];
  let _0x34e628 = 0x0;
  let _0x368f85;
  while ((_0x368f85 = _0xe98142["exec"](_0x53db1e)) !== null) {
    const _0x4accda = _0x368f85["index"] + _0x368f85[0x0]['length'];
    const _0x5d141c = _0x53db1e["slice"](_0x34e628, _0x4accda);
    if (_0x5d141c["trim"]()) {
      _0x1ab21b["push"](_0x5d141c);
    }
    _0x34e628 = _0x4accda;
  }
  const _0x231bc5 = _0x53db1e["slice"](_0x34e628);
  if (_0x231bc5['trim']()) {
    _0x1ab21b["push"](_0x231bc5);
  }
  const _0x6a7fca = [];
  _0x1ab21b['forEach'](_0x329f0e => {
    if (/^[\s“”"'‘’…—.]+$/u['test'](_0x329f0e) && _0x6a7fca["length"]) {
      _0x6a7fca[_0x6a7fca["length"] - 0x1] += _0x329f0e;
      return;
    }
    _0x6a7fca["push"](_0x329f0e);
  });
  return {
    'speakerPrefix': _0x41303f,
    'units': _0x6a7fca
  };
}
function getStorySpokenSegmentMinimumSeconds(_0x257d9e = {}, _0x11c035 = '', _0x3dec83 = '') {
  return countStorySpokenUnits(_0x3dec83) / STORY_MAX_SPOKEN_UNITS_PER_SECOND;
}
function getStorySpokenChunkText(_0x3752a8 = {}, _0x4256f9 = '') {
  const _0x4a5807 = (Array["isArray"](_0x3752a8["units"]) ? _0x3752a8['units'] : [])['join']('');
  return _0x4256f9 && _0x4a5807["startsWith"](_0x4256f9) ? _0x4a5807 : '' + _0x4256f9 + _0x4a5807;
}
function getStorySpokenChunkMinimumSeconds(_0x1ae76f, _0x35fe24, _0x3f3f7b, _0x5e4d33) {
  return getStorySpokenSegmentMinimumSeconds(_0x1ae76f, _0x35fe24, getStorySpokenChunkText(_0x3f3f7b, _0x5e4d33));
}
function getStoryAuthoredPauseBoundaryPriority(_0x5b4b47 = {}) {
  const _0x16a900 = (Array["isArray"](_0x5b4b47?.["units"]) ? _0x5b4b47["units"] : [])['join']('');
  if (/[。！？!?；;][”"’']?$/u['test'](_0x16a900)) {
    return 0x64;
  }
  if (/[”"’']—{2,}$/u["test"](_0x16a900)) {
    return 0x5a;
  }
  if (/—{2,}[”"’']?$/u['test'](_0x16a900)) {
    return 0x32;
  }
  if (/(?:…{2,}|\.{3,})[”"’']?$/u["test"](_0x16a900)) {
    return 0x28;
  }
  return 0x0;
}
function splitStoryEpisodeOverlongSpokenShot(_0x50412d = {}, {
  maximum = 0xf
} = {}) {
  const _0x3480a6 = normalizePositiveNumber(_0x50412d?.["durationSec"]);
  if (!_0x3480a6 || _0x3480a6 <= maximum + 0.001) {
    return [_0x50412d];
  }
  const _0x2e9d93 = ["dialogue", "voiceover"]["filter"](_0x299755 => normalizeText(_0x50412d?.[_0x299755]));
  if (_0x2e9d93['length'] !== 0x1) {
    return [_0x50412d];
  }
  const _0x4131fb = _0x2e9d93[0x0];
  const {
    speakerPrefix: _0x3ec81f,
    units: _0x3b124f
  } = tokenizeStorySpokenTextAtAuthoredPauses(_0x50412d[_0x4131fb]);
  if (_0x3b124f["length"] < 0x2) {
    return [_0x50412d];
  }
  let _0x4a7817 = _0x3b124f["map"](_0x580988 => ({
    'units': [_0x580988]
  }));
  for (const _0x32930a of _0x4a7817) {
    const _0x5916a3 = getStorySpokenChunkMinimumSeconds(_0x50412d, _0x4131fb, _0x32930a, _0x3ec81f);
    if (_0x5916a3 > maximum + 0.001) {
      return [_0x50412d];
    }
  }
  while (_0x4a7817["length"] > 0x1) {
    let _0x16497b = null;
    for (let _0x4b72fc = 0x0; _0x4b72fc < _0x4a7817["length"] - 0x1; _0x4b72fc += 0x1) {
      const _0x2c4f89 = {
        'units': [..._0x4a7817[_0x4b72fc]['units'], ..._0x4a7817[_0x4b72fc + 0x1]['units']]
      };
      const _0x268f6d = getStorySpokenChunkMinimumSeconds(_0x50412d, _0x4131fb, _0x2c4f89, _0x3ec81f);
      if (_0x268f6d > maximum + 0.001) {
        continue;
      }
      const _0x6551f7 = [..._0x4a7817["slice"](0x0, _0x4b72fc), _0x2c4f89, ..._0x4a7817["slice"](_0x4b72fc + 0x2)];
      const _0x1b323a = _0x6551f7["reduce"]((_0x4af953, _0x54ef98) => _0x4af953 + getStorySpokenChunkMinimumSeconds(_0x50412d, _0x4131fb, _0x54ef98, _0x3ec81f), 0x0);
      const _0x418b91 = Math['max'](_0x3480a6, _0x1b323a);
      if (_0x418b91 > _0x6551f7["length"] * maximum + 0.001) {
        continue;
      }
      const _0xcdbdaa = getStoryAuthoredPauseBoundaryPriority(_0x4a7817[_0x4b72fc]);
      (!_0x16497b || _0xcdbdaa < _0x16497b['removedBoundaryPriority'] || _0xcdbdaa === _0x16497b["removedBoundaryPriority"] && _0x268f6d < _0x16497b['mergedMinimumSeconds']) && (_0x16497b = {
        'chunks': _0x6551f7,
        'mergedMinimumSeconds': _0x268f6d,
        'removedBoundaryPriority': _0xcdbdaa
      });
    }
    if (!_0x16497b) {
      break;
    }
    _0x4a7817 = _0x16497b["chunks"];
  }
  const _0xbd001c = _0x4a7817["map"](_0xd30f34 => Math['ceil'](getStorySpokenChunkMinimumSeconds(_0x50412d, _0x4131fb, _0xd30f34, _0x3ec81f) * 0xa - 0.001));
  const _0x5e556d = Math["round"](maximum * 0xa);
  const _0x13b7c4 = Math["max"](Math['round'](_0x3480a6 * 0xa), _0xbd001c["reduce"]((_0x1b6364, _0x370042) => _0x1b6364 + _0x370042, 0x0));
  if (_0x13b7c4 > _0x4a7817["length"] * _0x5e556d) {
    return [_0x50412d];
  }
  const _0x117de8 = [..._0xbd001c];
  let _0xd733f3 = _0x13b7c4 - _0x117de8['reduce']((_0x3bc3f1, _0x5efa4e) => _0x3bc3f1 + _0x5efa4e, 0x0);
  while (_0xd733f3 > 0x0) {
    let _0x19a43a = ![];
    for (let _0xe5d1a6 = 0x0; _0xe5d1a6 < _0x117de8["length"] && _0xd733f3 > 0x0; _0xe5d1a6 += 0x1) {
      if (_0x117de8[_0xe5d1a6] >= _0x5e556d) {
        continue;
      }
      _0x117de8[_0xe5d1a6] += 0x1;
      _0xd733f3 -= 0x1;
      _0x19a43a = !![];
    }
    if (!_0x19a43a) {
      break;
    }
  }
  return _0x4a7817["map"]((_0x7aa30e, _0x1e11a3) => ({
    ..._0x50412d,
    'durationSec': _0x117de8[_0x1e11a3] / 0xa,
    [_0x4131fb]: getStorySpokenChunkText(_0x7aa30e, _0x3ec81f)
  }));
}
function repackStoryEpisodeSplitClipsLocally(_0x21f780 = [], {
  maxDurationSeconds = 0xf
} = {}) {
  const _0x2035f9 = normalizePositiveNumber(maxDurationSeconds) || 0xf;
  return (Array["isArray"](_0x21f780) ? _0x21f780 : [])['flatMap']((_0x2cde6f, _0x5afcd4) => {
    const _0x1e2318 = [];
    let _0x3c2741 = [];
    let _0x12eb35 = 0x0;
    const _0x454d70 = (Array["isArray"](_0x2cde6f?.['shots']) ? _0x2cde6f["shots"] : [])["flatMap"](_0x48f168 => splitStoryEpisodeOverlongSpokenShot(_0x48f168, {
      'maximum': _0x2035f9
    }));
    for (const _0xcfd2d4 of _0x454d70) {
      const _0x46f198 = normalizePositiveNumber(_0xcfd2d4?.["durationSec"]);
      if (!_0x46f198) {
        throw createStoryEpisodeClipDurationError({
          'clip': _0x2cde6f,
          'clipIndex': _0x5afcd4,
          'clipCount': _0x21f780['length'],
          'sourceShots': [_0xcfd2d4],
          'shots': [_0xcfd2d4],
          'durationSec': _0x46f198 || 0x0,
          'maxDurationSeconds': _0x2035f9
        });
      }
      if (_0x46f198 > _0x2035f9) {
        _0x3c2741['length'] && (_0x1e2318["push"](_0x3c2741), _0x3c2741 = [], _0x12eb35 = 0x0);
        _0x1e2318["push"]([_0xcfd2d4]);
        continue;
      }
      _0x3c2741['length'] && _0x12eb35 + _0x46f198 > _0x2035f9 && (_0x1e2318['push'](_0x3c2741), _0x3c2741 = [], _0x12eb35 = 0x0);
      _0x3c2741["push"](_0xcfd2d4);
      _0x12eb35 += _0x46f198;
    }
    if (_0x3c2741["length"]) {
      _0x1e2318['push'](_0x3c2741);
    }
    if (_0x1e2318["length"] <= 0x1) {
      return [_0x2cde6f];
    }
    return _0x1e2318['map']((_0x55c86a, _0x579aa4) => {
      const _0x35dd71 = _0x55c86a["flatMap"](_0x41329f => [normalizeText(_0x41329f?.["visual"]), normalizeText(_0x41329f?.["dialogue"]), normalizeText(_0x41329f?.["voiceover"])])["filter"](Boolean)["join"]('；');
      return {
        ..._0x2cde6f,
        'ref': _0x2cde6f["ref"] + "-part-" + (_0x579aa4 + 0x1),
        'script': _0x35dd71 || _0x2cde6f["script"],
        'shots': _0x55c86a,
        'durationSec': Number(getStoryEpisodeSplitShotsDuration(_0x55c86a)["toFixed"](0x1)),
        'assetRefs': [...new Set(_0x55c86a["flatMap"](_0x581a20 => _0x581a20["assetRefs"] || []))]
      };
    });
  });
}
function hasExplicitStoryEpisodeVoiceover(_0x7190d1 = {}) {
  const _0x464bd3 = [_0x7190d1?.["script"]?.["fullText"], _0x7190d1?.["fullScript"], _0x7190d1?.["scriptText"], ...(Array["isArray"](_0x7190d1?.["script"]?.["scenes"]) ? _0x7190d1["script"]["scenes"]['map'](_0x1cdb09 => _0x1cdb09?.['body']) : [])]["map"](_0x423b87 => String(_0x423b87 || ''))["filter"](Boolean);
  return _0x464bd3['some'](_0x5be808 => /^\s*(?:旁白|画外音|VO|V\.O\.?|OS|O\.S\.?)\s*[：:]/imu['test'](_0x5be808));
}
export function parseStoryEpisodeSplitResult(_0x24dc31, {
  episodeRef = '',
  episode = {},
  scriptMode = '',
  constraints = {},
  assets = [],
  assetRefs = [],
  clipPlans = [],
  minimumShotsPerClip = 0x2,
  maximumShotsPerClip = 0x5,
  enforceMaxDuration = !![],
  repairMissingShotFields = ![],
  allowEmptyAudio = !![],
  requireAllPlanCharacters = !![],
  completeCharacterAssetUsages = !![],
  completePlanSceneUsage = ![],
  includeCutAfter = ![],
  repackOverlongClips = ![],
  enforceSingleSceneAssetUsage = !![],
  clipDurationConstraints = null,
  rejectUnsupportedClipDuration = !![],
  promptMode = 'seedance-2.0'
} = {}) {
  const _0x39d39a = normalizeText(scriptMode) === STORY_SCRIPT_MODE_PLOT && !hasExplicitStoryEpisodeVoiceover(episode);
  const _0xe28561 = createStoryEpisodeSplitCompactDialogueCatalog(episode, assets);
  const _0x14a0b6 = normalizeStoryPlanningConstraints(constraints);
  const _0xd9c7ae = isStoryContinuousTimelinePromptMode(promptMode);
  const _0x5b472b = normalizeStoryEpisodeClipDurationConstraints(clipDurationConstraints);
  const _0x15c8c6 = Math['max'](0x1, Math['min'](0x5, Math["trunc"](Number(minimumShotsPerClip) || 0x2)));
  const _0x4512c4 = Math["max"](0x0, Math["trunc"](Number(maximumShotsPerClip) || 0x0));
  const _0x2199b4 = parseStrictJson(getResultText(_0x24dc31), "Agent 未返回片段拆分结果。");
  const _0x4a22a1 = expandStoryEpisodeSplitCompactData(_0x2199b4, {
    'episodeRef': episodeRef,
    'episode': episode,
    'assets': assets
  });
  const _0x12da32 = buildStoryEpisodeSplitAssetCatalog(assets, assetRefs);
  const _0xdf5e2c = new Map((Array["isArray"](clipPlans) ? clipPlans : [])['map'](_0x1359de => [a158_0x4e1501(_0x1359de?.["ref"], ''), _0x1359de]));
  const _0x535965 = Array["isArray"](_0x4a22a1["clips"]) ? _0x4a22a1['clips']["map"]((_0x2c8bf0, _0x3059e3) => {
    const _0xfc216e = formatStoryEpisodeClipTitle(_0x3059e3);
    const _0x47662b = a158_0x4e1501(_0x2c8bf0?.['ref'], "clip-" + (_0x3059e3 + 0x1));
    const _0x55b74b = _0xdf5e2c['get'](_0x47662b) || null;
    const _0xc413ff = repairMissingShotFields ? normalizeStoryEpisodeExperimentalStandaloneText : normalizeText;
    const _0x385bab = Array['isArray'](_0x2c8bf0?.['shots']) ? _0x2c8bf0["shots"] : [];
    const _0x3499c0 = _0x385bab['flatMap'](_0x1249d4 => [normalizeText(_0x1249d4?.["visual"]), normalizeText(_0x1249d4?.["dialogue"]), _0x39d39a ? '' : normalizeText(_0x1249d4?.["voiceover"])])["filter"](Boolean)["join"]('；');
    const _0x434ce4 = _0xc413ff(_0x2c8bf0?.["script"]) || (repairMissingShotFields ? normalizeText(_0x55b74b?.["beat"]) || _0xc413ff(_0x3499c0) : '');
    const _0x270cee = _0xc413ff(_0x2c8bf0?.["creativeIntent"]);
    const _0x3f20f7 = _0xc413ff(_0x2c8bf0?.['transition']);
    if (!_0x434ce4 || !repairMissingShotFields && (!_0x270cee || !_0x3f20f7)) {
      throw new Error(_0xfc216e + " 缺少 script、creativeIntent 或 transition。");
    }
    validateStoryEpisodeSplitClipIndependence({
      'clipLabel': _0xfc216e,
      'script': _0x434ce4,
      'creativeIntent': _0x270cee,
      'transition': _0x3f20f7
    });
    if (_0x385bab['length'] < _0x15c8c6) {
      throw new Error("片段“" + _0xfc216e + "”至少包含 " + _0x15c8c6 + " 个分镜。");
    }
    if (_0x4512c4 && _0x385bab["length"] > _0x4512c4) {
      throw new Error("片段“" + _0xfc216e + '”最多包含\x20' + _0x4512c4 + '\x20个分镜。');
    }
    const _0x202133 = _0x385bab["map"]((_0x269728, _0x804883) => {
      const _0x46c664 = _0x804883 === 0x0;
      const _0x424d8f = _0x804883 === _0x385bab['length'] - 0x1;
      const _0x4fa407 = [...new Set([_0x46c664 ? normalizeText(_0x55b74b?.["entryState"]) : '', _0x424d8f ? normalizeText(_0x55b74b?.["exitState"]) : '']["filter"](Boolean))]["join"]('；') || _0x434ce4;
      const _0x34e68c = normalizeStoryEpisodeSplitShot(_0x269728, {
        'clipTitle': _0xfc216e,
        'index': _0x804883,
        'assetCatalog': _0x12da32,
        'fallbacks': repairMissingShotFields ? {
          'time': normalizeText(_0x55b74b?.["time"]),
          'visual': _0x4fa407,
          'camera': "中景，平视机位，固定拍摄，主体居中构图，50mm标准镜头。",
          'audio': allowEmptyAudio ? '' : normalizeText(_0x269728?.["dialogue"] || _0x269728?.["voiceover"]) ? "对白与环境底噪。" : "环境音。",
          'cutAfter': _0x424d8f ? "preferred" : 'allowed'
        } : {},
        'allowEmptyAudio': allowEmptyAudio,
        'includeCutAfter': includeCutAfter,
        'includeTimeline': _0xd9c7ae
      });
      const _0x54e236 = completeStoryEpisodeSplitDialogueSpeaker(_0x34e68c["dialogue"], _0xe28561);
      const _0x3ec089 = _0x54e236 === _0x34e68c["dialogue"] ? _0x34e68c : {
        ..._0x34e68c,
        'dialogue': _0x54e236
      };
      return _0x39d39a ? {
        ..._0x3ec089,
        'voiceover': ''
      } : _0x3ec089;
    });
    const _0x569df0 = mergeStoryEpisodeSplitDialogueFragments(_0x202133, _0x55b74b?.["dialogueUnits"]);
    _0xd9c7ae && _0x569df0["forEach"]((_0x5ec233, _0x3a6a84) => {
      const _0x56c67e = _0x3a6a84 === 0x0 ? 0x0 : _0x569df0[_0x3a6a84 - 0x1]["endSec"];
      if (_0x5ec233["startSec"] !== _0x56c67e) {
        throw new Error("片段“" + _0xfc216e + "”的时间轴不连续：分镜 " + (_0x3a6a84 + 0x1) + '\x20应从\x20' + _0x56c67e + " 秒开始。");
      }
    });
    const _0x30e7c8 = completeCharacterAssetUsages ? completeStoryEpisodeSplitCharacterAssetUsages(_0x569df0, {
      'clipPlan': _0x55b74b,
      'assetCatalog': _0x12da32,
      'clipTitle': _0xfc216e,
      'requireAllPlanCharacters': requireAllPlanCharacters
    }) : _0x569df0;
    const _0x398bb4 = completePlanSceneUsage ? completeStoryEpisodeSplitSceneAssetUsage(_0x30e7c8, {
      'clipPlan': _0x55b74b,
      'assetCatalog': _0x12da32,
      'clipTitle': _0xfc216e
    }) : _0x30e7c8;
    const _0x10b166 = _0x385bab['some'](_0x42f238 => Array['isArray'](_0x42f238?.['assetUsages']));
    const _0x2013d1 = new Set([..._0x12da32["assetByRef"]["values"]()]["filter"](_0x4f1847 => _0x4f1847["kind"] === "scene")["map"](_0x5c3c4e => _0x5c3c4e["assetRef"]));
    if (enforceSingleSceneAssetUsage && _0x10b166 && _0x2013d1["size"]) {
      const _0x2ff232 = [...new Set(_0x398bb4["flatMap"](_0x4a6785 => _0x4a6785['assetUsages'])["map"](_0x3724d9 => _0x3724d9["assetRef"])["filter"](_0x361c70 => _0x2013d1["has"](_0x361c70)))];
      if (_0x2ff232["length"] !== 0x1) {
        throw new Error(_0x2ff232["length"] ? "片段“" + _0xfc216e + '”引用了多个场景资产；每个片段只能设定在一个场景。' : "片段“" + _0xfc216e + '”缺少场景资产；每个片段必须设定在一个场景。');
      }
    }
    const _0x370cdb = Number(getStoryEpisodeSplitShotsDuration(_0x398bb4)["toFixed"](0x1));
    const _0x21c0e4 = !isStoryEpisodeClipDurationSupported(_0x370cdb, _0x5b472b) ? createStoryEpisodeClipDurationConstraintError({
      'clip': _0x2c8bf0,
      'clipIndex': _0x3059e3,
      'clipCount': _0x4a22a1['clips']['length'],
      'durationSec': _0x370cdb,
      'durationConstraints': _0x5b472b
    }) : null;
    if (_0x21c0e4 && rejectUnsupportedClipDuration) {
      throw _0x21c0e4;
    }
    if (enforceMaxDuration && _0x370cdb > _0x14a0b6["sceneMaxSeconds"]) {
      throw createStoryEpisodeClipDurationError({
        'clip': _0x2c8bf0,
        'clipIndex': _0x3059e3,
        'clipCount': _0x4a22a1["clips"]["length"],
        'sourceShots': _0x385bab,
        'shots': _0x398bb4,
        'durationSec': _0x370cdb,
        'maxDurationSeconds': _0x14a0b6["sceneMaxSeconds"]
      });
    }
    const _0x3f28b9 = [...new Set(_0x398bb4["flatMap"](_0x36791f => _0x36791f["assetRefs"]))];
    return {
      'ref': _0x47662b,
      'title': _0xfc216e,
      'script': _0x434ce4,
      'creativeIntent': _0x270cee,
      'transition': _0x3f20f7,
      'shots': _0x398bb4,
      'durationSec': _0x370cdb,
      'assetRefs': _0x3f28b9,
      ...(_0x21c0e4 ? {
        'durationValidation': {
          'status': "unsupported",
          'message': _0x21c0e4["message"],
          'details': _0x21c0e4["validationDetails"]
        }
      } : {})
    };
  })['filter'](Boolean) : [];
  const _0x5875e2 = repackOverlongClips ? repackStoryEpisodeSplitClipsLocally(_0x535965, {
    'maxDurationSeconds': _0x14a0b6["sceneMaxSeconds"]
  }) : _0x535965;
  const _0x483fd8 = _0x5875e2["map"]((_0x267a14, _0x3487a5) => ({
    ..._0x267a14,
    'title': formatStoryEpisodeClipTitle(_0x3487a5)
  }));
  if (!_0x483fd8["length"]) {
    throw new Error('Agent\x20返回结果没有可用片段。');
  }
  const _0x2c6ae5 = _0x483fd8["reduce"]((_0x1a9b9b, _0x4c3262) => _0x1a9b9b + _0x4c3262["durationSec"], 0x0);
  const _0x29de1d = _0x483fd8["map"](_0x16858a => _0x16858a["ref"]);
  if (new Set(_0x29de1d)['size'] !== _0x29de1d["length"]) {
    throw new Error("Agent 返回了重复的片段引用。");
  }
  const _0x2f7f4a = a158_0x4e1501(_0x4a22a1['episodeRef'] || episodeRef, "episode-1");
  if (episodeRef && _0x2f7f4a !== a158_0x4e1501(episodeRef, "episode-1")) {
    throw new Error("Agent 返回的分集引用与当前分集不一致。");
  }
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'episodeRef': _0x2f7f4a,
    'totalDurationSeconds': _0x2c6ae5,
    'clips': _0x483fd8
  };
}
function serializeStoryEpisodeSplitValidationError(_0x9c8341, {
  clipIndex = 0x0,
  clipCount = 0x0
} = {}) {
  const _0x533fee = _0x9c8341?.["validationDetails"] ? JSON["parse"](JSON['stringify'](_0x9c8341["validationDetails"])) : null;
  _0x533fee?.["clip"] && (_0x533fee["clip"]["index"] = clipIndex + 0x1, _0x533fee["clip"]["count"] = clipCount);
  return {
    'message': normalizeText(_0x9c8341?.["message"] || _0x9c8341) || '片段校验失败。',
    ...(_0x533fee ? {
      'validationDetails': _0x533fee
    } : {})
  };
}
function normalizeStoryEpisodeSplitDraft(_0x260fd5, {
  episodeRef = '',
  episode = {},
  scriptMode = '',
  constraints = {},
  assets = [],
  clipPlans = [],
  minimumShotsPerClip = 0x2,
  maximumShotsPerClip = 0x5,
  enforceMaxDuration = !![],
  repairMissingShotFields = ![],
  allowEmptyAudio = !![],
  requireAllPlanCharacters = !![],
  completePlanSceneUsage = ![],
  includeCutAfter = ![],
  repackOverlongClips = ![],
  enforceSingleSceneAssetUsage = !![],
  clipDurationConstraints = null,
  rejectUnsupportedClipDuration = !![],
  promptMode = "seedance-2.0"
} = {}) {
  const _0x352d18 = getResultText(_0x260fd5);
  let _0x352be3;
  let _0x2d5b83 = null;
  try {
    _0x352be3 = parseStrictJson(_0x352d18, "Agent 未返回片段拆分结果。");
  } catch (_0x5fd3e9) {
    _0x2d5b83 = _0x5fd3e9;
  }
  if (!Array["isArray"](_0x352be3?.["clips"])) {
    const _0x22a8b2 = extractCompleteJsonArrayItems(_0x352d18, "clips");
    if (_0x22a8b2["length"]) {
      _0x352be3 = {
        'episodeRef': extractJsonStringProperty(_0x352d18, "episodeRef") || episodeRef,
        'clips': _0x22a8b2
      };
    } else {
      if (_0x2d5b83) {
        throw _0x2d5b83;
      }
    }
  }
  if (!Array['isArray'](_0x352be3['clips']) || !_0x352be3["clips"]["length"]) {
    throw new Error("Agent 返回结果没有可用片段。");
  }
  const _0x30db3e = a158_0x4e1501(_0x352be3["episodeRef"] || episodeRef, "episode-1");
  if (episodeRef && _0x30db3e !== a158_0x4e1501(episodeRef, "episode-1")) {
    throw new Error("Agent 返回的分集引用与当前分集不一致。");
  }
  const _0x25f0cc = new Set();
  const _0x26dea3 = _0x352be3["clips"]["map"]((_0xd3b567, _0x24d043) => {
    const _0x3b1ed9 = a158_0x4e1501(_0xd3b567?.["ref"], "clip-" + (_0x24d043 + 0x1));
    const _0x462347 = normalizeText(_0xd3b567?.["ref"]) ? _0xd3b567 : {
      ..._0xd3b567,
      'ref': _0x3b1ed9
    };
    try {
      const _0x4429ac = parseStoryEpisodeSplitResult({
        'episodeRef': _0x30db3e,
        'clips': [_0x462347]
      }, {
        'episodeRef': _0x30db3e,
        'episode': episode,
        'scriptMode': scriptMode,
        'constraints': constraints,
        'assets': assets,
        'clipPlans': clipPlans,
        'minimumShotsPerClip': minimumShotsPerClip,
        'maximumShotsPerClip': maximumShotsPerClip,
        'enforceMaxDuration': enforceMaxDuration,
        'repairMissingShotFields': repairMissingShotFields,
        'allowEmptyAudio': allowEmptyAudio,
        'requireAllPlanCharacters': requireAllPlanCharacters,
        'completePlanSceneUsage': completePlanSceneUsage,
        'includeCutAfter': includeCutAfter,
        'repackOverlongClips': repackOverlongClips,
        'enforceSingleSceneAssetUsage': enforceSingleSceneAssetUsage,
        'clipDurationConstraints': clipDurationConstraints,
        'rejectUnsupportedClipDuration': rejectUnsupportedClipDuration,
        'promptMode': promptMode
      });
      const _0x576ffe = _0x4429ac['clips']["find"](_0x3ae485 => _0x25f0cc["has"](_0x3ae485['ref']));
      if (_0x576ffe) {
        throw new Error('Agent\x20返回了重复的片段引用“' + _0x576ffe["ref"] + '”。');
      }
      _0x4429ac["clips"]["forEach"](_0x4d15b5 => _0x25f0cc["add"](_0x4d15b5["ref"]));
      return {
        'status': "valid",
        'sourceIndex': _0x24d043,
        'sourceClipRef': _0x3b1ed9,
        'clips': _0x4429ac['clips']
      };
    } catch (_0x166d44) {
      return {
        'status': "invalid",
        'sourceIndex': _0x24d043,
        'sourceClipRef': _0x3b1ed9,
        'rawClips': [_0x462347],
        'error': serializeStoryEpisodeSplitValidationError(_0x166d44, {
          'clipIndex': _0x24d043,
          'clipCount': _0x352be3["clips"]["length"]
        })
      };
    }
  });
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'status': 'draft',
    'episodeRef': _0x30db3e,
    'items': _0x26dea3,
    'attempts': 0x1
  };
}
function restoreStoryEpisodeSplitDraft(_0x53fce5 = {}, {
  episodeRef = ''
} = {}) {
  const _0x1d14db = a158_0x4e1501(_0x53fce5?.["episodeRef"] || episodeRef, "episode-1");
  if (episodeRef && _0x1d14db !== a158_0x4e1501(episodeRef, "episode-1")) {
    throw new Error("保存的分集草稿与当前分集不一致。");
  }
  const _0x256851 = Array["isArray"](_0x53fce5?.['items']) ? _0x53fce5["items"] : [];
  if (!_0x256851["length"]) {
    throw new Error("没有可继续修复的分集草稿。");
  }
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'status': "draft",
    'episodeRef': _0x1d14db,
    'items': _0x256851["map"]((_0x970790, _0x482f54) => ({
      ..._0x970790,
      'status': _0x970790?.["status"] === "valid" ? "valid" : "invalid",
      'sourceIndex': Number["isInteger"](_0x970790?.["sourceIndex"]) ? _0x970790["sourceIndex"] : _0x482f54,
      'sourceClipRef': a158_0x4e1501(_0x970790?.['sourceClipRef'], "clip-" + (_0x482f54 + 0x1)),
      'clips': _0x970790?.["status"] === 'valid' && Array["isArray"](_0x970790?.["clips"]) ? _0x970790['clips'] : [],
      'rawClips': _0x970790?.["status"] === "valid" ? [] : Array["isArray"](_0x970790?.["rawClips"]) ? _0x970790["rawClips"] : [],
      'error': _0x970790?.["status"] === 'valid' ? null : {
        'message': normalizeText(_0x970790?.["error"]?.["message"]) || "片段仍需修复。",
        ...(_0x970790?.["error"]?.["validationDetails"] ? {
          'validationDetails': _0x970790['error']["validationDetails"]
        } : {})
      }
    })),
    'attempts': Math["max"](0x1, Math['trunc'](Number(_0x53fce5?.['attempts']) || 0x1))
  };
}
function getStoryEpisodeSplitDraftCounts(_0x322634 = {}) {
  const _0x27381d = Array["isArray"](_0x322634?.["items"]) ? _0x322634["items"] : [];
  return {
    'validClipCount': _0x27381d['reduce']((_0x2f617b, _0x64d391) => _0x2f617b + (_0x64d391?.["status"] === 'valid' && Array["isArray"](_0x64d391?.["clips"]) ? _0x64d391['clips']["length"] : 0x0), 0x0),
    'invalidItemCount': _0x27381d['filter'](_0x30681d => _0x30681d?.['status'] !== "valid")["length"]
  };
}
function finalizeStoryEpisodeSplitDraft(_0x1432e2 = {}) {
  const {
    invalidItemCount: _0x2128d6
  } = getStoryEpisodeSplitDraftCounts(_0x1432e2);
  if (_0x2128d6) {
    return null;
  }
  const _0x41ac4a = _0x1432e2["items"]["flatMap"](_0x302893 => _0x302893['clips'] || [])["map"]((_0x27a9e3, _0x48b735) => ({
    ..._0x27a9e3,
    'title': formatStoryEpisodeClipTitle(_0x48b735)
  }));
  if (!_0x41ac4a["length"]) {
    throw new Error("Agent 返回结果没有可用片段。");
  }
  const _0x9dfe18 = _0x41ac4a["map"](_0x46524a => _0x46524a['ref']);
  if (new Set(_0x9dfe18)['size'] !== _0x9dfe18['length']) {
    throw new Error("Agent 返回了重复的片段引用。");
  }
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'episodeRef': _0x1432e2["episodeRef"],
    'totalDurationSeconds': _0x41ac4a["reduce"]((_0x428269, _0x1c83b7) => _0x428269 + _0x1c83b7["durationSec"], 0x0),
    'clips': _0x41ac4a,
    ...(typeof _0x1432e2?.['rawResponse'] === "string" ? {
      'rawResponse': _0x1432e2["rawResponse"]
    } : {})
  };
}
function createStoryEpisodeSplitPartialResult(_0x3fe961 = {}) {
  const _0xff0139 = _0x3fe961["items"]['flatMap'](_0x7eb870 => _0x7eb870?.["status"] === "valid" && Array["isArray"](_0x7eb870?.['clips']) ? _0x7eb870["clips"] : [])['map']((_0x2b8941, _0x9ca255) => ({
    ..._0x2b8941,
    'title': formatStoryEpisodeClipTitle(_0x9ca255)
  }));
  const _0x4957f9 = _0x3fe961["items"]['filter'](_0x2c3449 => _0x2c3449?.['status'] !== "valid")["map"](_0x35d183 => ({
    'sourceIndex': _0x35d183["sourceIndex"],
    'sourceClipRef': _0x35d183["sourceClipRef"],
    'message': normalizeText(_0x35d183?.["error"]?.["message"]) || "片段仍需修复。",
    ...(_0x35d183?.["error"]?.["validationDetails"] ? {
      'validationDetails': _0x35d183["error"]["validationDetails"]
    } : {})
  }));
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'status': "partial",
    'episodeRef': _0x3fe961["episodeRef"],
    'items': _0x3fe961['items'],
    'clips': _0xff0139,
    'rejectedClips': _0x4957f9,
    'totalDurationSeconds': _0xff0139['reduce']((_0x3a2782, _0x1db063) => _0x3a2782 + _0x1db063['durationSec'], 0x0),
    'attempts': Math["max"](0x1, Math["trunc"](Number(_0x3fe961?.['attempts']) || 0x1)),
    ...(typeof _0x3fe961?.["rawResponse"] === "string" ? {
      'rawResponse': _0x3fe961["rawResponse"]
    } : {})
  };
}
function throwStoryEpisodeSplitPartialResult(_0x29af31 = {}) {
  const _0x59cbcc = createStoryEpisodeSplitPartialResult(_0x29af31);
  const _0x53e56a = _0x59cbcc["clips"]['length'];
  const _0x266c52 = _0x59cbcc["rejectedClips"]["length"];
  const _0x36e4ed = _0x266c52 === 0x1 ? normalizeText(_0x59cbcc["rejectedClips"][0x0]?.["message"]) : '';
  const _0x4b64bc = new Error("分集拆分未完全通过：已保留 " + _0x53e56a + " 个合格片段，" + _0x266c52 + " 个片段仍需修复。" + (_0x36e4ed ? '\x20' + _0x36e4ed : ''));
  _0x4b64bc["name"] = 'StoryEpisodeSplitPartialError';
  _0x4b64bc["partialResult"] = _0x59cbcc;
  throw _0x4b64bc;
}
function reportStoryEpisodeSplitRequestDiagnostics(_0x57dc10, {
  phase = "full-generation",
  prompt = '',
  systemPrompt = '',
  failedClipCount = 0x0,
  carriesFullEpisodeContext = phase !== 'targeted-repair',
  automaticCallLimit = 0x2,
  details = {}
} = {}) {
  const _0x10aa5e = _0x57dc10?.["info"] || _0x57dc10?.["log"];
  if (typeof _0x10aa5e !== "function") {
    return null;
  }
  const _0x1fbe79 = String(prompt || '');
  const _0x35fa7a = String(systemPrompt || '');
  const _0x3a4f6a = typeof TextEncoder === "function" ? new TextEncoder()["encode"](_0x1fbe79)["length"] : _0x1fbe79['length'];
  const _0xd3b067 = typeof TextEncoder === 'function' ? new TextEncoder()["encode"](_0x35fa7a)["length"] : _0x35fa7a['length'];
  return _0x10aa5e['call'](_0x57dc10, "[storyWorkspace][episode-split-request]", {
    'phase': phase,
    ...(details && typeof details === "object" ? details : {}),
    'promptCharacters': [..._0x1fbe79]["length"],
    'promptBytes': _0x3a4f6a,
    'systemPromptCharacters': [..._0x35fa7a]["length"],
    'systemPromptBytes': _0xd3b067,
    'inputCharacters': [..._0x1fbe79]["length"] + [..._0x35fa7a]["length"],
    'inputBytes': _0x3a4f6a + _0xd3b067,
    'failedClipCount': Math['max'](0x0, Math["trunc"](Number(failedClipCount) || 0x0)),
    'carriesFullEpisodeContext': Boolean(carriesFullEpisodeContext),
    'automaticCallLimit': Math["max"](0x1, Math["trunc"](Number(automaticCallLimit) || 0x1))
  });
}
function getStoryEpisodeSplitSerializedMetrics(_0x498195) {
  let _0x15d931 = '';
  try {
    _0x15d931 = typeof _0x498195 === 'string' ? _0x498195 : JSON["stringify"](_0x498195);
  } catch {
    _0x15d931 = String(_0x498195 || '');
  }
  const _0x210423 = typeof TextEncoder === "function" ? new TextEncoder()['encode'](_0x15d931)["length"] : _0x15d931["length"];
  return {
    'characters': [..._0x15d931]["length"],
    'bytes': _0x210423
  };
}
function getStoryEpisodeSplitResponseTiming(_0x44deda = {}) {
  const _0x2f9efd = _0x44deda?.['transportTiming'] && typeof _0x44deda["transportTiming"] === "object" ? _0x44deda['transportTiming'] : {};
  const _0x3ecd34 = _0x285046 => {
    const _0x279b25 = _0x2f9efd[_0x285046];
    if (_0x279b25 === null || _0x279b25 === undefined || _0x279b25 === '') {
      return null;
    }
    const _0x16b9f6 = Number(_0x279b25);
    return Number['isFinite'](_0x16b9f6) && _0x16b9f6 >= 0x0 ? _0x16b9f6 : null;
  };
  return {
    'responseHeadersMs': _0x3ecd34("responseHeadersMs"),
    'responseBodyMs': _0x3ecd34('responseBodyMs'),
    'transportTotalMs': _0x3ecd34("totalMs"),
    'firstByteMs': _0x3ecd34("firstByteMs"),
    'firstTokenMs': _0x3ecd34("firstTokenMs")
  };
}
function getStoryEpisodeExperimentalPromptSectionCharacters(_0x4ecb51) {
  if (!_0x4ecb51 || typeof _0x4ecb51 !== "object") {
    return {};
  }
  return Object['fromEntries'](Object["entries"](_0x4ecb51)["map"](([_0x3688b4, _0x3257c6]) => [_0x3688b4, getStoryEpisodeSplitSerializedMetrics(_0x3257c6)['characters']]));
}
function reportStoryEpisodeSplitRequestDiagnosticsInBackground(_0x582c44, _0x217a44) {
  try {
    const _0xc0048 = reportStoryEpisodeSplitRequestDiagnostics(_0x582c44, _0x217a44);
    _0xc0048 && typeof _0xc0048["then"] === "function" && void Promise["resolve"](_0xc0048)["catch"](() => undefined);
  } catch {}
}
function createStoryEpisodeExperimentalDiagnosticRequest({
  request: _0x1306d9,
  diagnostics: _0x5cf994,
  runId: _0x30eaf8,
  phase: _0x464e24,
  nextRequestSequence: _0x5e2a04,
  carriesFullEpisodeContext = ![],
  context = {}
} = {}) {
  let _0x1af7f0 = 0x0;
  return async (_0x5d47d9 = {}) => {
    _0x1af7f0 += 0x1;
    const _0x43b2f5 = Math['max'](0x1, Math['trunc'](Number(_0x5e2a04?.()) || _0x1af7f0));
    const _0x40377f = _0x30eaf8 + ':' + _0x43b2f5;
    const _0xa2f0fe = getStoryEpisodeSplitSerializedMetrics(_0x5d47d9);
    const _0x1d3ff1 = {
      'status': "started",
      'countsTowardRequestTotal': !![],
      'runId': _0x30eaf8,
      'requestId': _0x40377f,
      'requestSequence': _0x43b2f5,
      'phaseAttempt': _0x1af7f0,
      'model': normalizeText(_0x5d47d9?.["model"]),
      'provider': normalizeText(_0x5d47d9?.["provider"]),
      'structuredOutputRequested': Boolean(_0x5d47d9?.["structuredOutput"]),
      'timeoutMs': Math["max"](0x0, Math["trunc"](Number(_0x5d47d9?.["timeoutMs"]) || 0x0)),
      'requestPayloadCharacters': _0xa2f0fe["characters"],
      'requestPayloadBytes': _0xa2f0fe['bytes'],
      'strictAttemptLimit': 0x1,
      'transportAttemptLimit': STORY_EPISODE_EXPERIMENTAL_TRANSPORT_ATTEMPTS,
      'maximumActualCallsForPhase': STORY_EPISODE_EXPERIMENTAL_TRANSPORT_ATTEMPTS,
      ...(context && typeof context === "object" ? context : {})
    };
    return enqueueStoryEpisodeExperimentalRequest(async () => {
      const _0x3119c5 = Date["now"]();
      reportStoryEpisodeSplitRequestDiagnosticsInBackground(_0x5cf994, {
        'phase': _0x464e24,
        'prompt': _0x5d47d9?.["prompt"],
        'systemPrompt': _0x5d47d9?.["systemPrompt"],
        'carriesFullEpisodeContext': carriesFullEpisodeContext,
        'automaticCallLimit': _0x1d3ff1["maximumActualCallsForPhase"],
        'details': _0x1d3ff1
      });
      try {
        const _0x5cc9eb = await _0x1306d9(_0x5d47d9);
        const _0x3daf3e = getStoryEpisodeSplitSerializedMetrics(getResultText(_0x5cc9eb));
        reportStoryEpisodeSplitRequestDiagnosticsInBackground(_0x5cf994, {
          'phase': _0x464e24,
          'prompt': _0x5d47d9?.["prompt"],
          'systemPrompt': _0x5d47d9?.["systemPrompt"],
          'carriesFullEpisodeContext': carriesFullEpisodeContext,
          'automaticCallLimit': _0x1d3ff1["maximumActualCallsForPhase"],
          'details': {
            ..._0x1d3ff1,
            'status': "succeeded",
            'countsTowardRequestTotal': ![],
            'elapsedMs': Math['max'](0x0, Date['now']() - _0x3119c5),
            'responseCharacters': _0x3daf3e["characters"],
            'responseBytes': _0x3daf3e["bytes"],
            ...getStoryEpisodeSplitResponseTiming(_0x5cc9eb),
            ...(_0x5cc9eb?.['structuredOutputFallback'] ? {
              'structuredOutputFallbackMode': normalizeText(_0x5cc9eb["structuredOutputFallback"]["mode"]),
              'structuredOutputFallbackStatus': Math["max"](0x0, Math['trunc'](Number(_0x5cc9eb["structuredOutputFallback"]["status"]) || 0x0))
            } : {})
          }
        });
        return _0x5cc9eb;
      } catch (_0x1a57b3) {
        reportStoryEpisodeSplitRequestDiagnosticsInBackground(_0x5cf994, {
          'phase': _0x464e24,
          'prompt': _0x5d47d9?.["prompt"],
          'systemPrompt': _0x5d47d9?.["systemPrompt"],
          'carriesFullEpisodeContext': carriesFullEpisodeContext,
          'automaticCallLimit': _0x1d3ff1["maximumActualCallsForPhase"],
          'details': {
            ..._0x1d3ff1,
            'status': "failed",
            'countsTowardRequestTotal': ![],
            'elapsedMs': Math["max"](0x0, Date["now"]() - _0x3119c5),
            'errorType': normalizeText(_0x1a57b3?.['type'] || _0x1a57b3?.["name"]),
            'errorStatus': Math["max"](0x0, Math["trunc"](Number(_0x1a57b3?.["status"] || _0x1a57b3?.["statusCode"]) || 0x0)),
            'errorMessage': normalizeText(_0x1a57b3?.["message"] || _0x1a57b3),
            'retryable': Boolean(_0x1a57b3?.["retryable"] || isStoryEpisodeExperimentalRetryable(_0x1a57b3))
          }
        });
        throw _0x1a57b3;
      }
    });
  };
}
function createStoryEpisodeDefaultSplitParseContext({
  episodeRef = '',
  episode = {},
  scriptMode = '',
  constraints = {},
  assets = [],
  clipDurationConstraints = null,
  promptMode = 'seedance-2.0'
} = {}) {
  const _0x21fbcb = isStoryContinuousTimelinePromptMode(promptMode);
  const _0x3074b0 = isStoryMinimaxH3PromptMode(promptMode) ? {
    ...constraints,
    'sceneMaxSeconds': 0xf
  } : constraints;
  return {
    'episodeRef': episodeRef,
    'episode': episode,
    'scriptMode': scriptMode,
    'constraints': _0x3074b0,
    'assets': assets,
    'minimumShotsPerClip': 0x1,
    'maximumShotsPerClip': 0x0,
    'enforceMaxDuration': ![],
    'repairMissingShotFields': !![],
    'allowEmptyAudio': !![],
    'requireAllPlanCharacters': ![],
    'completePlanSceneUsage': ![],
    'repackOverlongClips': Boolean(clipDurationConstraints) && !_0x21fbcb,
    'enforceSingleSceneAssetUsage': ![],
    'clipDurationConstraints': clipDurationConstraints,
    'rejectUnsupportedClipDuration': ![],
    'promptMode': promptMode
  };
}
function createStoryEpisodeSplitRawResponsePartialResult({
  episodeRef = '',
  rawResponse = '',
  attempts = 0x1,
  error = null
} = {}) {
  const _0x1ddf4f = serializeStoryEpisodeSplitValidationError(error);
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'status': "partial",
    'episodeRef': episodeRef,
    'items': [{
      'status': "invalid",
      'sourceIndex': 0x0,
      'sourceClipRef': 'raw-response',
      'rawClips': [],
      'rawResponse': rawResponse,
      'error': _0x1ddf4f
    }],
    'clips': [],
    'rejectedClips': [{
      'sourceIndex': 0x0,
      'sourceClipRef': "raw-response",
      'message': _0x1ddf4f["message"]
    }],
    'totalDurationSeconds': 0x0,
    'attempts': Math["max"](0x1, Math["trunc"](Number(attempts) || 0x1)),
    'rawResponse': rawResponse
  };
}
function serializeStoryEpisodeSplitTransportRaw(_0x153c2f) {
  const _0x2e279c = _0x153c2f?.['raw'];
  if (typeof _0x2e279c === "string") {
    return _0x2e279c;
  }
  if (_0x2e279c === undefined || _0x2e279c === null) {
    return '';
  }
  try {
    return JSON["stringify"](_0x2e279c);
  } catch {
    return String(_0x2e279c || '');
  }
}
function hasStoryEpisodeSplitTransportModelOutput(_0x344785) {
  if (!_0x344785) {
    return ![];
  }
  if (typeof _0x344785 === 'string') {
    const _0x5d13e9 = normalizeText(_0x344785);
    if (!_0x5d13e9) {
      return ![];
    }
    try {
      return hasStoryEpisodeSplitTransportModelOutput(JSON["parse"](_0x5d13e9));
    } catch {
      return ![];
    }
  }
  if (Array["isArray"](_0x344785)) {
    return _0x344785["some"](_0x38fe93 => hasStoryEpisodeSplitTransportModelOutput(_0x38fe93));
  }
  if (typeof _0x344785 !== "object") {
    return ![];
  }
  if (Array["isArray"](_0x344785["clips"]) && _0x344785['clips']['length']) {
    return !![];
  }
  const _0x270567 = [_0x344785["text"], _0x344785['outputText'], _0x344785["content"], _0x344785["reasoning_content"], _0x344785["reasoningContent"]]["map"](normalizeText)["find"](Boolean);
  if (_0x270567) {
    return !![];
  }
  const _0x2dfc59 = Array["isArray"](_0x344785["choices"]) ? _0x344785["choices"] : [];
  if (_0x2dfc59["some"](_0x6ea4be => hasStoryEpisodeSplitTransportModelOutput(_0x6ea4be?.["message"] || _0x6ea4be?.["delta"] || _0x6ea4be))) {
    return !![];
  }
  return [_0x344785['data'], _0x344785["result"], _0x344785['response'], _0x344785["output"]]["some"](_0x54a0e8 => _0x54a0e8 && _0x54a0e8 !== _0x344785 && hasStoryEpisodeSplitTransportModelOutput(_0x54a0e8));
}
export function recoverStoryEpisodeSplitDraftLocally({
  project = {},
  episode = {},
  assets = [],
  constraints = {},
  draft = episode?.['splitDraft']
} = {}) {
  const _0x4ed031 = Array["isArray"](draft?.["items"]) ? [...draft["items"]] : [];
  if (!_0x4ed031["length"]) {
    throw new Error("没有可在本地恢复的分镜结果。");
  }
  const _0x1fc058 = Array["isArray"](assets) ? assets : [];
  const _0x1136c6 = resolveStoryPlanningConstraints(project, constraints);
  const _0x18efce = a158_0x4e1501(draft?.["episodeRef"] || episode?.["ref"] || episode?.["planningRef"] || episode?.['id'], "episode-1");
  const _0x13f455 = createStoryEpisodeDefaultSplitParseContext({
    'episodeRef': _0x18efce,
    'episode': episode,
    'scriptMode': normalizeStoryScriptMode(project?.['scriptMode']),
    'constraints': _0x1136c6,
    'assets': _0x1fc058,
    'promptMode': resolveStoryPromptMode(project, constraints)
  });
  const _0x594b7c = _0x4ed031['sort']((_0xf61e14, _0x319e2e) => Number(_0xf61e14?.["sourceIndex"] || 0x0) - Number(_0x319e2e?.['sourceIndex'] || 0x0))["flatMap"](_0x57efc8 => {
    if (_0x57efc8?.["status"] === 'valid' && Array['isArray'](_0x57efc8?.['clips'])) {
      return _0x57efc8['clips'];
    }
    const _0x2c7a5f = (Array["isArray"](_0x57efc8?.["rawClips"]) ? _0x57efc8['rawClips'] : [])['map']((_0x3872f9, _0x14c355) => normalizeText(_0x3872f9?.["ref"]) ? _0x3872f9 : {
      ..._0x3872f9,
      'ref': a158_0x4e1501(_0x57efc8?.["sourceClipRef"], 'clip-' + (Number(_0x57efc8?.["sourceIndex"] || 0x0) + _0x14c355 + 0x1))
    });
    if (!_0x2c7a5f["length"]) {
      return [];
    }
    const _0x2d9126 = normalizeStoryEpisodeSplitDraft({
      'episodeRef': _0x18efce,
      'clips': _0x2c7a5f
    }, _0x13f455);
    const _0x3bdce7 = finalizeStoryEpisodeSplitDraft(_0x2d9126);
    if (_0x3bdce7) {
      return _0x3bdce7["clips"];
    }
    throwStoryEpisodeSplitPartialResult(_0x2d9126);
  })["map"]((_0x3c8b96, _0x27c202) => ({
    ..._0x3c8b96,
    'title': formatStoryEpisodeClipTitle(_0x27c202)
  }));
  if (!_0x594b7c["length"]) {
    throw new Error('保存的分镜结果中没有可恢复片段。');
  }
  const _0x789602 = _0x594b7c["map"](_0xefe2f3 => _0xefe2f3["ref"]);
  if (new Set(_0x789602)["size"] !== _0x789602["length"]) {
    throw new Error("保存的分镜结果包含重复片段引用。");
  }
  return {
    'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
    'episodeRef': _0x18efce,
    'totalDurationSeconds': _0x594b7c["reduce"]((_0x5e27cb, _0x472b97) => _0x5e27cb + _0x472b97['durationSec'], 0x0),
    'clips': _0x594b7c
  };
}
function getStoryEpisodesSplitResponseEntries(_0x917bff) {
  const _0xb9642d = [_0x917bff];
  const _0x2f1b27 = new Set();
  while (_0xb9642d['length']) {
    const _0x1f0f2e = _0xb9642d['shift']();
    if (Array["isArray"](_0x1f0f2e)) {
      return _0x1f0f2e;
    }
    if (!_0x1f0f2e || typeof _0x1f0f2e !== "object" || _0x2f1b27["has"](_0x1f0f2e)) {
      continue;
    }
    _0x2f1b27["add"](_0x1f0f2e);
    for (const _0x5c0baa of ["episodes", "results", 'items']) {
      if (Array["isArray"](_0x1f0f2e[_0x5c0baa])) {
        return _0x1f0f2e[_0x5c0baa];
      }
    }
    if (Array["isArray"](_0x1f0f2e['clips'])) {
      return [_0x1f0f2e];
    }
    for (const _0x1f14c5 of ['result', 'data', "output", 'response']) {
      if (_0x1f0f2e[_0x1f14c5] && typeof _0x1f0f2e[_0x1f14c5] === "object") {
        _0xb9642d['push'](_0x1f0f2e[_0x1f14c5]);
      }
    }
  }
  return [];
}
function getStoryEpisodesSplitEntryRef(_0x4c2ed8 = {}) {
  return a158_0x4e1501(_0x4c2ed8?.['episodeRef'] || _0x4c2ed8?.["episode_ref"] || _0x4c2ed8?.["ref"] || _0x4c2ed8?.['id'] || _0x4c2ed8?.["episode"]?.["ref"] || _0x4c2ed8?.["episode"]?.['id'], '');
}
function parseStoryEpisodesSplitEntry({
  entry = {},
  episode = {},
  scriptMode = '',
  assets = [],
  constraints = {},
  clipDurationConstraints = null,
  promptMode = "seedance-2.0"
} = {}) {
  const _0x4827d5 = getStoryEpisodeReferenceAliases(episode)[0x0] || "episode-1";
  const _0x261fa0 = Array["isArray"](entry?.["clips"]) ? entry["clips"] : Array["isArray"](entry?.["segments"]) ? entry["segments"] : [];
  if (!_0x261fa0["length"]) {
    throw new Error('Agent\x20返回结果没有可用镜头。');
  }
  const _0x141b69 = expandStoryEpisodeSplitCompactData({
    ...entry,
    'episodeRef': _0x4827d5,
    'clips': _0x261fa0
  }, {
    'episodeRef': _0x4827d5,
    'episode': episode,
    'assets': assets
  });
  const _0x2f4480 = JSON["stringify"](entry);
  const _0x5a7225 = {
    ...normalizeStoryEpisodeSplitDraft({
      'text': JSON['stringify'](_0x141b69)
    }, createStoryEpisodeDefaultSplitParseContext({
      'episodeRef': _0x4827d5,
      'episode': episode,
      'scriptMode': scriptMode,
      'constraints': constraints,
      'assets': assets,
      'clipDurationConstraints': clipDurationConstraints,
      'promptMode': promptMode
    })),
    'rawResponse': _0x2f4480
  };
  const _0x2a699a = finalizeStoryEpisodeSplitDraft(_0x5a7225);
  if (_0x2a699a) {
    return assertStoryEpisodeSplitTiming(_0x2a699a, episode);
  }
  throwStoryEpisodeSplitPartialResult(_0x5a7225);
}
async function splitStoryEpisodesCombinedRequest({
  project = {},
  episodes = [],
  assets = [],
  constraints = {},
  model = '',
  provider = '',
  providerProfileId = '',
  request = generateText,
  onProgress = null,
  diagnostics = null,
  clipDurationConstraints = null
} = {}) {
  assertPlanningModel(model, provider);
  const _0x18f4a5 = Array["isArray"](episodes) ? episodes["filter"](Boolean) : [];
  if (!_0x18f4a5["length"]) {
    throw new Error("没有可生成分镜的分集。");
  }
  const _0x52592b = resolveStoryPlanningConstraints(project, constraints);
  const _0x3395cd = resolveStoryPromptMode(project, constraints);
  const _0x401b81 = normalizeStoryEpisodeClipDurationConstraints(clipDurationConstraints);
  const _0x5a4e27 = buildStoryEpisodesSplitPrompt({
    'project': project,
    'episodes': _0x18f4a5,
    'assets': assets,
    'constraints': {
      ..._0x52592b,
      'promptMode': _0x3395cd
    },
    'clipDurationConstraints': _0x401b81
  });
  const _0xcf3ee6 = {
    'model': normalizeText(model),
    'provider': normalizeText(provider),
    ...buildStoryTextProviderProfilePayload(providerProfileId),
    'prompt': _0x5a4e27,
    'systemPrompt': getStoryEpisodeSplitRequestSystemPrompt({
      'compactPrompt': !![],
      'promptMode': _0x3395cd
    }),
    'thinking': {
      'type': "disabled"
    },
    'temperature': STORY_EPISODE_SPLIT_TEMPERATURE,
    'maxOutputTokens': STORY_EPISODE_SPLIT_MAX_OUTPUT_TOKENS,
    'timeoutMs': STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS
  };
  onProgress?.({
    'stage': "splitting-episodes",
    'current': 0x1,
    'total': 0x2,
    'message': "正在一次生成 " + _0x18f4a5["length"] + " 集分镜"
  });
  reportStoryEpisodeSplitRequestDiagnostics(diagnostics, {
    'phase': "batch-generation",
    'prompt': _0x5a4e27,
    'systemPrompt': _0xcf3ee6["systemPrompt"],
    'automaticCallLimit': 0x2,
    'details': {
      'status': "started",
      'requestIndex': 0x1,
      'requestCount': 0x2,
      'episodeCount': _0x18f4a5["length"],
      'outputTokenLimitMode': 'provider-default',
      'requestTimeoutMode': 'provider-default',
      'assetDetailsIncluded': ![]
    }
  });
  const _0x472276 = Date['now']();
  let _0x13d7e3;
  try {
    _0x13d7e3 = await request(_0xcf3ee6);
    const _0x6a2bf6 = getStoryEpisodeSplitSerializedMetrics(getResultText(_0x13d7e3));
    reportStoryEpisodeSplitRequestDiagnosticsInBackground(diagnostics, {
      'phase': "batch-generation",
      'prompt': _0x5a4e27,
      'systemPrompt': _0xcf3ee6['systemPrompt'],
      'automaticCallLimit': 0x2,
      'details': {
        'status': "succeeded",
        'requestIndex': 0x1,
        'requestCount': 0x2,
        'episodeCount': _0x18f4a5['length'],
        'elapsedMs': Math['max'](0x0, Date["now"]() - _0x472276),
        'responseCharacters': _0x6a2bf6["characters"],
        'responseBytes': _0x6a2bf6["bytes"],
        ...getStoryEpisodeSplitResponseTiming(_0x13d7e3)
      }
    });
  } catch (_0x130f22) {
    reportStoryEpisodeSplitRequestDiagnosticsInBackground(diagnostics, {
      'phase': "batch-generation",
      'prompt': _0x5a4e27,
      'systemPrompt': _0xcf3ee6["systemPrompt"],
      'automaticCallLimit': 0x2,
      'details': {
        'status': "failed",
        'requestIndex': 0x1,
        'requestCount': 0x2,
        'episodeCount': _0x18f4a5['length'],
        'elapsedMs': Math["max"](0x0, Date['now']() - _0x472276),
        'errorType': normalizeText(_0x130f22?.["type"] || _0x130f22?.["name"]),
        'errorMessage': normalizeText(_0x130f22?.['message'] || _0x130f22)
      }
    });
    _0x130f22["message"] = (normalizeText(_0x130f22?.['message']) || "批量分镜生成请求失败。") + "（生成请求失败，未执行结果检查。）";
    if (hasStoryEpisodeSplitTransportModelOutput(_0x130f22?.["raw"])) {
      const _0x4e6ea0 = getStoryEpisodeReferenceAliases(_0x18f4a5[0x0])[0x0] || "episode-1";
      _0x130f22["partialResults"] = [createStoryEpisodeSplitRawResponsePartialResult({
        'episodeRef': _0x4e6ea0,
        'rawResponse': serializeStoryEpisodeSplitTransportRaw(_0x130f22),
        'attempts': 0x1,
        'error': _0x130f22
      })];
    }
    throw _0x130f22;
  }
  const _0x1d9deb = getResultText(_0x13d7e3);
  const _0x4900cd = _0x18f4a5["map"]((_0x6ddaf1, _0x5a74d8) => getStoryEpisodeReferenceAliases(_0x6ddaf1)[0x0] || "episode-" + (_0x5a74d8 + 0x1));
  const _0xc04c88 = buildStoryEpisodesSplitValidationPrompt({
    'episodeRefs': _0x4900cd,
    'result': _0x1d9deb,
    'promptMode': _0x3395cd
  });
  const _0x4d7b6e = {
    'model': normalizeText(model),
    'provider': normalizeText(provider),
    ...buildStoryTextProviderProfilePayload(providerProfileId),
    'prompt': _0xc04c88,
    'systemPrompt': STORY_EPISODES_SPLIT_VALIDATION_SYSTEM_PROMPT,
    'temperature': 0.1
  };
  onProgress?.({
    'stage': "validating-episodes",
    'current': 0x2,
    'total': 0x2,
    'message': "正在检查并修复分镜返回格式"
  });
  reportStoryEpisodeSplitRequestDiagnostics(diagnostics, {
    'phase': "batch-validation",
    'prompt': _0xc04c88,
    'systemPrompt': STORY_EPISODES_SPLIT_VALIDATION_SYSTEM_PROMPT,
    'automaticCallLimit': 0x2,
    'details': {
      'status': "started",
      'requestIndex': 0x2,
      'requestCount': 0x2,
      'episodeCount': _0x18f4a5["length"],
      'outputTokenLimitMode': "provider-default",
      'requestTimeoutMode': "provider-default",
      'includesOriginalScripts': ![]
    }
  });
  const _0x521034 = Date["now"]();
  let _0x43f5e9 = null;
  let _0x4dcf16 = null;
  try {
    _0x43f5e9 = await request(_0x4d7b6e);
    const _0x32bc37 = getStoryEpisodeSplitSerializedMetrics(getResultText(_0x43f5e9));
    reportStoryEpisodeSplitRequestDiagnosticsInBackground(diagnostics, {
      'phase': "batch-validation",
      'prompt': _0xc04c88,
      'systemPrompt': STORY_EPISODES_SPLIT_VALIDATION_SYSTEM_PROMPT,
      'automaticCallLimit': 0x2,
      'details': {
        'status': "succeeded",
        'requestIndex': 0x2,
        'requestCount': 0x2,
        'episodeCount': _0x18f4a5["length"],
        'elapsedMs': Math["max"](0x0, Date['now']() - _0x521034),
        'responseCharacters': _0x32bc37["characters"],
        'responseBytes': _0x32bc37["bytes"],
        ...getStoryEpisodeSplitResponseTiming(_0x43f5e9)
      }
    });
  } catch (_0x4ed79b) {
    _0x4dcf16 = _0x4ed79b;
    reportStoryEpisodeSplitRequestDiagnosticsInBackground(diagnostics, {
      'phase': "batch-validation",
      'prompt': _0xc04c88,
      'systemPrompt': STORY_EPISODES_SPLIT_VALIDATION_SYSTEM_PROMPT,
      'automaticCallLimit': 0x2,
      'details': {
        'status': "failed",
        'requestIndex': 0x2,
        'requestCount': 0x2,
        'episodeCount': _0x18f4a5["length"],
        'elapsedMs': Math["max"](0x0, Date["now"]() - _0x521034),
        'errorType': normalizeText(_0x4ed79b?.["type"] || _0x4ed79b?.["name"]),
        'errorMessage': normalizeText(_0x4ed79b?.["message"] || _0x4ed79b)
      }
    });
  }
  const _0x1d4de0 = _0x43f5e9 ? getResultText(_0x43f5e9) : hasStoryEpisodeSplitTransportModelOutput(_0x4dcf16?.['raw']) ? serializeStoryEpisodeSplitTransportRaw(_0x4dcf16) : '';
  const _0x449c3b = [...(normalizeText(_0x1d4de0) ? [{
    'phase': "validation",
    'rawResponse': _0x1d4de0
  }] : []), {
    'phase': "generation",
    'rawResponse': _0x1d9deb
  }];
  let _0x2c407b = [];
  let _0x4f27d5 = '';
  let _0x405306 = null;
  for (const _0x2705e3 of _0x449c3b) {
    try {
      const _0x596503 = getStoryEpisodesSplitResponseEntries(parseStrictJson(_0x2705e3["rawResponse"], "Agent 未返回批量分镜结果。"));
      if (!_0x596503["length"]) {
        throw new Error('Agent\x20返回结果没有可用分集。');
      }
      _0x2c407b = _0x596503;
      _0x4f27d5 = _0x2705e3["rawResponse"];
      break;
    } catch (_0x388df1) {
      _0x405306 = _0x388df1;
    }
  }
  if (!_0x2c407b['length']) {
    const _0x2e6f6b = _0x405306 || _0x4dcf16 || new Error("批量分镜返回无法解析。");
    const _0x2e7db8 = getStoryEpisodeReferenceAliases(_0x18f4a5[0x0])[0x0] || "episode-1";
    const _0x454041 = ["首次生成返回：", _0x1d9deb, ...(normalizeText(_0x1d4de0) ? ['', '检查修复返回：', _0x1d4de0] : [])]['join']('\x0a');
    _0x2e6f6b["partialResults"] = [createStoryEpisodeSplitRawResponsePartialResult({
      'episodeRef': _0x2e7db8,
      'rawResponse': _0x454041,
      'attempts': _0x43f5e9 || _0x4dcf16 ? 0x2 : 0x1,
      'error': _0x2e6f6b
    })];
    _0x2e6f6b['message'] = (normalizeText(_0x2e6f6b?.["message"]) || '批量分镜返回无法解析。') + "（生成和检查结果均无法解析，已保存原始返回；未发起第三次请求。）";
    throw _0x2e6f6b;
  }
  const _0xa09854 = new Set(_0x2c407b['map']((_0x52c3fa, _0x2a06a0) => _0x2a06a0));
  const _0x4dcc6f = _0x18f4a5['map']((_0x43bbc1, _0x276326) => {
    const _0x35d8ca = new Set(getStoryEpisodeReferenceAliases(_0x43bbc1));
    let _0x11beba = _0x2c407b["findIndex"]((_0x3cffb2, _0x4122b5) => _0xa09854["has"](_0x4122b5) && _0x35d8ca["has"](getStoryEpisodesSplitEntryRef(_0x3cffb2)));
    if (_0x11beba < 0x0 && _0xa09854["has"](_0x276326)) {
      _0x11beba = _0x276326;
    }
    if (_0x11beba < 0x0) {
      _0x11beba = [..._0xa09854][0x0] ?? -0x1;
    }
    const _0x148a46 = getStoryEpisodeReferenceAliases(_0x43bbc1)[0x0] || "episode-" + (_0x276326 + 0x1);
    if (_0x11beba < 0x0) {
      return {
        'episodeRef': _0x148a46,
        'status': "rejected",
        'error': new Error("Agent 未返回该分集的分镜结果。")
      };
    }
    _0xa09854["delete"](_0x11beba);
    const _0x5cdb8b = _0x2c407b[_0x11beba];
    const _0x1c9ab6 = selectStoryEpisodeSplitAssets(assets, _0x43bbc1);
    try {
      return {
        'episodeRef': _0x148a46,
        'status': "fulfilled",
        'result': parseStoryEpisodesSplitEntry({
          'entry': _0x5cdb8b,
          'episode': _0x43bbc1,
          'scriptMode': normalizeStoryScriptMode(project?.["scriptMode"]),
          'assets': _0x1c9ab6,
          'constraints': _0x52592b,
          'clipDurationConstraints': _0x401b81,
          'promptMode': _0x3395cd
        })
      };
    } catch (_0x2a3255) {
      return {
        'episodeRef': _0x148a46,
        'status': "rejected",
        'error': _0x2a3255,
        'partialResult': _0x2a3255?.['partialResult'] || createStoryEpisodeSplitRawResponsePartialResult({
          'episodeRef': _0x148a46,
          'rawResponse': JSON["stringify"](_0x5cdb8b),
          'attempts': 0x1,
          'error': _0x2a3255
        })
      };
    }
  });
  return {
    'rawResponse': _0x4f27d5,
    'items': _0x4dcc6f
  };
}
export function splitStoryEpisodeChecked(_0x4d90f1 = {}) {
  return splitStoryEpisode({
    ..._0x4d90f1,
    'compactPrompt': !![],
    'skipRequestQueue': !![]
  });
}
export async function splitStoryEpisodesBatch({
  episodes = [],
  onProgress = null,
  ..._0x590c73
} = {}) {
  const _0x1d2b07 = Array['isArray'](episodes) ? episodes["filter"](Boolean) : [];
  if (!_0x1d2b07["length"]) {
    throw new Error("没有可生成分镜的分集。");
  }
  const _0x134bc6 = await Promise["all"](_0x1d2b07["map"](async (_0x49ddbb, _0x1ca8b2) => {
    const _0x409890 = getStoryEpisodeReferenceAliases(_0x49ddbb)[0x0] || 'episode-' + (_0x1ca8b2 + 0x1);
    try {
      const _0x452135 = await splitStoryEpisodeChecked({
        ..._0x590c73,
        'episode': _0x49ddbb,
        'onInvocation': _0x169d53 => _0x590c73["onInvocation"]?.({
          ..._0x169d53,
          'episodeRef': _0x409890,
          'episodeIndex': _0x1ca8b2
        }),
        'onProgress': (_0x2c4d64 = {}) => onProgress?.({
          ..._0x2c4d64,
          'episodeRef': _0x409890,
          'episodeIndex': _0x1ca8b2,
          'episodeCount': _0x1d2b07["length"]
        })
      });
      return {
        'episodeRef': _0x409890,
        'status': "fulfilled",
        'result': _0x452135
      };
    } catch (_0x1c6386) {
      return {
        'episodeRef': _0x409890,
        'status': "rejected",
        'error': _0x1c6386,
        ...(_0x1c6386?.["partialResult"] ? {
          'partialResult': _0x1c6386["partialResult"]
        } : {})
      };
    }
  }));
  return {
    'items': _0x134bc6
  };
}
export async function splitStoryEpisode({
  project = {},
  episode = {},
  assets = [],
  constraints = {},
  model = '',
  provider = '',
  providerProfileId = '',
  request = generateText,
  onProgress = null,
  repairDraft = null,
  diagnostics = null,
  clipDurationConstraints = null,
  compactPrompt = ![],
  skipRequestQueue = ![],
  onInvocation = null
} = {}) {
  assertPlanningModel(model, provider);
  const _0x2c18d3 = selectStoryEpisodeSplitAssets(assets, episode);
  const _0x1b0868 = resolveStoryPlanningConstraints(project, constraints);
  const _0x77cdb5 = resolveStoryPromptMode(project, constraints);
  const _0x3195b9 = normalizeStoryEpisodeClipDurationConstraints(clipDurationConstraints);
  const _0x4e2f31 = a158_0x4e1501(episode?.["ref"] || episode?.["planningRef"] || episode?.['id'], 'episode-1');
  const _0x2ff2fd = [episode];
  const _0x7112ba = _0x2ff2fd["length"];
  const _0x4a370c = STORY_EPISODE_SPLIT_MAX_OUTPUT_TOKENS;
  const _0x2e0a4d = [getStoryEpisodeSplitRequestSystemPrompt({
    'compactPrompt': compactPrompt,
    'promptMode': _0x77cdb5
  }), buildVideoReplicationTimingGuidance(episode)]["filter"](Boolean)["join"]('\x0a');
  const _0xb231fb = createStoryEpisodeDefaultSplitParseContext({
    'episodeRef': _0x4e2f31,
    'episode': episode,
    'scriptMode': normalizeStoryScriptMode(project?.['scriptMode']),
    'constraints': _0x1b0868,
    'assets': _0x2c18d3,
    'clipDurationConstraints': _0x3195b9,
    'promptMode': _0x77cdb5
  });
  const _0x225151 = [];
  for (let _0x1f0fd2 = 0x0; _0x1f0fd2 < _0x7112ba; _0x1f0fd2 += 0x1) {
    const _0x3883c4 = _0x2ff2fd[_0x1f0fd2];
    const _0x46c528 = selectStoryEpisodeSplitAssets(_0x2c18d3, _0x3883c4);
    onProgress?.({
      'stage': 'splitting-episode',
      'current': _0x1f0fd2 + 0x1,
      'total': _0x7112ba,
      'message': repairDraft ? "正在重新生成整集分镜" : "正在生成分镜脚本"
    });
    const _0xfe07ad = (compactPrompt ? buildStoryEpisodeMinimalSplitPrompt : buildStoryEpisodeSplitPrompt)({
      'project': project,
      'episode': _0x3883c4,
      'assets': _0x46c528,
      'constraints': {
        ..._0x1b0868,
        'promptMode': _0x77cdb5
      },
      'clipDurationConstraints': _0x3195b9
    });
    const _0xb2c21b = {
      'model': normalizeText(model),
      'provider': normalizeText(provider),
      ...buildStoryTextProviderProfilePayload(providerProfileId),
      'prompt': _0xfe07ad,
      'systemPrompt': _0x2e0a4d,
      'thinking': {
        'type': "disabled"
      },
      'temperature': STORY_EPISODE_SPLIT_TEMPERATURE,
      'maxOutputTokens': _0x4a370c,
      'timeoutMs': STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS
    };
    const _0x1491e3 = Date["now"]();
    reportStoryEpisodeSplitRequestDiagnostics(diagnostics, {
      'phase': repairDraft ? "manual-regeneration" : 'full-generation',
      'prompt': _0xfe07ad,
      'systemPrompt': _0x2e0a4d,
      'automaticCallLimit': _0x7112ba,
      'details': {
        'status': "queued",
        'requestIndex': _0x1f0fd2 + 0x1,
        'requestCount': _0x7112ba,
        'outputTokenLimitMode': "explicit",
        'maxOutputTokens': _0x4a370c,
        'requestTimeoutMode': "bounded",
        'requestTimeoutMs': STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS,
        'assetCount': _0x2c18d3["length"],
        'includesAdjacentEpisodes': ![],
        'blueprintRequestCount': 0x0
      }
    });
    let _0x498e27;
    try {
      const _0x185fbf = async () => {
        const _0x1e3429 = Date["now"]();
        const _0x48c03e = Math['max'](0x0, _0x1e3429 - _0x1491e3);
        reportStoryEpisodeSplitRequestDiagnosticsInBackground(diagnostics, {
          'phase': repairDraft ? "manual-regeneration" : "full-generation",
          'prompt': _0xfe07ad,
          'systemPrompt': _0x2e0a4d,
          'automaticCallLimit': _0x7112ba,
          'details': {
            'status': 'started',
            'requestIndex': _0x1f0fd2 + 0x1,
            'requestCount': _0x7112ba,
            'queueWaitMs': _0x48c03e,
            'maxOutputTokens': _0x4a370c,
            'requestTimeoutMs': STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS
          }
        });
        try {
          const _0x217bc5 = await invokeStoryGenerationRequest({
            'request': request,
            'requestPayload': _0xb2c21b,
            'stepId': repairDraft ? "manual-regeneration" : "generation",
            'attempt': _0x1f0fd2 + 0x1,
            'onInvocation': onInvocation,
            'serializeResponse': getResultText
          });
          const _0x4cb220 = getStoryEpisodeSplitSerializedMetrics(getResultText(_0x217bc5));
          reportStoryEpisodeSplitRequestDiagnosticsInBackground(diagnostics, {
            'phase': repairDraft ? 'manual-regeneration' : "full-generation",
            'prompt': _0xfe07ad,
            'systemPrompt': _0x2e0a4d,
            'automaticCallLimit': _0x7112ba,
            'details': {
              'status': "succeeded",
              'requestIndex': _0x1f0fd2 + 0x1,
              'requestCount': _0x7112ba,
              'queueWaitMs': _0x48c03e,
              'elapsedMs': Math["max"](0x0, Date["now"]() - _0x1e3429),
              'responseCharacters': _0x4cb220["characters"],
              'responseBytes': _0x4cb220["bytes"],
              ...getStoryEpisodeSplitResponseTiming(_0x217bc5),
              'maxOutputTokens': _0x4a370c,
              'requestTimeoutMs': STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS
            }
          });
          return _0x217bc5;
        } catch (_0x1f6bf6) {
          reportStoryEpisodeSplitRequestDiagnosticsInBackground(diagnostics, {
            'phase': repairDraft ? "manual-regeneration" : 'full-generation',
            'prompt': _0xfe07ad,
            'systemPrompt': _0x2e0a4d,
            'automaticCallLimit': _0x7112ba,
            'details': {
              'status': "failed",
              'requestIndex': _0x1f0fd2 + 0x1,
              'requestCount': _0x7112ba,
              'queueWaitMs': _0x48c03e,
              'elapsedMs': Math['max'](0x0, Date["now"]() - _0x1e3429),
              'errorType': normalizeText(_0x1f6bf6?.["type"] || _0x1f6bf6?.["name"]),
              'errorMessage': normalizeText(_0x1f6bf6?.["message"] || _0x1f6bf6),
              'maxOutputTokens': _0x4a370c,
              'requestTimeoutMs': STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS
            }
          });
          throw _0x1f6bf6;
        }
      };
      const _0x2a9f4c = () => requestStoryEpisodeExperimentalWithRetry(() => _0x185fbf());
      _0x498e27 = skipRequestQueue ? await _0x2a9f4c() : await enqueueStoryEpisodeRequest(_0x2a9f4c);
    } catch (_0x2d92a8) {
      _0x2d92a8["message"] = (normalizeText(_0x2d92a8?.["message"]) || "分镜生成请求失败。") + (isStoryEpisodeExperimentalRetryable(_0x2d92a8) ? "（已自动重试仍未成功，请稍后再试或改用响应更快的模型。）" : "（本次请求不可自动重试，未生成本地替代分镜。）");
      hasStoryEpisodeSplitTransportModelOutput(_0x2d92a8?.["raw"]) && (_0x2d92a8["partialResult"] = createStoryEpisodeSplitRawResponsePartialResult({
        'episodeRef': _0x4e2f31,
        'rawResponse': serializeStoryEpisodeSplitTransportRaw(_0x2d92a8),
        'attempts': _0x1f0fd2 + 0x1,
        'error': _0x2d92a8
      }));
      throw _0x2d92a8;
    }
    try {
      const _0x122ef3 = parseStrictJson(getResultText(_0x498e27), "Agent 未返回片段拆分结果。");
      if (!Array["isArray"](_0x122ef3?.["clips"]) || !_0x122ef3['clips']["length"]) {
        throw new Error("Agent 返回结果没有可用镜头。");
      }
      _0x225151['push']({
        'response': _0x498e27,
        'requestEpisode': _0x3883c4,
        'requestAssets': _0x46c528,
        'responseData': _0x122ef3
      });
    } catch (_0x1ddc10) {
      _0x1ddc10['partialResult'] = createStoryEpisodeSplitRawResponsePartialResult({
        'episodeRef': _0x4e2f31,
        'rawResponse': getResultText(_0x498e27),
        'attempts': _0x1f0fd2 + 0x1,
        'error': _0x1ddc10
      });
      _0x1ddc10['message'] = (normalizeText(_0x1ddc10?.["message"]) || "当前返回无法解析。") + '（已保留原始返回；未用本地内容替换，未自动重试。）';
      throw _0x1ddc10;
    }
  }
  let _0x54b09b;
  try {
    const _0x44944a = _0x225151["flatMap"](({
      response: _0x737fa8,
      requestEpisode: _0x4bdb1c,
      requestAssets: _0x214da9,
      responseData: _0x52a620
    }) => {
      return expandStoryEpisodeSplitCompactData(_0x52a620, {
        'episodeRef': _0x4e2f31,
        'episode': _0x4bdb1c,
        'assets': _0x214da9
      })["clips"] || [];
    });
    const _0x2d7082 = _0x7112ba > 0x1 ? _0x44944a["map"]((_0x105545, _0x37532e) => ({
      ..._0x105545,
      'ref': 'clip-' + (_0x37532e + 0x1)
    })) : _0x44944a;
    _0x54b09b = {
      ...normalizeStoryEpisodeSplitDraft({
        'text': JSON["stringify"]({
          'episodeRef': _0x4e2f31,
          'clips': _0x2d7082
        })
      }, _0xb231fb),
      'rawResponse': _0x225151["map"](({
        response: _0x5c7581
      }) => getResultText(_0x5c7581))["join"]('\x0a\x0a')
    };
  } catch (_0x333aea) {
    const _0x3f3cb3 = _0x225151['map'](({
      response: _0xf73b22
    }) => getResultText(_0xf73b22))['join']('\x0a\x0a');
    _0x333aea["partialResult"] = createStoryEpisodeSplitRawResponsePartialResult({
      'episodeRef': _0x4e2f31,
      'rawResponse': _0x3f3cb3,
      'attempts': _0x7112ba,
      'error': _0x333aea
    });
    _0x333aea["message"] = (normalizeText(_0x333aea?.["message"]) || "Agent 返回格式无法解析。") + "（已保存本次原始返回；未自动发起第二次请求。）";
    throw _0x333aea;
  }
  let _0x1b4e2c = finalizeStoryEpisodeSplitDraft(_0x54b09b);
  if (_0x1b4e2c) {
    return _0x1b4e2c;
  }
  if (canRepairStoryEpisodeSplitPartialDraft(_0x54b09b)) {
    const _0x833104 = _0x54b09b["items"]['filter'](_0x285a39 => _0x285a39?.["status"] !== "valid")["length"];
    const _0x42c5fb = buildStoryEpisodeSplitPartialRepairPrompt({
      'draft': _0x54b09b,
      'episode': episode,
      'assets': _0x2c18d3,
      'constraints': _0x1b0868,
      'schemaVersion': STORY_EPISODE_SPLIT_SCHEMA_VERSION,
      'clipMaxSeconds': resolveStoryPromptModeClipMaxSeconds(_0x77cdb5, _0x1b0868['sceneMaxSeconds']),
      'timingGuidance': [STORY_EPISODE_SPLIT_ADAPTIVE_TIMING_GUIDANCE, buildVideoReplicationTimingGuidance(episode)]["filter"](Boolean)["join"]('\x0a'),
      'dialogueSpeakerGuidance': STORY_EPISODE_SPLIT_DIALOGUE_SPEAKER_GUIDANCE,
      'groupingGuidance': STORY_EPISODE_SPLIT_GROUPING_GUIDANCE,
      'timelineRequirements': getStoryEpisodeTimelinePlanningRequirements(_0x77cdb5),
      'continuousTimeline': isStoryContinuousTimelinePromptMode(_0x77cdb5)
    });
    onProgress?.({
      'stage': "repairing-episode-split",
      'current': 0x0,
      'total': _0x833104,
      'message': "正在定点修复 " + _0x833104 + " 个格式或校验未通过的片段"
    });
    reportStoryEpisodeSplitRequestDiagnostics(diagnostics, {
      'phase': "targeted-repair",
      'prompt': _0x42c5fb,
      'systemPrompt': _0x2e0a4d,
      'failedClipCount': _0x833104,
      'carriesFullEpisodeContext': ![],
      'automaticCallLimit': 0x1,
      'details': {
        'status': "queued",
        'requestIndex': 0x1,
        'requestCount': 0x1
      }
    });
    let _0x9892d2 = null;
    try {
      const _0x44e9e8 = () => invokeStoryGenerationRequest({
        'request': request,
        'requestPayload': {
          'model': normalizeText(model),
          'provider': normalizeText(provider),
          ...buildStoryTextProviderProfilePayload(providerProfileId),
          'prompt': _0x42c5fb,
          'systemPrompt': _0x2e0a4d,
          'thinking': {
            'type': "disabled"
          },
          'temperature': STORY_EPISODE_SPLIT_TEMPERATURE,
          'maxOutputTokens': STORY_EPISODE_SPLIT_MAX_OUTPUT_TOKENS,
          'timeoutMs': STORY_EPISODE_SPLIT_REQUEST_TIMEOUT_MS
        },
        'stepId': "generation-repair",
        'attempt': 0x2,
        'onInvocation': onInvocation,
        'serializeResponse': getResultText
      });
      _0x9892d2 = skipRequestQueue ? await _0x44e9e8() : await enqueueStoryEpisodeRequest(_0x44e9e8);
      const _0x3e53d9 = parseStrictJson(getResultText(_0x9892d2), "Agent 未返回片段局部修复结果。");
      _0x54b09b = applyStoryEpisodeSplitPartialRepairs(_0x3e53d9, _0x54b09b, {
        'parseReplacementClips': _0x1addb1 => parseStoryEpisodeSplitResult({
          'episodeRef': _0x54b09b["episodeRef"],
          'clips': _0x1addb1
        }, _0xb231fb)["clips"],
        'serializeValidationError': (_0x502f8a, _0x71cb00) => serializeStoryEpisodeSplitValidationError(_0x502f8a, {
          'clipIndex': _0x71cb00["sourceIndex"],
          'clipCount': _0x54b09b["items"]["length"]
        })
      });
    } catch (_0x53bf8c) {
      _0x54b09b = appendStoryEpisodeSplitPartialRepairFailure(_0x54b09b, _0x53bf8c);
    }
    const _0x4a0607 = getResultText(_0x9892d2);
    _0x4a0607 && (_0x54b09b['rawResponse'] = [_0x54b09b["rawResponse"], '局部修复返回：', _0x4a0607]['filter'](Boolean)['join']('\x0a\x0a'));
    _0x1b4e2c = finalizeStoryEpisodeSplitDraft(_0x54b09b);
    if (_0x1b4e2c) {
      return assertStoryEpisodeSplitTiming(_0x1b4e2c, episode);
    }
  }
  throwStoryEpisodeSplitPartialResult(_0x54b09b);
}
const STORY_EPISODE_EXPERIMENTAL_DRAFT_STRATEGY = 'semantic-shot-batches-v3';
const STORY_EPISODE_EXPERIMENTAL_TRANSPORT_ATTEMPTS = 0x2;
const STORY_EPISODE_EXPERIMENTAL_RETRY_DELAY_MS = 0x258;
function cloneStoryEpisodeExperimentalValue(_0x463d96) {
  if (!_0x463d96 || typeof _0x463d96 !== "object") {
    return null;
  }
  try {
    return JSON["parse"](JSON['stringify'](_0x463d96));
  } catch {
    return null;
  }
}
function hashStoryEpisodeExperimentalValue(_0x1e209d) {
  const _0x563968 = JSON['stringify'](_0x1e209d);
  let _0x5a837e = 0x811c9dc5;
  for (let _0x138bfd = 0x0; _0x138bfd < _0x563968["length"]; _0x138bfd += 0x1) {
    _0x5a837e ^= _0x563968["charCodeAt"](_0x138bfd);
    _0x5a837e = Math["imul"](_0x5a837e, 0x1000193);
  }
  return STORY_EPISODE_BATCHED_SPLIT_SCHEMA_VERSION + '-' + (_0x5a837e >>> 0x0)["toString"](0x10)['padStart'](0x8, '0') + '-' + _0x563968["length"];
}
function createStoryEpisodeExperimentalFingerprint({
  project = {},
  episodeRef = '',
  sourceBeats = [],
  assets = [],
  constraints = {},
  model = '',
  provider = '',
  providerProfileId = '',
  promptExperiment = ![],
  promptMode = 'seedance-2.0',
  timingBudget = null
} = {}) {
  const _0x328893 = normalizeStoryProjectInput(project);
  return hashStoryEpisodeExperimentalValue({
    'episodeRef': episodeRef,
    'sourceBeats': sourceBeats,
    'assets': assets,
    'constraints': constraints,
    'model': normalizeText(model),
    'provider': normalizeText(provider),
    'providerProfileId': normalizeText(providerProfileId),
    'promptExperiment': promptExperiment === !![],
    'promptMode': normalizeText(promptMode)["toLowerCase"]() || 'seedance-2.0',
    'timingBudget': timingBudget,
    'scriptMode': _0x328893["scriptMode"],
    'aspectRatio': _0x328893["aspectRatio"],
    'visualStyle': _0x328893["visualStyle"]
  });
}
function isStoryEpisodeExperimentalTimeout(_0x68c015) {
  const _0x1c8137 = normalizeText(_0x68c015?.["type"])["toUpperCase"]();
  const _0x133000 = normalizeText(_0x68c015?.["name"])["toLowerCase"]();
  const _0x969b9 = normalizeText(_0x68c015?.['message'])["toLowerCase"]();
  return _0x1c8137 === "TIMEOUT" || _0x133000 === "aborterror" || /timeout|timed out|超时/u["test"](_0x969b9);
}
function isStoryEpisodeExperimentalPromptTooLong(_0x154d3a) {
  const _0x2b6931 = Number(_0x154d3a?.["status"] || _0x154d3a?.["statusCode"] || 0x0);
  const _0x12cdee = normalizeText(_0x154d3a?.["message"])['toLowerCase']();
  return _0x2b6931 === 0x19d || /提示词过长|prompt.{0,24}too long|context.{0,24}(length|limit)|request entity too large/u["test"](_0x12cdee);
}
function isStoryEpisodeExperimentalBatchShrinkable(_0x48e2a7) {
  return isStoryEpisodeExperimentalTimeout(_0x48e2a7) || isStoryEpisodeExperimentalPromptTooLong(_0x48e2a7);
}
function isStoryEpisodeExperimentalRetryable(_0x461e6a) {
  const _0x3db5cf = Number(_0x461e6a?.['status'] || _0x461e6a?.["statusCode"] || 0x0);
  return _0x461e6a?.["retryable"] === !![] || isStoryEpisodeExperimentalTimeout(_0x461e6a) || _0x3db5cf === 0x1ad || _0x3db5cf >= 0x1f4;
}
function waitForStoryEpisodeExperimentalRetry(_0x208102) {
  return new Promise(_0x5ed645 => setTimeout(_0x5ed645, _0x208102));
}
async function settleStoryEpisodeExperimentalBatches(_0x39c1d9 = [], _0x5aa6c4, _0x1e3be9 = STORY_EPISODE_EXPERIMENTAL_MAX_CONCURRENT_BATCHES) {
  const _0x3f990d = Array["isArray"](_0x39c1d9) ? _0x39c1d9 : [];
  const _0xa5c7d7 = new Array(_0x3f990d["length"]);
  let _0x16f940 = 0x0;
  const _0x19d654 = Math["min"](_0x3f990d["length"], Math["max"](0x1, Math["trunc"](Number(_0x1e3be9) || 0x1)));
  const _0xffab64 = Array["from"]({
    'length': _0x19d654
  }, async () => {
    while (_0x16f940 < _0x3f990d["length"]) {
      const _0x46e878 = _0x16f940;
      _0x16f940 += 0x1;
      try {
        _0xa5c7d7[_0x46e878] = {
          'status': "fulfilled",
          'value': await _0x5aa6c4(_0x3f990d[_0x46e878], _0x46e878)
        };
      } catch (_0x290d25) {
        _0xa5c7d7[_0x46e878] = {
          'status': "rejected",
          'reason': _0x290d25
        };
      }
    }
  });
  await Promise["all"](_0xffab64);
  return _0xa5c7d7;
}
async function requestStoryEpisodeExperimentalWithRetry(_0x52144b, {
  maxAttempts = STORY_EPISODE_EXPERIMENTAL_TRANSPORT_ATTEMPTS,
  retryWait = waitForStoryEpisodeExperimentalRetry,
  splitOversizedBatch = ![]
} = {}) {
  const _0x339a79 = Math["max"](0x1, Math['trunc'](Number(maxAttempts) || 0x1));
  let _0x638ff6 = null;
  for (let _0x552efe = 0x1; _0x552efe <= _0x339a79; _0x552efe += 0x1) {
    try {
      return await _0x52144b(_0x552efe, _0x638ff6);
    } catch (_0x4e5c92) {
      if (splitOversizedBatch && isStoryEpisodeExperimentalBatchShrinkable(_0x4e5c92)) {
        throw _0x4e5c92;
      }
      if (!isStoryEpisodeExperimentalRetryable(_0x4e5c92) || _0x552efe >= _0x339a79) {
        throw _0x4e5c92;
      }
      _0x638ff6 = _0x4e5c92;
      await retryWait(STORY_EPISODE_EXPERIMENTAL_RETRY_DELAY_MS * 0x2 ** (_0x552efe - 0x1), _0x4e5c92, _0x552efe);
    }
  }
  throw new Error("实验分批请求重试失败。");
}
function restoreStoryEpisodeExperimentalDraft(_0x427415, {
  episodeRef = '',
  sourceFingerprint = '',
  sourceScenes = [],
  sourceBeats = [],
  assets = [],
  constraints = {},
  promptExperiment = ![],
  promptMode = "seedance-2.0"
} = {}) {
  const _0x2a03fa = cloneStoryEpisodeExperimentalValue(_0x427415);
  if (!_0x2a03fa || _0x2a03fa["strategy"] !== STORY_EPISODE_EXPERIMENTAL_DRAFT_STRATEGY || _0x2a03fa["schemaVersion"] !== STORY_EPISODE_BATCHED_SPLIT_SCHEMA_VERSION || normalizeText(_0x2a03fa["episodeRef"]) !== episodeRef || normalizeText(_0x2a03fa["sourceFingerprint"]) !== sourceFingerprint) {
    return null;
  }
  try {
    const _0x46334c = parseStoryEpisodeSplitBlueprint(_0x2a03fa['blueprint'], {
      'episodeRef': episodeRef,
      'sourceScenes': sourceScenes,
      'sourceBeats': sourceBeats,
      'assets': assets,
      'constraints': constraints,
      'enforceMaxDuration': ![],
      'includeDirectorContinuity': promptExperiment === !![]
    });
    const _0x252345 = new Map(_0x46334c['clipPlans']["map"](_0x2e4f83 => [normalizeText(_0x2e4f83?.["ref"]), _0x2e4f83]));
    const _0x3a1cf6 = Array["isArray"](_0x2a03fa['completedClips']) ? _0x2a03fa["completedClips"] : [];
    const _0x16498b = Array['isArray'](_0x2a03fa["completedPlanResults"]) ? _0x2a03fa["completedPlanResults"] : _0x3a1cf6["filter"](_0x35a479 => _0x252345["has"](normalizeText(_0x35a479?.["ref"])))['map'](_0x29bed1 => ({
      'sourcePlanRef': normalizeText(_0x29bed1?.["ref"]),
      'clips': [_0x29bed1]
    }));
    const _0xbb286f = new Map(_0x16498b["map"](_0xa2e708 => [normalizeText(_0xa2e708?.['sourcePlanRef']), _0xa2e708]));
    if (_0xbb286f["size"] !== _0x16498b["length"] || _0x16498b["some"](_0x1dd94b => !_0x252345['has'](normalizeText(_0x1dd94b?.["sourcePlanRef"])))) {
      return null;
    }
    const _0x3df9be = [];
    const _0x237fbb = new Set();
    _0x46334c["clipPlans"]['forEach'](_0x230243 => {
      const _0x5655da = _0xbb286f["get"](_0x230243["ref"]);
      if (!_0x5655da) {
        return;
      }
      const _0x45b1b7 = parseStoryEpisodeSplitResult({
        'episodeRef': episodeRef,
        'clips': Array["isArray"](_0x5655da["clips"]) ? _0x5655da["clips"] : []
      }, {
        'episodeRef': episodeRef,
        'constraints': constraints,
        'assets': assets,
        'clipPlans': [_0x230243],
        'minimumShotsPerClip': 0x1,
        'maximumShotsPerClip': STORY_EPISODE_EXPERIMENTAL_MAX_SHOTS_PER_CLIP,
        'enforceMaxDuration': ![],
        'repairMissingShotFields': !![],
        'allowEmptyAudio': !![],
        'requireAllPlanCharacters': ![],
        'completePlanSceneUsage': !![],
        'includeCutAfter': !![],
        'promptMode': promptMode
      });
      if (_0x45b1b7['clips']["some"](_0x439504 => _0x237fbb["has"](_0x439504["ref"]))) {
        throw new Error("实验分批断点包含重复的片段引用。");
      }
      _0x45b1b7['clips']["forEach"](_0x39c230 => _0x237fbb["add"](_0x39c230["ref"]));
      _0x3df9be["push"]({
        'sourcePlanRef': _0x230243["ref"],
        'clips': _0x45b1b7['clips']
      });
    });
    const _0x415bd7 = new Set(_0x3df9be["map"](_0x4a78d2 => _0x4a78d2["sourcePlanRef"]));
    const _0x38d1b0 = _0x3df9be["flatMap"](_0x42a44c => _0x42a44c["clips"]);
    return {
      ..._0x2a03fa,
      'blueprint': _0x46334c,
      'completedPlanResults': _0x3df9be,
      'completedClips': _0x38d1b0,
      'failedBatchRefs': normalizeStringArray(_0x2a03fa["failedBatchRefs"])["filter"](_0x5c47a4 => !_0x415bd7["has"](_0x5c47a4) && _0x252345["has"](_0x5c47a4)),
      'attempts': Math["max"](0x0, Math['trunc'](Number(_0x2a03fa['attempts']) || 0x0))
    };
  } catch {
    return null;
  }
}
async function saveStoryEpisodeExperimentalCheckpoint(_0x57393e, _0x584665) {
  _0x57393e["updatedAt"] = Date["now"]();
  typeof _0x584665 === "function" && (await _0x584665(cloneStoryEpisodeExperimentalValue(_0x57393e)));
  return _0x57393e;
}
function createStoryEpisodeExperimentalBatchDraft(_0x2cfbcf, {
  episodeRef = '',
  clipPlans = [],
  constraints = {},
  assets = [],
  promptMode = 'seedance-2.0'
} = {}) {
  const _0x4c42d6 = normalizeStoryEpisodeSplitDraft(_0x2cfbcf, {
    'episodeRef': episodeRef,
    'constraints': constraints,
    'assets': assets,
    'clipPlans': clipPlans,
    'minimumShotsPerClip': 0x1,
    'maximumShotsPerClip': STORY_EPISODE_EXPERIMENTAL_MAX_SHOTS_PER_CLIP,
    'enforceMaxDuration': ![],
    'repairMissingShotFields': !![],
    'allowEmptyAudio': !![],
    'requireAllPlanCharacters': ![],
    'completePlanSceneUsage': !![],
    'includeCutAfter': !![],
    'promptMode': promptMode
  });
  const _0x4732a5 = clipPlans["map"](_0x2ba2bb => normalizeText(_0x2ba2bb?.["ref"]));
  const _0x533d9e = new Set(_0x4732a5);
  const _0x4910fc = new Map();
  _0x4c42d6["items"]['forEach'](_0x545afd => {
    const _0x31e1df = normalizeText(_0x545afd?.["sourceClipRef"]);
    if (!_0x31e1df || !_0x533d9e["has"](_0x31e1df)) {
      return;
    }
    if (_0x4910fc["has"](_0x31e1df)) {
      _0x4910fc['set'](_0x31e1df, {
        'status': "invalid",
        'sourceIndex': _0x4732a5["indexOf"](_0x31e1df),
        'sourceClipRef': _0x31e1df,
        'rawClips': [],
        'error': {
          'message': "Agent 重复返回了计划“" + _0x31e1df + '”。'
        }
      });
      return;
    }
    _0x4910fc['set'](_0x31e1df, _0x545afd);
  });
  const _0x265478 = _0x4732a5["map"]((_0x58732e, _0x14d2a6) => {
    const _0x5a723d = _0x4910fc['get'](_0x58732e);
    if (_0x5a723d) {
      return {
        ..._0x5a723d,
        'sourceIndex': _0x14d2a6,
        'sourceClipRef': _0x58732e
      };
    }
    return {
      'status': "invalid",
      'sourceIndex': _0x14d2a6,
      'sourceClipRef': _0x58732e,
      'rawClips': [],
      'error': {
        'message': 'Agent\x20未完整返回计划“' + _0x58732e + '”。'
      }
    };
  });
  return {
    ..._0x4c42d6,
    'items': _0x265478
  };
}
function finalizeStoryEpisodeExperimentalBatchDraft(_0x2f54bb = {}) {
  const _0x2bd300 = finalizeStoryEpisodeSplitDraft(_0x2f54bb);
  if (!_0x2bd300) {
    return null;
  }
  return {
    ..._0x2bd300,
    'planResults': _0x2f54bb["items"]['map'](_0x1f2e6b => ({
      'sourcePlanRef': _0x1f2e6b["sourceClipRef"],
      'clips': _0x1f2e6b['clips']
    }))
  };
}
function assertStoryEpisodeExperimentalPlanTiming(_0x534975 = {}, _0x4432fd = []) {
  const _0x33b11f = new Map((Array["isArray"](_0x534975?.["planResults"]) ? _0x534975["planResults"] : [])["map"](_0x2f8d8a => [normalizeText(_0x2f8d8a?.["sourcePlanRef"]), _0x2f8d8a]));
  const _0x3b2dfd = (Array["isArray"](_0x4432fd) ? _0x4432fd : [])['flatMap'](_0x49c4e7 => {
    const _0x58e5c0 = normalizeText(_0x49c4e7?.["ref"]);
    const _0x1a925f = normalizePositiveNumber(_0x49c4e7?.["targetDurationSec"]);
    const _0x5b5ac1 = _0x33b11f["get"](_0x58e5c0);
    if (!_0x58e5c0 || !_0x1a925f || !_0x5b5ac1) {
      return [];
    }
    const _0x279a11 = (Array['isArray'](_0x5b5ac1?.['clips']) ? _0x5b5ac1['clips'] : [])["reduce"]((_0x32f977, _0xee7a86) => _0x32f977 + (normalizePositiveNumber(_0xee7a86?.['durationSec']) || 0x0), 0x0);
    const _0x484292 = Number((_0x1a925f * 0.8)["toFixed"](0x1));
    const _0x5aa1dc = Number((_0x1a925f * 1.2)['toFixed'](0x1));
    if (_0x279a11 >= _0x484292 && _0x279a11 <= _0x5aa1dc) {
      return [];
    }
    return [{
      'planRef': _0x58e5c0,
      'totalDurationSeconds': _0x279a11,
      'targetDurationSec': _0x1a925f,
      'minimum': _0x484292,
      'maximum': _0x5aa1dc
    }];
  });
  if (!_0x3b2dfd["length"]) {
    return _0x534975;
  }
  const _0x516fac = _0x3b2dfd["slice"](0x0, 0x4)["map"](_0x8cd5fa => '计划“' + _0x8cd5fa['planRef'] + '”分镜合计\x20' + _0x8cd5fa['totalDurationSeconds'] + '\x20秒，审时预算\x20' + _0x8cd5fa["targetDurationSec"] + '\x20秒（允许\x20' + _0x8cd5fa["minimum"] + '-' + _0x8cd5fa["maximum"] + " 秒）")["join"]('；');
  const _0x48a150 = new Error("实验分批时长自检未通过：" + _0x516fac + '。');
  _0x48a150["code"] = "STORY_EPISODE_EXPERIMENTAL_PLAN_TIMING_MISMATCH";
  _0x48a150["retryable"] = !![];
  _0x48a150["timingMismatches"] = _0x3b2dfd;
  throw _0x48a150;
}
async function requestStoryEpisodeExperimentalBatchResult({
  request: _0x2a3c84,
  requestPayload: _0x583d8b,
  episodeRef = '',
  clipPlans = [],
  constraints = {},
  assets = [],
  promptMode = 'seedance-2.0',
  enforcePlanDurationTargets = ![]
} = {}) {
  const _0xb6ff71 = {
    'episodeRef': episodeRef,
    'clipPlans': clipPlans,
    'constraints': constraints,
    'assets': assets,
    'promptMode': promptMode
  };
  const _0x1a275f = await _0x2a3c84(_0x583d8b);
  const _0x241c62 = createStoryEpisodeExperimentalBatchDraft(_0x1a275f, _0xb6ff71);
  const _0x3db7c4 = getStoryEpisodeScriptFinishReason(_0x1a275f);
  const _0x42d28c = finalizeStoryEpisodeExperimentalBatchDraft(_0x241c62);
  if (_0x42d28c) {
    return enforcePlanDurationTargets ? assertStoryEpisodeExperimentalPlanTiming(_0x42d28c, clipPlans) : _0x42d28c;
  }
  const _0x2c04ad = _0x241c62["items"]["filter"](_0x2bf0c6 => _0x2bf0c6?.["status"] === "valid")['map'](_0x49f727 => ({
    'sourcePlanRef': _0x49f727["sourceClipRef"],
    'clips': _0x49f727["clips"]
  }));
  const _0x6e1392 = _0x241c62["items"]["find"](_0x395e94 => _0x395e94?.["status"] !== 'valid');
  const _0x38cbeb = new Error(['length', "max_tokens", "max_output_tokens"]["includes"](_0x3db7c4) ? "实验分批输出被截断（finish reason: " + _0x3db7c4 + '）。' : normalizeText(_0x6e1392?.["error"]?.["message"]) || "实验分批仍有片段未通过校验。");
  ["length", 'max_tokens', "max_output_tokens"]["includes"](_0x3db7c4) && (_0x38cbeb["type"] = 'OUTPUT_LENGTH', _0x38cbeb["finishReason"] = _0x3db7c4);
  _0x6e1392?.["error"]?.["validationDetails"] && (_0x38cbeb["validationDetails"] = _0x6e1392["error"]["validationDetails"]);
  _0x38cbeb["partialPlanResults"] = _0x2c04ad;
  throw _0x38cbeb;
}
export async function splitStoryEpisodeExperimental({
  project = {},
  episode = {},
  previousEpisode = null,
  nextEpisode = null,
  assets = [],
  constraints = {},
  model = '',
  provider = '',
  providerProfileId = '',
  promptExperiment = ![],
  request = generateText,
  onProgress = null,
  onCheckpoint = null,
  onInvocation = null,
  resumeDraft = null,
  retryWait = waitForStoryEpisodeExperimentalRetry,
  diagnostics = null
} = {}) {
  assertPlanningModel(model, provider);
  const _0x400a7a = normalizeText(model);
  const _0x502ea9 = normalizeText(provider);
  const _0x1a3027 = selectStoryEpisodeSplitAssets(assets, episode);
  const _0x153c3e = [...new Map((Array["isArray"](assets) ? assets : [])['map']((_0x345d7e, _0x530248) => normalizePlanningAssetSummary(_0x345d7e, _0x530248))["filter"](_0x1b00b3 => _0x1b00b3["name"])['map'](_0x48bf94 => [_0x48bf94["ref"], _0x48bf94]))["values"]()];
  const _0x3509dc = resolveStoryPlanningConstraints(project, constraints);
  const _0x165757 = resolveStoryPromptMode(project, constraints);
  const _0x4b371b = normalizeStoryEpisodeSplitSourceScenes(episode);
  const _0x2588c7 = normalizeStoryEpisodeExperimentalSourceBeats(episode);
  const _0x370d20 = getStoryEpisodeReferenceAliases(episode);
  assertStoryEpisodeSceneAssetCoverage(_0x4b371b, _0x1a3027, {
    'episodeRefs': _0x370d20
  });
  const _0xe64601 = a158_0x4e1501(episode?.["ref"] || episode?.['planningRef'] || episode?.['id'], "episode-1");
  const _0x4c82e7 = resolveStoryEpisodeSplitTimingBudget(episode);
  const _0x4c0985 = createStoryEpisodeExperimentalFingerprint({
    'project': project,
    'episodeRef': _0xe64601,
    'sourceBeats': _0x2588c7,
    'assets': _0x1a3027,
    'constraints': _0x3509dc,
    'model': _0x400a7a,
    'provider': _0x502ea9,
    'providerProfileId': providerProfileId,
    'promptExperiment': promptExperiment === !![],
    'promptMode': _0x165757,
    'timingBudget': _0x4c82e7
  });
  const _0x16605f = "episode-split-" + Date["now"]()['toString'](0x24) + '-' + _0x4c0985['slice'](-0xc);
  let _0x2ac356 = 0x0;
  let _0x2daedd = 0x0;
  const _0x468690 = (_0x3c79ff, _0x39a6db, _0x57550d) => {
    _0x2daedd += 0x1;
    return invokeStoryGenerationRequest({
      'request': _0x3c79ff,
      'requestPayload': _0x39a6db,
      'stepId': _0x57550d,
      'attempt': _0x2daedd,
      'onInvocation': onInvocation,
      'serializeResponse': getResultText
    });
  };
  const _0x5a40ce = () => {
    _0x2ac356 += 0x1;
    return _0x2ac356;
  };
  const _0x455ecc = {
    'projectId': normalizeText(project?.['id']),
    'episodeId': normalizeText(episode?.['id']),
    'episodeRef': _0xe64601,
    'episodeNumber': Math['max'](0x1, Math['trunc'](Number(episode?.["number"]) || 0x1)),
    'sourceBeatCount': _0x2588c7["length"],
    'selectedAssetCount': _0x1a3027["length"],
    'resumed': Boolean(resumeDraft)
  };
  let _0x343567 = restoreStoryEpisodeExperimentalDraft(resumeDraft, {
    'episodeRef': _0xe64601,
    'sourceFingerprint': _0x4c0985,
    'sourceScenes': _0x4b371b,
    'sourceBeats': _0x2588c7,
    'assets': _0x153c3e,
    'constraints': _0x3509dc,
    'promptExperiment': promptExperiment === !![],
    'promptMode': _0x165757
  });
  let _0xd14320 = _0x343567?.["blueprint"] ? reconcileStoryEpisodeSplitBlueprintTiming(_0x343567["blueprint"], episode) : null;
  if (_0x343567 && _0xd14320) {
    _0x343567["blueprint"] = _0xd14320;
  }
  if (!_0xd14320) {
    onProgress?.({
      'stage': "planning-episode-split-blueprint",
      'current': 0x1,
      'total': 0x1,
      'message': "正在规划整集分镜蓝图"
    });
    const _0x238c74 = buildStoryEpisodeSplitBlueprintPrompt({
      'project': project,
      'episode': episode,
      'previousEpisode': previousEpisode,
      'nextEpisode': nextEpisode,
      'assets': _0x1a3027,
      'constraints': _0x3509dc,
      'enforceMaxDuration': ![],
      'sourceBeatsOverride': _0x2588c7,
      'promptExperiment': promptExperiment === !![],
      'promptMode': _0x165757
    });
    const _0x2b06ff = JSON["parse"](_0x238c74);
    const _0x1ed502 = createStoryEpisodeExperimentalDiagnosticRequest({
      'request': request,
      'diagnostics': diagnostics,
      'runId': _0x16605f,
      'phase': "experimental-blueprint",
      'nextRequestSequence': _0x5a40ce,
      'carriesFullEpisodeContext': !![],
      'context': {
        ..._0x455ecc,
        'promptSectionCharacters': getStoryEpisodeExperimentalPromptSectionCharacters(_0x2b06ff)
      }
    });
    _0xd14320 = await requestStoryEpisodeExperimentalWithRetry(() => requestStrictResult({
      'request': _0x578831 => _0x468690(_0x1ed502, _0x578831, "experimental-blueprint"),
      'requestPayload': {
        'model': _0x400a7a,
        'provider': _0x502ea9,
        ...buildStoryTextProviderProfilePayload(providerProfileId),
        'prompt': _0x238c74,
        'systemPrompt': promptExperiment ? STORY_EPISODE_DIRECTOR_CONTINUITY_BLUEPRINT_SYSTEM_PROMPT : STORY_EPISODE_BATCHED_BLUEPRINT_SYSTEM_PROMPT,
        'thinking': {
          'type': 'disabled'
        },
        'allowOversizedPrompt': !![],
        'structuredOutput': createStoryEpisodeExperimentalStructuredOutput("story_episode_split_blueprint_v3", buildStoryEpisodeSplitBlueprintResponseSchema({
          ..._0x3509dc,
          'enforceMaxDuration': ![],
          'includeSceneAssetRef': Object['prototype']["hasOwnProperty"]["call"](_0x2b06ff?.["outputSchema"]?.["clipPlans"]?.[0x0] || {}, "sceneAssetRef"),
          'includeDirectorContinuity': promptExperiment === !![]
        })),
        'temperature': STORY_EPISODE_SPLIT_TEMPERATURE,
        'timeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
        'maxOutputTokens': STORY_EPISODE_SPLIT_MAX_OUTPUT_TOKENS
      },
      'parse': _0x385396 => {
        try {
          const _0xf7bd6 = getStoryEpisodeScriptFinishReason(_0x385396);
          if (["length", "max_tokens", "max_output_tokens"]["includes"](_0xf7bd6)) {
            throw Object["assign"](new Error("实验分批蓝图输出被截断（finish reason: " + _0xf7bd6 + '）。'), {
              'type': 'OUTPUT_LENGTH',
              'finishReason': _0xf7bd6
            });
          }
          return parseStoryEpisodeSplitBlueprint(_0x385396, {
            'episodeRef': _0xe64601,
            'episodeRefs': _0x370d20,
            'sourceScenes': _0x4b371b,
            'sourceBeats': _0x2588c7,
            'assets': _0x1a3027,
            'constraints': _0x3509dc,
            'enforceMaxDuration': ![],
            'includeDirectorContinuity': promptExperiment === !![]
          });
        } catch (_0x56a47d) {
          if (_0x56a47d?.["type"] === "OUTPUT_LENGTH") {
            throw _0x56a47d;
          }
          reportStoryEpisodeSplitRequestDiagnostics(diagnostics, {
            'phase': 'experimental-blueprint-local-fallback',
            'carriesFullEpisodeContext': ![],
            'automaticCallLimit': 0x1,
            'details': {
              'status': "recovered-locally",
              'countsTowardRequestTotal': ![],
              'runId': _0x16605f,
              'errorCode': normalizeText(_0x56a47d?.["code"]),
              'errorMessage': normalizeText(_0x56a47d?.["message"] || _0x56a47d),
              'responsePreview': normalizeText(_0x56a47d?.["responsePreview"])
            }
          });
          return createLocalStoryEpisodeSplitBlueprint({
            'episodeRef': _0xe64601,
            'episodeRefs': _0x370d20,
            'sourceScenes': _0x4b371b,
            'sourceBeats': _0x2588c7,
            'assets': _0x1a3027,
            'includeDirectorContinuity': promptExperiment === !![]
          });
        }
      },
      'outputContract': promptExperiment ? "episodeRef and ordered clipPlans[{sourceBeatRefs,beat,optional sceneAssetRef,sceneAppearanceRef,entryState,exitState,openingShotIntent,closingShotIntent,characterAssetRefs,propAssetRefs,targetDurationSec}] covering every sourceBeat exactly once; local code derives plan refs, source scenes, continuity notes, and uniquely bound scene assets" : "episodeRef and ordered clipPlans[{sourceBeatRefs,beat,optional sceneAssetRef,sceneAppearanceRef,entryState,exitState,characterAssetRefs,propAssetRefs,targetDurationSec}] covering every sourceBeat exactly once; local code derives plan refs, source scenes, continuity notes, and uniquely bound scene assets",
      'maxAttempts': 0x1
    }), {
      'retryWait': retryWait
    });
    _0xd14320 = reconcileStoryEpisodeSplitBlueprintTiming(_0xd14320, episode);
    _0x343567 = {
      'schemaVersion': STORY_EPISODE_BATCHED_SPLIT_SCHEMA_VERSION,
      'strategy': STORY_EPISODE_EXPERIMENTAL_DRAFT_STRATEGY,
      'episodeRef': _0xe64601,
      'sourceFingerprint': _0x4c0985,
      'status': "expanding",
      'blueprint': _0xd14320,
      'completedPlanResults': [],
      'completedClips': [],
      'failedBatchRefs': [],
      'attempts': 0x0,
      'error': '',
      'createdAt': Date["now"](),
      'updatedAt': Date["now"]()
    };
    await saveStoryEpisodeExperimentalCheckpoint(_0x343567, onCheckpoint);
  } else {
    const _0x5bde45 = Array['isArray'](_0x343567["completedPlanResults"]) ? _0x343567["completedPlanResults"]['length'] : 0x0;
    onProgress?.({
      'stage': 'resuming-episode-split-batches',
      'current': _0x5bde45,
      'total': _0xd14320["clipPlans"]['length'],
      'message': "正在从断点继续，已完成 " + _0x5bde45 + '/' + _0xd14320['clipPlans']["length"] + " 个蓝图计划"
    });
  }
  const _0x380983 = new Map((Array["isArray"](_0x343567['completedPlanResults']) ? _0x343567["completedPlanResults"] : [])["map"](_0x39d321 => [normalizeText(_0x39d321?.["sourcePlanRef"]), _0x39d321]));
  const _0x57c67d = _0xd14320['clipPlans']["filter"](_0x4a8a13 => !_0x380983["has"](_0x4a8a13["ref"]));
  const _0x4a88b3 = createStoryEpisodeExperimentalConcurrentBatches(_0x57c67d);
  let _0x22216c = 0x0;
  const _0x2140b9 = async _0x56479c => {
    _0x56479c["planResults"]['forEach'](_0x3fc69f => {
      _0x380983["set"](_0x3fc69f["sourcePlanRef"], _0x3fc69f);
    });
    _0x343567['completedPlanResults'] = _0xd14320['clipPlans']["map"](_0x3e96a1 => _0x380983['get'](_0x3e96a1["ref"]))["filter"](Boolean);
    _0x343567['completedClips'] = _0x343567["completedPlanResults"]["flatMap"](_0x2faeb3 => _0x2faeb3['clips']);
    _0x343567["status"] = 'expanding';
    _0x343567["failedBatchRefs"] = [];
    _0x343567["error"] = '';
    await saveStoryEpisodeExperimentalCheckpoint(_0x343567, onCheckpoint);
  };
  const _0x2365e3 = async (_0x1018c7, {
    previousError = null
  } = {}) => {
    _0x22216c += 0x1;
    _0x343567['attempts'] += 0x1;
    onProgress?.({
      'stage': "expanding-episode-split-batch",
      'current': _0x380983["size"],
      'total': _0xd14320["clipPlans"]['length'],
      'message': "正在展开 " + _0x1018c7["length"] + '\x20个蓝图计划，已完成\x20' + _0x380983["size"] + '/' + _0xd14320['clipPlans']["length"]
    });
    const _0x447505 = buildStoryEpisodeSplitBatchPrompt({
      'project': project,
      'episode': episode,
      'assets': _0x1a3027,
      'constraints': _0x3509dc,
      'blueprint': _0xd14320,
      'planBatch': _0x1018c7,
      'batchNumber': _0x22216c,
      'batchTotal': _0x4a88b3['length'],
      'enforceMaxDuration': ![],
      'sourceBeatsOverride': _0x2588c7,
      'promptExperiment': promptExperiment === !![],
      'promptMode': _0x165757,
      'timingCorrection': previousError?.["code"] === "STORY_EPISODE_EXPERIMENTAL_PLAN_TIMING_MISMATCH" ? {
        'previousFailure': normalizeText(previousError?.["message"]),
        'instruction': "重新分配原文已有动作、等待、反应与转场的镜头时长，逐项验算后返回。"
      } : null
    });
    const _0x4fd621 = JSON["parse"](_0x447505);
    const _0x3ccd2b = Array["isArray"](_0x4fd621?.["assets"]) ? _0x4fd621['assets'] : [];
    const _0x5225aa = createStoryEpisodeExperimentalDiagnosticRequest({
      'request': request,
      'diagnostics': diagnostics,
      'runId': _0x16605f,
      'phase': 'experimental-batch-' + _0x22216c,
      'nextRequestSequence': _0x5a40ce,
      'carriesFullEpisodeContext': ![],
      'context': {
        ..._0x455ecc,
        'batchSequence': _0x22216c,
        'batchClipCount': _0x1018c7['length'],
        'batchClipRefs': _0x1018c7["map"](_0x588a0d => _0x588a0d['ref']),
        'completedPlanCount': _0x380983["size"],
        'completedClipCount': _0x343567['completedClips']["length"],
        'plannedClipCount': _0xd14320["clipPlans"]["length"],
        'promptSectionCharacters': getStoryEpisodeExperimentalPromptSectionCharacters(_0x4fd621)
      }
    });
    return await requestStoryEpisodeExperimentalBatchResult({
      'request': _0x58112a => _0x468690(_0x5225aa, _0x58112a, 'experimental-batch:' + _0x1018c7['map'](_0x70ddd2 => _0x70ddd2["ref"])["join"](',')),
      'requestPayload': {
        'model': _0x400a7a,
        'provider': _0x502ea9,
        ...buildStoryTextProviderProfilePayload(providerProfileId),
        'prompt': _0x447505,
        'systemPrompt': getStoryEpisodeExperimentalExpansionSystemPrompt({
          'promptExperiment': promptExperiment,
          'promptMode': _0x165757
        }),
        'thinking': {
          'type': "disabled"
        },
        'allowOversizedPrompt': !![],
        'structuredOutput': createStoryEpisodeExperimentalStructuredOutput("story_episode_split_batch_v3", buildStoryEpisodeSplitBatchResponseSchema({
          'clipCount': _0x1018c7["length"],
          'maxDurationSeconds': _0x3509dc['sceneMaxSeconds'],
          'minimumShotsPerClip': 0x1,
          'maximumShotsPerClip': STORY_EPISODE_EXPERIMENTAL_MAX_SHOTS_PER_CLIP,
          'requiredClipFields': ["ref", 'shots'],
          'requiredShotFields': ['durationSec', ...(isStoryContinuousTimelinePromptMode(_0x165757) ? ["startSec", 'endSec'] : []), "assetRefs", 'visual', "camera", ...(promptExperiment ? ["transitionFromPrevious"] : [])],
          'compactExperimental': !![],
          'includeDirectorContinuity': promptExperiment === !![],
          'includeTimeline': isStoryContinuousTimelinePromptMode(_0x165757)
        })),
        'temperature': STORY_EPISODE_SPLIT_TEMPERATURE,
        'timeoutMs': STORY_TEXT_REQUEST_TIMEOUT_MS,
        'maxOutputTokens': STORY_EPISODE_SPLIT_MAX_OUTPUT_TOKENS
      },
      'episodeRef': _0xe64601,
      'clipPlans': _0x1018c7,
      'constraints': _0x3509dc,
      'assets': _0x3ccd2b,
      'promptMode': _0x165757,
      'enforcePlanDurationTargets': Boolean(_0x4c82e7)
    });
  };
  const _0x554b09 = async _0x5d5927 => {
    let _0x237de4 = null;
    try {
      _0x237de4 = await requestStoryEpisodeExperimentalWithRetry((_0x294b09, _0x2bf6a8) => _0x2365e3(_0x5d5927, {
        'previousError': _0x2bf6a8
      }), {
        'retryWait': retryWait,
        'splitOversizedBatch': _0x5d5927["length"] > 0x1
      });
    } catch (_0x46d012) {
      Array["isArray"](_0x46d012?.["partialPlanResults"]) && _0x46d012["partialPlanResults"]["length"] && (await _0x2140b9({
        'planResults': _0x46d012["partialPlanResults"],
        'clips': _0x46d012["partialPlanResults"]["flatMap"](_0x4dabaf => _0x4dabaf["clips"])
      }));
      if (isStoryEpisodeExperimentalBatchShrinkable(_0x46d012) && _0x5d5927["length"] > 0x1) {
        const _0x300300 = _0x5d5927['filter'](_0x43dd76 => !_0x380983['has'](_0x43dd76["ref"]));
        const _0x415043 = Math["floor"](_0x300300["length"] / 0x2);
        const _0x48af50 = _0x300300["slice"](0x0, _0x415043);
        const _0x5366ae = _0x300300["slice"](_0x415043);
        onProgress?.({
          'stage': "shrinking-episode-split-batch",
          'current': _0x380983["size"],
          'total': _0xd14320["clipPlans"]["length"],
          'message': "当前批次内容较多，正在缩小为 " + _0x48af50["length"] + '+' + _0x5366ae["length"] + " 个片段继续生成"
        });
        if (_0x48af50['length']) {
          await _0x554b09(_0x48af50);
        }
        if (_0x5366ae["length"]) {
          await _0x554b09(_0x5366ae);
        }
        return;
      }
      throw _0x46d012;
    }
    await _0x2140b9(_0x237de4);
  };
  const _0x34fa24 = await settleStoryEpisodeExperimentalBatches(_0x4a88b3, _0x4b9f50 => _0x554b09(_0x4b9f50), STORY_EPISODE_EXPERIMENTAL_MAX_CONCURRENT_BATCHES);
  const _0x4676ce = _0x34fa24["find"](_0x28e2d2 => _0x28e2d2["status"] === 'rejected');
  if (_0x4676ce) {
    const _0x276e26 = _0x4676ce['reason'] instanceof Error ? _0x4676ce["reason"] : new Error(normalizeText(_0x4676ce["reason"]) || "实验分批生成失败。");
    _0x343567["status"] = 'failed';
    _0x343567["failedBatchRefs"] = _0x57c67d["map"](_0x23268f => _0x23268f["ref"])["filter"](_0x2fe57a => !_0x380983["has"](_0x2fe57a));
    _0x343567["error"] = normalizeText(_0x276e26?.["message"] || _0x276e26) || "实验分批生成失败。";
    await saveStoryEpisodeExperimentalCheckpoint(_0x343567, onCheckpoint);
    _0x276e26['experimentalDraft'] = cloneStoryEpisodeExperimentalValue(_0x343567);
    _0x380983["size"] && (_0x276e26["message"] = _0x343567["error"] + "（已完成 " + _0x380983["size"] + '/' + _0xd14320['clipPlans']['length'] + " 个蓝图计划，保留 " + _0x343567["completedClips"]["length"] + " 个片段；再次点击实验分批可继续。）");
    throw _0x276e26;
  }
  const _0x1d39e7 = _0xd14320["clipPlans"]['map'](_0x5c573f => _0x380983['get'](_0x5c573f["ref"]))["filter"](Boolean);
  if (_0x1d39e7["length"] !== _0xd14320['clipPlans']["length"]) {
    throw new Error("实验分批拆分未完整覆盖整集蓝图。");
  }
  const _0x2ba027 = repackStoryEpisodeExperimentalClips({
    'episodeRef': _0xe64601,
    'clipPlans': _0xd14320["clipPlans"],
    'completedPlanResults': _0x1d39e7,
    'maxDurationSeconds': resolveStoryPromptModeClipMaxSeconds(_0x165757, _0x3509dc["sceneMaxSeconds"]),
    'minDurationSeconds': STORY_EPISODE_EXPERIMENTAL_MIN_CLIP_DURATION_SECONDS,
    'promptExperiment': promptExperiment === !![],
    'preserveSourceGroups': isStoryContinuousTimelinePromptMode(_0x165757)
  });
  _0x343567["status"] = "completed";
  _0x343567["completedPlanResults"] = _0x1d39e7;
  _0x343567["completedClips"] = _0x2ba027;
  _0x343567["failedBatchRefs"] = [];
  _0x343567['error'] = '';
  await saveStoryEpisodeExperimentalCheckpoint(_0x343567, onCheckpoint);
  return assertStoryEpisodeSplitTiming({
    'episodeRef': _0xe64601,
    'clips': _0x2ba027
  }, episode);
}