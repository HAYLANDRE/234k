  <script setup>
  defineProps({
    player: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: '#c41e3a'
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  });
  </script>

<template>
    <div class="token-container">
      <div 
        class="player-token"
        :class="{ 'current': isCurrent, 'dead': player.status === 'dead' }"
        :style="{ backgroundColor: color }"
      >
        <span class="token-initial">{{ player.name[0] }}</span>
        <div v-if="isCurrent" class="token-indicator"></div>
      </div>
      <div class="token-info">
        <span class="token-name">{{ player.name }}</span>
        <div class="token-mini-hp">
          <div 
            class="token-mini-fill" 
            :style="{ width: (player.hp / player.maxHp * 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </template>
    
  <style scoped>
  .token-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .player-token {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 2px solid rgba(255,255,255,0.3);
    transition: all 0.3s;
  }
  
  .player-token.current {
    border-color: #d4af37;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
    animation: float 2s ease-in-out infinite;
  }
  
  .player-token.dead {
    opacity: 0.4;
    filter: grayscale(100%);
  }
  
  .token-initial {
    font-size: 14px;
    font-weight: bold;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }
  
  .token-indicator {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: #d4af37;
    border-radius: 50%;
    border: 2px solid #0a0a0a;
  }
  
  .token-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  
  .token-name {
    font-size: 12px;
    color: #f4e4c1;
    font-weight: bold;
  }
  
  .token-mini-hp {
    width: 50px;
    height: 4px;
    background: rgba(0,0,0,0.3);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .token-mini-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b0000, #c41e3a);
    border-radius: 2px;
    transition: width 0.3s;
  }
  </style>