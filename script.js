(() => {
  const MAX = 30;
  const grid = document.getElementById('grid');
  const pickBtn = document.getElementById('pickBtn');
  const resetBtn = document.getElementById('resetBtn');
  const markDoneBtn = document.getElementById('markDoneBtn');
  const autoDisable = document.getElementById('autoDisable');
  const resultBox = document.getElementById('resultBox');
  const historyEl = document.getElementById('history');

  let items = []; // {n, el, disabled}
  let history = [];

  function createGrid(){
    grid.innerHTML = '';
    items = [];
    for(let i=1;i<=MAX;i++){
      const el = document.createElement('div');
      el.className = 'item bg-white rounded-lg shadow text-center py-3 cursor-pointer font-semibold transition transform hover:-translate-y-1';
      el.textContent = i;
      el.dataset.num = i;
      el.addEventListener('click', () => toggleDisable(i));
      grid.appendChild(el);
      items.push({n:i, el, disabled:false});
    }
  }

  function toggleDisable(n){
    const it = items[n-1];
    it.disabled = !it.disabled;
    if(it.disabled){
      it.el.classList.add('opacity-40','line-through','cursor-not-allowed');
    } else {
      it.el.classList.remove('opacity-40','line-through','cursor-not-allowed');
    }
  }

  function getAvailable(){
    return items.filter(i => !i.disabled).map(i => i.n);
  }

  function pickRandom(){
    const avail = getAvailable();
    if(avail.length===0){
      showResult('사용 가능한 번호가 없습니다');
      return;
    }
    const idx = Math.floor(Math.random()*avail.length);
    const num = avail[idx];
    highlight(num);
    pushHistory(num);
    if(autoDisable.checked){
      setTimeout(()=>{ disableNumber(num); }, 400);
    }
  }

  function showResult(text){
    resultBox.textContent = text;
  }

  function highlight(n){
    clearSelected();
    const it = items[n-1];
    it.el.classList.add('bg-gradient-to-r','from-blue-500','to-sky-400','text-white','shadow-lg');
    showResult(n + '번');
  }

  function clearSelected(){
    items.forEach(i=>i.el.classList.remove('bg-gradient-to-r','from-blue-500','to-sky-400','text-white','shadow-lg'));
  }

  function disableNumber(n){
    const it = items[n-1];
    it.disabled = true;
    it.el.classList.add('opacity-40','line-through','cursor-not-allowed');
  }

  function markPickedAsDisabled(){
    const sel = items.find(i=>i.el.classList.contains('selected'));
    if(sel) disableNumber(sel.n);
  }

  function pushHistory(n){
    history.unshift({n, t: new Date().toLocaleTimeString()});
    if(history.length>20) history.pop();
    renderHistory();
  }

  function renderHistory(){
    historyEl.innerHTML = '';
    history.forEach(h=>{
      const li = document.createElement('li');
      li.textContent = `${h.n}번 — ${h.t}`;
      historyEl.appendChild(li);
    });
  }

  function resetAll(){
    items.forEach(i=>{
      i.disabled=false;
      i.el.classList.remove('opacity-40','line-through','cursor-not-allowed','bg-gradient-to-r','from-blue-500','to-sky-400','text-white','shadow-lg');
    });
    history = [];
    renderHistory();
    showResult('—');
  }

  pickBtn.addEventListener('click', pickRandom);
  resetBtn.addEventListener('click', resetAll);
  markDoneBtn.addEventListener('click', markPickedAsDisabled);

  // init
  createGrid();
})();