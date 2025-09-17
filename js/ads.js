/**
 * InvestMaster - Portal de Finanças e Investimentos
 * ads.js - Sistema de gerenciamento de anúncios CPM
 */

// Configurações globais de anúncios
const ADS_CONFIG = {
    // Tempos de refresh em milissegundos
    refreshTimes: {
        banner: 30000,    // 30 segundos
        sidebar: 45000,   // 45 segundos
        inArticle: 60000  // 60 segundos
    },
    
    // Tamanhos de anúncios por dispositivo
    sizes: {
        desktop: {
            banner: [[970, 250], [970, 90], [728, 90]],
            sidebar: [[300, 600], [300, 250]],
            inArticle: [[728, 90], [468, 60]]
        },
        tablet: {
            banner: [[728, 90], [468, 60]],
            sidebar: [[300, 250]],
            inArticle: [[468, 60]]
        },
        mobile: {
            banner: [[320, 100], [320, 50]],
            sidebar: [[300, 250]],
            inArticle: [[300, 250], [320, 50]]
        }
    },
    
    // Limites de anúncios por página
    limits: {
        inArticle: 3,  // Máximo de anúncios in-article por página
        total: 8       // Máximo de anúncios total por página
    },
    
    // Configurações de viewability
    viewability: {
        threshold: 0.5,  // 50% do anúncio visível
        timeInView: 1000 // 1 segundo em visualização
    }
};

/**
 * Classe para gerenciamento de anúncios
 */
class AdsManager {
    constructor(config = {}) {
        // Mesclar configurações padrão com personalizadas
        this.config = {...ADS_CONFIG, ...config};
        
        // Estado interno
        this.slots = [];
        this.viewabilityTrackers = {};
        this.refreshTimers = {};
        this.deviceType = this.getDeviceType();
        this.totalAdsLoaded = 0;
        this.visibleAds = 0;
        
        // Métricas
        this.metrics = {
            impressions: 0,
            viewable: 0,
            clicks: 0,
            revenue: 0
        };
    }
    
    /**
     * Inicializar o gerenciador de anúncios
     */
    init() {
        // Detectar slots de anúncios na página
        this.detectAdSlots();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Iniciar carregamento lazy de anúncios
        this.initLazyLoading();
        
        // Log de inicialização
        console.log(`AdsManager: Inicializado com ${this.slots.length} slots de anúncios`);
    }
    
    /**
     * Detectar slots de anúncios na página
     */
    detectAdSlots() {
        const adElements = document.querySelectorAll('.ad-slot');
        
        adElements.forEach((el, index) => {
            // Determinar tipo de anúncio
            let type = 'banner';
            if (el.classList.contains('ad-vertical') || el.classList.contains('ad-sidebar')) {
                type = 'sidebar';
            } else if (el.classList.contains('ad-in-article')) {
                type = 'inArticle';
            }
            
            // Verificar limites
            if (type === 'inArticle' && this.countSlotsByType('inArticle') >= this.config.limits.inArticle) {
                return;
            }
            
            if (this.slots.length >= this.config.limits.total) {
                return;
            }
            
            // Criar ID único se não existir
            if (!el.id) {
                el.id = `ad-slot-${type}-${index}`;
            }
            
            // Adicionar à lista de slots
            this.slots.push({
                id: el.id,
                element: el,
                type: type,
                loaded: false,
                viewable: false,
                refreshable: true
            });
        });
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Redimensionamento da janela
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Scroll para viewability
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Visibilidade da página
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
    
    /**
     * Iniciar carregamento lazy de anúncios
     */
    initLazyLoading() {
        // Usar Intersection Observer para carregar anúncios quando visíveis
        if ('IntersectionObserver' in window) {
            const options = {
                root: null,
                rootMargin: '200px', // Pré-carregamento
                threshold: 0
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const slot = this.getSlotById(entry.target.id);
                        if (slot && !slot.loaded) {
                            this.loadAd(slot);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, options);
            
            // Observar todos os slots
            this.slots.forEach(slot => {
                observer.observe(slot.element);
            });
        } else {
            // Fallback para navegadores sem suporte a Intersection Observer
            this.loadAllAds();
        }
    }
    
    /**
     * Carregar todos os anúncios (fallback)
     */
    loadAllAds() {
        this.slots.forEach(slot => {
            if (!slot.loaded) {
                this.loadAd(slot);
            }
        });
    }
    
    /**
     * Carregar um anúncio específico
     */
    loadAd(slot) {
        // Aqui seria a integração com a plataforma de anúncios
        // Este é um exemplo simulado
        
        // Marcar como carregado
        slot.loaded = true;
        this.totalAdsLoaded++;
        
        // Adicionar classe para estilização
        slot.element.classList.add('ad-loaded');
        
        // Simular conteúdo do anúncio
        const adContent = slot.element.querySelector('.ad-content');
        if (adContent) {
            // Obter tamanhos para o dispositivo atual
            const sizes = this.config.sizes[this.deviceType][slot.type];
            const size = sizes[0]; // Usar o primeiro tamanho como padrão
            
            // Criar placeholder para simulação
            const placeholder = document.createElement('div');
            placeholder.className = 'ad-placeholder';
            placeholder.style.width = `${size[0]}px`;
            placeholder.style.height = `${size[1]}px`;
            placeholder.style.backgroundColor = '#f0f0f0';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.margin = '0 auto';
            placeholder.innerHTML = `<span style="color:#999;font-size:12px;">Anúncio ${size[0]}x${size[1]}</span>`;
            
            // Adicionar placeholder ao slot
            adContent.innerHTML = '';
            adContent.appendChild(placeholder);
            
            // Iniciar rastreamento de viewability
            this.trackViewability(slot);
            
            // Configurar refresh automático
            this.setupRefresh(slot);
            
            // Registrar impressão
            this.metrics.impressions++;
        }
    }
    
    /**
     * Rastrear viewability de um anúncio
     */
    trackViewability(slot) {
        if ('IntersectionObserver' in window) {
            const options = {
                root: null,
                threshold: this.config.viewability.threshold
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Iniciar timer para viewability
                        if (!this.viewabilityTrackers[slot.id]) {
                            this.viewabilityTrackers[slot.id] = setTimeout(() => {
                                if (!slot.viewable) {
                                    slot.viewable = true;
                                    this.visibleAds++;
                                    this.metrics.viewable++;
                                    
                                    // Adicionar classe para estilização
                                    slot.element.classList.add('ad-viewable');
                                    
                                    // Log de viewability
                                    console.log(`AdsManager: Anúncio ${slot.id} viewable`);
                                }
                            }, this.config.viewability.timeInView);
                        }
                    } else {
                        // Limpar timer se saiu da visualização
                        if (this.viewabilityTrackers[slot.id]) {
                            clearTimeout(this.viewabilityTrackers[slot.id]);
                            this.viewabilityTrackers[slot.id] = null;
                        }
                    }
                });
            }, options);
            
            // Observar o slot
            observer.observe(slot.element);
        }
    }
    
    /**
     * Configurar refresh automático de anúncios
     */
    setupRefresh(slot) {
        if (slot.refreshable) {
            const refreshTime = this.config.refreshTimes[slot.type];
            
            this.refreshTimers[slot.id] = setInterval(() => {
                // Verificar se o anúncio está visível antes de atualizar
                if (this.isSlotVisible(slot)) {
                    this.refreshAd(slot);
                }
            }, refreshTime);
        }
    }
    
    /**
     * Atualizar um anúncio específico
     */
    refreshAd(slot) {
        // Aqui seria a integração com a plataforma de anúncios para refresh
        // Este é um exemplo simulado
        
        // Log de refresh
        console.log(`AdsManager: Refreshing ad ${slot.id}`);
        
        // Simular refresh
        const adContent = slot.element.querySelector('.ad-content');
        if (adContent) {
            const placeholder = adContent.querySelector('.ad-placeholder');
            if (placeholder) {
                // Efeito visual de refresh
                placeholder.style.opacity = '0.5';
                setTimeout(() => {
                    placeholder.style.opacity = '1';
                    
                    // Registrar nova impressão
                    this.metrics.impressions++;
                }, 500);
            }
        }
    }
    
    /**
     * Manipulador de evento de redimensionamento
     */
    handleResize() {
        // Atualizar tipo de dispositivo
        const newDeviceType = this.getDeviceType();
        
        // Se mudou o tipo de dispositivo, recarregar anúncios
        if (newDeviceType !== this.deviceType) {
            this.deviceType = newDeviceType;
            this.resizeAllAds();
        }
    }
    
    /**
     * Redimensionar todos os anúncios para o dispositivo atual
     */
    resizeAllAds() {
        this.slots.forEach(slot => {
            if (slot.loaded) {
                this.resizeAd(slot);
            }
        });
    }
    
    /**
     * Redimensionar um anúncio específico
     */
    resizeAd(slot) {
        const adContent = slot.element.querySelector('.ad-content');
        if (adContent) {
            const placeholder = adContent.querySelector('.ad-placeholder');
            if (placeholder) {
                // Obter tamanhos para o dispositivo atual
                const sizes = this.config.sizes[this.deviceType][slot.type];
                const size = sizes[0]; // Usar o primeiro tamanho como padrão
                
                // Atualizar dimensões
                placeholder.style.width = `${size[0]}px`;
                placeholder.style.height = `${size[1]}px`;
                placeholder.querySelector('span').textContent = `Anúncio ${size[0]}x${size[1]}`;
            }
        }
    }
    
    /**
     * Manipulador de evento de scroll
     */
    handleScroll() {
        // Usar debounce para otimização
        if (!this.scrollDebounce) {
            this.scrollDebounce = setTimeout(() => {
                // Verificar viewability de anúncios não rastreados
                this.slots.forEach(slot => {
                    if (slot.loaded && !slot.viewable && this.isSlotVisible(slot)) {
                        // Se não tiver tracker ativo, iniciar
                        if (!this.viewabilityTrackers[slot.id]) {
                            this.trackViewability(slot);
                        }
                    }
                });
                
                this.scrollDebounce = null;
            }, 200);
        }
    }
    
    /**
     * Manipulador de evento de visibilidade da página
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pausar refreshes quando a página não está visível
            this.pauseAllRefreshes();
        } else {
            // Retomar refreshes quando a página volta a ficar visível
            this.resumeAllRefreshes();
        }
    }
    
    /**
     * Pausar todos os refreshes automáticos
     */
    pauseAllRefreshes() {
        Object.keys(this.refreshTimers).forEach(id => {
            clearInterval(this.refreshTimers[id]);
            this.refreshTimers[id] = null;
        });
    }
    
    /**
     * Retomar todos os refreshes automáticos
     */
    resumeAllRefreshes() {
        this.slots.forEach(slot => {
            if (slot.loaded && slot.refreshable && !this.refreshTimers[slot.id]) {
                this.setupRefresh(slot);
            }
        });
    }
    
    /**
     * Verificar se um slot está visível na viewport
     */
    isSlotVisible(slot) {
        const rect = slot.element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= windowHeight &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    /**
     * Obter slot por ID
     */
    getSlotById(id) {
        return this.slots.find(slot => slot.id === id);
    }
    
    /**
     * Contar slots por tipo
     */
    countSlotsByType(type) {
        return this.slots.filter(slot => slot.type === type).length;
    }
    
    /**
     * Determinar tipo de dispositivo com base na largura da janela
     */
    getDeviceType() {
        const width = window.innerWidth;
        
        if (width >= 1024) {
            return 'desktop';
        } else if (width >= 768) {
            return 'tablet';
        } else {
            return 'mobile';
        }
    }
    
    /**
     * Obter métricas de desempenho dos anúncios
     */
    getMetrics() {
        return {
            ...this.metrics,
            totalSlots: this.slots.length,
            loadedAds: this.totalAdsLoaded,
            visibleAds: this.visibleAds,
            viewabilityRate: this.metrics.impressions > 0 ? 
                (this.metrics.viewable / this.metrics.impressions * 100).toFixed(2) + '%' : '0%'
        };
    }
}

/**
 * Funções para otimização de anúncios in-article
 */
const InArticleAds = {
    // Inserir anúncios em artigos longos
    insertInArticleAds: function(articleSelector, paragraphInterval = 4) {
        const article = document.querySelector(articleSelector);
        if (!article) return;
        
        const paragraphs = article.querySelectorAll('p');
        if (paragraphs.length < paragraphInterval + 1) return;
        
        // Determinar quantos anúncios inserir (máximo de 3)
        const maxAds = Math.min(
            Math.floor(paragraphs.length / paragraphInterval),
            ADS_CONFIG.limits.inArticle
        );
        
        for (let i = 1; i <= maxAds; i++) {
            const position = i * paragraphInterval;
            if (position < paragraphs.length) {
                const paragraph = paragraphs[position];
                
                // Criar elemento de anúncio
                const adElement = document.createElement('div');
                adElement.className = 'ad-slot ad-in-article';
                adElement.id = `ad-in-article-${i}`;
                adElement.innerHTML = `
                    <span class="ad-label">Publicidade</span>
                    <div class="ad-content"></div>
                `;
                
                // Inserir após o parágrafo
                paragraph.parentNode.insertBefore(adElement, paragraph.nextSibling);
            }
        }
        
        // Inicializar anúncios se o gerenciador estiver disponível
        if (window.adsManager) {
            window.adsManager.init();
        } else {
            // Criar novo gerenciador se não existir
            window.adsManager = new AdsManager();
            window.adsManager.init();
        }
    },
    
    // Otimizar posicionamento de anúncios com base no conteúdo
    optimizeAdPlacement: function(articleSelector) {
        const article = document.querySelector(articleSelector);
        if (!article) return;
        
        // Analisar conteúdo para encontrar pontos de engajamento
        const headings = article.querySelectorAll('h2, h3');
        const images = article.querySelectorAll('img');
        
        // Pontos de interesse para posicionar anúncios
        const interestPoints = [];
        
        // Adicionar cabeçalhos como pontos de interesse
        headings.forEach(heading => {
            if (heading.nextElementSibling && heading.nextElementSibling.tagName === 'P') {
                interestPoints.push({
                    element: heading.nextElementSibling,
                    score: 8
                });
            }
        });
        
        // Adicionar imagens como pontos de interesse
        images.forEach(image => {
            if (image.nextElementSibling && image.nextElementSibling.tagName === 'P') {
                interestPoints.push({
                    element: image.nextElementSibling,
                    score: 7
                });
            }
        });
        
        // Ordenar por pontuação
        interestPoints.sort((a, b) => b.score - a.score);
        
        // Limitar ao máximo de anúncios permitidos
        const maxAds = Math.min(interestPoints.length, ADS_CONFIG.limits.inArticle);
        
        // Inserir anúncios nos melhores pontos
        for (let i = 0; i < maxAds; i++) {
            const point = interestPoints[i];
            
            // Criar elemento de anúncio
            const adElement = document.createElement('div');
            adElement.className = 'ad-slot ad-in-article';
            adElement.id = `ad-in-article-optimized-${i}`;
            adElement.innerHTML = `
                <span class="ad-label">Publicidade</span>
                <div class="ad-content"></div>
            `;
            
            // Inserir após o elemento de interesse
            point.element.parentNode.insertBefore(adElement, point.element.nextSibling);
        }
        
        // Inicializar anúncios
        if (window.adsManager) {
            window.adsManager.init();
        } else {
            window.adsManager = new AdsManager();
            window.adsManager.init();
        }
    }
};

// Exportar para uso global
window.AdsManager = AdsManager;
window.InArticleAds = InArticleAds;