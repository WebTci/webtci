// ماژول ارتباط با گیت‌هاب
// مسئولیت: نگهداری تنظیمات اتصال (در localStorage گوشی)، خواندن داده از raw یا API،
// و نوشتن تغییرات از طریق GitHub Contents API

const GH = (() => {
  const CONFIG_KEY = 'mahiyab_gh_config_v1';

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
  }

  function clearConfig() {
    localStorage.removeItem(CONFIG_KEY);
  }

  function isConfigured() {
    const c = getConfig();
    return !!(c && c.owner && c.repo && c.token);
  }

  function rawUrl(cfg, path) {
    const branch = cfg.branch || 'main';
    return `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${branch}/${path}?t=${Date.now()}`;
  }

  function apiContentsUrl(cfg, path) {
    return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
  }

  function authHeaders(cfg) {
    return {
      Authorization: `token ${cfg.token}`,
      Accept: 'application/vnd.github+json'
    };
  }

  // خواندن یک فایل JSON. اگر ریپازیتوری خصوصی باشد از API استفاده می‌شود، در غیر این صورت از آدرس raw (سریع‌تر و قابل کش)
  async function readJson(path) {
    const cfg = getConfig();
    if (!cfg) throw new Error('برنامه هنوز به گیت‌هاب متصل نشده است.');

    if (cfg.isPrivate) {
      const res = await fetch(apiContentsUrl(cfg, path) + `?ref=${cfg.branch || 'main'}`, {
        headers: authHeaders(cfg)
      });
      if (!res.ok) throw new Error(`خطا در خواندن ${path} (کد ${res.status})`);
      const json = await res.json();
      const content = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ''))));
      return JSON.parse(content);
    }

    const res = await fetch(rawUrl(cfg, path), { cache: 'no-store' });
    if (!res.ok) throw new Error(`خطا در خواندن ${path} (کد ${res.status})`);
    return res.json();
  }

  // نوشتن (کامیت) یک فایل JSON. همیشه ابتدا sha فعلی فایل گرفته می‌شود تا از تداخل تغییرات جلوگیری شود
  async function writeJson(path, dataObject, commitMessage) {
    const cfg = getConfig();
    if (!cfg) throw new Error('برنامه هنوز به گیت‌هاب متصل نشده است.');

    const getRes = await fetch(apiContentsUrl(cfg, path) + `?ref=${cfg.branch || 'main'}`, {
      headers: authHeaders(cfg)
    });
    if (!getRes.ok) throw new Error(`خطا در دریافت نسخه فعلی فایل (کد ${getRes.status})`);
    const current = await getRes.json();

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(dataObject, null, 2))));

    const putRes = await fetch(apiContentsUrl(cfg, path), {
      method: 'PUT',
      headers: { ...authHeaders(cfg), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: commitMessage || `به‌روزرسانی ${path}`,
        content,
        sha: current.sha,
        branch: cfg.branch || 'main'
      })
    });

    if (!putRes.ok) {
      const errBody = await putRes.json().catch(() => ({}));
      throw new Error(errBody.message || `خطا در ثبت تغییرات (کد ${putRes.status})`);
    }

    return putRes.json();
  }

  return { getConfig, saveConfig, clearConfig, isConfigured, readJson, writeJson };
})();
