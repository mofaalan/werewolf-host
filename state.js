// state.js — 儲存玩家與角色狀態模組

export const GameState = {
  players: [],
  playerRoles: {},
  playerCount: 0,
  flowSteps: [],
  currentStep: 0,

  assignPlayers(count) {
    this.players = [];
    this.playerRoles = {};
    for (let i = 1; i <= count; i++) {
      const id = `玩家${i}`;
      this.players.push({ id });
      this.playerRoles[id] = []; // 初始化每位玩家角色清單
    }
  },

  setRole(playerId, role) {
    if (!this.playerRoles[playerId]) {
      this.playerRoles[playerId] = [];
    }
    if (!this.playerRoles[playerId].includes(role)) {
      this.playerRoles[playerId].push(role);
    }
  },

  getRoles(playerId) {
    return this.playerRoles[playerId] || [];
  },

  reset() {
    this.players = [];
    this.playerRoles = {};
    this.flowSteps = [];
    this.currentStep = 0;
  },

  buildNightFlow() {
    const steps = [];

    const add = (role, wakeText) => {
      steps.push({ role, wakeText });
    };

    add('狼人', '狼人請睜眼（身份確認用）');
    add('狼王', '狼王請睜眼（獨立指認狼王）');
    add('狼人', '狼人請刀人（實際夜晚行動）');
    add('狼人', '狼人請閉眼');
    add('女巫', '女巫請睜眼（身份確認用）');
    add('女巫', '今晚佢死左，你救唔救佢？你用唔用毒？');
    add('女巫', '女巫請閉眼');
    add('預言家', '預言家請睜眼（身份確認用）');
    add('預言家', '今晚你要查驗邊個？');
    add('預言家', '預言家請閉眼');
    add('守衛', '守衛請睜眼');
    add('守衛', '今晚你要守護邊個？');
    add('守衛', '守衛請閉眼');
    add('平民', '系統自動配對未有角色玩家為平民');
    add('天亮', '天光請開眼');

    this.flowSteps = steps;
  }
};
