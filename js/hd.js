/* Christ Quest HD layer (opt-in preview of the graphics upgrade).
   Load after js/engine.js and before CQ.boot(). Uses only CQ globals plus the small engine hooks
   CQ.renderer / CQ.camera / CQ.view() / CQ.render. Self-contained: add this file (and, for bloom, the
   r128 examples/js EffectComposer, RenderPass, ShaderPass, CopyShader, LuminosityHighPassShader and
   UnrealBloomPass scripts) to index.html to enable it everywhere.
   URL switches: ?hd=0 turns the layer off; ?hdq=high|mid|low picks quality (default high on desktop,
   mid on touch devices; low = no post-processing, smaller shadows, less grass).
   Order of work follows the AAA graphics skill: authored forms (Jesus, grass, flowers, rocks) ->
   materials (soft toon ramps, rim light, terrain detail) -> lighting (linear workflow, ACES,
   key/fill/rim, tight shadows) -> post (subtle bloom, grade, vignette). */
'use strict';
(function(){
const qs=new URLSearchParams(location.search);
if(!window.CQ||!CQ.renderer||!CQ.camera||qs.get('hd')==='0')return;
const T=CQ.T,renderer=CQ.renderer,camera=CQ.camera;
const coarse=matchMedia('(pointer:coarse)').matches;
const QL=['high','mid','low'].includes(qs.get('hdq'))?qs.get('hdq'):(coarse?'mid':'high');
const HD=CQ.HD={on:true,quality:QL,stats:null};
const LIGHT={exposure:.55,sun:2.2,hemi:.6,rim:.45}; /* three's ACES divides exposure by 0.6, so .55 keeps the authored mid-tones */ /* intensity multipliers over the engine's TOD values */
HD.LIGHT=LIGHT;
const GR={sat:1.15,con:1.06};HD.GRADE=GR;
if(qs.get('hdl')){const v=qs.get('hdl').split(',').map(Number);['exposure','sun','hemi','rim'].forEach((k,i)=>{if(isFinite(v[i]))LIGHT[k]=v[i];});if(isFinite(v[4]))GR.sat=v[4];if(isFinite(v[5]))GR.con=v[5];} /* tuning aid */

/* ---------- small helpers ---------- */
let seed=9173;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
const rr=(a,b)=>a+(b-a)*rnd();
const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const lin=h=>new T.Color(h).convertSRGBToLinear();
function ramp(vals){const t=new T.DataTexture(new Uint8Array(vals),vals.length,1,T.LuminanceFormat);t.minFilter=t.magFilter=T.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;t.hdSoft=1;return t;}
function soften(tex,vals){if(!tex||tex.hdSoft)return;if(tex.image&&tex.image.data&&tex.image.data.length===vals.length)tex.image.data.set(vals);tex.minFilter=tex.magFilter=T.LinearFilter;tex.needsUpdate=true;tex.hdSoft=1;}
const RAMP_CLOTH=ramp([78,120,196,236,255]),RAMP_SKIN=ramp([150,182,222,246,255]);

/* ---------- 1. render pipeline: linear workflow + ACES + DPR cap ---------- */
renderer.outputEncoding=T.sRGBEncoding;
renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=LIGHT.exposure;HD.setExposure=v=>{LIGHT.exposure=renderer.toneMappingExposure=v;};
const DPR=Math.min(devicePixelRatio||1,QL==='high'?2:QL==='mid'?1.5:1.25);
renderer.setPixelRatio(DPR);
/* engine toon ramps: from hard 3-band to a soft 4-step ramp (the cast keeps its look, light wraps more gently) */
soften(CQ.grad,[92,128,200,255]);

/* the engine authored every colour in display (sRGB) space; convert stock materials, vertex and instance colours
   once so the bright kid-friendly palette survives the linear workflow. ShaderMaterials stay in display space. */
function linAttr(a){if(!a||a.hdLin)return;a.hdLin=1;const c=new T.Color();for(let i=0;i<a.count;i++){c.setRGB(a.getX(i),a.getY(i),a.getZ(i)).convertSRGBToLinear();a.setXYZ(i,c.r,c.g,c.b);}a.needsUpdate=true;}
function linMat(m){if(!m||m.userData.hdLin)return;m.userData.hdLin=1;if(m.isShaderMaterial)return;
  if(m.color)m.color.convertSRGBToLinear();if(m.emissive)m.emissive.convertSRGBToLinear();
  if(m.map&&m.map.encoding!==T.sRGBEncoding){m.map.encoding=T.sRGBEncoding;m.needsUpdate=true;}
  if(m.gradientMap&&!m.gradientMap.hdSoft)soften(m.gradientMap,[128,160,214,255]); /* the engine's soft skin ramp */
  if(m.isMeshBasicMaterial||m.isPointsMaterial)m.toneMapped=false;}
function sweep(root){root.traverse(o=>{
  if(o.material){if(Array.isArray(o.material))o.material.forEach(linMat);else linMat(o.material);}
  if(o.geometry&&o.geometry.attributes&&o.geometry.attributes.color)linAttr(o.geometry.attributes.color);
  if(o.isInstancedMesh&&o.instanceColor)linAttr(o.instanceColor);
  if(o.isLight&&!o.userData.hdLin&&o!==(CQ.W&&CQ.W.sun)&&o!==(CQ.W&&CQ.W.hemi)){o.userData.hdLin=1;o.color.convertSRGBToLinear();}});}

/* ---------- 2. lighting rig: warm key (engine sun, tight soft shadows), sky/ground fill, cool rim ---------- */
const rim=new T.DirectionalLight(lin('#9cc2ff'),.5);rim.castShadow=false;
const SH={high:{size:2048,half:20},mid:{size:2048,half:18},low:{size:1024,half:16}}[QL];
function rigWorld(W){if(!W.sun)return;const s=W.sun;
  if(s.shadow.map){s.shadow.map.dispose();s.shadow.map=null;}
  s.shadow.mapSize.set(SH.size,SH.size);const c=s.shadow.camera;c.left=-SH.half;c.right=SH.half;c.top=SH.half;c.bottom=-SH.half;c.near=20;c.far=240;c.updateProjectionMatrix();
  s.shadow.bias=-0.00035;s.shadow.normalBias=.025;
  W.hemi.groundColor.set('#c4a77e').convertSRGBToLinear();W.hemi.userData.hdLin=1;
  W.scene.add(rim);W.scene.add(rim.target);
  if(W.scene.fog){W.scene.fog.near*=1.2;W.scene.fog.far*=1.35;}}
const tmpA=new T.Color(),tmpB=new T.Color(),tmpC=new T.Color(),focus=new T.Vector3();
function lightsBefore(W,cam){const s=W.sun,h=W.hemi;tmpA.copy(s.color);tmpB.copy(h.color);
  s.color.convertSRGBToLinear();h.color.convertSRGBToLinear();s.intensity*=LIGHT.sun;h.intensity*=LIGHT.hemi;
  /* key light follows the player (or the cinematic look point) with a tight frustum = sharp contact shadows */
  const v=CQ.view();if(W.player&&!v.cine&&v.mode==='explore')focus.set(W.player.x,W.player.g.position.y,W.player.z);else if(W.look)focus.copy(W.look);
  const half=v.cine?SH.half*1.6:SH.half,sc=s.shadow.camera;if(sc.right!==half){sc.left=-half;sc.right=half;sc.top=half;sc.bottom=-half;sc.updateProjectionMatrix();}
  s.target.position.copy(focus);s.position.set(focus.x+W.curSun.x*120,focus.y+W.curSun.y*120,focus.z+W.curSun.z*120);
  /* rim: from behind the subject relative to the camera, slightly above, cool sky colour */
  const dx=focus.x-cam.position.x,dz=focus.z-cam.position.z,dl=Math.hypot(dx,dz)||1;
  rim.position.set(focus.x+dx/dl*40,focus.y+30,focus.z+dz/dl*40);rim.target.position.copy(focus);
  rim.intensity=LIGHT.rim*Math.min(1,(W.sun.intensity/LIGHT.sun)/.5);
  tmpC.copy(W.hemi.color);rim.color.copy(tmpC);}
function lightsAfter(W){W.sun.color.copy(tmpA);W.hemi.color.copy(tmpB);W.sun.intensity/=LIGHT.sun;W.hemi.intensity/=LIGHT.hemi;}

/* ---------- 3. post: bloom on bright highlights only, gentle grade and vignette ---------- */
const GradeShader={uniforms:{tDiffuse:{value:null},uAsp:{value:1},uVig:{value:.22},uSat:{value:GR.sat},uCon:{value:GR.con},uLift:{value:new T.Vector3(.018,.012,.0)},uGain:{value:new T.Vector3(1.0,.99,.965)}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform sampler2D tDiffuse;uniform float uAsp,uVig,uSat,uCon;uniform vec3 uLift,uGain;varying vec2 vUv;'+
   'void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,uSat);c=(c-.5)*uCon+.5;'+
   'c=c*uGain+uLift*(1.-c);vec2 d=vUv-.5;d.x*=uAsp;float v=smoothstep(.95,.3,length(d));c*=mix(1.-uVig,1.,v);gl_FragColor=vec4(clamp(c,0.,1.),1.);}'};
let composer=null,bloom=null,grade=null;
function buildComposer(){if(QL==='low'||!T.EffectComposer||!T.RenderPass||!T.UnrealBloomPass||!T.ShaderPass)return;
  try{const sz=renderer.getDrawingBufferSize(new T.Vector2()),opt={minFilter:T.LinearFilter,magFilter:T.LinearFilter,format:T.RGBAFormat,encoding:T.sRGBEncoding};
    const rt=(renderer.capabilities.isWebGL2&&T.WebGLMultisampleRenderTarget)?new T.WebGLMultisampleRenderTarget(sz.x,sz.y,opt):new T.WebGLRenderTarget(sz.x,sz.y,opt);
    composer=new T.EffectComposer(renderer,rt);HD.renderPass=new T.RenderPass(new T.Scene(),camera);composer.addPass(HD.renderPass);
    bloom=new T.UnrealBloomPass(new T.Vector2(sz.x,sz.y),.2,.5,.93);composer.addPass(bloom);
    grade=new T.ShaderPass(GradeShader);composer.addPass(grade);grade.uniforms.uAsp.value=innerWidth/innerHeight;
  }catch(e){console.warn('HD: post-processing off',e);composer=null;}}
function resizePost(){if(!composer)return;const sz=renderer.getDrawingBufferSize(new T.Vector2());composer.setSize(sz.x,sz.y);grade.uniforms.uAsp.value=innerWidth/innerHeight;}
addEventListener('resize',resizePost);
HD.post=on=>{if(on===false){composer=null;return;}if(!composer){buildComposer();resizePost();}};

renderer.info.autoReset=false;
CQ.render=(scene,cam)=>{const W=CQ.W;renderer.info.reset();sweep(scene);lightsBefore(W,cam);
  if(composer){HD.renderPass.scene=scene;HD.renderPass.camera=cam;composer.render();}else renderer.render(scene,cam);
  lightsAfter(W);const ri=renderer.info.render;HD.stats={calls:ri.calls,triangles:ri.triangles};};

/* ---------- 4. sky: gradient, sun disc + halo, soft procedural clouds (replaces the sphere clouds) ---------- */
const SKY_FS='uniform vec3 top,hor,sunDir,sunCol,cloudCol;uniform float uT;varying vec3 vP;'+
 'float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
 'float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}'+
 'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}'+
 'void main(){vec3 n=normalize(vP);float h=max(n.y,0.);vec3 c=mix(hor,top,pow(h,.5));c=mix(c,hor+vec3(.035),exp(-h*16.)*.6);'+
 'float d=max(dot(n,normalize(sunDir)),0.);'+
 'if(n.y>0.){vec2 uv=n.xz/(n.y+.15)*1.15+vec2(uT*.004,uT*.0015);float cl=fbm(uv);float cov=smoothstep(.5,.74,cl)*smoothstep(.02,.22,n.y);'+
 'float sh=smoothstep(.45,.8,fbm(uv*1.6+vec2(.31,.17)));vec3 cc=mix(cloudCol*.8+hor*.12,cloudCol*1.04,sh);cc+=sunCol*pow(d,5.)*.25;c=mix(c,cc,cov*.9);}'+
 'c+=sunCol*(smoothstep(.9974,.9985,d)*1.25+pow(d,90.)*.32+pow(d,7.)*.13);gl_FragColor=vec4(c,1.);}';
function upgradeSky(W){if(!W.sky||!W.skyU)return;const U=W.skyU;U.cloudCol=U.cloudCol||{value:new T.Color('#ffffff')};U.uT=U.uT||{value:0};
  W.sky.material=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,uniforms:U,vertexShader:W.sky.material.vertexShader,fragmentShader:SKY_FS});W.sky.material.userData.hdLin=1;
  for(const c of W.clouds||[])c.visible=false;
  /* distant ridges: aerial perspective, the foot of each range fades into the horizon haze */
  W.scene.children.forEach(o=>{if(o.isMesh&&(o.material===W.ridgeMat||o.material===W.ridgeMat2)){const src=o.material,near=src===W.ridgeMat,u={col:{value:new T.Color()},hor:U.hor,top:U.top,tint:{value:near?new T.Vector3(.86,1.08,.84):new T.Vector3(.92,1.0,1.04)},haze:{value:near?.22:.42}};
    o.material=new T.ShaderMaterial({side:T.DoubleSide,depthWrite:true,uniforms:u,vertexShader:'varying float vY,vA;void main(){vY=position.y;vA=atan(position.z,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform vec3 col,hor,top,tint;uniform float haze;varying float vY,vA;void main(){float k=smoothstep(-3.,40.,vY);vec3 b=col*tint;b*=.95+.05*sin(vA*23.+vY*.05)*sin(vA*9.);vec3 c=mix(mix(hor,b,1.-haze),b,k);c=mix(c,hor,(1.-k)*haze*.6);gl_FragColor=vec4(c,1.);}'});
    o.material.userData.hdLin=1;W.tick.push(()=>u.col.value.copy(src.color));}});}

/* ---------- 5. water: fresnel sky reflection, sun glint + sparkle, animated shoreline foam ---------- */
const WATER_VS='attribute float dep;varying float vD;varying vec3 vW;void main(){vD=dep;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
const WATER_FS='uniform float uT,uDeep;uniform vec3 uS,uD,uF,uCam,top,hor,sunDir,sunCol;varying float vD;varying vec3 vW;'+
 'float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
 'float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}'+
 'vec2 wg(vec2 p,float t){vec2 g=vec2(0.);vec2 d=normalize(vec2(1.,.3));g+=d*cos(dot(d,p)*.35+t*1.1)*.032;d=normalize(vec2(-.4,1.));g+=d*cos(dot(d,p)*.62+t*1.5)*.037;'+
 'd=normalize(vec2(.7,-.8));g+=d*cos(dot(d,p)*1.3+t*2.1)*.039;d=normalize(vec2(-.9,-.2));g+=d*cos(dot(d,p)*2.7+t*2.9)*.032;'+
 'g+=vec2(vn(p*1.7+t*.4)-.5,vn(p*1.9-t*.35+7.)-.5)*.16;return g;}'+
 'void main(){if(vD<-.25)discard;float dist=length(vW.xz-uCam.xz);vec3 V=normalize(uCam-vW);'+
 'vec2 g=wg(vW.xz,uT)*(1.-smoothstep(40.,300.,dist)*.75);vec3 N=normalize(vec3(-g.x,1.,-g.y));'+
 'float fr=.03+.97*pow(1.-max(dot(N,V),0.),5.);vec3 R=reflect(-V,N);vec3 sk=mix(hor,top,pow(max(R.y,0.),.45));'+
 'float dk=smoothstep(0.,uDeep,vD);vec3 c=mix(uS,uD,dk);c=mix(c,sk,clamp(fr*.9,0.,.85));'+
 'vec3 L=normalize(sunDir);float rl=max(dot(R,L),0.);c+=sunCol*(pow(rl,260.)*2.4+pow(rl,28.)*.16);'+
 'float sp=vn(vW.xz*3.1+uT*vec2(.6,.4))*vn(vW.xz*2.3-uT*vec2(.3,.7));c+=sunCol*smoothstep(.6,.82,sp)*pow(rl,10.)*1.4*(1.-smoothstep(25.,120.,dist));'+
 'float fn=vn(vW.xz*2.2+uT*.25);float band=sin(vD*8.-uT*1.5+fn*3.)*.5+.5;'+
 'float foam=smoothstep(.24,.04,vD+(fn-.5)*.14)+(1.-smoothstep(0.,1.1,vD))*smoothstep(.62,.95,band)*smoothstep(.35,.65,fn)*.75;foam=clamp(foam,0.,1.)*(1.-smoothstep(60.,200.,dist)*.6);'+
 'c=mix(c,vec3(1.),foam*.85);c=mix(c,uF,smoothstep(120.,560.,dist));'+
 'float a=mix(.5,.95,smoothstep(0.,1.8,vD));a=max(a,fr*.85);a=max(a,foam*.95);gl_FragColor=vec4(c,a);}';
function upgradeWater(W){if(!W.waterU)return;const U=W.waterU,S=W.skyU||{};
  const u=Object.assign({},U,{top:S.top||{value:new T.Color('#2c7ad8')},hor:S.hor||{value:new T.Color('#c4e8ff')},sunDir:S.sunDir||{value:new T.Vector3(.4,.8,.4)},sunCol:S.sunCol||{value:new T.Color('#fff')}});
  const mat=new T.ShaderMaterial({transparent:true,uniforms:u,vertexShader:WATER_VS,fragmentShader:WATER_FS});mat.userData.hdLin=1;
  W.scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.uniforms===U)o.material=mat;});}
const _sky=CQ.sky,_water=CQ.water,_terrain=CQ.terrain;
CQ.sky=function(o){const r=_sky.apply(this,arguments);upgradeSky(CQ.W);rigWorld(CQ.W);return r;};
CQ.water=function(o){const r=_water.apply(this,arguments);upgradeWater(CQ.W);return r;};

/* ---------- 6. terrain: macro colour variation, slope earth, hollow shading, wet shore band, detail texture ---------- */
const detailTex=CQ.canvasTex(256,256,(g,w,h)=>{g.fillStyle='rgb(236,236,236)';g.fillRect(0,0,w,h);
  for(let i=0;i<2600;i++){const v=rr(190,255)|0;g.strokeStyle='rgba('+v+','+v+','+v+','+rr(.25,.6)+')';g.lineWidth=rr(.6,1.6);const x=rnd()*w,y=rnd()*h,a=rr(-.5,.5)-Math.PI/2,l=rr(2,6);g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}
  for(let i=0;i<60;i++){g.fillStyle='rgba(150,150,150,'+rr(.05,.14)+')';g.beginPath();g.ellipse(rnd()*w,rnd()*h,rr(6,20),rr(4,14),rnd()*3,0,7);g.fill();}},true);
detailTex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const n2=(x,z)=>Math.sin(x*.071+z*.033)*Math.cos(z*.058-x*.021)+.5*Math.sin(x*.19-z*.23)+.25*Math.sin(x*.47+z*.41);
CQ.terrain=function(o){const m=_terrain.apply(this,arguments);try{
  const g=m.geometry,p=g.attributes.position,col=g.attributes.color,nr=g.attributes.normal,c=new T.Color(),earth=new T.Color('#a08560'),dry=new T.Color('#c8b76a'),lush=new T.Color('#4f8f2f'),wet=new T.Color('#9c8358');
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);c.setRGB(col.getX(i),col.getY(i),col.getZ(i));
    const ny=nr.getY(i),H=o.H,cav=(H(x+3,z)+H(x-3,z)+H(x,z+3)+H(x,z-3))/4-y,mac=n2(x,z);
    if(y>.6){c.lerp(mac>0?dry:lush,Math.min(mac>0?.14:.3,Math.abs(mac)*.16));}
    c.lerp(earth,sm(.97,.82,ny)*.55);
    if(y>-.3&&y<.45)c.lerp(wet,sm(.45,.05,y)*.35);
    c.multiplyScalar(1-Math.max(-.08,Math.min(.16,cav*.12)));
    col.setXYZ(i,c.r,c.g,c.b);}
  col.needsUpdate=true;
  const uv=g.attributes.uv,S=(o.size||380)/5;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*S,uv.getY(i)*S);uv.needsUpdate=true;
  const mat=new T.MeshToonMaterial({vertexColors:true,gradientMap:RAMP_CLOTH,map:detailTex});mat.userData.hdLin=1;m.material=mat;
}catch(e){console.warn('HD terrain',e);}return m;};

/* ---------- 7. character materials: soft toon ramp + fresnel rim ---------- */
function withRim(m,col,k){m.onBeforeCompile=sh=>{sh.uniforms.uRim={value:lin(col).multiplyScalar(k)};
  sh.fragmentShader='uniform vec3 uRim;\n'+sh.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n float hdF=pow(1.-clamp(dot(normal,normalize(vViewPosition)),0.,1.),3.);totalEmissiveRadiance+=uRim*hdF;');};
  m.customProgramCacheKey=()=>'hdrim';return m;}
const MC={};
function mat(col,o,kind){const key=col+'|'+(kind||'c')+'|'+JSON.stringify(o||{});if(MC[key])return MC[key];
  const m=new T.MeshToonMaterial(Object.assign({color:lin(col),gradientMap:kind==='skin'?RAMP_SKIN:RAMP_CLOTH},o||{}));m.userData.hdLin=1;
  if(kind!=='flat')withRim(m,kind==='skin'?'#ffd9b8':'#fff1dc',kind==='skin'?.22:.3);return MC[key]=m;}
const basic=col=>{const m=new T.MeshBasicMaterial({color:lin(col)});m.toneMapped=false;m.userData.hdLin=1;return m;};
const OUT=new T.ShaderMaterial({side:T.BackSide,uniforms:{t:{value:.0065}},vertexShader:'uniform float t;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*t,1.);}',fragmentShader:'void main(){gl_FragColor=vec4(.2,.13,.1,1.);}'});OUT.userData.hdLin=1;

/* ---------- 8. hero cast: one sculpted chibi style shared by Jesus, Eli and Peter (same rig contract as makeChar) ---------- */
const DET={high:1,mid:.7,low:.55}[QL],sg=n=>Math.max(6,Math.round(n*DET));
function addM(geo,m,par,x,y,z,o){const me=new T.Mesh(geo,m);me.position.set(x||0,y||0,z||0);o=o||{};me.castShadow=o.cast!==false;me.receiveShadow=o.recv!==false;if(o.out){const s=new T.Mesh(geo,OUT);s.castShadow=false;me.add(s);}par.add(me);return me;}
function spline(pts,n){return new T.SplineCurve(pts.map(p=>new T.Vector2(p[0],p[1]))).getPoints(n);}
const ROBE=[[.30,.03],[.29,.14],[.265,.36],[.238,.58],[.212,.77],[.217,.9],[.228,1.02],[.222,1.1],[.19,1.165],[.12,1.215],[.072,1.235]];
const robeR=y=>{for(let i=0;i<ROBE.length-1;i++){const a=ROBE[i],b=ROBE[i+1];if(y<=b[1]){const t=Math.max(0,(y-a[1])/(b[1]-a[1]));return a[0]+(b[0]-a[0])*t;}}return ROBE[ROBE.length-1][0];};
const shadeHex=(h,k)=>'#'+new T.Color(h).multiplyScalar(k).getHexString();
function texMat(tex){tex.encoding=T.sRGBEncoding;const m=new T.MeshToonMaterial({color:0xffffff,map:tex,side:T.DoubleSide,gradientMap:RAMP_CLOTH});m.userData.hdLin=1;return withRim(m,'#fff1dc',.3);}
function robeTex(o){return CQ.canvasTex(512,256,(g,w,h)=>{g.fillStyle=o.tunic;g.fillRect(0,0,w,h);
  for(let i=0;i<500;i++){g.fillStyle='rgba('+(rnd()<.5?'0,0,0':'255,255,255')+','+rr(.03,.08)+')';g.fillRect(rnd()*w,rnd()*h,1,rr(6,30));}
  if(o.clavi)for(const u of[.055,1-.055]){g.fillStyle=o.clavi;g.fillRect(u*w-6,0,12,h);g.fillStyle='rgba(120,80,20,.35)';g.fillRect(u*w-6,0,2,h);g.fillRect(u*w+4,0,2,h);}
  const band=o.clavi||shadeHex(o.tunic,.72);g.fillStyle=band;g.fillRect(0,h-16,w,12);g.fillStyle=shadeHex(band,.75);for(let x=0;x<w;x+=14){g.beginPath();g.moveTo(x,h-10);g.lineTo(x+5,h-15);g.lineTo(x+10,h-10);g.lineTo(x+5,h-5);g.fill();}
  g.fillStyle=band;g.fillRect(0,0,w,7);});}
function mantleTex(col){const t=CQ.canvasTex(512,128,(g,w,h)=>{const c=new T.Color(col),gr=g.createLinearGradient(0,0,w,0);
  for(let i=0;i<=28;i++){const k=i/28,v=.86+.14*(.5+.5*Math.sin(k*Math.PI*2*14+Math.sin(k*40)*.8));gr.addColorStop(k,'#'+c.clone().multiplyScalar(v).getHexString());}
  g.fillStyle=gr;g.fillRect(0,0,w,h);const vg=g.createLinearGradient(0,0,0,h);vg.addColorStop(0,'rgba(255,255,255,.10)');vg.addColorStop(.6,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(10,20,60,.18)');g.fillStyle=vg;g.fillRect(0,0,w,h);
  g.fillStyle='#d9ae4c';g.fillRect(0,h-9,w,5);g.fillStyle='rgba(255,240,200,.5)';for(let x=3;x<w;x+=10)g.fillRect(x,h-8,3,3);});t.wrapS=T.RepeatWrapping;return t;}
const GEO={};
function heroGeo(o){const hemY=o.hem==null?.03:Math.min(.5,o.hem*.9+.02),key=[hemY,o.beard||0,o.hairLong?1:0,o.mantle?1:0].join('|');if(GEO[key])return GEO[key];const J={hemY};
  const prof=[[robeR(hemY)+.015,hemY]].concat(ROBE.filter(p=>p[1]>hemY+.02));
  const rg=new T.LatheGeometry(spline(prof,sg(40)),sg(56)),p=rg.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=Math.hypot(x,z)||1e-6,a=Math.atan2(x,z);
    const amp=.004+.022*sm(.85,.05,y),dr=amp*(Math.sin(a*9+.8*Math.sin(a*3))*.8+.35*Math.sin(a*17+1.3)),nr=r+dr;p.setXYZ(i,x/r*nr,y<hemY+.05?y+.012*Math.sin(a*9):y,z/r*nr);}
  rg.computeVertexNormals();J.robe=rg;
  if(o.mantle){const NT=sg(64),NV=14,mp=[],mi=[],muv=[],topE=[],botE=[];
    const wrapD=a=>{let d=a-Math.PI/2;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return Math.abs(d);};
    const topY=a=>1.17-.42*Math.pow(wrapD(a)/Math.PI,.85)-.035*Math.cos(a),botY=a=>topY(a)-(.2+.46*(.5-.5*Math.cos(a)))+.022*Math.sin(a*7);
    for(let j=0;j<=NV;j++)for(let i=0;i<=NT;i++){const a=i/NT*Math.PI*2,v=j/NV,y=topY(a)+(botY(a)-topY(a))*v;
      const r=robeR(y)+.026+.014*v+(.008+.022*v)*Math.sin(a*8+2.2*v)+.01*(1-v)*sm(1.05,1.17,y);mp.push(Math.sin(a)*r,y,Math.cos(a)*r);muv.push(i/NT,v);
      if(j===0)topE.push(new T.Vector3(Math.sin(a)*(r+.004),y+.004,Math.cos(a)*(r+.004)));if(j===NV)botE.push(new T.Vector3(Math.sin(a)*(r+.002),y,Math.cos(a)*(r+.002)));}
    for(let j=0;j<NV;j++)for(let i=0;i<NT;i++){const k=j*(NT+1)+i;mi.push(k,k+NT+1,k+1,k+1,k+NT+1,k+NT+2);}
    const mg=new T.BufferGeometry();mg.setAttribute('position',new T.Float32BufferAttribute(mp,3));mg.setAttribute('uv',new T.Float32BufferAttribute(muv,2));mg.setIndex(mi);mg.computeVertexNormals();J.mantle=mg;
    J.mantleTop=new T.TubeGeometry(new T.CatmullRomCurve3(topE,true),sg(96),.02,6,true);J.mantleHem=new T.TubeGeometry(new T.CatmullRomCurve3(botE,true),sg(96),.01,5,true);
    /* smooth drape over the left shoulder: a rolled fold from chest to back plus a soft full pad (no cut edges) */
    J.drape=new T.TubeGeometry(new T.CatmullRomCurve3([[.1,.98,.2],[.16,1.1,.16],[.2,1.19,.02],[.17,1.12,-.15],[.11,.98,-.22]].map(q=>new T.Vector3(q[0],q[1],q[2]))),sg(24),.05,10,false);
    J.pad=new T.SphereGeometry(.12,sg(20),12);}
  const long=hemY<.2;J.long=long;
  J.sleeve=long?new T.LatheGeometry(spline([[.07,0],[.074,-.12],[.082,-.28],[.1,-.42],[.118,-.5]],12),sg(20)):new T.LatheGeometry(spline([[.07,0],[.076,-.12],[.084,-.24],[.092,-.3]],8),sg(18));
  J.cuff=new T.TorusGeometry(long?.115:.09,.007,6,24);J.forearm=new T.CylinderGeometry(.038,.034,.26,10);
  J.hand=new T.SphereGeometry(.05,sg(16),12);J.thumb=new T.SphereGeometry(.021,10,8);
  J.foot=new T.SphereGeometry(.052,12,8);J.sole=new T.CylinderGeometry(.055,.058,.022,14);J.strap=new T.TorusGeometry(.046,.006,5,14,Math.PI);
  J.shin=new T.CylinderGeometry(.045,.04,.44,10);J.neck=new T.CylinderGeometry(.058,.066,.16,14);
  const hg=new T.SphereGeometry(.2,sg(36),sg(28)),hp=hg.attributes.position;
  for(let i=0;i<hp.count;i++){let x=hp.getX(i),y=hp.getY(i),z=hp.getZ(i);if(y<0){const t=Math.pow(-y/.2,1.4);x*=1-.2*t;z*=1-.06*t;y*=1.08;}else y*=1.04;
    if(z>0&&y<.04&&y>-.12)z+=.006*Math.cos((y+.04)/.16*Math.PI)*(1-Math.abs(x)/.2);hp.setXYZ(i,x,y,z*.96);}hg.computeVertexNormals();J.head=hg;
  J.ear=new T.SphereGeometry(.036,10,8);J.sclera=new T.SphereGeometry(.034,18,12);J.iris=new T.CircleGeometry(.0205,24);J.pupil=new T.CircleGeometry(.0105,18);J.hl=new T.CircleGeometry(.0062,12);J.hl2=new T.CircleGeometry(.0032,10);
  J.lid=new T.TorusGeometry(.034,.006,6,18,Math.PI*.92);J.nose=new T.SphereGeometry(.019,12,10);J.blush=new T.CircleGeometry(.03,16);
  J.smile=new T.TorusGeometry(.05,.0042,6,18,Math.PI*.34);
  const brow=s=>new T.TubeGeometry(new T.CatmullRomCurve3([[.028,.074,.186],[.064,.082,.177],[.1,.066,.157]].map(q=>new T.Vector3(q[0]*s,q[1],q[2]))),10,.0068,5,false);J.browL=brow(1);J.browR=brow(-1);
  if(o.beard){const stache=s=>new T.TubeGeometry(new T.CatmullRomCurve3([[.004,-.074,.192],[.035,-.081,.186],[.06,-.1,.166]].map(q=>new T.Vector3(q[0]*s,q[1],q[2]))),10,.0095,6,false);J.stL=stache(1);J.stR=stache(-1);
    const br=.214+.008*(o.beard-1),ext=.03+.035*(o.beard-1),bg=new T.SphereGeometry(br,sg(32),18,Math.PI*.02,Math.PI*.96,Math.PI*.5,Math.PI*.48),bp=bg.attributes.position;
    for(let i=0;i<bp.count;i++){let x=bp.getX(i),y=bp.getY(i),z=bp.getZ(i);const t=Math.pow(Math.max(0,-y)/br,1.4);x*=1-.18*t;z*=1-.03*t;y=y*1.1-ext*t*(1-Math.abs(x)/.15);
      const ax=Math.abs(x),yTop=-.13+.035*sm(.03,.09,ax)+.1*sm(.12,.21,ax);if(y>yTop){const r=Math.hypot(x,y,z),rh=Math.sqrt(Math.max(r*r-yTop*yTop,1e-6))/(Math.hypot(x,z)||1e-6);x*=rh;z*=rh;y=yTop;}
      bp.setXYZ(i,x,y,z*.97);}bg.computeVertexNormals();J.beard=bg;}
  /* hair: crown cap (no outline, so no dark band at the hairline) + soft parted fringe */
  const cap=new T.SphereGeometry(.218,sg(36),18,0,Math.PI*2,0,Math.PI*.5),cp=cap.attributes.position;
  for(let i=0;i<cp.count;i++){const x=cp.getX(i),y=cp.getY(i),z=cp.getZ(i),a=Math.atan2(x,z),r=Math.hypot(x,y,z),k=(r+.005*Math.sin(a*16+y*30)+.012*sm(0,.2,y)-.008*Math.exp(-x*x/.0006)*sm(.05,.2,y)*(z>0?1:.6)-.02*(1-sm(0,.07,y))*(z>0?1:.3))/r;cp.setXYZ(i,x*k,y*k*1.04,z*k*.97);}
  cap.computeVertexNormals();J.cap=cap;
  const lock=new T.SphereGeometry(.1,sg(18),10,0,Math.PI*2,0,Math.PI*.62),lp=lock.attributes.position;for(let i=0;i<lp.count;i++){const x=lp.getX(i),z=lp.getZ(i);lp.setY(i,lp.getY(i)+.012*Math.sin(x*60)*(1-Math.abs(z)*8));}lock.computeVertexNormals();J.lock=lock;
  if(o.hairLong){const NA=sg(48),NY=16,hp2=[],hi=[],a0=1.32,a1=Math.PI*2-1.32;
    for(let j=0;j<=NY;j++)for(let i=0;i<=NA;i++){const a=a0+(a1-a0)*i/NA,back=.5-.5*Math.cos(a),yb=-.33-.08*back+.025*Math.sin(a*9),y=.06+(yb-.06)*j/NY,v=j/NY;
      const r=.214+.035*v+.03*v*back+(.008+.014*v)*Math.sin(a*11+v*7)+.006*Math.sin(a*27+v*3);hp2.push(Math.sin(a)*r,y,Math.cos(a)*r*.98-.01*v);}
    for(let j=0;j<NY;j++)for(let i=0;i<NA;i++){const k=j*(NA+1)+i;hi.push(k,k+NA+1,k+1,k+1,k+NA+1,k+NA+2);}
    const cg=new T.BufferGeometry();cg.setAttribute('position',new T.Float32BufferAttribute(hp2,3));cg.setIndex(hi);cg.computeVertexNormals();J.curtain=cg;
    J.strands=[];for(const s of[-1,1])for(const k of[0,1]){const x0=.19+k*.012,z0=.045-k*.045;
      J.strands.push(new T.TubeGeometry(new T.CatmullRomCurve3([[x0-.05,.05,z0-.03],[x0+.02,.0,z0-.005],[x0+.02,-.1,z0-.015],[x0+.05,-.22,z0-.03],[x0+.04,-.32,z0-.05]].map(q=>new T.Vector3(q[0]*s,q[1],q[2]))),16,.015-k*.002,6,false));}}
  else J.back=new T.SphereGeometry(.224,sg(28),12,Math.PI,Math.PI,Math.PI*.28,Math.PI*.5);
  J.band=new T.TorusGeometry(.222,.016,6,sg(40));J.strapB=new T.TorusGeometry(.26,.016,5,sg(32));J.pouch=new T.SphereGeometry(.09,12,8);
  J.sash=new T.TorusGeometry(.226,.024,8,sg(48));J.tail=new T.BoxGeometry(.045,.24,.016);J.knot=new T.SphereGeometry(.035,10,8);
  return GEO[key]=J;}
/* merge every rig bone into a few draw calls: textured cloth, skin, one vertex-coloured material for small parts, outline */
const VCM=withRim(new T.MeshToonMaterial({vertexColors:true,gradientMap:RAMP_CLOTH,side:T.DoubleSide}),'#fff1dc',.22);VCM.userData.hdLin=1;
function mergeParts(list){let n=0;const parts=list.map(it=>{const g=it.geo.index?it.geo.toNonIndexed():it.geo.clone();g.applyMatrix4(it.m);n+=g.attributes.position.count;return{g,c:it.c};});
  const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2),col=new Float32Array(n*3);let o=0;
  for(const {g,c} of parts){const k=g.attributes.position.count;pos.set(g.attributes.position.array,o*3);nor.set(g.attributes.normal.array,o*3);if(g.attributes.uv)uv.set(g.attributes.uv.array,o*2);if(c)for(let i=0;i<k;i++){col[(o+i)*3]=c.r;col[(o+i)*3+1]=c.g;col[(o+i)*3+2]=c.b;}o+=k;g.dispose();}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('normal',new T.BufferAttribute(nor,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));const ca=new T.BufferAttribute(col,3);ca.hdLin=1;g.setAttribute('color',ca);g.computeBoundingSphere();return g;}
function mergeRig(P){const g=P.g,bones=[...P.legs,...P.arms,P.head];g.updateMatrixWorld(true);
  for(const root of [g,...bones]){const inv=new T.Matrix4().copy(root.matrixWorld).invert(),bk=new Map();
    const walk=o=>{for(const c of o.children){if(bones.includes(c))continue;if(c.isMesh){const vc=!!c.material.userData.vc,key=vc?'vc':c.material.uuid;if(!bk.has(key))bk.set(key,{mat:vc?VCM:c.material,list:[],cast:false});const b=bk.get(key);
        b.list.push({geo:c.geometry,m:new T.Matrix4().multiplyMatrices(inv,c.matrixWorld),c:vc?c.material.color:null});if(c.castShadow)b.cast=true;}walk(c);}};
    walk(root);root.children.slice().forEach(c=>{if(!bones.includes(c)&&!c.isLight)root.remove(c);});
    for(const b of bk.values()){const m=new T.Mesh(mergeParts(b.list),b.mat);m.castShadow=b.cast&&b.mat!==OUT;m.receiveShadow=b.mat!==OUT;root.add(m);}}}
function vc(col,kind){const m=mat(col,null,kind||'flat');m.userData.vc=1;return m;}
function makeHero(o){const W=CQ.W,J=heroGeo(o),g=new T.Group(),P={g,o,t:CQ.R()*6,move:0,bob:0,x:0,z:0,hd:true},Wd=o.W||1;
  const skinHex='#'+new T.Color(o.skin).lerp(new T.Color('#fbe0c4'),.4).getHexString();
  const robeM=texMat(robeTex(o)),mantleM=o.mantle?texMat(mantleTex(o.mantle)):null,skin=mat(skinHex,null,'skin'),gold=vc(o.clavi||o.sash||'#e0b24c'),sashM=vc(o.sash||'#e0b24c'),
    hairM=vc(o.hair||'#3a2418'),beardM=vc(shadeHex(o.hair||'#3a2418',1.35)),leather=vc('#7a4f2c'),white=vc('#fbf8f2'),iris=vc('#6b4325'),dark=vc('#1c120c'),hl=vc('#ffffff'),lip=vc('#b0604c'),lidM=vc('#3a2216');
  const blush=new T.MeshBasicMaterial({color:lin('#f3a08c'),transparent:true,opacity:.28,depthWrite:false});blush.toneMapped=false;blush.userData.hdLin=1;
  const B=new T.Group();B.scale.set(1.15*Wd,1,.82);g.add(B);
  addM(J.robe,robeM,B,0,0,0,{out:true});
  if(o.sash){addM(J.sash,sashM,B,0,.69,0).rotation.x=Math.PI/2;if(!o.mantle)addM(J.knot,sashM,B,.113,.69,.207);if(!o.mantle)for(const k of[0,1]){const t=addM(J.tail,sashM,B,.108+k*.03,.56,.212-k*.012);t.rotation.z=.08-k*.14;t.rotation.x=-.1;}}
  if(o.mantle){addM(J.mantle,mantleM,B);addM(J.mantleTop,mantleM,B);addM(J.mantleHem,gold,B,0,0,0,{cast:false});
    addM(J.drape,mantleM,g);addM(J.pad,mantleM,g,.165*Wd,1.13,0).scale.set(.95,.45,1.05);}
  if(o.bag){const st=addM(J.strapB,leather,B,0,.88,0);st.rotation.set(Math.PI/2,.62,0);st.scale.set(1,1,1.5);addM(J.pouch,leather,B,-.25,.6,.06).scale.set(1,1.1,.6);}
  P.legs=[-1,1].map(s=>{const l=new T.Group();l.position.set(s*.085,.5,0);g.add(l);addM(J.shin,skin,l,0,-.24,0,{out:!J.long});
    const ft=addM(J.foot,skin,l,0,-.455,.05,{out:true});ft.scale.set(.82,.55,1.75);addM(J.sole,leather,l,0,-.49,.05).scale.set(.95,1,1.9);
    for(const zz of[0,.08]){const st=addM(J.strap,leather,l,0,-.468,.05+zz,{cast:false});st.rotation.y=Math.PI/2;st.scale.set(1,.75,1);}return l;});
  P.arms=[-1,1].map(s=>{const a=new T.Group();a.position.set(s*.245*Wd,1.13,0);a.rotation.z=s*.12;g.add(a);
    addM(J.sleeve,(s>0&&mantleM)?mantleM:robeM,a,0,.02,0).scale.set(1,1,.92);
    addM(J.cuff,(s>0&&o.mantle)?vc(shadeHex(o.mantle,.8)):gold,a,0,J.long?-.48:-.28,0).rotation.x=Math.PI/2;
    if(!J.long)addM(J.forearm,skin,a,0,-.4,0,{out:true});
    /* mitten hand with a clear thumb */
    const hand=new T.Group();hand.position.set(0,-.565,.01);a.add(hand);
    addM(J.hand,skin,hand,0,0,0,{out:true}).scale.set(.85,1.05,.62);
    const th=addM(J.thumb,skin,hand,-s*.036,.012,.02,{out:true});th.scale.set(.85,1.7,.85);th.rotation.z=s*.55;th.rotation.x=-.3;
    return a;});
  addM(J.neck,skin,g,0,1.25,0);
  const hd=new T.Group();hd.position.set(0,1.445,0);hd.scale.setScalar(o.head||1);g.add(hd);P.head=hd;
  addM(J.head,skin,hd,0,0,0,{out:true});
  for(const s of[-1,1]){addM(J.ear,skin,hd,s*.188,-.005,-.012).scale.set(.45,1,.7);
    const e=new T.Group();e.position.set(s*.068,.012,.172);e.rotation.y=s*.3;hd.add(e);
    addM(J.sclera,white,e,0,0,0,{cast:false}).scale.set(1.08,.76,.5);
    addM(J.iris,iris,e,0,-.003,.0176,{cast:false});addM(J.pupil,dark,e,0,-.003,.0181,{cast:false});
    addM(J.hl,hl,e,.0065,.006,.0186,{cast:false});addM(J.hl2,hl,e,-.0075,-.0095,.0186,{cast:false});
    const lid=addM(J.lid,lidM,e,0,-.004,.011,{cast:false});lid.scale.set(1.1,.92,1);lid.rotation.z=Math.PI*.04;
    addM(J.blush,blush,hd,s*.105,-.032,.163,{cast:false,recv:false}).rotation.y=s*.6;
    const lk=addM(J.lock,hairM,hd,s*.06,.128,.11,{cast:false});lk.scale.set(1.05,.24,.36);lk.rotation.set(-.55,0,-s*.42);}
  addM(J.browL,hairM,hd,0,.004,0,{cast:false});addM(J.browR,hairM,hd,0,.004,0,{cast:false});
  addM(J.nose,skin,hd,0,-.034,.19,{cast:false}).scale.set(.9,.95,.85);
  const sm1=addM(J.smile,lip,hd,0,(o.beard?-.106:-.098)+.05*.8,.172,{cast:false});sm1.rotation.z=Math.PI*1.5-Math.PI*.17;sm1.scale.set(o.beard?1:1.1,.8,1);sm1.rotation.x=-.12;
  if(o.beard){addM(J.beard,beardM,hd,0,0,0,{out:true});addM(J.stL,beardM,hd);addM(J.stR,beardM,hd);}
  addM(J.cap,hairM,hd,0,0,-.008).rotation.x=-.62;
  if(J.curtain){addM(J.curtain,hairM,hd);J.strands.forEach(x=>addM(x,hairM,hd));}else addM(J.back,hairM,hd,0,0,-.004);
  if(o.band){const b=addM(J.band,vc(o.band),hd,0,.075,-.01);b.rotation.x=Math.PI/2-.32;}
  if(o.glow){const L=new T.PointLight(o.glow,1.5,30,1.5);L.position.y=1.3;g.add(L);P.light=L;}
  mergeRig(P);g.scale.setScalar(o.S||1);W.scene.add(g);W.chars.push(P);return P;}
HD.makeHero=makeHero;HD.makeJesus=makeHero;
const _make=CQ.makeChar;
const HERO=()=>CQ.CAST?[CQ.CAST.jesus,CQ.CAST.eli,CQ.CAST.peter]:[];
CQ.makeChar=function(o){if(o&&!o.model&&(o.hdStyle||HERO().includes(o)))return makeHero(o);return _make.apply(this,arguments);};

/* ---------- 8b. crowd: instanced chibi people (head, hair or veil, robed body with arms, hands, face) ---------- */
let CR=null;
function mergeSimple(items){return mergeParts(items.map(([geo,x,y,z,sx,sy,sz,rx,rz,c])=>{const o=new T.Object3D();o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx||0,0,rz||0);o.updateMatrix();return{geo,m:o.matrix,c:c?lin(c):new T.Color(1,1,1)};}));}
function crowdGeo(){if(CR)return CR;const s=10;
  const stand=new T.LatheGeometry(spline([[.29,0],[.27,.3],[.22,.6],[.19,.78],[.12,.9],[.06,.95]],8),s),sit=new T.LatheGeometry(spline([[.31,0],[.29,.16],[.23,.42],[.17,.56],[.1,.63],[.05,.66]],7),s);
  const arm=new T.CylinderGeometry(.058,.07,.42,6),ball=new T.SphereGeometry(1,6,4),head=new T.SphereGeometry(.24,QL==='high'?12:10,QL==='high'?8:7);
  CR={standB:mergeSimple([[stand,0,0,0,1,1,1],[arm,.23,.66,0,1,1,1,0,.22],[arm,-.23,.66,0,1,1,1,0,-.22]]),
    sitB:mergeSimple([[sit,0,0,0,1,1,1],[ball,0,.14,.2,.27,.13,.22],[arm,.19,.42,.12,1,1,1,-.9,.1],[arm,-.19,.42,.12,1,1,1,-.9,-.1]]),
    standH:mergeSimple([[ball,.27,.44,0,.06,.06,.06],[ball,-.27,.44,0,.06,.06,.06]]),sitH:mergeSimple([[ball,.15,.32,.3,.06,.06,.06],[ball,-.15,.32,.3,.06,.06,.06]]),
    head,cap:new T.SphereGeometry(.255,14,7,0,Math.PI*2,0,Math.PI*.5),veil:mergeSimple([[new T.SphereGeometry(.275,14,6,0,Math.PI*2,0,Math.PI*.42),0,0,0,1,1,1],[new T.SphereGeometry(.28,14,8,Math.PI/2+.75,Math.PI*2-1.5,Math.PI*.3,Math.PI*.58),0,0,0,1,1.15,1]]),
    face:mergeSimple([[ball,.08,.0,.212,.03,.042,.014,0,0,'#2a1a12'],[ball,-.08,.0,.212,.03,.042,.014,0,0,'#2a1a12'],[ball,.087,.014,.224,.009,.009,.006,0,0,'#ffffff'],[ball,-.073,.014,.224,.009,.009,.006,0,0,'#ffffff'],[ball,0,-.085,.214,.03,.008,.008,0,0,'#9a4a3c']])};
  return CR;}
const _crowd=CQ.crowd;
CQ.crowd=function(pts,o){o=o||{};const W=CQ.W,G=CQ.G,n=pts.length,C=crowdGeo(),sit=!!o.sit;
  const tun=['#b08a5e','#c9c0a8','#a5526a','#5f8f7a','#8d7656','#dcae4f','#7d8a5c','#c97b5a','#6f86a8','#e6d3ab'],sk=['#c99468','#b9804f','#c08a5e'],hr=['#2e2018','#241a13','#4a3a2c','#e6d3ab','#ebdfc4'];
  const pk=a=>a[Math.floor(CQ.R()*a.length)];
  const toonI=(kind)=>{const m=new T.MeshToonMaterial({gradientMap:kind==='skin'?RAMP_SKIN:RAMP_CLOTH,vertexColors:false});m.userData.hdLin=1;return m;};
  const body=new T.InstancedMesh(sit?C.sitB:C.standB,toonI(),n),hands=new T.InstancedMesh(sit?C.sitH:C.standH,toonI('skin'),n),head=new T.InstancedMesh(C.head,toonI('skin'),n);
  const faceM=new T.MeshBasicMaterial({vertexColors:true});faceM.toneMapped=false;faceM.userData.hdLin=1;const face=new T.InstancedMesh(C.face,faceM,n);
  const veils=[],caps=[],d=new T.Object3D(),col=new T.Color(),hy=sit?.86:1.16;
  pts.forEach((p,i)=>{const s=(sit?1:1)*CQ.rr(.9,1.06),y=G(p[0],p[1]),ry=p[2]==null?CQ.R()*6.28:p[2],t=pk(tun),k=pk(sk),h=pk(hr);
    d.position.set(p[0],y,p[1]);d.rotation.set(0,ry,0);d.scale.setScalar(s);d.updateMatrix();body.setMatrixAt(i,d.matrix);hands.setMatrixAt(i,d.matrix);
    body.setColorAt(i,col.set(t).convertSRGBToLinear());const skc=new T.Color(k).lerp(new T.Color('#fbe0c4'),.4).convertSRGBToLinear();hands.setColorAt(i,skc);
    d.position.y=y+hy*s;d.rotation.set(0,ry,0);d.updateMatrix();head.setMatrixAt(i,d.matrix);head.setColorAt(i,skc);face.setMatrixAt(i,d.matrix);
    const light=h==='#e6d3ab'||h==='#ebdfc4';d.rotation.set(light?-.25:-.5,ry,0,'YXZ');d.updateMatrix();(light?veils:caps).push([d.matrix.clone(),light?h:h]);
    if(!o.noCol)W.circles.push({x:p[0],z:p[1],r:.4});});
  const hairMesh=(geo,list)=>{const im=new T.InstancedMesh(geo,toonI(),Math.max(1,list.length));list.forEach((e,i)=>{im.setMatrixAt(i,e[0]);im.setColorAt(i,col.set(e[1]).convertSRGBToLinear());});im.count=list.length;return im;};
  [body,hands,head,face,hairMesh(C.cap,caps),hairMesh(C.veil,veils)].forEach((m,i)=>{if(m.instanceColor)m.instanceColor.hdLin=1;m.castShadow=i===0||i===2;m.receiveShadow=i!==3;W.scene.add(m);});
  face.castShadow=false;return body;};

/* ---------- 8c. boat: curved planked hull, gunwales, thwarts, mast, yard and bellied sail ---------- */
const _boat=CQ.boat;
CQ.boat=function(x,z,rot,o){const g=_boat.apply(this,arguments);o=o||{};g.children.forEach(c=>c.visible=false);
  const NU=sg(28),NV=12,pos=[],cols=[],idx=[],L=4.15,Wh=1.3,D=.78,plank=[new T.Color('#8a5a34'),new T.Color('#7a4c2b')],seam=new T.Color('#4a2e1a'),c=new T.Color();
  for(let i=0;i<=NU;i++)for(let j=0;j<=NV;j++){const u=i/NU*2-1,th=(j/NV-.5)*Math.PI,w=Wh*Math.pow(Math.max(0,1-u*u),.55),d=D*(1-.5*Math.pow(Math.abs(u),4)),h=.82+.38*Math.pow(Math.abs(u),3.5);
    pos.push(u*L,h-d*Math.cos(th),w*Math.sin(th));const band=Math.floor(Math.abs(j/NV-.5)*10);c.copy(plank[band%2]);if(Math.abs(j/NV-.5)*10-band<.12)c.copy(seam);cols.push(c.r,c.g,c.b);}
  for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const k=i*(NV+1)+j;idx.push(k,k+1,k+NV+1,k+1,k+NV+2,k+NV+1);}
  const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(pos,3));hg.setAttribute('color',new T.Float32BufferAttribute(cols,3));hg.setIndex(idx);hg.computeVertexNormals();
  const hm=new T.MeshToonMaterial({vertexColors:true,side:T.DoubleSide,gradientMap:RAMP_CLOTH});addM(hg,hm,g);
  const wood=mat('#6b4426'),rail=[];for(const sd of[-1,1]){const pts=[];for(let i=0;i<=16;i++){const u=i/16*2-1;pts.push(new T.Vector3(u*L,.82+.38*Math.pow(Math.abs(u),3.5)+.02,sd*Wh*Math.pow(Math.max(0,1-u*u),.55)));}addM(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.05,6,false),wood,g);}
  addM(new T.BoxGeometry(6.2,.05,1.3),mat('#9a6a40'),g,0,.55,0);
  for(const bx of[-2.2,-.6,1.2,2.6]){const ww=2*Wh*Math.pow(Math.max(0,1-(bx/L)**2),.55)*.95;addM(new T.BoxGeometry(.32,.07,ww),wood,g,bx,.78,0);}
  addM(new T.CylinderGeometry(.06,.09,5.4,8),wood,g,.5,3.1,0);const yd=addM(new T.CylinderGeometry(.045,.045,4.2,6),wood,g,.5,o.sail?5.2:2.25,0);yd.rotation.x=Math.PI/2;
  if(o.sail){const sgm=new T.PlaneGeometry(3.8,3.6,10,8),p=sgm.attributes.position;for(let i=0;i<p.count;i++){const uu=p.getX(i)/1.9,v=p.getY(i)/1.8;p.setZ(i,(1-uu*uu)*(1-v*v*.5)*.8);}sgm.computeVertexNormals();addM(sgm,CQ.M.sail,g,.5,3.35,0).rotation.y=Math.PI/2;}
  else{const f=addM(new T.CylinderGeometry(.17,.17,3.5,10),mat('#efe3c6'),g,.5,2.06,0);f.rotation.x=Math.PI/2;}
  for(const sd of[-1,1])addM(new T.CylinderGeometry(.035,.035,2.6,5),wood,g,-2.8,.95,sd*.9).rotation.set(sd*1.2,0,.25);
  return g;};

/* ---------- 9. showcase environment for chapter 5 (Sea of Galilee): grass, anemones, shore rocks, reeds ---------- */
function windMat(base){const m=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide,color:base||'#ffffff'});m.userData.hdLin=1;
  m.onBeforeCompile=sh=>{sh.uniforms.uT=HD.windT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>',
   '#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*.35+instanceMatrix[3].z*.27;\n#else\nfloat ph=0.;\n#endif\nfloat hh=max(position.y,0.);transformed.x+=sin(uT*1.6+ph)*.06*hh*hh*4.;transformed.z+=cos(uT*1.2+ph*1.3)*.04*hh*hh*4.;');};
  m.customProgramCacheKey=()=>'hdwind';return m;}
HD.windT={value:0};
function tuftGeo(blades,h,w,cBase,cTip,segs){const SG=segs||3;const pos=[],col=[],nor=[],idx=[];const cb=new T.Color(cBase),ct=new T.Color(cTip);
  for(let b=0;b<blades;b++){const a=b/blades*Math.PI*2+rnd()*.6,lean=rr(.15,.45),hh=h*rr(.7,1.15),k0=pos.length/3;
    for(let s=0;s<=SG;s++){const t=s/SG,ww=w*(1-t*.92),y=hh*t,off=lean*t*t*hh;const cx=Math.sin(a)*off,cz=Math.cos(a)*off,px=Math.cos(a)*ww,pz=-Math.sin(a)*ww;
      pos.push(cx-px,y,cz-pz,cx+px,y,cz+pz);const c=cb.clone().lerp(ct,t);col.push(c.r,c.g,c.b,c.r,c.g,c.b);nor.push(0,1,0,0,1,0);}
    for(let s=0;s<SG;s++){const k=k0+s*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(nor,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);return g;}
function flowerGeo(petal,center,r){const pos=[],col=[],nor=[],idx=[];const cp=new T.Color(petal),cc=new T.Color(center),st=new T.Color('#4d7d2a'),sh=.24;
  pos.push(0,sh+.01,0);col.push(cc.r,cc.g,cc.b);nor.push(0,1,0);
  for(let i=0;i<=20;i++){const a=i/20*Math.PI*2,rr2=r*(.62+.38*Math.abs(Math.cos(a*2.5)));pos.push(Math.cos(a)*rr2,sh+(i%2?.01:-.005),Math.sin(a)*rr2);const c=cp.clone().lerp(cc,.08*(i%2));col.push(c.r,c.g,c.b);nor.push(0,1,0);}
  for(let i=1;i<=20;i++)idx.push(0,i+1,i);
  const k=pos.length/3;pos.push(-.008,0,0,.008,0,0,0,sh,0);for(let i=0;i<3;i++){col.push(st.r,st.g,st.b);nor.push(0,0,1);}idx.push(k,k+1,k+2);
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(nor,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);return g;}
function inst(geo,m,pts,sh){const im=new T.InstancedMesh(geo,m,pts.length),d=new T.Object3D(),c=new T.Color();pts.forEach((p,i)=>{d.position.set(p[0],p[1],p[2]);d.rotation.set(p[5]||0,p[4]||rnd()*6.28,0);d.scale.setScalar(p[3]||1);d.updateMatrix();im.setMatrixAt(i,d.matrix);if(p[6]){im.setColorAt(i,c.set(p[6]));}});
  im.castShadow=!!sh;im.receiveShadow=true;CQ.W.scene.add(im);return im;}
function galileeKit(W){const H=W.H,N={high:1,mid:.55,low:.3}[QL],cx=-92,cz=-86;
  /* retire the engine's cone grass and ball flowers in favour of authored tufts and anemones */
  W.scene.children.forEach(o=>{if(o.isInstancedMesh){const p=o.geometry.parameters||{};if((o.geometry.type==='ConeGeometry'&&Math.abs(p.radius-.09)<1e-6)||(o.geometry.type==='SphereGeometry'&&(Math.abs(p.radius-.11)<1e-6||Math.abs(p.radius-.09)<1e-6)))o.visible=false;}});
  const land=(x,z)=>H(x,z)>.45;const pick=(n,fn)=>{const a=[];let t=0;while(a.length<n&&t<n*20){t++;const r=fn();if(r)a.push(r);}return a;};
  const near=(R0,R1)=>()=>{const a=rnd()*6.283,r=R0+Math.sqrt(rnd())*(R1-R0),x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(!land(x,z))return 0;return[x,H(x,z)-.02,z];};
  const shade=['#ffffff','#f1f7e4','#e6f0cf','#fff7dc','#dfeccb'];
  /* grass LOD: dense 4-blade tufts near the action, sparse 2-blade tufts further out */
  const GN={high:[8000,3000],mid:[2500,1000],low:[1600,500]}[QL],gm=windMat(),tuft=q=>{if(!q)return 0;q.push(rr(.6,1.15),rnd()*6.28,0,shade[(rnd()*shade.length)|0]);return q;};
  HD.grass=inst(tuftGeo(4,.26,.022,'#4e8a2a','#c2db6c',2),gm,pick(GN[0],()=>tuft(near(0,45)())),false);
  HD.grassFar=inst(tuftGeo(2,.3,.03,'#4e8a2a','#c2db6c',2),gm,pick(GN[1],()=>tuft(near(40,130)())),false);
  const fl=[['#e8392f','#2a1a1a',.075,1300],['#f6d23c','#d08a18',.06,650],['#ffffff','#f2c230',.06,500],['#b56be0','#ffe27a',.055,300]];
  HD.flowers=fl.map(f=>inst(flowerGeo(f[0],f[1],f[2]),windMat(),pick(Math.round(f[3]*N),()=>{const q=rnd()<.55?near(3,40)():near(30,95)();if(!q)return 0;q.push(rr(.8,1.3));return q;}),false));
  /* shoreline: weathered basalt rocks and reed clumps where the hill meets the water */
  const rock=new T.DodecahedronGeometry(1,QL==='high'?1:0),rp=rock.attributes.position;for(let i=0;i<rp.count;i++){const x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i),k=1+.18*Math.sin(x*5+z*3)+.12*Math.sin(y*7+x*2);rp.setXYZ(i,x*k,y*k*.62,z*k);}rock.computeVertexNormals();
  const sx=z=>25+6*Math.sin(z*.04);
  HD.rocks=inst(rock,mat('#8b8378'),pick(Math.round(260*Math.max(N,.5)),()=>{const z=rr(-170,170),x=sx(z)+rr(-6,2.5);return[x,H(x,z)-.12,z,rr(.18,.75),rnd()*6.28,0];}),QL==='high');
  const reed=tuftGeo(7,1.25,.022,'#4f6f2a','#c8c27a');
  HD.reeds=inst(reed,windMat(),pick(Math.round(420*Math.max(N,.5)),()=>{const z=rr(-170,170),x=sx(z)+rr(-4.5,.4);const y=H(x,z);if(y<-.35||y>.9)return 0;return[x,y-.05,z,rr(.7,1.3),rnd()*6.28,0,shade[(rnd()*shade.length)|0]];}),false);
  /* contact shadow blob under the hero so he never floats, even outside the shadow frustum */
  W.tick.push((dt,tt)=>{HD.windT.value=tt;});}

/* ---------- 10. cinematic camera: lower, closer, smoothed third-person with look-ahead; authored establishing shot ---------- */
const cs={pos:new T.Vector3(),look:new T.Vector3(),ahead:new T.Vector3(),init:false,lastCine:null,t0:0,base:null};
const tv=new T.Vector3(),tl=new T.Vector3();
HD.cam={fov:44,fovPortrait:60,pitchK:.5,distK:.8,lookH:1.3,side:.32,ahead:1.6};
function camFrame(dt,tt){const W=CQ.W,v=CQ.view(),pl=W.player,C=HD.cam,asp=camera.aspect;
  const fov=asp<1?C.fovPortrait:C.fov;if(Math.abs(camera.fov-fov)>.01){camera.fov=fov;camera.updateProjectionMatrix();}
  if(v.cine){/* authored shots: slow push-in on every cinematic framing */
    if(v.cine!==cs.lastCine){cs.lastCine=v.cine;cs.t0=tt;cs.base=v.cine.pos.clone();}
    const k=Math.min(1,(tt-cs.t0)/9),e=k*k*(3-2*k);v.cine.pos.copy(cs.base).lerp(v.cine.look,.06*e);cs.init=false;return;}
  cs.lastCine=null;if(v.mode!=='explore'||!pl)return;
  const yaw=v.yaw,pitch=Math.max(.03,v.pitch*C.pitchK),dist=v.dist*(asp<1?1.0:C.distK);
  tv.set(Math.sin(pl.g.rotation.y),0,Math.cos(pl.g.rotation.y)).multiplyScalar(C.ahead*pl.move);cs.ahead.lerp(tv,1-Math.exp(-dt*2.5));
  tl.set(pl.x,pl.g.position.y+C.lookH,pl.z).add(cs.ahead);
  const cp=Math.cos(pitch),sx=Math.cos(yaw)*C.side*(asp<1?0:1),sz=-Math.sin(yaw)*C.side*(asp<1?0:1);
  tv.set(tl.x+Math.sin(yaw)*cp*dist+sx,tl.y+Math.sin(pitch)*dist+.15,tl.z+Math.cos(yaw)*cp*dist+sz);
  tv.y=Math.max(tv.y,Math.max(CQ.G(tv.x,tv.z),0)+.55);
  if(!cs.init||cs.pos.distanceTo(tv)>12){cs.pos.copy(tv);cs.look.copy(tl);cs.init=true;}else{cs.pos.lerp(tv,1-Math.exp(-dt*6));cs.look.lerp(tl,1-Math.exp(-dt*9));}
  camera.position.copy(cs.pos);camera.lookAt(cs.look);if(W.sky)W.sky.position.copy(camera.position);if(W.stars)W.stars.position.copy(camera.position);if(W.waterU)W.waterU.uCam.value.copy(camera.position);}
CQ.hooks.frame.push(camFrame);
CQ.hooks.frame.push((dt,tt)=>{const W=CQ.W;if(W&&W.skyU&&W.skyU.uT){W.skyU.uT.value=tt;if(W.cloudMat)W.skyU.cloudCol.value.copy(W.cloudMat.color);}});
/* authored establishing shots (pos xyz, look xyz) used for the chapter's first story panel */
HD.SHOTS={ch5:{establish:[-103,20.15,-88.84,-93.77,19.38,-92.67],jesusYaw:.25}};
/* during the chapter-5 intro Jesus turns slightly toward the establishing camera so his face reads against the lake */
CQ.hooks.frame.push(()=>{const W=CQ.W,v=CQ.view();if(!W||!W.chars||v.mode!=='story'||!CQ.CAST)return;const J=W.chars.find(P=>P.o===CQ.CAST.jesus);if(J&&HD.curCh==='ch5'&&!J.dest)J.g.rotation.y=HD.SHOTS.ch5.jesusYaw;});
CQ.hooks.load.push(ch=>{const W=CQ.W;seed=9173;HD.curCh=ch&&ch.id;
  if(ch&&ch.id==='ch5'){try{galileeKit(W);}catch(e){console.warn('HD ch5 kit',e);}if(ch.intro&&ch.intro[0]&&!ch.intro[0].hdCam){ch.intro[0].cam=HD.SHOTS.ch5.establish.slice();ch.intro[0].hdCam=1;}}
  if(!composer&&QL!=='low'){buildComposer();resizePost();}});
HD.onShot=()=>{};
})();
