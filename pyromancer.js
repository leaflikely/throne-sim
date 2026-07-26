// pyromancer.js — Dice Throne: Pyromancer character definition
// Starting scope: dice + board only. Uses the shared global cards for now
// (no unique upgrade/action cards yet).

(function(){

// ─── DIE FACE ICONS ──────────────────────────────────────────────────────────
const I={
  // Flame: single teardrop flame
  flame:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 C13 6 17 8 17 13 A5 5 0 0 1 7 13 C7 9 10 7 12 2Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10 C12.5 12 14 12.5 14 14.5 A2 2 0 0 1 10 14.5 C10 13 11.5 12 12 10Z" fill="${c}"/></svg>`,
  // Blaze: dark spiky burst (a raging fire)
  blaze:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 L14 8 L20 5 L16.5 10.5 L22 12 L16.5 13.5 L20 19 L14 16 L12 22 L10 16 L4 19 L7.5 13.5 L2 12 L7.5 10.5 L4 5 L10 8 Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="${c}"/></svg>`,
  // Soul: flame inside a rounded square (matches the Fire Mastery token art)
  soul:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="1.8"/><path d="M12 5.5 C12.7 8.5 15.5 10 15.5 13.5 A3.5 3.5 0 0 1 8.5 13.5 C8.5 10.8 10.8 9.5 12 5.5Z" fill="${c}" fill-opacity="0.5" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  // Meteor: comet with impact trail
  meteor:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M21 3 L11 13" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M19 8 L14 13 M16 3 L11 8" stroke="${c}" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/><circle cx="8.5" cy="15.5" r="5.5" fill="${c}" fill-opacity="0.35" stroke="${c}" stroke-width="1.9"/></svg>`,
};

// ─── DIE FACES ───────────────────────────────────────────────────────────────
// 1-3 Flame, 4 Blaze, 5 Soul, 6 Meteor.
// {F}=FLAME {B}=BLAZE {S}=SOUL {M}=METEOR
const FACES=[null,
  {t:"FLAME", c:"#E07028"},
  {t:"FLAME", c:"#E07028"},
  {t:"FLAME", c:"#E07028"},
  {t:"BLAZE", c:"#C83820"},
  {t:"SOUL",  c:"#E8A030"},
  {t:"METEOR",c:"#A04830"},
];

// ─── ABILITIES ───────────────────────────────────────────────────────────────
// Board order: fireball, burning soul, pyroblast, combustion (left side),
// hot streak, meteorite, ignite (right side), molten armor (def),
// scorch the earth (ult).
const ABIL=[
  {id:"fireball",n:"FIREBALL",c:"#E07028",t:"off",
   req:[{type:"flame",count:3}],hideReq:true,
   fx:"{F}{F}{F} → 4 Blockable\n{F}{F}{F}{F} → 6 Blockable\n{F}{F}{F}{F}{F} → 8 Blockable\nGain 1 Fire Mastery."},
  {id:"burnsoul",n:"BURNING SOUL",c:"#E8A030",t:"off",
   req:[{type:"soul",count:2}],
   fx:"Gain 2 Fire Mastery.\nDeal 1 X Fire Mastery collateral dmg to all opponents."},
  {id:"pyroblast",n:"PYROBLAST",c:"#C83820",t:"off",
   req:[{type:"flame",count:3}],
   fx:"Deal 6 Blockable and roll 1:\nOn {M}, add 3 dmg.\nOn {B}, inflict Burn.\nOn {S}, gain 2 Fire Mastery.\nOn {F}, inflict Knockdown."},
  {id:"combustion",n:"COMBUSTION",c:"#B05018",t:"off",
   req:[{type:"flame",count:1},{type:"blaze",count:1},{type:"soul",count:1},{type:"meteor",count:1}],
   fx:"Gain 1 Fire Mastery.\nThen remove up to 4 Fire Mastery tokens and deal 3 Undefendable per token removed."},
  {id:"hotstreak",n:"HOT STREAK",c:"#E08828",t:"off",
   req:[{type:"text",label:"Small Straight"}],
   fx:"Gain 2 Fire Mastery.\nThen deal 5 + 1 dmg per Fire Mastery."},
  {id:"meteorite",n:"METEORITE",c:"#A04830",t:"off",
   req:[{type:"meteor",count:4}],
   fx:"Gain 2 Fire Mastery.\nInflict Stun.\nThen deal 1 Undefendable per Fire Mastery.\nAdditionally, deal 2 collateral dmg to all opponents."},
  {id:"ignite",n:"IGNITE",c:"#D84018",t:"off",
   req:[{type:"text",label:"Large Straight"}],
   fx:"Gain 2 Fire Mastery.\nThen deal 4 + 2 dmg per Fire Mastery."},
  {id:"molten",n:"MOLTEN ARMOR",c:"#1E6830",t:"def",defDice:5,
   req:[],
   fx:"Gain 1 Fire Mastery X {S}.\nDeal 1 dmg X {F}."},
  {id:"scorch",n:"SCORCH THE EARTH!",c:"#906808",t:"ult",ultDice:5,rowGrow:1.5,
   req:[{type:"meteor",count:5}],hideReq:true,
   fx:"Gain 3 Fire Mastery.\nInflict Knockdown & Burn.\n12 Blockable.\nAdditionally, deal 2 collateral dmg to all opponents."},
];

// ─── UPGRADES ────────────────────────────────────────────────────────────────
// None yet — upgrade cards will be transcribed later.
const ABIL2={};
const CARD_UPGRADES={};

// ─── CARDS ───────────────────────────────────────────────────────────────────
// Shared global cards only for now; Pyromancer's unique cards to be added later.
const CARDS=[];

const GLOBAL_CARDS=[
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
];
GLOBAL_CARDS.forEach(c=>CARDS.push(c));

// ─── TOKENS ──────────────────────────────────────────────────────────────────
// No board-slot tokens — Fire Mastery lives in the corner widget instead.
function renderTokens(player, playerState, container) {
  container.innerHTML = "";
}
function initTokenState() {
  return {};
}

function initFormState() {
  return { fm: 0 };
}

// ─── FIRE MASTERY COUNTER ────────────────────────────────────────────────────
// Pinned to the top-left corner of this player's playspace (same slot the
// Druid uses for form switching). One orange rounded-square counter, 0-5.
// Click to add a Fire Mastery token, right-click to remove one.
function renderFormWidget(player, formState, container) {
  container.innerHTML = "";
  if (typeof formState.fm !== "number") formState.fm = 0;

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;align-items:center;gap:7px;pointer-events:auto";

  // The token itself: rounded square with a flame, count in the middle.
  const tok = document.createElement("div");
  tok.style.cssText = "position:relative;width:34px;height:34px;flex-shrink:0;cursor:pointer;user-select:none";
  tok.title = "Fire Mastery (click +, right-click −, max 5)";
  tok.innerHTML =
    '<svg width="34" height="34" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#E8A03026" stroke="#E8A030" stroke-width="2"/>'
    + '<path d="M12 4.5 C12.7 7.5 15.5 9 15.5 12.5 A3.5 3.5 0 0 1 8.5 12.5 C8.5 9.8 10.8 8.5 12 4.5Z" fill="#E8A03040" stroke="#E8A030" stroke-width="1.2"/></svg>'
    + '<span style="position:absolute;left:0;right:0;top:9px;text-align:center;font-size:12px;font-weight:800;color:#F8C060;text-shadow:0 1px 2px #0008">' + formState.fm + '</span>';
  tok.addEventListener("click", () => {
    if (window.netCanEdit && !window.netCanEdit(player)) return;
    formState.fm = Math.min(5, formState.fm + 1);
    renderFormWidget(player, formState, container);
    if (window.netTokens) window.netTokens(player);
  });
  tok.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (window.netCanEdit && !window.netCanEdit(player)) return;
    formState.fm = Math.max(0, formState.fm - 1);
    renderFormWidget(player, formState, container);
    if (window.netTokens) window.netTokens(player);
  });
  wrap.appendChild(tok);

  const lbl = document.createElement("div");
  lbl.textContent = "FIRE MASTERY";
  lbl.style.cssText = "font-size:8px;font-weight:700;letter-spacing:.6px;color:#E8A030";
  wrap.appendChild(lbl);

  container.appendChild(wrap);
}

function dieIcon(faceValue, locked, size) {
  const f = FACES[faceValue];
  const c = locked ? "#253045" : f.c;
  if (f.t === "FLAME")  return I.flame(c, size);
  if (f.t === "BLAZE")  return I.blaze(c, size);
  if (f.t === "SOUL")   return I.soul(c, size);
  return I.meteor(c, size);
}

// ─── STATUS TOKENS (draggable overlay pieces) ────────────────────────────────
// The Pyromancer hands out Burn, Stun, and Knockdown. Two red BURN tokens,
// one yellow STUN token, and one brown KNOCKDOWN token per player, anchored
// next to the Fire Mastery counter. Draggable + net-synced through the shared
// overlay system, same as the Druid's Wound tokens.
function buildOverlayTokens(player, addFn, removeFn) {
  setTimeout(() => placePyroTokens(player), 80);
}

function placePyroTokens(player) {
  const anchor = document.getElementById(player + "formwidget");

  let baseX = 420, baseY = window.innerHeight / 2;
  if (anchor) {
    const r = anchor.getBoundingClientRect();
    baseX = r.right + 10;
    baseY = r.top + r.height / 2 - 16;
  }

  // Second row sits toward the game board: below for P1, above for P2.
  const row2DY = player === "p1" ? 44 : -44;

  const mk = (id, svg) => {
    if (document.getElementById(id)) return null;
    const el = document.createElement("div");
    el.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:1px";
    el.innerHTML = svg;
    return el;
  };

  // Row 1: two BURN tokens (red circle with a flame)
  const burnSVG =
    '<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#E0482833" stroke="#E04828" stroke-width="2"/>'
    + '<path d="M12 5.5 C12.7 8.5 15.5 10 15.5 13.5 A3.5 3.5 0 0 1 8.5 13.5 C8.5 10.8 10.8 9.5 12 5.5Z" fill="#E0482855" stroke="#E04828" stroke-width="1.4"/></svg>';
  for (let i = 0; i < 2; i++) {
    const el = mk("burn_" + player + "_" + i, burnSVG);
    if (el) { el.title = "Burn"; window.addOverlayToken("burn_" + player + "_" + i, el, baseX + i * 40, baseY); }
  }

  // Row 2: STUN (yellow, spiral) and KNOCKDOWN (brown, down arrow)
  const stunSVG =
    '<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#E8D04033" stroke="#E8D040" stroke-width="2"/>'
    + '<path d="M12 12 m0 -1 a1 1 0 0 1 1 1 a2 2 0 0 1 -2 2 a3.5 3.5 0 0 1 -3.5 -3.5 a5 5 0 0 1 5 -5 a6.5 6.5 0 0 1 6.5 6.5" stroke="#E8D040" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
  const kdSVG =
    '<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#C0882833" stroke="#C08828" stroke-width="2"/>'
    + '<path d="M12 5.5 V15 M7.5 11 L12 15.5 L16.5 11" stroke="#C08828" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 18.5 H17" stroke="#C08828" stroke-width="2.2" stroke-linecap="round"/></svg>';
  let el = mk("stun_" + player, stunSVG);
  if (el) { el.title = "Stun"; window.addOverlayToken("stun_" + player, el, baseX, baseY + row2DY); }
  el = mk("kd_" + player, kdSVG);
  if (el) { el.title = "Knockdown"; window.addOverlayToken("kd_" + player, el, baseX + 40, baseY + row2DY); }
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
window.DT_CHARACTERS = window.DT_CHARACTERS || {};
window.DT_CHARACTERS["pyromancer"] = {
  id:                  "pyromancer",
  name:                "Pyromancer",
  abilities:           ABIL,
  upgrades:            ABIL2,
  cardUpgrades:        CARD_UPGRADES,
  cards:               CARDS,
  faces:               FACES,
  fxKeywords:          [["Fire Mastery","#E8A030"],["Burn","#E04828"],["Stun","#E8D040"],["Knockdown","#C08828"],["collateral","#B080D0"]],
  dieIcon:             dieIcon,
  renderTokens:        renderTokens,
  initTokenState:      initTokenState,
  hasHexTokens:        false,
  hasFormWidget:       true,
  renderFormWidget:    renderFormWidget,
  initFormState:       initFormState,
  buildOverlayTokens:  buildOverlayTokens,
};

})();
