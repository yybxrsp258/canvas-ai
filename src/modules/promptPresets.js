import { deletePromptPresetFromServer, fetchPromptPresetSettingsFromServer, fetchPromptPresetsFromServer, savePromptPresetSettingsToServer, savePromptPresetToServer } from '../../api/promptPresetsApi.js';
import { PROMPT_PRESET_TEMPLATE_TYPE_CONDITIONAL_BY_IMAGE_INPUT, PROMPT_PRESET_TEMPLATE_TYPE_STATIC, PROMPT_PRESET_USER_INPUT_PLACEHOLDER } from './promptPresetTemplate.js';
import { DOUBAO_AUDIO_1_0_PROMPT_PRESET_GROUPS } from './promptPresetCatalog/doubaoAudio1PromptPresets.js';
import { resolvePresetDefaultCoverDataUrl } from './presetCoverResolver.js';
import a1310_0x4a7848 from '../core/stores/appStore.js';
import { t } from '../i18n/index.js';
import { beginModalInteraction } from '../services/modalInteractionScope.js';
function promptPresetsText(_0x279bad, _0x568fc7 = {}) {
  return t('promptPresets.' + _0x279bad, _0x568fc7);
}
function optionalPromptPresetsText(_0x486543, _0x5b0f3a = {}) {
  const _0xc90b50 = 'promptPresets.' + _0x486543;
  const _0x39217b = t(_0xc90b50, _0x5b0f3a);
  return _0x39217b === _0xc90b50 ? '' : _0x39217b;
}
export const PROMPT_PRESET_TRIGGER_MODE_DIRECT = "direct";
export const PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT = 'insertPrompt';
const PROMPT_PRESET_TRIGGER_MODES = new Set([PROMPT_PRESET_TRIGGER_MODE_DIRECT, PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT]);
function applyPromptPresetLeafTriggerMode(_0x13e604, _0x3b2666) {
  return (Array["isArray"](_0x13e604) ? _0x13e604 : [])["map"](_0x2c3a2c => {
    const _0x5b1a80 = {
      ..._0x2c3a2c
    };
    Array["isArray"](_0x2c3a2c?.["subItems"]) ? _0x5b1a80['subItems'] = applyPromptPresetLeafTriggerMode(_0x2c3a2c["subItems"], _0x3b2666) : _0x5b1a80["triggerMode"] = _0x3b2666;
    return _0x5b1a80;
  });
}
export const REVERSE_IMAGE_PROMPT_PRESET_TITLE = "反推图片提示词";
export const REVERSE_IMAGE_PROMPT_PRESET_PROMPT = "你是一名专业 AI 图像提示词反推工程师。\n\n我将上传一张图片，请你根据图片内容，反推出一段可以用于 AI 生图模型生成同款图片的提示词。\n\n要求：\n1. 不要只是普通描述图片，而是要写成“可直接用于 AI 生图”的提示词。\n2. 请完整分析画面中的：主体、人物数量、性别年龄、外貌特征、服装、发型、动作、姿态、表情、视线方向、手部动作。\n3. 请分析景别与构图：特写/近景/中景/全身/远景，正面/侧面/背影，俯拍/仰拍/平视，人物在画面中的位置，背景虚化程度。\n4. 请分析环境：室内/室外、地点、时间、天气、背景元素、前景/中景/远景。\n5. 请分析光线：自然光/棚拍光/逆光/侧光/柔光/硬光、光源方向、阴影、高光。\n6. 请分析色彩与氛围：主色调、冷暖、饱和度、对比度、情绪氛围。\n7. 请分析风格：真实摄影、电影感、杂志大片、日系写真、商业广告、动漫、3D、油画等。\n8. 请分析镜头语言：镜头焦段、景深、画质、胶片感、颗粒感、清晰度。\n9. 如果图片中有无法确定的信息，请根据画面合理推断，但不要编造明显不存在的元素。\n10. 最终请输出一段完整的中文提示词、一段英文提示词，以及一段反向提示词。\n\n\n输出格式如下：\n\n【画面拆解】\n主体：\n景别与构图：\n人物动作：\n表情与视线：\n服装与造型：\n场景环境：\n光线：\n色彩氛围：\n风格：\n镜头与画质：\n\n【中文完整提示词】\n把上面的信息整合成一段流畅、专业、可直接用于 AI 生图的中文提示词。\n\n【English Prompt】\nTranslate and optimize the prompt into natural English for AI image generation.\n\n【反向提示词】\n输出用于避免低质量、畸变、错误细节、文字水印等问题的中文反向提示词。";
export const MINIMAX_H3_FULL_CHARACTER_REPLACEMENT_PROMPT = "将 <Video 1> 中的主要人物完整替换为 <Picture 1> 中的人物，包括人物身份、面部、发型、身体特征、服装和配饰。\n\n新人物完整采用 <Picture 1> 的外貌与穿搭，但严格继承 <Video 1> 中原人物的动作、姿势、表演、走位、视线、表情、口型和动作时间。\n\n语音沿用 <Video 1> 原始音轨，不重新生成或修改。新人物的表情和口型逐帧匹配原人物并与原语音同步；不说话时自然闭口。\n\n完整保留原视频的镜头运动、构图、背景、场景、道具、环境光线、阴影、遮挡关系和剪辑节奏。服装在快速动作、转身和遮挡时保持结构稳定，人物面部在所有角度保持一致。\n\n忽略 <Picture 1> 的背景、姿势、光线和相机角度，不要将参考图背景带入视频。";
export const MINIMAX_H3_GENERAL_CHARACTER_REPLACEMENT_PROMPT = "以 <Video 1> 为基础进行人物替换。\n\n将视频中的主要人物完整替换为 <Picture 1> 中的人物。准确保留 <Picture 1> 中人物的面部身份、五官比例、脸型、发型、发色、肤色、年龄特征和身体比例。\n\n严格继承 <Video 1> 中原人物的全部动作、姿势、走位、头部转动、视线、表情变化、口型变化和动作节奏。保持原视频的镜头角度、景别、运镜、构图、场景、背景、光线、阴影、道具、遮挡关系和时间节奏不变。\n\n语音沿用 <Video 1> 原始音轨，不重新生成或修改。新人物的表情和口型逐帧匹配原人物并与原语音同步；不说话时自然闭口。\n\n替换后的人物自然融入原场景，身体与环境光线一致，面部在正脸、侧脸和快速运动中保持稳定。不要改变背景，不要增加人物，不要删除其他人物，不要改变原视频镜头，不要出现原人物面孔残留、双脸、五官漂移、身体变形或服装闪烁。";
export const MINIMAX_H3_CHARACTER_AND_BACKGROUND_REPLACEMENT_PROMPT = "将 <Video 1> 中的主要人物完整替换为 <Picture 1> 中的人物，包括人物身份、面部、发型、身体特征、服装和配饰。\n\n新人物完整采用 <Picture 1> 的外貌与穿搭，但严格继承 <Video 1> 中原人物的动作、姿势、表演、走位、视线、表情、口型和动作时间。\n\n同时，将 <Video 1> 的原背景和场景完整替换为 <Picture 1> 中的背景与场景，包括空间环境、家具、道具、材质、光线、色彩和整体视觉风格。人物始终在 <Picture 1> 的场景中完成原视频表演。\n\n语音沿用 <Video 1> 原始音轨，不重新生成或修改。新人物的表情和口型逐帧匹配原人物，并与原语音同步；不说话时自然闭口。\n\n完整保留 <Video 1> 的镜头运动、构图、景别、剪辑节奏和动作时间，但不要保留原视频的背景和场景。根据原视频的镜头变化，自然重建 <Picture 1> 背景的视角、透视、遮挡、环境光线和阴影，保持背景风格和空间结构连续稳定。\n\n服装在快速动作、转身和遮挡时保持结构稳定，人物面部在所有角度保持一致。人物与新背景自然融合，保持正确的空间关系、接触阴影和环境光照。\n\n忽略 <Picture 1> 中人物原本的姿势，只参考其中的人物形象、服装、背景和场景。不要带入 <Video 1> 的原人物外貌、服装、背景和场景。";
export const MINIMAX_H3_UNIVERSAL_OBJECT_REPLACEMENT_PROMPT = "以 <Video 1> 为基础进行局部物体替换。\n\n将视频中的【原物体及其位置特征】完整替换为 <Picture 1> 中的【新物体】。准确保留新物体的形状、结构、比例、材质、颜色、纹理、图案、标识和细节。\n\n新物体严格继承原物体在 <Video 1> 中的位置、尺寸、朝向、透视、运动轨迹、速度、旋转、形变状态以及与人物和环境的互动关系。\n\n完整保留原视频中的人物、场景、背景、镜头、构图、运镜、光线、阴影、反射、遮挡、景深、动作节奏和音频。根据原场景的光照和透视自然重建新物体的阴影、反射和接触关系。\n\n只替换指定物体。不要改变人物身份、面部、服装、动作和身体；不要改变其他物体；不要带入 <Picture 1> 的背景、手部、人物、姿势或光线；不要出现原物体残留、物体融合、尺寸漂移、纹理闪烁、穿模、悬浮、复制或额外物体。";
export const MINIMAX_H3_HANDHELD_ITEM_REPLACEMENT_PROMPT = '将\x20<Video\x201>\x20中人物右手握着的黑色手机，完整替换为\x20<Picture\x201>\x20中的红色饮料罐。\x0a\x0a准确保留饮料罐的圆柱结构、尺寸比例、红色金属材质、标签、拉环和表面高光。饮料罐严格继承原手机的位置、移动轨迹、速度和朝向，同时根据新物体形状自然调整人物右手的握持方式。\x0a\x0a保持手掌、手腕、手指数量和关节结构正确。手指自然环绕饮料罐，拇指位于罐体一侧，其他手指产生正确遮挡和接触阴影。物体不得穿过手掌，不得悬浮，不得粘连或复制。\x0a\x0a完整保留人物身份、面部、发型、服装、身体动作、背景、镜头、光线和音频。只替换手中的物体，不要改变人物，不要带入参考图中的手、人物和背景，不要出现多余手指、原物体残留或标签闪烁。';
export const MINIMAX_H3_VEHICLE_REPLACEMENT_PROMPT = "将 <Video 1> 中正在道路上行驶的白色轿车，完整替换为 <Picture 1> 中的黑色越野车。\n\n准确保留新车辆的车身结构、车型比例、前脸、车灯、轮毂、车漆、车窗、标识和材质细节。新车辆继承原车辆的行驶路线、速度、转向、刹车、车身起伏和镜头中的空间位置。\n\n车轮与道路正确接触并按照行驶速度自然旋转，车辆运动符合真实物理规律。根据原场景重新生成车漆反射、玻璃反射、车身阴影、轮胎阴影和运动模糊。\n\n保持道路、驾驶员、其他车辆、行人、建筑、天气、镜头运动、构图和音频不变。只替换指定车辆，不要改变道路和其他车辆，不要出现车轮滑动、车身漂移、尺寸突变、车牌乱码或原车辆残留。";
export const MINIMAX_H3_MULTI_PERSON_REPLACEMENT_PROMPT = "以 <Video 1> 为基础进行双人物同步替换。<Picture 1> 只用于定义两个替换角色的外观，忽略参考图中的背景、墙面、阴影、姿势、动作、构图和光线。\n\n角色定义：\n<Subject 1> 是 <Picture 1> 左侧的银色头部、红蓝银配色角色，保留其头部造型、面部结构、胸前发光装置、服装配色、身体比例和全部外观细节。\n\n<Subject 2> 是 <Picture 1> 右侧的黑银色装甲角色，保留其尖锐头部轮廓、黑银装甲结构、胸前红色装置、身体比例、材质和全部外观细节。\n\n人物对应关系：\n将 <Video 1> 中位于前景中央、穿米色毛衣的男子完整替换为 <Subject 1>。\n\n将 <Video 1> 中位于画面右后方、靠近墙壁、穿黑色衣服的男子完整替换为 <Subject 2>。\n\n两名替换角色分别严格继承各自对应原人物的空间位置、身体动作、姿势、手势、头部转动、视线方向、表情节奏、口型变化、走位、运动轨迹和遮挡关系。\n\n语音沿用 <Video 1> 原始音轨，不重新生成或修改。<Subject 1> 和 <Subject 2> 的表情和口型分别逐帧匹配对应原人物及对白时间，禁止串用；不说话时自然闭口。\n\n保持两个人物的对应关系从视频开始到结束始终不变：\n前景人物始终是 <Subject 1>；\n右后方人物始终是 <Subject 2>。\n禁止两名角色身份交换、外观融合、服装互换或在不同帧中互相变成对方。\n\n完整保留 <Video 1> 的场景、墙壁、光线、窗户投影、背景、镜头角度、构图、运镜、景深、剪辑节奏和原始音频。根据原视频光线自然生成两名角色的高光、阴影、墙面投影和环境反射，使其自然融入现场。\n\n只替换这两名指定人物。不要增加第三个人物，不要保留原人物的脸、头发或服装，不要带入 <Picture 1> 的背景。不要出现双脸、原人物残留、角色复制、身份串位、装甲融合、肢体变形、材质闪烁、穿模或人物位置改变。";
export const MINIMAX_H3_CLOTHING_ONLY_REPLACEMENT_PROMPT = "以 <Video 1> 为基础进行人物换装。\n\n仅将 <Picture 1> 中的衣服穿到 <Video 1> 的主要人物身上。准确保留衣服的款式、版型、颜色、材质、纹理、图案、领口、袖口、纽扣、装饰和标识。\n\n完整保留 <Video 1> 中人物原本的身份、面部、五官、发型、肤色、年龄、体型和身体比例，不得替换人物，不得参考 <Picture 1> 中的模特、人体、姿势、背景、光线和构图。\n\n完整保留原视频的动作、表情、走位、镜头、构图、场景、背景、道具、光线、阴影、剪辑节奏和音频。\n\n只替换人物原来的衣服，其他内容全部保持不变。不要改变人物面孔和身体，不要带入参考图中的模特或背景，不要出现原衣服残留、双层衣服、衣服穿模、身体变形、纹理闪烁、图案漂移或多余肢体。";
export const MINIMAX_H3_CLOTHING_AND_HAIRSTYLE_REPLACEMENT_PROMPT = '以\x20<Video\x201>\x20为基础，仅替换主要人物的衣服和发型。\x0a\x0a人物穿着\x20<Picture\x201>\x20中的完整服装，并采用其中的发型、发色、头发长度和造型。衣服自然贴合身体并随动作产生合理的褶皱和摆动；发型适配人物头型，在运动中保持稳定。\x0a\x0a严格保留原视频人物的身份、面孔、五官、脸型、肤色、体型、表情、动作和走位。仅参考\x20<Picture\x201>\x20的服装与发型，忽略其中的人脸、身体、姿势、背景和光线。\x0a\x0a保持原视频的镜头、场景、构图、道具、光影、节奏和音频不变。不要改变人物长相，不要出现身份融合、原服装残留、双层衣服、穿模或纹理闪烁。';
export const MINIMAX_H3_REPLACE_ONE_OF_TWO_PEOPLE_PROMPT = '将\x20<Video\x201>\x20中位于画面左侧、穿黑色上衣的人物替换为\x20<Picture\x201>\x20中的人物。\x0a\x0a画面右侧人物必须完整保留，身份、面部、服装、动作和位置均不得改变。新人物严格继承左侧原人物的动作、表情、视线、口型、走位及与右侧人物的互动。\x0a\x0a语音沿用\x20<Video\x201>\x20原始音轨，不重新生成或修改。左侧新人物的表情和口型逐帧匹配左侧原人物及对白时间；右侧人物的口型和语音保持不变，不说话时自然闭口。\x0a\x0a保持原视频的镜头、背景、灯光、道具、遮挡、空间关系、对白时间和音频不变。只替换指定的左侧人物，不要交换两个人的身份，不要让两张脸融合。';
export const HAILUO_H3_STANDARD_PROMPT = "subject_definitions:\n<Subject 1> 是 <Picture 1> 中的林夏，25岁中国女性，肩长黑发，面色苍白，穿湿润的米色风衣。完整保留她的面部身份、发型、年龄特征、服装颜色和身材比例。\n<Subject 2> 是 <Picture 2> 中的周沉，28岁中国男性，短黑发，轮廓消瘦，穿黑色旧外套。完整保留他的面部身份、发型、冷淡表情、服装和身材比例。\n<Subject 3> 是 <Picture 3> 中的废弃医院走廊，保留剥落的墙皮、闪烁灯管、绿色墙裙、积水地面、废弃病床和走廊尽头的全身镜。\n\nsummary:\n[reference generation] 目标视频是一段15秒双人悬疑短剧。<Subject 1> 在 <Subject 3> 中遇见本应已经死亡的 <Subject 2>。两人经过四句简短对话后，<Subject 2> 揭示真正死亡的人是 <Subject 1>，并通过镜中没有她的倒影完成剧情反转。\n\nretention_analysis:\n<Subject 1> (出现在 [Shot 1]、[Shot 2]、[Shot 3]): fully_preserved - 始终保留林夏的面部身份、黑色肩长发、米色风衣和年轻女性外形，情绪从震惊逐渐转为恐惧。\n<Subject 2> (出现在 [Shot 1]、[Shot 2]、[Shot 3]): fully_preserved - 始终保留周沉的面部身份、短黑发、黑色旧外套和冷淡克制的神态。\n<Subject 3> (出现在 [Shot 1]、[Shot 2]、[Shot 3]): fully_preserved - 保留医院走廊的空间结构、绿色墙裙、积水、闪烁灯管和尽头的全身镜。\n\ndetailed_description:\n目标视频采用真人电影质感、冷色悬疑风格和低照度照明，竖屏构图，浅景深，人物动作自然克制。\n\n[Shot 1] 中景镜头建立 <Subject 3>。闪烁的灯光映在积水地面上，<Subject 1> 林夏站在画面前景，湿润的米色风衣紧贴肩膀。<Subject 2> 周沉从走廊尽头的阴影中缓慢走出。镜头以较小幅度缓慢推向林夏。林夏（S1）盯着周沉，声音颤抖地问：<d>[Chinese] 你不是三年前就死了吗？</d>\n\n[Shot 2] At 00:04.500，镜头切至 <Subject 2> 的面部近景。周沉停在一盏闪烁的灯管下，半张脸藏在阴影中。他（S2）平静回答：<d>[Chinese] 你认错尸体了。</d> 镜头迅速切回林夏。她握紧手电筒，向前迈出半步，追问：<d>[Chinese] 那棺材里的人是谁？</d>\n\n[Shot 3] At 00:09.500，镜头切至周沉的正面特写。他没有立刻回答，而是把目光缓慢移向林夏身后的全身镜。周沉（S2）低声说：<d>[Chinese] 棺材里的人，是你。</d> 镜头以较小幅度缓慢环绕林夏，最终对准走廊尽头的镜子。镜中清晰映出周沉、灯光和废弃病床，却没有林夏的倒影。林夏低头看见自己手腕上的白色停尸标签，瞳孔骤然放大。灯光完全熄灭，画面立即切黑。\n\noverall_soundscape:\n暴雨敲打破损的窗户，老旧灯管持续发出电流噪声。空旷走廊中回荡着脚步、积水踩踏声、衣料摩擦声和林夏逐渐急促的呼吸。最后一句对白结束后，所有环境声突然停止。\n\nnon_diegetic_music:\n缓慢、稀疏的钢琴单音贯穿前两个镜头，低沉的大提琴长音逐渐增强。镜中显露真相时加入一次短促的低频冲击，画面切黑后音乐立即停止。";
export const HAILUO_H3_AUDIO_PROMPT_VIDEO_PROMPT = "根据提示词【视频内容】生成视频，并以 <Audio 1> 作为原始语音。画面内容、人物表演和镜头节奏跟随语音推进。";
export const HAILUO_H3_AUDIO_IMAGE_LIP_SYNC_PROMPT = "让 <Picture 1> 中的【指定人物】按照提示词【动作和运镜】进行表演，并跟随 <Audio 1> 说话，口型、表情和节奏与语音准确同步。";
export const HAILUO_H3_AUDIO_VIDEO_LIP_SYNC_PROMPT = "让 <Video 1> 中的【指定人物】跟随 <Audio 1> 说话，口型、表情和说话节奏与语音准确同步；停顿时自然闭口。直接使用 <Audio 1> 的原始语音，不改变台词、音色、语速和情绪。";
export const HAILUO_H3_AUDIO_IMAGE_VIDEO_MOTION_TRANSFER_PROMPT = "以 <Picture 1> 提供人物、背景和整体画面，将 <Video 1> 中的人物动作和运镜迁移到参考图，并让人物跟随 <Audio 1> 说话，口型、表情和节奏与语音准确同步。";
const TEMPLATES = {
  'SceneReference': "{用户输入}, 生成一张四宫格场景图（没有人物）包含（顶视图 (Plan View)，轴测图/45° 俯视图 (Axonometric View)，2个多个正交立面图 (Elevations)）",
  'SceneNineView': "根据用户输入的场景描述或上传的参考图，生成一张3×3九宫格场景设定图。\n\n九张图必须表现同一个连续、完整的场景。若提供参考图，以参考图中的空间结构、物体造型、家具位置、门窗位置、材质、颜色、灯光和整体风格为主要依据。参考图未展示的区域只进行最小合理补全，不得随意重新设计场景。\n\n九格固定顺序：\n\n1. 正面视角\n2. 左前方45°\n3. 右前方45°\n4. 左侧视角\n5. 右侧视角\n6. 后方视角\n7. 入口视角\n8. 高空45°俯视\n9. 正交俯视平面布局图\n\n前八格只改变摄影机位置，不改变场景。所有画面中的空间比例、门窗、建筑、家具、主要物体、物品数量、颜色、材质、灯光、天气和物品分布必须保持一致。\n\n第八格是高处45度斜俯视，不是垂直俯视。\n\n第九格必须是与前八格严格对应的二维正交平面布局图。室内场景表现墙体、门窗、房间、家具和入口；户外场景表现建筑、道路、地形、设施和出入口。使用简洁中文标注主要区域。\n\n严格3×3等尺寸排版，每格有细边框和白色中文标题栏。标题依次为：正面视角、左前方45°、右前方45°、左侧视角、右侧视角、后方视角、入口视角、高空45°俯视、平面布局图。\n\n禁止九个不同场景、重复视角、物体随机移动、左右关系颠倒、错误镜像、跨格画面、平面图与场景不一致、中文乱码和英文标签。\n\n{{用户输入}}",
  'Panorama360Seamless': {
    'type': PROMPT_PRESET_TEMPLATE_TYPE_CONDITIONAL_BY_IMAGE_INPUT,
    'imageInputTemplate': '360-degree\x20equirectangular\x20panorama,\x20spherical\x20panorama\x20for\x20VR\x20viewing,\x20seamless\x20360°\x20wrap-around\x20environment\x20参考图片场景生成{用户输入}',
    'textInputTemplate': '360-degree\x20equirectangular\x20panorama,\x20spherical\x20panorama\x20for\x20VR\x20viewing,\x20seamless\x20360°\x20wrap-around\x20environment\x20场景为：{用户输入}',
    'emptyInputMessage': '请输入场景或添加参考图片'
  },
  'characterRef3View': "生成全身三视图，右边放正视图，45度的侧视图，后视图，{用户输入 || 灰色背景}",
  'characterRef3ViewFace': "生成全身三视图以及一张脸部特写（最左边占满三分之一的位置是上半身特写），右边三分之二放正视图，45度的侧视图，后视图，{用户输入 || 灰色背景}",
  'characterFrontBackViewFace': "专业角色素材分页布局。左侧则展示角色脸部的大面积高细节特写肖像，突出发型、眼、肤质、妆容及表情。右侧展示同一女性角色的两个全身图，分别为正面和背面视角，重点呈现服装、轮廓、比例及靴子，头部被裁剪，不要显示头部，以突出身体与服饰设计。背景为干净的白色无缝设计，采用极简风格，现代编辑排版，留白整洁\n\n{用户输入}",
  'characterRefAnalysis': "生成人设解析图，包含正视图、侧视图、背视图，以及服装细节拆解、面部特征特写，排版紧凑，{用户输入 || 灰色背景}",
  'multiGrid4': "生成一张无缝的四宫格（2x2）的连贯剧情分镜图。要求：同一角色的外观、服饰、发型保持一致；场景与光影风格统一；镜头从左上到右下依次推进；每一格都有明确动作与主体，构图干净、排版紧凑。故事/描述：{用户输入 || 一段简短剧情}",
  'multiGrid9': "生成一张无缝的九宫格（3x3）的连贯剧情分镜图。要求：角色一致性极强（外观、服饰、配色不变）；同一场景基调延续；每格推进一个小动作或情绪变化；分镜顺序从左上到右下；画面干净、排版紧凑。故事/描述：{用户输入 || 一段简短剧情}",
  'multiGrid16': "生成一张无缝的十六宫格（4x4）的连贯剧情分镜图。要求：角色与关键道具保持完全一致；每一个分镜都必须是下一个分镜的时间上或因果上的延续，不能跳跃，每格节奏更细（动作拆分、表情递进、镜头切换合理）；整体风格统一；分镜顺序从左上到右下；画面干净、排版紧凑。故事/描述：{用户输入 || 一段简短剧情}",
  'multiGrid25': '生成一张无缝的二十五宫格（5x5）的连贯剧情分镜图。要求：连续叙事、强一致性（角色/服饰/配色/画风固定）；每一个分镜都必须是下一个分镜的时间上或因果上的延续，不能跳跃；镜头语言清晰；分镜顺序从左上到右下；画面干净、排版紧凑。故事/描述：{用户输入\x20||\x20一段简短剧情}',
  'storyboardVertical': "请根据我后面提供的【用户输入】，生成一张“专业影视分镜设定板 / Storyboard Board”。\n\n要求：\n1. 输出的是一整张竖版分镜板，不是单张插画，不是漫画页，不是海报。\n2. 整体风格为：黑灰底、细线分栏、专业影视项目提案风格。\n3. 参考图规则：如果用户输入中写了“某角色参考@图片1 / 场景参考@图片2”，则必须严格参考对应图片，保持角色外观、服装、发型、年龄气质、场景结构、时代背景、光影氛围的一致性。\n4. 整张图固定分为三部分：\n   - 顶部标题区：标题、总时长、风格关键词\n   - 中部 Storyboard 区：按用户输入中的时间段拆成 4-6 个 CUT，每行分为左中右三栏：\n     左栏：CUT编号 + 时间段\n     中栏：该镜头对应的电影感画面\n     右栏：主体 / 动作 / 描述 / 镜头 / 台词 / 音效\n5. 分镜画面必须叙事连贯、角色一致、场景一致、服装一致、光影一致。\n6. 所有中间画面都要像电影剧照，镜头语言明确，严格体现用户输入中的动作、表情、氛围和情绪推进。\n7. 右侧说明栏必须用简洁专业的中文排版，字段固定为：\n   主体：\n   动作：\n   描述：\n   镜头：\n   台词：\n   音效：\n8. 文字尽量清晰可读，不要乱码，排版整洁克制，高级感强。\n9. 最终输出只生成一张完整的、专业的、电影级影视分镜设定板。\n\n# 【用户输入】\n{用户输入 || 一段简短剧情}",
  'storyboardVerticalScene': "请根据我后面提供的【用户输入】，生成一张“专业影视分镜设定板 / Storyboard Board”。\n\n要求：\n1. 输出的是一整张竖版分镜板，不是单张插画，不是漫画页，不是海报。\n2. 整体风格为：黑灰底、细线分栏、专业影视项目提案风格。\n3. 参考图规则：如果用户输入中写了“某角色参考@图片1 / 场景参考@图片2”，则必须严格参考对应图片，保持角色外观、服装、发型、年龄气质、场景结构、时代背景、光影氛围的一致性。\n4. 整张图固定分为三部分：\n   - 顶部标题区：标题、总时长、风格关键词\n   - 中部 Storyboard 区：按用户输入中的时间段拆成 4-6 个 CUT，每行分为左中右三栏：\n     左栏：CUT编号 + 时间段\n     中栏：该镜头对应的电影感画面\n     右栏：主体 / 动作 / 描述 / 镜头 / 台词 / 音效\n   - 底部补充区：场景图 Secondary（2张小图）+ 光影与氛围 Lighting & Mood（1张小图）+ 色彩板与风格说明（5-6个色块）\n5. 分镜画面必须叙事连贯、角色一致、场景一致、服装一致、光影一致。\n6. 所有中间画面都要像电影剧照，镜头语言明确，严格体现用户输入中的动作、表情、氛围和情绪推进。\n7. 右侧说明栏必须用简洁专业的中文排版，字段固定为：\n   主体：\n   动作：\n   描述：\n   镜头：\n   台词：\n   音效：\n8. 文字尽量清晰可读，不要乱码，排版整洁克制，高级感强。\n9. 最终输出只生成一张完整的、专业的、电影级影视分镜设定板。\n\n# 【用户输入】\n{用户输入 || 一段简短剧情}",
  'storyboardHorizontal': "请根据我后面提供的【用户输入】，生成一张“横版专业影视故事板 / Storyboard Sheet”。  \n要求： \n1. 输出必须是一整张横版16:9故事板表格，不是海报，不是漫画页，不是竖版分镜板。 \n2. 主体必须是“表格结构”，每一行对应一个 CUT。 \n3. 表头固定为： CUT｜秒数｜图片内容｜场景｜主体｜动作｜描述｜镜头｜台词｜音效｜色彩/光影 \n4. 按用户输入中的时间顺序，从上到下排列所有 CUT。 \n5. “图片内容”列中，每个 CUT 必须对应一张横向16:9的电影感分镜画面，真实人物质感，镜头语言明确。 \n6. “场景”列用于写该镜头的环境与空间信息。 \n7. “色彩/光影”列用于写该镜头的色调、光源、冷暖关系与氛围重点。 \n8. 其余列分别填写该镜头的主体、动作、描述、镜头、台词、音效，文字风格必须像正规影视故事板备注，简洁、专业、整齐。 \n9. 如果用户输入中有“角色参考@图片1 / 场景参考@图片2 / 道具参考@图片3”，必须严格参考并保持角色、服装、场景、氛围一致。 \n10. 整体风格为黑灰底、细线分栏、专业影视提案风格。 \n11. 最终只输出一张完整的横版故事板表格图。  \n#【用户输入】\n{用户输入 || 一段简短剧情}",
  'storyboardHorizontalScene': '请根据我后面提供的【用户输入】，生成一张“横版专业影视故事板\x20/\x20Storyboard\x20Sheet”。\x20\x20\x0a要求：\x20\x0a1.\x20输出必须是一整张横版16:9故事板表格，不是海报，不是漫画页，不是竖版分镜板。\x20\x0a2.\x20主体必须是“表格结构”，每一行对应一个\x20CUT。\x20\x0a3.\x20表头固定为：\x20CUT｜秒数｜图片内容｜场景｜主体｜动作｜描述｜镜头｜台词｜音效｜色彩/光影\x20\x0a4.\x20按用户输入中的时间顺序，从上到下排列所有\x20CUT。\x20\x0a5.\x20“图片内容”列中，每个\x20CUT\x20必须对应一张横向16:9的电影感分镜画面，真实人物质感，镜头语言明确。\x20\x0a6.\x20“场景”列用于写该镜头的环境与空间信息。\x20\x0a7.\x20“色彩/光影”列用于写该镜头的色调、光源、冷暖关系与氛围重点。\x20\x0a8.\x20其余列分别填写该镜头的主体、动作、描述、镜头、台词、音效，文字风格必须像正规影视故事板备注，简洁、专业、整齐。\x20\x0a9.\x20如果用户输入中有“角色参考@图片1\x20/\x20场景参考@图片2\x20/\x20道具参考@图片3”，必须严格参考并保持角色、服装、场景、氛围一致。\x20\x0a10.\x20整体风格为黑灰底、细线分栏、专业影视提案风格。\x20\x0a11.\x20表格底部增加一条补充信息区，包含：场景总设定、综合色彩色板、整体风格说明。\x20\x0a12.\x20最终只输出一张完整的横版故事板表格图。\x20\x20\x0a#【用户输入】\x0a{用户输入\x20||\x20一段简短剧情}',
  'longToShort': "\n    {用户输入} # 对以上的小说剧情文案进行大幅精简（目标篇幅约为原文的50*-70%）\n完整保留原文对话，同时按照“对白驱动剧情”的结构重新梳理旁白与独白，保留原文段落结构与标点符号。\n用第一人称进行改文\n锁定所有对话： 识别并保护所有直接引语，确保一字不改。\n构建开篇（10%）： 提炼原文关键背景（时代、世界观、人物身份），用简短叙事交代框架。\n精简叙事（20%）： 大幅删减环境描写和过度修饰，仅保留连接对话必要的动作和场景推进。\n筛选独白（30%）： 保留能强化冲突、体现人物压力和真实状态的核心心理描写，删去流水账式的心理活动。\n格式输出： 保持小说文本格式，保留标点符号，保留原段落分行（必要时可合并过碎的描述段落，但不可合并对话段落）。\n# 结构与内容规则\n## 【整体篇幅控制】\n总字数目标： 控制在原文的 50-70% 左右。\n精简策略： 由于对话不能动，主要通过大幅删减“非对话部分的废话”来达成字数减半的目标。\n## 【文本结构比例】\n对白（核心）： 占比最高。严格保持原文，不得增删改一字。\n内心独白（约30%）： 紧贴对话，用于强化情绪、痛感、压迫或绝望。\n叙事（约20%）： 仅作铺垫和连接，禁止写成分镜（如“镜头一转”），禁止扩写。\n背景（约10%）： 开篇必须交代，不可省略。\n##【写作形式与风格】\n输出格式： 纯正的小说文本，保留标点符号，保留段落感。\n风格要求： 对白驱动剧情。通过精简旁白，让对话节奏更紧凑，冲突更集中。\n## 禁止项：\n❌ 禁止出现分镜词（特写、远景、淡入淡出）。\n❌ 禁止出现时间轴（0-5秒）。\n❌ 禁止删除或修改任何一句对话。\n❌ 禁止新增原文没有的情节或设定。\n## 情绪与逻辑\n逻辑： 尽管大幅删减了旁白，必须确保对话与动作的衔接流畅，事件顺序严格遵照原文。\n氛围： 突出原文中的冲突与张力，保留关键的情绪转折点。\n## 输出要求\n直接输出修改后的完整文案。\n保留标点符号和段落格式。",
  'extractInfo': "{用户输入}\n# 筛选出以上故事里的角色（包括主要怪物）、场景以及道具物品\n把以上每个角色根据剧情写出详细中文提示词包括五官相貌，脸型，发型，全身服饰提示词。重要物品，场景\n用 --- 符号来分割每一个角色,先把人设输出完毕，最后再输出场景，如有角色不同状态也需要标注出来(但不需要太详细)，不用输出多余说明，不带有格式\n# 输出示例：\n\n#人设\n1. 主角：沈仪\n# 中文提示词：\n1个青年男性，古风，捕快，英俊硬朗，剑眉星目，黑色长发，凌乱发髻，身穿古代黑色官差制服，衣衫不整，暗黑武侠，电影光效。\n# 中文提示词(受伤状态)：\n.....\n\n---\n\n2. 配角：刘家丫头\n...\n...\n...\n\n---\n# 重要物品\n1. 腰间佩戴的一把制式长刀（佩刀），刀柄古旧；\n2. 。。。。\n# 场景：\n1. 昏暗的破旧土屋或夜晚的院落，月光惨白，暗黑压抑氛围。\n2. ....\n",
  'Storyboard1': "## 核心任务\n你是一个专业的AI分镜脚本生成器。任务是基于提供的文本信息，生成“视频提示词”的分镜脚本，分割后的上下分镜必须十分丝滑的连贯。\n\n# 输入信息\n\n**故事情节：**\n{用户输入}\n\n# 视频提示词原则\n\n## 视觉关键词密集度\n\n- 规则：为最大化 AI 模型对画面的控制力，必须使用大量具体的、高辨识度的视觉描述词汇\n- 场景、角色、光影、特效必须混合使用（例如：“幽蓝色的霓虹线路”、“血红色的赛博月亮”、“凌厉的金色电光”、“数码化的爆炸效果”）。\n\n## 运镜的专业化和指令化\n\n- 规则：采用专业电影术语而非简单描述，以明确规定画面的动态行为。\n- 严格使用【超广角】、【特写】等**景别**，以及【慢速推轨】、【环绕慢摇】、【动态手持】等**镜头运动**指令。\n\n## *动作的分解与强调\n\n- 逻辑：复杂的动作不能一笔带过，必须分解成关键帧和关键特写，确保动作的冲击力。\n- 使用【爆发式跃出】（远景）接【腰部极限扭转】（近景），再接【接触的瞬间】（慢动作特写），突出高速和高冲击。\n\n## 人物台词\n- 原文中的对话内容不允许进行擅自删改。要把输入文案作为唯一的信息来源，忠实地将其内容转化为分镜脚本，避免添加任何文案中未提及的情节、动作、场景或角色心理活动。\n- 对话要用“”标示出来。\n\n## 时长与节奏的控制：\n\n- 为每个分镜设定一个合理的时长，以控制最终视频的节奏感。短时间用于高冲击特写，长时间用于场景铺垫或关键动作。\n- 提示词应用的视频时长15秒及以内，剧本包含画面，运镜，所以每一幕的提示词不能超过该时间\n\n## 听觉元素\n\n- 在关键动作后备注音效提示，如“尖锐的破空声与低沉的能量轰鸣”或“无台词，只有金属、能量、符文破碎的声音”。\n\n# 输出格式严格遵循的规则：\n1.  保持连续性：\n    - 为保证场景一致性，若前后剧情为统一场景则需要延续上一则剧本的场景\n\n2.  剧情不能改变：\n    - 保留剧情上的所有对话。 \n\n3.  设定角色、场景映射：\n    - 但凡该幕出场的所有角色都应该有角色映射（[人名]参考@图片参考@音频）\n\n4.  输出格式：\n    - 按顺序输出分镜描述，不需要解释或分析过程。\n    - 输出的内容应当没字体样式。\n\n5. **提示词推理限制：不得出现任何违禁词，违禁词包括词典如下**：\n\n“ 血液相关：血液飞溅、喷血、鲜血淋漓、血池、血祭、断头血、内脏出血、血腥场面、血债、血洗\n暴力场景：分尸、碎尸、斩首、砍头、挖眼、掏心、剥皮、凌迟、虐杀、酷刑、断肢、爆头、穿刺、撕咬\n其他暴力：屠杀、灭门、焚尸、鞭尸、尸横遍野、血肉模糊、骨裂、脑浆、内脏外露、残肢断臂\n裸露低俗类：全裸、半裸、袒胸露背、露脐、露臀、露私密部位、一丝不挂、裸体、赤裸 低俗暗示：性感暴露、挑逗性裸露、低俗姿势、暴露隐私部位、酥胸半露、衣不蔽体\n违规场景：色情暗示、艳情、低俗互动、性挑逗、裸露祭祀\n色情与性暗示类：色情、淫秽、嫖娼、卖淫、性交易、一夜情、通奸、乱伦、恋童、兽交 暗示类：约炮、撩骚、打炮、床上戏、胸器、美腿诱惑、性感撩拨、暧昧低俗、艳舞、脱衣舞 敏感部位描述：乳房、阴部、阴茎、臀部\n其他高危敏感词封建迷信：血腥祭祀、活人献祭、血咒、尸变、僵尸吸血、妖魔鬼怪（恐怖化描述，如 \"食人恶鬼\"） \n危害公序良俗：自残、自杀、暴力教唆、聚众斗殴、黑帮火拼、恐怖袭击、校园暴力\n敏感宗教 / 政治：邪教仪式、极端宗教、分裂、恐怖组织、反动、颠）”\n\n# 固定的模板格式\n    - 使用 ---  作为每一幕提示词的分隔符。 \n    - 提示词第一部分：最顶部固定是（第X幕）无字幕，无BGM\n    - 第二部分为内容（每一幕都用动作来收尾，为了更好的衔接视频上下文）。\n    - 场景基调要固定好！为了更好的衔接上下镜头（如：秋季，大风，漆黑的夜晚）。\n\n## 输出样例\n第一幕：\n无字幕，无BGM\n沈仪的形象参考@图片1音色参考@音频1，犬妖参考@图片2音色参考@音频2\n夜晚，破旧院落。\n【中景镜头】，沈仪脸上挤出僵硬的笑容，用肩膀撞了一下犬妖的胳膊。\n（人声强颜欢笑） 沈仪说：“老弟的本事你还不清楚，哪里快的起来。走走走，今晚我请酒。”\n沈仪试图推着犬妖往外走，但犬妖纹丝不动。\n犬妖低头俯视沈仪，眼神冰冷漠然。\n犬妖甩开沈仪的手，转身走向院内。沈仪下意识伸手去拦，被犬妖毛茸茸的爪子一把抓住手腕。\n（人声冷漠）犬妖说：“伱当我是蠢猪？”\n【特写镜头】，犬妖猛然贴近沈仪的脸，张开满是尖牙的大嘴，唾液拉丝。\n\n--- \n\n第二幕：\n无字幕，无BGM\n沈仪的形象参考@图片1音色参考@音频1，犬妖参考@图片4音色参考@音频3\n夜晚，破旧院落。\n【特写镜头】，犬妖猛然贴近沈仪的脸，张开满是尖牙的大嘴，唾液拉丝。\n（人声愤怒）犬妖说：“姓沈的，你好像真拿自己当个东西了。里面的动静我听的清清楚楚，你他妈敢反水？！”\n【镜头快速后拉】，犬妖抬起粗壮的大腿猛地蹬向沈仪腹部。\n沈仪面部表情扭曲，整个人如破麻袋般倒飞出去，撞破屋门摔入屋内。\n（人声痛苦）沈仪说：“不是，你属狗的？说翻脸就翻脸？”\n（人声愤怒）犬妖说：“给脸不要脸的东西，合该拿你一起来祭我五脏六腑。”\n沈仪瘫软在地，用力捂住小腹\n",
  'Storyboard2': "## 核心任务\n你是一个专业的AI分镜脚本生成器。任务是基于提供的文本信息，生成“视频提示词”的分镜脚本，分割后的上下分镜必须十分丝滑的连贯。\n# 输入信息\n\n**故事情节：**\n{用户输入}\n\n# 视频提示词原则\n\n## 视觉关键词密集度\n\n- 规则：为最大化 AI 模型对画面的控制力，必须使用大量具体的、高辨识度的视觉描述词汇\n- 场景、角色、光影、特效必须混合使用（例如：“幽蓝色的霓虹线路”、“血红色的赛博月亮”、“凌厉的金色电光”、“数码化的爆炸效果”）。\n\n## 运镜的专业化和指令化\n\n- 规则：采用专业电影术语而非简单描述，以明确规定画面的动态行为。\n- 严格使用【超广角】、【特写】等**景别**，以及【慢速推轨】、【环绕慢摇】、【动态手持】等**镜头运动**指令。\n\n## *动作的分解与强调\n\n- 逻辑：复杂的动作不能一笔带过，必须分解成关键帧和关键特写，确保动作的冲击力。\n- 使用【爆发式跃出】（远景）接【腰部极限扭转】（近景），再接【接触的瞬间】（慢动作特写），突出高速和高冲击。\n\n## 人物台词\n- 原文中的对话内容不允许进行擅自删改。要把输入文案作为唯一的信息来源，忠实地将其内容转化为分镜脚本，避免添加任何文案中未提及的情节、动作、场景或角色心理活动。\n- 对话要用“”标示出来。\n\n## 时长与节奏的控制：\n\n- 为每个分镜设定一个合理的时长，以控制最终视频的节奏感。短时间用于高冲击特写，长时间用于场景铺垫或关键动作。\n- 提示词应用的视频时长15秒及以内，剧本包含画面，运镜，所以每一幕的提示词不能超过该时间\n\n## 听觉元素\n\n- 在关键动作后备注音效提示，如“尖锐的破空声与低沉的能量轰鸣”或“无台词，只有金属、能量、符文破碎的声音”。\n\n# 输出格式严格遵循的规则：\n1.  保持连续性：\n    - 为保证场景一致性，若前后剧情为统一场景则需要延续上一则剧本的场景\n\n2.  剧情不能改变：\n    - 保留剧情上的所有对话。 \n\n3.  设定角色、场景映射：\n    - 但凡该幕出场的所有角色都应该有角色映射（[人名]参考@图片参考@音频）\n\n4.  输出格式：\n    - 按顺序输出分镜描述，不需要解释或分析过程。\n    - 输出给我的内容应当没字体样式。\n\n5. **提示词推理限制：不得出现任何违禁词，违禁词包括词典如下**：\n\n“ 血液相关：血液飞溅、喷血、鲜血淋漓、血池、血祭、断头血、内脏出血、血腥场面、血债、血洗\n暴力场景：分尸、碎尸、斩首、砍头、挖眼、掏心、剥皮、凌迟、虐杀、酷刑、断肢、爆头、穿刺、撕咬\n其他暴力：屠杀、灭门、焚尸、鞭尸、尸横遍野、血肉模糊、骨裂、脑浆、内脏外露、残肢断臂\n裸露低俗类：全裸、半裸、袒胸露背、露脐、露臀、露私密部位、一丝不挂、裸体、赤裸 低俗暗示：性感暴露、挑逗性裸露、低俗姿势、暴露隐私部位、酥胸半露、衣不蔽体\n违规场景：色情暗示、艳情、低俗互动、性挑逗、裸露祭祀\n色情与性暗示类：色情、淫秽、嫖娼、卖淫、性交易、一夜情、通奸、乱伦、恋童、兽交 暗示类：约炮、撩骚、打炮、床上戏、胸器、美腿诱惑、性感撩拨、暧昧低俗、艳舞、脱衣舞 敏感部位描述：乳房、阴部、阴茎、臀部\n其他高危敏感词封建迷信：血腥祭祀、活人献祭、血咒、尸变、僵尸吸血、妖魔鬼怪（恐怖化描述，如 \"食人恶鬼\"） \n危害公序良俗：自残、自杀、暴力教唆、聚众斗殴、黑帮火拼、恐怖袭击、校园暴力\n敏感宗教 / 政治：邪教仪式、极端宗教、分裂、恐怖组织、反动、颠）”\n\n# 固定的模板格式\n    - 使用 ---  作为每一幕提示词的分隔符。 \n    - 提示词第一部分：最顶部固定是（第X幕）无字幕，无BGM\n    - 第二部分为内容（可以的话每一幕都用动作来收尾，为了更好的衔接视频上下文）。\n    - 场景基调要固定好！为了更好的衔接上下镜头（如：秋季，大风，漆黑的夜晚）。\n\n# 输出样例\n第1幕\n无字幕，无BGM\n沈仪参考@图片1，刘家丫头参考@图片2\n场景参考@图片4 昏暗潮湿的土屋，夜间，油灯摇曳，阴冷压抑的色调，空气中漂浮尘埃。\n0-1.5s：【特写】沈仪猛然睁眼，满头冷汗，呼吸急促。镜头快速推向其手掌，指缝间沾染暗红印记\n1.5-3s：【主观镜头】沈仪视线。床脚刘家丫头衣衫凌乱、瑟瑟发抖；身侧老头佝偻，手中木棒顶端滴落粘稠暗色液体。\n3-6s：【中景】沈仪按着后脑，神情痛苦狰狞，戾气在眉宇间聚集。\n6-9s：【特写】沈仪咬牙，眼神凶狠，胸膛剧烈起伏。\n（愤怒）沈仪：“嗬哧！……我说……”\n音效：沉重的喘息声，心跳如鼓点，油灯爆裂的滋滋声。\n9-15s：【低角度特写】刘丫头突然扑上前来，双手死死抱住沈仪小腿，神情绝望癫狂。\n（惊恐）刘丫头：“爷！我给您！我什么都给您！您放俺爹回乡下好不好？”\n\n--- \n\n第2幕\n.....\n.....\n.....",
  'Seedance2VideoFormat': "{用户输入}\n如用户指定秒数就按照用户的来，如没指定就按照15秒来写提示词，不要输出多余内容。严格按照下面格式输出提示词\nx-xs：景别，行为\nx-xs：景别，行为\nx-xs：景别，行为\n示例：0-1s：特写镜头，人物拿起刀.............../"
};
const STORYBOARD_PROMPT_TEMPLATES = {
  'filmStoryboard': "做一张 3×4 的电影分镜网格，共 12 格，所有画面都出现同一个角色：一位短发亚洲女性，25岁左右，黑色齐耳短发，五官清冷精致，穿米白色长风衣、白色内搭、浅蓝牛仔裤和黑色短靴，气质独立、安静、有故事感。场景设定为：晴天下午的东京街头，干净街道、便利店、斑马线、路边电线杆、远处城市建筑，光线明亮柔和，有空气感。\n  12 格分别表现不同景别与镜头语言：正面近景、眼神特写、背影中景、侧脸特写、过肩镜头、全身远景、低角度仰拍、街角行走、回头瞬间、手部细节、风吹衣摆、黄昏街头收尾镜头。\n  每一格都要保持角色身份高度一致，包括脸型、发型、服装、气质和色彩设定。画面整体明亮、清晰、有电影感，构图丰富但统一，像专业影视前期分镜稿。风格参考：都市电影前期分镜、日系清新电影感、明亮写实插画。避免角色变脸、服装变化过大、画面过暗、杂乱背景、低质量线稿。",
  'advertisingStoryboard': "生成一张 16:9 横版高清广告前期制作板，主题为「泰国冰汽水广告故事板」。整体采用深蓝色信息板底色，白色细线分区，画面整洁、商业感强，像专业广告提案板。\n  包含艺术指导、角色与风格参考、环境与场景设计、8 格故事板、灯光情绪、关键词、音频音调、镜头类型等模块。整体是明亮清凉的热带动漫广告风格，画面中冰块、气泡、水花、冷凝水、阳光高光非常明显，色彩清爽，角色一致性高，场景统一，适合品牌广告前期制作展示。",
  'gameStoryStoryboard': '生成一张「修仙缘起」的\x2015\x20秒剧情分镜图，整体风格为黑金复古、东方美学、水墨意境。画面采用专业游戏\x20CG\x20动画前期分镜版式，包含\x206\x20个连续分镜。\x0a\x20\x206\x20个分镜依次表现：灵根觉醒的神秘山门场景、古老测试石碑发出微光、主角缓缓走近并触碰石碑、金色符文从石碑中浮现、天灵根被选中的震撼瞬间、主角手指悬停在发光符文前的特写。\x0a\x20\x20要求画面风格统一，角色形象一致，动作连贯，镜头衔接自然，情绪从疑惑、紧张到震撼与觉醒逐步变化。整体具有黑金东方玄幻质感、水墨氛围、电影级光影和游戏剧情宣传片的视觉冲击力。',
  'sportsTrainingStoryboard': "生成一张 16 步篮球训练动作示意图，采用 4×4 网格布局。主角是一名年轻篮球运动员，穿着 oversized 篮球衫、黑色短裤、连脚袜和高帮运动鞋。每个格子展示一个不同的篮球训练动作，包括原地运球、交叉步运球、胯下运球、背后运球、变向突破、急停跳投、三威胁姿势、防守滑步、转身护球、上篮起步、抛投动作、后撤步投篮、接球投篮、低位脚步、传球姿势、投篮收尾。\n  风格为彩色铅笔画，色调柔和，能看出铅笔纹理。要求动作清晰，身体姿势、篮球位置、手部动作、脚的站位和重心变化明显不同。背景干净，网格排版整齐，适合作为篮球训练教学动作示意图。",
  'animationStoryboard': '生成一张「发光森林冒险」的动画故事板，整体风格为可爱卡通、明亮奇幻、童话冒险。画面采用专业动画前期分镜版式，包含\x208\x20个连续分镜。\x0a\x20\x208\x20个分镜依次表现：萤火虫入口发出微光，小主角走进森林；主角发现一颗发光种子；沿着盘绕的树根小路前进；古树裂缝缓缓睁开像眼睛一样发光；神秘守夜者从树影中出现并开口说话；主角在藤蔓追赶中惊险躲避；发光种子被放入古树中心，点亮整片森林；最后以蓝色月光下的森林全景收尾。\x0a\x20\x20每个分镜包含简单对白气泡，例如「这里好亮！」「它在呼唤我们」「快跑！」「森林醒来了」。要求角色一致，动作连贯，情绪从好奇、惊讶、紧张到温暖治愈逐步变化。画面风格统一，色彩明亮，分镜清晰，像专业动画故事板。',
  'musicVideoStoryboard': "生成一张「霓虹雨夜」的 MV 音乐视频故事版，整体风格为赛博都市、霓虹灯光、孤独浪漫。画面采用专业音乐视频前期分镜版式，包含 8 个连续分镜。\n  8 个分镜依次表现：雨夜城市远景，霓虹灯在湿润街道上反射；女歌手撑着透明雨伞走进画面；近景拍摄她低头轻唱第一句歌词；街边广告屏闪烁蓝紫色光；副歌部分她站在天桥中央，身后车流形成光轨；舞蹈段落中多人剪影在雨中起舞；情绪高潮时女歌手抬头看向天空，雨滴被霓虹照亮；最后以清晨微光下空荡街道收尾。\n  每个分镜加入简短歌词片段或情绪提示，例如「雨落下时，我还在等你」「城市不说话」「灯光替我记得你」。要求角色一致，情绪从孤独、克制到释放再到释然，画面统一，灯光高级，像专业 MV 故事板。",
  'comicStoryboardPage': "生成一张「午夜觉醒」的漫画分镜页，整体风格为现代热血青年漫画、黑白墨线、局部红色强调。画面采用专业漫画页构图，包含 8 个大小不同的分镜。\n  8 个分镜依次表现：深夜城市天台，男主独自站在风中；眼神特写，瞳孔中出现红色光芒；手机收到神秘信息「你被选中了」；天空突然裂开，黑色能量降落；男主被冲击波震退，手臂浮现金色符文；敌人剪影从烟雾中出现；男主握紧拳头，能量爆发；最后一格为大画幅英雄站姿，男主说「从现在开始，由我决定命运。」\n  加入对白气泡、速度线、冲击线、墨迹飞溅和音效字，例如「轰！！」「咔嚓」「嗡——」。要求分镜节奏紧张，情绪从疑惑、震惊到觉醒爆发，画面统一，像正式漫画连载页。",
  'socialShortVideoStoryboard': "生成一张「5分钟整理书桌」的社交媒体短视频分镜图，整体风格为清新生活方式、小红书感、明亮治愈。画面采用短视频脚本前期分镜版式，包含 8 个连续分镜。\n  8 个分镜依次表现：开头钩子，凌乱书桌特写，字幕「你的桌面是不是也这样？」；人物皱眉看着桌面；清空桌面，把物品分类；擦拭桌面，阳光照进房间；摆放收纳盒、笔筒和台灯；整理前后对比画面；人物坐下开始学习，表情放松；最后展示干净桌面全景，字幕「5分钟，让学习状态回来」。\n  要求字幕清晰，镜头有近景、俯拍、对比镜头和全景，节奏从混乱到治愈，画面明亮统一，适合短视频拍摄前期分镜。",
  'brandPromotionStoryboard': '生成一张「LUMO\x20智能台灯」的品牌宣传故事版，整体风格为现代极简、温暖科技、生活方式广告。画面采用专业品牌宣传片前期分镜版式，包含\x208\x20个连续分镜。\x0a\x20\x208\x20个分镜依次表现：夜晚书桌前，年轻设计师疲惫地揉眼睛；桌面光线昏暗，设计稿散落；LUMO\x20智能台灯轻轻亮起，柔和光线覆盖桌面；手机\x20App\x20自动调节亮度与色温；设计师重新开始绘图，表情放松；清晨阳光进入房间，作品完成；台灯与整洁桌面形成高级产品特写；最后品牌口号出现：「LUMO，让灵感被温柔照亮。」\x0a\x20\x20要求品牌感高级，产品出现自然，人物情绪从疲惫到专注再到满足，画面干净统一，像真实品牌宣传片故事板。',
  'tutorialStoryboard': "生成一张「手冲咖啡教学」的教程类分镜图，整体风格为温暖生活方式、极简插画、咖啡馆氛围。画面采用清晰步骤教学版式，包含 8 个连续步骤分镜。\n  8 个步骤依次表现：准备滤杯、滤纸、咖啡豆和手冲壶；研磨咖啡豆；放入滤纸并用热水润湿；倒入咖啡粉并轻轻铺平；第一次注水进行闷蒸；分三次画圈注水；咖啡滴滤完成；倒入杯中并展示成品咖啡。\n  每个分镜加入箭头、编号和简短说明文字，例如「研磨」「润湿滤纸」「闷蒸30秒」「缓慢注水」。要求动作清晰、器具位置准确、步骤连贯，画面干净高级，像专业教程信息图。",
  'hdFilmProductionBoard': "创建一张 16:9 横版高清电影制作板 / 视觉规划表，主题为「奔驰跑车性能广告」。整体呈现高端汽车广告前期制作板风格，布局简洁、结构清晰、分区明确，具有影视级商业质感，适合作为导演拍摄指南。\n  画面主体围绕一辆银灰色奔驰 AMG 跑车，强调速度、精准、豪华、操控和夜间赛道性能。整体视觉为深色高级底板，搭配白色细线分区、冷蓝灯光、银灰金属质感、红色尾灯轨迹和少量品牌红色点缀。\n  顶部栏为艺术指导区，展示项目概述：16:9 赛车性能短片、8 个主要镜头、夜晚赛车场环境、统一色卡、影片基调关键词。色卡包括深黑、炭灰、银灰、冷蓝、尾灯红。\n  左侧为车辆与赛车手风格参考区：展示奔驰跑车的正面、侧面、背面、车灯特写、轮毂特写、内饰方向盘、车标细节；同时展示赛车手在车内的驾驶姿态参考，赛车手必须佩戴黑色全盔、黑色赛车服、赛车手套，形象保持一致，不出现车外站立画面。\n  中上区域为环境与场景设计：展示一个极具电影感的夜晚赛车场，湿润赛道反射冷蓝灯光，远处看台、泛光灯、赛道护栏、弯道漂移区域清晰可见。旁边加入俯视赛道示意图，用红色路线标出赛车移动路径，并标注摄像机位置、跟拍点、漂移弯道、低机位、车内镜头、无人机俯拍等镜头类型。\n  中部为 8 格故事板分镜，所有分镜为 16:9 小画幅，编号清晰，展示完整拍摄流程：\n  1. 夜晚赛车场广角建立镜头，奔驰跑车进入赛道；\n  2. 低机位车头推进，车灯划破黑暗；\n  3. 车内特写，赛车手戴头盔握紧方向盘；\n  4. 轮胎与地面微距，轮胎打滑，水花和烟雾飞溅；\n  5. 跑车高速过弯漂移，加入强烈运动模糊；\n  6. 车尾跟拍，红色尾灯形成光轨；\n  7. 无人机俯拍，车辆沿赛道路线高速穿梭；\n  8. 英雄收尾镜头，跑车停在赛道灯光下，车身反射高级冷光。\n  每个分镜下方加入小型信息条，标注镜头类型、景别、运动方式、动作描述和情绪进展，例如：广角 / 中景 / 特写 / 微距，静态 / 跟拍 / 低机位 / 手持 / 航拍，速度感、压迫感、精准操控、胜利收束。\n  底部模块包含灯光与情绪、关键词、音频音调、镜头语言与后期风格。灯光强调冷蓝赛道灯、红色尾灯、金属反光、湿地反射和高对比阴影；关键词包括性能、速度、精准、控制、豪华、夜赛、漂移；音频包括低频电子音乐、引擎轰鸣、轮胎摩擦、水花飞溅、风噪和加速声浪；镜头语言包括低角度推进、车内主观镜头、轮胎微距、跟车镜头、无人机俯拍、运动模糊和高速剪辑。\n  整体画面必须保持专业、整洁、连贯、商业广告感强，分镜节奏清晰，禁止出现赛车手在车外的画面，赛车手始终在车内并佩戴头盔。画面要一眼传达奔驰跑车的速度、力量、精密操控和高级豪华气质。",
  'xianxiaGuomanStoryboard': "创建一张 16:9 横版高清「30 秒科幻修仙国漫影视视觉开发板」，参考好莱坞工业化电影前期制作标准，整体为冷调写实电影质感、东方玄幻美学、未来科技感和国漫高燃叙事风格。\n  画面采用高级深色信息板排版，分为 6 大模块：顶部项目信息栏，展示片名、时长、类型、调性、镜头数量和主色调；左上双主角人设设计栏，展示两位主角的正面、侧面、背面三视图、面部特写、服装细节、武器法器和科技装备，角色造型必须高度一致；右上核心场景概念图，展示悬浮仙城、灵能天门、赛博仙山或量子阵法等宏大科幻修仙场景；中部 3 组连续镜头故事板序列，展示镜头编号、景别、运镜、动作和情绪推进；镜头运动与技术示意区，包含运镜轨迹、相机运动流程、机位图标和空间调度；底部专业技术参数栏，展示灯光氛围、色卡、镜头参数、后期风格、音频基调和视觉关键词。\n  整体要求专业影视工业级排版，信息密度高但清晰有序，画面统一精致，角色不变脸，文字不混乱，无低质拼贴。色调以冷蓝、玄黑、银灰、暗金、灵能青和能量白为主。4K 超清，ultra-detailed，professional film production layout，cinematic shot design，适配 Seedance 2.0 专业视频生成。」\n  整体视觉要求：\n   高级教程海报、清晰排版、上下结构明确、标题醒目、提示词区域可读性强、留白合理、设计感强。严格保持 3:4 教程图模板结构，不要把整张图做成横版影视视觉开发板。不要杂乱，不要低质截图感，不要文字堆叠混乱，不要廉价海报风。"
};
const STORYBOARD_INSERT_PROMPT_PRESETS = [{
  'templateKey': "filmStoryboard",
  'title': "电影分镜故事板",
  'desc': '电影镜头故事板模板'
}, {
  'templateKey': "advertisingStoryboard",
  'title': "广告故事板",
  'desc': '广告创意故事板模板'
}, {
  'templateKey': "gameStoryStoryboard",
  'title': '游戏剧情故事板',
  'desc': "游戏剧情演出故事板模板"
}, {
  'templateKey': "sportsTrainingStoryboard",
  'title': '体育训练故事板',
  'desc': "体育训练动作故事板模板"
}, {
  'templateKey': "animationStoryboard",
  'title': "动画故事板",
  'desc': "动画镜头故事板模板"
}, {
  'templateKey': "musicVideoStoryboard",
  'title': "MV音乐视频故事板",
  'desc': '音乐视频画面故事板模板'
}, {
  'templateKey': 'comicStoryboardPage',
  'title': "漫画分镜页",
  'desc': "漫画页面分镜模板"
}, {
  'templateKey': "socialShortVideoStoryboard",
  'title': "社交媒体短视频分镜",
  'desc': "短视频节奏分镜模板"
}, {
  'templateKey': "brandPromotionStoryboard",
  'title': "品牌宣传故事版",
  'desc': "品牌宣传画面故事版模板"
}, {
  'templateKey': 'tutorialStoryboard',
  'title': "教程类分镜图",
  'desc': "教程步骤画面分镜模板"
}, {
  'templateKey': "hdFilmProductionBoard",
  'title': "高清电影制作板",
  'desc': "高清电影制作板模板"
}, {
  'templateKey': "xianxiaGuomanStoryboard",
  'title': "修仙国漫故事板",
  'desc': "修仙国漫剧情故事板模板"
}];
const IMAGE_PRESET_EMPTY_INPUT_MESSAGE = '请输入提示词或添加参考图片';
const staticPromptTemplate = _0x13048f => ({
  'type': PROMPT_PRESET_TEMPLATE_TYPE_STATIC,
  'text': _0x13048f,
  'requireInput': !![],
  'emptyInputMessage': IMAGE_PRESET_EMPTY_INPUT_MESSAGE
});
const storyboardInsertPromptPreset = ({
  templateKey: _0x41afa1,
  title: _0x5b263b,
  desc: _0x27c5a8
}) => ({
  'icon': '🎬',
  'title': _0x5b263b,
  'desc': _0x27c5a8,
  'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
  'template': staticPromptTemplate(STORYBOARD_PROMPT_TEMPLATES[_0x41afa1])
});
function localizePromptPresetTemplate(_0x3c7840, _0x3d1af7 = '') {
  const _0x1d4c13 = _0x3d1af7 ? optionalPromptPresetsText("presets." + _0x3d1af7 + ".template") : '';
  if (typeof _0x3c7840 === 'string') {
    return _0x1d4c13 || _0x3c7840;
  }
  if (!_0x3c7840 || typeof _0x3c7840 !== 'object') {
    return _0x3c7840;
  }
  const _0x1a428f = {
    ..._0x3c7840
  };
  _0x1d4c13 && _0x1a428f["type"] === PROMPT_PRESET_TEMPLATE_TYPE_STATIC && (_0x1a428f['text'] = _0x1d4c13);
  if (_0x1a428f['type'] === PROMPT_PRESET_TEMPLATE_TYPE_CONDITIONAL_BY_IMAGE_INPUT) {
    const _0x3ad46f = _0x3d1af7 ? optionalPromptPresetsText("presets." + _0x3d1af7 + ".imageInputTemplate") : '';
    const _0x30ee86 = _0x3d1af7 ? optionalPromptPresetsText('presets.' + _0x3d1af7 + '.textInputTemplate') : '';
    _0x3ad46f && (_0x1a428f['imageInputTemplate'] = _0x3ad46f);
    _0x30ee86 && (_0x1a428f["textInputTemplate"] = _0x30ee86);
  }
  const _0x4dcb27 = String(_0x1a428f['emptyInputMessage'] || '');
  if (_0x4dcb27 === IMAGE_PRESET_EMPTY_INPUT_MESSAGE) {
    _0x1a428f["emptyInputMessage"] = promptPresetsText("emptyInput.image");
  } else {
    _0x4dcb27 === TEMPLATES["Panorama360Seamless"]["emptyInputMessage"] && (_0x1a428f['emptyInputMessage'] = promptPresetsText("emptyInput.panorama"));
  }
  return _0x1a428f;
}
function localizePromptPresetItem(_0x4b507c = {}) {
  const _0x362ff2 = String(_0x4b507c?.["title"] || '');
  const _0x3124a1 = PROMPT_PRESET_TITLE_I18N_KEYS[_0x362ff2] || '';
  const _0x3b718a = {
    ..._0x4b507c
  };
  if (_0x362ff2) {
    _0x3b718a["title"] = getLocalizedPresetTitle(_0x362ff2);
  }
  Object["prototype"]["hasOwnProperty"]["call"](_0x4b507c, 'desc') && (_0x3b718a["desc"] = getLocalizedPresetDesc(_0x362ff2, _0x4b507c["desc"]));
  Array["isArray"](_0x4b507c["subItems"]) && (_0x3b718a["subItems"] = _0x4b507c["subItems"]["map"](localizePromptPresetItem));
  Object["prototype"]["hasOwnProperty"]["call"](_0x4b507c, 'template') && (_0x3b718a["template"] = localizePromptPresetTemplate(_0x4b507c['template'], _0x3124a1));
  return _0x3b718a;
}
function localizePromptPresetItems(_0x2605ab = []) {
  return (Array["isArray"](_0x2605ab) ? _0x2605ab : [])["map"](localizePromptPresetItem);
}
export const PROMPT_PRESETS = {
  'ai-image': [{
    'icon': '📐',
    'title': '场景参考',
    'desc': '一键生成场景多视图和全景图',
    'subItems': [{
      'icon': '📐',
      'title': "场景四视图",
      'desc': "一键生成场景多视图",
      'template': staticPromptTemplate(TEMPLATES["SceneReference"])
    }, {
      'icon': '▦',
      'title': "场景九视图",
      'desc': '同一场景的\x209\x20个连续多视角设定图',
      'template': staticPromptTemplate(TEMPLATES["SceneNineView"])
    }, {
      'icon': '🌐',
      'title': "360°无缝全景图",
      'desc': "生成适合 VR 查看的一张无缝 360° 全景图",
      'template': TEMPLATES['Panorama360Seamless']
    }]
  }, {
    'icon': '🧍',
    'title': "人设参考",
    'desc': "一键生成人物多视图 三视图、三视图加脸部、人设拆解图",
    'subItems': [{
      'icon': '🧍',
      'title': '人物三视图',
      'desc': '纯正的三向视图展示',
      'template': staticPromptTemplate(TEMPLATES["characterRef3View"])
    }, {
      'icon': '🧍',
      'title': "人物三视图+脸部",
      'desc': "带脸部特写的三视图",
      'template': staticPromptTemplate(TEMPLATES['characterRef3ViewFace'])
    }, {
      'icon': '🧍',
      'title': "前后视图+脸部",
      'desc': '脸部特写与无头前后全身视图',
      'template': staticPromptTemplate(TEMPLATES["characterFrontBackViewFace"])
    }, {
      'icon': '🧍',
      'title': "人设解析图",
      'desc': "包含细节拆解的设定集",
      'template': staticPromptTemplate(TEMPLATES["characterRefAnalysis"])
    }]
  }, {
    'icon': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" width=\"14\" height=\"14\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect></svg>",
    'title': '多宫格',
    'desc': "一键生成剧情连续的多宫格图片",
    'subItems': [{
      'icon': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" width=\"14\" height=\"14\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect></svg>",
      'title': "4宫格",
      'desc': "起承转合更清晰，适合一句话剧情",
      'template': staticPromptTemplate(TEMPLATES['multiGrid4'])
    }, {
      'icon': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" width=\"14\" height=\"14\"><rect x=\"3\" y=\"3\" width=\"4\" height=\"4\"></rect><rect x=\"10\" y=\"3\" width=\"4\" height=\"4\"></rect><rect x=\"17\" y=\"3\" width=\"4\" height=\"4\"></rect><rect x=\"3\" y=\"10\" width=\"4\" height=\"4\"></rect><rect x=\"10\" y=\"10\" width=\"4\" height=\"4\"></rect><rect x=\"17\" y=\"10\" width=\"4\" height=\"4\"></rect><rect x=\"3\" y=\"17\" width=\"4\" height=\"4\"></rect><rect x=\"10\" y=\"17\" width=\"4\" height=\"4\"></rect><rect x=\"17\" y=\"17\" width=\"4\" height=\"4\"></rect></svg>",
      'title': "9宫格",
      'desc': "3x3 更细动作与情绪递进",
      'template': staticPromptTemplate(TEMPLATES["multiGrid9"])
    }, {
      'icon': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" width=\"14\" height=\"14\"><path d=\"M3 3h18v18H3z\"></path><path d=\"M7.5 3v18\"></path><path d=\"M12 3v18\"></path><path d=\"M16.5 3v18\"></path><path d=\"M3 7.5h18\"></path><path d=\"M3 12h18\"></path><path d=\"M3 16.5h18\"></path></svg>",
      'title': "16宫格",
      'desc': '4x4\x20更密的节奏推进与镜头切换',
      'template': staticPromptTemplate(TEMPLATES["multiGrid16"])
    }, {
      'icon': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.5\x22\x20width=\x2214\x22\x20height=\x2214\x22><path\x20d=\x22M3\x203h18v18H3z\x22></path><path\x20d=\x22M6.6\x203v18\x22></path><path\x20d=\x22M10.2\x203v18\x22></path><path\x20d=\x22M13.8\x203v18\x22></path><path\x20d=\x22M17.4\x203v18\x22></path><path\x20d=\x22M3\x206.6h18\x22></path><path\x20d=\x22M3\x2010.2h18\x22></path><path\x20d=\x22M3\x2013.8h18\x22></path><path\x20d=\x22M3\x2017.4h18\x22></path></svg>',
      'title': "25宫格",
      'desc': '5x5\x20长连续剧情，适合完整片段',
      'template': staticPromptTemplate(TEMPLATES['multiGrid25'])
    }]
  }, {
    'icon': '🎬',
    'title': "故事板分镜",
    'desc': '一键生成故事板分镜',
    'subItems': [{
      'icon': '🎬',
      'title': "竖版故事分镜",
      'desc': "竖版分镜，从上到下推进",
      'template': staticPromptTemplate(TEMPLATES["storyboardVertical"])
    }, {
      'icon': '🎬',
      'title': "竖版故事分镜+场景",
      'desc': "竖版分镜，包含场景设定参考",
      'template': staticPromptTemplate(TEMPLATES["storyboardVerticalScene"])
    }, {
      'icon': '🎬',
      'title': "横版故事分镜",
      'desc': "横版分镜，从左到右推进",
      'template': staticPromptTemplate(TEMPLATES["storyboardHorizontal"])
    }, {
      'icon': '🎬',
      'title': "横版故事分镜+场景",
      'desc': "横版分镜，包含场景设定参考",
      'template': staticPromptTemplate(TEMPLATES["storyboardHorizontalScene"])
    }, ...STORYBOARD_INSERT_PROMPT_PRESETS['map'](storyboardInsertPromptPreset)]
  }],
  'ai-text': [{
    'icon': "🖼️",
    'title': REVERSE_IMAGE_PROMPT_PRESET_TITLE,
    'desc': "根据参考图反推出中英文生图提示词",
    'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
    'template': REVERSE_IMAGE_PROMPT_PRESET_PROMPT
  }, {
    'icon': '📝',
    'title': "长篇精缩V1",
    'desc': '一键把长篇内容精缩成短篇',
    'template': TEMPLATES["longToShort"]
  }, {
    'icon': '📝',
    'title': '提取人物场景道具信息',
    'desc': "提取文本中的人物、场景、道具信息",
    'template': TEMPLATES["extractInfo"]
  }, {
    'icon': '🧍',
    'title': "格式化短剧提示词",
    'desc': "将小说一键转化为标准AI视频提示词脚本",
    'subItems': [{
      'icon': '📝',
      'title': '影视级叙事分镜脚本',
      'desc': "将小说一键转化为标准戏剧化脚本，专为AI短剧视频量身定制",
      'template': TEMPLATES["Storyboard1"]
    }, {
      'icon': '📝',
      'title': "影视级叙事分镜脚本-秒级",
      'desc': "精确到秒的光影渲染、运镜与音效控制，专为AI短剧视频量身定制",
      'template': TEMPLATES["Storyboard2"]
    }, {
      'icon': '🎬',
      'title': 'Seedance2.0视频格式',
      'desc': "按用户秒数或默认15秒输出 Seedance 2.0 秒级视频提示词",
      'template': TEMPLATES['Seedance2VideoFormat']
    }]
  }],
  'ai-video': [{
    'icon': '🎬',
    'title': "海螺H3",
    'desc': "标准视频生成提示词预设",
    'subItems': [{
      'icon': '📝',
      'title': "标准提示词",
      'desc': '15秒双人悬疑短剧参考生成示例',
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': HAILUO_H3_STANDARD_PROMPT
    }]
  }, {
    'icon': '🎬',
    'title': "海螺H3 视频编辑",
    'desc': "人物替换提示词预设",
    'subItems': [{
      'icon': '🧍',
      'title': "完整人物替换",
      'desc': "完整替换人物外貌与穿搭",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_FULL_CHARACTER_REPLACEMENT_PROMPT
    }, {
      'icon': '🧍',
      'title': '通用人物替换',
      'desc': "通用人物身份与动作继承提示词",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_GENERAL_CHARACTER_REPLACEMENT_PROMPT
    }, {
      'icon': '🖼️',
      'title': "人物+背景替换",
      'desc': "保留参考图人物与场景并迁移动作",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_CHARACTER_AND_BACKGROUND_REPLACEMENT_PROMPT
    }, {
      'icon': '🔄',
      'title': "万能换物提示词",
      'desc': '局部替换指定物体并保持场景',
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_UNIVERSAL_OBJECT_REPLACEMENT_PROMPT
    }, {
      'icon': '🥤',
      'title': "手持物品替换",
      'desc': '替换手中物品并保持自然握持',
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_HANDHELD_ITEM_REPLACEMENT_PROMPT
    }, {
      'icon': '🚙',
      'title': "车辆替换",
      'desc': "替换行驶车辆并保持物理运动",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_VEHICLE_REPLACEMENT_PROMPT
    }, {
      'icon': '👥',
      'title': "多人替换",
      'desc': '同步替换两名指定人物',
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_MULTI_PERSON_REPLACEMENT_PROMPT
    }, {
      'icon': '👕',
      'title': "仅衣服替换",
      'desc': "只替换主要人物服装",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_CLOTHING_ONLY_REPLACEMENT_PROMPT
    }, {
      'icon': '💇',
      'title': "衣服+发型替换",
      'desc': "只替换主要人物服装与发型",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_CLOTHING_AND_HAIRSTYLE_REPLACEMENT_PROMPT
    }, {
      'icon': '👤',
      'title': "双人替换其中一个",
      'desc': "只替换画面左侧指定人物",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': MINIMAX_H3_REPLACE_ONE_OF_TWO_PEOPLE_PROMPT
    }]
  }, {
    'icon': "🎙️",
    'title': "海螺H3 语音驱动",
    'desc': "语音驱动视频提示词预设",
    'subItems': [{
      'icon': '🎬',
      'title': '语音＋提示词生成视频',
      'desc': "使用语音时间轴和提示词生成视频画面",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': HAILUO_H3_AUDIO_PROMPT_VIDEO_PROMPT
    }, {
      'icon': '🖼️',
      'title': "语音＋图像生成对口型视频",
      'desc': "参考图人物按语音精准对口型",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': HAILUO_H3_AUDIO_IMAGE_LIP_SYNC_PROMPT
    }, {
      'icon': "🎞️",
      'title': "语音＋视频生成人物对口型视频",
      'desc': "保持原视频画面并同步指定人物口型",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': HAILUO_H3_AUDIO_VIDEO_LIP_SYNC_PROMPT
    }, {
      'icon': '🔄',
      'title': "语音＋图像＋视频动作迁移",
      'desc': "参考图提供视觉，参考视频提供动作和运镜",
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT,
      'template': HAILUO_H3_AUDIO_IMAGE_VIDEO_MOTION_TRANSFER_PROMPT
    }]
  }],
  'ai-audio': [{
    'icon': '🎧',
    'title': "豆包音频1.0",
    'desc': '影视级对白、配乐、环境声与拟音模板',
    'subItems': applyPromptPresetLeafTriggerMode(DOUBAO_AUDIO_1_0_PROMPT_PRESET_GROUPS, PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT)
  }]
};
let customPresets = {};
let promptPresetSettings = {
  'defaultQuickCaptureNodeType': ''
};
let promptPresetSettingsLoaded = ![];
let promptPresetSettingsLoadPromise = null;
let activePresetManagerOverlay = null;
let closeActivePresetManager = null;
const SUPPORTED_PRESET_NODE_TYPES = new Set(["ai-image", "ai-text", "ai-video", 'ai-audio', "storyboard-script"]);
const PRESET_MANAGER_TABS = [{
  'nodeType': 'ai-text',
  'label': "文本预设",
  'desc': "管理 文本节点 的生成预设",
  'icon': "text"
}, {
  'nodeType': 'ai-image',
  'label': '图像预设',
  'desc': "管理 图像节点 的生成预设",
  'icon': "image"
}, {
  'nodeType': "ai-video",
  'label': "视频预设",
  'desc': "管理 视频节点 的生成预设",
  'icon': 'video'
}, {
  'nodeType': "ai-audio",
  'label': "音频预设",
  'desc': "管理 音频节点 的生成预设",
  'icon': "audio"
}, {
  'nodeType': "storyboard-script",
  'label': "分镜脚本预设",
  'desc': "管理 分镜脚本节点 的生成预设",
  'icon': "text"
}];
const USER_INPUT_PLACEHOLDER = PROMPT_PRESET_USER_INPUT_PLACEHOLDER;
const NODE_TYPE_I18N_KEYS = Object["freeze"]({
  'ai-image': "image",
  'ai-text': "text",
  'ai-video': "video",
  'ai-audio': "audio",
  'storyboard-script': "storyboardScript"
});
const PROMPT_PRESET_TITLE_I18N_KEYS = Object["freeze"]({
  '场景参考': 'sceneReferenceGroup',
  '场景四视图': "sceneFourView",
  '场景九视图': 'sceneNineView',
  '360°无缝全景图': "panorama360",
  '人设参考': "characterReferenceGroup",
  '人物三视图': "characterThreeView",
  '人物三视图+脸部': "characterThreeViewFace",
  '前后视图+脸部': "characterFrontBackViewFace",
  '人设解析图': "characterAnalysis",
  '多宫格': "multiGridGroup",
  '4宫格': "multiGrid4",
  '9宫格': "multiGrid9",
  '16宫格': "multiGrid16",
  '25宫格': "multiGrid25",
  '故事板分镜': "storyboardGroup",
  '竖版故事分镜': "storyboardVertical",
  '竖版故事分镜+场景': 'storyboardVerticalScene',
  '横版故事分镜': 'storyboardHorizontal',
  '横版故事分镜+场景': "storyboardHorizontalScene",
  '电影分镜故事板': 'filmStoryboard',
  '广告故事板': 'advertisingStoryboard',
  '游戏剧情故事板': "gameStoryStoryboard",
  '体育训练故事板': "sportsTrainingStoryboard",
  '动画故事板': "animationStoryboard",
  'MV音乐视频故事板': "musicVideoStoryboard",
  '漫画分镜页': "comicStoryboardPage",
  '社交媒体短视频分镜': "socialShortVideoStoryboard",
  '品牌宣传故事版': "brandPromotionStoryboard",
  '教程类分镜图': "tutorialStoryboard",
  '高清电影制作板': "hdFilmProductionBoard",
  '修仙国漫故事板': "xianxiaGuomanStoryboard",
  [REVERSE_IMAGE_PROMPT_PRESET_TITLE]: "reverseImagePrompt",
  '长篇精缩V1': "longToShort",
  '提取人物场景道具信息': 'extractInfo',
  '格式化短剧提示词': "formatShortDrama",
  '影视级叙事分镜脚本': "storyboardScript",
  '影视级叙事分镜脚本-秒级': 'storyboardScriptTimed',
  'Seedance2.0视频格式': "seedance2VideoFormat",
  '海螺H3': "hailuoH3Group",
  '标准提示词': "hailuoH3StandardPrompt",
  '海螺H3\x20视频编辑': "minimaxH3Group",
  '完整人物替换': 'minimaxH3FullCharacterReplacement',
  '通用人物替换': "minimaxH3GeneralCharacterReplacement",
  '人物+背景替换': 'minimaxH3CharacterAndBackgroundReplacement',
  '万能换物提示词': 'minimaxH3UniversalObjectReplacement',
  '手持物品替换': "minimaxH3HandheldItemReplacement",
  '车辆替换': 'minimaxH3VehicleReplacement',
  '多人替换': "minimaxH3MultiPersonReplacement",
  '仅衣服替换': "minimaxH3ClothingOnlyReplacement",
  '衣服+发型替换': "minimaxH3ClothingAndHairstyleReplacement",
  '双人替换其中一个': "minimaxH3ReplaceOneOfTwoPeople",
  '海螺H3\x20语音驱动': "hailuoH3AudioDrivenGroup",
  '语音＋提示词生成视频': 'hailuoH3AudioPromptVideo',
  '语音＋图像生成对口型视频': "hailuoH3AudioImageLipSync",
  '语音＋视频生成人物对口型视频': "hailuoH3AudioVideoLipSync",
  '语音＋图像＋视频动作迁移': "hailuoH3AudioImageVideoMotionTransfer",
  '豆包音频1.0': "doubaoAudio1Group",
  '文本生成': "doubaoAudio1TextGenerationGroup",
  '参考生成': 'doubaoAudio1ReferenceGenerationGroup',
  '时间控制': 'doubaoAudio1TimingControlGroup',
  '多语种': "doubaoAudio1MultilingualGroup",
  '悬疑刑侦片': "doubaoAudio1CrimeSuspense",
  '宫廷试药': "doubaoAudio1PalaceMedicineTrial",
  '灵山宣战': "doubaoAudio1LingshanDeclaration",
  '古装喜剧片': "doubaoAudio1PeriodComedy",
  '未来科幻片': "doubaoAudio1FutureSciFi",
  '双人播客对谈': "doubaoAudio1TwoHostPodcast",
  '火场追踪': "doubaoAudio1FireSceneInvestigation",
  '悬疑追踪': 'doubaoAudio1SuspenseInvestigation',
  '李米的回忆': 'doubaoAudio1LiMiMemory',
  '带货双人': 'doubaoAudio1LivestreamDuo',
  '警局对峙': 'doubaoAudio1PoliceStationConfrontation',
  '播客聊天': "doubaoAudio1PodcastChat",
  '多角演绎': "doubaoAudio1MultiRolePerformance",
  '控制音效卡点': "doubaoAudio1SoundEffectTiming",
  '控制情绪递进': "doubaoAudio1EmotionProgression",
  '控制叙事转场': "doubaoAudio1NarrativeTransition",
  '控制旁白推进': 'doubaoAudio1NarrationProgression',
  '法语': "doubaoAudio1French",
  '日语': "doubaoAudio1Japanese",
  '韩语': 'doubaoAudio1Korean',
  '英语': 'doubaoAudio1English'
});
function getPresetNodeTypeLabel(_0x5dea97) {
  const _0x2c8ed4 = NODE_TYPE_I18N_KEYS[_0x5dea97];
  return _0x2c8ed4 ? promptPresetsText("nodeTypes." + _0x2c8ed4) : promptPresetsText("nodeTypes.node");
}
function getPresetManagerTabLabel(_0x6eb757) {
  return getPromptPresetCollectionLabel(_0x6eb757?.["nodeType"]) || String(_0x6eb757?.["label"] || '');
}
export function getPromptPresetCollectionLabel(_0x128723) {
  const _0x25d5a7 = NODE_TYPE_I18N_KEYS[_0x128723];
  return _0x25d5a7 ? promptPresetsText("tabs." + _0x25d5a7 + ".label") : '';
}
function getPresetManagerDesc(_0x41eb77) {
  return promptPresetsText('manager.desc', {
    'nodeType': getPresetNodeTypeLabel(_0x41eb77)
  });
}
function getUserInputPillHtml() {
  return "<span class=\"preset-placeholder-pill\" contenteditable=\"false\" data-preset-placeholder=\"user-input\">" + escapePresetTemplateHtml(promptPresetsText("userInputPill")) + "</span>";
}
function getPresetTemplatePlaceholderText() {
  return promptPresetsText("templatePlaceholder");
}
function getCustomPresetFallbackTitle() {
  return promptPresetsText("customPresetFallback");
}
function getLocalizedPresetTitle(_0x502744) {
  const _0x14e7b1 = PROMPT_PRESET_TITLE_I18N_KEYS[_0x502744];
  return _0x14e7b1 ? promptPresetsText("presets." + _0x14e7b1 + ".title") : _0x502744;
}
function getLocalizedPresetDesc(_0x47eaa2, _0x38d4a7) {
  const _0x55c5dd = PROMPT_PRESET_TITLE_I18N_KEYS[_0x47eaa2];
  return _0x55c5dd ? promptPresetsText('presets.' + _0x55c5dd + ".desc") : _0x38d4a7;
}
export function normalizePromptPresetTriggerMode(_0x13fbfc) {
  const _0x397ac5 = String(_0x13fbfc || '')["trim"]();
  return PROMPT_PRESET_TRIGGER_MODES["has"](_0x397ac5) ? _0x397ac5 : PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT;
}
export function shouldInsertPromptForPreset(_0x22f6f2 = {}) {
  return normalizePromptPresetTriggerMode(_0x22f6f2?.["triggerMode"]) === PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT;
}
export function isPromptPresetNodeTypeSupported(_0x296d39) {
  return SUPPORTED_PRESET_NODE_TYPES['has'](String(_0x296d39 || '')["trim"]());
}
function getPromptPresetTriggerModeLabel(_0x586c4d = {}) {
  return shouldInsertPromptForPreset(_0x586c4d) ? promptPresetsText("triggerModes.insertPrompt") : promptPresetsText("triggerModes.direct");
}
export async function loadCustomPresets() {
  try {
    const [_0x7e1e07] = await Promise["all"]([fetchPromptPresetsFromServer(), loadPromptPresetSettings()]);
    customPresets = _0x7e1e07;
  } catch (_0x44e44d) {
    console["warn"]('[promptPresets]\x20No\x20custom\x20presets\x20found\x20or\x20load\x20failed.', _0x44e44d);
  }
}
export function getPromptPresets(_0x5dde64) {
  const _0x123c32 = PROMPT_PRESETS[_0x5dde64] || [];
  const _0x4fa065 = customPresets[_0x5dde64] || [];
  return [...localizePromptPresetItems(_0x123c32), ..._0x4fa065];
}
function normalizePresetNodeType(_0x20436f) {
  const _0x4e47c2 = String(_0x20436f || '')["trim"]();
  return SUPPORTED_PRESET_NODE_TYPES['has'](_0x4e47c2) ? _0x4e47c2 : "ai-image";
}
function normalizePresetManagerNodeType(_0x524bd5) {
  const _0xaf1a5e = String(_0x524bd5 || '')["trim"]();
  return PRESET_MANAGER_TABS["some"](_0x48e0e8 => _0x48e0e8["nodeType"] === _0xaf1a5e) ? _0xaf1a5e : "ai-text";
}
function normalizePromptPresetSettings(_0xfc7195 = {}) {
  const _0x1245f2 = String(_0xfc7195?.["defaultQuickCaptureNodeType"] || '')["trim"]();
  return {
    'defaultQuickCaptureNodeType': PRESET_MANAGER_TABS["some"](_0x1c672f => _0x1c672f["nodeType"] === _0x1245f2) ? _0x1245f2 : ''
  };
}
export async function loadPromptPresetSettings({
  force = ![]
} = {}) {
  if (promptPresetSettingsLoaded && !force) {
    return {
      ...promptPresetSettings
    };
  }
  if (promptPresetSettingsLoadPromise && !force) {
    return promptPresetSettingsLoadPromise;
  }
  const _0x460f8f = (async () => {
    const _0x10ad3e = await fetchPromptPresetSettingsFromServer();
    promptPresetSettings = normalizePromptPresetSettings(_0x10ad3e);
    promptPresetSettingsLoaded = !![];
    return {
      ...promptPresetSettings
    };
  })()["catch"](_0x35aaef => {
    console["warn"]("[promptPresets] Failed to load preset settings.", _0x35aaef);
    promptPresetSettingsLoaded = !![];
    return {
      ...promptPresetSettings
    };
  });
  promptPresetSettingsLoadPromise = _0x460f8f;
  try {
    return await _0x460f8f;
  } finally {
    promptPresetSettingsLoadPromise === _0x460f8f && (promptPresetSettingsLoadPromise = null);
  }
}
export function getDefaultQuickCapturePresetNodeType() {
  return promptPresetSettings["defaultQuickCaptureNodeType"] || '';
}
export async function setDefaultQuickCapturePresetNodeType(_0x3e123b) {
  const _0x1fa489 = String(_0x3e123b || '')["trim"]();
  if (!PRESET_MANAGER_TABS['some'](_0x4ccddb => _0x4ccddb["nodeType"] === _0x1fa489)) {
    throw new Error("Invalid quick capture preset node type");
  }
  await savePromptPresetSettingsToServer({
    'defaultQuickCaptureNodeType': _0x1fa489
  });
  promptPresetSettings = {
    ...promptPresetSettings,
    'defaultQuickCaptureNodeType': _0x1fa489
  };
  promptPresetSettingsLoaded = !![];
  return {
    ...promptPresetSettings
  };
}
export function getCustomPromptPresets(_0x273631) {
  const _0x22637d = normalizePresetNodeType(_0x273631);
  return Array["isArray"](customPresets[_0x22637d]) ? [...customPresets[_0x22637d]] : [];
}
export function getSlashPromptPresetEntries(_0x11dfcd) {
  const _0x3eb5f8 = PROMPT_PRESETS[_0x11dfcd] || [];
  const _0x186efa = getCustomPromptPresets(_0x11dfcd);
  const _0x131cbc = localizePromptPresetItems(_0x3eb5f8);
  if (_0x186efa["length"] === 0x0) {
    return _0x131cbc;
  }
  return [..._0x131cbc, {
    'title': promptPresetsText("customGroupTitle"),
    'desc': promptPresetsText("customGroupDesc"),
    'subItems': _0x186efa
  }];
}
export function __setCustomPromptPresetsForTest(_0x346446 = {}) {
  customPresets = _0x346446 && typeof _0x346446 === 'object' ? {
    ..._0x346446
  } : {};
}
export function __setPromptPresetSettingsForTest(_0x13250a = {}) {
  promptPresetSettings = normalizePromptPresetSettings(_0x13250a);
  promptPresetSettingsLoaded = !![];
  promptPresetSettingsLoadPromise = null;
}
function escapePresetTemplateHtml(_0x343031) {
  return String(_0x343031 ?? '')['replace'](/&/g, '&amp;')["replace"](/</g, "&lt;")['replace'](/>/g, "&gt;")["replace"](/"/g, '&quot;');
}
export function renderPresetTemplateEditorHtml(_0xbbbed3 = '') {
  return String(_0xbbbed3 ?? '')["split"](USER_INPUT_PLACEHOLDER)["map"](_0x43cab9 => escapePresetTemplateHtml(_0x43cab9)["replace"](/\r?\n/g, "<br>"))["join"](getUserInputPillHtml());
}
export function serializePresetTemplateEditorHtml(_0x36862b = '') {
  const _0x224ce2 = "__AIC_USER_INPUT_PLACEHOLDER__";
  const _0x53273a = String(_0x36862b ?? '')["replace"](/<span\b[^>]*\bdata-preset-placeholder=["']user-input["'][^>]*>[\s\S]*?<\/span>/gi, _0x224ce2)['replace'](/<br\b[^>]*\/?>/gi, '\x0a')['replace'](/<\/(div|p)>/gi, '\x0a')['replace'](/<[^>]+>/g, '');
  if (typeof document === 'undefined' || typeof document["createElement"] !== 'function') {
    return _0x53273a["replace"](/&nbsp;/g, '\x20')["replace"](/&lt;/g, '<')["replace"](/&gt;/g, '>')['replace'](/&quot;/g, '\x22')["replace"](/&#39;/g, '\x27')["replace"](/&amp;/g, '&')["replace"](new RegExp(_0x224ce2, 'g'), USER_INPUT_PLACEHOLDER)["replace"](/\n{3,}/g, '\x0a\x0a')["trim"]();
  }
  const _0x14a1ea = document["createElement"]('textarea');
  _0x14a1ea["innerHTML"] = _0x53273a;
  return _0x14a1ea['value']["replace"](new RegExp(_0x224ce2, 'g'), USER_INPUT_PLACEHOLDER)["replace"](/\u00a0/g, '\x20')["replace"](/\n{3,}/g, '\x0a\x0a')["trim"]();
}
function editorHasUserInputPill(_0x454a45) {
  return !!_0x454a45?.["querySelector"]?.("[data-preset-placeholder=\"user-input\"]");
}
function moveCaretAfterNode(_0x4ba048) {
  const _0x128f6b = window["getSelection"]?.();
  if (!_0x128f6b) {
    return;
  }
  const _0x3feeae = document["createRange"]();
  _0x3feeae["setStartAfter"](_0x4ba048);
  _0x3feeae["collapse"](!![]);
  _0x128f6b['removeAllRanges']();
  _0x128f6b["addRange"](_0x3feeae);
}
function insertUserInputPill(_0x138c4b) {
  if (editorHasUserInputPill(_0x138c4b)) {
    showPresetManagerToast(promptPresetsText("editor.duplicateUserInput"), "warn");
    return ![];
  }
  const _0x25a755 = document['createElement']("span");
  _0x25a755['innerHTML'] = getUserInputPillHtml();
  const _0x17fafe = _0x25a755["firstElementChild"];
  const _0x1130dc = document['createTextNode']('\x20');
  const _0x399737 = window["getSelection"]?.();
  const _0x53136e = _0x399737?.['rangeCount'] && _0x138c4b['contains'](_0x399737["getRangeAt"](0x0)['commonAncestorContainer']) ? _0x399737['getRangeAt'](0x0) : null;
  _0x53136e ? (_0x53136e["deleteContents"](), _0x53136e["insertNode"](_0x1130dc), _0x53136e['insertNode'](_0x17fafe)) : (_0x138c4b["appendChild"](_0x17fafe), _0x138c4b['appendChild'](_0x1130dc));
  moveCaretAfterNode(_0x1130dc);
  _0x138c4b["focus"]();
  return !![];
}
function buildPresetModalButton(_0x3d7ff6, _0x35c097) {
  const _0x106246 = document["createElement"]('button');
  _0x106246["type"] = "button";
  _0x106246["className"] = _0x35c097;
  _0x106246["textContent"] = _0x3d7ff6;
  return _0x106246;
}
function buildPresetTriggerModeControl(_0x40c5b8) {
  let _0x490cfd = normalizePromptPresetTriggerMode(_0x40c5b8);
  const _0x46d402 = document['createElement']("div");
  _0x46d402["className"] = "preset-manager-trigger-modes";
  _0x46d402['setAttribute']("role", "group");
  _0x46d402["setAttribute"]("aria-label", promptPresetsText("triggerModes.aria"));
  const _0x34647a = document["createElement"]("span");
  _0x34647a['className'] = "preset-manager-trigger-mode-label";
  _0x34647a["textContent"] = promptPresetsText("triggerModes.label");
  _0x46d402["appendChild"](_0x34647a);
  const _0x5469eb = (_0x9655b8, _0x57b481) => {
    const _0x56e624 = buildPresetModalButton(_0x57b481, "preset-manager-trigger-mode");
    _0x56e624['dataset']["triggerMode"] = _0x9655b8;
    _0x56e624["setAttribute"]('aria-pressed', 'false');
    _0x56e624['addEventListener']("click", () => {
      _0x490cfd = _0x9655b8;
      _0x15acbe();
    });
    _0x46d402["appendChild"](_0x56e624);
    return _0x56e624;
  };
  const _0x476641 = _0x5469eb(PROMPT_PRESET_TRIGGER_MODE_DIRECT, promptPresetsText("triggerModes.direct"));
  const _0xe75bd1 = _0x5469eb(PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT, promptPresetsText('triggerModes.insertPrompt'));
  function _0x15acbe() {
    [_0x476641, _0xe75bd1]['forEach'](_0x154b12 => {
      const _0x262996 = _0x154b12["dataset"]["triggerMode"] === _0x490cfd;
      _0x154b12["classList"]["toggle"]("is-active", _0x262996);
      _0x154b12["setAttribute"]("aria-pressed", _0x262996 ? "true" : "false");
    });
  }
  _0x15acbe();
  return {
    'element': _0x46d402,
    'getValue': () => _0x490cfd
  };
}
function buildPresetManagerIcon(_0x3cab12) {
  const _0x3eefb0 = document['createElement']("span");
  _0x3eefb0["className"] = 'preset-manager-list-icon\x20preset-manager-list-icon--' + _0x3cab12;
  _0x3eefb0["setAttribute"]("aria-hidden", "true");
  return _0x3eefb0;
}
export function getPromptPresetThumbSrc(_0x1ed5fe) {
  const _0xec3d43 = String(_0x1ed5fe?.["thumbnailDataUrl"] || '')["trim"]();
  if (_0xec3d43) {
    return _0xec3d43;
  }
  const _0x11886c = String(_0x1ed5fe?.["thumbUrl"] || _0x1ed5fe?.["thumbnailUrl"] || _0x1ed5fe?.["posterUrl"] || _0x1ed5fe?.["coverUrl"] || '')["trim"]();
  if (_0x11886c) {
    return _0x11886c;
  }
  const _0x26c42c = String(_0x1ed5fe?.['thumbLocalPath'] || _0x1ed5fe?.['thumbnailLocalPath'] || _0x1ed5fe?.["posterLocalPath"] || _0x1ed5fe?.["coverLocalPath"] || '')["trim"]();
  return _0x26c42c ? '/' + _0x26c42c["replace"](/^\/+/, '') : '';
}
function readPresetThumbnailFile(_0x1bcd4a) {
  return new Promise((_0x536750, _0x1014d7) => {
    if (!_0x1bcd4a || !String(_0x1bcd4a["type"] || '')["startsWith"]('image/')) {
      _0x1014d7(new Error(promptPresetsText("thumbnail.chooseImage")));
      return;
    }
    const _0x58acb6 = new FileReader();
    _0x58acb6["onload"] = () => _0x536750(String(_0x58acb6["result"] || ''));
    _0x58acb6["onerror"] = () => _0x1014d7(new Error(promptPresetsText("thumbnail.readFailed")));
    _0x58acb6["readAsDataURL"](_0x1bcd4a);
  });
}
function buildPresetThumbnailControl({
  preset: _0x2e2d4d,
  onUpload: _0x5cf7bd
}) {
  const _0x3a153a = document["createElement"]("label");
  _0x3a153a["className"] = "preset-manager-list-thumb";
  _0x3a153a["title"] = promptPresetsText("thumbnail.upload");
  _0x3a153a["addEventListener"]("click", _0x1c2fee => _0x1c2fee['stopPropagation']());
  const _0x25fb42 = getPromptPresetThumbSrc(_0x2e2d4d);
  if (_0x25fb42) {
    const _0x2c7700 = document['createElement']("img");
    _0x2c7700['className'] = "preset-manager-list-thumb-img";
    _0x2c7700["src"] = _0x25fb42;
    _0x2c7700["alt"] = '';
    _0x3a153a["appendChild"](_0x2c7700);
  } else {
    const _0x299a91 = document["createElement"]("span");
    _0x299a91["className"] = "preset-manager-list-thumb-plus";
    _0x299a91["textContent"] = '+';
    _0x3a153a["appendChild"](_0x299a91);
  }
  const _0x218284 = document["createElement"]("input");
  _0x218284["className"] = "preset-manager-thumb-input";
  _0x218284["type"] = "file";
  _0x218284["accept"] = "image/*";
  _0x218284["addEventListener"]('click', _0x395291 => _0x395291['stopPropagation']());
  _0x218284['addEventListener']("change", async () => {
    const _0x123c8b = _0x218284["files"]?.[0x0];
    if (!_0x123c8b) {
      return;
    }
    try {
      const _0xefb3ba = await readPresetThumbnailFile(_0x123c8b);
      _0x5cf7bd?.(_0xefb3ba);
    } catch (_0x1ee04f) {
      showPresetManagerToast(_0x1ee04f?.["message"] || promptPresetsText("thumbnail.uploadFailed"), "error");
    } finally {
      _0x218284["value"] = '';
    }
  });
  _0x3a153a['appendChild'](_0x218284);
  return _0x3a153a;
}
function buildPresetEditorPlaceholder() {
  const _0x331476 = document["createElement"]('div');
  _0x331476["className"] = "preset-manager-editor-placeholder";
  _0x331476["setAttribute"]("aria-hidden", "true");
  _0x331476['appendChild'](document["createTextNode"](getPresetTemplatePlaceholderText() + '\x20'));
  const _0xb7841 = document["createElement"]("span");
  _0xb7841["innerHTML"] = getUserInputPillHtml();
  _0x331476["appendChild"](_0xb7841["firstElementChild"]);
  return _0x331476;
}
function isPresetTemplateEditorEmpty(_0x46b463) {
  return !serializePresetTemplateEditorHtml(_0x46b463?.['innerHTML'] || '');
}
function syncPresetEditorPlaceholder(_0x2db4b1, _0x59424f) {
  _0x59424f["hidden"] = !isPresetTemplateEditorEmpty(_0x2db4b1);
}
function buildPresetManagerTabIcon(_0x4c7990) {
  const _0x32379c = document['createElementNS']("http://www.w3.org/2000/svg", "svg");
  _0x32379c["setAttribute"]('class', "preset-manager-tab-icon");
  _0x32379c['setAttribute']("width", '16');
  _0x32379c["setAttribute"]('height', '16');
  _0x32379c["setAttribute"]("viewBox", '0\x200\x2024\x2024');
  _0x32379c["setAttribute"]("fill", "none");
  _0x32379c["setAttribute"]('stroke', "currentColor");
  _0x32379c['setAttribute']('stroke-width', '2');
  _0x32379c["setAttribute"]("aria-hidden", "true");
  const _0x253b87 = (_0x311006, _0x3d1f1b) => {
    const _0x552e5b = document['createElementNS']("http://www.w3.org/2000/svg", _0x311006);
    Object['entries'](_0x3d1f1b)["forEach"](([_0x51ae29, _0x17c958]) => _0x552e5b["setAttribute"](_0x51ae29, _0x17c958));
    _0x32379c['appendChild'](_0x552e5b);
  };
  if (_0x4c7990 === "text") {
    _0x253b87('polyline', {
      'points': "4 7 4 4 20 4 20 7"
    });
    _0x253b87("line", {
      'x1': '9',
      'y1': '20',
      'x2': '15',
      'y2': '20'
    });
    _0x253b87("line", {
      'x1': '12',
      'y1': '4',
      'x2': '12',
      'y2': '20'
    });
    return _0x32379c;
  }
  if (_0x4c7990 === "image") {
    _0x253b87("rect", {
      'x': '3',
      'y': '3',
      'width': '18',
      'height': '18',
      'rx': '2'
    });
    _0x253b87("circle", {
      'cx': "8.5",
      'cy': "8.5",
      'r': '1.5'
    });
    _0x253b87("polyline", {
      'points': "21 15 16 10 5 21"
    });
    return _0x32379c;
  }
  if (_0x4c7990 === "video") {
    _0x253b87("polygon", {
      'points': '23\x207\x2016\x2012\x2023\x2017\x2023\x207'
    });
    _0x253b87("rect", {
      'x': '1',
      'y': '5',
      'width': '15',
      'height': '14',
      'rx': '2'
    });
    return _0x32379c;
  }
  if (_0x4c7990 === 'audio') {
    _0x253b87("path", {
      'd': "M9 18V5l12-2v13"
    });
    _0x253b87("circle", {
      'cx': '6',
      'cy': '18',
      'r': '3'
    });
    _0x253b87("circle", {
      'cx': '18',
      'cy': '16',
      'r': '3'
    });
    return _0x32379c;
  }
  return _0x32379c;
}
function getUniqueDraftTitle(_0x4c07a4) {
  const _0x24835f = new Set((_0x4c07a4 || [])["map"](_0x2275d0 => String(_0x2275d0?.['title'] || '')['trim']()));
  let _0x5cd689 = 0x1;
  let _0x3e643d = getCustomPresetFallbackTitle();
  while (_0x24835f["has"](_0x3e643d)) {
    _0x5cd689 += 0x1;
    _0x3e643d = promptPresetsText("customPresetFallbackWithIndex", {
      'index': _0x5cd689
    });
  }
  return _0x3e643d;
}
function showPresetManagerToast(_0x30c76b, _0x8e9638 = "info") {
  window["showToast"]?.(_0x30c76b, _0x8e9638);
}
function showPresetButtonPending(_0x447fb5, _0x5c9162) {
  _0x447fb5["disabled"] = !![];
  _0x447fb5["setAttribute"]('aria-busy', "true");
  _0x447fb5["textContent"] = _0x5c9162;
  const _0xe1b66e = document["createElement"]("span");
  _0xe1b66e["className"] = 'project-package-loading-spinner\x20preset-manager-action-spinner';
  _0xe1b66e["setAttribute"]("aria-hidden", 'true');
  _0x447fb5["appendChild"](_0xe1b66e);
}
function createPresetEditor({
  nodeType: _0x39b513,
  preset = null,
  isDraft = ![],
  onSaved: _0x23fd90
}) {
  const _0x273ae2 = document["createElement"]("div");
  _0x273ae2["className"] = 'preset-manager-detail';
  let _0x22f0f6 = isDraft ? '' : String(preset?.["title"] || '')["trim"]();
  const _0x39f156 = String(preset?.['title'] || '')["trim"]();
  const _0x3675b5 = document["createElement"]("label");
  _0x3675b5['className'] = "preset-manager-field";
  const _0x351a04 = document["createElement"]('span');
  _0x351a04['className'] = 'preset-manager-label';
  _0x351a04["textContent"] = promptPresetsText('editor.name');
  const _0x53bb3a = document["createElement"]("input");
  _0x53bb3a['className'] = "preset-manager-input";
  _0x53bb3a['type'] = "text";
  _0x53bb3a["placeholder"] = promptPresetsText("editor.namePlaceholder");
  _0x53bb3a["value"] = _0x39f156;
  _0x3675b5["appendChild"](_0x351a04);
  _0x3675b5["appendChild"](_0x53bb3a);
  const _0x433923 = document["createElement"]('label');
  _0x433923["className"] = "preset-manager-field";
  const _0x248c4e = document["createElement"]("span");
  _0x248c4e["className"] = "preset-manager-label";
  _0x248c4e["textContent"] = promptPresetsText("editor.desc");
  const _0x4e11eb = document["createElement"]('input');
  _0x4e11eb["className"] = "preset-manager-input";
  _0x4e11eb["type"] = 'text';
  _0x4e11eb["placeholder"] = promptPresetsText("editor.descPlaceholder");
  _0x4e11eb["value"] = String(preset?.["desc"] || '')["trim"]();
  _0x433923['appendChild'](_0x248c4e);
  _0x433923["appendChild"](_0x4e11eb);
  const _0x256595 = document['createElement']("div");
  _0x256595["className"] = "preset-manager-template-tools";
  const _0x3302f0 = document["createElement"]("span");
  _0x3302f0["className"] = "preset-manager-label";
  _0x3302f0["textContent"] = promptPresetsText("editor.template");
  const _0x39651d = buildPresetModalButton(promptPresetsText("editor.insertPrompt"), "preset-modal-btn-secondary preset-manager-insert-btn");
  _0x256595["appendChild"](_0x3302f0);
  _0x256595["appendChild"](_0x39651d);
  const _0x140c8f = document['createElement']("div");
  _0x140c8f["className"] = "preset-manager-editor-wrap";
  const _0x527dc3 = document["createElement"]("div");
  _0x527dc3["className"] = 'preset-manager-textarea\x20preset-manager-editor';
  _0x527dc3["contentEditable"] = "true";
  _0x527dc3['spellcheck'] = ![];
  _0x527dc3['innerHTML'] = renderPresetTemplateEditorHtml(preset?.['template'] || '');
  _0x39651d["addEventListener"]("click", () => insertUserInputPill(_0x527dc3));
  const _0x1f3949 = buildPresetEditorPlaceholder();
  _0x527dc3['addEventListener']("input", () => syncPresetEditorPlaceholder(_0x527dc3, _0x1f3949));
  _0x527dc3['addEventListener']("blur", () => syncPresetEditorPlaceholder(_0x527dc3, _0x1f3949));
  _0x140c8f["addEventListener"]("click", () => {
    _0x527dc3['focus']();
  });
  _0x140c8f["appendChild"](_0x527dc3);
  _0x140c8f["appendChild"](_0x1f3949);
  syncPresetEditorPlaceholder(_0x527dc3, _0x1f3949);
  const _0x1d3c9a = buildPresetTriggerModeControl(preset?.['triggerMode']);
  const _0xb0fc0f = buildPresetModalButton(promptPresetsText('editor.save'), 'preset-modal-btn-primary');
  _0xb0fc0f["addEventListener"]('click', async () => {
    if (_0xb0fc0f["disabled"]) {
      return;
    }
    const _0x5d40b3 = _0x53bb3a["value"]["trim"]();
    const _0x354aca = serializePresetTemplateEditorHtml(_0x527dc3["innerHTML"]);
    if (!_0x5d40b3) {
      showPresetManagerToast(promptPresetsText("editor.titleRequired"), "warn");
      _0x53bb3a["focus"]();
      return;
    }
    if (!_0x354aca) {
      showPresetManagerToast(promptPresetsText("editor.templateRequired"), "warn");
      _0x527dc3["focus"]();
      return;
    }
    showPresetButtonPending(_0xb0fc0f, promptPresetsText("editor.saving"));
    try {
      await savePromptPresetToServer({
        'nodeType': _0x39b513,
        'title': _0x5d40b3,
        'desc': _0x4e11eb["value"]["trim"](),
        'template': _0x354aca,
        'triggerMode': _0x1d3c9a['getValue'](),
        'thumbnailDataUrl': String(preset?.['thumbnailDataUrl'] || '')['trim'](),
        'thumbLocalPath': String(preset?.['thumbLocalPath'] || '')["trim"](),
        'originalTitle': _0x22f0f6,
        'installId': String(window["__aicInstallId"] || globalThis["__aicInstallId"] || '')['trim']()
      });
      await loadCustomPresets();
      _0x22f0f6 = _0x5d40b3;
      showPresetManagerToast(promptPresetsText("editor.saved"), "success");
      _0x23fd90?.({
        'title': _0x5d40b3
      });
    } catch (_0x31b272) {
      showPresetManagerToast(_0x31b272?.['message'] || promptPresetsText('editor.saveFailed'), "error");
    } finally {
      _0xb0fc0f["disabled"] = ![];
      _0xb0fc0f["removeAttribute"]("aria-busy");
      _0xb0fc0f["textContent"] = promptPresetsText("editor.save");
    }
  });
  _0x273ae2['appendChild'](_0x3675b5);
  _0x273ae2["appendChild"](_0x433923);
  _0x273ae2["appendChild"](_0x256595);
  _0x273ae2["appendChild"](_0x140c8f);
  return {
    'element': _0x273ae2,
    'triggerModeControl': _0x1d3c9a["element"],
    'saveButton': _0xb0fc0f,
    'updatePreset': _0x3d02e0 => {
      preset = _0x3d02e0;
    }
  };
}
export function openCustomPresetsManager({
  nodeType: _0x385b1b,
  sourceNodeId = '',
  initialDraftTemplate = ''
} = {}) {
  const _0x34e963 = String(initialDraftTemplate || '')["trim"]();
  let _0x1849ad = normalizePresetManagerNodeType(_0x385b1b || getDefaultQuickCapturePresetNodeType());
  const _0x37572a = String(sourceNodeId || '')['trim']();
  closeActivePresetManager?.();
  const _0x11e467 = document["createElement"]("div");
  _0x11e467['className'] = "preset-modal-overlay";
  let _0x5f5954 = null;
  let _0x442aaa = null;
  let _0x2c111d = ![];
  const _0x30aa1a = () => {
    _0x2c111d = !![];
    _0x442aaa?.["disconnect"]();
    _0x11e467['remove']();
    _0x5f5954?.();
    activePresetManagerOverlay === _0x11e467 && (activePresetManagerOverlay = null, closeActivePresetManager = null);
  };
  const _0xff9789 = document["createElement"]('div');
  _0xff9789["className"] = "preset-modal preset-modal--manager";
  _0xff9789["addEventListener"]("click", _0x342738 => _0x342738["stopPropagation"]());
  const _0x204f4e = document["createElement"]("div");
  _0x204f4e["className"] = 'preset-manager-title-row';
  const _0x26d8bd = document["createElement"]("div");
  _0x26d8bd['className'] = "preset-manager-title-group";
  const _0x1df866 = document['createElement']("div");
  _0x1df866['textContent'] = promptPresetsText("manager.title");
  _0x1df866["className"] = "preset-modal-title";
  const _0x9380c5 = document["createElement"]("div");
  _0x9380c5["className"] = "preset-modal-desc";
  _0x9380c5["textContent"] = getPresetManagerDesc(_0x1849ad);
  _0x26d8bd["appendChild"](_0x1df866);
  _0x26d8bd["appendChild"](_0x9380c5);
  const _0x142fa9 = buildPresetModalButton('×', "preset-manager-close-btn");
  _0x142fa9["setAttribute"]("aria-label", promptPresetsText("manager.close"));
  _0x142fa9["addEventListener"]("click", _0x30aa1a);
  _0x204f4e["appendChild"](_0x26d8bd);
  _0x204f4e["appendChild"](_0x142fa9);
  const _0x2b6bc6 = document["createElement"]("div");
  _0x2b6bc6["className"] = "preset-manager-tabs";
  _0x2b6bc6["setAttribute"]("role", "tablist");
  const _0x11901a = new Map();
  let _0x2f02f1 = ![];
  PRESET_MANAGER_TABS['forEach'](_0x4e7c50 => {
    const _0x418b1c = buildPresetModalButton('', 'preset-manager-tab');
    _0x418b1c["setAttribute"]("role", 'tab');
    _0x418b1c['dataset']["nodeType"] = _0x4e7c50["nodeType"];
    _0x418b1c["appendChild"](buildPresetManagerTabIcon(_0x4e7c50["icon"]));
    const _0x1df5f4 = document["createElement"]("span");
    _0x1df5f4["textContent"] = getPresetManagerTabLabel(_0x4e7c50);
    _0x418b1c['appendChild'](_0x1df5f4);
    const _0x214e12 = document["createElement"]("span");
    _0x214e12["className"] = "preset-manager-tab-star";
    _0x214e12["textContent"] = '★';
    _0x214e12["setAttribute"]('aria-hidden', "true");
    _0x418b1c['appendChild'](_0x214e12);
    _0x418b1c["addEventListener"]("click", () => {
      if (_0x1849ad === _0x4e7c50["nodeType"]) {
        return;
      }
      _0x1849ad = _0x4e7c50["nodeType"];
      _0x14d94a();
    });
    _0x418b1c["addEventListener"]("contextmenu", async _0x3b7b59 => {
      _0x3b7b59['preventDefault']();
      _0x3b7b59["stopPropagation"]();
      if (_0x2f02f1) {
        return;
      }
      const _0x8c3cd = getDefaultQuickCapturePresetNodeType();
      if (_0x8c3cd === _0x4e7c50["nodeType"]) {
        return;
      }
      _0x2f02f1 = !![];
      promptPresetSettings = {
        ...promptPresetSettings,
        'defaultQuickCaptureNodeType': _0x4e7c50['nodeType']
      };
      _0x14d94a();
      try {
        await setDefaultQuickCapturePresetNodeType(_0x4e7c50['nodeType']);
        showPresetManagerToast(promptPresetsText("manager.quickCaptureDefaultSet", {
          'preset': getPresetManagerTabLabel(_0x4e7c50)
        }), 'success');
      } catch (_0x46fd67) {
        promptPresetSettings = {
          ...promptPresetSettings,
          'defaultQuickCaptureNodeType': _0x8c3cd
        };
        _0x14d94a();
        showPresetManagerToast(_0x46fd67?.["message"] || promptPresetsText("manager.quickCaptureDefaultFailed"), 'error');
      } finally {
        _0x2f02f1 = ![];
      }
    });
    _0x11901a["set"](_0x4e7c50["nodeType"], {
      'button': _0x418b1c,
      'star': _0x214e12
    });
    _0x2b6bc6["appendChild"](_0x418b1c);
  });
  const _0x5be4e9 = document["createElement"]('div');
  _0x5be4e9["className"] = "preset-manager-shell";
  const _0x1ccedc = document["createElement"]("div");
  _0x1ccedc["className"] = "preset-manager-sidebar";
  const _0xf76c6d = buildPresetModalButton(promptPresetsText("manager.new"), "preset-manager-new-btn");
  const _0x3389ed = document["createElement"]("div");
  _0x3389ed["className"] = "preset-manager-list";
  _0x1ccedc["appendChild"](_0xf76c6d);
  _0x1ccedc["appendChild"](_0x3389ed);
  const _0x1f8ba7 = document["createElement"]("div");
  _0x1f8ba7["className"] = "preset-manager-detail-pane";
  _0x5be4e9["appendChild"](_0x1ccedc);
  _0x5be4e9["appendChild"](_0x1f8ba7);
  const _0x2811ba = document["createElement"]('div');
  _0x2811ba["className"] = 'preset-modal-actions';
  const _0x927fc3 = new Map(PRESET_MANAGER_TABS["map"](_0x238245 => [_0x238245['nodeType'], {
    'selectedKey': '',
    'draftPreset': null,
    'draftCounter': 0x0,
    'editors': new Map(),
    'rows': new Map(),
    'deletingKeys': new Set(),
    'scrollTop': 0x0
  }]));
  if (_0x34e963) {
    const _0x321ffc = _0x927fc3['get'](_0x1849ad);
    _0x321ffc["draftCounter"] = 0x1;
    _0x321ffc["draftPreset"] = {
      'id': _0x321ffc["draftCounter"],
      'title': getUniqueDraftTitle(getCustomPromptPresets(_0x1849ad)),
      'desc': '',
      'template': _0x34e963,
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT
    };
    _0x321ffc['selectedKey'] = "draft:" + _0x321ffc["draftPreset"]['id'];
  }
  const _0x6cc22d = _0x482965 => _0x927fc3["get"](_0x482965) || {
    'selectedKey': '',
    'draftPreset': null,
    'draftCounter': 0x0
  };
  const _0x45b7aa = _0xadafdc => "saved:" + String(_0xadafdc?.["title"] || '');
  const _0x4519f3 = _0x49398f => _0x49398f ? "draft:" + _0x49398f['id'] : '';
  let _0x3997ee = null;
  let _0x862eed = null;
  const _0x14d94a = () => {
    if (_0x2c111d) {
      return;
    }
    if (_0x3997ee) {
      _0x3997ee["scrollTop"] = _0x3389ed["scrollTop"];
    }
    _0x9380c5["textContent"] = getPresetManagerDesc(_0x1849ad);
    _0x11901a["forEach"](({
      button: _0x2cb0d7,
      star: _0x58c39f
    }, _0x598d9e) => {
      const _0x26c12a = _0x598d9e === _0x1849ad;
      const _0x6aeee7 = _0x598d9e === getDefaultQuickCapturePresetNodeType();
      const _0x2354ee = PRESET_MANAGER_TABS["find"](_0x1b66ea => _0x1b66ea["nodeType"] === _0x598d9e);
      const _0x3c3fa6 = _0x6aeee7 ? promptPresetsText("manager.quickCaptureDefaultAria", {
        'preset': getPresetManagerTabLabel(_0x2354ee)
      }) : promptPresetsText("manager.quickCaptureSetAria", {
        'preset': getPresetManagerTabLabel(_0x2354ee)
      });
      _0x2cb0d7['classList']["toggle"]("is-active", _0x26c12a);
      _0x2cb0d7["classList"]["toggle"]("is-quick-capture-default", _0x6aeee7);
      _0x2cb0d7['setAttribute']("aria-selected", _0x26c12a ? "true" : 'false');
      _0x2cb0d7['setAttribute']("aria-label", _0x3c3fa6);
      _0x2cb0d7["title"] = _0x3c3fa6;
      _0x58c39f['hidden'] = !_0x6aeee7;
    });
    const _0x256239 = _0x6cc22d(_0x1849ad);
    _0x3997ee = _0x256239;
    const _0x98b174 = getCustomPromptPresets(_0x1849ad);
    const _0x64a4dd = [];
    _0x256239['draftPreset'] && _0x64a4dd["push"]({
      'key': _0x4519f3(_0x256239['draftPreset']),
      'preset': _0x256239["draftPreset"],
      'isDraft': !![]
    });
    _0x98b174['forEach'](_0x328d8b => {
      _0x64a4dd["push"]({
        'key': _0x45b7aa(_0x328d8b),
        'preset': _0x328d8b,
        'isDraft': ![]
      });
    });
    !_0x256239["selectedKey"] && _0x64a4dd["length"] > 0x0 && (_0x256239["selectedKey"] = _0x64a4dd[0x0]["key"]);
    _0x256239['selectedKey'] && _0x64a4dd['length'] > 0x0 && !_0x64a4dd["some"](_0x584611 => _0x584611["key"] === _0x256239["selectedKey"]) && (_0x256239["selectedKey"] = _0x64a4dd[0x0]["key"]);
    const _0x11b3d4 = [];
    const _0x3d46e0 = new Set(_0x64a4dd['map'](({
      key: _0xb24207
    }) => _0xb24207));
    for (const _0x551abc of _0x256239["rows"]["keys"]()) {
      if (!_0x3d46e0['has'](_0x551abc)) {
        _0x256239['rows']["delete"](_0x551abc);
      }
    }
    if (_0x64a4dd['length'] === 0x0) {
      const _0x4989d7 = document["createElement"]("div");
      _0x4989d7["className"] = 'preset-manager-empty';
      _0x4989d7["textContent"] = promptPresetsText("manager.emptyList");
      _0x11b3d4['push'](_0x4989d7);
    }
    _0x64a4dd['forEach'](({
      key: _0x151835,
      preset: _0x127a8b,
      isDraft: _0x271fc7
    }) => {
      const _0x35b14a = JSON["stringify"]([_0x127a8b, _0x271fc7, _0x256239['deletingKeys']["has"](_0x151835)]);
      const _0x325934 = _0x256239["rows"]["get"](_0x151835);
      if (_0x325934?.['signature'] === _0x35b14a) {
        _0x325934["updatePreset"](_0x127a8b);
        _0x325934["element"]['classList']["toggle"]("is-active", _0x151835 === _0x256239["selectedKey"]);
        _0x11b3d4["push"](_0x325934['element']);
        return;
      }
      const _0x4379ab = _0x1849ad;
      const _0x3bd823 = document["createElement"]('div');
      _0x3bd823['setAttribute']("role", "button");
      _0x3bd823["tabIndex"] = 0x0;
      _0x3bd823['className'] = "preset-manager-list-item";
      _0x3bd823["classList"]['toggle']("is-active", _0x151835 === _0x256239["selectedKey"]);
      _0x3bd823["classList"]["toggle"]("has-trigger-badge", !_0x271fc7);
      _0x3bd823["appendChild"](buildPresetThumbnailControl({
        'preset': _0x127a8b,
        'onUpload': _0x88c680 => {
          _0x127a8b["thumbnailDataUrl"] = _0x88c680;
          _0x127a8b["thumbLocalPath"] = '';
          _0x127a8b["thumbUrl"] = '';
          _0x256239["selectedKey"] = _0x151835;
          showPresetManagerToast(promptPresetsText("thumbnail.updated"), 'success');
          _0x14d94a();
        }
      }));
      const _0x11c2b3 = document["createElement"]("span");
      _0x11c2b3["className"] = "preset-manager-list-text";
      const _0x1c5aaa = document["createElement"]("span");
      _0x1c5aaa["className"] = "preset-manager-list-title";
      _0x1c5aaa["textContent"] = _0x127a8b?.['title'] || getCustomPresetFallbackTitle();
      const _0x523de1 = document['createElement']("span");
      _0x523de1['className'] = "preset-manager-list-desc";
      _0x523de1["textContent"] = _0x127a8b?.["desc"] || _0x127a8b?.["template"] || promptPresetsText("presetDescFallback");
      _0x11c2b3['appendChild'](_0x1c5aaa);
      _0x11c2b3['appendChild'](_0x523de1);
      _0x3bd823["appendChild"](_0x11c2b3);
      if (!_0x271fc7) {
        const _0x2c4c29 = document["createElement"]("span");
        _0x2c4c29["className"] = "preset-manager-list-trigger-badge";
        _0x2c4c29["textContent"] = getPromptPresetTriggerModeLabel(_0x127a8b);
        _0x3bd823["appendChild"](_0x2c4c29);
      }
      _0x3bd823["addEventListener"]("click", () => {
        if (_0x256239["selectedKey"] === _0x151835) {
          return;
        }
        _0x256239["selectedKey"] = _0x151835;
        _0x14d94a();
      });
      _0x3bd823["addEventListener"]("keydown", _0x28b3cd => {
        if (_0x28b3cd["target"] !== _0x3bd823) {
          return;
        }
        if (_0x28b3cd["key"] !== "Enter" && _0x28b3cd["key"] !== '\x20') {
          return;
        }
        _0x28b3cd['preventDefault']();
        _0x256239["selectedKey"] = _0x151835;
        _0x14d94a();
      });
      const _0x36ef17 = buildPresetModalButton('×', 'preset-manager-list-delete');
      _0x36ef17["setAttribute"]("aria-label", promptPresetsText("manager.deleteAria", {
        'title': _0x127a8b?.["title"] || getCustomPresetFallbackTitle()
      }));
      if (_0x256239["deletingKeys"]["has"](_0x151835)) {
        showPresetButtonPending(_0x36ef17, '');
      }
      _0x36ef17["addEventListener"]("click", async _0xd09303 => {
        _0xd09303["preventDefault"]();
        _0xd09303["stopPropagation"]();
        if (_0x256239["deletingKeys"]["has"](_0x151835)) {
          return;
        }
        if (_0x271fc7) {
          _0x256239["editors"]['delete'](_0x151835);
          _0x256239["draftPreset"] = null;
          _0x256239["selectedKey"] === _0x151835 && (_0x256239["selectedKey"] = '');
          _0x14d94a();
          return;
        }
        _0x256239["deletingKeys"]["add"](_0x151835);
        _0x256239["rows"]["delete"](_0x151835);
        showPresetButtonPending(_0x36ef17, '');
        try {
          await deletePromptPresetFromServer({
            'nodeType': _0x4379ab,
            'title': String(_0x127a8b?.["title"] || '')
          });
          await loadCustomPresets();
          _0x256239["editors"]["delete"](_0x151835);
          showPresetManagerToast(promptPresetsText("delete.deleted"), "success");
          _0x256239["selectedKey"] === _0x151835 && (_0x256239["selectedKey"] = '');
        } catch (_0x46034a) {
          showPresetManagerToast(_0x46034a?.["message"] || promptPresetsText('delete.failed'), "error");
        } finally {
          _0x256239['deletingKeys']["delete"](_0x151835);
          _0x14d94a();
        }
      });
      _0x3bd823["appendChild"](_0x36ef17);
      _0x256239["rows"]["set"](_0x151835, {
        'signature': _0x35b14a,
        'element': _0x3bd823,
        'updatePreset': _0x55e96c => {
          _0x127a8b = _0x55e96c;
        }
      });
      _0x11b3d4['push'](_0x3bd823);
    });
    const _0x27e75a = new Set(_0x11b3d4);
    for (const _0x1108f5 of Array['from'](_0x3389ed["childNodes"])) {
      if (!_0x27e75a['has'](_0x1108f5)) {
        _0x1108f5['remove']();
      }
    }
    let _0xd1f140 = _0x3389ed['firstChild'];
    for (const _0x5598ff of _0x11b3d4) {
      if (_0x5598ff !== _0xd1f140) {
        _0x3389ed["insertBefore"](_0x5598ff, _0xd1f140);
      }
      _0xd1f140 = _0x5598ff["nextSibling"];
    }
    const _0x2bf2d0 = _0x64a4dd['find'](_0x5bb367 => _0x5bb367["key"] === _0x256239["selectedKey"]);
    if (_0x2bf2d0) {
      let _0x4eaf02 = _0x256239['editors']['get'](_0x2bf2d0["key"]);
      if (!_0x4eaf02) {
        let _0xfb7faa = _0x2bf2d0["key"];
        _0x4eaf02 = createPresetEditor({
          'nodeType': _0x1849ad,
          'preset': _0x2bf2d0["preset"],
          'isDraft': _0x2bf2d0["isDraft"],
          'onSaved': ({
            title: _0x55a8cb
          } = {}) => {
            _0x2bf2d0["isDraft"] && _0x256239["draftPreset"] === _0x2bf2d0["preset"] && (_0x256239["draftPreset"] = null);
            const _0x58a117 = "saved:" + String(_0x55a8cb || '')['trim']();
            _0x256239['editors']["delete"](_0xfb7faa);
            _0x256239["editors"]['set'](_0x58a117, _0x4eaf02);
            if (_0x256239['selectedKey'] === _0xfb7faa) {
              _0x256239["selectedKey"] = _0x58a117;
            }
            _0xfb7faa = _0x58a117;
            _0x14d94a();
          }
        });
        _0x256239['editors']["set"](_0x2bf2d0["key"], _0x4eaf02);
      }
      _0x4eaf02['updatePreset'](_0x2bf2d0["preset"]);
      _0x862eed !== _0x4eaf02 && (_0x1f8ba7["replaceChildren"](_0x4eaf02['element']), _0x2811ba["replaceChildren"](_0x4eaf02['triggerModeControl'], _0x4eaf02["saveButton"]), _0x862eed = _0x4eaf02);
    } else {
      const _0x1ce968 = document["createElement"]("div");
      _0x1ce968['className'] = 'preset-manager-detail-empty';
      _0x1ce968["textContent"] = promptPresetsText('manager.emptyDetail');
      _0x1f8ba7['replaceChildren'](_0x1ce968);
      _0x2811ba["replaceChildren"]();
      _0x862eed = null;
    }
    _0x3389ed["scrollTop"] = _0x256239["scrollTop"];
  };
  const _0x103a8c = _0x1350bd => {
    if (!_0x37572a) {
      return null;
    }
    const _0x42ae69 = a1310_0x4a7848["getStateRaw"]()["nodes"]?.[_0x37572a];
    if (!_0x42ae69 || typeof _0x42ae69 !== "object") {
      return null;
    }
    return String(_0x42ae69["type"] || '') === _0x1350bd ? _0x42ae69 : null;
  };
  const _0x18ac91 = async ({
    nodeType: _0xb1ad41,
    draftPreset: _0x37c41e
  }) => {
    const _0x15225e = _0x103a8c(_0xb1ad41);
    if (!_0x15225e) {
      return;
    }
    const _0x3e640d = await resolvePresetDefaultCoverDataUrl(_0x15225e);
    if (!_0x3e640d) {
      return;
    }
    const _0xaaa69d = _0x6cc22d(_0xb1ad41);
    if (_0xaaa69d['draftPreset'] !== _0x37c41e) {
      return;
    }
    if (String(_0x37c41e['thumbnailDataUrl'] || '')['trim']() || String(_0x37c41e["thumbLocalPath"] || '')["trim"]() || String(_0x37c41e["thumbUrl"] || '')['trim']()) {
      return;
    }
    _0x37c41e['thumbnailDataUrl'] = _0x3e640d;
    _0x37c41e['thumbLocalPath'] = '';
    _0x37c41e["thumbUrl"] = '';
    _0x14d94a();
  };
  _0xf76c6d["addEventListener"]('click', () => {
    const _0x24e8c6 = _0x6cc22d(_0x1849ad);
    if (_0x24e8c6["draftPreset"]) {
      _0x24e8c6['selectedKey'] = _0x4519f3(_0x24e8c6["draftPreset"]);
      _0x14d94a();
      return;
    }
    _0x24e8c6['draftCounter'] += 0x1;
    const _0x5aa6b9 = _0x1849ad;
    _0x24e8c6["draftPreset"] = {
      'id': _0x24e8c6['draftCounter'],
      'title': getUniqueDraftTitle(getCustomPromptPresets(_0x5aa6b9)),
      'desc': '',
      'template': '',
      'triggerMode': PROMPT_PRESET_TRIGGER_MODE_INSERT_PROMPT
    };
    _0x24e8c6["selectedKey"] = "draft:" + _0x24e8c6["draftPreset"]['id'];
    _0x14d94a();
    void _0x18ac91({
      'nodeType': _0x5aa6b9,
      'draftPreset': _0x24e8c6['draftPreset']
    });
  });
  _0xff9789["appendChild"](_0x204f4e);
  _0xff9789['appendChild'](_0x2b6bc6);
  _0xff9789["appendChild"](_0x5be4e9);
  _0xff9789["appendChild"](_0x2811ba);
  _0x11e467["appendChild"](_0xff9789);
  _0x14d94a();
  _0x11e467['addEventListener']("mousedown", _0x435224 => {
    _0x435224['target'] === _0x11e467 && _0x30aa1a();
  });
  document["body"]['appendChild'](_0x11e467);
  activePresetManagerOverlay = _0x11e467;
  closeActivePresetManager = _0x30aa1a;
  _0x5f5954 = beginModalInteraction({
    'root': _0x11e467,
    'onClose': _0x30aa1a
  });
  typeof MutationObserver === "function" && (_0x442aaa = new MutationObserver(() => {
    if (!_0x11e467["isConnected"]) {
      _0x30aa1a();
    }
  }), _0x442aaa["observe"](document["body"], {
    'childList': !![]
  }));
  return _0x11e467;
}
export async function openQuickCapturePromptPresetDraft(_0x3f2f4c) {
  await loadPromptPresetSettings();
  const _0x53c164 = getDefaultQuickCapturePresetNodeType();
  const _0x1460ec = _0x53c164 || "ai-text";
  const _0x5ed588 = openCustomPresetsManager({
    'nodeType': _0x1460ec,
    'initialDraftTemplate': _0x3f2f4c
  });
  return {
    'overlay': _0x5ed588,
    'nodeType': _0x1460ec,
    'hasConfiguredDefault': Boolean(_0x53c164)
  };
}