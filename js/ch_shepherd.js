/* Chapter: the good shepherd (John 10:1-18, 27-28). The passage gives no time of day, so it is set in daylight.
   Jesus teaches a seated crowd on a green hill; the player then helps a shepherd (as the lost-sheep scene in ch6):
   the sheep follow only their shepherd's voice, the flock is led to pasture, and a cartoon wolf is chased away. */
'use strict';
CQ.chapters.push({id:'shepherd',no:14,title:'Người chăn hiền lành',sub:'Chuồng chiên trên đồi xanh · ban ngày',
 intro:[
  {t:'Trên đồi xanh',x:'Chúa Giê-su ngồi trên một ngọn đồi xanh và dạy dỗ dân chúng. Gần đó có một chuồng chiên xây bằng đá, chỉ có một cái cửa.',ref:'Theo Giăng 10:1-2',cam:[-4,13,24,-16,2,8]},
  {t:'Bầy chiên',x:'Ban đêm, chiên ngủ yên trong chuồng. Sáng ra, người chăn đến cửa chuồng để dẫn chiên đi ăn cỏ.',ref:'Theo Giăng 10:2-3',cam:[8,11,6,-4,1.5,-8]}],
 outro:'Chúa Giê-su là người chăn hiền lành. Ngài biết tên từng người, và Ngài đã phó sự sống mình vì chúng ta.',outroRef:'Theo Giăng 10:11, 10:27',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.startYaw=1.57;W.tod='day';W.menuCam={x:4,y:3,z:0,r:44,h:16};
  const sx=z=>36+3*Math.sin(z*.1);
  const H=(x,z)=>{const r=Math.hypot(x-6,z),d=Math.abs(x-sx(z));return 2+.8*noise(x*.5,z*.5)+sm(36,90,r)*12*(.6+.4*noise(x*.3,z*.3))-3.4*Math.exp(-d*d/5);};
  const g1=C('#7fbf45'),g2=C('#9fd055'),lush=C('#58b03a'),mud=C('#9a8a62');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(lush,sm(18,26,x)*sm(44,38,x)*.8);c.lerp(mud,sm(.6,-.3,y));}});
  CQ.sky({fogNear:55,fogFar:200});CQ.water({deep:1.4});
  CQ.scatter(2600,new T.ConeGeometry(.09,.32,4),toon('#5f9e34'),()=>{const x=rr(-90,100),z=rr(-90,90);if(H(x,z)<.4)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(500,new T.SphereGeometry(.1,6,5),toon('#ffffff'),()=>{const x=rr(-30,45),z=rr(-30,30);return[x,H(x,z)+.18,z,rr(.8,1.3)];});
  CQ.scatter(300,new T.SphereGeometry(.1,6,5),toon('#f4d23c'),()=>{const x=rr(16,34),z=rr(-12,14);return[x,H(x,z)+.18,z,rr(.8,1.3)];});
  [[-30,-10],[-26,18],[12,-20],[44,10],[46,-14],[-8,24]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.4)));
  [[-12,-14],[4,-15],[33,12]].forEach(p=>CQ.bush(p[0],p[1],1.2));

  /* the stone sheepfold: a ring of low wall with one gate facing south */
  const FX=-4,FZ=-8,FR=5.5;
  for(let a=0;a<6.28;a+=.34){if(Math.abs(a-1.571)<.4)continue;CQ.wallBox(FX+Math.cos(a)*FR,FZ+Math.sin(a)*FR,1.95,1,.6,-(a+1.571),M.basalt);}
  for(const s of[-1,1])mesh(new T.CylinderGeometry(.3,.34,1.6,8),M.basalt,FX+s*1.25,H(FX,FZ+FR)+.6,FZ+FR);
  const herd=[];for(let i=0;i<16;i++){const a=R()*6.28,r=Math.sqrt(R())*3.4,s=CQ.sheep(FX+Math.cos(a)*r,FZ+Math.sin(a)*r);s.hx=s.x-FX;s.hz=s.z-FZ;s.ox=rr(-2.6,2.6);s.oz=rr(-2.2,2.2);herd.push(s);}
  let mode='in',shx=0,shz=0,hc={x:0,z:0};
  W.tick.push(dt=>{const p=W.player;let cx=0,cz=0;herd.forEach(s=>{cx+=s.g.position.x;cz+=s.g.position.z;});cx/=16;cz/=16;const dd=Math.hypot(cx-p.x,cz-p.z)||1;
    herd.forEach(s=>{const g=s.g.position;let tx,tz,sp=2.4;
      if(mode==='in'){tx=FX+s.hx+shx;tz=FZ+s.hz+shz;sp=3;}
      else if(mode==='out'){sp=3.4;if(g.z<FZ+FR-.3&&Math.abs(g.x-FX)<4.6){tx=FX+s.ox*.25;tz=FZ+FR+1;}else{tx=hc.x+s.ox;tz=hc.z+2.6+s.oz;}}
      else if(mode==='follow'){tx=p.x+(cx-p.x)/dd*3.6+s.ox;tz=p.z+(cz-p.z)/dd*3.6+s.oz;sp=Math.min(4.6,1+dd);}
      else{tx=hc.x+s.ox*1.5;tz=hc.z+s.oz*1.5;}
      const dx=tx-g.x,dz=tz-g.z,d=Math.hypot(dx,dz);if(d>.3){const st=Math.min(d,sp*dt);g.x+=dx/d*st;g.z+=dz/d*st;s.g.rotation.y=Math.atan2(dx,dz);}g.y=CQ.G(g.x,g.z);});});

  /* a round, cartoon wolf (not frightening) */
  const wolf=new T.Group();W.scene.add(wolf);wolf.visible=false;const wg=toon('#8e8f98'),wl=toon('#c9cad0'),wd=toon('#2a2a30');
  mesh(new T.SphereGeometry(.5,14,10),wg,0,.75,0,wolf).scale.set(1,.85,1.5);mesh(new T.SphereGeometry(.36,12,10),wl,0,.62,.25,wolf).scale.set(.9,.6,1.2);
  mesh(new T.SphereGeometry(.34,14,10),wg,0,1.1,.78,wolf);mesh(new T.SphereGeometry(.16,10,8),wl,0,1.0,1.1,wolf).scale.set(1,.8,1.2);mesh(new T.SphereGeometry(.06,8,6),wd,0,1.04,1.27,wolf);
  for(const s of[-1,1]){mesh(new T.ConeGeometry(.11,.26,8),wg,s*.19,1.42,.72,wolf);mesh(new T.SphereGeometry(.08,8,6),new T.MeshBasicMaterial({color:'#fff'}),s*.13,1.18,1.06,wolf);mesh(new T.SphereGeometry(.045,8,6),wd,s*.13,1.18,1.12,wolf);
    for(const z of[-.45,.45])mesh(new T.CylinderGeometry(.09,.08,.55,7),wg,s*.22,.28,z,wolf);}
  const tail=mesh(new T.SphereGeometry(.16,10,8),wg,0,.95,-.8,wolf);tail.scale.set(.8,.8,2);tail.rotation.x=-.6;
  let wolfGo=null;W.tick.push((dt,tt)=>{tail.rotation.y=Math.sin(tt*6)*.4;if(wolfGo){const g=wolf.position,dx=wolfGo.x-g.x,dz=wolfGo.z-g.z,d=Math.hypot(dx,dz);if(d>.2){const st=Math.min(d,wolfGo.sp*dt);g.x+=dx/d*st;g.z+=dz/d*st;wolf.rotation.y=Math.atan2(dx,dz);}else if(wolfGo.hide)wolf.visible=false;g.y=CQ.G(g.x,g.z);}});

  /* people */
  const JX=-18,JZ=10;const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),JX,JZ,1);
  CQ.crowd(CQ.ring(JX,JZ,16,3,6,-.3,.9),{sit:1});CQ.crowd(CQ.ring(JX,JZ,8,3,5.5,2.6,3.5),{sit:1});
  const shep=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.shepherd2,{staff:1})),FX+1.6,FZ+FR+1.2,0);
  const st1=CQ.place(CQ.makeChar(CQ.CAST.man2),FX-7,FZ+3.5,1.2),st2=CQ.place(CQ.makeChar(CQ.CAST.man),FX+7.5,FZ+2.5,-1.4);
  const hired=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#b8a070',hem:.45,sash:'#7a5233',hair:'#4a3a2c',beard:0}),31,-4,-1);
  const posts=[[6,4],[15,6],[24,3]].map((p,i)=>{const g=new T.Group();g.position.set(p[0],H(p[0],p[1]),p[1]);W.scene.add(g);mesh(new T.CylinderGeometry(.07,.08,1.4,6),M.wood,0,.7,0,g);mesh(new T.BoxGeometry(.5,.12,.04),toon('#e0503a'),.25,1.25,0,g);
    CQ.addInter({id:'w'+i,obj:g,x:p[0],z:p[1],name:'cột mốc',verb:'Dẫn chiên đến ',h:1.6,r:2.6,g});return g;});
  const flee=(x,z)=>{const d=Math.hypot(x-FX,z-FZ);shx=(FX-x)/d*1.4;shz=(FZ-z)/d*1.4;setTimeout(()=>{shx=shz=0;},3000);};
  const lie=(who,P,a,b)=>d=>{flee(P.x,P.z);CQ.lines([[who,a,null],['Người kể chuyện',b,'Giăng 10:5']],d);};
  const V5='Nhưng chiên chẳng theo người lạ; trái lại, nó chạy trốn, vì chẳng quen tiếng người lạ.';

  CQ.zones({A:{c:[8,0],r:34,tod:'day'}});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:3.2});
  const sI=CQ.addInter({id:'shep',P:shep,name:'người chăn chiên',h:2.05});
  CQ.addInter({id:'st1',P:st1,name:'người lạ',side:1,h:2.05,run:lie('Người lạ',st1,'Chiên ơi, chiên ơi! Lại đây với ta nào!',V5)});
  CQ.addInter({id:'st2',P:st2,name:'người lạ khác',side:1,h:2.05,run:lie('Người lạ khác',st2,'Ê, mấy con chiên kia! Theo ta đi, ta có cỏ ngon!',V5)});
  CQ.addInter({id:'hired',P:hired,name:'người làm thuê',side:1,h:2.05,run:d=>CQ.say('Người làm thuê','Tôi giữ chiên để lấy tiền công thôi. Bầy chiên đâu phải của tôi.','Theo Giăng 10:12',null,d)});
  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',-10,13.5,1.57,null,true);

  W.steps=[
   {at:'jesus',text:'Ngồi nghe Thầy dạy trên đồi',run:n=>{CQ.setCine([-12,4.2,15,JX,H(JX,JZ)+1.3,JZ]);
     CQ.lines([['Chúa Giê-su','Người canh cửa mở cho, chiên nghe tiếng người chăn; người chăn kêu tên chiên mình mà dẫn ra ngoài.','Giăng 10:3'],['Chúa Giê-su','Quả thật, quả thật, ta nói cùng các ngươi, ta là cửa của chiên.','Giăng 10:7'],
       ['Người kể chuyện','Bạn hãy đến chuồng chiên giúp người chăn. Bạn sẽ hiểu điều Thầy dạy!',null]],()=>{CQ.setCine(null);n();});}},
   {at:'shep',text:'Ba người đang gọi chiên. Nghe từng người, rồi đến với người chăn ở cửa chuồng',run:n=>{CQ.setCine([FX+5,4,FZ+12,FX,1.2,FZ+2]);
     const call=()=>CQ.say('Người chăn chiên','Bông ơi! Mây ơi! Sữa ơi! Ra đây nào, cả bầy ơi!',null,null,()=>{mode='out';hc={x:shep.x,z:shep.z};
       setTimeout(()=>CQ.say('Người kể chuyện','Nghe tiếng người chăn, cả bầy chiên kéo nhau ra khỏi chuồng và đứng quanh người.','Theo Giăng 10:3-4',null,()=>{CQ.setCine(null);n();}),3500);});
     CQ.say('Người chăn chiên','Chiên của tôi quen tiếng tôi. Tôi đặt tên cho từng con và gọi tên chúng.',null,null,()=>
     CQ.choice({name:'Người kể chuyện',q:'Bầy chiên sẽ đi theo ai ra khỏi chuồng?',options:['Theo người chăn, vì chiên quen tiếng người','Theo người lạ nào gọi to nhất','Theo người nào cho cỏ trước'],ref:'Theo Giăng 10:4-5',wrong:'Chưa đúng. Nhớ lại: chiên có theo người lạ không?'},call));}},
   {collect:['w0','w1','w2'],text:'Dẫn bầy chiên ra đồng cỏ xanh bên dòng suối',each:I=>{I.hidden=true;if(I.id==='w0'){mode='follow';CQ.walkTo(shep,12,9,3);}},
    run:n=>{mode='graze';hc={x:27,z:3};CQ.walkTo(shep,25,-1.5,3.2,()=>CQ.face(shep,28,-10));CQ.say('Người kể chuyện','Bầy chiên ăn cỏ xanh và uống nước bên dòng suối mát.','Theo Giăng 10:9',null,n);}},
   {at:'shep',text:'Có con sói đến gần bầy chiên! Lại bên người chăn',run:n=>{wolf.visible=true;wolf.position.set(27,0,-20);wolfGo={x:27,z:-8.5,sp:3};CQ.movePlayer(21,4.5);CQ.setCine([17,4.6,2,27,1,-7]);
     CQ.walkTo(hired,10,-24,5.5);
     CQ.say('Người kể chuyện','Người làm thuê thấy sói đến thì bỏ chiên mà chạy trốn, vì chiên chẳng phải của nó. Nhưng người chăn hiền lành thì ở lại với bầy chiên.','Theo Giăng 10:12-13',null,()=>
     CQ.say('Người chăn chiên','Đừng sợ, các con chiên! Ta ở đây với các con.',null,null,()=>{wolfGo=null;const z0=wolf.position.z;
     CQ.tapFill({name:'Đuổi sói đi',text:'Giúp người chăn đuổi sói đi! Chạm thật nhanh để người chăn giơ gậy, đẩy con sói ra xa khỏi đồi.',need:20,onP:p=>{wolf.position.z=z0-p*8;wolf.position.y=CQ.G(27,wolf.position.z);shep.raise=p*.5;}},()=>{shep.raise=0;wolfGo={x:30,z:-34,sp:6,hide:1};
     CQ.say('Người kể chuyện','Con sói cụp đuôi chạy mất. Người chăn không bỏ bầy chiên của mình.',null,null,()=>{CQ.setCine(null);jesus.dest=null;CQ.place(jesus,19,8,-.6);n();});});}));}},
   {at:'jesus',text:'Thầy đã đến đồng cỏ. Lại nghe Thầy nói',run:n=>{CQ.movePlayer(21.6,10.4);CQ.setCine([14.6,3.6,13.4,19.6,H(19,8)+1.2,7.6]);
     CQ.fillWord({name:'Chúa Giê-su',before:'Ta là người chăn hiền lành; người chăn hiền lành vì chiên mình phó sự',after:' mình.',options:['sống','giàu','nhà'],answer:'sống',ref:'Giăng 10:11',wrong:'Chưa đúng. Người chăn hiền lành sẵn lòng cho chiên điều quý nhất của mình.'},()=>
     CQ.order({name:'Chúa Giê-su',q:'Những ai theo Chúa là chiên của Ngài. Ghép lại lời Thầy.',chunks:['Chiên ta','nghe tiếng ta,','ta quen nó,','và nó theo ta.'],ref:'Giăng 10:27'},()=>
     CQ.say('Người kể chuyện','Thầy còn hứa ban cho chiên Ngài sự sống đời đời, và không ai cướp được chiên khỏi tay Ngài.','Theo Giăng 10:28','Xong',()=>{CQ.setCine(null);n();})));}}];
 }});
