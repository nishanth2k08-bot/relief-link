/* ReliefLink - reliable Firestore sync for locally-created incident reports. */
(function(){
  'use strict';
  const COLLECTION='incidents';
  const STATE_KEY='relieflink_state_v1';
  const CHECK_MS=750;
  const known=new Set();
  const syncing=new Set();
  const synced=new Set();

  function toast(message,type='success'){
    if(typeof window.showToast==='function') window.showToast(message,type);
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
      Object.keys(value).forEach(k=>{const v=clean(value[k]);if(v!==undefined)out[k]=v});
      return out;
    }
    return value;
  }

  async function getDb(){
    if(!window.firebase||!window.firebase.apps||!window.firebase.apps.length)throw new Error('Firebase SDK is not initialized');
    const app=window.firebase.app();
    const projectId=app.options&&app.options.projectId;
    if(projectId!=='relief-link-ff2a6')throw new Error('Wrong Firebase project: '+(projectId||'unknown'));
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
      const payload=clean({...incident,
        syncedToFirestore:true,
        syncedAt:window.firebase.firestore.FieldValue.serverTimestamp()
      });
      if(auth&&auth.currentUser)payload.firebaseUserId=auth.currentUser.uid;

      const ref=db.collection(COLLECTION).doc(id);
      await ref.set(payload,{merge:true});
      const check=await ref.get();
      if(!check.exists)throw new Error('Firestore write returned but the document was not found on the backend');

      synced.add(id);
      if(showSuccess)toast('Incident report saved to Firebase successfully.');
      window.dispatchEvent(new CustomEvent('relieflink:incident-synced',{detail:{id,projectId:'relief-link-ff2a6'}}));
      console.info('[ReliefLink] Firestore incident verified:',id);
      return true;
    }catch(err){
      console.error('[ReliefLink] Firestore incident sync failed:',err);
      toast('Firebase sync FAILED: '+(err.code?err.code+' - ':'')+(err.message||'Unknown error'),'error');
      return false;
    }finally{syncing.delete(id)}
  }

  function scan(){
    const state=readState();
    const incidents=Array.isArray(state.incidents)?state.incidents:[];
    incidents.forEach(incident=>{
      const id=String(incident?.id||'');
      if(!id||!/^INC-\d+$/.test(id)||/^INC-809[12]$/.test(id))return;
      if(!known.has(id)){
        known.add(id);
        syncIncident(incident,true);
      }
    });
  }

  function bind(){
    if(document.__reliefLinkIncidentSyncBound)return;
    document.__reliefLinkIncidentSyncBound=true;
    const initial=readState();
    (Array.isArray(initial.incidents)?initial.incidents:[]).forEach(i=>{if(i?.id)known.add(String(i.id))});
    setInterval(scan,CHECK_MS);
    document.addEventListener('submit',()=>setTimeout(scan,100),true);
    window.ReliefLinkIncidentSync={
      syncLatest:()=>{const s=readState();return syncIncident(s.incidents?.[0],true)},
      syncIncident
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
