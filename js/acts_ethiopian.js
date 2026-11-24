/* Chapter: Philip and the Ethiopian official (Acts 8:4-8, 8:26-39). Set in daylight: "khi đó" is at noon in the outline, the text gives no hour.
   Quoted word for word (1925 text): Công vụ 8:26 (the angel), 8:30 (Phi-líp's question). Other lines are paraphrase, so their refs start with "Theo". */
'use strict';
CQ.chapters.push({id:'ethiopian',no:23,title:'Phi-líp và quan Ê-thi-ô-bi',sub:'Đọc sách tiên tri trên xe · buổi trưa',
 intro:[
  {t:'Tin vui ở Sa-ma-ri',x:'Phi-líp xuống thành Sa-ma-ri giảng về Đấng Christ, và nhiều người vui mừng tin theo.',ref:'Theo Công vụ 8:5-8',cam:[6,3,36,0,1.5,28]},
  {t:'Thiên sứ chỉ đường',x:'Thiên sứ của Chúa bảo Phi-líp đi về phía nam, trên con đường vắng từ Giê-ru-sa-lem xuống Ga-xa. Ê-li đi theo.',ref:'Theo Công vụ 8:26',cam:[9,4,20,3,2,12]},
  {t:'Chiếc xe trên đường',x:'Một viên quan Ê-thi-ô-bi đang ngồi trên xe, đọc to sách tiên tri Ê-sai khi trở về nước.',ref:'Theo Công vụ 8:27-28',cam:[6,3.4,-18,0,1.6,-32]}],
 outro:'Viên quan tiếp tục đi đường mình, lòng đầy vui mừng.',outroRef:'Theo Công vụ 8:39',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:-6,r:36,h:14};
  W.paths=[[[0,40],[0,-10],[0,-34],[3,-60]],[[0,-26],[13,-24]]];
  const PX=16,PZ=-24;
  const base=(x,z)=>1+.5*noise(x*.8,z*.8)+9*sm(26,52,Math.abs(x))+6*sm(55,90,Math.abs(z+6));
  const H=(x,z)=>{const w=Math.exp(-((x-PX)*(x-PX)+(z-PZ)*(z-PZ))/22),b=base(x,z);return b*(1-w)+(.05+.1*b)*w;};
  const sand=C('#dcc48f'),dry=C('#c9b673'),rock=C('#b59c76'),dirt=C('#e6d3a4');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(sand).lerp(dry,.5+.5*noise(x*1.3,z*1.3));c.lerp(rock,sm(2.2,7,y));c.lerp(dirt,(1-sm(1.5,3.4,CQ.distPath(x,z)))*.9);c.lerp(C('#9fb25a'),Math.exp(-((x-PX)*(x-PX)+(z-PZ)*(z-PZ))/150)*.7);}});
  CQ.sky({fogNear:60,fogFar:210,clouds:5});
  CQ.scatter(1800,new T.ConeGeometry(.08,.34,4),toon('#bda950'),()=>{const x=rr(-150,150),z=rr(-150,150);if(CQ.distPath(x,z)<2.2)return 0;return[x,H(x,z)+.12,z,rr(.7,1.3)];});
  CQ.scatter(260,new T.DodecahedronGeometry(.35,0),toon('#a8977a'),()=>{const x=rr(-90,90),z=rr(-90,90);if(CQ.distPath(x,z)<2.5)return 0;return[x,H(x,z)+.1,z,rr(.5,2)];});
  const dryB=['#8a8a4a','#a39a58','#7e7a42'];
  for(let i=0;i<34;i++){const x=rr(-45,45),z=rr(-60,40);if(CQ.distPath(x,z)>3.2&&Math.hypot(x-PX,z-PZ)>5)CQ.bush(x,z,rr(.6,1.3),dryB);}
  [[-14,30],[14,34],[-18,-4],[20,8],[-16,-34],[-24,-20]].forEach(p=>CQ.olive(p[0],p[1],rr(.9,1.2)));[[PX-4,PZ+5],[PX+5,PZ-4],[PX+2,PZ+6]].forEach(p=>CQ.palm(p[0],p[1],rr(1,1.2)));
  /* village on the Samaria side */
  [[-12,42,7,6,3.2,0.2],[8,44,8,6,3.4,-.1],[-26,36,6,6,3,.9]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i===1}));
  /* the pool by the road */
  const pool=new T.Group();pool.position.set(PX,0,PZ);W.scene.add(pool);
  mesh(new T.CircleGeometry(4.2,24),new T.MeshBasicMaterial({color:'#4fa6d8'}),0,.52,0,pool,false).rotation.x=-Math.PI/2;
  CQ.scatter(30,new T.DodecahedronGeometry(.28,0),toon('#9a8c74'),()=>{const a=R()*6.28,r=rr(4.1,4.9);return[PX+Math.cos(a)*r,H(PX+Math.cos(a)*r,PZ+Math.sin(a)*r)+.1,PZ+Math.sin(a)*r,rr(.6,1.2)];});
  /* milestone where Philip waits */
  const ms=new T.Group();ms.position.set(2.6,H(2.6,-8),-8);W.scene.add(ms);mesh(new T.BoxGeometry(.7,1.1,.5),toon('#c9bba0'),0,.55,0,ms);W.circles.push({x:2.6,z:-8,r:.7});
  /* the chariot: forward is local -z, two horses in front */
  const CX=0,CZ0=-32,CZ1=-28,cg=new T.Group();cg.position.set(CX,H(CX,CZ0),CZ0);W.scene.add(cg);
  const wood=toon('#8a5a34'),gold=toon('#d9a441'),wheels=[];
  mesh(new T.BoxGeometry(1.7,.14,2),wood,0,.62,0,cg);mesh(new T.BoxGeometry(.1,.7,2),wood,-.85,.95,0,cg);mesh(new T.BoxGeometry(.1,.7,2),wood,.85,.95,0,cg);mesh(new T.BoxGeometry(1.7,.7,.1),wood,0,.95,.95,cg);mesh(new T.BoxGeometry(1.7,.12,.1),gold,0,1.3,.95,cg);
  mesh(new T.BoxGeometry(.12,.12,3.4),wood,0,.7,-2.4,cg);
  for(const x of[-.95,.95]){const w=new T.Group();w.position.set(x,.55,.1);cg.add(w);wheels.push(w);const rim=mesh(new T.CylinderGeometry(.55,.55,.1,16),wood,0,0,0,w);rim.rotation.z=Math.PI/2;for(let k=0;k<3;k++){const s=mesh(new T.BoxGeometry(.06,1.05,.08),gold,0,0,0,w);s.rotation.x=k*1.047;}}
  const horses=[];for(const x of[-.55,.55]){const h=new T.Group();h.position.set(x,0,-2.6);cg.add(h);const hc=x<0?'#5a3a24':'#e6dccb',hm=toon(hc);
    mesh(new T.BoxGeometry(.6,.7,1.5),hm,0,1.05,0,h);for(const lx of[-.2,.2])for(const lz of[-.55,.55])mesh(new T.BoxGeometry(.14,.75,.14),hm,lx,.38,lz,h);
    const nk=mesh(new T.BoxGeometry(.24,.7,.28),hm,0,1.5,-.8,h);nk.rotation.x=-.5;mesh(new T.BoxGeometry(.22,.26,.55),hm,0,1.85,-1.2,h);mesh(new T.BoxGeometry(.08,.5,.1),toon('#2e2018'),0,1.6,-.62,h);horses.push(h);}
  const ob={x:CX,z:CZ0-1.5,w:2.4,d:6,rot:0,ox:0};W.obstacles.push(ob);
  W.tick.push((dt,tt)=>{for(const w of wheels)w.rotation.x+=dt*(cg.userData.go?2.2:0);horses.forEach((h,i)=>{h.position.y=Math.sin(tt*2+i)*.02;});});
  const setC=z=>{cg.position.set(CX,H(CX,z),z);ob.z=z-1.5;eth.x=CX;eth.z=z;};
  /* characters */
  const hand=W.player=CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.82,head:1.1}));
  const phil=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#4f8a4a',hem:.35,mantle:'#d9b86a',sash:'#7a4a2c',hair:'#3a281c',beard:1,band:'#efe3c6'}),-2,25,0.4);
  const eth=CQ.place(CQ.makeChar({skin:'#6b4630',tunic:'#f7f1df',hem:.25,mantle:'#7a3b8e',sash:'#d9a441',hair:'#1a120d',beard:1,band:'#f7f1df'}),CX,CZ0,0);eth.minY=H(CX,CZ0)+.55;
  const scroll=mesh(new T.CylinderGeometry(.05,.05,.42,8),toon('#efe3c6'),0,-.72,.12,eth.arms[1]);scroll.rotation.x=1.3;
  const angel=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.angel,{float:1.4})),5,15,3.4);
  const sa=CQ.place(CQ.makeChar(CQ.CAST.woman),-4.4,29,.6);
  CQ.place(CQ.makeChar(CQ.CAST.man),3,30,3.6);CQ.place(CQ.makeChar(CQ.CAST.woman2),-1.5,31.5,0);
  CQ.crowd(CQ.ring(0,31,7,3,6,0,6.283),{});
  const boy=CQ.place(CQ.makeChar(CQ.CAST.kid),-8,-6,1.2);for(let i=0;i<3;i++)CQ.sheep(-11+i*1.6,-9+rr(-1,1));
  const trav=CQ.place(CQ.makeChar(CQ.CAST.shepherd2),-12,16,1.6);
  /* what Eli carries to the pool */
  const pitcher=CQ.jar(hand.arms[1],0,-.95,.12,.42);pitcher.visible=false;
  CQ.zones({A:{c:[0,-4],r:62,tod:'day'}});
  CQ.addInter({id:'boy',P:boy,name:'cậu bé chăn cừu',h:1.8,side:1,run:d=>CQ.say('Cậu bé','Có một quan lớn từ xa đi qua đây. Xe ông ấy chạy chậm lắm, và ông cứ vừa đi vừa đọc to một cuộn sách!','Theo Công vụ 8:27-28','Hay quá!',d)});
  CQ.addInter({id:'trav',P:trav,name:'người đi đường',h:2.05,side:1,run:d=>CQ.say('Người đi đường','Con đường này từ Giê-ru-sa-lem xuống Ga-xa vắng lắm, ít ai đi. Chúc hai bác cháu bình an!','Theo Công vụ 8:26','Cảm ơn bác',d)});
  CQ.addInter({id:'sam',P:sa,name:'dân thành Sa-ma-ri',h:2});
  CQ.addInter({id:'angel',P:angel,name:'thiên sứ',h:3.4});
  CQ.addInter({id:'mile',obj:ms,x:2.6,z:-8,name:'cột mốc',verb:'Chạy theo xe từ ',h:1.7,r:3});
  CQ.addInter({id:'eth',P:eth,name:'quan Ê-thi-ô-bi',h:2.4,r:4.4});
  CQ.addInter({id:'phil',P:phil,name:'Phi-líp',h:2.1,r:3});
  CQ.addInter({id:'spring',obj:pool,x:PX-5,z:PZ,name:'suối nước',verb:'Múc nước ở ',h:1.8,r:3});
  CQ.goZone('A',0,25,0,null,true);
  const end=n=>()=>{CQ.setCine(null);n();};
  W.steps=[
   {at:'sam',text:'Nghe tin vui ở Sa-ma-ri. Lại gần người dân',run:n=>CQ.lines([['Dân thành Sa-ma-ri','Người này giảng về Chúa Giê-su và chữa lành bệnh tật. Chúng tôi vui lắm!','Theo Công vụ 8:5-8'],['Phi-líp','Hãy tin Đấng Christ, vì Ngài yêu thương tất cả mọi người.','Theo Công vụ 8:5']],n)},
   {at:'angel',text:'Lại gần thiên sứ',run:n=>{CQ.setCine([9,4,20,4,2.6,15]);
     CQ.lines([['Thiên sứ','Hãy chờ dậy, đi qua phía nam, trên con đường từ thành Giê-ru-sa-lem xuống thành Ga-xa.','Công vụ 8:26'],['Ê-li','Con đi cùng bác. Đường này vắng quá!','Theo Công vụ 8:26']],()=>{CQ.walkTo(phil,-1,-6,3);CQ.setCine(null);n();});}},
   {at:'mile',text:'Chạy theo chiếc xe ở phía xa',run:n=>{CQ.setCine([6,3.2,-12,0,1.6,-27]);cg.userData.go=1;
     CQ.say('Người kể chuyện','Thần Chúa phán cùng Phi-líp: hãy lại gần xe ấy mà theo.','Theo Công vụ 8:29','Chạy!',()=>
     CQ.tapFill({name:'Đuổi theo xe',text:'Chạm nhanh để Ê-li và Phi-líp đuổi kịp chiếc xe đang chạy chậm trên đường.',need:10,onP:p=>{CQ.place(W.player,0,-8-p*15);CQ.face(W.player,0,-60);CQ.place(phil,-1.8,-8-p*15+.8);setC(CZ0+(CZ1-CZ0)*p);}},()=>{cg.userData.go=0;phil.minY=null;CQ.face(phil,0,-28);CQ.setCine(null);n();}));}},
   {at:'eth',text:'Hỏi người đọc sách',run:n=>{CQ.setCine([5,2.8,-20.5,0,1.9,-28]);
     CQ.say('Người kể chuyện','Viên quan Ê-thi-ô-bi đang ngồi trên xe, đọc to sách tiên tri Ê-sai.','Theo Công vụ 8:28',null,()=>
     CQ.fillWord({name:'Phi-líp',before:'Ông hiểu lời mình đọc đó',after:'?',options:['chăng','không','mãi'],answer:'chăng',ref:'Công vụ 8:30',wrong:'Chưa đúng. Hãy nghe lại câu Phi-líp hỏi.'},()=>
     CQ.say('Quan Ê-thi-ô-bi','Nếu chẳng ai dạy tôi, thì làm sao hiểu được? Xin mời ông lên xe ngồi cùng tôi.','Theo Công vụ 8:31','Vâng',end(n))));}},
   {at:'phil',text:'Nghe Phi-líp giải nghĩa',run:n=>{CQ.setCine([-4,3,-22,0,1.9,-28]);
     CQ.say('Phi-líp','Lời tiên tri Ê-sai nói về Chúa Giê-su. Ngài chịu khổ vì chúng ta.','Theo Công vụ 8:32-35','Ồ!',()=>
     CQ.choice({name:'Ê-li',q:'Viên quan đang đọc sách của vị tiên tri nào?',options:['Ê-sai','Giô-na','Đa-ni-ên'],ref:'Công vụ 8:28',wrong:'Chưa đúng. Nhìn tên trên cuộn sách.'},end(n)));}},
   {at:'spring',text:'Múc nước suối bên đường',run:n=>{pitcher.visible=true;CQ.setCine([PX-9,4.5,PZ+7,PX,.8,PZ]);CQ.walkTo(eth,PX-7,PZ+1.4,2.4);CQ.walkTo(phil,PX-6,PZ-1.4,2.4);
     CQ.lines([['Quan Ê-thi-ô-bi','Kìa có nước, có gì ngăn cản tôi chịu phép báp-têm không?','Theo Công vụ 8:36'],['Ê-li','Cháu đã múc nước suối đây ạ!','Theo Công vụ 8:38']],()=>{pitcher.visible=false;eth.minY=null;CQ.setCine(null);n();});}}];
 }});
