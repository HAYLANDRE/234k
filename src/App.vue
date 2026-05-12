<script setup>
import { computed } from 'vue';
import { useGameStore } from './stores/gameStore.js';
import StartScreen from './components/StartScreen.vue';
import Board from './components/Board.vue';
import Creature from './components/Creature.vue';
import Card from './components/Card.vue';
import EventModal from './components/EventModal.vue';

const store = useGameStore();

const escapedPlayers = computed(() => 
  store.players.filter(p => p.status === 'escaped')
);

const restart = () => {
  store.resetGame();
};

// Логирование для отладки
console.log('App mounted, gameState:', store.gameState);
</script>

<template>
  <div id="app">
    <!-- Экран старта -->
    <template v-if="store.gameState === 'start'">
      <StartScreen />
    </template>
    
    <!-- Игровой экран -->
    <template v-else-if="store.gameState === 'playing' || store.gameState === 'question' || store.gameState === 'event'">
      <Board />
      <Creature v-if="store.showCreature" />
      <Card v-if="store.currentCard" />
      <EventModal v-if="store.currentEvent" />
    </template>
    
    <!-- Экран победы -->
    <template v-else-if="store.gameState === 'victory'">
      <div class="end-screen victory">
        <div class="end-content animate-fade-in">
          <div class="end-icon">✦</div>
          <h1 class="end-title">Возрождение</h1>
          <p class="end-subtitle">Души обрели свободу из Дзигоку</p>
          <div class="survivors">
            <div v-for="player in escapedPlayers" :key="player.id" class="survivor-card">
              <div class="survivor-name">{{ player.name }}</div>
              <div class="survivor-stats">
                <span>Карма: {{ player.karma }}</span>
                <span>HP: {{ player.hp }}</span>
              </div>
            </div>
          </div>
          <button class="restart-btn" @click="restart">
            <span>Новый путь</span>
            <span class="jp">再開</span>
          </button>
        </div>
      </div>
    </template>
    
    <!-- Экран поражения -->
    <template v-else-if="store.gameState === 'defeat'">
      <div class="end-screen defeat">
        <div class="end-content animate-fade-in">
          <div class="end-icon">☠️</div>
          <h1 class="end-title">Вечное страдание</h1>
          <p class="end-subtitle">Все души погибли в восьми кругах ада</p>
          <div class="defeat-lore">
            Эмма-О запишет ваши имена в Книгу Смерти. 
            В следующей жизни, может быть, удастся искупить грехи...
          </div>
          <button class="restart-btn" @click="restart">
            <span>Попытаться снова</span>
            <span class="jp">再挑戦</span>
          </button>
        </div>
      </div>
    </template>
    
    <!-- Отладка — если ничего не совпало -->
    <template v-else>
      <div class="debug-screen">
        <h2>Ошибка состояния</h2>
        <p>gameState: {{ store.gameState }}</p>
        <p>players: {{ store.players.length }}</p>
        <button @click="restart">Сбросить</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.game-layout { 
  min-height: 100vh; 
  display: flex; 
  flex-direction: column; 
}

.end-screen { 
  min-height: 100vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding: 20px; 
}

.end-screen.victory { 
  background: radial-gradient(ellipse at center, #1a2a1a 0%, #0a0a0a 70%); 
}

.end-screen.defeat { 
  background: radial-gradient(ellipse at center, #2a0a0a 0%, #0a0a0a 70%); 
}

.end-content { 
  max-width: 500px; 
  width: 100%; 
  text-align: center; 
}

.end-icon { 
  font-size: 64px; 
  margin-bottom: 20px; 
  animation: float 3s ease-in-out infinite; 
}

.end-title { 
  font-family: 'Cinzel', serif; 
  font-size: 36px; 
  margin-bottom: 10px; 
}

.victory .end-title { 
  color: #90ee90; 
  text-shadow: 0 0 20px rgba(144, 238, 144, 0.3); 
}

.defeat .end-title { 
  color: #c41e3a; 
  text-shadow: 0 0 20px rgba(196, 30, 58, 0.3); 
}

.end-subtitle { 
  font-size: 16px; 
  color: #f4e4c1; 
  opacity: 0.8; 
  margin-bottom: 30px; 
}

.survivors { 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
  margin-bottom: 30px; 
}

.survivor-card { 
  background: rgba(34, 139, 34, 0.1); 
  border: 1px solid #228b22; 
  border-radius: 8px; 
  padding: 15px; 
}

.survivor-name { 
  font-family: 'Cinzel', serif; 
  font-size: 18px; 
  color: #90ee90; 
  margin-bottom: 5px; 
}

.survivor-stats { 
  display: flex; 
  justify-content: center; 
  gap: 20px; 
  font-size: 14px; 
  color: #f4e4c1; 
  opacity: 0.7; 
}

.defeat-lore { 
  background: rgba(139, 0, 0, 0.1); 
  border: 1px solid #8b0000; 
  border-radius: 8px; 
  padding: 20px; 
  font-size: 14px; 
  line-height: 1.8; 
  color: #f4e4c1; 
  opacity: 0.8; 
  font-style: italic; 
  margin-bottom: 30px; 
}

.restart-btn { 
  width: 100%; 
  padding: 16px; 
  background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.3s; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 4px; 
}

.restart-btn:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 6px 20px rgba(196, 30, 58, 0.4); 
}

.restart-btn span { 
  font-family: 'Cinzel', serif; 
  font-size: 18px; 
  color: #f4e4c1; 
}

.restart-btn .jp { 
  font-size: 11px; 
  opacity: 0.7; 
}

.debug-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f4e4c1;
  font-family: 'Cinzel', serif;
}

.debug-screen h2 {
  color: #c41e3a;
  margin-bottom: 20px;
}

.debug-screen button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #c41e3a;
  color: #f4e4c1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>