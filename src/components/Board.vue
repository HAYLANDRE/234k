<script setup>
  import { useGameStore } from '../stores/gameStore.js';
  import Dice from './Dice.vue';
  
  const store = useGameStore();
  
  const circleNames = [
    'Врата Санзу',
    'Берег сёдзё',
    'Врата они',
    'Логово баку',
    'Зал Эмма-О',
    'Котёл кругов',
    'Путь искупления',
    'Выход'
  ];
  
  const playerColors = ['#c41e3a', '#228b22', '#4169e1', '#d4af37'];
  
  const getPlayersAtCircle = (circle) => {
    return store.players.filter(p => {
      const playerCircle = Math.min(p.position + 1, 8);
      return playerCircle === circle && p.status !== 'escaped';
    });
  };
  
  const getPlayerMaxPosition = () => {
    const alive = store.players.filter(p => p.status === 'alive');
    if (alive.length === 0) return 0;
    return Math.max(...alive.map(p => p.position));
  };
  
  const getCircleCreature = (circle) => {
    const creatures = { 2: '👹', 3: '鬼', 4: '獏', 5: '閻' };
    return creatures[circle] || null;
  };
  </script>

<template>
    <div class="board-container">
      <div class="board-bg"></div>
      
      <div class="board-header">
        <h1 class="board-title">
          <span class="title-jp">地獄</span>
          Дзигоку: Путь через ад
        </h1>
        <div class="board-subtitle">Эпоха Эдо • Ход {{ store.turnCount }}</div>
      </div>
      
      <div class="circles-track">
        <div 
          v-for="circle in 8" 
          :key="circle"
          class="circle-node"
          :class="{
            'active': store.currentCircle === circle,
            'passed': getPlayerMaxPosition() >= circle,
            'future': getPlayerMaxPosition() < circle
          }"
        >
          <div class="circle-number">{{ circle }}</div>
          <div class="circle-name">{{ circleNames[circle - 1] }}</div>
          
          <div class="player-tokens">
            <div 
              v-for="player in getPlayersAtCircle(circle)" 
              :key="player.id"
              class="token"
              :class="{ 
                'current-player': player.id === store.currentPlayer?.id,
                'dead': player.status === 'dead'
              }"
              :style="{ backgroundColor: playerColors[player.id - 1] }"
            >
              {{ player.name[0] }}
            </div>
          </div>
          
          <div v-if="getCircleCreature(circle)" class="circle-creature">
            {{ getCircleCreature(circle) }}
          </div>
        </div>
      </div>
      
      <div v-if="store.message" class="game-message" :class="store.messageType">
        {{ store.message }}
      </div>
      
      <div class="control-panel">
        <Dice />
        
        <div class="player-stats">
          <div 
            v-for="player in store.players" 
            :key="player.id"
            class="stat-card"
            :class="{ 
              'active': player.id === store.currentPlayer?.id,
              'dead': player.status === 'dead',
              'escaped': player.status === 'escaped'
            }"
          >
            <div class="stat-name">{{ player.name }}</div>
            <div class="stat-hp">
              <span class="hp-label">Душа:</span>
              <div class="hp-bar">
                <div 
                  class="hp-fill" 
                  :class="{ 'low': player.hp <= 2 }"
                  :style="{ width: (player.hp / player.maxHp * 100) + '%' }"
                ></div>
              </div>
              <span class="hp-value">{{ player.hp }}/{{ player.maxHp }}</span>
            </div>
            <div class="stat-karma">
              <span class="karma-label">Карма:</span>
              <span class="karma-value" :class="{ 'high': player.karma >= 5 }">{{ player.karma }}</span>
            </div>
            <div v-if="player.status === 'dead'" class="stat-status">☠️ Погиб в аду</div>
            <div v-if="player.status === 'escaped'" class="stat-status">✦ Обретена свобода</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .board-container { position: relative; min-height: 100vh; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
  .board-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at top, #1a0a0a 0%, #0a0a0a 70%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c41e3a' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); z-index: -1; }
  
  .board-header { text-align: center; padding: 20px; }
  .board-title { font-family: 'Cinzel', serif; font-size: 32px; color: #d4af37; text-shadow: 0 0 20px rgba(212, 175, 55, 0.3); margin-bottom: 5px; }
  .title-jp { display: block; font-size: 48px; color: #c41e3a; margin-bottom: 5px; text-shadow: 0 0 30px rgba(196, 30, 58, 0.5); }
  .board-subtitle { color: #f4e4c1; opacity: 0.7; font-size: 14px; letter-spacing: 2px; }
  
  .circles-track { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; padding: 20px; overflow-x: auto; position: relative; }
  .circles-track::before { content: ''; position: absolute; top: 45px; left: 60px; right: 60px; height: 3px; background: linear-gradient(90deg, #8b0000, #c41e3a, #8b0000); z-index: 0; opacity: 0.5; }
  
  .circle-node { flex: 1; min-width: 100px; max-width: 120px; background: rgba(26, 10, 10, 0.9); border: 2px solid #2c1810; border-radius: 12px; padding: 15px 10px; text-align: center; position: relative; z-index: 1; transition: all 0.3s; }
  .circle-node.passed { border-color: #8b0000; background: rgba(139, 0, 0, 0.2); }
  .circle-node.active { border-color: #d4af37; background: rgba(212, 175, 55, 0.15); box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); animation: pulse 2s infinite; }
  .circle-node.future { opacity: 0.5; }
  
  .circle-number { font-family: 'Cinzel', serif; font-size: 28px; font-weight: bold; color: #f4e4c1; margin-bottom: 5px; }
  .circle-node.active .circle-number { color: #d4af37; }
  .circle-name { font-size: 11px; color: #f4e4c1; opacity: 0.8; line-height: 1.3; min-height: 30px; display: flex; align-items: center; justify-content: center; }
  
  .player-tokens { display: flex; justify-content: center; gap: 5px; margin-top: 10px; min-height: 30px; }
  .token { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; border: 2px solid rgba(255,255,255,0.3); text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
  .token.current-player { border-color: #d4af37; box-shadow: 0 0 10px #d4af37; animation: float 2s ease-in-out infinite; }
  .token.dead { opacity: 0.3; filter: grayscale(100%); }
  
  .circle-creature { margin-top: 8px; font-size: 20px; }
  
  .game-message { text-align: center; padding: 15px 20px; border-radius: 8px; font-family: 'Cinzel', serif; font-size: 16px; animation: fadeIn 0.3s ease-out; }
  .game-message.info { background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; color: #d4af37; }
  .game-message.success { background: rgba(34, 139, 34, 0.15); border: 1px solid #228b22; color: #90ee90; }
  .game-message.warning { background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; color: #f4e4c1; }
  .game-message.danger { background: rgba(139, 0, 0, 0.2); border: 1px solid #8b0000; color: #c41e3a; }
  
  .control-panel { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; }
  .player-stats { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; width: 100%; max-width: 800px; }
  
  .stat-card { background: rgba(26, 10, 10, 0.8); border: 2px solid #2c1810; border-radius: 10px; padding: 15px; min-width: 150px; flex: 1; transition: all 0.3s; }
  .stat-card.active { border-color: #d4af37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
  .stat-card.dead { opacity: 0.5; border-color: #8b0000; }
  .stat-card.escaped { border-color: #228b22; box-shadow: 0 0 15px rgba(34, 139, 34, 0.2); }
  
  .stat-name { font-family: 'Cinzel', serif; font-size: 16px; color: #f4e4c1; margin-bottom: 10px; text-align: center; }
  .stat-hp { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .hp-label { font-size: 12px; color: #f4e4c1; opacity: 0.7; min-width: 40px; }
  .hp-bar { flex: 1; height: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden; }
  .hp-fill { height: 100%; background: linear-gradient(90deg, #8b0000, #c41e3a); border-radius: 4px; transition: width 0.5s ease; }
  .hp-fill.low { background: linear-gradient(90deg, #8b0000, #ff0000); animation: pulse 1s infinite; }
  .hp-value { font-size: 12px; color: #f4e4c1; min-width: 35px; text-align: right; }
  
  .stat-karma { display: flex; align-items: center; gap: 8px; }
  .karma-label { font-size: 12px; color: #f4e4c1; opacity: 0.7; min-width: 40px; }
  .karma-value { font-size: 14px; color: #d4af37; font-weight: bold; }
  .karma-value.high { color: #90ee90; }
  
  .stat-status { margin-top: 8px; text-align: center; font-size: 13px; color: #c41e3a; font-style: italic; }
  .stat-card.escaped .stat-status { color: #90ee90; }
  
  @media (max-width: 768px) {
    .circles-track { gap: 5px; padding: 10px; }
    .circle-node { min-width: 70px; padding: 10px 5px; }
    .circle-number { font-size: 20px; }
    .circle-name { font-size: 9px; }
    .board-title { font-size: 24px; }
    .title-jp { font-size: 36px; }
  }
  </style>