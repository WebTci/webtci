var e=`## وقتی چیزی خراب می‌شه

برنامه‌ها همیشه تو شرایط ایدئال اجرا نمی‌شن. فایل ممکنه وجود نداشته باشه، کاربر ممکنه عدد منفی وارد کنه، شبکه ممکنه قطع بشه، یا حافظه تموم بشه.

**exception** (استثنا) راهیه که ++C برای اعلام این‌جور شرایط **غیرعادی** داره:

- جایی که مشکل پیش میاد، یه استثنا **throw** (پرتاب) می‌شه.
- جایی که می‌دونه با اون مشکل چی کار کنه، اون رو **catch** (گرفتن) می‌کنه.

این دو جا ممکنه چند تا تابع با هم فاصله داشته باشن.

قبل از استثناها، تابع‌ها خطا رو با **کد برگشتی** اعلام می‌کردن، مثلاً \`-1\` یا \`false\`.
مشکل این روش اینه که صدازننده خیلی راحت می‌تونه چک کردن کد رو فراموش کنه، و کد اصلی پر از \`if\`های چک خطا می‌شه.

استثنا **نمی‌تونه نادیده گرفته بشه**: اگه کسی نگیرتش، برنامه با \`std::terminate\` متوقف می‌شه.
کد برگشتی مثل یادداشتیه که ممکنه کسی نخونه‌ش. استثنا مثل آژیره: یا کسی جوابش رو می‌ده، یا برنامه می‌ایسته.
علاوه بر این، استثنا کد عادی رو از کد مدیریت خطا جدا می‌کنه.

ولی آژیر رو فقط برای چیزهای واقعاً غیرعادی به صدا درمیاری، نه برای کنترل جریان عادی برنامه.

:::show
**یه مثال روزمره: دکمه‌ی هشدار تو کارخونه.**

یه کارگر رو خط تولید یه قطعه‌ی معیوب می‌بینه. خودش اختیار نداره درباره‌ش تصمیم بگیره، پس **دکمه‌ی هشدار** رو می‌زنه (\`throw\`).

- هشدار به **سرپرست خط** می‌رسه. اگه سرپرست بدونه چی کار کنه، رسیدگی می‌کنه (\`catch\`) و خط دوباره راه می‌افته.
- اگه سرپرست هم ندونه، هشدار به **مدیر کارخونه** می‌رسه.
- تو هر مرحله، کسایی که کارشون نیمه‌تموم مونده، **ابزارشون رو جمع می‌کنن و کنار می‌رن**. کسی وسط راه ابزار روشن ول نمی‌کنه.

و اگه هشدار به بالاترین سطح برسه و **هیچ‌کس** ندونه چی کار کنه؟ کل کارخونه خاموش می‌شه (\`std::terminate\`).
:::

## \`try\`، \`throw\` و \`catch\`

کدی که ممکنه استثنا پرتاب کنه، تو یه بلوک \`try\` قرار می‌گیره. بعدش یه یا چند تا بلوک \`catch\` میاد، که هر کدوم یه **نوع** استثنا رو می‌گیره.

- \`throw std::invalid_argument{"negative amount"};\` یه شیء استثنا پرتاب می‌کنه.
- اجرا همون لحظه متوقف می‌شه و می‌ره سراغ اولین \`catch\` مناسب.
- اگه هیچ استثنایی پرتاب نشه، همه‌ی بلوک‌های \`catch\` نادیده گرفته می‌شن.
- بعد از اجرای یه \`catch\`، برنامه از **بعد از** آخرین \`catch\` ادامه پیدا می‌کنه، و به نقطه‌ی پرتاب برنمی‌گرده.

## خونواده‌ی استثناهای استاندارد

همه‌ی استثناهای کتابخونه‌ی استاندارد از \`std::exception\` مشتق شدن، که تابع مجازی \`what()\` رو داره و یه توضیح متنی برمی‌گردونه.

- **\`std::logic_error\`**: خطاهایی که با چک کردن ورودی، قابل پیشگیری بودن، مثل \`invalid_argument\` و \`out_of_range\`. یعنی برنامه‌نویس می‌تونست جلوش رو بگیره.
- **\`std::runtime_error\`**: خطاهایی که فقط موقع اجرا معلوم می‌شن، مثل \`overflow_error\`.
- **\`std::bad_alloc\`**: وقتی \`new\` نتونه حافظه بگیره.

کلاس‌های استثنای خودت رو هم معمولاً از یکی از این‌ها مشتق می‌کنی.

\`\`\`mermaid
flowchart BT
  LE["logic_error"] --> E["exception"]
  RE["runtime_error"] --> E
  BA["bad_alloc"] --> E
  BC["bad_cast"] --> E
  IA["invalid_argument"] --> LE
  OR["out_of_range"] --> LE
  OV["overflow_error"] --> RE
  ME["InsufficientFunds"] --> RE
\`\`\`

## ترتیب \`catch\` و گرفتن با ارجاع

بلوک‌های \`catch\` **به ترتیب** بررسی می‌شن، و اولین بلوکی که با نوع استثنا جور باشه، اجرا می‌شه.
چون یه \`catch\` برای کلاس پایه، استثناهای کلاس‌های مشتق رو هم می‌گیره، باید \`catch\`های **خاص‌تر رو اول** بنویسی.
اگه \`catch (const std::exception&)\` اول بیاد، بقیه هیچ‌وقت اجرا نمی‌شن. مثل این‌که اول بگی «هر مشکلی بود، با من»؛ دیگه کسی نوبت نمی‌رسه.

- همیشه استثنا رو **با ارجاع ثابت** بگیر (\`const std::exception& e\`). این‌طوری کپی نمی‌شه و **بریده** هم نمی‌شه، پس \`what()\` نسخه‌ی کلاس مشتق رو اجرا می‌کنه.
- \`catch (...)\` هر نوعی رو می‌گیره، و باید آخرین باشه.

## باز شدن پشته و پرتاب دوباره

اگه یه تابع استثنا رو نگیره، اون تابع فوراً تموم می‌شه و استثنا به صدازننده‌ش می‌رسه.
این کار ادامه پیدا می‌کنه تا یه \`catch\` مناسب پیدا بشه. به این می‌گن **stack unwinding** (باز شدن پشته).

تو این مسیر، **مخرب همه‌ی شیءهای محلی** تابع‌هایی که رها می‌شن، اجرا می‌شه.
برای همین [RAII](/advanced-programming/constructors-and-destructors) با استثناها کامل کار می‌کنه: فایل‌ها بسته می‌شن و حافظه آزاد می‌شه، حتی وقتی خطا پیش اومده.

گاهی یه تابع می‌خواد خطا رو **ثبت کنه**، ولی تصمیم نهایی رو به بالادستی‌ها بسپاره.
برای این کار، داخل \`catch\` فقط \`throw;\` می‌نویسه، که **همون** استثنا رو دوباره پرتاب می‌کنه.

:::show
\`\`\`anim
stack
note | پشته‌ی صدا زدن تابع‌ها. هر تابع یه شیء محلی Guard داره که مخربش پیام «close» چاپ می‌کنه.
push main | main شروع شد، و یه Guard به اسم app ساخت.
push load | main تابع load رو صدا زد. Guard به اسم file.
push parse | load تابع parse رو صدا زد. Guard به اسم parser.
peek | تو parse: throw runtime_error("bad header")! parse خودش catch نداره.
pop | پس parse فوراً تموم می‌شه. قبل از رفتن، مخرب parser اجرا می‌شه: close parser.
peek | استثنا به load رسید. load یه catch داره: خطا رو ثبت می‌کنه (log: bad header)…
peek | …و با throw; همون استثنا رو دوباره بالا می‌فرسته.
pop | load هم تموم می‌شه: close file.
peek | استثنا به try تو main رسید. Guard به اسم app داخل try بود، پس اول اونم بسته می‌شه: close app.
note | بعد catch تو main اجرا می‌شه: handled in main. و برنامه ادامه پیدا می‌کنه. هیچ منبعی باز نموند.
\`\`\`
:::

## استثنا تو سازنده و مخرب

اگه سازنده نتونه شیء رو درست بسازه، باید استثنا پرتاب کنه. این تنها راهه، چون سازنده مقدار برگشتی نداره.

- تو این حالت، شیء **هیچ‌وقت ساخته نشده** حساب می‌شه، و **مخربش اجرا نمی‌شه**.
- ولی عضوهایی که قبلاً ساخته شده بودن، درست نابود می‌شن.

برای همین، منابع رو تو عضوهای RAII (مثل \`std::vector\` یا \`std::unique_ptr\`) نگه دار، نه تو اشاره‌گرهای خام.

مخرب‌ها برعکس، **نباید** استثنا پرتاب کنن.
اگه یه مخرب وسط باز شدن پشته استثنا پرتاب کنه، برنامه همون لحظه متوقف می‌شه. کسی که داره پشت سرش تمیز می‌کنه، نباید خودش آژیر بزنه.
مخرب‌ها به‌طور پیش‌فرض \`noexcept\` هستن.

## \`unique_ptr\` و \`noexcept\`

\`std::unique_ptr<T>\` (تو \`<memory>\`) یه **smart pointer** (اشاره‌گر هوشمند) ـه که **مالک** یه شیء رو هیپه، و وقتی خودش از بین بره، اون شیء رو \`delete\` می‌کنه.

- با \`std::make_unique<T>(args)\` ساخته می‌شه.
- اگه بین \`new\` و \`delete\` یه استثنا پرتاب بشه، اشاره‌گر خام نشت می‌کنه. ولی \`unique_ptr\` موقع باز شدن پشته کارش رو درست انجام می‌ده.
- \`unique_ptr\` کپی نمی‌شه، فقط **منتقل** می‌شه (\`std::move\`)، چون یه شیء فقط یه مالک داره. مثل کلید یه انبار: کپی نمی‌شه، فقط می‌شه دادش به یکی دیگه.

**\`noexcept\`** بعد از یه تابع یعنی قول می‌دی این تابع استثنا پرتاب نمی‌کنه.
اگه قول رو بشکنی، برنامه متوقف می‌شه. کامپایلر و کتابخونه از این قول برای بهینه‌سازی استفاده می‌کنن.

:::show
**یه مثال روزمره: ویرایش رو یه کپی، نه رو اصل.**

داری یه قرارداد مهم رو ویرایش می‌کنی، با ده تا تغییر. وسط تغییر ششم، برق می‌ره.

- **اگه رو اصل کار می‌کردی:** پنج تا تغییر اعمال شده، پنج تا نه. قرارداد تو یه حالت نیمه‌کاره و بی‌معنیه.
- **اگه رو یه کپی کار می‌کردی:** کپی خراب شد، ولی اصل دست‌نخورده‌ست. وقتی همه‌ی ده تا تغییر درست انجام شد، تازه کپی رو **جای** اصل می‌ذاری، اونم تو یه حرکت.

به این می‌گن **strong exception guarantee** (تضمین قوی): یا همه‌ی کار انجام می‌شه، یا انگار هیچ اتفاقی نیفتاده.
راه معمولش تو ++C: رو یه کپی کار کن، و آخر کار با \`swap\` (که استثنا پرتاب نمی‌کنه) جاشون رو عوض کن. مثال پیشرفته دقیقاً همینه.
:::

## کی به کارت میاد، کی نه؟

| موقعیت | استثنا؟ | چرا |
|---|---|---|
| سازنده نمی‌تونه شیء معتبر بسازه | بله | سازنده راه دیگه‌ای برای گفتن «نشد» نداره |
| فایل تنظیمات خراب، اتصال پایگاه داده قطع | بله | غیرعادیه، و خطا باید چند لایه بالا بره |
| «کاربر پیدا نشد» تو یه جست‌وجوی معمولی | معمولاً نه | یه نتیجه‌ی عادیه. \`std::optional\` یا \`find\` و \`end()\` بهتره |
| پایان یه حلقه‌ی معمولی | نه | استثنا کُنده و جریان کد رو گیج‌کننده می‌کنه |
| داخل مخرب | نه | وسط باز شدن پشته، برنامه رو متوقف می‌کنه |
| اشکال برنامه‌نویس (شرطی که هیچ‌وقت نباید غلط باشه) | گاهی \`assert\` بهتره | اشکال رو باید درست کرد، نه گرفت و ادامه داد |

## مثال ساده: حساب بانکی و کلاس استثنای خودمون (++C)

\`InsufficientFunds\` از \`std::runtime_error\` مشتق می‌شه و مقدار کمبود رو هم نگه می‌داره.
\`withdraw\` برای مبلغ منفی \`invalid_argument\`، و برای موجودی ناکافی \`InsufficientFunds\` پرتاب می‌کنه. \`catch\`ها از خاص به عام چیده شدن.

\`\`\`cpp
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

class InsufficientFunds : public std::runtime_error {
public:
    InsufficientFunds(long need, long have)
        : std::runtime_error{"insufficient funds"}, shortBy{need - have} {}
    long shortBy;
};

class Wallet {
public:
    explicit Wallet(long b) : balance{b} {}
    void withdraw(long amount) {
        if (amount <= 0) throw std::invalid_argument{"amount must be positive"};
        if (amount > balance) throw InsufficientFunds{amount, balance};
        balance -= amount;                   // فقط وقتی همه‌چی درسته
    }
    long getBalance() const { return balance; }
private:
    long balance;
};

int main() {
    Wallet w{500};
    for (long amount : std::vector<long>{200, -50, 400, 100}) {
        try {
            w.withdraw(amount);
            std::cout << "ok " << amount << ", left " << w.getBalance() << '\\n';
        } catch (const InsufficientFunds& e) {               // خاص‌ترین اول
            std::cout << e.what() << ", short by " << e.shortBy << '\\n';
        } catch (const std::invalid_argument& e) {
            std::cout << "bad input: " << e.what() << '\\n';
        } catch (const std::exception& e) {                  // هر چیز دیگه
            std::cout << "other: " << e.what() << '\\n';
        }
    }

    std::vector<int> v(3);
    try {
        v.at(5) = 1;
    } catch (const std::out_of_range&) {
        std::cout << "vector index out of range\\n";
    }
}
\`\`\`

\`\`\`text
ok 200, left 300
bad input: amount must be positive
insufficient funds, short by 100
ok 100, left 200
vector index out of range
\`\`\`

- بعد از هر استثنا، حلقه از مبلغ بعدی ادامه داد.
- موجودی فقط وقتی کم شد که هر دو چک موفق بودن. پس یه برداشت ناموفق، هیچ‌وقت حساب رو تو حالت نیمه‌کاره نذاشت.
- چون \`catch\`ها با \`const&\` بودن، \`e.what()\` توضیح درست رو برگردوند.

## مثال متوسط

### باز شدن پشته و پرتاب دوباره (++C)

همون انیمیشن بالا، به شکل کد. سه تا تابع تودرتو، که هر کدوم یه شیء محلی \`Guard\` دارن:

\`\`\`cpp
#include <iostream>
#include <stdexcept>
#include <string>

struct Guard {
    explicit Guard(std::string n) : name{n} { std::cout << "open " << name << '\\n'; }
    ~Guard() { std::cout << "close " << name << '\\n'; }
    std::string name;
};

void parse() {
    Guard g{"parser"};
    throw std::runtime_error{"bad header"};
    std::cout << "never printed\\n";
}

void load() {
    Guard g{"file"};
    try {
        parse();
    } catch (const std::exception& e) {
        std::cout << "log: " << e.what() << '\\n';
        throw;                                   // همون استثنا رو بفرست بالا
    }
}

int main() {
    try {
        Guard g{"app"};
        load();
    } catch (const std::runtime_error& e) {
        std::cout << "handled in main: " << e.what() << '\\n';
    }
    std::cout << "program continues\\n";
}
\`\`\`

\`\`\`text
open app
open file
open parser
close parser
log: bad header
close file
close app
handled in main: bad header
program continues
\`\`\`

- \`close parser\` **قبل از** \`log\` اومده، چون وقتی کنترل به \`catch\` تو \`load\` رسید، \`parse\` کامل تموم شده بود و شیء محلیش نابود شده بود.
- \`close app\` قبل از پیام \`main\` اومده، چون \`g\` داخل بلوک \`try\` بود.
- \`throw;\` همون شیء استثنا رو دوباره پرتاب کرد، نه یه کپی بریده‌شده ازش.

### سازنده‌ای که شکست می‌خوره، و \`unique_ptr\` (++C)

\`\`\`cpp
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <utility>

struct Guard {
    explicit Guard(std::string n) : name{n} { std::cout << "+" << name << '\\n'; }
    ~Guard() { std::cout << "-" << name << '\\n'; }
    std::string name;
};

class Report {
public:
    explicit Report(bool fail) : header{"header"}, body{std::make_unique<Guard>("body")} {
        if (fail) throw std::runtime_error{"cannot build report"};
        std::cout << "report ready\\n";
    }
    ~Report() { std::cout << "~Report\\n"; }       // فقط برای شیئی که کامل ساخته شده
private:
    Guard header;
    std::unique_ptr<Guard> body;
};

void risky() {
    auto temp = std::make_unique<Guard>("temp");  // با new خام، اینجا نشت می‌کرد
    throw std::logic_error{"oops"};
}

int main() {
    try {
        Report r{true};
    } catch (const std::exception& e) {
        std::cout << "caught: " << e.what() << '\\n';
    }

    try { risky(); } catch (const std::logic_error&) { std::cout << "risky failed\\n"; }

    auto owner = std::make_unique<Guard>("owned");
    auto next = std::move(owner);                 // انتقال مالکیت. کپی ممکن نیست
    std::cout << std::boolalpha << (owner == nullptr) << '\\n';
}
\`\`\`

\`\`\`text
+header
+body
-body
-header
caught: cannot build report
+temp
-temp
risky failed
+owned
true
-owned
\`\`\`

- \`~Report\` هیچ‌وقت چاپ نشد، چون \`Report\` هیچ‌وقت کامل ساخته نشد. ولی \`body\` و \`header\`، به ترتیب برعکس ساخته شدن، درست نابود شدن.
- تو \`risky\`، شیء \`temp\` موقع باز شدن پشته آزاد شد.
- بعد از \`std::move\`، مالکیت به \`next\` رسید و \`owner\` خالی شد. وقتی \`main\` تموم شد، \`next\` شیء رو آزاد کرد: فقط یه بار.

## مثال پیشرفته: وارد کردن فایل پرداخت‌ها، همه یا هیچ (++C)

حسابداری یه فایل CSV از پرداخت‌ها (\`اسم,مبلغ\`) می‌فرسته که باید به دفتر حساب‌ها اضافه بشه. دو تا قانون داریم:

1. **همه یا هیچ:** اگه حتی یه خط خراب باشه، **هیچ** پرداختی نباید اعمال بشه. نصف یه فایل پرداخت، از هیچی بدتره.
2. **همه‌ی خطاها با هم:** اگه فایل ده تا خط خراب داره، حسابدار باید هر ده تا رو یه‌جا ببینه، نه این‌که ده بار فایل رو درست کنه و دوباره بفرسته.

\`\`\`cpp
#include <iostream>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

// استثنای خودمون: می‌گه «کدوم خط» خراب بود، نه فقط «stoi»
class ParseError : public std::runtime_error {
public:
    ParseError(int line, const std::string& why)
        : std::runtime_error{"line " + std::to_string(line) + ": " + why}, line{line} {}
    int line;
};

struct Payment { std::string name; long amount; };

Payment parseLine(const std::string& text, int line) {
    auto comma = text.find(',');
    if (comma == std::string::npos) throw ParseError{line, "missing comma"};
    std::string name = text.substr(0, comma);
    if (name.empty()) throw ParseError{line, "empty name"};
    long amount = 0;
    try {
        std::size_t used = 0;
        amount = std::stol(text.substr(comma + 1), &used);
        if (used != text.size() - comma - 1) throw ParseError{line, "junk after the number"};
    } catch (const std::invalid_argument&) {           // خطاهای خود stol، ترجمه‌شده
        throw ParseError{line, "not a number"};
    } catch (const std::out_of_range&) {
        throw ParseError{line, "number too large"};
    }
    if (amount <= 0) throw ParseError{line, "amount must be positive"};
    return {name, amount};
}

// همه یا هیچ: رو یه کپی کار کن، و فقط اگه همه‌ی خط‌ها درست بودن، جاشون رو عوض کن
std::vector<std::string> applyFile(std::map<std::string, long>& ledger, const std::string& file) {
    std::map<std::string, long> draft = ledger;
    std::vector<std::string> errors;
    std::istringstream in{file};
    std::string text;
    int line = 0;
    while (std::getline(in, text)) {
        ++line;
        try {
            Payment p = parseLine(text, line);
            draft[p.name] += p.amount;
        } catch (const ParseError& e) {               // ادامه بده: همه‌ی خط‌های خراب رو یه‌جا گزارش کن
            errors.push_back(e.what());
        }
    }
    if (errors.empty()) ledger.swap(draft);          // swap استثنا پرتاب نمی‌کنه: ثبت نهایی امنه
    return errors;
}

void show(const std::map<std::string, long>& ledger) {
    for (const auto& [name, total] : ledger) std::cout << "  " << name << " = " << total << '\\n';
}

int main() {
    std::map<std::string, long> ledger{{"Sara", 1000}, {"Reza", 800}};

    const std::string badFile = "Sara,250\\nReza,12x\\nLeila,abc\\nNima\\n,40\\nSara,-5\\nOmid,99999999999999999999\\n";
    auto errors = applyFile(ledger, badFile);
    std::cout << errors.size() << " errors, nothing applied:\\n";
    for (const auto& e : errors) std::cout << "  " << e << '\\n';
    show(ledger);

    const std::string goodFile = "Sara,250\\nReza,120\\nNima,400\\n";
    errors = applyFile(ledger, goodFile);
    std::cout << errors.size() << " errors, applied:\\n";
    show(ledger);
}
\`\`\`

\`\`\`text
6 errors, nothing applied:
  line 2: junk after the number
  line 3: not a number
  line 4: missing comma
  line 5: empty name
  line 6: amount must be positive
  line 7: number too large
  Reza = 800
  Sara = 1000
0 errors, applied:
  Nima = 400
  Reza = 920
  Sara = 1250
\`\`\`

جواب‌ها رو بخون:

- **فایل خراب:** خط اول (\`Sara,250\`) درست بود و تو \`draft\` اعمال شد. ولی چون بقیه‌ی خط‌ها خطا داشتن، \`swap\` انجام نشد و دفتر اصلی دست‌نخورده موند: سارا هنوز ۱۰۰۰ ـه، نه ۱۲۵۰. همون «ویرایش رو کپی».
- **شش تا خطا، یه‌جا:** \`catch\` داخل حلقه نذاشت اولین خطا کل کار رو متوقف کنه.
- **ترجمه‌ی خطا:** \`std::stol\` خودش \`invalid_argument\` و \`out_of_range\` پرتاب می‌کنه، با پیام‌هایی مثل \`"stol"\` که به درد حسابدار نمی‌خوره. \`parseLine\` اون‌ها رو گرفت و یه \`ParseError\` با شماره‌ی خط و توضیح قابل فهم پرتاب کرد.
- **\`12x\`:** \`stol\` با خوشحالی \`12\` رو می‌خونه و بقیه رو نادیده می‌گیره! بدون چک \`used\`، این خط بی‌صدا به‌عنوان \`12\` قبول می‌شد.
- **فایل درست:** هر سه خط درست بودن، \`swap\` انجام شد، و همه‌ی پرداخت‌ها با هم اعمال شدن.

## نگاه یه مهندس ارشد

- **خطا رو تو مرز لایه‌ها ترجمه کن.** \`stol\` نمی‌دونه «خط ۷ فایل پرداخت» یعنی چی. لایه‌ای که این رو می‌دونه، خطای پایین‌دستی رو بگیره و یه خطای با معنی‌تر پرتاب کنه.
- **فقط جایی \`catch\` کن که واقعاً کاری از دستت برمیاد.** \`catch\` کردن، چاپ کردن و ادامه دادن مثل هیچی نشده، بدترین کاره: خطا قایم می‌شه و برنامه با داده‌ی خراب جلو می‌ره.
- **برای هر تابع بپرس: اگه وسطش استثنا بیاد، شیء تو چه حالتی می‌مونه؟** حداقل باید معتبر بمونه (تضمین پایه). برای کارهای مهم، همه یا هیچ (تضمین قوی).
- **منابع رو با RAII مدیریت کن، نه با \`try\`/\`catch\`.** اگه کدت پر از \`catch (...) { delete p; throw; }\` شده، یعنی جای یه \`unique_ptr\` یا یه کلاس مالک خالیه.

## اشتباه‌های رایج

:::mistakes
- **گرفتن با مقدار:** \`catch (std::exception e)\` استثنای مشتق رو می‌بُره و \`what()\` نسخه‌ی پایه رو برمی‌گردونه. بنویس \`catch (const std::exception& e)\`.
- **\`catch\` عام قبل از خاص:** اگه \`catch (const std::exception&)\` اول باشه، \`catch\`های بعدی هیچ‌وقت اجرا نمی‌شن.
- **\`throw e;\` به‌جای \`throw;\`:** \`throw e;\` یه کپی از نوع ایستای \`e\` پرتاب می‌کنه و ممکنه استثنا رو ببُره. برای پرتاب دوباره، فقط \`throw;\` بنویس.
- **پرتاب استثنا از مخرب:** اگه وسط باز شدن پشته اتفاق بیفته، برنامه همون لحظه متوقف می‌شه.
- **\`new\` خام بین دو تا عملی که ممکنه استثنا بدن:** اگه استثنا پیش بیاد، \`delete\` هیچ‌وقت اجرا نمی‌شه. از \`std::make_unique\` یا ظرف‌ها استفاده کن.
- **قایم کردن خطا:** \`catch (...) {}\` خالی، خطا رو می‌خوره و هیچ ردی نمی‌ذاره.
- **استفاده از استثنا برای جریان عادی:** مثلاً پرتاب استثنا برای تموم کردن یه حلقه‌ی معمولی. استثنا کُنده و کد رو گیج‌کننده می‌کنه.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- \`throw\` شرایط غیرعادی رو اعلام می‌کنه. \`try\` و \`catch\` اون رو جایی که می‌دونه چی کار کنه، مدیریت می‌کنن.
- استثناهای استاندارد از \`std::exception\` مشتق شدن. کلاس‌های خودت رو از \`logic_error\` یا \`runtime_error\` مشتق کن.
- با \`const&\` بگیر، و \`catch\`های خاص رو قبل از عام بنویس. \`throw;\` همون استثنا رو دوباره پرتاب می‌کنه.
- موقع باز شدن پشته، مخرب همه‌ی شیءهای محلی اجرا می‌شه. RAII منابع رو امن نگه می‌داره.
- سازنده‌ای که شکست می‌خوره استثنا پرتاب می‌کنه و مخرب خودش اجرا نمی‌شه. مخرب‌ها نباید استثنا پرتاب کنن.
- \`std::unique_ptr\` مالک یه شیئه، در هر حال آزادش می‌کنه، و فقط منتقل می‌شه.
- همه یا هیچ: رو یه کپی کار کن، و آخر کار با \`swap\` جاشون رو عوض کن.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  C["کلاس‌ها، سازنده و مخرب (RAII)"] --> X["مدیریت استثنا"]
  A["الگوریتم‌ها و ظرف‌های STL"] --> X
  X --> T["قالب‌ها"]
  X --> F["پردازش فایل: خطاهای ورودی و خروجی"]
\`\`\`

مبحث بعدی [قالب‌ها](/advanced-programming/templates) ـه.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** خروجی این کد چیه؟

\`\`\`c++
try {
    throw std::out_of_range{"index 9"};
} catch (const std::logic_error& e) {
    std::cout << "logic: " << e.what() << '\\n';
} catch (const std::out_of_range& e) {
    std::cout << "range: " << e.what() << '\\n';
}
\`\`\`

:::answer
\`logic: index 9\`. \`out_of_range\` از \`logic_error\` مشتق شده، پس اولین \`catch\` می‌گیرتش و دومی هیچ‌وقت اجرا نمی‌شه.
GCC حتی هشدار می‌ده که \`catch\` دوم دست‌نیافتنیه. ترتیب رو عوض کن تا خاص‌تر اول بیاد.
:::
::::

::::exercise
**تمرین ۲.** چرا این تابع ممکنه حافظه نشت بده؟ با \`unique_ptr\` درستش کن.

\`\`\`c++
void process() {
    int* buffer = new int[1000];
    parseInput(buffer);      // ممکنه استثنا پرتاب کنه
    delete[] buffer;
}
\`\`\`

:::answer
اگه \`parseInput\` استثنا پرتاب کنه، اجرا هیچ‌وقت به \`delete[]\` نمی‌رسه و حافظه نشت می‌کنه. با اشاره‌گر هوشمند:

\`\`\`c++
void process() {
    auto buffer = std::make_unique<int[]>(1000);
    parseInput(buffer.get());
}   // در هر حال آزاد می‌شه
\`\`\`
یا ساده‌تر: \`std::vector<int> buffer(1000);\` و \`parseInput(buffer.data());\`.
:::
::::

::::exercise
**تمرین ۳.** تو مثال باز شدن پشته، اگه \`load\` به‌جای \`throw;\` بنویسه \`throw std::logic_error{"load failed"};\`، خروجی چه تغییری می‌کنه؟

:::answer
استثنای تازه از نوع \`logic_error\` ـه، نه \`runtime_error\`. \`catch\` تو \`main\` فقط \`runtime_error\` رو می‌گیره، پس هیچ \`catch\`ی پیدا نمی‌شه و برنامه با \`std::terminate\` متوقف می‌شه.
پیام‌های \`handled in main\` و \`program continues\` هیچ‌وقت چاپ نمی‌شن. (این‌که مخرب‌ها تو این حالت اجرا بشن یا نه، به پیاده‌سازی بستگی داره.)
درس: اگه استثنا رو عوض می‌کنی، مطمئن شو بالادستی‌ها نوع تازه رو می‌گیرن.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه تابع \`transfer(from, to, amount)\` اول از \`from\` کم می‌کنه، بعد یه لاگ تو فایل می‌نویسه (که ممکنه استثنا بده، مثلاً دیسک پر باشه)، و بعد به \`to\` اضافه می‌کنه. اگه نوشتن لاگ شکست بخوره، چه مشکلی پیش میاد؟ دو تا راه برای درست کردنش پیشنهاد بده.

:::answer
پول از \`from\` کم شده، ولی به \`to\` نرسیده: **پول غیب شده!** حساب‌ها تو یه حالت نامعتبرن.

راه‌حل‌ها:

1. **ترتیب رو عوض کن:** کارهایی که ممکنه شکست بخورن (مثل نوشتن لاگ، یا چک کردن موجودی) رو **اول** انجام بده، و کارهایی که شکست نمی‌خورن (کم و زیاد کردن دو تا عدد) رو آخر، با هم.
2. **همه یا هیچ با کپی:** رو یه کپی از دو تا حساب کار کن، و فقط اگه همه‌چی موفق بود، با \`swap\` جای اصل‌ها بذار (مثل مثال پیشرفته).
3. (راه سوم: اگه استثنا اومد، تو \`catch\` کم کردن رو برگردون و دوباره پرتاب کن. کار می‌کنه، ولی شکننده‌ست: اگه یه قدم دیگه اضافه بشه، باید یادت باشه اونم برگردونی.)

درس: فقط نپرس «اگه خطا اومد کجا بگیرمش؟». بپرس «اگه وسط این تابع خطا اومد، داده‌ها تو چه حالتی می‌مونن؟».
:::
::::
`;export{e as default};