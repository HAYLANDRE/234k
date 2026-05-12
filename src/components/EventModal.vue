  <script setup>
  import { useGameStore } from '../stores/gameStore.js';
  
  const store = useGameStore();
  
  const close = () => {
    if (store.currentEvent?.effect !== 'choice') return;
  };
  </script>

<template>
    <div v-if="store.currentEvent && store.gameState === 'event'" class="event-overlay" @click.self="close">
      <div class="event-modal animate-fade-in">
        <div class="event-header">
          <div class="event-icon">⚡</div>
          <h3 class="event-title">{{ store.currentEvent.name }}</h3>
        </div>
        
        <p class="event-description">{{ store.currentEvent.description }}</p>
        
        <div v-if="store.currentEvent.effect === 'choice'" class="event-choices">
          <button class="event-btn accept" @click="store.acceptBakuDeal">
            Принять сделку
          </button>
          <button class="event-btn refuse" @click="store.refuseBakuDeal">
            Отказаться
          </button>
        </div>
        
        <div v-else class="event-auto">
          <div class="event-loading">
            <span class="loading-text">Судьба решается...</span>
          </div>
        </div>
      </div>
    </div>
  </template>
    
  <style scoped>
  .event-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 950;
    backdrop-filter: blur(4px);
  }
  
  .event-modal {
    background: linear-gradient(135deg, #1a0a0a 0%, #0a0a0a 100%);
    border: 2px solid #c41e3a;
    border-radius: 16px;
    padding: 30px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 0 40px rgba(196, 30, 58, 0.3);
  }
  
  .event-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .event-icon {
    font-size: 48px;
    margin-bottom: 10px;
    animation: pulse 2s infinite;
  }
  
  .event-title {
    font-family: 'Cinzel', serif;
    font-size: 24px;
    color: #c41e3a;
    text-shadow: 0 0 10px rgba(196, 30, 58, 0.3);
  }
  
  .event-description {
    text-align: center;
    color: #f4e4c1;
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 25px;
    opacity: 0.9;
  }
  
  .event-choices {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .event-btn {
    padding: 14px 20px;
    border: 2px solid;
    border-radius: 8px;
    font-family: 'Cinzel', serif;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .event-btn.accept {
    background: rgba(34, 139, 34, 0.2);
    border-color: #228b22;
    color: #90ee90;
  }
  
  .event-btn.accept:hover {
    background: rgba(34, 139, 34, 0.4);
    transform: translateY(-2px);
  }
  
  .event-btn.refuse {
    background: rgba(139, 0, 0, 0.2);
    border-color: #8b0000;
    color: #c41e3a;
  }
  
  .event-btn.refuse:hover {
    background: rgba(139, 0, 0, 0.4);
    transform: translateY(-2px);
  }
  
  .event-auto {
    text-align: center;
  }
  
  .loading-text {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    color: #d4af37;
    animation: pulse 1.5s infinite;
  }
  </style>