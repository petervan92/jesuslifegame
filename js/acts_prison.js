/* Chapter 29: Peter freed from prison (Acts 12:1-17). The text says the night before Herod meant to bring him out (12:6): night.
   Quoted word for word (1925 text): Công vụ 12:7 (Hãy mau chờ dậy). Narration elsewhere is paraphrased ("Theo ..."). */
'use strict';
CQ.chapters.push({id:'prison',no:29,title:'Phi-e-rơ ra khỏi ngục',sub:'Xiềng rơi xuống · ban đêm',
 intro:[
  {t:'Phi-e-rơ bị bắt',x:'Vua Hê-rốt bắt Phi-e-rơ bỏ vào khám, có bốn tốp lính canh giữ. Nhưng Hội thánh cứ cầu nguyện cho ông.',ref:'Theo Công vụ 12:1-5',cam:[12,5,-27,0,2,-46]},
  {t:'Đêm cuối cùng',x:'Đêm trước ngày Hê-rốt định đem ông ra, Phi-e-rơ ngủ yên giữa hai tên lính, tay mang xiềng.',ref:'Theo Công vụ 12:6',cam:[3,3.6,-48.5,-1,1.3,-57]},
  {t:'Cầu nguyện trong nhà',x:'Anh em nhóm tại nhà bà Ma-ri và cầu nguyện thâu đêm. Ê-li ngồi gần cửa, tay cầm đèn nhỏ.',ref:'Theo Công vụ 12:5, 12',cam:[8,3.6,7,0,1.2,-3]}],
 outro:'Phi-e-rơ kể lại Chúa đã đem mình ra khỏi ngục như thế nào.',outroRef:'Theo Công vụ 12:17',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='night';W.startYaw=0;W.menuCam={x:0,y:2,z:-20,r:50,h:16};
  W.paths=[[[0,30],[0,2]],[[0,-30],[0,-46]]];
  const H=(x,z)=>.3*noise(x*.5,z*.5)+sm(60,150,Math.hypot(x,z+24))*10;
  const yard=C('#a89c80'),g1=C('#6f8a4a'),g2=C('#85994f'),dirt=C('#bfae88');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));
   c.lerp(dirt,(1-sm(1.6,3.4,CQ.distPath(x,z)))*.9);
   c.lerp(yard,1-sm(13,16,Math.hypot(x,z)));c.lerp(yard,1-sm(13,16,Math.hypot(x,z+48)));}});
  CQ.sky({fogNear:40,fogFar:150,clouds:3});
  CQ.scatter(1200,new T.ConeGeometry(.09,.3,4),toon('#587a34'),()=>{const x=rr(-90,90),z=rr(-110,50);if(Math.hypot(x,z)<15||Math.hypot(x,z+48)<15||CQ.distPath(x,z)<2.4)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* A: Mary's house and walled courtyard */
  CQ.house(-8,-13,9,7,3.4,0,{stone:'lime',plaster:1,roofJars:1});CQ.house(9,-13,8,7,3,0,{stone:'lime'});
  CQ.house(-20,-3,6,6,3,1.57,{stone:'lime',plaster:1});CQ.house(20,-3,6,6,3,-1.57,{stone:'lime'});
  CQ.wallBox(-8,12,12,2.4,.5,0,M.lime);CQ.wallBox(8,12,12,2.4,.5,0,M.lime);
  CQ.wallBox(-14,-1,.5,2.4,26,0,M.lime);CQ.wallBox(14,-1,.5,2.4,26,0,M.lime);
  [[-12,20],[12,22],[-18,16]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));CQ.palm(17,12,1.1);
  CQ.campfire(3,-3);CQ.crowd(CQ.ring(3,-3,7,2,3),{sit:1});
  const wood=toon('#7a5230'),iron=toon('#3a3a42');
  const leaf=(x,z,s,mat,bars)=>{const g=new T.Group();g.position.set(x,H(x,z),z);W.scene.add(g);
   mesh(new T.BoxGeometry(2,.14,.14),mat,-s,.2,0,g);mesh(new T.BoxGeometry(2,.14,.14),mat,-s,2.6,0,g);
   if(bars)for(let i=0;i<5;i++)mesh(new T.CylinderGeometry(.04,.04,2.6,6),mat,-s*(.1+i*.45),1.4,0,g);else mesh(new T.BoxGeometry(2,2.5,.12),mat,-s,1.4,0,g);return g;};
  let dA=0,dB=0;const dl=leaf(-2,12,-1,wood),dr=leaf(2,12,1,wood),gl=leaf(-2,-38,-1,iron,1),gr=leaf(2,-38,1,iron,1);
  const dOb={x:0,z:12,w:4,d:.6,rot:0,ox:0},gOb={x:0,z:-38,w:4,d:.6,rot:0,ox:0};W.obstacles.push(dOb,gOb);
  W.tick.push(dt=>{dl.rotation.y=dA;dr.rotation.y=-dA;gl.rotation.y=dB;gr.rotation.y=-dB;});
  /* B: the prison yard and cell */
  const rock=M.basalt;
  CQ.wallBox(-8.5,-38,13,3.5,.8,0,rock);CQ.wallBox(8.5,-38,13,3.5,.8,0,rock);
  CQ.wallBox(-13.5,-49,.8,3.5,22,0,rock);CQ.wallBox(13.5,-49,.8,3.5,22,0,rock);
  CQ.wallBox(-6.5,-56.5,.8,3.2,8,0,rock);CQ.wallBox(6.5,-56.5,.8,3.2,8,0,rock);CQ.wallBox(0,-60.5,13.8,3.2,.8,0,rock);
  CQ.campfire(-8,-42);CQ.campfire(8,-42);
  const straw=mesh(new T.CylinderGeometry(5.2,5.2,.06,16),toon('#b59a58'),0,H(0,-56)+.04,-56);
  const soldier=(x,z,r)=>CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#9a2f2f',hem:.45,sash:'#4a3a2c',hair:'#6b6f78',band:'#c9ccd4',staff:1,W:1.1}),x,z,r);
  const s1=soldier(-3.6,-57.5,0),s2=soldier(3.4,-57.5,0);soldier(-3.6,-39.6,3.14);soldier(3.6,-39.6,3.14);
  const peter=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.peter,{W:1.15,hair:'#6b5d52'})),-1,-57.5,0);
  const angel=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.angel,{float:.9})),1.5,-56.5,0);angel.light.intensity=1.6;
  const ch=new T.Group();ch.position.set(-1.7,0,-57);W.scene.add(ch);const chm=toon('#6a6a70');
  for(let i=0;i<5;i++)mesh(new T.TorusGeometry(.1,.03,5,8),chm,i*.12-.2,H(-1.7,-57)+1.25-i*.12,0,ch).rotation.y=i%2?0:1.5;
  let drop=0;W.tick.push(dt=>{if(drop)ch.position.y=Math.max(-1.18,ch.position.y-dt*3);});
  /* Mary and the friends in the house */
  const mary=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.woman,{tunic:'#6b4f8f',veil:'#eadfc6',S:.97})),-3,-2,.6);
  const rhoda=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.woman2,{S:.88,tunic:'#d98a4a'})),2,9.5,3.14);
  const mark=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.kid,{tunic:'#5f86a8'})),-5,5,.4);
  const widow=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.woman,{tunic:'#7d8a5c'})),8,-6,-1.2);
  const jc=Object.assign({},CQ.CAST.eli,{S:.92,head:1.06,hem:.45,tunic:'#e8803f',beard:0});
  const hand=W.player=CQ.place(CQ.makeChar(jc),0,9,0);
  const lm=mesh(new T.CylinderGeometry(.07,.09,.12,8),toon('#c2714a'),0,-.75,.1,hand.arms[1]);
  mesh(new T.SphereGeometry(.05,6,5),new T.MeshBasicMaterial({color:'#ffd27a'}),0,-.64,.1,hand.arms[1]);
  CQ.zones({A:{c:[0,2],r:23,tod:'night'},B:{c:[0,-48],r:14.5,tod:'night'}});
  CQ.addInter({id:'mark',P:mark,name:'Giăng Mác',h:1.6,side:1,run:d=>CQ.say('Giăng Mác','Đây là nhà mẹ con. Đêm nay anh em họp lại đông lắm, ai cũng cầu nguyện cho bác Phi-e-rơ.','Theo Công vụ 12:12','Vâng',d)});
  CQ.addInter({id:'widow',P:widow,name:'bà ngồi cầu nguyện',h:2,side:1,run:d=>CQ.say('Bà cụ','Hội thánh cầu nguyện không thôi. Chúa là Đấng nghe lời con cái Ngài.','Theo Công vụ 12:5','Amen',d)});
  CQ.addInter({id:'mary',P:mary,name:'bà Ma-ri',h:2});
  CQ.addInter({id:'angel',P:angel,name:'thiên sứ',h:3.6});
  CQ.addInter({id:'gate',obj:gl,x:0,z:-38,name:'cổng sắt',verb:'Đẩy ',h:3.4,r:3.2});
  CQ.addInter({id:'rhoda',P:rhoda,name:'Rô-đơ',h:2});
  CQ.addInter({id:'door',obj:dl,x:0,z:12,name:'cổng gỗ',verb:'Mở ',h:3.2,r:3.2});
  CQ.addInter({id:'peter',P:peter,name:'Phi-e-rơ',h:2.3});
  CQ.goZone('A',0,9,0,null,true);
  W.steps=[
   {at:'mary',text:'Lại gần bà Ma-ri, cầu nguyện cho Phi-e-rơ',run:n=>CQ.lines([
     ['Ê-li','Con thắp đèn nhé. Mình xin Chúa giữ gìn bác Phi-e-rơ.','Theo Công vụ 12:5'],
     ['Bà Ma-ri','Cứ tin, con ạ. Chúa nghe lời cầu nguyện của anh em.','Theo Công vụ 12:5'],
     ['Người kể chuyện','Cùng lúc ấy, trong khám, Phi-e-rơ đang ngủ giữa hai tên lính, tay mang xiềng.','Theo Công vụ 12:6']],
     ()=>{CQ.goZone('B',0,-43,0,()=>CQ.setCine(null));n();})},
   {at:'angel',text:'Vào xem trong khám, lại gần thiên sứ',run:n=>{CQ.setCine([5,3,-50,0,1.6,-57]);
     CQ.say('Người kể chuyện','Thình lình, một thiên sứ của Chúa đến, và có ánh sáng soi trong ngục tối.','Công vụ 12:7','Tiếp',()=>
     CQ.fillWord({name:'Thiên sứ',before:'Hãy mau',after:'.',options:['chờ dậy','ngủ đi','ở lại'],answer:'chờ dậy',ref:'Công vụ 12:7',wrong:'Chưa đúng. Thiên sứ đến để đánh thức Phi-e-rơ.'},()=>{drop=1;
     CQ.say('Người kể chuyện','Xiềng liền rớt khỏi tay Phi-e-rơ. Hai tên lính vẫn ngủ say.','Theo Công vụ 12:7','Tiếp',()=>{CQ.setCine(null);
     CQ.walkTo(angel,0,-45,3);CQ.walkTo(peter,-1,-44,3);n();})}));}},
   {at:'gate',text:'Khẽ đẩy cổng sắt cho Phi-e-rơ ra',run:n=>{CQ.setCine([6,4,-31,0,1.6,-38]);
     CQ.say('Người kể chuyện','Phi-e-rơ cứ ngỡ mình thấy dị tượng. Ông theo thiên sứ đi qua các tốp lính canh, đến cổng sắt.','Theo Công vụ 12:9-10','Tiếp',()=>
     CQ.tapFill({name:'Cổng sắt',text:'Chạm nhẹ nhiều lần để đẩy cổng sắt ra, đừng làm lính thức giấc.',need:9,onP:p=>{dB=p*1.4;}},()=>{dB=1.4;W.obstacles.splice(W.obstacles.indexOf(gOb),1);
     CQ.say('Người kể chuyện','Cổng sắt tự mở ra cho ông. Đi hết một đường phố, thiên sứ bèn lìa khỏi ông.','Theo Công vụ 12:10','Tiếp',()=>{CQ.setCine(null);
     CQ.goZone('A',0,8,3.14,()=>{CQ.place(peter,0,15.5,3.14);CQ.place(angel,0,-90,0);angel.g.visible=false;CQ.setCine(null);});n();})}));}},
   {at:'rhoda',text:'Có người gõ cổng! Hỏi Rô-đơ',run:n=>{CQ.setCine([5,3.4,16,0,1.4,11]);
     CQ.say('Người kể chuyện','Phi-e-rơ gõ cổng ngoài. Một con đòi tên là Rô-đơ ra nghe. Nhận ra tiếng Phi-e-rơ, chị mừng quá đến nỗi quên mở cổng, chạy vào báo tin.','Theo Công vụ 12:13-14','Tiếp',()=>
     CQ.choice({name:'Rô-đơ',q:'Con đòi nào nhận ra tiếng Phi-e-rơ?',options:['Rô-đơ','Ly-đi','Ta-bi-tha'],ref:'Theo Công vụ 12:13',wrong:'Chưa đúng. Chị ấy mừng quá, quên cả mở cổng.'},()=>{CQ.setCine(null);n();}));}},
   {at:'door',text:'Chạy ra mở cổng gỗ',run:n=>{CQ.setCine([5,3.4,6,0,1.4,13]);
     CQ.say('Ê-li','Là bác Phi-e-rơ thật rồi! Mời bác vào ạ!','Theo Công vụ 12:16','Mở cổng',()=>{
     const o=setInterval(()=>{dA=Math.min(1.4,dA+.06);if(dA>=1.4){clearInterval(o);W.obstacles.splice(W.obstacles.indexOf(dOb),1);CQ.walkTo(peter,1.4,7.5,3);}},30);
     CQ.setCine(null);n();});}},
   {at:'peter',text:'Nghe Phi-e-rơ kể lại',run:n=>{CQ.setCine([5,2.8,4,0,1.5,8]);
     CQ.say('Phi-e-rơ','Chúa đã sai thiên sứ giải cứu tôi. Xin báo tin cho anh em.','Theo Công vụ 12:17','Tiếp',()=>
     CQ.order({name:'Phi-e-rơ kể lại',q:'Ghép lại thứ tự câu chuyện.',chunks:['Thiên sứ đến,','xiềng rơi xuống,','cổng sắt mở,','Phi-e-rơ về nhà bà Ma-ri.'],ref:'Theo Công vụ 12:7-12'},()=>{CQ.setCine(null);n();}));}}];
 }});
