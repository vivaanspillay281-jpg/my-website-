const menu=document.querySelector('.menu');const links=document.querySelector('.nav-links');if(menu){menu.addEventListener('click',()=>{links.classList.toggle('open')})}document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));const navLinks=document.querySelector('.nav-links');let themeToggle=document.querySelector('.theme-toggle');if(!themeToggle&&navLinks){themeToggle=document.createElement('button');themeToggle.className='theme-toggle';navLinks.appendChild(themeToggle)}const savedTheme=localStorage.getItem('vivaan-theme');if(savedTheme==='light'){document.documentElement.dataset.theme='light'}else{document.documentElement.dataset.theme='dark'}const updateThemeButton=()=>{if(themeToggle){const light=document.documentElement.dataset.theme==='light';themeToggle.textContent=light?'☾ Dark':'☀ Light';themeToggle.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');themeToggle.setAttribute('title',light?'Switch to dark theme':'Switch to light theme')}};updateThemeButton();if(themeToggle){themeToggle.addEventListener('click',()=>{const light=document.documentElement.dataset.theme==='light';document.documentElement.dataset.theme=light?'dark':'light';localStorage.setItem('vivaan-theme',light?'dark':'light');updateThemeButton()})}

/* Landing-page polish + money animation. The hero intentionally restarts on every page load. */
const hero=document.querySelector('.money-hero');
if(hero){
  const stage=hero.querySelector('.money-field');
  if(stage){
    stage.innerHTML='';
    const fragment=document.createDocumentFragment();
    for(let i=0;i<34;i++){
      const bill=document.createElement('span');
      bill.className='bill';
      const left=2+Math.random()*96;
      const top=-8+Math.random()*105;
      const duration=(6.5+Math.random()*6.5).toFixed(2)+'s';
      const delay=(-Math.random()*duration.replace('s','')).toFixed(2)+'s';
      const rotation=(-45+Math.random()*90).toFixed(1)+'deg';
      bill.style.left=left+'%';bill.style.top=top+'%';bill.style.setProperty('--duration',duration);bill.style.setProperty('--delay',delay);bill.style.setProperty('--rot',rotation);
      bill.style.setProperty('--drift',(Math.random()*220-110).toFixed(0)+'px');
      fragment.appendChild(bill);
    }
    stage.appendChild(fragment);
  }

  const polish=document.createElement('style');
  polish.textContent=`
    .money-hero{cursor:default}
    .money-hero .hero-copy{animation:heroCopyIn .9s cubic-bezier(.2,.8,.2,1) both}
    .money-hero .hero-copy .eyebrow{animation:heroItemIn .7s .08s both}
    .money-hero h1{animation:heroTitleIn 1s .14s cubic-bezier(.16,1,.3,1) both}
    .money-hero .hero-text{animation:heroItemIn .8s .28s both}
    .money-hero .hero-actions{animation:heroItemIn .8s .38s both}
    .money-hero .mini-stats{animation:heroItemIn .8s .48s both}
    .money-field{perspective:900px}
    .money-field .bill{will-change:transform,opacity;transform-style:preserve-3d}
    .money-field .bill:nth-child(3n){filter:brightness(1.08)}
    .money-field .bill:nth-child(4n){filter:saturate(.72)}
    .hero-person{will-change:transform}
    .hero-person svg{filter:drop-shadow(0 0 30px rgba(6,182,212,.08))}
    .hero-kicker{opacity:.7;animation:kickerIn 1.4s .5s both}
    .money-hero .hero-copy:after{content:'MARKET • MONEY • MOMENTUM';display:block;margin-top:34px;font:700 8px/1 'Space Mono',monospace;letter-spacing:.28em;color:rgba(255,255,255,.34);animation:heroItemIn .8s .62s both}
    html[data-theme="light"] .money-hero .hero-copy:after{color:rgba(17,24,39,.4)}
    @keyframes heroCopyIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
    @keyframes heroItemIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes heroTitleIn{from{opacity:0;transform:translateY(35px) scale(.97);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
    @keyframes kickerIn{from{opacity:0;transform:translateY(-18px)}to{opacity:.7;transform:none}}
    @media(max-width:800px){.money-hero .hero-copy:after{margin-top:25px}.money-field .bill{opacity:.72}}
    @media(prefers-reduced-motion:reduce){.money-hero .hero-copy,.money-hero .hero-copy .eyebrow,.money-hero h1,.money-hero .hero-text,.money-hero .hero-actions,.money-hero .mini-stats,.hero-kicker,.money-hero .hero-copy:after{animation:none!important}}
  `;
  document.head.appendChild(polish);

  /* Subtle pointer light gives the hero a premium interactive feel without distracting from the money. */
  hero.addEventListener('pointermove',event=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rect=hero.getBoundingClientRect();
    const x=((event.clientX-rect.left)/rect.width*100).toFixed(1);const y=((event.clientY-rect.top)/rect.height*100).toFixed(1);
    hero.style.setProperty('--pointer-x',x+'%');hero.style.setProperty('--pointer-y',y+'%');
  });
}

const revealTargets=document.querySelectorAll('.section,.project,.skill,.achievement,.contact,.hero-card');revealTargets.forEach(el=>el.classList.add('reveal'));const observer=new IntersectionObserver(entries=>{entries.forEach((entry,i)=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.12});revealTargets.forEach(el=>observer.observe(el));document.querySelectorAll('.project,.skill').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${y*-2}deg) rotateY(${x*2}deg) translateY(-5px)`});el.addEventListener('mouseleave',()=>{el.style.transform=''})});