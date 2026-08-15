// اپلیکیشن پشتیبانی ماهریاب
// منطق اصلی: صفحات (مخاطبین/تقویم/آمار/تنظیمات)، چک‌لیست پیگیری پلکانی، تقویم قرار، همگام‌سازی با Supabase

const TABS = [
  { key: 'pending', label: 'پیگیری‌نشده' },
  { key: 'first', label: 'پیگیری اول' },
  { key: 'archive', label: 'بایگانی' }
];

const APPT_SUBTABS = [
  { key: 'today', label: 'امروز' },
  { key: 'tomorrow', label: 'فردا' },
  { key: 'all', label: 'نمای کلی' }
];

const ARCHIVE_SUBTABS = [
  { key: 'second_followup', label: 'پیگیری دوم‌ها' },
  { key: 'no_answer', label: 'بی‌پاسخ' },
  { key: 'no_show', label: 'حضور نیافته' },
  { key: 'registered', label: 'ثبت‌نام‌شده' }
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

const TIME_SLOTS = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'];
const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const WEEKDAY_LABELS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const WEEKDAY_FULL = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']; // index = Date.getDay()
const SMS_TEMPLATE = 'سلام، از پشتیبانی ماهریاب تماس می‌گیریم. لطفاً در صورت امکان با ما تماس بگیرید.';

const state = {
  page: 'contacts',        // 'contacts' | 'calendar' | 'stats' | 'settings'
  contacts: [],
  followups: {},            // contact_id -> saved followup object
  edits: {},                 // contact_id -> working copy (contact fields + followup fields)
  editingIds: new Set(),     // contact ids currently in "ویرایش کارت" mode
  activeTab: 'pending',
  apptSub: 'today',
  archiveSub: 'second_followup',
  search: '',
  savingIds: new Set(),
  loaded: false,
  loadError: null,
  openContactId: null,       // contact currently shown in #contact-modal (if any)
  apptModal: null            // { contactId, jy, jm, step: 'day'|'time', selectedISO }
};

const $ = (sel, root = document) => root.querySelector(sel);

// ---------- Small date helpers ----------
function toISO(date) {
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function toPersianDigits(input) {
  const map = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
  return String(input).replace(/[0-9]/g, (d) => map[d]);
}
function formatJalaliDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${toPersianDigits(j.jd)} ${JALALI_MONTHS[j.jm - 1]} ${toPersianDigits(j.jy)}`;
}
function formatJalaliDateWithWeekday(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${WEEKDAY_FULL[d.getDay()]} ${toPersianDigits(j.jd)} ${JALALI_MONTHS[j.jm - 1]}`;
}

// ---------- Toast ----------
function toast(message, type = 'info') {
  const root = $('#toast-root');
  const colors = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-slate-800' };
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

// ---------- Bucket logic (state machine) ----------
function computeBucket(f) {
  if (!f) return 'pending';
  if (f.meeting_result === 'no_show' || f.meeting_result === 'registered') return 'archive';
  if (f.first_result === 'appointment' || f.second_result === 'appointment') return 'appointment';
  if (f.second_call === 'no_answer') return 'archive';
  if (f.second_call === 'answered' && f.second_result && f.second_result !== 'appointment') return 'archive';
  if (f.first_call === 'answered') return 'first';
  return 'pending';
}
function archiveReason(f) {
  if (!f) return null;
  if (f.meeting_result === 'no_show') return 'no_show';
  if (f.meeting_result === 'registered') return 'registered';
  if (f.second_call === 'no_answer') return 'no_answer';
  if (f.second_call === 'answered' && f.second_result && f.second_result !== 'appointment') return 'second_followup';
  return null;
}

function emptyFollowup(contactId) {
  return {
    contact_id: contactId,
    first_call: null, first_result: null, first_call_date: null,
    second_call: null, second_result: null, second_call_date: null,
    appointment_date: null, appointment_time: null, appointment_note: null,
    meeting_result: null,
    updated_at: null
  };
}

// ---------- Data loading ----------
async function loadData() {
  $('#loading-state').classList.remove('hidden');
  $('#empty-state').classList.add('hidden');
  $('#list-root').classList.add('hidden');

  try {
    const [contacts, followups] = await Promise.all([SB.fetchContacts(), SB.fetchFollowups()]);
    state.contacts = contacts;
    state.followups = {};
    followups.forEach((f) => { state.followups[f.contact_id] = f; });
    contacts.forEach((c) => {
      if (!state.followups[c.id]) state.followups[c.id] = emptyFollowup(c.id);
      state.edits[c.id] = { ...c, ...state.followups[c.id] };
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
  renderActivePage();
}

function setConnStatus(ok, msg) {
  const el = $('#conn-status');
  if (!SB.isConfigured()) { el.textContent = 'متصل نیست — به Supabase وصل شوید'; return; }
  el.textContent = ok ? 'متصل به Supabase' : `خطا: ${msg || ''}`;
}

// ---------- Page navigation ----------
function goToPage(page) {
  state.page = page;
  $('#page-contacts').classList.toggle('hidden', page !== 'contacts');
  $('#page-calendar').classList.toggle('hidden', page !== 'calendar');
  $('#page-stats').classList.toggle('hidden', page !== 'stats');
  $('#page-settings').classList.toggle('hidden', page !== 'settings');
  $('#contacts-chrome').classList.toggle('hidden', page !== 'contacts');
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.page === page));
  renderActivePage();
}

function renderActivePage() {
  if (state.page === 'contacts') { renderTabs(); renderSubTabs(); renderList(); }
  else if (state.page === 'calendar') renderCalendarPage();
  else if (state.page === 'stats') renderStatsPage();
  else if (state.page === 'settings') renderSettingsPage();
  refreshOpenContactModal();
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
  $('#tabs').innerHTML = TABS.map((t) => {
    const active = t.key === state.activeTab;
    return `<button data-tab="${t.key}" class="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition
      ${active ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-500 border-slate-200'}">
      ${t.label} <span class="opacity-70">(${counts[t.key] || 0})</span></button>`;
  }).join('');
}

function renderSubTabs() {
  const root = $('#subtabs');
  root.innerHTML = state.activeTab === 'archive'
    ? ARCHIVE_SUBTABS.map((t) => subtabBtn(t, state.archiveSub, 'archiveSub')).join('')
    : '';
}
function subtabBtn(t, activeKey, kind) {
  const active = t.key === activeKey;
  return `<button data-${kind}="${t.key}" class="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border
    ${active ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-400 border-slate-200'}">${t.label}</button>`;
}

// ---------- Rendering: contacts list ----------
function filteredContacts() {
  const term = state.search.trim().toLowerCase();
  return state.contacts.filter((c) => {
    const f = state.followups[c.id];
    const edit = state.edits[c.id] || f;
    if (computeBucket(f) !== state.activeTab) return false;
    if (state.activeTab === 'archive' && archiveReason(f) !== state.archiveSub) return false;
    if (!term) return true;
    const hay = `${edit.name || ''} ${edit.phone || ''} ${edit.field || ''}`.toLowerCase();
    return hay.includes(term);
  });
}

const EMPTY_MESSAGES = {
  pending: 'مخاطبی برای پیگیری باقی نمانده 👏',
  first: 'کسی در مرحلهٔ پیگیری اول نیست',
  archive: 'این بخش بایگانی خالی است'
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
    empty.classList.add('flex');
    return;
  }
  empty.classList.add('hidden');
  empty.classList.remove('flex');
  root.innerHTML = list.map(renderCard).join('');
  observeListCards();
}

// اسکیل/محو‌شدن کارت‌ها هنگام ورود و خروج از صفحه نمایش هنگام اسکرول
let cardObserver = null;
function observeListCards() {
  if (!('IntersectionObserver' in window)) return;
  if (cardObserver) cardObserver.disconnect();
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('io-hidden', entry.intersectionRatio < 0.55);
    });
  }, { threshold: [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1] });
  document.querySelectorAll('#list-root .list-card').forEach((el) => cardObserver.observe(el));
}

function pillsHtml(contactId, groupKey, options, selected) {
  return `<div class="flex flex-wrap gap-1.5 mt-2" data-pill-group="${groupKey}" data-contact="${contactId}">
    ${options.map((o) => `<button type="button" data-pill="${o.key}" data-selected="${selected === o.key}"
      class="pill text-[11px] px-2.5 py-1 rounded-full border border-brand-200 text-brand-700 bg-brand-50 font-medium">${o.label}</button>`).join('')}
  </div>`;
}

function smsHref(phone) {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const body = encodeURIComponent(SMS_TEMPLATE);
  return isIOS ? `sms:${phone || ''}&body=${body}` : `sms:${phone || ''}?body=${body}`;
}

function dateFieldHtml(value) {
  // فقط نمایشی — تاریخ به‌صورت خودکار (روز ثبت) ذخیره می‌شود و قابل انتخاب/ویرایش نیست
  return `<span class="text-[11px] text-slate-400 font-bold">${value ? formatJalaliDate(value) : '—/—/—'}</span>`;
}

function renderCard(c) {
  const edit = state.edits[c.id] || { ...c, ...emptyFollowup(c.id) };
  const bucket = computeBucket(state.followups[c.id]);
  const saving = state.savingIds.has(c.id);
  const savedMerged = { ...c, ...state.followups[c.id] };
  const dirty = JSON.stringify(savedMerged) !== JSON.stringify(edit);
  const hasAppointmentChoice = edit.first_result === 'appointment' || edit.second_result === 'appointment';
  const isEditing = state.editingIds.has(c.id);
  const secondGated = !edit.first_call; // پیگیری دوم تا پیگیری اول مشخص نشده قفل است

  const bucketBadge = {
    pending: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold">پیگیری‌نشده</span>',
    first: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-bold">در حال پیگیری</span>',
    appointment: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">✓ وقت تعیین‌شده</span>',
    archive: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 font-bold">بایگانی‌شده</span>'
  }[bucket];

  const noAnswer1Hint = edit.first_call === 'no_answer' ? '<span class="text-[11px] text-amber-600">نیاز به تماس مجدد</span>' : '';

  const identityBlock = isEditing ? `
    <input type="text" data-field="name" data-contact="${c.id}" value="${escapeHtml(edit.name || '')}" placeholder="نام مخاطب (اختیاری)"
      class="w-full font-bold text-slate-800 text-[15px] bg-transparent outline-none border-b border-brand-200 py-0.5" />
    <input type="text" data-field="field" data-contact="${c.id}" value="${escapeHtml(edit.field || '')}" placeholder="حیطه فعالیت (اختیاری)"
      class="w-full text-xs text-slate-500 bg-transparent outline-none border-b border-brand-100 py-0.5 mt-1" />
  ` : `
    <p class="font-bold text-slate-800 text-[15px]">${edit.name ? escapeHtml(edit.name) : '<span class="text-slate-300">بدون نام</span>'}</p>
    <p class="text-xs text-slate-400 mt-0.5">${edit.field ? escapeHtml(edit.field) : 'بدون حیطه فعالیت'}</p>
  `;

  const phoneBlock = isEditing ? `
    <input type="text" data-field="phone" data-contact="${c.id}" value="${escapeHtml(edit.phone || '')}" dir="ltr" placeholder="شماره تماس"
      class="flex-1 min-w-0 bg-brand-50 rounded-xl px-3 py-2.5 text-brand-700 font-bold text-sm outline-none border border-brand-200" />
  ` : `
    <div class="flex-1 min-w-0 bg-brand-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
      <span class="text-brand-700 font-bold text-sm" dir="ltr">${escapeHtml(edit.phone || '—')}</span>
      <button type="button" data-copy-phone="${c.id}" title="کپی شماره" class="text-brand-400 hover:text-brand-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
    </div>
  `;

  const notesBlock = isEditing ? `
    <textarea data-field="notes" data-contact="${c.id}" placeholder="توضیحات کوتاه درباره این مخاطب…"
      class="w-full text-xs text-slate-600 border border-brand-200 rounded-xl px-3 py-2 mt-2.5 outline-none" rows="2">${escapeHtml(edit.notes || '')}</textarea>
  ` : `
    <button type="button" data-toggle-edit="${c.id}" class="w-full flex items-start gap-2 border border-slate-100 rounded-xl px-3 py-2.5 mt-2.5 text-right">
      <span class="w-7 h-7 shrink-0 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
      </span>
      <span class="flex-1">
        <span class="block text-[11px] text-slate-400">توضیحات</span>
        <span class="block text-xs ${edit.notes ? 'text-slate-600' : 'text-slate-300'} mt-0.5">${edit.notes ? escapeHtml(edit.notes) : 'توضیحات کوتاه درباره این مخاطب…'}</span>
      </span>
    </button>
  `;

  return `
  <div class="list-card card-enter rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden ${bucket === 'archive' ? 'opacity-80' : ''}">
    <div class="px-4 pt-3.5 pb-2 flex items-start justify-between gap-2">
      <div class="shrink-0 pt-0.5">${bucketBadge}</div>
      <div class="flex-1 min-w-0 text-right">
        <div class="flex items-center justify-end gap-2">
          ${identityBlock}
          <span class="text-[11px] font-bold text-brand-700 bg-brand-50 rounded-md px-1.5 py-0.5 shrink-0">#${c.id}</span>
        </div>
      </div>
    </div>
    ${noAnswer1Hint ? `<div class="px-4 pb-1">${noAnswer1Hint}</div>` : ''}

    <div class="mx-4 flex items-center gap-1.5">
      <a href="${smsHref(edit.phone)}" title="پیامک" class="w-10 h-10 shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </a>
      <a href="tel:${edit.phone || ''}" title="تماس" class="w-10 h-10 shrink-0 rounded-xl bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z"/></svg>
      </a>
      ${phoneBlock}
    </div>

    ${notesBlock}

    <div class="px-4 pt-3 pb-4 mt-1 border-t border-slate-50">
      <p class="text-[11px] font-bold text-slate-400 mb-2">وضعیت پیگیری</p>

      <div class="flex items-stretch gap-2">
        <div class="flex-1 rounded-2xl border border-slate-100 p-3">
          <div class="flex items-center justify-between">
            ${dateFieldHtml(edit.first_call_date)}
            <label class="flex items-center gap-2 text-sm text-slate-700 font-bold">
              پیگیری اول
              <input type="checkbox" class="chk w-4 h-4 rounded" data-check="first_call" data-contact="${c.id}" ${edit.first_call === 'answered' ? 'checked' : ''}>
            </label>
          </div>
          ${edit.first_call === 'answered' ? pillsHtml(c.id, 'first_result', FIRST_RESULT_OPTIONS, edit.first_result) : ''}
          <label class="flex items-center gap-2 py-1 mt-2 text-xs text-slate-500">
            <input type="checkbox" class="chk w-3.5 h-3.5 rounded" data-check="first_no_answer" data-contact="${c.id}" ${edit.first_call === 'no_answer' ? 'checked' : ''}>
            جواب نداد
          </label>
        </div>
        <div class="w-5 flex flex-col items-center pt-3">
          <div class="w-3.5 h-3.5 rounded-full border-2 ${edit.first_call ? 'bg-brand-700 border-brand-700' : 'border-slate-300 bg-white'}"></div>
          <div class="flex-1 w-px bg-slate-200 my-1"></div>
        </div>
      </div>

      <div class="flex items-stretch gap-2 mt-2 ${secondGated ? 'gated' : ''}">
        <div class="flex-1 rounded-2xl border border-slate-100 p-3">
          <div class="flex items-center justify-between">
            ${dateFieldHtml(edit.second_call_date)}
            <label class="flex items-center gap-2 text-sm text-slate-700 font-bold">
              پیگیری دوم
              <input type="checkbox" class="chk w-4 h-4 rounded" data-check="second_call" data-contact="${c.id}" ${edit.second_call === 'answered' ? 'checked' : ''} ${secondGated ? 'disabled' : ''}>
            </label>
          </div>
          ${edit.second_call === 'answered' ? pillsHtml(c.id, 'second_result', SECOND_RESULT_OPTIONS, edit.second_result) : ''}
          <label class="flex items-center gap-2 py-1 mt-2 text-xs text-slate-500">
            <input type="checkbox" class="chk w-3.5 h-3.5 rounded" data-check="second_no_answer" data-contact="${c.id}" ${edit.second_call === 'no_answer' ? 'checked' : ''} ${secondGated ? 'disabled' : ''}>
            جواب نداد
          </label>
        </div>
        <div class="w-5 flex flex-col items-center pt-3">
          <div class="w-3.5 h-3.5 rounded-full border-2 ${edit.second_call ? 'bg-brand-700 border-brand-700' : 'border-slate-300 bg-white'}"></div>
        </div>
      </div>

      ${hasAppointmentChoice ? `
        <button type="button" data-open-appt="${c.id}"
          class="w-full flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 mt-3 text-emerald-700 text-xs font-bold">
          <span>${edit.appointment_date ? formatJalaliDate(edit.appointment_date) + (edit.appointment_time ? ' — ' + toPersianDigits(edit.appointment_time) : '') : 'انتخاب تاریخ و ساعت قرار'}</span>
          <span>📅</span>
        </button>
        <input type="text" data-field="appointment_note" data-contact="${c.id}" value="${escapeHtml(edit.appointment_note || '')}"
          placeholder="یادداشت قرار (اختیاری)"
          class="w-full border border-emerald-200 bg-emerald-50/60 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-400 mt-2" />
        <p class="text-[11px] font-bold text-slate-400 mt-3 mb-1">نتیجه ملاقات</p>
        <div class="flex gap-3">
          <label class="flex items-center gap-2 text-sm text-amber-700">
            <input type="checkbox" class="chk w-4 h-4 rounded" data-check="meeting_no_show" data-contact="${c.id}" ${edit.meeting_result === 'no_show' ? 'checked' : ''}>
            حضور نیافت
          </label>
          <label class="flex items-center gap-2 text-sm text-emerald-700">
            <input type="checkbox" class="chk w-4 h-4 rounded" data-check="meeting_registered" data-contact="${c.id}" ${edit.meeting_result === 'registered' ? 'checked' : ''}>
            ثبت‌نام کرد
          </label>
        </div>
      ` : ''}

      <div class="flex items-center justify-between mt-3.5">
        <button data-save="${c.id}" ${saving ? 'disabled' : ''}
          class="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white text-xs font-bold rounded-full px-4 py-2">
          ${saving ? '<span class="spinner"></span> در حال ثبت' : '✓ ثبت'}
        </button>
        <span class="text-[11px] ${dirty ? 'text-amber-600' : 'text-slate-300'}">${dirty ? 'تغییرات ذخیره نشده' : ''}</span>
        <button type="button" data-toggle-edit="${c.id}"
          class="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-full px-4 py-2">
          ${isEditing ? 'پایان ویرایش' : 'ویرایش کارت'}
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// ---------- Calendar page (تقویم در ناوبری پایین) ----------
function renderCalendarPage() {
  const root = $('#page-calendar');
  if (!state.loaded) { root.innerHTML = ''; return; }

  const apptContacts = state.contacts.filter((c) => computeBucket(state.followups[c.id]) === 'appointment');
  const todayStr = toISO(new Date());
  const tomorrowStr = toISO(addDays(new Date(), 1));

  let list = apptContacts;
  if (state.apptSub !== 'all') {
    const target = state.apptSub === 'today' ? todayStr : tomorrowStr;
    list = list.filter((c) => state.followups[c.id].appointment_date === target);
  }

  const subtabsHtml = `<div class="flex gap-2 mb-3">${APPT_SUBTABS.map((t) => subtabBtn(t, state.apptSub, 'apptSub')).join('')}</div>`;

  if (list.length === 0) {
    root.innerHTML = subtabsHtml + `<p class="text-center text-slate-400 text-sm py-16">وقتی برای این بازه ثبت نشده</p>`;
    return;
  }

  let bodyHtml;
  if (state.apptSub === 'all') {
    const groups = {};
    list.forEach((c) => {
      const key = state.followups[c.id].appointment_date;
      (groups[key] = groups[key] || []).push(c);
    });
    const sortedKeys = Object.keys(groups).sort();
    bodyHtml = sortedKeys.map((dateKey) => {
      const dayContacts = groups[dateKey].sort((a, b) =>
        (state.followups[a.id].appointment_time || '').localeCompare(state.followups[b.id].appointment_time || ''));
      return `<p class="text-xs font-bold text-slate-400 px-1 pt-3 pb-1">${formatJalaliDateWithWeekday(dateKey)}</p>
        <div class="space-y-2">${dayContacts.map(miniApptCard).join('')}</div>`;
    }).join('');
  } else {
    list = [...list].sort((a, b) =>
      (state.followups[a.id].appointment_time || '').localeCompare(state.followups[b.id].appointment_time || ''));
    bodyHtml = `<div class="space-y-2">${list.map(miniApptCard).join('')}</div>`;
  }

  root.innerHTML = subtabsHtml + bodyHtml;
}

function miniApptCard(c) {
  const edit = state.edits[c.id] || c;
  const f = state.followups[c.id];
  const name = edit.name || c.name || 'بدون نام';
  return `<button type="button" data-open-contact="${c.id}"
    class="w-full flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm text-right">
    <span class="font-bold text-slate-700 text-sm">${escapeHtml(name)}</span>
    <span class="text-brand-700 text-xs font-bold" dir="ltr">${toPersianDigits((f.appointment_time || '').replace('-', ' - '))}</span>
  </button>`;
}

// ---------- Contact detail modal (از تقویم باز می‌شود) ----------
function openContactModal(contactId) {
  state.openContactId = contactId;
  refreshOpenContactModal();
  $('#contact-modal').classList.remove('hidden');
}
function closeContactModal() {
  state.openContactId = null;
  $('#contact-modal').classList.add('hidden');
}
function refreshOpenContactModal() {
  if (!state.openContactId) return;
  const c = state.contacts.find((x) => x.id === state.openContactId);
  if (c) $('#contact-modal-body').innerHTML = renderCard(c);
}

// ---------- Stats page (آمار) ----------
function renderStatsPage() {
  if (!state.loaded) { $('#page-stats').innerHTML = ''; return; }
  const counts = bucketCounts();
  const archiveBreak = { second_followup: 0, no_answer: 0, no_show: 0, registered: 0 };
  state.contacts.forEach((c) => {
    const r = archiveReason(state.followups[c.id]);
    if (r) archiveBreak[r] += 1;
  });
  const todayStr = toISO(new Date());
  const todayCount = state.contacts.filter((c) => state.followups[c.id].appointment_date === todayStr).length;

  const statCard = (label, value, color) => `
    <div class="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
      <p class="text-2xl font-extrabold text-${color}-700">${toPersianDigits(value)}</p>
      <p class="text-[11px] text-slate-400 mt-1">${label}</p>
    </div>`;

  $('#page-stats').innerHTML = `
    <p class="text-sm font-bold text-slate-500 mb-3">نمای کلی</p>
    <div class="grid grid-cols-2 gap-3">
      ${statCard('کل مخاطبان', state.contacts.length, 'brand')}
      ${statCard('پیگیری‌نشده', counts.pending, 'slate')}
      ${statCard('در حال پیگیری', counts.first, 'brand')}
      ${statCard('تعیین‌وقت‌شده', counts.appointment, 'emerald')}
      ${statCard('قرار امروز', todayCount, 'emerald')}
      ${statCard('کل بایگانی', counts.archive, 'slate')}
    </div>
    <p class="text-sm font-bold text-slate-500 mt-5 mb-3">جزئیات بایگانی</p>
    <div class="grid grid-cols-2 gap-3">
      ${statCard('پیگیری دوم‌ها', archiveBreak.second_followup, 'slate')}
      ${statCard('بی‌پاسخ', archiveBreak.no_answer, 'slate')}
      ${statCard('حضور نیافته', archiveBreak.no_show, 'amber')}
      ${statCard('ثبت‌نام‌شده', archiveBreak.registered, 'emerald')}
    </div>`;
}

// ---------- Settings page (تنظیمات) ----------
function renderSettingsPage() {
  const cfg = SB.getConfig() || {};
  $('#page-settings').innerHTML = `
    <div class="bg-white border border-slate-100 rounded-2xl p-4 mb-4">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm font-bold text-slate-700">پروفایل</span>
        <span class="text-[10px] bg-amber-50 text-amber-600 rounded-full px-2 py-0.5 font-bold">به‌زودی</span>
      </div>
      <p class="text-xs text-slate-400 leading-6">در نسخه‌های بعدی هر پشتیبان با حساب کاربری اختصاصی خودش وارد می‌شود. فعلاً اطلاعات اتصال زیر بین همه پشتیبان‌ها مشترک است.</p>
    </div>

    <form id="settings-form" class="bg-white border border-slate-100 rounded-2xl p-4 space-y-4">
      <p class="text-sm font-bold text-slate-700">اتصال به Supabase</p>
      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">آدرس پروژه (Project URL)</label>
        <input name="url" required dir="ltr" value="${escapeHtml(cfg.url || '')}" placeholder="https://xxxx.supabase.co"
          class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-500" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">کلید anon public</label>
        <input name="anonKey" required type="password" dir="ltr" value="${escapeHtml(cfg.anonKey || '')}" placeholder="eyJhbGciOi..."
          class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-500" />
        <p class="text-[11px] text-slate-400 mt-1">این مقادیر فقط داخل همین گوشی ذخیره می‌شوند، نه در کد برنامه.</p>
      </div>
      <button type="submit" class="w-full bg-brand-700 hover:bg-brand-800 text-white rounded-xl py-3 text-sm font-bold">ذخیره و اتصال</button>
      <button type="button" id="settings-disconnect" class="w-full text-red-500 text-xs py-1">قطع اتصال و پاک‌کردن اطلاعات ذخیره‌شده</button>
    </form>`;
}

// ---------- Appointment calendar modal ----------
function openAppointmentModal(contactId) {
  const edit = state.edits[contactId];
  let jy, jm;
  if (edit.appointment_date) {
    const d = new Date(edit.appointment_date + 'T00:00:00');
    const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    jy = j.jy; jm = j.jm;
  } else {
    const today = new Date();
    const j = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    jy = j.jy; jm = j.jm;
  }
  state.apptModal = { contactId, jy, jm, step: 'day', selectedISO: edit.appointment_date || null };
  $('#appt-modal').classList.remove('hidden');
  renderApptModal();
}
function closeApptModal() { state.apptModal = null; $('#appt-modal').classList.add('hidden'); }

function renderApptModal() {
  const m = state.apptModal;
  if (!m) return;
  if (m.step === 'day') {
    $('#appt-modal-title').textContent = 'انتخاب روز';
    $('#appt-modal-body').innerHTML = buildCalendarHtml(m.jy, m.jm, m.selectedISO);
  } else {
    $('#appt-modal-title').textContent = 'انتخاب ساعت';
    $('#appt-modal-body').innerHTML = buildTimeSlotHtml(m);
  }
}

function buildCalendarHtml(jy, jm, selectedISO) {
  const monthLen = jalaali.jalaaliMonthLength(jy, jm);
  const firstG = jalaali.toGregorian(jy, jm, 1);
  const firstDate = new Date(firstG.gy, firstG.gm - 1, firstG.gd);
  const leadingBlanks = (firstDate.getDay() + 1) % 7;
  const todayISOStr = toISO(new Date());

  let cells = '';
  for (let i = 0; i < leadingBlanks; i++) cells += `<div></div>`;
  for (let d = 1; d <= monthLen; d++) {
    const g = jalaali.toGregorian(jy, jm, d);
    const dateObj = new Date(g.gy, g.gm - 1, g.gd);
    const iso = toISO(dateObj);
    const weekday = dateObj.getDay();
    const isFriday = weekday === 5; // فقط جمعه تعطیل است؛ پنجشنبه هم رزرو می‌شود
    const isPast = iso < todayISOStr;
    const isToday = iso === todayISOStr;
    const isSelected = iso === selectedISO;
    const disabled = isFriday || isPast;
    cells += `<button type="button" ${disabled ? 'disabled' : `data-pick-day="${iso}"`}
      class="h-10 rounded-xl text-sm font-bold flex items-center justify-center
      ${disabled ? 'text-slate-300' : 'text-slate-700 hover:bg-brand-50'}
      ${isSelected ? '!bg-brand-700 !text-white' : ''}
      ${isToday && !isSelected ? 'ring-2 ring-red-400' : ''}">${toPersianDigits(d)}</button>`;
  }

  return `
    <div class="flex items-center justify-between mb-3">
      <button type="button" data-month-nav="-1" class="w-8 h-8 rounded-full hover:bg-slate-100 text-lg">‹</button>
      <span class="font-bold text-sm">${JALALI_MONTHS[jm - 1]} ${toPersianDigits(jy)}</span>
      <button type="button" data-month-nav="1" class="w-8 h-8 rounded-full hover:bg-slate-100 text-lg">›</button>
    </div>
    <div class="grid grid-cols-7 gap-1 mb-1 text-[11px] text-slate-400 text-center">
      ${WEEKDAY_LABELS.map((w) => `<div>${w}</div>`).join('')}
    </div>
    <div class="grid grid-cols-7 gap-1">${cells}</div>
    <p class="text-[11px] text-slate-400 mt-3">امروز با دایره قرمز مشخص شده. فقط جمعه و روزهای گذشته قابل انتخاب نیستند.</p>
  `;
}

function buildTimeSlotHtml(m) {
  const { contactId, selectedISO } = m;
  const taken = new Set();
  Object.values(state.followups).forEach((f) => {
    if (f.contact_id !== contactId && f.appointment_date === selectedISO && f.appointment_time && f.meeting_result !== 'no_show') taken.add(f.appointment_time);
  });

  return `
    <p class="text-sm font-bold text-slate-700 mb-3">${formatJalaliDateWithWeekday(selectedISO)}</p>
    <div class="grid grid-cols-2 gap-2">
      ${TIME_SLOTS.map((slot) => {
        const isTaken = taken.has(slot);
        return `<button type="button" ${isTaken ? 'disabled' : `data-pick-time="${slot}"`}
          class="py-2.5 rounded-xl text-sm font-bold border
          ${isTaken ? 'bg-slate-100 text-slate-300 border-slate-100' : 'border-brand-200 text-brand-700 hover:bg-brand-50'}">
          ${toPersianDigits(slot.replace(/-/, ' تا '))}${isTaken ? ' (رزرو)' : ''}
        </button>`;
      }).join('')}
    </div>
    <button type="button" id="appt-back-to-day" class="mt-4 text-xs text-slate-400">‹ بازگشت به تقویم</button>
  `;
}

// ---------- Interaction handlers (event delegation) ----------
document.addEventListener('change', (e) => {
  const checkEl = e.target.closest('[data-check]');
  if (checkEl) {
    const contactId = Number(checkEl.dataset.contact);
    const kind = checkEl.dataset.check;
    const edit = state.edits[contactId];
    const checked = checkEl.checked;
    const today = toISO(new Date());

    if (kind === 'first_call') {
      edit.first_call = checked ? 'answered' : null;
      if (checked) { if (!edit.first_call_date) edit.first_call_date = today; }
      else { edit.first_result = null; edit.first_call_date = null; edit.second_call = null; edit.second_result = null; edit.second_call_date = null; }
    } else if (kind === 'first_no_answer') {
      edit.first_call = checked ? 'no_answer' : null;
      edit.first_result = null;
      if (checked) { if (!edit.first_call_date) edit.first_call_date = today; }
      else { edit.first_call_date = null; edit.second_call = null; edit.second_result = null; edit.second_call_date = null; }
    } else if (kind === 'second_call') {
      edit.second_call = checked ? 'answered' : null;
      if (checked) { if (!edit.second_call_date) edit.second_call_date = today; }
      else { edit.second_result = null; edit.second_call_date = null; }
    } else if (kind === 'second_no_answer') {
      edit.second_call = checked ? 'no_answer' : null;
      edit.second_result = null;
      if (checked) { if (!edit.second_call_date) edit.second_call_date = today; }
      else { edit.second_call_date = null; }
    } else if (kind === 'meeting_no_show') {
      edit.meeting_result = checked ? 'no_show' : null;
    } else if (kind === 'meeting_registered') {
      edit.meeting_result = checked ? 'registered' : null;
    }
    renderActivePage();
  }
});

document.addEventListener('input', (e) => {
  const fieldEl = e.target.closest('[data-field]');
  if (fieldEl) {
    const contactId = Number(fieldEl.dataset.contact);
    state.edits[contactId][fieldEl.dataset.field] = fieldEl.value;
    // بدون رندر مجدد کل صفحه تا فوکوس کادر متنی از دست نرود
  }
});

document.addEventListener('submit', (e) => {
  if (e.target && e.target.id === 'settings-form') {
    e.preventDefault();
    const form = e.target;
    SB.saveConfig({ url: form.url.value.trim().replace(/\/+$/, ''), anonKey: form.anonKey.value.trim() });
    toast('تنظیمات ذخیره شد، در حال دریافت اطلاعات…', 'info');
    loadData().then(() => goToPage('contacts'));
  }
});

document.addEventListener('click', async (e) => {
  const navBtn = e.target.closest('[data-page]');
  if (navBtn) { goToPage(navBtn.dataset.page); return; }

  const tabBtn = e.target.closest('[data-tab]');
  if (tabBtn) { state.activeTab = tabBtn.dataset.tab; renderTabs(); renderSubTabs(); renderList(); return; }

  const apptSubBtn = e.target.closest('[data-apptSub]');
  if (apptSubBtn) { state.apptSub = apptSubBtn.dataset.apptsub; renderCalendarPage(); return; }

  const archiveSubBtn = e.target.closest('[data-archiveSub]');
  if (archiveSubBtn) { state.archiveSub = archiveSubBtn.dataset.archivesub; renderSubTabs(); renderList(); return; }

  const toggleEditBtn = e.target.closest('[data-toggle-edit]');
  if (toggleEditBtn) {
    const id = Number(toggleEditBtn.dataset.toggleEdit);
    if (state.editingIds.has(id)) state.editingIds.delete(id); else state.editingIds.add(id);
    renderActivePage();
    return;
  }

  const copyBtn = e.target.closest('[data-copy-phone]');
  if (copyBtn) {
    const id = Number(copyBtn.dataset.copyPhone);
    const phone = state.edits[id]?.phone || '';
    try { await navigator.clipboard.writeText(phone); toast('شماره کپی شد', 'success'); }
    catch { toast('کپی انجام نشد', 'error'); }
    return;
  }

  const openContactBtn = e.target.closest('[data-open-contact]');
  if (openContactBtn) { openContactModal(Number(openContactBtn.dataset.openContact)); return; }

  const pillBtn = e.target.closest('[data-pill]');
  if (pillBtn) {
    const group = pillBtn.closest('[data-pill-group]');
    const contactId = Number(group.dataset.contact);
    const key = group.dataset.pillGroup;
    const value = pillBtn.dataset.pill;
    const edit = state.edits[contactId];
    edit[key] = edit[key] === value ? null : value;
    if (edit[key] !== 'appointment') { edit.appointment_date = null; edit.appointment_time = null; }
    renderActivePage();
    if (edit[key] === 'appointment') openAppointmentModal(contactId);
    return;
  }

  const openApptBtn = e.target.closest('[data-open-appt]');
  if (openApptBtn) { openAppointmentModal(Number(openApptBtn.dataset.openAppt)); return; }

  const monthNavBtn = e.target.closest('[data-month-nav]');
  if (monthNavBtn && state.apptModal) {
    let { jy, jm } = state.apptModal;
    jm += Number(monthNavBtn.dataset.monthNav);
    if (jm > 12) { jm = 1; jy += 1; } else if (jm < 1) { jm = 12; jy -= 1; }
    state.apptModal.jy = jy; state.apptModal.jm = jm;
    renderApptModal();
    return;
  }

  const dayBtn = e.target.closest('[data-pick-day]');
  if (dayBtn && state.apptModal) {
    state.apptModal.selectedISO = dayBtn.dataset.pickDay;
    state.apptModal.step = 'time';
    renderApptModal();
    return;
  }

  const timeBtn = e.target.closest('[data-pick-time]');
  if (timeBtn && state.apptModal) {
    const { contactId, selectedISO } = state.apptModal;
    const edit = state.edits[contactId];
    edit.appointment_date = selectedISO;
    edit.appointment_time = timeBtn.dataset.pickTime;
    closeApptModal();
    renderActivePage();
    return;
  }

  const backBtn = e.target.closest('#appt-back-to-day');
  if (backBtn && state.apptModal) { state.apptModal.step = 'day'; renderApptModal(); return; }

  const saveBtn = e.target.closest('[data-save]');
  if (saveBtn) { await saveCard(Number(saveBtn.dataset.save)); return; }

  if (e.target.closest('#settings-disconnect')) {
    SB.clearConfig();
    setConnStatus(false);
    toast('اتصال قطع شد', 'info');
    goToPage('settings');
    return;
  }

  if (e.target.closest('#btn-notif')) { toast('این بخش به‌زودی فعال می‌شود', 'info'); return; }
  if (e.target.closest('#btn-menu')) { if (SB.isConfigured()) { toast('در حال بروزرسانی…', 'info'); loadData(); } return; }
});

$('#search-input')?.addEventListener('input', (e) => { state.search = e.target.value; renderList(); });
$('#contact-modal-close').addEventListener('click', closeContactModal);
$('#appt-modal-close').addEventListener('click', closeApptModal);

// ---------- Saving ----------
async function saveCard(contactId) {
  if (!SB.isConfigured()) { goToPage('settings'); return; }
  const edit = state.edits[contactId];

  if (edit.first_call === 'answered' && !edit.first_result) { toast('لطفاً نتیجه پیگیری اول را انتخاب کنید', 'error'); return; }
  if (edit.second_call === 'answered' && !edit.second_result) { toast('لطفاً نتیجه پیگیری دوم را انتخاب کنید', 'error'); return; }
  if ((edit.first_result === 'appointment' || edit.second_result === 'appointment') && (!edit.appointment_date || !edit.appointment_time)) {
    toast('لطفاً تاریخ و ساعت قرار را انتخاب کنید', 'error');
    openAppointmentModal(contactId);
    return;
  }

  state.savingIds.add(contactId);
  renderActivePage();

  try {
    if (edit.appointment_date && edit.appointment_time) {
      const conflict = await SB.checkSlotConflict(edit.appointment_date, edit.appointment_time, contactId);
      if (conflict) {
        toast('این ساعت توسط مخاطب دیگری رزرو شده — ساعت دیگری انتخاب کنید', 'error');
        state.savingIds.delete(contactId);
        renderActivePage();
        openAppointmentModal(contactId);
        return;
      }
    }

    const contactPatch = {
      name: edit.name?.trim() || null,
      field: edit.field?.trim() || null,
      phone: edit.phone?.trim() || null,
      notes: edit.notes?.trim() || null
    };
    const followupPatch = {
      contact_id: contactId,
      first_call: edit.first_call, first_result: edit.first_result, first_call_date: edit.first_call_date,
      second_call: edit.second_call, second_result: edit.second_result, second_call_date: edit.second_call_date,
      appointment_date: edit.appointment_date, appointment_time: edit.appointment_time,
      appointment_note: edit.appointment_note?.trim() || null,
      meeting_result: edit.meeting_result,
      updated_at: new Date().toISOString()
    };

    const [savedContact, savedFollowup] = await Promise.all([
      SB.updateContact(contactId, contactPatch),
      SB.upsertFollowup(followupPatch)
    ]);

    state.contacts = state.contacts.map((c) => (c.id === contactId ? savedContact : c));
    state.followups[contactId] = savedFollowup;
    state.edits[contactId] = { ...savedContact, ...savedFollowup };
    state.editingIds.delete(contactId);
    toast('با موفقیت ثبت شد', 'success');
  } catch (err) {
    toast(err.message || 'خطا در ثبت اطلاعات', 'error');
  } finally {
    state.savingIds.delete(contactId);
    renderActivePage();
  }
}

// ---------- Boot ----------
(function boot() {
  if (!SB.isConfigured()) {
    $('#loading-state').classList.add('hidden');
    setConnStatus(false);
    goToPage('settings');
    return;
  }
  setConnStatus(true);
  loadData();
})();
