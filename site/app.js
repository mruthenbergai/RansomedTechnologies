const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const updateThemeControl = () => {
  const dark = root.dataset.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', 'Dark mode');
  themeButton.setAttribute('title', `Switch to ${dark ? 'light' : 'dark'} mode`);
  document.querySelector('meta[name="theme-color"]').content = dark ? '#121315' : '#f5f4f0';
};
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('rt-theme', root.dataset.theme); } catch { /* The switch also works without storage. */ }
  updateThemeControl();
});
systemTheme.addEventListener('change', (event) => {
  let saved = null;
  try { saved = localStorage.getItem('rt-theme'); } catch { /* Use the system preference. */ }
  if (saved !== 'light' && saved !== 'dark') {
    root.dataset.theme = event.matches ? 'dark' : 'light';
    updateThemeControl();
  }
});
updateThemeControl();

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
});
matchMedia('(min-width: 701px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

const apps = {
  welcome: {
    name: 'WelcomeNow', category: 'COMMUNITY & CONNECTION',
    description: 'A thoughtful way for churches to welcome visitors, coordinate greeters, and nurture connection.',
    features: ['Give the first hello a thoughtful place in your church’s story.', 'Coordinate greeters and visitor connection in one workspace.', 'Keep the focus on people and the relationships that follow.'],
    status: 'Explore a more thoughtful welcome.', url: 'https://welcomenow.app/login', linkText: 'Visit WelcomeNow'
  },
  swap: {
    name: 'SwapWrite', category: 'TOOLS FOR AUTHORS',
    description: 'A dedicated workspace for authors to organize newsletter swaps, schedules, and follow-through.',
    features: ['Bring newsletter swap planning into a dedicated workspace.', 'Keep schedules and reciprocal sends easier to follow.', 'Organize your author connections and pen names.'],
    status: 'Explore the author newsletter swap workspace.', url: 'https://swapwrite.com', linkText: 'Visit SwapWrite'
  },
  read: {
    name: 'ReadIt4Me', category: 'READING & LISTENING',
    description: 'Read and listen to your books and documents, at your own pace.',
    features: ['Bring PDF, EPUB, and text documents into your reading space.', 'Listen with read-along narration and a choice of voices.', 'Bookmark your place and find a reading pace that suits you.'],
    status: 'Find your reading rhythm.', url: 'https://readit4me.vercel.app/', linkText: 'Visit ReadIt4Me'
  },
  jojo: {
    name: 'JoJo’s Playhouse', category: 'IMAGINATION & PLAY',
    description: 'An imaginative world for decorating rooms, creating characters, and playing out everyday adventures.',
    features: ['Make each room your own with imaginative decorating.', 'Create characters and bring their stories to life.', 'Discover playful possibilities in everyday adventures.'],
    status: 'Coming soon. A little world with a lot of imagination.'
  }
};
const dialog = document.querySelector('#app-dialog');
document.querySelectorAll('[data-app]').forEach((button) => button.addEventListener('click', () => {
  const app = apps[button.dataset.app];
  document.querySelector('#dialog-category').textContent = app.category;
  document.querySelector('#dialog-title').textContent = app.name;
  document.querySelector('#dialog-icon').hidden = button.dataset.app !== 'read';
  document.querySelector('#dialog-description').textContent = app.description;
  document.querySelector('#dialog-status').textContent = app.status;
  const features = document.querySelector('#dialog-features');
  features.replaceChildren(...app.features.map((feature) => {
    const li = document.createElement('li'); li.textContent = feature; return li;
  }));
  const link = document.querySelector('#dialog-link');
  link.href = app.url || `mailto:sales@transformedtechnologies.com?subject=${encodeURIComponent(`Tell me about ${app.name}`)}`;
  link.replaceChildren(document.createTextNode(app.linkText || `Ask about ${app.name}`));
  const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗'; link.append(arrow);
  dialog.showModal();
  document.body.classList.add('no-scroll');
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('no-scroll'));
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

const form = document.querySelector('#project-form');
let currentInquiry = '';
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = new FormData(form);
  const name = String(values.get('name')).trim();
  const email = String(values.get('email')).trim();
  const service = String(values.get('service'));
  const idea = String(values.get('idea')).trim();
  if (!name || !idea) {
    document.querySelector('#form-status').textContent = 'Please add your name and a little about your idea.';
    (!name ? form.elements.name : form.elements.idea).focus();
    return;
  }
  currentInquiry = `Hello Ransomed Technologies,\n\nMy name is ${name}.\nEmail: ${email}\nStarting point: ${service}\n\n${idea}\n\nI’d like to talk about the possibilities.`;
  const mailto = `mailto:sales@transformedtechnologies.com?subject=${encodeURIComponent(`Project inquiry: ${service}`)}&body=${encodeURIComponent(currentInquiry)}`;
  document.querySelector('#brief-actions').hidden = false;
  const status = document.querySelector('#form-status');
  if (mailto.length > 1900) {
    status.textContent = 'Your inquiry is ready. Copy or download it and email sales@transformedtechnologies.com; it is too long for some email apps to open reliably.';
    return;
  }
  window.location.href = mailto;
  status.textContent = 'Your email draft is ready to open. If no email app opens, copy or download your inquiry and email it to sales@transformedtechnologies.com.';
});
document.querySelector('#copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentInquiry);
    document.querySelector('#form-status').textContent = 'Inquiry copied. Paste it into an email to sales@transformedtechnologies.com.';
  } catch {
    document.querySelector('#form-status').textContent = 'Your browser could not copy the inquiry. Use Download inquiry to save a text file.';
  }
});
document.querySelector('#download-brief').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([currentInquiry], {type: 'text/plain;charset=utf-8'}));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ransomed-project-inquiry.txt'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#form-status').textContent = 'Your inquiry download has started. Email it to sales@transformedtechnologies.com when you’re ready.';
});
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
