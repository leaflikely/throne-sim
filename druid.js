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
  // Wound: a claw-slash gash inside a filled circle
  wound:(stroke,fill,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/><path d="M8 6 C10 11 10 13 9 18" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/><path d="M12 5 C14 11 14 13 12.5 19" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/><path d="M16 6 C18 11 18 13 17 18" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/></svg>`,
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
   fx:"Gain Regenerate.\n5 Blockable"},
  {id:"realign", n:"WILD REALIGNMENT",c:"#B0862C",t:"off",
   req:[{type:"claw",count:1},{type:"paw",count:2},{type:"nature",count:1}],
   fx:"Gain 1 CP and 2 Shape Shift.\nThen draw 1 if in Druid Form."},
  {id:"maul",    n:"MAUL",            c:"#8C5A1E",t:"off",
   req:[{type:"paw",count:4}],
   fx:"Roll 2 dice and deal dmg equal to total value.\nIf in Bear Form, you may reroll one."},
  {id:"call",    n:"FOREST'S CALL",   c:"#3A9C5C",t:"off",
   req:[{type:"text",label:"Small Straight"}],
   fx:"Gain Shape Shift.\n6 Blockable"},
  {id:"answer",  n:"FOREST'S ANSWER", c:"#1E6830",t:"off",
   req:[{type:"text",label:"Large Straight"}],
   fx:"Gain Shape Shift.\nDeal 7 Blockable and roll 1:\nOn {C}, +2 dmg.\nOn {P}, gain Shape Shift.\nOn {N}, gain Regenerate."},
  {id:"protect", n:"PROTECT THE FOREST",c:"#1E6830",t:"off",
   req:[{type:"nature",count:4}],
   fx:"Gain Regenerate and Shape Shift. 6 Undefendable."},
  {id:"hide",    n:"THICK HIDE",      c:"#1E6830",t:"def",defDice:2,
   req:[],
   fx:"1 Undefendable X {C}\nIf in Bear Form, roll 4 dice instead and prevent 1X({P}+{N}) dmg."},
  {id:"wrath",   n:"WRATH OF NATURE!",c:"#906808",t:"ult",ultDice:5,rowGrow:1.5,
   req:[{type:"nature",count:5}],hideReq:true,
   fx:"Gain Regenerate and 2 Shape Shift. 12 Undefendable"},
];

// ─── UPGRADES ────────────────────────────────────────────────────────────────
// Upgraded ability versions, keyed by the base ability id they replace.
// A `sub` adds a second ability that shares the same board slot.
const ABIL2={
  ferocity:{n:"FEROCITY 2",c:"#C0402C",t:"off",
    req:[{type:"claw",count:3}],hideReq:true,
    fx:"{C}{C}{C} → 5 Blockable\n{C}{C}{C}{C} → 6 Blockable\n{C}{C}{C}{C}{C} → 7 Blockable\n3OAK: Inflict Wound"},
  maul:{n:"MAUL 2",c:"#8C5A1E",t:"off",
    req:[{type:"paw",count:4}],
    fx:"Roll 2 dice and deal dmg equal to total value.\nIf in Bear Form, you may reroll one.",
    sub:{n:"SAVAGE MAUL",c:"#8C5A1E",
      req:[{type:"paw",count:5}],
      fx:"Gain Shape Shift. Activate MAUL 2."}},
  protect:{n:"PROTECT THE FOREST 2",c:"#1E6830",t:"off",
    req:[{type:"nature",count:4}],
    fx:"Gain Regenerate and Shape Shift. 8 Undefendable.",
    sub:{n:"RAINFALL",c:"#289048",
      req:[{type:"nature",count:3}],
      fx:"Gain 1 CP and 2 Regenerate."}},
};
const CARD_UPGRADES={d_u1:"ferocity",d_u2:"maul",d_u3:"protect"};

// ─── CARDS ───────────────────────────────────────────────────────────────────
// Druid's unique cards. (Board upgrades to be added later.) These mix in with
// the shared global cards below.
const CARDS=[
  {id:"d_hibernate", n:"HIBERNATE!",           cp:2,t:"blue",  e:"🐻💤",x:"Transform into Bear Form if not.<br>Gain Regenerate."},
  {id:"d_pounce",    n:"READY TO POUNCE!",      cp:2,t:"blue",  e:"🐆⚡",x:"Transform into Cat Form if not.<br>Inflict Wound on a player."},
  {id:"d_rest",      n:"NATURE'S REST!",        cp:2,t:"blue",  e:"🌿🛌",x:"Return to Druid Form if not.<br>Draw 1."},
  {id:"d_lure",      n:"FEY LURE!",             cp:1,t:"blue",  e:"🧚🌸",x:"Give a player 1 Regenerate."},
  {id:"d_strength",  n:"STRENGTH OF THE WOODS", cp:1,t:"blue",  e:"🌳💪",x:"If in Druid Form, roll 1:<br>On Claw, 2 Undefendable.<br>On Paw, gain Shape Shift.<br>On Nature, Heal 3."},
  {id:"d_cycle",     n:"NATURE'S CYCLE",        cp:0,t:"blue",  e:"🔄🌿",x:"Flip a Regen1 token back to Regen2."},
  {id:"d_surprise",  n:"SURPRISE BITE!",        cp:2,t:"orange",e:"🐱🦷",x:"If in Cat Form, attack becomes Undefendable."},
  {id:"d_lethal",    n:"LETHAL SWIPE",          cp:2,t:"orange",e:"🐾💥",x:"If in Cat Form, roll 5:<br>1 Blockable X Claw dmg.<br>On Paw Paw, inflict Wound."},
  {id:"d_shrug",     n:"SHRUG OFF",             cp:0,t:"orange",e:"🐻🛡",x:"Play only after being attacked.<br>If in Bear Form, prevent 2 dmg."},
  {id:"d_poke",      n:"DON'T POKE THE BEAR!",  cp:0,t:"orange",e:"🐻😡",x:"Play only after being attacked.<br>If in Bear Form, 2 Undefendable."},
  {id:"d_morph",     n:"QUICK MORPH",           cp:2,t:"red",   e:"✨🔀",x:"Gain Shape Shift."},
  {id:"d_u1",n:"FEROCITY 2",                cp:2,t:"blue",e:"🐾💥💥",x:"UPGRADE Ferocity: 3 Claw → 5, 4 Claw → 6, 5 Claw → 7 Blockable. On 3-of-a-kind: Inflict Wound."},
  {id:"d_u2",n:"MAUL 2 + SAVAGE MAUL",      cp:2,t:"blue",e:"🐻🐾💥",x:"UPGRADE Maul (4 Paw): Roll 2 dice, deal dmg equal to total; if in Bear Form you may reroll one. ADDS Savage Maul (5 Paw): Gain Shape Shift, activate Maul 2."},
  {id:"d_u3",n:"PROTECT THE FOREST 2 + RAINFALL",cp:2,t:"blue",e:"🌳🌧🌿",x:"UPGRADE Protect The Forest (4 Nature): Gain Regenerate and Shape Shift, 8 Undefendable. ADDS Rainfall (3 Nature): Gain 1 CP and 2 Regenerate."},
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
// No unique tokens yet — placeholder empty state so the board loads cleanly.
function renderTokens(player, playerState, container) {
  container.innerHTML = "";
}
function initTokenState() {
  return {};
}

function initFormState() {
  return { form: "Druid", shapeshift: 0 };
}

// ─── FORM SWITCHER + SHAPESHIFT COUNTER ──────────────────────────────────────
// Pinned to the top-left corner of this player's playspace (their board area).
// Three buttons (Druid/Cat/Bear form) — only one selected at a time, starts
// on Druid — plus a brown triangle counter (0-2) for the Shape Shift token.
const FORM_LIST=["Druid","Cat","Bear"];
const FORM_COLORS={Druid:"#4890E0",Cat:"#D8402C",Bear:"#D8C020"};
const FORM_REMINDERS={
  Druid:"End of turn, Regenerate.",
  Cat:"If you conclude ORP with an Attack, add 2 dmg and inflict Wound.",
  Bear:"THICK HIDE is stronger.",
};

function renderFormWidget(player, formState, container) {
  container.innerHTML = "";
  if (!formState.form) formState.form = "Druid";
  if (typeof formState.shapeshift !== "number") formState.shapeshift = 0;

  // Outer column. Reminder text goes ABOVE the buttons for P2 (top play space)
  // and BELOW for P1 (bottom play space), so the two players mirror naturally.
  const isP2 = player === "p2";
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:3px;align-items:flex-start;pointer-events:auto";

  // Row holding the form buttons and the Shape Shift triangle side by side.
  // The triangle lives in this row so its position is fixed by the buttons and
  // is never pushed around by the (wrapping) reminder text below/above.
  const midRow = document.createElement("div");
  midRow.style.cssText = "display:flex;align-items:center;gap:8px";

  // Form buttons
  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:4px";
  FORM_LIST.forEach(form => {
    const active = formState.form === form;
    const col = FORM_COLORS[form];
    const btn = document.createElement("button");
    btn.textContent = form.toUpperCase();
    btn.style.cssText =
      "font-size:8px;font-weight:700;letter-spacing:.5px;padding:4px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;transition:color .1s,border-color .1s,background .1s;"
      + (active
          ? "border:1.5px solid "+col+";color:"+col+";background:"+col+"22;"
          : "border:1.5px solid var(--bdrhi);background:transparent;color:var(--txtd);");
    btn.addEventListener("click", () => {
      if (window.netCanEdit && !window.netCanEdit(player)) return;
      formState.form = form;
      renderFormWidget(player, formState, container);
      if (window.netTokens) window.netTokens(player);
    });
    btn.addEventListener("mouseenter", () => { if (formState.form !== form) btn.style.borderColor = col; });
    btn.addEventListener("mouseleave", () => { if (formState.form !== form) btn.style.borderColor = "var(--bdrhi)"; });
    btnRow.appendChild(btn);
  });
  midRow.appendChild(btnRow);

  // Shapeshift counter: brown triangle, 0-2. Click to increment, right-click to decrement.
  const triWrap = document.createElement("div");
  triWrap.style.cssText = "position:relative;width:30px;height:28px;flex-shrink:0;cursor:pointer;user-select:none";
  triWrap.title = "Shape Shift (click +, right-click −)";
  triWrap.innerHTML =
    '<svg width="30" height="28" viewBox="0 0 30 28"><polygon points="15,2 28,25 2,25" fill="#E0803033" stroke="#E08030" stroke-width="2"/></svg>'
    + '<span style="position:absolute;left:0;right:0;bottom:3px;text-align:center;font-size:11px;font-weight:700;color:#F0A860">' + formState.shapeshift + '</span>';
  triWrap.addEventListener("click", () => {
    if (window.netCanEdit && !window.netCanEdit(player)) return;
    formState.shapeshift = Math.min(2, formState.shapeshift + 1);
    renderFormWidget(player, formState, container);
    if (window.netTokens) window.netTokens(player);
  });
  triWrap.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (window.netCanEdit && !window.netCanEdit(player)) return;
    formState.shapeshift = Math.max(0, formState.shapeshift - 1);
    renderFormWidget(player, formState, container);
    if (window.netTokens) window.netTokens(player);
  });
  midRow.appendChild(triWrap);

  // Reminder text for the current form. Its width is capped to the button row
  // (measured after layout) so the text wraps and never runs past the BEAR
  // button's right edge, and its own wrapping never moves the triangle.
  const reminder = document.createElement("div");
  reminder.textContent = FORM_REMINDERS[formState.form] || "";
  reminder.style.cssText = "font-size:7px;line-height:1.35;font-weight:600;color:" + FORM_COLORS[formState.form] + ";letter-spacing:.2px";

  if (isP2) { wrap.appendChild(reminder); wrap.appendChild(midRow); }
  else      { wrap.appendChild(midRow); wrap.appendChild(reminder); }

  container.appendChild(wrap);

  // Cap the reminder to the buttons' width now that everything is laid out.
  const bw = btnRow.getBoundingClientRect().width;
  if (bw) reminder.style.maxWidth = Math.round(bw) + "px";
}

function dieIcon(faceValue, locked, size) {
  const f = FACES[faceValue];
  const c = locked ? "#253045" : f.c;
  if (f.t === "CLAW") return I.claw(c, size);
  if (f.t === "PAW")  return I.paw(c, size);
  return I.leaf(c, size);
}

// ─── WOUND + REGEN TOKENS (draggable overlay pieces) ─────────────────────────
// Two pink WOUND tokens per player, starting just to the right of that
// player's Shape Shift counter (in the form widget), with two dark-green REGEN
// tokens directly underneath. Draggable + net-synced through the shared overlay
// system, same as Raveness's Hex tokens. Regen tokens right-click to flip
// between the "2" (dark green) and "1" (light green) sides.
function buildOverlayTokens(player, addFn, removeFn) {
  // Deferred so the form widget has been laid out and has real coordinates.
  setTimeout(() => placeDruidTokens(player), 80);
}

function placeDruidTokens(player) {
  const anchor = document.getElementById(player + "formwidget");

  // Base position: just right of the Shape Shift counter.
  let baseX = 420, baseY = window.innerHeight / 2;
  if (anchor) {
    const r = anchor.getBoundingClientRect();
    baseX = r.right + 8;
    baseY = r.top + r.height / 2 - 16;
  }

  // Second row goes below the wounds for whichever zone is at the BOTTOM of
  // the screen, above the wounds for whichever is at the TOP — so for both
  // players, the Regen row sits on the side nearer the game board. Based on
  // current screen position (which flips with Flip View / multiplayer
  // seating), not raw player identity, so this stays correct either way.
  const flipped = document.body.classList.contains("flip");
  const isBottomZone = flipped ? player === "p2" : player === "p1";
  const regenDY = isBottomZone ? 48 : -48;

  // Wound row (anchored at baseY for both players)
  for (let i = 0; i < 2; i++) {
    const id = "wound_" + player + "_" + i;
    if (document.getElementById(id)) continue;
    const el = document.createElement("div");
    el.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:1px";
    el.innerHTML =
      '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#E060A033" stroke="#E060A0" stroke-width="2"/><path d="M8 8 L16 16 M16 8 L8 16" stroke="#E060A0" stroke-width="2.2" stroke-linecap="round"/></svg>';
    window.addOverlayToken(id, el, baseX + i * 42, baseY);
  }

  // Regen row (below wounds for P1, above wounds for P2), flippable 2 <-> 1
  for (let i = 0; i < 2; i++) {
    const id = "regen_" + player + "_" + i;
    if (document.getElementById(id)) continue;
    const el = document.createElement("div");
    el.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:1px";
    el.dataset.side = "2"; // "2" = dark-green front, "1" = light-green back

    const draw = () => {
      const dark = el.dataset.side === "2";
      const ring = dark ? "#1E6830" : "#5FBF6A";
      const fill = dark ? "#1E683055" : "#5FBF6A44";
      const num  = dark ? "2" : "1";
      el.innerHTML =
        '<svg width="36" height="36" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="' + fill + '" stroke="' + ring + '" stroke-width="2"/>'
        + '<text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="700" fill="' + ring + '">' + num + '</text></svg>';
    };
    draw();

    // Right-click flips to the other side (and syncs to the opponent).
    el._applyOvState = (side) => { el.dataset.side = side; draw(); };
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.netCanEdit && !window.netCanEdit(player)) return;
      el.dataset.side = el.dataset.side === "2" ? "1" : "2";
      draw();
      if (window.netOvState) window.netOvState(id, el.dataset.side);
    });

    window.addOverlayToken(id, el, baseX + i * 42, baseY + regenDY);
  }
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
  fxKeywords:          [["Shape Shift","#E08030"],["Regenerate","#289048"],["Bear Form","#D8C020"],["Druid Form","#4890E0"],["Wound","#E060A0"]],
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
