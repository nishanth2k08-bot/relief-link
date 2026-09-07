/* ReliefLink - reliable Firestore sync for locally-created incident reports. */
(function(){
  'use strict';
  const COLLECTION='incidents';
  const STATE_KEY='relieflink_state_v1';
  const CHECK_MS=750;
  const known=new Set();
  const syncing=new Set();
  function toast(message){
    if(typeof window.showToast==='function') window.showToast(message);
    else console.info('[ReliefLink]',message);
  }
  function readState(){
    try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}catch(e){return {}}
  }
  async function getDb(){
    if(!window.firebase || !window.firebase.apps || !window.firebase.apps.length) throw new Error('Firebase is not initialized');
    return window.firebase.firestore();
  }
  function waitForAuth(auth,timeout=5000){
    if(auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise(resolve=>{
      let done=false,unsub=null;
      const finish=u=>{if(done)return;done=true;try{if(unsub)unsub()}catch(e){};resolve(u||null)};
      try{unsub=auth.onAuthStateChanged(u=>{if(u)finish(u)})}catch(e){finish(null)}
      setTimeout(()=>finish(auth.currentUser||null),timeout);
    });
  }
  async function syncIncident(incident,showSuccess=true){
    if(!incident||!incident.id||syncing.has(String(incident.id)))return false;
    const id=String(incident.id); syncing.add(id);
    try{
      const db=await getDb();
      const auth=window.firebase.auth();
      const user=await waitForAuth(auth);
      const payload={...incident,syncedToFirestore:true,syncedAt:window.firebase.firestore.FieldValue.serverTimestamp()};
      if(user)payload.firebaseUserId=user.uid;
      await db.collection(COLLECTION).doc(id).set(payload,{merge:true});
      if(showSuccess)toast('Incident report saved to Firebase successfully.');
      window.dispatchEvent(new CustomEvent('relieflink:incident-synced',{detail:{id}}));
      return true;
    }catch(err){
      console.error('ReliefLink Firestore incident sync failed:',err);
      toast('Incident saved locally, but Firebase sync failed: '+(err.message||'Unknown error'));
      return false;
    }finally{syncing.delete(id)}
  }
  function scan(){
    const state=readState();
    const incidents=Array.isArray(state.incidents)?state.incidents:[];
    incidents.forEach(incident=>{
      const id=String(incident?.id||'');
      if(!id)return;
      if(!known.has(id)){
        known.add(id);
        if(/^INC-\d+$/.test(id) && !/^INC-809[12]$/.test(id))syncIncident(incident,true);
      }
    });
  }
  function bind(){
    if(document.__reliefLinkIncidentSyncBound)return;
    document.__reliefLinkIncidentSyncBound=true;
    const initial=readState();
    (Array.isArray(initial.incidents)?initial.incidents:[]).forEach(i=>{if(i?.id)known.add(String(i.id))});
    setInterval(scan,CHECK_MS);
    scan();
    document.addEventListener('submit',()=>setTimeout(scan,50),true);
    window.ReliefLinkIncidentSync={syncLatest:()=>{const s=readState();return syncIncident(s.incidents?.[0],true)}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
