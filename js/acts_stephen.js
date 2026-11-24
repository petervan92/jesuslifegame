/* Chapter 22: Stephen (Acts 6:1-7; 7:54-60). The passage gives no time of day, so the scene is set in daylight.
   Quoted word for word (1925 text): Cong vu 6:3, 6:15, 7:60. */
'use strict';
CQ.chapters.push({id:'stephen',no:22,title:'Ê-tiên, gương mặt thiên sứ',sub:'Lời cầu nguyện hiền lành · ban ngày',
 intro:[
  {t:'Cần thêm người giúp việc',x:'Số tín đồ càng đông, các bà góa cần được chăm sóc chu đáo. Các sứ đồ muốn dành thì giờ cầu nguyện và giảng dạy.',ref:'Theo Công vụ 6:1-4',cam:[8,5,12,12,1.6,3]},
  {t:'Bảy người được chọn',x:'Cả hội chọn Ê-tiên, Phi-líp và năm người khác. Ê-tiên đầy đức tin và Đức Thánh Linh.',ref:'Theo Công vụ 6:5',cam:[-8,3.4,9,-13,1.6,2]},
  {t:'Gương mặt như thiên sứ',x:'Có người ghen ghét đưa Ê-tiên ra tòa công luận. Mọi người nhìn thấy mặt người như mặt thiên sứ.',ref:'Theo Công vụ 6:8-15',cam:[0,5,-2,0,2,-12]}],
 outro:'Lạy Chúa, xin đừng đổ tội nầy cho họ!',outroRef:'Công vụ 7:60',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:-4,r:42,h:17};
  W.paths=[[[0,22],[0,-8]],[[-14,6],[10,5]],[[0,-8],[24,-6]]];
  const H=(x,z)=>{const r=Math.hypot(x,z+2);return .8+.4*noise(x,z)*sm(10,30,r)+sm(52,140,r)*10;};
  const g1=C('#b2b86a'),g2=C('#c6c27c'),pave=C('#d9cba7');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(pave,(1-sm(1.8,3.6,CQ.distPath(x,z)))*.9);c.lerp(pave,(1-sm(8,13,Math.hypot(x,z+13)))*.8);}});
  CQ.sky({fogNear:55,fogFar:190,clouds:7});
  CQ.scatter(1300,new T.ConeGeometry(.09,.3,4),toon('#8ea64c'),()=>{const x=rr(-140,140),z=rr(-140,140);if(Math.hypot(x,z+2)<30||CQ.distPath(x,z)<2)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* the city wall and the houses of Jerusalem */
  CQ.wallBox(0,-33,76,5.5,1.4,0,M.lime);CQ.wallBox(37,0,1.4,5.5,66,0,M.lime);
  for(let i=-7;i<=7;i++){CQ.wallBox(i*5,-33,1.6,1,1.5,0,M.lime);}
  CQ.wallBox(-37,0,1.4,5,66,0,M.lime);
  [[-27,-14,7,6,3.2,1.57],[-28,12,7,6,3,1.57],[26,16,7,6,3.1,-1.57],[-10,-28,8,5,3.4,0],[12,-28,8,5,3,0]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%2===0}));
  [[-20,20],[22,-18],[18,24]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[-6,20],[8,22]].forEach(p=>CQ.palm(p[0],p[1],1.1));
  /* the council hall: stone floor, columns, flat roof, long benches */
  const HZ=-14,st=M.lime;
  mesh(new T.BoxGeometry(18,.3,12),toon('#cdbf9a'),0,H(0,HZ)+.15,HZ);
  mesh(CQ.boxUV(18,5,.8,2.6),st,0,H(0,HZ)+2.5,HZ-6.2);
  mesh(new T.BoxGeometry(19,.4,12.6),M.mud,0,H(0,HZ)+5.2,HZ);W.obstacles.push({x:0,z:HZ-6.2,w:18,d:1.2,rot:0,ox:0});
  for(const x of[-8.6,8.6])for(const z of[HZ-5.4,HZ+5.4]){mesh(new T.CylinderGeometry(.35,.4,5,10),st,x,H(x,z)+2.5,z);W.circles.push({x,z,r:.6});}
  const bench=toon('#7a5233');[[-6,-17],[-6,-14.6],[6,-17],[6,-14.6]].forEach(b=>{mesh(new T.BoxGeometry(3.6,.5,.7),bench,b[0],H(b[0],b[1])+.5,b[1]);W.obstacles.push({x:b[0],z:b[1],w:3.6,d:.8,rot:0,ox:0});});
  const elderCols=[{skin:'#b27a4e',tunic:'#e9e1cf',mantle:'#5a3f7a',hair:'#d9d4c8',beard:2,band:'#5a3f7a'},{skin:'#b9804f',tunic:'#f0e8d4',mantle:'#8a3a4a',hair:'#ebe3d0',beard:2,band:'#8a3a4a'}];
  [[-6.8,-17,0],[-5.2,-17,0],[5.2,-17,0],[6.8,-17,0],[-6,-14.6,0],[6,-14.6,0]].forEach((p,i)=>CQ.place(CQ.makeChar(Object.assign({sit:1},elderCols[i%2])),p[0],p[1],p[2]));
  const elder=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#f5efdc',mantle:'#2f4a78',hair:'#ebe3d0',beard:2,band:'#d9a441',staff:1}),3.4,-9.6,.6);
  /* Stephen: white and blue, with a gentle light that grows on his face */
  const stephen=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#fbf8ee',hem:.45,mantle:'#78a9dc',sash:'#e2b84a',hair:'#4a3020',beard:1,band:'#e2b84a'}),-11.5,3,1.3);
  const glow=new T.PointLight('#fff2c4',0,9,1.6);glow.position.set(0,2.4,-9);W.scene.add(glow);let gl=0;W.tick.push(dt=>{glow.intensity+=(gl-glow.intensity)*Math.min(1,dt*1.5);});
  /* the table with bread baskets and the families */
  const tab=new T.Group();tab.position.set(-14,H(-14,0),0);W.scene.add(tab);mesh(new T.BoxGeometry(4.4,.9,1.2),M.wood,0,.45,0,tab);mesh(new T.BoxGeometry(4.6,.06,1.3),toon('#efe3c6'),0,.92,0,tab);W.obstacles.push({x:-14,z:0,w:4.4,d:1.3,rot:0,ox:0});
  const loaves=[];for(let i=0;i<10;i++){const l=mesh(new T.SphereGeometry(.2,8,6),toon('#d9a25a'),-1.9+i*.42,1.1,rr(-.2,.2),tab);l.scale.y=.6;loaves.push(l);}
  for(const x of[-2,2])CQ.jar(tab,x,.95,.4,.3);
  CQ.crowd(CQ.ring(-14,5.2,9,2.2,4,-.2,3.4),{});
  const widow=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.woman2,{S:.9,tunic:'#4a4a58'})),-9.4,6.4,3.8);
  const kid=CQ.place(CQ.makeChar(CQ.CAST.kid),-17.4,5,.6);
  const phil=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#c4d4a0',hem:.4,sash:'#6b4a2f',hair:'#241a13',beard:1,band:'#6b8f4a'}),-16,-3.4,.2);
  /* the apostles */
  const peter=CQ.place(CQ.makeChar(CQ.CAST.peter),11,4,-1.7),john=CQ.place(CQ.makeChar(CQ.CAST.john),12.6,6.4,-2.4);
  CQ.crowd(CQ.ring(14,5,7,2.6,4.6,-1.8,1.4),{});
  /* Saul keeps the cloaks outside the wall of the city, far from us */
  const saul=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#3f3a44',mantle:'#2a2630',sash:'#8a3a4a',hair:'#241a13',beard:1,band:'#d9d4c8'}),30,-16.5,1.57);
  CQ.crowd(CQ.ring(27,-10,6,3,5,2,3.8),{});
  const cloaks=mesh(new T.SphereGeometry(.4,8,6),toon('#8d7656'),30.2,H(30,-15)+.3,-15,null);cloaks.scale.y=.6;
  const hand=W.player=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.8,head:1.1})),0,16,3.14);
  CQ.zones({A:{c:[0,-6],r:42,tod:'day'}});
  CQ.addInter({id:'kid',P:kid,name:'em bé nhà bà góa',h:2.05,side:1,run:d=>CQ.say('Em bé','Anh Ê-tiên cho nhà em bánh mỗi ngày! Anh ấy hiền lắm.','Theo Công vụ 6:1-5','Hay quá!',d)});
  CQ.addInter({id:'widow',P:widow,name:'bà góa',h:2,side:1,run:d=>CQ.say('Bà góa','Cảm ơn hội thánh đã nhớ đến tôi. Xin Chúa ban phước cho các con.','Theo Công vụ 6:1','Dạ',d)});
  CQ.addInter({id:'peter',P:peter,name:'sứ đồ Phi-e-rơ',h:2.2});
  CQ.addInter({id:'stephen',P:stephen,name:'Ê-tiên',h:2.1});
  CQ.addInter({id:'elder',P:elder,name:'trưởng lão tòa công luận',h:2.2});
  CQ.addInter({id:'phil',P:phil,name:'Phi-líp',h:2.1});
  CQ.goZone('A',0,16,0,null,true);
  W.steps=[
   {at:'peter',text:'Lắng nghe sứ đồ Phi-e-rơ',run:n=>{CQ.setCine([6,3.2,11,11,1.8,4]);
     CQ.lines([['Phi-e-rơ','Anh em hãy chọn trong bọn mình bảy người có danh tốt, đầy dẫy Đức Thánh Linh và trí khôn, rồi chúng ta sẽ giao việc nầy cho.','Công vụ 6:3']],()=>
      CQ.fillWord({name:'Phi-e-rơ',before:'Anh em hãy chọn trong bọn mình',answer:'bảy người',after:' có danh tốt, đầy dẫy Đức Thánh Linh và trí khôn.',options:['bảy người','một người','hai mươi người'],ref:'Công vụ 6:3',wrong:'Chưa đúng. Nghe lại lời Phi-e-rơ nhé.'},()=>{CQ.setCine(null);n();}));}},
   {at:'stephen',text:'Giúp Ê-tiên phát đồ ăn',run:n=>{CQ.setCine([-9,3.6,9,-14,1.4,2]);
     CQ.lines([['Ê-li','Anh Ê-tiên, em xin xách giỏ giúp anh nhé.','Theo Công vụ 6:1-5'],['Ê-tiên','Cảm ơn em. Làm việc nhỏ cho người khác cũng là làm việc cho Chúa.','Theo Công vụ 6:3-5']],()=>
      CQ.tapFill({name:'Phát bánh',text:'Chạm vào từng gia đình để phát phần ăn cho họ.',need:10,onP:p=>loaves.forEach((l,i)=>{l.visible=i>=Math.round(p*10);})},()=>{loaves.forEach(l=>{l.visible=false;});CQ.setCine(null);n();}));}},
   {at:'elder',text:'Tòa công luận đang họp, lại gần xem',run:n=>{CQ.walkTo(stephen,0,-10.6,3,()=>CQ.face(stephen,W.player.x,W.player.z));CQ.setCine([5,2.6,-3.5,0,1.9,-10.6]);gl=1.1;
     CQ.lines([['Người kể chuyện','Bấy giờ, phàm những người ngồi tại tòa công luận đều ngó chăm Ê-tiên, thấy mặt người như mặt thiên sứ vậy.','Công vụ 6:15']],()=>{CQ.setCine(null);n();});}},
   {at:'stephen',text:'Nghe Ê-tiên nói',run:n=>{CQ.setCine([-4,2.6,-5,0,1.9,-10.6]);
     CQ.lines([['Ê-tiên','Tổ phụ chúng ta, Áp-ra-ham, Môi-se, đều được Chúa dẫn dắt. Nhưng nhiều người cứng lòng, không chịu nghe.','Theo Công vụ 7:2-53']],()=>
      CQ.choice({name:'Ê-tiên',q:'Ê-tiên có gương mặt như thế nào?',options:['Như mặt thiên sứ','Như mặt vua','Như mặt người giận dữ'],ref:'Công vụ 6:15',wrong:'Chưa đúng. Nhớ lại lời kể ở tòa công luận nhé.'},()=>{
       CQ.setCine(null);CQ.fade(()=>{gl=.6;CQ.place(stephen,23,-6,-1.57);CQ.face(stephen,20,-6);});n();}));}},
   {at:'stephen',text:'Đến bên Ê-tiên ngoài tường thành',run:n=>{CQ.setCine([17,3.2,-1,23,1.7,-6]);
     CQ.lines([['Ê-tiên','Lạy Chúa, xin đừng đổ tội nầy cho họ!','Công vụ 7:60'],['Người kể chuyện','Ê-tiên ngủ trong Chúa. Có một thanh niên tên Sau-lơ đứng đó, chưa biết rằng Chúa sẽ gọi người.','Theo Công vụ 7:58-60']],()=>
      CQ.order({name:'Ê-tiên',q:'Ghép lời cầu nguyện của Ê-tiên.',chunks:['Lạy Chúa,','xin đừng đổ tội nầy','cho họ!'],ref:'Công vụ 7:60'},()=>{stephen.g.visible=false;gl=0;CQ.setCine(null);n();}));}},
   {at:'phil',text:'Đến an ủi Phi-líp',run:n=>{
     CQ.lines([['Ê-li','Anh Ê-tiên đã tha thứ cho cả những người làm đau anh. Em sẽ nhớ mãi.','Theo Công vụ 7:60; 8:2']],n);}}];
 }});
