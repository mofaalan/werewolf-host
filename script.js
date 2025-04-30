window.addEventListener('DOMContentLoaded', () => {
  const playerCountInput = document.getElementById('playerCount');
  const confirmPlayersBtn = document.getElementById('confirmPlayers');
  const roleSelection = document.getElementById('roleSelection');
  const confirmRolesBtn = document.getElementById('confirmRoles');
  const startNightBtn = document.getElementById('startNight');
  const controls = document.getElementById('controls');
  const statusDiv = document.getElementById('status');
  const flowZone = document.getElementById('flowZone');
  const currentStepDiv = document.getElementById('currentStep');
  const prevStepBtn = document.getElementById('prevStep');
  const nextStepBtn = document.getElementById('nextStep');

  let dynamicFlowSteps = [];
  let currentIndex = 0;
  let playerList = [];
  window.confirmedIdentities = {};

  confirmPlayersBtn.onclick = () => {
    const count = parseInt(playerCountInput.value);
    if (!count || count < 5 || count > 20) {
      alert("請輸入有效的玩家人數（5-20人）");
      return;
    }
    roleSelection.classList.remove("hidden");
  };

  confirmRolesBtn.onclick = () => {
    const checked = document.querySelectorAll('.role-checkbox:checked');
    const total = checked.length;
    const expected = parseInt(playerCountInput.value);
    if (total !== expected) {
      alert(`目前設定角色數量為 ${total}，與玩家人數 ${expected} 不符。`);
      return;
    }
    setupNightFlow();
    controls.classList.remove("hidden");
    statusDiv.classList.remove("hidden");
  };

  function setupNightFlow() {
    const check = (label) => Array.from(document.querySelectorAll('.role-checkbox:checked')).some(cb => cb.value.includes(label));
    const steps = [];

    const hasWolf = check("狼人") || check("狼王");

    if (hasWolf) {
      steps.push({ role: "狼人身份確認", wakeText: "請選擇狼人身份對應玩家（包含狼王）", closeText: "請確認完所有狼人" });
      if (check("狼王")) {
        steps.push({ role: "狼王", wakeText: "請指定誰是狼王", closeText: "狼王身份確認完成" });
      }
      steps.push({ role: "狼人", wakeText: "狼人請睜眼，請相互確認你的同伴", closeText: "狼王請示意" });
      steps.push({ role: "狼人", wakeText: "狼人請指示要刀的玩家", closeText: "狼人請閉眼" });
    }

    if (check("預言家")) steps.push({ role: "預言家", wakeText: "預言家請睜眼，請執行你的技能", closeText: "預言家請閉眼" });
    if (check("女巫")) steps.push({ role: "女巫", wakeText: "女巫請睜眼，請執行你的技能", closeText: "女巫請閉眼" });
    if (check("守衛")) steps.push({ role: "守衛", wakeText: "守衛請睜眼，請選擇守護目標", closeText: "守衛請閉眼" });
    if (check("獵人")) steps.push({ role: "獵人", wakeText: "獵人請睜眼確認身份（無需操作）", closeText: "獵人請閉眼" });
    if (check("騎士")) steps.push({ role: "騎士", wakeText: "騎士請睜眼確認身份（無需操作）", closeText: "騎士請閉眼" });
    if (check("白癡")) steps.push({ role: "白癡", wakeText: "白癡請睜眼確認身份（無需操作）", closeText: "白癡請閉眼" });
    if (check("老流氓")) steps.push({ role: "老流氓", wakeText: "老流氓請睜眼確認身份（無需操作）", closeText: "老流氓請閉眼" });
    if (check("隱狼")) steps.push({ role: "隱狼", wakeText: "隱狼請睜眼確認身份（無需操作）", closeText: "隱狼請閉眼" });
    if (check("惡靈騎士")) steps.push({ role: "惡靈騎士", wakeText: "惡靈騎士請睜眼確認身份（無需操作）", closeText: "惡靈騎士請閉眼" });
    if (check("野孩子")) steps.push({ role: "野孩子", wakeText: "野孩子請睜眼並選擇模仿對象", closeText: "野孩子請閉眼" });
    if (check("炸彈人")) steps.push({ role: "炸彈人", wakeText: "炸彈人請睜眼確認身份（無需操作）", closeText: "炸彈人請閉眼" });

    dynamicFlowSteps = steps;
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

    const count = parseInt(playerCountInput.value);
    playerList = Array.from({ length: count }, (_, i) => `玩家${i + 1}`);

    const selectionDiv = document.createElement("div");
    selectionDiv.className = "mt-4 flex flex-wrap gap-2";

    playerList.forEach(p => {
      const btn = document.createElement("button");
      btn.textContent = p;
      btn.className = "bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-500";

      const matchedRoles = Object.entries(window.confirmedIdentities)
        .filter(([_, players]) => players.includes(p))
        .map(([role]) => role);

      if (matchedRoles.length > 0) {
        btn.classList.remove("bg-gray-700");
        btn.classList.add("bg-green-500", "border", "border-yellow-300");
        const label = document.createElement("div");
        label.className = "text-xs text-yellow-300";
        label.textContent = matchedRoles.join(", ");
        btn.appendChild(label);
      }

      btn.onclick = () => {
        if (step.role === "狼王") {
          Array.from(selectionDiv.children).forEach(b => b.classList.remove("bg-green-500"));
          window.confirmedIdentities["狼王"] = [];
        }
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
        .map(b => b.textContent.replace(/\n.*/, ''));

      if (selected.length === 0) {
        alert("請至少選擇一位玩家作為此角色持有者");
        return;
      }
      if (step.role === "狼王" && selected.length > 1) {
        alert("狼王只能指定一名玩家");
        return;
      }

      if (!window.confirmedIdentities[step.role]) window.confirmedIdentities[step.role] = [];
      window.confirmedIdentities[step.role] = selected;

      if (step.role === "狼王") {
        if (!window.confirmedIdentities["狼人身份確認"].includes(selected[0])) {
          window.confirmedIdentities["狼人身份確認"].push(selected[0]);
        }
        // overwrite狼人角色群，確保狼王包含在內
        window.confirmedIdentities["狼人"] = [...window.confirmedIdentities["狼人身份確認"]];
      }

      if (step.role === "炸彈人" || currentIndex === dynamicFlowSteps.length - 1) {
        const allRoles = Object.values(window.confirmedIdentities).flat();
        const remaining = playerList.filter(p => !allRoles.includes(p));
        if (remaining.length > 0) {
          window.confirmedIdentities["平民"] = remaining;
        }
      }

      alert(`✔️ ${step.role} 身份記錄完成：${selected.join(", ")}`);
      nextStepBtn.click();
    };

    currentStepDiv.appendChild(selectionDiv);
    currentStepDiv.appendChild(confirmBtn);
  }
});
