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
    client = null; // اتصال قبلی باطل می‌شود تا با تنظیمات جدید دوباره ساخته شود
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

  // بررسی اینکه آیا یک تاریخ/ساعت مشخص قبلاً برای مخاطب دیگری رزرو شده یا نه
  async function checkSlotConflict(date, time, excludeContactId) {
    const { data, error } = await getClient()
      .from('followups')
      .select('contact_id')
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .eq('no_show', false)
      .neq('contact_id', excludeContactId)
      .limit(1);
    if (error) throw new Error(`خطا در بررسی تداخل ساعت: ${error.message}`);
    return !!(data && data.length > 0);
  }

  return { getConfig, saveConfig, clearConfig, isConfigured, fetchContacts, fetchFollowups, upsertFollowup, updateContact, checkSlotConflict };
})();
