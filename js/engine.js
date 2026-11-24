/* Christ Quest engine: shared 3D world, characters, quest markers, dialogue, mini-games. */
'use strict';
(function(){
const $=id=>document.getElementById(id);
const CQ=window.CQ={chapters:[]};
function fail(){$('err').style.display='flex';}
if(!window.THREE){fail();return;}
const T=THREE;let renderer;
try{renderer=new T.WebGLRenderer({canvas:$('c'),antialias:true,powerPreference:'high-performance'});}catch(e){fail();return;}
const coarse=matchMedia('(pointer:coarse)').matches;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.5:2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const camera=new T.PerspectiveCamera(50,1,0.1,1400);
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

/* ---------- helpers ---------- */
let seed=1;const R=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
const rr=(a,b)=>a+(b-a)*R();
const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const C=h=>new T.Color(h);
const noise=(x,z)=>Math.sin(x*0.05+1.3)*Math.cos(z*0.045)+0.5*Math.sin(x*0.11+z*0.09)+0.25*Math.sin(x*0.23-z*0.19);
const grad=new T.DataTexture(new Uint8Array([120,120,190,255]),4,1,T.LuminanceFormat);
grad.minFilter=grad.magFilter=T.NearestFilter;grad.needsUpdate=true;
const mats={};
function toon(col,o){const k=col+(o?JSON.stringify(o):'');if(!mats[k])mats[k]=new T.MeshToonMaterial(Object.assign({color:col,gradientMap:grad},o||{}));return mats[k];}
let W=null;
function mesh(geo,mat,x,y,z,parent,sh){const m=new T.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);if(sh!==false){m.castShadow=true;m.receiveShadow=true;}(parent||W.scene).add(m);return m;}
function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;}return t;}
function boxUV(w,h,d,s){const g=new T.BoxGeometry(w,h,d),uv=g.attributes.uv,dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let i=0;i<4;i++){const k=f*4+i;uv.setXY(k,uv.getX(k)*dims[f][0]/s,uv.getY(k)*dims[f][1]/s);}return g;}

/* ---------- textures and shared materials ---------- */
seed=77;
function stoneTex(lo,hi,tint,mortar){return canvasTex(256,256,(g,w,h)=>{g.fillStyle=mortar;g.fillRect(0,0,w,h);const rows=8,rh=h/rows;for(let r=0;r<rows;r++){let x=-R()*30;while(x<w){const bw=rr(26,58),v=rr(lo,hi);g.fillStyle='rgb('+Math.floor(v*tint[0])+','+Math.floor(v*tint[1])+','+Math.floor(v*tint[2])+')';g.beginPath();const y=r*rh+2;g.moveTo(x+4,y);g.lineTo(x+bw-5,y+rr(0,2));g.lineTo(x+bw-3,y+rh-5);g.lineTo(x+3,y+rh-4+rr(0,2));g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x+5,y+1,bw-10,3);x+=bw;}}},true);}
const plasterTex=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#e6d3ab';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){g.fillStyle='rgba('+(R()<.5?'120,90,50':'255,246,220')+','+rr(.04,.11)+')';g.beginPath();g.ellipse(R()*w,R()*h,rr(8,36),rr(4,16),R()*3,0,7);g.fill();}},true);
const sailTex=canvasTex(128,128,(g,w,h)=>{g.fillStyle='#efe3c6';g.fillRect(0,0,w,h);g.fillStyle='#b5624a';g.fillRect(22,0,10,h);g.fillRect(96,0,10,h);});
const clothTex=canvasTex(64,64,(g,w,h)=>{g.fillStyle='#e9dcc0';g.fillRect(0,0,w,h);g.fillStyle='#3f6f9a';for(let x=4;x<w;x+=16)g.fillRect(x,0,6,h);});
const M={
  basalt:new T.MeshToonMaterial({map:stoneTex(58,96,[1,.97,.95],'#8f887c'),gradientMap:grad}),
  lime:new T.MeshToonMaterial({map:stoneTex(196,232,[1,.94,.8],'#a8966f'),gradientMap:grad}),
  plaster:new T.MeshToonMaterial({map:plasterTex,gradientMap:grad}),
  sail:new T.MeshToonMaterial({map:sailTex,gradientMap:grad,side:T.DoubleSide}),
  cloth:new T.MeshToonMaterial({map:clothTex,gradientMap:grad,side:T.DoubleSide}),
  mud:toon('#b99c72'),wood:toon('#7a5233'),woodD:toon('#4f3524'),dark:toon('#2a211c'),clay:toon('#c2714a'),hay:toon('#d9b95a')
};

/* ---------- world ---------- */
function newWorld(){W=CQ.W={scene:new T.Scene(),obstacles:[],circles:[],platforms:[],inter:[],chars:[],tick:[],steps:[],step:-1,boats:[],sheep:[],H:()=>0,bounds:null,tod:'day',startYaw:3.6,menuCam:{x:0,y:2,z:0,r:55,h:20}};return W;}
function G(x,z){let y=W.H(x,z);for(const p of W.platforms)if(x>p.x0&&x<p.x1&&z>p.z0&&z<p.z1)y=Math.max(y,p.top);return y;}
function distPath(x,z){let m=1e9;for(const p of W.paths||[])for(let i=0;i<p.length-1;i++){const ax=p[i][0],az=p[i][1],bx=p[i+1][0],bz=p[i+1][1],dx=bx-ax,dz=bz-az;let t=((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz);t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(x-ax-dx*t,z-az-dz*t));}return m;}
function terrain(o){W.H=o.H;const S=o.size||380,N=o.seg||190,g=new T.PlaneGeometry(S,S,N,N);g.rotateX(-Math.PI/2);const p=g.attributes.position,col=new Float32Array(p.count*3),c=new T.Color();
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),y=o.H(x,z);p.setY(i,y);o.color(x,z,y,c);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
  g.setAttribute('color',new T.BufferAttribute(col,3));g.computeVertexNormals();const m=new T.Mesh(g,new T.MeshToonMaterial({vertexColors:true,gradientMap:grad}));m.receiveShadow=true;W.scene.add(m);return m;}

const TOD={
 day:{top:'#2c7ad8',hor:'#c4e8ff',sunDir:[.42,.8,.42],sunCol:'#fff4d6',sunI:.6,hemiI:.46,hemiS:'#dff1ff',fog:'#cfeaff',wS:'#4fd0c8',wD:'#1f7fc0',ridge:'#8fb0d8',ridge2:'#a9c6e6',cloud:'#ffffff',stars:0},
 morning:{top:'#3a84d8',hor:'#ffe6c2',sunDir:[.8,.45,.42],sunCol:'#ffe3ae',sunI:.64,hemiI:.45,hemiS:'#fff0dc',fog:'#e4e2d2',wS:'#58d0c6',wD:'#2a82bd',ridge:'#9fb0d2',ridge2:'#c2c8de',cloud:'#fff6e8',stars:0},
 desert:{top:'#3b8be0',hor:'#f6e7c8',sunDir:[.3,.85,.4],sunCol:'#fff1cf',sunI:.62,hemiI:.48,hemiS:'#fff3dc',fog:'#efe0c2',wS:'#6fc9b4',wD:'#3f8f9a',ridge:'#d2b48c',ridge2:'#e2cba6',cloud:'#ffffff',stars:0},
 dawn:{top:'#5b7fc4',hor:'#ffcf9e',sunDir:[.86,.2,.47],sunCol:'#ffb46a',sunI:.56,hemiI:.42,hemiS:'#ffe3c4',fog:'#f2cdb0',wS:'#7fd0c4',wD:'#3f86ad',ridge:'#b79fb8',ridge2:'#d9b9b4',cloud:'#ffe6cf',stars:0},
 dusk:{top:'#39408f',hor:'#ff9e6e',sunDir:[-.85,.17,.5],sunCol:'#ff8a52',sunI:.56,hemiI:.4,hemiS:'#ffc9a8',fog:'#e9a98e',wS:'#8a9fd6',wD:'#3b4f98',ridge:'#7d6aa6',ridge2:'#b98aa0',cloud:'#ffc4a0',stars:0},
 storm:{top:'#1c2430',hor:'#4a5560',sunDir:[.2,.8,.3],sunCol:'#9aa6b4',sunI:.3,hemiI:.42,hemiS:'#8c98a8',fog:'#3c4650',wS:'#3f5f6a',wD:'#1c3040',ridge:'#2a323c',ridge2:'#333c48',cloud:'#3a424e',stars:0},
 night:{top:'#081238',hor:'#22407c',sunDir:[-.45,.62,.5],sunCol:'#a9bcff',sunI:.36,hemiI:.44,hemiS:'#7f95d8',fog:'#18295a',wS:'#28507a',wD:'#102a52',ridge:'#121d48',ridge2:'#1a2a5c',cloud:'#2b3c70',stars:1},
 glory:{top:'#16307a',hor:'#ffe9a6',sunDir:[-.1,.9,.3],sunCol:'#fff3c4',sunI:.46,hemiI:.56,hemiS:'#ffeec4',fog:'#4a5a8c',wS:'#28507a',wD:'#102a52',ridge:'#2a3a78',ridge2:'#3b4c8c',cloud:'#7f86b4',stars:1}};
const tc=new T.Color(),tv=new T.Vector3();
function sky(o){o=o||{};const sc=W.scene;
  const U=W.skyU={top:{value:C('#000')},hor:{value:C('#000')},sunDir:{value:new T.Vector3(0,1,0)},sunCol:{value:C('#fff')}};
  W.sky=new T.Mesh(new T.SphereGeometry(900,24,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:U,
    vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform vec3 top,hor,sunDir,sunCol;varying vec3 vP;void main(){vec3 n=normalize(vP);float h=max(n.y,0.);vec3 c=mix(hor,top,pow(h,.55));float d=max(dot(n,normalize(sunDir)),0.);c+=sunCol*(smoothstep(.9972,.9982,d)+pow(d,28.)*.35+pow(d,4.)*.08);gl_FragColor=vec4(c,1.);}'}));
  sc.add(W.sky);
  const sp=[];for(let i=0;i<650;i++){const a=R()*6.283,y=rr(.06,1),r=Math.sqrt(1-y*y);sp.push(Math.cos(a)*r*850,y*850,Math.sin(a)*r*850);}
  const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(sp,3));
  W.stars=new T.Points(sg,new T.PointsMaterial({color:'#ffffff',size:2.4,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));sc.add(W.stars);
  sc.fog=new T.Fog('#000',o.fogNear||70,o.fogFar||300);
  W.cloudMat=new T.MeshBasicMaterial({color:'#ffffff',fog:false});W.clouds=[];
  for(let i=0;i<(o.clouds==null?12:o.clouds);i++){const g=new T.Group(),a=R()*6.28,r=rr(150,420);for(let k=0;k<5;k++){const s=rr(10,22);const m=new T.Mesh(new T.SphereGeometry(1,10,8),W.cloudMat);m.scale.set(s*1.6,s*.55,s);m.position.set(rr(-22,22),rr(-3,3),rr(-8,8));g.add(m);}g.position.set(Math.cos(a)*r,rr(70,130),Math.sin(a)*r);sc.add(g);W.clouds.push(g);}
  W.ridgeMat=new T.MeshBasicMaterial({color:'#000',fog:false,side:T.DoubleSide});W.ridgeMat2=new T.MeshBasicMaterial({color:'#000',fog:false,side:T.DoubleSide});
  const ridge=(r,base,amp,mat,ph)=>{const N=120,pos=[],idx=[];for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,x=Math.cos(a)*r,z=Math.sin(a)*r;const h=base+amp*(0.6+0.3*Math.sin(a*5+ph)+0.2*Math.sin(a*11+ph*2)+0.12*Math.sin(a*23));pos.push(x,-3,z,x,h,z);if(i<N){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);sc.add(new T.Mesh(g,mat));};
  ridge(205,10,o.ridgeAmp||26,W.ridgeMat,0.4);ridge(260,16,(o.ridgeAmp||26)*1.5,W.ridgeMat2,2.1);
  W.hemi=new T.HemisphereLight('#fff','#b89b72',.5);sc.add(W.hemi);
  const sun=W.sun=new T.DirectionalLight('#fff',.6);sun.castShadow=true;const c=sun.shadow.camera;c.left=-46;c.right=46;c.top=46;c.bottom=-46;c.near=1;c.far=260;
  sun.shadow.mapSize.set(coarse?1024:2048,coarse?1024:2048);sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.04;sc.add(sun);sc.add(sun.target);
  W.curSun=new T.Vector3(0,1,0);W.tgt=TOD[W.tod];applyTOD(1);}
function applyTOD(k){const t=W.tgt,L=(c,h)=>c.lerp(tc.set(h),k),U=W.skyU;L(U.top.value,t.top);L(U.hor.value,t.hor);L(U.sunCol.value,t.sunCol);L(W.sun.color,t.sunCol);L(W.hemi.color,t.hemiS);L(W.scene.fog.color,t.fog);
  if(W.waterU){L(W.waterU.uS.value,t.wS);L(W.waterU.uD.value,t.wD);L(W.waterU.uF.value,t.fog);}L(W.ridgeMat.color,t.ridge);L(W.ridgeMat2.color,t.ridge2);L(W.cloudMat.color,t.cloud);
  W.curSun.lerp(tv.set(t.sunDir[0],t.sunDir[1],t.sunDir[2]).normalize(),k).normalize();U.sunDir.value.copy(W.curSun);W.sun.intensity+=(t.sunI-W.sun.intensity)*k;W.hemi.intensity+=(t.hemiI-W.hemi.intensity)*k;W.stars.material.opacity+=(t.stars-W.stars.material.opacity)*k;}
function setTod(n){W.tgt=TOD[n];}

const WATER_VS='attribute float dep;varying float vD;varying vec3 vW;void main(){vD=dep;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
const WATER_FS=`uniform float uT,uDeep;uniform vec3 uS,uD,uF,uCam;varying float vD;varying vec3 vW;
void main(){if(vD<-.25)discard;float d=length(vW.xz-uCam.xz);vec2 p=vW.xz*.42;
 float w=sin(p.x*1.3+uT*.7+sin(p.y*.9+uT*.4)*1.6)*sin(p.y*1.6-uT*.5+sin(p.x*.8-uT*.3)*1.4);
 float lines=smoothstep(.88,.95,w)*(1.-smoothstep(50.,190.,d));
 vec3 c=mix(uS,uD,smoothstep(0.,uDeep,vD));c=mix(c,vec3(1.),lines*.6);
 float foam=smoothstep(.26,.07,vD+sin(uT*1.1+vW.x*.35+vW.z*.2)*.06);c=mix(c,vec3(1.),foam*.8);
 c=mix(c,uF,smoothstep(90.,520.,d));float a=mix(.5,.93,smoothstep(0.,1.,vD));a=max(a,foam*.9);gl_FragColor=vec4(c,a);}`;
function water(o){o=o||{};const S=o.size||380,N=o.seg||140;const U=W.waterU={uT:{value:0},uDeep:{value:o.deep||3.5},uS:{value:C('#4fd0c8')},uD:{value:C('#1f7fc0')},uF:{value:C('#cfeaff')},uCam:{value:new T.Vector3()}};
  const mat=new T.ShaderMaterial({transparent:true,uniforms:U,vertexShader:WATER_VS,fragmentShader:WATER_FS});
  const g=new T.PlaneGeometry(S,S,N,N);g.rotateX(-Math.PI/2);const p=g.attributes.position,dep=new Float32Array(p.count);for(let i=0;i<p.count;i++)dep[i]=-W.H(p.getX(i),p.getZ(i));g.setAttribute('dep',new T.BufferAttribute(dep,1));
  const m=new T.Mesh(g,mat);m.position.y=.02;W.scene.add(m);
  if(o.lake){const rg=new T.RingGeometry(S/2,900,48,1);rg.rotateX(-Math.PI/2);rg.setAttribute('dep',new T.BufferAttribute(new Float32Array(rg.attributes.position.count).fill(6),1));const r=new T.Mesh(rg,mat);r.position.y=0;W.scene.add(r);}
  if(W.tgt)applyTOD(1);}

/* ---------- props ---------- */
function jar(parent,x,y,z,s){const pts=[[0,0],[.16,0],[.3,.22],[.33,.45],[.24,.68],[.13,.78],[.16,.86],[.12,.86]].map(p=>new T.Vector2(p[0],p[1]));const j=mesh(new T.LatheGeometry(pts,12),M.clay,x,y,z,parent);j.scale.setScalar(s||1);return j;}
function house(x,z,w,d,h,rot,o){o=o||{};const g=new T.Group();const y0=Math.min(W.H(x-w/2,z-d/2),W.H(x+w/2,z+d/2),W.H(x-w/2,z+d/2),W.H(x+w/2,z-d/2));g.position.set(x,y0,z);g.rotation.y=rot;W.scene.add(g);
  const st=o.stone==='lime'?M.lime:M.basalt,win=o.winMat||M.dark;
  if(o.plaster){mesh(boxUV(w+.12,3.3,d+.12,2.6),st,0,-.35,0,g);mesh(boxUV(w,h-1.3,d,3.4),M.plaster,0,1.3+(h-1.3)/2,0,g);}
  else mesh(boxUV(w,h+2,d,2.6),st,0,(h-2)/2,0,g);
  mesh(new T.BoxGeometry(w+.5,.26,d+.5),M.mud,0,h+.13,0,g);
  const pm=o.plaster?M.plaster:st;
  mesh(boxUV(w+.5,.34,.26,3),pm,0,h+.43,d/2+.12,g);mesh(boxUV(w+.5,.34,.26,3),pm,0,h+.43,-d/2-.12,g);
  mesh(boxUV(.26,.34,d,3),pm,w/2+.12,h+.43,0,g);mesh(boxUV(.26,.34,d,3),pm,-w/2-.12,h+.43,0,g);
  const nb=Math.floor(w/1.0);for(let i=0;i<nb;i++){const b=mesh(new T.CylinderGeometry(.09,.09,.5,7),M.woodD,-w/2+.6+i*((w-1.2)/Math.max(1,nb-1)),h-.22,d/2+.12,g);b.rotation.x=Math.PI/2;}
  const dx=o.doorX||0;mesh(new T.BoxGeometry(1.0,1.9,.14),M.dark,dx,.95,d/2+.02,g);mesh(new T.BoxGeometry(.42,1.8,.08),M.wood,dx-.52,.9,d/2+.3,g).rotation.y=-.9;
  mesh(new T.BoxGeometry(1.5,.24,.3),M.wood,dx,2.02,d/2+.06,g);
  mesh(new T.BoxGeometry(.42,.5,.14),win,dx+(dx>0?-1:1)*w*.3,h-.95,d/2+.02,g,false);
  mesh(new T.BoxGeometry(.14,.5,.42),win,-w/2-.02,h-.95,d*.15,g,false);
  if(o.stair!==false){const n=Math.ceil(h/.4),sd=Math.min(.55,(d-.6)/n);for(let i=0;i<n;i++)mesh(boxUV(.95,(i+1)*h/n,sd,2.6),st,w/2+.5,(i+1)*h/n/2-.05,d/2-.3-i*sd,g);}
  if(o.awning){const a=mesh(new T.PlaneGeometry(2.6,1.9),M.cloth,o.awning,2.35,d/2+.95,g);a.rotation.x=-Math.PI/2+.25;
    mesh(new T.CylinderGeometry(.045,.045,2.2,6),M.wood,o.awning-1.2,1.1,d/2+1.8,g);mesh(new T.CylinderGeometry(.045,.045,2.2,6),M.wood,o.awning+1.2,1.1,d/2+1.8,g);}
  if(o.roofJars){jar(g,-w*.25,h+.26,-d*.2,.8);jar(g,-w*.25+.6,h+.26,-d*.2+.3,.6);}
  if(o.mat){mesh(new T.BoxGeometry(1.6,.05,1.1),toon(o.mat),w*.15,h+.29,d*.1,g).rotation.y=.3;}
  W.obstacles.push({x,z,w:w+(o.stair!==false?1.6:.4),d:d+.4,rot,ox:o.stair!==false?.5:0});return g;}
function wallBox(x,z,w,h,d,rot,mat){const m=mesh(boxUV(w,h+1.5,d,2.6),mat||M.basalt,x,W.H(x,z)+(h-1.5)/2,z);m.rotation.y=rot||0;W.obstacles.push({x,z,w,d:d+.3,rot:rot||0,ox:0});return m;}
function palm(x,z,s){const g=new T.Group();g.position.set(x,W.H(x,z)-.1,z);g.scale.setScalar(s||1);g.rotation.y=R()*6;W.scene.add(g);let px=0,py=0,lean=rr(.03,.09);
  for(let i=0;i<8;i++){const seg=mesh(new T.CylinderGeometry(.22-i*.008,.27-i*.008,1.05,8),toon(i%2?'#8b6a45':'#7d5e3c'),px,py+.5,0,g);seg.rotation.z=-lean*i*.5;px+=Math.sin(lean*i*.5);py+=.98;}
  const top=new T.Group();top.position.set(px,py,0);g.add(top);const fm=toon('#4f9b3c',{side:T.DoubleSide}),fm2=toon('#6bb04a',{side:T.DoubleSide});
  for(let k=0;k<11;k++){const fg=new T.PlaneGeometry(.9,3.6,2,7);fg.translate(0,1.8,0);const p=fg.attributes.position;for(let i=0;i<p.count;i++){const t=p.getY(i)/3.6,xx=p.getX(i)*(1-t*.8);const up=k<4?1.5:.9;p.setXYZ(i,xx,up*t-2.0*t*t-Math.abs(xx)*.45,t*3.4);}fg.computeVertexNormals();
    mesh(fg,k%2?fm:fm2,0,0,0,top).rotation.y=k/11*Math.PI*2+rr(-.2,.2);}
  W.circles.push({x,z,r:.45});}
function olive(x,z,s){const g=new T.Group();g.position.set(x,W.H(x,z)-.1,z);g.scale.setScalar(s||1);g.rotation.y=R()*6;W.scene.add(g);
  mesh(new T.CylinderGeometry(.22,.4,1.5,7),toon('#6b5642'),0,.7,0,g).rotation.z=.12;mesh(new T.CylinderGeometry(.14,.22,1.2,6),toon('#6b5642'),.35,1.7,0,g).rotation.z=-.5;mesh(new T.CylinderGeometry(.12,.2,1.1,6),toon('#6b5642'),-.3,1.75,.1,g).rotation.z=.55;
  const cs=['#7f9a68','#8fab74','#6f8c5c'];[[0,2.9,0,1.5],[1.1,2.5,.2,1.1],[-1.1,2.6,-.2,1.15],[.2,2.5,1,1],[-.1,2.6,-1,1.05]].forEach((b,i)=>{mesh(new T.IcosahedronGeometry(b[3],1),toon(cs[i%3]),b[0],b[1],b[2],g).scale.y=.75;});
  W.circles.push({x,z,r:.5});}
function bush(x,z,s,col){const g=new T.Group();g.position.set(x,W.H(x,z),z);g.scale.setScalar(s||1);W.scene.add(g);const cs=col||['#6f9a54','#86b064','#5e8a4a'];
  for(let i=0;i<4;i++)mesh(new T.IcosahedronGeometry(rr(.6,1),1),toon(cs[i%3]),rr(-.7,.7),rr(.4,.9),rr(-.7,.7),g).scale.y=.7;W.circles.push({x,z,r:.9*(s||1)});}
function scatter(n,geo,mat,fn,sh){const im=new T.InstancedMesh(geo,mat,n),d=new T.Object3D();let k=0,tries=0;while(k<n&&tries<n*30){tries++;const r=fn();if(!r)continue;d.position.set(r[0],r[1],r[2]);d.rotation.set(r[5]||0,R()*6.28,r[6]||0);d.scale.setScalar(r[3]||1);if(r[4])d.scale.y*=r[4];d.updateMatrix();im.setMatrixAt(k++,d.matrix);}im.count=k;im.castShadow=!!sh;im.receiveShadow=true;W.scene.add(im);return im;}
function sheep(x,z){const g=new T.Group();g.position.set(x,W.H(x,z),z);g.rotation.y=R()*6;W.scene.add(g);
  mesh(new T.SphereGeometry(.42,10,8),toon('#f4efe2'),0,.62,0,g).scale.set(1,.85,1.35);const hd=mesh(new T.SphereGeometry(.2,8,6),toon('#3a2f2a'),0,.78,.6,g);hd.scale.set(.9,1,1.2);
  for(const lx of[-.2,.2])for(const lz of[-.3,.3])mesh(new T.CylinderGeometry(.05,.05,.4,5),toon('#3a2f2a'),lx,.2,lz,g);const s={g,hd,ph:R()*6,x,z};W.sheep.push(s);return s;}
function boat(x,z,rot,o){o=o||{};const g=new T.Group();g.position.set(x,o.y||0,z);g.rotation.y=rot;W.scene.add(g);
  const hull=new T.SphereGeometry(1,22,10,0,Math.PI*2,Math.PI/2,Math.PI/2);
  mesh(hull,toon('#8a5a34',{side:T.DoubleSide}),0,.75,0,g).scale.set(4.1,1.05,1.15);mesh(hull,toon('#6b4426',{side:T.BackSide}),0,.75,0,g,false).scale.set(4.0,.98,1.08);
  const rim=mesh(new T.TorusGeometry(1,.05,6,36),toon('#5a3a22'),0,.76,0,g);rim.scale.set(4.1,1.15,1.6);rim.rotation.x=Math.PI/2;
  for(const bx of[-2.2,-.6,1.2,2.6])mesh(new T.BoxGeometry(.34,.07,2.1*Math.sqrt(1-(bx/4.1)**2)),M.wood,bx,.55,0,g);
  mesh(new T.CylinderGeometry(.07,.1,5.2,8),M.wood,.5,2.9,0,g);const yard=mesh(new T.CylinderGeometry(.05,.05,4,6),M.wood,.5,o.sail?5.1:2.2,0,g);yard.rotation.x=Math.PI/2;
  if(o.sail){const sg=new T.PlaneGeometry(3.7,3.5,10,8),p=sg.attributes.position;for(let i=0;i<p.count;i++){const u=p.getX(i)/1.85,v=p.getY(i)/1.75;p.setZ(i,(1-u*u)*(1-v*v*.6)*.7);}sg.computeVertexNormals();mesh(sg,M.sail,.5,3.3,0,g).rotation.y=Math.PI/2;}
  else mesh(new T.CylinderGeometry(.16,.16,3.4,8),toon('#efe3c6'),.5,2.03,0,g).rotation.x=Math.PI/2;
  if(o.tilt)g.rotation.z=o.tilt;W.boats.push({g,o,x,z,ph:R()*6});if(!o.far)W.circles.push({x,z,r:2.6});return g;}
function campfire(x,z){const y=W.H(x,z),g=new T.Group();g.position.set(x,y,z);W.scene.add(g);
  for(let i=0;i<7;i++){const a=i/7*6.283;mesh(new T.DodecahedronGeometry(.22,0),toon('#6a655f'),Math.cos(a)*.7,.1,Math.sin(a)*.7,g);}
  for(let i=0;i<3;i++){const l=mesh(new T.CylinderGeometry(.07,.07,1,6),M.woodD,0,.2,0,g);l.rotation.set(Math.PI/2,i*1.05,0);}
  const fl=[];for(let i=0;i<3;i++){const f=new T.Mesh(new T.ConeGeometry(.28-i*.07,.9-i*.2,7),new T.MeshBasicMaterial({color:['#ff7a1a','#ffb02e','#fff0a0'][i]}));f.position.y=.5+i*.08;g.add(f);fl.push(f);}
  const L=new T.PointLight('#ff9a3c',1.6,26,1.6);L.position.y=1.2;g.add(L);W.circles.push({x,z,r:.9});
  W.tick.push((dt,tt)=>{L.intensity=1.5+Math.sin(tt*9)*.2+Math.sin(tt*23)*.12;fl.forEach((f,i)=>{f.scale.y=1+Math.sin(tt*(8+i*3)+i)*.18;f.rotation.y=tt*(1+i);});});return g;}

function crowd(pts,o){o=o||{};const n=pts.length,d=new T.Object3D(),col=new T.Color(),mk=g=>new T.InstancedMesh(g,new T.MeshToonMaterial({gradientMap:grad}),n);
  const body=mk(new T.CylinderGeometry(.2,.34,1,10).translate(0,.5,0)),head=mk(new T.SphereGeometry(.23,12,10)),hair=mk(new T.SphereGeometry(.25,12,8,0,6.283,0,1.5));
  const tun=['#b08a5e','#c9c0a8','#a5526a','#5f8f7a','#8d7656','#dcae4f','#7d8a5c','#c97b5a','#6f86a8','#e6d3ab'],sk=['#c99468','#b9804f','#c08a5e'],hr=['#2e2018','#241a13','#4a3a2c','#e6d3ab','#ebdfc4'],pk=a=>a[Math.floor(R()*a.length)];
  pts.forEach((p,i)=>{const s=(o.sit?.7:1)*rr(.9,1.06),y=G(p[0],p[1]);d.position.set(p[0],y,p[1]);d.rotation.set(0,p[2]==null?R()*6.28:p[2],0);d.scale.set(1,s,1);d.updateMatrix();body.setMatrixAt(i,d.matrix);body.setColorAt(i,col.set(pk(tun)));
    d.position.y=y+1.2*s;d.scale.set(1,1,1);d.updateMatrix();head.setMatrixAt(i,d.matrix);head.setColorAt(i,col.copy(skinTone(pk(sk))));d.position.y+=.03;d.updateMatrix();hair.setMatrixAt(i,d.matrix);hair.setColorAt(i,col.set(pk(hr)));if(!o.noCol)W.circles.push({x:p[0],z:p[1],r:.4});});
  [body,head,hair].forEach(m=>{m.castShadow=true;m.receiveShadow=true;W.scene.add(m);});return body;}
function ring(cx,cz,n,r0,r1,a0,a1){const a=[];for(let i=0;i<n;i++){const t=rr(a0==null?0:a0,a1==null?6.283:a1),r=rr(r0,r1);a.push([cx+Math.cos(t)*r,cz+Math.sin(t)*r,Math.atan2(-Math.cos(t),-Math.sin(t))]);}return a;}
function rockTomb(x,z,rot){const g=new T.Group();g.position.set(x,W.H(x,z),z);g.rotation.y=rot||0;W.scene.add(g);const rk=toon('#b9a888'),rk2=toon('#a3927a');
  const b=mesh(new T.DodecahedronGeometry(5,1),rk,0,1.6,-3.6,g);b.scale.set(1.5,.75,1);mesh(new T.DodecahedronGeometry(3,0),rk2,-5.5,.8,-2.6,g);mesh(new T.DodecahedronGeometry(3.4,0),rk2,5.8,1,-2.8,g);
  mesh(new T.BoxGeometry(1.7,2.1,.6),toon('#17120f'),0,1.05,.95,g,false);mesh(new T.CylinderGeometry(1.1,1.1,.3,20),toon('#17120f'),0,2.1,.95,g,false).rotation.x=Math.PI/2;
  const stone=mesh(new T.CylinderGeometry(1.45,1.45,.45,22),toon('#cdbf9f'),0,1.4,1.5,g);stone.rotation.x=Math.PI/2;
  const c=Math.cos(rot||0),s=Math.sin(rot||0);W.obstacles.push({x:x+(-3.6)*s,z:z+(-3.6)*c,w:16,d:8.6,rot:rot||0,ox:0});return{g,stone};}
function zones(def){W.zones=def;W.zone=null;W.bounds=(x,z)=>{const d=W.zones[W.zone];return !d||(d.rect?(Math.abs(x-d.c[0])<d.rect[0]&&Math.abs(z-d.c[1])<d.rect[1]):Math.hypot(x-d.c[0],z-d.c[1])<d.r);};}
function goZone(k,px,pz,yw,cb,instant){const f=()=>{W.zone=k;const d=W.zones[k];if(d.tod){W.tgt=TOD[d.tod];applyTOD(1);}place(W.player,px,pz);if(yw!=null){yaw=yw;if(instant)W.startYaw=yw;}first=true;goTo=null;hook('zone');if(cb)cb();};if(instant)f();else fade(f);}

/* ---------- characters ---------- */
const outlineMat=new T.ShaderMaterial({side:T.BackSide,uniforms:{t:{value:.014}},vertexShader:'uniform float t;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*t,1.);}',fragmentShader:'void main(){gl_FragColor=vec4(.16,.1,.08,1.);}'});
/* skin: every character's skin colour is brightened toward a warm light tone and shaded more softly than cloth, so faces stay bright */
const gradSoft=new T.DataTexture(new Uint8Array([205,205,232,255]),4,1,T.LuminanceFormat);gradSoft.minFilter=gradSoft.magFilter=T.NearestFilter;gradSoft.needsUpdate=true;
const SKIN_LIGHT=C('#fbe0c4'),skinMats={};
const skinTone=hex=>C(hex).lerp(SKIN_LIGHT,.55);
const cheekMat=new T.MeshToonMaterial({color:'#f9b9a6',gradientMap:gradSoft});
function skinMat(hex){if(!skinMats[hex])skinMats[hex]=new T.MeshToonMaterial({color:skinTone(hex),gradientMap:gradSoft});return skinMats[hex];}
const STY={body:.9,headY:1.33,head:1.22,kid:1.12}; /* proportions: body height factor, head centre height, head size, extra for children */
function makeChar(o){const g=new T.Group(),Wd=o.W||1,hem=o.hem==null?.1:o.hem,top=1.08,len=top-hem;const P={g,o,t:R()*6,move:0,bob:0,x:0,z:0};
  const em=o.emis?{emissive:o.emis,emissiveIntensity:.55}:null;
  const skin=skinMat(o.skin),tun=toon(o.tunic,em),hairM=toon(o.hair||'#2e2018');
  const part=(geo,mat,x,y,z,par,noOut)=>{const m=mesh(geo,mat,x,y,z,par||g);if(!noOut)m.add(new T.Mesh(geo,outlineMat));return m;};
  P.legs=[-1,1].map(s=>{const l=new T.Group();l.position.set(s*.1*Wd,.55,0);g.add(l);part(new T.CylinderGeometry(.07,.06,.5,8),skin,0,-.27,0,l);part(new T.BoxGeometry(.13,.06,.27),toon('#6b4a2f'),0,-.52,.05,l);return l;});
  const rB=.2*Wd,rH=(.2+.14*(len/.98))*Wd;
  part(new T.CylinderGeometry(rB,rH,len,18),tun,0,hem+len/2,0);
  part(new T.SphereGeometry(.22*Wd,16,10),tun,0,top-.03,0).scale.set(1.18,.5,.92);
  if(o.clavi){const ang=Math.atan((rH-rB)/len);for(const s of[-1,1])part(new T.BoxGeometry(.035,len*.97,.012),toon(o.clavi),s*.085*Wd,hem+len/2,(rB+rH)/2*.955+.006,g,true).rotation.x=ang;}
  const ry=.66,rs=rB+(rH-rB)*((top-ry)/len);
  if(o.sash){part(new T.TorusGeometry(rs+.012,.035,8,24),toon(o.sash),0,ry,0).rotation.x=Math.PI/2;part(new T.BoxGeometry(.07,.3,.03),toon(o.sash),-.12*Wd,ry-.17,rs+.02,g,true).rotation.z=.12;}
  if(o.mantle){const ml=len-.12;part(new T.CylinderGeometry(rB+.045,rB+(rH-rB)*(ml/len)+.055,ml,18,1,true,Math.PI*.28,Math.PI*1.3),toon(o.mantle,{side:T.DoubleSide}),0,top-ml/2+.02,0);
    const band=part(new T.TorusGeometry(.245*Wd,.07,8,22),toon(o.mantle),0,.9,0);band.rotation.set(Math.PI/2,-.62,0);band.scale.set(1,1,1.5);
    if(o.tassel)for(const a of[Math.PI*.3,Math.PI*1.56]){const r=rB+(rH-rB)*(ml/len)+.06;part(new T.CylinderGeometry(.018,.03,.13,6),toon(o.tassel),Math.sin(a)*r,top-ml-.03,Math.cos(a)*r,g,true);}}
  if(o.bag){const st=part(new T.TorusGeometry(.25*Wd,.018,5,20),toon('#5a3d25'),0,.86,0,g,true);st.rotation.set(Math.PI/2,.6,0);st.scale.set(1,1,1.5);part(new T.BoxGeometry(.2,.2,.09),toon('#8a5a34'),-.27*Wd,.6,.02);}
  if(o.wings){const wm=toon('#ffffff',{emissive:'#cdbb88',emissiveIntensity:.6});for(const s of[-1,1]){const w=part(new T.SphereGeometry(.34,14,10),wm,s*.36,1.02,-.22);w.scale.set(.85,1.7,.14);w.rotation.z=-s*.45;w.rotation.y=s*.35;}}
  P.arms=[-1,1].map(s=>{const a=new T.Group();a.position.set(s*.25*Wd,top-.05,0);a.rotation.z=s*.16;g.add(a);part(new T.CylinderGeometry(.08,.105,.4,10),tun,0,-.2,0,a);part(new T.CylinderGeometry(.052,.05,.22,8),skin,0,-.5,0,a);part(new T.SphereGeometry(.066,10,8),skin,0,-.64,0,a);return a;});
  part(new T.CylinderGeometry(.075,.085,.12,8),skin,0,top+.07,0,g,true);
  const hd=new T.Group();hd.position.set(0,1.38,0);hd.scale.setScalar(o.head||1);g.add(hd);P.head=hd;
  part(new T.SphereGeometry(.25,22,16),skin,0,0,0,hd).scale.set(1,1.04,.97);
  for(const s of[-1,1]){part(new T.SphereGeometry(.058,12,10),toon('#ffffff'),s*.096,.012,.222,hd,true).scale.set(.85,1.15,.35);part(new T.SphereGeometry(.037,10,8),toon('#3a2416'),s*.096,.006,.238,hd,true).scale.set(.85,1.15,.35);part(new T.SphereGeometry(.013,6,5),new T.MeshBasicMaterial({color:'#fff'}),s*.086,.032,.252,hd,true);
    part(new T.SphereGeometry(.042,8,6),cheekMat,s*.158,-.07,.19,hd,true).scale.set(1,.65,.3);
    part(new T.BoxGeometry(.085,.017,.02),hairM,s*.096,.1,.228,hd,true).rotation.z=-s*.1;part(new T.SphereGeometry(.045,8,6),skin,s*.247,-.01,0,hd,true);}
  part(new T.SphereGeometry(.03,8,6),skin,0,-.045,.25,hd,true);
  const mo=part(new T.TorusGeometry(.05,.011,5,12,Math.PI),toon('#7a3226'),0,-.085,.232,hd,true);mo.rotation.z=Math.PI;
  if(!o.veil){part(new T.SphereGeometry(.268,22,14,0,Math.PI*2,0,Math.PI*.5),hairM,0,.005,-.012,hd).rotation.x=-.3;
    if(o.hairLong)part(new T.SphereGeometry(.25,16,12),hairM,0,-.1,-.085,hd).scale.set(1.02,1.12,.72);
    for(const s of[-1,1])part(new T.SphereGeometry(.07,8,6),hairM,s*.215,.02+(o.hairLong?-.06:0),.03,hd,true).scale.set(.6,o.hairLong?2:1.3,1);}
  if(o.beard){part(new T.SphereGeometry(.2,16,10),hairM,0,-.165-.02*o.beard,.075,hd).scale.set(1.0,.5+.16*o.beard,.72);part(new T.BoxGeometry(.13,.028,.03),hairM,0,-.078,.243,hd,true);
    const lip=part(new T.TorusGeometry(.048,.011,5,12,Math.PI),toon('#8a3a2c'),0,-.092,.262,hd,true);lip.rotation.z=Math.PI;mo.visible=false;}
  if(o.veil){part(new T.SphereGeometry(.285,22,14,0,Math.PI*2,0,Math.PI*.6),toon(o.veil),0,0,-.02,hd).rotation.x=-.42;part(new T.CylinderGeometry(.27,.33,.5,16,1,true,Math.PI*.55,Math.PI*.9),toon(o.veil,{side:T.DoubleSide}),0,-.3,-.03,hd);}
  if(o.band)part(new T.TorusGeometry(.262,.028,6,22),toon(o.band),0,.1,-.01,hd,true).rotation.x=Math.PI/2-.3;
  if(o.halo)part(new T.TorusGeometry(.2,.02,6,24),new T.MeshBasicMaterial({color:'#ffe38a'}),0,.38,0,hd,true).rotation.x=Math.PI/2;
  if(o.jar)jar(hd,0,.26,0,.62);
  if(o.staff)part(new T.CylinderGeometry(.025,.03,1.9,6),M.wood,0,-.2,.05,P.arms[1],true);
  if(o.glow){const L=new T.PointLight(o.glow,1.5,30,1.5);L.position.y=1.3;g.add(L);P.light=L;}
  /* house style (see STY): about 2.6 heads tall, large friendly face */
  const B=new T.Group();g.children.slice().forEach(c=>{if(c!==hd&&!c.isLight)B.add(c);});B.scale.y=STY.body;g.add(B);hd.position.y=STY.headY;hd.scale.setScalar(Math.max(STY.head,(o.head||1)*STY.kid));
  /* optional hand-made model: set `model:'models/name.glb'` in js/characters.js; the built-in figure stays as the fallback */
  if(o.model&&T.GLTFLoader){new T.GLTFLoader().load(o.model,gl=>{const m=gl.scene,bb=new T.Box3().setFromObject(m),h=(bb.max.y-bb.min.y)||1,k=(o.modelHeight||1.7)/h;m.scale.setScalar(k);m.position.y=-bb.min.y*k;m.traverse(c=>{if(c.isMesh)c.castShadow=true;});
    g.children.slice().forEach(c=>{if(!c.isLight)c.visible=false;});g.add(m);P.model=m;
    if(gl.animations&&gl.animations.length){P.mixer=new T.AnimationMixer(m);const f=n=>gl.animations.find(a=>new RegExp(n,'i').test(a.name));const id=f('idle'),wk=f('walk');if(id){P.clipIdle=P.mixer.clipAction(id);P.clipIdle.play();}if(wk){P.clipWalk=P.mixer.clipAction(wk);P.clipWalk.play();P.clipWalk.weight=0;}}},undefined,()=>{});}
  g.scale.setScalar(o.S||1);g.traverse(m=>{if(m.isMesh&&m.material===outlineMat){m.castShadow=false;m.receiveShadow=false;}});
  W.scene.add(g);W.chars.push(P);return P;}
function animChar(P,dt){if(P.mixer){P.mixer.update(dt);if(P.clipWalk){P.clipWalk.weight=P.move;if(P.clipIdle)P.clipIdle.weight=1-P.move;}}P.t+=dt*(1+P.move*7);const m=P.move,s=Math.sin(P.t),o=P.o,idle=Math.sin(P.t*1.3)*.03;
  P.legs[0].rotation.x=s*.7*m;P.legs[1].rotation.x=-s*.7*m;
  P.arms[0].rotation.x=-s*.6*m+idle+(o.gesture?-.8*(1-m):0)+(P.raise||0)*-2.4;P.arms[1].rotation.x=s*.6*m-idle+(o.staff?-.35:0)+(P.raise||0)*-2.4;
  if(o.gesture)P.arms[0].rotation.z=-.16-.12*(1-m)+Math.sin(P.t*.9)*.04;
  P.head.rotation.y=Math.sin(P.t*.5)*.12*(1-m);P.head.rotation.x=Math.sin(P.t*.8)*.03;
  P.bob=Math.abs(Math.cos(P.t))*.05*m+Math.sin(P.t*1.3)*.006+(o.float?o.float+Math.sin(P.t*1.2)*.18:0)+(P.dy||0);}
function place(P,x,z,ry){P.x=x;P.z=z;P.y=null;P.g.position.set(x,G(x,z),z);if(ry!=null)P.g.rotation.y=ry;return P;}
function walkTo(P,x,z,sp,cb){P.dest={x,z,sp:sp||3,cb};}
function face(P,x,z){P.g.rotation.y=Math.atan2(x-P.x,z-P.z);}
function dove(){const g=new T.Group(),m=toon('#ffffff',{emissive:'#b8c8e0',emissiveIntensity:.5});
  const b=new T.Mesh(new T.SphereGeometry(.22,12,10),m);b.scale.set(.8,.75,1.5);b.add(new T.Mesh(b.geometry,outlineMat));g.add(b);
  const h=new T.Mesh(new T.SphereGeometry(.12,10,8),m);h.position.set(0,.12,.3);g.add(h);const bk=new T.Mesh(new T.ConeGeometry(.035,.12,6),toon('#e8a23a'));bk.rotation.x=Math.PI/2;bk.position.set(0,.1,.45);g.add(bk);
  const tl=new T.Mesh(new T.ConeGeometry(.12,.35,5),m);tl.rotation.x=-Math.PI/2;tl.scale.z=.3;tl.position.set(0,.02,-.42);g.add(tl);
  const wings=[-1,1].map(s=>{const p=new T.Group();p.position.set(s*.12,.05,0);const w=new T.Mesh(new T.SphereGeometry(.3,10,8),m);w.scale.set(1.3,.1,.7);w.position.x=s*.32;w.add(new T.Mesh(w.geometry,outlineMat));p.add(w);g.add(p);return p;});
  const L=new T.PointLight('#ffffff',.9,14,1.5);g.add(L);W.scene.add(g);W.tick.push((dt,tt)=>{const f=Math.sin(tt*11)*.7;wings[0].rotation.z=-f;wings[1].rotation.z=f;});return g;}

/* ---------- quest markers ---------- */
const markOut=new T.ShaderMaterial({side:T.BackSide,uniforms:{t:{value:.035}},vertexShader:'uniform float t;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*t,1.);}',fragmentShader:'void main(){gl_FragColor=vec4(.16,.1,.08,1.);}'});
function mark3d(kind){const g=new T.Group(),m=new T.MeshToonMaterial({color:kind==='!'?'#ffd028':'#ffffff',emissive:kind==='!'?'#7a4a00':'#3a5a78',emissiveIntensity:.45,gradientMap:grad});
  const add=(geo,x,y,z)=>{const a=new T.Mesh(geo,m);a.position.set(x||0,y||0,z||0);a.add(new T.Mesh(geo,markOut));g.add(a);};
  add(new T.SphereGeometry(.15,16,12),0,.02,0);
  if(kind==='!'){add(new T.CylinderGeometry(.22,.11,.6,16),0,.6,0);add(new T.SphereGeometry(.22,16,12),0,.9,0);add(new T.SphereGeometry(.11,12,10),0,.3,0);}
  else{const pts=[[-.2,.66],[-.15,.82],[0,.92],[.17,.86],[.24,.7],[.16,.54],[.03,.44],[0,.3]].map(p=>new T.Vector3(p[0],p[1],0));
    add(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.115,12,false));add(new T.SphereGeometry(.115,12,10),pts[0].x,pts[0].y,0);add(new T.SphereGeometry(.115,12,10),0,.3,0);}
  return g;}
function addInter(o){const I=Object.assign({h:2,r:2.3},o);if(I.P){I.x=I.P.x;I.z=I.P.z;}const s=new T.Group();s.add(mark3d('!'),mark3d('?'));s.visible=false;W.scene.add(s);I.s=s;I.pick=[I.P?I.P.g:I.obj,s];W.inter.push(I);return I;}
const byId=id=>W.inter.find(I=>I.id===id);
const curStep=()=>W.steps[W.step];
function targets(){const s=curStep();if(!s)return[];if(s.collect)return s.collect.filter(id=>!byId(id).got);return s.at?[s.at]:[];}
const isActive=I=>!I.hidden&&(targets().includes(I.id)||(I.side&&!I.done));
function marks(){const tg=targets(),s=curStep();for(const I of W.inter){const k=I.hidden?null:(tg.includes(I.id)?'!':(I.side&&!I.done?'?':null));I.kind=k;I.s.visible=!!k&&mode==='explore';if(k){I.s.children[0].visible=k==='!';I.s.children[1].visible=k==='?';}}
  let t=s?(typeof s.text==='function'?s.text():s.text):'';if(s&&s.collect)t+=' ('+(s.collect.length-tg.length)+'/'+s.collect.length+')';if(s&&s.taps)t+=' ('+(s.n||0)+'/'+s.taps+')';
  $('obj').innerHTML=t?'<i>!</i><span>'+t+'</span>':'';}
function advance(){W.step++;goTo=null;const s=curStep();marks();if(!s){finish();return;}if(!s.at&&!s.collect){talking=true;s.run(()=>{endTalk();advance();});}}
function talk(I){if(talking||mode!=='explore')return;const s=curStep(),tg=targets();goTo=null;$('prompt').style.display='none';
  if(tg.includes(I.id)){
    if(s.collect){sfx('pick');I.got=true;if(s.each)s.each(I);marks();if(!targets().length){if(s.run){talking=true;s.run(()=>{endTalk();advance();});}else advance();}}
    else if(s.taps){sfx('pick');s.n=(s.n||0)+1;if(s.each)s.each(I,s.n);marks();if(s.n>=s.taps){talking=true;s.run(()=>{endTalk();advance();},I);}}
    else{sfx('tap');talking=true;s.run(()=>{endTalk();advance();},I);}}
  else if(I.side&&!I.done){sfx('tap');talking=true;I.run(()=>{I.done=true;endTalk();marks();});}}

/* ---------- input ---------- */
const keys={};let mode='menu',yaw=3.6,pitch=.2,dist=8,joyX=0,joyY=0,talking=false,near=null,goTo=null,goT=0,cine=null,chIdx=0;
let ctrl=coarse?'touch':'keys';try{const v=localStorage.getItem('cq-ctrl');if(v==='touch'||v==='keys')ctrl=v;}catch(e){}
addEventListener('keydown',e=>{keys[e.code]=true;if((e.code==='KeyE'||e.code==='Enter')&&mode==='explore'&&!talking&&near&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();talk(near);}});
addEventListener('keyup',e=>{keys[e.code]=false;});
let drag=null;const cv=$('c'),ray=new T.Raycaster(),ndc=new T.Vector2();
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY};cv.setPointerCapture(e.pointerId);if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();});
cv.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-drag.x)*.006;pitch=Math.max(.05,Math.min(1.1,pitch+(e.clientY-drag.y)*.004));drag.x=e.clientX;drag.y=e.clientY;});
cv.addEventListener('pointerup',e=>{if(drag&&Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)<8)tap(e.clientX,e.clientY);drag=null;});cv.addEventListener('pointercancel',()=>drag=null);
cv.addEventListener('wheel',e=>{dist=Math.max(3.5,Math.min(16,dist+e.deltaY*.01));},{passive:true});
document.querySelectorAll('#pad button').forEach(b=>{const d=b.dataset.d.split(',').map(Number);
  const on=e=>{e.preventDefault();joyX=d[0];joyY=d[1];b.classList.add('on');try{b.setPointerCapture(e.pointerId);}catch(_){}},off=()=>{if(b.classList.contains('on')){joyX=joyY=0;b.classList.remove('on');}};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off);b.addEventListener('contextmenu',e=>e.preventDefault());});
$('act').onclick=()=>{if(near&&!talking)talk(near);};
function tap(x,y){if(mode!=='explore'||talking)return;ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(ndc,camera);let best=null,bd=1e9;
  for(const I of W.inter){if(!isActive(I))continue;const h=ray.intersectObjects(I.pick,true);if(h.length&&h[0].distance<bd){bd=h[0].distance;best=I;}}
  if(!best)return;const pl=W.player;if(best.remote||Math.hypot(best.x-pl.x,best.z-pl.z)<best.r+.8)talk(best);else{goTo=best;goT=0;}}

/* ---------- dialogue, story, mini-games ---------- */
const dlg=$('dlg');let spoken='';
/* Recorded voice: audio/voice/<FNV-1a hash of the line>.mp3, made by tools/make_voice.py. Falls back to the system voice when a line has no file. */
let voice=null;
const vHash=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}return (h>>>0).toString(16).padStart(8,'0');};
function sysSpeak(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='vi-VN';u.rate=.92;speechSynthesis.speak(u);}catch(e){}}
function speak(){hush();if(!spoken)return;const t=spoken,a=new Audio('audio/voice/'+vHash(t)+'.mp3');voice=a;a.onerror=()=>{if(voice===a){voice=null;sysSpeak(t);}};a.play().catch(()=>{});}
function hush(){if(voice){voice.onerror=null;voice.pause();voice=null;}try{speechSynthesis.cancel();}catch(e){}}
const canSpeak=true;
/* Auto-read: on by default, saved in localStorage 'cq-auto'; toggled from the top bar (bRead) or Settings (rAuto). */
let AUTO=true;try{AUTO=localStorage.getItem('cq-auto')!=='0';}catch(e){}
function autoUI(){const b=$('bRead');b.textContent='Đọc: '+(AUTO?'bật':'tắt');b.setAttribute('aria-pressed',AUTO);$('rAuto').textContent=AUTO?'Tắt tự động đọc':'Bật tự động đọc';}
function setAuto(v){AUTO=v;try{localStorage.setItem('cq-auto',v?'1':'0');}catch(e){}if(v){if(spoken&&(dlg.style.display==='block'||$('story').style.display==='flex'))speak();}else hush();autoUI();}
$('bRead').onclick=()=>setAuto(!AUTO);$('rAuto').onclick=()=>setAuto(!AUTO);autoUI();
const strip=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
function open(name,html){sfx('open');dlg.style.display='block';dlg.className='';$('dName').textContent=name;$('dBody').innerHTML=html;spoken=strip(html);}
function say(name,text,ref,btn,cb){open(name,'<p>'+text+'</p>'+(ref?'<div class="ref">'+ref+'</div>':'')+'<div class="row">'+(canSpeak?'<button class="alt" id="dHear">Nghe đọc</button>':'')+'<button class="go" id="dGo">'+(btn||'Tiếp')+'</button></div>');
  spoken=strip(text);if(canSpeak)$('dHear').onclick=speak;$('dGo').onclick=()=>{hush();cb();};$('dGo').focus();if(AUTO)speak();}
function lines(arr,cb){let i=0;const nx=()=>{if(i>=arr.length){cb();return;}const a=arr[i++];say(a[0],a[1],a[2],null,nx);};nx();}
function endTalk(){dlg.style.display='none';talking=false;hush();}
function doneRow(ref,cb){const r=$('ref');r.textContent=ref||'';const g=document.createElement('button');g.className='go';g.textContent='Tiếp';g.onclick=()=>{hush();cb();};$('opts').appendChild(g);g.focus();}
function fillWord(o,cb){open(o.name,'<p>'+o.before+' <span class="blank" id="blank">?</span>'+(o.after||'')+'</p><div class="row" id="opts"></div><div class="ref" id="ref">'+(o.hint||'Chọn chữ còn thiếu.')+'</div>');
  spoken=strip(o.before+' '+o.answer+(o.after||''));
  o.options.forEach(w=>{const b=document.createElement('button');b.className='opt';b.textContent=w;b.onclick=()=>{if(w===o.answer){sfx('right');b.classList.add('ok');$('blank').textContent=w;[...$('opts').children].forEach(x=>x.disabled=true);doneRow(o.ref,cb);}
    else{sfx('wrong');b.classList.add('no');b.disabled=true;$('ref').textContent=o.wrong||'Chưa đúng, thử lại nhé!';}};$('opts').appendChild(b);});}
function choice(o,cb){open(o.name,'<p>'+o.q+'</p><div class="row col" id="opts"></div><div class="ref" id="ref"></div>');
  const ops=o.options.map((t,i)=>({t,ok:i===0}));for(let i=ops.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ops[i],ops[j]]=[ops[j],ops[i]];}
  ops.forEach(p=>{const b=document.createElement('button');b.className='opt';b.textContent=p.t;b.onclick=()=>{if(p.ok){sfx('right');b.classList.add('ok');spoken=p.t;[...$('opts').children].forEach(x=>x.disabled=true);doneRow(o.ref,cb);}
    else{sfx('wrong');b.classList.add('no');b.disabled=true;$('ref').textContent=o.wrong||'Chưa đúng, thử lại nhé!';}};$('opts').appendChild(b);});}
function order(o,cb){open(o.name,'<p class="small">'+(o.q||'Chạm vào các mảnh theo đúng thứ tự để ghép lại câu.')+'</p><p id="built" class="built">&nbsp;</p><div class="row" id="opts"></div><div class="ref" id="ref"></div>');
  spoken=o.chunks.join(' ');let n=0;const idx=o.chunks.map((_,i)=>i);do{for(let i=idx.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}}while(idx.every((v,i)=>v===i));
  idx.forEach(k=>{const b=document.createElement('button');b.className='opt';b.textContent=o.chunks[k];b.onclick=()=>{if(k===n){n++;sfx('right',n===o.chunks.length?1:.5);b.classList.add('ok');b.disabled=true;$('built').textContent=o.chunks.slice(0,n).join(' ');$('ref').textContent='';if(n===o.chunks.length)doneRow(o.ref,cb);}
    else{sfx('wrong');b.classList.add('no');$('ref').textContent='Chưa phải mảnh này, thử mảnh khác nhé!';setTimeout(()=>b.classList.remove('no'),500);}};$('opts').appendChild(b);});}
function tapFill(o,cb){open(o.name,'<p>'+o.text+'</p><div class="bar"><i id="barI"></i></div><div class="row center"><button class="tapbtn" id="tapB">Chạm!</button></div>');dlg.className='tap';
  let v=0,done=false;const need=o.need||16,dec=o.decay==null?1.2:o.decay;const upd=()=>{const p=Math.max(0,Math.min(1,v/need));$('barI').style.width=p*100+'%';if(o.onP)o.onP(p);};
  const iv=setInterval(()=>{if(done)return;v=Math.max(0,v-dec*.1);upd();},100);
  $('tapB').onclick=()=>{if(done)return;sfx('tick');v+=1;upd();if(v>=need){done=true;clearInterval(iv);$('tapB').disabled=true;$('tapB').textContent='Tuyệt!';setTimeout(cb,700);}};$('tapB').focus();upd();}
let balSkip=null;
function balance(o,cb){open(o.name,'<p>'+o.text+'</p><div class="bal"><i></i><b id="balP"></b></div><div class="bar"><i id="barI"></i></div><div class="row center"><button class="opt big" id="balL" aria-label="Sang trái">&#9664;</button><button class="opt big" id="balR" aria-label="Sang phải">&#9654;</button></div>');dlg.className='tap';
  let x=0,v=.2,prog=0,done=false,dir=0,t=0;const need=o.secs||6;
  const set=(b,d)=>{b.onpointerdown=e=>{e.preventDefault();dir=d;};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{if(dir===d)dir=0;};b.onclick=()=>{v+=d*.25;};};set($('balL'),-1);set($('balR'),1);
  const kd=e=>{if(e.code==='ArrowLeft'||e.code==='KeyA')dir=-1;if(e.code==='ArrowRight'||e.code==='KeyD')dir=1;},ku=()=>{dir=0;};addEventListener('keydown',kd);addEventListener('keyup',ku);
  const end=()=>{done=true;clearInterval(iv);removeEventListener('keydown',kd);removeEventListener('keyup',ku);balSkip=null;if(o.onP)o.onP(1,0);setTimeout(cb,600);};
  const iv=setInterval(()=>{if(done)return;t+=.05;v+=(Math.sin(t*1.5)*.8+Math.sin(t*.8+1)*.5)*.035+dir*.1;v*=.93;x+=v*.14;if(x>1){x=1;v=-Math.abs(v)*.3;}if(x<-1){x=-1;v=Math.abs(v)*.3;}
    const inz=Math.abs(x)<.4;prog=Math.max(0,prog+(inz?.05:-.025));$('balP').style.left=(50+x*46)+'%';$('balP').className=inz?'in':'';const p=Math.min(1,prog/need);$('barI').style.width=p*100+'%';if(o.onP)o.onP(p,x);if(prog>=need)end();},50);
  balSkip=end;$('balR').focus();}
function story(panels,cb){const el=$('story');let i=0;mode='story';ui();const show=()=>{const p=panels[i];cine=p.cam?{pos:new T.Vector3(p.cam[0],p.cam[1],p.cam[2]),look:new T.Vector3(p.cam[3],p.cam[4],p.cam[5])}:cine;
    $('sT').textContent=p.t||'';$('sX').textContent=p.x;$('sR').textContent=p.ref||'';$('sN').textContent=(i+1)+' / '+panels.length;spoken=p.x;$('sGo').focus();if(AUTO)speak();};
  el.style.display='flex';$('sHear').style.display=canSpeak?'':'none';$('sHear').onclick=speak;
  $('sGo').onclick=()=>{hush();i++;if(i>=panels.length){el.style.display='none';cine=null;mode='explore';ui();cb();}else show();};show();}
function fade(cb){const f=$('fade');f.style.opacity=1;f.style.pointerEvents='auto';setTimeout(()=>{cb();setTimeout(()=>{f.style.opacity=0;f.style.pointerEvents='none';},120);},420);}
function setCine(c){cine=c?{pos:new T.Vector3(c[0],c[1],c[2]),look:new T.Vector3(c[3],c[4],c[5])}:null;}

/* ---------- audio: background music with volume and mute ---------- */
const AU={vol:.5,mute:false,fx:.7,fxMute:false};try{Object.assign(AU,JSON.parse(localStorage.getItem('cq-audio')||'{}'));}catch(e){}
const bgm=new Audio();bgm.loop=true;bgm.preload='auto';bgm.src='audio/followjesus_background.mp3';let bgmOn=false;
function auApply(){const v=AU.mute?0:AU.vol;try{bgm.volume=v;}catch(e){}bgm.muted=AU.mute;
  $('bSnd').textContent=AU.mute?'Nhạc: tắt':'Nhạc: bật';$('bSnd').setAttribute('aria-pressed',!AU.mute);$('aMute').textContent=AU.mute?'Bật nhạc nền':'Tắt nhạc nền';$('aVol').value=Math.round(AU.vol*100);$('aVolN').textContent=Math.round(AU.vol*100)+'%';
  try{localStorage.setItem('cq-audio',JSON.stringify(AU));}catch(e){}}
function auStart(){fxGo=true;if(bgmOn)return;
  /* Plain <audio> only: routing through Web Audio made the music silent on iPhone (it follows the ring/silent switch and needs its own unlock). */
  const p=bgm.play();if(p&&p.then)p.then(()=>{bgmOn=true;}).catch(()=>{});}
['pointerdown','pointerup','touchend','click','keydown'].forEach(ev=>addEventListener(ev,auStart,{passive:true}));
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
if(isIOS)document.body.classList.add('ios');
document.addEventListener('visibilitychange',()=>{if(document.hidden){bgm.pause();bgmOn=false;}else auStart();});
$('bSnd').onclick=$('aMute').onclick=()=>{AU.mute=!AU.mute;auApply();};
$('aVol').oninput=()=>{AU.vol=$('aVol').value/100;if(AU.vol>0)AU.mute=false;auApply();};
auApply();
/* ---------- sound effects: file map in js/sounds.js (window.CQ_SFX); plain audio elements, silent on any failure ---------- */
let fxGo=false;const fxA={},fxLast={};
(function(){const M=window.CQ_SFX||{};for(const k in M){try{const a=new Audio();a.preload='auto';a.onerror=()=>{fxA[k]=null;};a.src=M[k];fxA[k]=[a];}catch(e){}}})();
function sfx(k,g){if(!fxGo||AU.fxMute||!(AU.fx>0))return;const p=fxA[k];if(!p)return;const now=performance.now();
  if(k==='open'&&now-(fxLast.tap||0)<150)return;fxLast[k]=now;
  try{let a=p.find(x=>x.paused||x.ended);if(!a){if(p.length<5){a=p[0].cloneNode();p.push(a);}else a=p[0];}
    a.volume=Math.min(1,AU.fx*(g||1));a.currentTime=0;const r=a.play();if(r&&r.catch)r.catch(()=>{});}catch(e){}}
function fxApply(){$('fxMute').textContent=AU.fxMute?'Bật hiệu ứng':'Tắt hiệu ứng';$('fxVol').value=Math.round(AU.fx*100);$('fxVolN').textContent=Math.round(AU.fx*100)+'%';
  try{localStorage.setItem('cq-audio',JSON.stringify(AU));}catch(e){}}
$('fxMute').onclick=()=>{AU.fxMute=!AU.fxMute;fxApply();sfx('tap');};
$('fxVol').oninput=()=>{AU.fx=$('fxVol').value/100;if(AU.fx>0)AU.fxMute=false;fxApply();sfx('tap');};
fxApply();

/* ---------- chapter flow ---------- */
let prog={};try{prog=JSON.parse(localStorage.getItem('cq-prog')||'{}');}catch(e){}
const HK=CQ.hooks={load:[],zone:[],frame:[],ui:[],menu:[],finish:[]};const hook=(k,...a)=>{for(const f of HK[k])try{f(...a);}catch(e){console.error(e);}};
function load(i){chIdx=i;const ch=CQ.chapters[i];if(W)W.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});
  $('c').style.filter='';newWorld();seed=4000+i*977;ch.build(W);W.step=-1;yaw=W.startYaw;pitch=.17;dist=8;first=true;talking=false;goTo=null;cine=null;near=null;endTalk();hook('load',ch);
  $('chT').textContent='Chương '+ch.no+' · '+ch.title;$('chS').textContent=ch.sub;}
function startChapter(i){const ch=CQ.chapters[i];if(!ch.build)return;fade(()=>{load(i);mode='explore';ui();$('done').style.display='none';sfx('chapter');
  if(ch.intro)story(ch.intro,advance);else advance();});}
function finish(){sfx('stamp');const ch=CQ.chapters[chIdx];prog[ch.id]=1;try{localStorage.setItem('cq-prog',JSON.stringify(prog));}catch(e){}
  $('stNo').textContent=ch.no;$('stName').textContent=ch.title;$('dnT').textContent='Hoàn thành chương '+ch.no;$('dnX').textContent=ch.outro||'';$('dnR').textContent=ch.outroRef||'';
  const nx=CQ.chapters[chIdx+1];$('dnNext').style.display=nx&&nx.build?'':'none';$('dnT').textContent=nx&&nx.build?'Hoàn thành chương '+ch.no:'Bạn đã đi hết hành trình!';$('dnNext').onclick=()=>startChapter(chIdx+1);$('done').style.display='flex';mode='done';ui();hook('finish',ch);}
function menu(){fade(()=>{$('done').style.display='none';mode='menu';buildMenu();ui();});}
const PARTS=[[1,'Phần 1 · Khởi đầu'],[5,'Phần 2 · Những dấu lạ đầu tiên'],[9,'Phần 3 · Khắp xứ Ga-li-lê và Giu-đê'],[15,'Phần 4 · Giê-ru-sa-lem']];
function buildMenu(){const box=$('chList');box.innerHTML='';CQ.chapters.forEach((ch,i)=>{const pt=PARTS.find(p=>p[0]===ch.no);if(pt&&CQ.chapters.length>8){const hd=document.createElement('div');hd.className='part';hd.textContent=pt[1];box.appendChild(hd);}const b=document.createElement('button');b.className='chap'+(ch.build?'':' soon');b.disabled=!ch.build;
    b.innerHTML='<span class="no">'+ch.no+'</span><span class="tx"><b>'+ch.title+'</b><small>'+(ch.build?ch.sub:'Sắp có')+'</small></span>'+(prog[ch.id]?'<span class="tem">Đã có tem</span>':'');b.dataset.i=i;b.onclick=()=>startChapter(i);box.appendChild(b);});hook('menu',box);}
function ui(){const ex=mode==='explore';$('title').style.display=mode==='menu'?'flex':'none';$('chip').style.display=(ex||mode==='story')?'flex':'none';$('bar').style.display=(ex||mode==='menu'||mode==='story')?'flex':'none';$('bMenu').style.display=ex?'':'none';
  $('pad').style.display=ex&&ctrl==='touch'?'grid':'none';$('hint').style.display=ex?'block':'none';
  $('hint').textContent=ctrl==='touch'?'Nút mũi tên để đi · kéo màn hình để xoay · bấm vào nơi có dấu !':'W A S D để đi · kéo chuột để xoay · bấm vào nơi có dấu ! hoặc nhấn E';
  $('cKeys').setAttribute('aria-pressed',ctrl==='keys');$('cTouch').setAttribute('aria-pressed',ctrl==='touch');if(!ex){$('prompt').style.display='none';$('act').style.display='none';if(mode!=='menu')$('set').style.display='none';}if(W)marks();hook('ui',mode);}
function setCtrl(c){ctrl=c;try{localStorage.setItem('cq-ctrl',c);}catch(e){}joyX=joyY=0;ui();}
$('cKeys').onclick=()=>setCtrl('keys');$('cTouch').onclick=()=>setCtrl('touch');
$('bSet').onclick=()=>{const o=$('set').style.display!=='block';$('set').style.display=o?'block':'none';};
$('bMenu').onclick=menu;$('dnMenu').onclick=menu;

/* ---------- collisions ---------- */
function collide(p){for(const o of W.obstacles){const c=Math.cos(o.rot),s=Math.sin(o.rot),dx=p.x-o.x,dz=p.z-o.z;let lx=dx*c-dz*s-o.ox,lz=dx*s+dz*c;const hw=o.w/2+.35,hd=o.d/2+.35;
    if(Math.abs(lx)<hw&&Math.abs(lz)<hd){const px=hw-Math.abs(lx),pz=hd-Math.abs(lz);if(px<pz)lx=Math.sign(lx)*hw;else lz=Math.sign(lz)*hd;lx+=o.ox;p.x=o.x+lx*c+lz*s;p.z=o.z-lx*s+lz*c;}}
  for(const o of W.circles){const dx=p.x-o.x,dz=p.z-o.z,d=Math.hypot(dx,dz),r=o.r+.3;if(d<r&&d>1e-4){p.x=o.x+dx/d*r;p.z=o.z+dz/d*r;}}
  for(const o of W.chars){if(o===W.player||!o.g.visible||o.o.float)continue;const dx=p.x-o.x,dz=p.z-o.z,d=Math.hypot(dx,dz);if(d<.7&&d>1e-4){p.x=o.x+dx/d*.7;p.z=o.z+dz/d*.7;}}}

/* ---------- loop ---------- */
const clock=new T.Clock(),look=new T.Vector3(),camPos=new T.Vector3();let tt=0,first=true;
function frame(){requestAnimationFrame(frame);if(!W||!W.player)return;const dt=Math.min(clock.getDelta(),.05);tt+=dt;applyTOD(Math.min(1,dt*1.6));if(W.waterU)W.waterU.uT.value=tt;const pl=W.player;
  let ix=0,iy=0;if(mode==='explore'&&!talking){ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joyX;iy=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)+joyY;}
  const il=Math.hypot(ix,iy);let moving=0,mx=0,mz=0;
  if(il>.08){goTo=null;const s=Math.sin(yaw),c=Math.cos(yaw);mx=(-s*iy+c*ix)/il;mz=(-c*iy-s*ix)/il;moving=Math.min(1,il);}
  else if(goTo&&mode==='explore'&&!talking){const gx=goTo.x-pl.x,gz=goTo.z-pl.z,gd=Math.hypot(gx,gz);goT+=dt;if(gd<goTo.r){const t=goTo;goTo=null;talk(t);}else if(goT>14)goTo=null;else{mx=gx/gd;mz=gz/gd;moving=1;}}
  if(moving>0){const sp=(keys.ShiftLeft?7.5:4.8)*moving;const np={x:pl.x+mx*sp*dt,z:pl.z+mz*sp*dt};collide(np);if(G(np.x,np.z)>-.4&&Math.abs(np.x)<150&&Math.abs(np.z)<150&&(!W.bounds||W.bounds(np.x,np.z))){pl.x=np.x;pl.z=np.z;}
    let ta=Math.atan2(mx,mz),da=ta-pl.g.rotation.y;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;pl.g.rotation.y+=da*Math.min(1,dt*12);}
  for(const P of W.chars){let mv=P===pl?moving:0;
    if(P.dest){const d=P.dest,gx=d.x-P.x,gz=d.z-P.z,gd=Math.hypot(gx,gz);if(gd<.15){P.dest=null;if(d.cb)d.cb();}else{const st=Math.min(gd,d.sp*dt);P.x+=gx/gd*st;P.z+=gz/gd*st;let ta=Math.atan2(gx,gz),da=ta-P.g.rotation.y;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;P.g.rotation.y+=da*Math.min(1,dt*8);mv=1;}}
    P.move+=(mv-P.move)*Math.min(1,dt*10);animChar(P,dt);const gy=G(P.x,P.z);P.y=P.y==null?gy:P.y+(gy-P.y)*Math.min(1,dt*10);P.g.position.set(P.x,Math.max(P.y,P.minY==null?-.35:P.minY)+P.bob,P.z);}
  const tg=targets();near=null;let nd=1e9;for(const I of W.inter){if(I.P){I.x=I.P.x;I.z=I.P.z;}else if(I.obj&&I.follow){I.x=I.obj.position.x;I.z=I.obj.position.z;}
    const d=Math.hypot(I.x-pl.x,I.z-pl.z);if(isActive(I)&&(I.remote||d<I.r+1)&&d<nd){nd=d;near=I;}
    if(I.P&&!I.P.dest&&!I.noTurn&&d<6&&mode==='explore'){const P=I.P,ta=Math.atan2(pl.x-P.x,pl.z-P.z);let da=ta-P.g.rotation.y;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;P.g.rotation.y+=da*Math.min(1,dt*3);}
    if(I.s.visible){const by=I.P?I.P.g.position.y:(I.obj&&I.follow?I.obj.position.y:G(I.x,I.z)),sc=Math.max(.75,Math.min(3.2,camera.position.distanceTo(I.s.position)*.075))*(1+Math.sin(tt*5)*.06);I.s.position.set(I.x,by+I.h*(I.P&&I.P.o.S||1)+.12+Math.abs(Math.sin(tt*2.6))*.2,I.z);I.s.scale.setScalar(sc*.95);I.s.rotation.y=tt*2.2;}}
  const showP=mode==='explore'&&near&&!talking;$('prompt').style.display=showP?'block':'none';$('act').style.display=showP&&ctrl==='touch'?'block':'none';
  if(showP)$('prompt').textContent=(ctrl==='keys'?'E · ':'')+(near.verb||(near.P?'Trò chuyện với ':'Xem '))+near.name;
  if(cine){camPos.copy(cine.pos);look.copy(cine.look);camPos.y=Math.max(camPos.y,G(camPos.x,camPos.z)+1.6);look.y=Math.max(look.y,G(look.x,look.z)+.4);}
  else if(mode==='menu'){const m=W.menuCam,a=tt*.05+.9;camPos.set(m.x+Math.cos(a)*m.r,m.y+m.h,m.z+Math.sin(a)*m.r);look.set(m.x,m.y,m.z);}
  else{look.set(pl.x,pl.g.position.y+2.2,pl.z);const cp=Math.cos(pitch);camPos.set(pl.x+Math.sin(yaw)*cp*dist,look.y+Math.sin(pitch)*dist,pl.z+Math.cos(yaw)*cp*dist);camPos.y=Math.max(camPos.y,Math.max(G(camPos.x,camPos.z),0)+.6);}
  if(first){camera.position.copy(camPos);W.look=look.clone();first=false;}else{camera.position.lerp(camPos,Math.min(1,dt*(cine||mode==='menu'?1.6:7)));W.look.lerp(look,Math.min(1,dt*(cine?2.2:12)));}
  camera.lookAt(W.look);W.sky.position.copy(camera.position);W.stars.position.copy(camera.position);if(W.waterU)W.waterU.uCam.value.copy(camera.position);
  const fx=W.look.x,fz=W.look.z;W.sun.target.position.set(fx,0,fz);W.sun.position.set(fx+W.curSun.x*120,W.curSun.y*120,fz+W.curSun.z*120);
  for(const b of W.boats){if(b.o.float){b.g.position.y=.12+Math.sin(tt*1.1+b.ph)*.07;b.g.rotation.z=Math.sin(tt*.9+b.ph)*.035;}if(b.o.sailing)b.g.position.x=b.x+Math.sin(tt*.03+b.ph)*30;}
  for(const c of W.clouds){c.position.x+=dt*1.2;if(c.position.x>460)c.position.x=-460;}
  for(const s of W.sheep)s.hd.position.y=.78+Math.sin(tt*.8+s.ph)*.05;
  for(const f of W.tick)f(dt,tt);
  hook('frame',dt,tt);
  renderer.render(W.scene,camera);}

Object.assign(CQ,{T,R,rr,sm,C,noise,toon,mesh,canvasTex,boxUV,M,grad,G,distPath,terrain,sky,water,setTod,jar,house,wallBox,palm,olive,bush,scatter,sheep,boat,campfire,crowd,ring,rockTomb,zones,goZone,balance,outlineMat,makeChar,place,walkTo,face,dove,addInter,byId,marks,say,lines,fillWord,choice,order,tapFill,story,fade,setCine,
  sfx,collide,st:()=>({mode,talking,chIdx}),prog:()=>prog,
  movePlayer:(x,z,y)=>{place(W.player,x,z);if(y!=null)yaw=y;first=true;hook('zone');},
  boot:()=>{CQ.chapters.sort((a,b)=>a.no-b.no);buildMenu();load(0);mode='menu';ui();frame();},
  dbg:{start:startChapter,state:()=>({mode,talking,step:W.step,steps:W.steps.length}),yaw:v=>{yaw=v;},pitch:v=>{pitch=v;},talkId:id=>talk(byId(id)),balWin:()=>{if(balSkip)balSkip();},tap,setCtrl}});
})();
