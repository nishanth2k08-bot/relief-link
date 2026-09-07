/* ReliefLink Animation 6 - Notification and alert attention cues. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-6-notifications';

  function mount() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .notification-bell,
      #notification-bell,
      .btn-notification {
        transform-origin: top center;
      }

      .rl-a6-notification-pulse {
        animation: rlA6BellPulse .55s ease-in-out both;
      }

      .rl-a6-unread {
        animation: rlA6UnreadIn .32s cubic-bezier(.2,.75,.2,1) both;
      }

      @keyframes rlA6BellPulse {
        0%, 100% { transform: rotate(0); }
        18% { transform: rotate(-8deg); }
        36% { transform: rotate(8deg); }
        54% { transform: rotate(-5deg); }
        72% { transform: rotate(4deg); }
      }

      @keyframes rlA6UnreadIn {
        from { opacity: .45; transform: translateY(-3px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (prefers-reduced-motion: reduce) {
        .rl-a6-notification-pulse,
        .rl-a6-unread {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function observeNotifications() {
    const app = document.querySelector('#app');
    if (!app || app.__rlA6Observer) return;
    app.__rlA6Observer = true;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          const candidates = [node, ...node.querySelectorAll('*')];
          candidates.forEach((el) => {
            if (el.matches && el.matches('.notification-item, .notification, [data-notification]')) {
              el.classList.add('rl-a6-unread');
            }
          });
        });
      }
    });

    observer.observe(app, { childList: true, subtree: true });
  }

  function bindBell() {
    document.addEventListener('click', (event) => {
      const bell = event.target.closest('.notification-bell, #notification-bell, .btn-notification');
      if (!bell) return;
      bell.classList.remove('rl-a6-notification-pulse');
      void bell.offsetWidth;
      bell.classList.add('rl-a6-notification-pulse');
    }, true);
  }

  function init() {
    mount();
    observeNotifications();
    bindBell();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
