// اپلیکیشن پشتیبانی ماهریاب
// منطق اصلی: مدیریت وضعیت مخاطبان، چک‌لیست پیگیری، و همگام‌سازی با گیت‌هاب

const TABS = [
  { key: 'pending', label: 'پیگیری‌نشده' },
  { key: 'first', label: 'پیگیری اول' },
  { key: 'appointment', label: 'تعیین‌وقت‌شده' },
  { key: 'archive', label: 'بایگانی' }
];

const FIRST_RESULT_OPTIONS = [
  { key: 'willing', label: 'مایل به ثبت‌نام' },
  { key: 'not_needed', label: 'نیاز نداشت' },
  { key: 'appointment', label: 'تعیین وقت' }
];

const SECOND_RESULT_OPTIONS = [
  { key: 'not_needed', label: 'نیاز نداشت' },
  { key: 'no_money', label: 'پول نداشت' },
  { key: 'appointment', label: 'تعیین وقت' }
];

const state = {
  contacts: [],
  followups: {},   // contact_id -> saved followup object
  edits: {},        // contact_id -> working copy being edited on screen
  activeTab: 'pending',
  search: '',
  savingIds: new Set(),
  loaded: false,
  loadError: null
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---------- Toast ----------
function toast(message, type = 'info') {
  const root = $('#toast-root');
  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-slate-800'
  };
  const el = document.createElement('div');
  el.className = `toast-enter pointer-events-auto ${colors[type]} text-white text-sm rounded-xl px-4 py-2.5 shadow-lg max-w-xs text-center`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .3s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

// ---------- Paths / config helpers ----------
function paths() {
  const cfg = GH.getConfig() || {};
  return {
    contacts: cfg.contactsPath || 'data/contacts.json',
    followups: cfg.followupsPath || 'data/followups.json'
  };
}

// ---------- Bucket logic (state machine) ----------
function computeBucket(f) {
  if (!f) return 'pending';
  if (f.first_result === 'appointment' || f.second_result === 'appointment') return 'appointment';
  if (f.second_call === 'no_answer') return 'archive';
  if (f.second_call === 'answered' && f.second_result && f.second_result !== 'appointment') return 'archive';
  if (f.first_call === 'answered') return 'first';
  return 'pending';
}

function emptyFollowup(contactId) {
  return {
    contact_id: contactId,
    first_call: null,
    first_result: null,
    second_call: null,
    second_result: null,
    appointment_note: null,
    updated_at: null
  };
}

// ---------- Data loading ----------
async function loadData(forceNetwork = false) {
  $('#loading-state').classList.remove('hidden');
  $('#empty-state').classList.add('hidden');
  $('#list-root').classList.add('hidden');

  try {
    const p = paths();
    const [contacts, followups] = await Promise.all([
      GH.readJson(p.contacts),
      GH.readJson(p.followups)
    ]);
    state.contacts = contacts;
    state.followups = {};
    followups.forEach((f) => { state.followups[f.contact_id] = f; });
    contacts.forEach((c) => {
      if (!state.followups[c.id]) state.followups[c.id] = emptyFollowup(c.id);
      state.edits[c.id] = { ...state.followups[c.id] };
    });
    state.loaded = true;
    state.loadError = null;
    setConnStatus(true);
  } catch (err) {
    state.loadError = err.message || 'خطا در دریافت اطلاعات';
    setConnStatus(false, state.loadError);
    toast(state.loadError, 'error');
  }

  $('#loading-state').classList.add('hidden');
  $('#list-root').classList.remove('hidden');
  renderTabs();
  renderList();
}

function setConnStatus(ok, msg) {
  const el = $('#conn-status');
  if (!GH.isConfigured()) {
    el.textContent = 'متصل نیست — برای اتصال به گیت‌هاب، تنظیمات را بزنید';
    return;
  }
  el.textContent = ok ? 'متصل به گیت‌هاب' : `خطا در اتصال: ${msg || ''}`;
}

// ---------- Rendering: tabs ----------
function bucketCounts() {
  const counts = { pending: 0, first: 0, appointment: 0, archive: 0 };
  state.contacts.forEach((c) => {
    const b = computeBucket(state.followups[c.id]);
    counts[b] = (counts[b] || 0) + 1;
  });
  return counts;
}

function renderTabs() {
  const counts = bucketCounts();
  const root = $('#tabs');
  root.innerHTML = TABS.map((t) => {
    const active = t.key === state.activeTab;
    return `
      <button data-tab="${t.key}"
        class="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition
        ${active ? 'bg-white text-brand-700 border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}">
        ${t.label} <span class="opacity-70">(${counts[t.key] || 0})</span>
      </button>`;
  }).join('');
}

// ---------- Rendering: list ----------
function filteredContacts() {
  const term = state.search.trim();
  return state.contacts.filter((c) => {
    const inBucket = computeBucket(state.followups[c.id]) === state.activeTab;
    if (!inBucket) return false;
    if (!term) return true;
    const hay = `${c.name} ${c.phone} ${c.field}`.toLowerCase();
    return hay.includes(term.toLowerCase());
  });
}

const EMPTY_MESSAGES = {
  pending: 'مخاطبی برای پیگیری باقی نمانده 👏',
  first: 'کسی در مرحلهٔ پیگیری اول نیست',
  appointment: 'هنوز کسی وقت تعیین نکرده',
  archive: 'بایگانی خالی است'
};

function renderList() {
  const list = filteredContacts();
  const root = $('#list-root');
  const empty = $('#empty-state');

  if (!state.loaded) { root.innerHTML = ''; return; }

  if (list.length === 0) {
    root.innerHTML = '';
    $('#empty-state-text').textContent = EMPTY_MESSAGES[state.activeTab] || 'موردی نیست';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  root.innerHTML = list.map(renderCard).join('');
}

function pillsHtml(contactId, groupKey, options, selected) {
  return `
    <div class="flex flex-wrap gap-1.5 mt-2" data-pill-group="${groupKey}" data-contact="${contactId}">
      ${options.map((o) => `
        <button type="button" data-pill="${o.key}" data-selected="${selected === o.key}"
          class="pill text-[11px] px-2.5 py-1 rounded-full border border-brand-200 text-brand-700 bg-brand-50 font-medium">
          ${o.label}
        </button>`).join('')}
    </div>`;
}

function renderCard(c) {
  const edit = state.edits[c.id] || emptyFollowup(c.id);
  const bucket = computeBucket(state.followups[c.id]);
  const saving = state.savingIds.has(c.id);
  const dirty = JSON.stringify(state.followups[c.id]) !== JSON.stringify(edit);

  const bucketBadge = {
    pending: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">پیگیری‌نشده</span>',
    first: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">در حال پیگیری</span>',
    appointment: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">وقت تعیین‌شده</span>',
    archive: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">بایگانی‌شده</span>'
  }[bucket];

  const noAnswer1Hint = edit.first_call === 'no_answer'
    ? '<span class="text-[11px] text-amber-600">نیاز به تماس مجدد</span>' : '';

  return `
  <div class="card-enter rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden ${bucket === 'archive' ? 'opacity-80' : ''}">
    <div class="px-4 pt-3.5 pb-2 flex items-start justify-between gap-2">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-[11px] font-bold text-brand-700 bg-brand-50 rounded-md px-1.5 py-0.5">#${c.id}</span>
          <h3 class="font-bold text-slate-800 text-[15px]">${escapeHtml(c.name)}</h3>
        </div>
        <p class="text-xs text-slate-400 mt-0.5">${escapeHtml(c.field)}</p>
      </div>
      <div class="flex flex-col items-end gap-1">
        ${bucketBadge}
        ${noAnswer1Hint}
      </div>
    </div>

    <a href="tel:${c.phone}" data-call="${c.id}"
      class="mx-4 flex items-center justify-between bg-brand-50 hover:bg-brand-100 rounded-xl px-3 py-2.5 text-brand-700 no-underline">
      <span class="font-bold tracking-wide" dir="ltr">${c.phone}</span>
      <span class="flex items-center gap-1.5 text-xs font-bold">
        تماس
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z"/></svg>
      </span>
    </a>

    <div class="px-4 pt-3 pb-4 mt-2 border-t border-slate-50">
      <p class="text-[11px] font-bold text-slate-400 mb-2">وضعیت پیگیری</p>

      <label class="flex items-center gap-2 py-1 text-sm text-slate-700">
        <input type="checkbox" class="chk w-4 h-4 rounded" data-check="first_call" data-contact="${c.id}" ${edit.first_call === 'answered' ? 'checked' : ''}>
        پیگیری اول
      </label>
      ${edit.first_call === 'answered' ? pillsHtml(c.id, 'first_result', FIRST_RESULT_OPTIONS, edit.first_result) : ''}

      <label class="flex items-center gap-2 py-1 text-sm text-slate-700 mt-1">
        <input type="checkbox" class="chk w-4 h-4 rounded" data-check="second_call" data-contact="${c.id}" ${edit.second_call === 'answered' ? 'checked' : ''}>
        پیگیری دوم
      </label>
      ${edit.second_call === 'answered' ? pillsHtml(c.id, 'second_result', SECOND_RESULT_OPTIONS, edit.second_result) : ''}

      <label class="flex items-center gap-2 py-1 text-sm text-slate-700 mt-1">
        <input type="checkbox" class="chk w-4 h-4 rounded" data-check="first_no_answer" data-contact="${c.id}" ${edit.first_call === 'no_answer' ? 'checked' : ''}>
        جواب نداد ۱
      </label>

      <label class="flex items-center gap-2 py-1 text-sm text-slate-700">
        <input type="checkbox" class="chk w-4 h-4 rounded" data-check="second_no_answer" data-contact="${c.id}" ${edit.second_call === 'no_answer' ? 'checked' : ''}>
        جواب نداد ۲
      </label>

      ${(edit.first_result === 'appointment' || edit.second_result === 'appointment') ? `
        <div class="mt-2">
          <input type="text" data-note="${c.id}" value="${escapeHtml(edit.appointment_note || '')}"
            placeholder="یادداشت زمان قرار (اختیاری)"
            class="w-full border border-emerald-200 bg-emerald-50 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-400" />
        </div>` : ''}

      <div class="flex items-center justify-between mt-3.5">
        <span class="text-[11px] ${dirty ? 'text-amber-600' : 'text-slate-300'}">${dirty ? 'تغییرات ذخیره نشده' : ''}</span>
        <button data-save="${c.id}" ${saving ? 'disabled' : ''}
          class="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white text-xs font-bold rounded-xl px-4 py-2">
          ${saving ? '<span class="spinner"></span> در حال ثبت' : 'ثبت'}
        </button>
      </div>
    </div>
  </div>`;
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// ---------- Interaction handlers (event delegation) ----------
document.addEventListener('change', (e) => {
  const checkEl = e.target.closest('[data-check]');
  if (checkEl) {
    const contactId = Number(checkEl.dataset.contact);
    const kind = checkEl.dataset.check;
    const edit = state.edits[contactId];
    const checked = checkEl.checked;

    if (kind === 'first_call') {
      edit.first_call = checked ? 'answered' : null;
      if (!checked) edit.first_result = null;
    } else if (kind === 'first_no_answer') {
      edit.first_call = checked ? 'no_answer' : null;
      edit.first_result = null;
    } else if (kind === 'second_call') {
      edit.second_call = checked ? 'answered' : null;
      if (!checked) edit.second_result = null;
    } else if (kind === 'second_no_answer') {
      edit.second_call = checked ? 'no_answer' : null;
      edit.second_result = null;
    }
    renderList();
  }

  const noteEl = e.target.closest('[data-note]');
  if (noteEl) {
    const contactId = Number(noteEl.dataset.note);
    state.edits[contactId].appointment_note = noteEl.value;
  }
});

document.addEventListener('click', async (e) => {
  const tabBtn = e.target.closest('[data-tab]');
  if (tabBtn) {
    state.activeTab = tabBtn.dataset.tab;
    renderTabs();
    renderList();
    return;
  }

  const pillBtn = e.target.closest('[data-pill]');
  if (pillBtn) {
    const group = pillBtn.closest('[data-pill-group]');
    const contactId = Number(group.dataset.contact);
    const key = group.dataset.pillGroup; // first_result | second_result
    const value = pillBtn.dataset.pill;
    const edit = state.edits[contactId];
    edit[key] = edit[key] === value ? null : value;
    renderList();
    return;
  }

  const saveBtn = e.target.closest('[data-save]');
  if (saveBtn) {
    const contactId = Number(saveBtn.dataset.save);
    await saveCard(contactId);
    return;
  }
});

$('#search-input').addEventListener('input', (e) => {
  state.search = e.target.value;
  renderList();
});

$('#btn-refresh').addEventListener('click', () => {
  if (!GH.isConfigured()) { openSettings(); return; }
  loadData(true);
});

// ---------- Saving ----------
async function saveCard(contactId) {
  if (!GH.isConfigured()) { openSettings(); return; }
  const edit = state.edits[contactId];

  if (edit.first_call === 'answered' && !edit.first_result) {
    toast('لطفاً نتیجه پیگیری اول را انتخاب کنید', 'error');
    return;
  }
  if (edit.second_call === 'answered' && !edit.second_result) {
    toast('لطفاً نتیجه پیگیری دوم را انتخاب کنید', 'error');
    return;
  }

  state.savingIds.add(contactId);
  renderList();

  try {
    const p = paths();
    // دریافت آخرین نسخه برای جلوگیری از رونویسی تغییرات هم‌زمان سایر پشتیبان‌ها
    const latest = await GH.readJson(p.followups);
    const idx = latest.findIndex((f) => f.contact_id === contactId);
    const merged = {
      ...(idx >= 0 ? latest[idx] : emptyFollowup(contactId)),
      ...edit,
      updated_at: new Date().toISOString()
    };
    if (idx >= 0) latest[idx] = merged; else latest.push(merged);

    await GH.writeJson(p.followups, latest, `به‌روزرسانی پیگیری مخاطب #${contactId}`);

    state.followups[contactId] = merged;
    state.edits[contactId] = { ...merged };
    toast('با موفقیت ثبت شد', 'success');
  } catch (err) {
    toast(err.message || 'خطا در ثبت اطلاعات', 'error');
  } finally {
    state.savingIds.delete(contactId);
    renderTabs();
    renderList();
  }
}

// ---------- Settings modal ----------
function openSettings() {
  const cfg = GH.getConfig() || {};
  const form = $('#settings-form');
  form.owner.value = cfg.owner || '';
  form.repo.value = cfg.repo || '';
  form.branch.value = cfg.branch || 'main';
  form.token.value = cfg.token || '';
  form.isPrivate.checked = !!cfg.isPrivate;
  form.contactsPath.value = cfg.contactsPath || 'data/contacts.json';
  form.followupsPath.value = cfg.followupsPath || 'data/followups.json';
  $('#settings-modal').classList.remove('hidden');
}
function closeSettings() { $('#settings-modal').classList.add('hidden'); }

$('#btn-settings').addEventListener('click', openSettings);
$('#settings-close').addEventListener('click', closeSettings);

$('#settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const cfg = {
    owner: form.owner.value.trim(),
    repo: form.repo.value.trim(),
    branch: form.branch.value.trim() || 'main',
    token: form.token.value.trim(),
    isPrivate: form.isPrivate.checked,
    contactsPath: form.contactsPath.value.trim() || 'data/contacts.json',
    followupsPath: form.followupsPath.value.trim() || 'data/followups.json'
  };
  GH.saveConfig(cfg);
  closeSettings();
  toast('تنظیمات ذخیره شد، در حال دریافت اطلاعات…', 'info');
  await loadData(true);
});

$('#settings-disconnect').addEventListener('click', () => {
  GH.clearConfig();
  closeSettings();
  setConnStatus(false);
  toast('اتصال قطع شد', 'info');
});

// ---------- Boot ----------
(function boot() {
  renderTabs();
  if (!GH.isConfigured()) {
    $('#loading-state').classList.add('hidden');
    setConnStatus(false);
    $('#empty-state-text').textContent = 'برای شروع، از دکمه تنظیمات بالا به گیت‌هاب متصل شوید';
    $('#empty-state').classList.remove('hidden');
    openSettings();
    return;
  }
  setConnStatus(true);
  loadData();
})();
