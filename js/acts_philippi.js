/* Chapter 31: Lydia and the jailer at Philippi (Acts 16:9-34). Lydia by the river on the Sabbath (morning); the prison at midnight (16:25: night).
   Quoted word for word (1925 text): Công vụ 16:14, 16:24, 16:25, 16:26, 16:31. Ê-li is a fictional grown man travelling with Paul's team. */
'use strict';
CQ.chapters.push({id:'philippi',no:31,title:'Ly-đi và người đề lao ở Phi-líp',sub:'Hát trong ngục · ban đêm',
 intro:[
  {t:'Tiếng gọi từ Ma-xê-đoan',x:'Đêm kia, Phao-lô thấy một người Ma-xê-đoan xin: hãy qua giúp chúng tôi. Cả đoàn xuống thuyền đến Phi-líp.',ref:'Theo Công vụ 16:9-12',cam:[0,5,12,0,2,-14]},
  {t:'Bên bờ sông',x:'Ngày Sa-bát, họ ra bờ sông gặp mấy người đàn bà đang cầu nguyện. Ê-li đứng nghe.',ref:'Theo Công vụ 16:13',cam:[5,3,2,-1,1.5,-14]},
  {t:'Hàng vải sắc tía',x:'Ly-đi bán hàng sắc tía, quê ở Thi-a-ti-rơ. Chúa mở lòng bà để chăm chỉ nghe lời Phao-lô nói.',ref:'Theo Công vụ 16:14',cam:[-5,3,-2,-9,1.4,-8]}],
 outro:'Hãy tin Đức Chúa Giê-su, thì ngươi và cả nhà đều sẽ được cứu rỗi.',outroRef:'Công vụ 16:31',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='morning';W.startYaw=0;W.menuCam={x:0,y:2,z:-8,r:30,h:12};
  W.paths=[[[0,28],[0,-20]],[[-22,6],[0,6]],[[100,18],[100,0]]];
  const dm=(x,z)=>Math.min(Math.hypot(x,z-2),Math.hypot(x-100,z-2));
  const H=(x,z)=>{const d=-22-z,riv=d>0?-Math.min(5,d*.4+d*d*.01)*(1-sm(55,75,x)):0;return 1+.35*noise(x*.5,z*.5)*sm(26,40,dm(x,z))+sm(45,120,dm(x,z))*10+riv;};
  const g1=C('#9bc058'),g2=C('#b9cd66'),dirt=C('#d3bf92'),cob=C('#7d786d'),sand=C('#d9c493');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));if(z<-17&&x<70)c.lerp(sand,sm(-17,-22,z)*.8);c.lerp(dirt,(1-sm(1.6,3.4,CQ.distPath(x,z)))*.9);c.lerp(cob,1-sm(17,24,Math.hypot(x-100,z+6)));}});
  CQ.sky({fogNear:50,fogFar:190,clouds:6});CQ.water({deep:3.5});
  CQ.scatter(1500,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-150,150),z=rr(-150,150);if(CQ.distPath(x,z)<2.4||Math.hypot(x-100,z+6)<24)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(160,new T.ConeGeometry(.07,1.1,4),toon('#5f8f3a'),()=>{const x=rr(-30,50),z=rr(-26,-20);return[x,H(x,z)+.5,z,rr(.8,1.4)];});
  /* A: city gate of Philippi, the riverbank, Lydia's house and the purple cloth */
  CQ.wallBox(-6,28,4,7.5,4,0,M.lime);CQ.wallBox(6,28,4,7.5,4,0,M.lime);
  mesh(new T.BoxGeometry(16,1.8,4.4),M.lime,0,H(0,28)+7.2,28);mesh(new T.BoxGeometry(16.6,.4,4.8),M.mud,0,H(0,28)+8.3,28);
  CQ.house(-24,4,8,7,3.4,1.57,{stone:'lime',plaster:1,roofJars:1});CQ.house(-24,16,7,6,3,1.57,{stone:'lime'});CQ.house(24,6,7,7,3.2,-1.57,{stone:'lime',plaster:1});CQ.house(24,18,7,6,3,-1.57,{stone:'lime',roofJars:1});
  [[-14,-14],[16,-12],[-32,-6],[32,-8]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));[[-10,24],[11,25]].forEach(p=>CQ.palm(p[0],p[1],1.15));
  const vat=(x,z,c)=>{const v=mesh(new T.CylinderGeometry(.8,.7,.9,14),M.clay,x,H(x,z)+.45,z);mesh(new T.CircleGeometry(.68,14),toon(c),x,H(x,z)+.9,z).rotation.x=-Math.PI/2;W.circles.push({x,z,r:.9});};
  vat(-16,-6,'#7a2f8f');vat(-14.2,-4.6,'#a5283a');vat(-17.6,-4.2,'#5f2a7a');
  const rack=new T.Group();rack.position.set(-9,H(-9,-6),-6);W.scene.add(rack);
  for(const s of[-1,1])mesh(new T.CylinderGeometry(.09,.09,2.8,6),M.wood,s*1.8,1.4,0,rack);mesh(new T.CylinderGeometry(.07,.07,3.8,6),M.wood,0,2.7,0,rack).rotation.z=Math.PI/2;
  ['#7a2f8f','#a5283a','#6a3b9a','#c0456a','#7a2f8f'].forEach((c,i)=>mesh(new T.BoxGeometry(.6,1.7-(i%2)*.4,.05),toon(c),-1.5+i*.75,1.7,0,rack));W.circles.push({x:-9,z:-6,r:2});
  CQ.crowd([[-7,-17,3.1],[2,-18.5,3.1],[6,-16.5,3.3],[-3.5,-19,3]],{sit:1,noCol:1});
  const man=(o,x,z,r)=>CQ.place(CQ.makeChar(o),x,z,r);
  const lydia=man({skin:'#c99468',tunic:'#7a2f8f',veil:'#f2e6f0',sash:'#d9a441',S:.95},-2.5,-13,.2);
  const paulA=man({skin:'#c08a5e',tunic:'#3f68a8',mantle:'#e6dcc0',hair:'#3a2a20',beard:2,band:'#e6dcc0',S:.97},3,-13,-.4),silasA=man({skin:'#b9804f',tunic:'#6b8f4f',mantle:'#d9c9a0',hair:'#241a13',beard:1,S:1},5.6,-11.4,-.6);
  const dyer=man({skin:'#c08a5e',tunic:'#a5526a',veil:'#e6d3ab',sash:'#d9a441',S:.93},-13,-2.5,1.9);
  /* B: the prison at night */
  const BX=100,doors=new T.Group();doors.position.set(BX,H(BX,-2),-2);W.scene.add(doors);
  CQ.wallBox(BX,-18,18,4.6,1.2,0,M.basalt);CQ.wallBox(BX-8.7,-10,1.2,4.6,16.4,0,M.basalt);CQ.wallBox(BX+8.7,-10,1.2,4.6,16.4,0,M.basalt);
  CQ.wallBox(BX-5.9,-2,6.4,4.2,1.2,0,M.basalt);CQ.wallBox(BX+5.9,-2,6.4,4.2,1.2,0,M.basalt);mesh(new T.BoxGeometry(6.2,1,1.2),M.basalt,BX,H(BX,-2)+4.0,-2);
  mesh(new T.BoxGeometry(17,.1,16),toon('#8a7a55'),BX,H(BX,-10)+.06,-10);
  const bm=toon('#2b2724'),pan=[];
  for(const s of[-1,1]){const pv=new T.Group();pv.position.x=s*2.6;doors.add(pv);pan.push(pv);const k=-s;
    mesh(new T.BoxGeometry(2.6,.12,.12),bm,k*1.3,.3,0,pv);mesh(new T.BoxGeometry(2.6,.12,.12),bm,k*1.3,3.1,0,pv);
    for(let i=0;i<7;i++)mesh(new T.CylinderGeometry(.04,.04,3,6),bm,k*(.1+i*.4),1.7,0,pv);}
  const torch=(x,z,lit)=>{mesh(new T.CylinderGeometry(.06,.08,2.4,6),M.woodD,x,H(x,z)+1.2,z);mesh(new T.SphereGeometry(.2,8,6),new T.MeshBasicMaterial({color:'#ffb347'}),x,H(x,z)+2.55,z,null,false);W.circles.push({x,z,r:.3});if(lit){const l=new T.PointLight('#ffb060',1,24,1.5);l.position.set(x,H(x,z)+3,z);W.scene.add(l);}};
  torch(BX-4.4,3,1);torch(BX+4.4,3,0);
  const lamp=new T.PointLight('#ffa850',.8,18,1.5);lamp.position.set(BX,4,-10);W.scene.add(lamp);W.tick.push((dt,t)=>{lamp.intensity=.8+Math.sin(t*9)*.08+Math.sin(t*5.3)*.06;});
  const sold=(x)=>man({skin:'#b9804f',tunic:'#8a2f2f',hem:.4,sash:'#2b2724',hair:'#241a13',beard:1,staff:1,W:1.1},x,7,3.14);sold(BX-6);sold(BX+6);
  CQ.crowd([[BX-7,-16,.2],[BX+7,-16,-.2],[BX-3.5,-16.8,0],[BX+3.5,-16.8,0],[BX,-17,0]],{sit:1,noCol:1});
  const paulB=man({skin:'#c08a5e',tunic:'#3f68a8',mantle:'#e6dcc0',hair:'#3a2a20',beard:2,band:'#e6dcc0',S:.97},BX-1.5,-8,0),silasB=man({skin:'#b9804f',tunic:'#6b8f4f',mantle:'#d9c9a0',hair:'#241a13',beard:1,S:1},BX+1.6,-8,0);
  const jailer=man({skin:'#c08a5e',tunic:'#8a3b2e',hem:.4,sash:'#2b2724',hair:'#2a1d15',beard:1,W:1.12},BX,4.5,3.14);
  const chains=new T.Group();W.scene.add(chains);for(const p of[paulB,silasB])for(const s of[-1,1]){const r=mesh(new T.TorusGeometry(.14,.035,6,10),bm,p.x+s*.12,H(p.x,p.z)+.1,p.z,chains);r.rotation.x=Math.PI/2;}
  const bar=mesh(new T.BoxGeometry(1.2,.07,.07),bm,BX-1.5,H(BX,-8)+.12,-8,chains);bar.position.x=BX-1.5;
  mesh(new T.BoxGeometry(1.2,.07,.07),bm,BX+1.6,H(BX,-8)+.12,-8,chains);
  W.player=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.eli,{S:.98,head:1,hem:.42,beard:1,tunic:'#e8873f'})),0,14,0);
  CQ.zones({A:{c:[0,2],r:27,tod:'morning'},B:{c:[BX,2],r:22,tod:'night'}});
  CQ.goZone('A',0,14,0,null,true);
  CQ.addInter({id:'lydia',P:lydia,name:'bà Ly-đi',h:2.05,r:2.8});
  CQ.addInter({id:'cloth',obj:rack,x:-9,z:-6,name:'hàng vải tím',verb:'Xem ',h:3.2,r:3.6});
  CQ.addInter({id:'jailer',P:jailer,name:'người đề lao',h:2.1,r:2.8});
  CQ.addInter({id:'paul',P:paulB,name:'sứ đồ Phao-lô',h:2.1,r:3});
  CQ.addInter({id:'door',obj:doors,x:BX,z:-2,name:'cửa ngục',verb:'Chạm vào ',h:3.6,r:4});
  CQ.addInter({id:'dyer',P:dyer,name:'người thợ nhuộm',side:1,h:2,r:2.6,run:d=>CQ.say('Người thợ nhuộm','Sắc tía này nhuộm từ một loại ốc biển đó cháu. Bà Ly-đi bán cho cả thành này.','Theo Công vụ 16:14','Cảm ơn bác',d)});
  CQ.addInter({id:'silas',P:silasB,name:'sứ đồ Si-la',side:1,h:2.1,r:2.8,run:d=>CQ.say('Si-la','Dù ở trong ngục tối, chúng ta vẫn có thể hát ngợi khen Đức Chúa Trời. Cháu đừng sợ nhé.','Theo Công vụ 16:25','Dạ',d)});
  W.steps=[
   {at:'lydia',text:'Bên bờ sông, lại gần bà Ly-đi',run:n=>{CQ.setCine([2,2.8,-6,-2.5,1.5,-14]);CQ.lines([['Ê-li','Cháu giúp bà xách vải ạ.','Theo Công vụ 16:14'],['Ly-đi','Nếu các ông thấy tôi thật lòng tin Chúa, xin mời về nhà tôi nghỉ.','Theo Công vụ 16:15']],()=>
     CQ.choice({name:'Ly-đi',q:'Ly-đi làm nghề gì?',options:['Buôn hàng sắc tía','Đánh cá','Làm bánh'],ref:'Công vụ 16:14',wrong:'Chưa đúng. Hãy nhìn những tấm vải màu tím nhé.'},()=>{CQ.setCine(null);n();}));}},
   {at:'cloth',text:'Xem hàng vải tím của bà Ly-đi',run:n=>{CQ.setCine([-4,3,-1,-9,1.6,-6]);CQ.say('Người kể chuyện','Chúa mở lòng cho người, đặng chăm chỉ nghe lời Phao-lô nói.','Công vụ 16:14',null,()=>{CQ.setCine(null);CQ.goZone('B',BX,14,0,n);});}},
   {at:'jailer',text:'Nửa đêm. Đến nhà ngục, lại gần người đề lao',run:n=>{CQ.setCine([BX+4,3,5,BX-1,1.8,-8]);CQ.lines([['Ê-li','Hai bác Phao-lô và Si-la đã bị đánh đòn rồi bị giam ở đây. Cháu sẽ ngồi gần cửa ngục để nghe.','Theo Công vụ 16:22-23'],['Người kể chuyện','Được lịnh đó, đề lao bỏ hai người vào ngục tối và tra chơn vào cùm.','Công vụ 16:24']],()=>{CQ.setCine(null);n();});}},
   {at:'paul',text:'Lắng nghe tiếng cầu nguyện trong ngục',run:n=>{CQ.setCine([BX+2,2.8,1.5,BX,1.5,-8]);CQ.say('Người kể chuyện','Lối nửa đêm, Phao-lô và Si-la đương cầu nguyện, hát ngợi khen Đức Chúa Trời; và những tù phạm đều nghe.','Công vụ 16:25',null,()=>
     CQ.order({name:'Người kể chuyện',q:'Ghép lại câu chuyện nửa đêm.',chunks:['Lối nửa đêm,','Phao-lô và Si-la đương cầu nguyện,','hát ngợi khen Đức Chúa Trời;','và những tù phạm đều nghe.'],ref:'Công vụ 16:25'},()=>{CQ.setCine(null);n();}));}},
   {at:'door',text:'Cơn động đất! Chạm vào cửa ngục',run:n=>{CQ.setCine([BX+5,3.2,3,BX,1.6,-3]);CQ.say('Người kể chuyện','Thình lình, có cơn động đất rất lớn, đến nỗi nền ngục rúng động; cùng một lúc, các cửa mở ra, xiềng tù phạm thảy đều tháo cả.','Công vụ 16:26',null,()=>
     CQ.tapFill({name:'Cơn động đất',text:'Chạm nhẹ vào từng cánh cửa để giúp mọi người bình tĩnh bước ra.',need:8,onP:p=>{pan[0].rotation.y=-p*1.5;pan[1].rotation.y=p*1.5;chains.visible=p<.9;}},()=>{chains.visible=false;CQ.setCine(null);n();}));}},
   {at:'jailer',text:'Người đề lao chạy đến. Lại gần ông',run:n=>{CQ.walkTo(jailer,BX,-3.6,3.2,()=>CQ.face(jailer,BX-1.5,-8));CQ.setCine([BX+4,2.8,2,BX,1.5,-6]);CQ.lines([['Người đề lao','Thưa các ông, tôi phải làm chi cho được cứu?','Theo Công vụ 16:30'],['Phao-lô','Hãy tin Đức Chúa Giê-su, thì ngươi và cả nhà đều sẽ được cứu rỗi.','Công vụ 16:31']],()=>
     CQ.fillWord({name:'Phao-lô',before:'Hãy tin Đức Chúa Giê-su, thì ngươi và cả nhà đều sẽ được',answer:'cứu rỗi',after:'.',options:['cứu rỗi','giàu có','nổi tiếng'],ref:'Công vụ 16:31',wrong:'Chưa đúng. Hãy nhớ điều Phao-lô nói với người đề lao.'},()=>
     CQ.say('Người kể chuyện','Người đề lao đem hai sứ đồ về nhà mình, rửa vết thương cho hai ông. Cả nhà người vui mừng vì đã tin Đức Chúa Trời.','Theo Công vụ 16:33-34','Tiếp',()=>{CQ.setCine(null);n();})));}}
  ];
 }});
