/* Chapter: Saul on the road to Damascus (Acts 9:1-9). Time of day: the passage says "gần đến thành" (Giăng/Công vụ 22 says about noon), so full daylight.
   Quoted word for word (1925 text): Công vụ 9:3-4 (narration and the Lord's words). Everything else paraphrased ("Theo"). */
'use strict';
CQ.chapters.push({id:'damascus',no:24,title:'Ánh sáng trên đường Đa-mách',sub:'Sau-lơ gặp Chúa · buổi trưa',
 intro:[
  {t:'Người đi bắt tín đồ',x:'Sau-lơ, một người học rộng, hăm hở đi bắt những ai theo đạo của Chúa Giê-su. Ê-li nghe tin và e ngại.',ref:'Theo Công vụ 9:1-2',cam:[3,3,26,0,1.6,10]},
  {t:'Đường đi Đa-mách',x:'Sau-lơ cùng mấy người đi dưới nắng trưa, càng lúc càng gần thành Đa-mách.',ref:'Theo Công vụ 9:3',cam:[-7,2.4,0,0,3,-40]},
  {t:'Có ánh sáng từ trời',x:'Thình lình có ánh sáng từ trời soi sáng chung quanh người. Một tiếng gọi vang lên.',ref:'Theo Công vụ 9:3-4',cam:[6,2,4,0,9,10]}],
 outro:'Người té xuống đất, và nghe có tiếng phán cùng mình rằng: Hỡi Sau-lơ, Sau-lơ, sao ngươi bắt bớ ta?',outroRef:'Công vụ 9:4',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:0,r:40,h:16};
  const H=(x,z)=>{const r=Math.hypot(x,z);return 1+sm(5,22,Math.abs(x))*(1.6*noise(x*.5,z*.5)+1.2*noise(x*.15,z*.15))+.2*noise(x*3,z*3)+sm(60,150,r)*10;};
  W.paths=[[[0,32],[0,-30],[0,-52]]];
  const sand=C('#e0c585'),sand2=C('#cfa766'),road=C('#d9bf8c');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(sand).lerp(sand2,.5+.5*noise(x*.4,z*.4));c.lerp(road,1-sm(2.2,4.2,CQ.distPath(x,z)+noise(x*2,z*2)*.6));}});
  CQ.sky({fogNear:70,fogFar:230,clouds:4});
  CQ.scatter(900,new T.ConeGeometry(.1,.35,4),toon('#9a9a4c'),()=>{const x=rr(-130,130),z=rr(-130,130);if(CQ.distPath(x,z)<3)return 0;return[x,H(x,z)+.1,z,rr(.7,1.4)];});
  CQ.scatter(220,new T.DodecahedronGeometry(.4,0),toon('#b9a27c'),()=>{const x=rr(-90,90),z=rr(-90,60);if(CQ.distPath(x,z)<2.6)return 0;return[x,H(x,z)+.1,z,rr(.5,1.8),rr(.5,.9)];});
  [[-9,22],[10,6],[-12,-12],[11,-22],[-18,-30],[16,-34],[-8,36]].forEach(p=>CQ.bush(p[0],p[1],rr(.9,1.4),['#8a9a4c','#a3a35a','#7c8c48']));
  [[-14,8],[15,18],[-16,-24]].forEach(p=>CQ.olive(p[0],p[1],rr(.9,1.2)));[[18,-12],[-20,-4],[-22,26]].forEach(p=>CQ.palm(p[0],p[1],1.1));
  /* city wall and gate of Damascus */
  const WZ=-46,wg=new T.Group();wg.position.set(0,H(0,WZ),WZ);W.scene.add(wg);
  const st=M.lime,add=(w,h,d,x,y,z,mt)=>mesh(CQ.boxUV(w,h,d,3),mt||st,x,y,z,wg);
  add(30,7,2,-21,2.5,0);add(30,7,2,21,2.5,0);add(4.4,10,4.4,-7.4,4.5,0);add(4.4,10,4.4,7.4,4.5,0);add(12,2.2,3.4,0,8.9,0);
  for(const s of[-1,1])for(let i=0;i<5;i++)add(1.4,.8,2.2,s*(10+i*6),6.4,0);
  W.obstacles.push({x:-21,z:WZ,w:30,d:2,rot:0,ox:0},{x:21,z:WZ,w:30,d:2,rot:0,ox:0},{x:-7.4,z:WZ,w:4.4,d:4.4,rot:0,ox:0},{x:7.4,z:WZ,w:4.4,d:4.4,rot:0,ox:0});
  [[-18,-58,8,7,4.2,0],[-6,-60,8,7,5,0],[8,-59,8,7,4.4,0],[20,-57,7,7,3.6,0]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2}));
  /* the donkey with luggage */
  const dk=new T.Group(),gr=toon('#8f8274'),dkm=(g,x,y,z,s)=>{const m=mesh(g,gr,x,y,z,dk);m.scale.set(...s);return m;};
  dkm(new T.SphereGeometry(.5,10,8),0,1,0,[.8,.9,1.5]);dkm(new T.SphereGeometry(.28,8,6),0,1.4,.85,[.9,1,1.3]);
  for(const x of[-.28,.28])for(const z of[-.5,.5])mesh(new T.CylinderGeometry(.07,.06,.8,6),gr,x,.4,z,dk);
  mesh(new T.BoxGeometry(.9,.5,.7),toon('#b5483a'),0,1.55,0,dk);mesh(new T.BoxGeometry(.7,.35,.5),toon('#e9dcc0'),0,1.95,0,dk);
  dk.position.set(2.8,H(2.8,16),16);dk.rotation.y=3.5;W.scene.add(dk);W.circles.push({x:2.8,z:16,r:.9});
  /* the light from heaven */
  const gm=new T.MeshBasicMaterial({color:'#fffbe0',transparent:true,opacity:0,depthWrite:false}),glow=mesh(new T.SphereGeometry(1,20,14),gm,0,10,2,W.scene,false);
  glow.position.set(0,H(0,2)+9,2);let gp=0,gt=0;
  W.tick.push(dt=>{gp+=(gt-gp)*Math.min(1,dt*2);gm.opacity=.92*Math.min(1,gp*1.3);glow.scale.setScalar(.2+gp*3.4);});
  /* people */
  const sT=Object.assign({},CQ.CAST.eli,{S:.82,head:1.12});W.player=CQ.makeChar(sT);
  const saulC={skin:'#c08a5e',tunic:'#4a2f6a',hem:.35,mantle:'#1f1a2a',sash:'#d9a441',hair:'#241a13',beard:1,band:'#e9dcc0',staff:1};
  const saul=CQ.place(CQ.makeChar(saulC),0,6,Math.PI);
  const m1=CQ.place(CQ.makeChar(CQ.CAST.man),-2.6,11,Math.PI),m2=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.man2,{staff:1})),-1.2,14,Math.PI);
  const guard=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#8a3a3a',hem:.4,mantle:'#555a62',sash:'#2a2a2a',hair:'#241a13',beard:1,staff:1}),4.4,-43.6,0);
  const trav=CQ.place(CQ.makeChar(CQ.CAST.woman2),-5,-28,.8);
  CQ.zones({A:{c:[0,-8],r:55,tod:'day'}});
  const gate=CQ.addInter({id:'gate',P:guard,name:'cổng thành Đa-mách',verb:'Đến ',h:2.1,r:3});
  CQ.addInter({id:'saul',P:saul,name:'ông Sau-lơ',h:2.2,r:2.6});
  CQ.addInter({id:'m1',P:m1,name:'người đi cùng',h:2.1,side:1,run:d=>CQ.say('Người đi cùng','Ông Sau-lơ đi gấp lắm. Chúng tôi theo ông từ Giê-ru-sa-lem, mang thư của thầy cả thượng phẩm.','Theo Công vụ 9:1-2','Dạ',d)});
  CQ.addInter({id:'trav',P:trav,name:'người đàn bà',h:2,side:1,run:d=>CQ.say('Người đàn bà','Đa-mách là thành xưa lắm, trời trưa nóng quá. Cháu nhớ uống nước nhé.',null,'Dạ, cảm ơn bà',d)});
  const look=(y)=>CQ.setCine([5,y,12,0,1.4,6]);
  W.steps=[
   {at:'saul',text:'Đi theo ông Sau-lơ trên đường',run:n=>{CQ.setCine([3,2,10,0,1.4,6]);
     CQ.lines([['Ê-li','Thưa ông Sau-lơ, trời nắng quá. Còn bao xa đến Đa-mách ạ?','Theo Công vụ 9:3'],['Sau-lơ','Gần đến rồi. Ta đã có thư cho phép bắt họ.','Theo Công vụ 9:1-2']],()=>{CQ.setCine(null);n();});}},
   {at:'saul',text:'Có gì sáng trên trời? Lại gần ông Sau-lơ',run:n=>{CQ.setCine([5,2.4,12,0,7,3]);gt=1;
     CQ.say('Người kể chuyện','Sau-lơ đang đi đường gần đến thành Đa-mách, thình lình có ánh sáng từ trời soi sáng chung quanh người.','Công vụ 9:3','Ồ!',()=>
      CQ.tapFill({name:'Ánh sáng',text:'Chạm vào ánh sáng để che mắt, nhìn xem ánh sáng từ đâu đến.',need:8,onP:p=>{gt=1+p*.3;}},()=>{CQ.setCine(null);n();}));}},
   {at:'saul',text:'Nghe tiếng phán. Lại gần ông Sau-lơ',run:n=>{saul.g.rotation.x=-1.45;saul.g.rotation.y=Math.PI;CQ.setCine([5,2.2,9,0,.8,6]);
     CQ.lines([['Chúa Giê-su','Hỡi Sau-lơ, Sau-lơ, sao ngươi bắt bớ ta?','Công vụ 9:4'],['Sau-lơ','Lạy Chúa, Ngài là ai?','Theo Công vụ 9:5']],()=>
      CQ.order({name:'Lời Chúa phán',q:'Ghép lời Chúa phán cùng Sau-lơ.',chunks:['Hỡi Sau-lơ, Sau-lơ,','sao ngươi','bắt bớ ta?'],ref:'Công vụ 9:4'},()=>{CQ.setCine(null);n();}));}},
   {at:'saul',text:'Đỡ ông Sau-lơ dậy',run:n=>{
     CQ.say('Chúa Giê-su','Hãy dậy, vào thành, sẽ có người nói cho ngươi biết điều ngươi phải làm.','Theo Công vụ 9:6','Dạ',()=>
      CQ.choice({name:'Câu hỏi',q:'Chúa Giê-su gọi Sau-lơ bằng cách nào?',options:['Bằng ánh sáng và tiếng phán','Bằng một lá thư','Bằng tiếng chuông'],ref:'Công vụ 9:3-4',wrong:'Chưa đúng. Nhớ lại điều đã xảy ra giữa đường.'},()=>{saul.g.rotation.x=0;gt=0;n();}));}},
   {at:'gate',text:'Dắt ông Sau-lơ đến cổng thành',run:n=>{CQ.setCine([6,3.2,-30,0,1.6,-44]);CQ.walkTo(saul,1.2,-41,2.6);
     CQ.lines([['Ê-li','Thưa ông, xin nắm tay cháu. Cháu sẽ dẫn ông vào thành.','Theo Công vụ 9:8'],['Người kể chuyện','Trong ba ngày Sau-lơ không thấy, không ăn không uống, chỉ cầu nguyện.','Theo Công vụ 9:9-11']],()=>{CQ.setCine(null);n();});}}];
  CQ.goZone('A',0,24,0,null,true);
 }});
