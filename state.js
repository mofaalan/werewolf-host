// state.js — 遊戲狀態核心模組

export const GameState = {
  players: [], // { id: 玩家1, role: 預言家, status: 'alive'/'dead' }
  confirmedIdentities: {}, // { 預言家: ['玩家1'], 狼人: ['玩家2', '玩家3'] }
  playerCount: 0,
  currentStep: 0,
  flowSteps: [], // 每晚流程步驟 { role, wakeText, closeText }
  killedTonight: null, // 今晚被刀者
  savedByWitch: null,
  poisonedByWitch: null,
  checkedBySeer: null,
  checkedResult: null, // 'good' 或 'evil'

  reset() {
    this.players = [];
    this.confirmedIdentities = {};
    this.playerCount = 0;
    this.currentStep = 0;
    this.flowSteps = [];
    this.killedTonight = null;
    this.savedByWitch = null;
    this.poisonedByWitch = null;
    this.checkedBySeer = null;
    this.checkedResult = null;
  },

  assignPlayers(count) {
    this.playerCount = count;
    this.players = Array.from({ length: count }, (_, i) => ({
      id: `玩家${i + 1}`,
      role: null,
      status: 'alive'
    }));
  },

  setRole(playerId, roleName) {
    const player = this.players.find(p => p.id === playerId);
    if (player) player.role = roleName;
    if (!this.confirmedIdentities[roleName]) {
      this.confirmedIdentities[roleName] = [];
    }
    if (!this.confirmedIdentities[roleName].includes(playerId)) {
      this.confirmedIdentities[roleName].push(playerId);
    }
  },

  getAlivePlayers() {
    return this.players.filter(p => p.status === 'alive');
  },

  getPlayersByRole(role) {
    return this.players.filter(p => p.role === role);
  },

  isPlayerKilled(playerId) {
    return this.killedTonight === playerId || this.poisonedByWitch === playerId;
  },

  buildNightFlow() {
    this.flowSteps = [
      { role: '狼人', wakeText: '狼人請開眼（身份確認）', closeText: '' },
      { role: '狼王', wakeText: '狼王請開眼（獨立指認）', closeText: '' },
      { role: '狼人', wakeText: '狼人請刀人（實際行動）', closeText: '狼人請閉眼' },
      { role: '女巫', wakeText: '女巫請開眼（身份確認）', closeText: '' },
      { role: '女巫', wakeText: '今晚佢死左，你救唔救佢？你用唔用毒？', closeText: '女巫請閉眼' },
      { role: '預言家', wakeText: '預言家請開眼（身份確認）', closeText: '' },
      { role: '預言家', wakeText: '今晚你要查驗邊個？', closeText: '預言家請閉眼' },
      { role: '守衛', wakeText: '守衛請開眼', closeText: '' },
      { role: '守衛', wakeText: '今晚你要守護邊個？', closeText: '守衛請閉眼' },
      { role: '系統', wakeText: '系統自動分配平民角色', closeText: '' },
      { role: '系統', wakeText: '天光請開眼', closeText: '' }
    ];
  }
};
