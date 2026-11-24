/* Chapter 20: the lame man at the Beautiful Gate (Acts 3:1-10). Set in the afternoon at the ninth hour (3:1), so daylight.
   Quoted word for word (1925 text): Công vụ 3:6, 3:7-8. */
'use strict';
CQ.chapters.push({id:'gate',no:20,title:'Người què ở Cổng Đẹp',sub:'Hãy bước đi · buổi chiều',
 intro:[
  {t:'Giờ cầu nguyện',x:'Chiều hôm ấy, Phi-e-rơ và Giăng lên đền thờ vào giờ cầu nguyện thứ chín. Ê-li đi theo sau, tay xách giỏ nhỏ.',ref:'Theo Công vụ 3:1',cam:[0,6,24,0,2.5,-6]},
  {t:'Người ngồi bên cổng',x:'Có một người què từ lúc mới sanh, hằng ngày được khiêng đến ngồi bên Cổng Đẹp để xin ăn.',ref:'Theo Công vụ 3:2',cam:[-1,3.2,-1,-3,1.4,-10]},
  {t:'Ánh mắt hiền lành',x:'Người ấy vừa chìa tay ra thì hai sứ đồ dừng lại nhìn. Một điều tốt đẹp hơn tiền bạc sắp đến.',ref:'Theo Công vụ 3:3-4',cam:[3,2.6,-3,-3,1.5,-10]}],
 outro:'Người liền nhảy, đứng lên và bước đi cùng hai người vào đền thờ, vừa đi, vừa nhảy, vừa ngợi khen Đức Chúa Trời.',outroRef:'Công vụ 3:8',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:3,z:-4,r:38,h:15};
  W.paths=[[[0,22],[0,-10]],[[-18,4],[18,4]]];
  const H=(x,z)=>1+.4*noise(x,z)*sm(26,40,Math.hypot(x,z))+sm(55,150,Math.hypot(x,z))*12;
  const paved=C('#d9cfb8'),g1=C('#a3bd5c'),g2=C('#c2c870'),dirt=C('#cdb98d');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(dirt,1-sm(24,30,Math.hypot(x,z*.8)+noise(x*3,z*3)));c.lerp(paved,(1-sm(20,23,Math.max(Math.abs(x)*.9,Math.abs(z-3))))*.9);}});
  CQ.sky({fogNear:55,fogFar:200,clouds:8});
  CQ.scatter(1400,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-150,150),z=rr(-150,150);if(Math.max(Math.abs(x)*.9,Math.abs(z-3))<24)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* doves on the paving */
  CQ.scatter(30,new T.SphereGeometry(.14,6,5),toon('#f4f1ea'),()=>{const x=rr(-14,14),z=rr(-6,12);return[x,H(x,z)+.14,z,rr(.8,1.2),.8];});
  /* the temple wall with the bronze gate */
  const wall=CQ.wallBox(0,-17,46,6.5,1.4,0,M.lime),gm=toon('#d9a441'),gz=-16.2;
  for(const s of[-1,1]){mesh(new T.BoxGeometry(1.4,6.2,1.2),M.lime,s*4.6,H(0,gz)+3.1,gz);
    mesh(new T.BoxGeometry(3.5,5,.2),gm,s*1.8,H(0,gz)+2.5,gz+.1);mesh(new T.BoxGeometry(.18,5.1,.3),M.woodD,s*.05,H(0,gz)+2.5,gz+.15);
    for(let k=0;k<3;k++)mesh(new T.CylinderGeometry(.16,.16,.1,10),toon('#a8752a'),s*1.8+(k-1)*.9,H(0,gz)+2.8,gz+.25).rotation.x=Math.PI/2;}
  mesh(new T.BoxGeometry(10.6,1,1.4),M.lime,0,H(0,gz)+5.6,gz);mesh(new T.BoxGeometry(11.2,.35,1.8),M.mud,0,H(0,gz)+6.3,gz);
  mesh(new T.BoxGeometry(46,.35,1.9),M.mud,0,H(0,-17)+6.55,-17);
  /* the temple behind, a gold-trimmed block above the wall */
  mesh(CQ.boxUV(26,6,10,3),M.lime,0,H(0,-26)+9,-27);mesh(new T.BoxGeometry(27,.5,11),toon('#d9a441'),0,H(0,-26)+12.2,-27);
  /* colonnades on both sides of the court */
  for(const s of[-1,1])for(let i=0;i<5;i++){const x=s*16,z=-13+i*4.4;mesh(new T.CylinderGeometry(.42,.5,4.2,10),M.lime,x,H(x,z)+2.1,z);mesh(new T.BoxGeometry(1.2,.3,1.2),M.lime,x,H(x,z)+4.3,z);W.circles.push({x,z,r:.6});}
  for(const s of[-1,1]){mesh(new T.BoxGeometry(1.4,.4,19.5),M.woodD,s*16,H(s*16,-3)+4.6,-3.4);const rf=mesh(new T.PlaneGeometry(4.6,19.5),M.cloth,s*18.2,H(s*16,-3)+4.6,-3.4);rf.rotation.x=-Math.PI/2;}
  /* houses and trees round the edge */
  [[-27,6,7,7,3.4,1.57],[-27,16,7,6,3,1.57],[27,8,7,7,3.2,-1.57],[27,18,6,6,3,-1.57],[-12,26,8,6,3.2,3.14],[12,27,8,6,3.4,3.14]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%3===0}));
  [[-22,-8],[22,-8],[-33,26],[33,28],[0,32]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[-8,28],[8,30]].forEach(p=>CQ.palm(p[0],p[1],1.2));
  /* pilgrims */
  CQ.crowd(CQ.ring(-9,2,8,2,5,-1,1),{});CQ.crowd(CQ.ring(10,4,8,2,5,2.2,4),{});CQ.crowd(CQ.ring(0,-3,6,7,9,3.5,5.9),{});
  /* people */
  const peter=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.peter)),-2.2,14,0),john=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.john,{hairLong:0,beard:1,W:1.02})),2.2,14,0);
  const mat=mesh(new T.BoxGeometry(2,.06,1.3),toon('#a5483a'),-3,H(-3,-12)+.04,-12);mat.rotation.y=.2;
  const lame=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#9a8a6a',hem:.3,mantle:'#6f6a5a',hair:'#2a1d15',beard:1,staff:1,S:.9}),-3,-12,.3);
  const crutch=mesh(new T.CylinderGeometry(.04,.04,1.4,6),M.wood,-4.4,H(-4.4,-12)+.7,-12.2);crutch.rotation.z=.25;crutch.visible=false;
  const man=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#b5483a',mantle:'#e9dcc0',hair:'#3a281c',beard:2,band:'#e9dcc0'}),9,-6,.9);
  const merchant=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#5f8f7a',veil:'#e6d3ab',sash:'#d9a441',jar:1,S:.93}),-8,-3,-.6);
  const priest=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#ffffff',mantle:'#3a4f8f',sash:'#d9a441',hair:'#d9d4c8',beard:2,band:'#ffffff'}),8,-10,1.2);
  W.player=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.82,head:1.1})),0,17,0);
  let hop=0;W.tick.push((dt,t)=>{if(hop)lame.dy=Math.abs(Math.sin(t*7))*.5;});
  CQ.zones({A:{c:[0,2],r:34,tod:'day'}});
  CQ.goZone('A',0,17,0,null,true);
  CQ.addInter({id:'john',P:john,name:'sứ đồ Giăng',h:2.05,r:2.6});
  CQ.addInter({id:'lame',P:lame,name:'người què',verb:'Lại gần ',h:2.05,r:2.8});
  CQ.addInter({id:'peter',P:peter,name:'sứ đồ Phi-e-rơ',h:2.1,r:2.8});
  CQ.addInter({id:'man',P:man,name:'người đi lễ',h:2.05,r:2.6});
  CQ.addInter({id:'merchant',P:merchant,name:'bà bán bình',h:2,r:2.6});
  CQ.addInter({id:'priest',P:priest,name:'ông lão đi lễ',h:2.05,side:1,run:d=>CQ.say('Ông lão','Bác đến đền thờ cầu nguyện mỗi chiều. Người ngồi bên cổng ấy ngày nào cũng ở đó.','Theo Công vụ 3:2','Cảm ơn bác',d)});
  const walkIn=()=>CQ.walkTo(lame,0,-8,2.4,()=>{hop=0;lame.dy=0;});
  W.steps=[
   {at:'john',text:'Lại gần bác Giăng',run:n=>CQ.lines([['Ê-li','Cổng Đẹp lớn quá, bác Giăng ạ. Sao mà đông người thế!','Theo Công vụ 3:1-2'],['Giăng','Giờ cầu nguyện mà. Con đi sát bên bác nhé.','Theo Công vụ 3:1']],()=>{CQ.walkTo(peter,-1.4,-6,2.6);CQ.walkTo(john,1.4,-6,2.6);n();})},
   {at:'lame',text:'Lại gần người ngồi xin ăn bên cổng',run:n=>{CQ.setCine([2.5,3,-5,-3,1.3,-12]);CQ.lines([['Người què','Xin thương tôi, cho tôi chút tiền.','Theo Công vụ 3:3'],['Ê-li','Cháu chỉ có ít đồng xu. Cháu xin gửi bác ạ.','Theo Công vụ 3:3']],()=>{CQ.setCine(null);n();});}},
   {at:'peter',text:'Nghe Phi-e-rơ nói với người què',run:n=>{CQ.face(peter,-3,-12);CQ.setCine([2,2.8,-6,-3,1.5,-12]);CQ.say('Phi-e-rơ','Ta chẳng có vàng bạc chi hết, song đều ta có thì ta cho ngươi: nhơn danh Đức Chúa Giê-su Christ ở Na-xa-rét, hãy bước đi!','Công vụ 3:6',null,()=>
     CQ.fillWord({name:'Phi-e-rơ',before:'Ta chẳng có vàng bạc chi hết, song đều ta có thì ta cho ngươi: nhơn danh Đức Chúa Giê-su Christ ở Na-xa-rét, hãy',answer:'bước đi',after:'!',options:['bước đi','ngủ đi','chạy trốn'],ref:'Công vụ 3:6',wrong:'Chưa đúng. Hãy nhớ lời Phi-e-rơ nói với người què.'},()=>{CQ.setCine(null);n();}));}},
   {at:'lame',text:'Giúp người què đứng dậy',run:n=>{CQ.setCine([2.5,3,-5,-3,1.3,-12]);CQ.say('Người kể chuyện','Tức thì bàn chơn và mắt cá người trở nên cứng vững; người liền nhảy, đứng lên và bước đi cùng hai người vào đền thờ, vừa đi, vừa nhảy, vừa ngợi khen Đức Chúa Trời.','Công vụ 3:7-8',null,()=>
     CQ.tapFill({name:'Hãy bước đi',text:'Chạm thật nhanh để giúp người ấy bước từng bước tới sân đền thờ.',need:10,onP:p=>{crutch.visible=p>.2;}},()=>{hop=1;crutch.visible=true;walkIn();CQ.setCine(null);n();}));}},
   {at:'man',text:'Dân chúng kinh ngạc, lại gần người đi lễ',run:n=>{CQ.setCine([8,3.4,-1,0,1.6,-8]);CQ.lines([['Người kể chuyện','Dân chúng nhận ra người từng ngồi xin ăn ở Cổng Đẹp, bèn lấy làm lạ và sững sờ.','Theo Công vụ 3:9-10'],['Phi-e-rơ','Sao các anh lạ lùng? Chẳng phải do quyền phép của chúng tôi, nhưng do danh Chúa Giê-su.','Theo Công vụ 3:12-16']],()=>
     CQ.choice({name:'Người đi lễ',q:'Nhờ danh ai mà người què được lành?',options:['Đức Chúa Giê-su Christ','Một vị thầy thuốc','May mắn mà thôi'],ref:'Công vụ 3:6',wrong:'Chưa đúng. Phi-e-rơ đã nói người ấy được lành nhờ danh nào?'},()=>{CQ.setCine(null);n();}));}},
   {at:'merchant',text:'Chạy báo tin cho bà bán bình',run:n=>CQ.say('Ê-li','Mọi người ơi, bác ấy đi được rồi! Nhờ danh Chúa Giê-su!','Theo Công vụ 3:9-10','Vui quá!',n)}];
 }});
