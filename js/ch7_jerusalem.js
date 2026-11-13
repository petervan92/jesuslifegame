/* Chapter 7: Jerusalem. Times of day follow the text: the entry (no time given: day), the last supper
   ("đến tối", Mt 26:20: night), Gethsemane (the same night), Golgotha ("từ giờ thứ sáu đến giờ thứ chín,
   khắp cả xứ đều tối tăm mù mịt", Mt 27:45: dark sky). The crucifixion is told from a distance, without violence. */
'use strict';
CQ.chapters.push({id:'ch7',no:7,title:'Giê-ru-sa-lem',sub:'Vào thành, tiệc ly, Ghết-sê-ma-nê, thập tự giá',
 intro:[
  {t:'Lễ Vượt Qua',x:'Gần đến lễ Vượt Qua, dân chúng từ khắp nơi kéo về thành Giê-ru-sa-lem. Nghe tin Chúa Giê-su sắp đến, họ ra đón Ngài.',ref:'Theo Giăng 12:12',cam:[-118,16,-74,-84,4,-95]},
  {t:'Vua cỡi lừa',x:'Chúa Giê-su không cỡi ngựa chiến như các vua. Ngài cỡi một con lừa con, đúng như lời đấng tiên tri đã nói từ xưa: Vua ngươi đến cùng ngươi, nhu mì, cỡi lừa.',ref:'Theo Ma-thi-ơ 21:4-5',cam:[-104,3,-90,-116,2.4,-95]}],
 outro:'Giô-sép người A-ri-ma-thê lấy vải liệm bọc xác Ngài, đặt trong một cái mộ mới đục trong hòn đá. Ai nấy buồn bã trở về. Nhưng câu chuyện chưa kết thúc ở đây.',outroRef:'Theo Ma-thi-ơ 27:57-60',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,boxUV,M}=CQ;
  W.tod='day';W.menuCam={x:-92,y:3,z:-95,r:40,h:15};
  W.paths=[[[-150,-95],[-70,-95]]];
  const H=(x,z)=>2+.5*noise(x,z)+8*Math.exp(-((x-114)*(x-114)+(z-82)*(z-82))/420);
  const g1=C('#a9c05c'),g2=C('#c2c872'),dirt=C('#e0cfa4'),rock=C('#b9a67e');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(rock,sm(4,9,y)*.8);c.lerp(dirt,(1-sm(2.2,4.4,CQ.distPath(x,z)))*.9);}});
  CQ.sky({fogNear:50,fogFar:190});
  CQ.scatter(2200,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-170,170),z=rr(-170,170);if(CQ.distPath(x,z)<3||H(x,z)>5)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});

  /* A: the city gate */
  const AX=-95,AZ=-95,WX=-78;
  CQ.wallBox(WX,AZ-24,2.4,8,40,0,M.lime);CQ.wallBox(WX,AZ+24,2.4,8,40,0,M.lime);mesh(boxUV(2.6,2.6,8.4,2.6),M.lime,WX,H(WX,AZ)+7.2,AZ);
  for(const dz of[-5.4,5.4])mesh(boxUV(4,11,4,2.6),M.lime,WX,H(WX,AZ)+4,AZ+dz);
  for(let i=0;i<9;i++)CQ.house(-66-rr(0,22),-128+i*8,6,6,rr(3,4.4),rr(-.2,.2),{stone:'lime',stair:false});
  [[-118,-101],[-104,-89],[-92,-101.5],[-110,-88.5],[-128,-89],[-86,-88]].forEach(p=>CQ.palm(p[0],p[1],rr(1,1.3)));
  const cp=[];for(let x=-134;x<-83;x+=1.3){cp.push([x+rr(-.3,.3),AZ+4+rr(0,1.4),3.14]);cp.push([x+rr(-.3,.3),AZ-4-rr(0,1.4),0]);}CQ.crowd(cp);
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),-134,AZ,1.57);jesus.dy=.62;
  const dk=new T.Group();W.scene.add(dk);const dm=toon('#8f8a80');
  mesh(new T.SphereGeometry(.45,12,10),dm,0,.85,0,dk).scale.set(1,.85,1.6);mesh(new T.SphereGeometry(.26,10,8),dm,0,1.25,.85,dk).scale.set(.8,.9,1.4);
  for(const s of[-1,1]){mesh(new T.ConeGeometry(.07,.42,6),dm,s*.13,1.62,.72,dk);for(const lz of[-.42,.42])mesh(new T.CylinderGeometry(.07,.06,.6,6),toon('#6f6a62'),s*.22,.3,lz,dk);}
  mesh(new T.BoxGeometry(.8,.06,.7),toon('#b5483a'),0,1.24,-.05,dk);
  W.tick.push(()=>{dk.visible=jesus.dy>.5;dk.position.set(jesus.x,W.H(jesus.x,jesus.z),jesus.z);dk.rotation.y=jesus.g.rotation.y;});
  const fm=toon('#4f9b3c',{side:T.DoubleSide});
  const branch=(x,z,i)=>{const g=new T.Group();g.position.set(x,H(x,z)+.15,z);g.rotation.y=R()*6;W.scene.add(g);const fg=new T.PlaneGeometry(.7,2.4,2,5);fg.rotateX(-Math.PI/2);mesh(fg,fm,0,0,0,g);mesh(new T.CylinderGeometry(.03,.03,2.4,5),toon('#3f7f30'),0,.02,0,g).rotation.x=Math.PI/2;
    CQ.addInter({id:'p'+i,obj:g,x,z,name:'nhành chà là',verb:'Nhặt ',h:1.4,r:1.8,g});};
  [[-116,-103.5],[-102,-86.5],[-91,-104],[-108,-86]].forEach((p,i)=>branch(p[0],p[1],i));

  /* B: the upper room */
  const BX=95,BZ=-95,FL=5;W.platforms.push({x0:BX-7,x1:BX+7,z0:BZ-5,z1:BZ+5,top:FL});
  mesh(boxUV(14,FL+2,10,2.6),M.lime,BX,(FL-2)/2,BZ);mesh(new T.BoxGeometry(14,.1,10),toon('#c9a877'),BX,FL+.02,BZ,null,false);
  mesh(boxUV(14,3,.5,2.6),M.lime,BX,FL+1.5,BZ-5.2);for(const s of[-1,1])mesh(boxUV(.5,3,10,2.6),M.lime,BX+s*7.2,FL+1.5,BZ);mesh(boxUV(14,.7,.4,2.6),M.lime,BX,FL+.35,BZ+5.1);
  mesh(new T.BoxGeometry(7,.36,1.5),M.wood,BX,FL+.22,BZ-1.6);W.obstacles.push({x:BX,z:BZ-1.6,w:7,d:1.5,rot:0,ox:0});
  for(let i=0;i<5;i++){mesh(new T.SphereGeometry(.2,8,6),toon('#d9a25a'),BX-2.4+i*1.2,FL+.48,BZ-1.6+rr(-.3,.3)).scale.y=.5;}
  mesh(new T.CylinderGeometry(.13,.09,.26,10),M.clay,BX+.5,FL+.53,BZ-1.5);
  for(const s of[-1,1]){const L=new T.PointLight('#ffc878',1.3,16,1.5);L.position.set(BX+s*4.5,FL+2.3,BZ-2);W.scene.add(L);mesh(new T.SphereGeometry(.12,8,6),new T.MeshBasicMaterial({color:'#ffd98a'}),BX+s*6.6,FL+2.2,BZ-3,null,false);}
  const sp=[];for(let i=0;i<5;i++){sp.push([BX-3.4+i*1.1+(i>2?1.2:0),BZ-3,0]);sp.push([BX-3+i*1.5,BZ-.2,3.14]);}sp.push([BX-4.2,BZ-1.6,1.57],[BX+4.2,BZ-1.6,-1.57]);CQ.crowd(sp,{sit:1});

  /* C: Gethsemane */
  const GX=-95,GZ=95;for(let i=0;i<16;i++){const a=i/16*6.283,r=rr(9,24);CQ.olive(GX+Math.cos(a)*r,GZ+Math.sin(a)*r,rr(1,1.5));}
  mesh(new T.DodecahedronGeometry(1.2,0),toon('#9a917e'),GX-.2,H(GX,GZ-1.6)+.5,GZ-1.6).scale.y=.7;W.circles.push({x:GX-.2,z:GZ-1.6,r:1.2});
  const peter=CQ.makeChar(CQ.CAST.peter),jn=CQ.makeChar(CQ.CAST.man2),jm=CQ.makeChar(CQ.CAST.man);
  [[peter,GX+6,GZ+5],[jn,GX+7.6,GZ+6.2],[jm,GX+5.2,GZ+7]].forEach((a,i)=>{CQ.place(a[0],a[1],a[2],i);a[0].g.rotation.z=1.45;a[0].dy=.25;});
  const lampL=new T.PointLight('#ffd08a',.9,14,1.5);lampL.position.set(GX+5,H(GX,GZ)+1.6,GZ+4);W.scene.add(lampL);

  /* D: Golgotha, seen from afar */
  const DX=92,DZ=104,HX=114,HZ=82,hy=H(HX,HZ);
  [[-3.4,.4,4.2],[0,0,5.2],[3.4,.5,4.2]].forEach(c=>{mesh(new T.BoxGeometry(.3,c[2],.3),M.woodD,HX+c[0],hy+c[2]/2-.2,HZ+c[1]);mesh(new T.BoxGeometry(2.2,.28,.28),M.woodD,HX+c[0],hy+c[2]-1.1,HZ+c[1]);});
  const mary=CQ.place(CQ.makeChar(CQ.CAST.mary),DX+1.5,DZ-2.5,2.4);CQ.place(CQ.makeChar(CQ.CAST.woman),DX+3.2,DZ-1.4,2.4);CQ.place(CQ.makeChar(CQ.CAST.woman2),DX-.4,DZ-3.6,2.4);

  CQ.zones({A:{c:[-106,AZ],r:30,tod:'day'},B:{c:[BX,BZ],rect:[6.5,4.6],tod:'night'},C:{c:[GX,GZ],r:22,tod:'night'},D:{c:[DX,DZ],r:9,tod:'storm'}});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:3,noTurn:1});
  CQ.addInter({id:'mary',P:mary,name:'bà Ma-ri',h:2.05});
  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',-100,-92,1.57,null,true);CQ.walkTo(jesus,-88,AZ,1.1);

  const toRoom=()=>{jesus.dest=null;jesus.dy=0;CQ.place(jesus,BX,BZ-3.2,0);};
  const toGarden=()=>{CQ.place(jesus,GX,GZ,3.14);jesus.dy=-.32;jesus.g.rotation.x=-.4;};
  const toHill=()=>{jesus.g.visible=false;jI.hidden=true;};
  W.steps=[
   {collect:['p0','p1','p2','p3'],text:'Nhặt nhành chà là để đón Thầy vào thành',each:I=>{I.g.visible=false;I.hidden=true;},
    run:n=>CQ.order({name:'Đoàn dân',q:'Dân chúng trải áo và nhành cây trên đường, vừa đi vừa reo lên. Ghép lại lời họ reo.',chunks:['Hô-sa-na','con vua Đa-vít!','Đáng khen ngợi cho Đấng','nhân danh Chúa mà đến!'],ref:'Theo Ma-thi-ơ 21:9'},()=>{CQ.goZone('B',BX+3,BZ+3.4,0,toRoom);n();})},
   {at:'jesus',text:'Đến tối, Thầy ngồi ăn với mười hai môn đồ. Lại gần bàn',run:n=>{CQ.setCine([BX+1.5,FL+3.2,BZ+5.5,BX,FL+.8,BZ-2.6]);
     const love=()=>CQ.order({name:'Chúa Giê-su',q:'Thầy còn cho các môn đồ một điều răn mới. Ghép lại lời ấy.',chunks:['Ta ban cho các ngươi','một điều răn mới,','nghĩa là các ngươi','phải yêu nhau'],ref:'Giăng 13:34 (Bản Truyền Thống 1925)'},()=>{CQ.setCine(null);CQ.goZone('C',GX+4,GZ+9,.4,toGarden);n();});
     CQ.say('Người kể chuyện','Chúa Giê-su cầm lấy bánh, tạ ơn xong, bẻ ra phân phát cho các môn đồ.','Theo Lu-ca 22:19',null,()=>
     CQ.fillWord({name:'Chúa Giê-su',before:'Nầy là',after:' ta, đã vì các ngươi mà phó cho; hãy làm sự nầy để nhớ đến ta.',options:['áo choàng','thân thể','ngôi nhà'],answer:'thân thể',ref:'Lu-ca 22:19 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Tấm bánh bẻ ra nói về chính Ngài.'},love));}},
   {at:'jesus',text:'Trong vườn Ghết-sê-ma-nê, Thầy đang cầu nguyện',run:n=>{CQ.setCine([GX+5,2.6,GZ+5.5,GX,1.2,GZ-.5]);
     const taken=()=>CQ.say('Người kể chuyện','Rồi một toán người cầm gươm và gậy kéo đến bắt Chúa Giê-su. Các môn đồ đều bỏ Ngài mà trốn đi. Ngài không chống cự.','Theo Ma-thi-ơ 26:47-56',null,()=>{CQ.setCine(null);CQ.goZone('D',DX-2,DZ+4,-.75,toHill);n();});
     const watch=()=>CQ.balance({name:'Thức canh',text:'Thầy bảo các môn đồ: Hãy thức canh và cầu nguyện. Nhưng họ buồn ngủ quá. Giữ chấm tròn trong vùng xanh để ngọn đèn không tắt!',secs:6,onP:p=>{lampL.intensity=.5+p*1.2;}},taken);
     CQ.say('Người kể chuyện','Chúa Giê-su buồn bực lắm. Ngài đi xa các môn đồ một chút, sấp mặt xuống đất mà cầu nguyện.','Theo Ma-thi-ơ 26:37-39',null,()=>
     CQ.fillWord({name:'Chúa Giê-su',before:'Cha ơi! nếu có thể được, xin cho chén nầy lìa khỏi Con! Song không theo ý muốn',after:', mà theo ý muốn Cha.',options:['Cha','Con','người'],answer:'Con',ref:'Ma-thi-ơ 26:39 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Ngài chọn vâng theo ý Cha, chứ không theo ý riêng.'},watch));}},
   {at:'mary',text:'Đồi Gô-gô-tha. Lại đứng với bà Ma-ri',run:n=>{CQ.setCine([DX-5,4.2,DZ+7,HX,hy+3,HZ]);
     const love=()=>CQ.order({name:'Vì sao Chúa chịu chết?',q:'Kinh Thánh trả lời bằng một câu rất nổi tiếng. Ghép lại phần đầu câu ấy.',chunks:['Vì Đức Chúa Trời','yêu thương thế gian,','đến nỗi đã ban','Con một của Ngài'],ref:'Giăng 3:16 (Bản Truyền Thống 1925)'},()=>{CQ.setCine(null);n();});
     const done=()=>CQ.say('Chúa Giê-su','Mọi việc đã được trọn.','Giăng 19:30 (Bản Truyền Thống 1925)',null,love);
     CQ.say('Người kể chuyện','Họ đóng đinh Chúa Giê-su trên cây thập tự, giữa hai tên trộm cướp. Từ giờ thứ sáu đến giờ thứ chín, khắp cả xứ đều tối tăm mù mịt.','Theo Ma-thi-ơ 27:35-45',null,()=>
     CQ.fillWord({name:'Chúa Giê-su',before:'Lạy Cha, xin',after:' cho họ, vì họ không biết mình làm điều gì.',options:['phạt','tha','quên'],answer:'tha',ref:'Lu-ca 23:34 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Ngay lúc đau đớn nhất, Ngài vẫn yêu thương họ.'},done));}}];
 }});
