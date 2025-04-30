// ui.js — 使用者介面控制模組
import { GameState } from './state.js';

const statusDiv = document.getElementById('status');
const currentStepDiv = document.getElementById('currentStep');
const flowZone = document.getElementById('flowZone');
const prevStepBtn = document.getElementById('prevStep');
const nextStepBtn = document.getElementById('nextStep');

function renderStep() {
  const step = GameState.flowSteps[GameState.currentStep];
  currentStepDiv.innerHTML = `👁️‍🗨️ <strong>${step.role}</strong><br>${step.wakeText}<br><span class="text-gray-400">${step.closeText}</span>`;
  statusDiv.textContent = `目前進行：${step.role}`;

  const playerSelect = document.createElement('div');
  playerSelect.className = 'mt-4 flex flex-wrap gap-2';

  GameState.players.forEach(p => {
    const btn = document.createElement('button');
    btn.textContent = p.id;
    btn.className = 'bg-gray-700 px-3 py-1 rounded hover:bg-gray-500';

    if (GameState.isPlayerKilled(p.id)) {
      btn.classList.add('line-through', 'opacity-50');
    }

    btn.onclick = () => {
      const role = step.role;
      if (role === '狼人' && step.wakeText.includes('刀人')) {
        GameState.killedTonight = p.id;
      } else if (role === '女巫' && step.wakeText.includes('救')) {
        GameState.savedByWitch = p.id;
      } else if (role === '女巫' && step.wakeText.includes('毒')) {
        GameState.poisonedByWitch = p.id;
      } else if (role === '預言家' && step.wakeText.includes('查驗')) {
        GameState.checkedBySeer = p.id;
        const evilRoles = ['狼人', '狼王', '隱狼', '惡靈騎士'];
        const target = GameState.players.find(x => x.id === p.id);
        GameState.checkedResult = evilRoles.includes(target.role) ? 'evil' : 'good';
        alert(`查驗結果：${GameState.checkedResult === 'evil' ? '👎 壞人' : '👍 好人'}`);
      } else {
        GameState.setRole(p.id, role);
      }
      renderStep();
    };

    // 顯示角色標記
    for (const [role, ids] of Object.entries(GameState.confirmedIdentities)) {
      if (ids.includes(p.id)) {
        const mark = document.createElement('div');
        mark.textContent = role;
        mark.className = 'text-xs text-yellow-300';
        btn.appendChild(mark);
      }
    }

    playerSelect.appendChild(btn);
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = `✔️ 確認「${step.role}」階段完成`;
  confirmBtn.className = 'block bg-green-600 p-2 mt-4 rounded-xl w-full';
  confirmBtn.onclick = () => {
    nextStepBtn.click();
  };

  currentStepDiv.appendChild(playerSelect);
  currentStepDiv.appendChild(confirmBtn);
}

export function initUI() {
  flowZone.classList.remove('hidden');
  GameState.currentStep = 0;
  renderStep();

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
      flowZone.classList.add('hidden');
      statusDiv.textContent = '🌞 夜晚流程完畢，請進入白天流程。';
    }
  };
}
