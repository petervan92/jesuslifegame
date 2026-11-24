// Lists every line the game can read aloud (CQ.say / CQ.lines text, chapter intro panels, plus helper calls listed in EXTRA)
// and writes audio/voice/lines.json. ids are the FNV-1a hash used by js/engine.js. Run: node tools/extract_lines.mjs
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=fs.readdirSync(path.join(root,'js')).filter(f=>/^(ch|acts_).*\.js$/.test(f)).map(f=>'js/'+f);
function readArg(s,i){let d=0,st=i;while(i<s.length){const c=s[i];if(c==="'"||c==='"'||c==='\x60'){const q=c;i++;while(s[i]!==q){if(s[i]==='\\')i++;i++;}i++;continue;}
  if('([{'.includes(c))d++;else if(')]}'.includes(c)){if(d===0)return[s.slice(st,i).trim(),i];d--;}else if(c===','&&d===0)return[s.slice(st,i).trim(),i];i++;}return[s.slice(st).trim(),i];}
function args(s,i){const o=[];for(;;){const[a,e]=readArg(s,i);o.push(a);if(s[e]!==',')return o;i=e+1;}}
function lit(s,vars){let i=0;const ws=()=>{while(/\s/.test(s[i]))i++;};const val=()=>{ws();const c=s[i];let v;
  if(c==="'"||c==='"'){i++;let o='';while(s[i]!==c){if(s[i]==='\\'){i++;const e=s[i];if(e==='n')o+='\n';else if(e==='u'){o+=String.fromCharCode(parseInt(s.slice(i+1,i+5),16));i+=4;}else o+=e;}else o+=s[i];i++;}i++;v=o;}
  else if(c==='['){i++;v=[];ws();while(s[i]!==']'){v.push(val());ws();if(s[i]===',')i++;ws();}i++;}
  else if(c==='{'){i++;v={};ws();while(s[i]!=='}'){const m=/^[A-Za-z_$][\w$]*/.exec(s.slice(i));if(!m)throw 0;i+=m[0].length;ws();if(s[i]!==':')throw 0;i++;v[m[0]]=val();ws();if(s[i]===',')i++;ws();}i++;}
  else{const m=/^(-?[\d.]+|null|true|false|[A-Za-z_$][\w$]*)/.exec(s.slice(i));if(!m)throw 0;i+=m[0].length;const w=m[0];v=w==='null'?null:w==='true'?true:w==='false'?false:/^[\d.-]/.test(w)?+w:(w in vars?vars[w]:undefined);}
  ws();if(s[i]==='+'){i++;const r=val();if(typeof v!=='string'||typeof r!=='string')throw 0;v+=r;}return v;};const v=val();ws();if(i<s.length)throw 0;return v;}
const ev=(r,vars)=>{try{return lit(r,vars);}catch(e){return undefined;}};
const strip=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const hash=s=>{let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}return(h>>>0).toString(16).padStart(8,'0');};
// helpers in chapter files that forward text to CQ.say / CQ.lines: [file, function name, arg indexes holding text]
const EXTRA=[['js/ch_bethesda.js','wait',[3]],['js/ch_shepherd.js','lie',[2,3]]];
const out=new Map(),miss=[];
for(const f of files){const s=fs.readFileSync(path.join(root,f),'utf8');const vars={};
  for(const m of s.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*('(?:[^'\\]|\\.)*')\s*[;,]/g)){const v=ev(m[2],{});if(typeof v==='string')vars[m[1]]=v;}
  const add=t=>{if(typeof t!=='string')return;const x=strip(t);if(x&&!out.has(x))out.set(x,f);};
  for(const m of s.matchAll(/CQ\.(say|lines)\(/g)){const a=args(s,m.index+m[0].length);
    if(m[1]==='say'){const v=ev(a[1]||'',vars);if(typeof v==='string')add(v);else miss.push(f+': say('+(a[1]||'').slice(0,50)+')');}
    else{const v=ev(a[0]||'',vars);if(Array.isArray(v)){for(const x of v){if(Array.isArray(x)&&typeof x[1]==='string')add(x[1]);else miss.push(f+': lines item');}}else miss.push(f+': lines('+(a[0]||'').slice(0,50)+')');}}
  for(const [ef,fn,idx] of EXTRA){if(ef!==f)continue;for(const m of s.matchAll(new RegExp('\\b'+fn+'\\(','g'))){if(/const\s*$|=\s*$/.test(s.slice(m.index-8,m.index)))continue;const a=args(s,m.index+m[0].length);for(const k of idx){const v=ev(a[k]||'',vars);if(typeof v==='string')add(v);}}}
  const im=s.indexOf('intro:[');if(im>=0){const v=ev(readArg(s,im+6)[0],vars);if(Array.isArray(v))v.forEach(p=>add(p&&p.x));else miss.push(f+': intro');}}
const list=[...out].map(([text,file])=>({id:hash(text),file,text}));
fs.writeFileSync(path.join(root,'audio/voice/lines.json'),JSON.stringify(list,null,1));
console.log('lines',list.length,'chars',list.reduce((a,x)=>a+x.text.length,0));
const known=new Set(['js/ch_bethesda.js: say(txt)',"js/ch_shepherd.js: lines([[who,a,null],['Người kể chuyện',b,'Giăng 10:5']])"]);
for(const m of miss)if(!known.has(m))console.log('NOT READ (dynamic text, no voice file):',m);
