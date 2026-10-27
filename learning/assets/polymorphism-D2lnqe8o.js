var e=`## چندریختی یعنی چی؟

تو [مبحث وراثت](/advanced-programming/inheritance) دیدیم که یه \`Movie\` رو می‌شه به تابعی داد که \`MediaItem&\` می‌خواد.
ولی تابع فقط نسخه‌ی \`MediaItem\` از \`describe\` رو اجرا کرد. فیلم فرصت نکرد خودش رو نشون بده.

**polymorphism** (چندریختی) این مشکل رو حل می‌کنه:
اگه یه تابع تو کلاس پایه **virtual** (مجازی) باشه، صدا زدنش از راه یه ارجاع یا اشاره‌گر به پایه، نسخه‌ی **نوع واقعی** شیء رو اجرا می‌کنه.
یه دستور، رفتارهای مختلف: هر شیء کار رو به روش خودش انجام می‌ده.

:::show
**یه مثال روزمره: رهبر ارکستر.**

رهبر ارکستر دستش رو بالا می‌بره و می‌گه: «بنوازید!»

- نوازنده‌ی ویولن آرشه می‌کشه.
- نوازنده‌ی پیانو کلیدها رو فشار می‌ده.
- نوازنده‌ی درام ضربه می‌زنه.

رهبر لازم نیست به هر کدوم جدا بگه «تو آرشه بکش، تو کلید فشار بده». فقط یه فرمان **کلی** می‌ده، و هر کس به روش **خودش** اجراش می‌کنه.

و اگه فردا یه نوازنده‌ی **ساز جدید** (مثلاً سنتور) به ارکستر اضافه بشه؟ رهبر هیچ چیزی رو عوض نمی‌کنه. همون «بنوازید!»، و نوازنده‌ی جدید خودش می‌دونه چی کار کنه.
:::

فایده‌ی بزرگ چندریختی اینه که برنامه‌ت رو **قابل توسعه** می‌کنه.
فرض کن یه سیستم داری که اعلان‌ها رو با ایمیل و پیامک می‌فرسته. اگه فردا اعلان «push» هم لازم شد، فقط **یه کلاس جدید** می‌نویسی.
حلقه‌ای که همه‌ی اعلان‌ها رو می‌فرسته، **حتی یه خط** عوض نمی‌شه.
(Deitel این رو با یه سیستم حقوق و دستمزد نشون می‌ده. ما همین ایده رو با اعلان‌ها پیاده می‌کنیم.)

## اشاره‌گر پایه به شیء مشتق

یه اشاره‌گر یا ارجاع از نوع پایه، می‌تونه به یه شیء مشتق اشاره کنه:

\`\`\`c++
MediaItem* p = &movie;   // مجازه: هر فیلم یه قلم کتابخونه‌ست
Movie* q = &someItem;    // خطای کامپایل: هر قلم کتابخونه لزوماً فیلم نیست
\`\`\`

از راه اشاره‌گر پایه، فقط عضوهایی قابل صدا زدنن که تو **کلاس پایه** تعریف شدن، حتی اگه شیء واقعی عضوهای بیشتری داشته باشه.
وقتی یه چیزی رو با اسم کلیش صدا می‌زنی، فقط کارهای کلیش رو می‌تونی ازش بخوای.

## تابع مجازی و پیوند پویا

اگه یه تابع تو کلاس پایه با \`virtual\` تعریف بشه، صدا زدنش از راه اشاره‌گر یا ارجاع پایه، **موقع اجرا** تصمیم می‌گیره کدوم نسخه رو اجرا کنه.
به این می‌گن **dynamic binding** (پیوند پویا) یا **late binding** (پیوند دیرهنگام).
«تا لحظه‌ی اجرا صبر کن، ببین شیء واقعاً چیه، و نسخه‌ی خودش رو اجرا کن.»

دو تا کلمه‌ی کمکی:

- **\`override\`:** تو کلاس مشتق، بعد از تابع بنویسش. اگه امضا رو اشتباه بنویسی (مثلاً \`const\` رو جا بندازی)، کامپایلر به جای این‌که بی‌صدا یه تابع جدید بسازه، خطا می‌ده.
- **\`final\`:** جلوی بازتعریف بیشتر، یا مشتق شدن از یه کلاس رو می‌گیره.

اگه تابع رو مستقیم رو یه **شیء** (نه اشاره‌گر یا ارجاع) صدا بزنی، پیوند همیشه ایستاست.

## کلاس انتزاعی و تابع مجازی محض

گاهی کلاس پایه اون‌قدر کلیه که نمی‌شه ازش شیء ساخت.
«یه اعلان» چطوری فرستاده می‌شه؟ معلوم نیست! فقط ایمیل یا پیامک مشخص فرستاده می‌شن.

**pure virtual function** (تابع مجازی محض) با \`= 0\` تعریف می‌شه و بدنه نداره:

\`\`\`c++
virtual void send() const = 0;
\`\`\`

- کلاسی که حداقل یه تابع مجازی محض داشته باشه، **abstract** (انتزاعی) ـه. نمی‌شه ازش شیء ساخت، ولی می‌شه اشاره‌گر و ارجاع بهش داشت.
- هر کلاس مشتق که همه‌ی تابع‌های مجازی محض رو پیاده کنه، **concrete** (عینی) ـه.

:::show
**یه مثال روزمره: «وسیله‌ی نقلیه».**

هیچ‌کس به نمایشگاه نمی‌ره و بگه «یه **وسیله‌ی نقلیه** می‌خوام، لطفاً». فروشنده می‌پرسه: «ماشین؟ موتور؟ دوچرخه؟ قایق؟»

«وسیله‌ی نقلیه» یه **مفهوم کلیه**. یه قول می‌ده: «هر وسیله‌ای **حرکت می‌کنه**، **سوخت** یا انرژی لازم داره، و **ظرفیت** داره.» ولی نمی‌گه **چطوری**.

- ماشین: با بنزین، ۵ نفر، رو جاده.
- دوچرخه: با پا، ۱ نفر.
- قایق: با موتور، رو آب.

این دقیقاً کلاس انتزاعیه:

- \`Vehicle\` با \`virtual void move() = 0;\`: «همه باید حرکت کنن، ولی من نمی‌گم چطوری.»
- \`Car\`، \`Bike\`، \`Boat\`: هر کدوم \`move\` رو به روش خودشون پیاده می‌کنن.
- \`Vehicle v;\` خطاست (یه «وسیله‌ی نقلیه» خالی نمی‌شه خرید)، ولی \`Vehicle& v = myCar;\` درسته.
:::

## مخرب مجازی

اگه یه شیء رو از راه اشاره‌گر به پایه \`delete\` کنی، و مخربِ پایه **مجازی نباشه**، رفتار تعریف‌نشده‌ست:

\`\`\`c++
Notification* n = new Email{…};
delete n;   // اگه ~Notification مجازی نباشه: فقط بخش پایه تمیز می‌شه!
\`\`\`

قانون ساده: **هر کلاسی که تابع مجازی داره، باید مخرب مجازی هم داشته باشه**: \`virtual ~Notification() = default;\`.

## پشت صحنه: جدول توابع مجازی

Deitel تو بخش ۱۲.۷ توضیح می‌ده پیوند پویا چطوری پیاده می‌شه:

- برای هر کلاسی که تابع مجازی داره، کامپایلر یه **vtable** (جدول توابع مجازی) می‌سازه: یه آرایه از اشاره‌گر به تابع‌ها، یه خونه برای هر تابع مجازی.
- هر شیء از چنین کلاسی یه اشاره‌گر پنهان به جدول کلاس خودش داره، به اسم **vptr**.

:::show
\`\`\`anim
graph
node email 1 1
node sms 1 5
node Email-vt 5 1
node Sms-vt 5 5
node E::send 9 0
node E::cost 9 2
node S::send 9 4
node S::cost 9 6
arc email Email-vt
arc sms Sms-vt
arc Email-vt E::send
arc Email-vt E::cost
arc Sms-vt S::send
arc Sms-vt S::cost
note | دو تا شیء، از دو تا کلاس. هر شیء یه vptr پنهان داره که به جدول (vtable) کلاس خودش اشاره می‌کنه.
visit email | حلقه‌ی ارسال، با یه Notification* به اولی می‌رسه: n->send(). نمی‌دونه این ایمیله.
path email Email-vt | قدم ۱: از vptr شیء، برو به جدولش.
path Email-vt E::send | قدم ۲: خونه‌ی send تو این جدول رو بردار. Email::send اجرا می‌شه!
visit sms | حالا n به دومی اشاره می‌کنه. همون خط کد: n->send().
path sms Sms-vt | از vptr ـِ این شیء، به جدول خودش.
path Sms-vt S::send | این بار Sms::send اجرا می‌شه. یه خط کد، دو تا رفتار. هزینه: دو تا ارجاع‌زدایی. تقریباً هیچی.
\`\`\`
:::

هزینه‌ش یه اشاره‌گر اضافه تو هر شیء، و دو تا ارجاع‌زدایی تو هر صدا زدنه، که معمولاً ناچیزه.

## \`dynamic_cast\`

گاهی وسط کار چندریختی، باید بدونی یه شیء **دقیقاً** از یه نوع خاصه، تا یه کار مخصوص اون نوع انجام بدی.

\`dynamic_cast<Sms*>(p)\` موقع اجرا چک می‌کنه:

- اگه \`p\` واقعاً به یه \`Sms\` (یا یه نوع مشتق ازش) اشاره کنه، اشاره‌گر درست رو برمی‌گردونه.
- وگرنه \`nullptr\` برمی‌گردونه.

این فقط برای کلاس‌هایی کار می‌کنه که حداقل یه تابع مجازی دارن.
اگه زیاد به \`dynamic_cast\` نیاز پیدا می‌کنی، احتمالاً یه تابع مجازی تو کلاس پایه کمه.

## کی به کارت میاد، کی نه؟

| وضعیت | ابزار |
|---|---|
| چند تا نوع، یه رابط مشترک، و نوع‌های جدید **بعداً** اضافه می‌شن | تابع مجازی + کلاس انتزاعی |
| مجموعه‌ی نوع‌ها ثابته و کوچیکه (مثلاً فقط دایره و مربع) | می‌شه از \`std::variant\` هم استفاده کرد، بدون اشاره‌گر |
| سرعت خیلی حیاتیه (حلقه‌های داغ، میلیون‌ها بار در ثانیه) | [قالب‌ها](/advanced-programming/templates) (چندریختی موقع کامپایل) |
| فقط یه نوع هست | تابع معمولی. \`virtual\` بی‌دلیل یه پیچیدگی اضافه‌ست |

## مثال ساده: ارسال اعلان‌ها با چندریختی (++C)

\`Notification\` یه کلاس انتزاعیه. \`Email\`، \`Sms\` و \`Push\` پیاده‌ش می‌کنن.
همه رو تو یه \`std::vector\` از \`std::unique_ptr<Notification>\` نگه می‌داریم.
(\`std::unique_ptr\` یه **اشاره‌گر هوشمند**ـه که وقتی از بین می‌ره، شیء رو خودکار \`delete\` می‌کنه. جزئیاتش رو تو [مبحث استثناها](/advanced-programming/exception-handling) می‌بینیم.)

\`\`\`cpp
#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Notification {                                   // انتزاعی
public:
    explicit Notification(std::string to) : recipient{to} {}
    virtual ~Notification() = default;                 // مخرب مجازی
    virtual void send() const = 0;                     // مجازی محض
    virtual int cost() const { return 0; }             // مجازی با پیاده‌سازی پیش‌فرض
    const std::string& to() const { return recipient; }
private:
    std::string recipient;
};

class Email : public Notification {
public:
    Email(std::string to, std::string s) : Notification{to}, subject{s} {}
    void send() const override { std::cout << "email to " << to() << ": " << subject << '\\n'; }
private:
    std::string subject;
};

class Sms : public Notification {
public:
    Sms(std::string to, std::string t) : Notification{to}, text{t} {}
    void send() const override { std::cout << "sms to " << to() << ": " << text.size() << " chars\\n"; }
    int cost() const override { return 1 + static_cast<int>(text.size()) / 70; }   // هر ۷۰ حرف یه پیام
private:
    std::string text;
};

class Push final : public Notification {               // کسی نمی‌تونه از Push مشتق بشه
public:
    using Notification::Notification;
    void send() const override { std::cout << "push to " << to() << '\\n'; }
};

int main() {
    std::vector<std::unique_ptr<Notification>> outbox;
    outbox.push_back(std::make_unique<Email>("sara@example.com", "Exam moved"));
    outbox.push_back(std::make_unique<Sms>("0912", "Your code is 4417"));
    outbox.push_back(std::make_unique<Push>("device-7"));
    outbox.push_back(std::make_unique<Sms>("0935", std::string(150, 'x')));

    int total = 0;
    for (const auto& n : outbox) {       // این حلقه هیچ نوع مشخصی رو نمی‌شناسه
        n->send();
        total += n->cost();
    }
    std::cout << "total cost " << total << '\\n';
    // Notification n{"x"};   ← خطای کامپایل: کلاس انتزاعیه
}
\`\`\`

\`\`\`text
email to sara@example.com: Exam moved
sms to 0912: 17 chars
push to device-7
sms to 0935: 150 chars
total cost 4
\`\`\`

- حلقه‌ی \`for\` فقط با \`Notification\` کار می‌کنه، ولی هر شیء نسخه‌ی \`send\` خودش رو اجرا کرد.
- \`Email\` و \`Push\` تابع \`cost\` رو بازتعریف نکردن، پس نسخه‌ی پیش‌فرض پایه (صفر) براشون اجرا شد. پیامک کوتاه ۱ واحد، و پیامک ۱۵۰ حرفی ۳ واحد.
- وقتی \`outbox\` از بین رفت، \`unique_ptr\`ها همه‌ی شیءها رو آزاد کردن، و چون مخرب مجازیه، هر شیء کامل تمیز شد.

## مثال متوسط: مخرب مجازی و \`dynamic_cast\` (++C)

\`\`\`cpp
#include <iostream>
#include <memory>
#include <vector>

struct Shape {
    virtual ~Shape() { std::cout << "~Shape\\n"; }
    virtual double area() const = 0;
};

struct Circle : Shape {
    explicit Circle(double r) : radius{r} {}
    ~Circle() override { std::cout << "~Circle\\n"; }
    double area() const override { return 3.14159 * radius * radius; }
    double radius;
};

struct Square : Shape {
    explicit Square(double s) : side{s} {}
    double area() const override { return side * side; }
    double side;
};

int main() {
    Shape* s = new Circle{1.0};
    delete s;                                        // هر دو مخرب اجرا می‌شن

    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Square>(2));
    shapes.push_back(std::make_unique<Circle>(3));
    shapes.push_back(std::make_unique<Square>(1));
    for (const auto& sh : shapes)
        if (auto* c = dynamic_cast<Circle*>(sh.get()))   // فقط دایره‌ها
            std::cout << "circle radius " << c->radius << '\\n';
    std::cout << "done\\n";
}
\`\`\`

\`\`\`text
~Circle
~Shape
circle radius 3
done
~Shape
~Circle
~Shape
~Shape
\`\`\`

- \`delete s\` اول مخرب \`Circle\` و بعد مخرب \`Shape\` رو اجرا کرد. اگه \`~Shape\` مجازی نبود، این کار رفتار تعریف‌نشده بود.
- \`dynamic_cast\` برای دو تا مربع \`nullptr\` برگردوند، و فقط دایره چاپ شد. مثل پرسیدن «تو دایره‌ای؟».
- آخر \`main\`، سه تا شیء داخل \`shapes\` به ترتیب آزاد شدن. مربع‌ها مخرب خودشون رو ندارن، پس فقط \`~Shape\` براشون چاپ شد.

## مثال پیشرفته: «Ctrl+D» تو یه برنامه‌ی نقاشی (++C)

تو یه برنامه‌ی طراحی (مثل Figma یا PowerPoint)، کاربر چند تا شکل رو انتخاب می‌کنه و می‌زنه **Ctrl+D** (تکثیر).
مشکل: لیست انتخاب‌شده‌ها از نوع \`std::vector<std::unique_ptr<Shape>>\` ـه. چطوری از هر شکل یه **کپی درست** بسازیم، وقتی نمی‌دونیم واقعاً دایره‌ست یا مستطیل؟

- \`Shape copy = *s;\` اصلاً کامپایل نمی‌شه (\`Shape\` انتزاعیه). و اگه نبود، فقط بخش پایه کپی می‌شد (slicing).
- یه زنجیره‌ی \`if (dynamic_cast<Circle*>…) else if (dynamic_cast<Rect*>…)\` کار می‌کنه، ولی با هر شکل جدید باید عوض بشه. همون چیزی که چندریختی قرار بود ازش نجاتمون بده!

راه‌حل معروف (الگوی **Prototype**، یا «سازنده‌ی کپی مجازی»): یه تابع مجازی \`clone()\` که هر کلاس پیاده‌ش می‌کنه: «یه کپی از خودت بساز، هر چی که واقعاً هستی.»

\`\`\`cpp
#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {
public:
    explicit Shape(double x, double y) : x{x}, y{y} {}
    virtual ~Shape() = default;
    virtual std::unique_ptr<Shape> clone() const = 0;    // «از خودت کپی بساز، هر چی که واقعاً هستی»
    virtual std::string name() const = 0;
    virtual double area() const = 0;
    void moveBy(double dx, double dy) { x += dx; y += dy; }
    std::string where() const { return "(" + std::to_string(int(x)) + "," + std::to_string(int(y)) + ")"; }
private:
    double x, y;
};

class Circle : public Shape {
public:
    Circle(double x, double y, double r) : Shape{x, y}, r{r} {}
    std::unique_ptr<Shape> clone() const override { return std::make_unique<Circle>(*this); }
    std::string name() const override { return "circle"; }
    double area() const override { return 3.14159 * r * r; }
private:
    double r;
};

class Rect : public Shape {
public:
    Rect(double x, double y, double w, double h) : Shape{x, y}, w{w}, h{h} {}
    std::unique_ptr<Shape> clone() const override { return std::make_unique<Rect>(*this); }
    std::string name() const override { return "rect"; }
    double area() const override { return w * h; }
private:
    double w, h;
};

using Canvas = std::vector<std::unique_ptr<Shape>>;

Canvas duplicate(const Canvas& selection) {            // همون Ctrl+D یه برنامه‌ی نقاشی
    Canvas copies;
    for (const auto& s : selection) {
        copies.push_back(s->clone());                  // نوع درست کپی می‌شه، بدون این‌که بپرسیم کدومه
        copies.back()->moveBy(10, 10);                 // کپی یه کم کنارتر ظاهر می‌شه
    }
    return copies;
}

void show(const std::string& title, const Canvas& c) {
    std::cout << title << ":";
    for (const auto& s : c) std::cout << ' ' << s->name() << s->where();
    std::cout << '\\n';
}

int main() {
    Canvas page;
    page.push_back(std::make_unique<Circle>(0, 0, 2));
    page.push_back(std::make_unique<Rect>(5, 5, 4, 3));

    Canvas copies = duplicate(page);
    show("original", page);
    show("copies  ", copies);

    double total = 0;
    for (const auto& s : copies) total += s->area();
    std::cout << "area of the copies: " << total << '\\n';
}
\`\`\`

\`\`\`text
original: circle(0,0) rect(5,5)
copies  : circle(10,10) rect(15,15)
area of the copies: 24.5664
\`\`\`

جواب‌ها رو بخون:

- **کپی‌ها نوع درست رو دارن:** دایره کپیِ دایره شد، مستطیل کپیِ مستطیل. \`duplicate\` حتی یه بار هم نپرسید «تو چی هستی؟».
- **کپی‌ها مستقلن:** کپی‌ها جابه‌جا شدن (۱۰، ۱۰)، ولی اصلی‌ها سر جاشون موندن.
- **مساحت‌ها درسته:** \`π × 2² + 4 × 3 ≈ 12.57 + 12 = 24.57\`. یعنی همه‌ی داده‌های بخش مشتق (شعاع، عرض، ارتفاع) هم کپی شدن، نه فقط بخش پایه.
- **قابل توسعه:** اگه فردا یه \`Triangle\` اضافه بشه، فقط باید \`clone()\` خودش رو بنویسه. \`duplicate\` دست نمی‌خوره.

## نگاه یه مهندس ارشد

- **«باز برای توسعه، بسته برای تغییر».** بهترین نشونه‌ی یه طراحی چندریخت خوب: اضافه کردن یه نوع جدید یعنی **یه فایل جدید**، نه ویرایش ده جای کد. اگه با هر نوع جدید مجبوری یه \`switch\` یا زنجیره‌ی \`if\` رو عوض کنی، یه تابع مجازی کمه.
- **\`override\` رو همیشه بنویس.** یه حرف \`const\` جاافتاده، بی‌صدا چندریختی رو خراب می‌کنه، و این یکی از سخت‌ترین باگ‌ها برای پیدا کردنه.
- **کلاس پایه‌ی چندریخت = مخرب مجازی، و معمولاً بدون کپی.** کپی کردن شیءهای چندریخت با سازنده‌ی کپی معمولی خطرناکه (slicing). اگه کپی لازمه، \`clone()\` بذار.
- **سلسله‌مراتب‌های کم‌عمق و رابط‌های کوچیک.** یه کلاس انتزاعی با سه تا تابع مجازی خیلی بهتر از یکی با سی تاست. هر کلاس جدید باید **همه‌شون** رو پیاده کنه.

## اشتباه‌های رایج

:::mistakes
- **فراموش کردن \`virtual\` تو کلاس پایه:** اگه \`send\` تو پایه مجازی نباشه، بازتعریفش تو کلاس مشتق از راه اشاره‌گر پایه دیده نمی‌شه.
- **ننوشتن \`override\`:** اگه امضا یه کم فرق کنه (مثلاً \`const\` جا بیفته)، بی‌صدا یه تابع جدید ساخته می‌شه که هیچ‌وقت از راه پایه صدا زده نمی‌شه. با \`override\` کامپایلر اینو می‌گیره.
- **مخرب غیرمجازی تو کلاس پایه‌ی چندریخت:** \`delete\` از راه اشاره‌گر پایه رفتار تعریف‌نشده می‌شه.
- **نگه داشتن شیء به جای اشاره‌گر:** \`std::vector<Notification>\` غیرممکنه (کلاس انتزاعیه). و اگه پایه انتزاعی نباشه، شیء مشتق موقع کپی **sliced** (بریده) می‌شه و فقط بخش پایه‌ش می‌مونه. از \`std::vector<std::unique_ptr<Base>>\` استفاده کن.
- **صدا زدن تابع مجازی تو سازنده یا مخرب:** داخل سازنده‌ی پایه، شیء هنوز از نوع پایه‌ست، و نسخه‌ی پایه اجرا می‌شه، نه نسخه‌ی مشتق.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- اشاره‌گر یا ارجاع پایه می‌تونه به شیء مشتق اشاره کنه. برعکسش بدون تبدیل مجاز نیست.
- تابع \`virtual\` با پیوند پویا اجرا می‌شه: نوع واقعی شیء تعیین می‌کنه کدوم نسخه اجرا بشه. تو کلاس مشتق \`override\` بنویس.
- تابع مجازی محض (\`= 0\`) کلاس رو انتزاعی می‌کنه. از کلاس انتزاعی نمی‌شه شیء ساخت.
- هر کلاس پایه‌ی چندریخت مخرب مجازی لازم داره.
- پیوند پویا با vtable و vptr پیاده می‌شه. \`dynamic_cast\` نوع واقعی رو موقع اجرا چک می‌کنه.
- برای کپی کردن شیءهای چندریخت، \`clone()\` مجازی بذار.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  IN["وراثت"] --> PO["چندریختی و virtual"]
  PO --> SIO["جریان‌های ورودی/خروجی: istream و ostream چندریختن"]
  PO --> EX["مدیریت استثنا: catch با ارجاع به پایه"]
  PO --> TM["قالب‌ها: چندریختی موقع کامپایل"]
\`\`\`

مبحث بعدی [ورودی/خروجی با جریان‌ها](/advanced-programming/stream-io) ـه.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** خروجی کد زیر چیه؟ اگه \`virtual\` از \`A::who\` حذف بشه چی؟

\`\`\`c++
struct A { virtual void who() const { std::cout << "A\\n"; } virtual ~A() = default; };
struct B : A { void who() const override { std::cout << "B\\n"; } };
int main() {
    B b;
    A& r = b;
    A copy = b;
    r.who();
    copy.who();
}
\`\`\`

:::answer
\`B\` و بعد \`A\`.
\`r\` یه ارجاع به \`b\` ـه، پس پیوند پویا نسخه‌ی \`B\` رو اجرا می‌کنه.
\`copy\` یه شیء **جدید از نوع \`A\`** ـه که از \`b\` بریده شده (slicing). پس \`A\` چاپ می‌شه.
اگه \`virtual\` حذف بشه (و \`override\` هم، تا کامپایل بشه)، هر دو \`A\` چاپ می‌کنن.
:::
::::

::::exercise
**تمرین ۲.** یه کلاس \`Telegram\` به سیستم اعلان‌های مثال ساده اضافه کن که هزینه‌ی هر ارسالش ۲ باشه. کدوم بخش‌های کد قبلی باید عوض بشن؟

:::answer
\`\`\`c++
class Telegram : public Notification {
public:
    using Notification::Notification;
    void send() const override { std::cout << "telegram to " << to() << '\\n'; }
    int cost() const override { return 2; }
};
// outbox.push_back(std::make_unique<Telegram>("@reza"));
\`\`\`
هیچ بخشی از کد قبلی، نه کلاس‌ها و نه حلقه‌ی ارسال، عوض نمی‌شه. فقط یه خط برای اضافه کردن شیء جدید به \`outbox\` لازمه.
:::
::::

::::exercise
**تمرین ۳.** چرا این کد کامپایل نمی‌شه؟

\`\`\`c++
struct Animal { virtual void speak() const = 0; virtual ~Animal() = default; };
struct Dog : Animal { void speak() { } };
Dog d;
\`\`\`

:::answer
\`Dog::speak\` تابع \`const\` نیست، پس \`Animal::speak() const\` رو بازتعریف نمی‌کنه. یه تابع **جدیده**.
در نتیجه تابع مجازی محض پیاده نشده، \`Dog\` هنوز انتزاعیه، و نمی‌شه ازش شیء ساخت.
اگه \`override\` نوشته شده بود، کامپایلر مستقیم می‌گفت «این تابع چیزی رو بازتعریف نمی‌کنه». درستش: \`void speak() const override {}\`.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه همکار تابع \`duplicate\` مثال پیشرفته رو این‌طوری نوشته:

\`\`\`c++
for (const auto& s : selection) {
    if (auto* c = dynamic_cast<Circle*>(s.get())) copies.push_back(std::make_unique<Circle>(*c));
    else if (auto* r = dynamic_cast<Rect*>(s.get())) copies.push_back(std::make_unique<Rect>(*r));
}
\`\`\`

این هم کار می‌کنه. چه مشکلی داره؟

:::answer
دو تا مشکل جدی:

- **شکست بی‌صدا:** اگه فردا یه \`Triangle\` اضافه بشه و کسی یادش بره این تابع رو عوض کنه، مثلث‌ها **بی‌صدا** کپی نمی‌شن! هیچ خطایی، هیچ هشداری. کاربر Ctrl+D می‌زنه و نصف شکل‌هاش گم می‌شن.
- **پخش شدن دانش:** «چطوری یه دایره رو کپی کنیم» باید تو خود کلاس \`Circle\` باشه، نه تو یه تابع جای دیگه. با این روش، هر جای برنامه که کپی لازم داره، یه زنجیره‌ی \`if\` جدید می‌خواد، و همه‌شون باید با هر شکل جدید به‌روز بشن.

با \`clone()\` مجازی محض، اگه \`Triangle\` یادش بره \`clone\` رو بنویسه، **کامپایلر** خطا می‌ده (چون \`Triangle\` انتزاعی می‌مونه و نمی‌شه ازش شیء ساخت). یعنی باگ قبل از این‌که به دست کاربر برسه، پیدا می‌شه.
:::
::::

اگه این تمرین‌ها سخت بودن، [وراثت](/advanced-programming/inheritance) رو یه بار دیگه ببین.
`;export{e as default};