// pyromancer.js — Dice Throne: Pyromancer character definition
// Starting scope: dice + board only. Uses the shared global cards for now
// (no unique spell/upgrade cards or tokens yet — Fire Mastery tracking to
// be added later).

(function(){

// ─── DIE FACE ICONS ──────────────────────────────────────────────────────────
const I={
  // Flame: single teardrop flame
  flame:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 C13 6 17 8 17 13 A5 5 0 0 1 7 13 C7 9 10 7 12 2Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10 C12.5 12 14 12.5 14 14.5 A2 2 0 0 1 10 14.5 C10 13 11.5 12 12 10Z" fill="${c}"/></svg>`,
  // Blaze: dark spiky burst (a raging fire)
  blaze:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 L14 8 L20 5 L16.5 10.5 L22 12 L16.5 13.5 L20 19 L14 16 L12 22 L10 16 L4 19 L7.5 13.5 L2 12 L7.5 10.5 L4 5 L10 8 Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="${c}"/></svg>`,
  // Soul Flame: flame silhouette with a small female-person emoji nested inside
  soul:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 C13 6 17 8 17 13 A5 5 0 0 1 7 13 C7 9 10 7 12 2Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><text x="12" y="15.2" text-anchor="middle" font-size="7" font-family="sans-serif">🚺</text></svg>`,
  // Meteor: comet with impact trail
  meteor:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M21 3 L11 13" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M19 8 L14 13 M16 3 L11 8" stroke="${c}" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/><circle cx="8.5" cy="15.5" r="5.5" fill="${c}" fill-opacity="0.35" stroke="${c}" stroke-width="1.9"/></svg>`,
};

// ─── DIE FACES ───────────────────────────────────────────────────────────────
// 1-3 Flame, 4 Blaze, 5 Soul Flame, 6 Meteor.
// {F}=FLAME {B}=BLAZE {S}=SOUL {M}=METEOR
const FACES=[null,
  {t:"FLAME", c:"#E07028"},
  {t:"FLAME", c:"#E07028"},
  {t:"FLAME", c:"#E07028"},
  {t:"BLAZE", c:"#C83820"},
  {t:"SOUL",  c:"#3888E0"},
  {t:"METEOR",c:"#A04830"},
];

// ─── ABILITIES ───────────────────────────────────────────────────────────────
// Board order: fireball, pyroblast, burning soul, combustion, hot streak,
// ignite, meteorite (7 offensive abilities fill cols 1-7), then molten armor
// (def, top) and scorch the earth (ult, bottom) share col 8 — the board's
// default pairing whenever the ult doesn't declare pairWith.
const ABIL=[
  {id:"fireball",n:"FIREBALL",c:"#E07028",t:"off",
   req:[{type:"flame",count:3}],hideReq:true,
   fx:"{F}{F}{F} → 4 Blockable\n{F}{F}{F}{F} → 6 Blockable\n{F}{F}{F}{F}{F} → 8 Blockable\nGain 1 Fire Mastery."},
  {id:"pyroblast",n:"PYROBLAST",c:"#C83820",t:"off",
   req:[{type:"flame",count:3},{type:"meteor",count:1}],
   fx:"6 Blockable and roll 1 die:\nOn {F}, 3 Blockable.\nOn {B}, inflict Burn.\nOn {S}, gain 2 Fire Mastery.\nOn {M}, inflict Knockdown."},
  {id:"burnsoul",n:"BURNING SOUL",c:"#E8A030",t:"off",
   req:[{type:"soul",count:2}],
   fx:"Gain 2 Fire Mastery.\n1 Undefendable X {F}."},
  {id:"combustion",n:"COMBUSTION",c:"#B05018",t:"off",
   req:[{type:"flame",count:1},{type:"blaze",count:1},{type:"soul",count:1},{type:"meteor",count:1}],
   fx:"Gain 1 Fire Mastery.\nThen remove up to 4 Fire Mastery tokens and deal 3 Undefendable per token removed."},
  {id:"hotstreak",n:"HOT STREAK",c:"#E08828",t:"off",
   req:[{type:"text",label:"Small Straight"}],
   fx:"Gain 2 Fire Mastery.\nThen deal 5 Blockable + (1 X Fire Mastery)."},
  {id:"ignite",n:"IGNITE",c:"#D84018",t:"off",
   req:[{type:"text",label:"Large Straight"}],
   fx:"Gain 2 Fire Mastery.\nThen deal 4 + (2 X Fire Mastery)."},
  {id:"meteorite",n:"METEORITE",c:"#A04830",t:"off",
   req:[{type:"meteor",count:4}],
   fx:"Gain 2 Fire Mastery. Inflict Stun.\nDeal 2 Undefendable + (1 X Fire Mastery)."},
  {id:"molten",n:"MOLTEN ARMOR",c:"#1E6830",t:"def",defDice:5,
   req:[],
   fx:"Gain 1 Fire Mastery X {S}.\nDeal 1 Undefendable X {F}."},
  {id:"scorch",n:"SCORCH THE EARTH!",c:"#906808",t:"ult",ultDice:5,rowGrow:1.5,
   req:[{type:"meteor",count:5}],hideReq:true,
   fx:"Gain 3 Fire Mastery. Inflict Knockdown and Burn. 14 Undefendable."},
];

// ─── UPGRADES ────────────────────────────────────────────────────────────────
// Pyromancer has a two-level upgrade system: each ability can go base → 2 or
// base → 3 directly (level 2 is optional). If a level 2 is already on the
// board, the matching level 3 card's CP cost is discounted by the level 2's
// CP cost (handled by the board engine via the upgLevel property on cards).
// ABIL2 is keyed by CARD id (not ability id) since one ability can have two
// different upgrade defs; the engine checks card id first.
const ABIL2={
  p_pyro2:{n:"PYROBLAST 2",c:"#C83820",t:"off",
    req:[{type:"flame",count:3},{type:"meteor",count:1}],
    fx:"6 Blockable and roll 2 dice:\nAdd 3 dmg X {F}.\nOn {B}, inflict Burn.\nGain 2 X {S} Fire Mastery.\nOn {M}, inflict Knockdown."},
  p_pyro3:{n:"PYROBLAST 3",c:"#C83820",t:"off",
    req:[{type:"flame",count:3},{type:"meteor",count:1}],
    fx:"6 Blockable and roll 2 dice:\nYou may re-roll 1:\nAdd 3 dmg X {F}.\nOn {B}, inflict Burn.\nGain 2 X {S} Fire Mastery.\nOn {M}, inflict Knockdown."},
  p_molt2:{n:"MOLTEN ARMOR 2",c:"#1E6830",t:"def",defDice:5,
    req:[],
    fx:"Gain 1 Fire Mastery X {S}.\nOn {F}{B}, inflict Burn.\nDeal 1 Undefendable X {F}."},
  p_molt3:{n:"MOLTEN ARMOR 3",c:"#1E6830",t:"def",defDice:5,
    req:[],
    fx:"Gain 1 Fire Mastery per {S} or {M}.\nOn {F}{B}, inflict Burn.\n1 Undefendable per {F} or {M}."},
  p_fire2:{n:"FIREBALL 2",c:"#E07028",t:"off",
    req:[{type:"flame",count:3}],hideReq:true,
    fx:"{F}{F}{F} → 4 Blockable\n{F}{F}{F}{F} → 6 Blockable\n{F}{F}{F}{F}{F} → 8 Blockable\nGain 2 Fire Mastery."},
  p_ign2:{n:"IGNITE 2",c:"#D84018",t:"off",
    req:[{type:"text",label:"Large Straight"}],
    fx:"Gain 2 Fire Mastery.\nInflict Burn.\nDeal 5 Blockable + (2 X Fire Mastery)."},
  p_burn2:{n:"BURNING SOUL 2",c:"#E8A030",t:"off",
    req:[{type:"soul",count:2}],
    fx:"On {S}{S}{S}, inflict Burn.\nOn {S}{S}{S}{S}, increase Fire Mastery limit by 1.\nGain 2 X {S} Fire Mastery.\nDeal 1 Undefendable X {S}.",
    sub:{n:"BLAZING SOUL",c:"#E8A030",
      req:[{type:"blaze",count:2},{type:"soul",count:2}],
      fx:"Increase Fire Mastery limit by 1.\nGain 5 Fire Mastery.\nInflict Knockdown."}},
  p_comb2:{n:"COMBUSTION 2",c:"#B05018",t:"off",
    req:[{type:"flame",count:1},{type:"blaze",count:1},{type:"soul",count:1},{type:"meteor",count:1}],
    fx:"Gain 1 Fire Mastery.\nRemove up to 4 Fire Mastery and deal 4 Undefendable for each."},
  p_hot2:{n:"HOT STREAK 2",c:"#E08828",t:"off",
    req:[{type:"text",label:"Small Straight"}],
    fx:"Gain 2 Fire Mastery.\n6 Blockable + (1 X Fire Mastery).",
    sub:{n:"SCORCH",c:"#E08828",
      req:[{type:"flame",count:2},{type:"blaze",count:2}],
      fx:"Gain 2 Fire Mastery.\nInflict Burn. 6 Blockable."}},
  p_met2:{n:"METEORITE 2",c:"#A04830",t:"off",
    req:[{type:"meteor",count:4}],
    fx:"Gain 2 Fire Mastery.\nInflict Stun.\n3 Undefendable + (1 X Fire Mastery).",
    sub:{n:"METEOROID",c:"#A04830",
      req:[{type:"meteor",count:3}],
      fx:"Inflict Knockdown, Burn, and Stun."}},
};

// Card id → ability slot it upgrades (drop target on the board)
const CARD_UPGRADES={
  p_pyro2:"pyroblast", p_pyro3:"pyroblast",
  p_molt2:"molten",    p_molt3:"molten",
  p_fire2:"fireball",
  p_ign2:"ignite",
  p_burn2:"burnsoul",
  p_comb2:"combustion",
  p_hot2:"hotstreak",
  p_met2:"meteorite",
};

// ─── CARDS ───────────────────────────────────────────────────────────────────
// Unique cards. Upgrade cards carry upgLevel (2 or 3) — the engine uses it
// for the level-3 CP discount and for allowing a 3 to replace a placed 2.
const CARDS=[
  {id:"p_pyro2",n:"PYROBLAST 2",   cp:2,t:"blue",upgLevel:2,e:"💥🎲",x:"UPGRADE Pyroblast: Deal 6 dmg and roll 2 dice. Add 3 dmg per Flame. On Blaze inflict Burn. Gain 2 Fire Mastery per Soul. On Meteor, inflict Knockdown."},
  {id:"p_pyro3",n:"PYROBLAST 3",   cp:3,t:"blue",upgLevel:3,e:"💥💥",x:"UPGRADE Pyroblast: Deal 6 dmg and roll 2 dice, you may re-roll 1. Add 3 dmg per Flame. On Blaze inflict Burn. Gain 2 Fire Mastery per Soul. On Meteor, inflict Knockdown."},
  {id:"p_molt2",n:"MOLTEN ARMOR 2",cp:1,t:"blue",upgLevel:2,e:"🛡🔥",x:"UPGRADE Molten Armor: Gain 1 Fire Mastery per Soul. On Flame+Blaze, inflict Burn. Deal 1 undefendable per Flame."},
  {id:"p_molt3",n:"MOLTEN ARMOR 3",cp:3,t:"blue",upgLevel:3,e:"🛡🌋",x:"UPGRADE Molten Armor: Gain 1 Fire Mastery per Soul or Meteor. On Flame+Blaze, inflict Burn. 1 undefendable per Flame or Meteor."},
  {id:"p_fire2",n:"FIREBALL 2",    cp:1,t:"blue",upgLevel:2,e:"🔥🎯",x:"UPGRADE Fireball: 3F→4, 4F→6, 5F→8 dmg. Gain 2 Fire Mastery."},
  {id:"p_ign2", n:"IGNITE 2",      cp:2,t:"blue",upgLevel:2,e:"🔥📈",x:"UPGRADE Ignite (Large Straight): Gain 2 Fire Mastery. Inflict Burn. Deal 5 dmg plus 2 per Fire Mastery."},
  {id:"p_burn2",n:"BURNING SOUL 2 + BLAZING SOUL",cp:1,t:"blue",upgLevel:2,e:"👤🔥",x:"UPGRADE Burning Soul (2 Souls): On 3 Souls inflict Burn. On 4 Souls increase Fire Mastery limit by 1. Gain 2 Fire Mastery per Soul. Deal 1 undefendable per Soul. ADDS Blazing Soul (2 Blaze + 2 Souls): Increase Fire Mastery limit by 1, gain 5 Fire Mastery, inflict Knockdown."},
  {id:"p_comb2",n:"COMBUSTION 2",  cp:2,t:"blue",upgLevel:2,e:"⚙💣",x:"UPGRADE Combustion: Gain 1 Fire Mastery. Remove up to 4 Fire Mastery and deal 4 undefendable for each."},
  {id:"p_hot2", n:"HOT STREAK 2 + SCORCH",cp:2,t:"blue",upgLevel:2,e:"🎰🔥",x:"UPGRADE Hot Streak (Small Straight): Gain 2 Fire Mastery. 6 dmg plus 1 per Fire Mastery. ADDS Scorch (2 Flame + 2 Blaze): Gain 2 Fire Mastery, inflict Burn, 6 dmg."},
  {id:"p_met2", n:"METEORITE 2 + METEOROID",cp:2,t:"blue",upgLevel:2,e:"☄☄",x:"UPGRADE Meteorite (4 Meteors): Gain 2 Fire Mastery. Inflict Stun. 3 undefendable plus 1 per Fire Mastery. ADDS Meteoroid (3 Meteors): Inflict Knockdown, Burn, and Stun."},
  {id:"p_redhot",n:"RED HOT!",     cp:1,t:"orange",e:"🌶🔥",x:"Add 1 dmg per Fire Mastery."},
  {id:"p_warmup",n:"WARM UP",      cp:0,t:"blue",  e:"🔥☝",x:"Gain 1 Fire Mastery. Spend X CP, gain X Fire Mastery."},
  {id:"p_fireup",n:"FIRE UP!",     cp:3,t:"blue",  e:"🔥⬆",x:"Increase Fire Mastery limit by 1. Gain 2 Fire Mastery."},
  {id:"p_huzzah",n:"HUZZAH!",      cp:1,t:"orange",e:"🎉🎲",x:"Roll 1 die. Flame: add 3 dmg. Blaze: inflict Burn. Soul: gain 2 Fire Mastery. Meteor: inflict Knockdown."},
];

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
function renderTokens(player, playerState, container) {
  container.innerHTML = "";
}
function initTokenState() {
  return {};
}

// ─── FIRE MASTERY COUNTER ────────────────────────────────────────────────────
// "FIRE MASTERY: MAX X" where X is click-to-type (defaults to 5). A regular
// +/- counter below it starts at 0 and cannot exceed the max.
function initFormState() {
  return { fm: 0, fmMax: 5 };
}

function renderFormWidget(player, formState, container) {
  container.innerHTML = "";
  if (typeof formState.fm !== "number") formState.fm = 0;
  if (typeof formState.fmMax !== "number") formState.fmMax = 5;

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:3px;align-items:flex-start;pointer-events:auto";

  // "FIRE MASTERY: MAX X" — the X is a click-to-type field
  const maxRow = document.createElement("div");
  maxRow.style.cssText = "display:flex;align-items:center;gap:3px;font-size:9px;font-weight:700;letter-spacing:.5px;color:#E8A030";
  const maxLbl = document.createElement("span");
  maxLbl.textContent = "FIRE MASTERY: MAX ";
  maxRow.appendChild(maxLbl);
  const maxVal = document.createElement("span");
  maxVal.textContent = formState.fmMax;
  maxVal.style.cssText = "cursor:pointer;text-decoration:underline dotted;text-underline-offset:2px";
  maxVal.title = "Click to set the Fire Mastery max";
  maxVal.addEventListener("click", () => {
    if (window.netCanEdit && !window.netCanEdit(player)) return;
    const inp = document.createElement("input");
    inp.type = "number";
    inp.value = formState.fmMax;
    inp.style.cssText = "width:32px;font-size:9px;font-weight:700;background:var(--surf);border:1px solid #E8A030;border-radius:3px;color:#E8A030;text-align:center;outline:none";
    maxRow.replaceChild(inp, maxVal);
    inp.focus(); inp.select();
    const commit = () => {
      const v = parseInt(inp.value);
      if (!isNaN(v) && v >= 0) formState.fmMax = v;
      formState.fm = Math.min(formState.fm, formState.fmMax);
      renderFormWidget(player, formState, container);
      if (window.netTokens) window.netTokens(player);
    };
    inp.addEventListener("blur", commit);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") inp.blur(); });
  });
  maxRow.appendChild(maxVal);
  wrap.appendChild(maxRow);

  // Regular +/- counter, 0 to fmMax
  const ctrRow = document.createElement("div");
  ctrRow.style.cssText = "display:flex;align-items:center;gap:6px";
  const mkBtn = (label, delta) => {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = "font-size:11px;font-weight:800;width:18px;height:18px;line-height:1;border-radius:4px;border:1.5px solid #E8A030;background:#E8A03018;color:#E8A030;cursor:pointer";
    b.addEventListener("click", () => {
      if (window.netCanEdit && !window.netCanEdit(player)) return;
      formState.fm = Math.max(0, Math.min(formState.fmMax, formState.fm + delta));
      renderFormWidget(player, formState, container);
      if (window.netTokens) window.netTokens(player);
    });
    return b;
  };
  ctrRow.appendChild(mkBtn("−", -1));
  const numEl = document.createElement("span");
  numEl.textContent = formState.fm;
  numEl.style.cssText = "font-size:15px;font-weight:800;color:#F8C060;min-width:16px;text-align:center";
  ctrRow.appendChild(numEl);
  ctrRow.appendChild(mkBtn("+", 1));
  wrap.appendChild(ctrRow);

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
// One of each: yellow (sleeping face — Stun), red (fire — Burn), blue (spiral —
// Knockdown/dizzy). Anchored next to the Fire Mastery widget, draggable and
// net-synced through the shared overlay system, same as the Druid's tokens.
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

  const mk = (id, svg, title) => {
    if (document.getElementById(id)) return;
    const el = document.createElement("div");
    el.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:1px";
    el.innerHTML = svg;
    el.title = title;
    return el;
  };

  const tokenSVG = (ring, fill, emoji) =>
    '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="' + fill + '" stroke="' + ring + '" stroke-width="2"/>'
    + '<text x="12" y="16.3" text-anchor="middle" font-size="12" fill="#000000">' + emoji + '</text></svg>';

  let el = mk("pyro_sleep_" + player, tokenSVG("#E8D040", "#E8D04033", "😴"), "Stun");
  if (el) window.addOverlayToken("pyro_sleep_" + player, el, baseX, baseY);

  el = mk("pyro_burn_" + player, tokenSVG("#E04828", "#E0482833", "🔥"), "Burn");
  if (el) window.addOverlayToken("pyro_burn_" + player, el, baseX + 40, baseY);

  el = mk("pyro_dizzy_" + player, tokenSVG("#4090E0", "#4090E033", "🌀"), "Knockdown");
  if (el) window.addOverlayToken("pyro_dizzy_" + player, el, baseX + 80, baseY);
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
  fxKeywords:          [["Fire Mastery","#E8A030"],["Burn","#E04828"],["Stun","#E8D040"],["Knockdown","#C08828"]],
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
