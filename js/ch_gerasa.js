/* Chapter: the far shore (Mark 5:1-20). The man among the tombs is set free; the pigs rush into the lake.
   No time of day is given, so the scene is set in daylight. Design note from the project owner: the man is not shown
   as frightening; his trouble is shown only as dark rings circling him, which leave him and go to the pigs.
   Quoted word for word (checked against the 1925 text): Mark 5:8, 5:9, 5:19; the phrase from 5:15 is used inside a 'Theo' line. */
'use strict';
CQ.chapters.push({id:'gerasa',no:10,title:'Bờ bên kia biển',sub:'Chúa Giê-su giải cứu người ở giữa mồ mả · ban ngày',
 intro:[
  {t:'Qua bờ bên kia',x:'Chúa Giê-su và các môn đồ đi thuyền qua bờ bên kia biển, đến miền Giê-ra-sê. Ở đó có sườn núi đá, có những ngôi mộ đục trong đá.',ref:'Theo Mác 5:1',cam:[-30,15,16,6,2,-6]},
  {t:'Một người khổ sở',x:'Có một người sống giữa các mồ mả. Không ai giữ được người, và người rất khổ sở. Nhưng hôm nay Chúa Giê-su đến tìm người ấy.',ref:'Theo Mác 5:2-5',cam:[-2,11,9,15,4,-4]}],
 outro:'Người ấy đi khắp xứ Đê-ca-bô-lơ, thuật lại những việc lớn Chúa Giê-su đã làm cho mình. Ai nấy đều lấy làm lạ.',outroRef:'Theo Mác 5:20',
 build(W){
  const {T,rr,sm,C,noise,toon,mesh}=CQ;
  const $dlg=document.getElementById('dlg');W.tod='day';W.startYaw=-.8;W.menuCam={x:4,y:3,z:-10,r:40,h:14};
  const sx=z=>-8+12*sm(-12,-38,z)+1.5*Math.sin(z*.07);
  const H=(x,z)=>{const d=x-sx(z);if(d<0)return Math.max(-4,d*.22);const k=.27+.26*sm(-16,-32,z);return .8*sm(0,5,d)+Math.max(0,d-6)*k+.3*noise(x*2.2,z*2.2)*sm(4,14,d);};
  const sand=C('#d8c08a'),g1=C('#8fb64e'),g2=C('#a9c160'),rock=C('#a89a7c'),bed=C('#b5a27a');
  CQ.terrain({H,color:(x,z,y,c)=>{const d=x-sx(z);if(d<0){c.copy(bed);return;}c.copy(g1).lerp(g2,.5+.5*noise(x*1.7,z*1.7));c.lerp(rock,sm(3,8,y)*.55*(.6+.4*noise(x*3,z*3)));c.lerp(sand,1-sm(2,6,d+noise(x*4,z*4)));}});
  CQ.sky({fogNear:60,fogFar:210});CQ.water({lake:true,deep:3.5});
  CQ.scatter(1800,new T.ConeGeometry(.09,.3,4),toon('#6a9e38'),()=>{const x=rr(-30,170),z=rr(-170,170);if(x-sx(z)<6)return 0;return[x,H(x,z)+.1,z,rr(.7,1.3)];});
  CQ.scatter(160,new T.DodecahedronGeometry(.6,0),toon('#9d8f74'),()=>{const x=rr(0,60),z=rr(-60,40);if(x-sx(z)<5)return 0;return[x,H(x,z)+.1,z,rr(.4,1.9),rr(.5,.8)];},true);
  [[30,8],[34,-14],[26,22],[40,0],[8,22]].forEach(p=>CQ.bush(p[0],p[1],rr(1,1.5)));

  /* the boat that has just landed, and the rock tombs on the hillside */
  CQ.boat(-12.8,3.5,0,{float:1});
  const tombs=[CQ.rockTomb(14,-6,-Math.PI/2),CQ.rockTomb(15,11,-Math.PI/2)];tombs.forEach(t=>{t.stone.position.x=2.4;});
  /* the herd of pigs feeding on the steep slope above the lake */
  const pk=toon('#d99a86'),pk2=toon('#c47f6e'),bodyG=new T.SphereGeometry(.42,10,8),headG=new T.SphereGeometry(.25,9,7),snG=new T.CylinderGeometry(.1,.11,.12,8),legG=new T.CylinderGeometry(.06,.05,.32,5),earG=new T.ConeGeometry(.08,.14,4);
  const pigs=[];for(let i=0;i<26;i++){const x=rr(10,26),z=rr(-41,-29),g=new T.Group();g.position.set(x,H(x,z),z);g.rotation.y=rr(0,6.28);W.scene.add(g);
    mesh(bodyG,pk,0,.5,0,g).scale.set(.9,.8,1.35);const hd=new T.Group();hd.position.set(0,.55,.55);g.add(hd);mesh(headG,pk,0,0,0,hd);mesh(snG,pk2,0,-.04,.24,hd).rotation.x=Math.PI/2;
    for(const s of[-1,1])mesh(earG,pk2,s*.13,.2,.02,hd).rotation.z=-s*.4;for(const lx of[-.2,.2])for(const lz of[-.3,.3])mesh(legG,pk2,lx,.16,lz,g);
    pigs.push({g,hd,x,z,ph:rr(0,6),sp:rr(4.5,6.5),run:0});}
  const herder=CQ.place(CQ.makeChar(CQ.CAST.shepherd2),28,-27,-2.2);

  /* the man among the tombs, and the same man after he is set free (hidden until then) */
  const man=CQ.place(CQ.makeChar({skin:'#b9804f',tunic:'#7c7262',hem:.35,hair:'#2e2018',hairLong:1,beard:1}),12.6,-6,-1.57);
  const man2=CQ.makeChar({skin:'#b9804f',tunic:'#f2ead6',hem:.3,sash:'#3a6ea5',mantle:'#8fa6c4',hair:'#2e2018',beard:1});man2.g.visible=false;
  const seat=mesh(new T.DodecahedronGeometry(.42,0),toon('#a89a7c'),2.8,H(2.8,-1.5)+.12,-1.5);seat.scale.set(1,.55,1);seat.visible=false;
  const jesus=CQ.place(CQ.makeChar(CQ.CAST.jesus),.4,-.8,1.4),peter=CQ.place(CQ.makeChar(CQ.CAST.peter),-7.2,6.5,.6),john=CQ.place(CQ.makeChar({skin:'#c99468',tunic:'#c97b5a',hem:.45,sash:'#3a6ea5',hair:'#2e2018'}),-6.4,-1.8,1.4);

  /* the dark rings: the only sign of the man's trouble */
  const dkM=new T.MeshBasicMaterial({color:'#2b2238',transparent:true,opacity:.62,depthWrite:false});
  const dk=new T.Group();W.scene.add(dk);const rings=[.55,.72,.62,.86,.98].map((r,i)=>{const m=new T.Mesh(new T.TorusGeometry(r,.045+i*.008,6,30),dkM);m.position.y=.7+i*.22;m.rotation.set(1.57+rr(-.5,.5),rr(-.5,.5),0);dk.add(m);return{m,sp:(i%2?1:-1)*rr(.6,1.1),tx:m.rotation.x};});
  const wisps=[];for(let i=0;i<6;i++){const w=new T.Mesh(new T.SphereGeometry(rr(.09,.16),8,6),dkM);dk.add(w);wisps.push(w);}
  let rm='man',loose=0,flyT=0,spin=0;const from=new T.Vector3(),herd=new T.Vector3(18,H(18,-35)+2.2,-35),tmp=new T.Vector3();
  W.tick.push((dt,tt)=>{spin+=dt*(1+loose*5+(rm!=='man'?1.5:0));const s=rm==='man'?1+loose*.9:rm==='fly'?1+flyT*1.8:2.8;
    if(rm==='man')dk.position.set(man.x,man.g.position.y,man.z);
    else if(rm==='fly'){flyT=Math.min(1,flyT+dt/2.6);dk.position.lerpVectors(from,herd,flyT);dk.position.y+=6*Math.sin(Math.PI*flyT);if(flyT>=1)rm='herd';}
    else if(rm==='herd'||rm==='go'){const live=pigs.filter(p=>p.g.visible);if(live.length){tmp.set(0,0,0);live.forEach(p=>tmp.add(p.g.position));tmp.divideScalar(live.length);dk.position.lerp(tmp.setY(tmp.y+1.6),Math.min(1,dt*2));}
      if(rm==='go'){dkM.opacity=Math.max(0,dkM.opacity-dt*.12);if(!live.length)dk.visible=false;}}
    dk.scale.setScalar(s);rings.forEach((r,i)=>{r.m.rotation.z=spin*r.sp;r.m.rotation.x=r.tx+Math.sin(tt*.7+i)*.15;});
    wisps.forEach((w,i)=>{const a=spin*(.9+i*.12)+i,rad=.75+.1*i+loose*.4;w.position.set(Math.cos(a)*rad,.5+i*.25+Math.sin(tt*2+i)*.1,Math.sin(a)*rad);});
    if(man2.g.visible)man2.legs.forEach(l=>l.rotation.x=-1.45);
    pigs.forEach(p=>{if(!p.g.visible)return;if(!p.run){p.hd.position.y=.5+Math.sin(tt*.9+p.ph)*.06;return;}
      p.x-=p.sp*dt;p.z+=Math.sin(p.ph)*dt*.5;const y=H(p.x,p.z);p.g.position.set(p.x,Math.max(y,-.9)+Math.abs(Math.sin(tt*14+p.ph))*.12,p.z);if(y<-.75)p.g.visible=false;});});

  CQ.zones({A:{c:[4,-2],r:23,tod:'day'}});
  CQ.addInter({id:'jesus',P:jesus,name:'Chúa Giê-su',verb:'Đi theo ',h:2.05,r:3});
  const mI=CQ.addInter({id:'man',P:man,name:'người đàn ông',verb:'Lại gần ',h:2.05,r:3,noTurn:1});
  CQ.addInter({id:'man2',P:man2,name:'người đã được giải cứu',h:2.05,r:3});
  CQ.addInter({id:'peter',P:peter,name:'Phi-e-rơ',side:1,h:2.05,run:d=>CQ.say('Phi-e-rơ','Chúng ta vừa qua biển xong. Em cứ ở gần Thầy nhé. Ở đâu có Thầy thì không có gì phải sợ.',null,null,d)});

  W.player=CQ.makeChar(CQ.CAST.eli);CQ.goZone('A',-2.5,5.5,-.8,null,true);
  W.steps=[
   {at:'jesus',text:'Thuyền vừa cập bờ. Lên bờ cùng Thầy',run:n=>{CQ.setCine([-6,4.5,9,7,1.6,-3]);
     const kneel=()=>{man.dy=-.32;CQ.face(man,jesus.x,jesus.z);CQ.face(jesus,man.x,man.z);CQ.say('Người kể chuyện','Người ấy chạy lại, quì xuống trước mặt Chúa Giê-su.','Theo Mác 5:6',null,()=>{CQ.setCine(null);n();});};
     CQ.say('Người kể chuyện','Chúa Giê-su vừa ra khỏi thuyền, thì có một người từ giữa các mồ mả đi ra, đến đón Ngài.','Theo Mác 5:2',null,()=>{CQ.setCine([-2,5,7,9,1.6,-3]);$dlg.style.display='none';
      CQ.walkTo(man,2.7,-1.3,3.8,kneel);});}},
   {at:'man',text:'Đứng gần Thầy và người đàn ông',run:n=>{CQ.setCine([1.2,3.4,5.6,2.2,1.4,-1.2]);
     const fly=()=>{CQ.setCine([-15,10,-12,12,3,-33]);from.copy(dk.position);rm='fly';flyT=0;
       setTimeout(()=>{pigs.forEach(p=>{p.run=1;p.g.rotation.y=-Math.PI/2;});CQ.walkTo(herder,60,-20,4.5);
        setTimeout(()=>{rm='go';CQ.say('Người kể chuyện','Bóng tối rời khỏi người ấy, đi vào bầy heo. Cả bầy chừng hai ngàn con chạy ào xuống dốc, nhào xuống biển và chìm hết. Những kẻ chăn heo chạy trốn vào thành.','Theo Mác 5:13-14',null,()=>{
         CQ.fade(()=>{man.g.visible=false;mI.hidden=true;CQ.place(man2,2.8,-1.5,-1.75);man2.dy=-.2;man2.g.visible=true;seat.visible=true;CQ.marks();});setTimeout(()=>{CQ.setCine(null);n();},500);});},3600);},2900);};
     const free=()=>CQ.tapFill({name:'Lời Chúa có quyền',text:'Lời Chúa có quyền. Chạm thật nhanh để bóng tối phải rời đi!',need:20,onP:p=>{loose=p;}},fly);
     const ask=()=>CQ.say('Người kể chuyện','Các tà ma xin Chúa cho chúng vào bầy heo đang ăn trên sườn núi. Chúa Giê-su cho phép.','Theo Mác 5:11-13',null,free);
     const name=()=>CQ.fillWord({name:'Người đàn ông',before:'Chúa Giê-su hỏi: "Mầy tên gì?" Người thưa: "Tên tôi là',after:'; vì chúng tôi đông."',options:['Quân đội','Bạn hữu','Người nghèo'],answer:'Quân đội',ref:'Mác 5:9',wrong:'Chưa đúng. Tên ấy có nghĩa là rất đông.'},ask);
     CQ.say('Chúa Giê-su','Hỡi tà ma, phải ra khỏi người nầy.','Mác 5:8',null,name);}},
   {at:'man2',text:'Người ấy đã khác hẳn! Lại gần xem',run:n=>{CQ.setCine([-1.5,3,4.5,2.8,1,-1.5]);
     const tell=()=>CQ.order({name:'Chúa Giê-su',q:'Người ấy xin theo Chúa. Nhưng Chúa bảo người về nhà. Ghép lại lời Chúa dặn.',chunks:['Hãy về nhà ngươi, nơi bạn hữu ngươi,','mà thuật lại cho họ điều lớn lao','thể nào Chúa đã làm cho ngươi,','và Ngài đã thương xót ngươi cách nào.'],ref:'Mác 5:19'},()=>{CQ.setCine(null);n();});
     CQ.say('Người kể chuyện','Bây giờ người ấy đang ngồi, mặc quần áo, trí khôn bình tĩnh. Không còn vòng tối nào quanh người nữa.','Theo Mác 5:15',null,()=>
     CQ.choice({name:'Người kể chuyện',q:'Ai đã giải cứu người ấy khỏi bóng tối?',options:['Chúa Giê-su','Những kẻ chăn heo','Người ấy tự làm'],ref:'Theo Mác 5:19',wrong:'Chưa đúng. Hãy nhớ lại ai đã phán: "phải ra khỏi người nầy".'},()=>
     CQ.say('Người được giải cứu','Xin cho tôi đi theo Thầy!','Theo Mác 5:18',null,tell)));}}];
 }});
