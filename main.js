const $btnKick = document.getElementById("btn-kick");
const $btnQuick = document.getElementById("btn-quick");
const $logs = document.getElementById("logs");

function createPlayer({ name, elHPId, elProgressbarId, defaultHP = 100 }) {
  const elHP = document.getElementById(elHPId);
  const elProgressbar = document.getElementById(elProgressbarId);

  return {
    name,
    defaultHP,
    damageHP: defaultHP,
    lost: false,
    elHP,
    elProgressbar,

    renderHPLife() {
      const { elHP, damageHP, defaultHP } = this;
      elHP.innerText = `${damageHP} / ${defaultHP}`;
    },

    renderProgressbarHP() {
      const { elProgressbar, damageHP } = this;
      elProgressbar.style.width = damageHP + "%";
      if (damageHP > 60) {
        elProgressbar.style.background = "#4CAF50";
      } else if (damageHP > 30) {
        elProgressbar.style.background = "#FF9800";
      } else {
        elProgressbar.style.background = "#F44336";
      }
    },

    renderHP() {
      this.renderHPLife();
      this.renderProgressbarHP();
    },
    changeHP(count) {
      const { damageHP } = this;
      const actual = Math.min(count, damageHP);
      this.damageHP = Math.max(0, damageHP - count);
      this.renderHP();

      if (this.damageHP === 0 && !this.lost) {
        this.lost = true;
        alert(`Бідний ${this.name} програв бій!`);
      }

      return actual;
    },
  };
}

const character = createPlayer({
  name: "Pikachu",
  elHPId: "health-character",
  elProgressbarId: "progressbar-character",
});

const enemy1 = createPlayer({
  name: "Charmander",
  elHPId: "health-enemy1",
  elProgressbarId: "progressbar-enemy1",
});

const enemy2 = createPlayer({
  name: "Bulbasaur",
  elHPId: "health-enemy2",
  elProgressbarId: "progressbar-enemy2",
});

function random(num) {
  return Math.ceil(Math.random() * num);
}

const logs = [];

function addLog({
  attacker,
  target,
  damage,
  remaining,
  remainingButtons = null,
  note = "",
}) {
  const time = new Date().toLocaleTimeString();
  const hpPart =
    typeof remaining === "number" ? `Залишилося: ${remaining} / 100` : "";
  const btnPart =
    remainingButtons !== null
      ? ` | Натискань залишилося: ${remainingButtons}`
      : "";
  const text = `${time} — ${attacker}${target ? ` атакував ${target}` : ""}${
    damage ? ` і наніс ${damage} урона.` : "."
  } ${hpPart}${btnPart}${note ? ` ${note}` : ""}`;
  logs.unshift(text);
  renderLogs();
}

const renderLogs = () => {
  $logs.innerHTML = logs
    .map(
      (t) =>
        `<div class="log" style="padding:6px;border-bottom:1px solid #eee;">${t}</div>`
    )
    .join("");
}

function attack(attacker, target, maxDamage) {
  const damage = target.changeHP(random(maxDamage));
  addLog({
    attacker: attacker.name,
    target: target.name,
    damage,
    remaining: target.damageHP,
  });
}

const createClickLimiter = (maxClicks = 7) => {
  let count = 0;
  return function () {
    count += 1;
    const remaining = Math.max(0, maxClicks - count);
    const allowed = count <= maxClicks;
    return { allowed, total: count, remaining };
  };
}

document.querySelectorAll(".button").forEach((btn) => {
  const limit = createClickLimiter(7);
  const btnName = btn.id || btn.innerText.trim() || "button";
  btn.addEventListener("click", (e) => {
    const { allowed, total, remaining } = limit();
    console.log(`${btnName} clicked: ${total}. Remaining: ${remaining}`);
    addLog({
      attacker: btnName,
      target: "",
      damage: 0,
      remaining: null,
      remainingButtons: remaining,
      note: allowed ? "" : "(ліміт досягнутий)",
    });

    if (!allowed) {
      btn.disabled = true;
      return;
    }
    if (btn.id === "btn-kick") {
      attack(character, enemy1, 20);
      attack(character, enemy2, 20);
    } else if (btn.id === "btn-quick") {
      attack(character, enemy1, 10);
      attack(character, enemy2, 10);
    } else {
    }
  });
});

const init = () => {
  character.renderHP();
  enemy1.renderHP();
  enemy2.renderHP();
  renderLogs();
}

init();