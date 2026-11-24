/* Chapter 36: Rome (Acts 28:11-31). Tin lanh to Rome; the text gives the day, so daylight is used.
   Quoted word for word (1925 text): Cong vu 28:15, 28:23, 28:30-31. */
'use strict';
CQ.chapters.push({id:'rome',no:36,title:'Phao-lô tại Rô-ma',sub:'Tin lành không ai ngăn cấm · ban ngày',
 intro:[
  {t:'Đường vào Rô-ma',x:'Sau ba tháng ở Man-tơ, họ xuống tàu đi tiếp. Họ đến Phô-rum Áp-bi-u, rồi đến Ba Quán trên đường vào Rô-ma.',ref:'Theo Công vụ 28:11-15',cam:[0,6,28,0,1.6,10]},
  {t:'Anh em ra đón',x:'Anh em ở Rô-ma nghe tin, bèn ra tận đường đón. Phao-lô cảm tạ Chúa và vững chí.',ref:'Theo Công vụ 28:15',cam:[6,3,20,0,1.6,12]},
  {t:'Nhà trọ thuê riêng',x:'Phao-lô được ở riêng với một người lính canh giữ. Ê-li bắt đầu mời khách đến.',ref:'Theo Công vụ 28:16',cam:[-10,5,2,0,1.6,-10]}],
 outro:'Người tiếp rước mọi người đến thăm mình, giảng về nước Đức Chúa Trời, và dạy dỗ về Đức Chúa Giê-su Christ cách tự do trọn vẹn, chẳng ai ngăn cấm người hết.',outroRef:'Công vụ 28:30-31',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:3,z:6,r:44,h:16};
  W.paths=[[[0,34],[0,-6]],[[-24,8],[0,8]]];
  const H=(x,z)=>.6+.35*noise(x,z)*sm(14,40,Math.hypot(x,z))+sm(55,150,Math.hypot(x,z))*12;
  const g1=C('#a9b868'),g2=C('#c3c27a'),pave=C('#cfc4aa'),st=C('#a69c88');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(st,(1-sm(1.6,3.2,CQ.distPath(x,z)))*.95);c.lerp(pave,(1-sm(8,10,Math.max(Math.abs(x),Math.abs(z+8)*.8)))*(z<2?.9:0));}});
  CQ.sky({fogNear:55,fogFar:190,clouds:6});
  CQ.scatter(1200,new T.ConeGeometry(.09,.3,4),toon('#98a850'),()=>{const x=rr(-140,140),z=rr(-120,150);if(CQ.distPath(x,z)<2||(Math.abs(x)<10&&z<2&&z>-20))return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(60,new T.BoxGeometry(.9,.1,.5),toon('#8d8574'),()=>{const z=rr(-4,34),s=R()<.5?-1:1;return[s*rr(1.6,2.2),H(0,z)+.08,z,rr(.7,1.2),R()*3];});
  /* the Appian Way: paving and tombs along the road, a milestone, cypress trees */
  for(const s of[-1,1]){[8,18,28].forEach(z=>{const t=mesh(new T.BoxGeometry(2.6,2.2,2.6),M.lime,s*7,H(s*7,z)+1.1,z);W.obstacles.push({x:s*7,z,w:2.6,d:2.6,rot:0,ox:0});});
   [3,13,23,33].forEach(z=>CQ.olive(s*(11+rr(0,2)),z,rr(1,1.3)));}
  const ms=mesh(new T.CylinderGeometry(.3,.38,1.7,8),M.lime,2.6,H(2.6,26)+.85,26);W.circles.push({x:2.6,z:26,r:.5});
  /* the forum and a market column, west of the road */
  const FX=-22,FZ=8;mesh(new T.BoxGeometry(14,.3,12),toon('#d6cbb0'),FX,H(FX,FZ)+.15,FZ,null,false);
  for(const [x,z] of[[-4,-4],[4,-4],[-4,4],[4,4]]){mesh(new T.CylinderGeometry(.5,.58,5.4,10),M.lime,FX+x,H(FX,FZ)+2.9,FZ+z);W.circles.push({x:FX+x,z:FZ+z,r:.8});}
  mesh(new T.BoxGeometry(10.5,.7,10.5),M.lime,FX,H(FX,FZ)+5.8,FZ);
  [[-24,-8,1.57],[-10,-3,1.57],[-36,0,0],[-32,-12,1.57]].forEach((a,i)=>CQ.house(a[0],a[1],7,6,3.2+i%2*.6,a[2],{stone:'lime',plaster:i%2,roofJars:i%2===0}));
  [[-18,20,.2,'#c2503c'],[-30,18,-.3,'#4f86c6']].forEach(s=>{const g=new T.Group();g.position.set(s[0],H(s[0],s[1]),s[1]);g.rotation.y=s[2];W.scene.add(g);
   mesh(new T.BoxGeometry(3,.9,1.2),M.wood,0,.45,0,g);const aw=mesh(new T.PlaneGeometry(3.4,1.8),toon(s[3],{side:T.DoubleSide}),0,2.5,0,g);aw.rotation.x=-1.2;
   for(const x of[-1.5,1.5])mesh(new T.CylinderGeometry(.05,.05,2.6,6),M.wood,x,1.3,-.5,g);for(let i=0;i<4;i++)CQ.jar(g,-1.1+i*.7,.9,0,.4);W.obstacles.push({x:s[0],z:s[1],w:3.2,d:1.4,rot:s[2],ox:0});});
  /* the rented lodging: a house at the back with an open courtyard */
  const IZ=-22;CQ.house(0,IZ,14,7,3.6,0,{stone:'lime',roofJars:1});
  CQ.wallBox(-9,-9,1,3,24,0,M.lime);CQ.wallBox(9,-9,1,3,24,0,M.lime);CQ.wallBox(-6.5,0,6,2.4,1,0,M.lime);CQ.wallBox(6.5,0,6,2.4,1,0,M.lime);
  mesh(new T.BoxGeometry(17,.12,22),toon('#d9ccb0'),0,H(0,-10)+.06,-10,null,false);
  CQ.olive(-6,-6,1.1);CQ.olive(6.5,-17,1);CQ.bush(-7,-14,1);
  const tb=new T.Group();tb.position.set(4,H(4,-8),-8);W.scene.add(tb);mesh(new T.BoxGeometry(2.4,.9,1.1),M.wood,0,.45,0,tb);mesh(new T.BoxGeometry(.7,.1,.5),toon('#e8dcb8'),.3,.95,0,tb);W.obstacles.push({x:4,z:-8,w:2.5,d:1.2,rot:0,ox:0});
  const scr=mesh(new T.CylinderGeometry(.06,.06,.5,6),toon('#e8dcb8'),-.4,1.05,0,tb);scr.rotation.z=1.57;
  const flag=new T.Group();flag.position.set(-4,H(-4,-1),-1);W.scene.add(flag);mesh(new T.CylinderGeometry(.05,.05,3.2,6),M.wood,0,1.6,0,flag);mesh(new T.BoxGeometry(1.1,.7,.05),toon('#a8262c'),.55,2.8,0,flag);
  /* people */
  const eliS=Object.assign({},CQ.CAST.eli,{S:.95,head:1.04,beard:1,hair:'#2e2018'});
  W.player=CQ.place(CQ.makeChar(eliS),2,32,Math.PI);
  const paul=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#e9dfc4',mantle:'#8a2f3a',sash:'#d9a441',hair:'#4a3a30',beard:1,band:'#e9dfc4',S:.97}),0,14,0);
  const luke=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#6f8f5a',mantle:'#d9b45a',sash:'#4a3a2c',hair:'#2e2018',beard:2,W:1.05}),2.4,15,-.6);
  const sol=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#a8262c',mantle:'#8c8f94',sash:'#5a4632',hair:'#2a1d15',beard:0,helm:1,S:1.02}),-2.2,12.6,.6);
  const sol2=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#a8262c',mantle:'#8c8f94',sash:'#5a4632',hair:'#2a1d15',helm:1}),-2.5,-1.6,0);
  CQ.crowd([[-3,18,.2],[-4.4,16.6,.5],[3.8,17.4,-.4],[5,15.8,-.6],[-2,20.2,0],[1.8,20.6,0]],{});
  const eld=[[-5,-7],[-6.5,-10],[-4,-13],[5,-12],[6.5,-9],[-1,-14],[1.6,-13],[-6,-3],[6,-5],[0,-5]].map((p,i)=>CQ.place(CQ.makeChar([CQ.CAST.man,CQ.CAST.man2,CQ.CAST.shepherd2,CQ.CAST.woman2][i%4]),p[0],p[1],Math.atan2(4-p[0],-8-p[1])));
  eld.forEach(g=>g.g.visible=false);
  const crowdG=eld;const boy=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.kid,{tunic:'#5f8f7a'})),-14,16,.5);
  const seller=CQ.place(CQ.makeChar(CQ.CAST.woman),-17,17,.3);
  CQ.zones({A:{c:[0,6],r:50,tod:'day'}});
  CQ.addInter({id:'paul',P:paul,name:'Phao-lô',h:2.1});
  CQ.addInter({id:'inn',obj:tb,x:4,z:-8,name:'nhà trọ',verb:'Vào ',h:1.8,r:3});
  CQ.addInter({id:'elder',P:eld[0],name:'khách',h:2.1,r:3.2});
  CQ.addInter({id:'boy',P:boy,name:'cậu bé',h:1.65,side:1,run:d=>CQ.say('Cậu bé','Đường Áp-bi-a dài lắm! Cháu đếm đá đến mỏi cả chân.','Theo Công vụ 28:15','Cảm ơn cháu',d)});
  CQ.addInter({id:'seller',P:seller,name:'bà bán hàng',h:2,side:1,run:d=>CQ.say('Bà bán hàng','Rô-ma có đủ người từ khắp nơi đến. Ông khách kia hình như có tin vui lắm.','Theo Công vụ 28:16','Cảm ơn bà',d)});
  CQ.goZone('A',2,32,Math.PI,null,true);
  const RD=[6,3,24,0,1.6,13],IN=[-7,3.6,-1,2,1.4,-9],CH=[-6,3,-3,3,1.5,-9];
  W.steps=[
   {at:'paul',text:'Anh em ra đón: lại gần Phao-lô',run:n=>{CQ.setCine(RD);CQ.face(paul,W.player.x,W.player.z);
     CQ.say('Người kể chuyện','Phao-lô thấy anh em, thì cảm tạ Đức Chúa Trời và vững chí.','Công vụ 28:15',null,()=>
     CQ.fillWord({name:'Người kể chuyện',before:'Phao-lô thấy anh em, thì',after:' Đức Chúa Trời và vững chí.',options:['cảm tạ','phàn nàn','bỏ chạy'],answer:'cảm tạ',ref:'Công vụ 28:15',wrong:'Chưa đúng. Phao-lô rất vui khi gặp anh em.'},()=>{CQ.setCine(null);
      CQ.walkTo(paul,0,-6,3.4);CQ.walkTo(luke,2,-5,3.4);CQ.walkTo(sol,-2,-4.6,3.4,()=>CQ.face(sol,0,-6));n();}));}},
   {at:'inn',text:'Vào nhà trọ thuê riêng',run:n=>{CQ.setCine(IN);
     CQ.say('Ê-li','Cháu mang giỏ vào ạ. Nhà trọ thoáng quá!','Theo Công vụ 28:16','Dạ',()=>{CQ.setCine(null);eld.forEach(g=>g.g.visible=true);n();});}},
   {at:'elder',text:'Mời khách đến nghe Phao-lô',run:n=>{CQ.setCine(CH);CQ.face(paul,-5,-8);
     CQ.say('Phao-lô','Hỡi anh em ta, tôi chẳng từng làm điều gì nghịch cùng dân chúng.','Theo Công vụ 28:17','Nghe tiếp',()=>
     CQ.tapFill({name:'Mời khách',text:'Chạm vào từng vị khách để mời họ vào nhà nghe Phao-lô nói.',need:10,onP:p=>{flag.rotation.y=p*.8;eld.forEach((g,i)=>{if(i<p*eld.length)CQ.face(g,0,-6);});}},()=>{CQ.setCine(null);n();}));}},
   {at:'paul',text:'Từ sáng đến chiều: nghe Phao-lô giảng',run:n=>{CQ.setCine(CH);
     CQ.say('Người kể chuyện','Từ buổi sáng đến chiều, người cứ làm chứng và giảng giải với họ về nước Đức Chúa Trời, lấy luật pháp Môi-se và các đấng tiên tri mà gắng sức khuyên bảo họ về Đức Chúa Giê-su.','Công vụ 28:23',null,()=>
     CQ.choice({name:'Người kể chuyện',q:'Phao-lô giảng cho họ về điều gì?',options:['Nước Đức Chúa Trời và Đức Chúa Giê-su','Cách làm giàu','Cách đi biển'],ref:'Công vụ 28:23',wrong:'Chưa đúng. Phao-lô chỉ nói về Tin lành.'},()=>{CQ.setCine(null);n();}));}},
   {at:'paul',text:'Hai năm không ai ngăn cấm',run:n=>{CQ.setCine(CH);
     CQ.say('Người kể chuyện','Người tiếp rước mọi người đến thăm mình, giảng về nước Đức Chúa Trời, và dạy dỗ về Đức Chúa Giê-su Christ cách tự do trọn vẹn, chẳng ai ngăn cấm người hết.','Công vụ 28:30-31',null,()=>
     CQ.order({name:'Người kể chuyện',q:'Ghép lại câu cuối của sách Công vụ.',chunks:['giảng về nước Đức Chúa Trời,','và dạy dỗ về Đức Chúa Giê-su Christ','cách tự do trọn vẹn,','chẳng ai ngăn cấm người hết.'],ref:'Công vụ 28:31'},()=>{CQ.setCine(null);n();}));}}];
 }});
