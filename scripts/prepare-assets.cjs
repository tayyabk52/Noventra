const fs=require('node:fs/promises');
const sharp=require('sharp');
const source=process.argv[2] || 'public/brand/noventra-original.png';
(async()=>{
 await fs.mkdir('public/brand',{recursive:true});await fs.mkdir('public/fonts',{recursive:true});await fs.mkdir('app',{recursive:true});
 if (source !== 'public/brand/noventra-original.png') await fs.copyFile(source,'public/brand/noventra-original.png');
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let i=0;i<data.length;i+=4){const low=Math.min(data[i],data[i+1],data[i+2]);if(low>170){data[i+3]=0;}else if(low>140){data[i+3]=Math.round(255*(170-low)/30);}}
 const transparent=sharp(data,{raw:{width:info.width,height:info.height,channels:4}});
 await transparent.clone().extract({left:357,top:135,width:1275,height:230}).webp({quality:95,alphaQuality:100}).toFile('public/brand/noventra-logo.webp');
 await transparent.clone().extract({left:357,top:135,width:186,height:230}).png().toFile('public/brand/noventra-mark.png');
 await transparent.clone().extract({left:357,top:135,width:186,height:230}).resize(64,64,{fit:'contain'}).png().toFile('app/icon.png');
 const d=JSON.parse(await fs.readFile('inspection/reference/desktop.json','utf8'));
 const latin=d.rules.filter(r=>r.type==='font' && r.css.includes('Open Sans') && r.css.includes('U+0-FF')).map(r=>r.css);
 const urls=[...new Set(latin.flatMap(s=>[...s.matchAll(/url\("?([^\")]+)"?\)/g)].map(m=>m[1])))];
 if(!urls.length)throw new Error('No measured Latin font source');
 for(const [i,u]of urls.entries()){const url=new URL(u,'https://logicera.com/');const response=await fetch(url);if(!response.ok)throw new Error('Font download failed '+response.status);await fs.writeFile('public/fonts/open-sans-'+i+'.woff2',Buffer.from(await response.arrayBuffer()));}
 console.log('Original logo preserved; optimized raster assets and measured Latin font assets prepared:',urls);
})().catch(e=>{console.error(e);process.exitCode=1});
