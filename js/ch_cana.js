/* Chapter: the wedding at Cana (John 2:1-11). The passage gives no time of day, so the scene is set in daylight.
   Quoted word for word (1925 text, checked): Giăng 2:5, 2:7, 2:10 (last clause), 2:11 (last part). */
'use strict';
CQ.chapters.push({id:'cana',no:5,title:'Tiệc cưới Ca-na',sub:'Nước hóa thành rượu · ban ngày',
 intro:[
  {t:'Một đám cưới ở Ca-na',x:'Tại làng Ca-na, xứ Ga-li-lê, có một tiệc cưới. Mẹ Chúa Giê-su có ở đó. Chúa Giê-su và các môn đồ cũng được mời đến dự.',ref:'Theo Giăng 2:1-2',cam:[2,17,26,0,1,-4]},
  {t:'Ê-li giúp việc',x:'Hôm nay Ê-li phụ giúp những người hầu bàn. Cả làng vui vẻ ăn tiệc dưới tấm mái che.',cam:[10,6,10,4,1.6,-2]}],
 outro:'Ấy là phép lạ thứ nhất Chúa Giê-su làm tại Ca-na. Ngài tỏ bày sự vinh hiển của mình, và các môn đồ tin Ngài.',outroRef:'Theo Giăng 2:11',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:0,r:34,h:14};
  const H=(x,z)=>{const r=Math.hypot(x,z);return 1+.45*noise(x,z)*sm(20,36,r)+sm(55,150,r)*12;};
  const yard=C('#dcc79c'),g1=C('#a3bd5c'),g2=C('#c2c870');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(yard,1-sm(17,22,Math.hypot(x,z)+noise(x*3,z*3)));}});
  CQ.sky({fogNear:55,fogFar:200,clouds:8});
  CQ.scatter(1600,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-150,150),z=rr(-150,150);if(Math.hypot(x,z)<21)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* village houses round the courtyard (open to the south) */
  [[-10,-17,7,6,3.2,0],[0,-18,8,6,3.4,0],[10,-17,7,6,3,0],[-18,-6,7,6,3,1.57],[-18,4,6,6,2.9,1.57],[18,-6,7,6,3.1,-1.57],[18,4,6,6,3,-1.57]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%3===0,mat:i===2?'#b5483a':null}));
  [[-14,-12],[14,-12],[-22,12],[23,13],[-6,-24],[7,-25]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[-16,14],[16,16]].forEach(p=>CQ.palm(p[0],p[1],1.2));
  /* the feast: awning, low tables, guests at the sides */
  const AW=new T.Group();AW.position.set(0,1,-7);W.scene.add(AW);
  const aw=mesh(new T.PlaneGeometry(9,6),M.cloth,0,3.1,0,AW);aw.rotation.x=-Math.PI/2;
  for(const x of[-4.4,4.4])for(const z of[-2.9,2.9])mesh(new T.CylinderGeometry(.06,.06,3.1,6),M.wood,x,1.55,z,AW);
  const tab=toon('#9a6a40'),cl=toon('#efe3c6');
  [[-2,-1.2],[2,-1.2],[0,1.2]].forEach(t=>{mesh(new T.BoxGeometry(3.2,.35,.9),tab,t[0],.18,t[1],AW);mesh(new T.BoxGeometry(3.3,.03,.95),cl,t[0],.37,t[1],AW);
    for(let i=0;i<4;i++)CQ.jar(AW,t[0]-1.2+i*.8,.38,t[1],.28);W.obstacles.push({x:t[0],z:-7+t[1],w:3.2,d:.9,rot:0,ox:0});});
  const seats=[];for(let i=0;i<6;i++){seats.push([-3.4+i*.6,-9.1,0]);seats.push([.6+i*.6,-9.1,0]);}for(let i=0;i<5;i++){seats.push([-1.3+i*.65,-4.9,3.14]);}
  CQ.crowd(seats,{sit:1});CQ.crowd(CQ.ring(-12,-6,7,2,4,-1,1),{sit:1});CQ.crowd(CQ.ring(12,-8,6,2,4,2.2,4),{});
  const groom=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#f1e7cf',mantle:'#3a6ea5',sash:'#d9a441',hair:'#2e2018',beard:1,band:'#d9a441'}),1,-10.4,0);
  CQ.place(CQ.makeChar({skin:'#cf9a6e',tunic:'#e9dcc0',veil:'#ffffff',sash:'#c2503c',S:.93}),2,-10.4,0);
  const master=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#c9c0a8',mantle:'#8a3a4a',hair:'#d9d4c8',beard:2,band:'#e9dcc0'}),5.6,-4.6,-.6);
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),-6,-2.5,.5),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),-8,-3.6,.6);CQ.place(CQ.makeChar(CQ.CAST.man2),-7.4,-1.2,1);
  const mary=CQ.place(CQ.makeChar(CQ.CAST.mary),-2.6,1.6,.3);
  const sv1=CQ.place(CQ.makeChar(CQ.CAST.man),3,6.2,0),sv2=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#e6d3ab',hem:.4,sash:'#5f8f7a',hair:'#241a13'}),10.6,5.6,-.8);
  /* six stone water jars, each with a water disc that rises as it is filled */
  const stone=toon('#d8cfb8'),disc=new T.MeshBasicMaterial({color:'#4f9fd8'}),wine=C('#6e0f24');
  const prof=[[0,0],[.3,0],[.44,.3],[.47,.72],[.38,1.05],[.31,1.18],[.36,1.26],[.32,1.26],[.27,1.16]].map(p=>new T.Vector2(p[0],p[1]));
  const lv=[],jars=[];for(let i=0;i<6;i++){const x=3.4+i*1.3,z=3.6,g=new T.Group();g.position.set(x,H(x,z),z);W.scene.add(g);mesh(new T.LatheGeometry(prof,16),stone,0,0,0,g).material.side=T.DoubleSide;
    const d=mesh(new T.CircleGeometry(.29,16),disc,0,.12,0,g,false);d.rotation.x=-Math.PI/2;lv.push({d,v:0,t:0});W.circles.push({x,z,r:.5});
    jars.push(CQ.addInter({id:'j'+i,obj:g,x,z,name:'ché đá',verb:'Đổ nước vào ',h:1.7,r:1.6,k:i}));}
  let toWine=false;W.tick.push(dt=>{for(const l of lv){l.v+=(l.t-l.v)*Math.min(1,dt*1.5);l.d.position.y=.12+l.v*1.06;}if(toWine)disc.color.lerp(wine,Math.min(1,dt*1.2));});
  /* the well with a bucket on a rope */
  const WX=-9,WZ=10,wg=new T.Group();wg.position.set(WX,H(WX,WZ),WZ);W.scene.add(wg);
  mesh(new T.CylinderGeometry(1.1,1.2,.9,20,1,true),toon('#cbbd9c',{side:T.DoubleSide}),0,.45,0,wg);mesh(new T.TorusGeometry(1.12,.12,6,24),toon('#bfae8c'),0,.9,0,wg).rotation.x=Math.PI/2;
  mesh(new T.CircleGeometry(1.05,20),toon('#1d3a4a'),0,.3,0,wg,false).rotation.x=-Math.PI/2;
  for(const x of[-1.15,1.15])mesh(new T.CylinderGeometry(.08,.08,2.6,6),M.woodD,x,1.3,0,wg);mesh(new T.CylinderGeometry(.07,.07,2.5,6),M.wood,0,2.5,0,wg).rotation.z=Math.PI/2;
  const rope=mesh(new T.CylinderGeometry(.015,.015,1,4),toon('#d9c391'),0,2,0,wg,false),bucket=mesh(new T.CylinderGeometry(.2,.15,.3,10),M.wood,0,.4,0,wg);
  const setB=y=>{bucket.position.y=y;rope.scale.y=2.5-y-.15;rope.position.y=(2.5+y+.15)/2;};setB(.4);W.circles.push({x:WX,z:WZ,r:1.3});
  /* what Eli carries */
  const hand=W.player=CQ.makeChar(CQ.CAST.eli);const pitcher=CQ.jar(hand.arms[1],0,-.95,.12,.42);pitcher.visible=false;
  const cup=mesh(new T.CylinderGeometry(.08,.06,.14,10),toon('#c2714a'),0,-.72,.1,hand.arms[1]);cup.visible=false;
  const kid=CQ.place(CQ.makeChar(CQ.CAST.kid),-11,1,1.3);
  CQ.zones({A:{c:[0,0],r:24,tod:'day'}});
  CQ.addInter({id:'kid',P:kid,name:'em bé dự tiệc',h:2.05,side:1,run:d=>CQ.say('Em bé','Hôm nay cả làng đến dự tiệc cưới! Mẹ em nói Chúa Giê-su và các môn đồ cũng được mời.','Theo Giăng 2:2','Hay quá!',d)});
  CQ.addInter({id:'mary',P:mary,name:'bà Ma-ri',h:2});
  CQ.addInter({id:'well',obj:wg,x:WX,z:WZ,name:'giếng nước',verb:'Kéo nước ở ',h:2.9,r:2.4});
  CQ.addInter({id:'master',P:master,name:'người coi tiệc',verb:'Đem chén cho ',h:2.05,r:2.4});
  CQ.goZone('A',0,13,0,null,true);
  const JC=[6.6,6,-.6,6.6,1.6,3.8];
  W.steps=[
   {at:'mary',text:'Tiệc cưới hết rượu! Lại gần bà Ma-ri',run:n=>{
     const fill=()=>CQ.say('Chúa Giê-su','Hãy đổ nước đầy những ché nầy.','Giăng 2:7','Vâng!',()=>{CQ.setCine(null);n();});
     const jarsC=()=>{CQ.setCine(JC);CQ.walkTo(jesus,2,5.4,2.6,()=>CQ.face(jesus,6,3.6));CQ.say('Người kể chuyện','Ở đó có sáu cái ché đá, mỗi cái đựng được nhiều nước, dùng cho lễ tinh sạch của người Giu-đa.','Theo Giăng 2:6',null,fill);};
     CQ.lines([['Người kể chuyện','Đang giữa tiệc thì hết rượu. Bà Ma-ri đến nói với Chúa Giê-su: Họ không có rượu nữa.','Theo Giăng 2:3'],
       ['Bà Ma-ri','Người biểu chi, hãy vâng theo cả.','Giăng 2:5']],jarsC);}},
   {at:'well',text:'Ra giếng kéo nước lên',run:n=>{CQ.setCine([WX+3,H(WX,WZ)+4.4,WZ+3.6,WX,H(WX,WZ)+1.3,WZ]);
     CQ.tapFill({name:'Kéo nước',text:'Chạm thật nhanh để kéo gàu nước từ dưới giếng lên!',need:16,onP:p=>setB(.4+p*1.6)},()=>{pitcher.visible=true;
     CQ.say('Người hầu bàn','Giỏi lắm, Ê-li! Bây giờ xách nước đổ vào từng cái ché nhé.',null,'Đi thôi!',()=>{setB(.4);CQ.setCine(null);n();});});}},
   {collect:['j0','j1','j2','j3','j4','j5'],text:'Đổ nước vào sáu cái ché đá',each:I=>{lv[I.k].t=1;I.hidden=true;},run:n=>{CQ.setCine(JC);
     const toMaster=()=>{pitcher.visible=false;cup.visible=true;CQ.setCine(null);n();};
     const change=()=>{toWine=true;CQ.say('Người kể chuyện','Nhìn kìa! Nước trong các ché đã hóa thành rượu.','Theo Giăng 2:9','Ồ!',()=>
       CQ.say('Người hầu bàn','Ê-li, cháu múc một chén đem cho người coi tiệc nhé.',null,'Vâng',toMaster));};
     const draw=()=>CQ.say('Người kể chuyện','Chúa Giê-su bảo những người hầu múc ra, đem cho người coi tiệc.','Theo Giăng 2:8',null,change);
     CQ.fillWord({name:'Người kể chuyện',before:'Hãy đổ nước đầy những ché nầy; thì họ đổ đầy tới',after:'.',options:['miệng','nửa','đáy'],answer:'miệng',ref:'Giăng 2:7',wrong:'Chưa đúng. Nhìn các ché xem nước lên tới đâu.'},draw);}},
   {at:'master',text:'Đem chén rượu cho người coi tiệc',run:n=>{cup.visible=false;CQ.face(master,W.player.x,W.player.z);CQ.setCine([9.4,4,-2.6,5.6,2,-4.6]);
     const end=()=>{CQ.setCine(null);n();};
     const sign=()=>CQ.say('Người kể chuyện','Ấy là phép lạ thứ nhất Chúa Giê-su làm, tại Ca-na xứ Ga-li-lê.','Theo Giăng 2:11',null,()=>
       CQ.order({name:'Phép lạ thứ nhất',q:'Ghép lại phần cuối câu Kinh Thánh nói về phép lạ này.',chunks:['tỏ bày sự vinh hiển','của mình như vậy;','môn đồ','bèn tin Ngài.'],ref:'Giăng 2:11'},end));
     const praise=()=>{CQ.setCine([6.4,4.2,-13,1.4,1.8,-9.8]);CQ.walkTo(master,1.4,-9.6,2,()=>CQ.face(master,1,-10.4));CQ.face(groom,1.4,-9.6);
       CQ.choice({name:'Người coi tiệc',q:'Người coi tiệc gọi chàng rể đến. Ông khen chàng rể thế nào?',options:['Còn ngươi, ngươi lại giữ rượu ngon đến bây giờ.','Rượu nầy dở quá, đem đi đi!','Tiệc đã hết, mọi người về nhà thôi.'],ref:'Giăng 2:10',wrong:'Chưa đúng. Người coi tiệc rất vui vì rượu ngon.'},sign);};
     CQ.say('Người kể chuyện','Người coi tiệc nếm thử. Ông không biết rượu ngon này từ đâu đến, nhưng những người hầu đã múc nước thì biết.','Theo Giăng 2:9',null,praise);}}];
 }});
