/* Chapter 28: the church at Antioch (Acts 11:19-30; 13:1-3). The text gives no hour; late afternoon (dusk) suits the gathering.
   Quoted word for word (1925 text): Cong vu 11:23, 11:25-26. The rest is paraphrase marked "Theo". */
'use strict';
CQ.chapters.push({id:'antioch',no:28,title:'Hội thánh ở An-ti-ốt',sub:'Ba-na-ba và Sau-lơ · buổi chiều muộn',
 intro:[
  {t:'Tin vui lan xa',x:'Sau cái chết của Ê-tiên, nhiều tín đồ phải đi xa. Họ đem tin lành đến đảo Chíp-rơ và thành An-ti-ốt.',ref:'Theo Công vụ 11:19-21',cam:[0,12,24,0,1.5,0]},
  {t:'Ba-na-ba được sai đi',x:'Hội thánh ở Giê-ru-sa-lem sai Ba-na-ba, người lành và đầy đức tin, đến An-ti-ốt. Ê-li cũng đi theo.',ref:'Theo Công vụ 11:22-24',cam:[-8,3,14,2,1.8,2]},
  {t:'Đi tìm Sau-lơ',x:'Ba-na-ba đến thành Tạt-sơ tìm Sau-lơ và đưa người về An-ti-ốt cùng dạy dỗ.',ref:'Theo Công vụ 11:25-26',cam:[16,4,0,14,1.8,-8]}],
 outro:'Ấy là ở thành An-ti-ốt, người ta bắt đầu xưng môn đồ là Cơ rê tiên.',outroRef:'Công vụ 11:26',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='dusk';W.startYaw=0;W.menuCam={x:0,y:2,z:-4,r:36,h:14};
  W.paths=[[[0,18],[0,-24]],[[0,-8],[14,-8]],[[0,-8],[-13,-8]],[[0,-14],[8,-14]]];
  const H=(x,z)=>{const r=Math.hypot(x,z+4);let y=1.1+.3*noise(x,z)*sm(10,30,r);if(x>36)y=Math.max(-4,y-(x-36)*.7);return y+sm(52,150,r)*10;};
  const g1=C('#9db553'),g2=C('#b8bd66'),dirt=C('#d9c59a'),bed=C('#a8946c'),stoneC=C('#d8cdb4');
  CQ.terrain({H,color:(x,z,y,c)=>{if(x>36&&y<0){c.copy(bed);return;}c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(dirt,1-sm(22,32,Math.hypot(x*.8,z+4)));c.lerp(stoneC,(1-sm(1.4,3,CQ.distPath(x,z)))*.9);}});
  CQ.sky({fogNear:45,fogFar:170,clouds:6});CQ.water({deep:3.5});
  CQ.scatter(1400,new T.ConeGeometry(.09,.3,4),toon('#7fa545'),()=>{const x=rr(-150,150),z=rr(-150,150);if(Math.hypot(x*.8,z+4)<28||x>34)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* colonnade along the main street */
  const cols=[];for(const sx of[-5.5,5.5])for(let z=14;z>=-22;z-=4)cols.push([sx,z]);let ci=0;
  CQ.scatter(cols.length,new T.CylinderGeometry(.3,.36,3.6,10),toon('#e4dac2'),()=>{const c=cols[ci++];return c?[c[0],H(c[0],c[1])+1.8,c[1],1]:0;},1);
  cols.forEach(c=>W.circles.push({x:c[0],z:c[1],r:.4}));
  /* houses behind the colonnade, and the meeting house */
  [[-11,12,7,6,3.4,1.57],[-11,-1,7,6,3.2,1.57],[11,5,7,6,3.3,-1.57],[11,-21,7,6,3.4,-1.57],[-11,-22,7,6,3.1,1.57],[-9,-8,0,0,0,0]].slice(0,5)
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%2===0,awning:i===2?-1:0}));
  CQ.house(-17,-8,10,7,4.2,1.57,{stone:'lime',plaster:1});
  [[-24,4],[-24,-18],[24,-12],[22,16],[28,-4]].forEach(p=>CQ.palm(p[0],p[1],rr(1,1.3)));[[-20,16],[20,-26],[-20,-28]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));
  /* market stalls (Tarsus, the second place of the story) */
  const stall=(x,z,col)=>{const g=new T.Group();g.position.set(x,H(x,z),z);W.scene.add(g);const a=mesh(new T.PlaneGeometry(3.2,2.4),toon(col,{side:T.DoubleSide}),0,2.5,0,g);a.rotation.x=-Math.PI/2+.15;
   for(const dx of[-1.5,1.5])mesh(new T.CylinderGeometry(.05,.05,2.5,6),M.wood,dx,1.25,-1,g);mesh(new T.BoxGeometry(3,.8,1),M.wood,0,.4,.2,g);CQ.jar(g,-.8,.8,.2,.3);CQ.jar(g,.8,.8,.2,.3);W.obstacles.push({x,z,w:3.2,d:1.4,rot:0,ox:0});return g;};
  stall(15,-4,'#c2503c');stall(15,-12,'#4f7fb5');const mk=stall(16,-8,'#d9a441');
  CQ.crowd([[11.5,-9,1.57],[12.5,-6,1.9],[12,-12,1.2],[13.5,-14.5,.8],[10,-2,1.6],[8.5,-11,-1.2],[14,-1,2.6],[9.5,-6,1.3]]);
  /* table with bread baskets */
  const tab=new T.Group();tab.position.set(7,H(7,-14),-14);W.scene.add(tab);mesh(new T.BoxGeometry(3.4,.5,1.2),M.wood,0,.45,0,tab);
  const bask=[];for(let i=0;i<8;i++){const b=mesh(new T.CylinderGeometry(.3,.22,.28,10),toon('#b98a4a'),-1.3+i*.37,.85,0,tab);const l=mesh(new T.SphereGeometry(.2,8,6),toon('#d9a25a'),-1.3+i*.37,1.05,0,tab);l.scale.y=.5;bask.push([b,l]);}
  W.obstacles.push({x:7,z:-14,w:3.4,d:1.2,rot:0,ox:0});
  const cart=new T.Group();cart.position.set(2.6,H(2.6,-14),-14);W.scene.add(cart);mesh(new T.BoxGeometry(2,.5,1.2),M.woodD,0,.6,0,cart);for(const s of[-1,1])mesh(new T.CylinderGeometry(.4,.4,.1,12),M.wood,s*.7,.4,.7,cart).rotation.x=Math.PI/2;
  const cb=[];for(let i=0;i<6;i++){const b=mesh(new T.CylinderGeometry(.28,.2,.26,10),toon('#b98a4a'),-.75+i*.3,.98,0,cart);b.visible=false;cb.push(b);}W.circles.push({x:2.6,z:-14,r:1.1});
  /* lamp light in the late afternoon */
  const lamp=new T.PointLight('#ffc878',.9,16,1.5);lamp.position.set(0,3,-6);W.scene.add(lamp);
  const bulb=new T.MeshBasicMaterial({color:'#ffd98a'});[[-5.5,-2],[5.5,-10],[-5.5,-14],[5.5,6]].forEach(p=>mesh(new T.SphereGeometry(.14,8,6),bulb,p[0],H(p[0],p[1])+2.6,p[1],null,false));
  /* characters */
  const eli=Object.assign({},CQ.CAST.eli,{S:.9,head:1.1,beard:1});
  const barn=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#6f8f5a',hem:.3,mantle:'#e9dcc0',sash:'#8a4a2a',hair:'#3a281c',beard:1,band:'#d9c9a0'}),-1,6,3.14);
  const saul=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#e9dcc0',hem:.2,mantle:'#5a3a6a',sash:'#2f3f6a',hair:'#1f160f',beard:2,S:.96}),16,-8.5,1.57);
  const elder=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.elder,{mantle:'#b5483a'})),-3.4,-8,-1.57);
  const kid=CQ.place(CQ.makeChar(CQ.CAST.kid),3,0,-.5);
  const woman=CQ.place(CQ.makeChar(CQ.CAST.woman2),8.6,-16,3.14);
  const prophet=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#c9c0a8',mantle:'#7a8a9a',hair:'#4a3a2c',beard:1,band:'#3f7f8f'}),-8,-8,1.57);
  const gather=CQ.ring(0,-18,9,3,5,0,6.28);CQ.crowd(gather);
  CQ.zones({A:{c:[2,-4],r:38,tod:'dusk'}});
  CQ.addInter({id:'barn',P:barn,name:'Ba-na-ba',h:2.05,r:2.8});
  CQ.addInter({id:'elder',P:elder,name:'một anh em ở An-ti-ốt',h:2.05,r:2.8});
  CQ.addInter({id:'market',obj:mk,x:16,z:-8,name:'chợ thành Tạt-sơ',verb:'Tìm Sau-lơ ở ',h:3,r:4});
  const sI=CQ.addInter({id:'saul',P:saul,name:'Sau-lơ',h:2.05,r:2.8});
  CQ.addInter({id:'table',obj:tab,x:7,z:-14,name:'bàn bánh',verb:'Lại gần ',h:1.8,r:3});
  CQ.addInter({id:'kid',P:kid,name:'em bé',h:1.7,side:1,run:d=>CQ.say('Em bé','Ba mẹ em nói ở đây ai cũng là anh em, dù đến từ nước nào.','Theo Công vụ 11:20-21','Hay quá!',d)});
  CQ.addInter({id:'prophet',P:prophet,name:'người đến từ Giê-ru-sa-lem',h:2.05,side:1,run:d=>CQ.say('Anh em từ Giê-ru-sa-lem','Có tiên tri báo sắp có cơn đói kém lớn khắp xứ. Chúng ta hãy lo giúp nhau.','Theo Công vụ 11:27-28','Vâng',d)});
  W.player=CQ.makeChar(eli);CQ.goZone('A',0,15,0,null,true);
  const NA='Người kể chuyện';
  W.steps=[
   {at:'barn',text:'Vào thành An-ti-ốt. Nói chuyện với Ba-na-ba',run:n=>{CQ.setCine([5,2.8,10,0,1.6,5]);
     CQ.lines([['Ê-li','Thành lớn quá, Ba-na-ba ạ! Có đủ các dân tộc nữa.','Theo Công vụ 11:19-21'],['Ba-na-ba','Chúa dùng những người tản lạc để đem tin lành đến đây.','Theo Công vụ 11:19-21']],()=>{CQ.setCine(null);n();});}},
   {at:'elder',text:'Anh em ở đây đang đợi. Lại gần nghe',run:n=>{CQ.setCine([-1,2.6,-3,-3,1.6,-8]);
     CQ.say(NA,'Khi người đến nơi và thấy ơn Đức Chúa Trời, bèn vui mừng và khuyên mọi người phải cứ vững lòng theo Chúa.','Công vụ 11:23',null,()=>
     CQ.fillWord({name:'Ba-na-ba',before:'Khuyên mọi người phải cứ',after:' theo Chúa.',options:['vững lòng','bỏ đạo','sợ hãi'],answer:'vững lòng',ref:'Công vụ 11:23',wrong:'Chưa đúng. Ba-na-ba khích lệ họ đứng vững.'},()=>{CQ.setCine(null);n();}));}},
   {at:'market',text:'Thành Tạt-sơ. Ra chợ tìm Sau-lơ',run:n=>{CQ.setCine([8,3.2,-2,14,1.4,-8]);
     CQ.say(NA,'Kế đó, Ba-na-ba đi đến thành Tạt sơ, để tìm Sau-lơ, tìm gặp rồi, bèn đưa đến thành An-ti-ốt.','Công vụ 11:25-26',null,()=>
     CQ.tapFill({name:'Tìm Sau-lơ',text:'Chạm để tìm Sau-lơ giữa những người trong chợ thành Tạt-sơ.',need:8},()=>{CQ.setCine(null);CQ.walkTo(saul,10,-8,2.6,()=>CQ.face(saul,W.player.x,W.player.z));n();}));}},
   {at:'saul',text:'Sau-lơ đã về An-ti-ốt. Lại gần hỏi chuyện',run:n=>{
     CQ.say(NA,'Ấy là ở thành An-ti-ốt, người ta bắt đầu xưng môn đồ là Cơ rê tiên.','Công vụ 11:26',null,()=>
     CQ.choice({name:'Ê-li',q:'Tên mới của các môn đồ ở An-ti-ốt là gì?',options:['Cơ-rê-tiên','Pha-ri-si','Sa-đu-sê'],ref:'Công vụ 11:26',wrong:'Chưa đúng. Đó là tên gọi các người theo Đấng Christ.'},n));}},
   {at:'table',text:'Có tin đói kém ở xứ Giu-đê. Đến bàn đặt giỏ bánh',run:n=>{CQ.setCine([2,3.4,-9,5,1,-14]);
     CQ.balance({name:'Gởi quà',text:'Đặt những giỏ bánh lên cân để gởi đều cho các gia đình ở Giu-đê. Mỗi người dâng tùy sức mình.',secs:6,onP:p=>{bask.forEach((b,i)=>{b[0].visible=b[1].visible=i>=p*8;});cb.forEach((b,i)=>b.visible=i<p*6);}},()=>
     CQ.say(NA,'Các môn đồ quyết định mỗi người tùy sức mình gởi giúp anh em ở xứ Giu-đê gặp cơn đói kém.','Theo Công vụ 11:27-30',null,()=>{CQ.setCine(null);n();}));}},
   {at:'barn',text:'Hội thánh nhóm lại cầu nguyện. Lại gần Ba-na-ba',run:n=>{CQ.setCine([6,3,2,0,1.6,-12]);
     CQ.walkTo(barn,-.8,-14,2.6);CQ.walkTo(saul,.8,-14,2.6);
     CQ.say(NA,'Hội thánh nhịn ăn, cầu nguyện, đặt tay và sai Ba-na-ba và Sau-lơ đi giảng xa.','Theo Công vụ 13:2-3','Amen',()=>{CQ.setCine(null);n();});}}];
 }});
