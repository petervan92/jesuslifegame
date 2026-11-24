/* Chapter 34: the storm at sea (Acts 27). Quoted word for word (1925 text): Cong vu 27:34 and the narrator lines of 27:18 and 27:35. */
'use strict';
CQ.chapters.push({id:'storm',no:34,title:'Bão biển trên tàu',sub:'Đừng mất hy vọng · ban đêm',
 intro:[
  {t:'Lên tàu đi Rô-ma',x:'Phao-lô và các tù nhân khác được giao cho thầy đội Giu-lơ. Ê-li xin được đi cùng với cương vị bạn.',ref:'Theo Công vụ 27:1-2',cam:[7,5,-16,0,1.6,-6]},
  {t:'Gió dữ nổi lên',x:'Gió Ơ-ra-qui-lôn thổi mạnh, tàu bị đẩy đi mãi. Mấy ngày không thấy mặt trời, không thấy sao.',ref:'Theo Công vụ 27:14-20',cam:[-6,4,12,0,3,0]},
  {t:'Lời khuyên của Phao-lô',x:'Phao-lô đứng giữa mọi người nói lời khích lệ, rằng Chúa sẽ gìn giữ mọi người.',ref:'Theo Công vụ 27:21-26',cam:[3.5,3,4,0,2,-1]}],
 outro:'Chẳng ai trong vòng các ngươi sẽ mất một sợi tóc trên đầu mình.',outroRef:'Công vụ 27:34',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='night';W.startYaw=0;W.menuCam={x:0,y:3,z:0,r:26,h:12};
  const D=(x,z)=>(x/5.4)**2+(z/14.5)**2;
  const H=(x,z)=>{const d=D(x,z);return 1.3-sm(.88,1.12,d)*5.5;};
  const pl1=C('#8a5f38'),pl2=C('#74502f'),deep=C('#0e2040');
  CQ.terrain({size:120,seg:120,H,color:(x,z,y,c)=>{if(y>.4)c.copy(pl1).lerp(pl2,(Math.floor(x*1.3)%2?.5:0)+.2*noise(x*4,z*.5));else c.copy(deep);}});
  CQ.sky({fogNear:30,fogFar:130,clouds:14});CQ.water({size:120,lake:true,deep:3});
  W.paths=[[[0,12],[0,-12]]];
  /* rails round the deck */
  const rail=toon('#5a3a22');
  for(let i=0;i<30;i++){const t=i/30*6.283,t2=(i+1)/30*6.283,ax=5.45*Math.cos(t),az=14.6*Math.sin(t),bx=5.45*Math.cos(t2),bz=14.6*Math.sin(t2);
   const cx=(ax+bx)/2,cz=(az+bz)/2,L=Math.hypot(bx-ax,bz-az)+.1,rot=Math.atan2(-(bz-az),bx-ax);
   const r=mesh(new T.BoxGeometry(L,.12,.14),rail,cx,2.3,cz);r.rotation.y=rot;const lo=mesh(new T.BoxGeometry(L,.8,.1),rail,cx,1.7,cz);lo.rotation.y=rot;mesh(new T.CylinderGeometry(.07,.07,1.1,5),rail,ax,1.85,az);
   W.obstacles.push({x:cx,z:cz,w:L,d:.6,rot,ox:0});}
  /* mast, yard and sail */
  mesh(new T.CylinderGeometry(.22,.3,10,10),M.wood,0,6,-1);const yard=mesh(new T.CylinderGeometry(.1,.1,8,8),M.wood,0,9,-1);yard.rotation.z=Math.PI/2;W.circles.push({x:0,z:-1,r:.6});
  const sg=new T.PlaneGeometry(6.4,4.6,12,8),sp=sg.attributes.position;for(let i=0;i<sp.count;i++){const u=sp.getX(i)/3.2,v=sp.getY(i)/2.3;sp.setZ(i,(1-u*u)*.9+Math.abs(v)*.1);}sg.computeVertexNormals();
  const sail=mesh(sg,toon('#b8ad92',{side:T.DoubleSide}),0,7.3,-1);
  /* stern, bow and lamps */
  const post=mesh(new T.BoxGeometry(.3,3.4,.3),rail,0,3,-14.4);const bowp=mesh(new T.BoxGeometry(.3,2.6,.5),rail,0,2.6,14.6);bowp.rotation.x=-.4;
  for(const p of[[1.2,-1,-9],[-1,12.4,7]]){}
  const lamps=[[0,2.2,-13.6],[2.2,2.2,6]];lamps.forEach(l=>{mesh(new T.SphereGeometry(.18,8,6),new T.MeshBasicMaterial({color:'#ffcf6a'}),l[0],l[1],l[2],null,false);const L=new T.PointLight('#ffb050',1.4,18,1.5);L.position.set(l[0],l[1]+.3,l[2]);W.scene.add(L);});
  /* cargo: crates and wheat sacks (thrown overboard in step 2) */
  const cargo=new T.Group();W.scene.add(cargo);const cr=toon('#9a6a40'),sk=toon('#d8c58f');
  [[-3.2,-6,1],[-3.4,-4.6,.8],[3.3,-7,.9],[3.1,-5.5,1]].forEach(a=>{mesh(new T.BoxGeometry(a[2]*1.2,a[2]*1.1,a[2]*1.2),cr,a[0],1.3+a[2]*.55,a[1],cargo);W.obstacles.push({x:a[0],z:a[1],w:1.4,d:1.4,rot:0,ox:0});});
  [[-3.1,-2.6],[3.2,-2.2],[3.4,-3.4]].forEach(a=>{const s=mesh(new T.SphereGeometry(.55,10,8),sk,a[0],1.65,a[1],cargo);s.scale.set(1,.8,1.4);W.circles.push({x:a[0],z:a[1],r:.8});});
  /* ropes and anchor at the bow, bread basket by the mast */
  const ropes=new T.Group();ropes.position.set(2.2,1.3,9);W.scene.add(ropes);
  for(let i=0;i<4;i++)mesh(new T.TorusGeometry(.55-i*.02,.07,6,16),toon('#cdb98a'),0,.12+i*.13,0,ropes).rotation.x=Math.PI/2;W.circles.push({x:2.2,z:9,r:.8});
  const anchor=new T.Group();anchor.position.set(-2.4,1.3,10.6);W.scene.add(anchor);const ia=toon('#3b3f48');
  mesh(new T.CylinderGeometry(.07,.07,1.5,6),ia,0,.8,0,anchor);mesh(new T.CylinderGeometry(.06,.06,1.3,6),ia,0,1.5,0,anchor).rotation.z=Math.PI/2;const arm=mesh(new T.TorusGeometry(.5,.07,6,12,Math.PI),ia,0,.1,0,anchor);arm.rotation.z=Math.PI;W.circles.push({x:-2.4,z:10.6,r:.8});
  const basket=new T.Group();basket.position.set(1.6,1.3,1.8);W.scene.add(basket);mesh(new T.CylinderGeometry(.5,.38,.4,10),toon('#b08a4e'),0,.2,0,basket);
  const loaves=[];for(let i=0;i<5;i++)loaves.push(mesh(new T.SphereGeometry(.17,8,6),toon('#d9a45a'),Math.cos(i*1.3)*.22,.45,Math.sin(i*1.3)*.22,basket));W.circles.push({x:1.6,z:1.8,r:.7});
  /* rain and lightning */
  const rn=300,rp=new Float32Array(rn*3);for(let i=0;i<rn;i++){rp[i*3]=rr(-18,18);rp[i*3+1]=rr(0,14);rp[i*3+2]=rr(-18,18);}
  const rg=new T.BufferGeometry();rg.setAttribute('position',new T.BufferAttribute(rp,3));const rain=new T.Points(rg,new T.PointsMaterial({color:'#b9c8e8',size:.09,transparent:true,opacity:.7}));rain.frustumCulled=false;W.scene.add(rain);
  const fl=new T.PointLight('#cfe0ff',0,160,1);fl.position.set(-25,22,-30);W.scene.add(fl);let ft=3;
  W.tick.push((dt,tt)=>{const a=rg.attributes.position;for(let i=0;i<rn;i++){let y=a.getY(i)-18*dt;if(y<0)y+=14;a.setY(i,y);}a.needsUpdate=true;rain.position.set(W.player.x,0,W.player.z);
   sail.rotation.y=Math.sin(tt*.9)*.04;ft-=dt;if(ft<0){ft=rr(4,9);fl.intensity=3.5;}fl.intensity=Math.max(0,fl.intensity-dt*7);});
  /* people */
  const eli=Object.assign({},CQ.CAST.eli,{S:.95,head:1,beard:1,hem:.4});W.player=CQ.makeChar(eli);
  const paul=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#c9b27c',hem:.4,mantle:'#7a4a8a',sash:'#d9a441',hair:'#d9d4c8',beard:2,band:'#e6d3ab',S:.92}),0,2.6,3.14);
  const julius=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#8a8d94',hem:.5,mantle:'#a8322d',sash:'#3a2718',hair:'#2a1d15',band:'#d9a441',W:1.1}),-1.8,-9,.6);
  const lukeS=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#5f8f7a',hem:.35,sash:'#6b4a2f',hair:'#3a281c',beard:1,S:.95}),-1.3,2.8,.8);
  const sail1=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#d9d2bd',hem:.6,sash:'#a5483a',hair:'#241a13',beard:1,band:'#2f5f8f'}),2.8,8,-2.3);
  const sail2=CQ.place(CQ.makeChar({skin:'#b27a4e',tunic:'#e6d3ab',hem:.6,sash:'#3f7f8f',hair:'#241a13',beard:2,band:'#b5483a'}),-3.2,-3.8,-1);
  CQ.crowd([[-2.5,-7.6,1],[2.5,-9,2],[-2.8,-11,.5],[2,-11.5,3],[3,5,-1],[-3,6,2],[-3.4,0,1],[3.5,.5,-2]],{sit:1});
  const soldier=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#8a8d94',hem:.5,mantle:'#8a2c2c',hair:'#2a1d15',band:'#9aa0aa',staff:1,W:1.1}),2.4,-9,-.5);
  CQ.zones({A:{c:[0,0],rect:[4.8,13.5],tod:'night'}});
  CQ.addInter({id:'ropes',obj:ropes,x:2.2,z:9,name:'dây chằng tàu',verb:'Buộc ',h:1.2,r:2.2});
  CQ.addInter({id:'sailor2',P:sail2,name:'bác thủy thủ',verb:'Hỏi ',h:2.1,r:2.3});
  CQ.addInter({id:'paul',P:paul,name:'Phao-lô',h:2.1,r:2.4});
  CQ.addInter({id:'basket',obj:basket,x:1.6,z:1.8,name:'giỏ bánh',verb:'Chia bánh ở ',h:1.2,r:2.2});
  CQ.addInter({id:'anchor',obj:anchor,x:-2.4,z:10.6,name:'chiếc neo',verb:'Nhìn ',h:1.8,r:2.4});
  CQ.addInter({id:'julius',P:julius,name:'thầy đội Giu-lơ',h:2.15,side:1,run:d=>CQ.say('Giu-lơ','Cứ ở yên trên tàu. Phao-lô nói thì đừng ai sợ nữa nhé.','Theo Công vụ 27:31','Dạ!',d)});
  CQ.addInter({id:'sailor1',P:sail1,name:'thủy thủ trẻ',h:2.1,side:1,run:d=>CQ.say('Thủy thủ','Bác đi biển bao năm chưa gặp bão nào như vậy. Nhưng nghe Phao-lô nói, bác thấy yên lòng.','Theo Công vụ 27:20-25','Cố lên bác!',d)});
  CQ.goZone('A',.6,-6.6,0,null,true);
  const LC=[3.6,3.6,-8,0,1.6,-3];
  W.steps=[
   {at:'ropes',text:'Chạy ra mũi tàu giúp buộc dây chằng',run:n=>{CQ.setCine([5,3.8,12.5,1.6,1.3,8.6]);
     CQ.say('Ê-li','Cháu giữ dây giúp các bác thủy thủ ạ.','Theo Công vụ 27:17','Nào!',()=>
     CQ.tapFill({name:'Chằng dây',text:'Chạm thật nhanh để buộc các dây chằng giữ tàu không bị sóng lớn đánh vỡ.',need:12,onP:p=>{ropes.scale.set(1+p*.25,1+p*.5,1+p*.25);}},()=>{CQ.setCine(null);n();}));}},
   {at:'sailor2',text:'Nghe bác thủy thủ kể chuyện quăng hàng',run:n=>{CQ.setCine([-6.5,4,-1,-3,1.6,-5]);
     CQ.say('Người kể chuyện','Đến ngày mai, vì bão cứ thổi cũng mạnh như vậy luôn, họ bèn quăng hàng hóa xuống biển.','Theo Công vụ 27:18',null,()=>
     CQ.choice({name:'Giữ tàu nhẹ',q:'Họ làm gì để nhẹ tàu?',options:['Quăng hàng hóa xuống biển','Thêm nhiều hàng','Thả neo sâu nhất'],ref:'Công vụ 27:18',wrong:'Chưa đúng. Tàu nặng quá nên phải làm nhẹ bớt.'},()=>{cargo.visible=false;W.obstacles.length=Math.min(W.obstacles.length,30);CQ.setCine(null);n();}));}},
   {at:'paul',text:'Lại gần Phao-lô, nghe lời khích lệ',run:n=>{CQ.setCine([3.2,3,5,0,1.8,2.6]);CQ.face(paul,W.player.x,W.player.z);
     CQ.say('Phao-lô','Tôi tin Đức Chúa Trời, ai cũng được cứu, chẳng ai mất mạng.','Theo Công vụ 27:22-25','Amen!',()=>{CQ.setCine(null);n();});}},
   {at:'paul',text:'Nghe Phao-lô khuyên mọi người ăn',run:n=>{CQ.setCine([3.2,3,5,0,1.8,2.6]);
     CQ.say('Phao-lô','Vậy, ta khuyên các ngươi hãy ăn, vì thật là rất cần cho sự cứu của các ngươi; và chẳng ai trong vòng các ngươi sẽ mất một sợi tóc trên đầu mình.','Công vụ 27:34',null,()=>
     CQ.fillWord({name:'Lời của Phao-lô',before:'Chẳng ai trong vòng các ngươi sẽ mất một sợi',answer:'tóc',after:' trên đầu mình.',options:['tóc','bánh','neo'],ref:'Công vụ 27:34',wrong:'Chưa đúng. Nghĩ xem Phao-lô nói về trên đầu.'},()=>{CQ.setCine(null);n();}));}},
   {at:'basket',text:'Chia bánh cho mọi người trên tàu',run:n=>{CQ.setCine([3.4,3.4,4.6,1.6,1.4,1.8]);
     CQ.say('Người kể chuyện','Nói như vậy rồi, người bèn lấy bánh, đứng trước mặt mọi người, tạ ơn Đức Chúa Trời rồi, thì bẻ ra và ăn.','Công vụ 27:35',null,()=>
     CQ.balance({name:'Chia bánh',text:'Chia bánh cho cân bằng giữa thủy thủ và hành khách. Mọi người đều có phần.',secs:6,onP:p=>{loaves.forEach((l,i)=>{l.visible=i>=Math.floor(p*5);});}},()=>{loaves.forEach(l=>l.visible=true);CQ.setCine(null);n();}));}},
   {at:'anchor',text:'Ra mũi tàu, xem đất liền hiện ra',run:n=>{CQ.setCine([-4.8,4,7,-2.4,1.8,12]);
     CQ.lines([['Người kể chuyện','Người biết bơi nhảy xuống trước, người khác bám ván và mảnh tàu. Cả hai trăm bảy mươi sáu người đều lên được bờ.','Theo Công vụ 27:43-44']],()=>{CQ.setCine(null);n();});}}];
 }});
