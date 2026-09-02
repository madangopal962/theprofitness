const todayDate = document.getElementById('todayDate');
const themeToggle = document.querySelector('.theme-toggle');

function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = String(date.getFullYear()).slice(-2);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day} ${month} ${year}, ${weekday}`;
}

const now = new Date();
todayDate.textContent = formatDate(now);

function applyTheme(isDark) {
    document.body.classList.toggle('theme-dark', isDark);
    themeToggle.classList.toggle('is-dark', isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(false);

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('theme-dark');
    applyTheme(isDark);
});
