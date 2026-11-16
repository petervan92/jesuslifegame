/* Chapter: the Samaritan woman at Jacob's well (John 4:1-42). Midday: "bấy giờ độ chừng giờ thứ sáu" (John 4:6), so the bright 'desert' preset.
   Quoted word for word (1925 text, checked): Giăng 4:7 ("Hãy cho ta uống."), 4:13-14 (first sentence), 4:29, 4:42 (last clause). */
'use strict';
CQ.chapters.push({id:'samaria',no:7,title:'Bên giếng Gia-cốp',sub:'Người đàn bà Sa-ma-ri và nước hằng sống · giữa trưa (Giăng 4:6)',
 intro:[
  {t:'Đường qua xứ Sa-ma-ri',x:'Chúa Giê-su đi qua xứ Sa-ma-ri, đến gần thành Si-kha. Ở đó có cái giếng của tổ phụ Gia-cốp, giữa những cánh đồng lúa đã vàng.',ref:'Theo Giăng 4:4-6',cam:[24,20,52,0,2,4]},
  {t:'Giữa trưa nắng gắt',x:'Đi đường mỏi mệt, Chúa Giê-su ngồi nghỉ bên giếng. Các môn đồ đã vào thành mua đồ ăn. Ê-li ở lại gần đó.',ref:'Theo Giăng 4:6-8',cam:[7,6.5,32,1.2,2.6,25]}],
 outro:'Nhiều người Sa-ma-ri tin Chúa Giê-su. Họ biết rằng chính Ngài thật là Cứu Chúa của thế gian.',outroRef:'Theo Giăng 4:39-42',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='desert';W.startYaw=0;W.menuCam={x:0,y:3,z:-6,r:56,h:18};
  W.paths=[[[0,-28],[0,40]]];
  const H=(x,z)=>{const r=Math.hypot(x,z+8);return 2+.6*noise(x,z)*sm(4,12,Math.min(Math.hypot(x,z-25),Math.hypot(x,z+40)))+4*Math.exp(-(x*x+(z+42)*(z+42))/500)+sm(70,160,r)*14;};
  const dry=C('#d3bd88'),road=C('#e6d6aa'),wheat=C('#ecdfae'),scrub=C('#b5b46e');
  const field=(x,z)=>Math.abs(x)>6&&Math.abs(x)<36&&z>-20&&z<44;
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(dry).lerp(scrub,.3+.3*noise(x*1.9,z*1.9));if(field(x,z))c.lerp(wheat,.8);c.lerp(road,(1-sm(1.4,3.4,CQ.distPath(x,z)))*.9);}});
  CQ.sky({fogNear:60,fogFar:210,clouds:4});
  CQ.scatter(3200,new T.ConeGeometry(.07,.55,4),toon('#f1e4b4'),()=>{const x=rr(-36,36),z=rr(-20,44);if(!field(x,z))return 0;return[x,H(x,z)+.25,z,rr(.8,1.2)];});
  CQ.scatter(60,new T.DodecahedronGeometry(.6,0),toon('#b8a47e'),()=>{const x=rr(-60,60),z=rr(-30,60);if(field(x,z)||CQ.distPath(x,z)<3||Math.hypot(x,z-25)<6)return 0;return[x,H(x,z)+.1,z,rr(.4,1.3),rr(.5,.8)];},true);
  [[-9,22],[10,30],[-14,40],[16,8]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.2)));
  /* Jacob's well: stone ring, beam, rope and bucket; a stone seat beside it */
  const wy=H(0,25),wg=new T.Group();wg.position.set(0,wy,25);W.scene.add(wg);
  mesh(new T.CylinderGeometry(1.1,1.25,.9,20,1,true),toon('#bfae8c',{side:T.DoubleSide}),0,.45,0,wg);mesh(new T.TorusGeometry(1.12,.13,6,24),toon('#a8966f'),0,.9,0,wg).rotation.x=Math.PI/2;
  mesh(new T.CircleGeometry(1.05,20),toon('#16303c'),0,.25,0,wg,false).rotation.x=-Math.PI/2;
  for(const x of[-1.2,1.2])mesh(new T.CylinderGeometry(.09,.09,2.7,6),M.woodD,x,1.35,0,wg);mesh(new T.CylinderGeometry(.08,.08,2.6,6),M.wood,0,2.6,0,wg).rotation.z=Math.PI/2;
  const rope=mesh(new T.CylinderGeometry(.015,.015,1,4),toon('#d9c391'),0,2,0,wg,false),bucket=mesh(new T.CylinderGeometry(.2,.15,.3,10),M.wood,0,.3,0,wg);
  const setB=(y,x)=>{bucket.position.set(x||0,y,0);rope.scale.y=2.6-y-.15;rope.position.set((x||0)/2,(2.6+y+.15)/2,0);rope.rotation.z=-(x||0)/(2.6-y);};setB(.3);W.circles.push({x:0,z:25,r:1.35});
  mesh(new T.CylinderGeometry(.38,.42,.42,12),toon('#b8a47e'),2.35,H(2.35,25.2)+.2,25.2);
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),2.35,25.2,-1.57);jesus.dy=-.12;
  W.tick.push(()=>{jesus.legs.forEach(l=>l.rotation.x=-1.45);});
  const woman=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.woman,{jar:1})),0,8,0);
  const headJar=woman.head.children.find(c=>c.geometry&&c.geometry.type==='LatheGeometry');
  /* the town of Si-kha on its low hill, with four groups of townspeople */
  [[-13,-34,7,6,3.2,1.57],[-13,-45,6,6,3,1.57],[13,-35,7,6,3,-1.57],[13,-46,6,6,3.3,-1.57],[-5,-55,7,6,3.2,0],[6,-55,7,6,3,0],[-22,-40,6,6,3,1.57],[22,-40,6,6,3,-1.57]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%3===0,awning:i===4?1:0,mat:i===2?'#b5483a':null}));
  [[-8,-28],[9,-27],[-17,-52],[17,-53]].forEach(p=>CQ.palm(p[0],p[1],1.1));
  CQ.crowd([[-9.4,-40,1.57],[-9.6,-41.2,1.57],[9.4,-41,-1.57],[2,-50.5,0],[-1,-50.6,0]]);
  const looks=[['elder','man'],['woman2','kid'],['man2','shepherd2'],['woman','man']];
  const gp=[[-5,-35],[5.5,-34],[-5,-45],[5.5,-46]];
  const groups=gp.map((p,i)=>{const a=CQ.place(CQ.makeChar(CQ.CAST[looks[i][0]]),p[0],p[1],0),b=CQ.place(CQ.makeChar(CQ.CAST[looks[i][1]]),p[0]+1.1,p[1]+.6,-.5);
    CQ.addInter({id:'g'+i,P:a,name:'người trong thành',verb:'Báo tin cho ',h:2.05,r:2.4,ch:[a,b]});return[a,b];});
  const peter=CQ.place(CQ.makeChar(CQ.CAST.peter),-8,-29,.6);mesh(new T.CylinderGeometry(.3,.22,.3,10,1,true),toon('#c9a15c',{side:T.DoubleSide}),0,-.75,.15,peter.arms[1]);
  W.player=CQ.makeChar(CQ.CAST.eli);
  CQ.zones({A:{c:[0,26],r:18,tod:'desert'},B:{c:[0,-40],r:18,tod:'desert'}});
  CQ.addInter({id:'peter',P:peter,name:'Phi-e-rơ',h:2.05,side:1,run:d=>CQ.say('Phi-e-rơ','Chào Ê-li! Thầy mệt nên ngồi nghỉ bên giếng. Chúng tôi vào thành mua đồ ăn đây.','Theo Giăng 4:6-8','Dạ',d)});
  CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:1.9,r:2.6,noTurn:1});
  const tI=CQ.addInter({id:'town',P:groups[0][0],name:'dân thành',h:2.05,r:2.6,hidden:true});
  CQ.addInter({id:'well',obj:wg,x:0,z:25,name:'giếng Gia-cốp',verb:'Kéo gàu ở ',h:3,r:2.6});
  CQ.goZone('A',3,35,0,null,true);
  const WC=[5.4,wy+3.6,31.5,.6,wy+1.2,24.6];
  W.steps=[
   {at:'jesus',text:'Lại gần giếng Gia-cốp, nơi Thầy đang ngồi nghỉ',run:n=>{CQ.setCine([6,wy+5,37,0,wy+1,18]);
     const ask=()=>{CQ.setCine(WC);CQ.face(jesus,-1.4,23.2);CQ.lines([['Chúa Giê-su','Hãy cho ta uống.','Giăng 4:7'],
       ['Người đàn bà','Ông là người Giu-đa, sao lại xin nước uống với tôi, là một người đàn bà Sa-ma-ri?','Theo Giăng 4:9']],()=>{CQ.setCine(null);n();});};
     CQ.say('Người kể chuyện','Lúc ấy độ chừng giữa trưa. Có một người đàn bà Sa-ma-ri từ trong thành đi ra giếng múc nước.','Theo Giăng 4:6-7','Nhìn kìa',()=>{document.getElementById('dlg').style.display='none';
       CQ.walkTo(woman,-1.4,23.2,4,()=>{CQ.face(woman,2.35,25.2);ask();});});}},
   {at:'well',text:'Giúp người đàn bà kéo gàu nước lên',run:n=>{CQ.setCine(WC);
     const go=()=>{headJar.visible=false;CQ.jar(null,-2,H(-2,23.6),23.6,1.2);CQ.walkTo(woman,0,4,4.2);
       CQ.say('Người kể chuyện','Người đàn bà bỏ vò nước lại, vội vàng chạy vào thành. Ê-li chạy theo bà!','Theo Giăng 4:28','Chạy theo!',()=>{CQ.setCine(null);
         CQ.goZone('B',0,-25,0,()=>{woman.dest=null;CQ.place(woman,0,-30,0);});n();});};
     const tell=()=>CQ.say('Người kể chuyện','Chúa Giê-su nói cho bà biết những điều bà đã làm, và cho bà biết chính Ngài là Đấng Christ.','Theo Giăng 4:17-26',null,go);
     CQ.balance({name:'Kéo gàu nước',text:'Giếng rất sâu. Giữ chấm tròn ở giữa vùng xanh để kéo gàu lên thật đều tay!',secs:6,onP:(p,x)=>setB(.3+p*1.7,x*.25)},()=>{setB(.3);
       CQ.fillWord({name:'Chúa Giê-su',before:'Phàm ai uống nước nầy vẫn còn khát mãi; nhưng uống nước ta sẽ cho, thì chẳng hề',after:' nữa.',options:['khát','đói','mệt'],answer:'khát',ref:'Giăng 4:13-14',wrong:'Chưa đúng. Chúa đang nói về nước uống.'},tell);});}},
   {text:'Trong thành Si-kha',run:n=>{CQ.face(woman,0,-25);CQ.say('Người đàn bà','Hãy đến xem một người đã bảo tôi mọi điều tôi đã làm; ấy chẳng phải là Đấng Christ sao?','Giăng 4:29','Báo tin!',n);}},
   {collect:['g0','g1','g2','g3'],text:'Chạy khắp thành, báo tin cho mọi người',each:I=>{I.hidden=true;I.ch.forEach((c,k)=>{CQ.face(c,W.player.x,W.player.z);setTimeout(()=>CQ.walkTo(c,-1.2+k*2.4,-23,2.6),700);});},
    run:n=>CQ.say('Người kể chuyện','Dân thành ra khỏi thành và đến cùng Chúa Giê-su.','Theo Giăng 4:30',null,()=>{
      CQ.goZone('A',4.5,31,.3,()=>{CQ.place(woman,-1.2,22,.4);groups.flat().forEach((c,i)=>{c.dest=null;const a=2.1+i*.32,r=4.4+(i%2)*1.3;CQ.place(c,1.6+Math.cos(a)*r,25.4+Math.sin(a)*r);CQ.face(c,2.35,25.2);});
        CQ.crowd(CQ.ring(1.6,25.4,12,7,10,2.2,4.4));tI.hidden=false;CQ.marks();});n();})},
   {at:'town',text:'Dân thành đã đến. Hỏi họ bây giờ tin gì',run:n=>{CQ.setCine([8.5,wy+5.5,33,2.6,wy+.4,27.6]);
     CQ.say('Người kể chuyện','Họ xin Chúa Giê-su ở lại với họ, và Ngài ở lại đó hai ngày. Có nhiều người nữa tin Ngài vì nghe chính lời Ngài.','Theo Giăng 4:40-41',null,()=>
     CQ.choice({name:'Dân thành Si-kha',q:'Bây giờ dân thành nói gì với người đàn bà?',options:['Chính chúng ta đã nghe Ngài, và biết rằng chính Ngài thật là Cứu Chúa của thế gian.','Chúng tôi chỉ tin vì lời bà kể mà thôi.','Chúng tôi chẳng muốn gặp Ngài nữa.'],ref:'Giăng 4:42',wrong:'Chưa đúng. Họ đã tự mình nghe Chúa Giê-su.'},()=>{CQ.setCine(null);n();}));}}];
 }});
