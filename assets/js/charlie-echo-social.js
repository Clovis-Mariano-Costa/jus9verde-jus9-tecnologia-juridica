(function(){
  const input=document.getElementById('social-question');
  const out=document.getElementById('social-response');
  const trustedLinks=[
    {label:'Jus 9 Tecnologia Juridica',url:'https://www.jus9tecnologia.com.br/'},
    {label:'Equipe Jus 9',url:'https://www.jus9tecnologia.com.br/equipe/'},
    {label:'MVPs e demos Jus 9',url:'https://www.jus9tecnologia.com.br/mvp'},
    {label:'Investimentos Jus 9',url:'https://investimentos.jus9tecnologia.com.br/'},
    {label:'Livros gratuitos Jus 9',url:'https://livros.jus9tecnologia.com.br/'},
    {label:'Charlie Echo',url:'https://charlieecho.jus9tecnologia.com.br/'},
    {label:'Charlie Echo Social',url:'https://jus9verde.jus9tecnologia.com.br/charlie-echo-social'},
    {label:'Quando o Desenho Fala',url:'https://quandoodesenhofala.jus9tecnologia.com.br/'}
  ];
  function escapeHtml(text){ return String(text||'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])); }
  function answer(text){ if(out) out.innerHTML=escapeHtml(text).replace(/(https:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\n/g,'<br>'); }
  function asksForLinks(text){ const q=(text||'').toLowerCase(); return ['link','site','url','download','baixar','onde encontro','onde acesso','endereco'].some(term=>q.includes(term)); }
  function linksAnswer(text){
    const q=(text||'').toLowerCase();
    const selected=trustedLinks.filter(link=>{
      const label=link.label.toLowerCase();
      if(label.includes('desenho')&&(q.includes('desenho')||q.includes('identidade visual'))) return true;
      if(label.includes('investimentos')&&q.includes('invest')) return true;
      if(label.includes('livros')&&(q.includes('livro')||q.includes('leitura'))) return true;
      if(label.includes('equipe')&&q.includes('equipe')) return true;
      if(label.includes('mvps')&&(q.includes('mvp')||q.includes('demo'))) return true;
      if(label==='charlie echo'&&q.includes('charlie echo')&&!q.includes('social')) return true;
      if(label.includes('social')&&(q.includes('social')||q.includes('verde'))) return true;
      return false;
    });
    const links=selected.length?selected:trustedLinks;
    return 'Links publicos confiaveis que posso oferecer:\n\n'+links.map(link=>'- '+link.label+': '+link.url).join('\n')+'\n\nConteudo sigiloso, secreto ou de cofre nao recebe link publico.';
  }
  function clean(){ if(input) input.value=''; answer('Tela limpa. Conte o que precisa organizar quando quiser.'); input&&input.focus(); }
  function base(){ return (input&&input.value.trim())||''; }
  function fallbackSocial(t){
    return t
      ? 'Resposta social inicial: entendi sua situação. Evite enviar dados sensíveis. Organize o pedido em fatos, necessidade, urgência e apoio humano adequado. Se houver risco imediato, procure atendimento emergencial ou equipe responsável.'
      : 'Escreva uma pergunta ou situação para receber apoio social inicial.';
  }
  async function callCharlieSocial(t){
    if(asksForLinks(t)) return answer(linksAnswer(t));
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
    if(a==='links') return answer(linksAnswer(t));
    if(a==='perguntar') return t?callCharlieSocial(t):answer(fallbackSocial(t));
  }));
  input&&input.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); document.querySelector('[data-action="perguntar"]').click(); }});
})();
