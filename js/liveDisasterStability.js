/* ReliefLink - final map marker stability guard. */
(function(){
  'use strict';

  function stabilize(map){
    if(!map || !window.L || map.__reliefLinkMarkerStability) return;
    map.__reliefLinkMarkerStability = true;

    // The bundled map uses Canvas + animated zoom. Use Leaflet's SVG renderer
    // for live circles so their geographic positions are recalculated normally.
    map.options.preferCanvas = false;
    map.options.zoomAnimation = false;
    map.options.markerZoomAnimation = false;
    map.options.fadeAnimation = false;
    map.options.worldCopyJump = false;

    // The old demo markers are hard-coded in bundle.js. They can sit above the
    // live layer and intercept clicks, so hide them without changing other UI.
    const style = document.createElement('style');
    style.id = 'rl-live-marker-stability-style';
    style.textContent = `
      .disaster-3d-icon { display:none !important; pointer-events:none !important; }
      .rl-live-earthquake-circle,
      .rl-live-eonet-circle { cursor:pointer !important; pointer-events:auto !important; }
      .leaflet-overlay-pane svg { pointer-events:auto; }
    `;
    document.head.appendChild(style);

    // Remove any already-created demo markers immediately.
    function hideDemoMarkers(){
      map.getContainer().querySelectorAll('.disaster-3d-icon').forEach(el=>{
        el.style.display='none';
        el.style.pointerEvents='none';
      });
    }
    hideDemoMarkers();
    const observer = new MutationObserver(hideDemoMarkers);
    observer.observe(map.getContainer(), {childList:true, subtree:true});
    map.__reliefLinkMarkerStabilityObserver = observer;
  }

  function check(){
    const map = window.__reliefLinkActiveMap;
    if(map) stabilize(map);
  }

  const timer=setInterval(check,250);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',check,{once:true});
  else check();
})();
