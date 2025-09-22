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
        const stats = await fetchStats();
        console.log('[STATS] Dados recebidos do backend:', stats);
        animateCounter('group-count', stats.groups);
        animateCounter('event-count', stats.events);
        animateCounter('user-count', stats.totalUsers); // Para o card do topo (Conexões)
        animateCounter('total-users', stats.totalUsers); // Usuários Ativos (stats section)
        animateCounter('total-events', stats.totalEvents);
        animateCounter('total-groups', stats.totalGroups);
        animateCounter('total-connections', stats.totalConnections); // Conexões (amizades aceitas)
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Buscar estatísticas da API
async function fetchStats() {
    const response = await fetch('/stats');
    if (response.ok) {
        return await response.json();
    }
    // Se falhar, retorna zeros
    return {
        groups: 0,
        events: 0,
        users: 0,
        totalUsers: 0,
        totalEvents: 0,
        totalGroups: 0,
        totalConnections: 0
    };
}

// Animação de contadores
function animateCounter(elementId, target) {
    const element = document.querySelector(`#${elementId}`);
    if (!element) {
        console.warn(`[STATS] Elemento não encontrado para id: ${elementId}`);
        return;
    }
    console.log(`[STATS] Preenchendo contador ${elementId} com valor:`, target);

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
        loadingPlaceholder.remove();
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
    const response = await fetch('/api/recent-activity');
    if (response.ok) {
        const data = await response.json();
        return data.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt)
        }));
    }
    return [];
}

// Carregar próximos eventos
async function loadUpcomingEvents() {
    const upcomingEvents = document.querySelector('.upcoming-events');
    const loadingPlaceholder = upcomingEvents.querySelector('.loading-placeholder');
    try {
        const events = await fetchUpcomingEvents();
        loadingPlaceholder.remove();
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
    const response = await fetch('/api/upcoming-events');
    if (response.ok) {
        const data = await response.json();
        return data.map(ev => ({
            ...ev,
            date: new Date(ev.date)
        }));
    }
    return [];
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