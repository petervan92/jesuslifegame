/* Chapter: the man born blind (John 9:1-38). Daylight: Jesus says "đương khi còn ban ngày" (John 9:4).
   A lime-stone street in Jerusalem leads down to the stepped pool of Siloam. While the player guides the man
   to the pool, the 3D view is blurred and darkened to show what near-blindness is like. */
'use strict';
CQ.chapters.push({id:'blind',no:13,title:'Người mù từ thuở sanh ra',sub:'Ao Si-lô-ê · ban ngày',
 intro:[
  {t:'Một con đường ở Giê-ru-sa-lem',x:'Chúa Giê-su cùng các môn đồ đi trên một con đường lát đá trong thành Giê-ru-sa-lem. Bên đường có một người ngồi xin. Người ấy bị mù từ khi mới sanh ra.',ref:'Theo Giăng 9:1',cam:[-36,14,12,-14,1.5,1]},
  {t:'Ao Si-lô-ê',x:'Cuối con đường dốc là ao Si-lô-ê, một cái ao lớn có nhiều bậc đá để người ta xuống lấy nước.',cam:[38,10,11,27,0,0]}],
 outro:'Người mù được sáng mắt, và còn được biết Chúa Giê-su là ai. Ngài là sự sáng của thế gian.',outroRef:'Theo Giăng 9:5, 9:38',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,boxUV,M}=CQ;
  W.tod='day';W.startYaw=-1.57;W.menuCam={x:4,y:2,z:0,r:40,h:16};
  const PX=28,PZ=0,inPool=(x,z)=>Math.abs(x-PX)<6&&Math.abs(z-PZ)<4;
  const H=(x,z)=>inPool(x,z)?-1.6:1+1.6*sm(12,-28,x)+.15*noise(x,z)*sm(9,15,Math.hypot(x-PX,z-PZ))+sm(9,30,Math.abs(z))*4*(.6+.4*noise(x*.7,z*.7));
  W.paths=[[[-44,0],[PX-6,0]]];
  const g1=C('#a9c05c'),pave=C('#d8c9a2'),rim=C('#cdbb92');
  CQ.terrain({seg:380,H,color:(x,z,y,c)=>{c.copy(g1).lerp(C('#c2c872'),.5+.5*noise(x*1.7,z*1.7));c.lerp(pave,(1-sm(5,8,Math.abs(z)))*sm(-46,-40,x));if(Math.hypot(x-PX,z-PZ)<12)c.lerp(rim,.8);}});
  CQ.sky({fogNear:50,fogFar:190});CQ.water({deep:1.6});

  /* the street */
  for(let i=0;i<7;i++){const x=-34+i*7.6;CQ.house(x,-9,6.4,5,rr(3,4.2),0,{stone:'lime',plaster:i%2,awning:i===2?1:0,roofJars:i%3===1,stair:i%2===0});CQ.house(x+2.4,9,6.4,5,rr(3,4.2),Math.PI,{stone:'lime',plaster:(i+1)%2,stair:i%2===1,mat:i===4?'#b5483a':0});}
  [[-24,-6],[-6,6],[14,-6],[19,-6.6]].forEach(p=>CQ.palm(p[0],p[1],rr(.9,1.1)));
  /* the pool of Siloam: stepped rim, coping and a row of columns */
  const step=(top,b0,b1)=>{const yb=-2;[[PX,PZ-4+(b0+b1)/2,12-2*b0,b1-b0],[PX,PZ+4-(b0+b1)/2,12-2*b0,b1-b0]].forEach(s=>{mesh(boxUV(s[2],top-yb,s[3],2.6),M.lime,s[0],(top+yb)/2,s[1]);W.platforms.push({x0:s[0]-s[2]/2,x1:s[0]+s[2]/2,z0:s[1]-s[3]/2,z1:s[1]+s[3]/2,top});});
    [[PX-6+(b0+b1)/2],[PX+6-(b0+b1)/2]].forEach(s=>{mesh(boxUV(b1-b0,top-yb,8-2*b0,2.6),M.lime,s[0],(top+yb)/2,PZ);W.platforms.push({x0:s[0]-(b1-b0)/2,x1:s[0]+(b1-b0)/2,z0:PZ-4+b0,z1:PZ+4-b0,top});});};
  step(.55,0,1.1);step(.1,1.1,2.2);
  for(let i=0;i<6;i++){const x=PX-6+i*2.4;mesh(new T.CylinderGeometry(.28,.32,4,10),M.lime,x,CQ.G(x,PZ-5.4)+2,PZ-5.4);W.circles.push({x,z:PZ-5.4,r:.35});}
  mesh(boxUV(14,.5,1,2.6),M.lime,PX,CQ.G(PX,PZ-5.4)+4.2,PZ-5.4);
  W.obstacles.push({x:PX,z:PZ,w:7.6,d:3.6,rot:0,ox:0});
  CQ.crowd([[PX+3,PZ+5.4,3.14],[PX+5,PZ+5.2,3.14],[PX+7.5,PZ+2,-1.57],[PX+7.6,PZ-1.5,-1.57],[PX-1,PZ+5.3,3.14]]);

  /* people */
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),-17,-1.6,1.57),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),-19.5,-3,1.57);
  CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#6f86a8',hem:.3,sash:'#e9dcc0',hair:'#2a1d15',beard:1}),-19.8,-.4,1.57);
  const man=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#a89878',hem:.3,sash:'#6b4a2f',hair:'#3a281c',beard:1,staff:1}),-13,4.2,Math.PI);man.dy=-.3;
  mesh(new T.BoxGeometry(1.2,.05,.9),toon('#b5483a'),-13,CQ.G(-13,4.6)+.03,4.6,null,false);
  const nb=CQ.place(CQ.makeChar(CQ.CAST.woman2),PX-6.6,PZ+4.8,-2.4),nb2=CQ.place(CQ.makeChar(CQ.CAST.man2),PX-4.8,PZ+4.7,3);

  /* glowing waypoints for the guided walk: bright enough to show through the blur */
  const glowM=new T.MeshBasicMaterial({color:'#fff3b0'}),haloM=new T.MeshBasicMaterial({color:'#fff0a0',transparent:true,opacity:.55,depthWrite:false,blending:T.AdditiveBlending});
  const orbs=[[-4,1.2],[5,-1],[14,1]].map((p,i)=>{const g=new T.Group();g.position.set(p[0],CQ.G(p[0],p[1])+1.3,p[1]);W.scene.add(g);g.add(new T.Mesh(new T.SphereGeometry(.55,14,10),glowM),new T.Mesh(new T.SphereGeometry(1.8,14,10),haloM));
    const L=new T.PointLight('#ffe7a0',2.2,10,1.5);g.add(L);g.visible=false;CQ.addInter({id:'w'+i,obj:g,x:p[0],z:p[1],name:'tiếng nước chảy',verb:'Đi theo ',h:1.4,r:2.4,hidden:true,g});return g;});
  const poolM=new T.Group();poolM.position.set(PX-7,CQ.G(PX-7,PZ),PZ);W.scene.add(poolM);
  W.tick.push((dt,tt)=>orbs.forEach((g,i)=>{const s=1+.15*Math.sin(tt*4+i);g.scale.setScalar(s);}));

  /* blur helpers: the engine clears the filter on chapter load; we clear it ourselves too */
  const cv=document.getElementById('c'),blur=(b,br)=>{cv.style.filter=b>.05?'blur('+b.toFixed(1)+'px) brightness('+br.toFixed(2)+')':'';};
  let follow=false,blurOn=false;
  W.tick.push(()=>{if(blurOn&&document.getElementById('title').style.display==='flex'){blurOn=false;blur(0,1);}
    if(!follow)return;const p=W.player,dx=p.x-man.x,dz=p.z-man.z,d=Math.hypot(dx,dz);if(d>2.2)CQ.walkTo(man,p.x-dx/d*1.6,p.z-dz/d*1.6,Math.min(5.4,d*1.6));});

  CQ.zones({A:{c:[1,0],rect:[35,5.6],tod:'day'}});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:3});
  CQ.addInter({id:'blind',P:man,name:'người mù',verb:'Lại gần ',h:1.8,r:2.6});
  CQ.addInter({id:'pool',obj:poolM,x:PX-7,z:PZ,name:'ao Si-lô-ê',verb:'Đến ',h:1.6,r:2.4});
  const nI=CQ.addInter({id:'nb',P:nb,name:'bà hàng xóm',side:1,h:1.95,hidden:true,run:d=>CQ.lines([['Bà hàng xóm','Có phải người nầy là kẻ vẫn ngồi xin bên đường đó không? Tôi không chắc nữa. Chắc là một người giống anh ấy thôi.','Theo Giăng 9:8-9'],['Người được sáng mắt','Chính tôi đây mà!','Theo Giăng 9:9']],d)});
  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',-26,.5,-1.57,null,true);W.player.g.rotation.y=1.57;

  W.steps=[
   {at:'jesus',text:'Đi cùng Thầy và các môn đồ trên con đường đá',run:n=>{CQ.setCine([-20,3.4,4.5,-14.5,1.4,1.5]);CQ.face(jesus,-13,4.2);
     CQ.lines([['Người kể chuyện','Chúa Giê-su đi qua, thấy một người mù từ thuở sanh ra.','Theo Giăng 9:1'],['Các môn đồ','Thưa Thầy, ai đã phạm tội mà người nầy sanh ra đã mù: chính người, hay là cha mẹ người?','Theo Giăng 9:2'],
       ['Chúa Giê-su','Đó chẳng phải tại người hay tại cha mẹ đã phạm tội; nhưng ấy để cho những việc Đức Chúa Trời được tỏ ra trong người.','Giăng 9:3']],()=>
     CQ.order({name:'Chúa Giê-su',q:'Rồi Thầy nói một câu về chính mình. Ghép lại lời ấy.',chunks:['Đương khi ta còn','ở thế gian,','ta là sự sáng','của thế gian.'],ref:'Giăng 9:5'},()=>{CQ.setCine(null);n();}));}},
   {at:'blind',text:'Lại gần người mù đang ngồi bên đường',run:n=>{CQ.walkTo(jesus,-13.4,2.6,2,()=>CQ.face(jesus,-13,4.2));CQ.setCine([-15.2,3,-2.6,-13,1,3.6]);
     CQ.lines([['Người kể chuyện','Chúa Giê-su nhổ xuống đất, lấy nước miếng trộn thành bùn, rồi đem bùn xức trên mắt người mù.','Theo Giăng 9:6'],['Chúa Giê-su','Hãy đi, rửa nơi ao Si-lô-ê.','Giăng 9:7']],()=>
     CQ.say('Người kể chuyện','Ao ở cuối con đường, nhưng anh không thấy đường. Hãy dẫn anh đi! Bây giờ bạn sẽ thấy giống như anh: mọi thứ mờ và tối lắm. Hãy đi theo những đốm sáng, đó là tiếng nước chảy.',null,'Dẫn anh đi',()=>{
      CQ.setCine(null);man.dy=0;jI.hidden=true;follow=true;blurOn=true;blur(14,.45);orbs.forEach((g,i)=>{g.visible=true;CQ.byId('w'+i).hidden=false;});CQ.marks();n();}));}},
   {collect:['w0','w1','w2'],text:'Dẫn anh đi theo tiếng nước chảy xuống ao',each:I=>{I.g.visible=false;I.hidden=true;},run:n=>CQ.say('Người mù','Tôi nghe tiếng nước rồi! Ao ở ngay phía trước.',null,null,n)},
   {at:'pool',text:'Đưa anh đến bậc đá của ao Si-lô-ê',run:n=>{follow=false;man.dest=null;CQ.place(man,PX-4.4,PZ,1.57);man.dy=-.3;CQ.movePlayer(PX-6.6,PZ-2.6);CQ.setCine([PX-10.5,4.4,PZ+2.6,PX-2.5,-1,PZ-.3]);
     CQ.tapFill({name:'Rửa mắt',text:'Anh vâng lời Chúa, cúi xuống lấy nước ao rửa mắt. Chạm thật nhanh để giúp anh rửa sạch bùn!',need:18,onP:p=>blur((1-p)*14,.45+.55*p)},()=>{blurOn=false;blur(0,1);man.dy=0;man.raise=.4;
      CQ.say('Người kể chuyện','Người đi rửa, rồi trở lại thì thấy được! Lần đầu tiên trong đời, anh nhìn thấy bầu trời, mặt nước và mọi người.','Theo Giăng 9:7',null,()=>{man.raise=0;CQ.setCine(null);CQ.place(man,PX-8.4,PZ+2,-1.2);CQ.byId('blind').name='người được sáng mắt';nI.hidden=false;CQ.marks();n();});});}},
   {at:'blind',text:'Hàng xóm xôn xao. Lại hỏi anh chuyện gì đã xảy ra',run:n=>
     CQ.choice({name:'Người kể chuyện',q:'Người ta hỏi: Làm sao mắt anh được mở? Anh trả lời thế nào?',options:['Người tên Giê-su hòa bùn xức mắt tôi, bảo tôi đi rửa ở ao Si-lô-ê. Tôi rửa rồi thì thấy được.','Tôi tự nhiên thấy được, chẳng có ai giúp cả.','Tôi uống nước ao nên mắt khỏi.'],ref:'Theo Giăng 9:10-11',wrong:'Chưa đúng. Hãy nhớ lại ai đã xức bùn trên mắt anh.'},()=>
     CQ.say('Người kể chuyện','Người Pha-ri-si cũng tra hỏi anh nhiều lần. Họ nói người chữa bệnh cho anh là kẻ có tội. Anh trả lời rất can đảm.','Theo Giăng 9:13-24',null,()=>
     CQ.fillWord({name:'Người được sáng mắt',before:'Tôi chẳng biết người có phải là kẻ có tội chăng, chỉ biết một điều, là tôi đã mù mà bây giờ lại',after:'.',options:['buồn','sáng','giàu'],answer:'sáng',ref:'Giăng 9:25',wrong:'Chưa đúng. Trước kia anh mù, bây giờ thì sao?'},()=>
     CQ.fade(()=>{jI.hidden=false;jesus.dest=null;CQ.place(jesus,PX-10.5,PZ-1.6,.9);CQ.marks();n();}))))},
   {at:'jesus',text:'Về sau, Chúa Giê-su đi tìm anh. Lại gần Thầy',run:n=>{CQ.byId('blind').noTurn=1;CQ.face(man,jesus.x,jesus.z);CQ.face(jesus,man.x,man.z);CQ.setCine([PX-4.4,3,PZ-3.6,PX-9.5,1.1,PZ+.3]);
     CQ.lines([['Chúa Giê-su','Ngươi có tin đến Con Đức Chúa Trời chăng?','Giăng 9:35'],['Người kể chuyện','Anh hỏi Người ấy là ai. Chúa Giê-su đáp: Ngươi đã thấy Người, và chính Người đang nói với ngươi đó.','Theo Giăng 9:36-37'],['Người được sáng mắt','Lạy Chúa, tôi tin.','Giăng 9:38']],()=>{man.dy=-.3;
     CQ.say('Người kể chuyện','Rồi anh sấp mình xuống trước mặt Ngài.','Theo Giăng 9:38','Xong',()=>{CQ.setCine(null);n();});});}}];
 }});
