/* Chapter 5: around the Sea of Galilee. Times of day follow the text:
   sermon on the mount (no time given: day), feeding the crowd ("trời đã chiều", Mt 14:15: dusk),
   the storm ("đến chiều ngày ấy", Mark 4:35: dark storm), walking on the water ("canh tư đêm", Mt 14:25: night). */
'use strict';
CQ.chapters.push({id:'ch5',no:5,title:'Biển Ga-li-lê',sub:'Bài giảng trên núi, năm bánh hai cá, dẹp yên bão',
 intro:[
  {t:'Đoàn dân rất đông',x:'Tin về Chúa Giê-su lan khắp xứ. Người ta từ mọi nơi kéo đến. Thấy đoàn dân đông, Ngài lên núi, ngồi xuống và bắt đầu dạy dỗ.',ref:'Theo Ma-thi-ơ 4:25 - 5:2',cam:[-58,22,-52,-98,8,-93]},
  {t:'Ê-li đi theo',x:'Ê-li cùng các môn đồ đi theo Thầy. Hôm nay bạn sẽ thấy nhiều điều lạ lùng bên biển Ga-li-lê.',cam:[-70,6,-62,-96,6,-91]}],
 outro:'Những người ở trong thuyền bèn đến quì lạy Ngài mà nói rằng: Thầy thật là Con Đức Chúa Trời!',outroRef:'Theo Ma-thi-ơ 14:33',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.menuCam={x:-92,y:7,z:-88,r:46,h:16};
  const sx=z=>25+6*Math.sin(z*.04);
  const H=(x,z)=>{const d=sx(z)-x;if(d<0)return Math.max(-4,d*.14);const hd=Math.hypot(x+112,z+104);return 1.2*sm(0,9,d)+Math.max(0,d-9)*.03+.35*noise(x*2.3,z*2.3)*sm(10,40,d)+16*Math.exp(-hd*hd/2600);};
  const sand=C('#dcc48f'),g1=C('#86c043'),g2=C('#a8cf52'),bed=C('#b9a67c');
  CQ.terrain({H,color:(x,z,y,c)=>{const d=sx(z)-x;if(d<0){c.copy(bed);return;}c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(sand,1-sm(4,11,d+noise(x*4,z*4)));}});
  CQ.sky({fogNear:50,fogFar:200});CQ.water({lake:true,deep:3.5});
  const land=(x,z)=>sx(z)-x>9;
  CQ.scatter(2600,new T.ConeGeometry(.09,.3,4),toon('#5f9e34'),()=>{const x=rr(-170,20),z=rr(-170,170);if(!land(x,z))return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(900,new T.SphereGeometry(.11,6,5),toon('#e2402f'),()=>{const x=-98+rr(-45,45),z=-93+rr(-45,45);return[x,H(x,z)+.22,z,rr(.8,1.4)];});
  CQ.scatter(400,new T.SphereGeometry(.09,6,5),toon('#f4d23c'),()=>{const x=-98+rr(-50,50),z=-93+rr(-50,50);return[x,H(x,z)+.2,z,rr(.8,1.3)];});
  [[-126,-70],[-60,-112],[-124,-120],[-50,-60],[-70,-130],[-134,-96]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.4)));

  /* the hillside */
  const JX=-98,JZ=-93;
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),JX,JZ,.8),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),JX+2.6,JZ-1.4,.8);
  CQ.crowd(CQ.ring(JX,JZ,80,5.5,22,-.5,2.1),{sit:1});
  const boy=CQ.place(CQ.makeChar(CQ.CAST.kid),-86.5,-73.5,-2.4);boy.g.visible=false;
  const bk=(x,z)=>{const g=new T.Group();g.position.set(x,H(x,z),z);W.scene.add(g);mesh(new T.CylinderGeometry(.5,.38,.45,12,1,true),toon('#c9a15c',{side:T.DoubleSide}),0,.22,0,g);
    const br=[];for(let i=0;i<5;i++){const b=mesh(new T.SphereGeometry(.17,8,6),toon('#d9a25a'),rr(-.2,.2),.42+rr(0,.08),rr(-.2,.2),g);b.scale.y=.55;b.visible=false;br.push(b);}W.circles.push({x,z,r:.6});return{g,br};};
  const groups=[[-91,-84],[-84,-89],[-80,-80],[-94,-75],[-87,-70]].map((p,i)=>{const b=bk(p[0],p[1]);CQ.addInter({id:'g'+i,obj:b.g,x:p[0],z:p[1],name:'nhóm này',verb:'Phát bánh cho ',h:1.6,r:2.2,br:b.br});return b;});

  /* the boat on the lake */
  const BX=95,BZ=60;const boatG=CQ.boat(BX,BZ,0,{far:1});W.platforms.push({x0:BX-3.5,x1:BX+3.5,z0:BZ-.8,z1:BZ+.8,top:.62});
  const mate=CQ.makeChar(CQ.CAST.man);mate.g.visible=false;
  const rainN=700,rp=new Float32Array(rainN*3);for(let i=0;i<rainN;i++){rp[i*3]=BX+rr(-22,22);rp[i*3+1]=rr(0,16);rp[i*3+2]=BZ+rr(-22,22);}
  const rg=new T.BufferGeometry();rg.setAttribute('position',new T.BufferAttribute(rp,3));const rain=new T.Points(rg,new T.PointsMaterial({color:'#c8d4e0',size:.09,transparent:true,opacity:.8}));rain.visible=false;W.scene.add(rain);
  let storm=0;W.tick.push((dt,tt)=>{boatG.rotation.z=Math.sin(tt*2.3)*.07*storm;boatG.rotation.x=Math.sin(tt*1.7)*.03*storm;boatG.position.y=Math.sin(tt*2.9)*.1*storm;
    if(rain.visible){for(let i=0;i<rainN;i++){rp[i*3+1]-=dt*22;rp[i*3]-=dt*6;if(rp[i*3+1]<0){rp[i*3+1]=16;rp[i*3]=BX+rr(-22,22);}}rg.attributes.position.needsUpdate=true;}});

  CQ.zones({A:{c:[-88,-84],r:44,tod:'day'},B:{c:[-88,-84],r:44,tod:'dusk'},C:{c:[BX,BZ],rect:[3.3,.72],tod:'storm'},D:{c:[BX,BZ],rect:[3.3,.72],tod:'night'}});
  const jI=CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:3});
  CQ.addInter({id:'boy',P:boy,name:'cậu bé',h:2.05});
  const pI=CQ.addInter({id:'peter',P:peter,name:'Phi-e-rơ',h:2.05});

  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',-72,-66,.785,null,true);
  const toBoat=()=>{CQ.place(jesus,BX+2.7,BZ,0);jesus.g.rotation.set(0,0,1.4);jesus.dy=.3;jI.noTurn=1;jI.h=1.2;CQ.place(peter,BX-1.2,BZ+.35,1.57);pI.noTurn=1;mate.g.visible=true;CQ.place(mate,BX+.4,BZ-.4,1.57);storm=1;rain.visible=true;};
  W.steps=[
   {at:'jesus',text:'Lên sườn núi nghe Thầy giảng',run:n=>{CQ.setCine([JX+7,H(JX,JZ)+3,JZ+7.5,JX,H(JX,JZ)+1.2,JZ]);
     CQ.fillWord({name:'Chúa Giê-su',before:'Phước cho những kẻ làm cho người',after:', vì sẽ được gọi là con Đức Chúa Trời!',options:['giàu có','hòa thuận','sợ hãi'],answer:'hòa thuận',ref:'Ma-thi-ơ 5:9 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Chúa khen những người đem lại bình an cho người khác.'},()=>
     CQ.order({name:'Chúa Giê-su',chunks:['Các ngươi là','sự sáng','của thế gian'],ref:'Ma-thi-ơ 5:14 (Bản Truyền Thống 1925)'},()=>{CQ.setCine(null);boy.g.visible=true;CQ.goZone('B',-76,-70,.785);n();}));}},
   {at:'boy',text:'Trời đã về chiều, mọi người đều đói. Tìm cậu bé có bánh',run:n=>CQ.say('Anh-rê','Đây có một đứa con trai, có năm cái bánh mạch nha và hai con cá; nhưng đông người dường nầy, thì ngần ấy có thấm vào đâu?','Giăng 6:9 (Bản Truyền Thống 1925)',null,()=>
     CQ.choice({name:'Người kể chuyện',q:'Cậu bé đã đưa cho Chúa Giê-su những gì?',options:['Năm cái bánh và hai con cá','Hai cái bánh và năm con cá','Mười hai giỏ bánh'],ref:'Giăng 6:9',wrong:'Chưa đúng. Nghe lại lời Anh-rê nhé.'},()=>
     CQ.say('Người kể chuyện','Chúa Giê-su cầm bánh và cá, ngửa mặt lên trời tạ ơn, rồi bẻ ra đưa cho các môn đồ để phát cho đoàn dân.','Theo Ma-thi-ơ 14:19',null,n)))},
   {collect:['g0','g1','g2','g3','g4'],text:'Phát bánh và cá cho từng nhóm',each:I=>{I.br.forEach(b=>b.visible=true);I.hidden=true;},
    run:n=>CQ.choice({name:'Người kể chuyện',q:'Ai nấy đều ăn no. Các môn đồ thu lại được bao nhiêu giỏ bánh thừa?',options:['Mười hai giỏ đầy','Năm giỏ','Không còn gì cả'],ref:'Ma-thi-ơ 14:20',wrong:'Chưa đúng. Bánh còn thừa nhiều hơn cả lúc đầu!'},()=>{CQ.goZone('C',BX-2.6,BZ-.1,-1.57,toBoat);n();})},
   {at:'jesus',text:'Bão nổi lên giữa biển! Lại đánh thức Thầy',run:n=>CQ.tapFill({name:'Bão lớn',text:'Sóng tràn vào thuyền, còn Thầy đang dựa gối mà ngủ ở đằng sau lái. Chạm thật nhanh để tát nước ra!',need:18},()=>
     CQ.say('Các môn đồ','Thầy ôi, Thầy không lo chúng tôi chết sao?','Theo Mác 4:38',null,()=>{jesus.g.rotation.set(0,-1.57,0);jesus.dy=0;jI.h=2.05;
     CQ.fillWord({name:'Chúa Giê-su',before:'Hãy êm đi,',after:' đi!',options:['mạnh','lặng','chạy'],answer:'lặng',ref:'Mác 4:39 (Bản Truyền Thống 1925)',wrong:'Chưa đúng. Ngài bảo gió và biển phải yên.'},()=>{storm=0;rain.visible=false;CQ.setTod('dusk');
     CQ.say('Người kể chuyện','Gió liền dứt và đều yên lặng như tờ. Các môn đồ nói với nhau: Vậy thì người nầy là ai, mà gió và biển cũng đều vâng lịnh người?','Theo Mác 4:39-41',null,()=>{
      CQ.goZone('D',BX-2.6,BZ-.1,-1.57,()=>{jesus.minY=.06;CQ.place(jesus,BX+15,BZ+1.5,-1.57);jI.hidden=true;});n();});});}))},
   {at:'peter',text:'Canh tư đêm. Có ai đó đang đi trên mặt biển!',run:n=>{CQ.setCine([BX-5.5,3,BZ+5,BX+9,.8,BZ+1]);
     CQ.say('Chúa Giê-su','Các ngươi hãy yên lòng; ấy là ta đây, đừng sợ!','Ma-thi-ơ 14:27 (Bản Truyền Thống 1925)',null,()=>
     CQ.say('Phi-e-rơ','Lạy Chúa, nếu phải Chúa, xin khiến tôi đi trên mặt nước mà đến cùng Chúa.','Ma-thi-ơ 14:28 (Bản Truyền Thống 1925)',null,()=>{peter.minY=.06;peter.g.rotation.y=1.57;const x0=BX+3.8;
     CQ.balance({name:'Nhìn về Thầy',text:'Phi-e-rơ bước xuống mặt nước. Giữ chấm tròn ở giữa vùng xanh để Phi-e-rơ luôn nhìn về Thầy. Nếu nhìn sóng gió, ông sẽ chìm!',secs:6,onP:(p,x)=>{peter.x=x0+(BX+13.6-x0)*p;peter.z=BZ+.35+1.1*p;peter.dy=Math.abs(x)>.4?-.55:0;}},()=>{peter.dy=0;
     CQ.say('Chúa Giê-su','Hỡi người ít đức tin, sao ngươi hồ nghi làm vậy?','Ma-thi-ơ 14:31 (Bản Truyền Thống 1925)',null,()=>
     CQ.say('Người kể chuyện','Chúa Giê-su giơ tay nắm lấy Phi-e-rơ. Khi hai người lên thuyền rồi thì gió yên lặng.','Theo Ma-thi-ơ 14:31-32','Xong',()=>{CQ.setCine(null);n();}));});}));}}];
 }});
