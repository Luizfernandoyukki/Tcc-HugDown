# Lista de tarefas HugDown (roadmap de ajustes e melhorias)

## Postagens
- [ ] Corrigir erro de múltiplas postagens: ao tentar postar várias vezes, remover alert e redirecionar para index de postagens.
- [ ] Corrigir modal de show: modal não fecha corretamente.
- [ ] Corrigir exclusão de tags: apenas quem criou pode excluir, e só aparecem na lista as tags criadas pelo usuário.
- [ ] Implementar barra de pesquisa por título nas postagens para melhor organização.

## Eventos
- [ ] Adicionar botão de report no show de eventos (igual aos existentes em postagens).
- [ ] Tornar campo de link clicável se for um link válido.
- [ ] Adicionar contador para excluir evento do banco após data de fim; se data de início chegou e fim não, status "em andamento" (frontend/back, sem alterar DB).
- [ ] Adicionar tabela no banco para reports de eventos.

## Grupos
- [ ] Adicionar botão de configurações no index do grupo, abrindo modal para denunciar grupo (criar tabela no DB), sair do grupo, e para admin gerar link de convite.
- [ ] Na criação do grupo, retirar campo de categoria (ou desvincular da tabela categoria) e criar campo categoria no estilo de eventos, com opções fixas.
- [ ] No index, retirar botões de curtir/comentar; transformar chat de postagens em chat de grupo (vários usuários falando).

## Cadastro
- [ ] Corrigir erro de foco/disable nos campos de senha e repetir senha.
- [ ] Corrigir centralização do "olho" de visualização de senha nos campos de senha.

## Notificações
- [ ] Adicionar filtro por tipo de notificação (pedidos de amizade, advertências, etc); criar campo/tabela se necessário.
- [ ] Notificações devem ser diferentes por tipo; pedidos de amizade podem ser aceitos diretamente na notificação.
- [ ] Corrigir posição do símbolo vermelho de notificação: deve estar no canto superior direito do ícone de notificação.
- [ ] Ao entrar com uma conta, perguntar se pode enviar notificações pelo navegador.

## Mensagens Diretas
- [ ] Criar modo de escolher emojis do sistema, enviar imagens e marcar mensagens respondidas (estilo WhatsApp); criar tabela para imagens e pasta para armazená-las em `public/imagens/mensagens/{id}`.
- [ ] Adicionar engrenagem de configuração no chat: modal para deletar amigo (excluir amizade), denunciar amigo (criar tabela no DB), mudar tema da conversa (5 temas, opção selecionável, preferencialmente no frontend).
- [ ] No index/show de amigos/mensagens, tornar toda a box clicável para abrir chat; adicionar barra de pesquisa por nome de usuário.

## Usuário
- [ ] No show de perfil de outros usuários, adicionar botão para denunciar perfil sem atrapalhar layout.

## Amizades
- [ ] Na página de pesquisa de usuários para adicionar como amigo, ao enviar pedido, permanecer na mesma página.
- [ ] Adaptar filtro para pesquisar por nome de usuário; se não encontrar, mostrar mensagem de "usuário não encontrado".

## Admin
- [ ] No super admin, aceitar/recusar operações devem mostrar mensagem de sucesso, não JSON.
- [ ] Botão advertir usuário: além de enviar mensagem, registrar contador de advertências no DB e mostrar número de advertências ao admin; motivo pode ser escolhido ou digitado.
- [ ] Ao receber 3 advertências, usuário recebe status de bloqueado (adicionar campo/tabela se necessário); ao ser bloqueado, enviar e-mail com motivo e instruções para contato.
- [ ] No painel admin, adicionar campos de report para verificar user, grupo e evento; remover botão de excluir usuário e adicionar botão de banir/desbanir com motivo.

## Modificações Gerais
faça os models e controlers e rotas das novas tabelas criadas e seus relacionamentos, organizeo arquivo do database respeitando as tabelas auxiliarios e referencias 
2- arrume o filtro para ele funcionar em campos de texto publico como os comentarios mensagens diretas grupos tags eventos e notificações 

categorias
1- crie um arquivo para categorias onde posa cria-las mas so o adm pode acessar por isso coloque o botão epnas nas paginas de adm. 
Postagens
1-erro de postar varias postagens (concertar)(retirar o alert e apenas retornar de volta para a pagina do index de postagen )
2- erro de no modal de show n fechar direito (concertar)
3- erro na criação de tags a tags se criam ok mas no excuir apenas quem criou as tags pode excuir as mesmas e so aparece na lista as tags criadas por mim mesmo (concertar)
4 - barra de pesquisa por titulo nas postagen para melhor organização (implementar)

eventos 
1 - colocar dentro do show de eventos um botão de repot do mesmo modelo dos que ja existem  (implementar)
2 -  se no campo link ser adicionado um link torna-lo clicavel quando possivel (implementar)
3 - adiconar um contador ou algo do genero que excui o evento do banco de dados após passa sua data de fim e qaundo a data de inicio chegar mas a de fim ainda não ficar com status de em andamento(frontend ou back  sem db )
4 - adicionar uma tabela no banco de dados sobre os reports do mesmo 

grupos
1- adicionar um botão de configurações dentro do index do grupo onde abre um modal , que tem como denuciar o grupo (gere a tabela pra isso no db), e como sair do grupo, e para adm uma opçao de gerar um link onde quem clicar e tiver logado no site possa se tornar um mebro e ser redirecionado para a pagina do grupo 
2 -  na criação do grupo retire o campo de categoria pois ele n esta sendo usado ou desvincule grupos da tabela categoria e crie um campo categoria no mesmo estilo do qeu existe  em eventos com um estilo de tela pra cada categoria coloque elas como opition no campo 
3 -  no inde retiro os botões de curtir e comentar, eles n tem função e deixe o chat de postagens parecer um chat de grupo onde seja possivel varias pessoa falar sobre temas 

cadastro 
1 -  tem um erro que diz q o campo de senha e repetir senha estão not focudisable arrume ele 
2 nos campo de senha tem um defeito pois tem um "olho" que serve pra visualizar a senha ele funciona mas esta decentralizado 

notificações 
1- adicione um filtro pra filtrar or tipo de notificação(sen tiver nada no db adicione)onde o usuarios pode escolher ver pedidos de amizade, ver adivertencias, e ademasi notificações dentro do possivel
2- com base no campo do topico 1 desta seção faça com quando a notificação seja gerada ela venha diferente pra cada tipo, o principal é pedidos de amizade ser possivel aceitar ali mesmo
3 - no layout tem um simbolo vermelho quando tem notificação mas, ele eta no canto da tela mas deve estar no canto superior direito do png da imagem chamadanotificação.png
4- assim que entrar com uma conta caso n tenha premição pdeir se pode enviar notificação pro usuarios por meio do navegador 

mensagens diretas
1- veja oq mudar no database e crie um modo de poder escolher emojis do propio sistema, um meio de enviar imagens e um meio de marcar qual mensagens ta respondendo no estilo whatsapp
quando mudar isso no db crie dentro de public/imagens uma pasta para gurda-las criando uma nova pasta dentro desta para cada id de mensagem direta se possivel 
2 -  adicionar onde ocorre o chat um engrenagem de connfiguração que abre um modal onde possa deletar amigo, excluindo assim a amizade, onde possa denuncioar esse amigo (crie a tabela no db), onde possa mudar o tema da conversa(se quiser adicionar uma tabela com foreing key pra gurdar os temas , mas se possivel faça isso no front)sabe o modelo do ig onde é possivel mudar o tema ett adicione isso no css pra quando um escolher um tema poder aparecer para os participantes da conversa, crie 5 temas diferentes pra isso e deixe como option selecionavel 
3 - no index ou show onde aparece a a lista dos meus amigos e possiveis mensagens diretar tire o botão de abrir e torne todo a box clicavel pra levar ao chat direto, adicione uma barra de pesquisa por nome de usuarios para achar os amigos 

usuario 
1 - no show para ver o perfil de outras pessoas adicione um botão que n atrapalhe o layut da pagina para denucioar o perfil.

amizades 
1- na pagina onde eu posso pesquisar ususarios para adicionar como amigo, qundo clicado no botão enviar pedido ele é redirecionado para o index principal, muda isto e deixe o usuario na mesma pagina, 
2- adapte o filtro para filtrar por nome do usuarios existentes se n achar aparecer a caixa co a mensagens de n existe e tals 

admin
1- no super admin as opções de aceitar e recusar estão levando ao json deixe apena aparecer uma mensagem de sucesso nas operações 
2- no botão advertir usuarios n esta funcionado, na função de advertir alem de mandar a mensagem faça por meio de db um contador que registra as advertencias e mostre ali mesmo onde aparece o nome dos user para o adm, para o adm deve mostrar apenas o numero de advertencias e quando o adm for ciar uma advertencia, ele deve clicar no botão e escoher o motivo ou clicar em outro onde podera ele mesmo escrever outro motivo alem dos que ja existem no option da advertencias.
3- relacionado ao topico anterios quando o ususario receber uma advertencia ele vai ir para as notificações com o motivo, e ao receber 3 notificações o ususarios recebe o status de bloqueado(aadicione no db se n tiver como fazer no back), ao estar bloqeuado ele recebe um e-mail o motivo do bloqueio seja por limite de advertencias ou por outro motivo qeu explicarei no topico seguinte, onde tem o e-mail SuporteHugDown@gmail.com para entrar em contado para tentar recuperar a conta caso ache q o ban foi indevido, se tentar login estando bloeado da que a conta esta bloquada e pede pra entarr em contado com esse e-mail.
4 - aqui no adm deve adicioar os campos de report para verificar assim como os que ja existem ali para user, grupo e evento, la onde tem a lista de ususaios remova o botão de excuir e coloque no lugar o botão banir, onde vc escrev o motivo do banimento, e se o ususarios ja tiver banido um botao de desbanir onde tmbem coloca o motivo do desbanimento 

mod gerais
1- trasnfira as pastas onde esta habilidado o multer para a pasta public/imagens com o mesmo nome que elas tem ali e remova o multer.
faça os models e controlers e rotas das novas tabelas criadas e seus relacionamentos, organizeo arquivo do database respeitando as tabelas auxiliarios e referencias 
2- arrume o filtro para ele funcionar em campos de texto publico como os comentarios mensagens diretas grupos tags eventos e notificações 

categorias
1- crie um arquivo para categorias onde posa cria-las mas so o adm pode acessar por isso coloque o botão epnas nas paginas de adm. 