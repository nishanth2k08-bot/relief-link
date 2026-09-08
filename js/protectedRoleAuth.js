// ReliefLink protected role authentication
(function () {
  'use strict';

  const PROTECTED_ROLES = {
    'administrator@relieflink.app': 'administrator',
    'admin@relieflink.app': 'admin',
    'coordinator@relieflink.app': 'coordinator'
  };

  function removeDemoRoleLogin() {
    document.querySelectorAll('.role-btn').forEach((button) => {
      button.remove();
    });
  }

  function applyAuthenticatedRole(user) {
    if (!user || !window.store) return;

    const email = (user.email || '').trim().toLowerCase();
    const role = PROTECTED_ROLES[email] || 'responder';
    const previous = window.store.currentUser || {};

    window.store.currentUser = {
      ...previous,
      id: user.uid,
      email: user.email,
      name: user.displayName || previous.name || email.split('@')[0],
      role,
      agency: previous.agency || 'Authorized Responder Agency',
      badgeId: previous.badgeId || `AUTH-${user.uid.slice(0, 6).toUpperCase()}`,
      avatar: (email || 'US').slice(0, 2).toUpperCase()
    };
    window.store.isAuthenticated = true;
    window.store.saveState();
  }

  function protectLoginButtons() {
    removeDemoRoleLogin();
    const observer = new MutationObserver(removeDemoRoleLogin);
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  function init() {
    protectLoginButtons();

    const waitForStore = setInterval(() => {
      if (!window.store || !window.store.firebaseAuth) return;
      clearInterval(waitForStore);

      window.store.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          applyAuthenticatedRole(user);
        }
      });
    }, 100);

    setTimeout(() => clearInterval(waitForStore), 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
