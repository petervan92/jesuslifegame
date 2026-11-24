/* Chapter 19: Pentecost (Acts 1:12-14; 2:1-41). Morning in Jerusalem: upper room on a terrace, guests from many lands, the baptism pool. */
'use strict';
CQ.chapters.push({id:'pentecost',no:19,title:'Ngày Lễ Ngũ Tuần',sub:'Đức Thánh Linh giáng xuống · buổi sáng',
 intro:[
  {t:'Chờ đợi trong phòng cao',x:'Sau khi Chúa Giê-su lên trời, các môn đồ trở về Giê-ru-sa-lem và cùng nhau cầu nguyện trong một căn phòng cao. Ê-li, nay đã lớn thêm, xin theo họ.',ref:'Theo Công vụ 1:12-14',cam:[0,5.5,11,0,3.4,-9]},
  {t:'Lời hứa của Chúa',x:'Chúa Giê-su đã hứa sẽ ban Đức Thánh Linh cho họ. Ai nấy kiên nhẫn chờ, lòng đầy mong đợi.',ref:'Theo Công vụ 1:4-5',cam:[-8,4.6,0,0,3.2,-9]},
  {t:'Ngày lễ Ngũ Tuần',x:'Giê-ru-sa-lem đông người từ nhiều xứ về dự lễ. Buổi sáng hôm ấy, một điều lạ lùng sắp xảy ra.',ref:'Theo Công vụ 2:1-5',cam:[14,7,24,0,2,0]}],
 outro:'Vậy, những kẻ nhận lời đó đều chịu phép báp têm; và trong ngày ấy, có độ ba ngàn người thêm vào Hội thánh.',outroRef:'Công vụ 2:41',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:3,z:-4,r:36,h:15};
  W.paths=[[[0,24],[0,-3]],[[-26,10],[26,10]]];
  W.bounds=(x,z)=>Math.hypot(x,z-4)<46;
  const FY=2.2;
  const H=(x,z)=>.45*noise(x,z)+FY*sm(11,5.5,Math.hypot(x*.75,(z+9)*.8));
  const g1=C('#b4b66c'),g2=C('#9fae5c'),dirt=C('#e2d0a2'),pave=C('#d9cba8');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.6,z*1.6));c.lerp(dirt,(1-sm(1.6,3.8,CQ.distPath(x,z)))*.9);c.lerp(pave,(1-sm(9,16,Math.hypot(x,z-6)))*.75);}});
  CQ.sky({fogNear:60,fogFar:230});
  CQ.scatter(1500,new T.ConeGeometry(.09,.28,4),toon('#8aa04a'),()=>{const x=rr(-90,90),z=rr(-90,90);if(CQ.distPath(x,z)<2.4||Math.hypot(x,z-6)<14)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(160,new T.DodecahedronGeometry(.25,0),toon('#bdb39c'),()=>{const x=rr(-60,60),z=rr(-60,60);if(CQ.distPath(x,z)<2||Math.hypot(x,z+9)<9)return 0;return[x,H(x,z)+.08,z,rr(.6,1.4),rr(.5,.9)];});

  /* the upper room: a stone house on a terrace, open at the front */
  const wl=M.lime;
  CQ.wallBox(0,-14,11.4,3.7,.6,0,wl);CQ.wallBox(-5.5,-9,.6,3.7,10,0,wl);CQ.wallBox(5.5,-9,.6,3.7,10,0,wl);
  mesh(new T.BoxGeometry(11.6,.35,8.6),M.mud,0,FY+3.78,-9.7);mesh(CQ.boxUV(11.6,.5,.3,3),wl,0,FY+4.2,-14.1);
  for(const s of[-1,1]){mesh(new T.CylinderGeometry(.3,.34,3.8,10),wl,s*5.5,FY+1.9,-4);W.circles.push({x:s*5.5,z:-4,r:.5});mesh(new T.BoxGeometry(.5,.3,.5),wl,s*5.5,FY+3.9,-4);}
  mesh(new T.BoxGeometry(2.4,1.4,.12),toon('#2a211c'),0,FY+2.1,-13.65,null,false);
  const rl=new T.PointLight('#ffd9a0',.7,16,1.5);rl.position.set(0,FY+2.8,-8);W.scene.add(rl);
  mesh(new T.BoxGeometry(5,.14,1.2),M.wood,0,FY+.55,-12.6);W.circles.push({x:0,z:-12.6,r:.9});

  /* temple and houses of Jerusalem */
  CQ.wallBox(0,-34,44,6,1.4,0,wl);
  for(let i=-3;i<=3;i++){mesh(new T.CylinderGeometry(.5,.55,6.6,12),wl,i*5,3.3,-32.4);}
  mesh(CQ.boxUV(22,12,8,3),wl,0,6,-40);mesh(new T.BoxGeometry(23,.6,9),toon('#d6b45a'),0,12.3,-40);
  [[-25,-4,9,7,4,1.57],[-27,12,8,7,3.6,1.57],[25,-5,9,7,4.2,-1.57],[27,4,8,6,3.4,-1.57],[-14,-27,8,6,3.8,0],[15,-27,8,7,4,0],[-24,28,8,7,3.6,1.9],[26,26,8,6,3.4,-1.9]].forEach((h,i)=>CQ.house(h[0],h[1],h[2],h[3],h[4],h[5],{stone:'lime',plaster:i%2,awning:i%3==0?-1.5:0,roofJars:i%2==0}));
  [[-12,16],[12,-14],[-16,-14],[7,26],[-9,29],[33,16],[-36,-12]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.4)));
  [[-6,-18],[8,-19],[-21,-18],[20,-18]].forEach(p=>CQ.bush(p[0],p[1],rr(.9,1.3)));

  /* baptism pool */
  const PX=17,PZ=10;
  mesh(new T.CylinderGeometry(4.2,4.4,.9,28),wl,PX,.45,PZ);
  const pw=mesh(new T.CylinderGeometry(3.7,3.7,.1,28),new T.MeshBasicMaterial({color:'#5fc4d8'}),PX,.6,PZ,null,false);
  W.circles.push({x:PX,z:PZ,r:4.6});
  CQ.crowd([[PX-1,PZ-.5,.5],[PX+1.2,PZ+.6,3.5]],{noCol:1});
  const jars=[[13,6.5],[21.5,7],[17,16.3]].map((p,i)=>{const j=CQ.jar(W.scene,p[0],H(p[0],p[1]),p[1],1.5);W.circles.push({x:p[0],z:p[1],r:.5});return CQ.addInter({id:'j'+i,obj:j,x:p[0],z:p[1],name:'bình nước',verb:'Múc nước ',h:1.6,r:2.4});});

  /* characters */
  const mk=(o,x,z,r)=>CQ.place(CQ.makeChar(o),x,z,r);
  const peter=mk(Object.assign({},CQ.CAST.peter,{hair:'#8f8a80',tunic:'#a0825a'}),-1.6,-8.2,0);
  const john=mk(Object.assign({},CQ.CAST.john,{tunic:'#7a9a6a'}),2.4,-8.6,0);
  const mary=mk(CQ.CAST.mary,-3.6,-11,.3);
  const wm=mk(CQ.CAST.woman,3.8,-11.4,-.3);
  const sit=[[-4,-6.5],[-2.6,-12],[0.5,-6.8],[4,-7],[-0.6,-11.2],[2.4,-5.6],[-3.8,-9],[4.2,-9.4]];
  CQ.crowd(sit.map(p=>[p[0],p[1],rr(-.5,.5)]),{sit:1,noCol:1});
  const flames=[];const addFl=(par,x,y,z)=>{const f=new T.Group();f.add(new T.Mesh(new T.ConeGeometry(.14,.46,7),new T.MeshBasicMaterial({color:'#ff8a1a'})));const k=new T.Mesh(new T.ConeGeometry(.08,.3,6),new T.MeshBasicMaterial({color:'#fff0a0'}));k.position.y=-.03;f.add(k);f.position.set(x,y,z);f.visible=false;(par||W.scene).add(f);flames.push({f,y});};
  [peter,john,mary,wm].forEach(P=>addFl(P.g,0,1.95,0));
  sit.forEach(p=>addFl(null,p[0],CQ.G(p[0],p[1])+1.3,p[1]));
  let fireK=1;W.tick.push((dt,tt)=>{flames.forEach((o,i)=>{o.f.position.y=(o.f.parent===W.scene?o.y:1.95)+Math.sin(tt*3+i)*.06;o.f.scale.setScalar(fireK*(1+Math.sin(tt*9+i*2)*.12));o.f.rotation.y=tt*2;});});
  const guestDef=[['g1','khách xứ Bạt-thê',-18,12,{skin:'#b9804f',tunic:'#3f6fb0',hem:.3,mantle:'#d9c06a',hair:'#241a13',beard:2,band:'#c0392b'},-4,4.5],
   ['g2','khách xứ Ê-díp-tô',-19,0,{skin:'#a8714a',tunic:'#f4efe0',hem:.3,sash:'#c9a23a',band:'#1f1a16',hair:'#1c1410',beard:1},4.2,5],
   ['g3','khách từ La-mã',18,-4,{skin:'#d3a27c',tunic:'#e8e2d0',hem:.3,mantle:'#a8322c',hair:'#4a3a2c'},-3.4,8.6],
   ['g4','khách xứ Cơ-rết',9,23,{skin:'#c08a5e',tunic:'#5fa089',hem:.3,sash:'#6b4a2f',hair:'#3a2a20',beard:1,staff:1},3.6,9]];
  const guests=guestDef.map(d=>{const P=mk(d[4],d[2],d[3],d[2]<0?-1.57:1.57);CQ.crowd([[d[2]+1.6,d[3]+1.4,P.g.rotation.y],[d[2]-.4,d[3]+2.2,P.g.rotation.y],[d[2]+1.3,d[3]-1.6,P.g.rotation.y]],{noCol:1});
    CQ.addInter({id:d[0],P,name:d[1],h:2.05,r:2.6});return P;});
  const kid=mk(Object.assign({},CQ.CAST.kid,{tunic:'#d9a441'}),-9,6,.8);
  const elder=mk(CQ.CAST.elder,10,-6,-.8);
  CQ.addInter({id:'kid',P:kid,name:'em bé bán bánh',side:1,h:1.8,r:2.4,run:n=>CQ.say('Em bé','Mẹ em nói các môn đồ cùng ăn bánh chung với nhau, lòng vui mừng và thật thà. Anh có đói không?','Theo Công vụ 2:46',null,n)});
  CQ.addInter({id:'old',P:elder,name:'ông lão từ xa đến',side:1,h:2.2,r:2.6,run:n=>CQ.say('Ông lão','Tôi từ đảo Cơ-rết đến dự lễ. Sáng nay tôi nghe người Ga-li-lê nói tiếng quê tôi, tôi mừng đến rơi nước mắt.','Theo Công vụ 2:11',null,n)});
  CQ.addInter({id:'peter',P:peter,name:'Phi-e-rơ',h:2.2,r:2.6});CQ.addInter({id:'john',P:john,name:'Giăng',h:2.2,r:2.6});
  W.player=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.82,head:1.12})),0,19,0);
  const wind=(a)=>{rl.intensity=a?1.6:.7;};

  W.steps=[
   {at:'peter',text:'Lên phòng cao, hỏi chuyện bác Phi-e-rơ',run:n=>CQ.lines([['Ê-li','Thưa bác Phi-e-rơ, cho con ngồi chờ cùng mọi người nhé.','Theo Công vụ 1:13-14'],['Phi-e-rơ','Được con. Chúa đã dặn chúng ta ở lại và cầu nguyện, nên ta cứ vui lòng chờ.','Theo Công vụ 1:4']],n)},
   {at:'john',text:'Hỏi bác Giăng về lời Chúa hứa',run:n=>CQ.lines([['Ê-li','Bác Giăng ơi, mọi người đang chờ điều gì vậy ạ?','Theo Công vụ 1:4-5'],['Giăng','Chúa Giê-su đã hứa với chúng ta như thế này.','Theo Công vụ 1:8'],['Giăng','Nhưng khi Đức Thánh Linh giáng trên các ngươi, thì các ngươi sẽ nhận lấy quyền phép','Công vụ 1:8']],()=>
     CQ.choice({name:'Giăng',q:'Chúa Giê-su hứa điều gì sẽ giáng trên các môn đồ?',options:['Đức Thánh Linh','Một đạo binh','Một cơn mưa vàng'],ref:'Công vụ 1:8'},n))},
   {text:'',run:n=>{CQ.setCine([0,FY+2.6,-0.5,0,FY+1.4,-9]);wind(1);flames.forEach(o=>o.f.visible=true);
     CQ.lines([['Người kể chuyện','Thình lình có tiếng từ trời đến như tiếng gió thổi ào ào, và những lưỡi như lửa đậu trên mỗi người.','Theo Công vụ 2:2-3'],['Người kể chuyện','Hết thảy đều được đầy dẫy Đức Thánh Linh, khởi sự nói các thứ tiếng khác, theo như Đức Thánh Linh cho mình nói.','Công vụ 2:4']],()=>
     CQ.fillWord({name:'Người kể chuyện',before:'Hết thảy đều được đầy dẫy',answer:'Đức Thánh Linh',after:', khởi sự nói các thứ tiếng khác.',options:['Đức Thánh Linh','sự sợ hãi','bánh và cá'],ref:'Công vụ 2:4',wrong:'Chưa đúng. Hãy nhớ lời Chúa hứa.'},()=>{CQ.setCine(null);wind(0);n();}));}},
   {collect:['g1','g2','g3','g4'],text:'Mời các nhóm khách từ nhiều xứ lại gần để nghe',each:I=>{const d=guestDef.find(g=>g[0]===I.id);CQ.walkTo(I.P,d[5],d[6],2.8);},
    run:n=>CQ.lines([['Người khách','Hết thảy người nói đó, há chẳng phải là người Ga-li-lê sao?','Công vụ 2:7'],['Ê-li','Vâng, mà bác nghe xem, họ nói đúng tiếng xứ của bác đó!','Theo Công vụ 2:8']],()=>
     CQ.tapFill({name:'Tin vui',text:'Chạm thật nhanh để thổi bùng ngọn lửa nhỏ, cho mọi người cùng nghe tin vui bằng chính tiếng xứ mình.',need:12,onP:p=>{fireK=1+p*.9;}},()=>{CQ.walkTo(peter,0,.5,3);CQ.walkTo(john,3,2,3);n();}))},
   {at:'peter',text:'Nghe Phi-e-rơ giảng cho dân chúng',run:n=>CQ.lines([['Phi-e-rơ','Hỡi các anh em, Chúa Giê-su mà anh em đã đóng đinh, Đức Chúa Trời đã khiến Ngài sống lại.','Theo Công vụ 2:22-24, 36'],['Người kể chuyện','Vậy, những kẻ nhận lời đó đều chịu phép báp têm; và trong ngày ấy, có độ ba ngàn người thêm vào Hội thánh.','Công vụ 2:41']],()=>
     CQ.choice({name:'Người kể chuyện',q:'Trong ngày ấy có bao nhiêu người thêm vào Hội thánh?',options:['Độ ba ngàn người','Chỉ mười người','Không một ai'],ref:'Công vụ 2:41'},n))},
   {collect:['j0','j1','j2'],text:'Múc nước ở bể giúp người chịu báp-têm',each:I=>{I.obj.visible=false;pw.position.y+=.07;},
    run:n=>CQ.lines([['Ê-li','Con xin múc nước cho mọi người ạ. Hôm nay vui quá!','Theo Công vụ 2:41']],n)}
  ];
 }});
