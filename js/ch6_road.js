/* Chapter 6: on the road to Jerusalem. Jericho (Luke 19), the lost sheep (Luke 15), Bethany (John 11).
   None of these passages names a time of day, so all three scenes are set in daylight. */
'use strict';
CQ.chapters.push({id:'ch6',no:6,title:'Đường lên Giê-ru-sa-lem',sub:'Xa-chê, con chiên lạc, La-xa-rơ · ban ngày',
 intro:[
  {t:'Thành Giê-ri-cô',x:'Chúa Giê-su đi qua thành Giê-ri-cô, thành của những cây chà là. Ở đó có một người tên Xa-chê, làm đầu bọn thâu thuế và giàu có. Ai cũng ghét ông, vì ông thâu thuế cho người La Mã.',ref:'Theo Lu-ca 19:1-2',cam:[-70,16,-70,-97,3,-95]},
  {t:'Một người thấp bé',x:'Xa-chê muốn xem Chúa Giê-su là ai, nhưng ông thấp quá, mà dân chúng thì đông. Ông bèn chạy trước và trèo lên một cây sung.',ref:'Theo Lu-ca 19:3-4',cam:[-90,4,-88,-97,4.5,-95]}],
 outro:'La-xa-rơ sống lại. Nhiều người thấy việc Chúa Giê-su làm thì tin Ngài.',outroRef:'Theo Giăng 11:44-45',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.menuCam={x:-96,y:3,z:-95,r:40,h:15};
  const H=(x,z)=>{let y=2+.5*noise(x,z);const hb=Math.hypot(x-100,z+100);y+=sm(8,40,hb)*sm(75,45,hb)*(5+4*noise(x*1.6,z*1.6))+9*Math.exp(-((x-126)*(x-126)+(z+122)*(z+122))/260);return y;};
  const g1=C('#9fbf57'),g2=C('#b9c96a'),dry=C('#d9c391'),dirt=C('#e0cfa4');
  W.paths=[[[-140,-95],[-60,-95]],[[-25,95],[25,95]]];
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(dry,sm(-40,-140,x+z*.2)*.5+.25);c.lerp(dirt,(1-sm(1.6,3.6,CQ.distPath(x,z)))*.9);}});
  CQ.sky({fogNear:50,fogFar:190});
  CQ.scatter(2400,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-170,170),z=rr(-170,170);if(CQ.distPath(x,z)<2.4)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(120,new T.DodecahedronGeometry(.6,0),toon('#a89878'),()=>{const x=100+rr(-60,60),z=-100+rr(-60,60);return[x,H(x,z)+.1,z,rr(.4,1.8),rr(.5,.8)];},true);

  /* Jericho */
  const AX=-97,AZ=-95;
  [[-112,-104,7,6,3.2,0],[-102,-105,6,6,3,.05],[-88,-104,7,6,3.2,-.05],[-78,-105,6,5,2.9,.1],[-110,-86,6,6,3,3.14],[-84,-86,7,6,3.2,3.14],[-74,-86,6,5,2.8,3.1],[-122,-86,6,5,2.9,3.2]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,awning:i===1?1.2:0,roofJars:i%3===0}));
  [[-118,-98],[-92,-99.5],[-70,-98],[-104,-90.5],[-78,-91],[-126,-92],[-64,-90]].forEach(p=>CQ.palm(p[0],p[1],rr(1,1.3)));
  const fig=new T.Group();fig.position.set(AX,H(AX,AZ+3.4),AZ+3.4);W.scene.add(fig);
  mesh(new T.CylinderGeometry(.34,.5,3,8),toon('#7a6248'),0,1.5,0,fig);mesh(new T.CylinderGeometry(.2,.28,2.6,7),toon('#7a6248'),1.1,3.2,0,fig).rotation.z=-1.05;mesh(new T.CylinderGeometry(.18,.26,2.2,7),toon('#7a6248'),-.9,3.5,.2,fig).rotation.z=.9;
  [[0,5.3,0,2.4],[2.2,4.6,.3,1.7],[-2.1,4.8,-.2,1.8],[.3,4.6,1.8,1.6],[-.2,4.7,-1.8,1.6]].forEach((b,i)=>mesh(new T.IcosahedronGeometry(b[3],1),toon(['#5f9a48','#74ad58','#4f8a3e'][i%3]),b[0],b[1],b[2],fig).scale.y=.7);
  W.circles.push({x:AX,z:AZ+3.4,r:.8});
  const zach=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#6f4f8a',mantle:'#d9a441',sash:'#e9dcc0',hair:'#2e2018',beard:1,S:.8}),AX+1.2,AZ+3.4,2.9);zach.dy=3;
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),-128,AZ,1.57),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),-131,AZ+1.2,1.57);
  const pts=[];for(let x=-124;x<-66;x+=1.4){if(Math.abs(x-AX)>2.5)pts.push([x+rr(-.3,.3),AZ+3.2+rr(0,1.2),3.14]);pts.push([x+rr(-.3,.3),AZ-3.2-rr(0,1.2),0]);}CQ.crowd(pts);

  /* the hills of the lost sheep */
  const BX=96,BZ=-96;for(let i=0;i<16;i++)CQ.sheep(BX+8+rr(-6,6),BZ+6+rr(-5,5));
  CQ.crowd(CQ.ring(BX,BZ,14,3.5,7,.2,2.6),{sit:1});
  const lost=CQ.sheep(127,-124);[[122,-118],[130,-119],[124,-128],[132,-126]].forEach(p=>CQ.bush(p[0],p[1],1.4));
  const shep=CQ.place(CQ.makeChar(CQ.CAST.elder),BX+11,BZ+2,-1);

  /* Bethany: the tomb of Lazarus */
  const CX=0,CZ=95;const tomb=CQ.rockTomb(CX,CZ-10,0);
  const martha=CQ.place(CQ.makeChar(CQ.CAST.woman2),CX-4,CZ-2,0),mary=CQ.place(CQ.makeChar(CQ.CAST.mary),CX-5.6,CZ-4,.4);
  CQ.crowd(CQ.ring(CX,CZ-6,11,8,13,2.5,3.6));CQ.crowd(CQ.ring(CX,CZ-6,11,8,13,-.5,.6));[[-16,84],[15,86],[-20,100],[19,102]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));
  const laz=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#f4f0e4',veil:'#f4f0e4',S:1}),CX,CZ-11.2,0);laz.g.visible=false;

  CQ.zones({A:{c:[AX,AZ],r:34,tod:'day'},B:{c:[110,-108],r:40,tod:'day'},C:{c:[CX,CZ-2],r:22,tod:'day'}});
  const zI=CQ.addInter({id:'zach',P:zach,name:'người trên cây sung',verb:'Nhìn lên ',h:2.1,r:3.4});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:3});
  const lI=CQ.addInter({id:'lost',obj:lost.g,x:127,z:-124,name:'con chiên lạc',verb:'Bế ',h:1.5,r:2.2,hidden:true});
  CQ.addInter({id:'martha',P:martha,name:'Ma-thê',h:2.05});
  CQ.addInter({id:'stone',obj:tomb.stone,x:CX,z:CZ-8.4,name:'hòn đá',verb:'Lại gần ',h:3,r:3.2});
  let seek=false;W.tick.push(()=>{if(seek){const h=Math.hypot(W.player.x-127,W.player.z+124)>17;if(h!==lI.hidden){lI.hidden=h;CQ.marks();}}});

  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',AX+10,AZ,1.57,null,true);
  W.steps=[
   {at:'zach',text:'Tìm người đang trốn trên cây sung',run:n=>{CQ.setCine([AX+6.5,6,AZ-2.2,AX-.2,4.6,AZ+3.4]);CQ.walkTo(jesus,AX-1.5,AZ,3.6,()=>CQ.face(jesus,AX+1.2,AZ+3.4));CQ.walkTo(peter,AX-4.5,AZ-1,3.4);
     const leave=()=>{CQ.setCine(null);CQ.goZone('B',BX-9,BZ+8,-2.2,()=>{jesus.dest=null;CQ.place(jesus,BX,BZ,.9);CQ.place(peter,BX-2.4,BZ-1,.9);});n();};
     const save=()=>CQ.say('Chúa Giê-su','Bởi Con người đã đến tìm và cứu kẻ bị mất.','Lu-ca 19:10 (Bản Truyền Thống 1925)',null,leave);
     const vow=()=>{zach.dy=0;CQ.place(zach,AX+.6,AZ+1.4,3.14);zI.h=2.05;
       CQ.choice({name:'Xa-chê',q:'Xa-chê mừng rỡ tiếp rước Chúa. Ông hứa chia nửa gia tài cho kẻ nghèo. Còn ai bị ông làm thiệt hại, ông sẽ đền lại gấp mấy?',options:['Gấp tư','Gấp đôi','Không đền gì'],ref:'Lu-ca 19:8',wrong:'Chưa đúng. Xa-chê đền lại nhiều hơn thế.'},save);};
     const call=()=>CQ.fillWord({name:'Chúa Giê-su',before:'Hỡi Xa-chê, hãy xuống cho mau, vì hôm nay ta phải ở',after:' ngươi.',options:['thành','nhà','thuyền'],answer:'nhà',ref:'Lu-ca 19:5 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Chúa muốn đến thăm nơi Xa-chê ở.'},vow);
     CQ.say('Người kể chuyện','Chúa Giê-su đi đến chỗ ấy, ngước mắt lên và nhìn thấy Xa-chê.','Theo Lu-ca 19:5',null,call);}},
   {at:'jesus',text:'Lại nghe Thầy kể một câu chuyện',run:n=>CQ.say('Chúa Giê-su','Trong các ngươi ai là người có một trăm con chiên, nếu mất một con, há chẳng để chín mươi chín con nơi đồng vắng, đặng đi tìm con đã mất cho kỳ được sao?','Theo Lu-ca 15:4','Tôi sẽ đi tìm!',()=>{seek=true;n();})},
   {at:'lost',text:'Hãy làm người chăn: đi tìm con chiên lạc trên đồi đá',run:n=>{seek=false;lost.g.position.y+=.9;
     CQ.order({name:'Người chăn chiên',q:'Tìm được rồi! Người chăn vác chiên lên vai, về nhà gọi bạn hữu đến. Ghép lại lời người ấy nói.',chunks:['Hãy chung vui với ta,','vì ta đã tìm được','con chiên bị mất.'],ref:'Lu-ca 15:6 (Bản Truyền Thống 1925)'},()=>
     CQ.say('Chúa Giê-su','Trên trời cũng vậy: sẽ vui mừng cho một kẻ có tội ăn năn hơn là chín mươi chín kẻ công bình không cần phải ăn năn.','Theo Lu-ca 15:7',null,()=>{CQ.goZone('C',CX+5,CZ+8,.4,()=>{CQ.place(jesus,CX-1.5,CZ-3,3.14);CQ.place(peter,CX+3,CZ-1,3.14);jI.hidden=true;});n();}));}},
   {at:'martha',text:'Làng Bê-tha-ni đang than khóc. Hỏi chuyện Ma-thê',run:n=>CQ.say('Ma-thê','Lạy Chúa, nếu Chúa có đây, thì anh tôi không chết. La-xa-rơ đã nằm trong mộ bốn ngày rồi.','Theo Giăng 11:17-21',null,()=>
     CQ.fillWord({name:'Chúa Giê-su',before:'Ta là sự sống lại và sự',after:'; kẻ nào tin ta thì sẽ sống, mặc dầu đã chết rồi.',options:['sáng','sống','thật'],answer:'sống',ref:'Giăng 11:25 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Hãy đọc tiếp nửa sau của câu.'},()=>
     CQ.say('Người kể chuyện','Thấy Ma-ri và mọi người khóc, Chúa Giê-su đau lòng cảm động. Ngài khóc.','Theo Giăng 11:33-35',null,n)))},
   {at:'stone',text:'Thầy bảo: Hãy lăn hòn đá đi',run:n=>{CQ.setCine([CX+4.5,3.4,CZ+2,CX-.5,1.3,CZ-9]);CQ.face(jesus,CX,CZ-10);
     CQ.tapFill({name:'Lăn hòn đá',text:'Hòn đá chận cửa mộ rất nặng. Chạm thật nhanh để giúp mọi người lăn hòn đá đi!',need:20,onP:p=>{tomb.stone.position.x=p*2.6;tomb.stone.rotation.y=-p*2.2;}},()=>
     CQ.say('Chúa Giê-su','Hỡi La-xa-rơ, hãy ra!','Giăng 11:43 (Bản Truyền Thống 1925)',null,()=>{laz.g.visible=true;CQ.walkTo(laz,CX,CZ-6.6,1.2);
     CQ.say('Người kể chuyện','Người chết đi ra, chân tay buộc bằng vải liệm. Chúa Giê-su phán: Hãy mở cho người, và để người đi.','Theo Giăng 11:44','Xong',()=>{CQ.setCine(null);n();});}));}}];
 }});
