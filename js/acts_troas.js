/* Chapter 33: Eutychus at Troas (Acts 20:7-12, 35). Night scene (the meeting lasted until midnight, 20:7).
   Quoted word for word (1925 text): Công vụ 20:10, 20:35. */
'use strict';
CQ.chapters.push({id:'troas',no:33,title:'Ơ-tích ở Trô-ách',sub:'Phao-lô giảng đêm khuya · ban đêm',
 intro:[
  {t:'Ngày đầu tuần',x:'Ở Trô-ách, các anh em nhóm lại trên gác ba để bẻ bánh. Phao-lô sắp lên đường, nên người nói chuyện rất lâu.',ref:'Theo Công vụ 20:7-8',cam:[0,9,19,0,3,-6]},
  {t:'Nhiều ngọn đèn',x:'Trên gác ba có nhiều ngọn đèn. Ê-li ngồi gần cửa sổ, lo thêm dầu cho từng ngọn.',ref:'Theo Công vụ 20:8',cam:[-6,3.4,3,2,2,-7]},
  {t:'Cửa sổ và gã trai trẻ',x:'Một gã tuổi trẻ tên là Ơ-tích ngồi trên cửa sổ, nghe Phao-lô giảng và buồn ngủ.',ref:'Theo Công vụ 20:9',cam:[3,2.6,-3.5,5.5,2.2,-8.4]}],
 outro:'Ban cho thì có phước hơn là nhận lãnh.',outroRef:'Công vụ 20:35',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='night';W.startYaw=0;W.menuCam={x:0,y:3,z:-4,r:30,h:12};
  W.paths=[[[0,12],[0,-3]],[[-7,-3],[-7,-12]],[[-7,-12],[6,-12]]];
  const H=(x,z)=>1+.3*noise(x,z)*sm(22,36,Math.hypot(x,z))+sm(50,140,Math.hypot(x,z))*10;
  const floor=C('#cdbb94'),g1=C('#7d9456'),g2=C('#9aa864'),dirt=C('#bda57a');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(dirt,1-sm(17,24,Math.hypot(x,z+2)+noise(x*3,z*3)));c.lerp(floor,(1-sm(10,11.5,Math.abs(x)))*(1-sm(7,8,Math.abs(z+1.5)))*.9);}});
  CQ.sky({fogNear:45,fogFar:170,clouds:3});
  CQ.scatter(1100,new T.ConeGeometry(.09,.3,4),toon('#587a3a'),()=>{const x=rr(-130,130),z=rr(-130,130);if(Math.hypot(x,z+2)<20)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* the third-floor hall: stone walls on three sides, open to the stars and to the south */
  const wm=M.lime,WH=4.4;
  CQ.wallBox(-11,-1.5,1,WH,15,0,wm);CQ.wallBox(11,-1.5,1,WH,15,0,wm);
  CQ.wallBox(-9.75,-9,2.5,WH,1,0,wm);CQ.wallBox(-0.75,-9,9.5,WH,1,0,wm);CQ.wallBox(9,-9,4,WH,1,0,wm);
  const y0=H(5.5,-9);
  mesh(new T.BoxGeometry(3,1.2,1.1),wm,5.5,y0+.6,-9);W.obstacles.push({x:5.5,z:-9,w:3,d:1.4,rot:0,ox:0});
  mesh(new T.BoxGeometry(3.2,.9,1.1),wm,5.5,y0+WH-.45,-9);
  for(const s of[-1,1])mesh(new T.BoxGeometry(.2,WH-1.4,.3),M.woodD,5.5+s*1.6,y0+1.2+(WH-1.4)/2-.45,-8.55);
  mesh(new T.BoxGeometry(4.2,.3,1.4),M.mud,5.5,y0+WH+.15,-9);
  mesh(new T.BoxGeometry(1.6,.2,.5),M.woodD,-7,y0+2.7,-9.2);
  /* wooden beams along the top of the side walls */
  for(const s of[-1,1])for(let i=0;i<4;i++)mesh(new T.CylinderGeometry(.14,.14,2.4,6),M.woodD,s*10.2,y0+WH+.1,-7+i*4).rotation.x=Math.PI/2;
  /* table with bread and cups, benches */
  const tab=toon('#9a6a40'),cl=toon('#efe3c6'),bread=toon('#d9a45a');
  mesh(new T.BoxGeometry(5,.5,1.4),tab,0,H(0,-4)+.5,-4);mesh(new T.BoxGeometry(5.2,.04,1.5),cl,0,H(0,-4)+.77,-4);
  W.obstacles.push({x:0,z:-4,w:5,d:1.4,rot:0,ox:0});
  for(let i=0;i<4;i++)mesh(new T.CylinderGeometry(.22,.24,.08,10),bread,-1.5+i*1,H(0,-4)+.84,-4.1);
  for(let i=0;i<3;i++)CQ.jar(null||W.scene,-.6+i*.6,H(0,-4)+.8,-3.7,.22);
  /* the oil lamps: stands with a flame that grows when Eli adds oil */
  const flames=[],fm=new T.MeshBasicMaterial({color:'#ffcf5a'}),lamps=[[-9.6,-7],[-9.6,-2],[-9.6,3],[9.6,-4],[9.6,1],[9.6,5],[-2.5,-4],[2.5,-4],[-6,-8.2],[8.5,-8.2]];
  lamps.forEach(p=>{const y=H(p[0],p[1]),big=Math.abs(p[0])<5;
    mesh(new T.CylinderGeometry(.06,.1,big?1.3:1.5,6),M.woodD,p[0],y+(big?.77+.55:.75),p[1]);if(big)return;
    mesh(new T.CylinderGeometry(.22,.1,.12,8),M.clay,p[0],y+1.55,p[1]);});
  lamps.forEach(p=>{const y=H(p[0],p[1]),big=Math.abs(p[0])<5,fy=big?H(0,-4)+1.0:y+1.78;
    if(big)mesh(new T.CylinderGeometry(.12,.08,.12,8),M.clay,p[0],H(0,-4)+.86,-4.1+.0);
    const f=new T.Mesh(new T.SphereGeometry(.12,8,6),fm);f.position.set(p[0],fy,big?-3.4:p[1]);f.scale.set(.5,.2,.5);W.scene.add(f);flames.push(f);});
  const L1=new T.PointLight('#ffb35a',0,26,1.5);L1.position.set(-4,3,-3);W.scene.add(L1);const L2=new T.PointLight('#ffb35a',0,26,1.5);L2.position.set(5,3,0);W.scene.add(L2);
  let lit=.12;W.tick.push((dt,t)=>{flames.forEach((f,i)=>{const k=Math.min(1,Math.max(0,lit*flames.length-i)),w=.5+.7*k;f.scale.set(w,(.2+1.1*k)*(1+Math.sin(t*9+i)*.08),w);});L1.intensity=.25+lit*.9;L2.intensity=.25+lit*.9;});
  /* the believers sitting on the floor */
  CQ.crowd([[-3,-1.5,.2],[-1.6,-1.8,0],[0,-1.4,0],[1.6,-1.7,0],[3,-1.4,-.2],[-5,-4,1.4],[-5,-2.4,1.2],[5.2,-3,-1.4],[5.4,-1.6,-1.4],[-3.5,1,.3],[-1.5,1.6,.1],[2,1.4,-.1],[4,1.8,-.3],[-7.5,-5,1],[7.7,-5.5,-1.2]],{sit:1});
  /* outside: harbour town */
  [[-24,-18,7,6,3.2,0],[-6,-26,8,6,3.4,0],[20,-20,7,6,3,-.6],[-27,4,7,6,3,1.57],[27,2,6,7,3.2,-1.57]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%3===0}));
  [[-18,-12],[16,-14],[-14,12],[16,13],[0,-30]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[-20,8],[22,-8]].forEach(p=>CQ.palm(p[0],p[1],1.2));
  const sea=mesh(new T.PlaneGeometry(240,70),toon('#16405f'),0,.2,-95);sea.rotation.x=-Math.PI/2;
  /* people */
  const paul=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#6b4f8a',mantle:'#e9dcc0',sash:'#d9a441',hair:'#4a3a2c',beard:2,band:'#e9dcc0',S:.9}),0,H(0,-6.2),0);
  const eut=CQ.place(CQ.makeChar({skin:'#cf9a6e',tunic:'#e6d3ab',sash:'#5f8f7a',hair:'#241a13',band:'#5f8f7a',S:.8}),5.5,-8.2,0);
  const bro=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#8a3a4a',mantle:'#c9c0a8',hair:'#d9d4c8',beard:2,band:'#c9c0a8'}),-1.5,-12.2,-.4);
  const nana=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#5f8f7a',veil:'#e6d3ab',sash:'#c2503c',jar:1,S:.93}),7.5,2.5,2.4);
  const sailor=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#3a6ea5',hem:.4,sash:'#e9dcc0',hair:'#241a13',beard:1,band:'#3a6ea5'}),-13,-12,1.2);
  W.player=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.92,head:1.05,beard:1})),-6,6,0);
  CQ.zones({A:{c:[0,-4],r:32,tod:'night'}});
  CQ.goZone('A',-6,6,0,null,true);
  const lg=new T.Group();lg.position.set(-7.5,H(-7.5,-1.5),-1.5);W.scene.add(lg);
  CQ.addInter({id:'lamp',obj:lg,x:-7.5,z:-1.5,name:'những ngọn đèn dầu',verb:'Thêm dầu cho ',h:1.8,r:2.6});
  CQ.addInter({id:'paul',P:paul,name:'sứ đồ Phao-lô',h:2.1,r:2.8});
  CQ.addInter({id:'eut',P:eut,name:'Ơ-tích',h:1.8,r:2.8});
  CQ.addInter({id:'bro',P:bro,name:'một anh em',h:2.05,r:2.8});
  CQ.addInter({id:'nana',P:nana,name:'bà bưng bánh',h:2,side:1,run:d=>CQ.say('Bà bưng bánh','Bánh nóng đây, mời các con. Đêm nay Phao-lô nói chuyện lâu lắm, vì mai người đã đi rồi.','Theo Công vụ 20:7','Cảm ơn bà',d)});
  CQ.addInter({id:'sailor',P:sailor,name:'người thủy thủ',h:2.05,side:1,run:d=>CQ.say('Người thủy thủ','Tàu ra biển lúc sáng sớm. Nghe nói các ông ấy đi bộ đến thành A-sốt.','Theo Công vụ 20:13','Dạ',d)});
  W.steps=[
   {at:'lamp',text:'Lại gần đèn dầu trên gác',run:n=>CQ.say('Ê-li','Con thêm dầu cho các ngọn đèn nhé, kẻo tối quá.','Theo Công vụ 20:8','Vâng!',()=>
     CQ.tapFill({name:'Thêm dầu cho đèn',text:'Chạm vào từng ngọn đèn để thêm dầu giữ sáng cho cả gác.',need:10,onP:p=>{lit=.12+.88*p;}},()=>{lit=1;n();}))},
   {at:'paul',text:'Nghe Phao-lô giảng',run:n=>{CQ.setCine([-4,3.2,-1,0,1.7,-6]);CQ.say('Người kể chuyện','Phao-lô giảng rất dài, kéo dài đến nửa đêm.','Theo Công vụ 20:7',null,()=>{CQ.setCine(null);n();});}},
   {at:'eut',text:'Lại gần Ơ-tích bên cửa sổ',run:n=>{CQ.setCine([2.5,3,-4,5.5,2.2,-9]);
     const fall=()=>{CQ.say('Người kể chuyện','Ơ-tích ngủ mê, té từ từng lầu thứ ba xuống đất. Ê-li vội chạy xuống đỡ.','Theo Công vụ 20:9',null,()=>{CQ.place(eut,5.5,-11.6,0);eut.g.rotation.x=-1.45;CQ.place(paul,3.6,-11.4,.5);CQ.setCine([-1,3,-6,5,.6,-11.5]);n();});};
     CQ.say('Người kể chuyện','Một gã tuổi trẻ tên là Ơ-tích, ngồi trên cửa sổ, ngủ gục trong khi Phao-lô giảng rất dài.','Công vụ 20:9',null,()=>
       CQ.choice({name:'Ơ-tích',q:'Ơ-tích ngồi ở đâu?',options:['Bên cửa sổ','Trên mái nhà','Dưới đất'],ref:'Công vụ 20:9',wrong:'Chưa đúng. Nhìn lên gác xem Ơ-tích ngồi đâu.'},fall));}},
   {at:'eut',text:'Chạy lại đỡ Ơ-tích',run:n=>{CQ.setCine([1,2.6,-7.5,4.8,.8,-11.5]);
     CQ.say('Người kể chuyện','Phao-lô bước xuống, nghiêng mình trên người, ôm lấy mà nói rằng: Chớ bối rối, linh hồn còn ở trong người.','Công vụ 20:10',null,()=>
       CQ.fillWord({name:'Phao-lô',before:'Chớ bối rối, linh hồn',answer:'còn',after:' ở trong người.',options:['còn','đã đi','chẳng có'],ref:'Công vụ 20:10',wrong:'Chưa đúng. Nhớ lời Phao-lô nói để mọi người yên lòng.'},()=>{eut.g.rotation.x=0;CQ.place(eut,5,-11.8,.6);CQ.setCine(null);n();}));}},
   {at:'bro',text:'Báo tin vui cho anh em',run:n=>CQ.lines([['Người kể chuyện','Còn gã tuổi trẻ người ta đem đi, thì được sống, sự ấy làm cho mọi người đều được yên ủi lắm.','Công vụ 20:12'],['Ê-li','Anh ơi, Ơ-tích sống rồi! Cả nhà yên lòng rồi!','Theo Công vụ 20:12']],n)},
   {at:'paul',text:'Nghe Phao-lô nhắc lời Chúa Giê-su',run:n=>{CQ.setCine([1.5,3,-8.4,3.6,1.7,-11.4]);CQ.say('Phao-lô','Phải nhớ lời Chúa Giê-su phán: Ban cho thì có phước hơn là nhận lãnh.','Công vụ 20:35',null,()=>
     CQ.order({name:'Lời Chúa Giê-su',q:'Ghép lời Chúa Giê-su mà Phao-lô nhắc.',chunks:['Ban cho','thì có phước hơn','là nhận lãnh.'],ref:'Công vụ 20:35'},()=>{CQ.setCine(null);n();}));}}];
 }});
