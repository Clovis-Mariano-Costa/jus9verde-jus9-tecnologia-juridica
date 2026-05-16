(function(){
  const input=document.getElementById('social-question');
  const out=document.getElementById('social-response');
  function answer(text){ if(out) out.textContent=text; }
  function clean(){ if(input) input.value=''; answer('Tela limpa. Conte o que precisa organizar quando quiser.'); input&&input.focus(); }
  function base(){ const t=(input&&input.value.trim())||''; return t; }
  document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const a=btn.dataset.action, t=base();
    if(a==='limpar') return clean();
    if(a==='falar') return answer('Entrada por voz será conectada em etapa segura. Por ora, escreva sua pergunta no campo.');
    if(a==='organizar') return answer('Vamos organizar com prudência: 1) o que aconteceu; 2) o que você precisa; 3) quem pode ajudar humanamente; 4) quais documentos ou informações públicas são úteis; 5) qual próximo passo seguro.');
    if(a==='humano') return answer('Pergunta para atendimento humano: “Olá, preciso de orientação sobre a seguinte situação: [resumo]. Quais documentos devo levar e qual é o próximo passo adequado?”');
    if(a==='perguntar') return answer(t? 'Resposta social inicial: entendi sua situação. Evite enviar dados sensíveis. Organize o pedido em fatos, necessidade, urgência e apoio humano adequado. Se houver risco imediato, procure atendimento emergencial ou equipe responsável.':'Escreva uma pergunta ou situação para receber apoio social inicial.');
  }));
  input&&input.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); document.querySelector('[data-action="perguntar"]').click(); }});
})();
