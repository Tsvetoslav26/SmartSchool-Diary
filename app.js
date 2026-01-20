let user = null;

let db = JSON.parse(localStorage.getItem('db')) || {
  users: [
    { name:'admin', role:'admin' },
    { name:'ivan', role:'student' },
    { name:'maria', role:'teacher' }
  ],
  grades: [
    { student:'ivan', subject:'Математика', value:6 },
    { student:'ivan', subject:'Български език', value:5 }
  ],
  homework: [
    { subject:'Математика', text:'Упражнение 5, стр.42' }
  ],
  absences: [
    { student:'ivan', date:'12.01.2026' }
  ]
};

function save(){ localStorage.setItem('db', JSON.stringify(db)); }

function notify(msg){
  const t=document.getElementById('toast');
  t.innerText=msg;
  t.style.opacity=1;
  setTimeout(()=>t.style.opacity=0,2000);
}

function register(){
  if(!regName.value) return notify('Въведи име');
  db.users.push({name:regName.value, role:regRole.value});
  save(); notify('Успешна регистрация');
}

function login(){
  user=db.users.find(u=>u.name===regName.value);
  if(!user) return notify('Няма такъв потребител');
  auth.classList.add('hidden');
  app.classList.remove('hidden');
  welcome.innerText=`Здравей, ${user.name} (${user.role})`;
  render();
}

function logout(){ location.reload(); }

function toggleTheme(){
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
}

function show(id){
  document.querySelectorAll('section').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function render(){
  renderGrades();
  renderHomework();
  renderAbsences();
  renderAdmin();
}

function renderGrades(){
  grades.innerHTML='<h3>Оценки</h3>';
  if(user.role==='teacher'){
    grades.innerHTML+=`
      <input id="gs" placeholder="Ученик">
      <input id="sub" placeholder="Предмет">
      <input id="val" placeholder="Оценка">
      <button onclick="addGrade()">Добави</button>`;
  }
  db.grades.filter(g=>user.role!=='student'||g.student===user.name)
    .forEach(g=>grades.innerHTML+=`<p>${g.student} – ${g.subject}: ${g.value}</p>`);
}

function addGrade(){
  if(!gs.value || !sub.value || !val.value) return notify('Попълни всички полета');
  if(val.value<2 || val.value>6) return notify('Оценката трябва да е между 2 и 6');
  db.grades.push({student:gs.value, subject:sub.value, value:parseInt(val.value)});
  save(); gs.value=''; sub.value=''; val.value=''; renderGrades(); notify('Добавена оценка');
}

function renderHomework(){
  homework.innerHTML='<h3>Домашни</h3>';
  if(user.role==='teacher'){
    homework.innerHTML+=`
      <input id="hw-subject" placeholder="Предмет">
      <textarea id="hw-text" placeholder="Описание на домашното"></textarea>
      <button onclick="addHomework()">Добави домашно</button>`;
  }
  db.homework.forEach(h=>homework.innerHTML+=`<p><strong>${h.subject}:</strong> ${h.text}</p>`);
}

function addHomework(){
  if(!hwSubject.value || !hwText.value) return notify('Попълни всички полета');
  db.homework.push({subject:hwSubject.value, text:hwText.value});
  save(); hwSubject.value=''; hwText.value=''; renderHomework(); notify('Добавено домашно');
}

function renderAbsences(){
  absences.innerHTML='<h3>Отсъствия</h3>';
  if(user.role==='teacher'){
    absences.innerHTML+=`
      <input id="abs-student" placeholder="Ученик">
      <input id="abs-date" type="date">
      <button onclick="addAbsence()">Добави отсъствие</button>`;
  }
  db.absences.filter(a=>user.role!=='student'||a.student===user.name)
    .forEach(a=>absences.innerHTML+=`<p>${a.student}: ${a.date}</p>`);
}

function addAbsence(){
  if(!absStudent.value || !absDate.value) return notify('Попълни всички полета');
  db.absences.push({student:absStudent.value, date:absDate.value});
  save(); absStudent.value=''; absDate.value=''; renderAbsences(); notify('Добавено отсъствие');
}

function renderAdmin(){
  if(user.role!=='admin') return;
  adminPanel.innerHTML='<h3>Админ панел</h3>';
  db.users.forEach(u=>adminPanel.innerHTML+=`<p>${u.name} – ${u.role}</p>`);
}
