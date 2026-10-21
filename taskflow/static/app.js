const list = document.querySelector('#list');
const count = document.querySelector('#count');
const message = document.querySelector('#message');
let tasks = [];
let filter = 'all';
async function api(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro na solicitação.');
  return data;
}
function render() {
  count.textContent = `${tasks.filter(t => !t.done).length} pendente(s)`;
  list.replaceChildren();
  const visible = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  if (!visible.length) { const empty = document.createElement('li'); empty.className='empty'; empty.textContent='Nenhuma tarefa por aqui ainda.'; list.append(empty); }
  visible.forEach(task => {
    const li = document.createElement('li'); li.className = task.done ? 'done' : '';
    const check = document.createElement('button'); check.className='check'; check.textContent=task.done?'✓':'○'; check.setAttribute('aria-label','Alternar conclusão');
    check.onclick = () => act(`/api/tasks/${task.id}`, {method:'PATCH'});
    const name = document.createElement('span'); name.className='name'; name.textContent=task.title;
    const del = document.createElement('button'); del.className='delete'; del.textContent='×'; del.setAttribute('aria-label','Excluir tarefa');
    del.onclick = () => act(`/api/tasks/${task.id}`, {method:'DELETE'});
    li.append(check,name,del); list.append(li);
  });
}
async function refresh() { tasks=await api('/api/tasks'); render(); }
async function act(url, options) { try { message.textContent=''; await api(url,options); await refresh(); } catch(e) { message.textContent=e.message; } }
document.querySelector('#form').onsubmit = async e => {
  e.preventDefault(); const input=document.querySelector('#title'); const title=input.value.trim(); if(!title)return;
  await act('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})});
  if(!message.textContent){input.value='';input.focus();}
};
document.querySelectorAll('[data-filter]').forEach(button => button.onclick=()=>{
  filter=button.dataset.filter; document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===button)); render();
});
refresh().catch(e=>message.textContent=e.message);
