/* Chapter 26: Tabitha (Dorcas) at Joppa (Acts 9:36-43). The passage gives no time of day, so the scene is set in daylight.
   Quoted word for word (1925 text): Công vụ 9:40 (Phi-e-rơ biểu người ta ra ngoài hết... hãy chờ dậy). */
'use strict';
CQ.chapters.push({id:'dorcas',no:26,title:'Ta-bi-tha ở Giốp-bê',sub:'Người may áo cho người nghèo · ban ngày',
 intro:[
  {t:'Lời mời từ Giốp-bê',x:'Hai người từ Giốp-bê vội đến mời Phi-e-rơ: Ta-bi-tha, người hay làm việc lành, đã qua đời. Ê-li đi theo.',ref:'Theo Công vụ 9:36-38',cam:[0,9,30,0,1.5,0]},
  {t:'Bà may áo cho người nghèo',x:'Ta-bi-tha, tiếng Hy Lạp gọi là Đô-ca, may nhiều áo cho các bà góa. Mọi người đều thương bà.',ref:'Theo Công vụ 9:36, 39',cam:[-8,3.4,6,-4,1.6,-3]},
  {t:'Căn phòng yên lặng',x:'Trên gác, các bà góa khóc và giơ ra những áo bà đã may. Phi-e-rơ nhẹ nhàng bước vào.',ref:'Theo Công vụ 9:39',cam:[5,3.6,2,0,1,-6]}],
 outro:'Việc đó đồn ra khắp thành Giốp-bê, và nhiều người tin Chúa.',outroRef:'Theo Công vụ 9:42',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:-4,r:42,h:16};
  W.paths=[[[0,28],[0,-2]],[[-22,6],[22,6]],[[14,6],[20,-12]]];
  const H=(x,z)=>{const r=Math.hypot(x,z);return 1+.35*noise(x,z)*sm(20,36,r)*sm(-20,-10,z)-4.5*sm(20,36,-z)+sm(40,150,r)*12*sm(8,30,z);};
  const sand=C('#e3d2a2'),g1=C('#a3bd5c'),g2=C('#c2c870'),stone=C('#d9cfb8'),dirt=C('#cdb98d'),sea=C('#b8a67a');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(dirt,1-sm(14,22,Math.hypot(x*.7,z-8)));c.lerp(sand,sm(-14,-20,z));c.lerp(sea,sm(-24,-32,z));c.lerp(stone,(1-sm(1.2,3,CQ.distPath(x,z)))*.7);}});
  CQ.sky({fogNear:55,fogFar:210,clouds:8});CQ.water({deep:2});
  CQ.scatter(1300,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-150,150),z=rr(-150,150);if(z<-18||Math.hypot(x,z-8)<24)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* houses of Joppa up the hill and along the quay */
  [[-20,-3,7,6,3.2,1.57],[-20,10,7,6,3.4,1.57],[21,14,7,6,3.2,-1.57],[-9,22,8,6,3.3,3.14],[10,25,8,6,3.5,3.14],[-30,20,7,6,3,1.57],[30,0,6,6,3,-1.57]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%3===0}));
  const simon=CQ.house(22,-12,8,6,3,-1.57,{stone:'lime',plaster:1,mat:'#8a5a34'});
  [[-14,-14],[15,-6],[-26,8],[26,26]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[-12,-16],[8,-18]].forEach(p=>CQ.palm(p[0],p[1],1.2));
  /* harbour: quay, boats, nets */
  mesh(new T.BoxGeometry(5,.4,18),M.wood,-16,.3,-24);
  CQ.boat(-8,-30,.3,{sail:1});CQ.boat(8,-35,-.5,{});CQ.boat(-22,-34,1.2,{});
  CQ.scatter(18,new T.DodecahedronGeometry(.5,0),toon('#a89878'),()=>{const x=rr(-30,30),z=rr(-23,-19);return[x,H(x,z)+.1,z,rr(.5,1.3),.7];},true);
  /* the upper court of Tabitha's house: rug, low walls, awning */
  const rug=mesh(new T.BoxGeometry(10,.06,8),toon('#c9a27a'),0,H(0,-6)+.05,-6);
  CQ.wallBox(0,-10.5,12,1.6,.8,0,M.lime);CQ.wallBox(-6,-6,.8,1.6,9,0,M.lime);CQ.wallBox(6,-6,.8,1.6,9,0,M.lime);
  const aw=mesh(new T.PlaneGeometry(12,5),M.cloth,0,H(0,-9)+3.4,-8.2);aw.rotation.x=-Math.PI/2;
  for(const x of[-5.6,5.6])mesh(new T.CylinderGeometry(.07,.07,3.4,6),M.wood,x,H(x,-10)+1.7,-10);
  const bed=mesh(new T.BoxGeometry(1.1,.4,2.6),toon('#7a5a3a'),0,H(0,-6)+.28,-6),mat=mesh(new T.BoxGeometry(1,.14,2.5),toon('#efe3c6'),0,H(0,-6)+.55,-6);
  W.obstacles.push({x:0,z:-6,w:1.2,d:2.7,rot:0,ox:0});
  /* drying rack: eight garments that appear one by one */
  const RX=-4.2,RZ=-1.2;mesh(new T.CylinderGeometry(.06,.06,3,6),M.wood,RX,H(RX,RZ)+1.5,RZ).rotation.z=Math.PI/2;
  for(const s of[-1.5,1.5])mesh(new T.CylinderGeometry(.06,.06,2.4,6),M.wood,RX+s,H(RX,RZ)+1.2,RZ);
  const cols=['#e08a4b','#5f8fb5','#b5483a','#7aa05c','#d9a441','#8a5a9a','#e9dcc0','#c9507a'],robes=[];
  for(let i=0;i<8;i++){const m=mesh(new T.BoxGeometry(.3,.9,.08),toon(cols[i]),RX-1.2+i*.34,H(RX,RZ)+2.15-.45+.3,RZ);m.position.y=H(RX,RZ)+2.2;m.visible=false;robes.push(m);}
  W.obstacles.push({x:RX,z:RZ,w:3.2,d:.5,rot:0,ox:0});
  /* sewing basket by the bed */
  mesh(new T.CylinderGeometry(.3,.24,.3,10),toon('#b08a5e'),1.4,H(1.4,-4)+.15,-4);
  /* Eli, a young man */
  W.player=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.86,head:1.08})),0,20,0);
  const peter=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.peter,{hair:'#8a8a82',beard:2})),-1.6,18,0);
  const m1=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#c9c0a8',mantle:'#7a8a9a',hair:'#4a3a2c',beard:1}),2,17,3.14),m2=CQ.place(CQ.makeChar(CQ.CAST.man),3.2,19,3.3);
  const wd=[[-2.8,-4,.6,CQ.CAST.woman],[2.8,-3.4,-.6,CQ.CAST.woman2],[-2.4,-7.8,.3,{skin:'#b9804f',tunic:'#8a5a9a',veil:'#e9dcc0',sash:'#d9a441',S:.93}],[3,-7.6,-.3,{skin:'#cf9a6e',tunic:'#5f7a9a',veil:'#d8d0c0',sash:'#b5483a',S:.93}]].map(a=>CQ.place(CQ.makeChar(a[3]),a[0],a[1],a[2]));
  const dor=CQ.place(CQ.makeChar({skin:'#cf9a6e',tunic:'#f4eee0',veil:'#e8dcc4',sash:'#c2503c',S:.95}),0,-4.9,0);dor.g.rotation.x=-Math.PI/2;dor.dy=.62;
  const tan=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#8d6a4a',hem:.4,sash:'#4a3220',hair:'#2a1d15',beard:2,W:1.1}),18.5,-9,1.57);
  const fish=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#a89878',hem:.3,sash:'#3f6f8f',hair:'#241a13',beard:1,band:'#e9dcc0'}),-13.5,-20,.4);
  CQ.crowd(CQ.ring(14,-2,5,2,5,-1,3),{});CQ.crowd(CQ.ring(-12,4,4,2,4,0,6),{});
  CQ.zones({A:{c:[0,0],r:36,tod:'day'}});
  CQ.goZone('A',0,20,0,null,true);
  CQ.addInter({id:'msg',P:m1,name:'người từ Giốp-bê',h:2.05,r:2.6});
  CQ.addInter({id:'peter',P:peter,name:'sứ đồ Phi-e-rơ',h:2.1,r:2.6});
  CQ.addInter({id:'widow',P:wd[0],name:'bà góa',verb:'Lại gần ',h:2,r:2.6});
  CQ.addInter({id:'dorcas',P:dor,name:'bà Ta-bi-tha',verb:'Lại gần ',h:1.3,r:2.8});
  CQ.addInter({id:'simon',P:tan,name:'thợ thuộc da Si-môn',h:2.05,r:2.8});
  CQ.addInter({id:'fish',P:fish,name:'người chài',h:2.05,side:1,run:d=>CQ.say('Người chài','Giốp-bê là cảng của chúng tôi. Ai đến đây cũng nghe tiếng bà Ta-bi-tha hay giúp người nghèo.','Theo Công vụ 9:36','Cảm ơn bác',d)});
  CQ.addInter({id:'wd2',P:wd[1],name:'bà góa mặc áo mới',h:2,side:1,run:d=>CQ.say('Bà góa','Chiếc áo nầy bà Ta-bi-tha may cho tôi. Ấm lắm cháu ạ.','Theo Công vụ 9:39','Dạ',d)});
  const cam=[3.5,3.2,-1,0,.9,-6];
  W.steps=[
   {at:'msg',text:'Lại gần người từ Giốp-bê',run:n=>CQ.lines([['Người kể chuyện','Hai người từ Giốp-bê đến mời Phi-e-rơ đi gấp, vì bà Ta-bi-tha đã qua đời.','Theo Công vụ 9:36-38'],['Ê-li','Con đi theo bác Phi-e-rơ lên nhà bà ạ.','Theo Công vụ 9:38']],()=>{CQ.walkTo(peter,0,-1.5,2.6,()=>CQ.face(peter,0,-6));n();})},
   {at:'widow',text:'Gặp các bà góa trên gác',run:n=>{CQ.setCine(cam);CQ.lines([['Bà góa','Xin bác xem những chiếc áo Ta-bi-tha đã may cho chúng tôi.','Theo Công vụ 9:39'],['Ê-li','Cháu mang áo lên đây ạ.','Theo Công vụ 9:39']],()=>
     CQ.tapFill({name:'Đưa áo lên',text:'Chạm vào từng chiếc áo để đưa lên cho Phi-e-rơ xem.',need:8,onP:p=>robes.forEach((m,i)=>{m.visible=i<Math.round(p*8);})},()=>{robes.forEach(m=>{m.visible=true;});CQ.setCine(null);n();}));}},
   {at:'peter',text:'Lại gần Phi-e-rơ',run:n=>{CQ.setCine(cam);CQ.say('Người kể chuyện','Phi-e-rơ biểu người ta ra ngoài hết, rồi quì gối mà cầu nguyện.','Công vụ 9:40',null,()=>{
     wd.forEach((w,i)=>CQ.walkTo(w,(i%2?9:-9),-1+i*2,2.4));CQ.walkTo(peter,0.2,-4.6,2.2,()=>CQ.face(peter,0,-6));CQ.setCine(null);n();});}},
   {at:'dorcas',text:'Đến bên giường bà Ta-bi-tha',run:n=>{CQ.setCine([3.8,2.6,-3.6,0,.8,-6]);CQ.say('Phi-e-rơ','Hỡi Ta-bi-tha, hãy chờ dậy!','Công vụ 9:40',null,()=>
     CQ.fillWord({name:'Phi-e-rơ',before:'Hỡi Ta-bi-tha, hãy',answer:'chờ dậy',after:'!',options:['chờ dậy','ngủ đi','đi xa'],ref:'Công vụ 9:40',wrong:'Chưa đúng. Nhớ lời Phi-e-rơ nói với bà.'},()=>{dor.g.rotation.x=0;dor.dy=.45;CQ.place(dor,0,-5.6,0);
     CQ.say('Người kể chuyện','Người mở mắt ra, thấy Phi-e-rơ thì ngồi dậy.','Theo Công vụ 9:40',null,()=>{CQ.setCine(null);n();});}));}},
   {at:'peter',text:'Nghe Phi-e-rơ báo tin vui',run:n=>{CQ.setCine(cam);CQ.say('Phi-e-rơ','Này, Ta-bi-tha đã sống rồi.','Theo Công vụ 9:41',null,()=>{
     wd.forEach((w,i)=>CQ.walkTo(w,(i%2?1.6:-1.6),-5.2-i*.3,2.6));
     CQ.say('Ê-li','Mọi người ơi, bà Ta-bi-tha sống lại rồi!','Theo Công vụ 9:42','Vui quá!',()=>CQ.choice({name:'Câu hỏi nhỏ',q:'Ta-bi-tha nổi tiếng nhờ việc gì?',options:['Làm việc lành và giúp người nghèo','Bán vàng bạc','Đánh cá giỏi'],ref:'Công vụ 9:36',wrong:'Chưa đúng. Bà hay may áo cho người nghèo.'},()=>{CQ.setCine(null);n();}));});}},
   {at:'simon',text:'Đến nhà thợ thuộc da Si-môn',run:n=>CQ.say('Người kể chuyện','Phi-e-rơ ở lại nhiều ngày tại Giốp-bê, nơi nhà người thợ thuộc da tên Si-môn.','Theo Công vụ 9:43',null,n)}];
 }});
