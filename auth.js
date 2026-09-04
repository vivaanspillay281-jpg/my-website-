/* Supabase Auth for the static portfolio site. */
const SUPABASE_URL = 'https://fkkvkujvfbqxnjxhvhft.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_cXzqlha2PV-N-HnXGMyQrw_DQ7-Z1h_';

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const PUBLIC_PAGES = new Set(['index.html', 'auth.html', '']);
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function goToLogin() {
  const next = `${window.location.pathname}${window.location.search}`;
  window.location.replace(`auth.html?next=${encodeURIComponent(next)}`);
}

function addAuthNav(user) {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const existing = navLinks.querySelector('[data-auth-link]');
  if (existing) existing.remove();

  const link = document.createElement('button');
  link.type = 'button';
  link.dataset.authLink = 'true';
  link.className = 'nav-auth-button';
  link.textContent = user ? 'Sign out' : 'Sign in';
  link.addEventListener('click', async () => {
    if (!user) {
      goToLogin();
      return;
    }
    await supabaseClient.auth.signOut();
    window.location.replace('index.html');
  });
  navLinks.appendChild(link);
}

async function protectPage() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!PUBLIC_PAGES.has(currentPage) && !user) {
    goToLogin();
    return;
  }

  addAuthNav(user);
}

async function setupAuthPage() {
  const form = document.querySelector('#auth-form');
  const emailInput = document.querySelector('#auth-email');
  const passwordInput = document.querySelector('#auth-password');
  const submitButton = document.querySelector('#auth-submit');
  const toggleButton = document.querySelector('#auth-toggle');
  const message = document.querySelector('#auth-message');
  const title = document.querySelector('#auth-title');
  const subtitle = document.querySelector('#auth-subtitle');

  if (!form) return;

  let mode = 'login';
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next') || 'index.html';

  const safeNext = next.startsWith('/') || /^[a-zA-Z0-9._/-]+\.html(?:\?.*)?$/.test(next)
    ? next
    : 'index.html';

  function renderMode() {
    const signup = mode === 'signup';
    title.textContent = signup ? 'Create your account.' : 'Welcome back.';
    subtitle.textContent = signup
      ? 'Create an account to access the private sections of Vivaan’s portfolio.'
      : 'Sign in to continue to the portfolio.';
    submitButton.textContent = signup ? 'Create account' : 'Sign in';
    toggleButton.textContent = signup ? 'Already have an account? Sign in' : 'New here? Create an account';
    message.textContent = '';
  }

  toggleButton.addEventListener('click', () => {
    mode = mode === 'login' ? 'signup' : 'login';
    renderMode();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = mode === 'signup' ? 'Creating...' : 'Signing in...';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      const result = mode === 'signup'
        ? await supabaseClient.auth.signUp({ email, password })
        : await supabaseClient.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;

      if (mode === 'signup' && !result.data.session) {
        message.textContent = 'Account created. Check your email to confirm your account, then sign in.';
        return;
      }

      window.location.replace(safeNext);
    } catch (error) {
      message.textContent = error?.message || 'Authentication failed. Please try again.';
    } finally {
      submitButton.disabled = false;
      renderMode();
    }
  });

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (user) window.location.replace(safeNext);
  renderMode();
}

if (currentPage === 'auth.html') {
  setupAuthPage();
} else {
  protectPage();
}
