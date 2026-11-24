/* Chapter 27 (Acts, part 2): Peter at the house of Cornelius, Acts 10:1-48. Peter's vision is on a flat roof in Joppa (Giốp-bê, 10:9),
   the rest at the officer's house in Caesarea (Sê-sa-rê). The text gives no hour for the whole story; the roof is set at midday ("khoảng giờ thứ sáu", 10:9)
   and the house at dusk. Quoted word for word (1925 text): Công vụ 10:34-35. Eli is a young man here. */
'use strict';
CQ.chapters.push({id:'cornelius',no:27,title:'Phi-e-rơ ở nhà Cọt-nây',sub:'Tin lành cho mọi dân · buổi chiều',
 intro:[
  {t:'Một đội trưởng kính sợ Chúa',x:'Tại Sê-sa-rê có đội trưởng Cọt-nây, người công bình, hay cầu nguyện và giúp người nghèo.',ref:'Theo Công vụ 10:1-2',cam:[58,5,30,60,2,6]},
  {t:'Thiên sứ hiện đến',x:'Một thiên sứ bảo Cọt-nây sai người đến Giốp-bê mời Phi-e-rơ. Cọt-nây liền sai hai đầy tớ đi.',ref:'Theo Công vụ 10:3-8',cam:[64,3.4,16,60,2,4]},
  {t:'Khăn lớn từ trời',x:'Trên mái nhà ở Giốp-bê, Phi-e-rơ thấy một tấm khăn lớn thả xuống chứa đủ loại thú. Ông bối rối về ý nghĩa.',ref:'Theo Công vụ 10:9-17',cam:[-3,7.4,7,0,6.2,0]}],
 outro:'Quả thật, ta biết Đức Chúa Trời chẳng hề vị nể ai.',outroRef:'Công vụ 10:34',
 build(W){
  const {T,R,rr,sm,C,noise,toon,mesh,M}=CQ;
  W.tod='day';W.startYaw=0;W.menuCam={x:60,y:3,z:6,r:34,h:14};
  W.paths=[[[40,26],[60,14],[60,-2]]];
  const sea=z=>z-36;
  const H=(x,z)=>{const d=sea(z);if(d>0)return Math.max(-4,-d*.22)+.6;return 1+.35*noise(x,z)+sm(70,120,-z)*9;};
  const g1=C('#a9bf5c'),g2=C('#c6c874'),sand=C('#e0cc98'),pave=C('#d9ccb0');
  CQ.terrain({H,color:(x,z,y,c)=>{const d=sea(z);c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(sand,sm(-12,-1,d));if(d>0)c.copy(sand);
    if(Math.abs(x-60)<13&&z>-8&&z<14)c.lerp(pave,.9);c.lerp(sand,(1-sm(1.6,3.6,CQ.distPath(x,z)))*.7);}});
  CQ.sky({fogNear:55,fogFar:200,clouds:6});CQ.water({deep:3.5});
  CQ.scatter(1500,new T.ConeGeometry(.09,.3,4),toon('#6fa23c'),()=>{const x=rr(-90,150),z=rr(-110,30);if(Math.abs(x-60)<14&&z>-9&&z<15)return 0;if(Math.abs(x)<7&&Math.abs(z)<6)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});

  /* A: Joppa, a flat roof with a vine trellis */
  const TX=0,TZ=0,TF=4.2;W.platforms.push({x0:TX-5,x1:TX+5,z0:TZ-4,z1:TZ+4,top:TF});
  mesh(CQ.boxUV(10,TF,8,2.6),M.lime,TX,TF/2,TZ);mesh(new T.BoxGeometry(10,.1,8),toon('#c9a877'),TX,TF+.02,TZ,null,false);
  mesh(CQ.boxUV(10,.9,.4,2.6),M.lime,TX,TF+.45,TZ-4.2);for(const s of[-1,1])mesh(CQ.boxUV(.4,.9,8.4,2.6),M.lime,TX+s*5.2,TF+.45,TZ);
  for(const x of[-3.6,3.6])for(const z of[-3,0])mesh(new T.CylinderGeometry(.07,.07,2.6,6),M.wood,x,TF+1.3,z);
  const tr=mesh(new T.PlaneGeometry(7.6,3.6),M.cloth,0,TF+2.65,-1.5);tr.rotation.x=-Math.PI/2;
  [[-14,-9,7,6,3.4,.3],[15,-8,8,6,3.8,-.3],[-17,11,6,6,3,1.2],[16,13,7,5,3.2,-1.2],[-6,-18,8,6,3.6,0]].forEach((a,i)=>CQ.house(a[0],a[1],a[2],a[3],a[4],a[5],{stone:'lime',plaster:i%2,roofJars:i%2===0}));
  [[-8,16],[9,18],[-24,2],[24,0]].forEach(p=>CQ.olive(p[0],p[1],rr(1,1.3)));
  const sheet=new T.Group();sheet.position.set(0,TF+6,0);W.scene.add(sheet);
  const cl=mesh(new T.PlaneGeometry(3.6,3.6),toon('#f4eedc',{side:T.DoubleSide}),0,0,0,sheet);cl.rotation.x=-Math.PI/2+.04;
  ['#c97b4f','#e6d3ab','#8d7656','#f4efe2','#b5483a','#6f86a8'].forEach((c,i)=>{const a=mesh(new T.SphereGeometry(.28,8,6),toon(c),-1.1+(i%3)*1.1,.22,-.8+Math.floor(i/3)*1.5,sheet);a.scale.set(1.3,.8,.9);});
  for(const [x,z] of[[-1.8,-1.8],[1.8,-1.8],[-1.8,1.8],[1.8,1.8]])mesh(new T.CylinderGeometry(.02,.02,5,4),toon('#fff6c8'),x*.55,2.6,z*.55,sheet,false).rotation.set(z*.04,0,-x*.04);
  const sL=new T.PointLight('#fff2c0',.8,14,1.5);sL.position.set(0,TF+4,0);W.scene.add(sL);let tt=0;W.tick.push(dt=>{tt+=dt;sheet.position.y=TF+4.6+.2*Math.sin(tt*1.3);sheet.rotation.y+=dt*.2;});
  const peter=CQ.place(CQ.makeChar(Object.assign({},CQ.CAST.peter,{hair:'#8a8a86'})),1.6,-1.2,-2.4);

  /* B: Caesarea, the officer's house with a paved courtyard open to the harbour */
  CQ.house(60,-14,16,7,4.2,0,{stone:'lime',plaster:1,doorX:0,roofJars:1,awning:3});
  for(const s of[-1,1])CQ.wallBox(60+s*13,-1,.7,2.2,22,0,M.lime);
  for(const x of[52,56,64,68]){mesh(new T.CylinderGeometry(.3,.34,3.4,10),M.lime,x,W.H(x,-9)+1.7,-9);W.circles.push({x,z:-9,r:.4});}
  [[48,16],[72,16]].forEach(p=>CQ.palm(p[0],p[1],1.1));[[42,-2],[78,-4]].forEach(p=>CQ.olive(p[0],p[1],1.2));
  const tw=mesh(new T.CylinderGeometry(1.5,2,10,12),M.lime,86,W.H(86,34)+3.5,34),lamp=mesh(new T.SphereGeometry(.7,10,8),new T.MeshBasicMaterial({color:'#ffd98a'}),86,W.H(86,34)+9,34,null,false);W.circles.push({x:86,z:34,r:2.2});
  CQ.boat(46,44,.4,{float:1,far:1});CQ.boat(78,50,-.5,{float:1,far:1});
  const lampL=new T.PointLight('#ffc878',.7,16,1.5);lampL.position.set(60,5.4,-8);W.scene.add(lampL);
  const mk=o=>CQ.makeChar(o);
  const corn=CQ.place(mk({skin:'#c08a5e',tunic:'#f1e7cf',hem:.4,mantle:'#9a2f3c',sash:'#d9a441',hair:'#2e2018',band:'#d9a441',W:1.1}),60,8,3.14);
  const sold=CQ.place(mk({skin:'#b9804f',tunic:'#b5483a',hem:.4,sash:'#3a2718',hair:'#241a13',band:'#b8bcc4',staff:1,W:1.1}),53,13,3.4);
  CQ.place(mk({skin:'#c08a5e',tunic:'#b5483a',hem:.4,sash:'#3a2718',hair:'#2e2018',band:'#b8bcc4',staff:1,W:1.1}),67,13,2.9);
  const serv=CQ.place(mk({skin:'#c99468',tunic:'#7d8a5c',hem:.4,sash:'#6b4a2f',hair:'#2e2018',jar:1}),66,3,-1.2);
  const bro1=CQ.place(mk(CQ.CAST.man),62.4,7,3.4),bro2=CQ.place(mk(CQ.CAST.man2),63.6,5.8,3.5);
  const gp=ring2(60,-3,9,3,4.6);function ring2(cx,cz,n,r0,r1){return CQ.ring(cx,cz,n,r0,r1,0,6.283);}
  const guests=[],fl=[],flm=new T.MeshBasicMaterial({color:'#ffd24a'});
  gp.forEach(p=>{const k=W.scene.children.length;CQ.crowd([p],{sit:1,noCol:1});const arr=W.scene.children.slice(k);arr.forEach(m=>m.visible=false);guests.push(arr);
    const f=mesh(new T.ConeGeometry(.14,.4,6),flm,p[0],W.H(p[0],p[1])+2.1,p[1],null,false);f.visible=false;fl.push(f);});
  W.tick.push(dt=>{fl.forEach((f,i)=>{if(f.visible)f.position.y=W.H(f.position.x,f.position.z)+2.1+.12*Math.sin(tt*3+i);});});
  const eliSpec=Object.assign({},CQ.CAST.eli,{S:.92,head:1.05});
  W.player=mk(eliSpec);

  CQ.zones({A:{c:[TX,TZ],rect:[4.5,3.5],tod:'day'},B:{c:[60,3],r:27,tod:'dusk'}});
  CQ.addInter({id:'peter',P:peter,name:'Phi-e-rơ',h:2.2,r:2.8});
  CQ.addInter({id:'corn',P:corn,name:'Cọt-nây',h:2.2,r:3});
  CQ.addInter({id:'sold',P:sold,name:'lính Rô-ma',h:2.2,side:1,run:d=>CQ.say('Người lính','Ông đội trưởng của chúng tôi là người kính sợ Đức Chúa Trời, hay cầu nguyện và giúp đỡ người nghèo.','Theo Công vụ 10:2','Hiểu rồi',d)});
  CQ.addInter({id:'serv',P:serv,name:'người đầy tớ',h:2.1,side:1,run:d=>CQ.say('Người đầy tớ','Chủ tôi nhận lời thiên sứ, sai tôi đi mời ông Phi-e-rơ. Nay ông đã đến, ai cũng vui mừng!','Theo Công vụ 10:7-8','Vui quá!',d)});
  CQ.goZone('A',-2.2,1.6,-.6,null,true);

  W.steps=[
   {at:'peter',text:'Trên mái nhà ở Giốp-bê. Lại gần bác Phi-e-rơ',run:n=>{CQ.setCine([-3.4,TF+2.6,3.6,1.2,TF+1.4,-1]);
     CQ.lines([['Ê-li','Bác Phi-e-rơ ơi, có người đến tìm bác.','Theo Công vụ 10:17-19'],['Phi-e-rơ','Thần Chúa bảo ta đi cùng họ, đừng nghi ngại.','Theo Công vụ 10:19-20']],()=>{CQ.setCine(null);n();});}},
   {text:'Lên đường',run:n=>CQ.say('Người kể chuyện','Phi-e-rơ cùng mấy anh em từ Giốp-bê đến thành Sê-sa-rê.','Theo Công vụ 10:23-24','Đi thôi!',()=>{sheet.visible=false;sL.visible=false;
     CQ.goZone('B',60,24,3.14,()=>{CQ.place(peter,58.4,6.4,.5);n();});})},
   {at:'corn',text:'Đội trưởng Cọt-nây ra đón. Lại gần ông',run:n=>{CQ.setCine([66,3.2,16,60,1.6,6]);
     CQ.say('Cọt-nây','Xin ông đến nhà tôi, chúng tôi muốn nghe điều Chúa dạy ông.','Theo Công vụ 10:25-33','Vâng',()=>{CQ.setCine([53,4.2,9,60,1.2,-3]);
     CQ.tapFill({name:'Mời khách',text:'Chạm vào các bạn bè và người nhà của Cọt-nây để mời họ cùng ngồi nghe.',need:9,onP:p=>guests.forEach((a,i)=>a.forEach(m=>m.visible=i<Math.round(p*9)))},()=>{CQ.setCine(null);n();});});}},
   {at:'peter',text:'Phi-e-rơ nói về Chúa. Lại gần nghe',run:n=>{CQ.setCine([54,3,8,59,2,5]);
     CQ.fillWord({name:'Phi-e-rơ',before:'Quả thật, ta biết Đức Chúa Trời chẳng hề',after:', nhưng trong các dân, hễ ai kính sợ Ngài và làm sự công bình, thì nấy được đẹp lòng Chúa.',options:['vị nể ai','yêu một dân','bỏ rơi ai'],answer:'vị nể ai',ref:'Công vụ 10:34-35',wrong:'Chưa đúng. Chúa yêu mọi người như nhau.'},()=>{CQ.setCine(null);n();});}},
   {at:'corn',text:'Cả nhà đang nghe. Lại gần Cọt-nây',run:n=>{fl.forEach(f=>f.visible=true);CQ.setCine([58,4.6,9,60,2.2,-3]);
     CQ.say('Người kể chuyện','Khi Phi-e-rơ còn đang nói, Đức Thánh Linh giáng xuống trên mọi người nghe lời, và họ ngợi khen Đức Chúa Trời.','Theo Công vụ 10:44-46',null,()=>
     CQ.choice({name:'Người kể chuyện',q:'Phi-e-rơ nhận ra điều gì?',options:['Chúa yêu thương mọi dân','Chỉ người Giu-đa mới được yêu','Chỉ có thiên sứ được Chúa yêu'],ref:'Công vụ 10:34-35',wrong:'Chưa đúng. Hãy nhớ lời Phi-e-rơ vừa nói.'},()=>{CQ.setCine(null);n();}));}},
   {at:'peter',text:'Cả nhà chịu báp-têm. Lại gần bác Phi-e-rơ',run:n=>{CQ.setCine([56,3.2,9,60,2,2]);
     CQ.lines([['Người kể chuyện','Phi-e-rơ bảo cho họ nhân danh Đức Chúa Giê-su Christ mà chịu báp-têm.','Theo Công vụ 10:47-48'],['Ê-li','Cháu mừng quá! Cả nhà bác Cọt-nây cùng tin Chúa!','Theo Công vụ 10:47-48']],()=>{CQ.setCine(null);n();});}}];
 }});
