/* Chapter 3: the three temptations (Matthew 4:1-11). No time of day is given, so the scene is set in daylight.
   Nobody else was in the wilderness, so Ê-li imagines himself there while the story is told. */
'use strict';
CQ.chapters.push({id:'ch3',no:3,title:'Đồng vắng',sub:'Chúa Giê-su thắng ba lần cám dỗ · ban ngày',
 intro:[
  {t:'Vào đồng vắng',x:'Sau khi chịu báp-têm, Chúa Giê-su được Đức Thánh Linh đưa vào đồng vắng. Ở đó chỉ có đá, cát và gió.',ref:'Theo Ma-thi-ơ 4:1',cam:[34,18,36,0,2,-6]},
  {t:'Ê-li lắng nghe',x:'Về sau, người ta kể lại chuyện này. Ê-li nhắm mắt lại và hình dung mình đang đứng giữa đồng vắng ấy, để xem Thầy đã chiến thắng thế nào.',cam:[7,3.2,12,0,1.6,-8]}],
 outro:'Ba lần bị cám dỗ, ba lần Chúa Giê-su dùng lời Kinh Thánh để chiến thắng.',outroRef:'Theo Ma-thi-ơ 4:1-11',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,boxUV,M}=CQ;
  W.tod='desert';W.startYaw=0;W.menuCam={x:0,y:3,z:-6,r:44,h:16};
  const TP={x:-110,z:-60,top:26},MT={x:110,z:-110,top:50};
  const H=(x,z)=>{const r0=Math.hypot(x,z);let y=2+2.2*noise(x,z)+1.1*noise(x*2.1,z*2.1);y+=7*sm(.15,.9,noise(x*.6+20,z*.6-9))*sm(26,60,r0);
    y+=(1.2-y)*sm(22,6,r0)*.8;const dt=Math.hypot(x-TP.x,z-TP.z+10);y+=(1-y)*sm(85,45,dt);
    const dm=Math.hypot(x-MT.x,z-MT.z);y*=1-sm(46,18,dm);return y+Math.min(MT.top,62*Math.exp(-dm*dm/1900));};
  const s1=C('#e3cb96'),s2=C('#d4b47c'),rk=C('#b98f62'),pk=C('#c9a27a');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(s1).lerp(s2,.5+.5*noise(x*1.9,z*1.9));c.lerp(rk,sm(5,13,y)*.8);c.lerp(pk,sm(20,46,y)*.6);}});
  CQ.sky({clouds:5,ridgeAmp:30,fogNear:80,fogFar:340});
  CQ.scatter(260,new T.DodecahedronGeometry(.6,0),toon('#b59a72'),()=>{const x=rr(-150,150),z=rr(-150,150);if(Math.hypot(x,z+8)<4)return 0;return[x,H(x,z)+.1,z,rr(.3,1.8),rr(.5,.85)];},true);
  CQ.scatter(160,new T.ConeGeometry(.12,.5,5),toon('#9a9a5c'),()=>{const x=rr(-140,140),z=rr(-140,140);return[x,H(x,z)+.2,z,rr(.8,1.6)];});
  for(const p of[[1.6,-6.6,.5],[2.3,-7.4,.36],[1.2,-7.7,.3],[-9,-3,1.1],[8,4,.9],[-6,9,.7]]){const m=mesh(new T.DodecahedronGeometry(p[2],0),toon('#c2aa82'),p[0],H(p[0],p[1])+p[2]*.5,p[1]);m.scale.y=.7;W.circles.push({x:p[0],z:p[1],r:p[2]});}

  /* the temple: a high terrace above the city, with the sanctuary behind */
  mesh(boxUV(28,30,20,3),M.lime,TP.x,TP.top-15,TP.z);W.platforms.push({x0:TP.x-14,x1:TP.x+14,z0:TP.z-10,z1:TP.z+10,top:TP.top});
  for(const s of[-1,1])mesh(boxUV(.6,1,20,3),M.lime,TP.x+s*13.7,TP.top+.5,TP.z);mesh(boxUV(28,1,.6,3),M.lime,TP.x,TP.top+.5,TP.z+9.7);
  mesh(new T.BoxGeometry(22,46,26),toon('#f4ecd8'),TP.x,23,TP.z-23.2);mesh(new T.BoxGeometry(23,2,27),toon('#e2b84a'),TP.x,46,TP.z-23.2);mesh(new T.BoxGeometry(5,12,.4),toon('#e2b84a'),TP.x,TP.top+6,TP.z-10.1);
  for(let i=0;i<6;i++)mesh(new T.CylinderGeometry(.8,.9,18,10),toon('#efe6cf'),TP.x-10+i*4,TP.top+9,TP.z-9.6);
  CQ.scatter(150,new T.BoxGeometry(5,3,5),toon('#e6d6b0'),()=>{const x=TP.x+rr(-75,75),z=TP.z+rr(14,80);return[x,H(x,z)+1.2,z,rr(.7,1.5),rr(.7,1.4)];},true);
  /* the kingdoms of the world, seen from the very high mountain */
  CQ.scatter(90,new T.BoxGeometry(4,5,4),toon('#f0c95a',{emissive:'#a8781a',emissiveIntensity:.5}),()=>{const a=rr(0,6.283),r=rr(48,95),x=MT.x+Math.cos(a)*r,z=MT.z+Math.sin(a)*r;if(Math.abs(x)>180||Math.abs(z)>180||Math.hypot(x,z)<138)return 0;return[x,H(x,z)+1.5,z,rr(.6,1.6),rr(.8,2.4)];});

  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),0,-8,0);
  /* the tempter: a hooded shadow, kept simple and not frightening */
  const sh=new T.Group();sh.visible=false;W.scene.add(sh);const dk=toon('#2b2038'),dk2=new T.MeshBasicMaterial({color:'#1c1428',transparent:true,opacity:.75});
  mesh(new T.ConeGeometry(.62,2.1,14),dk,0,1.05,0,sh);mesh(new T.SphereGeometry(.36,14,10),dk,0,2.0,0,sh);
  for(const s of[-1,1])mesh(new T.SphereGeometry(.045,8,6),new T.MeshBasicMaterial({color:'#d9b8ff'}),s*.12,2.02,.31,sh,false);
  const wisps=[];for(let i=0;i<7;i++){const w=new T.Mesh(new T.SphereGeometry(rr(.14,.26),8,6),dk2);sh.add(w);wisps.push(w);}
  const holy=new T.PointLight('#fff0c0',0,24,1.4);W.scene.add(holy);
  let sp=0;W.tick.push((dt,tt)=>{wisps.forEach((w,i)=>{const a=tt*(.8+i*.13)+i;w.position.set(Math.cos(a)*(.8+.1*i),.5+i*.25+Math.sin(tt*2+i)*.1,Math.sin(a)*(.8+.1*i));});
    sh.scale.setScalar(Math.max(.01,1-sp*.9));sh.position.y=W.H(sh.position.x,sh.position.z)+Math.sin(tt*1.7)*.06;if(zone==='B')sh.position.y=TP.top+Math.sin(tt*1.7)*.06;
    holy.position.set(jesus.x,jesus.g.position.y+2.4,jesus.z);});
  const showSh=(dx,dz)=>{sp=0;sh.position.set(jesus.x+dx,0,jesus.z+dz);sh.rotation.y=Math.atan2(-dx,-dz);sh.visible=true;};
  const drive=(need,text,cb)=>CQ.tapFill({name:'Lời Chúa là ánh sáng',text,need,onP:p=>{sp=p;holy.intensity=p*.6;}},()=>{sh.visible=false;holy.intensity=.35;cb();});
  const a1=CQ.place(CQ.makeChar(CQ.CAST.angel),MT.x+3,MT.z-1.5,0),a2=CQ.place(CQ.makeChar(CQ.CAST.angel),MT.x-.5,MT.z-4.5,0);
  for(const a of[a1,a2]){a.g.visible=false;a.light.intensity=0;}

  let zone='A';
  W.bounds=(x,z)=>zone==='A'?Math.hypot(x,z)<44:zone==='B'?(Math.abs(x-TP.x)<12.6&&Math.abs(z-TP.z)<8.8):Math.hypot(x-MT.x,z-MT.z)<11;
  const go=(z,jx,jz,px,pz,yaw)=>CQ.fade(()=>{zone=z;holy.intensity=0;CQ.place(jesus,jx,jz,Math.atan2(px-jx,pz-jz));CQ.movePlayer(px,pz,yaw);});
  CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',verb:'Lại gần ',h:2.05,r:3});

  W.player=CQ.place(CQ.makeChar(CQ.CAST.eli),0,14,Math.PI);
  W.steps=[
   {at:'jesus',text:'Đi tìm Thầy giữa đồng vắng',run:n=>{CQ.setCine([-5.5,2.6,-1.5,1,1.2,-8]);
     const win=()=>CQ.say('Người kể chuyện','Kẻ cám dỗ lùi xa. Nhưng nó chưa chịu thôi.',null,null,()=>{CQ.setCine(null);go('B',-110,-52.6,-110,-60.5,Math.PI);n();});
     const ans=()=>CQ.fillWord({name:'Chúa Giê-su',before:'Có lời chép rằng: Người ta sống chẳng phải chỉ nhờ',after:' mà thôi, song nhờ mọi lời nói ra từ miệng Đức Chúa Trời.',options:['vàng','bánh','gươm'],answer:'bánh',ref:'Ma-thi-ơ 4:4',wrong:'Chưa đúng. Kẻ cám dỗ vừa bảo Ngài biến đá thành thứ gì?'},()=>
       drive(16,'Chúa Giê-su đáp bằng lời Kinh Thánh. Chạm thật nhanh để ánh sáng xua bóng tối đi!',win));
     CQ.say('Người kể chuyện','Chúa Giê-su kiêng ăn bốn mươi ngày bốn mươi đêm, rồi Ngài đói. Bấy giờ kẻ cám dỗ đến gần.','Theo Ma-thi-ơ 4:2-3',null,()=>{showSh(2.4,.4);
      CQ.say('Kẻ cám dỗ','Nếu ngươi phải là Con Đức Chúa Trời, thì hãy khiến đá nầy trở nên bánh đi.','Ma-thi-ơ 4:3',null,ans);});}},
   {at:'jesus',text:'Lại gần Thầy trên nóc đền thờ',run:n=>{CQ.setCine([-116.5,TP.top+3.4,-61,-108.5,TP.top+.5,-52]);
     const win=()=>CQ.say('Người kể chuyện','Lần thứ hai, kẻ cám dỗ lại phải lùi bước.',null,null,()=>{CQ.setCine(null);go('C',MT.x+2,MT.z-2,MT.x-4,MT.z+6,-.64);n();});
     const ans=()=>CQ.order({name:'Chúa Giê-su',q:'Chúa Giê-su lại đáp bằng lời Kinh Thánh. Chạm vào các mảnh theo đúng thứ tự để ghép lại câu ấy.',chunks:['Ngươi đừng thử','Chúa','là Đức Chúa Trời ngươi.'],ref:'Ma-thi-ơ 4:7'},()=>
       drive(18,'Chạm thật nhanh để ánh sáng của Lời Chúa xua bóng tối đi!',win));
     CQ.say('Người kể chuyện','Ma quỉ đem Ngài vào thành thánh, đặt Ngài trên nóc đền thờ. Bên dưới là cả thành Giê-ru-sa-lem.','Theo Ma-thi-ơ 4:5',null,()=>{showSh(2.6,-.4);
      CQ.say('Kẻ cám dỗ','Nếu ngươi phải là Con Đức Chúa Trời, thì hãy gieo mình xuống đi.','Ma-thi-ơ 4:6',null,ans);});}},
   {at:'jesus',text:'Lại gần Thầy trên núi rất cao',run:n=>{CQ.setCine([MT.x-6,MT.top+3.6,MT.z+7,MT.x+3,MT.top+.4,MT.z-3]);
     const end=()=>{for(const a of[a1,a2]){a.g.visible=true;a.light.intensity=.3;holy.intensity=.15;CQ.face(a,jesus.x,jesus.z);}
       CQ.say('Người kể chuyện','Ma quỉ bèn bỏ đi; liền có thiên sứ đến gần mà hầu việc Ngài.','Ma-thi-ơ 4:11','Xong',()=>{CQ.setCine(null);n();});};
     const ans=()=>CQ.choice({name:'Chúa Giê-su',q:'Lần này Chúa Giê-su phán gì với nó?',options:['Hỡi quỉ Sa-tan, ngươi hãy lui ra!','Hãy để ta suy nghĩ thêm.','Ta nhận lời ngươi.'],ref:'Ma-thi-ơ 4:10',wrong:'Chưa đúng. Chúa Giê-su không hề nghe theo nó.'},()=>
       CQ.say('Chúa Giê-su','Vì có lời chép rằng: Ngươi phải thờ phượng Chúa là Đức Chúa Trời ngươi, và chỉ hầu việc một mình Ngài mà thôi.','Ma-thi-ơ 4:10',null,()=>
       drive(24,'Lần cuối cùng! Chạm thật nhanh để ánh sáng đuổi hẳn bóng tối đi!',end)));
     CQ.say('Người kể chuyện','Ma quỉ lại đem Ngài lên trên núi rất cao, chỉ cho Ngài các nước thế gian cùng sự vinh hiển các nước ấy.','Theo Ma-thi-ơ 4:8',null,()=>{showSh(-2.4,.6);
      CQ.say('Kẻ cám dỗ','Ví bằng ngươi sấp mình trước mặt ta mà thờ lạy, thì ta sẽ cho ngươi hết thảy mọi sự nầy.','Ma-thi-ơ 4:9',null,ans);});}}];
 }});
