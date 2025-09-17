/**
 * InvestMaster - Portal de Finanças e Investimentos
 * main.js - Funcionalidades principais do site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de componentes
    initMobileMenu();
    initStickyHeader();
    initSliders();
    initTabs();
    initAccordions();
    initNewsletterForm();
    initScrollAnimations();
    initLazyLoading();
    
    // Inicializar gerenciador de anúncios se o script estiver carregado
    if (typeof AdsManager !== 'undefined') {
        const adsManager = new AdsManager();
        adsManager.init();
    }
});

/**
 * Menu Mobile
 */
function initMobileMenu() {
    const menuIcon = document.querySelector('.mobile-menu-icon');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuIcon || !mainNav) return;
    
    menuIcon.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Fechar menu ao clicar em links
    const menuLinks = mainNav.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuIcon.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-nav') && !event.target.closest('.mobile-menu-icon')) {
            menuIcon.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * Header Fixo ao Rolar
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const headerHeight = header.offsetHeight;
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > headerHeight) {
            header.classList.add('sticky');
            
            // Efeito de esconder/mostrar ao rolar
            if (scrollTop > lastScrollTop) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }
        } else {
            header.classList.remove('sticky');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Sliders/Carousels
 */
function initSliders() {
    // Slider de Depoimentos
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let currentSlide = 0;
        const slides = testimonialSlider.querySelectorAll('.testimonial-item');
        const totalSlides = slides.length;
        
        if (totalSlides <= 1) return;
        
        // Criar navegação
        const navContainer = document.createElement('div');
        navContainer.className = 'slider-nav';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'slider-dot';
            dot.dataset.slide = i;
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', function() {
                goToSlide(parseInt(this.dataset.slide));
            });
            
            navContainer.appendChild(dot);
        }
        
        testimonialSlider.appendChild(navContainer);
        
        // Criar botões de navegação
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', prevSlide);
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', nextSlide);
        
        testimonialSlider.appendChild(prevBtn);
        testimonialSlider.appendChild(nextBtn);
        
        // Funções de navegação
        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            testimonialSlider.style.transform = `translateX(-${index * 100}%)`;
            
            // Atualizar dots
            const dots = navContainer.querySelectorAll('.slider-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        
        // Auto-play
        let slideInterval = setInterval(nextSlide, 5000);
        
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Slider de Artigos em Destaque
    const featuredSlider = document.querySelector('.featured-slider');
    if (featuredSlider) {
        // Implementação similar ao slider de depoimentos
        // Código omitido para brevidade
    }
}

/**
 * Tabs
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-nav li');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Remover classes ativas
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Adicionar classes ativas
                this.classList.add('active');
                tabContents[index].classList.add('active');
            });
        });
    });
}

/**
 * Accordions
 */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const headers = accordion.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const item = this.parentElement;
                const isActive = item.classList.contains('active');
                
                // Fechar todos os itens
                const allItems = accordion.querySelectorAll('.accordion-item');
                allItems.forEach(i => i.classList.remove('active'));
                
                // Abrir o item clicado (se não estava ativo)
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    });
}

/**
 * Formulário de Newsletter
 */
function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form, .footer-newsletter');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput) return;
            
            const email = emailInput.value.trim();
            if (!email || !isValidEmail(email)) {
                showFormMessage(this, 'error', 'Por favor, insira um e-mail válido.');
                return;
            }
            
            // Simulação de envio (aqui seria feita a integração com API)
            setTimeout(() => {
                showFormMessage(this, 'success', 'Obrigado por assinar nossa newsletter!');
                this.reset();
            }, 1000);
        });
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showFormMessage(form, type, message) {
        // Verificar se já existe uma mensagem
        let messageEl = form.nextElementSibling;
        if (!messageEl || !messageEl.classList.contains('form-message')) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            form.parentNode.insertBefore(messageEl, form.nextSibling);
        }
        
        // Definir tipo e mensagem
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Remover após alguns segundos
        setTimeout(() => {
            messageEl.classList.add('fade-out');
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 3000);
    }
}

/**
 * Animações de Scroll
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if (!elements.length) return;
    
    const options = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Lazy Loading de Imagens
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Navegador suporta lazy loading nativo
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback para navegadores que não suportam
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        if (!lazyImages.length) return;
        
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-image');
                        lazyImageObserver.unobserve(img);
                    }
                }
            });
        });
        
        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }
}

/**
 * Utilitários
 */
const Utils = {
    // Formatar valores monetários
    formatCurrency: function(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    // Formatar percentuais
    formatPercent: function(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    },
    
    // Formatar datas
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    },
    
    // Debounce para otimizar eventos
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Exportar utilitários para uso global
window.Utils = Utils;