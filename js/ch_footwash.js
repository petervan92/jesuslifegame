/* Chapter: Jesus washes the disciples' feet (John 13:1-17, 34-35). Evening: "Đương bữa ăn tối" (John 13:2),
   so the night preset with warm lamp light. The upper room is built like zone B of ch7_jerusalem.js, a little larger.
   The player fetches the water jar and carries the basin; Jesus himself pours, washes and wipes with his towel (13:5). */
'use strict';
CQ.chapters.push({id:'footwash',no:16,title:'Thầy rửa chân cho môn đồ',sub:'Phòng cao, bữa ăn tối',
 intro:[
  {t:'Trước ngày lễ Vượt Qua',x:'Chúa Giê-su biết giờ Ngài về cùng Đức Chúa Cha đã gần đến. Ngài yêu các môn đồ, và yêu họ cho đến cuối cùng.',ref:'Theo Giăng 13:1',cam:[0,15,15,0,6.3,-1]},
  {t:'Bữa ăn tối',x:'Buổi tối, Thầy và các môn đồ ngồi quanh một cái bàn thấp trong một phòng cao. Ê-li được ở đó để giúp việc.',ref:'Theo Giăng 13:2',cam:[6,10.5,7,0,6.4,-1.8]}],
 outro:'Chúa Giê-su là Chúa và là Thầy, mà Ngài đã cúi xuống phục vụ. Ngài dạy chúng ta hãy yêu thương và giúp đỡ lẫn nhau.',outroRef:'Theo Giăng 13:14-15, 34-35',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,boxUV,M}=CQ;
  W.startYaw=0;W.tod='night';W.menuCam={x:0,y:6,z:0,r:30,h:10};
  const H=(x,z)=>2+.4*noise(x,z);
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(C('#a9b06a')).lerp(C('#d8c9a2'),.5+.5*noise(x*1.3,z*1.3));}});
  CQ.sky({fogNear:50,fogFar:190});
  [[-16,-14],[16,-12],[-18,10],[18,12],[-6,-22],[8,-24],[-28,0],[28,-2]].forEach((p,i)=>CQ.house(p[0],p[1],6,6,rr(3,5),rr(-.3,.3),{stone:'lime',stair:false,plaster:i%2}));
  [[-11,9],[11,10],[-10,-10]].forEach(p=>CQ.palm(p[0],p[1],1.1));

  /* the upper room: a raised floor with three walls and a low parapet on the south side */
  const FL=6;W.platforms.push({x0:-8,x1:8,z0:-6,z1:6,top:FL});
  mesh(boxUV(16,FL,12,2.6),M.lime,0,FL/2,0);mesh(new T.BoxGeometry(16,.1,12),toon('#c9a877'),0,FL+.02,0,null,false);
  mesh(boxUV(16,3.2,.5,2.6),M.lime,0,FL+1.6,-6.2);for(const s of[-1,1])mesh(boxUV(.5,3.2,12,2.6),M.lime,s*8.2,FL+1.6,0);mesh(boxUV(16,.7,.4,2.6),M.lime,0,FL+.35,6.1);
  mesh(new T.BoxGeometry(8,.36,1.6),M.wood,0,FL+.22,-1.4);W.obstacles.push({x:0,z:-1.4,w:8,d:1.6,rot:0,ox:0});
  for(let i=0;i<6;i++)mesh(new T.SphereGeometry(.2,8,6),toon('#d9a25a'),-2.8+i*1.1,FL+.48,-1.4+rr(-.35,.35)).scale.y=.5;
  for(const x of[-1.6,1.4])mesh(new T.CylinderGeometry(.13,.09,.26,10),M.clay,x,FL+.53,-1.2);
  for(const x of[-5,0,5]){const L=new T.PointLight('#ffc878',.55,13,1.5);L.position.set(x,FL+2.4,-2);W.scene.add(L);mesh(new T.SphereGeometry(.13,8,6),new T.MeshBasicMaterial({color:'#ffd98a'}),x,FL+2.3,-5.85,null,false);}
  const sideL=new T.PointLight('#ffb860',.35,10,1.5);sideL.position.set(5,FL+2,3);W.scene.add(sideL);
  /* props: water jar, basin, a stool */
  const roomJar=CQ.jar(null,-6.6,FL,4,1.5);W.circles.push({x:-6.6,z:4,r:.6});
  const basin=new T.Group();basin.position.set(5.8,FL,3.4);W.scene.add(basin);mesh(new T.CylinderGeometry(.5,.36,.32,16,1,true),toon('#b87333',{side:T.DoubleSide}),0,.16,0,basin);mesh(new T.CircleGeometry(.36,16).rotateX(-Math.PI/2),toon('#8a5a34'),0,.02,0,basin);
  const wat=mesh(new T.CircleGeometry(.44,16).rotateX(-Math.PI/2),toon('#7fc6e0',{emissive:'#2a5a7a',emissiveIntensity:.4}),0,.04,0,basin,false);wat.visible=false;
  mesh(new T.BoxGeometry(.7,.5,.7),M.woodD,6.9,FL+.25,-3.8);mesh(new T.BoxGeometry(.75,.06,.6),toon('#f4f0e4'),6.9,FL+.53,-3.8);

  /* people: Jesus, four named disciples on the south side of the table, the others as crowd */
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),0,-3,0);jesus.dy=-.35;
  const serve=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.jesus,{mantle:undefined,tassel:undefined,sash:'#f4f0e4',hem:.1})),0,-3,0);serve.g.visible=false;
  const towel=mesh(new T.CylinderGeometry(.33,.42,.28,16),toon('#f4f0e4'),0,.62,0,serve.g);
  const cast=[['Giăng',{skin:'#c99468',tunic:'#a5526a',hem:.3,sash:'#e9dcc0',hair:'#2a1d15'}],['Anh-rê',{skin:'#b9804f',tunic:'#5f8f7a',hem:.35,sash:'#dcae4f',hair:'#241a13',beard:1}],
    ['Gia-cơ',{skin:'#c08a5e',tunic:'#6f86a8',hem:.3,sash:'#b5483a',hair:'#3a281c',beard:1}],['Phi-e-rơ',CQ.CAST.peter]];
  const dis=cast.map((c,i)=>{const P=CQ.place(CQ.makeChar(c[1]),-3+i*2,.4,Math.PI);P.dy=-.35;return P;});
  CQ.crowd([[-3.4,-3,0],[-2,-3.1,0],[2,-3.1,0],[3.4,-3,0],[-4.8,-1.4,1.57],[4.8,-1.4,-1.57],[-4.6,.4,3.14],[4.6,.4,3.14]],{sit:1});

  CQ.zones({A:{c:[0,0],rect:[7.4,5.4],tod:'night'}});
  CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:1.7,r:2.6,noTurn:1});
  CQ.addInter({id:'jar',obj:roomJar,x:-6.6,z:4,name:'vò nước',verb:'Mang ',h:1.6,r:2});
  CQ.addInter({id:'basin',obj:basin,x:5.8,z:3.4,name:'cái chậu',verb:'Đến bên ',h:1,r:2});
  const dI=dis.map((P,i)=>CQ.addInter({id:'d'+i,P,name:cast[i][0],verb:'Mang chậu đến ',h:1.7,r:2.2,noTurn:1}));
  Object.assign(dI[0],{side:1,run:d=>CQ.say('Giăng','Thầy yêu chúng tôi lắm. Thầy yêu những người thuộc về Ngài cho đến cuối cùng.','Theo Giăng 13:1',null,d)});
  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',-2,4.4,0,null,true);
  const carryJar=CQ.jar(W.player.g,0,.55,.42,.8),carryB=basin.clone();carryB.scale.setScalar(.7);carryB.position.set(0,.62,.5);W.player.g.add(carryB);carryJar.visible=carryB.visible=false;
  let fill=0;W.tick.push(dt=>{if(fill>0&&fill<1){fill=Math.min(1,fill+dt*.5);wat.position.y=.04+fill*.22;}});
  const kneelAt=(i,cb)=>{serve.dy=0;CQ.walkTo(serve,dis[i].x,dis[i].z+1.1,2.2,()=>{CQ.face(serve,dis[i].x,dis[i].z);serve.dy=-.32;if(cb)cb();});};
  const open=i=>{dI[i].hidden=false;CQ.marks();};

  W.steps=[
   {at:'jesus',text:'Bữa ăn tối đang diễn ra. Lại gần Thầy',run:n=>{CQ.setCine([3,FL+2.6,4.5,0,FL+.8,-2.6]);
     CQ.say('Người kể chuyện','Đương bữa ăn tối, Chúa Giê-su đứng dậy khỏi bàn, cởi áo ngoài ra, lấy khăn vấn ngang lưng mình.','Theo Giăng 13:2-4',null,()=>{jesus.g.visible=false;serve.g.visible=true;CQ.place(serve,0,-3.6,0);CQ.walkTo(serve,4.6,3.2,2.2,()=>CQ.face(serve,5.8,3.4));
     CQ.say('Người kể chuyện','Thầy cần nước để rửa chân cho các môn đồ. Hãy giúp Thầy: mang vò nước đến cái chậu.',null,null,()=>{CQ.setCine(null);n();});});}},
   {at:'jar',text:'Mang vò nước ở góc phòng',run:n=>{roomJar.visible=false;carryJar.visible=true;n();}},
   {at:'basin',text:'Mang vò nước đến bên cái chậu',run:n=>{carryJar.visible=false;CQ.jar(null,6.6,FL,2.6,1.1);wat.visible=true;fill=.01;CQ.movePlayer(3,1.9);CQ.setCine([1.6,FL+2.6,5.4,5.4,FL+.4,2.6]);
     CQ.say('Người kể chuyện','Kế đó, Ngài đổ nước vào chậu, và rửa chân cho môn đồ, lại lấy khăn mình đã vấn mà lau chân cho.','Giăng 13:5',null,()=>
     CQ.say('Người kể chuyện','Bạn hãy bưng chậu nước theo Thầy, đến với từng môn đồ.',null,'Bưng chậu',()=>{basin.visible=false;carryB.visible=true;[1,2,3].forEach(i=>dI[i].hidden=true);CQ.setCine(null);kneelAt(0);n();}));}},
   {collect:['d0','d1','d2','d3'],text:'Bưng chậu nước theo Thầy đến từng môn đồ',each:I=>{const i=+I.id[1];I.hidden=true;CQ.marks();serve.raise=.15;
      setTimeout(()=>{serve.raise=0;if(i<2)kneelAt(i+1,()=>open(i+1));else if(i===2)kneelAt(3,()=>open(3));},1600);},
    run:n=>{CQ.movePlayer(1.8,3.4);CQ.setCine([7,FL+2.4,2.2,2.6,FL+.6,.7]);serve.raise=0;
     CQ.lines([['Phi-e-rơ','Chúa ơi, Chúa lại rửa chân cho tôi sao?','Theo Giăng 13:6'],['Chúa Giê-su','Bây giờ ngươi chưa hiểu điều ta làm, nhưng về sau sẽ hiểu.','Theo Giăng 13:7'],
       ['Phi-e-rơ','Chúa sẽ chẳng rửa chân tôi bao giờ!','Giăng 13:8'],['Chúa Giê-su','Nếu ta không rửa cho ngươi, ngươi chẳng có phần chi với ta hết.','Giăng 13:8']],()=>
     CQ.choice({name:'Phi-e-rơ',q:'Phi-e-rơ muốn được ở cùng Thầy mãi mãi. Bây giờ ông thưa thế nào?',options:['Lạy Chúa, chẳng những rửa chân mà thôi, lại cũng rửa tay và đầu nữa!','Thôi, tôi xin về nhà.','Thầy hãy rửa cho người khác trước đi.'],ref:'Giăng 13:9',wrong:'Chưa đúng. Phi-e-rơ không muốn mất phần với Thầy đâu!'},()=>
     CQ.say('Người kể chuyện','Thầy rửa chân cho Phi-e-rơ và lau bằng khăn Ngài đã vấn. Rồi Ngài mặc áo lại và ngồi vào bàn.','Theo Giăng 13:10-12',null,()=>
     CQ.fade(()=>{serve.g.visible=false;jesus.g.visible=true;carryB.visible=false;basin.visible=true;CQ.setCine(null);CQ.movePlayer(1,3.6,0);n();}))));}},
   {at:'jesus',text:'Thầy đã ngồi lại vào bàn. Lại nghe Thầy dạy',run:n=>{CQ.setCine([1.5,FL+2.8,4.6,0,FL+.9,-2.6]);
     CQ.say('Chúa Giê-su','Các ngươi có hiểu điều ta đã làm cho các ngươi chăng? Ta đã làm gương cho các ngươi.','Theo Giăng 13:12-15',null,()=>
     CQ.order({name:'Chúa Giê-su',q:'Ghép lại lời Thầy dạy.',chunks:['Vậy, nếu ta là Chúa là Thầy,','mà đã rửa chân cho các ngươi','thì các ngươi cũng nên','rửa chân lẫn cho nhau.'],ref:'Giăng 13:14'},()=>
     CQ.say('Chúa Giê-su','Ta ban cho các ngươi một điều răn mới, nghĩa là các ngươi phải yêu nhau.','Giăng 13:34',null,()=>
     CQ.fillWord({name:'Chúa Giê-su',before:'Nếu các ngươi',after:', thì ấy là tại điều đó mà thiên hạ sẽ nhận biết các ngươi là môn đồ ta.',options:['giàu có','yêu nhau','mạnh mẽ'],answer:'yêu nhau',ref:'Giăng 13:35',wrong:'Chưa đúng. Hãy nhớ điều răn mới Thầy vừa ban.'},()=>{CQ.setCine(null);n();}))));}}];
 }});
