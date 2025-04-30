import { GameState } from './state.js';
import { availableRoles, roleWakeOrder } from './data.js';

const setupEl = document.getElementById("setup");
const roleSelectionEl = document.getElementById("roleSelection");
const flowEl = document.getElementById("flow");
const playerCountInput = document.getElementById("playerCount");
const setPlayersBtn = document.getElementById("setPlayersBtn");
const roleArea = document.getElementById("roleArea");
const confirmRolesBtn = document.getElementById("confirmRolesBtn");
const flowText = document.getElementById("flowText");
const playerButtons = document.getElementById("playerButtons");
const confirmActionBtn = document.getElementById("confirmActionBtn");
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");

let selectedPlayers = [];

setPlayersBtn.onclick = () => {
  const count = parseInt(playerCountInput.value);
  if (count >= 5 && count <= 20) {
    GameState.assignPlayers(count);
    setupEl.classList.add("hidden");
    roleSelectionEl.classList.remove("hidden");
    renderRoleSelection(count);
  }
};

function renderRoleSelection(count) {
  roleArea.innerHTML = '';
  availableRoles.forEach(role => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = role;
    checkbox.classList.add("role-checkbox");
    label.append(checkbox, ` ${role}`);
    roleArea.appendChild(label);
    roleArea.appendChild(document.createElement("br"));
  });
}

confirmRolesBtn.onclick = () => {
  const checked = document.querySelectorAll(".role-checkbox:checked");
  if (checked.length !== GameState.playerCount) {
    alert("角色數量與玩家人數不符");
    return;
  }
  const roles = Array.from(checked).map(cb => cb.value);
  GameState.players.forEach((p, i) => GameState.setRole(p.id, roles[i]));
  setupFlow();
};

function setupFlow() {
  roleSelectionEl.classList.add("hidden");
  flowEl.classList.remove("hidden");
  GameState.flowSteps = roleWakeOrder.map(role => ({
    role,
    wakeText: `${role}請睜眼執行技能`,
    closeText: `${role}請閉眼`
  }));
  GameState.currentStep = 0;
  renderStep();
}

function renderStep() {
  const step = GameState.flowSteps[GameState.currentStep];
  flowText.innerHTML = `<strong>${step.role}</strong><br>${step.wakeText}<br><small>${step.closeText}</small>`;
  playerButtons.innerHTML = '';
  selectedPlayers = [];

  GameState.players.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p.id;
    btn.onclick = () => {
      btn.classList.toggle("selected");
      if (btn.classList.contains("selected")) {
        selectedPlayers.push(p.id);
      } else {
        selectedPlayers = selectedPlayers.filter(id => id !== p.id);
      }
    };
    playerButtons.appendChild(btn);
  });
}

confirmActionBtn.onclick = () => {
  const step = GameState.flowSteps[GameState.currentStep];
  if (selectedPlayers.length === 0) {
    alert("請選擇至少一名玩家");
    return;
  }
  GameState.confirmedIdentities[step.role] = selectedPlayers;
  alert(`✔️ ${step.role} 記錄完成：${selectedPlayers.join(", ")}`);
  nextStepBtn.click();
};

prevStepBtn.onclick = () => {
  if (GameState.currentStep > 0) {
    GameState.currentStep--;
    renderStep();
  }
};

nextStepBtn.onclick = () => {
  if (GameState.currentStep < GameState.flowSteps.length - 1) {
    GameState.currentStep++;
    renderStep();
  } else {
    flowText.innerHTML = "夜晚流程結束，可進入白天";
    playerButtons.innerHTML = '';
  }
};
