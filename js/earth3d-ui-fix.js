/* ReliefLink 3D Earth UI fixes: restore the original disaster indicators and tune the initial camera. */
(function(){
'use strict';
const STATIC=[
{name:'Cyclone Hector (Category 4)',type:'cyclone',icon:'🌀',color:'#EF4444',lat:25.7617,lng:-80.1918,region:'Caribbean & US East Coast'},
{name:'Pacific Ring Seismic Swarm (Mw 7.2)',type:'earthquake',icon:'⚠',color:'#EF4444',lat:35.6762,lng:139.6503,region:'Japan & East Asia'},
{name:'Monsoon Basin Inundation',type:'flood',icon:'🌊',color:'#F59E0B',lat:23.8103,lng:90.4125,region:'South Asia / Ganges River Delta'},
{name:'Mediterranean Wildfire Complex',type:'wildfire',icon:'🔥',color:'#F59E0B',lat:37.9838,lng:23.7275,region:'Southern Europe / Greece'},
{name:'Mount Semeru Volcanic Eruption',type:'volcano',icon:'🌋',color:'#EF4444',lat:-8.108,lng:112.922,region:'Java, Indonesia'},
{name:'Alpine Glacial Outburst Flood',type:'flood',icon:'⛰',color:'#EAB308',lat:46.8182,lng:8.2275,region:'Swiss Alps, Europe'}
];
let lastViewer=null,lastWidth=0,lastHeight=0,ready=false;
function svg(icon,color){return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="#07111d" stroke="'+color+'" stroke-width="4"/><circle cx="32" cy="32" r="23" fill="'+color+'" fill-opacity=".18"/><text x="32" y="42" text-anchor="middle" font-size="29">'+icon+'</text></svg>')}
function tune(v){if(!v||v.isDestroyed())return;const c=v.container;if(!c)return;const w=c.clientWidth||0,h=c.clientHeight||0;if(!w||!h)return;const center=Cesium.Cartesian3.fromDegrees(78,18,18500000);v.camera.setView({destination:center,orientation:{heading:0,pitch:Cesium.Math.toRadians(-90),roll:0}});v.scene.requestRender();lastViewer=v;lastWidth=w;lastHeight=h;ready=true}
function addStatic(v){if(!v||v.isDestroyed())return;STATIC.forEach(d=>{v.entities.add({position:Cesium.Cartesian3.fromDegrees(d.lng,d.lat,30000),billboard:{image:svg(d.icon,d.color),width:36,height:36,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,disableDepthTestDistance:Number.POSITIVE_INFINITY,scaleByDistance:new Cesium.NearFarScalar(2e5,1.15,2.5e7,.72)},label:{text:d.name,font:'600 11px Inter,sans-serif',fillColor:Cesium.Color.WHITE,outlineColor:Cesium.Color.BLACK,outlineWidth:3,pixelOffset:new Cesium.Cartesian2(0,-36),showBackground:true,backgroundColor:Cesium.Color.fromAlpha(Cesium.Color.BLACK,.62),disableDepthTestDistance:Number.POSITIVE_INFINITY,scaleByDistance:new Cesium.NearFarScalar(2e5,.9,2.5e7,.25)},description:'<h3 style="color:'+d.color+'">'+d.name+'</h3><p><b>Region:</b> '+d.region+'</p><p><b>Type:</b> '+d.type+'</p><small>ReliefLink disaster indicator</small>'}});});}
function install(){const api=window.ReliefLink3DEarth;if(!api||typeof api.getViewer!=='function')return false;const v=api.getViewer();if(!v||v.isDestroyed())return false;if(v!==lastViewer){lastViewer=null;ready=false;tune(v);addStatic(v);return true}if(!ready||v.container.clientWidth!==lastWidth||v.container.clientHeight!==lastHeight){tune(v)}const has=STATIC.length&&v.entities.values.some(e=>e.description&&String(e.description).includes('ReliefLink disaster indicator'));if(!has)addStatic(v);return true}
function start(){setTimeout(install,250);setInterval(install,1500);addEventListener('resize',()=>{const v=apiViewer();if(v&&!v.isDestroyed())setTimeout(()=>tune(v),50)});}
function apiViewer(){return window.ReliefLink3DEarth&&typeof window.ReliefLink3DEarth.getViewer==='function'?window.ReliefLink3DEarth.getViewer():null}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();