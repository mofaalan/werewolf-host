// ui.js — 使用者介面處理模組

import { GameState } from './state.js';

export function setupPlayerCountInput() {
  const input = document.querySelector('#playerCount');
  const confirmButton = document.querySelector('#confirmPlayerCount');

  confirmButton.addEventListener('click', () => {
    const count = parseInt(input.value);
    if (isNaN(count) || count < 1) {
      alert('請輸入有效的玩家人數');
      return;
    }
    GameState.assignPlayers(count);
    renderRoleSelection();
  });
}

function renderRoleSelection() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <h2>設定角色</h2>
    <div id="roleOptions">
      ${['狼人', '狼王', '女巫', '預言家', '獵人', '守衛', '平民'].map(role => `
        <label><input type="checkbox" value="${role}" checked> ${role}</label>
      `).join(' ')}
    </div>
    <button id="confirmRoles">✅ 確認角色設定</button>
  `;

  document.querySelector('#confirmRoles').addEventListener('click', () => {
    const selectedRoles = Array.from(document.querySelectorAll('#roleOptions input:checked')).map(input => input.value);
    assignRolesToPlayers(selectedRoles);
    GameState.buildNightFlow();
    renderStep();
  });
}

function assignRolesToPlayers(roles) {
  const shuffledPlayers = [...GameState.players].sort(() => Math.random() - 0.5);
  let index = 0;

  roles.forEach(role => {
    if (shuffledPlayers[index]) {
      GameState.setRole(shuffledPlayers[index].id, role);
      index++;
    }
  });
}

function renderStep() {
  const step = GameState.flowSteps[GameState.currentStep];
  const app = document.querySelector('#app');
  app.innerHTML = `
    <h2>狼人殺法官助手 V2</h2>
    <div class="step-box">
      <p>${step.role}</p>
      <p>${step.wakeText}</p>
      <div id="playerButtons">
        ${GameState.players.map(p => {
          const isRole = GameState.getRoles(p.id).includes(step.role);
          const btnClass = isRole ? 'highlight' : '';
          return `<button class="player-btn ${btnClass}">${p.id}</button>`;
        }).join('')}
      </div>
      <button id="confirmStep">確認</button>
    </div>
    <div>
      <button id="prevStep">← 上一步</button>
      <button id="nextStep">下一步 →</button>
    </div>
  `;

  document.querySelector('#nextStep').addEventListener('click', () => {
    if (GameState.currentStep < GameState.flowSteps.length - 1) {
      GameState.currentStep++;
      renderStep();
    }
  });

  document.querySelector('#prevStep').addEventListener('click', () => {
    if (GameState.currentStep > 0) {
      GameState.currentStep--;
      renderStep();
    }
  });
}

export function startUI() {
  setupPlayerCountInput();
}
