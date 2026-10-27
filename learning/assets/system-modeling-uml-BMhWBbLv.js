var e=`## چرا مدل بکشیم؟

**مدل** یه تصویر ساده‌شده از یه سیستمه که عمداً جزئیات رو کنار می‌ذاره، تا بتونی هر بار به یه جنبه فکر کنی. **مدل‌سازی سیستم** یعنی ساختن همچین تصویرهایی، معمولاً به شکل نمودار با یه نمادگذاری استاندارد به اسم **زبان مدل‌سازی یکپارچه** (UML).

مدل‌ها سه جا به کار میان:

- **قبل از ساختن:** برای فهمیدن و بحث درباره‌ی نیازمندی‌ها و امتحان گزینه‌های طراحی. اینجا یه طرح دستی رو تخته معمولاً کافیه.
- **حین ساختن:** برای مستند کردن طراحی، اون‌قدر دقیق که بشه ازش کد نوشت، و گاهی حتی کد رو ازش تولید کرد.
- **بعد از ساختن:** برای فهمیدن یه سیستم موجود، مثلاً قبل از عوض کردنش. اینجا مدل از کد بیرون کشیده می‌شه (مثال پیشرفته دقیقاً همین کار رو می‌کنه).

مدل خود سیستم **نیست**. یه نمای عمداً ناقصه. قدرتش هم همینه: کل سیستم پیچیده‌تر از اونه که یه‌جا تو ذهنت جا بشه.

:::show
**یه مثال روزمره: نقشه‌های یه شهر.**

- **نقشه‌ی مترو** فقط ایستگاه‌ها و خط‌ها رو نشون می‌ده و هیچ‌چی دیگه. فاصله‌ها غلطن، خیابون‌ها نیستن، و برای انتخاب قطار عالیه.
- **نقشه‌ی خیابون‌ها** جاده‌ها و ساختمون‌ها رو نشون می‌ده، ولی این‌که کدوم اتوبوس کجا می‌ره رو نه. برای پیاده‌روی عالیه.
- **نقشه‌ی کاربری زمین** منطقه‌ها رو بر اساس کاربری رنگ می‌کنه: مسکونی، صنعتی، پارک. برای یه برنامه‌ریز شهری عالیه، و برای پیدا کردن یه کافه بی‌فایده.
- هیچ‌کدوم «شهر» نیست، و هیچ‌کدوم «غلط» نیست. هر کدوم چیزی رو که برای یه سؤال مهم نیست کنار می‌ذاره.
- نمودارهای UML هم همین‌جوری‌ان. نمودار کلاس، نمودار توالی و نمودار حالت یه سیستم، به سؤال‌های مختلفی جواب می‌دن.
:::

## چهار دیدگاه

سامرویل چهار دیدگاه برای مدل‌سازی یه سیستم توصیف می‌کنه:

1. **زمینه (دیدگاه بیرونی):** سیستم کجای محیطش قرار داره: با کدوم سیستم‌ها و آدم‌های دیگه کار می‌کنه.
2. **دیدگاه تعامل:** سیستم چطور با کاربرها و سیستم‌های دیگه تعامل داره، و بخش‌های خودش چطور با هم.
3. **دیدگاه ساختاری:** سیستم چطور سازمان‌دهی شده: کلاس‌ها یا کامپوننت‌هاش و رابطه‌شون.
4. **دیدگاه رفتاری:** سیستم در طول زمان چطور رفتار می‌کنه و به رویدادها و داده‌ها جواب می‌ده.

UML سیزده نوع نمودار داره، ولی بیشتر تیم‌ها فقط پنج تاش رو مرتب استفاده می‌کنن: نمودارهای **فعالیت**، **مورد کاربرد**، **توالی**، **کلاس** و **حالت**.

## مدل زمینه و نمودار فعالیت

**مدل زمینه** (context model) مرزهای سیستم رو نشون می‌ده: چی داخل سیستمه و چی بیرونش. این معمولاً به همون اندازه که تصمیم فنیه، تصمیم سیاسیه: «رزرو نوبت بخشی از سیستم ماست، یا به سیستم رزرو موجود وصل می‌شیم؟»

یه نمودار زمینه‌ی ساده برای یه سیستم اطلاعات بیمار (MentCare سامرویل) ممکنه نشون بده که به سیستم نوبت‌دهی، سیستم پرونده‌ی بیمار، سیستم نسخه‌نویسی، سیستم پذیرش و یه سیستم گزارش‌گیری مدیریتی وصله.

**نمودار فعالیت** (activity diagram) قدم‌های یه فرایند و جریان بینشون رو نشون می‌ده، مثل یه فلوچارت. برای فرایندهای کسب‌وکاری که سیستم یه بخششه به درد می‌خوره. لوزی‌ها تصمیمن، و میله‌ها جریان‌های موازی رو جدا یا یکی می‌کنن. این فرایند ساده‌شده‌ی بستری اجباری یه بیمار روانیه، به شکلی که Mermaid می‌کشدش:

\`\`\`mermaid
flowchart TD
  A([بیمار خطرناک تشخیص داده شده]) --> B[تأیید تصمیم بستری]
  B --> C{برای دیگران خطرناکه؟}
  C -- بله --> D[پیدا کردن جای امن]
  C -- نه --> E[پذیرش در بیمارستان]
  D --> E
  E --> F[اطلاع به مددکاری]
  E --> G[اطلاع به خانواده]
  F --> H[به‌روزرسانی دفتر ثبت]
  G --> H
\`\`\`

## مدل‌های تعامل: مورد کاربرد و نمودار توالی

یه **مورد کاربرد** (use case) یه تعامل بین کاربرها (به اسم **کنشگر** یا actor) و سیستم رو از دید کاربر توصیف می‌کنه. نمودار مورد کاربرد کنشگرها رو به شکل آدمک و موردهای کاربرد رو به شکل بیضی نشون می‌ده؛ یه نمای کلیه، و هر مورد کاربرد یه توصیف متنی کوتاه هم داره: کنشگرها، داده، محرک، پاسخ و توضیحات.

مثلاً مورد کاربرد «انتقال داده» کنشگر «منشی پزشکی» رو داره و توصیف می‌کنه داده‌ی بیمار چطور از MentCare به یه پایگاه داده‌ی عمومی پرونده‌ی بیمار منتقل می‌شه.

**نمودار توالی** (sequence diagram) پیام‌های بین کنشگرها و شیءها رو برای یه مورد کاربرد، به ترتیب زمانی نشون می‌ده. زمان رو به پایین جریان داره؛ هر شرکت‌کننده یه **خط زندگی** عمودی داره؛ پیکان‌ها پیامن و پیکان‌های خط‌چین برگشت. نمودار توالی بهترین راه نشون دادن «کی کیو صدا می‌زنه، به چه ترتیبی» ـه.

:::show
\`\`\`anim
messages پرستار رابط مجوز پرونده
send پرستار رابط view(P1) | پرستار می‌خواد پرونده‌ی بیمار P1 رو ببینه.
send رابط مجوز allowed(nurse7, P1)? | رابط اول چک می‌کنه: این پرستار اجازه‌ی دیدن این بیمار رو داره؟
send مجوز رابط yes | سرویس مجوز می‌گه آره.
send رابط پرونده load(P1) | تازه حالا رابط داده رو از انبار پرونده‌ها می‌خواد.
send پرونده رابط Sara, allergies... | پرونده برمی‌گرده.
send رابط پرستار show record | به پرستار نشون داده می‌شه.
note | زمان رو به پایین جریان داره. هر پیکان یه صدا زدن متد یا یه پیامه؛ جواب‌ها برعکس برمی‌گردن.
send پرستار رابط view(P9) | حالا بیماری که این پرستار مسئولش نیست.
send رابط مجوز allowed(nurse7, P9)? | همون بررسی.
send مجوز رابط no | اجازه نداره.
send رابط پرستار access denied | انبار پرونده‌ها اصلاً صدا زده نمی‌شه. نمودار دیدن و بازبینی اینو راحت می‌کنه.
\`\`\`
:::

همین تعامل با نمادگذاری نمودار توالی Mermaid (مثال پیشرفته دقیقاً همین نوع متن رو از یه برنامه‌ی در حال اجرا تولید می‌کنه):

\`\`\`mermaid
sequenceDiagram
  Nurse->>UI: view(P1)
  UI->>Auth: allowed(nurse7, P1)
  Auth-->>UI: true
  UI->>Records: load(P1)
  Records-->>UI: record
  UI-->>Nurse: show record
\`\`\`

## مدل‌های ساختاری: نمودار کلاس

**نمودار کلاس** (class diagram) کلاس‌های یه سیستم و **ارتباط‌ها** (associations) بینشون رو نشون می‌ده. تو مرحله‌های اول، کلاس‌ها چیزهای دنیای واقعی‌ان (بیمار، پزشک، ویزیت)؛ بعدها کلاس‌های واقعی تو کد می‌شن.

نمادهای کلیدی:

- کلاس یه جعبه‌ی سه‌قسمتیه: اسم، ویژگی‌ها، عملیات.
- **ارتباط** یه خط بین دو کلاسه. سرهاش **چندتایی** (multiplicity) دارن: \`1\` (دقیقاً یکی)، \`0..1\` (صفر یا یکی)، \`*\` یا \`0..*\` (هر تعداد)، \`1..*\` (حداقل یکی).
- **تعمیم** (generalization، همون ارث‌بری) با یه مثلث توخالی رو به کلاس کلی‌تر کشیده می‌شه: یه \`Doctor\` **یه** \`HospitalStaff\` ـه.
- **تجمیع** (aggregation، لوزی توخالی) یعنی «از ... ساخته شده»: یه \`PatientRecord\` از یه بخش \`Patient\` و چند تا بخش \`Consultation\` ساخته شده.

\`\`\`mermaid
classDiagram
  HospitalStaff <|-- Doctor
  HospitalStaff <|-- Nurse
  Consultation --> "1" Patient : patient
  Consultation --> "1..*" Doctor : doctors
  HospitalStaff : staffId
  HospitalStaff : name
  Doctor : specialty
  Nurse : ward
  Patient : id
  Patient : name
  Consultation : date
  Consultation : notes
\`\`\`

چندتایی‌ها رو مثل جمله بخون: «هر ویزیت برای دقیقاً **یه** بیماره. هر ویزیت **یه یا چند** پزشک داره.» چندتایی‌ها نیازمندی‌های در لباس مبدلن: اگه کد اجازه‌ی یه ویزیت بدون پزشک رو بده، با مدل مخالفه (مثال متوسط اینو چک می‌کنه).

## مدل‌های رفتاری: نمودار حالت

**مدل‌های رفتاری** نشون می‌دن وقتی سیستم به محرک‌ها جواب می‌ده چی می‌شه. دو نوع محرک داریم:

- **داده:** داده می‌رسه و باید پردازش بشه. نمودارهای **جریان داده** و فعالیت قدم‌های پردازش رو نشون می‌دن.
- **رویداد:** یه اتفاقی می‌افته که یه واکنش رو به راه می‌ندازه، معمولاً بسته به حالت فعلی. **نمودار حالت** (state machine) اینو نشون می‌ده.

نمودار حالت **حالت‌ها** (جعبه‌های گوشه‌گرد)، **گذارها** (پیکان‌هایی با برچسب رویدادی که باعثشون می‌شه) و یه حالت اولیه داره. مثال کلاسیک سامرویل یه مایکروویوه:

\`\`\`mermaid
stateDiagram-v2
  [*] --> Waiting
  Waiting --> FullPower: full power
  Waiting --> HalfPower: half power
  FullPower --> HalfPower: half power
  HalfPower --> FullPower: full power
  FullPower --> SetTime: timer
  HalfPower --> SetTime: timer
  SetTime --> Enabled: door closed
  SetTime --> Disabled: door open
  Disabled --> Enabled: door closed
  Enabled --> Disabled: door open
  Enabled --> Operating: start
  Operating --> Disabled: door open
  Operating --> Waiting: timeout / cancel
\`\`\`

نمودار حالت مخصوصاً برای **سیستم‌های نهفته و بی‌درنگ** باارزشه، ولی برای هر چیزی هم که چرخه‌ی عمر داره: یه سفارش (ثبت‌شده، پرداخت‌شده، ارسال‌شده، تحویل‌شده، مرجوعی)، یه حساب کاربری، یه سند در حال بازبینی. خیلی از باگ‌ها در واقع «یه رویداد تو حالتی رسید که کسی بهش فکر نکرده بود» ـن. نمودار حالت مجبورت می‌کنه به هر ترکیب حالت × رویداد فکر کنی. مثال ساده همین نمودار رو مستقیم به کد قابل اجرا تبدیل می‌کنه.

:::show
\`\`\`anim
graph
node Waiting 0 3
node Power 3 1
node SetTime 6 1
node Enabled 9 3
node Disabled 6 5
node Operating 3 5
arc Waiting Power
arc Power SetTime
arc SetTime Enabled
arc SetTime Disabled
arc Disabled Enabled
arc Enabled Disabled
arc Enabled Operating
arc Operating Disabled
arc Operating Waiting
visit Waiting | مایکروویو تو حالت Waiting (منتظر) شروع می‌کنه.
path Waiting Power | رویداد «توان کامل»: برو به حالت توان.
path Power SetTime | رویداد «تایمر»: کاربر زمان پخت رو وارد می‌کنه.
path SetTime Enabled | رویداد «در بسته شد»: صفحه می‌گه آماده.
path Enabled Operating | رویداد «شروع»: مایکروویو کار می‌کنه.
path Operating Disabled | رویداد «در باز شد» وسط پخت! مدل می‌گه: برو به Disabled و وایسا.
side از Disabled پیکانی برای «شروع» هست؟ | نه. پس زدن شروع با در باز هیچ کاری نمی‌کنه. ایمنی، از روی طراحی.
path Disabled Enabled | رویداد «در بسته شد»: برگشت به آماده.
\`\`\`
:::

## مهندسی مدل‌محور

بعضی تیم‌ها جلوتر می‌رن: تو **مهندسی مدل‌محور** (MDE)، مدل‌ها محصول اصلی‌ان و کد از روشون **تولید** می‌شه. روش **معماری مدل‌محور** (MDA) سه سطح داره:

- یه **مدل مستقل از محاسبه** (خود حوزه، بدون هیچ جزئیات کامپیوتری)؛
- یه **مدل مستقل از سکو** (طراحی سیستم، بدون انتخاب فناوری)؛
- **مدل‌های وابسته به سکو** (طراحی برای یه فناوری، مثل جاوا یا یه پایگاه داده‌ی مشخص)، که کد ازشون تولید می‌شه.

MDE تو بعضی حوزه‌ها خوب جواب می‌ده، مثل نرم‌افزار نهفته‌ی خودرو و هوافضا، جایی که ابزارها از ماشین‌های حالت و مدل‌های جریان داده کد گواهی‌شده تولید می‌کنن. برای نرم‌افزار کسب‌وکار عمومی کمتر رایجه: مدل‌ها به اندازه‌ی کد پیچیده می‌شن و ابزارها گرونن. بیشتر تیم‌ها از UML به‌عنوان **طرح دستی** (برای فکر کردن و ارتباط) یا **مستندات** استفاده می‌کنن، نه به‌عنوان زبان برنامه‌نویسی.

## کی به کارت میاد، کی نه؟

| موقعیت | نمودار مفید | چرا |
|---|---|---|
| بحث درباره‌ی یه فرایند کسب‌وکار با کاربرها | نمودار فعالیت | کاربرها قدم‌های فرایند خودشون رو می‌شناسن |
| فهمیدن این‌که تو یه قابلیت کی کیو صدا می‌زنه | نمودار توالی | ترتیب پیام‌ها با یه نگاه |
| طراحی داده‌هایی که سیستم نگه می‌داره | نمودار کلاس | موجودیت‌ها، رابطه‌ها و چندتایی‌ها |
| هر چیزی که چرخه‌ی عمر یا حالت داره | نمودار حالت | مجبورت می‌کنه همه‌ی حالت × رویدادها رو پوشش بدی |
| توافق روی مرز سیستم | نمودار زمینه | نشون می‌ده چی تو دامنه‌ست و چی نیست |
| یه اسکریپت کوچیک | احتمالاً هیچ‌کدوم | کد از مدل کوتاه‌تره |

## مثال ساده: یه ماشین حالت که اجرا می‌شه (جاوااسکریپت)

نمودار حالت مایکروویو رو به یه **جدول گذار** تبدیل می‌کنیم: برای هر حالت، کدوم رویدادها مجازن و به کجا می‌رن. هر حالت یه **عمل ورود** هم داره. رویدادهایی که برای حالت فعلی تو جدول نیستن نادیده گرفته می‌شن، دقیقاً همون‌طور که نمودار می‌گه. آخر کار یه ویژگی خود مدل رو چک می‌کنیم: به همه‌ی حالت‌ها می‌شه رسید؟

\`\`\`javascript
// مایکروویوِ کتاب سامرویل، به شکل یه ماشین حالت جدول‌محور.
// transitions[state][event] = حالت بعدی
const transitions = {
  Waiting:       { fullPower: "FullPower", halfPower: "HalfPower" },
  FullPower:     { halfPower: "HalfPower", timer: "SetTime" },
  HalfPower:     { fullPower: "FullPower", timer: "SetTime" },
  SetTime:       { doorClosed: "Enabled", doorOpen: "Disabled" },
  Disabled:      { doorClosed: "Enabled" },
  Enabled:       { start: "Operating", doorOpen: "Disabled" },
  Operating:     { timeout: "Waiting", doorOpen: "Disabled", cancel: "Waiting" },
};
// کاری که مایکروویو موقع ورود به هر حالت انجام می‌ده
const entry = {
  Waiting: "display the time",
  FullPower: "set power = 600 W",
  HalfPower: "set power = 300 W",
  SetTime: "get number from keypad",
  Disabled: "display 'Not ready'",
  Enabled: "display 'Ready'",
  Operating: "oven on, light on, count down",
};

function run(events) {
  let state = "Waiting";
  for (const e of events) {
    const next = transitions[state][e];
    if (!next) {
      console.log(\`  \${state.padEnd(9)} --\${e}--> ignored (not allowed in this state)\`);
      continue;
    }
    console.log(\`  \${state.padEnd(9)} --\${e}--> \${next.padEnd(9)} : \${entry[next]}\`);
    state = next;
  }
  return state;
}

console.log("normal use:");
run(["fullPower", "timer", "doorClosed", "start", "timeout"]);
console.log("someone opens the door while it's cooking:");
run(["halfPower", "timer", "doorClosed", "start", "doorOpen", "start", "doorClosed", "start"]);
console.log("pressing start before setting anything:");
run(["start", "timeout"]);

// می‌شه خود مدل رو چک کرد: از Waiting به همه‌ی حالت‌ها می‌شه رسید؟
const reached = new Set(["Waiting"]);
for (let changed = true; changed; ) {
  changed = false;
  for (const s of [...reached]) for (const n of Object.values(transitions[s])) if (!reached.has(n)) reached.add(n), (changed = true);
}
console.log(\`reachable states: \${reached.size} of \${Object.keys(transitions).length}\`);
\`\`\`

\`\`\`text
normal use:
  Waiting   --fullPower--> FullPower : set power = 600 W
  FullPower --timer--> SetTime   : get number from keypad
  SetTime   --doorClosed--> Enabled   : display 'Ready'
  Enabled   --start--> Operating : oven on, light on, count down
  Operating --timeout--> Waiting   : display the time
someone opens the door while it's cooking:
  Waiting   --halfPower--> HalfPower : set power = 300 W
  HalfPower --timer--> SetTime   : get number from keypad
  SetTime   --doorClosed--> Enabled   : display 'Ready'
  Enabled   --start--> Operating : oven on, light on, count down
  Operating --doorOpen--> Disabled  : display 'Not ready'
  Disabled  --start--> ignored (not allowed in this state)
  Disabled  --doorClosed--> Enabled   : display 'Ready'
  Enabled   --start--> Operating : oven on, light on, count down
pressing start before setting anything:
  Waiting   --start--> ignored (not allowed in this state)
  Waiting   --timeout--> ignored (not allowed in this state)
reachable states: 7 of 7
\`\`\`

نتیجه‌ها رو بخونیم:

- **کد همون نموداره.** هر پیکان نمودار حالت یه خونه تو جدوله، پس بازبینی کد و بازبینی مدل یه کارن.
- **زدن شروع با در باز نادیده گرفته می‌شه**، چون حالت \`Disabled\` گذاری برای \`start\` نداره. این قانون ایمنی یه \`if\` قایم‌شده یه گوشه نیست؛ تو خود ساختار دیده می‌شه.
- **بررسی دسترس‌پذیری** یه نمونه‌ی کوچیک از **وارسی مدل** (model checking) ـه: تحلیل خود مدل، نه فقط اجراش. حالتی که نمی‌شه بهش رسید معمولاً یه اشتباه طراحیه.
- اینو با جایگزین رایجش مقایسه کن: یه کلاف از پرچم‌هایی مثل \`if (doorOpen && !cooking && timeSet ...)\`. با پنج پرچم بولی ۳۲ ترکیب داریم که بیشترشون بی‌معنی‌ان. ماشین حالت فقط هفت حالت داره، همه اسم‌دار.

## مثال متوسط: چک کردن شیءها با یه مدل کلاس (جاوااسکریپت)

مدل کلاس رو به شکل داده می‌نویسیم: کلاس‌ها، ویژگی‌هاشون، و ارتباط‌ها با چندتایی. بعد چند تا شیء رو که یه برنامه ساخته باهاش چک می‌کنیم، و آخر سر مدل رو به شکل یه نمودار کلاس Mermaid چاپ می‌کنیم. این مهندسی مدل‌محور در اندازه‌ی کوچیکه: یه مدل، که هم برای **چک کردن** داده‌های کد و هم برای **کشیدن** مستندات به کار می‌ره.

\`\`\`javascript
// یه مدل کلاس به شکل داده: کلاس‌ها، ویژگی‌ها و ارتباط‌ها با چندتایی
const model = {
  classes: {
    Patient: ["id", "name"],
    Doctor: ["id", "name", "specialty"],
    Consultation: ["date", "notes"],
  },
  associations: [
    // هر ویزیت برای دقیقاً ۱ بیماره؛ هر بیمار ۰..* ویزیت داره
    { from: "Consultation", role: "patient", to: "Patient", min: 1, max: 1 },
    // هر ویزیت ۱..* پزشک داره
    { from: "Consultation", role: "doctors", to: "Doctor", min: 1, max: Infinity },
  ],
};

// چند تا شیء که یه برنامه ساخته (هر شیء کلاس خودش رو می‌دونه)
const p1 = { class: "Patient", id: "P1", name: "Sara" };
const d1 = { class: "Doctor", id: "D1", name: "Reza", specialty: "psychiatry" };
const objects = [
  p1,
  d1,
  { class: "Consultation", date: "2026-10-01", notes: "first visit", patient: p1, doctors: [d1] },
  { class: "Consultation", date: "2026-10-08", notes: "follow-up", patient: p1, doctors: [] },
  { class: "Consultation", date: "2026-10-09", patient: d1, doctors: [d1] },
  { class: "Prescription", drug: "x" },
];

// هر شیء رو با مدل چک کن
function check(obj) {
  const problems = [];
  const attrs = model.classes[obj.class];
  if (!attrs) return [\`class \${obj.class} is not in the model\`];
  for (const a of attrs) if (obj[a] === undefined) problems.push(\`missing attribute \${a}\`);
  for (const as of model.associations.filter((x) => x.from === obj.class)) {
    const value = obj[as.role];
    const linked = value === undefined ? [] : Array.isArray(value) ? value : [value];
    if (linked.length < as.min || linked.length > as.max)
      problems.push(\`\${as.role}: \${linked.length} linked, model says \${as.min}..\${as.max === Infinity ? "*" : as.max}\`);
    for (const target of linked) if (target.class !== as.to) problems.push(\`\${as.role} must be a \${as.to}, got a \${target.class}\`);
  }
  return problems;
}

objects.forEach((obj, i) => {
  const problems = check(obj);
  console.log(\`object \${i + 1} (\${obj.class}): \${problems.length ? problems.join("; ") : "ok"}\`);
});

// همون مدل، به شکل یه نمودار کلاس Mermaid
console.log("\\nclassDiagram");
for (const [name, attrs] of Object.entries(model.classes)) for (const a of attrs) console.log(\`  \${name} : \${a}\`);
for (const as of model.associations) {
  const many = as.max === Infinity ? \`\${as.min}..*\` : \`\${as.min}\`;
  console.log(\`  \${as.from} --> "\${many}" \${as.to} : \${as.role}\`);
}
\`\`\`

\`\`\`text
object 1 (Patient): ok
object 2 (Doctor): ok
object 3 (Consultation): ok
object 4 (Consultation): doctors: 0 linked, model says 1..*
object 5 (Consultation): missing attribute notes; patient must be a Patient, got a Doctor
object 6 (Prescription): class Prescription is not in the model

classDiagram
  Patient : id
  Patient : name
  Doctor : id
  Doctor : name
  Doctor : specialty
  Consultation : date
  Consultation : notes
  Consultation --> "1" Patient : patient
  Consultation --> "1..*" Doctor : doctors
\`\`\`

نتیجه‌ها رو بخونیم:

- **شیء ۴ یه چندتایی رو می‌شکنه:** یه ویزیت بدون پزشک. مدل می‌گه «1..*»، پس یا کد اشتباهه یا نیازمندی عوض شده و مدل باید به‌روز بشه. در هر صورت، حالا یکی خبردار شد.
- **شیء ۵ دو تا مشکل داره،** از جمله یه پزشک که جای بیمار نشسته. تو یه زبان با نوع‌دهی ضعیف، هیچ‌چی جلوش رو نمی‌گرفت تا وقتی یه گزارش اسم یه پزشک رو تو ستون بیمار نشون بده.
- **کلاس شیء ۶ تو مدل نیست.** کد یه مفهوم تازه (نسخه) پیدا کرده که طراحی هیچ‌وقت توصیفش نکرده. این **رانش مدل** (model drift) ـه، رایج‌ترین راهی که مستندات کهنه می‌شن.
- **نمودار از همون داده‌ای تولید می‌شه** که شیءها رو چک می‌کنه، پس مستندات نمی‌تونن از چیزی که چک می‌شه دور بشن. ۹ خط آخر رو تو هر نمایشگر Mermaid بچسبون تا نقاشیش رو ببینی.

## مثال پیشرفته: بیرون کشیدن نمودار توالی از کد در حال اجرا (جاوااسکریپت)

مدل رو می‌شه از یه سیستم موجود هم بیرون کشید. هر شیء رو تو یه **Proxy** جاوااسکریپت می‌پیچیم که هر صدا زدن متد رو رهگیری می‌کنه، ثبت می‌کنه «کی کیو با چی صدا زد»، و بعد صدا زدن رو رد می‌کنه. بعد از اجرای دو تا درخواست، رد رو هم به شکل متن تورفته و هم به شکل متن نمودار توالی Mermaid چاپ می‌کنیم.

\`\`\`javascript
// کشیدن نمودار توالی از یه برنامه‌ی در حال اجرا: شیءها رو تو یه Proxy بپیچ که صدا زدن‌ها رو ثبت کنه
const trace = [];
let depth = 0;
let current = "Nurse";      // الان کی داره صدا می‌زنه

function traced(name, target) {
  return new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop];
      if (typeof value !== "function") return value;
      return (...args) => {
        const caller = current;
        trace.push({ from: caller, to: name, msg: \`\${prop}(\${args.join(", ")})\`, depth });
        current = name;
        depth++;
        try {
          const result = value.apply(obj, args);
          trace.push({ from: name, to: caller, msg: \`return \${result}\`, depth: depth - 1, reply: true });
          return result;
        } finally {
          depth--;
          current = caller;
        }
      };
    },
  });
}

// سیستم: یه رابط کاربری، یه سرویس مجوز و یه انبار پرونده
const auth = traced("Auth", {
  allowed(user, patient) { return user === "nurse7" && patient !== "P9"; },
});
const records = traced("Records", {
  load(patient) { return patient === "P1" ? "Sara, allergies: penicillin" : "unknown"; },
});
const ui = traced("UI", {
  view(user, patient) {
    if (!auth.allowed(user, patient)) return "access denied";
    return records.load(patient);
  },
});

ui.view("nurse7", "P1");
ui.view("nurse7", "P9");

// رد رو اول به شکل متن، بعد به شکل متن نمودار توالی Mermaid چاپ کن
for (const t of trace) console.log(\`\${"  ".repeat(t.depth)}\${t.reply ? \`\${t.to} <-- \${t.from}\` : \`\${t.from} --> \${t.to}\`}: \${t.msg}\`);
console.log("\\nsequenceDiagram");
for (const t of trace) console.log(\`  \${t.from}\${t.reply ? "-->>" : "->>"}\${t.to}: \${t.msg}\`);
\`\`\`

\`\`\`text
Nurse --> UI: view(nurse7, P1)
  UI --> Auth: allowed(nurse7, P1)
  UI <-- Auth: return true
  UI --> Records: load(P1)
  UI <-- Records: return Sara, allergies: penicillin
Nurse <-- UI: return Sara, allergies: penicillin
Nurse --> UI: view(nurse7, P9)
  UI --> Auth: allowed(nurse7, P9)
  UI <-- Auth: return false
Nurse <-- UI: return access denied

sequenceDiagram
  Nurse->>UI: view(nurse7, P1)
  UI->>Auth: allowed(nurse7, P1)
  Auth-->>UI: return true
  UI->>Records: load(P1)
  Records-->>UI: return Sara, allergies: penicillin
  UI-->>Nurse: return Sara, allergies: penicillin
  Nurse->>UI: view(nurse7, P9)
  UI->>Auth: allowed(nurse7, P9)
  Auth-->>UI: return false
  UI-->>Nurse: return access denied
\`\`\`

نتیجه‌ها رو بخونیم:

- **رد، رفتار واقعیه،** نه چیزی که کسی یادش مونده یا قصدش رو داشته. مثلاً تأیید می‌کنه که برای P9 انبار پرونده‌ها **هیچ‌وقت صدا زده نمی‌شه**. بازبینی که می‌پرسه «قبل از چک کردن مجوز، داده رو بار می‌کنیم؟» یه جواب قطعی می‌گیره.
- **متغیر \`current\` صداکننده رو دنبال می‌کنه،** و \`depth\` تورفتگی رو می‌سازه، پس صدا زدن‌های تودرتو مثل میله‌های فعال‌سازی رو نمودار توالی دیده می‌شن.
- **خروجی Mermaid یه نمودار واقعیه:** تو یه نمایشگر Mermaid بچسبونش و همون نقاشی بالاتر این مبحث رو می‌گیری، که از اجرا تولید شده.
- ابزارهای واقعی همین کار رو در مقیاس بزرگ‌تر می‌کنن: سیستم‌های **ردگیری توزیع‌شده** (distributed tracing) مثل OpenTelemetry صدا زدن‌های بین سرویس‌ها رو ثبت می‌کنن و به شکل خط زمانی می‌کشن؛ که همون نمودار توالی برای میکروسرویس‌هاست.

## نگاه یه مهندس ارشد

- **اول طرح دستی، رسمی‌کاری به‌ندرت.** یه نمودار رو تخته که پنج نفر ۲۰ دقیقه سرش بحث کنن، از یه فایل UML بی‌نقص که هیچ‌کس بازش نمی‌کنه باارزش‌تره.
- **نمودارها رو به شکل متن کنار کد نگه دار.** Mermaid یا PlantUML تو مخزن، تو همون درخواست ادغامی بازبینی می‌شه که کد، پس شانس درست موندن داره.
- **برای هر چیزی که چرخه‌ی عمر داره ماشین حالت بکش.** سفارش، پرداخت، حساب، دستگاه: نصف باگ‌هاشون «رویداد تو حالت غیرمنتظره» ـن.
- **چندتایی‌ها نیازمندی‌ان.** «یه ویزیت می‌تونه صفر پزشک داشته باشه؟» سؤالی برای متخصص‌های حوزه‌ست، نه جزئیاتی که برنامه‌نویس حدس بزنه.
- **نموداری که کهنه شده از هیچی بدتره.** فعالانه گمراه می‌کنه. یا زنده نگهش دار یا پاکش کن.

## اشتباه‌های رایج

:::mistakes
- **تلاش برای مدل کردن همه‌چی:** مدل مفیده **چون** چیزهایی رو کنار می‌ذاره.
- **یه بار کشیدن نمودار و هیچ‌وقت به‌روز نکردنش:** از کد دور می‌شه و شروع می‌کنه به دروغ گفتن.
- **استفاده از نمودار کلاس برای نشون دادن رفتار:** نمودار کلاس ساختار رو نشون می‌ده؛ برای «چی می‌شه وقتی» از نمودار توالی یا حالت استفاده کن.
- **نادیده گرفتن چندتایی‌ها:** «1» در برابر «0..1» در برابر «*» ساختار پایگاه داده و کد رو عوض می‌کنه.
- **فراموش کردن مسیرهای ناخوشایند:** نمودارهای توالی که فقط موفقیت رو نشون می‌دن، و نمودارهای حالت بدون گذار «لغو» یا «خطا».
- **یکی گرفتن مدل با سیستم:** تصمیم‌ها باید با سیستم در حال اجرا و کاربرهای واقعی چک بشن.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- مدل یه نمای ساده‌شده از سیستمه که عمداً جزئیات رو کنار می‌ذاره؛ قبل، حین و بعد از ساختن به کار میاد.
- چهار دیدگاه: زمینه، تعامل، ساختار و رفتار.
- پنج نمودار پرکاربرد UML: فعالیت، مورد کاربرد، توالی، کلاس و حالت.
- نمودار توالی پیام‌ها رو به ترتیب زمانی نشون می‌ده؛ نمودار کلاس، کلاس‌ها، ارتباط‌ها، چندتایی‌ها و تعمیم رو.
- نمودار حالت، حالت‌ها، رویدادها و گذارها رو نشون می‌ده؛ برای هر چیزی که چرخه‌ی عمر داره ایده‌آله.
- مدل‌ها رو می‌شه اجرا کرد (ماشین حالت)، برای چک کردن داده به کار برد (مدل کلاس)، یا از کد در حال اجرا بیرون کشید (رد).
- مهندسی مدل‌محور کد رو از مدل تولید می‌کنه؛ تو حوزه‌های نهفته قویه، تو نرم‌افزار کسب‌وکار کمتر رایجه.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  R["نیازمندی‌ها"] --> U["مدل‌سازی UML"]
  U --> A["معماری"]
  U --> D["طراحی و الگوها"]
  U --> T["تست (تست مبتنی بر حالت)"]
\`\`\`

مبحث بعدی [طراحی معماری](/software-engineering/architectural-design) ـه: انتخاب ساختار کلی یه سیستم، که بزرگ‌ترین مدل ساختاری از همه‌ست.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** چندتایی این ارتباط‌ها رو بنویس و بگو هر کدوم به زبون ساده چه معنی‌ای داره: (الف) یه \`Library\` (کتابخونه) و \`Book\`هاش؛ (ب) یه \`Book\` و \`Author\`هاش (نویسنده‌ها)؛ (ج) یه \`Person\` (آدم) و \`Passport\` (گذرنامه)ش.

:::answer
- **(الف)** \`Library 1 —— 0..* Book\`: هر کتاب مال دقیقاً یه کتابخونه‌ست؛ یه کتابخونه هر تعداد کتاب داره (شاید هیچی، اگه تازه باشه).
- **(ب)** \`Book 0..* —— 1..* Author\`: هر کتاب حداقل یه نویسنده داره؛ یه نویسنده ممکنه تو این سیستم هر تعداد کتاب نوشته باشه.
- **(ج)** \`Person 1 —— 0..1 Passport\`: هر گذرنامه مال دقیقاً یه نفره؛ هر آدم حداکثر یه گذرنامه‌ی فعلی داره (یا هیچی).

سیستم‌های واقعی ممکنه فرق کنن (مثلاً آدم‌های دوتابعیتی دو تا گذرنامه دارن). دقیقاً برای همینه که چندتایی‌ها باید با متخصص‌های حوزه چک بشن.
:::
::::

::::exercise
**تمرین ۲.** با جدول گذار مایکروویو، حالت‌ها و خروجی‌ها رو برای این دنباله‌ی رویداد بنویس: \`fullPower, timer, doorOpen, start, doorClosed, start, cancel\`.

:::answer
1. Waiting --fullPower--> FullPower: set power = 600 W
2. FullPower --timer--> SetTime: get number from keypad
3. SetTime --doorOpen--> Disabled: display 'Not ready'
4. Disabled --start--> نادیده گرفته می‌شه
5. Disabled --doorClosed--> Enabled: display 'Ready'
6. Enabled --start--> Operating: oven on, light on, count down
7. Operating --cancel--> Waiting: display the time

مایکروویو تو \`Waiting\` تموم می‌کنه.
:::
::::

::::exercise
**تمرین ۳.** یه سفارش اینترنتی از این حالت‌ها رد می‌شه: Created (ثبت‌شده)، Paid (پرداخت‌شده)، Shipped (ارسال‌شده)، Delivered (تحویل‌شده)، Cancelled (لغوشده)، Returned (مرجوعی). یه نمودار حالت بکش (با کلمه یا Mermaid). کدوم گذارها **نباید** وجود داشته باشن؟

:::answer
یه نمودار منطقی:

\`\`\`mermaid
stateDiagram-v2
  [*] --> Created
  Created --> Paid: payment ok
  Created --> Cancelled: customer cancels
  Paid --> Shipped: dispatched
  Paid --> Cancelled: customer cancels (refund)
  Shipped --> Delivered: delivered
  Delivered --> Returned: return within 14 days
\`\`\`

گذارهایی که **نباید** وجود داشته باشن، مثلاً: Shipped به Cancelled (بسته تو راهه؛ باید تحویل بشه و بعد مرجوع)، Delivered به Paid، Cancelled به Shipped، و Returned به Delivered. هر پیکانی که نیست یه قانون کسب‌وکاره، و ماشین حالت شکستن تصادفیش رو غیرممکن می‌کنه.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه هم‌تیمی تازه می‌گه: «UML منسوخ شده. دیگه هیچ‌کس نمودار نمی‌کشه؛ خود کد مستنداته.» کجا حق داره و کجا اشتباه می‌کنه؟ برای هر کدوم یه موقعیت مشخص بیار.

:::answer
**جایی که حق داره:** مدل‌های UML بزرگ و رسمی که تو یه ابزار جدا کشیده می‌شن و هیچ‌وقت به‌روز نمی‌شن تقریباً از بین رفتن، و چه بهتر: گرون بودن و زود دروغ می‌گفتن. برای یه کد کوچیک با اسم‌گذاری خوب، خوندن کد معمولاً از خوندن یه نمودار سریع‌تره.

**جایی که اشتباه می‌کنه:**

- کد نشون می‌ده **چی هست**، نه **چرا** یا **چی مجازه**. یه نمودار حالت از چرخه‌ی عمر سفارش قانون‌های کسب‌وکار رو تو یه تصویر نشون می‌ده؛ پیدا کردن همون قانون‌ها تو کد یعنی خوندن ده‌ها فایل.
- بعضی سؤال‌ها نمایی لازم دارن که کد اصلاً نمی‌ده. «موقع پرداخت این پنج سرویس به چه ترتیبی همدیگه رو صدا می‌زنن؟» رو یه نمودار توالی جواب می‌ده (که معمولاً ابزارهای ردگیری تولیدش می‌کنن)، نه هیچ فایل تکی‌ای.
- نمودارها راه حرف زدن با **غیربرنامه‌نویس‌ها** ـن: یه پزشک می‌تونه نمودار فعالیت یه فرایند درمانی رو چک کنه؛ جاوا رو نمی‌تونه.

یه موضع متعادل: وقتی به فکر کردن یا ارتباط کمک می‌کنن، نمودار کوچیک بکش، به شکل متن کنار کد نگهشون دار، و هر جا ممکنه از سیستم در حال اجرا تولیدشون کن.
:::
::::
`;export{e as default};