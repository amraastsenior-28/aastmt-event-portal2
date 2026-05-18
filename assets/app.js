// ============================================================
// app.js — AASTMT Events Portal — Shared Frontend Logic
// ============================================================

// ---- D1: Theme Toggle ----
function initTheme() {
    const savedTheme = localStorage.getItem('aastmt_theme');
    if (savedTheme) {
        document.documentElement.dataset.theme = savedTheme;
        updateThemeText(savedTheme);
    }
}

function toggleTheme() {
    const isLight = document.documentElement.dataset.theme === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    
    if (newTheme === 'dark') {
        delete document.documentElement.dataset.theme;
        localStorage.removeItem('aastmt_theme');
    } else {
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('aastmt_theme', newTheme);
    }
    
    updateThemeText(newTheme);
}

function updateThemeText(theme) {
    const textEl = document.getElementById('theme-text');
    if (textEl) {
        textEl.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }
}

// Initialize theme immediately
initTheme();

// ---- Q3: Toast Notification System ----
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = msg;
    container.appendChild(toast);

    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        setTimeout(() => toast.remove(), 350);
    }, 3500);
}

// ---- A1: Sidebar Toggle (mobile) ----
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// ---- Q5: Category Filter Chips ----
let activeFilter = 'all';
let activeSearch = '';

function setFilter(category, btn) {
    activeFilter = category;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function filterEvents() {
    activeSearch = document.getElementById('search-input')?.value.toLowerCase() || '';
    applyFilters();
}

function applyFilters() {
    const cards = document.querySelectorAll('.event-card');
    let visible = 0;

    cards.forEach(card => {
        const matchCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
        const matchSearch   = !activeSearch ||
            card.dataset.title.includes(activeSearch) ||
            card.dataset.venue.includes(activeSearch);

        if (matchCategory && matchSearch) {
            card.style.display = '';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });

    const noResults = document.getElementById('no-results');
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

// ---- A2: Event Detail Modal ----
function openEventModal(id, title, desc, date, venue, capacity, remaining, image, tier) {
    document.getElementById('modal-title').textContent    = title;
    document.getElementById('modal-desc').textContent     = desc;
    document.getElementById('modal-date').textContent     = date;
    document.getElementById('modal-venue').textContent    = venue;
    document.getElementById('modal-capacity').textContent = capacity + ' seats — ' + remaining + ' remaining';
    document.getElementById('modal-tier').innerHTML       = `<span class="tier-badge ${tier === 'Free' ? 'tier-free' : 'tier-paid'}" style="position:static;">${tier}</span>`;
    document.getElementById('modal-image').src            = image;
    document.getElementById('modal-register-btn').href    = `event_register.php?id=${id}`;

    const overlay = document.getElementById('event-modal-overlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeEventModal() {
    document.getElementById('event-modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeEventModal();
});
