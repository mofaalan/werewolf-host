// ui.js — UI 操作與顯示模組

import { GameState } from './state.js';

const app = document.getElementById('app');

function createPlayerButtons(currentRole) {
  const container = document.createElement('div');
  GameState.players.forEach(player => {
    const btn = document.createElement('button');
    btn.textContent = player.id;
    btn.className = 'player-btn';

    const roles = GameState.playerRoles[player.id] || [];
    if (roles.includes(currentRole)) {
      btn.classList.add('marked');
    }

    btn.onclick = () => {
      document.querySelectorAll('.player-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };

    container.appendChild(btn);
  });
  return container;
}

function createConfirmButton(currentRole) {
  const btn = document.createElement('button');
  btn.textContent = '確認';
  btn.onclick = () => {
    const selected = document.querySelector('.player-btn.selected');
    if (!selected) {
      alert('請選擇一位玩家');
      return;
    }
    const playerId = selected.textContent;
    GameState.setRole(playerId, currentRole);
    alert(`${currentRole} 記錄完成：${playerId}`);
    renderNextStep();
  };
  return btn;
}

function renderStep() {
  app.innerHTML = '';
  const step = GameState.flowSteps[GameState.currentStep];

  const title = document.createElement('h2');
  title.textContent = '狼人殺法官助手 V2';

  const box = document.createElement('div');
  box.className = 'box';

  const roleText = document.createElement('div');
  roleText.textContent = step.role;
  const desc = document.createElement('p');
  desc.textContent = step.wakeText;

  const players = createPlayerButtons(step.role);
  const confirmBtn = createConfirmButton(step.role);

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '⬅ 上一步';
  prevBtn.onclick = () => {
    if (GameState.currentStep > 0) {
      GameState.currentStep--;
      renderStep();
    }
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '下一步 ➡';
  nextBtn.onclick = () => {
    if (GameState.currentStep < GameState.flowSteps.length - 1) {
      GameState.currentStep++;
      renderStep();
    }
  };

  box.append(roleText, desc, players, confirmBtn);
  app.append(title, box, document.createElement('br'), prevBtn, nextBtn);
}

export function renderNextStep() {
  GameState.currentStep++;
  renderStep();
}

export function startGame() {
  GameState.buildNightFlow();
  renderStep();
}

export function setupPlayerCountInput() {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = 5;
  input.max = 20;
  input.value = 6;

  const btn = document.createElement('button');
  btn.textContent = '確定玩家數';
  btn.onclick = () => {
    const count = parseInt(input.value);
    GameState.playerCount = count; // 🔧 補上初始化
    GameState.assignPlayers(count);
    renderRoleSelector();
  };

  app.innerHTML = '';
  const label = document.createElement('label');
  label.textContent = '輸入玩家人數：';
  label.append(input);
  app.append(label, btn);
}

function renderRoleSelector() {
  app.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = '設定角色';
  const roles = ['狼人', '狼王', '女巫', '預言家', '獵人', '守衛', '平民'];
  const checkboxes = roles.map(role => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = role;
    checkbox.checked = true;
    label.append(checkbox, document.createTextNode(role));
    return label;
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = '✔️ 確認角色設定';
  confirmBtn.onclick = () => {
    const selectedRoles = checkboxes.filter(cb => cb.querySelector('input').checked).map(cb => cb.querySelector('input').value);
    GameState.reset();
    GameState.assignPlayers(GameState.playerCount);
    const baseRoles = [...selectedRoles];

    while (baseRoles.length < GameState.playerCount) baseRoles.push('平民');
    baseRoles.forEach((role, i) => GameState.setRole(GameState.players[i].id, role));

    GameState.buildNightFlow();
    renderStep();
  };

  app.append(title, ...checkboxes, document.createElement('br'), confirmBtn);
}
