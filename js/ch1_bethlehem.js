/* Chapter 1: Bethlehem. Night scene, because the shepherds kept watch over their flock by night (Luke 2:8). */
'use strict';
CQ.chapters.push({id:'ch1',no:1,title:'Bết-lê-hem',sub:'Đồng cỏ ngoài thành · ban đêm (Lu-ca 2:8)',
 intro:[
  {t:'Chiếu chỉ của hoàng đế',x:'Hoàng đế Sê-sa Au-gút-tơ ra lệnh cho mọi người phải về quê mình để khai tên vào sổ. Giô-sép và Ma-ri đi một chặng đường dài từ Na-xa-rét về thành Bết-lê-hem.',ref:'Theo Lu-ca 2:1-5',cam:[34,24,-38,0,10,-74]},
  {t:'Không còn chỗ trọ',x:'Thành Bết-lê-hem đông nghịt người, nhà quán không còn chỗ. Ma-ri sanh con trai đầu lòng, lấy khăn bọc con và đặt nằm trong máng cỏ.',ref:'Theo Lu-ca 2:6-7',cam:[0,13,-58.5,0,10.6,-69]},
  {t:'Ngoài đồng, đêm hôm ấy',x:'Gần đó có mấy người chăn chiên thức đêm canh giữ bầy. Bạn là Na-than, cậu bé chăn chiên nhỏ tuổi nhất. Nhiều năm sau, Na-than sẽ kể lại đêm này cho con trai mình là Ê-li.',ref:'Theo Lu-ca 2:8',cam:[12,7,42,-2,2.5,20]}],
 outro:'Những người chăn chiên trở về, làm sáng danh và ngợi khen Đức Chúa Trời về mọi điều mình đã nghe và thấy.',outroRef:'Theo Lu-ca 2:20',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,boxUV,M}=CQ;
  W.tod='night';W.startYaw=0;W.menuCam={x:0,y:7,z:-34,r:62,h:20};
  W.paths=[[[0,14],[2,-12],[-3,-36],[0,-56],[0,-65]],[[-30,-66.5],[30,-66.5]]];
  const H=(x,z)=>{let y=2+1.6*noise(x,z)+.5*noise(x*2.3,z*2.3);const f=sm(60,24,Math.hypot(x,z-25));y+=(2.2+.3*noise(x*2,z*2)-y)*f*.75;
    const t=sm(-36,-60,z)*(1-sm(36,62,Math.abs(x)));y=y*(1-.85*t)+10*t;return y+sm(110,180,Math.hypot(x,z))*14;};
  const g1=C('#9db357'),g2=C('#b6bf64'),rock=C('#b9a67e'),dirt=C('#dccaa0');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));const t=sm(-44,-62,z)*(1-sm(36,62,Math.abs(x)));c.lerp(rock,t*.75);c.lerp(dirt,(1-sm(1.2,3.2,CQ.distPath(x,z)))*.9);}});
  CQ.sky({clouds:5,fogNear:60,fogFar:280});

  /* Bethlehem: pale Judean limestone houses on the ridge */
  const glow=new T.MeshBasicMaterial({color:'#2a2014'}),g0=C('#2a2014'),g1c=C('#ffd27a');
  const townL=new T.PointLight('#ffcf80',0,90,1.4);townL.position.set(0,H(0,-78)+12,-76);W.scene.add(townL);
  [[-14,-72,7,6,3.2,.1],[14,-73,7,6,3.2,-.1],[-26,-76,6,6,3,.2],[26,-78,6,6,3,-.15],[-12,-86,7,6,3.3,0],[13,-88,6,6,3,.1],[-31,-61,6,5,2.8,.3],[31,-62,6,5,2.8,-.25],[0,-94,8,6,3.4,0],[-40,-74,6,5,2.9,.1],[40,-72,6,6,3,-.1]]
   .forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',winMat:glow,roofJars:i%3===0,mat:i%4===1?'#b5483a':null,awning:i===0?1.4:0}));
  CQ.house(0,-78.5,10,7,3.8,0,{stone:'lime',winMat:glow,stair:false,doorX:3});
  /* the stable: an open lean-to with a stone manger */
  const sy=H(0,-69),st=new T.Group();st.position.set(0,sy,-69);W.scene.add(st);
  mesh(boxUV(7,3,.5,2.6),M.lime,0,1.2,-2.4,st);mesh(boxUV(.5,3,5,2.6),M.lime,-3.4,1.2,0,st);mesh(boxUV(.5,3,5,2.6),M.lime,3.4,1.2,0,st);
  const roof=mesh(new T.BoxGeometry(7.8,.22,5.8),M.mud,0,2.85,.2,st);roof.rotation.x=.06;
  for(const x of[-3.1,3.1])mesh(new T.CylinderGeometry(.1,.1,2.8,7),M.wood,x,1.3,2.6,st);mesh(new T.BoxGeometry(7.2,.18,.18),M.wood,0,2.68,2.6,st);
  mesh(new T.BoxGeometry(6.2,.06,4.4),M.hay,0,.05,0,st,false);
  W.obstacles.push({x:-3.4,z:-69,w:.6,d:5,rot:0,ox:0},{x:3.4,z:-69,w:.6,d:5,rot:0,ox:0},{x:0,z:-71.6,w:7,d:.8,rot:0,ox:0});
  const mg=new T.Group();mg.position.set(0,0,-.3);st.add(mg);
  mesh(new T.BoxGeometry(1.5,.5,.8),toon('#bfae8c'),0,.45,0,mg);mesh(new T.BoxGeometry(1.3,.14,.6),M.hay,0,.72,0,mg);
  for(const x of[-.55,.55])mesh(new T.BoxGeometry(.2,.3,.7),toon('#a8966f'),x,.15,0,mg);
  const baby=mesh(new T.SphereGeometry(.2,12,10),toon('#f6efdc',{emissive:'#c9b070',emissiveIntensity:.5}),.08,.88,0,mg);baby.scale.set(1.9,.8,.9);
  mesh(new T.SphereGeometry(.12,12,10),toon('#e2b48c'),-.36,.92,0,mg);
  const lamp=new T.PointLight('#ffd38a',1.5,16,1.6);lamp.position.set(0,2,.4);st.add(lamp);W.circles.push({x:0,z:-69.3,r:1.1});
  const mary=CQ.place(CQ.makeChar(CQ.CAST.mary),-1.5,-69.5,1.2),joseph=CQ.place(CQ.makeChar(CQ.CAST.joseph),1.7,-69.8,-1.1);
  const s1=CQ.sheep(-2.3,-67.6),s2=CQ.sheep(2.5,-67.9);s1.g.rotation.y=2.6;s2.g.rotation.y=-2.4;

  /* shepherds' field */
  CQ.campfire(-5,21);
  const elder=CQ.place(CQ.makeChar(CQ.CAST.elder),-3,22.4,2.4),sh2=CQ.place(CQ.makeChar(CQ.CAST.shepherd2),-7,22.6,1.2);
  for(let i=0;i<16;i++){const a=i/16*6.283;if(i===4)continue;const x=10+Math.cos(a)*4.6,z=27+Math.sin(a)*4.6;mesh(new T.DodecahedronGeometry(rr(.5,.7),0),toon('#8a8478'),x,H(x,z)+.25,z);W.circles.push({x,z,r:.6});}
  for(let i=0;i<5;i++)CQ.sheep(10+rr(-2.4,2.4),27+rr(-2.4,2.4));
  const lost=[[-26,8],[24,2],[30,36],[-20,44]].map((p,i)=>{const s=CQ.sheep(p[0],p[1]);CQ.addInter({id:'s'+i,obj:s.g,x:p[0],z:p[1],name:'chiên lạc',verb:'Dắt ',h:1.5,r:2.2,sheep:s,i});return s;});
  const movers=[];W.tick.push(dt=>{for(const m of movers){const p=m.g.position,gx=m.x-p.x,gz=m.z-p.z,d=Math.hypot(gx,gz);if(d>.2){const st=Math.min(d,5*dt);p.x+=gx/d*st;p.z+=gz/d*st;p.y=W.H(p.x,p.z)+Math.abs(Math.sin(p.x+p.z))*.12;m.g.rotation.y=Math.atan2(gx,gz);}}});

  [[-16,6],[18,18],[-30,30],[34,14],[6,50],[-10,-20],[14,-30],[-22,-44],[24,-46],[44,40],[-44,16],[-48,-30],[50,-20]].forEach(p=>CQ.olive(p[0],p[1],rr(.9,1.3)));
  const ok=(x,z)=>CQ.distPath(x,z)>2.2&&!(z<-58&&Math.abs(x)<48);
  CQ.scatter(2200,new T.ConeGeometry(.09,.3,4),toon('#7ea044'),()=>{const x=rr(-110,110),z=rr(-110,110);if(!ok(x,z))return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(70,new T.DodecahedronGeometry(.6,0),toon('#8a8478'),()=>{const x=rr(-100,100),z=rr(-100,100);if(!ok(x,z)||Math.hypot(x,z-25)<14)return 0;return[x,H(x,z)+.1,z,rr(.4,1.4),rr(.5,.8)];},true);

  /* angel and heavenly host, hidden until the sheep are home */
  const angel=CQ.place(CQ.makeChar(CQ.CAST.angel),0,11,0);angel.g.visible=false;angel.light.intensity=0;
  const host=new T.Group();host.visible=false;W.scene.add(host);const hm=new T.MeshBasicMaterial({color:'#fff3c0',fog:false});
  for(let i=0;i<14;i++){const a=i/14*6.283,m=new T.Mesh(new T.SphereGeometry(.38,10,8),hm);m.position.set(Math.cos(a)*10,13+Math.sin(i*2.1)*2.5,11+Math.sin(a)*7);host.add(m);
    for(const s of[-1,1]){const w=new T.Mesh(new T.SphereGeometry(.4,8,6),hm);w.scale.set(1,.5,.12);w.position.set(s*.5,.2,-.1);w.rotation.z=s*.6;m.add(w);}}
  W.tick.push((dt,tt)=>{host.rotation.y=Math.sin(tt*.4)*.25;host.position.y=Math.sin(tt*1.1)*.4;});

  const inn=CQ.place(CQ.makeChar(CQ.CAST.woman),-6.5,-63.5,.6);
  CQ.addInter({id:'inn',P:inn,name:'bà chủ quán',h:2.05,side:1,run:d=>CQ.say('Bà chủ quán','Nhà quán hết chỗ mất rồi cháu ạ. Có hai vợ chồng từ Na-xa-rét mới tới, bà đành để họ nghỉ tạm chỗ máng cỏ.','Theo Lu-ca 2:7','Đóng',d)});
  CQ.addInter({id:'elder',P:elder,name:'bác Giô-ách',h:2.05});
  CQ.addInter({id:'manger',obj:mg,x:0,z:-69.3,name:'máng cỏ',verb:'Lại gần ',h:2.2,r:3.6});

  W.player=CQ.place(CQ.makeChar(CQ.CAST.nathan),0,27,Math.PI);
  W.steps=[
   {at:'elder',text:'Hỏi chuyện bác chăn chiên bên đống lửa',run:n=>CQ.say('Bác Giô-ách','Na-than ơi, bốn con chiên đi lạc mất rồi! Đêm nay trời lạnh lắm. Cháu cầm gậy đi tìm chúng về chuồng giúp bác nhé.',null,'Vâng ạ!',n)},
   {collect:['s0','s1','s2','s3'],text:'Tìm chiên lạc, dắt về chuồng',each:I=>{movers.push({g:I.sheep.g,x:10+rr(-2,2),z:27+rr(-2,2)});I.hidden=true;},
    run:n=>CQ.say('Bác Giô-ách','Giỏi lắm, Na-than! Đủ cả bầy rồi. Lại đây sưởi ấm đi cháu.',null,'Tiếp',n)},
   {text:'Một thiên sứ hiện ra!',run:n=>{angel.g.visible=true;angel.light.intensity=1.6;CQ.setTod('glory');CQ.setCine([1.5,3.2,30,0,5.2,11]);CQ.face(elder,0,11);CQ.face(sh2,0,11);elder.raise=.35;sh2.raise=.35;
     const leave=()=>{angel.g.visible=false;angel.light.intensity=0;host.visible=false;CQ.setTod('night');CQ.setCine(null);elder.raise=0;sh2.raise=0;
       CQ.say('Bác Giô-ách','Chúng ta hãy tới thành Bết-lê-hem, xem việc đã xảy đến mà Chúa cho chúng ta hay.','Lu-ca 2:15','Đi thôi!',()=>{CQ.walkTo(elder,-2.2,-64.6,5.2);CQ.walkTo(sh2,2.4,-64.3,5);n();});};
     const song=()=>CQ.order({name:'Bài ca của thiên binh',chunks:['Sáng danh Chúa','trên các từng trời rất cao,','Bình an dưới đất,','ân trạch cho loài người!'],ref:'Lu-ca 2:14'},leave);
     const hostIn=()=>{host.visible=true;CQ.setCine([2,2.4,34,0,9,11]);CQ.say('Người kể chuyện','Bỗng có muôn vàn thiên binh hiện ra cùng thiên sứ, ngợi khen Đức Chúa Trời.','Theo Lu-ca 2:13',null,song);};
     const sign=()=>CQ.choice({name:'Thiên sứ',q:'Thiên sứ cho dấu gì để các người chăn chiên nhận ra Con Trẻ?',options:['Một con trẻ bọc bằng khăn, nằm trong máng cỏ','Một vị vua ngồi trong cung điện','Một ngôi nhà lớn nhất trong thành'],ref:'Lu-ca 2:12',wrong:'Chưa đúng. Đấng Cứu Thế sinh ra ở một nơi rất khiêm nhường.'},hostIn);
     const news=()=>CQ.fillWord({name:'Thiên sứ',before:'Đừng sợ chi; vì nầy, ta báo cho các ngươi một',after:', sẽ là một sự vui mừng lớn cho muôn dân.',options:['tin buồn','tin lành','giấc mơ'],answer:'tin lành',ref:'Lu-ca 2:10',wrong:'Chưa đúng. Thiên sứ nói đây là điều làm muôn dân vui mừng.'},sign);
     CQ.say('Người kể chuyện','Bỗng một thiên sứ của Chúa hiện đến, và sự vinh hiển của Chúa chói lòa chung quanh. Những người chăn chiên rất sợ hãi.','Theo Lu-ca 2:9',null,news);}},
   {at:'manger',text:'Theo đường mòn lên thành Bết-lê-hem, tìm máng cỏ',run:n=>{CQ.setCine([.6,sy+2.1,-62.6,0,sy+.9,-69.3]);CQ.face(elder,0,-69);CQ.face(sh2,0,-69);
     CQ.say('Người kể chuyện','Vậy, họ vội vàng đi đến đó, thấy Ma-ri, Giô-sép, và thấy con trẻ đang nằm trong máng cỏ.','Lu-ca 2:16',null,()=>{CQ.setCine([30,sy+16,-46,0,sy,-76]);
     CQ.tapFill({name:'Loan tin vui',text:'Những người chăn chiên kể lại cho mọi người điều thiên sứ đã nói về Con Trẻ. Chạm thật nhanh để tin vui thắp sáng cả thành Bết-lê-hem!',need:18,onP:p=>{glow.color.copy(g0).lerp(g1c,p);townL.intensity=p*2.2;}},()=>
     CQ.say('Người kể chuyện','Ai nấy nghe chuyện đều lấy làm lạ. Còn Ma-ri thì ghi nhớ mọi lời ấy và suy nghĩ trong lòng.','Theo Lu-ca 2:17-19','Xong',()=>{CQ.setCine(null);n();}));});}}];
 }});
