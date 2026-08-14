// اپلیکیشن پشتیبانی ماهریاب
// منطق اصلی: مدیریت وضعیت مخاطبان، چک‌لیست پیگیری، تقویم قرار، و همگام‌سازی با Supabase

const TABS = [
    { key: 'pending', label: 'پیگیری‌نشده' },
    { key: 'first', label: 'پیگیری اول' },
    { key: 'appointment', label: 'تعیین‌وقت‌شده' },
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
    { key: 'no_show', label: 'حضور نیافته' }
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
const SMS_TEMPLATE = 'اپلیکیشن ماهریاب 🔎جهت نصب داخل کافه بازار کلمه«ماهریاب» جستجو کنید';

const state = {
    contacts: [],
    followups: {},    // contact_id -> saved followup object
    edits: {},         // contact_id -> working copy (contact fields + followup fields) being edited on screen
    activeTab: 'pending',
    apptSub: 'today',
    archiveSub: 'second_followup',
    search: '',
    savingIds: new Set(),
    loaded: false,
    loadError: null,
    apptModal: null    // { contactId, jy, jm, step: 'day'|'time', selectedISO }
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
    if (f.no_show) return 'archive';
    if (f.first_result === 'appointment' || f.second_result === 'appointment') return 'appointment';
    if (f.second_call === 'no_answer') return 'archive';
    if (f.second_call === 'answered' && f.second_result && f.second_result !== 'appointment') return 'archive';
    if (f.first_call === 'answered') return 'first';
    return 'pending';
}
function archiveReason(f) {
    if (!f) return null;
    if (f.no_show) return 'no_show';
    if (f.second_call === 'no_answer') return 'no_answer';
    if (f.second_call === 'answered' && f.second_result && f.second_result !== 'appointment') return 'second_followup';
    return null;
}

function emptyFollowup(contactId) {
    return {
        contact_id: contactId,
        first_call: null, first_result: null,
        second_call: null, second_result: null,
        appointment_date: null, appointment_time: null, appointment_note: null,
        no_show: false,
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
    renderTabs();
    renderSubTabs();
    renderList();
}

function setConnStatus(ok, msg) {
    const el = $('#conn-status');
    if (!SB.isConfigured()) { el.textContent = 'متصل نیست — برای اتصال به Supabase، تنظیمات را بزنید'; return; }
    el.textContent = ok ? 'متصل به Supabase' : `خطا در اتصال: ${msg || ''}`;
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
      ${active ? 'bg-white text-brand-700 border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}">
      ${t.label} <span class="opacity-70">(${counts[t.key] || 0})</span></button>`;
    }).join('');
}

function renderSubTabs() {
    const root = $('#subtabs');
    if (state.activeTab === 'appointment') {
        root.innerHTML = APPT_SUBTABS.map((t) => subtabBtn(t, state.apptSub, 'apptSub')).join('');
    } else if (state.activeTab === 'archive') {
        root.innerHTML = ARCHIVE_SUBTABS.map((t) => subtabBtn(t, state.archiveSub, 'archiveSub')).join('');
    } else {
        root.innerHTML = '';
    }
}
function subtabBtn(t, activeKey, kind) {
    const active = t.key === activeKey;
    return `<button data-${kind}="${t.key}" class="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border
    ${active ? 'bg-white text-brand-700 border-white' : 'bg-white/10 text-brand-100 border-white/20'}">${t.label}</button>`;
}

// ---------- Rendering: list ----------
function filteredContacts() {
    const term = state.search.trim().toLowerCase();
    const todayStr = toISO(new Date());
    const tomorrowStr = toISO(addDays(new Date(), 1));

    return state.contacts.filter((c) => {
        const f = state.followups[c.id];
        const edit = state.edits[c.id] || f;
        if (computeBucket(f) !== state.activeTab) return false;
        if (state.activeTab === 'archive' && archiveReason(f) !== state.archiveSub) return false;
        if (state.activeTab === 'appointment' && state.apptSub !== 'all') {
            const target = state.apptSub === 'today' ? todayStr : tomorrowStr;
            if (f.appointment_date !== target) return false;
        }
        if (!term) return true;
        const hay = `${edit.name || ''} ${edit.phone || ''} ${edit.field || ''}`.toLowerCase();
        return hay.includes(term);
    });
}

const EMPTY_MESSAGES = {
    pending: 'مخاطبی برای پیگیری باقی نمانده 👏',
    first: 'کسی در مرحلهٔ پیگیری اول نیست',
    appointment: 'وقتی برای این بازه ثبت نشده',
    archive: 'این بخش بایگانی خالی است'
};

function renderList() {
    let list = filteredContacts();
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

    if (state.activeTab === 'appointment' && state.apptSub === 'all') {
        const groups = {};
        list.forEach((c) => {
            const key = state.followups[c.id].appointment_date || 'نامشخص';
            (groups[key] = groups[key] || []).push(c);
        });
        const sortedKeys = Object.keys(groups).sort();
        root.innerHTML = sortedKeys.map((dateKey) => {
            const dayContacts = groups[dateKey].sort((a, b) =>
                (state.followups[a.id].appointment_time || '').localeCompare(state.followups[b.id].appointment_time || ''));
            const header = dateKey === 'نامشخص' ? 'بدون تاریخ' : formatJalaliDate(dateKey);
            return `<p class="text-xs font-bold text-slate-400 px-1 pt-2">${header}</p>` + dayContacts.map(renderCard).join('');
        }).join('');
        return;
    }

    if (state.activeTab === 'appointment') {
        list = [...list].sort((a, b) =>
            (state.followups[a.id].appointment_time || '').localeCompare(state.followups[b.id].appointment_time || ''));
    }
    root.innerHTML = list.map(renderCard).join('');
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

function renderCard(c) {
    const edit = state.edits[c.id] || { ...c, ...emptyFollowup(c.id) };
    const bucket = computeBucket(state.followups[c.id]);
    const saving = state.savingIds.has(c.id);
    const savedMerged = { ...c, ...state.followups[c.id] };
    const dirty = JSON.stringify(savedMerged) !== JSON.stringify(edit);
    const hasAppointmentChoice = edit.first_result === 'appointment' || edit.second_result === 'appointment';

    const bucketBadge = {
        pending: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">پیگیری‌نشده</span>',
        first: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">در حال پیگیری</span>',
        appointment: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">وقت تعیین‌شده</span>',
        archive: '<span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">بایگانی‌شده</span>'
    }[bucket];

    const noAnswer1Hint = edit.first_call === 'no_answer' ? '<span class="text-[11px] text-amber-600">نیاز به تماس مجدد</span>' : '';

    return `
  <div class="card-enter rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden ${bucket === 'archive' ? 'opacity-80' : ''}">
    <div class="px-4 pt-3.5 pb-2">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[11px] font-bold text-brand-700 bg-brand-50 rounded-md px-1.5 py-0.5 shrink-0">#${c.id}</span>
        <input type="text" data-field="name" data-contact="${c.id}" value="${escapeHtml(edit.name || '')}" placeholder="نام مخاطب (اختیاری)"
          class="flex-1 min-w-0 font-bold text-slate-800 text-[15px] bg-transparent outline-none border-b border-transparent focus:border-brand-300 py-0.5" />
        <span class="shrink-0">${bucketBadge}</span>
      </div>
      <input type="text" data-field="field" data-contact="${c.id}" value="${escapeHtml(edit.field || '')}" placeholder="حیطه فعالیت (اختیاری)"
        class="w-full text-xs text-slate-400 bg-transparent outline-none border-b border-transparent focus:border-brand-200 py-0.5" />
      ${noAnswer1Hint}
    </div>

    <div class="mx-4 flex items-center gap-1.5">
      <input type="text" data-field="phone" data-contact="${c.id}" value="${escapeHtml(edit.phone || '')}" dir="ltr" placeholder="شماره تماس"
        class="flex-1 min-w-0 bg-brand-50 rounded-xl px-3 py-2.5 text-brand-700 font-bold text-sm outline-none" />
      <a href="tel:${edit.phone || ''}" title="تماس" class="w-10 h-10 shrink-0 rounded-xl bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z"/></svg>
      </a>
      <a href="${smsHref(edit.phone)}" title="پیامک" class="w-10 h-10 shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </a>
    </div>

    <textarea data-field="notes" data-contact="${c.id}" placeholder="توضیحات کوتاه درباره این مخاطب…"
      class="w-full text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-2 mt-2.5 mx-0 outline-none focus:border-brand-400"
      style="width:calc(100% - 2rem); margin-inline:1rem;" rows="2">${escapeHtml(edit.notes || '')}</textarea>

    <div class="px-4 pt-3 pb-4 mt-1 border-t border-slate-50">
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

      ${hasAppointmentChoice ? `
        <button type="button" data-open-appt="${c.id}"
          class="w-full flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 mt-2 text-emerald-700 text-xs font-bold">
          <span>${edit.appointment_date ? formatJalaliDate(edit.appointment_date) + (edit.appointment_time ? ' — ' + toPersianDigits(edit.appointment_time) : '') : 'انتخاب تاریخ و ساعت قرار'}</span>
          <span>📅</span>
        </button>
        <input type="text" data-field="appointment_note" data-contact="${c.id}" value="${escapeHtml(edit.appointment_note || '')}"
          placeholder="یادداشت قرار (اختیاری)"
          class="w-full border border-emerald-200 bg-emerald-50/60 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-400 mt-2" />
        <label class="flex items-center gap-2 py-1 text-sm text-amber-700 mt-1">
          <input type="checkbox" class="chk w-4 h-4 rounded" data-check="no_show" data-contact="${c.id}" ${edit.no_show ? 'checked' : ''}>
          حضور نیافت
        </label>
      ` : ''}

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
    return String(str ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
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
        const isWeekend = weekday === 5; // پنجشنبه، جمعه
        const isPast = iso < todayISOStr;
        const isToday = iso === todayISOStr;
        const isSelected = iso === selectedISO;
        const disabled = isWeekend || isPast;
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
    <p class="text-[11px] text-slate-400 mt-3">امروز با دایره قرمز مشخص شده.  جمعه و روزهای گذشته قابل انتخاب نیستند.</p>
  `;
}

function buildTimeSlotHtml(m) {
    const { contactId, selectedISO } = m;
    const taken = new Set();
    Object.values(state.followups).forEach((f) => {
        if (f.contact_id !== contactId && f.appointment_date === selectedISO && f.appointment_time && !f.no_show) taken.add(f.appointment_time);
    });

    return `
    <p class="text-sm font-bold text-slate-700 mb-3">${formatJalaliDate(selectedISO)}</p>
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

        if (kind === 'first_call') { edit.first_call = checked ? 'answered' : null; if (!checked) edit.first_result = null; }
        else if (kind === 'first_no_answer') { edit.first_call = checked ? 'no_answer' : null; edit.first_result = null; }
        else if (kind === 'second_call') { edit.second_call = checked ? 'answered' : null; if (!checked) edit.second_result = null; }
        else if (kind === 'second_no_answer') { edit.second_call = checked ? 'no_answer' : null; edit.second_result = null; }
        else if (kind === 'no_show') { edit.no_show = checked; }
        renderList();
    }
});

document.addEventListener('input', (e) => {
    const fieldEl = e.target.closest('[data-field]');
    if (fieldEl) {
        const contactId = Number(fieldEl.dataset.contact);
        state.edits[contactId][fieldEl.dataset.field] = fieldEl.value;
        // بدون رندر مجدد کل لیست تا فوکوس کادر متنی از دست نرود
    }
});

document.addEventListener('click', async (e) => {
    const tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) { state.activeTab = tabBtn.dataset.tab; renderTabs(); renderSubTabs(); renderList(); return; }

    const apptSubBtn = e.target.closest('[data-apptSub]');
    if (apptSubBtn) { state.apptSub = apptSubBtn.dataset.apptsub; renderSubTabs(); renderList(); return; }

    const archiveSubBtn = e.target.closest('[data-archiveSub]');
    if (archiveSubBtn) { state.archiveSub = archiveSubBtn.dataset.archivesub; renderSubTabs(); renderList(); return; }

    const pillBtn = e.target.closest('[data-pill]');
    if (pillBtn) {
        const group = pillBtn.closest('[data-pill-group]');
        const contactId = Number(group.dataset.contact);
        const key = group.dataset.pillGroup;
        const value = pillBtn.dataset.pill;
        const edit = state.edits[contactId];
        edit[key] = edit[key] === value ? null : value;
        if (edit[key] !== 'appointment') { edit.appointment_date = null; edit.appointment_time = null; }
        renderList();
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
        renderList();
        return;
    }

    const backBtn = e.target.closest('#appt-back-to-day');
    if (backBtn && state.apptModal) { state.apptModal.step = 'day'; renderApptModal(); return; }

    const saveBtn = e.target.closest('[data-save]');
    if (saveBtn) { await saveCard(Number(saveBtn.dataset.save)); return; }
});

$('#search-input').addEventListener('input', (e) => { state.search = e.target.value; renderList(); });
$('#btn-refresh').addEventListener('click', () => { if (!SB.isConfigured()) { openSettings(); return; } loadData(); });
$('#appt-modal-close').addEventListener('click', closeApptModal);

// ---------- Saving ----------
async function saveCard(contactId) {
    if (!SB.isConfigured()) { openSettings(); return; }
    const edit = state.edits[contactId];

    if (edit.first_call === 'answered' && !edit.first_result) { toast('لطفاً نتیجه پیگیری اول را انتخاب کنید', 'error'); return; }
    if (edit.second_call === 'answered' && !edit.second_result) { toast('لطفاً نتیجه پیگیری دوم را انتخاب کنید', 'error'); return; }
    if ((edit.first_result === 'appointment' || edit.second_result === 'appointment') && (!edit.appointment_date || !edit.appointment_time)) {
        toast('لطفاً تاریخ و ساعت قرار را انتخاب کنید', 'error');
        openAppointmentModal(contactId);
        return;
    }

    state.savingIds.add(contactId);
    renderList();

    try {
        if (edit.appointment_date && edit.appointment_time) {
            const conflict = await SB.checkSlotConflict(edit.appointment_date, edit.appointment_time, contactId);
            if (conflict) {
                toast('این ساعت توسط مخاطب دیگری رزرو شده — ساعت دیگری انتخاب کنید', 'error');
                state.savingIds.delete(contactId);
                renderList();
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
            first_call: edit.first_call, first_result: edit.first_result,
            second_call: edit.second_call, second_result: edit.second_result,
            appointment_date: edit.appointment_date, appointment_time: edit.appointment_time,
            appointment_note: edit.appointment_note?.trim() || null,
            no_show: !!edit.no_show,
            updated_at: new Date().toISOString()
        };

        const [savedContact, savedFollowup] = await Promise.all([
            SB.updateContact(contactId, contactPatch),
            SB.upsertFollowup(followupPatch)
        ]);

        state.contacts = state.contacts.map((c) => (c.id === contactId ? savedContact : c));
        state.followups[contactId] = savedFollowup;
        state.edits[contactId] = { ...savedContact, ...savedFollowup };
        toast('با موفقیت ثبت شد', 'success');
    } catch (err) {
        toast(err.message || 'خطا در ثبت اطلاعات', 'error');
    } finally {
        state.savingIds.delete(contactId);
        renderTabs();
        renderSubTabs();
        renderList();
    }
}

// ---------- Settings modal ----------
function openSettings() {
    const cfg = SB.getConfig() || {};
    const form = $('#settings-form');
    form.url.value = cfg.url || '';
    form.anonKey.value = cfg.anonKey || '';
    $('#settings-modal').classList.remove('hidden');
}
function closeSettings() { $('#settings-modal').classList.add('hidden'); }

$('#btn-settings').addEventListener('click', openSettings);
$('#settings-close').addEventListener('click', closeSettings);

$('#settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    SB.saveConfig({ url: form.url.value.trim().replace(/\/+$/, ''), anonKey: form.anonKey.value.trim() });
    closeSettings();
    toast('تنظیمات ذخیره شد، در حال دریافت اطلاعات…', 'info');
    await loadData();
});

$('#settings-disconnect').addEventListener('click', () => {
    SB.clearConfig();
    closeSettings();
    setConnStatus(false);
    toast('اتصال قطع شد', 'info');
});

// ---------- Boot ----------
(function boot() {
    renderTabs();
    renderSubTabs();
    if (!SB.isConfigured()) {
        $('#loading-state').classList.add('hidden');
        setConnStatus(false);
        $('#empty-state-text').textContent = 'برای شروع، از دکمه تنظیمات بالا به Supabase متصل شوید';
        $('#empty-state').classList.remove('hidden');
        openSettings();
        return;
    }
    setConnStatus(true);
    loadData();
})();
