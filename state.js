export const GameState = {
  players: [],
  confirmedIdentities: {},
  playerCount: 0,
  currentStep: 0,
  flowSteps: [],
  killedTonight: null,
  savedByWitch: null,
  poisonedByWitch: null,
  checkedBySeer: null,
  checkedResult: null,

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
  }
};
