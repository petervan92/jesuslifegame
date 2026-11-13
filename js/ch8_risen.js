/* Chapter 8: the resurrection. Times of day follow the text: the tomb ("lúc rạng đông, trời còn mờ mờ", John 20:1: dawn),
   Emmaus ("trời đã xế chiều hầu tối", Luke 24:29: dusk), the shore ("đến sáng", John 21:4: morning), the ascension (no time given: day). */
'use strict';
CQ.chapters.push({id:'ch8',no:8,title:'Phục sinh',sub:'Mộ trống, Em-ma-út, bữa sáng bên bờ biển, thăng thiên',
 intro:[
  {t:'Ngày thứ nhứt trong tuần lễ',x:'Ba ngày đã trôi qua. Lúc rạng đông, trời còn mờ mờ, mấy người đàn bà đem thuốc thơm ra mộ. Ê-li xin đi theo.',ref:'Theo Lu-ca 24:1 và Giăng 20:1',cam:[-80,9,-82,-95,2,-104]},
  {t:'Hòn đá đã lăn ra',x:'Họ lo không biết ai sẽ lăn hòn đá lớn ở cửa mộ giùm mình. Nhưng khi đến nơi, hòn đá đã lăn ra khỏi cửa mộ rồi.',ref:'Theo Mác 16:3-4',cam:[-91,2.6,-97,-95,1.5,-105]}],
 outro:'Bạn đã đi hết hành trình cùng Ê-li. Hãy kể lại cho bạn bè điều bạn đã thấy và nghe!',outroRef:'Christ Quest · A Life of Miracle',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='dawn';W.menuCam={x:-95,y:3,z:-100,r:36,h:13};
  W.paths=[[[55,-95],[128,-95]]];
  const sh=x=>112+4*Math.sin(x*.05);
  const H=(x,z)=>{const d=z-sh(x);if(d>0&&x<0)return Math.max(-4,-d*.14);return (x<0?1.2*sm(0,9,-d)+.8:2)+.5*noise(x,z)+9*Math.exp(-((x-95)*(x-95)+(z-90)*(z-90))/520);};
  const g1=C('#8fc04a'),g2=C('#aecd58'),sand=C('#dcc48f'),dirt=C('#e0cfa4'),bed=C('#b9a67c');
  CQ.terrain({H,color:(x,z,y,c)=>{const d=z-sh(x);if(d>0&&x<0){c.copy(bed);return;}c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));if(x<0)c.lerp(sand,1-sm(3,10,-d));c.lerp(dirt,(1-sm(1.6,3.6,CQ.distPath(x,z)))*.9);}});
  CQ.sky({fogNear:50,fogFar:190});CQ.water({deep:3.5});
  CQ.scatter(2400,new T.ConeGeometry(.09,.3,4),toon('#5f9e34'),()=>{const x=rr(-170,170),z=rr(-170,170);if(CQ.distPath(x,z)<2.4||(x<0&&z>sh(x)-8))return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(500,new T.SphereGeometry(.11,6,5),toon('#e2402f'),()=>{const x=-95+rr(-30,30),z=-98+rr(-26,26);return[x,H(x,z)+.22,z,rr(.8,1.4)];});
  CQ.scatter(400,new T.SphereGeometry(.1,6,5),toon('#ffffff'),()=>{const x=-95+rr(-30,30),z=-98+rr(-26,26);return[x,H(x,z)+.2,z,rr(.8,1.3)];});

  /* A: the empty tomb in the garden */
  const AX=-95,AZ=-105;const tomb=CQ.rockTomb(AX,AZ,0);tomb.stone.position.x=2.7;tomb.stone.rotation.y=-.5;
  [[-110,-96],[-80,-98],[-112,-112],[-76,-110],[-104,-84],[-84,-84]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.4)));
  const angel=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.angel,{float:.35})),AX+2.6,AZ+3.2,0);angel.light.intensity=.35;
  const w1=CQ.place(CQ.makeChar(Object.assign({jar:1},CQ.CAST.woman)),AX-2,AZ+7,3.14);CQ.place(CQ.makeChar(CQ.CAST.woman2),AX-.4,AZ+8,3.14);CQ.place(CQ.makeChar(CQ.CAST.mary),AX-3.6,AZ+8.2,3.14);

  /* B: the road to Emmaus */
  const cleo=CQ.place(CQ.makeChar(CQ.CAST.man),74,-94,1.57),frd=CQ.place(CQ.makeChar(CQ.CAST.man2),74.4,-96.2,1.57);
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),72,-95,1.57);jesus.g.visible=false;
  CQ.house(121,-103,8,7,3.4,0,{stone:'lime',awning:-1,roofJars:1});CQ.house(131,-90,6,6,3,3.3,{stone:'lime'});
  const tb=new T.Group();tb.position.set(117,H(117,-96.5),-96.5);W.scene.add(tb);mesh(new T.BoxGeometry(2.2,.34,1.2),M.wood,0,.3,0,tb);const loaf=mesh(new T.SphereGeometry(.24,10,8),toon('#d9a25a'),0,.58,0,tb);loaf.scale.y=.5;W.circles.push({x:117,z:-96.5,r:1.1});
  [[70,-102],[88,-88],[100,-103],[110,-88]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));

  /* C: breakfast on the shore */
  const SX=-95,SZ=sh(-95);CQ.campfire(SX-4,SZ-5);const boatG=CQ.boat(SX+5,SZ+12,.3,{float:1,far:1});
  const peter=CQ.place(CQ.makeChar(CQ.CAST.peter),SX+5,SZ+12,3.4);peter.minY=.6;
  CQ.crowd([[SX+3.6,SZ+12.3],[SX+6.6,SZ+11.7]],{noCol:1});
  const fish=[];for(let i=0;i<26;i++){const f=mesh(new T.SphereGeometry(.2,8,6),toon('#b9c9d6'),SX+1+rr(-1.2,1.2),H(SX+1,SZ-3)+.12+rr(0,.25),SZ-3+rr(-1,1));f.scale.set(1.6,.35,.6);f.rotation.y=R()*6;f.visible=false;fish.push(f);}
  [[SX-16,SZ-12],[SX+14,SZ-14],[SX-22,SZ-4]].forEach(p=>CQ.palm(p[0],p[1],rr(1,1.2)));

  /* D: the mount of the ascension */
  const MX=95,MZ=90;CQ.crowd(CQ.ring(MX,MZ,11,3.2,5.5,.2,2.9));
  const cloud=new T.Group();cloud.position.set(MX,H(MX,MZ)+16,MZ);cloud.visible=false;W.scene.add(cloud);for(let i=0;i<6;i++){const m=new T.Mesh(new T.SphereGeometry(rr(2.2,3.4),10,8),new T.MeshBasicMaterial({color:'#ffffff',fog:false}));m.position.set(rr(-4,4),rr(-.6,.6),rr(-2,2));m.scale.y=.6;cloud.add(m);}
  let rise=false;W.tick.push(dt=>{if(rise){jesus.dy=(jesus.dy||0)+dt*1.6;if(jesus.dy>15)jesus.g.visible=false;}});

  CQ.zones({A:{c:[AX,AZ+8],r:20,tod:'dawn'},B:{c:[96,-95],r:36,tod:'dusk'},C:{c:[SX,SZ-12],r:22,tod:'morning'},D:{c:[MX,MZ+5],r:16,tod:'day'}});
  CQ.addInter({id:'angel',P:angel,name:'thiên sứ',verb:'Lại gần ',h:2.5,r:3.4});
  CQ.addInter({id:'cleo',P:cleo,name:'Cơ-lê-ô-ba',h:2.05});
  CQ.addInter({id:'table',obj:tb,x:117,z:-96.5,name:'bàn ăn',verb:'Lại gần ',h:1.8,r:3});
  CQ.addInter({id:'boat',obj:boatG,x:SX+5,z:SZ+12,name:'chiếc thuyền',verb:'Gọi ',h:6,remote:1});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:3});
  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',AX+3,AZ+15,0,null,true);

  W.steps=[
   {at:'angel',text:'Mộ trống không! Lại gần xem ai đang ở đó',run:n=>{CQ.setCine([AX+7,2.8,AZ+9,AX+1,1.6,AZ+1]);
     CQ.say('Người kể chuyện','Họ bước vào, không thấy xác Chúa Giê-su đâu cả. Đương khi còn bối rối, có thiên sứ mặc áo sáng như chớp hiện ra.','Theo Lu-ca 24:3-4',null,()=>
     CQ.fillWord({name:'Thiên sứ',before:'Sao các ngươi tìm người sống trong vòng kẻ chết? Ngài không ở đây đâu, song Ngài đã',after:'.',options:['đi xa','sống lại','ngủ yên'],answer:'sống lại',ref:'Lu-ca 24:5-6 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Đây là tin vui lớn nhất!'},()=>
     CQ.choice({name:'Người kể chuyện',q:'Ai là người đầu tiên được gặp Chúa Giê-su sau khi Ngài sống lại?',options:['Ma-ri Ma-đơ-len','Quan Phi-lát','Một người lính canh'],ref:'Mác 16:9',wrong:'Chưa đúng. Đó là một người đàn bà đã đứng khóc bên mộ.'},()=>{CQ.setCine(null);CQ.goZone('B',68,-93,-1.57,()=>{jesus.g.visible=true;});n();})));}},
   {at:'cleo',text:'Chiều hôm ấy, trên đường về làng Em-ma-út. Hỏi chuyện hai môn đồ',run:n=>CQ.say('Cơ-lê-ô-ba','Chúng tôi trông mong Chúa Giê-su sẽ cứu dân Y-sơ-ra-ên, vậy mà Ngài đã bị đóng đinh. Có người lạ này cùng đi, đang cắt nghĩa Kinh Thánh cho chúng tôi nghe.','Theo Lu-ca 24:15-27','Cùng đi',()=>{CQ.walkTo(cleo,114.6,-95.2,3.4);CQ.walkTo(frd,115,-98,3.4);CQ.walkTo(jesus,117,-98.4,3.5,()=>CQ.face(jesus,117,-90));n();})},
   {at:'table',text:'Trời đã xế chiều. Theo họ vào làng, đến bên bàn ăn',run:n=>{CQ.setCine([117,3.2,-90.5,117,1.2,-97.5]);
     const burn=()=>CQ.order({name:'Hai môn đồ',q:'Hai người nói với nhau. Ghép lại lời họ.',chunks:['lòng chúng ta','há chẳng','nóng nảy sao?'],ref:'Lu-ca 24:32 (Bản Truyền Thống 1925)'},()=>{CQ.setCine(null);CQ.goZone('C',SX+2,SZ-10,3.14,()=>{jesus.g.visible=true;CQ.place(jesus,SX-2,SZ-4,0);});n();});
     CQ.say('Người kể chuyện','Đang khi ngồi ăn, người lạ cầm lấy bánh, chúc tạ, đoạn bẻ ra cho họ.','Theo Lu-ca 24:30',null,()=>
     CQ.choice({name:'Người kể chuyện',q:'Mắt hai môn đồ mở ra. Họ nhận biết người lạ ấy là Chúa Giê-su vào lúc nào?',options:['Lúc Ngài bẻ bánh','Lúc Ngài chào họ trên đường','Lúc trời sáng'],ref:'Lu-ca 24:30-31',wrong:'Chưa đúng. Hãy nhớ lại việc Ngài vừa làm ở bàn ăn.'},()=>{jesus.g.visible=false;loaf.scale.set(1.4,.3,1);burn();}));}},
   {at:'boat',text:'Biển Ga-li-lê, đến sáng. Các môn đồ đánh cá suốt đêm chẳng được gì',run:n=>{CQ.setCine([SX-9,3.4,SZ-9,SX+4,.8,SZ+9]);
     CQ.fillWord({name:'Chúa Giê-su',before:'Hãy thả lưới bên',after:' thuyền, thì các ngươi sẽ được.',options:['tả','hữu','dưới'],answer:'hữu',ref:'Giăng 21:6 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. "Hữu" nghĩa là bên phải.'},()=>
     CQ.tapFill({name:'Kéo lưới',text:'Lưới đầy cá, nặng đến nỗi kéo không nổi! Chạm thật nhanh để giúp các môn đồ kéo lưới vào bờ.',need:22,onP:p=>fish.forEach((f,i)=>f.visible=i<p*fish.length)},()=>{peter.minY=null;CQ.place(peter,SX+1.5,SZ-5.5,3.6);
     CQ.say('Người kể chuyện','Lưới đầy một trăm năm mươi ba con cá lớn mà không rách. Phi-e-rơ nhảy xuống nước, lội vào bờ trước tiên.','Theo Giăng 21:7-11',null,()=>{CQ.setCine(null);n();});}));}},
   {at:'jesus',text:'Thầy đã nhóm sẵn lửa than. Lại ăn sáng với Thầy',run:n=>CQ.say('Người kể chuyện','Ăn xong, Chúa Giê-su hỏi Phi-e-rơ ba lần: Ngươi yêu ta chăng? Ba lần Phi-e-rơ thưa: Lạy Chúa, Chúa biết rằng tôi yêu Chúa.','Theo Giăng 21:15-17',null,()=>
     CQ.fillWord({name:'Chúa Giê-su',before:'Hãy chăn',after:' ta.',options:['chiên','cá','ngựa'],answer:'chiên',ref:'Theo Giăng 21:17',wrong:'Chưa đúng. Chúa ví những người theo Ngài như một bầy gì?'},()=>{CQ.goZone('D',MX+1,MZ+12,0,()=>{CQ.place(jesus,MX,MZ,0);CQ.place(peter,MX+2.6,MZ+3.4,3.4);});n();}))},
   {at:'jesus',text:'Bốn mươi ngày sau, trên núi. Lại nghe lời Thầy dặn',run:n=>{CQ.setCine([MX+2,H(MX,MZ)+2.6,MZ+10,MX,H(MX,MZ)+2,MZ]);
     CQ.say('Chúa Giê-su','Vậy, hãy đi dạy dỗ muôn dân.','Theo Ma-thi-ơ 28:19',null,()=>
     CQ.order({name:'Chúa Giê-su',chunks:['Nầy, ta thường ở','cùng các ngươi luôn','cho đến tận thế.'],ref:'Ma-thi-ơ 28:20 (Bản Truyền Thống 1925)'},()=>{rise=true;jI.hidden=true;CQ.marks();cloud.visible=true;CQ.setCine([MX+3,H(MX,MZ)+2.2,MZ+13,MX,H(MX,MZ)+9,MZ]);
     CQ.say('Người kể chuyện','Ngài được cất lên trong lúc các môn đồ đang nhìn xem, có một đám mây tiếp Ngài khuất đi, không thấy nữa.','Theo Công vụ 1:9','Xong',()=>{CQ.setCine(null);n();});}));}}];
 }});
