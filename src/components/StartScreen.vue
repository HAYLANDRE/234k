  <script setup>
  import { ref, computed } from 'vue';
  import { useGameStore } from '../stores/gameStore.js';
  
  const store = useGameStore();
  const playerInputs = ref(['']);
  
  const canStart = computed(() => {
    return playerInputs.value.some(name => name && name.trim().length > 0);
  });
  
  const addPlayer = () => {
    if (playerInputs.value.length < 4) {
      playerInputs.value.push('');
    }
  };
  
  const removePlayer = (index) => {
    if (playerInputs.value.length > 1) {
      playerInputs.value.splice(index, 1);
    }
  };
  
  const startGame = () => {
    const names = playerInputs.value
      .map((name, i) => (name && name.trim()) || `Душа ${i + 1}`)
      .slice(0, playerInputs.value.length);
    
    console.log('Starting game with players:', names);
    store.initGame(names);
  };
  </script>

<template>
    <div class="start-screen">
      <div class="start-bg"></div>
      
      <div class="start-content animate-fade-in">
        <div class="title-section">
          <div class="title-jp-large">地獄</div>
          <h1 class="main-title">Дзигоку</h1>
          <h2 class="subtitle">Путь через ад</h2>
          <div class="era">Эпоха Эдо • Исторические ужасы</div>
        </div>
        
        <div class="lore-section">
          <p class="lore-text">
            Ты — душа умершего. Перед тобой восемь кругов ада Дзигоку, 
            где Эмма-О судит каждого по делам его. 
            Встретишь сёдзё с их сакэ, они с их дубинами, 
            баку, пожирающего кошмары. 
            Только знания, логика и чистая карма выведут тебя наружу.
          </p>
        </div>
        
        <div class="setup-section">
          <h3 class="setup-title">Выбери своих союзников (1-4 души):</h3>
          <div class="players-input">
            <div v-for="(player, index) in playerInputs" :key="index" class="player-input-row">
              <span class="player-number">{{ index + 1 }}.</span>
              <input
                :id="'player-' + index"
                :name="'player-' + index"
                v-model="playerInputs[index]"
                type="text"
                :placeholder="'Душа ' + (index + 1)"
                class="player-name-input"
                maxlength="15"
                autocomplete="off"
              />
              <button 
                v-if="playerInputs.length > 1" 
                type="button"
                class="remove-btn" 
                @click="removePlayer(index)"
              >✕</button>
            </div>
          </div>
          
          <button 
            v-if="playerInputs.length < 4" 
            type="button"
            class="add-player-btn" 
            @click="addPlayer"
          >
            + Добавить душу
          </button>
        </div>
        
        <button 
          type="button"
          class="start-btn" 
          :disabled="!canStart" 
          @click="startGame"
        >
          <span class="start-btn-text">Начать путь</span>
          <span class="start-btn-jp">開始</span>
        </button>
        
        <div class="credits">
          <div class="creatures-preview">
            <div class="creature-icon" title="Сёдзё">👹</div>
            <div class="creature-icon" title="Они">鬼</div>
            <div class="creature-icon" title="Баку">獏</div>
            <div class="creature-icon" title="Эмма-О">閻</div>
          </div>
        </div>
      </div>
    </div>
  </template>
    
  <style scoped>
  .start-screen { 
    position: relative; 
    min-height: 100vh; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 20px; 
  }
  
  .start-bg { 
    position: fixed; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0; 
    background: radial-gradient(ellipse at center, #1a0a0a 0%, #0a0a0a 60%); 
    z-index: -1; 
  }
  
  .start-content { 
    max-width: 500px; 
    width: 100%; 
    text-align: center; 
  }
  
  .title-section { 
    margin-bottom: 30px; 
  }
  
  .title-jp-large { 
    font-size: 72px; 
    color: #c41e3a; 
    text-shadow: 0 0 40px rgba(196, 30, 58, 0.5); 
    line-height: 1; 
    margin-bottom: 10px; 
    font-family: 'Noto Serif JP', serif; 
  }
  
  .main-title { 
    font-family: 'Cinzel', serif; 
    font-size: 42px; 
    color: #d4af37; 
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.3); 
    margin-bottom: 5px; 
  }
  
  .subtitle { 
    font-family: 'Cinzel', serif; 
    font-size: 20px; 
    color: #f4e4c1; 
    opacity: 0.9; 
    margin-bottom: 10px; 
  }
  
  .era { 
    font-size: 13px; 
    color: #f4e4c1; 
    opacity: 0.6; 
    letter-spacing: 3px; 
    text-transform: uppercase; 
  }
  
  .lore-section { 
    background: rgba(26, 10, 10, 0.6); 
    border: 1px solid #8b0000; 
    border-radius: 10px; 
    padding: 20px; 
    margin-bottom: 25px; 
  }
  
  .lore-text { 
    font-size: 14px; 
    line-height: 1.8; 
    color: #f4e4c1; 
    opacity: 0.85; 
    font-style: italic; 
  }
  
  .setup-section { 
    margin-bottom: 25px; 
  }
  
  .setup-title { 
    font-family: 'Cinzel', serif; 
    font-size: 16px; 
    color: #d4af37; 
    margin-bottom: 15px; 
  }
  
  .players-input { 
    display: flex; 
    flex-direction: column; 
    gap: 10px; 
    margin-bottom: 15px; 
  }
  
  .player-input-row { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
  }
  
  .player-number { 
    font-family: 'Cinzel', serif; 
    color: #d4af37; 
    font-size: 14px; 
    min-width: 20px; 
  }
  
  .player-name-input { 
    flex: 1; 
    padding: 10px 15px; 
    background: rgba(0, 0, 0, 0.3); 
    border: 2px solid #2c1810; 
    border-radius: 6px; 
    color: #f4e4c1; 
    font-family: 'Noto Serif JP', serif; 
    font-size: 14px; 
    transition: all 0.3s; 
  }
  
  .player-name-input:focus { 
    outline: none; 
    border-color: #d4af37; 
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.2); 
  }
  
  .player-name-input::placeholder { 
    color: #f4e4c1; 
    opacity: 0.3; 
  }
  
  .remove-btn { 
    width: 30px; 
    height: 30px; 
    border-radius: 50%; 
    background: rgba(139, 0, 0, 0.3); 
    border: 1px solid #8b0000; 
    color: #c41e3a; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 12px; 
    transition: all 0.3s; 
  }
  
  .remove-btn:hover { 
    background: rgba(139, 0, 0, 0.5); 
  }
  
  .add-player-btn { 
    padding: 8px 16px; 
    background: transparent; 
    border: 1px dashed #d4af37; 
    border-radius: 6px; 
    color: #d4af37; 
    font-family: 'Noto Serif JP', serif; 
    font-size: 13px; 
    cursor: pointer; 
    transition: all 0.3s; 
  }
  
  .add-player-btn:hover { 
    background: rgba(212, 175, 55, 0.1); 
  }
  
  .start-btn { 
    width: 100%; 
    padding: 18px; 
    background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); 
    border: none; 
    border-radius: 10px; 
    cursor: pointer; 
    transition: all 0.3s; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 5px; 
    margin-bottom: 25px; 
  }
  
  .start-btn:hover:not(:disabled) { 
    transform: translateY(-3px); 
    box-shadow: 0 8px 25px rgba(196, 30, 58, 0.4); 
  }
  
  .start-btn:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }
  
  .start-btn-text { 
    font-family: 'Cinzel', serif; 
    font-size: 20px; 
    color: #f4e4c1; 
    font-weight: bold; 
  }
  
  .start-btn-jp { 
    font-size: 12px; 
    color: #f4e4c1; 
    opacity: 0.7; 
  }
  
  .credits { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 10px; 
  }
  
  .creatures-preview { 
    display: flex; 
    gap: 15px; 
  }
  
  .creature-icon { 
    width: 40px; 
    height: 40px; 
    border-radius: 50%; 
    background: rgba(26, 10, 10, 0.8); 
    border: 1px solid #2c1810; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 18px; 
    opacity: 0.6; 
  }
  </style>