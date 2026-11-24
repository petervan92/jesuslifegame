/* Chapter 35: Paul on the island of Malta (Acts 28:1-10). Dusk: they came ashore cold and wet, the islanders lit a fire (28:2).
   Quoted word for word (1925 text): Công vụ 28:3 and 28:5 (narration lines). Dialogue of islanders is paraphrase (refs start "Theo"). */
'use strict';
CQ.chapters.push({id:'malta',no:35,title:'Đảo Man-tơ',sub:'Ngọn lửa trên bãi cát · buổi chiều muộn',
 intro:[
  {t:'Lên bờ an toàn',x:'Sau khi được cứu, chúng ta mới biết cù lao đó tên là Man-tơ. Trời mưa lạnh.',ref:'Theo Công vụ 28:1-2',cam:[-14,5,4,-4,1.4,-12]},
  {t:'Người dân nhân từ',x:'Dân đảo đốt lửa lớn và tiếp rước mọi người rất nhân từ vì trời mưa và lạnh.',ref:'Theo Công vụ 28:2',cam:[7,2.6,-1,0,1.2,-7]},
  {t:'Bó củi khô',x:'Phao-lô lượm một bó củi để bỏ vào lửa. Ê-li chạy lại giúp.',ref:'Theo Công vụ 28:3',cam:[-5,2.4,-3,2,1.2,-8]}],
 outro:'Dân đảo tỏ lòng kính trọng và cung cấp mọi thứ cần dùng khi họ ra đi.',outroRef:'Theo Công vụ 28:10',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='dusk';W.startYaw=0;W.menuCam={x:2,y:2,z:-4,r:30,h:12};
  W.paths=[[[0,12],[0,-5]],[[2,6],[18,17]]];
  const sh=x=>-22+2*noise(x*.05,3);
  const H=(x,z)=>{const r=Math.hypot(x,z);return -4+4.9*sm(sh(x)-9,sh(x)+2,z)+.35*noise(x,z)*sm(sh(x)+4,sh(x)+16,z)+sm(60,150,r)*10;};
  const g1=C('#8da452'),g2=C('#a9ae62'),sand=C('#e2cf9c'),dirt=C('#d9c394');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(sand,1-sm(sh(x)+6,sh(x)+17,z));c.lerp(dirt,(1-sm(1.4,3.2,CQ.distPath(x,z)))*.8);}});
  CQ.sky({fogNear:45,fogFar:170,clouds:10});CQ.water({deep:3.5});
  CQ.scatter(1500,new T.ConeGeometry(.09,.3,4),toon('#7b9a45'),()=>{const x=rr(-150,150),z=rr(-150,150);if(z<sh(x)+16||CQ.distPath(x,z)<2)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(160,new T.DodecahedronGeometry(.3,0),toon('#9a948a'),()=>{const x=rr(-45,45),z=rr(sh(x)-4,sh(x)+8);return[x,H(x,z)+.1,z,rr(.5,1.6),rr(.5,1)];},1);
  [[-26,-14],[24,-16],[-12,-17],[14,-18]].forEach(p=>{CQ.wallBox(p[0],p[1],rr(2.4,3.4),1.3,2,rr(0,3),toon('#a39a8c'));});
  /* houses of the islanders and trees */
  [[-18,14,6,6,3,0],[0,18,7,6,3.2,0],[20,12,8,6,3.3,0],[-30,8,6,6,3,1.57]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i===1}));
  [[-10,24],[10,26],[30,22],[-26,22],[-34,-4],[34,-2]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[-24,-10],[26,-11],[-8,-14]].forEach(p=>CQ.palm(p[0],p[1],rr(1,1.2)));CQ.bush(-14,6,1);CQ.bush(14,6,1.1);
  /* wreck in the surf */
  CQ.boat(-22,sh(-22)-9,.5,{sail:1,tilt:.35,far:1,y:-.4});CQ.boat(10,sh(10)-16,2.2,{tilt:-.3,far:1,y:-.5});
  for(let i=0;i<6;i++){const p=mesh(new T.BoxGeometry(rr(1.5,2.6),.12,.3),M.wood,rr(-24,24),H(0,sh(0)+1)+.08,sh(0)+rr(0,3)+1,null);p.rotation.y=rr(0,3);p.position.y=.12;}
  /* the fire */
  const FX=0,FZ=-6;CQ.campfire(FX,FZ);
  [[FX-2.6,FZ+1],[FX+2.6,FZ+1.2],[FX-1,FZ+3],[FX+1.2,FZ-2.4]].forEach(p=>{const l=mesh(new T.CylinderGeometry(.22,.24,.5,8),M.wood,p[0],H(p[0],p[1])+.25,p[1]);W.circles.push({x:p[0],z:p[1],r:.3});});
  const bun=[];[[-9,-10],[9,-9],[-12,2],[12,3]].forEach((p,i)=>{const g=new T.Group();g.position.set(p[0],H(p[0],p[1]),p[1]);W.scene.add(g);for(let k=0;k<5;k++){const s=mesh(new T.CylinderGeometry(.05,.06,1.1,5),M.woodD,rr(-.15,.15),.1+k*.03,rr(-.1,.1),g);s.rotation.set(Math.PI/2,rr(0,3),0);}
    bun.push(CQ.addInter({id:'w'+i,obj:g,x:p[0],z:p[1],name:'bó củi khô',verb:'Nhặt ',h:1,r:2.2,k:i}));});
  /* people */
  const eli=Object.assign({},CQ.CAST.eli,{S:.95,head:1.04,beard:1,tunic:'#e07a3f'});W.player=CQ.makeChar(eli);
  const paul=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#f0e6cc',hem:.35,mantle:'#8a3a4a',sash:'#4a3a2c',hair:'#2a1d15',beard:1,band:'#e9dcc0',S:.96}),FX+2.8,FZ-1.4,2.3);
  const sn=new T.Group();paul.arms[1].add(sn);sn.visible=false;
  const cv=new T.CatmullRomCurve3([[0,-.4,.1],[.1,-.5,.15],[-.1,-.6,.1],[.1,-.7,.15],[0,-.8,.1]].map(a=>new T.Vector3(a[0],a[1],a[2])));mesh(new T.TubeGeometry(cv,16,.035,6),toon('#6a8a3a'),0,0,0,sn);mesh(new T.SphereGeometry(.05,8,6),toon('#4f6a2a'),0,-.82,.1,sn);
  const sol=[[-4,-9,1],[4,-10,-1]].map(p=>CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#a83a32',hem:.4,mantle:'#7a1f1f',sash:'#3a2f2a',hair:'#2a1d15',staff:1,band:'#b8b8b8'}),p[0],p[1],p[2]*1.2));
  const sail=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#9aa5a8',hem:.4,hair:'#2e2018',beard:2,band:'#c9c0a8'}),-3,-7,-1.3);
  const isl=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#6f9a8a',hem:.35,sash:'#c9833a',hair:'#241a13',beard:1,band:'#e9dcc0'}),-2.8,-3,.6);
  const isw=CQ.place(CQ.makeChar(CQ.CAST.woman),3.6,-3.4,-.8);
  CQ.crowd([[-3.4,-1,.7],[3,-1.6,-.7],[5.2,-5,-1.3],[-5.6,-5.2,1.3],[-1,-9.6,0],[2,-9.4,0]],{noCol:1});
  const pub=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#e9dcc0',hem:.2,mantle:'#3a6ea5',sash:'#d9a441',hair:'#4a3a2c',beard:1,band:'#d9a441',S:1.02}),16,17.5,.6);
  const fath=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#cfc3a4',hem:.2,mantle:'#9a8f78',hair:'#d9d4c8',beard:2,staff:1}),23,18,-.9);
  const bed=new T.Group();bed.position.set(24.2,H(24.2,18),18.6);W.scene.add(bed);mesh(new T.BoxGeometry(2.2,.35,1.1),M.wood,0,.2,0,bed);mesh(new T.BoxGeometry(2.1,.14,1),toon('#d9cfb4'),0,.45,0,bed);W.circles.push({x:24.2,z:18.6,r:1.1});
  const kid=CQ.place(CQ.makeChar(CQ.CAST.kid),-9,-1,.6);
  CQ.zones({A:{c:[2,5],rect:[34,24],tod:'dusk'}});
  CQ.addInter({id:'kid',P:kid,name:'em bé đảo',h:2.05,side:1,run:d=>CQ.say('Em bé','Mẹ em nói người lạ đến từ biển cần được sưởi ấm. Lửa của làng em to lắm!','Theo Công vụ 28:2','Hay quá!',d)});
  CQ.addInter({id:'sail',P:sail,name:'thủy thủ',h:2.05,side:1,run:d=>CQ.say('Thủy thủ','Chúng tôi lạnh run, nhưng nhờ ngọn lửa này ai cũng ấm lại rồi.','Theo Công vụ 28:2','Vâng',d)});
  CQ.addInter({id:'paul',P:paul,name:'Phao-lô',h:2.1,r:3.2});
  CQ.addInter({id:'fire',obj:W.scene,x:FX,z:FZ,name:'ngọn lửa',verb:'Lại gần ',h:1.6,r:3.2,remote:1});
  CQ.addInter({id:'isl',P:isl,name:'người dân đảo',h:2.05,r:2.8});
  CQ.addInter({id:'pub',P:pub,name:'Búp-li-ô',h:2.1,r:2.8});
  CQ.addInter({id:'fath',P:fath,name:'cha của Búp-li-ô',h:2.05,r:2.8});
  const toFire=[FX+5.5,3.4,FZ+5,FX+1,1.3,FZ-1];
  W.steps=[
   {collect:['w0','w1','w2','w3'],text:'Nhặt bốn bó củi khô trên bãi cát',each:I=>{I.hidden=true;I.obj.visible=false;},run:n=>{CQ.setCine(toFire);
     CQ.lines([['Ê-li','Củi này khô lắm, con đem lại cho bác Phao-lô.','Theo Công vụ 28:3']],()=>
     CQ.tapFill({name:'Giữ lửa cháy',text:'Chạm nhặt từng bó củi khô gần bờ cát để giữ lửa luôn cháy.',need:10},()=>{CQ.setCine(null);n();}));}},
   {at:'paul',text:'Lại gần Phao-lô, đưa củi cho bác',run:n=>{CQ.setCine([FX-3,2.4,FZ+4,FX+2.8,1.3,FZ-1.4]);
     CQ.say('Người kể chuyện','Phao-lô lượm được một bó củi khô, quăng vào trong lửa, xảy có con rắn lục từ trong bó củi bị nóng bò ra, quấn trên tay người.','Công vụ 28:3',null,()=>{sn.visible=true;
     CQ.choice({name:'Con rắn lục',q:'Con gì bò ra từ bó củi?',options:['Rắn lục','Chuột','Chim nhỏ'],ref:'Công vụ 28:3',wrong:'Chưa đúng. Nhìn kỹ tay Phao-lô xem.'},()=>{CQ.setCine(null);n();});});}},
   {at:'fire',text:'Nhìn bác Phao-lô rảy con rắn vào lửa',run:n=>{CQ.setCine(toFire);
     CQ.fillWord({name:'Người kể chuyện',before:'Nhưng Phao-lô rảy',answer:'rắn lục',after:' vào lửa, chẳng thấy hề chi hết.',options:['rắn lục','củi khô','ngọn đuốc'],ref:'Công vụ 28:5',wrong:'Chưa đúng. Nhớ con vật bò ra từ bó củi.'},()=>{sn.visible=false;CQ.setCine(null);n();});}},
   {at:'isl',text:'Nghe người dân đảo nói',run:n=>{CQ.face(isl,W.player.x,W.player.z);CQ.setCine([-6,2.8,0,-2.8,1.5,-3]);
     CQ.lines([['Người dân','Chắc ông ấy là một vị thần!','Theo Công vụ 28:6'],['Ê-li','Bác Phao-lô chỉ là một người được Đức Chúa Trời gìn giữ thôi.','Theo Công vụ 28:5-6']],()=>{CQ.setCine(null);n();});}},
   {at:'pub',text:'Theo Phao-lô đến nhà Búp-li-ô',run:n=>{CQ.face(pub,W.player.x,W.player.z);CQ.setCine([12,3,22,16,1.6,17.5]);
     CQ.lines([['Búp-li-ô','Cha tôi đang đau nặng. Xin ông giúp.','Theo Công vụ 28:7-8']],()=>{CQ.setCine(null);n();});}},
   {at:'fath',text:'Đến bên giường cha của Búp-li-ô',run:n=>{CQ.setCine([19,3,23,23,1.4,18.2]);
     CQ.lines([['Người kể chuyện','Phao-lô vào thăm, cầu nguyện, đặt tay và cha Búp-li-ô được lành. Những người ốm khác trên đảo cũng đến và được chữa.','Theo Công vụ 28:8-9']],()=>{CQ.setCine(null);n();});}}];
 }});
