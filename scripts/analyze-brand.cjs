const fs = require('node:fs/promises');
const sharp = require('sharp');
const source=process.argv[2] || 'public/brand/noventra-original.png';
(async()=>{
 const {data,info}=await sharp(source).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const buckets=new Map();let minX=info.width,minY=info.height,maxX=0,maxY=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
   const i=(y*info.width+x)*3,r=data[i],g=data[i+1],b=data[i+2];
   if(Math.min(r,g,b)>170)continue;
   minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
   const key=[r,g,b].map(v=>Math.round(v/8)*8).join(',');buckets.set(key,(buckets.get(key)||0)+1);
 }
 const report={source,dimensions:info,bounds:{left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1},dominantColors:[...buckets].sort((a,b)=>b[1]-a[1]).slice(0,24),samples:[[700,250],[440,225],[520,210],[400,330]].map(([x,y])=>({x,y,rgb:[...data.slice((y*info.width+x)*3,(y*info.width+x)*3+3)]}))};
 await fs.mkdir('inspection/brand',{recursive:true});await fs.writeFile('inspection/brand/palette.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
