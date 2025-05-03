# 📝 ATA DE REUNIÃO – SPRINT 2 (MDS)

📅 **Data:** 17/04/2025  
⏰ **Horário:** 20h00 às 21h00  
📍 **Plataforma:** (não especificada)  

## 👥 Participantes  
- Yuri (moderador)  
- Mateus  
- João (saiu antes do fim)  
- GG  
- Júlia  
- Schneider  

**Ausentes:**  
- Pedrão (problemas de conexão)  
- Outros participantes ausentes não identificados  

## 🎯 Objetivos Alcançados  
- ✅ Definição do objetivo geral do projeto  
- ✅ Brainstorming das funcionalidades principais  
- ✅ Estruturação inicial do projeto: navegação, tecnologias, estrutura no Git  
- ✅ Organização das entregas para a sprint  

## :computer: Tópicos Discutidos

### 🎯 Objetivo Geral do Projeto
- Transformar a plataforma **Brasil Participativo** em um **aplicativo com melhor visibilidade** e **usabilidade**.
- Criar valor adicional ao integrar uma **rede social** à aplicação.

### 🌟 Funcionalidades Identificadas

#### 🧵 Rede Social
- Comentários em propostas, curtidas, reposts e compartilhamento em redes sociais.
- Trends (temas em alta), comunidades/fóruns por categorias (ex: Meio Ambiente, Saúde).
- Possibilidade de criar discussões temáticas, similar ao "Twitterzão".
- Sistema de **salvar conteúdos** de interesse.

#### 📊 Dados e Machine Learning (ML)
- Criar dataset com dados do Brasil Participativo.
- Aplicar ML para:
  - Criar **resumos automáticos** de propostas.
  - Identificar **objetivos principais** e **similaridade entre propostas**.
  - Analisar **sentimentos** dos comentários e votos.
  - Realizar **pesquisa demográfica** das propostas.
  - Exibir propostas mais votadas.

#### 🧭 Estrutura de Navegação
- Navegação por abas e categorias: Conferências, Consultas, Planos, Conselhos.
- Hierarquia: "Todas" → "Categorias" → "Temas" → "Conferências/Planos" → Propostas.
- Filtro por tema/interesse do usuário.
- Implementação de **botão de busca**, **atalhos rápidos**, e **modo escuro**.

#### 👤 Funcionalidades do Usuário
- Visualização sem login; login obrigatório para comentar.
- Login por e-mail/senha (sem API paga).
- **Gamificação**: barra de XP, insígnias, conquistas.
- **Notificações**, **modo escuro**, **configurações no perfil**.
- Botões fixos no rodapé: voltar, comunidade, salvar, perfil.
- **Avaliação do app/temas** e funcionalidade “**Participar Agora**” com redirecionamento ao site oficial.

### 🏗 Organização do Projeto

#### 🗂 GitHub e Story Mapping
| Tarefa | Responsável | Status |
|--------|-------------|--------|
| Reestruturar o repositório no GitHub | Yuri + apoio | 🔄 |
| Criar quadro Projects (Kanban) | João | 🔄 |
| Produzir Storymap (Figma/FigJam) | Mateus | 🔄 |
| Documento de arquitetura | Yuri | 🔄 |
| Documento de requisitos | Participante a definir | 🔄 |
| Centralizar links úteis | Yuri | 🔄 |
| Atualizar README.md | Atribuir | 🔄 |

- Sugestão de estruturar o Kanban por Épicos > Features > User Stories:
  - **Usuário** (cadastro, login, perfil)  
  - **IA** (resumos, análise, algoritmo)  
  - **Backend/Dados** (comentários, gamificação, notificações)  
  - **Frontend** (interfaces, interação)

#### 🌐 Webscraping (GG, Pedrão)
- Atraso na raspagem de Conferências, entrega prevista para a semana.
- Próxima tarefa: raspar **Planos ou Consultas**.
- Raspar **todos os dados relevantes**: votos, enquetes, textos, institucionais.
- Outras seções (reuniões, documentos etc.) devem ser discutidas antes de raspar.
- Estrutura do banco: múltiplas tabelas relacionais (Conferência, Consulta, Proposta etc.).
- **Entregáveis:** Código do scraper + planilha de dados.
- **Pendência:** Pedrão deve entregar planilha das Conferências.

#### 🎨 Frontend (Mateus, João)
- Criar **wireframes de baixa fidelidade**: listagem e detalhes de conferência.
- Definir **hierarquia da informação** e análise dos dados raspados.
- Reforço das features discutidas: feed, filtros, gamificação, salvar, modo escuro etc.

#### 🧠 Machine Learning (Júlia, Yuri)
- Ferramentas definidas: **LangChain** e **Faiss**.
- Necessário pré-processar os dados raspados.
- Tarefas:
  - Estudar funcionamento das ferramentas.
  - Produzir documento com as **conclusões iniciais**.
- Não será possível realizar testes locais nesta semana.

### 📅 Cronograma
- A partir da próxima semana, reuniões fixas às **segundas e quartas-feiras**.
- Yuri preparará as **ISOs (tarefas)** para a próxima semana.

## ✅ Encaminhamentos
- Organização do projeto será prioridade: Story Mapping, GitHub e documentação.
- Entregas combinadas para webscraping, ML e frontend.
- Estímulo à comunicação sobre dificuldades.
- Reforço da colaboração e divisão de tarefas.
- Yuri irá refatorar o modelo das atas para as próximas reuniões.

🔚 **Encerramento**  
⏰ Horário: 21h00
