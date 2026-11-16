/* Chapter: the pool of Bethesda (John 5:1-15). The passage gives no time of day, so the scene is set in daylight.
   Quoted word for word (1925 text, checked): Giăng 5:6 ("Ngươi có muốn lành chăng?"), 5:7 (first clause), 5:8, 5:9 (first sentence). */
'use strict';
CQ.chapters.push({id:'bethesda',no:8,title:'Ao Bê-tết-đa',sub:'Người đau ba mươi tám năm · ban ngày',
 intro:[
  {t:'Gần cửa Chiên',x:'Chúa Giê-su lên thành Giê-ru-sa-lem nhân một kỳ lễ. Gần cửa Chiên có một cái ao tên là Bê-tết-đa, chung quanh có năm cái vòm cửa.',ref:'Theo Giăng 5:1-2',cam:[2,22,32,0,1,0]},
  {t:'Nhiều người bịnh',x:'Dưới các vòm cửa có rất nhiều người bịnh nằm chờ: kẻ mù, kẻ què, kẻ bại. Ê-li đi theo Thầy vào trong.',ref:'Theo Giăng 5:3',cam:[-4,8.5,13,7,1,0]}],
 outro:'Tức thì người ấy được lành, vác giường mình và đi. Chúa Giê-su thương xót người không có ai giúp đỡ.',outroRef:'Theo Giăng 5:9',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:0,r:34,h:16};
  const inPool=(x,z)=>Math.abs(x)<8&&Math.abs(z)<6&&Math.abs(z)>.9;
  const H=(x,z)=>{if(inPool(x,z))return -1.6;const r=Math.hypot(x,z);return 1+.4*noise(x,z)*sm(18,30,r)+sm(45,150,r)*14;};
  const pave=C('#d9c7a0'),g1=C('#a7b862'),g2=C('#c4c27a'),bed=C('#8f8a72');
  CQ.terrain({H,color:(x,z,y,c)=>{if(y<0){c.copy(bed);return;}c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(pave,1-sm(16,20,Math.max(Math.abs(x),Math.abs(z-1))+noise(x*3,z*3)));}});
  CQ.sky({fogNear:50,fogFar:190,clouds:8});CQ.water({deep:1.6});
  CQ.scatter(1400,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-150,150),z=rr(-150,150);if(Math.max(Math.abs(x),Math.abs(z-1))<19)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* stone rims hide the sloped pool edges; a causeway splits the pool in two */
  const rim=toon('#cdbd98');const rimB=(x,z,w,d)=>{W.obstacles.push({x,z,w,d,rot:0,ox:0});return mesh(new T.BoxGeometry(w,3,d),rim,x,-.38,z);};
  rimB(-7.6,0,.8,12.8);rimB(7.6,0,.8,12.8);rimB(0,-5.6,16,.8);const rimS=rimB(0,5.6,16,.8);rimB(0,0,16,2);
  /* five colonnades: four round the pool and one on the causeway */
  const cols=[];for(let x=-13.4;x<=13.5;x+=2.24){for(const z of[-8.8,-11.4,8.8,11.4])if(!(z>0&&Math.abs(x)<2.5))cols.push([x,z]);}
  for(let z=-6.5;z<=6.6;z+=2.17)for(const x of[-10.8,-13.4,10.8,13.4])cols.push([x,z]);for(let x=-6.7;x<=6.8;x+=2.24)cols.push([x,0]);
  let ci=0;CQ.scatter(cols.length,new T.CylinderGeometry(.22,.27,3.8,10),toon('#e6d9b8'),()=>{const p=cols[ci++];return[p[0],1+1.9,p[1],1];},true);
  cols.forEach(p=>{if(p[1]!==0)W.circles.push({x:p[0],z:p[1],r:.3});});
  const roofM=toon('#c9b48a');const roof=(x,z,w,d)=>mesh(new T.BoxGeometry(w,.3,d),roofM,x,4.95,z);
  roof(-8.4,-10.1,11.6,3.4);roof(8.4,-10.1,11.6,3.4);roof(-8.4,10.1,11.6,3.4);roof(8.4,10.1,11.6,3.4);roof(-12.1,0,3.4,16.8);roof(12.1,0,3.4,16.8);roof(0,0,15.4,1.4);roof(0,-10.1,5.2,3.4);
  CQ.wallBox(0,-12.8,30,3.6,.6,0,M.lime);CQ.wallBox(-14.9,0,.6,3.6,26,0,M.lime);CQ.wallBox(14.9,0,.6,3.6,26,0,M.lime);
  /* the Sheep Gate and a few houses of the city */
  for(const x of[-4.4,4.4])CQ.wallBox(x,13.4,2.2,4.6,2.2,0,M.lime);mesh(new T.BoxGeometry(11,.8,2.4),M.lime,0,5.4,13.4);
  [[-10.6,13.4,8.8,.6],[10.6,13.4,8.8,.6]].forEach(a=>CQ.wallBox(a[0],a[1],a[2],3.6,a[3],0,M.lime));
  [[-22,-6,7,6,3.4,1.57],[22,-4,7,6,3.2,-1.57],[-20,20,7,6,3,0],[20,21,7,6,3.2,0],[-6,-20,8,6,3.4,0],[8,-21,7,6,3,0]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%2===0}));
  [[-17,14],[17,13],[-18,-14]].forEach(p=>CQ.palm(p[0],p[1],1.1));
  /* the sick: mats, a few people lying down, a seated crowd at the far sides */
  const matM=toon('#b9a47c');const mat=(x,z,ry)=>{const m=mesh(new T.BoxGeometry(.8,.06,1.9),matM,x,1.03,z);m.rotation.y=ry||0;return m;};
  const lie=(look,x,z)=>{const P=CQ.place(CQ.makeChar(look),x,z,1.57);P.g.rotation.z=1.45;P.dy=.25;P.mat=mat(x,z+.75);return P;};
  const man=lie({skin:'#b9804f',tunic:'#a89a7c',hem:.3,hair:'#a8a294',beard:2},9.3,.9);
  const s1=lie(CQ.CAST.man2,-9.3,-2.2);
  const s2=CQ.place(CQ.makeChar(CQ.CAST.woman2),-3.6,-7.3,0);s2.dy=-.45;mat(-3.6,-7.4);
  const s3=CQ.place(CQ.makeChar(CQ.CAST.elder),9.4,-4.6,-1.57);
  W.tick.push(()=>{s2.legs.forEach(l=>l.rotation.x=-1.45);});
  [[-9.3,1.6],[-9.3,4.6],[-1,-7.4],[3.6,-7.4],[6.4,-7.4]].forEach(p=>mat(p[0],p[1]));
  CQ.crowd([[-9.6,1.2,1.57],[-9.4,4.2,1.57],[-9.2,-4.8,1.57],[-.8,-7.6,0],[3.4,-7.6,0],[6.2,-7.3,0],[-6.6,-7.5,0]],{sit:1});
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),2,15.5,3.14),john=CQ.place(CQ.makeChar(CQ.CAST.peter),-1.6,16.4,3.14);
  W.player=CQ.makeChar(CQ.CAST.eli);
  CQ.zones({A:{c:[0,2],rect:[14.4,15]}});
  const wait=(id,P,name,txt)=>CQ.addInter({id,P,name,h:P.dy>0?1.1:2.05,side:1,noTurn:1,run:d=>CQ.say(name,txt,null,'Cảm ơn',d)});
  wait('s1',s1,'người nằm bên ao','Tôi nằm chờ bên ao này đã hai năm rồi. Ngày nào tôi cũng nhìn mặt nước.');
  wait('s2',s2,'bà ngồi trên chiếu','Tôi ngồi chờ ở đây từ đầu mùa mưa. Ở đây có rất nhiều người bịnh lắm cháu ạ.');
  wait('s3',s3,'ông cụ đứng','Tôi mới đến được ít ngày. Có một người nằm bên kia ao đã đau rất lâu, lâu hơn ai hết.');
  CQ.addInter({id:'pool',obj:rimS,x:0,z:7.4,name:'ao Bê-tết-đa',verb:'Nhìn ',h:.6,r:2.6});
  const mI=CQ.addInter({id:'man',P:man,name:'người nằm trên chiếu',verb:'Lại gần ',h:1.2,r:2.4,noTurn:1});
  CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:2.8});
  CQ.goZone('A',0,16,0,null,true);
  const MC=[10.3,3.7,7.7,9,1.2,1.4];
  W.steps=[
   {at:'pool',text:'Đi qua cửa Chiên, lại gần ao Bê-tết-đa',run:n=>{CQ.setCine([0,9,15,0,1,0]);CQ.walkTo(john,-2,10,2.6);
     CQ.lines([['Người kể chuyện','Đây là ao Bê-tết-đa. Dưới năm cái vòm cửa có rất nhiều người bịnh nằm chờ.','Theo Giăng 5:2-3'],
       ['Chúa Giê-su','Ê-li, con hãy tìm giúp Thầy người đã đau ba mươi tám năm.',null]],()=>{CQ.walkTo(jesus,1.6,7.7,2.6,()=>CQ.walkTo(jesus,9.9,7.6,2.6,()=>CQ.walkTo(jesus,8.7,2.8,2.4,()=>CQ.face(jesus,9.3,1.6))));CQ.setCine(null);n();});}},
   {at:'man',text:'Hỏi han mọi người, tìm người đã đau ba mươi tám năm',run:n=>{mI.hidden=true;CQ.marks();jesus.dest=null;CQ.place(jesus,8.7,2.8);CQ.face(jesus,9.3,1.6);CQ.setCine(MC);
     CQ.lines([['Người kể chuyện','Chúa Giê-su thấy người ấy nằm, và biết rằng người đã đau lâu ngày.','Theo Giăng 5:6'],
       ['Chúa Giê-su','Ngươi có muốn lành chăng?','Giăng 5:6'],
       ['Người bịnh','Lạy Chúa, tôi chẳng có ai để quăng tôi xuống ao trong khi nước động.','Giăng 5:7']],()=>
     CQ.choice({name:'Người kể chuyện',q:'Người này đã bị bịnh bao lâu rồi?',options:['Ba mươi tám năm','Ba năm','Tám ngày'],ref:'Giăng 5:5',wrong:'Chưa đúng. Ông đã đau rất, rất lâu.'},()=>{CQ.setCine(null);n();}));}},
   {at:'jesus',text:'Nghe Chúa Giê-su phán với người bịnh',run:n=>{CQ.setCine(MC);
     const leave=()=>{CQ.setCine(MC);CQ.walkTo(man,10,7.6,1.8,()=>CQ.walkTo(man,1.6,7.7,1.8,()=>CQ.walkTo(man,1,16,1.8)));
       CQ.order({name:'Người kể chuyện',q:'Người ấy được lành! Ghép lại câu Kinh Thánh.',chunks:['Tức thì','người ấy được lành,','vác giường mình','và đi.'],ref:'Giăng 5:9'},()=>{CQ.setCine(null);n();});};
     const heal=()=>{man.g.rotation.set(0,0,0);man.dy=0;man.mat.visible=false;
       const roll=mesh(new T.CylinderGeometry(.16,.16,.9,10),matM,0,1.15,-.22,man.g);roll.rotation.z=Math.PI/2;
       CQ.say('Người kể chuyện','Người ấy đứng dậy! Ông cuốn chiếu lại và vác lên vai.','Theo Giăng 5:9','Ôi, vui quá!',leave);};
     CQ.fillWord({name:'Chúa Giê-su',before:'Hãy đứng dậy, vác',after:' ngươi và đi.',options:['giường','gậy','áo'],answer:'giường',ref:'Giăng 5:8',wrong:'Chưa đúng. Người ấy nằm trên cái gì?'},heal);}}];
 }});
