/* Chapter 4: Capernaum, the calling of the fishermen. Morning, because Simon says they have toiled all night (Luke 5:5). */
'use strict';
CQ.chapters.push({id:'ch4',no:4,title:'Ca-bê-na-um',sub:'Bờ biển Ga-li-lê · buổi sáng, sau một đêm đánh cá (Lu-ca 5:5)',
 intro:[
  {t:'Làng chài bên biển',x:'Ca-bê-na-um là một làng chài ở bờ bắc biển Ga-li-lê. Nhà xây bằng đá bazan đen, mái phẳng. Đây là quê của Ê-li.',cam:[58,22,40,8,2,-4]},
  {t:'Thầy giảng từ trên thuyền',x:'Đoàn dân chen nhau đến nghe đạo Đức Chúa Trời. Chúa Giê-su lên thuyền của Si-môn, xin ông chèo ra khỏi bờ một chút, rồi ngồi mà dạy dỗ dân chúng.',ref:'Theo Lu-ca 5:1-3',cam:[2,3,12,12,1.5,19]}],
 outro:'Họ đem thuyền vào bờ, bỏ hết thảy mà theo Ngài.',outroRef:'Theo Lu-ca 5:11',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,boxUV,M}=CQ;
  W.tod='morning';W.startYaw=3.6;W.menuCam={x:10,y:2,z:2,r:58,h:20};
  const shoreZ=x=>18+5*Math.sin(x*0.045)+3*Math.sin(x*0.11+1);
  W.paths=[[[10,21],[8,2],[3,-12],[0,-25]],[[1,-20],[-30,-34],[-60,-44],[-76,-46]],[[8,6],[22,12],[30,14]]];
  const H=(x,z)=>{const d=shoreZ(x)-z;if(d<0)return Math.max(-4,d*0.14);let y=1.2*sm(0,9,d)+Math.max(0,d-9)*0.03;y+=sm(45,135,d)*(15+8*noise(x,z));y+=sm(10,40,d)*0.35*noise(x*2.3,z*2.3);const hd=Math.hypot(x+76,z+46);return y+10*Math.exp(-hd*hd/950);};
  const sandW=C('#b9a67c'),sand=C('#dcc48f'),g1=C('#86c043'),g2=C('#a8cf52'),g3=C('#93a857'),dirt=C('#dcc69a');
  CQ.terrain({H,color:(x,z,y,c)=>{const d=shoreZ(x)-z;if(d<0){c.copy(sandW);return;}c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(g3,sm(50,120,d)*.8);c.lerp(sand,1-sm(4,11,d+noise(x*4,z*4)));c.lerp(dirt,(1-sm(1.2,3.2,CQ.distPath(x,z)))*sm(3,9,d)*.9);}});
  CQ.sky({});CQ.water({lake:true,deep:3.5});

  [[16,-4,7,6,3.3,.1,{plaster:1,awning:-1.2,roofJars:1}],[25,-10,6,7,3.0,-.05,{mat:'#b5483a'}],[15,-14,6,5,2.8,.2,{plaster:1,doorX:1}],
   [-8,-6,7,6,3.2,-.15,{roofJars:1,mat:'#3f6f9a'}],[-17,-12,6,6,3.0,.1,{plaster:1}],[-9,-18,6,5,2.8,0,{doorX:-1}],
   [29,-22,7,6,3.2,.3,{plaster:1,mat:'#d9a441'}],[12,-26,6,6,3.0,-.1,{}],[-23,-21,7,5,3.0,.15,{plaster:1,roofJars:1}],
   [35,-3,6,5,2.8,-.2,{awning:1}],[-27,-2,6,5,2.8,.25,{}],[-7,6,8,7,3.3,.06,{plaster:1,awning:1.6,roofJars:1,mat:'#b5483a'}],[38,-15,6,6,3,.1,{plaster:1}]
  ].forEach(a=>CQ.house.apply(null,a));
  /* 1st-century basalt synagogue facing the lake */
  const SY={x:0,z:-36,pw:15,pd:19,ph:.9},sy0=H(SY.x,SY.z+SY.pd/2)-.25,sg=new T.Group();sg.position.set(SY.x,sy0,SY.z);W.scene.add(sg);
  W.platforms.push({x0:SY.x-SY.pw/2,x1:SY.x+SY.pw/2,z0:SY.z-SY.pd/2,z1:SY.z+SY.pd/2,top:sy0+SY.ph});
  mesh(boxUV(SY.pw,SY.ph+3,SY.pd,2.6),M.basalt,0,(SY.ph-3)/2,0,sg);
  for(let i=0;i<3;i++)mesh(boxUV(7,(SY.ph/3)*(3-i),.6,2.6),M.basalt,0,(SY.ph/3)*(3-i)/2,SY.pd/2+.3+i*.6,sg);
  const hw=11,hd=13,hh=6.2,hz=-1.6;mesh(boxUV(hw,hh,hd,2.6),M.basalt,0,SY.ph+hh/2,hz,sg);mesh(new T.BoxGeometry(hw+.8,.4,hd+.8),M.mud,0,SY.ph+hh+.2,hz,sg);
  for(let i=0;i<4;i++){const x=-4.2+i*2.8,z=hz+hd/2+1.7;mesh(new T.CylinderGeometry(.36,.42,4.4,12),toon('#6f6a62'),x,SY.ph+2.2,z,sg);mesh(new T.BoxGeometry(1,.3,1),toon('#7d776e'),x,SY.ph+4.55,z,sg);W.circles.push({x:SY.x+x,z:SY.z+z,r:.6});}
  mesh(boxUV(10.4,.7,1.3,2.6),M.basalt,0,SY.ph+5.05,hz+hd/2+1.7,sg);mesh(new T.BoxGeometry(10.8,.3,2.6),M.mud,0,SY.ph+5.55,hz+hd/2+1.1,sg);
  mesh(new T.BoxGeometry(2,3.3,.2),M.dark,0,SY.ph+1.65,hz+hd/2+.03,sg);mesh(new T.BoxGeometry(2.7,.36,.4),toon('#7d776e'),0,SY.ph+3.45,hz+hd/2+.1,sg);
  W.obstacles.push({x:SY.x,z:SY.z+hz,w:hw+.4,d:hd+.4,rot:0,ox:0});
  /* basalt jetty */
  const JET={x0:8.4,x1:11.6,z0:19,z1:39,top:.6};W.platforms.push(JET);
  for(let z=JET.z0;z<JET.z1;z+=2)mesh(boxUV(rr(3,3.5),3.2,2.06,2.6),M.basalt,10+rr(-.12,.12),JET.top-1.6-rr(0,.05),z+1);
  for(const p of[[8.7,24],[11.3,30],[8.7,37]])mesh(new T.CylinderGeometry(.13,.15,1.5,7),M.woodD,p[0],JET.top+.5,p[1]);

  const boatG=CQ.boat(19.5,21.2,.35,{y:.25,tilt:.16});CQ.boat(4.6,33,1.45,{float:1});CQ.boat(-34,62,.5,{float:1,sail:1,far:1,sailing:1});CQ.boat(60,70,-.4,{float:1,sail:1,far:1,sailing:1});
  const rack=new T.Group();rack.position.set(26,H(26,16.5),16.5);rack.rotation.y=.35;W.scene.add(rack);
  for(const x of[-2.4,0,2.4])mesh(new T.CylinderGeometry(.05,.06,2.4,6),M.wood,x,1.2,0,rack);mesh(new T.CylinderGeometry(.04,.04,5.2,6),M.wood,0,2.35,0,rack).rotation.z=Math.PI/2;
  const ng=new T.PlaneGeometry(4.8,2.1,26,10),np=ng.attributes.position;for(let i=0;i<np.count;i++){const v=(1.05-np.getY(i))/2.1;np.setZ(i,Math.sin(np.getX(i)*2.2)*.12*v+v*v*.55);}
  const net=new T.Mesh(ng,new T.MeshBasicMaterial({color:'#7a6a4a',wireframe:true,transparent:true,opacity:.8}));net.position.y=1.3;rack.add(net);W.circles.push({x:26,z:16.5,r:1.3});
  const fishM=toon('#b9c9d6');
  const basket=(x,z,n)=>{const y=CQ.G(x,z);mesh(new T.CylinderGeometry(.42,.32,.42,12,1,true),toon('#c9a15c',{side:T.DoubleSide}),x,y+.21,z);const fs=[];
    for(let i=0;i<n;i++){const f=mesh(new T.SphereGeometry(.16,8,6),fishM,x+rr(-.18,.18),y+.36+rr(0,.06),z+rr(-.18,.18));f.scale.set(1.5,.35,.6);f.rotation.y=R()*6;fs.push(f);}W.circles.push({x,z,r:.5});return fs;};
  basket(10,23,5);const catchF=basket(15.2,19.2,7).concat(basket(16.2,18.3,7));catchF.forEach(f=>f.visible=false);
  [[13,2.5,1],[-2.5,9.8,.9],[20.5,-6.5,1],[-13,-4,.8],[9,-21,1]].forEach(j=>{CQ.jar(null,j[0],H(j[0],j[1]),j[1],j[2]*1.3);W.circles.push({x:j[0],z:j[1],r:.45});});
  {const x=4,z=-4,y=H(x,z);mesh(new T.CylinderGeometry(1.25,1.35,.5,20),toon('#58544f'),x,y+.25,z);mesh(new T.CylinderGeometry(.5,.95,.9,16),toon('#6a655f'),x,y+.95,z);W.circles.push({x,z,r:1.5});}

  [[2,14,1],[-3,16.5,1.15],[30,9,1.1],[33,11,.9],[-14,9,1.05],[41,3,1.2],[-20,13,1],[7,-8,.95],[22,-17,1.05],[-32,6,1.1],[46,12,1],[-4,-24,1]].forEach(p=>CQ.palm(p[0],p[1],p[2]));
  [[-40,-18],[-48,-28],[-55,-20],[-62,-36],[-70,-30],[-84,-40],[-58,-52],[-72,-58],[-45,-44],[45,-22],[52,-30],[44,-36],[20,-36],[-30,-14],[58,-12]].forEach(p=>CQ.olive(p[0],p[1],rr(.9,1.3)));CQ.olive(-76,-46,1.9);
  const onLand=(x,z)=>shoreZ(x)-z>9&&CQ.distPath(x,z)>2.2;
  CQ.scatter(2600,new T.ConeGeometry(.09,.3,4),toon('#5f9e34'),()=>{const x=rr(-110,110),z=rr(-110,12);if(!onLand(x,z))return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(700,new T.SphereGeometry(.11,6,5),toon('#e2402f'),()=>{const x=(R()<.6?-70:rr(-100,100))+rr(-26,26),z=(R()<.6?-42:rr(-100,0))+rr(-22,22);if(!onLand(x,z))return 0;return[x,H(x,z)+.22,z,rr(.8,1.4)];});
  CQ.scatter(420,new T.ConeGeometry(.06,1.9,4),toon('#9db45a'),()=>{const x=(R()<.5?rr(-60,-8):rr(34,90))+rr(-2,2),z=shoreZ(x)+rr(-2.2,1.6);return[x,Math.max(H(x,z),0)+.8,z,rr(.7,1.4),1,rr(-.12,.12),rr(-.12,.12)];});
  CQ.scatter(60,new T.DodecahedronGeometry(.6,0),toon('#57534e'),()=>{const x=rr(-90,90),z=shoreZ(x)+rr(-4,7);if(Math.abs(x-10)<5||CQ.distPath(x,z)<2)return 0;return[x,H(x,z)+.1,z,rr(.4,1.5),rr(.5,.8)];},true);
  for(let i=0;i<7;i++)CQ.sheep(-60+rr(-10,10),-36+rr(-8,8));

  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),9.5,16.5,-2.4),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),16.6,20.2,-1.2);
  const wm=CQ.place(CQ.makeChar(Object.assign({jar:1},CQ.CAST.woman)),11.6,1.6,2.6);
  CQ.place(CQ.makeChar(CQ.CAST.elder),-56,-40,1.2);CQ.place(CQ.makeChar(CQ.CAST.man),24.2,18.6,.4);
  CQ.place(CQ.makeChar(CQ.CAST.man2),5.5,14.2,.9);CQ.place(CQ.makeChar(CQ.CAST.woman2),7.2,12.6,.7);CQ.place(CQ.makeChar(CQ.CAST.kid),4,13,.8);
  CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05});
  CQ.addInter({id:'peter',P:peter,name:'Si-môn Phi-e-rơ',h:2.05});
  CQ.addInter({id:'boat',obj:boatG,x:19.5,z:21.2,name:'thuyền của Si-môn',verb:'Lại gần ',h:3.4,r:4.4});
  CQ.addInter({id:'wm',P:wm,name:'bà Sa-lô-mê',h:2.3,side:1,run:d=>CQ.say('Bà Sa-lô-mê','Chào Ê-li! Cháu ra bờ biển đi, mọi người đang kéo đến nghe Thầy giảng đó.',null,'Đóng',d)});

  W.player=CQ.place(CQ.makeChar(CQ.CAST.eli),5,7,.6);
  W.steps=[
   {at:'jesus',text:'Ra bờ biển gặp Thầy',run:n=>CQ.say('Người kể chuyện','Giảng xong, Chúa Giê-su bảo Si-môn chèo thuyền ra chỗ nước sâu và thả lưới đánh cá.','Theo Lu-ca 5:4',null,n)},
   {at:'peter',text:'Hỏi chuyện Si-môn Phi-e-rơ',run:n=>CQ.fillWord({name:'Si-môn Phi-e-rơ',before:'Thưa thầy, chúng tôi đã làm suốt đêm không bắt được chi hết; dầu vậy, tôi cũng theo lời thầy mà thả',after:'.',options:['buồm','lưới','neo'],answer:'lưới',ref:'Lu-ca 5:5',wrong:'Chưa đúng. Người đánh cá thả gì xuống nước để bắt cá?'},n)},
   {at:'boat',text:'Lại gần thuyền, giúp Si-môn kéo lưới',run:n=>{CQ.setCine([12.5,3,26.5,18.5,.9,20]);
     CQ.tapFill({name:'Kéo lưới',text:'Lưới nặng trĩu cá! Chạm thật nhanh để giúp Si-môn kéo lưới lên thuyền.',need:22,onP:p=>catchF.forEach((f,i)=>f.visible=i<p*catchF.length)},()=>
     CQ.say('Người kể chuyện','Họ bắt được nhiều cá lắm, đến nỗi lưới gần đứt, phải gọi bạn ở thuyền khác đến giúp. Cá đầy cả hai chiếc thuyền.','Theo Lu-ca 5:6-7',null,()=>{CQ.setCine(null);n();}));}},
   {at:'jesus',text:'Quay lại gặp Thầy',run:n=>CQ.fillWord({name:'Chúa Giê-su',before:'Các ngươi hãy theo ta, ta sẽ cho các ngươi nên tay đánh lưới',after:'.',options:['cá','người','biển'],answer:'người',ref:'Ma-thi-ơ 4:19',wrong:'Chưa đúng. Thầy gọi những người đánh cá để họ đi tìm ai?'},()=>
     CQ.say('Người kể chuyện','Hai anh em liền bỏ lưới mà theo Ngài.','Ma-thi-ơ 4:20','Xong',n))}];
 }});
