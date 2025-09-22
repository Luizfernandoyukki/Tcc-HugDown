// Homepage JavaScript - index.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initAnimations();
    loadStats();
    loadRecentActivity();
    loadUpcomingEvents();
    setupScrollEffects();
    setupFormInteractions();
});

// Animações de entrada
function initAnimations() {
    // Animação dos cards flutuantes
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.8)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, 500 + (index * 200));
    });

    // Animação das feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Carregar estatísticas
async function loadStats() {
    try {
        // Simular dados até a API estar pronta
        const stats = await fetchStats();
        
        // Animar contadores
        animateCounter('group-count', stats.groups || 125);
        animateCounter('event-count', stats.events || 89);
        animateCounter('user-count', stats.users || 1247);
        
        // Stats da seção principal
        animateCounter('total-users', stats.totalUsers || 1247);
        animateCounter('total-events', stats.totalEvents || 89);
        animateCounter('total-groups', stats.totalGroups || 125);
        animateCounter('total-connections', stats.totalConnections || 2156);
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        // Usar valores padrão em caso de erro
        animateCounter('group-count', 125);
        animateCounter('event-count', 89);
        animateCounter('user-count', 1247);
    }
}

// Buscar estatísticas da API
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('API não disponível, usando dados de exemplo');
    }
    
    // Dados de exemplo para desenvolvimento
    return {
        groups: 125,
        events: 89,
        users: 1247,
        totalUsers: 1247,
        totalEvents: 89,
        totalGroups: 125,
        totalConnections: 2156
    };
}

// Animação de contadores
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = target / 50;
    const duration = 2000; // 2 segundos
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, stepTime);
}

// Carregar atividades recentes
async function loadRecentActivity() {
    const activityFeed = document.querySelector('.activity-feed');
    const loadingPlaceholder = activityFeed.querySelector('.loading-placeholder');
    
    try {
        const activities = await fetchRecentActivity();
        
        // Remover placeholder de loading
        loadingPlaceholder.remove();
        
        // Criar HTML das atividades
        const activitiesHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-avatar">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h6>${activity.title}</h6>
                    <p>${activity.description} • ${formatTimeAgo(activity.createdAt)}</p>
                </div>
            </div>
        `).join('');
        
        activityFeed.innerHTML = activitiesHTML;
        
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        loadingPlaceholder.innerHTML = '<p class="text-muted">Erro ao carregar atividades</p>';
    }
}

// Buscar atividades recentes
async function fetchRecentActivity() {
    try {
        const response = await fetch('/api/recent-activity');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('API não disponível, usando dados de exemplo');
    }
    
    // Dados de exemplo
    return [
        {
            type: 'event',
            title: 'Novo evento criado',
            description: 'Workshop de JavaScript foi adicionado',
            createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 min atrás
        },
        {
            type: 'group',
            title: 'Novo grupo formado',
            description: 'Grupo "Desenvolvedores React" foi criado',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2h atrás
        },
        {
            type: 'user',
            title: 'Novos membros',
            description: '5 pessoas se juntaram hoje',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4h atrás
        }
    ];
}

// Carregar próximos eventos
async function loadUpcomingEvents() {
    const upcomingEvents = document.querySelector('.upcoming-events');
    const loadingPlaceholder = upcomingEvents.querySelector('.loading-placeholder');
    
    try {
        const events = await fetchUpcomingEvents();
        
        // Remover placeholder
        loadingPlaceholder.remove();
        
        // Criar HTML dos eventos
        const eventsHTML = events.map(event => `
            <div class="event-item mb-3">
                <div class="d-flex">
                    <div class="event-date me-3">
                        <div class="date-day">${formatDay(event.date)}</div>
                        <div class="date-month">${formatMonth(event.date)}</div>
                    </div>
                    <div class="event-info">
                        <h6 class="mb-1">${event.title}</h6>
                        <small class="text-muted">${event.location}</small>
                        <div class="mt-1">
                            <small class="badge bg-primary">${event.attendees} participantes</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        upcomingEvents.innerHTML = eventsHTML;
        
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        loadingPlaceholder.innerHTML = '<p class="text-muted">Erro ao carregar eventos</p>';
    }
}

// Buscar próximos eventos
async function fetchUpcomingEvents() {
    try {
        const response = await fetch('/api/upcoming-events');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('API não disponível, usando dados de exemplo');
    }
    
    // Dados de exemplo
    const today = new Date();
    return [
        {
            title: 'Workshop JavaScript',
            location: 'Online',
            date: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 2), // 2 dias
            attendees: 24
        },
        {
            title: 'Meetup React',
            location: 'São Paulo',
            date: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 5), // 5 dias
            attendees: 18
        },
        {
            title: 'Hackathon',
            location: 'Florianópolis',
            date: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 7), // 7 dias
            attendees: 42
        }
    ];
}

// Efeitos de scroll
function setupScrollEffects() {
    // Parallax suave no hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Animação das stats quando aparecem na tela
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Re-animar os contadores quando a seção aparece
                    setTimeout(() => loadStats(), 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// Interações com formulários e botões
function setupFormInteractions() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efeito hover nos botões
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Funções auxiliares
function getActivityIcon(type) {
    const icons = {
        'event': 'fa-calendar-plus',
        'group': 'fa-users',
        'user': 'fa-user-plus',
        'comment': 'fa-comment'
    };
    return icons[type] || 'fa-bell';
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMin = Math.floor(diffInMs / (1000 * 60));
    const diffInHour = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDay = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMin < 60) return `${diffInMin}m atrás`;
    if (diffInHour < 24) return `${diffInHour}h atrás`;
    return `${diffInDay}d atrás`;
}

function formatDay(date) {
    return date.getDate().toString().padStart(2, '0');
}

function formatMonth(date) {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 
                   'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return months[date.getMonth()];
}

// Adicionar CSS adicional para os eventos
const additionalCSS = `
.event-item {
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #eee;
    transition: all 0.3s ease;
}

.event-item:hover {
    background: #f8f9fa;
    border-color: #667eea;
}

.event-date {
    text-align: center;
    min-width: 50px;
}

.date-day {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
}

.date-month {
    font-size: 0.8rem;
    color: #666;
    font-weight: 600;
}

.event-info h6 {
    color: #333;
    font-weight: 600;
}
`;

// Injetar CSS adicional
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Sistema de busca na página (opcional)
function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            }
        });
    }
}

async function performSearch(query) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const results = await response.json();
            displaySearchResults(results);
        }
    } catch (error) {
        console.error('Erro na busca:', error);
    }
}

function displaySearchResults(results) {
    // Implementar exibição dos resultados de busca
    console.log('Resultados da busca:', results);
}

// Notificações toast (opcional)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Lazy loading para imagens (opcional)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}