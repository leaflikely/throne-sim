// raveness.js — Dice Throne: Raveness character definition

(function(){

const I={
  talon:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M7 4 C6 9 6.5 14 7 18 C7.3 20 7 22 6.5 23" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><path d="M12 3 C12 9 12 14 12 18.5 C12 21 11.5 22.5 11 24" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><path d="M17 4 C18 9 17.5 14 17 18 C16.7 20 17 22 17.5 23" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  feather:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 Q18.5 7 18 15 Q16.5 21 12 23 Q7.5 21 6 15 Q5.5 7 12 2Z" fill="${c}" fill-opacity="0.22" stroke="${c}" stroke-width="1.6"/><line x1="12" y1="2" x2="12" y2="23" stroke="${c}" stroke-width="1.1" opacity="0.7"/><path d="M9 8 Q12 9.5 15 8" stroke="${c}" stroke-width="1.1" opacity="0.5"/><path d="M8.5 12 Q12 13.5 15.5 12" stroke="${c}" stroke-width="1.1" opacity="0.5"/><path d="M9 16 Q12 17.5 15 16" stroke="${c}" stroke-width="1.1" opacity="0.5"/></svg>`,
  eye:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M2 12 Q12 3.5 22 12 Q12 20.5 2 12Z" stroke="${c}" stroke-width="1.6" fill="${c}" fill-opacity="0.14"/><circle cx="12" cy="12" r="4" stroke="${c}" stroke-width="1.6"/><circle cx="12" cy="12" r="2" fill="${c}"/><circle cx="13.2" cy="10.8" r="0.6" fill="white" fill-opacity="0.6"/></svg>`,
  eyeMed:c=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M2 12 Q12 3.5 22 12 Q12 20.5 2 12Z" stroke="${c}" stroke-width="1.5" fill="${c}" fill-opacity="0.12"/><circle cx="12" cy="12" r="4" stroke="${c}" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="${c}"/><circle cx="13.2" cy="10.8" r="0.6" fill="white" fill-opacity="0.55"/></svg>`,
  featherTok:(c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 Q18.5 7 18 15 Q16.5 21 12 23 Q7.5 21 6 15 Q5.5 7 12 2Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="1.8"/><line x1="12" y1="2" x2="12" y2="23" stroke="${c}" stroke-width="1.2" opacity="0.7"/><path d="M9 8 Q12 9.5 15 8" stroke="${c}" stroke-width="1.2" opacity="0.5"/><path d="M8.5 12 Q12 13.5 15.5 12" stroke="${c}" stroke-width="1.2" opacity="0.5"/><path d="M9 16 Q12 17.5 15 16" stroke="${c}" stroke-width="1.2" opacity="0.5"/></svg>`,
  hexSVG:(stroke,fill)=>`<svg width="26" height="24" viewBox="0 0 38 34" fill="none"><polygon points="19,2 36,11 36,25 19,34 2,25 2,11" fill="${fill||'transparent'}" stroke="${stroke||'#8040C8'}" stroke-width="2.5"/></svg>`,
};

// P1 Nevermore is teal (default), P2 is a softer blue to distinguish
const NM_COLORS={p1:"#00C4A0",p2:"#4890E0"};

const FACES=[null,
  {t:"TALON",  c:"#D06820"},
  {t:"TALON",  c:"#D06820"},
  {t:"TALON",  c:"#D06820"},
  {t:"FEATHER",c:"#28A050"},
  {t:"FEATHER",c:"#28A050"},
  {t:"EYE",    c:"#8040C8"},
];

const ABIL=[
  {id:"peck",    n:"PECK",             c:"#D06820",t:"off",
   req:[{type:"talon",count:3}],hideReq:true,
   fx:"{T}{T}{T} → 5 Blockable\n{T}{T}{T}{T} → 6 Blockable\n{T}{T}{T}{T}{T} → 7 Blockable\n4OAK: Activate Nevermore"},
  {id:"fowl",    n:"FOWL FRIEND",      c:"#28A050",t:"off",
   req:[{type:"feather",count:4}],
   fx:"Draw 1\nGain 4 {F}\nActivate Nevermore twice"},
  {id:"murder",  n:"MURDER OF CROWS",  c:"#7040A8",t:"off",
   req:[{type:"talon",count:2},{type:"feather",count:3}],
   fx:"5 Blockable, roll 4 dice:\n+1 dmg per {T}\nGain 1 {F} per {F}\nOn {E}: Activate Nevermore"},
  {id:"sight",   n:"RAVEN SIGHT",      c:"#00C4A0",t:"off",
   req:[{type:"talon",count:2},{type:"eye",count:2}],
   fx:"Activate Nevermore\n3 Undefendable"},
  {id:"craven",  n:"CRAVEN",           c:"#4068C0",t:"off",
   req:[{type:"text",label:"Small Straight"}],
   fx:"Gain 1 {F}\n8 Blockable"},
  {id:"beguile", n:"BEGUILE",          c:"#B07C18",t:"off",
   req:[{type:"text",label:"Large Straight"}],
   fx:"Gain 2 {F}\nActivate Nevermore\n9 Blockable"},
  {id:"chamber", n:"CHAMBER",          c:"#8040C8",t:"off",
   req:[{type:"eye",count:4}],
   fx:"Activate Nevermore twice\n7 Undefendable"},
  {id:"nothing", n:"NOTHING MORE",     c:"#1E6830",t:"def",
   req:[],
   fx:"On {T}{T}, 2 Undefendable.\nOn {F}{F}, Block 2.\nOn {E}{E}, Activate Nevermore."},
  {id:"ult",     n:"FANTASTIC TERRORS!",c:"#906808",t:"ult",
   req:[],
   fx:"Activate Nevermore 3 times.\nInflict Hex. 13 Undefendable."},
];

const ABIL2={
  peck:{n:"PECK ★",c:"#E06030",t:"off",
    req:[{type:"talon",count:3}],hideReq:true,
    fx:"{T}{T}{T} → 6 Blockable\n{T}{T}{T}{T} → 7 Blockable\n{T}{T}{T}{T}{T} → 8 Blockable\n3OAK: Activate Nevermore"},
  fowl:{n:"FOWL FRIEND ★",c:"#38C060",t:"off",
    req:[{type:"feather",count:3}],
    fx:"Draw 1\nGain MAX {F}\nActivate Nevermore 3 times",
    sub:{n:"BIRDS OF A FEATHER",c:"#38C060",
      req:[{type:"feather",count:5}],
      fx:"Increase {F} Stack Limit by 1\nThen activate Fowl Friend ★"}},
  murder:{n:"MURDER OF CROWS ★",c:"#9050B8",t:"off",
    req:[{type:"talon",count:2},{type:"feather",count:3}],
    fx:"6 Blockable, roll 5 dice:\n+1 dmg per {T}\nGain 1 {F} per {F}\nOn {E}: Activate Nevermore"},
  sight:{n:"RAVEN SIGHT ★",c:"#00DDB8",t:"off",
    req:[{type:"talon",count:2},{type:"eye",count:2}],
    fx:"Activate Nevermore twice\n3 Undefendable"},
  craven:{n:"CRAVEN ★",c:"#5080D0",t:"off",
    req:[{type:"text",label:"Small Straight"}],
    fx:"Gain 2 {F}\n9 Blockable"},
  beguile:{n:"BEGUILE ★",c:"#D09028",t:"off",
    req:[{type:"text",label:"Large Straight"}],
    fx:"Gain 3 {F}, 9 Blockable\nActivate Nevermore twice",
    sub:{n:"PLUCK",c:"#D09028",
      req:[{type:"feather",count:3},{type:"eye",count:2}],
      fx:"Inflict Hex\n9 Blockable"}},
  chamber:{n:"CHAMBER ★",c:"#9050D8",t:"off",
    req:[{type:"eye",count:4}],
    fx:"Activate Nevermore 3 times\n7 Undefendable",
    sub:{n:"AVIARY",c:"#9050D8",
      req:[{type:"eye",count:3}],
      fx:"Gain 4 {F}\n2 Undefendable"}},
  nothing:{n:"NOTHING MORE ★",c:"#2A8840",t:"def",
    req:[],
    fx:"1 Undefendable X {T}.\nOn {F}{F}, Block 2.\nOn {E}{E}, Activate Nevermore."},
};

const CARD_UPGRADES={u1:"peck",u2:"fowl",u3:"murder",u4:"sight",u5:"craven",u6:"beguile",u7:"chamber",u8:"nothing"};
const CARDS=[
  {id:"g_g1", n:"GET THAT OUTTA HERE!", cp:1,t:"blue",  e:"🚫⭐",x:"Remove a status effect token from a chosen player."},
  {id:"g_g2", n:"TRANSFERENCE!",        cp:2,t:"blue",  e:"🔀🔮",x:"Transfer 1 status effect token from a chosen player to another chosen player."},
  {id:"g_g3", n:"WHAT STATUS EFFECTS?", cp:2,t:"blue",  e:"⭐🧹",x:"Remove all status effect tokens from a chosen player."},
  {id:"g_g4", n:"VEGAS BABY!",          cp:0,t:"blue",  e:"🎲💰",x:"Roll one die: Gain half the value as CP rounded up."},
  {id:"g_g5", n:"BETTER D!",            cp:0,t:"orange",e:"🛡🎲", x:"A chosen player may perform an additional roll attempt of up to five dice during their defensive roll phase."},
  {id:"g_g6", n:"NOT THIS TIME!",       cp:1,t:"orange",e:"🛡🚧", x:"A chosen player prevents 6 incoming damage."},
  {id:"g_g7", n:"SO WILD!",             cp:2,t:"orange",e:"🃏⭐",x:"Change the value of any one die."},
  {id:"g_g8", n:"SIX-IT!",              cp:1,t:"orange",e:"6️⃣🎲",x:"Change the value of one of your dice to a 6."},
  {id:"g_g9", n:"ONE MORE TIME!",       cp:1,t:"orange",e:"🎲🔄",x:"A chosen player may perform an additional roll attempt of up to five dice during their offensive roll phase."},
  {id:"g_g10",n:"TWICE AS WILD!",       cp:3,t:"orange",e:"🃏🃏",x:"Change the values of any two dice."},
  {id:"g_g11",n:"TRY, TRY AGAIN!",      cp:1,t:"orange",e:"🔄🎲",x:"You or a chosen teammate may re-roll up to two dice."},
  {id:"g_g12",n:"SAMESIES!",            cp:1,t:"orange",e:"🎲🎲",x:"Change the value of one of your dice to match another die from the same roll."},
  {id:"g_g13",n:"HELPING HAND!",        cp:1,t:"orange",e:"🤝🎲",x:"Select one of your opponent's dice and force them to reroll it."},
  {id:"g_g14",n:"GETTING PAID!",        cp:0,t:"red",   e:"💰💰",x:"Gain 2 CP."},
  {id:"g_g15",n:"DOUBLE UP!",           cp:1,t:"red",   e:"🃏🃏",x:"Draw 2 cards."},
  {id:"g_g16",n:"TRIPLE UP!",           cp:2,t:"red",   e:"🃏🃏🃏",x:"Draw 3 cards."},
  {id:"g_g17",n:"TIP IT!",              cp:1,t:"red",   e:"🔼🎲",x:"Increase or decrease any die by 1. (Cannot decrease a 1 or increase a 6.)"},
  {id:"u1",n:"PECK 2",                              cp:2,t:"blue",e:"🐦💥💥",x:"UPGRADE Peck: 3T→6, 4T→7, 5T→8 Blockable. On 3-of-a-kind numbers: Activate Nevermore."},
  {id:"u2",n:"FOWL FRIEND 2 + BIRDS OF A FEATHER",  cp:3,t:"blue",e:"🌿🐦🌟",x:"UPGRADE Fowl Friend (3 Feathers): Draw 1, Gain MAX Feather, Activate Nevermore 3×. ADDS Birds of a Feather (5 Feathers): Increase Feather Stack Limit by 1, then activate Fowl Friend 2."},
  {id:"u3",n:"MURDER OF CROWS 2",                   cp:2,t:"blue",e:"🐦🐦💥",x:"UPGRADE Murder of Crows (2T+3F): 6 Blockable, roll 5 dice: +1 dmg/Talon, +1 Feather/Feather, on Eye Activate Nevermore."},
  {id:"u4",n:"RAVEN SIGHT 2",                       cp:1,t:"blue",e:"👁👁🐦", x:"UPGRADE Raven Sight (2T+2E): Activate Nevermore twice. 3 Undefendable."},
  {id:"u5",n:"CRAVEN 2",                            cp:2,t:"blue",e:"▶💥💥", x:"UPGRADE Craven (Small Straight): Gain 2 Feather. 9 Blockable."},
  {id:"u6",n:"BEGUILE 2 + PLUCK",                   cp:2,t:"blue",e:"🌀🔷🔮",x:"UPGRADE Beguile (Large Straight): Gain 3 Feather, Activate Nevermore twice, 9 Blockable. ADDS Pluck (3F+2E): Inflict Hex, 9 Blockable."},
  {id:"u7",n:"CHAMBER 2 + AVIARY",                  cp:2,t:"blue",e:"👁🐦🌿", x:"UPGRADE Chamber (4E): Activate Nevermore 3×, 7 Undefendable. ADDS Aviary (3E): Gain 4 Feather, 2 Undefendable."},
  {id:"u8",n:"NOTHING MORE 2",                      cp:2,t:"blue",e:"🛡🐦⭐", x:"UPGRADE Nothing More: 1 Undefendable per Talon. On each pair of Feathers: Block 2. On each pair of Eyes: Activate Nevermore."},
  {id:"r_q1",n:"MIDNIGHT DREARY!",  cp:1,t:"blue",  e:"🌙🍃👁",  x:"Roll 5 Dice: Gain 1 Feather per Feather rolled. On any Eye, Activate Nevermore once."},
  {id:"r_q2",n:"NEVERMORE ATTACK!", cp:2,t:"blue",  e:"🐦⚡",    x:"Activate Nevermore. Choose: the player with Nevermore heals 2, or receives 2 unblockable damage."},
  {id:"r_q3",n:"TALON STRIKE!",     cp:1,t:"orange",e:"🐦⚔🎲",  x:"Roll 5 Dice: Add 1 damage per Talon rolled. Gain 1 Feather Token."},
  {id:"r_q4",n:"STONE BEAK!",       cp:2,t:"orange",e:"🐦🗡",    x:"Play only if Nevermore is on your attack target. +1 damage. This attack becomes undefendable."},
  {id:"r_q5",n:"CULL!",             cp:1,t:"red",   e:"🎲🐦",    x:"Change the value of the Nevermore Die Roll."},
  {id:"r_q6",n:"BROKEN STILLNESS",  cp:1,t:"red",   e:"🐦🌟",    x:"Activate Nevermore."},
];

// ─── TOKEN STRIP ─────────────────────────────────────────────────────────────
// Feathers render as clickable pips in the strip.
// Hex tokens are pre-placed on the overlay when the character loads —
// they sit in the strip area on first load and are freely draggable from there.
function renderTokens(player, playerState, container) {
  container.innerHTML = "";

  // FEATHERS cluster
  const fCluster = document.createElement("div");
  fCluster.className = "tok-cluster";
  fCluster.innerHTML = `<span class="tok-cluster-lbl">FEATHERS</span>`;
  const fRow = document.createElement("div");
  fRow.className = "tok-row";
  for (let i = 0; i < 7; i++) {
    const btn = document.createElement("button");
    const active = i < (playerState.feathers || 0);
    btn.className = "ftok" + (active ? " on" : "");
    btn.title = active ? "Remove feather" : "Add feather";
    btn.innerHTML = I.featherTok("#28A050", 20);
    btn.addEventListener("click", () => {
      // In multiplayer, only the owner can change their own feathers
      if (window.netCanEdit && !window.netCanEdit(player)) return;
      playerState.feathers = i < playerState.feathers ? i : i + 1;
      renderTokens(player, playerState, container);
      if (window.netTokens) window.netTokens(player); // sync to opponent
    });
    fRow.appendChild(btn);
  }
  fCluster.appendChild(fRow);
  container.appendChild(fCluster);

  // HEX tokens are physical overlay pieces — no strip element needed
}

// Place two Hex tokens on the overlay, starting in the player's dice strip
// at the same position shown in the token cluster area.
function placeHexTokens(player) {
  const pLabel = player === "p1" ? "P1" : "P2";
  const pColor = player === "p1" ? "#00C4A0" : "#4890E0";
  const spacer = document.getElementById(player + "hex-spacer");

  for (let i = 0; i < 2; i++) {
    const id = "hex_" + player + "_" + i;
    if (document.getElementById(id)) continue;

    // Spawn the tokens over the reserved spacer next to the feather pips
    let x = 400 + i * 36, y = window.innerHeight / 2;
    if (spacer) {
      const sr = spacer.getBoundingClientRect();
      x = sr.left + i * 36;
      y = sr.top + sr.height / 2 - 20;
    }

    const el = document.createElement("div");
    el.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:1px";
    el.innerHTML = `
      <span style="font-size:6px;font-weight:700;letter-spacing:1px;color:#8040C8">HEX</span>
      ${I.hexSVG("#8040C8","#1A0828")}
      <span style="font-size:6px;color:${pColor};font-weight:700;letter-spacing:1px">${pLabel}</span>
    `;
    window.addOverlayToken(id, el, x, y);
  }
}

// ─── NEVERMORE (overlay token) ────────────────────────────────────────────────
// Called by main when this character is loaded for a player.
// Positions Nevermore on the screen based on which player loaded it.
function buildOverlayTokens(player, addFn, removeFn) {
  const id = "nm_" + player;
  const color = NM_COLORS[player];
  const pLabel = player === "p1" ? "P1" : "P2";

  // Position: p1 → lower-center of screen, p2 → upper-center
  const W = window.innerWidth, H = window.innerHeight;
  const x = Math.round(W / 2 - 48);
  const y = player === "p1" ? Math.round(H * 0.62) : Math.round(H * 0.08);

  const el = document.createElement("div");
  el.className = "nm-outer";

  // Player label tag — only shown when both players are Raveness
  const bothRaveness = ()=>{
    const c = window.DT_CHARACTERS&&window.DT_CHARACTERS["raveness"];
    return window._S_chars_p1_id === "raveness" && window._S_chars_p2_id === "raveness";
  };

  const pNum = player === "p1" ? "1" : "2";
  // The circle is 96px wide. Eye row: icon + player number inline, always visible.
  el.innerHTML = `
    <div style="width:96px;height:96px;border-radius:50%;background:#0A1220;border:2.5px solid ${color};box-shadow:0 0 16px ${color}25;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;overflow:hidden;flex-shrink:0">
      <div style="display:flex;align-items:center;gap:3px;line-height:0">
        ${I.eyeMed(color)}
        <span style="font-size:11px;font-weight:700;color:${color};line-height:1">${pNum}</span>
      </div>
      <span style="font-size:6.5px;font-weight:700;color:${color};letter-spacing:2px;line-height:1">NEVERMORE</span>
      <div style="display:flex;align-items:center;gap:3px">
        <button class="nmdbtn" style="border-color:${color};color:${color};width:16px;height:16px;font-size:12px" onclick="event.stopPropagation();adjNM('${player}',-1)">&#8722;</button>
        <span id="nm-dial-${player}" style="font-size:14px;font-weight:700;color:${color};min-width:18px;text-align:center">0</span>
        <button class="nmdbtn" style="border-color:${color};color:${color};width:16px;height:16px;font-size:12px" onclick="event.stopPropagation();adjNM('${player}',1)">+</button>
      </div>
    </div>
  `;

  addFn(id, el, x, y);

  // Place hex tokens near the player's strip (deferred so DOM is ready)
  setTimeout(() => placeHexTokens(player), 80);


}

function dieIcon(faceValue, locked, size) {
  const f = FACES[faceValue];
  const c = locked ? "#253045" : f.c;
  if (f.t === "TALON")   return I.talon(c, size);
  if (f.t === "FEATHER") return I.feather(c, size);
  return I.eye(c, size);
}

function initTokenState() {
  return { feathers: 0 };
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
window.DT_CHARACTERS = window.DT_CHARACTERS || {};
window.DT_CHARACTERS["raveness"] = {
  id:                  "raveness",
  name:                "Raveness",
  abilities:           ABIL,
  upgrades:            ABIL2,
  cardUpgrades:        CARD_UPGRADES,
  cards:               CARDS,
  faces:               FACES,
  dieIcon:             dieIcon,
  renderTokens:        renderTokens,
  initTokenState:      initTokenState,
  buildOverlayTokens:  buildOverlayTokens,
  hasHexTokens:        true,
  leaflet:             "Raveness_insert.png",
};

})();
