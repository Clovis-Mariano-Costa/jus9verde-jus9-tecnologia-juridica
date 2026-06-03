(function(){
  const input=document.getElementById('social-question');
  const out=document.getElementById('social-response');
  function escapeHtml(text){ return String(text||'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])); }
  function answer(text){
    if(!out) return;
    out.innerHTML=escapeHtml(text).replace(/https:\/\/[^\s<>"']+/g,raw=>{
      let url=raw, suffix='';
      while(/[),.;:!?]$/.test(url)){ suffix=url.slice(-1)+suffix; url=url.slice(0,-1); }
      return '<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+url+'</a>'+suffix;
    }).replace(/\n/g,'<br>');
  }
  function externalLinksGuidance(){
    return 'Diga qual site, orgao, tribunal, universidade, servico ou material publico voce procura. A Charlie Echo Social avaliara o contexto e priorizara fontes oficiais ou institucionais confiaveis, sem limitar a resposta a um catalogo fixo. URLs HTTPS aprovadas aparecem como links clicaveis.';
  }
  function clean(){ if(input) input.value=''; answer('Tela limpa. Conte o que precisa organizar quando quiser.'); input&&input.focus(); }
  function base(){ return (input&&input.value.trim())||''; }
  function preferredLanguage(t){
    const s=String(t||'').toLowerCase();
    if(/\b(english|translate to english|in english|please|hello|thanks)\b/.test(s)) return 'en';
    if(/\b(espanol|español|castellano|traducir|hola|gracias)\b/.test(s)) return 'es';
    if(/\b(francais|français|bonjour|merci)\b/.test(s)) return 'fr';
    return 'pt';
  }
  function fallbackSocial(t){
    const lang=preferredLanguage(t);
    if(lang==='en') return t
      ? 'Initial social response: I understood your situation. Please avoid sending sensitive data. Organize the request into facts, need, urgency and appropriate human support. If there is immediate risk, seek emergency help or the responsible human team.'
      : 'Write a question or situation to receive initial social support.';
    if(lang==='es') return t
      ? 'Respuesta social inicial: entendi tu situacion. Evita enviar datos sensibles. Organiza el pedido en hechos, necesidad, urgencia y apoyo humano adecuado. Si hay riesgo inmediato, busca atencion de emergencia o el equipo responsable.'
      : 'Escribe una pregunta o situacion para recibir apoyo social inicial.';
    if(lang==='fr') return t
      ? 'Reponse sociale initiale : j ai compris votre situation. Evitez d envoyer des donnees sensibles. Organisez la demande en faits, besoin, urgence et soutien humain approprie. En cas de risque immediat, cherchez une aide d urgence ou une equipe responsable.'
      : 'Ecrivez une question ou une situation pour recevoir un premier soutien social.';
    return t
      ? 'Resposta social inicial: entendi sua situação. Evite enviar dados sensíveis. Organize o pedido em fatos, necessidade, urgência e apoio humano adequado. Se houver risco imediato, procure atendimento emergencial ou equipe responsável.'
      : 'Escreva uma pergunta ou situação para receber apoio social inicial.';
  }
  async function callCharlieSocial(t){
    try{
      answer('Conectando com a API segura da Charlie Echo Social...');
      const response=await fetch('https://charlieecho.jus9tecnologia.com.br/api/ia',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:t,mode:'social'})
      });
      const data=await response.json().catch(()=>null);
      if(response.ok&&data&&typeof data.answer==='string'&&data.answer.trim()){
        answer(data.answer.trim());
        return;
      }
      answer(fallbackSocial(t)+'\n\nObservação: API indisponível ou sem resposta textual reconhecida; mantive fallback local.');
    }catch(error){
      answer(fallbackSocial(t)+'\n\nObservação: API indisponível; mantive fallback local.');
    }
  }
  document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const a=btn.dataset.action, t=base();
    if(a==='limpar') return clean();
    if(a==='falar') return answer('Entrada por voz será conectada em etapa segura. Por ora, escreva sua pergunta no campo.');
    if(a==='organizar') return answer('Vamos organizar com prudência: 1) o que aconteceu; 2) o que você precisa; 3) quem pode ajudar humanamente; 4) quais documentos ou informações públicas são úteis; 5) qual próximo passo seguro.');
    if(a==='humano') return answer('Pergunta para atendimento humano: "Olá, preciso de orientação sobre a seguinte situação: [resumo]. Quais documentos devo levar e qual é o próximo passo adequado?"');
    if(a==='links') return answer(externalLinksGuidance());
    if(a==='perguntar') return t?callCharlieSocial(t):answer(fallbackSocial(t));
  }));
  input&&input.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); document.querySelector('[data-action="perguntar"]').click(); }});
})();
