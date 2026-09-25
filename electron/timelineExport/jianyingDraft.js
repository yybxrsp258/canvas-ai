import { randomUUID } from 'node:crypto';
import a294_0x4d6e62 from 'node:path';
import { timelineMicroseconds as a294_0x586c1d } from './timelinePlan.js';
const json = _0x54fa60 => JSON['stringify'](_0x54fa60, null, 0x2) + '\x0a';
const emptyLists = _0xf73274 => Object["fromEntries"](_0xf73274['split']('\x20')['map'](_0x3e6823 => [_0x3e6823, []]));
export function buildJianyingDraft(_0x2b900d, _0x2b4d93, _0x249bb1, {
  uuid = randomUUID,
  now = Date["now"]()
} = {}) {
  const _0xaff33a = uuid();
  const _0x379202 = emptyLists("ai_translates audio_balances audio_effects audio_fades audio_track_indexes audios beats canvases chromas color_curves digital_humans drafts effects flowers green_screens handwrites hsl images log_color_wheels loudnesses manual_deformations masks material_animations material_colors multi_language_refs placeholders plugin_effects primary_color_wheels realtime_denoises shapes smart_crops smart_relights sound_channel_mappings speeds stickers tail_leaders text_templates texts time_marks transitions video_effects video_trackings videos vocal_beautifys vocal_separations");
  const _0x4c3e26 = new Map();
  for (const _0x34cf24 of _0x2b900d["media"]) {
    const _0x1504dd = uuid();
    const _0x6c2a28 = uuid();
    _0x4c3e26["set"](_0x34cf24['id'], {
      'video': _0x1504dd,
      'audio': _0x6c2a28
    });
    const _0x3d653c = _0x2b4d93["get"](_0x34cf24['id'])['replace'](/\\/g, '/');
    _0x379202["videos"]['push']({
      'id': _0x1504dd,
      'material_id': _0x1504dd,
      'local_material_id': _0x1504dd,
      'material_name': _0x34cf24["name"],
      'type': "video",
      'path': _0x3d653c,
      'media_path': '',
      'duration': a294_0x586c1d(_0x34cf24["durationSec"]),
      'width': _0x34cf24['width'],
      'height': _0x34cf24["height"],
      'category_id': '',
      'category_name': "local",
      'check_flag': 0xf7ff,
      'audio_fade': null,
      'crop_ratio': "free",
      'crop_scale': 0x1,
      'crop': {
        'upper_left_x': 0x0,
        'upper_left_y': 0x0,
        'upper_right_x': 0x1,
        'upper_right_y': 0x0,
        'lower_left_x': 0x0,
        'lower_left_y': 0x1,
        'lower_right_x': 0x1,
        'lower_right_y': 0x1
      }
    });
    if (_0x34cf24["hasAudio"]) {
      _0x379202['audios']["push"]({
        'id': _0x6c2a28,
        'local_material_id': _0x6c2a28,
        'music_id': _0x6c2a28,
        'name': _0x34cf24["name"],
        'type': 'extract_music',
        'path': _0x3d653c,
        'duration': a294_0x586c1d(_0x34cf24["audioDurationSec"]),
        'app_id': 0x0,
        'category_id': '',
        'category_name': "local",
        'check_flag': 0x3,
        'copyright_limit_type': "none",
        'effect_id': '',
        'formula_id': '',
        'source_platform': 0x0,
        'wave_points': []
      });
    }
  }
  const _0x4c70a6 = _0x2b900d["tracks"]["map"]((_0xf38752, _0x239543) => ({
    'id': uuid(),
    'type': _0xf38752["type"],
    'name': _0xf38752['name'],
    'is_default_name': ![],
    'attribute': _0xf38752["muted"] ? 0x1 : 0x0,
    'flag': 0x0,
    'segments': _0xf38752["clips"]["map"](_0xb4dde3 => {
      const _0x634b67 = uuid();
      _0x379202["speeds"]["push"]({
        'id': _0x634b67,
        'type': "speed",
        'mode': 0x0,
        'speed': 0x1,
        'curve_speed': null
      });
      const _0x221176 = _0xb4dde3["durationUs"];
      return {
        'id': uuid(),
        'material_id': _0x4c3e26['get'](_0xb4dde3['mediaId'])[_0xf38752["type"]],
        'source_timerange': {
          'start': a294_0x586c1d(_0xb4dde3["sourceStartSec"]),
          'duration': _0x221176
        },
        'target_timerange': {
          'start': _0xb4dde3['startUs'],
          'duration': _0x221176
        },
        'speed': 0x1,
        'volume': _0xf38752["type"] === "video" ? 0x0 : 0x1,
        'last_nonzero_volume': 0x1,
        'reverse': ![],
        'visible': !![],
        'track_attribute': 0x0,
        'render_index': _0x239543,
        'track_render_index': 0x0,
        'extra_material_refs': [_0x634b67],
        'common_keyframes': [],
        'keyframe_refs': [],
        'is_tone_modify': ![],
        'enable_adjust': !![],
        'enable_color_correct_adjust': ![],
        'enable_color_curves': !![],
        'enable_color_match_adjust': ![],
        'enable_color_wheels': !![],
        'enable_lut': !![],
        'enable_smart_color_adjust': ![],
        'clip': _0xf38752["type"] === "video" ? {
          'alpha': 0x1,
          'flip': {
            'horizontal': ![],
            'vertical': ![]
          },
          'rotation': 0x0,
          'scale': {
            'x': 0x1,
            'y': 0x1
          },
          'transform': {
            'x': 0x0,
            'y': 0x0
          }
        } : null,
        ...(_0xf38752['type'] === "video" ? {
          'uniform_scale': {
            'on': !![],
            'value': 0x1
          }
        } : {}),
        'hdr_settings': _0xf38752["type"] === "video" ? {
          'intensity': 0x1,
          'mode': 0x1,
          'nits': 0x3e8
        } : null
      };
    })
  }));
  const _0x329601 = {
    'app_id': 0xe78,
    'app_source': 'lv',
    'app_version': "5.9.0",
    'os': 'windows'
  };
  const _0x2a77d1 = {
    'id': _0xaff33a,
    'name': _0x2b900d["name"],
    'version': 0x57e40,
    'new_version': "110.0.0",
    'source': 'default',
    'fps': _0x2b900d['fps'],
    'duration': _0x2b900d["durationUs"],
    'canvas_config': {
      'width': _0x2b900d["width"],
      'height': _0x2b900d["height"],
      'ratio': "original"
    },
    'color_space': 0x0,
    'create_time': Math["floor"](now / 0x3e8),
    'update_time': Math['floor'](now / 0x3e8),
    'platform': _0x329601,
    'last_modified_platform': _0x329601,
    'config': {
      'maintrack_adsorb': ![],
      'video_mute': ![],
      'material_save_mode': 0x0,
      'attachment_info': [],
      'export_range': null,
      'zoom_info_params': null,
      'original_sound_last_index': 0x1,
      'extract_audio_last_index': 0x1,
      'record_audio_last_index': 0x1,
      'adjust_max_index': 0x1,
      'combination_max_index': 0x1,
      'sticker_max_index': 0x1,
      'lyrics_sync': !![],
      'lyrics_taskinfo': [],
      'lyrics_recognition_id': '',
      'subtitle_sync': !![],
      'subtitle_taskinfo': [],
      'subtitle_recognition_id': '',
      'system_font_list': [],
      'multi_language_current': 'none',
      'multi_language_list': [],
      'multi_language_main': "none",
      'multi_language_mode': "none",
      'subtitle_keywords_config': null
    },
    'materials': _0x379202,
    'tracks': _0x4c70a6,
    'relationships': [],
    'keyframe_graph_list': [],
    'keyframes': emptyLists("adjusts audios effects filters handwrites stickers texts videos"),
    'cover': null,
    'retouch_cover': null,
    'static_cover_image_path': '',
    'group_container': null,
    'mutable_config': null,
    'extra_info': null,
    'time_marks': null,
    'free_render_index_mode_on': ![],
    'render_index_track_mode_on': ![]
  };
  const _0x191402 = {
    'draft_id': _0xaff33a,
    'draft_name': _0x2b900d["name"],
    'draft_fold_path': _0x249bb1["replace"](/\\/g, '/'),
    'draft_root_path': a294_0x4d6e62["dirname"](_0x249bb1)["replace"](/\\/g, '/'),
    'draft_cover': '',
    'draft_is_invisible': ![],
    'draft_type': '',
    'draft_new_version': '',
    'draft_materials': [0x0, 0x1, 0x2, 0x3, 0x6, 0x7, 0x8]["map"](_0x746cd6 => ({
      'type': _0x746cd6,
      'value': []
    })),
    'draft_materials_copied_info': [],
    'draft_segment_extra_info': [],
    'tm_draft_create': now * 0x3e8,
    'tm_draft_modified': now * 0x3e8,
    'tm_draft_removed': 0x0,
    'tm_duration': _0x2b900d['durationUs']
  };
  return new Map([["draft_content.json", json(_0x2a77d1)], ["draft_meta_info.json", json(_0x191402)]]);
}