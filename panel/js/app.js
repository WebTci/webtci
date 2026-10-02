const K='tms_v1',$=s=>document.querySelector(s);
const ST={pending:'انجام نشده',doing:'در حال انجام',done:'تکمیل شده (منتظر تأیید)',approved:'تأیید شده',overdue:'عقب‌افتاده'};
const PR={high:'بالا',mid:'متوسط',low:'پایین'};
const day=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
const today=day(0),fd=d=>d?new Date(d).toLocaleDateString('fa-IR'):'-';
const seed=()=>({nid:20,users:[
{id:1,name:'مدیر سیستم',user:'admin',pass:'1234',role:'manager',perms:[]},
{id:2,name:'علی رضایی',user:'ali',pass:'1234',role:'admin',perms:[]},
{id:3,name:'سارا احمدی',user:'sara',pass:'1234',role:'admin',perms:['reports']}],
tasks:[
{id:1,title:'تهیه گزارش ماهانه فروش',desc:'جمع‌آوری آمار و ارسال گزارش',due:day(3),pr:'high',assignees:[2],status:'doing',check:[{t:'جمع‌آوری داده',d:true},{t:'تحلیل',d:false},{t:'ارسال',d:false}],report:'',log:[]},
{id:2,title:'بازبینی قراردادها',desc:'',due:day(-2),pr:'high',assignees:[2,3],status:'pending',check:[{t:'بررسی قرارداد ۱',d:false}],report:'',log:[]},
{id:3,title:'به‌روزرسانی وب‌سایت',desc:'اصلاح صفحه تماس',due:day(7),pr:'mid',assignees:[3],status:'pending',check:[],report:'',log:[]},
{id:4,title:'پشتیبانی تیکت‌ها',desc:'',due:day(-5),pr:'low',assignees:[3],status:'approved',check:[{t:'پاسخ تیکت‌ها',d:true}],report:'همه پاسخ داده شد',log:[{d:day(-5),x:'تأیید شد'}]},
{id:5,title:'آموزش کاربران جدید',desc:'',due:day(1),pr:'mid',assignees:[2],status:'done',check:[{t:'ارائه',d:true}],report:'انجام شد',log:[{d:day(0),x:'ثبت برای تأیید'}]}]});
let db=JSON.parse(localStorage.getItem(K)||'null')||seed(),me=null,page='';
const save=()=>localStorage.setItem(K,JSON.stringify(db));
const U=id=>db.users.find(u=>u.id==id)||{name:'؟'};
const st=t=>(t.status==='approved'||t.status==='done')?t.status:(t.due<today?'overdue':t.status);
const badge=t=>`<span class="b b-${st(t)}">${ST[st(t)]}</span>`;
const prb=p=>`<span class="b tag-${p}">${PR[p]}</span>`;
const mgr=()=>me.role==='manager';
const mine=()=>mgr()?db.tasks:db.tasks.filter(t=>t.assignees.includes(me.id));
const pct=t=>t.check.length?Math.round(t.check.filter(c=>c.d).length/t.check.length*100):(['done','approved'].includes(t.status)?100:0);
function stats(ts){const s={total:ts.length,pending:0,doing:0,done:0,approved:0,overdue:0};ts.forEach(t=>s[st(t)]++);s.fin=s.done+s.approved;s.rate=s.total?Math.round(s.fin/s.total*100):0;return s}

function loginList(){$('#lu').innerHTML=db.users.map(u=>`<option value="${u.id}">${u.name} — ${u.role==='manager'?'مدیر سیستم':'ادمین'}</option>`).join('')}
function login(){const u=U($('#lu').value);
 me=u;sessionStorage.setItem('me',u.id);boot()}
function logout(){sessionStorage.removeItem('me');location.reload()}
function boot(){$('#login').classList.add('d-none');$('#app').classList.remove('d-none');
 const m=mgr()?[['dash','speedometer2','داشبورد'],['tasks','list-task','همه وظایف'],['overdue','exclamation-triangle','وظایف باقی‌مانده/عقب‌افتاده'],['review','patch-check','در انتظار تأیید'],['users','people','کاربران و نقش‌ها'],['reports','bar-chart','گزارش عملکرد']]
 :[['my','house','داشبورد من'],['perf','graph-up','عملکرد من']];
 if(!mgr()&&me.perms.includes('reports'))m.push(['reports','bar-chart','گزارش تیم']);
 $('#side').innerHTML=`<div class="brand"><i class="bi bi-check2-square"></i> مدیریت وظایف</div>`+m.map(x=>`<a data-p="${x[0]}" onclick="go('${x[0]}')"><i class="bi bi-${x[1]}"></i>${x[2]}</a>`).join('');
 $('#top').innerHTML=`<div><b>${me.name}</b> <span class="text-muted small">— ${mgr()?'مدیر سیستم':'ادمین'}</span></div><button class="btn btn-outline-dark btn-sm" onclick="logout()"><i class="bi bi-box-arrow-left"></i> خروج</button>`;
 go(m[0][0])}
function go(p){page=p;document.querySelectorAll('#side a').forEach(a=>a.classList.toggle('on',a.dataset.p===p));
 $('#main').innerHTML=({dash,tasks:()=>taskList('همه وظایف',db.tasks,true),overdue,review,users,reports,my:()=>taskList('وظایف من',mine(),false,true),perf})[p]()}

function statCards(s){return `<div class="row g-3 mb-4">`+[['کل وظایف',s.total,''],['انجام‌شده',s.fin,'dark'],['در حال انجام',s.doing,''],['انجام‌نشده',s.pending,''],['عقب‌افتاده',s.overdue,s.overdue?'danger':'']].map(c=>`<div class="col-6 col-md"><div class="stat ${c[2]}"><div class="small opacity-75">${c[0]}</div><div class="n">${c[1]}</div></div></div>`).join('')+`</div>`}
function perfRows(ts){return db.users.filter(u=>u.role==='admin').map(u=>{const s=stats(ts.filter(t=>t.assignees.includes(u.id)));
 return `<tr><td><b>${u.name}</b></td><td>${s.total}</td><td>${s.fin}</td><td>${s.doing}</td><td>${s.pending}</td><td class="${s.overdue?'text-danger fw-bold':''}">${s.overdue}</td><td style="width:150px"><div class="progress"><div class="progress-bar" style="width:${s.rate}%"></div></div><small>${s.rate}٪</small></td></tr>`}).join('')}
const perfTable=ts=>`<div class="table-responsive"><table class="table"><thead><tr><th>ادمین</th><th>کل</th><th>انجام‌شده</th><th>در حال انجام</th><th>انجام‌نشده</th><th>عقب‌افتاده</th><th>نرخ تکمیل</th></tr></thead><tbody>${perfRows(ts)}</tbody></table></div>`;

function dash(){const s=stats(db.tasks);setTimeout(()=>new Chart($('#ch'),{type:'doughnut',data:{labels:['انجام‌شده','در حال انجام','انجام‌نشده','عقب‌افتاده'],datasets:[{data:[s.fin,s.doing,s.pending,s.overdue],backgroundColor:['#111','#888','#ddd','#c00']}]},options:{plugins:{legend:{position:'bottom',labels:{font:{family:'Vazirmatn'}}}}}}),0);
 const od=db.tasks.filter(t=>st(t)==='overdue');
 return `<h5 class="fw-bold mb-3">نمای کلی سیستم</h5>${statCards(s)}<div class="row g-3"><div class="col-lg-4"><div class="cardx"><canvas id="ch"></canvas></div></div><div class="col-lg-8"><div class="cardx"><h6 class="fw-bold">وضعیت عملکرد ادمین‌ها</h6>${perfTable(db.tasks)}</div></div></div>
 <div class="cardx mt-3"><h6 class="fw-bold text-danger"><i class="bi bi-exclamation-triangle"></i> وظایف عقب‌افتاده (${od.length})</h6>${rows(od,true)}</div>`}

function rows(ts,m){if(!ts.length)return '<div class="text-muted p-3">موردی وجود ندارد</div>';
 return `<div class="table-responsive"><table class="table table-hover"><thead><tr><th>عنوان</th>${m?'<th>مسئول</th>':''}<th>اولویت</th><th>مهلت</th><th>پیشرفت</th><th>وضعیت</th></tr></thead><tbody>`+
 ts.map(t=>`<tr class="pr-${t.pr}" style="cursor:pointer" onclick="openTask(${t.id})"><td class="t">${t.title}</td>${m?`<td>${t.assignees.map(i=>U(i).name).join('، ')}</td>`:''}<td>${prb(t.pr)}</td><td class="${st(t)==='overdue'?'text-danger fw-bold':''}">${fd(t.due)}</td><td style="width:110px"><div class="progress"><div class="progress-bar" style="width:${pct(t)}%"></div></div></td><td>${badge(t)}</td></tr>`).join('')+`</tbody></table></div>`}

let F={s:'',p:'',q:'',from:'',to:''};
function taskList(title,ts,m,own){
 return `<div class="d-flex justify-content-between align-items-center mb-3"><h5 class="fw-bold m-0">${title}</h5>${mgr()?'<button class="btn btn-dark" onclick="openTask(0)"><i class="bi bi-plus-lg"></i> وظیفه جدید</button>':''}</div>
 <div class="cardx mb-3"><div class="row g-2">
 <div class="col-md-3"><input class="form-control" placeholder="جستجو..." value="${F.q}" oninput="F.q=this.value;fl()"></div>
 <div class="col-md-2"><select class="form-select" onchange="F.s=this.value;fl()"><option value="">همه وضعیت‌ها</option>${Object.entries(ST).map(([k,v])=>`<option value="${k}" ${F.s==k?'selected':''}>${v}</option>`).join('')}</select></div>
 <div class="col-md-2"><select class="form-select" onchange="F.p=this.value;fl()"><option value="">همه اولویت‌ها</option>${Object.entries(PR).map(([k,v])=>`<option value="${k}" ${F.p==k?'selected':''}>${v}</option>`).join('')}</select></div>
 <div class="col-md-2"><input type="date" class="form-control" value="${F.from}" onchange="F.from=this.value;fl()"></div>
 <div class="col-md-2"><input type="date" class="form-control" value="${F.to}" onchange="F.to=this.value;fl()"></div></div></div>
 <div class="cardx" id="tl">${rows(filt(ts),m)}</div>`}
let filt=ts=>ts.filter(t=>(!F.s||st(t)==F.s)&&(!F.p||t.pr==F.p)&&(!F.q||t.title.includes(F.q))&&(!F.from||t.due>=F.from)&&(!F.to||t.due<=F.to)).sort((a,b)=>a.due.localeCompare(b.due));
function fl(){const m=mgr();$('#tl').innerHTML=rows(filt(m&&page==='tasks'?db.tasks:mine()),m&&page==='tasks')}
function overdue(){const ts=db.tasks.filter(t=>!['done','approved'].includes(t.status));
 return `<h5 class="fw-bold mb-3">وظایف باقی‌مانده و عقب‌افتاده</h5><div class="cardx">${rows(ts.sort((a,b)=>a.due.localeCompare(b.due)),true)}</div>`}
function review(){const ts=db.tasks.filter(t=>t.status==='done');return `<h5 class="fw-bold mb-3">وظایف در انتظار تأیید</h5><div class="cardx">${rows(ts,true)}</div>`}

function openTask(id){const t=id?db.tasks.find(x=>x.id==id):{id:0,title:'',desc:'',due:day(7),pr:'mid',assignees:[],status:'pending',check:[],report:'',log:[]};
 const edit=mgr(),ro=edit?'':'disabled';
 let h=`<div class="modal-header"><h6 class="modal-title fw-bold">${id?'جزئیات وظیفه':'وظیفه جدید'} ${id?badge(t):''}</h6><button class="btn-close ms-0 me-auto" data-bs-dismiss="modal"></button></div><div class="modal-body">`;
 if(edit){h+=`<div class="row g-3"><div class="col-md-8"><label class="form-label small">عنوان</label><input id="f_t" class="form-control" value="${t.title}"></div>
 <div class="col-md-4"><label class="form-label small">اولویت</label><select id="f_p" class="form-select">${Object.entries(PR).map(([k,v])=>`<option value="${k}" ${t.pr==k?'selected':''}>${v}</option>`).join('')}</select></div>
 <div class="col-12"><label class="form-label small">توضیحات</label><textarea id="f_d" class="form-control" rows="2">${t.desc}</textarea></div>
 <div class="col-md-4"><label class="form-label small">تاریخ انجام</label><input type="date" id="f_due" class="form-control" value="${t.due}"></div>
 <div class="col-md-8"><label class="form-label small">اختصاص به (یک یا چند ادمین)</label><div class="d-flex flex-wrap gap-3 pt-1">${db.users.filter(u=>u.role==='admin').map(u=>`<label><input type="checkbox" class="f_a" value="${u.id}" ${t.assignees.includes(u.id)?'checked':''}> ${u.name}</label>`).join('')}</div></div>
 <div class="col-12"><label class="form-label small">چک‌لیست (هر مرحله در یک خط)</label><textarea id="f_c" class="form-control" rows="3">${t.check.map(c=>c.t).join('\n')}</textarea></div></div>`}
 else h+=`<h5>${t.title}</h5><p class="text-muted">${t.desc||'بدون توضیحات'}</p><div class="mb-3">${prb(t.pr)} &nbsp; مهلت: <b>${fd(t.due)}</b></div>`;
 if(id){h+=`<hr><h6 class="fw-bold">مراحل انجام</h6>`+(t.check.length?t.check.map((c,i)=>`<label class="d-block mb-1"><input type="checkbox" ${c.d?'checked':''} ${edit||t.status==='approved'?'disabled':''} onchange="tick(${t.id},${i},this.checked)"> ${c.t}</label>`).join(''):'<div class="text-muted small">چک‌لیستی تعریف نشده</div>')+
 `<h6 class="fw-bold mt-3">گزارش انجام کار</h6><textarea id="f_r" class="form-control" rows="3" ${edit||t.status==='approved'?'disabled':''}>${t.report}</textarea>`+
 (t.log.length?`<h6 class="fw-bold mt-3">تاریخچه</h6>`+t.log.map(l=>`<div class="small text-muted">${fd(l.d)} — ${l.x}</div>`).join(''):'')}
 h+=`</div><div class="modal-footer">`;
 if(edit){h+=`<button class="btn btn-dark" onclick="saveTask(${id})">ذخیره</button>`;
  if(t.status==='done')h+=`<button class="btn btn-outline-dark" onclick="setSt(${id},'approved','تأیید شد')">تأیید</button><button class="btn btn-outline-danger" onclick="setSt(${id},'doing','برگشت برای اصلاح')">برگشت</button>`;
  if(id)h+=`<button class="btn btn-link text-danger me-auto" onclick="delTask(${id})">حذف</button>`}
 else if(t.status!=='approved'&&t.status!=='done')h+=`<button class="btn btn-outline-dark" onclick="saveRep(${id})">ذخیره گزارش</button><button class="btn btn-dark" onclick="submitTask(${id})">اتمام و ثبت برای تأیید</button>`;
 h+=`</div>`;$('#mc').innerHTML=h;bootstrap.Modal.getOrCreateInstance($('#modal')).show()}
const closeM=()=>{bootstrap.Modal.getInstance($('#modal')).hide();go(page)};
function saveTask(id){const t=id?db.tasks.find(x=>x.id==id):{id:db.nid++,status:'pending',report:'',log:[],check:[]};
 t.title=$('#f_t').value.trim();if(!t.title)return alert('عنوان الزامی است');
 t.desc=$('#f_d').value;t.due=$('#f_due').value;t.pr=$('#f_p').value;
 t.assignees=[...document.querySelectorAll('.f_a:checked')].map(x=>+x.value);
 const old=t.check;t.check=$('#f_c').value.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>({t:s,d:!!(old.find(o=>o.t===s)||{}).d}));
 if(!id)db.tasks.push(t);save();closeM()}
function delTask(id){if(confirm('حذف شود؟')){db.tasks=db.tasks.filter(t=>t.id!=id);save();closeM()}}
function tick(id,i,v){const t=db.tasks.find(x=>x.id==id);t.check[i].d=v;if(t.status==='pending')t.status='doing';save()}
function saveRep(id){const t=db.tasks.find(x=>x.id==id);t.report=$('#f_r').value;if(t.status==='pending')t.status='doing';save();closeM()}
function submitTask(id){const t=db.tasks.find(x=>x.id==id);t.report=$('#f_r').value;if(!t.report.trim())return alert('لطفاً گزارش انجام کار را بنویسید');
 t.status='done';t.log.push({d:today,x:'ثبت برای تأیید توسط '+me.name});save();closeM()}
function setSt(id,s,x){const t=db.tasks.find(v=>v.id==id);t.status=s;t.log.push({d:today,x});save();closeM()}

function users(){return `<div class="d-flex justify-content-between mb-3"><h5 class="fw-bold m-0">کاربران و نقش‌ها</h5><button class="btn btn-dark" onclick="openUser(0)"><i class="bi bi-person-plus"></i> کاربر جدید</button></div>
 <div class="cardx"><table class="table"><thead><tr><th>نام</th><th>نام کاربری</th><th>نقش</th><th>دسترسی‌ها</th><th></th></tr></thead><tbody>${db.users.map(u=>`<tr><td><b>${u.name}</b></td><td dir="ltr" class="text-end">${u.user}</td><td>${u.role==='manager'?'مدیر سیستم':'ادمین'}</td><td>${u.role==='manager'?'کامل':(u.perms.includes('reports')?'مشاهده گزارش تیم':'پایه')}</td><td class="text-start"><button class="btn btn-sm btn-outline-dark" onclick="openUser(${u.id})">ویرایش</button> ${u.id!==me.id?`<button class="btn btn-sm btn-outline-danger" onclick="delUser(${u.id})">حذف</button>`:''}</td></tr>`).join('')}</tbody></table></div>`}
function openUser(id){const u=id?U(id):{name:'',user:'',pass:'',role:'admin',perms:[]};
 $('#mc').innerHTML=`<div class="modal-header"><h6 class="modal-title fw-bold">${id?'ویرایش':'افزودن'} کاربر</h6><button class="btn-close ms-0 me-auto" data-bs-dismiss="modal"></button></div><div class="modal-body row g-3">
 <div class="col-md-6"><label class="form-label small">نام کامل</label><input id="u_n" class="form-control" value="${u.name}"></div>
 <div class="col-md-6"><label class="form-label small">نقش</label><select id="u_r" class="form-select"><option value="admin" ${u.role=='admin'?'selected':''}>ادمین</option><option value="manager" ${u.role=='manager'?'selected':''}>مدیر سیستم</option></select></div>
 <div class="col-md-6"><label class="form-label small">نام کاربری</label><input id="u_u" class="form-control" dir="ltr" value="${u.user}"></div>
 <div class="col-md-6"><label class="form-label small">رمز عبور</label><input id="u_p" class="form-control" dir="ltr" value="${u.pass}"></div>
 <div class="col-12"><label><input type="checkbox" id="u_rep" ${u.perms.includes('reports')?'checked':''}> دسترسی مشاهده گزارش عملکرد تیم (برای ادمین)</label></div></div>
 <div class="modal-footer"><button class="btn btn-dark" onclick="saveUser(${id})">ذخیره</button></div>`;bootstrap.Modal.getOrCreateInstance($('#modal')).show()}
function saveUser(id){const un=$('#u_u').value.trim();if(!$('#u_n').value.trim()||!un||!$('#u_p').value)return alert('همه فیلدها الزامی است');
 if(db.users.some(x=>x.user===un&&x.id!=id))return alert('نام کاربری تکراری است');
 const u=id?U(id):{id:db.nid++};Object.assign(u,{name:$('#u_n').value.trim(),user:un,pass:$('#u_p').value,role:$('#u_r').value,perms:$('#u_rep').checked?['reports']:[]});
 if(!id)db.users.push(u);save();closeM()}
function delUser(id){if(confirm('کاربر حذف شود؟')){db.users=db.users.filter(u=>u.id!=id);db.tasks.forEach(t=>t.assignees=t.assignees.filter(a=>a!=id));save();go('users')}}

function reports(){const r=window.R||(window.R={from:day(-30),to:day(30),uid:''});
 setTimeout(()=>{window.rr=()=>{R.from=$('#r1').value;R.to=$('#r2').value;R.uid=$('#r3').value;$('#rb').innerHTML=rbody()}},0);
 return `<h5 class="fw-bold mb-3">گزارش عملکرد</h5><div class="cardx mb-3"><div class="row g-2 align-items-end"><div class="col-md-3"><label class="small">از تاریخ</label><input id="r1" type="date" class="form-control" value="${R.from}" onchange="rr()"></div><div class="col-md-3"><label class="small">تا تاریخ</label><input id="r2" type="date" class="form-control" value="${R.to}" onchange="rr()"></div><div class="col-md-4"><label class="small">فرد</label><select id="r3" class="form-select" onchange="rr()"><option value="">همه ادمین‌ها</option>${db.users.filter(u=>u.role==='admin').map(u=>`<option value="${u.id}" ${R.uid==u.id?'selected':''}>${u.name}</option>`).join('')}</select></div></div></div><div id="rb">${rbody()}</div>`}
function rbody(){const ts=db.tasks.filter(t=>t.due>=R.from&&t.due<=R.to&&(!R.uid||t.assignees.includes(+R.uid)));
 return statCards(stats(ts))+`<div class="cardx mb-3">${perfTable(ts)}</div><div class="cardx"><h6 class="fw-bold">وظایف این بازه</h6>${rows(ts,true)}</div>`}
function perf(){const ts=mine(),s=stats(ts);return `<h5 class="fw-bold mb-3">عملکرد شخصی من</h5>${statCards(s)}<div class="cardx mb-3"><div class="d-flex justify-content-between"><b>نرخ تکمیل</b><b>${s.rate}٪</b></div><div class="progress mt-2"><div class="progress-bar" style="width:${s.rate}%"></div></div></div>
 <div class="cardx"><h6 class="fw-bold">تاریخچه فعالیت‌ها</h6>${ts.flatMap(t=>t.log.map(l=>({d:l.d,x:`${t.title} — ${l.x}`}))).sort((a,b)=>b.d.localeCompare(a.d)).map(l=>`<div class="py-2 border-bottom small"><span class="text-muted">${fd(l.d)}</span> &nbsp; ${l.x}</div>`).join('')||'<div class="text-muted">فعالیتی ثبت نشده</div>'}</div>`}


Chart.defaults.font.family='Vazirmatn';
const ini=n=>n.trim()[0],av=u=>`<span class="av">${ini(U(u).name)}</span>`;
const pts=uid=>db.tasks.filter(t=>t.assignees.includes(uid)).reduce((a,t)=>a+(t.status==='approved'?(t.pr==='high'?20:10):t.status==='done'?5:0),0);
filt=ts=>ts.filter(t=>(!F.s||(F.s==='fin'?['done','approved'].includes(t.status):st(t)==F.s))&&(!F.q||t.title.includes(F.q))&&(!F.from||t.due>=F.from)&&(!F.to||t.due<=F.to)).sort((a,b)=>a.due.localeCompare(b.due));
function alerts(){const a=[];db.tasks.forEach(t=>{if(!mgr()&&!t.assignees.includes(me.id))return;const s=st(t),open=!['done','approved'].includes(t.status);
 if(s==='overdue')a.push(['danger','exclamation-circle',`«${t.title}» عقب‌افتاده است`,t.id]);
 else if(open&&t.due<=day(1))a.push(['warn','clock',`«${t.title}» مهلت ${t.due===today?'امروز':'فردا'}`,t.id]);
 if(mgr()&&t.status==='done')a.push(['','patch-check',`«${t.title}» منتظر تأیید است`,t.id]);
 if(!mgr()&&t.status==='doing'&&t.log.length&&t.log[t.log.length-1].x.includes('برگشت'))a.push(['warn','arrow-return-left',`«${t.title}» برای اصلاح برگشت خورد`,t.id])});return a}
function notif(){const a=alerts();$('#mc').innerHTML=`<div class="modal-header"><h6 class="modal-title fw-bold">اعلان‌ها</h6><button class="btn-close ms-0 me-auto" data-bs-dismiss="modal"></button></div><div class="modal-body">${a.map(x=>`<div class="alr ${x[0]}" onclick="openTask(${x[3]})"><i class="bi bi-${x[1]} fs-5"></i><div>${x[2]}</div></div>`).join('')||'<div class="empty"><i class="bi bi-bell-slash"></i>اعلانی ندارید</div>'}</div>`;bootstrap.Modal.getOrCreateInstance($('#modal')).show()}
function boot(){$('#login').classList.add('d-none');$('#app').classList.remove('d-none');
 const m=mgr()?[['dash','grid-1x2-fill','داشبورد'],['tasks','list-task','وظایف'],['review','patch-check','تأیید'],['users','people','کاربران'],['reports','bar-chart-line','گزارش']]:[['my','house-door-fill','امروز'],['mytasks','list-check','وظایف'],['perf','trophy','عملکرد']];
 if(!mgr()&&me.perms.includes('reports'))m.push(['reports','bar-chart-line','تیم']);
 $('#side').innerHTML=`<div class="brand"><i class="bi bi-check2-square"></i> مدیریت وظایف</div>`+m.map(x=>`<a data-p="${x[0]}" onclick="go('${x[0]}')"><i class="bi bi-${x[1]}"></i><span>${x[2]}</span></a>`).join('');
 const n=alerts().length;
 $('#top').innerHTML=`<div class="d-flex align-items-center gap-2"><span class="av">${ini(me.name)}</span><div class="lh-sm"><div class="fw-bold">${me.name}</div><small class="text-muted">${mgr()?'مدیر سیستم':'ادمین'}</small></div></div><div class="d-flex gap-2"><button class="ib" onclick="notif()"><i class="bi bi-bell"></i>${n?`<span class="dot">${n}</span>`:''}</button><button class="ib" onclick="logout()"><i class="bi bi-box-arrow-left"></i></button></div>`;
 go(m[0][0])}
function go(p){page=p;document.querySelectorAll('#side a').forEach(a=>a.classList.toggle('on',a.dataset.p===p));
 $('#main').innerHTML=({dash,tasks:()=>taskList('همه وظایف',db.tasks,true),overdue,review,users,reports,my,mytasks:()=>taskList('وظایف من',mine(),false),perf})[p]();scrollTo(0,0)}
function statCards(s){const c=[['کل',s.total,'list-ul','','tasks'],['انجام‌شده',s.fin,'check-circle','dark',''],['در حال انجام',s.doing,'arrow-repeat','',''],['انجام‌نشده',s.pending,'circle','',''],['عقب‌افتاده',s.overdue,'exclamation-triangle',s.overdue?'danger':'','overdue']];
 return '<div class="stats">'+c.map(x=>`<div class="stat ${x[3]}" ${x[4]&&mgr()?`onclick="go('${x[4]}')"`:''}><i class="bi bi-${x[2]}"></i><div class="n">${x[1]}</div><div class="l">${x[0]}</div></div>`).join('')+'</div>'}
function rows(ts,m){if(!ts.length)return '<div class="empty"><i class="bi bi-inbox"></i>موردی وجود ندارد</div>';
 return '<div class="tgrid">'+ts.map(t=>`<div class="tc ${st(t)==='overdue'?'od':''}" onclick="openTask(${t.id})"><div class="d-flex justify-content-between align-items-start gap-2"><div class="tt"><span class="pd p-${t.pr}"></span>${t.title}</div>${badge(t)}</div><div class="tm"><span><i class="bi bi-calendar3"></i> ${fd(t.due)}</span><span><i class="bi bi-check2-square"></i> ${t.check.filter(c=>c.d).length}/${t.check.length}</span>${prb(t.pr)}</div><div class="progress"><div class="progress-bar" style="width:${pct(t)}%"></div></div>${m?`<div class="avs">${t.assignees.map(av).join('')}</div>`:''}</div>`).join('')+'</div>'}
function taskList(title,ts,m){const ch=[['','همه'],['pending','انجام‌نشده'],['doing','در حال انجام'],['overdue','عقب‌افتاده'],['fin','تکمیل‌شده']];
 return `<div class="ph"><h2>${title}</h2><div class="d-flex gap-2">${mgr()?'<button class="ib" onclick="exportCsv()"><i class="bi bi-download"></i></button><button class="btn btn-dark rounded-pill" onclick="openTask(0)"><i class="bi bi-plus-lg"></i> جدید</button>':''}</div></div>
 <input class="form-control mb-2" placeholder="جستجو در وظایف" value="${F.q}" oninput="F.q=this.value;fl()">
 <div class="seg mb-2">${ch.map(c=>`<button class="${F.s===c[0]?'on':''}" onclick="F.s='${c[0]}';go(page)">${c[1]}</button>`).join('')}</div>
 <div class="row g-2 mb-3"><div class="col-6"><input type="date" class="form-control" value="${F.from}" onchange="F.from=this.value;fl()"></div><div class="col-6"><input type="date" class="form-control" value="${F.to}" onchange="F.to=this.value;fl()"></div></div><div id="tl">${rows(filt(ts),m)}</div>`}
function fl(){$('#tl').innerHTML=rows(filt(mgr()&&page==='tasks'?db.tasks:mine()),mgr()&&page==='tasks')}
function exportCsv(){const r=[['عنوان','مسئول','مهلت','اولویت','وضعیت']].concat(db.tasks.map(t=>[t.title,t.assignees.map(a=>U(a).name).join('/'),t.due,PR[t.pr],ST[st(t)]]));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+r.map(x=>x.map(c=>`"${c}"`).join(',')).join('\n')],{type:'text/csv'}));a.download='tasks.csv';a.click()}
function startTask(id){const t=db.tasks.find(x=>x.id==id);t.status='doing';t.log.push({d:today,x:'شروع شد'});save();go(page)}
function dash(){const s=stats(db.tasks),ad=db.users.filter(u=>u.role==='admin'),od=db.tasks.filter(t=>st(t)==='overdue'),sc=u=>stats(db.tasks.filter(t=>t.assignees.includes(u.id)));
 setTimeout(()=>{new Chart($('#ch'),{type:'doughnut',data:{labels:['انجام‌شده','در حال انجام','انجام‌نشده','عقب‌افتاده'],datasets:[{data:[s.fin,s.doing,s.pending,s.overdue],backgroundColor:['#111','#999','#ddd','#c00'],borderWidth:0}]},options:{cutout:'72%',plugins:{legend:{position:'bottom'}}}});
 new Chart($('#ch2'),{type:'bar',data:{labels:ad.map(u=>u.name.split(' ')[0]),datasets:[['انجام‌شده','fin','#111'],['در حال انجام','doing','#999'],['عقب‌افتاده','overdue','#c00']].map(([l,k,c])=>({label:l,backgroundColor:c,borderRadius:6,data:ad.map(u=>sc(u)[k])}))},options:{scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,ticks:{precision:0}}},plugins:{legend:{position:'bottom'}}}})},0);
 return `<div class="hero"><div><div class="sm">${new Date().toLocaleDateString('fa-IR',{weekday:'long',day:'numeric',month:'long'})}</div><h3>سلام ${me.name.split(' ')[0]} 👋</h3><div class="sm">${db.tasks.filter(t=>t.status==='done').length} وظیفه منتظر تأیید شماست</div></div><div class="ring" style="--p:${s.rate}"><span>${s.rate}٪</span></div></div>${statCards(s)}
 <div class="row g-3"><div class="col-lg-4"><div class="cardx"><h6 class="fw-bold">وضعیت کلی</h6><canvas id="ch"></canvas></div></div><div class="col-lg-8"><div class="cardx"><h6 class="fw-bold">بار کاری ادمین‌ها</h6><canvas id="ch2" height="150"></canvas></div></div></div>
 <div class="row g-3"><div class="col-lg-5"><div class="cardx"><h6 class="fw-bold mb-2">رتبه‌بندی عملکرد</h6>${[...ad].sort((a,b)=>pts(b.id)-pts(a.id)).map((u,i)=>`<div class="lb"><span class="rk">${i+1}</span>${av(u.id)}<div class="flex-fill"><b>${u.name}</b><div class="progress mt-1"><div class="progress-bar" style="width:${sc(u).rate}%"></div></div></div><b>${pts(u.id)}</b></div>`).join('')}</div></div>
 <div class="col-lg-7"><div class="cardx"><h6 class="fw-bold text-danger">وظایف عقب‌افتاده (${od.length})</h6>${rows(od,true)}</div></div></div>
 <div class="cardx"><h6 class="fw-bold">جدول عملکرد</h6>${perfTable(db.tasks)}</div>`}
function my(){const ts=mine(),s=stats(ts),P=pts(me.id),open=ts.filter(t=>!['done','approved'].includes(t.status)).sort((a,b)=>a.due.localeCompare(b.due));
 const wk=[...Array(7)].map((_,i)=>{const d=day(i-6);return [d,ts.reduce((a,t)=>a+t.log.filter(l=>l.d===d&&l.x.includes('ثبت برای تأیید')).length,0)]}),mx=Math.max(1,...wk.map(w=>w[1]));
 return `<div class="hero"><div><div class="sm">${new Date().toLocaleDateString('fa-IR',{weekday:'long',day:'numeric',month:'long'})}</div><h3>سلام ${me.name.split(' ')[0]} 👋</h3><div class="sm">${open.length} وظیفه باز${s.overdue?` · <b class="text-warning">${s.overdue} عقب‌افتاده</b>`:''}</div></div><div class="ring" style="--p:${s.rate}"><span>${s.rate}٪</span></div></div>
 <div class="stats"><div class="stat dark"><i class="bi bi-stars"></i><div class="n">${P}</div><div class="l">امتیاز</div></div><div class="stat"><i class="bi bi-award"></i><div class="n">${Math.floor(P/30)+1}</div><div class="l">سطح</div></div><div class="stat"><i class="bi bi-arrow-repeat"></i><div class="n">${s.doing}</div><div class="l">در حال انجام</div></div><div class="stat ${s.overdue?'danger':''}"><i class="bi bi-exclamation-triangle"></i><div class="n">${s.overdue}</div><div class="l">عقب‌افتاده</div></div></div>
 <div class="row g-3"><div class="col-lg-7"><div class="cardx"><h6 class="fw-bold mb-1">تمرکز امروز</h6>${open.slice(0,4).map(t=>`<div class="fi" onclick="openTask(${t.id})"><div><div class="tt"><span class="pd p-${t.pr}"></span>${t.title}</div><small class="${st(t)==='overdue'?'text-danger':'text-muted'}">${fd(t.due)} · ${pct(t)}٪</small></div>${t.status==='pending'?`<button class="btn btn-dark btn-sm" onclick="event.stopPropagation();startTask(${t.id})">شروع</button>`:badge(t)}</div>`).join('')||'<div class="empty"><i class="bi bi-emoji-smile"></i>همه‌چیز انجام شده!</div>'}</div></div>
 <div class="col-lg-5"><div class="cardx"><h6 class="fw-bold">فعالیت ۷ روز اخیر</h6><div class="wk">${wk.map(w=>`<div><i style="height:${w[1]/mx*60}px"></i>${new Date(w[0]).toLocaleDateString('fa-IR',{weekday:'narrow'})}</div>`).join('')}</div><div class="small text-muted mt-2">سطح بعدی: ${30-P%30} امتیاز دیگر</div><div class="progress mt-1"><div class="progress-bar" style="width:${P%30/30*100}%"></div></div></div></div></div>`}
function perf(){const ts=mine(),s=stats(ts),P=pts(me.id);
 const bd=[['star','اولین تأیید',s.approved>=1],['award','۳ تأیید',s.approved>=3],['shield-check','بدون عقب‌افتادگی',s.total>0&&!s.overdue],['lightning-charge','نرخ بالای ۸۰٪',s.rate>=80]];
 const h=ts.flatMap(t=>t.log.map(l=>({d:l.d,x:`${t.title} — ${l.x}`}))).sort((a,b)=>b.d.localeCompare(a.d));
 return `<div class="ph"><h2>عملکرد من</h2></div><div class="hero"><div><div class="sm">امتیاز کل</div><h3>${P}</h3><div class="sm">سطح ${Math.floor(P/30)+1}</div></div><div class="ring" style="--p:${s.rate}"><span>${s.rate}٪</span></div></div>${statCards(s)}
 <div class="cardx"><h6 class="fw-bold mb-3">دستاوردها</h6><div class="badges">${bd.map(b=>`<div class="bg ${b[2]?'on':''}"><i class="bi bi-${b[0]}"></i><small>${b[1]}</small></div>`).join('')}</div></div>
 <div class="cardx"><h6 class="fw-bold mb-2">تاریخچه فعالیت‌ها</h6>${h.map(l=>`<div class="py-2 border-bottom small"><span class="text-muted">${fd(l.d)}</span> &nbsp; ${l.x}</div>`).join('')||'<div class="text-muted">فعالیتی ثبت نشده</div>'}</div>`}
addEventListener('keydown',e=>{if(e.key==='Enter'&&!$('#login').classList.contains('d-none'))login()});
const sid=sessionStorage.getItem('me');
if(sid&&(me=U(sid))&&me.role)boot();else{loginList();$('#login').classList.remove('d-none')}
