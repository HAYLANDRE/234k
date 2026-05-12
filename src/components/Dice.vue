  <script setup>
  import { useGameStore } from '../stores/gameStore.js';
  
  const store = useGameStore();
  
  const roll = () => {
    if (store.gameState === 'playing' && !store.animatingDice) {
      store.rollDice();
    }
  };
  </script>

<template>
    <div class="dice-container">
      <div 
        class="dice"
        :class="{ 
          rolling: store.animatingDice,
          'dice-result': store.diceResult && !store.animatingDice 
        }"
        @click="roll"
      >
        <div v-if="store.animatingDice" class="dice-rolling">
          <span class="dice-question">?</span>
        </div>
        <div v-else-if="store.diceResult" class="dice-face">
          <div class="dice-dots" :class="`dots-${store.diceResult}`">
            <span v-for="n in store.diceResult" :key="n" class="dot"></span>
          </div>
        </div>
        <div v-else class="dice-empty">
          <span class="dice-text">Бросить</span>
        </div>
      </div>
      <div v-if="store.diceResult && !store.animatingDice" class="dice-number">
        {{ store.diceResult }}
      </div>
    </div>
  </template>
    
  <style scoped>
  .dice-container { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 10px; 
  }
  
  .dice { 
    width: 80px; 
    height: 80px; 
    background: linear-gradient(135deg, #f4e4c1 0%, #d4c5a9 100%); 
    border-radius: 12px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3); 
    transition: all 0.3s ease; 
    border: 2px solid #d4af37; 
  }
  
  .dice:hover:not(.rolling) { 
    transform: translateY(-2px); 
    box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 0 20px rgba(196, 30, 58, 0.3), inset 0 1px 0 rgba(255,255,255,0.3); 
  }
  
  .dice.rolling { 
    animation: shakeDice 0.5s ease-in-out infinite; 
    cursor: not-allowed; 
  }
  
  .dice-result { 
    animation: pulse 0.5s ease-out; 
  }
  
  .dice-question { 
    font-size: 36px; 
    font-weight: bold; 
    color: #2c1810; 
    font-family: 'Cinzel', serif; 
  }
  
  .dice-face { 
    width: 100%; 
    height: 100%; 
    padding: 8px; 
  }
  
  .dice-dots { 
    width: 100%; 
    height: 100%; 
    display: grid; 
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: repeat(3, 1fr); 
    gap: 4px; 
  }
  
  .dot { 
    width: 14px; 
    height: 14px; 
    background: #2c1810; 
    border-radius: 50%; 
    align-self: center; 
    justify-self: center; 
  }
  
  /* Расположение точек для каждого числа */
  .dots-1 .dot:nth-child(1) { grid-area: 2 / 2; }
  
  .dots-2 .dot:nth-child(1) { grid-area: 1 / 1; }
  .dots-2 .dot:nth-child(2) { grid-area: 3 / 3; }
  
  .dots-3 .dot:nth-child(1) { grid-area: 1 / 1; }
  .dots-3 .dot:nth-child(2) { grid-area: 2 / 2; }
  .dots-3 .dot:nth-child(3) { grid-area: 3 / 3; }
  
  .dots-4 .dot:nth-child(1) { grid-area: 1 / 1; }
  .dots-4 .dot:nth-child(2) { grid-area: 1 / 3; }
  .dots-4 .dot:nth-child(3) { grid-area: 3 / 1; }
  .dots-4 .dot:nth-child(4) { grid-area: 3 / 3; }
  
  .dots-5 .dot:nth-child(1) { grid-area: 1 / 1; }
  .dots-5 .dot:nth-child(2) { grid-area: 1 / 3; }
  .dots-5 .dot:nth-child(3) { grid-area: 2 / 2; }
  .dots-5 .dot:nth-child(4) { grid-area: 3 / 1; }
  .dots-5 .dot:nth-child(5) { grid-area: 3 / 3; }
  
  .dots-6 .dot:nth-child(1) { grid-area: 1 / 1; }
  .dots-6 .dot:nth-child(2) { grid-area: 1 / 3; }
  .dots-6 .dot:nth-child(3) { grid-area: 2 / 1; }
  .dots-6 .dot:nth-child(4) { grid-area: 2 / 3; }
  .dots-6 .dot:nth-child(5) { grid-area: 3 / 1; }
  .dots-6 .dot:nth-child(6) { grid-area: 3 / 3; }
  
  .dice-empty { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
  }
  
  .dice-text { 
    font-size: 12px; 
    color: #2c1810; 
    font-weight: bold; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
  }
  
  .dice-number { 
    font-size: 24px; 
    font-weight: bold; 
    color: #d4af37; 
    font-family: 'Cinzel', serif; 
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.5); 
  }
  
  @keyframes shakeDice {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-10deg) scale(1.1); }
    75% { transform: rotate(10deg) scale(1.1); }
  }
  </style>