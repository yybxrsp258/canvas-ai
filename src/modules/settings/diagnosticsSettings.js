import { canUseDiagnostics, createDiagnosticsPackage, openDiagnosticsLogsFolder, logDiagnosticEvent, logPerformanceSnapshot } from '../../services/diagnosticsService.js';
import { createAiDiagnosticsReport } from '../../services/aiDiagnosticsReport.js';
import { t } from '../../i18n/index.js';
function diagnosticsText(_0x144704, _0x5b5cfa = {}) {
  return t("settings.fileSave.diagnostics." + _0x144704, _0x5b5cfa);
}
function setButtonBusy(_0x15349c, _0x33f40e, _0x18cb64) {
  if (!_0x15349c) {
    return;
  }
  _0x15349c['disabled'] = Boolean(_0x33f40e);
  if (_0x18cb64) {
    _0x15349c["textContent"] = _0x18cb64;
  }
}
export function initDiagnosticsSettings({
  graphStore = null
} = {}) {
  const _0x3e7525 = document["getElementById"]("diagnosticsSettingsCard");
  const _0x5af21d = document["getElementById"]('btnCreateDiagnosticsPackage');
  const _0x5241f1 = document["getElementById"]("btnOpenDiagnosticsLogs");
  const _0x1641c3 = document["getElementById"]('diagnosticsStatusText');
  if (!_0x3e7525 || !_0x5af21d || !_0x5241f1) {
    return;
  }
  const _0x4ac3a9 = canUseDiagnostics();
  _0x3e7525["hidden"] = !_0x4ac3a9;
  if (!_0x4ac3a9) {
    return;
  }
  _0x5af21d["addEventListener"]("click", async () => {
    setButtonBusy(_0x5af21d, !![], diagnosticsText("creating"));
    _0x1641c3 && (_0x1641c3["textContent"] = diagnosticsText('collecting'), _0x1641c3['classList']['remove']("is-error"));
    try {
      const _0xb7d4e7 = createAiDiagnosticsReport({
        'graphStore': graphStore,
        'reason': "settings_diagnostics_package"
      });
      await logDiagnosticEvent({
        'type': "ai_diagnostics.report",
        'level': "info",
        'source': "renderer",
        'message': "AI-readable diagnostics report captured",
        'context': {
          'sampledNodes': _0xb7d4e7["coverage"]?.["sampledNodes"] || 0x0,
          'findingCount': _0xb7d4e7["aiAnalysis"]?.["findings"]?.["length"] || 0x0
        }
      });
      await logPerformanceSnapshot("diagnostics_package");
      const _0x368135 = await createDiagnosticsPackage({
        'aiAnalysisReport': _0xb7d4e7
      });
      if (_0x368135?.["canceled"]) {
        if (_0x1641c3) {
          _0x1641c3["textContent"] = '';
        }
        return;
      }
      _0x1641c3 && (_0x1641c3["textContent"] = _0x368135?.["filename"] ? diagnosticsText("createdWithFile", {
        'filename': _0x368135["filename"]
      }) : diagnosticsText("created"));
      window["showToast"]?.(diagnosticsText("created"), 'success');
    } catch (_0xa42829) {
      const _0x27f389 = _0xa42829?.['message'] || diagnosticsText("createFailed");
      await logDiagnosticEvent({
        'type': "diagnostics.ui_create_failed",
        'level': "error",
        'source': 'renderer',
        'message': _0x27f389,
        'error': _0xa42829
      });
      _0x1641c3 && (_0x1641c3["textContent"] = _0x27f389, _0x1641c3['classList']["add"]("is-error"));
      window["showToast"]?.(_0x27f389, 'error');
    } finally {
      setButtonBusy(_0x5af21d, ![], diagnosticsText("create"));
    }
  });
  _0x5241f1["addEventListener"]("click", async () => {
    try {
      await openDiagnosticsLogsFolder();
    } catch (_0x56c973) {
      await logDiagnosticEvent({
        'type': 'diagnostics.ui_open_logs_failed',
        'level': "error",
        'source': "renderer",
        'message': _0x56c973?.["message"] || diagnosticsText('openLogsFailed'),
        'error': _0x56c973
      });
      window["showToast"]?.(_0x56c973?.['message'] || diagnosticsText('openLogsFailed'), "error");
    }
  });
}