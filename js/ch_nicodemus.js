/* Chapter: Nicodemus comes to Jesus by night (John 3:1-21). Night scene: "Ban đêm, người nầy đến cùng Đức Chúa Jêsus" (John 3:2).
   Quoted word for word (1925 text, checked): Giăng 3:3, 3:7, 3:16 (whole verse), 3:21 (first clause). */
'use strict';
CQ.chapters.push({id:'nico',no:6,title:'Ni-cô-đem',sub:'Một cuộc gặp ban đêm ở Giê-ru-sa-lem · ban đêm (Giăng 3:2)',
 intro:[
  {t:'Đêm ở Giê-ru-sa-lem',x:'Đêm đã khuya. Các con đường trong thành Giê-ru-sa-lem vắng lặng, chỉ còn vài ngọn đèn dầu và trời đầy sao.',ref:'Theo Giăng 3:2',cam:[-26,15,16,6,1,0]},
  {t:'Một người Pha-ri-si',x:'Có một người Pha-ri-si tên là Ni-cô-đem, một quan của dân Giu-đa. Ông muốn đến gặp Chúa Giê-su, và ông đến vào ban đêm.',ref:'Theo Giăng 3:1-2',cam:[-6.5,4,1.2,-3.5,1.4,9.6]}],
 outro:'Đức Chúa Trời yêu thương thế gian, nên đã ban Con một của Ngài. Ai làm theo lẽ thật thì đến cùng sự sáng.',outroRef:'Theo Giăng 3:16-21',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='night';W.startYaw=-1.57;W.menuCam={x:4,y:2,z:0,r:34,h:16};
  const H=(x,z)=>{const r=Math.hypot(x-4,z);return 1+.3*noise(x,z)*sm(22,36,r)+sm(50,140,r)*14;};
  const st=C('#cdb98f'),g1=C('#9aa860'),g2=C('#b4b06c');
  CQ.terrain({H,color:(x,z,y,c)=>{c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(st,1-sm(26,32,Math.hypot(x-4,z)+noise(x*3,z*3)*2));}});
  CQ.sky({fogNear:45,fogFar:170,clouds:4});
  /* the street: lime houses on both sides, a few windows still lit */
  const lit=new T.MeshBasicMaterial({color:'#ffc870'});
  [-15,-7,1,9].forEach((x,i)=>{CQ.house(x,-6.5,7,6,3.2+(i%2)*.4,0,{stone:'lime',plaster:i%2,winMat:i%2?lit:null,roofJars:i===2});
    if(i!==1)CQ.house(x+.5,6.5,7,6,3+(i%2)*.5,Math.PI,{stone:'lime',plaster:(i+1)%2,winMat:i===2?lit:null,mat:i===0?'#b5483a':null});});
  CQ.house(-3.5,12.6,6,5,3,Math.PI,{stone:'lime',stair:false});[-24,-16,-8,0,8].forEach((x,i)=>CQ.house(x,-15,7,6,3.4,0,{stone:'lime',plaster:i%2,stair:false}));
  [[-26,9],[11.5,10.6]].forEach(p=>CQ.olive(p[0],p[1],1));
  /* the courtyard where Jesus is staying: low walls, a house with a flat roof, lamp stands still dark */
  CQ.wallBox(20,-7.4,13,1.2,.5,0,M.lime);CQ.wallBox(20,7.4,13,1.2,.5,0,M.lime);CQ.house(30,0,7,9,3.4,-1.57,{stone:'lime',plaster:1,winMat:lit,roofJars:1});
  mesh(new T.BoxGeometry(2.4,.45,.6),M.lime,23,H(23,-3)+.22,-3.2);W.obstacles.push({x:23,z:-3.2,w:2.4,d:.6,rot:0,ox:0});
  const flameOf=(x,z,parent,on)=>{const m=new T.MeshBasicMaterial({color:on?'#ffd27a':'#3a2a1a'}),g=new T.Group();g.position.set(x,parent?0:H(x,z),z);(parent||W.scene).add(g);
    mesh(new T.CylinderGeometry(.12,.08,.08,10),M.clay,0,0,0,g);const f=new T.Mesh(new T.SphereGeometry(.05,8,6),m);f.scale.y=1.8;f.position.set(.09,.08,0);g.add(f);return{g,m};};
  const tl=flameOf(22.2,-3.2,null,1);tl.g.position.y=H(22,-3)+.5;const tL=new T.PointLight('#ffb86a',.9,10,1.6);tL.position.set(22.2,H(22,-3)+1.3,-3);W.scene.add(tL);
  const lamps=[[15,-6.3],[20,-6.5],[25,-6.3],[15,6.3],[20,6.5],[25,6.3]].map(p=>{const y=H(p[0],p[1]);mesh(new T.CylinderGeometry(.12,.16,1.1,8),M.lime,p[0],y+.55,p[1]);W.circles.push({x:p[0],z:p[1],r:.3});
    const l=flameOf(p[0],p[1],null,0);l.g.position.y=y+1.14;return l;});
  const LL=[[17,-5],[23,5]].map(p=>{const L=new T.PointLight('#ffc070',0,18,1.5);L.position.set(p[0],H(p[0],p[1])+2,p[1]);W.scene.add(L);return L;});
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),23,-2,-1.4);
  /* Nicodemus: a Pharisee, with a small oil lamp */
  const nico=CQ.place(CQ.makeChar({skin:'#c08a5e',tunic:'#3f4f78',mantle:'#e6d9b4',tassel:'#3f6f9a',sash:'#d9a441',hair:'#bdb6a8',beard:2,band:'#e6d9b4'}),-3.5,9.6,3.1);
  flameOf(0,0,nico.arms[1],1).g.position.set(0,-.7,.12);const nL=new T.PointLight('#ffb86a',1.1,10,1.6);nL.position.set(.3,1.2,.4);nico.g.add(nL);
  const lady=CQ.place(CQ.makeChar(CQ.CAST.woman2),-10.5,3.2,2.6);
  W.player=CQ.makeChar(CQ.CAST.eli);
  CQ.zones({A:{c:[4,0],r:26,tod:'night'}});
  CQ.addInter({id:'lady',P:lady,name:'bà cụ',h:2,side:1,run:d=>CQ.say('Bà cụ','Khuya rồi đó cháu. Đường tối lắm, cháu đi chậm thôi, nhớ nhìn theo ánh đèn nhé!',null,'Dạ',d)});
  CQ.addInter({id:'nico',P:nico,name:'người cầm đèn',h:2.05,r:2.4});
  CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',h:2.05,r:3});
  CQ.addInter({id:'lamp',obj:lamps[0].g,x:15,z:-6.3,name:'cây đèn',verb:'Thắp ',h:1.6,r:2.2});
  CQ.goZone('A',-17,0,-1.57,null,true);
  const JC=[19.6,3.8,5.2,21,1.5,-.6];
  W.steps=[
   {at:'nico',text:'Trong đêm tối, tìm người đang cầm một ngọn đèn nhỏ',run:n=>CQ.lines([
      ['Ni-cô-đem','Chào cháu. Ta là Ni-cô-đem, một người Pha-ri-si. Ta muốn gặp thầy Giê-su, nên ta đến vào ban đêm.','Theo Giăng 3:1-2'],
      ['Ê-li','Thầy đang ở trong cái sân cuối đường. Ông đi theo cháu nhé!',null]],()=>{CQ.walkTo(nico,-3.5,1,2.2,()=>CQ.walkTo(nico,18,1.4,2.4,()=>CQ.face(nico,23,-2)));n();})},
   {at:'jesus',text:'Đi cùng Ni-cô-đem đến sân nhà cuối đường',run:n=>{nico.dest=null;CQ.place(nico,18.6,1.2);CQ.face(nico,23,-2);CQ.face(jesus,18.6,1.2);CQ.setCine(JC);
     const seven=()=>CQ.fillWord({name:'Chúa Giê-su',before:'Chớ lấy làm lạ về điều ta đã nói với ngươi: Các ngươi phải sanh',after:'.',options:['lại','ra','mau'],answer:'lại',ref:'Giăng 3:7',wrong:'Chưa đúng. Chúa nói về một sự sống mới, được sanh thêm một lần nữa.'},()=>{CQ.setCine(null);n();});
     CQ.lines([['Ni-cô-đem','Thưa thầy, chúng tôi biết thầy là giáo sư từ Đức Chúa Trời đến, vì không ai làm được những phép lạ thầy làm, nếu Đức Chúa Trời chẳng ở cùng người ấy.','Theo Giăng 3:2'],
       ['Chúa Giê-su','Quả thật, quả thật, ta nói cùng ngươi, nếu một người chẳng sanh lại, thì không thể thấy được nước Đức Chúa Trời.','Giăng 3:3'],
       ['Ni-cô-đem','Một người đã già rồi, làm sao có thể sanh lại được?','Theo Giăng 3:4'],
       ['Người kể chuyện','Chúa Giê-su giải thích: đó là được sanh bởi nước và Thánh Linh, một sự sống mới đến từ Đức Chúa Trời.','Theo Giăng 3:5-6']],seven);}},
   {text:'Nghe Chúa Giê-su nói về tình yêu của Đức Chúa Trời',run:n=>{CQ.setCine([18,4.6,6,22.6,1.4,-2]);
     CQ.say('Người kể chuyện','Rồi Chúa Giê-su nói cho Ni-cô-đem biết Đức Chúa Trời yêu thương mọi người biết bao.','Theo Giăng 3:16',null,()=>
     CQ.order({name:'Chúa Giê-su',q:'Ghép lại câu Kinh Thánh nổi tiếng này theo đúng thứ tự.',chunks:['Vì Đức Chúa Trời yêu thương thế gian,','đến nỗi đã ban Con một của Ngài,','hầu cho hễ ai tin Con ấy','không bị hư mất mà được sự sống đời đời.'],ref:'Giăng 3:16'},()=>
     CQ.say('Chúa Giê-su','Nhưng kẻ nào làm theo lẽ thật thì đến cùng sự sáng.','Giăng 3:21','Thắp đèn lên!',()=>{CQ.setCine(null);n();})));}},
   {at:'lamp',text:'Thắp sáng các cây đèn quanh sân',run:n=>{CQ.setCine([10.5,7.5,0,21,1,0]);
     CQ.tapFill({name:'Thắp đèn',text:'Sự sáng đã đến thế gian. Chạm thật nhanh để thắp sáng các cây đèn quanh sân!',need:18,onP:p=>{lamps.forEach((l,i)=>l.m.color.set(p>=(i+1)/6.5?'#ffd27a':'#3a2a1a'));LL.forEach(L=>L.intensity=p*.55);}},()=>
     CQ.say('Người kể chuyện','Cả sân sáng rực lên. Ni-cô-đem lặng lẽ suy nghĩ về những lời Chúa Giê-su đã nói với ông đêm hôm ấy.','Theo Giăng 3:19-21','Xong',()=>{CQ.setCine(null);n();}));}}];
 }});
