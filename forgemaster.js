// forgemaster.js — Dice Throne: Forgemaster character definition
// Unique trait: NO ability upgrades — the printed board is final.
// Two passive abilities (The Mines, The Forge) occupy board slots.

(function(){

// ─── DIE FACE ICONS ──────────────────────────────────────────────────────────
const I={
  // Pickaxe: curved twin-pointed head with a straight handle
  pickaxe:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M3 8 Q12 2 21 8" stroke="${c}" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M3 8 L4.5 10 Q12 5 19.5 10 L21 8" fill="${c}" fill-opacity="0.25"/><line x1="12" y1="5" x2="12" y2="22" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  // Hammer: blocky head on a handle
  hammer:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><rect x="4" y="3.5" width="16" height="7" rx="1.5" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.8"/><line x1="12" y1="10.5" x2="12" y2="22" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  // Anvil: classic horned silhouette on a base
  anvil:(c,s)=>`<svg class="dico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M2.5 6 Q3 9.5 8 10 L9 13 L7 15 L6 18 L18 18 L17 15 L15 13 L16 10 Q20.5 9.5 21.5 7.5 L21.5 6 Z" fill="${c}" fill-opacity="0.22" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/><rect x="7.5" y="19.5" width="9" height="2.5" rx="0.8" fill="${c}" fill-opacity="0.4" stroke="${c}" stroke-width="1.2"/></svg>`,
};

// ─── DIE FACES ───────────────────────────────────────────────────────────────
// 1-3 Pickaxe, 4-5 Hammer, 6 Anvil.
// First letter of each type is the {X} tag used in ability text:
// {P}=PICKAXE {H}=HAMMER {A}=ANVIL
const FACES=[null,
  {t:"PICKAXE",c:"#3A78D0"},
  {t:"PICKAXE",c:"#3A78D0"},
  {t:"PICKAXE",c:"#3A78D0"},
  {t:"HAMMER", c:"#E08020"},
  {t:"HAMMER", c:"#E08020"},
  {t:"ANVIL",  c:"#E8ECF2"},
];

// ─── ABILITIES ───────────────────────────────────────────────────────────────
// Board order: cols 1-7 = mines, forge, pickaxe, furnace, armored, haul, smelt
// Col 8 top = Masterwork (def), col 8 bottom = Final Touches! (ult)
const ABIL=[
  {id:"mines",  n:"THE MINES",   c:"#B07C18",t:"off",passive:true,req:[],
   fx:"During your upkeep, you may Mine your deck.\nOnce per turn, you may spend 3 CP at any time to draw 1."},
  {id:"forge",  n:"THE FORGE",   c:"#C04030",t:"off",passive:true,req:[],
   fx:"During your Main Phase, you may place any number of ORE from your hand on this passive ability."},
  {id:"pickaxe",n:"PICK AXE",    c:"#C87828",t:"off",
   req:[{type:"pickaxe",count:3}],hideReq:true,
   fx:"{P}{P}{P} → 5 Blockable\n{P}{P}{P}{P} → 6 Blockable\n{P}{P}{P}{P}{P} → 7 Blockable\n4OAK: Gain 1 CP"},
  {id:"furnace",n:"FURNACE",     c:"#D05020",t:"off",
   req:[{type:"hammer",count:4}],
   fx:"Deal 5 Blockable and roll 1 die:\nAdd dmg equal to the value rolled."},
  {id:"armored",n:"ARMORED UP",  c:"#7890B0",t:"off",
   req:[{type:"text",label:"Small Straight"}],hideReq:true,
   fx:"If you have 2 Armor, add 2 dmg.\nSmall Straight: 7 Blockable\nLarge Straight: 10 Blockable"},
  {id:"haul",   n:"A GOOD HAUL", c:"#28A050",t:"off",
   req:[{type:"pickaxe",count:1},{type:"hammer",count:1},{type:"anvil",count:2}],
   fx:"Mine your deck.\nYou may reveal all ORE mined this way and place them on THE FORGE.\n8 Blockable"},
  {id:"smelt",  n:"SMELTING TIME",c:"#8040C8",t:"off",
   req:[{type:"anvil",count:4}],
   fx:"Draw 1 · 9 Undefendable"},
  {id:"masterwork",n:"MASTERWORK",c:"#1E6830",t:"def",defDice:1,
   req:[],
   fx:"On {P}, Mine your deck.\nOn {H}, double the effect of one Armor.\nOn {A}, double the effect of up to two different Armor."},
  {id:"ult",    n:"FINAL TOUCHES!",c:"#906808",t:"ult",ultDice:5,pairWith:"smelt",
   req:[{type:"anvil",count:5}],hideReq:true,
   fx:"Search your deck for any one ORE.\nPlace it on THE FORGE.\n14 Undefendable"},
];

// Forgemaster's abilities never upgrade — both maps stay empty.
const ABIL2={};
const CARD_UPGRADES={};

// ─── CARDS ───────────────────────────────────────────────────────────────────
// Global deck only for now — Forgemaster's unique cards come later.
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
];

// ─── TOKENS ──────────────────────────────────────────────────────────────────
// Armor / Ore tokens come in the next pass — empty strip for now.
function renderTokens(player, playerState, container) {
  container.innerHTML = "";
}

function initTokenState() {
  return {};
}

function dieIcon(faceValue, locked, size) {
  const f = FACES[faceValue];
  const c = locked ? "#253045" : f.c;
  if (f.t === "PICKAXE") return I.pickaxe(c, size);
  if (f.t === "HAMMER")  return I.hammer(c, size);
  return I.anvil(c, size);
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
window.DT_CHARACTERS = window.DT_CHARACTERS || {};
window.DT_CHARACTERS["forgemaster"] = {
  id:                  "forgemaster",
  name:                "Forgemaster",
  abilities:           ABIL,
  upgrades:            ABIL2,
  cardUpgrades:        CARD_UPGRADES,
  cards:               CARDS,
  faces:               FACES,
  dieIcon:             dieIcon,
  renderTokens:        renderTokens,
  initTokenState:      initTokenState,
  hasHexTokens:        false,
  leaflet:             "Forgemaster_insert.png",
};

})();
