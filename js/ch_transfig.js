/* Chapter: the transfiguration on the high mountain (Matthew 17:1-9). No time of day is given: daylight
   (the 'glory' light is used only for the moment Jesus shines).
   Quoted word for word (checked against the 1925 text): Matthew 17:2 (phrases), 17:4, 17:5, 17:7.
   Note: 17:5 reads "đẹp lòng ta mọi đường" (Matthew 3:17 has "mọi đàng"). */
'use strict';
CQ.chapters.push({id:'transfig',no:12,title:'Hóa hình trên núi',sub:'Môi-se và tiên tri Ê-li hiện ra, tiếng phán từ đám mây · ban ngày',
 intro:[
  {t:'Lên núi cao',x:'Sáu ngày sau, Chúa Giê-su đem Phi-e-rơ, Gia-cơ và Giăng là em Gia-cơ, đi riêng với Ngài lên một hòn núi cao.',ref:'Theo Ma-thi-ơ 17:1',cam:[12,24,48,0,12,-30]},
  {t:'Ê-li đi cùng',x:'Lối mòn ngoằn ngoèo, càng lên cao càng nhiều đá. Ê-li đi theo sau các môn đồ. Trên đỉnh núi sẽ có một điều thật lạ lùng.',cam:[16,32,-18,0,24,-43]}],
 outro:'Khi xuống núi, Chúa Giê-su dặn các môn đồ chớ thuật lại điều đã thấy cho ai, cho đến khi Con người từ kẻ chết sống lại.',outroRef:'Theo Ma-thi-ơ 17:9',
 build(W){
  const {T,rr,sm,C,noise,toon,mesh}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:14,z:-30,r:60,h:22};
  const PX=0,PZ=-43,TOP=24;
  const H=(x,z)=>{const d=Math.hypot(x-PX,z-PZ),m=28*Math.exp(-d*d/1100);let y=m>TOP?TOP+(m-TOP)*.06:m;return y+.5*noise(x*1.3,z*1.3)*sm(10,24,d)+.6*noise(x*2.4,z*2.4)*sm(30,60,d);};
  const way=[[3,15],[9,2],[-5,-10],[7,-22],[-1,-32],[0,-40]];W.paths=[way];
  const g1=C('#7fb548'),g2=C('#a3c55a'),rk=C('#a49a88'),rk2=C('#8e8676'),dirt=C('#cdb58a');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(rk,sm(9,18,y+2*noise(x*3,z*3)));c.lerp(rk2,sm(21,24,y)*.4);c.lerp(dirt,(1-sm(1.2,2.6,CQ.distPath(x,z)))*.85);}});
  CQ.sky({fogNear:70,fogFar:260,ridgeAmp:22});
  CQ.scatter(2200,new T.ConeGeometry(.09,.3,4),toon('#5f9e34'),()=>{const x=rr(-160,160),z=rr(-160,160);if(CQ.distPath(x,z)<2.2||H(x,z)>14)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(260,new T.DodecahedronGeometry(.6,0),toon('#9d9482'),()=>{const x=rr(-40,40),z=rr(-80,10);if(CQ.distPath(x,z)<2.4||Math.hypot(x-PX,z-PZ)<9)return 0;return[x,H(x,z)+.1,z,rr(.4,2),rr(.5,.85)];},true);
  [[-12,10],[16,8],[-16,-2],[18,-8],[-20,16],[24,18]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));
  for(const p of[[-6,9],[-8,6],[-5,5],[-9,10]])CQ.sheep(p[0],p[1]);
  const shep=CQ.place(CQ.makeChar(CQ.CAST.shepherd2),-6.5,7.5,1.2);

  /* small stone cairns that mark resting places on the way up */
  const cairn=(x,z)=>{const g=new T.Group();g.position.set(x,H(x,z),z);W.scene.add(g);[[.42,.25],[.32,.62],[.22,.9]].forEach((s,i)=>mesh(new T.DodecahedronGeometry(s[0],0),toon(i%2?'#b8ad98':'#a49a88'),rr(-.05,.05),s[1],rr(-.05,.05),g));W.circles.push({x,z,r:.4});return g;};
  const cps=[[10.6,1.4],[-6.4,-10.6],[8.6,-22.4],[-2.6,-32.4]];cps.forEach((p,i)=>{const g=cairn(p[0],p[1]);CQ.addInter({id:'c'+i,obj:g,x:p[0],z:p[1],name:'đống đá nghỉ chân',verb:'Nghỉ chân ở ',h:1.3,r:2.2});});

  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),1,11,3.14),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),-1,12,3.14);
  const james=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#6f86a8',hem:.45,sash:'#e9dcc0',hair:'#2a1d15',beard:1}),2.6,12.6,3.14);
  const john=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#c97b5a',hem:.45,sash:'#3a6ea5',hair:'#2e2018'}),.4,13.4,3.14);
  /* Jesus in glory (hidden until the moment on the summit), Moses and Elijah */
  const jg=CQ.place(CQ.makeChar({...CQ.CAST.jesus,tunic:'#ffffff',mantle:'#fffbe8',emis:'#fff0b0',glow:'#fff4c8'}),PX,PZ,0);jg.g.visible=false;jg.light.intensity=2.2;
  mesh(new T.SphereGeometry(1.5,20,14),new T.MeshBasicMaterial({color:'#fff6d0',transparent:true,opacity:.22,depthWrite:false}),0,1.1,0,jg.g,false);
  const moses=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#ece4d0',mantle:'#9a7a52',hair:'#f0ece0',beard:2,staff:1}),PX-2.4,PZ-1.2,.9);
  const elijah=CQ.place(CQ.makeChar({skin:'#b0744a',tunic:'#d9c39a',mantle:'#6f5a42',sash:'#3a2718',hair:'#4a3a2c',hairLong:1,beard:2}),PX+2.4,PZ-1.2,-.9);
  moses.g.visible=elijah.g.visible=false;
  /* the bright cloud */
  const cM=new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false}),cloud=new T.Group();W.scene.add(cloud);
  for(let i=0;i<16;i++){const a=i/16*6.283,r=rr(1,6.5),s=rr(1.6,2.8);const m=new T.Mesh(new T.SphereGeometry(1,14,10),cM);m.scale.set(s*1.3,s*.6,s);m.position.set(Math.cos(a)*r,rr(-.6,.8),Math.sin(a)*r);cloud.add(m);}
  let cY=TOP+18,cT=TOP+18,cO=0;cloud.position.set(PX,cY,PZ+.5);
  W.tick.push((dt,tt)=>{cY+=(cT-cY)*Math.min(1,dt*.8);cloud.position.y=cY;cloud.rotation.y=tt*.05;cM.opacity+=(cO-cM.opacity)*Math.min(1,dt*1.2);cloud.visible=cM.opacity>.01;});

  CQ.zones({A:{c:[2,-14],r:36,tod:'day'}});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',verb:'Lại gần ',h:2.05,r:3});
  CQ.addInter({id:'shep',P:shep,name:'người chăn chiên',side:1,h:2.05,run:d=>CQ.say('Người chăn chiên','Chào em! Núi này cao lắm. Cứ đi theo lối mòn và nghỉ chân ở mấy đống đá nhỏ nhé.',null,null,d)});
  const walkPath=(P,pts,sp,dx,cb)=>{const go=i=>{if(i>=pts.length){if(cb)cb();return;}CQ.walkTo(P,pts[i][0]+dx,pts[i][1],sp,()=>go(i+1));};go(0);};
  const spots=[[jesus,PX,PZ,0],[peter,PX-2.4,PZ+3.6,3.14],[james,PX,PZ+4.2,3.14],[john,PX+2.4,PZ+3.6,3.14]];
  const atTop=()=>spots.forEach(s=>{s[0].dest=null;CQ.place(s[0],s[1],s[2],s[3]);});
  const fall=on=>[peter,james,john].forEach(p=>{p.g.rotation.set(on?-1.45:0,3.14,0);p.dy=on?.22:0;});

  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',3,17,0,null,true);
  W.steps=[
   {at:'jesus',text:'Đến gặp Thầy dưới chân núi',run:n=>CQ.say('Người kể chuyện','Chúa Giê-su đem Phi-e-rơ, Gia-cơ và Giăng đi riêng với Ngài lên núi cao. Ê-li, hãy đi theo các môn đồ nhé!','Theo Ma-thi-ơ 17:1','Lên núi!',()=>{
     spots.forEach((s,i)=>walkPath(s[0],[...way.slice(1,5),[s[1],s[2]]],2.3-i*.08,[0,-1.2,1.2,0][i],()=>CQ.place(s[0],s[1],s[2],s[3])));jI.hidden=true;n();})},
   {collect:['c0','c1','c2','c3'],text:'Leo núi theo lối mòn, nghỉ chân ở các đống đá',each:I=>{I.hidden=true;CQ.marks();},run:n=>{jI.hidden=false;CQ.marks();n();}},
   {at:'jesus',text:'Lên tới đỉnh núi. Lại gần Thầy',run:n=>{atTop();CQ.setCine([PX+6.5,TOP+3.4,PZ+10,PX,TOP+1.3,PZ-.5]);
     const tents=()=>CQ.fillWord({name:'Phi-e-rơ',before:'Lạy Chúa, chúng ta ở lại đây thì tốt lắm; ví bằng đẹp ý Chúa, thì tôi sẽ đóng',after:' tại đây, một cái cho Chúa, một cái cho Môi-se và một cái cho Ê-li.',options:['ba trại','ba nhà','ba bàn thờ'],answer:'ba trại',ref:'Ma-thi-ơ 17:4',wrong:'Chưa đúng. Phi-e-rơ muốn dựng chỗ ở tạm bằng vải.'},()=>{CQ.setCine(null);n();});
     const who=()=>{moses.g.visible=elijah.g.visible=true;CQ.choice({name:'Người kể chuyện',q:'Có hai người hiện ra, nói chuyện cùng Chúa Giê-su. Hai người ấy là ai?',options:['Môi-se và tiên tri Ê-li','Áp-ra-ham và Đa-vít','Hai thiên sứ'],ref:'Ma-thi-ơ 17:3',wrong:'Chưa đúng. Một người đã nhận luật pháp, một người là đấng tiên tri.'},tents);};
     CQ.say('Người kể chuyện','Chúa Giê-su hóa hình trước mặt các môn đồ: mặt Ngài sáng lòa như mặt trời, áo Ngài trắng như ánh sáng.','Theo Ma-thi-ơ 17:2',null,()=>{jesus.g.visible=false;jg.g.visible=true;jI.hidden=true;CQ.marks();CQ.setTod('glory');setTimeout(who,900);});}},
   {text:'Một đám mây sáng rực',run:n=>{cT=TOP+3.2;cO=.85;CQ.setCine([PX+9,TOP+4.5,PZ+13,PX,TOP+2,PZ]);
     const stand=()=>{cT=TOP+20;cO=0;moses.g.visible=elijah.g.visible=false;jg.g.visible=false;jesus.g.visible=true;CQ.place(jesus,PX,PZ+1.5,3.14);CQ.setTod('day');CQ.setCine(null);jI.hidden=false;CQ.marks();n();};
     CQ.say('Người kể chuyện','Đang khi Phi-e-rơ còn nói, bỗng có một đám mây sáng rực che phủ những người ở đó, và có tiếng từ trong mây phán.','Theo Ma-thi-ơ 17:5',null,()=>
     CQ.order({name:'Tiếng từ trong mây',q:'Ghép lại lời phán từ trong đám mây.',chunks:['Nầy là Con yêu dấu của ta,','đẹp lòng ta mọi đường;','hãy nghe lời Con đó!'],ref:'Ma-thi-ơ 17:5'},()=>{fall(true);
     CQ.say('Người kể chuyện','Các môn đồ nghe vậy, thì té sấp mặt xuống đất và sợ hãi lắm.','Theo Ma-thi-ơ 17:6',null,stand);}));}},
   {at:'jesus',text:'Các môn đồ đang sợ. Đứng gần Thầy',run:n=>{CQ.setCine([PX+6,TOP+3,PZ+9,PX,TOP+.8,PZ+3]);CQ.face(jesus,PX,PZ+4);jesus.raise=.2;
     CQ.say('Người kể chuyện','Chúa Giê-su lại gần, rờ các môn đồ mà phán:','Theo Ma-thi-ơ 17:7',null,()=>
     CQ.fillWord({name:'Chúa Giê-su',before:'Hãy đứng dậy,',after:'!',options:['đừng sợ','hãy chạy','im lặng'],answer:'đừng sợ',ref:'Ma-thi-ơ 17:7',wrong:'Chưa đúng. Chúa muốn các môn đồ được bình an.'},()=>{fall(false);jesus.raise=0;
     CQ.say('Người kể chuyện','Các môn đồ ngước mắt lên, thì không thấy ai nữa, chỉ thấy một mình Chúa Giê-su mà thôi.','Theo Ma-thi-ơ 17:8','Xong',()=>{CQ.setCine(null);n();});}));}}];
 }});
