/* ReliefLink: four separate OTP boxes, while keeping MSG91's existing #otp-code bridge intact. */
(function(){'use strict';
function install(){
  const group=document.querySelector('#otp-input-group');
  const old=document.querySelector('#otp-code');
  if(!group||!old||group.querySelector('.otp-four-boxes')) return;
  old.type='hidden';
  old.setAttribute('aria-hidden','true');
  old.tabIndex=-1;
  const wrap=document.createElement('div');
  wrap.className='otp-four-boxes';
  wrap.setAttribute('role','group');
  wrap.setAttribute('aria-label','Enter 4 digit OTP');
  wrap.style.cssText='display:flex;justify-content:center;gap:10px;margin:10px 0 4px;';
  const inputs=[];
  for(let i=0;i<4;i++){
    const input=document.createElement('input');
    input.type='text'; input.inputMode='numeric'; input.maxLength=1;
    input.autocomplete=i===0?'one-time-code':'off';
    input.setAttribute('aria-label','OTP digit '+(i+1));
    input.style.cssText='width:56px;height:58px;text-align:center;font-size:1.35rem;font-weight:700;letter-spacing:0;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-app);color:var(--text-main);outline:none;transition:border-color .15s,box-shadow .15s;';
    input.addEventListener('focus',()=>{input.style.borderColor='var(--color-primary)';input.style.boxShadow='0 0 0 3px rgba(59,130,246,.14)';});
    input.addEventListener('blur',()=>{input.style.borderColor='var(--border-color)';input.style.boxShadow='none';});
    input.addEventListener('input',()=>{
      input.value=input.value.replace(/\D/g,'').slice(0,1);
      sync(); if(input.value&&i<3) inputs[i+1].focus();
    });
    input.addEventListener('keydown',e=>{
      if(e.key==='Backspace'&&!input.value&&i>0) inputs[i-1].focus();
      if(e.key==='ArrowLeft'&&i>0){e.preventDefault();inputs[i-1].focus();}
      if(e.key==='ArrowRight'&&i<3){e.preventDefault();inputs[i+1].focus();}
      if(e.key==='Enter'){e.preventDefault();const b=group.querySelector('#btn-verify-otp');if(b)b.click();}
    });
    input.addEventListener('paste',e=>{
      const text=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,4);
      if(!text)return;e.preventDefault();text.split('').forEach((d,j)=>{if(inputs[j])inputs[j].value=d;});sync();inputs[Math.min(text.length,4)-1]?.focus();
    });
    inputs.push(input);wrap.appendChild(input);
  }
  function sync(){old.value=inputs.map(x=>x.value).join('');old.dispatchEvent(new Event('input',{bubbles:true}));}
  group.insertBefore(wrap,old);
  const observer=new MutationObserver(()=>{
    if(old.value && old.value.length===4){old.value.split('').forEach((d,i)=>{if(inputs[i])inputs[i].value=d;});}
  });
  observer.observe(old,{attributes:true,attributeFilter:['value']});
  window.ReliefLinkOtpBoxes={getCode:()=>inputs.map(x=>x.value).join(''),clear:()=>{inputs.forEach(x=>x.value='');sync();inputs[0].focus();}};
}
function watch(){install();const app=document.getElementById('app');if(app)new MutationObserver(()=>install()).observe(app,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();