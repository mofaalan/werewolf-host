// script.js

window.addEventListener('DOMContentLoaded', () => {
  let playerCountInput = document.getElementById('playerCount');
  let confirmPlayersBtn = document.getElementById('confirmPlayers');
  let roleSelection = document.getElementById('roleSelection');
  let confirmRolesBtn = document.getElementById('confirmRoles');
  let startNightBtn = document.getElementById('startNight');
  let controls = document.getElementById('controls');
  let statusDiv = document.getElementById('status');
  let flowZone = document.getElementById('flowZone');
  let currentStepDiv = document.getElementById('currentStep');
  let prevStepBtn = document.getElementById('prevStep');
  let nextStepBtn = document.getElementById('nextStep');

  let selectedRoles = new Set();
  let playerList = [];
  let dynamicFlowSteps = [];
  let currentIndex = 0;

  confirmPlayersBtn.onclick = () => {
    const count = parseInt(playerCountInput.value);
    if (!count || count < 5 || count > 20) {
      alert("請輸入有效的玩家人數（5-20人）");
      return;
    }
    roleSelection.classList.remove("hidden");
  };

  confirmRolesBtn.onclick = () => {
    selectedRoles.clear();
    document.querySelectorAll(".role-checkbox:checked").forEach(cb => selectedRoles.add(cb.value));
    const expectedPlayers = parseInt(playerCountInput.value);
    if (selectedRoles.size !== expectedPlayers) {
      alert(`目前設定角色數量為 ${selectedRoles.size}，與玩家人數 ${expectedPlayers} 不符。`);
      return;
    }
    setupNightFlow();
    statusDiv.classList.remove("hidden");
    controls.classList.remove("hidden");
    statusDiv.textContent = `已設定 ${expectedPlayers} 張角色卡。`;
  };

  function setupNightFlow() {
    dynamicFlowSteps = [];

    if (selectedRoles.has('狼人') || selectedRoles.has('狼王')) {
      dynamicFlowSteps.push({ role: "狼人", wakeText: "狼人請睜眼，請相互確認你的同伴", closeText: "狼王請示意" });
      dynamicFlowSteps.push({ role: "狼人", wakeText: "狼人請指示要刀的玩家", closeText: "狼人請閉眼" });
    }

    if (selectedRoles.has("預言家")) dynamicFlowSteps.push({ role: "預言家", wakeText: "預言家請睜眼，請執行你的技能", closeText: "預言家請閉眼" });
    if (selectedRoles.has("女巫")) dynamicFlowSteps.push({ role: "女巫", wakeText: "女巫請睜眼，請執行你的技能", closeText: "女巫請閉眼" });
    if (selectedRoles.has("守衛")) dynamicFlowSteps.push({ role: "守衛", wakeText: "守衛請睜眼，請選擇守護目標", closeText: "守衛請閉眼" });
    if (selectedRoles.has("獵人")) dynamicFlowSteps.push({ role: "獵人", wakeText: "獵人請睜眼確認身份（無需操作）", closeText: "獵人請閉眼" });
    if (selectedRoles.has("騎士")) dynamicFlowSteps.push({ role: "騎士", wakeText: "騎士請睜眼確認身份（無需操作）", closeText: "騎士請閉眼" });
    if (selectedRoles.has("白癡")) dynamicFlowSteps.push({ role: "白癡", wakeText: "白癡請睜眼確認身份（無需操作）", closeText: "白癡請閉眼" });
    if (selectedRoles.has("老流氓")) dynamicFlowSteps.push({ role: "老流氓", wakeText: "老流氓請睜眼確認身份（無需操作）", closeText: "老流氓請閉眼" });
    if (selectedRoles.has("隱狼")) dynamicFlowSteps.push({ role: "隱狼", wakeText: "隱狼請睜眼確認身份（無需操作）", closeText: "隱狼請閉眼" });
    if (selectedRoles.has("惡靈騎士")) dynamicFlowSteps.push({ role: "惡靈騎士", wakeText: "惡靈騎士請睜眼確認身份（無需操作）", closeText: "惡靈騎士請閉眼" });
    if (selectedRoles.has("野孩子")) dynamicFlowSteps.push({ role: "野孩子", wakeText: "野孩子請睜眼並選擇模仿對象", closeText: "野孩子請閉眼" });
    if (selectedRoles.has("炸彈人")) dynamicFlowSteps.push({ role: "炸彈人", wakeText: "炸彈人請睜眼確認身份（無需操作）", closeText: "炸彈人請閉眼" });
  }

  startNightBtn.onclick = () => {
    flowZone.classList.remove("hidden");
    currentIndex = 0;
    showCurrentStep();
  };

  prevStepBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      showCurrentStep();
    }
  };

  nextStepBtn.onclick = () => {
    if (currentIndex < dynamicFlowSteps.length - 1) {
      currentIndex++;
      showCurrentStep();
    } else {
      statusDiv.textContent = "夜晚流程結束，可進入白天階段。";
      flowZone.classList.add("hidden");
    }
  };

  function showCurrentStep() {
    const step = dynamicFlowSteps[currentIndex];
    currentStepDiv.innerHTML = `👁️‍🗨️ <strong>${step.role}</strong>：<br>${step.wakeText}<br><span class="text-gray-400">${step.closeText}</span>`;
    statusDiv.textContent = `目前進行：${step.role}`;

    const playerCount = parseInt(playerCountInput.value);
    playerList = Array.from({ length: playerCount }, (_, i) => `玩家${i + 1}`);

    const selectionDiv = document.createElement("div");
    selectionDiv.className = "mt-4 flex flex-wrap gap-2";

    playerList.forEach((p) => {
      const btn = document.createElement("button");
      btn.textContent = p;
      btn.className = "bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-500";
      btn.onclick = () => {
        btn.classList.toggle("bg-green-500");
      };
      selectionDiv.appendChild(btn);
    });

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = `✔️ 確認 ${step.role} 身份玩家`;
    confirmBtn.className = "block bg-green-600 p-2 mt-4 rounded-xl w-full";
    confirmBtn.onclick = () => {
      const selected = Array.from(selectionDiv.children)
        .filter(b => b.classList.contains("bg-green-500"))
        .map(b => b.textContent);

      if (selected.length === 0) {
        alert("請至少選擇一位玩家作為此角色持有者");
        return;
      }

      if (!window.confirmedIdentities) window.confirmedIdentities = {};
      window.confirmedIdentities[step.role] = selected;

      alert(`✔️ ${step.role} 身份記錄完成：${selected.join(", ")}`);
      nextStepBtn.click();
    };

    currentStepDiv.appendChild(selectionDiv);
    currentStepDiv.appendChild(confirmBtn);
  }
});
