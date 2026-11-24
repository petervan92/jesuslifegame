/* Chapter: Ananias and the basket at Damascus (Acts 9:10-25). The passage says the escape was "lúc ban đêm" (9:25), so the whole scene is at night.
   Quoted word for word (1925 text): Công vụ 9:17 (A-na-nia's greeting), 9:18, 9:22, 9:23, 9:25. Everything else is paraphrased ("Theo"). */
'use strict';
CQ.chapters.push({id:'ananias',no:25,title:'A-na-nia và chiếc giỏ ở Đa-mách',sub:'Sau-lơ được sáng mắt · ban đêm',
 intro:[
  {t:'Chúa gọi A-na-nia',x:'Tại Đa-mách có một môn đồ tên A-na-nia. Chúa phán với ông trong sự hiện thấy, bảo đến nhà Giu-đa trên đường Ngay Thẳng.',ref:'Theo Công vụ 9:10-11',cam:[3,3.4,24,0,2,10]},
  {t:'Nỗi sợ và sự vâng lời',x:'A-na-nia nghe nói nhiều về Sau-lơ nên sợ. Chúa trấn an và A-na-nia vâng lời đi.',ref:'Theo Công vụ 9:13-17',cam:[-3,2.4,12,-6,2.2,-4]},
  {t:'Một bạn mới',x:'Ê-li xin cầm đèn dẫn đường cho A-na-nia qua các hẻm tối trong thành.',ref:'Theo Công vụ 9:11-12',cam:[2.5,2.2,19,0,1.6,23]}],
 outro:'Song lúc ban đêm, các môn đồ lấy thúng dòng người xuống ngoài vách thành.',outroRef:'Công vụ 9:25',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='night';W.startYaw=Math.PI;W.menuCam={x:0,y:2,z:-4,r:30,h:14};
  const H=(x,z)=>1+.15*noise(x*.3,z*.3)-4.5*sm(29,38,-z)+sm(48,120,Math.hypot(x,z))*10;
  W.paths=[[[0,30],[0,-24]],[[0,-22],[13,-24]]];
  const st=C('#a8a08c'),st2=C('#8f8874'),dirt=C('#8a7a5a');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(dirt).lerp(C('#6f7f4a'),sm(30,36,-z));c.lerp(st,1-sm(2.2,3.6,CQ.distPath(x,z)+noise(x*2,z*2)*.5)).lerp(st2,.3*noise(x,z));}});
  CQ.sky({fogNear:40,fogFar:150,clouds:0});
  CQ.scatter(500,new T.ConeGeometry(.09,.3,4),toon('#5f7a44'),()=>{const x=rr(-90,90),z=rr(-90,-31);return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  /* the city wall (outside lies lower ground) with a tower and a parapet */
  CQ.wallBox(0,-31,86,8,2.4,0,M.lime);CQ.wallBox(-20,-30,5,11,5,0,M.lime);
  const wp=new T.Group();wp.position.set(0,H(0,-31),-31);W.scene.add(wp);
  for(let i=-20;i<=20;i++)if(i%2)mesh(new T.BoxGeometry(1.4,.8,2.4),M.lime,i*2.1,8.4,0,wp);
  /* Straight Street: houses with lit windows, columns, lamps */
  const lit=new T.MeshBasicMaterial({color:'#ffd27a'});
  [[-9,18,7,7,4.2,1.57],[-9,6,7,7,4.6,1.57],[-9,-6,8,7,4.4,1.57],[-9,-18,7,7,4,1.57],[9,18,7,7,4,-1.57],[9,6,7,7,4.4,-1.57],[9,-6,7,7,4.8,-1.57],[9,-18,7,7,4.2,-1.57],[-22,10,8,8,4,0],[22,0,8,8,4.4,0],[-22,-12,8,8,4,0]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,winMat:lit,roofJars:i%3===0,stair:false}));
  const cols=toon('#c9bfa4'),lampL=[];
  for(const x of[-4.2,4.2])for(let z=24;z>=-24;z-=8){mesh(new T.CylinderGeometry(.3,.34,3.6,10),cols,x,H(x,z)+1.8,z);W.circles.push({x,z,r:.4});
   mesh(new T.SphereGeometry(.13,8,6),lit,x*.9,H(x,z)+3.1,z-.5,W.scene,false);}
  for(const p of[[0,16],[0,-8]]){const l=new T.PointLight('#ffb55a',.9,22);l.position.set(p[0],H(p[0],p[1])+3.4,p[1]);W.scene.add(l);}
  [[-15,22],[15,-22],[-16,-24],[16,26]].forEach(p=>CQ.olive(p[0],p[1],rr(.9,1.1)));
  /* Judas' house on the left sits at (-9,-6); fire pot and lamp light in front of it */
  CQ.campfire(-5.5,-9);
  /* basket and rope near the wall */
  const BX=13,BZ=-26,bk=new T.Group();bk.position.set(BX,H(BX,BZ),BZ);W.scene.add(bk);
  const wick=toon('#a9803f');mesh(new T.CylinderGeometry(.75,.55,.8,14,1,true),toon('#a9803f',{side:T.DoubleSide}),0,.4,0,bk);mesh(new T.TorusGeometry(.75,.07,6,16),toon('#8a6530'),0,.8,0,bk).rotation.x=Math.PI/2;
  mesh(new T.CircleGeometry(.55,12),wick,0,.05,0,bk).rotation.x=-Math.PI/2;W.circles.push({x:BX,z:BZ,r:1});
  mesh(new T.TorusGeometry(.5,.12,6,12),toon('#d9c391'),1.4,.15,.6,bk).rotation.x=Math.PI/2;
  const hang=new T.Group();hang.position.set(BX,H(BX,-33)+7.2,-33.2);hang.visible=false;W.scene.add(hang);
  mesh(new T.CylinderGeometry(.75,.55,.8,14,1,true),toon('#a9803f',{side:T.DoubleSide}),0,0,0,hang);
  mesh(new T.SphereGeometry(.22,8,6),toon('#c08a5e'),0,.55,0,hang);mesh(new T.CylinderGeometry(.35,.4,.5,8),toon('#4a2f6a'),0,.35,0,hang);
  const rope=mesh(new T.CylinderGeometry(.03,.03,1,4),toon('#d9c391'),0,2,0,hang,false);
  let hy=7.2,hT=7.2;const gy=H(BX,-33)+.9;
  W.tick.push(dt=>{hy+=(hT-hy)*Math.min(1,dt*.7);hang.position.y=H(BX,-33)+hy;rope.scale.y=3;rope.position.y=1.7;});
  /* people */
  const eliC=Object.assign({},CQ.CAST.eli,{S:.86,head:1.1,hem:.42});W.player=CQ.place(CQ.makeChar(eliC),0,24,Math.PI);
  const hand=W.player.arms[1],lamp=mesh(new T.SphereGeometry(.12,8,6),lit,0,-.85,.18,hand,false);
  const pl=new T.PointLight('#ffc060',.9,10);pl.position.set(0,-.8,.2);hand.add(pl);
  const ana=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#e8e0c8',hem:.35,mantle:'#5c7a52',sash:'#a5483a',hair:'#d9d4c8',beard:2,band:'#dcc9a0',staff:1}),1.6,22,Math.PI);
  const saul=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#4a2f6a',hem:.35,mantle:'#e9dcc0',sash:'#d9a441',hair:'#241a13',beard:1,band:'#e9dcc0'}),-5.2,-5,1.57);
  const j=CQ.place(CQ.makeChar(CQ.CAST.man2),-6.4,-8,.9);
  const d1=CQ.place(CQ.makeChar(CQ.CAST.man),11.2,-24.5,-1.4),d2=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.peter,{tunic:'#7d8a5c'})),11.5,-27.2,-1.8);
  const gd=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#8a3a3a',hem:.4,mantle:'#555a62',sash:'#2a2a2a',hair:'#241a13',beard:1,staff:1}),-3,8,1);
  const kid=CQ.place(CQ.makeChar(CQ.CAST.kid),5.5,12,-1.57);
  CQ.zones({A:{c:[0,-4],r:42,tod:'night'}});
  CQ.addInter({id:'ana',P:ana,name:'bác A-na-nia',h:2.2,r:2.6});
  CQ.addInter({id:'saul',P:saul,name:'ông Sau-lơ',h:2.2,r:2.6});
  CQ.addInter({id:'basket',obj:bk,x:BX,z:BZ,name:'chiếc thúng lớn',verb:'Xem ',h:1.8,r:2.4});
  CQ.addInter({id:'disc',P:d2,name:'người môn đồ',h:2.2,r:2.6});
  CQ.addInter({id:'guard',P:gd,name:'người lính canh',h:2.1,side:1,run:d=>CQ.say('Lính canh','Đêm nay cổng thành đóng sớm. Có người nói người Giu-đa đang tìm một ai đó.','Theo Công vụ 9:24','Dạ',d)});
  CQ.addInter({id:'kid',P:kid,name:'em bé',h:1.8,side:1,run:d=>CQ.say('Em bé','Anh ơi, đèn của anh sáng quá! Mẹ em nói người sai tôi đến nhà ông Giu-đa là người tốt.','Theo Công vụ 9:11','Dạ',d)});
  CQ.addInter({id:'jud',P:j,name:'ông Giu-đa',h:2.1,side:1,run:d=>CQ.say('Ông Giu-đa','Nhà ta ở ngay đường Ngay Thẳng này. Khách của ta đang cầu nguyện, đã mấy ngày rồi.','Theo Công vụ 9:11','Dạ',d)});
  CQ.goZone('A',0,24,Math.PI,null,true);
  const TC=[-1.5,2.8,-1.2,-6,1.7,-5.5];
  W.steps=[
   {at:'ana',text:'Đi cùng bác A-na-nia đến nhà ông Giu-đa',run:n=>{
     CQ.lines([['Ê-li','Thưa bác A-na-nia, hình như đây là nhà ông Giu-đa.','Theo Công vụ 9:11'],
       ['A-na-nia','Con giữ đèn giúp bác. Bác vừa sợ vừa tin lời Chúa.','Theo Công vụ 9:13-17']],()=>{CQ.walkTo(ana,-4,-3.4,3.2,()=>CQ.face(ana,saul.x,saul.z));n();});}},
   {at:'saul',text:'Lại gần ông Sau-lơ cùng bác A-na-nia',run:n=>{CQ.setCine(TC);
     CQ.say('A-na-nia','Hỡi anh Sau-lơ, Chúa là Giê-su nầy, đã hiện ra cùng anh trên con đường anh đi tới đây, đã sai tôi đến, hầu cho anh được sáng mắt lại và đầy Đức Thánh Linh.','Công vụ 9:17','Đặt tay',()=>
      CQ.fillWord({name:'A-na-nia',before:'Hỡi anh',answer:'Sau-lơ',after:', Chúa là Giê-su nầy, đã hiện ra cùng anh trên con đường anh đi tới đây.',options:['Sau-lơ','Ba-na-ba','Ê-li'],ref:'Công vụ 9:17',wrong:'Chưa đúng. A-na-nia gọi người đang ngồi trước mặt.'},()=>{CQ.setCine(null);n();}));}},
   {at:'saul',text:'Nhìn ông Sau-lơ',run:n=>{CQ.setCine(TC);
     CQ.say('Người kể chuyện','Tức thì có như vảy từ mắt Sau-lơ rớt xuống, và người được sáng mắt, rồi chịu báp-têm.','Theo Công vụ 9:18','Ồ!',()=>{CQ.setCine(null);n();});}},
   {at:'saul',text:'Nghe ông Sau-lơ nói',run:n=>{CQ.setCine(TC);
     CQ.say('Người kể chuyện','Còn Sau-lơ lần lần càng thêm vững chí, bắt bẻ những người Giu-đa ở tại thành Đa-mách, mà nói rõ rằng Đức Chúa Giê-su là Đấng Christ.','Công vụ 9:22',null,()=>
      CQ.choice({name:'Sau-lơ',q:'Sau-lơ nói rõ điều gì ở Đa-mách?',options:['Đức Chúa Giê-su là Đấng Christ','Không có gì cả','Đa-mách là thành đẹp nhất'],ref:'Công vụ 9:22',wrong:'Chưa đúng. Nghe lại lời kể nhé.'},()=>{CQ.setCine(null);n();}));}},
   {at:'basket',text:'Ra vách thành xem chiếc thúng lớn',run:n=>{CQ.walkTo(saul,12,-24,3,()=>CQ.face(saul,BX,BZ));CQ.setCine([BX-4,4,BZ+7,BX,2,BZ-2]);
     CQ.lines([['Người kể chuyện','Cách lâu ngày, người Giu-đa mưu với nhau để giết Sau-lơ.','Công vụ 9:23'],
       ['Ê-li','Cổng thành có người canh. Mình phải làm sao đây?','Theo Công vụ 9:24']],()=>
      CQ.tapFill({name:'Chuẩn bị thúng',text:'Chạm nhanh để đan buộc dây và chuẩn bị chiếc thúng lớn.',need:10},()=>{CQ.setCine(null);n();}));}},
   {at:'disc',text:'Nói với người môn đồ ở vách thành',run:n=>{CQ.setCine([BX-5,6,BZ+9,BX,5,-33]);
     CQ.say('Người kể chuyện','Song lúc ban đêm, các môn đồ lấy thúng dòng người xuống ngoài vách thành.','Công vụ 9:25',null,()=>
      CQ.order({name:'Thoát thân',q:'Ghép lại câu chuyện thoát thân.',chunks:['Song lúc ban đêm,','các môn đồ lấy thúng','dòng người xuống','ngoài vách thành.'],ref:'Công vụ 9:25'},()=>{
       saul.g.visible=false;bk.visible=false;hang.visible=true;hy=7.2;hT=.9;CQ.setCine([BX+2,8,-22,BX,5,-33]);
       CQ.say('Người kể chuyện','Chiếc thúng chầm chậm xuống tới đất bên ngoài vách thành. Sau-lơ được cứu thoát.','Theo Công vụ 9:25','Cảm ơn Chúa',()=>{CQ.setCine(null);n();});}));}}];
 }});
