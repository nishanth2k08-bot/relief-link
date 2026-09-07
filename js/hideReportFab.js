/* ReliefLink - hide the floating Report Incident/SOS action. */
(function () {
  'use strict';

  function removeReportFab() {
    document.querySelectorAll('#fab-sos-button').forEach((button) => button.remove());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeReportFab, { once: true });
  } else {
    removeReportFab();
  }

  new MutationObserver(removeReportFab).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
