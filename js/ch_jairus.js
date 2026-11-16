/* Chapter: Jairus's daughter and the woman who touched the cloak (Mark 5:21-43). No time of day is given: daylight.
   Quoted word for word (checked against the 1925 text): Mark 5:34, 5:36, 5:39, 5:41. */
'use strict';
CQ.chapters.push({id:'jairus',no:11,title:'Con gái Giai-ru',sub:'Người đàn bà rờ áo Chúa, em bé được sống lại · ban ngày',
 intro:[
  {t:'Bên bờ biển',x:'Chúa Giê-su trở lại bờ bên này. Đoàn dân rất đông kéo đến quanh Ngài. Có một người cai nhà hội, tên là Giai-ru, chạy đến.',ref:'Theo Mác 5:21-22',cam:[7,13,36,0,1,8]},
  {t:'Con đường đông nghẹt',x:'Nhà Giai-ru ở cuối con đường. Đường chật ních người, ai cũng chen lấn để được đến gần Chúa Giê-su.',ref:'Theo Mác 5:24',cam:[4,15,11,0,1,-13]}],
 outro:'Ai nấy đều lấy làm lạ. Chúa Giê-su có quyền trên cả sự chết, và Ngài thương xót từng người.',outroRef:'Theo Mác 5:42-43',
 build(W){
  const {T,rr,sm,C,noise,toon,mesh,boxUV,M}=CQ;
  W.tod='day';W.startYaw=.3;W.menuCam={x:0,y:2,z:2,r:34,h:14};
  const RX=95,RZ=-95;
  const H=(x,z)=>{const d=24+2*Math.sin(x*.05)-z;if(d<0)return Math.max(-4,d*.25);return .4*sm(0,4,d)+.3*noise(x*1.5,z*1.5)*sm(8,30,d)*sm(8,16,Math.hypot(x-RX,z-RZ));};
  const g1=C('#93b552'),dirt=C('#cdb58a'),sand=C('#dcc48f'),bed=C('#b5a27a');
  CQ.terrain({H,color:(x,z,y,c)=>{const d=24+2*Math.sin(x*.05)-z;if(d<0){c.copy(bed);return;}c.copy(g1).lerp(dirt,.55+.3*noise(x*2,z*2));c.lerp(sand,1-sm(1,5,d));if(Math.abs(x)<7&&z<22)c.lerp(dirt,.8);}});
  CQ.sky({fogNear:50,fogFar:190});CQ.water({lake:true,deep:3.5});
  CQ.boat(-14,34,.4,{float:1,far:1});CQ.boat(16,38,-.3,{float:1,far:1,sail:1});

  /* the street: dark basalt houses on both sides, Jairus's house at the end */
  [-16,-8,0,8,16].forEach((z,i)=>{CQ.house(-10,z,6.5,6,3+.2*(i%2),Math.PI/2,{plaster:i%2,roofJars:i%3===0,awning:i===2?1:0});CQ.house(10,z+3,6.5,6,3.1,-Math.PI/2,{plaster:(i+1)%2,stair:i!==1});});
  CQ.house(0,-21.5,10,7,3.6,0,{mat:'#a5526a',doorX:0});
  [[-6.5,21],[6.8,20],[-14,26]].forEach(p=>CQ.palm(p[0],p[1],rr(1,1.2)));
  /* rows of people across the street, with gaps in a zig-zag (they block the way) */
  const row=(z,g0,g1)=>{const a=[];for(let x=-5.6;x<=5.7;x+=1.05)if(x<g0||x>g1)a.push([x+rr(-.1,.1),z+rr(-.25,.25),rr(-.6,.6)+(z>0?0:3.14)]);return a;};
  CQ.crowd([...row(9,1.4,4.3),...row(4,-4.3,-1.4),...row(-1,1.4,4.3),...row(-6,-4.3,-1.4)]);
  CQ.crowd([[-5.4,-10],[-5.6,-12],[5.4,-10.5],[5.6,-12.6],[-5,14],[5.4,15],[5.6,12.5],[-3.2,-17.2,0],[3.4,-17,0],[-4.6,-16.4,.3]],{noCol:1});

  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),0,14.6,3.14),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),-1.8,15.6,3.14);
  const jair=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#4f6f9a',mantle:'#e9dcc0',tassel:'#3f6f9a',hair:'#3a281c',beard:2,band:'#d9a441'}),0,13,0);jair.dy=-.3;
  const wom=CQ.makeChar({skin:'#c08a5e',tunic:'#8d7656',veil:'#d9cba8',sash:'#6b4a2f',S:.93});wom.g.visible=false;
  const msg=CQ.place(CQ.makeChar(CQ.CAST.man),1.5,-17,3.14);msg.g.visible=false;
  const fan=CQ.place(CQ.makeChar(CQ.CAST.man2),-4.4,16.5,1.2);

  /* Jairus's house, inside: a simple room open to the sky */
  const F=H(RX,RZ)+.15;mesh(new T.BoxGeometry(8.6,.3,6.6),M.plaster,RX,F-.15,RZ);W.platforms.push({x0:RX-4.3,x1:RX+4.3,z0:RZ-3.3,z1:RZ+3.3,top:F});
  CQ.wallBox(RX,RZ-3.5,9,1.9,.4,0);CQ.wallBox(RX-4.5,RZ,7,1.9,.4,Math.PI/2);CQ.wallBox(RX+4.5,RZ,7,1.9,.4,Math.PI/2);CQ.wallBox(RX-2.9,RZ+3.5,3.2,1.9,.4,0);CQ.wallBox(RX+2.9,RZ+3.5,3.2,1.9,.4,0);
  mesh(new T.BoxGeometry(1.9,.12,1),toon('#c9b48c'),RX-.3,F+.06,RZ-2.2);mesh(new T.BoxGeometry(.5,.14,.8),toon('#e9dcc0'),RX-1,F+.15,RZ-2.2);
  mesh(new T.BoxGeometry(1.4,.6,.8),M.wood,RX+3,F+.3,RZ+.6);CQ.jar(null,RX+3.4,F+.6,RZ+.5,.6);W.obstacles.push({x:RX+3,z:RZ+.6,w:1.4,d:.8,rot:0,ox:0});
  const loaf=mesh(new T.SphereGeometry(.2,10,8),toon('#d9a25a'),RX+2.7,F+.7,RZ+.7);loaf.scale.set(1.3,.6,1);
  const girl=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#efe3c6',hem:.4,sash:'#a5526a',hair:'#2e2018',hairLong:1,S:.72,head:1.15}),RX+.45,RZ-2.2,0);girl.g.rotation.z=1.45;girl.dy=.33;
  const mom=CQ.place(CQ.makeChar(CQ.CAST.woman),RX-1.6,RZ-.8,2.6);
  const james=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#6f86a8',hem:.45,sash:'#e9dcc0',hair:'#2a1d15',beard:1}),RX-3.4,RZ+1.6,2.2);
  const john=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#c97b5a',hem:.45,sash:'#3a6ea5',hair:'#2e2018'}),RX-3.6,RZ+.2,1.9);

  CQ.zones({A:{c:[0,1],rect:[5.8,18.5],tod:'day'},B:{c:[RX,RZ],rect:[3.9,2.9],tod:'day'}});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',verb:'Len tới chỗ ',h:2.05,r:2.6});
  CQ.addInter({id:'jairus',P:jair,name:'Giai-ru',h:1.7,r:3,noTurn:1});
  CQ.addInter({id:'door',obj:jesus.g,x:0,z:-17,name:'nhà Giai-ru',verb:'Vào ',h:2.6,r:2.4});
  const gI=CQ.addInter({id:'girl',P:girl,name:'em bé',verb:'Đến gần ',h:1.2,r:2.6,noTurn:1});
  CQ.addInter({id:'bread',obj:loaf,x:RX+2.7,z:RZ+.7,name:'ổ bánh',verb:'Lấy ',h:1.2,r:2});
  CQ.addInter({id:'fan',P:fan,name:'người trong đoàn dân',side:1,h:2.05,run:d=>CQ.say('Người trong đoàn dân','Đông quá! Ai cũng muốn đến gần Thầy. Em nhìn kỹ chỗ hở giữa đám đông mà len qua nhé.',null,null,d)});

  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',2.4,19,.3,null,true);
  const toRoom=()=>{CQ.place(jesus,RX+.2,RZ-.9,3.14);CQ.place(jair,RX+1.8,RZ-.6,-2.4);jair.dy=0;CQ.place(peter,RX-2.6,RZ+2.2,2.6);jI.hidden=true;};
  W.steps=[
   {at:'jairus',text:'Có người đang quì trước mặt Thầy. Lại gần nghe',run:n=>{CQ.setCine([4.5,3.4,16.5,0,1.2,13.5]);
     CQ.say('Giai-ru','Con gái nhỏ tôi gần chết; xin Thầy đến đặt tay trên nó, đặng nó được lành và sống.','Theo Mác 5:23',null,()=>
     CQ.say('Người kể chuyện','Chúa Giê-su đi với Giai-ru. Đoàn dân đông lắm, theo và chen lấn Ngài.','Theo Mác 5:24',null,()=>{CQ.setCine(null);
      CQ.fade(()=>{CQ.place(jesus,0,-10.5,3.14);CQ.place(jair,1.4,-11.6,3.14);jair.dy=0;CQ.place(peter,-1.6,-11.4,3.14);});n();}));}},
   {at:'jesus',text:'Len qua đám đông để theo kịp Thầy',run:n=>{CQ.place(wom,.9,-8.9,3.14);wom.g.visible=true;CQ.setCine([4.6,3.8,-8,0,1.1,-10]);
     const dead=()=>{msg.g.visible=true;CQ.place(msg,1.6,-15,3.14);CQ.face(jesus,1.6,-15);
       CQ.say('Người nhà Giai-ru','Con gái ông đã chết rồi. Còn phiền Thầy làm chi?','Theo Mác 5:35',null,()=>
       CQ.fillWord({name:'Chúa Giê-su',before:'Đừng sợ, chỉ',after:' mà thôi.',options:['tin','khóc','chạy'],answer:'tin',ref:'Mác 5:36',wrong:'Chưa đúng. Chúa bảo Giai-ru hãy tin cậy Ngài.'},()=>{CQ.setCine(null);wom.g.visible=false;n();}));};
     const peace=()=>CQ.say('Chúa Giê-su','Hỡi con gái ta, đức tin con đã cứu con; hãy đi cho bình an và được lành bịnh.','Mác 5:34',null,dead);
     const years=()=>{wom.dy=-.3;CQ.choice({name:'Người kể chuyện',q:'Người đàn bà quì xuống, thưa thật mọi điều. Bà đã đau bịnh bao lâu rồi?',options:['Mười hai năm','Ba ngày','Một tháng'],ref:'Mác 5:25',wrong:'Chưa đúng. Bà đã đau rất lâu rồi.'},peace);};
     CQ.say('Người kể chuyện','Trong đám đông có một người đàn bà đau bịnh đã lâu. Bà nghĩ: "Nếu ta chỉ rờ đến áo Ngài thôi, thì sẽ được lành." Bà rờ áo Chúa, liền thấy mình được lành bịnh.','Theo Mác 5:27-29',null,()=>{CQ.face(jesus,wom.x,wom.z);
      CQ.say('Chúa Giê-su','Ai đã rờ áo ta?','Theo Mác 5:30',null,years);});}},
   {at:'door',text:'Đi theo Thầy vào nhà Giai-ru',run:n=>{CQ.setCine([4.5,4,-12,0,1.5,-17.5]);
     CQ.say('Chúa Giê-su','Đứa trẻ chẳng phải chết, song nó ngủ.','Mác 5:39',null,()=>
     CQ.say('Người kể chuyện','Người ta khóc lóc lắm. Chúa Giê-su cho mọi người ra ngoài, chỉ đem cha mẹ em bé và Phi-e-rơ, Gia-cơ, Giăng vào chỗ em nằm.','Theo Mác 5:37-40',null,()=>{CQ.setCine(null);
      CQ.goZone('B',RX+1.2,RZ+2.3,0,toRoom);n();}));}},
   {at:'girl',text:'Đứng gần giường em bé',run:n=>{CQ.setCine([RX+2.2,6.8,RZ+3.4,RX-.3,.5,RZ-1.9]);CQ.face(jesus,girl.x-.6,girl.z);jesus.raise=.2;
     const rise=()=>{jesus.raise=0;girl.g.rotation.z=0;girl.dy=0;CQ.place(girl,RX+.6,RZ-1.6,3.14);gI.noTurn=0;gI.h=1.6;
       CQ.walkTo(girl,mom.x+.5,mom.z-.6,1.2,()=>CQ.face(girl,mom.x,mom.z));
       CQ.say('Người kể chuyện','Tức thì em bé đứng dậy mà đi, vì em đã lên mười hai tuổi. Cha mẹ em mừng lắm. Chúa Giê-su dặn hãy cho em ăn.','Theo Mác 5:42-43',null,()=>{CQ.setCine(null);n();});};
     CQ.say('Người kể chuyện','Chúa Giê-su nắm tay em bé và phán: "Ta-li-tha Cu-mi".','Mác 5:41',null,()=>
     CQ.order({name:'Chúa Giê-su',q:'"Ta-li-tha Cu-mi" nghĩa là gì? Ghép lại cho đúng.',chunks:['Hỡi con gái nhỏ,','ta truyền cho mầy,','hãy chờ dậy.'],ref:'Mác 5:41'},rise));}},
   {at:'bread',text:'Lấy ổ bánh trên bàn',run:n=>{loaf.visible=false;n();}},
   {at:'girl',text:'Đem bánh cho em bé ăn',run:n=>{loaf.visible=true;loaf.position.set(girl.x+.25,F+.75,girl.z+.3);
     CQ.say('Em bé','Cám ơn anh! Chúa Giê-su đã cho em sống lại.',null,null,n);}}];
 }});
