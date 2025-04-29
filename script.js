const flowSteps = [
  { role: "野孩子", wakeText: "野孩子請睜眼，請選擇你要模仿的對象。", closeText: "野孩子請閉眼。" },
  { role: "狼人", wakeText: "狼人請睜眼，請認識彼此，今晚選擇襲擊對象。", closeText: "狼人請閉眼。" },
  { role: "狼王", wakeText: "狼王請睜眼，請認識其他狼人。", closeText: "狼王請閉眼。" },
  { role: "隱狼", wakeText: "隱狼請睜眼，請記住你是隱狼。", closeText: "隱狼請閉眼。" },
  { role: "惡靈騎士", wakeText: "惡靈騎士請睜眼，請確認今晚是否被選為襲擊目標。", closeText: "惡靈騎士請閉眼。" },
  { role: "預言家", wakeText: "預言家請睜眼，請查驗一名玩家的身份。", closeText: "預言家請閉眼。" },
  { role: "女巫", wakeText: "女巫請睜眼，今晚有人死亡，你要使用解藥嗎？要不要用毒藥？", closeText: "女巫請閉眼。" },
  { role: "守衛", wakeText: "守衛請睜眼，今晚你要守護哪位玩家？", closeText: "守衛請閉眼。" }
];

let currentIndex = 0;

const startNightBtn = document.getElementById('startNight');
const flowZone = document.getElementById('flowZone');
const currentStepDiv = document.getElementById('currentStep');
const statusDiv = document.getElementById('status');
const prevStepBtn = document.getElementById('prevStep');
const nextStepBtn = document.getElementById('nextStep');

startNightBtn.addEventListener('click', () => {
  startNightBtn.classList.add('hidden');
  flowZone.classList.remove('hidden');
  showCurrentStep();
});

prevStepBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showCurrentStep();
  }
});

nextStepBtn.addEventListener('click', () => {
  if (currentIndex < flowSteps.length - 1) {
    currentIndex++;
    showCurrentStep();
  } else {
    statusDiv.textContent = "🌅 夜晚流程結束，請進入白天階段！";
    flowZone.classList.add('hidden');
  }
});

function showCurrentStep() {
  const step = flowSteps[currentIndex];
  currentStepDiv.innerHTML = `👁️‍🗨️ <strong>${step.role}</strong>：<br>${step.wakeText}<br><span class="text-gray-400">${step.closeText}</span>`;
  statusDiv.textContent = `目前進行：${step.role}`;
}
