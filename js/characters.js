/* Christ Quest character sheet. Every character in the game is defined here, in one place.

   HOW TO UPDATE A CHARACTER
   1. Quick restyle: change the values below (colours, beard, veil, size). Every chapter picks the change up.
        skin, nose, hair      colours
        tunic, hem            tunic colour; hem is how high the tunic ends (0.1 long robe, 0.5 knee length)
        clavi                 colour of the two vertical tunic stripes
        mantle, tassel        outer cloak colour and its corner tassels
        sash, band            belt colour, head-band colour
        veil                  head covering colour (replaces hair)
        beard                 0 none, 1 short, 2 full
        hairLong, staff, bag, jar, gesture, wings, halo   set to 1 to switch on
        S, W, head            overall size, body width, head size
        glow, emis, float     light colour, robe glow colour, hover height (angels)
   2. Replace with a hand-made 3D model (Blender, exported as .glb):
        - put the file in a `models/` folder next to index.html
        - add  model:'models/jesus.glb'  to the character below (optional: modelHeight:1.7)
        - add this line to index.html, right after the three.min.js line:
            <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
        - animations named "Idle" and "Walk" inside the file are played automatically
      The built-in figure is kept as a fallback while the model loads, or if it fails to load. */
'use strict';
CQ.CAST={
 jesus:{skin:'#c48d60',tunic:'#fbf6ea',clavi:'#e2b84a',mantle:'#4f86c6',tassel:'#ffffff',sash:'#e2b84a',hair:'#3a281c',hairLong:1,beard:1,gesture:1},
 eli:{skin:'#c99468',tunic:'#f08a4b',hem:.5,sash:'#fff1d6',band:'#2fb3a3',hair:'#2e2018',bag:1,S:.74,head:1.16},
 nathan:{skin:'#c99468',tunic:'#b9a47c',hem:.5,sash:'#a5483a',hair:'#2e2018',staff:1,S:.74,head:1.16},
 elder:{skin:'#b27a4e',tunic:'#7d8a5c',hem:.45,mantle:'#9a7a52',hair:'#d9d4c8',beard:2,staff:1,band:'#b5483a'},
 shepherd2:{skin:'#b9804f',tunic:'#8d7656',hem:.5,sash:'#6b4a2f',hair:'#241a13',beard:1,band:'#dcc9a0'},
 mary:{skin:'#cf9a6e',tunic:'#4f7fb5',veil:'#f2ead6',sash:'#e9dcc0',S:.95},
 joseph:{skin:'#b97f52',tunic:'#9a7350',mantle:'#6f5a42',hair:'#3a281c',beard:1,staff:1},
 angel:{skin:'#e8c9a0',tunic:'#fffdf2',emis:'#c9b070',sash:'#ffe38a',hair:'#c9a35a',hairLong:1,wings:1,halo:1,glow:'#fff0b8',float:2.6},
 john:{skin:'#b0744a',tunic:'#8a623a',hem:.42,sash:'#3a2718',hair:'#2a1d15',hairLong:1,beard:2,W:1.08},
 peter:{skin:'#b67b4f',tunic:'#8d7656',hem:.5,sash:'#3f7f8f',hair:'#2a1d15',beard:2,band:'#dcc9a0',W:1.2},
 woman:{skin:'#c08a5e',tunic:'#a5526a',veil:'#ebdfc4',sash:'#d9a441',S:.95},
 woman2:{skin:'#c99468',tunic:'#5f8f7a',veil:'#e6d3ab',sash:'#b5483a',S:.93},
 man:{skin:'#b9804f',tunic:'#b08a5e',hem:.3,sash:'#6b4a2f',hair:'#241a13',beard:1},
 man2:{skin:'#c08a5e',tunic:'#c9c0a8',mantle:'#7a8a9a',hair:'#4a3a2c',beard:1},
 kid:{skin:'#c99468',tunic:'#c97b5a',hem:.5,sash:'#e9dcc0',hair:'#2e2018',S:.66,head:1.18}
};
