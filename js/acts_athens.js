/* Chapter 32: Paul in Athens (Acts 17:16-34). The passage gives no hour; daylight is used (he spoke daily in the market, 17:17).
   Quoted from the 1925 text: Acts 17:20, 17:22, 17:24, 17:32. Other lines are marked "Theo". */
'use strict';
CQ.chapters.push({id:'athens',no:32,title:'Phao-lô ở A-rê-ô-ba, thành A-thên',sub:'Đức Chúa Trời của trời và đất · buổi sáng',
 intro:[
  {t:'Thành đầy thần tượng',x:'Phao-lô đợi Si-la và Ti-mô-thê ở A-thên, thấy khắp thành đầy những tượng thần. Lòng người buồn.',ref:'Theo Công vụ 17:16',cam:[6,9,24,0,2,0]},
  {t:'Giữa chợ',x:'Mỗi ngày Phao-lô nói với những ai gặp ở chợ về Chúa Giê-su và sự sống lại. Ê-li đi theo.',ref:'Theo Công vụ 17:17-18',cam:[-10,4,14,0,1.6,2]},
  {t:'Mời lên A-rê-ô-ba',x:'Có người dẫn ông lên đồi A-rê-ô-ba: Ông giảng cho chúng tôi nghe sự lạ.',ref:'Theo Công vụ 17:19-20',cam:[4,7,-12,0,5,-34]}],
 outro:'Đức Chúa Trời đã dựng nên thế giới và mọi vật trong đó, là Chúa của trời đất.',outroRef:'Công vụ 17:24',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:3,z:-8,r:36,h:14};
  W.paths=[[[0,14],[0,-12],[3,-26],[0,-36]]];
  const H=(x,z)=>{const r=Math.hypot(x,z+10);return .3*noise(x,z)+7*sm(-14,-34,z)*sm(40,22,Math.abs(x))+sm(50,140,r)*10;};
  const g1=C('#b9bd6c'),g2=C('#a2ac5e'),rock=C('#d6cdb8'),pave=C('#cfc3a6');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.5,z*1.5));c.lerp(rock,sm(2,6,y));c.lerp(pave,(1-sm(1.8,3.5,CQ.distPath(x,z)))*.9);if(Math.abs(x)<17&&z>-8&&z<18)c.lerp(pave,.8);}});
  CQ.sky({fogNear:55,fogFar:200,clouds:8});
  CQ.scatter(900,new T.ConeGeometry(.09,.3,4),toon('#9aa850'),()=>{const x=rr(-130,130),z=rr(-130,130);if(CQ.distPath(x,z)<2.5||(Math.abs(x)<17&&z>-8&&z<18))return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* Parthenon on the far hill: white columns */
  const stone=toon('#f0e9d8'),stone2=toon('#e2d8c0');
  const pg=new T.Group();pg.position.set(0,H(0,-58)-.4,-58);W.scene.add(pg);
  mesh(new T.BoxGeometry(34,1.2,16),stone2,0,.6,0,pg);
  for(let i=0;i<10;i++)for(const z of[-6.5,6.5])mesh(new T.CylinderGeometry(.6,.7,7,10),stone,-15+i*3.33,4.7,z,pg);
  mesh(new T.BoxGeometry(34,1,16),stone2,0,8.7,0,pg);const rf=mesh(new T.ConeGeometry(10,2.4,4),stone,0,9.9,0,pg);rf.scale.set(1.9,1,.85);rf.rotation.y=Math.PI/4;
  /* market: stone houses and a stoa with columns */
  [[-24,-2,7,6,3.4,1.57],[-24,10,7,6,3.2,1.57],[24,0,7,6,3.4,-1.57],[24,12,7,6,3,-1.57],[-14,-14,7,6,3.2,0.4],[14,-14,7,6,3.4,-.4]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%3===0}));
  const stoa=new T.Group();stoa.position.set(-6,H(-6,34),34);W.scene.add(stoa);
  mesh(new T.BoxGeometry(18,.4,4),stone2,0,.2,0,stoa);mesh(new T.BoxGeometry(18,.5,4.4),stone,0,4.2,0,stoa);
  for(let i=0;i<7;i++)mesh(new T.CylinderGeometry(.28,.32,4,8),stone,-8+i*2.66,2.2,1.5,stoa);
  W.obstacles.push({x:-6,z:34,w:18,d:4,rot:0,ox:0});
  [[-18,18],[20,22],[-30,-12],[30,-10]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[16,4],[-16,6]].forEach(p=>CQ.bush(p[0],p[1],1.2));
  /* steps carved into the rock up to the Areopagus */
  for(let i=0;i<7;i++){const z=-17-i*2.2;mesh(new T.BoxGeometry(5,.14,.8),stone2,0,H(0,z)+.1,z);}
  [[-9,-36,2],[10,-35,2.4],[-14,-31,1.6],[14,-30,1.4]].forEach(a=>{const b=mesh(new T.DodecahedronGeometry(a[2],0),toon('#c9bda2'),a[0],H(a[0],a[1])+a[2]*.4,a[1]);W.circles.push({x:a[0],z:a[1],r:a[2]});});
  /* nine altars with garlands, each in its own spot; the odd one carries the unknown inscription */
  const aMat=[],altP=[[-12,6],[-6,10],[6,10],[12,6],[-14,-2],[-8,-4],[8,-4],[14,-2],[0,-6]];
  altP.forEach((p,i)=>{const g=new T.Group();g.position.set(p[0],H(p[0],p[1]),p[1]);W.scene.add(g);const m=toon('#d9d0bb');aMat.push(m);
    mesh(new T.BoxGeometry(1.2,1.1,1.2),m,0,.55,0,g);mesh(new T.BoxGeometry(1.5,.2,1.5),stone,0,1.2,0,g);
    mesh(new T.SphereGeometry(.22,8,6),toon(i===8?'#ffd24a':'#d8704f'),0,1.45,0,g);W.circles.push({x:p[0],z:p[1],r:.9});});
  /* statues of gods */
  [[-18,0,'#c9c3b4'],[18,4,'#c9c3b4'],[-4,-9,'#bdb7a6'],[4,16,'#bdb7a6']].forEach(a=>{const g=new T.Group();g.position.set(a[0],H(a[0],a[1]),a[1]);W.scene.add(g);const m=toon(a[2]);
    mesh(new T.BoxGeometry(1.2,.8,1.2),m,0,.4,0,g);mesh(new T.CylinderGeometry(.35,.45,1.8,8),m,0,1.7,0,g);mesh(new T.SphereGeometry(.3,8,6),m,0,2.8,0,g);W.circles.push({x:a[0],z:a[1],r:.9});});
  /* people */
  const paul=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#e9dcc0',mantle:'#2f5d8a',sash:'#8a3a2c',hair:'#4a3a2c',beard:1,band:'#d9a441',W:.95}),2,-1,3.14);
  const phil1=CQ.place(CQ.makeChar({skin:'#d2a77c',tunic:'#f3efe4',mantle:'#7a3f72',hair:'#d9d4c8',beard:2,band:'#e9dcc0',W:1.05}),-3,-4,-.4);
  const phil2=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#e6e0cc',mantle:'#3f6a5a',hair:'#3a2d22',beard:2}),5,-6,.5);
  const dion=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#f3efe4',mantle:'#a8322d',sash:'#d9a441',hair:'#bdb7aa',beard:2,band:'#d9a441'}),-4,-40,.2);
  const dam=CQ.place(CQ.makeChar(CQ.CAST.woman),4,-40,-.2);
  const vend=CQ.place(CQ.makeChar(CQ.CAST.woman2),-8,14,3.9);
  CQ.crowd(CQ.ring(0,-37,10,3,9,-3.4,-.1),{});CQ.crowd(CQ.ring(-10,6,5,2,5),{});
  W.player=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.95,hem:.55,head:1.08,beard:0})),0,14,3.14);
  CQ.zones({A:{c:[0,-10],r:56,tod:'day'}});
  const mvP=(x,z)=>{CQ.place(paul,x,z,0);ip.x=x;ip.z=z;};
  const ip=CQ.addInter({id:'paul',P:paul,name:'Phao-lô',h:2.1,r:2.6});
  CQ.addInter({id:'phil',P:phil1,name:'người A-thên',h:2.2,r:2.6});
  CQ.addInter({id:'dion',P:dion,name:'Đi-ô-ni-xiu',h:2.2,r:2.6});
  CQ.addInter({id:'dam',P:dam,name:'bà Đa-ma-ri',h:2,side:1,r:2.4,run:d=>CQ.say('Bà Đa-ma-ri','Lời ông nói nghe lạ mà dịu dàng. Tôi muốn nghe thêm.','Theo Công vụ 17:34','Dạ',d)});
  CQ.addInter({id:'vend',P:vend,name:'bà bán hoa',h:2,side:1,r:2.4,run:d=>CQ.say('Bà bán hoa','Hoa để dâng cho các thần đó, cháu ạ. Cả thành A-thên có bao nhiêu bàn thờ, bà đếm không xuể!','Theo Công vụ 17:16','Dạ',d)});
  CQ.goZone('A',0,14,0,null,true);
  W.steps=[
   {at:'paul',text:'Đi dạo cùng Phao-lô qua các bàn thờ',run:n=>{
     const tap=()=>CQ.tapFill({name:'Đếm bàn thờ',text:'Chạm vào từng bàn thờ để đếm và tìm bàn thờ ghi lời lạ ấy.',need:9,onP:p=>{const k=Math.floor(p*9+.001);aMat.forEach((m,i)=>m.color.set(i<k?(i===8?'#ffe38a':'#f2c9a0'):'#d9d0bb'));}},n);
     CQ.lines([['Ê-li','Bác Phao-lô, nhiều tượng quá, tượng nào cũng có hoa!','Theo Công vụ 17:16'],['Phao-lô','Hãy đếm giúp bác. Có cả bàn thờ ghi: Đức Chúa Trời chưa biết.','Theo Công vụ 17:23']],tap);}},
   {at:'phil',text:'Nói chuyện với người A-thên giữa chợ',run:n=>{
     CQ.face(phil1,paul.x,paul.z);
     CQ.lines([['Người A-thên','Ông giảng cho chúng tôi nghe sự lạ.','Công vụ 17:20'],['Người kể chuyện','Họ dẫn Phao-lô lên đồi A-rê-ô-ba để nghe ông nói.','Theo Công vụ 17:19']],()=>{mvP(0,-35);const q=W.inter.find(i=>i.id==='phil');CQ.place(phil1,-3,-38,.3);q.x=-3;q.z=-38;n();});}},
   {at:'paul',text:'Lên đồi A-rê-ô-ba, nghe Phao-lô nói',run:n=>{
     CQ.setCine([6,H(0,-33)+3.4,-28,0,H(0,-35)+1.8,-36]);
     CQ.say('Phao-lô','Hỡi người A-thên, phàm việc gì ta cũng thấy các ngươi sốt sắng quá chừng.','Công vụ 17:22',null,()=>
      CQ.fillWord({name:'Phao-lô',before:'Hỡi người A-thên, phàm việc gì ta cũng thấy các ngươi',answer:'sốt sắng',after:' quá chừng.',options:['sốt sắng','lười biếng','buồn bã'],ref:'Công vụ 17:22',wrong:'Chưa đúng. Phao-lô khen họ rất chăm lo việc thờ phượng.'},()=>{CQ.setCine(null);n();}));}},
   {at:'paul',text:'Nghe Phao-lô nói về Đức Chúa Trời',run:n=>{
     CQ.setCine([-6,H(0,-33)+3.4,-30,0,H(0,-35)+1.8,-36]);
     CQ.say('Phao-lô','Đức Chúa Trời đã dựng nên thế giới và mọi vật trong đó, là Chúa của trời đất, chẳng ngự tại đền thờ bởi tay người ta dựng nên đâu.','Công vụ 17:24',null,()=>
      CQ.choice({name:'Phao-lô',q:'Phao-lô nói Đức Chúa Trời là ai?',options:['Đấng dựng nên thế giới','Một vị thần đá','Một vị vua A-thên'],ref:'Công vụ 17:24',wrong:'Chưa đúng. Nghe lại lời Phao-lô nói nhé.'},()=>{CQ.setCine(null);n();}));}},
   {at:'phil',text:'Nghe người A-thên nói gì',run:n=>{mvP(0,-35);
     CQ.say('Người kể chuyện','Khi chúng nghe nói về sự sống lại của kẻ chết, kẻ thì nhạo báng, người thì nói rằng: Lúc khác chúng ta sẽ nghe ngươi nói về việc đó.','Công vụ 17:32','Ồ...',n);}},
   {at:'dion',text:'Đến gặp người tin Chúa',run:n=>{
     CQ.say('Người kể chuyện','Có mấy người theo Phao-lô và tin, trong đó có Đi-ô-ni-xiu, người thuộc tòa A-rê-ô-ba, và một người đàn bà tên Đa-ma-ri.','Theo Công vụ 17:34',null,n);}}];
 }});
