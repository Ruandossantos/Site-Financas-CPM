# Documentação do Site InvestMaster - Finanças e Investimentos

## Visão Geral

O InvestMaster é um site completo sobre finanças e investimentos, desenvolvido com HTML, CSS e JavaScript puro. O site foi projetado para oferecer conteúdo educativo de alta qualidade e, ao mesmo tempo, ser otimizado para monetização através de anúncios CPM (Custo Por Mil Impressões).

## Estrutura do Projeto

```
site Finanças e Investimentos/
│
├── index.html                  # Página inicial
├── artigos.html               # Página de listagem de artigos
├── ferramentas.html           # Página com calculadoras financeiras
├── sobre.html                 # Página sobre o site e equipe
├── contato.html               # Página de contato
│
├── css/
│   ├── style.css              # Estilos principais
│   └── responsive.css         # Estilos responsivos
│
├── js/
│   ├── main.js                # Funcionalidades gerais do site
│   ├── newsletter.js          # Gerenciamento de inscrições na newsletter
│   ├── ads.js                 # Sistema de gerenciamento de anúncios
│   └── calculadoras.js        # Funcionalidades das calculadoras financeiras
│
└── artigos/
    ├── investimentos-para-iniciantes.html    # Artigo de exemplo
    └── renda-fixa-vs-renda-variavel.html     # Artigo de exemplo
```

## Páginas Principais

### 1. Home (index.html)

A página inicial apresenta:
- Banner principal com chamada para ação
- Seção de artigos em destaque
- Últimos artigos publicados
- Ferramentas financeiras populares
- Formulário de newsletter
- Espaços estratégicos para anúncios

### 2. Artigos (artigos.html)

Página de listagem de artigos com:
- Banner da página
- Filtros por categorias
- Lista de artigos em destaque
- Grade de artigos com paginação
- Sidebar com widgets (artigos populares, categorias, newsletter, tags)
- Espaços para anúncios horizontais e verticais

### 3. Ferramentas (ferramentas.html)

Página com calculadoras financeiras:
- Calculadora de juros compostos
- Simulador de carteira de investimentos
- Calculadora de financiamento imobiliário
- Planejador de aposentadoria
- Sidebar com widgets e espaços para anúncios

### 4. Sobre (sobre.html)

Página institucional com:
- História do site
- Missão, visão e valores
- Equipe
- Parceiros
- Depoimentos
- Espaços para anúncios

### 5. Contato (contato.html)

Página de contato com:
- Informações de contato
- Formulário de contato
- Seção de FAQ
- Mapa de localização
- Espaços para anúncios

## Artigos de Exemplo

1. **Investimentos para Iniciantes**
   - Guia completo para quem está começando a investir
   - Inclui quiz interativo de perfil de investidor

2. **Renda Fixa vs Renda Variável**
   - Comparativo detalhado entre as duas classes de ativos
   - Inclui gráficos interativos de desempenho histórico

## Arquivos CSS

### style.css

Contém todos os estilos principais do site:
- Reset CSS e estilos gerais
- Variáveis CSS para cores, fontes e espaçamentos
- Estilos de componentes (botões, cards, formulários)
- Estilos específicos para cada seção do site
- Estilos para os espaços de anúncios

### responsive.css

Contém media queries para garantir que o site seja responsivo:
- Breakpoints para dispositivos móveis, tablets e desktops
- Ajustes de layout, tipografia e navegação
- Adaptações para os espaços de anúncios em diferentes tamanhos de tela

## Arquivos JavaScript

### main.js

Contém funcionalidades gerais do site:
- Menu mobile (toggle e animações)
- Header fixo ao rolar
- Rolagem suave para links internos
- Animações de elementos na página
- Carregamento lazy de imagens
- Inicialização de componentes

### newsletter.js

Gerencia o sistema de inscrição na newsletter:
- Validação de formulários
- Simulação de envio de dados
- Exibição de mensagens de sucesso/erro
- Armazenamento local de inscrições

### ads.js

Sistema completo de gerenciamento de anúncios:
- Configurações globais de anúncios
- Detecção de slots de anúncios
- Carregamento lazy de anúncios
- Rastreamento de viewability
- Otimização de anúncios in-article
- Métricas de desempenho

### calculadoras.js

Implementa as calculadoras financeiras:
- Calculadora de juros compostos
- Simulador de carteira de investimentos
- Calculadora de financiamento imobiliário
- Planejador de aposentadoria
- Gráficos interativos com Chart.js

## Otimização para CPM

O site foi otimizado para maximizar o CPM (Custo Por Mil Impressões) através de:

1. **Posicionamento estratégico de anúncios**:
   - Anúncios acima da dobra (visíveis sem rolagem)
   - Anúncios in-article (entre parágrafos de conteúdo)
   - Anúncios sticky na sidebar
   - Anúncios no final do conteúdo

2. **Viewability aprimorada**:
   - Carregamento lazy para melhor desempenho
   - Rastreamento de visibilidade dos anúncios
   - Ajuste automático de tamanho para diferentes dispositivos

3. **Experiência do usuário**:
   - Anúncios não intrusivos
   - Claramente identificados como "Publicidade"
   - Não interferem na leitura do conteúdo principal

4. **Conteúdo de qualidade**:
   - Artigos longos e detalhados para aumentar o tempo de permanência
   - Conteúdo educativo e relevante para o público-alvo
   - Elementos interativos para aumentar o engajamento

## Design Responsivo

O site é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar e múltiplas colunas
- **Tablet**: Layout ajustado com redução de colunas
- **Mobile**: Layout de coluna única com menu hambúrguer

Os anúncios também são responsivos, mudando de tamanho e posição conforme o dispositivo.

## Considerações de Performance

Para garantir boa performance mesmo com anúncios:

1. **Carregamento otimizado**:
   - Preload de recursos críticos
   - Carregamento lazy de imagens e anúncios
   - Minificação de CSS e JavaScript

2. **Priorização de conteúdo**:
   - Conteúdo principal carrega primeiro
   - Anúncios carregam após o conteúdo principal
   - Animações e efeitos leves

## Como Usar

1. Faça o download ou clone o repositório
2. Abra o arquivo `index.html` em um navegador web
3. Navegue pelo site usando o menu principal

## Personalização

### Adicionando Novos Artigos

1. Crie um novo arquivo HTML na pasta `artigos/`
2. Use a estrutura dos artigos existentes como modelo
3. Adicione o link para o novo artigo na página `artigos.html`

### Adicionando Novas Ferramentas

1. Adicione a nova ferramenta na página `ferramentas.html`
2. Implemente a lógica da ferramenta no arquivo `calculadoras.js`

### Modificando Espaços de Anúncios

Os espaços para anúncios são identificados pela classe `ad-slot` e IDs específicos. Para adicionar ou modificar anúncios:

1. Localize os elementos com classe `ad-slot` no HTML
2. Modifique o tamanho ou posição conforme necessário
3. Atualize as configurações no arquivo `ads.js`

## Conclusão

Este site foi desenvolvido com foco em:
- Conteúdo educativo de qualidade sobre finanças e investimentos
- Design moderno e responsivo
- Otimização para monetização via CPM
- Performance e experiência do usuário

A estrutura simples e bem documentada permite fácil manutenção e expansão do site no futuro.