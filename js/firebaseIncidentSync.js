/* ReliefLink - reliable Firestore sync for locally-created incident reports. */
(function(){
  'use strict';
  const COLLECTION='incidents';
  let busy=false;
  function toast(message){
    if(typeof window.showToast==='function') window.showToast(message);
    else console.info('[ReliefLink]',message);
  }
  async function getDb(){
    if(!window.firebase || !window.firebase.apps || !window.firebase.apps.length) throw new Error('Firebase is not initialized');
    return window.firebase.firestore();
  }
  function latestLocalIncident(){
    try{
      const raw=localStorage.getItem('relieflink_state_v1');
      const state=raw?JSON.parse(raw):null;
      return state && Array.isArray(state.incidents) ? state.incidents[0] : null;
    }catch(e){return null}
  }
  function waitForAuth(auth,timeout=5000){
    if(auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise(resolve=>{
      let done=false;
      const finish=u=>{if(done)return;done=true;try{unsub&&unsub()}catch(e){};resolve(u||null)};
      let unsub=null;
      try{unsub=auth.onAuthStateChanged(u=>{if(u)finish(u)})}catch(e){finish(null)}
      setTimeout(()=>finish(auth.currentUser||null),timeout);
    });
  }
  async function syncLatest(){
    if(busy)return;
    busy=true;
    try{
      const db=await getDb();
      const auth=window.firebase.auth();
      const user=await waitForAuth(auth);
      const incident=latestLocalIncident();
      if(!incident || !incident.id) throw new Error('The submitted incident could not be read from local state');
      const payload={...incident,syncedToFirestore:true,syncedAt:window.firebase.firestore.FieldValue.serverTimestamp()};
      if(user) payload.firebaseUserId=user.uid;
      await db.collection(COLLECTION).doc(String(incident.id)).set(payload,{merge:true});
      toast('Incident report saved to Firebase successfully.');
      window.dispatchEvent(new CustomEvent('relieflink:incident-synced',{detail:{id:incident.id}}));
    }catch(err){
      console.error('ReliefLink Firestore incident sync failed:',err);
      toast('Incident saved locally, but Firebase sync failed: '+(err.message||'Unknown error'));
    }finally{busy=false}
  }
  function bind(){
    if(document.__reliefLinkIncidentSyncBound)return;
    document.__reliefLinkIncidentSyncBound=true;
    document.addEventListener('submit',e=>{
      if(e.target && e.target.id==='form-incident-submit'){
        setTimeout(syncLatest,0);
      }
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
  window.ReliefLinkIncidentSync={syncLatest};
})();
