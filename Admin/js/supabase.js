// ماژول ارتباط با Supabase
// مسئولیت: نگهداری تنظیمات اتصال (در localStorage گوشی) و خواندن/نوشتن جداول contacts و followups

const SB = (() => {
  const CONFIG_KEY = 'mahiyab_sb_config_v1';
  let client = null;

  function getConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    client = null; 
  }

  function clearConfig() {
    localStorage.removeItem(CONFIG_KEY);
    client = null;
  }

  function isConfigured() {
    const c = getConfig();
    return !!(c && c.url && c.anonKey);
  }

  function getClient() {
    if (client) return client;
    const cfg = getConfig();
    if (!cfg) throw new Error('برنامه هنوز به Supabase متصل نشده است.');
    client = window.supabase.createClient(cfg.url, cfg.anonKey);
    return client;
  }

  // خواندن همه مخاطبان، مرتب بر اساس id
  async function fetchContacts() {
    const { data, error } = await getClient().from('contacts').select('*').order('id', { ascending: true });
    if (error) throw new Error(`خطا در خواندن مخاطبان: ${error.message}`);
    return data;
  }

  // خواندن همه رکوردهای پیگیری
  async function fetchFollowups() {
    const { data, error } = await getClient().from('followups').select('*');
    if (error) throw new Error(`خطا در خواندن پیگیری‌ها: ${error.message}`);
    return data;
  }

  // درج یا به‌روزرسانی وضعیت پیگیری یک مخاطب (بر اساس contact_id)
  // چون contact_id ستون یکتا (primary/unique) در جدول followups است، upsert همیشه فقط همان
  // یک ردیف را می‌نویسد و ریسک رونویسی تغییرات هم‌زمان سایر پشتیبان‌ها روی مخاطبان دیگر وجود ندارد.
  async function upsertFollowup(record) {
    const { data, error } = await getClient()
      .from('followups')
      .upsert(record, { onConflict: 'contact_id' })
      .select()
      .single();
    if (error) throw new Error(`خطا در ثبت اطلاعات: ${error.message}`);
    return data;
  }

  // به‌روزرسانی اطلاعات پایه یک مخاطب (نام، حیطه فعالیت، شماره، توضیحات)
  async function updateContact(id, patch) {
    const { data, error } = await getClient().from('contacts').update(patch).eq('id', id).select().single();
    if (error) throw new Error(`خطا در ذخیره اطلاعات مخاطب: ${error.message}`);
    return data;
  }

  // افزودن مخاطب جدید
  async function createContact(patch) {
    const { data, error } = await getClient().from('contacts').insert(patch).select().single();
    if (error) throw new Error(`خطا در افزودن مخاطب: ${error.message}`);
    return data;
  }

  // بررسی اینکه آیا یک تاریخ/ساعت مشخص قبلاً برای مخاطب دیگری رزرو شده یا نه
  // (فیلتر meeting_result روی سرور انجام نمی‌شود چون ردیف‌های NULL با neq نادیده گرفته می‌شوند؛ اینجا در کلاینت فیلتر می‌کنیم)
  async function checkSlotConflict(date, time, excludeContactId) {
    const { data, error } = await getClient()
      .from('followups')
      .select('contact_id, meeting_result')
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .neq('contact_id', excludeContactId);
    if (error) throw new Error(`خطا در بررسی تداخل ساعت: ${error.message}`);
    return (data || []).some((r) => r.meeting_result !== 'no_show');
  }

  return { getConfig, saveConfig, clearConfig, isConfigured, fetchContacts, fetchFollowups, upsertFollowup, updateContact, createContact, checkSlotConflict };
})();
