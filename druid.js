// druid.js — Dice Throne: Druid character definition
// Starting scope: dice + board only. Uses the shared global cards for now
// (no unique spell/upgrade cards yet).

(function(){

// ─── DIE FACE ICONS ──────────────────────────────────────────────────────────
const I={
  // Claw: three curved slash marks
  claw:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M6 3 C5 8 5.5 13 6 17" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><path d="M12 2 C12 8 12 13 12 18" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><path d="M18 3 C19 8 18.5 13 18 17" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  // Paw: rounded pad + four toes
  paw:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="16" rx="6" ry="5" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.8"/><circle cx="6" cy="7.5" r="2.3" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.6"/><circle cx="12" cy="5.5" r="2.3" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.6"/><circle cx="18" cy="7.5" r="2.3" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.6"/></svg>`,
  // Nature: leaf shape
  leaf:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M4 20 Q4 6 20 3 Q19 15 12 18 Q7 20 4 20Z" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 19 Q11 12 19 4" stroke="${c}" stroke-width="1.3" opacity="0.6"/></svg>`,
};

// ─── DIE FACES ───────────────────────────────────────────────────────────────
// 1-3 Claw, 4-5 Paw, 6 Nature.
// {C}=CLAW {P}=PAW {N}=NATURE
const FACES=[null,
  {t:"CLAW",  c:"#C0402C"},
  {t:"CLAW",  c:"#C0402C"},
  {t:"CLAW",  c:"#C0402C"},
  {t:"PAW",   c:"#B0862C"},
  {t:"PAW",   c:"#B0862C"},
  {t:"NATURE",c:"#289048"},
];

// ─── ABILITIES ───────────────────────────────────────────────────────────────
// Board order: ferocity, nature's cure, wild realignment, maul, forest's call,
// forest's answer, protect the forest (def slot, shared with ult), thick hide (def),
// wrath of nature (ult, shared with protect the forest)
const ABIL=[
  {id:"ferocity",n:"FEROCITY",c:"#C0402C",t:"off",
   req:[{type:"claw",count:3}],hideReq:true,
   fx:"{C}{C}{C} → 4 Blockable\n{C}{C}{C}{C} → 5 Blockable\n{C}{C}{C}{C}{C} → 6 Blockable\n4OAK: Inflict Wound"},
  {id:"cure",    n:"NATURE'S CURE",   c:"#289048",t:"off",
   req:[{type:"claw",count:2},{type:"nature",count:2}],
   fx:"Gain Regenerate.\n6 Blockable"},
  {id:"realign", n:"WILD REALIGNMENT",c:"#B0862C",t:"off",
   req:[{type:"claw",count:1},{type:"paw",count:2},{type:"nature",count:1}],
   fx:"Gain 1 CP and 2 Shape Shift.\nThen draw 1 if in Druid form."},
  {id:"maul",    n:"MAUL",            c:"#8C5A1E",t:"off",
   req:[{type:"paw",count:4}],
   fx:"Roll 2 dice and deal dmg equal to total value.\nIf in Bear form, you may reroll one."},
  {id:"call",    n:"FOREST'S CALL",   c:"#3A9C5C",t:"off",
   req:[{type:"text",label:"Small Straight"}],
   fx:"Gain Shape Shift.\n6 Blockable"},
  {id:"answer",  n:"FOREST'S ANSWER", c:"#1E6830",t:"off",
   req:[{type:"text",label:"Large Straight"}],
   fx:"Gain Shape Shift.\nDeal 7 Blockable and roll 1:\nOn {C}, +2 dmg.\nOn {P}, gain Shape Shift.\nOn {N}, gain Regenerate."},
  {id:"protect", n:"PROTECT THE FOREST",c:"#1E6830",t:"off",pairWith:"wrath",searchSlot:true,
   req:[{type:"nature",count:4}],
   fx:"Gain Regenerate and Shape Shift.\n6 Undefendable"},
  {id:"hide",    n:"THICK HIDE",      c:"#1E6830",t:"def",defDice:2,
   req:[],
   fx:"1 Undefendable X {C}\nIf in Bear form, roll 4 dice instead and prevent 1X({P}+{N}) dmg."},
  {id:"wrath",   n:"WRATH OF NATURE!",c:"#906808",t:"ult",ultDice:5,pairWith:"protect",rowGrow:1.5,
   req:[{type:"nature",count:5}],hideReq:true,
   fx:"Gain Regenerate and 2 Shape Shift.\n12 Undefendable"},
];

// No upgrades yet — Druid starts with just the printed board.
const ABIL2={};
const CARD_UPGRADES={};

// ─── CARDS ───────────────────────────────────────────────────────────────────
// No unique cards yet — Druid uses only the shared global cards for now.
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
  if (f.t === "CLAW") return I.claw(c, size);
  if (f.t === "PAW")  return I.paw(c, size);
  return I.leaf(c, size);
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
window.DT_CHARACTERS = window.DT_CHARACTERS || {};
window.DT_CHARACTERS["druid"] = {
  id:                  "druid",
  name:                "Druid",
  abilities:           ABIL,
  upgrades:            ABIL2,
  cardUpgrades:        CARD_UPGRADES,
  cards:               CARDS,
  faces:               FACES,
  fxKeywords:          [["Shape Shift","#3A9C5C"],["Regenerate","#289048"],["Bear form","#8C5A1E"],["Druid form","#4890E0"]],
  dieIcon:             dieIcon,
  renderTokens:        renderTokens,
  initTokenState:      initTokenState,
  hasHexTokens:        false,
};

})();
