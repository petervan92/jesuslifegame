/* Christ Quest: treasure hunt (diamonds, one treasure chest per chapter, levels) and the map of Israel in Jesus' time.
   Hooks into js/engine.js through CQ.hooks; progress is saved in localStorage 'cq-gems' as {chapterId: bitmask}
   (bits 0-4 = diamonds, bit 5 = chest). Diamonds are worth 1 point, a chest 5; levels come from the point total. */
'use strict';
(()=>{
const $=id=>document.getElementById(id),T=CQ.T,NG=5,CHEST=1<<NG,FULL=(1<<(NG+1))-1;
const LV=[[0,'Người lữ khách nhỏ'],[6,'Người tìm kiếm'],[14,'Người lắng nghe'],[24,'Bạn đồng hành'],[36,'Môn đồ nhỏ'],[50,'Người gieo giống'],
  [66,'Người chăn chiên giỏi'],[84,'Tay lưới giỏi'],[104,'Người mang tin lành'],[126,'Ánh sáng thế gian'],[150,'Muối của đất'],[180,'Người con yêu dấu']];
const TREASURE={ch1:'Cây gậy chăn chiên nhỏ',ch2:'Vỏ sò múc nước sông Giô-đanh',ch3:'Cuộn sách Phục truyền Luật lệ ký',cana:'Ché đá đựng nước',nico:'Ngọn đèn dầu',
  samaria:'Vò nước bên giếng',bethesda:'Chiếc chiếu được cuốn lại',ch4:'Tấm lưới đầy cá',ch5:'Giỏ bánh mạch nha',gerasa:'Sợi xích bị bẻ gãy',jairus:'Tua áo của Thầy',
  transfig:'Viên đá trên núi cao',blind:'Chén nước ao Si-lô-ê',shepherd:'Cây sáo của người chăn',ch6:'Cành cây sung của Xa-chê',footwash:'Chiếc khăn lau chân',
  ch7:'Cành chà là',ch8:'Bếp than hồng bên bờ biển'};
let save={};try{save=JSON.parse(localStorage.getItem('cq-gems')||'{}');}catch(e){}
const store=()=>{try{localStorage.setItem('cq-gems',JSON.stringify(save));}catch(e){}};
const bits=m=>{let n=0;for(let i=0;i<NG;i++)if(m&(1<<i))n++;return n;};
const points=()=>Object.values(save).reduce((a,m)=>a+bits(m)+(m&CHEST?5:0),0);
const levelOf=p=>{let i=0;while(i+1<LV.length&&p>=LV[i+1][0])i++;return i;};
const cur=()=>CQ.chapters[CQ.st().chIdx];

/* ---------- toast ---------- */
let toastT=0;function toast(html,big){const t=$('toast');t.innerHTML=html;t.className='show'+(big?' big':'');clearTimeout(toastT);toastT=setTimeout(()=>{t.className='';},big?3600:2000);}

/* ---------- placement: flood-fill the walkable ground around the player ---------- */
function walk(x,z){const W=CQ.W;if(Math.abs(x)>=148||Math.abs(z)>=148||CQ.G(x,z)<=-.4||(W.bounds&&!W.bounds(x,z)))return false;const p={x,z};CQ.collide(p);return Math.hypot(p.x-x,p.z-z)<.05;}
function reach(x0,z0){const S=1.2,R=38,seen=new Set(['0,0']),q=[[0,0]],out=[];let h=0;
  while(h<q.length&&out.length<2600){const [i,j]=q[h++],x=x0+i*S,z=z0+j*S;out.push({x,z,d:Math.hypot(i,j)*S});
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const ni=i+a,nj=j+b,k=ni+','+nj;if(seen.has(k))continue;const nx=x0+ni*S,nz=z0+nj*S;
      if(Math.hypot(nx-x0,nz-z0)>R)continue;if(walk(nx,nz)&&walk((x+nx)/2,(z+nz)/2)){seen.add(k);q.push([ni,nj]);}}}
  return out;}
function spots(n,wantChest){const W=CQ.W,pl=W.player;let c=reach(pl.x,pl.z).filter(p=>p.d>=5&&W.inter.every(I=>I.x==null||Math.hypot(I.x-p.x,I.z-p.z)>2.4));
  if(c.length<n+1)c=reach(pl.x,pl.z).filter(p=>p.d>=2);const out=[];
  if(wantChest&&c.length){const far=c.slice().sort((a,b)=>b.d-a.d).slice(0,Math.max(1,c.length*.15|0));out.push(far[Math.random()*far.length|0]);}
  for(let t=0;out.length<n+(wantChest?1:0)&&t<400;t++){const p=c[Math.random()*c.length|0];if(p&&out.every(o=>Math.hypot(o.x-p.x,o.z-p.z)>5-t/100))out.push(p);}
  return out;}

/* ---------- 3D pickups ---------- */
const gemMat=new T.MeshToonMaterial({color:'#8ff4ff',emissive:'#1aa6c4',emissiveIntensity:.9,gradientMap:CQ.grad});
const beamMat=new T.MeshBasicMaterial({color:'#bff8ff',transparent:true,opacity:.22,depthWrite:false,blending:T.AdditiveBlending});
const goldBeam=beamMat.clone();goldBeam.color.set('#ffe08a');
function makeGem(){const g=new T.Group(),m=new T.Mesh(new T.OctahedronGeometry(.3),gemMat);m.scale.y=1.45;m.add(new T.Mesh(m.geometry,CQ.outlineMat));g.add(m);
  const b=new T.Mesh(new T.CylinderGeometry(.08,.3,4,8,1,true),beamMat);b.position.y=1.6;g.add(b);g.spin=m;return g;}
function makeChest(){const g=new T.Group(),wood=CQ.toon('#8a5328'),gold=CQ.toon('#f2c14e',{emissive:'#7a4a00',emissiveIntensity:.6}),box=new T.Group();g.add(box);
  CQ.mesh(new T.BoxGeometry(.9,.5,.6),wood,0,.25,0,box);CQ.mesh(new T.CylinderGeometry(.3,.3,.9,10,1,false,0,Math.PI),wood,0,.5,0,box).rotation.z=Math.PI/2;
  CQ.mesh(new T.BoxGeometry(.94,.08,.64),gold,0,.5,0,box);CQ.mesh(new T.BoxGeometry(.12,.2,.08),gold,0,.42,.32,box);
  for(const x of [-.32,.32])CQ.mesh(new T.BoxGeometry(.08,.52,.64),gold,x,.26,0,box);
  const b=new T.Mesh(new T.CylinderGeometry(.1,.45,5,8,1,true),goldBeam);b.position.y=2.4;g.add(b);g.spin=box;return g;}
let items=[];
function spawn(){const W=CQ.W,ch=cur();items.forEach(it=>W.scene.remove(it.g));items=[];if(!ch||!W.player||!TREASURE[ch.id])return;
  const m=save[ch.id]||0,need=[];for(let i=0;i<NG;i++)if(!(m&(1<<i)))need.push(i);const chest=!(m&CHEST);if(!need.length&&!chest)return;
  const s=spots(need.length,chest);let k=0;
  if(chest&&s[k]){const p=s[k++];items.push({bit:CHEST,chest:1,x:p.x,z:p.z,g:makeChest()});}
  for(const i of need){const p=s[k++];if(!p)break;items.push({bit:1<<i,x:p.x,z:p.z,g:makeGem()});}
  for(const it of items){it.g.position.set(it.x,CQ.G(it.x,it.z),it.z);it.ph=Math.random()*6;W.scene.add(it.g);}}
function grab(it){const ch=cur(),before=levelOf(points());save[ch.id]=(save[ch.id]||0)|it.bit;store();CQ.W.scene.remove(it.g);items=items.filter(x=>x!==it);CQ.sfx('pick');
  const m=save[ch.id],lv=levelOf(points());
  if(it.chest)toast('<b>Tìm được báu vật!</b><span>'+TREASURE[ch.id]+'</span>');else toast('<b>+1 kim cương</b><span>'+bits(m)+' / '+NG+' trong chương này</span>');
  if(m===FULL)setTimeout(()=>toast('<b>Đã tìm đủ kho báu của chương!</b><span>5 kim cương và '+TREASURE[ch.id]+'</span>'),2100);
  if(lv>before)setTimeout(()=>{CQ.sfx('chapter');toast('<b>Lên cấp '+(lv+1)+'!</b><span>'+LV[lv][1]+'</span>',1);},m===FULL?4200:1200);
  badge();}

CQ.hooks.load.push(()=>{items=[];spawn();badge();});
CQ.hooks.zone.push(()=>{if(items.length&&CQ.W.player)spawn();});
CQ.hooks.frame.push((dt,tt)=>{const st=CQ.st(),pl=CQ.W.player;
  for(const it of items){it.g.spin.rotation.y=tt*(it.chest?.8:2)+it.ph;it.g.spin.position.y=(it.chest?.05:.95)+Math.sin(tt*2.4+it.ph)*(it.chest?.04:.15);}
  if(st.mode!=='explore'||st.talking||!pl||panel)return;for(const it of items)if(Math.hypot(it.x-pl.x,it.z-pl.z)<(it.chest?1.6:1.3)){grab(it);break;}});

/* ---------- HUD badge, treasure book, menu and end-of-chapter notes ---------- */
function badge(){const b=$('bGem');if(!b)return;const st=CQ.st(),lv=levelOf(points());
  if(st.mode==='explore'||st.mode==='story'||st.mode==='done'){const ch=cur(),m=save[ch.id]||0;b.innerHTML='💎 '+bits(m)+'/'+NG+' '+(m&CHEST?'🎁':'<span class="dim">🎁</span>')+' · Cấp '+(lv+1);}
  else{let d=0;for(const m of Object.values(save))d+=bits(m);b.innerHTML='💎 '+d+' · Cấp '+(lv+1);}}
CQ.hooks.ui.push(m=>{badge();const map=$('bMap');if(map)map.style.display=(m==='explore'||m==='menu')?'':'none';});
CQ.hooks.menu.push(box=>{for(const b of box.querySelectorAll('.chap')){const ch=CQ.chapters[+b.dataset.i];if(!ch||!TREASURE[ch.id])continue;const m=save[ch.id]||0;
  const s=document.createElement('span');s.className='gems'+(m===FULL?' full':'');s.textContent='💎'+bits(m)+'/'+NG+(m&CHEST?' 🎁':'');s.title='Kim cương và báu vật đã tìm';b.appendChild(s);}});
CQ.hooks.finish.push(ch=>{const m=save[ch.id]||0,el=$('dnGem');if(!el)return;el.textContent=m===FULL?'Bạn đã tìm đủ 5 kim cương và báu vật "'+TREASURE[ch.id]+'"!':
  'Kim cương: '+bits(m)+'/'+NG+(m&CHEST?' · đã có báu vật':' · báu vật chưa tìm thấy')+'. Chơi lại chương để tìm tiếp nhé!';});

let panel=null;
function openPanel(id){closePanel();panel=id;$(id).style.display='flex';CQ.sfx('open');const c=$(id).querySelector('.x');if(c)c.focus();}
function closePanel(){if(panel)$(panel).style.display='none';panel=null;}
addEventListener('keydown',e=>{if(!panel)return;if(e.code==='Escape')closePanel();if(/^(Key[WASDE]|Arrow|Space)/.test(e.code))e.stopImmediatePropagation();},true);
function book(){const p=points(),lv=levelOf(p),nx=LV[lv+1],from=LV[lv][0];let d=0,c=0;for(const m of Object.values(save)){d+=bits(m);if(m&CHEST)c++;}
  const n=Object.keys(TREASURE).length;
  $('gemBody').innerHTML='<div class="lvl"><b>Cấp '+(lv+1)+'</b><span>'+LV[lv][1]+'</span></div>'+
    '<div class="bar"><i style="width:'+(nx?Math.round((p-from)/(nx[0]-from)*100):100)+'%"></i></div>'+
    '<p class="sub">'+(nx?'Còn '+(nx[0]-p)+' điểm nữa để lên cấp '+(lv+2)+' ('+nx[1]+'). Mỗi kim cương 1 điểm, mỗi báu vật 5 điểm.':'Bạn đã đạt cấp cao nhất. Tuyệt vời!')+'</p>'+
    '<p class="sub">💎 '+d+' / '+n*NG+' kim cương · 🎁 '+c+' / '+n+' báu vật</p><div class="tlist">'+
    CQ.chapters.filter(ch=>TREASURE[ch.id]).map(ch=>{const m=save[ch.id]||0;return '<div class="t'+(m&CHEST?' got':'')+'"><small>Chương '+ch.no+' · 💎'+bits(m)+'/'+NG+'</small><b>'+(m&CHEST?TREASURE[ch.id]:'???')+'</b></div>';}).join('')+'</div>';
  openPanel('gemP');}

/* ---------- map of Israel in Jesus' time (positions approximate) ---------- */
const P=(la,lo)=>[(lo-34.2)*212,(33.4-la)*250],pts=a=>a.map(([la,lo])=>P(la,lo).map(v=>v.toFixed(1)).join(',')).join(' ');
const REG={gl:'Ga-li-lê',sm:'Sa-ma-ri',gd:'Giu-đê',pr:'Pê-rê',dc:'Đê-ca-bô-lơ'};
const PL={
  jer:{n:'Giê-ru-sa-lem',r:'gd',at:[31.778,35.235],dx:-1,big:1,x:'Thủ đô xứ Giu-đê, nơi có đền thờ. Chúa Giê-su nhiều lần lên đây dự lễ.'},
  bet:{n:'Bết-lê-hem',r:'gd',at:[31.705,35.2],dx:-1,x:'Làng nhỏ phía nam Giê-ru-sa-lem, quê của vua Đa-vít, nơi Chúa Giê-su giáng sinh.'},
  wild:{n:'Đồng vắng Giu-đê',r:'gd',at:[31.6,35.36],dx:1,x:'Vùng đồi đá khô cằn nằm giữa Giê-ru-sa-lem và Biển Chết.'},
  jericho:{n:'Giê-ri-cô',r:'gd',at:[31.87,35.444],dx:-1,x:'Thành ốc đảo gần sông Giô-đanh. Từ đây có con đường dốc đi lên Giê-ru-sa-lem.'},
  jordan:{n:'Bê-tha-ni bên kia sông',r:'pr',at:[31.837,35.553],dx:1,x:'Nơi Giăng Báp-tít làm phép báp-têm, phía đông sông Giô-đanh (Giăng 1:28).'},
  sychar:{n:'Si-kha',r:'sm',at:[32.213,35.285],dx:1,x:'Thành ở xứ Sa-ma-ri, gần giếng Gia-cốp dưới chân núi Ga-ri-xim.'},
  cana:{n:'Ca-na',r:'gl',at:[32.747,35.339],dx:-1,x:'Làng ở xứ Ga-li-lê, không xa Na-xa-rét, quê của Na-tha-na-ên.'},
  tabor:{n:'Núi Tha-bô',r:'gl',at:[32.687,35.39],dx:1,x:'Theo truyền thống, đây là núi Chúa Giê-su hóa hình. Có ý kiến khác cho là núi Hẹt-môn ở xa hơn về phía bắc.'},
  cap:{n:'Ca-bê-na-um',r:'gl',at:[32.881,35.575],dx:-1,x:'Thành bên bờ bắc biển Ga-li-lê, nơi Chúa Giê-su ở trong thời gian đi giảng đạo.'},
  lake:{n:'Biển Ga-li-lê',r:'gl',at:[32.77,35.585],dx:1,x:'Hồ nước ngọt lớn, nơi các ngư dân đánh cá. Trên hồ thường nổi bão bất chợt.'},
  gerasa:{n:'Xứ Giê-ra-sê',r:'dc',at:[32.826,35.65],dx:1,x:'Bờ đông biển Ga-li-lê, thuộc vùng Đê-ca-bô-lơ, nơi phần đông là người ngoại.'}};
const AT={ch1:'bet',ch2:'jordan',ch3:'wild',cana:'cana',nico:'jer',samaria:'sychar',bethesda:'jer',ch4:'cap',ch5:'lake',gerasa:'gerasa',jairus:'cap',
  transfig:'tabor',blind:'jer',shepherd:'jer',ch6:'jericho',footwash:'jer',ch7:'jer',ch8:'jer'};
const COAST=[[33.5,35.12],[33.27,35.19],[33.1,35.11],[32.92,35.07],[32.83,34.97],[32.7,34.93],[32.5,34.89],[32.3,34.84],[32.05,34.75],[31.8,34.63],[31.67,34.55],[31.5,34.43],[31.3,34.3],[30.9,34.22]];
const GAL=[[32.89,35.59],[32.88,35.62],[32.85,35.645],[32.8,35.655],[32.75,35.645],[32.71,35.62],[32.7,35.585],[32.73,35.56],[32.79,35.52],[32.84,35.53],[32.87,35.55]];
const DEAD=[[31.77,35.5],[31.75,35.58],[31.55,35.56],[31.35,35.53],[31.1,35.5],[31.03,35.43],[31.2,35.4],[31.45,35.43],[31.65,35.45],[31.76,35.46]];
const JOR1=[[33.3,35.63],[33.1,35.61],[32.9,35.615]],JOR2=[[32.7,35.575],[32.55,35.56],[32.4,35.555],[32.2,35.54],[32.0,35.52],[31.85,35.54],[31.77,35.51]];
function lab(la,lo,t,cls,rot){const [x,y]=P(la,lo);return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" class="'+cls+'"'+(rot?' transform="rotate('+rot+' '+x.toFixed(1)+' '+y.toFixed(1)+')"':'')+'>'+t+'</text>';}
function mapSvg(here){const prog=CQ.prog();let s='<svg viewBox="0 0 400 612" role="img" aria-label="Bản đồ xứ Y-sơ-ra-ên thời Chúa Giê-su"><rect width="400" height="612" class="sea"/>'+
  '<polygon class="land" points="'+pts(COAST.concat([[30.9,36.3],[33.5,36.3]]))+'"/>'+
  '<polyline class="bord" points="'+pts([[32.6,34.95],[32.55,35.25],[32.52,35.55]])+'"/><polyline class="bord" points="'+pts([[32.03,34.8],[32.0,35.2],[31.98,35.52]])+'"/>'+
  '<polyline class="bord" points="'+pts([[32.52,35.55],[32.45,35.7],[32.4,36.3]])+'"/>'+
  '<polyline class="river" points="'+pts(JOR1)+'"/><polyline class="river" points="'+pts(JOR2)+'"/>'+
  '<polygon class="lake" points="'+pts(GAL)+'"/><polygon class="lake" points="'+pts(DEAD)+'"/>'+
  lab(32.97,35.22,'GA-LI-LÊ','reg')+lab(32.3,35.08,'SA-MA-RI','reg')+lab(31.45,34.98,'GIU-ĐÊ','reg')+lab(32.1,35.86,'PÊ-RÊ','reg')+lab(32.62,35.92,'ĐÊ-CA-BÔ-LƠ','reg')+
  lab(32.3,34.48,'Biển Lớn','wat',-70)+lab(31.4,35.5,'Biển Chết','wat',-80)+lab(32.3,35.6,'Sông Giô-đanh','riv',-84)+
  (()=>{const [x,y]=P(32.70,35.30);return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="3" class="town"/><text x="'+(x-6).toFixed(1)+'" y="'+(y+12).toFixed(1)+'" class="tn" text-anchor="end">Na-xa-rét</text>';})();
  for(const [k,p] of Object.entries(PL)){const [x,y]=P(...p.at),chs=CQ.chapters.filter(c=>AT[c.id]===k),done=chs.length&&chs.every(c=>prog[c.id]),r=p.big?8:6,isH=k===here;
    s+='<g class="pin'+(done?' done':'')+(isH?' here':'')+'" data-k="'+k+'" tabindex="0" role="button" aria-label="'+p.n+'">'+(isH?'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" class="ring"/>':'')+
      '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="14" class="hit"/><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" class="dot"/>'+
      (chs.length>1?'<text x="'+x.toFixed(1)+'" y="'+(y+3.6).toFixed(1)+'" class="cnt" text-anchor="middle">'+chs.length+'</text>':'')+
      '<text x="'+(x+p.dx*(r+4)).toFixed(1)+'" y="'+(y+4).toFixed(1)+'" class="pn" text-anchor="'+(p.dx>0?'start':'end')+'">'+p.n+'</text></g>';}
  return s+'</svg>';}
function caption(k,here){const p=PL[k],prog=CQ.prog(),chs=CQ.chapters.filter(c=>AT[c.id]===k);
  $('mapCap').innerHTML=(k===here?'<div class="eyebrow">Bạn đang ở đây</div>':'')+'<h4>'+p.n+'</h4><div class="rg">Xứ '+REG[p.r]+'</div><p>'+p.x+'</p><ul>'+
    chs.map(c=>'<li'+(c===cur()&&k===here?' class="now"':'')+'>Chương '+c.no+': '+c.title+(prog[c.id]?' <span class="ok">✓</span>':'')+'</li>').join('')+'</ul>';
  for(const g of $('mapSvg').querySelectorAll('.pin'))g.classList.toggle('sel',g.dataset.k===k);}
function openMap(){const st=CQ.st(),here=st.mode==='explore'?AT[cur().id]:null;$('mapSvg').innerHTML=mapSvg(here);
  for(const g of $('mapSvg').querySelectorAll('.pin')){g.onclick=()=>caption(g.dataset.k,here);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();caption(g.dataset.k,here);}};}
  if(here)caption(here,here);else $('mapCap').innerHTML='<h4>Xứ Y-sơ-ra-ên thời Chúa Giê-su</h4><p>Khoảng năm 30 sau Công nguyên, xứ này thuộc đế quốc La Mã. Chạm vào một địa điểm để xem các chương diễn ra ở đó.</p>';
  openPanel('mapP');}

/* ---------- wire up ---------- */
$('bGem').onclick=book;$('bMap').onclick=openMap;
CQ.treasure={items:()=>items.map(i=>({x:i.x,z:i.z,chest:!!i.chest})),book,openMap,points};
for(const el of document.querySelectorAll('.panel .x'))el.onclick=closePanel;
for(const el of document.querySelectorAll('.panel'))el.addEventListener('click',e=>{if(e.target===el)closePanel();});
badge();
})();
