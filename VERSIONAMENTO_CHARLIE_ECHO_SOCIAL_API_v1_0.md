# Versionamento - Charlie Echo Social API v1.0

Data: 2026-05-26
Repositorio: jus9verde-jus9-tecnologia-juridica

## Objetivo

Conectar a Charlie Echo Social da Jus 9 Verde a rota segura `https://charlieecho.jus9tecnologia.com.br/api/ia`, preservando fallback local.

## Alteracoes

- `assets/js/charlie-echo-social.js` passa a chamar a API da Charlie Echo com `mode: "social"`.
- Se a API falhar, a pagina mantem resposta local segura.
- Nenhuma chave, token ou segredo foi colocado no frontend.

## Governanca

- Sem dados reais.
- Sem substituicao de assistente social, psicologo, medico, advogado, equipe tecnica ou atendimento emergencial.
- Orientacao social permanece educativa, inicial e com revisao humana quando cabivel.
