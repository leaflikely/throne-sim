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
  // Soul Flame: flame inside a rounded square (matches the Fire Mastery token art)
  soul:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="1.8"/><path d="M12 5.5 C12.7 8.5 15.5 10 15.5 13.5 A3.5 3.5 0 0 1 8.5 13.5 C8.5 10.8 10.8 9.5 12 5.5Z" fill="${c}" fill-opacity="0.5" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
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
  {t:"SOUL",  c:"#E8A030"},
  {t:"METEOR",c:"#A04830"},
];

// ─── ABILITIES ───────────────────────────────────────────────────────────────
// Board order: fireball, burning soul, combustion, hot streak, ignite,
// meteorite (6 offensive abilities fill cols 1-6), then molten armor (def)
// and scorch the earth (ult) share col 8 — def on top, ult on bottom, which
// is the board's default pairing whenever the ult doesn't declare pairWith.
const ABIL=[
  {id:"fireball",n:"FIREBALL",c:"#E07028",t:"off",
   req:[{type:"flame",count:3}],hideReq:true,
   fx:"{F}{F}{F} → 4 Blockable\n{F}{F}{F}{F} → 6 Blockable\n{F}{F}{F}{F}{F} → 8 Blockable\nGain 1 Fire Mastery."},
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
   fx:"Gain 3 Fire Mastery. Inflict Knockdown and Burn.\n14 Undefendable."},
];

// ─── UPGRADES ────────────────────────────────────────────────────────────────
// None yet — to be added later.
const ABIL2={};
const CARD_UPGRADES={};

// ─── CARDS ───────────────────────────────────────────────────────────────────
// No unique cards yet — shared global cards only for now.
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
// No unique tokens yet — placeholder empty state so the board loads cleanly.
function renderTokens(player, playerState, container) {
  container.innerHTML = "";
}
function initTokenState() {
  return {};
}

function dieIcon(faceValue, locked, size) {
  const f = FACES[faceValue];
  const c = locked ? "#253045" : f.c;
  if (f.t === "FLAME")  return I.flame(c, size);
  if (f.t === "BLAZE")  return I.blaze(c, size);
  if (f.t === "SOUL")   return I.soul(c, size);
  return I.meteor(c, size);
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
};

})();
