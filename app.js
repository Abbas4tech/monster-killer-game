const monsterHealthBar = document.getElementById("monster-health");
const playerHealthBar = document.getElementById("player-health");
const bonusLifeEl = document.getElementById("bonus-life");

const attackBtn = document.getElementById("attack-btn");
const strongAttackBtn = document.getElementById("strong-attack-btn");
const healBtn = document.getElementById("heal-btn");
const logBtn = document.getElementById("log-btn");

const enteredHealth = prompt("Choose maximum life for you and monster!", "100");

let chosenMaxLife = parseInt(enteredHealth);

if (isNaN(chosenMaxLife || chosenMaxLife <= 0)) {
  chosenMaxLife = 100;
}

const modeNormalAttack = "normalAttack";
const modeStrongAttack = "strongAttack";
const logEventPlayerAttack = "playerAttack";
const logEventStrongAttack = "strongAttack";
const logEventMonsterAttack = "monsterAttack";
const logEventPlayerHeal = "playerHeal";
const logEventGameOver = "gameOver";

let battleLog = [];
let playerHealth = chosenMaxLife;
let monsterHealth = chosenMaxLife;
let hasBonusLife = true;
adjustHealthBars(chosenMaxLife);

const normalAttackValue = 10;
const monsterAttackValue = 15;
const strongAttackValue = 20;
const defaultHealvalue = 22;

function adjustHealthBars(maxLife) {
  monsterHealthBar.max = maxLife;
  monsterHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
}

function dealMonsterDamage(damage) {
  const dealtDamage = Math.random() * damage;
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  return dealtDamage;
}

function dealPlayerDamage(damage) {
  const dealtDamage = Math.random() * damage;
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

function resetGame(value) {
  playerHealthBar.value = value;
  monsterHealthBar.value = value;
}

function removeBonusLife() {
  bonusLifeEl.parentNode.removeChild(bonusLifeEl);
}

function setPlayerHealth(health) {
  playerHealthBar.value = health;
}

function reset() {
  playerHealth = chosenMaxLife;
  monsterHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function writeLog(ev, val, logMonsterHealth, logPlayerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: logMonsterHealth,
    finalPlayerHealth: logPlayerHealth,
  };

  if (ev === logEventPlayerAttack || ev === logEventStrongAttack) {
    logEntry.target = "MONSTER";
  } else if (ev === logEventMonsterAttack) {
    logEntry.target = "PLAYER";
  } else if (ev === logEventPlayerHeal) {
    logEntry = {
      event: ev,
      value: val,
      target: "PLAYER",
      finalMonsterHealth: logMonsterHealth,
      finalPlayerHealth: logPlayerHealth,
    };
  } else if (ev === logEventGameOver) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: logMonsterHealth,
      finalPlayerHealth: logPlayerHealth,
    };
  }
  battleLog.push(logEntry);
}

function endRound() {
  const initialPlayerHealth = playerHealth;
  const playerDamage = dealPlayerDamage(monsterAttackValue);
  playerHealth -= playerDamage;
  writeLog(logEventMonsterAttack, playerDamage, monsterHealth, playerHealth);

  if (playerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    playerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but the bonus life saved you!");
  }

  if (monsterHealth <= 0 && playerHealth > 0) {
    alert("You won!");
    reset();
    writeLog(logEventGameOver, "Player Won!", monsterHealth, playerHealth);
  } else if (playerHealth <= 0 && monsterHealth > 0) {
    alert("You lost!");
    reset;
    writeLog(logEventGameOver, "Monster Won!", monsterHealth, playerHealth);
  } else if (playerHealth <= 0 && monsterHealth <= 0) {
    alert("You have a draw!");
    reset;
    writeLog(logEventMonsterAttack, "Draw!", monsterHealth, playerHealth);
  }
}

function attackChosen(attackMode) {
  let mainAttack;
  let logEvent;

  if (attackMode === modeNormalAttack) {
    mainAttack = normalAttackValue;
    logEvent = logEventPlayerAttack;
  } else if (attackMode === modeStrongAttack) {
    mainAttack = strongAttackValue;
    logEvent = logEventStrongAttack;
  }
  const damage = dealMonsterDamage(mainAttack);
  monsterHealth -= damage;
  writeLog(logEvent, damage, monsterHealth, playerHealth);
  endRound();
}

function attackHandler() {
  attackChosen(modeNormalAttack);
}

function strongAttackHandler() {
  attackChosen(modeStrongAttack);
}

function healPlayerHandler() {
  let healValue;
  if (playerHealth >= chosenMaxLife - defaultHealvalue) {
    alert("You can't heal to more than your max initial health.");
    healValue = chosenMaxLife - playerHealth;
  } else {
    healValue = defaultHealvalue;
  }
  increasePlayerHealth(healValue);
  playerHealth += healValue;
  writeLog(logEventPlayerHeal, healValue, monsterHealth, playerHealth);
  endRound();
}

function printLog() {
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLog);
