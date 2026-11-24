/* Chapter 30: Lystra (Acts 14:8-20). The passage gives no time of day, so the scene is set in daylight.
   Quoted word for word (1925 text): Cong vu 14:9-10, 14:15, 14:20. */
'use strict';
CQ.chapters.push({id:'lystra',no:30,title:'Lít-trơ: Người què và hai sứ đồ',sub:'Chúng ta chỉ là loài người · ban ngày',
 intro:[
  {t:'Chuyến đi xa',x:'Hội thánh An-ti-ốt sai Phao-lô và Ba-na-ba đi qua Chíp-rơ và vùng cao nguyên. Họ đến Lít-trơ, Ê-li theo sau.',ref:'Theo Công vụ 13:2-4; 14:6',cam:[0,6,22,0,1.6,6]},
  {t:'Người ngồi bên đường',x:'Ở Lít-trơ có một người què từ lúc mới sanh, chẳng hề đi được. Ông ngồi nghe Phao-lô giảng.',ref:'Theo Công vụ 14:8-9',cam:[-3,2.6,9,-6,1.2,2]},
  {t:'Cả thành bàn tán',x:'Dân chúng thấy phép lạ thì kêu lên bằng tiếng Ly-cao-ni, tưởng hai sứ đồ là thần.',ref:'Theo Công vụ 14:11-12',cam:[10,5,0,0,1.8,-8]}],
 outro:'Nhưng các môn đồ đương nhóm chung quanh người, thì người vùng đứng dậy và vào trong thành.',outroRef:'Công vụ 14:20',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:8,y:2,z:0,r:44,h:16};
  W.paths=[[[0,20],[0,-8]],[[0,6],[28,10],[40,10]],[[-16,2],[16,2]]];
  const H=(x,z)=>{const r=Math.hypot(x-8,z);return 1+.4*noise(x,z)*sm(20,40,r)+sm(52,150,r)*14;};
  const g1=C('#b9b46a'),g2=C('#cdbf78'),pave=C('#dccaa0'),rk=C('#a89a80');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(pave,(1-sm(1.8,3.6,CQ.distPath(x,z)))*.9);c.lerp(pave,(1-sm(9,13,Math.hypot(x,z+4)))*.85);c.lerp(rk,(1-sm(4,9,Math.hypot(x-37,z-10)))*.7);}});
  CQ.sky({fogNear:55,fogFar:190,clouds:7});
  CQ.scatter(1300,new T.ConeGeometry(.09,.3,4),toon('#9aa550'),()=>{const x=rr(-140,160),z=rr(-140,140);if(Math.hypot(x-8,z)<24||CQ.distPath(x,z)<2)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(60,new T.DodecahedronGeometry(.28,0),toon('#9b9486'),()=>{const x=37+rr(-7,7),z=10+rr(-6,6);return[x,H(x,z)+.1,z,rr(.6,1.4),rr(.5,.9)];});
  CQ.scatter(30,new T.DodecahedronGeometry(.5,0),toon('#8f887c'),()=>{const x=rr(-60,80),z=rr(-50,50);if(Math.hypot(x-8,z)<30)return 0;return[x,H(x,z)+.1,z,rr(.8,2),.7];});
  /* houses, market and the city wall with a gate */
  [[-21,-8,7,6,3.2,1.57],[-21,3,7,6,3,1.57],[20,-9,7,6,3.1,-1.57],[20,-1,6,6,3,-1.57],[-12,-16,7,6,3,0],[13,-17,7,6,3.2,0]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%3===0}));
  CQ.wallBox(28,-14,1.4,4.5,16,0,M.lime);CQ.wallBox(28,22,1.4,4.5,16,0,M.lime);
  mesh(CQ.boxUV(1.8,1.2,10,2.6),M.lime,28,H(28,10)+4.1,10);
  [[-10,0],[-15,16]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[24,18],[-18,14]].forEach(p=>CQ.bush(p[0],p[1],1.1));
  [[-12,6,.3,'#c2503c'],[12,6,-.3,'#4f86c6']].forEach(s=>{const g=new T.Group();g.position.set(s[0],H(s[0],s[1]),s[1]);g.rotation.y=s[2];W.scene.add(g);
   mesh(new T.BoxGeometry(3,.9,1.2),M.wood,0,.45,0,g);const aw=mesh(new T.PlaneGeometry(3.4,1.8),toon(s[3],{side:T.DoubleSide}),0,2.5,0,g);aw.rotation.x=-1.2;
   for(const x of[-1.5,1.5])mesh(new T.CylinderGeometry(.05,.05,2.6,6),M.wood,x,1.3,-.5,g);for(let i=0;i<4;i++)CQ.jar(g,-1.1+i*.7,.9,0,.4);W.obstacles.push({x:s[0],z:s[1],w:3.2,d:1.4,rot:s[2],ox:0});});
  /* the temple of Zeus (Jupiter): steps, columns, pediment, altar */
  const TZ=-24,st=M.lime;
  mesh(new T.BoxGeometry(16,.6,8),toon('#d6cbb0'),0,H(0,TZ)+.3,TZ);mesh(new T.BoxGeometry(13,.4,6),toon('#e2d8be'),0,H(0,TZ)+.8,TZ);
  mesh(CQ.boxUV(13,5,.8,2.6),st,0,H(0,TZ)+3.2,TZ-2.6);W.obstacles.push({x:0,z:TZ-2.6,w:13,d:1.2,rot:0,ox:0});
  for(const x of[-5.5,-1.8,1.8,5.5]){mesh(new T.CylinderGeometry(.5,.55,5,10),st,x,H(x,TZ)+3.3,TZ+2);W.circles.push({x,z:TZ+2,r:.7});}
  mesh(new T.BoxGeometry(14,.7,2.4),st,0,H(0,TZ)+6,TZ+1.6);const pw=new T.Group();pw.position.set(0,H(0,TZ)+7.2,TZ+1.6);pw.rotation.x=-Math.PI/2;W.scene.add(pw);mesh(new T.CylinderGeometry(1.7,1.7,14,3),toon('#c9684a'),0,0,0,pw).rotation.z=Math.PI/2;
  const AZ=-13;mesh(new T.BoxGeometry(2.2,1.3,1.4),toon('#cfc3a6'),0,H(0,AZ)+.65,AZ);W.obstacles.push({x:0,z:AZ,w:2.2,d:1.4,rot:0,ox:0});
  /* the ox with a flower garland, ready for the offering */
  const OX=-4.5,OZ=-9,ox=new T.Group();ox.position.set(OX,H(OX,OZ),OZ);ox.rotation.y=1.2;W.scene.add(ox);
  const hide=toon('#f1e6d2'),dk=toon('#6b5642');mesh(new T.BoxGeometry(2.2,1.1,1),hide,0,1.2,0,ox);mesh(new T.BoxGeometry(.7,.8,.8),hide,1.35,1.4,0,ox);
  for(const s of[-1,1]){mesh(new T.CylinderGeometry(.03,.05,.45,5),dk,1.55,1.95,s*.3,ox).rotation.x=s*.5;}
  for(const x of[-.8,.8])for(const z of[-.35,.35])mesh(new T.CylinderGeometry(.1,.1,.8,6),dk,x,.4,z,ox);
  const gar=new T.Group();ox.add(gar);const gr=mesh(new T.TorusGeometry(.52,.1,6,14),toon('#5fa043'),1.05,1.3,0,gar);gr.rotation.y=Math.PI/2;
  for(let i=0;i<8;i++){const a=i/8*6.28;mesh(new T.SphereGeometry(.11,6,5),toon(i%2?'#e2402f':'#fff2a8'),1.05,1.3+Math.sin(a)*.52,Math.cos(a)*.52,gar);}
  W.circles.push({x:OX,z:OZ,r:1.3});
  const fl=new T.Group();fl.position.set(0,H(0,AZ)+1.35,AZ);W.scene.add(fl);for(let i=0;i<7;i++)mesh(new T.SphereGeometry(.16,6,5),toon(['#e2402f','#fff2a8','#f08ac0'][i%3]),rr(-.8,.8),.12,rr(-.4,.4),fl);
  /* people */
  const eliS=Object.assign({},CQ.CAST.eli,{S:.9,head:1.08,beard:1,hair:'#2e2018'});
  W.player=CQ.place(CQ.makeChar(eliS),2,17,Math.PI);
  const paul=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#e9dfc4',mantle:'#8a2f3a',sash:'#d9a441',hair:'#3a2c22',beard:1,band:'#e9dfc4',S:.97}),-1.5,-1,-.5);
  const barn=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#6f8f5a',mantle:'#d9b45a',sash:'#4a3a2c',hair:'#2e2018',beard:2,W:1.08}),2,-.6,.5);
  const lameS=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#a89878',hem:.45,hair:'#3a2c22',beard:1,sit:1,sash:'#6b4a2f'}),-6,2,.7);
  const lameU=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#a89878',hem:.45,hair:'#3a2c22',beard:1,sash:'#6b4a2f'}),-6,2,.7);lameU.g.visible=false;
  const priest=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#f5f0e2',mantle:'#7a2d6b',sash:'#d9a441',hair:'#2a1d15',beard:1,band:'#5fa043'}),0,-10.4,0);
  CQ.crowd(CQ.ring(0,-5,10,4,7,-1,1),{});CQ.crowd(CQ.ring(-12,-3,5,2,4,1,3),{});
  const hurt=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#e9dfc4',mantle:'#8a2f3a',sash:'#d9a441',hair:'#3a2c22',beard:1,sit:1,band:'#e9dfc4',S:.97}),35,10,-1.2);hurt.g.visible=false;
  const disc=[[33.4,12],[37,12.4],[36.2,7.6]].map((p,i)=>CQ.place(CQ.makeChar([CQ.CAST.man2,CQ.CAST.woman2,CQ.CAST.shepherd2][i]),p[0],p[1],Math.atan2(35-p[0],10-p[1])));
  disc[0].g.visible=false;disc[1].g.visible=false;disc[2].g.visible=false;
  const boy=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.kid,{tunic:'#5f8f7a'})),-9,7,.5);
  const potter=CQ.place(CQ.makeChar(CQ.CAST.woman),-12,8.4,.2);
  /* what Eli carries */
  const pitcher=CQ.jar(W.player.arms[1],0,-.95,.12,.42);pitcher.visible=false;
  CQ.zones({A:{c:[10,2],r:50,tod:'day'}});
  CQ.addInter({id:'lame',P:lameS,name:'người què',h:1.5});
  CQ.addInter({id:'paul',P:paul,name:'Phao-lô',h:2.1});
  CQ.addInter({id:'priest',P:priest,name:'thầy tế lễ',h:2.1});
  CQ.addInter({id:'hurt',P:hurt,name:'Phao-lô bị thương',h:1.6,r:2.6});
  CQ.addInter({id:'disc',P:disc[0],name:'môn đồ',h:2.1});
  CQ.addInter({id:'boy',P:boy,name:'cậu bé',h:1.65,side:1,run:d=>CQ.say('Cậu bé','Cả thành nói tiếng Ly-cao-ni nên cháu không hiểu hết. Nhưng cháu thấy bác què đứng dậy rồi!','Theo Công vụ 14:8-11','Tuyệt!',d)});
  CQ.addInter({id:'potter',P:potter,name:'bà bán chum',h:2,side:1,run:d=>CQ.say('Bà bán hàng','Chum nào cũng chắc, nhưng tin lành của hai ông kia mới là quý nhất.','Theo Công vụ 14:7','Cảm ơn bà',d)});
  CQ.goZone('A',2,17,0,null,true);
  const SQ=[-4,4.6,9,-1,1.4,0],CC=[9,5,-1,0,1.8,-8],FD=[28,5,4,35,1.2,10];
  const walkHome=()=>{lameS.g.visible=false;lameU.g.visible=true;CQ.walkTo(lameU,-3.4,4.6,3,()=>CQ.face(lameU,-1.5,-1));};
  W.steps=[
   {at:'lame',text:'Ngồi nghe bên đường: lại gần người què',run:n=>{CQ.setCine(SQ);CQ.say('Ê-li','Bác Phao-lô giảng hay quá, bác ấy nhìn ông què kìa.','Theo Công vụ 14:9','Dạ',()=>{CQ.setCine(null);n();});}},
   {at:'paul',text:'Lại gần Phao-lô',run:n=>{CQ.setCine(SQ);CQ.face(paul,-6,2);
     const heal=()=>CQ.fillWord({name:'Phao-lô',before:'Ngươi hãy chờ dậy, đứng thẳng',answer:'chơn',after:' lên.',options:['chơn','mắt','tay'],ref:'Công vụ 14:10',wrong:'Chưa đúng. Hãy nghĩ xem người què cần gì để đứng dậy.'},()=>{walkHome();
       CQ.say('Người kể chuyện','Người què liền nhảy lên và đi được! Dân chúng cùng reo lên.','Theo Công vụ 14:10','Ồ!',()=>{CQ.setCine(null);n();});});
     CQ.say('Người kể chuyện','Phao-lô chăm mắt trên người, thấy có đức tin để chữa lành được, bèn nói lớn tiếng rằng: Ngươi hãy chờ dậy, đứng thẳng chơn lên.','Công vụ 14:9-10','Nghe tiếp',heal);}},
   {at:'priest',text:'Dân chúng kêu lên: lại gần thầy tế lễ',run:n=>{CQ.setCine(CC);CQ.face(priest,W.player.x,W.player.z);
     CQ.say('Người dân','Hai vị ấy là thần Giu-bi-tê và thần Mẹt-cu-rơ! Ta đem bò và hoa đến dâng!','Theo Công vụ 14:11-13','Khoan đã!',()=>
      CQ.tapFill({name:'Xin dân dừng lại',text:'Chạm vào từng người dân để xin họ dừng việc dâng lễ.',need:10,onP:p=>{gar.scale.setScalar(1-p*.9);fl.scale.setScalar(1-p*.9);}},()=>{gar.visible=false;fl.visible=false;CQ.setCine(null);n();}));}},
   {at:'paul',text:'Nghe Phao-lô nói với dân',run:n=>{CQ.setCine(SQ);CQ.face(paul,0,-6);CQ.face(barn,0,-6);
     CQ.say('Phao-lô','Chúng ta chỉ là loài người, giống như các ngươi; chúng ta giảng Tin lành cho các ngươi, hầu cho xây bỏ các thần hư không kia, mà trở về cùng Đức Chúa Trời hằng sống.','Công vụ 14:15','Nghe tiếp',()=>
      CQ.choice({name:'Ba-na-ba',q:'Phao-lô và Ba-na-ba nói mình là gì?',options:['Chỉ là loài người','Là thần','Là thiên sứ'],ref:'Công vụ 14:15',wrong:'Chưa đúng. Hai sứ đồ không muốn ai thờ mình.'},()=>{
       paul.g.visible=false;hurt.g.visible=true;disc.forEach(d=>d.g.visible=true);CQ.setCine(null);n();}));}},
   {at:'hurt',text:'Ngoài cổng thành: mang nước đến cho Phao-lô',run:n=>{CQ.setCine(FD);pitcher.visible=true;
     CQ.lines([['Người kể chuyện','Về sau có những người từ nơi khác đến, xúi giục dân chúng, rồi họ ném đá Phao-lô và kéo ra ngoài thành.','Theo Công vụ 14:19'],['Ê-li','Có người bị ném đá ngoài thành. Cháu xin mang nước đến.','Theo Công vụ 14:19-20']],()=>{pitcher.visible=false;CQ.setCine(null);n();});}},
   {at:'disc',text:'Lại gần các môn đồ',run:n=>{CQ.setCine(FD);
     CQ.say('Người kể chuyện','Nhưng các môn đồ đương nhóm chung quanh người, thì người vùng đứng dậy và vào trong thành.','Công vụ 14:20','Amen',()=>{hurt.g.visible=false;paul.g.visible=true;CQ.place(paul,30,10);CQ.setCine(null);n();});}}];
 }});
