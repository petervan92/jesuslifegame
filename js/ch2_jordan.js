/* Chapter 2: the baptism at the Jordan. Matthew 3 gives no time of day, so the scene is set in daylight. */
'use strict';
CQ.chapters.push({id:'ch2',no:2,title:'Sông Giô-đanh',sub:'Chúa Giê-su chịu báp-têm · ban ngày',
 intro:[
  {t:'Tiếng kêu trong đồng vắng',x:'Nhiều năm đã trôi qua. Na-than giờ đã có con trai là Ê-li. Hai cha con theo đoàn người xuống sông Giô-đanh, vì ai cũng nói về một người tên Giăng đang giảng dạy ở đó.',cam:[44,20,48,0,2,6]},
  {t:'Giăng Báp-tít',x:'Người ta từ thành Giê-ru-sa-lem, khắp xứ Giu-đê và cả miền chung quanh sông Giô-đanh đều đến với Giăng. Họ xưng tội mình và chịu Giăng làm phép báp-têm dưới sông. Bạn là Ê-li.',ref:'Theo Ma-thi-ơ 3:5-6',cam:[-7,3.2,17,2,1,5.5]}],
 outro:'Chúa Giê-su chịu báp-têm, Thánh Linh ngự xuống trên Ngài và có tiếng từ trời phán.',outroRef:'Theo Ma-thi-ơ 3:13-17',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:0,y:2,z:6,r:48,h:17};
  const rz=x=>8*Math.sin(x*.03)+3*Math.sin(x*.07);
  W.paths=[[[40,60],[22,34],[4,13]]];
  const H=(x,z)=>{const d=Math.abs(z-rz(x));if(d<7)return -1.3*(1-(d/7)*(d/7));
    return 1.6*sm(7,22,d)+.012*(d-7)+sm(55,125,d)*(16+7*noise(x,z))+.3*noise(x*2.1,z*2.1)*sm(10,30,d);};
  const bed=C('#a9966a'),sand=C('#dcc99c'),g1=C('#86b84e'),g2=C('#a4c65c'),tan=C('#dbc390'),hill=C('#c9a878'),dirt=C('#e2d0a6');
  CQ.terrain({H,color:(x,z,y,c)=>{const d=Math.abs(z-rz(x));if(d<7){c.copy(bed);return;}c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(sand,1-sm(7.5,10.5,d));c.lerp(tan,sm(20,34,d+4*noise(x*3,z*3)));c.lerp(hill,sm(60,120,d)*.8);
    c.lerp(dirt,(1-sm(1.2,3,CQ.distPath(x,z)))*sm(9,14,d)*.9);}});
  CQ.sky({clouds:9,ridgeAmp:34});CQ.setTod('day');W.ridgeMat.color.set('#c9b08a');
  CQ.water({deep:1.3});

  const side=()=>R()<.5?-1:1;
  CQ.scatter(520,new T.ConeGeometry(.06,1.9,4),toon('#9db45a'),()=>{const x=rr(-120,120);if(Math.abs(x-2)<9)return 0;const z=rz(x)+side()*rr(5.6,8.6);return[x,Math.max(H(x,z),0)+.8,z,rr(.7,1.5),1,rr(-.12,.12),rr(-.12,.12)];});
  CQ.scatter(1500,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-120,120),z=rz(x)+side()*rr(9.5,24);if(CQ.distPath(x,z)<2)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(90,new T.DodecahedronGeometry(.6,0),toon('#a89878'),()=>{const x=rr(-120,120),z=rz(x)+side()*rr(6,60);if(Math.hypot(x-2,z-10)<12||CQ.distPath(x,z)<2.5)return 0;return[x,H(x,z)+.1,z,rr(.4,1.6),rr(.5,.8)];},true);
  for(let i=0;i<34;i++){const x=rr(-110,110),z=rz(x)+side()*rr(10,22);if(Math.hypot(x-2,z-12)<11||CQ.distPath(x,z)<3)continue;CQ.bush(x,z,rr(.9,1.6));}
  [[-14,13],[16,12],[-24,-12],[20,-13],[34,14],[-40,13],[48,-12],[-56,-13]].forEach(p=>CQ.palm(p[0],rz(p[0])+p[1],rr(.9,1.2)));
  [[-30,30],[30,40],[-12,-30],[44,-34],[-50,-28]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));

  const jz=rz(2)+4.8;
  const john=CQ.place(CQ.makeChar(CQ.CAST.john),2,jz,0);john.minY=-1.2;
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),40,58,0);jesus.minY=-1.2;jesus.g.visible=false;
  const dad=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.nathan,{S:1,head:1,staff:1,beard:1,hem:.3})),-3,19,2.6);
  const w1=CQ.place(CQ.makeChar(CQ.CAST.woman),-6.5,14.5,2.9);
  CQ.place(CQ.makeChar(CQ.CAST.man),-4,12.6,3);CQ.place(CQ.makeChar(CQ.CAST.man2),6.2,13.2,-2.9);CQ.place(CQ.makeChar(CQ.CAST.kid),7.6,14.4,-2.8);
  CQ.place(CQ.makeChar(CQ.CAST.woman2),-1.2,14.8,3.1);CQ.place(CQ.makeChar(CQ.CAST.shepherd2),9.6,12,-2.6);

  const beam=new T.Mesh(new T.CylinderGeometry(1,2.3,70,20,1,true),new T.MeshBasicMaterial({color:'#fff6c8',transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false}));
  beam.position.set(3.3,34,jz+.6);W.scene.add(beam);
  const bird=CQ.dove();bird.scale.setScalar(1.9);bird.visible=false;bird.position.set(3.3,24,jz+.6);
  let dip=-1,beamOn=0,dn=0,da=0;
  W.tick.push((dt,tt)=>{if(dip>=0){dip+=dt;jesus.dy=-.95*Math.sin(Math.min(1,dip/2.6)*Math.PI);if(dip>2.6){dip=-1;jesus.dy=0;}}
    beam.material.opacity+=(beamOn*.11-beam.material.opacity)*Math.min(1,dt*2);
    if(bird.visible){da+=dt*(1.5-dn*.2);const rad=Math.max(0,6.5-dn*1.3),ty=dn>=5?3.1:23-dn*4;const tx=3.3+Math.cos(da)*rad,tz=jz+.6+Math.sin(da)*rad,p=bird.position;
      p.x+=(tx-p.x)*Math.min(1,dt*4);p.z+=(tz-p.z)*Math.min(1,dt*4);p.y+=(ty-p.y)*Math.min(1,dt*2.2);bird.rotation.y=rad>.1?-da:Math.PI;}});

  CQ.addInter({id:'john',P:john,name:'Giăng Báp-tít',verb:'Nghe ',h:2.1,r:3.4});
  CQ.addInter({id:'dove',obj:bird,follow:1,remote:1,x:3.3,z:jz,name:'chim bồ câu',verb:'Chạm vào ',h:1.2});
  CQ.addInter({id:'dad',P:dad,name:'cha Na-than',h:2.05,side:1,run:d=>CQ.say('Cha Na-than','Ê-li à, năm xưa lúc cha bằng tuổi con, cha đã thấy thiên sứ báo tin một Con Trẻ ra đời ở Bết-lê-hem. Cha vẫn luôn trông đợi Đấng ấy.',null,'Đóng',d)});
  CQ.addInter({id:'w1',P:w1,name:'cô Ma-thê',h:2.05,side:1,run:d=>CQ.say('Cô Ma-thê','Cô đi bộ ba ngày đường từ Giê-ru-sa-lem xuống đây để nghe Giăng giảng đó cháu.',null,'Đóng',d)});

  W.player=CQ.place(CQ.makeChar(CQ.CAST.eli),0,26,Math.PI);
  W.steps=[
   {at:'john',text:'Xuống bờ sông nghe Giăng giảng',run:n=>CQ.say('Người kể chuyện','Vả, Giăng mặc áo bằng lông lạc đà, buộc dây lưng bằng da; ăn, thì ăn những châu chấu và mật ong rừng.','Ma-thi-ơ 3:4',null,()=>
     CQ.fillWord({name:'Giăng Báp-tít',before:'Các ngươi phải',after:', vì nước thiên đàng đã đến gần!',options:['đi ngủ','chạy trốn','ăn năn'],answer:'ăn năn',ref:'Ma-thi-ơ 3:2',wrong:'Chưa đúng. Giăng kêu gọi mọi người quay về với Đức Chúa Trời.'},n))},
   {text:'Có một người từ Ga-li-lê đến',run:n=>{jesus.g.visible=true;CQ.place(jesus,26,34,0);CQ.walkTo(jesus,4.4,10.6,3.4,()=>CQ.face(jesus,2,jz));CQ.setCine([-13,3.4,8.5,5,1.3,9.5]);john.noTurnT=1;
     CQ.say('Người kể chuyện','Khi ấy, Chúa Giê-su từ xứ Ga-li-lê đến cùng Giăng tại sông Giô-đanh, để chịu người làm phép báp-têm.','Theo Ma-thi-ơ 3:13',null,()=>{CQ.face(john,4.4,10.6);
     CQ.say('Giăng Báp-tít','Chính tôi cần phải chịu Ngài làm phép báp-têm, mà Ngài lại trở đến cùng tôi sao!','Ma-thi-ơ 3:14',null,()=>
     CQ.choice({name:'Chúa Giê-su',q:'Chúa Giê-su đáp lại Giăng thế nào?',options:['Bây giờ cứ làm đi, vì chúng ta nên làm cho trọn mọi việc công bình như vậy.','Vậy thôi, ta sẽ trở về Ga-li-lê.','Ngươi nói phải, hãy để ta làm phép báp-têm cho ngươi.'],ref:'Ma-thi-ơ 3:15',wrong:'Chưa đúng. Chúa Giê-su vẫn muốn Giăng làm phép báp-têm cho Ngài.'},()=>{
      jesus.dest=null;CQ.setCine([2.2,3.2,jz+7.6,2.7,.1,jz+.4]);john.raise=.3;CQ.walkTo(jesus,3.3,jz+.9,2.2,()=>{CQ.face(jesus,3.3,30);dip=0;});
      CQ.say('Người kể chuyện','Giăng làm phép báp-têm cho Ngài dưới sông. Vừa khi Chúa Giê-su ra khỏi nước, các từng trời mở ra.','Theo Ma-thi-ơ 3:16',null,()=>{john.raise=0;beamOn=1;bird.visible=true;CQ.setCine([-7,1.6,jz+7,3.3,9.5,jz+.6]);n();});}));});}},
   {at:'dove',taps:5,text:'Chạm vào chim bồ câu đang bay xuống',each:(I,k)=>{dn=k;},
    run:n=>{CQ.setCine([2.6,3.4,jz+7.2,3,.5,jz+.6]);CQ.say('Người kể chuyện','Thánh Linh của Đức Chúa Trời ngự xuống như chim bồ câu, đậu trên Ngài.','Theo Ma-thi-ơ 3:16',null,()=>
     CQ.order({name:'Tiếng từ trên trời',q:'Có tiếng từ trên trời phán. Chạm vào các mảnh theo đúng thứ tự để ghép lại lời ấy.',chunks:['Nầy là','Con yêu dấu của ta,','đẹp lòng ta','mọi đàng.'],ref:'Ma-thi-ơ 3:17'},()=>{CQ.setCine(null);n();}));}}];
 }});
