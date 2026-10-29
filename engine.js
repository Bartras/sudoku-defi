// Moteur Sudoku : résolution, génération (graine reproductible) et notation de la difficulté.
// Une grille = tableau de 81 entiers (0 = vide), index = ligne*9 + colonne.
(function(root){
"use strict";

const ALL=0x3FE; // bits 1..9
const ROW=[],COL=[],BOX=[],UNITS=[],PEERS=[];
for(let i=0;i<81;i++){ROW[i]=i/9|0;COL[i]=i%9;BOX[i]=(ROW[i]/3|0)*3+(COL[i]/3|0);}
for(let r=0;r<9;r++)UNITS.push([...Array(9)].map((_,k)=>r*9+k));
for(let c=0;c<9;c++)UNITS.push([...Array(9)].map((_,k)=>k*9+c));
for(let b=0;b<9;b++)UNITS.push([...Array(9)].map((_,k)=>((b/3|0)*3+(k/3|0))*9+(b%3)*3+k%3));
for(let i=0;i<81;i++)PEERS[i]=[...Array(81).keys()].filter(k=>k!==i&&(ROW[k]===ROW[i]||COL[k]===COL[i]||BOX[k]===BOX[i]));

const popcnt=m=>{let c=0;while(m){m&=m-1;c++}return c};
const isSingle=m=>m!==0&&(m&(m-1))===0;
const bitVal=m=>31-Math.clz32(m);

function mulberry32(a){
  return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
}
function shuffle(arr,rng){
  for(let i=arr.length-1;i>0;i--){const j=rng()*(i+1)|0;[arr[i],arr[j]]=[arr[j],arr[i]];}
  return arr;
}

// Backtracking à case la plus contrainte. Compte les solutions jusqu'à `limit`.
// Avec `rng`, l'ordre des chiffres est aléatoire (sert à tirer une grille pleine).
function search(g,limit,rng){
  const grid=g.slice(),rows=Array(9).fill(0),cols=Array(9).fill(0),boxes=Array(9).fill(0);
  for(let i=0;i<81;i++)if(grid[i]){const b=1<<grid[i];rows[ROW[i]]|=b;cols[COL[i]]|=b;boxes[BOX[i]]|=b;}
  let n=0,first=null;
  (function rec(){
    let best=-1,bm=0,bc=10;
    for(let i=0;i<81;i++)if(!grid[i]){
      const m=ALL&~(rows[ROW[i]]|cols[COL[i]]|boxes[BOX[i]]),c=popcnt(m);
      if(c<bc){bc=c;best=i;bm=m;if(c<=1)break;}
    }
    if(best<0){n++;if(!first)first=grid.slice();return;}
    if(bc===0)return;
    const digits=[];for(let v=1;v<=9;v++)if(bm&(1<<v))digits.push(v);
    if(rng)shuffle(digits,rng);
    for(const v of digits){
      const b=1<<v;grid[best]=v;rows[ROW[best]]|=b;cols[COL[best]]|=b;boxes[BOX[best]]|=b;
      rec();
      grid[best]=0;rows[ROW[best]]&=~b;cols[COL[best]]&=~b;boxes[BOX[best]]&=~b;
      if(n>=limit)return;
    }
  })();
  return {count:n,solution:first};
}
const countSolutions=(g,limit=2)=>search(g,limit,null).count;
const randomSolution=rng=>search(Array(81).fill(0),1,rng).solution;

// Difficulté = technique la plus avancée nécessaire pour résoudre sans deviner :
//   1 : case à une seule possibilité            (« naked single »)
//   2 : chiffre unique dans une ligne/col/bloc  (« hidden single »)
//   3 : paires nues, alignements bloc/ligne     (« pointing / claiming »)
//   4 : au-delà (il faut une technique avancée ou une hypothèse)
function rate(puzzle){
  const g=Array(81).fill(0),cand=Array(81).fill(ALL);
  let remaining=81,tier=0;
  const place=(i,v)=>{g[i]=v;cand[i]=0;remaining--;const b=1<<v;for(const p of PEERS[i])cand[p]&=~b;};
  for(let i=0;i<81;i++)if(puzzle[i])place(i,puzzle[i]);

  const eliminate=(cells,mask)=>{let ch=false;for(const c of cells)if(cand[c]&mask){cand[c]&=~mask;ch=true;}return ch;};

  function nakedPairs(){
    for(const u of UNITS){
      const pairs=u.filter(c=>!g[c]&&popcnt(cand[c])===2);
      for(let a=0;a<pairs.length;a++)for(let b=a+1;b<pairs.length;b++)
        if(cand[pairs[a]]===cand[pairs[b]]){
          const m=cand[pairs[a]];
          if(eliminate(u.filter(c=>!g[c]&&c!==pairs[a]&&c!==pairs[b]),m))return true;
        }
    }
    return false;
  }
  function intersections(){
    for(let ui=0;ui<27;ui++){
      const u=UNITS[ui],isBox=ui>=18;
      for(let v=1;v<=9;v++){
        const b=1<<v,cs=u.filter(c=>cand[c]&b);
        if(cs.length<2)continue;
        const targets=[];
        if(isBox){
          if(cs.every(c=>ROW[c]===ROW[cs[0]]))targets.push(UNITS[ROW[cs[0]]]);
          if(cs.every(c=>COL[c]===COL[cs[0]]))targets.push(UNITS[9+COL[cs[0]]]);
        }else if(cs.every(c=>BOX[c]===BOX[cs[0]]))targets.push(UNITS[18+BOX[cs[0]]]);
        for(const t of targets)if(eliminate(t.filter(c=>!cs.includes(c)),b))return true;
      }
    }
    return false;
  }

  while(remaining>0){
    let prog=false;
    for(let i=0;i<81;i++)if(!g[i]){
      if(cand[i]===0)return 99;
      if(isSingle(cand[i])){place(i,bitVal(cand[i]));prog=true;tier=Math.max(tier,1);}
    }
    if(prog)continue;
    for(const u of UNITS){
      for(let v=1;v<=9;v++){
        const b=1<<v,cs=u.filter(c=>cand[c]&b);
        if(cs.length===1){place(cs[0],v);prog=true;tier=Math.max(tier,2);}
      }
    }
    if(prog)continue;
    if(nakedPairs()||intersections()){tier=Math.max(tier,3);continue;}
    return 4;
  }
  return tier;
}

// Niveaux : `cap` = difficulté visée, `target` = nombre de chiffres donnés visé.
const LEVELS={
  facile:    {label:"Facile",    cap:1,target:40},
  moyen:     {label:"Moyen",     cap:2,target:32},
  difficile: {label:"Difficile", cap:3,target:28},
  expert:    {label:"Expert",    cap:4,target:22}
};

function carve(full,cfg,rng){
  const p=full.slice();let givens=81;
  for(const i of shuffle([...Array(41).keys()],rng)){
    if(givens<=cfg.target)break;
    const j=80-i;
    if(!p[i]&&!p[j])continue;
    const a=p[i],b=p[j];p[i]=0;p[j]=0;
    if(countSolutions(p,2)===1&&(cfg.cap===4||rate(p)<=cfg.cap))givens-=i===j?1:2;
    else{p[i]=a;p[j]=b;}
  }
  return p;
}

// Même (niveau, graine) => même grille, sur tous les appareils.
function generate(level,seed){
  const cfg=LEVELS[level],rng=mulberry32(seed);
  let best=null;
  for(let attempt=0;attempt<60;attempt++){
    const puzzle=carve(randomSolution(rng),cfg,rng),r=rate(puzzle);
    if(r===cfg.cap)return {puzzle,rating:r,exact:true};
    if(!best||Math.abs(cfg.cap-r)<Math.abs(cfg.cap-best.rating))best={puzzle,rating:r,exact:false};
  }
  return best;
}

const solve=g=>search(g,1,null).solution;
const api={ROW,COL,BOX,LEVELS,solve,countSolutions,randomSolution,rate,generate,mulberry32};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.SudokuEngine=api;
})(typeof self!=="undefined"?self:this);
