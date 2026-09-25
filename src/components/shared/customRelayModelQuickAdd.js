import { buildCustomProviderManifestDraft, validateCustomProviderManifestDraft, saveCustomProviderManifestBundle, listCustomProviderManifestBundles } from '../../../api/customProviderDiscoveryApi.js';
import { ensureConfig, getApiConfigSnapshot } from '../../../api/configApi.js';
import { registerManifestBundle } from '../../manifests/index.js';
import { getRememberedCustomProviderConfigs } from '../../modules/app/appTopbarCustomProviderPolicy.js';
import { t } from '../../i18n/index.js';

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// customProviderDiscoveryApi 的每个调用都经过 apiBase.request 与后端信封双层包裹，
// 真实结果落在 result.data（{bundle|items|ok|item}），顶层只有 {success,data,status}。
function unwrap(result) {
  if (result && typeof result === 'object' && result.success !== undefined && result.data !== undefined) {
    return result.data || {};
  }
  return result || {};
}

export function listConfiguredCustomRelays() {
  const snapshot = getApiConfigSnapshot() || {};
  return getRememberedCustomProviderConfigs(snapshot.providers || snapshot);
}

function mergeBundles(existing, incoming) {
  const base = existing && typeof existing === 'object'
    ? existing
    : { sourceId: incoming.sourceId, provider: incoming.provider, models: [], executions: [] };
  const models = Array.isArray(base.models) ? base.models.slice() : [];
  const executions = Array.isArray(base.executions) ? base.executions.slice() : [];
  const seenModelIds = new Set(models.map((item) => String(item && item.modelId || '').trim()).filter(Boolean));
  const seenExecutionIds = new Set(executions.map((item) => String(item && item.id || '').trim()).filter(Boolean));
  (Array.isArray(incoming.models) ? incoming.models : []).forEach((item) => {
    const key = String(item && item.modelId || '').trim();
    if (key && !seenModelIds.has(key)) {
      seenModelIds.add(key);
      models.push(item);
    }
  });
  (Array.isArray(incoming.executions) ? incoming.executions : []).forEach((item) => {
    const key = String(item && item.id || '').trim();
    if (key && !seenExecutionIds.has(key)) {
      seenExecutionIds.add(key);
      executions.push(item);
    }
  });
  return { ...base, models, executions };
}

export async function addCustomRelayModel({ providerId = '', kind = 'image', upstreamModelId = '' } = {}) {
  const normalizedModelId = String(upstreamModelId || '').trim();
  const normalizedProviderId = String(providerId || '').trim();
  if (!normalizedProviderId || !normalizedModelId) {
    throw new Error(t('settings.apiInput.customProvider.quickAddMissingId'));
  }
  await ensureConfig();
  const relay = listConfiguredCustomRelays().find((item) => item.providerId === normalizedProviderId);
  if (!relay) {
    throw new Error(t('settings.apiInput.customProvider.quickAddNoRelay'));
  }
  const draft = await buildCustomProviderManifestDraft({
    provider: {
      providerId: relay.providerId,
      name: relay.name,
      baseUrl: relay.baseUrl,
      documentationUrl: relay.documentationUrl
    },
    models: [{ upstreamModelId: normalizedModelId, kind }]
  });
  const draftBundle = unwrap(draft).bundle;
  if (!draftBundle || !Array.isArray(draftBundle.models) || !draftBundle.models.length) {
    throw new Error(t('settings.apiInput.customProvider.quickAddFailed', { error: t('settings.apiInput.customProvider.noSupportedModels') }));
  }
  const sourceId = String(draftBundle.sourceId || '').trim();
  let existingBundle = null;
  try {
    const listed = unwrap(await listCustomProviderManifestBundles());
    const items = Array.isArray(listed.items) ? listed.items : [];
    existingBundle = (items.find((item) => String(item && (item.sourceId || (item.bundle && item.bundle.sourceId)) || '').trim() === sourceId) || {}).bundle || null;
  } catch (error) {
    console.warn('[Custom Relay QuickAdd] list bundles failed:', error);
  }
  const merged = mergeBundles(existingBundle, draftBundle);
  const validated = unwrap(await validateCustomProviderManifestDraft(merged));
  if (validated.ok !== true) {
    const errors = Array.isArray(validated.errors) ? validated.errors : [];
    throw new Error(errors.length ? errors.join('; ') : t('settings.apiInput.customProvider.quickAddFailed', { error: '' }));
  }
  const finalBundle = validated.bundle || merged;
  const saved = unwrap(await saveCustomProviderManifestBundle(finalBundle));
  const savedBundle = (saved.item && saved.item.bundle) || finalBundle;
  try {
    registerManifestBundle(savedBundle);
  } catch (error) {
    console.warn('[Custom Relay QuickAdd] register bundle failed:', error);
  }
  try {
    const { refreshManifestModelNodeUis } = await import('../../core/renderer.js');
    refreshManifestModelNodeUis();
  } catch (error) {
    console.warn('[Custom Relay QuickAdd] refresh node UIs failed:', error);
  }
  return {
    modelId: String(draftBundle.models[0].modelId || (normalizedProviderId + '/' + normalizedModelId)),
    providerId: normalizedProviderId
  };
}

export function renderCustomRelayQuickAddRow(kind) {
  const safeKind = kind === 'video' ? 'video' : 'image';
  return '<div class="custom-relay-quick-add" data-custom-relay-quick-add="' + safeKind + '">'
    + '<button type="button" class="custom-relay-quick-add-toggle" data-custom-relay-quick-add-toggle>'
    + '<span class="custom-relay-quick-add-plus" aria-hidden="true">+</span>'
    + '<span class="custom-relay-quick-add-label">' + escapeHtml(t('settings.apiInput.customProvider.quickAddLabel')) + '</span>'
    + '</button>'
    + '<div class="custom-relay-quick-add-editor" hidden>'
    + '<select class="custom-relay-quick-add-provider" data-custom-relay-quick-add-provider></select>'
    + '<input type="text" class="custom-relay-quick-add-id" data-custom-relay-quick-add-model-id autocomplete="off" spellcheck="false" placeholder="' + escapeHtml(t('settings.apiInput.customProvider.quickAddIdPlaceholder')) + '" />'
    + '<button type="button" class="custom-relay-quick-add-confirm" data-custom-relay-quick-add-confirm>' + escapeHtml(t('settings.apiInput.customProvider.quickAddConfirm')) + '</button>'
    + '</div>'
    + '</div>';
}

function populateProviderSelect(selectEl) {
  if (!selectEl || selectEl.dataset.customRelayQuickAddLoaded === '1') {
    return;
  }
  const relays = listConfiguredCustomRelays();
  selectEl.innerHTML = '';
  if (!relays.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = t('settings.apiInput.customProvider.quickAddNoRelay');
    selectEl.appendChild(option);
    selectEl.dataset.customRelayQuickAddLoaded = '1';
    return;
  }
  relays.forEach((relay) => {
    const option = document.createElement('option');
    option.value = relay.providerId;
    option.textContent = relay.name || relay.providerId;
    selectEl.appendChild(option);
  });
  selectEl.dataset.customRelayQuickAddLoaded = '1';
}

function showToast(message, type) {
  const toastFn = typeof globalThis.window !== 'undefined' && typeof globalThis.window.showToast === 'function'
    ? globalThis.window.showToast
    : null;
  if (toastFn) {
    toastFn(message, type);
  }
}

export function bindCustomRelayQuickAdd(menuEl, { kind, onSelect } = {}) {
  if (!menuEl || menuEl.dataset.customRelayQuickAddBound === '1') {
    return () => {};
  }
  menuEl.dataset.customRelayQuickAddBound = '1';
  const safeKind = kind === 'video' ? 'video' : 'image';

  const resetEditor = (row) => {
    const editor = row.querySelector('.custom-relay-quick-add-editor');
    const input = row.querySelector('[data-custom-relay-quick-add-model-id]');
    const confirm = row.querySelector('[data-custom-relay-quick-add-confirm]');
    if (editor) editor.hidden = true;
    if (input) input.value = '';
    if (confirm) {
      confirm.disabled = false;
      confirm.textContent = t('settings.apiInput.customProvider.quickAddConfirm');
    }
  };

  const runAdd = async (row) => {
    const select = row.querySelector('[data-custom-relay-quick-add-provider]');
    const input = row.querySelector('[data-custom-relay-quick-add-model-id]');
    const confirm = row.querySelector('[data-custom-relay-quick-add-confirm]');
    const providerId = String(select && select.value || '').trim();
    const upstreamModelId = String(input && input.value || '').trim();
    if (!providerId) {
      showToast(t('settings.apiInput.customProvider.quickAddNoRelay'), 'warn');
      return;
    }
    if (!upstreamModelId) {
      showToast(t('settings.apiInput.customProvider.quickAddMissingId'), 'warn');
      if (input) input.focus();
      return;
    }
    if (confirm) {
      confirm.disabled = true;
      confirm.textContent = t('settings.apiInput.customProvider.quickAddBusy');
    }
    try {
      const result = await addCustomRelayModel({ providerId, kind: safeKind, upstreamModelId });
      showToast(t('settings.apiInput.customProvider.quickAdded', { id: upstreamModelId }), 'success');
      resetEditor(row);
      if (typeof onSelect === 'function') {
        onSelect(result);
      }
    } catch (error) {
      if (confirm) {
        confirm.disabled = false;
        confirm.textContent = t('settings.apiInput.customProvider.quickAddConfirm');
      }
      showToast(t('settings.apiInput.customProvider.quickAddFailed', { error: String(error && error.message || error) }), 'error');
    }
  };

  const onClick = (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') {
      return;
    }
    const row = target.closest('[data-custom-relay-quick-add]');
    if (!row || row.dataset.customRelayQuickAdd !== safeKind) {
      return;
    }
    if (target.closest('[data-custom-relay-quick-add-toggle]')) {
      event.stopPropagation();
      const editor = row.querySelector('.custom-relay-quick-add-editor');
      if (!editor) return;
      const willOpen = editor.hidden;
      editor.hidden = !willOpen;
      if (willOpen) {
        populateProviderSelect(row.querySelector('[data-custom-relay-quick-add-provider]'));
        const input = row.querySelector('[data-custom-relay-quick-add-model-id]');
        if (input) setTimeout(() => input.focus(), 0);
      }
      return;
    }
    if (target.closest('[data-custom-relay-quick-add-confirm]')) {
      event.stopPropagation();
      runAdd(row);
      return;
    }
    if (target.closest('[data-custom-relay-quick-add-provider]') || target.closest('[data-custom-relay-quick-add-model-id]')) {
      event.stopPropagation();
    }
  };
  const onKeydown = (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== 'function' || !target.closest('[data-custom-relay-quick-add]')) {
      return;
    }
    event.stopPropagation();
    if (event.key === 'Enter' && target.matches('[data-custom-relay-quick-add-model-id]')) {
      event.preventDefault();
      runAdd(target.closest('[data-custom-relay-quick-add]'));
    }
  };

  menuEl.addEventListener('click', onClick);
  menuEl.addEventListener('keydown', onKeydown);
  return () => {
    menuEl.removeEventListener('click', onClick);
    menuEl.removeEventListener('keydown', onKeydown);
    delete menuEl.dataset.customRelayQuickAddBound;
  };
}
