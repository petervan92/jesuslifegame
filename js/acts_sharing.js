/* Chapter 21: one heart and one soul (Acts 2:44-47; 4:32-37; 5:17-20). Daylight in the Portico of Solomon at the temple.
   Quoted word for word (1925 text): Cong vu 4:32, 5:20. */
'use strict';
CQ.chapters.push({id:'sharing',no:21,title:'Một lòng một ý',sub:'Của cải chung · ban ngày',
 intro:[
  {t:'Hội thánh đầu tiên',x:'Hằng ngày các tín đồ nhóm tại đền thờ, bẻ bánh và dùng bữa chung với nhau cách vui vẻ.',ref:'Theo Công vụ 2:46-47',cam:[2,6,22,0,2,-4]},
  {t:'Chia sẻ cho nhau',x:'Ai có của dư thì bán đi, đem tiền chia cho người thiếu. Ê-li giúp phát bánh cho các gia đình.',ref:'Theo Công vụ 4:34-35',cam:[-12,5,6,-7,1.6,-4]},
  {t:'Một người tên Giô-sép',x:'Có một người Lê-vi quê ở đảo Chíp-rơ, tên Giô-sép. Các sứ đồ gọi người là Ba-na-ba, nghĩa là con trai của sự yên ủi.',ref:'Theo Công vụ 4:36',cam:[14,4,6,9,1.8,2]}],
 outro:'Chẳng ai kể của mình là của riêng; nhưng kể mọi vật là của chung cho nhau.',outroRef:'Công vụ 4:32',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:-2,r:34,h:14};
  W.paths=[[[0,22],[0,-10]],[[0,4],[-17,4]],[[0,4],[12,2]]];
  const H=(x,z)=>{const r=Math.hypot(x,z);return 1+.4*noise(x,z)*sm(24,38,r)+sm(55,150,r)*12;};
  const floor=C('#d9cfb6'),g1=C('#a8bd62'),g2=C('#c6c978');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(floor,(1-sm(24,29,Math.hypot(x,z)+noise(x*3,z*3)*2))*.95);}});
  CQ.sky({fogNear:55,fogFar:200,clouds:8});
  CQ.scatter(1200,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-150,150),z=rr(-150,150);if(Math.hypot(x,z)<28)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* the temple wall behind the portico and houses of the city at the sides */
  CQ.wallBox(0,-21,46,7,2.5,0,M.lime);
  [[-28,-12,7,8,3.6,1.57],[28,-12,7,8,3.4,-1.57],[28,8,7,7,3,-1.57],[-14,-27,7,6,3.2,0],[14,-27,7,6,3.4,0]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%2===0}));
  [[-30,16],[30,20],[-26,-24]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));CQ.palm(24,22,1.2);CQ.palm(-24,22,1.1);
  /* the portico: a roofed colonnade along the north side */
  const col=toon('#e6dcc4'),y0=H(0,-16);
  const roof=mesh(new T.BoxGeometry(34,.5,6),M.lime,0,y0+4.9,-17);
  mesh(new T.BoxGeometry(34,.3,.5),M.woodD,0,y0+4.5,-14.2);
  for(let i=0;i<9;i++){const x=-16+i*4;mesh(new T.CylinderGeometry(.42,.5,4.6,12),col,x,y0+2.3,-14.3);mesh(new T.CylinderGeometry(.58,.58,.25,12),col,x,y0+4.5,-14.3);W.circles.push({x,z:-14.3,r:.55});}
  /* long table of shared bread, baskets of cloth and oil jars */
  const tg=new T.Group();tg.position.set(-6,H(-6,-6),-6);W.scene.add(tg);
  mesh(new T.BoxGeometry(5.4,.7,1.3),toon('#9a6a40'),0,.35,0,tg);mesh(new T.BoxGeometry(5.5,.05,1.4),toon('#efe3c6'),0,.72,0,tg);
  const loaves=[];for(let i=0;i<8;i++){const l=mesh(new T.SphereGeometry(.22,10,8),toon('#d9a25a'),-2.3+i*.55,.88,i%2?.25:-.25,tg);l.scale.y=.55;l.visible=false;loaves.push(l);}
  CQ.jar(tg,2.4,.74,0,.5);CQ.jar(tg,2.0,.74,.3,.4);W.obstacles.push({x:-6,z:-6,w:5.4,d:1.3,rot:0,ox:0});
  for(const p of[[-9.5,-8.5],[-3,-9]]){const b=mesh(new T.CylinderGeometry(.5,.38,.45,10),toon('#b88a50'),p[0],H(p[0],p[1])+.22,p[1]);mesh(new T.CylinderGeometry(.46,.46,.12,10),toon('#e6d3ab'),p[0],H(p[0],p[1])+.5,p[1]);W.circles.push({x:p[0],z:p[1],r:.6});}
  /* the prison cell: three stone walls, iron bars in front, a door that swings open */
  const PX=-24,PZ=4,py=H(PX,PZ);
  CQ.wallBox(PX-3.2,PZ,.8,3.4,6.4,0,M.basalt);CQ.wallBox(PX,PZ-3.2,7,3.4,.8,0,M.basalt);CQ.wallBox(PX,PZ+3.2,7,3.4,.8,0,M.basalt);
  mesh(new T.BoxGeometry(7.4,.5,7.2),M.basalt,PX,py+3.6,PZ);
  const bars=new T.Group();bars.position.set(PX+3.3,py,PZ);W.scene.add(bars);
  for(let i=-5;i<=5;i++)mesh(new T.CylinderGeometry(.05,.05,3.3,6),toon('#3b3b40'),0,1.65,i*.55,bars);
  mesh(new T.BoxGeometry(.12,.12,6.2),toon('#3b3b40'),0,3.2,0,bars);
  const bar0={x:PX+3.3,z:PZ,w:.4,d:6.2,rot:0,ox:0};W.obstacles.push(bar0);
  const gate=new T.Group();gate.position.set(PX+3.3,py,PZ+1);W.scene.add(gate);
  for(let i=0;i<4;i++)mesh(new T.CylinderGeometry(.06,.06,3,6),toon('#55555c'),0,1.5,-i*.5,gate);
  mesh(new T.BoxGeometry(.12,.12,1.6),toon('#55555c'),0,2.9,-.75,gate);
  const halo=new T.PointLight('#fff2b0',0,16,1.5);halo.position.set(PX+4,py+3,PZ);W.scene.add(halo);
  /* people */
  const eli=Object.assign({},CQ.CAST.eli,{S:.8,head:1.12});
  W.player=CQ.place(CQ.makeChar(eli),0,13,0);
  const peter=CQ.place(CQ.makeChar(CQ.CAST.peter),6,-8,-.5),john=CQ.place(CQ.makeChar(CQ.CAST.john),8,-9.4,-.6);
  const widow=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.woman,{tunic:'#5a5560',veil:'#cfc6b4',S:.93})),-9,-3.6,.4);
  const barn=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#3f6fa8',hem:.4,mantle:'#e9dcc0',sash:'#d9a441',hair:'#2a1d15',beard:1,band:'#d9a441',S:1.04}),10,3,3.4);
  const priest=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#f4f0e6',mantle:'#6a2f6e',sash:'#d9a441',hair:'#d9d4c8',beard:2,band:'#6a2f6e'}),-4,-11,0);
  const sold=[CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#8a3a34',hem:.4,mantle:'#555a63',sash:'#2a2a2e',hair:'#241a13',staff:1,band:'#b5b8c0'}),-1.6,-11.3,0),CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#8a3a34',hem:.4,mantle:'#555a63',sash:'#2a2a2e',hair:'#241a13',staff:1,band:'#b5b8c0'}),1.4,-11.3,0)];
  const angel=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.angel,{float:1.4})),PX+5,PZ,-1.57);angel.g.visible=false;
  const kid=CQ.place(CQ.makeChar(CQ.CAST.kid),4,6,2.4),old=CQ.place(CQ.makeChar(CQ.CAST.elder),-13,8,.8);
  CQ.crowd(CQ.ring(-8,-1,8,3,5,-1,1.4).concat(CQ.ring(12,-6,5,2,4,2,5)),{sit:1});CQ.crowd(CQ.ring(10,10,4,2,4,3.5,5),{});
  CQ.zones({A:{c:[0,0],r:34,tod:'day'}});
  CQ.addInter({id:'kid',P:kid,name:'em bé',h:2.05,side:1,run:d=>CQ.say('Em bé','Mỗi ngày em cùng mẹ đến hiên cửa Sa-lô-môn. Ở đây ai cũng có bánh ăn!','Theo Công vụ 2:46','Hay quá!',d)});
  CQ.addInter({id:'old',P:old,name:'cụ già',h:2.2,side:1,run:d=>CQ.say('Cụ già','Các sứ đồ làm nhiều phép lạ. Ai cũng kính sợ, và anh em thương yêu nhau lắm.','Theo Công vụ 2:43-44','Dạ cháu nhớ ạ.',d)});
  CQ.addInter({id:'widow',P:widow,name:'bà góa',h:2,r:2.6});
  CQ.addInter({id:'john',P:john,name:'sứ đồ Giăng',h:2.2});
  CQ.addInter({id:'table',obj:tg,x:-6,z:-6,name:'bàn bánh chung',verb:'Chia bánh ở ',h:1.8,r:3.2});
  CQ.addInter({id:'barn',P:barn,name:'Ba-na-ba',h:2.2,r:2.8});
  CQ.addInter({id:'priest',P:priest,name:'thầy cả',h:2.2,r:2.8});
  CQ.addInter({id:'cell',obj:bars,x:PX+5.5,z:PZ,name:'nhà ngục',verb:'Đến gần ',h:2.6,r:3.2});
  CQ.goZone('A',0,13,0,null,true);
  const cc=[PX+11,5,PZ+6,PX+3,1.8,PZ];
  W.steps=[
   {at:'widow',text:'Giúp bà góa nhận bánh',run:n=>CQ.lines([['Ê-li','Cháu xin giúp bác phát bánh cho các gia đình.','Theo Công vụ 4:34-35'],['Bà góa','Cảm ơn con. Nhờ anh em chia sẻ nên nhà bác chẳng thiếu thốn.','Theo Công vụ 4:34']],n)},
   {at:'john',text:'Nghe sứ đồ Giăng nói về đời sống chung',run:n=>CQ.say('Người kể chuyện','Chẳng ai kể của mình là của riêng; nhưng kể mọi vật là của chung cho nhau.','Công vụ 4:32',null,()=>
     CQ.fillWord({name:'Sứ đồ Giăng',before:'Chẳng ai kể của mình là của riêng; nhưng kể mọi vật là',answer:'của chung',after:' cho nhau.',options:['của chung','của giấu','của bán'],ref:'Công vụ 4:32',wrong:'Chưa đúng. Hãy nhớ các tín đồ chia sẻ với nhau.'},n))},
   {at:'table',text:'Chia bánh ở bàn chung',run:n=>CQ.say('Ê-li','Nhà này nhiều người, nhà kia ít người. Mình chia sao cho vừa đủ nhỉ?','Theo Công vụ 4:35',null,()=>
     CQ.balance({name:'Chia bánh',text:'Giữ cho cân bằng, chia bánh cho mỗi gia đình đều đủ phần. Gia đình đông người bên trái, gia đình ít người bên phải.',secs:6,onP:p=>loaves.forEach((l,i)=>{l.visible=i<p*8;})},n))},
   {at:'barn',text:'Gặp Ba-na-ba đem tiền đến',run:n=>{CQ.face(peter,10,3);CQ.setCine([14,3.4,9,10,1.8,3]);CQ.lines([['Ba-na-ba','Đây là tiền bán đám ruộng của tôi. Xin các sứ đồ cứ dùng giúp người thiếu.','Theo Công vụ 4:36-37'],['Phi-e-rơ','Cảm ơn anh Ba-na-ba, thật là con trai của sự yên ủi.','Theo Công vụ 4:36']],()=>
     CQ.choice({name:'Ba-na-ba',q:'Tên Ba-na-ba có nghĩa là gì?',options:['Con trai của sự yên ủi','Con trai của sấm sét','Con trai của vua'],ref:'Công vụ 4:36',wrong:'Chưa đúng. Phi-e-rơ vừa nói đó.'},()=>{CQ.setCine(null);n();}));}},
   {at:'priest',text:'Lại gần thầy cả đang tức giận',run:n=>{CQ.setCine([2,3.4,-4,-2,1.8,-11]);CQ.say('Người kể chuyện','Các thầy cả ghen tức, bắt các sứ đồ bỏ vào khám công.','Theo Công vụ 5:17-18',null,()=>{
     CQ.setCine(cc);CQ.walkTo(sold[0],PX+7,PZ-1,3);CQ.walkTo(sold[1],PX+7,PZ+2,3);CQ.walkTo(peter,PX+1,PZ-1,3);CQ.walkTo(john,PX+1,PZ+1.4,3,()=>{CQ.face(peter,PX+8,PZ);CQ.face(john,PX+8,PZ);CQ.setCine(null);n();});});}},
   {at:'cell',text:'Đến gần nhà ngục lúc ban đêm đã qua',run:n=>{CQ.setCine(cc);angel.g.visible=true;halo.intensity=2.2;
     CQ.say('Người kể chuyện','Nhưng ban đêm có thiên sứ của Chúa mở cửa khám, dẫn các sứ đồ ra.','Theo Công vụ 5:19',null,()=>{
     gate.rotation.y=-1.6;W.obstacles.splice(W.obstacles.indexOf(bar0),1);CQ.walkTo(peter,PX+8,PZ-2,2.5);CQ.walkTo(john,PX+8,PZ+2,2.5);
     CQ.say('Thiên sứ','Đi đi, hãy chường mặt nơi đền thờ, mà rao giảng cho dân chúng mọi lời nầy của sự sống.','Công vụ 5:20',null,()=>
     CQ.order({name:'Lời thiên sứ',q:'Ghép lời thiên sứ truyền cho các sứ đồ.',chunks:['Đi đi,','hãy chường mặt nơi đền thờ,','mà rao giảng cho dân chúng','mọi lời nầy của sự sống.'],ref:'Công vụ 5:20'},()=>{angel.g.visible=false;halo.intensity=0;CQ.setCine(null);n();}));});}}];
 }});
