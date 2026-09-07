/* ReliefLink - reliable Firestore sync for locally-created incident reports. */
(function(){
  'use strict';
  const COLLECTION='incidents';
  const STATE_KEY='relieflink_state_v1';
  const CHECK_MS=1000;
  const known=new Set();
  const syncing=new Set();
  const synced=new Set();
  const failed=new Map();
  function toast(message){
    if(typeof window.showToast==='function')window.showToast(message);
    else console.info('[ReliefLink]',message);
  }
  function readState(){
    try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}catch(e){return {}}
  }
  function clean(value){
    if(value===undefined)return undefined;
    if(value===null)return null;
    if(Array.isArray(value))return value.map(clean).filter(v=>v!==undefined);
    if(value instanceof Date)return value;
    if(typeof value==='object'){
      const out={};
      Object.keys(value).forEach(key=>{const v=clean(value[key]);if(v!==undefined)out[key]=v;});
      return out;
    }
    return value;
  }
  async function getDb(){
    if(!window.firebase||!window.firebase.apps||!window.firebase.apps.length)throw new Error('Firebase is not initialized');
    return window.firebase.firestore();
  }
  async function syncIncident(incident,showSuccess=true){
    if(!incident||!incident.id)return false;
    const id=String(incident.id);
    if(syncing.has(id)||synced.has(id))return synced.has(id);
    syncing.add(id);
    try{
      const db=await getDb();
      const auth=window.firebase.auth();
      const payload=clean({...incident,syncedToFirestore:true,syncedAt:window.firebase.firestore.FieldValue.serverTimestamp()});
      if(auth&&auth.currentUser)payload.firebaseUserId=auth.currentUser.uid;
      await db.collection(COLLECTION).doc(id).set(payload,{merge:true});
      synced.add(id);failed.delete(id);
      if(showSuccess)toast('Incident report saved to Firebase successfully.');
      window.dispatchEvent(new CustomEvent('relieflink:incident-synced',{detail:{id}}));
      return true;
    }catch(err){
      const count=(failed.get(id)||0)+1;failed.set(id,count);
      console.error('ReliefLink Firestore incident sync failed:',err);
      if(showSuccess||count===1)toast('Incident saved locally, but Firebase sync failed: '+(err.message||'Unknown error'));
      return false;
    }finally{syncing.delete(id)}
  }
  function scan(){
    const state=readState();
    const incidents=Array.isArray(state.incidents)?state.incidents:[];
    incidents.forEach(incident=>{
      const id=String(incident?.id||'');
      if(!id||!/^INC-\d+$/.test(id)||/^INC-809[12]$/.test(id))return;
      known.add(id);
      if(!synced.has(id)&&!syncing.has(id))syncIncident(incident,!failed.has(id));
    });
  }
  function bind(){
    if(document.__reliefLinkIncidentSyncBound)return;
    document.__reliefLinkIncidentSyncBound=true;
    const initial=readState();
    (Array.isArray(initial.incidents)?initial.incidents:[]).forEach(i=>{if(i?.id)known.add(String(i.id));});
    setInterval(scan,CHECK_MS);
    scan();
    document.addEventListener('submit',()=>setTimeout(scan,100),true);
    window.ReliefLinkIncidentSync={syncLatest:()=>{const s=readState();return syncIncident(s.incidents?.[0],true)}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
