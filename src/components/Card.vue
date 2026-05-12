<script setup>
  import { ref, computed } from 'vue';
  import { useGameStore } from '../stores/gameStore.js';
  
  const store = useGameStore();
  const selectedAnswer = ref(null);
  const showResult = ref(false);
  const isCorrect = ref(false);
  
  const typeLabel = computed(() => {
    const types = {
      knowledge: 'Знания',
      logic: 'Логика',
      trial: 'Испытание'
    };
    return types[store.currentCard?.type] || 'Вопрос';
  });
  
  const resultClass = computed(() => isCorrect.value ? 'success' : 'failure');
  
  const selectAnswer = (index) => {
    if (showResult.value) return;
    
    selectedAnswer.value = index;
    showResult.value = true;
    isCorrect.value = index === store.currentCard.correct;
    
    store.answerQuestion(index);
  };
  
  const close = () => {
    selectedAnswer.value = null;
    showResult.value = false;
    isCorrect.value = false;
  };
  </script>

<template>
    <div v-if="store.currentCard" class="card-overlay" @click.self="close">
      <div class="card-modal animate-fade-in paper-texture">
        <div class="card-header">
          <div class="card-circle">Круг {{ store.currentCircle }}</div>
          <div class="card-type" :class="store.currentCard.type">
            {{ typeLabel }}
          </div>
        </div>
        
        <div v-if="store.currentCreature" class="card-creature-icon">
          <div class="mini-creature" :style="{ backgroundColor: store.currentCreature.skinColor }">
            {{ store.currentCreature.nameJp }}
          </div>
        </div>
        
        <div class="card-question">
          <h3>{{ store.currentCard.question }}</h3>
          <p v-if="store.currentCard.lore" class="card-lore">
            {{ store.currentCard.lore }}
          </p>
        </div>
        
        <div class="card-answers">
          <button
            v-for="(answer, index) in store.currentCard.answers"
            :key="index"
            class="answer-btn"
            :class="{ 
              selected: selectedAnswer === index,
              correct: showResult && index === store.currentCard.correct,
              wrong: showResult && selectedAnswer === index && index !== store.currentCard.correct
            }"
            @click="selectAnswer(index)"
            :disabled="showResult"
          >
            <span class="answer-letter">{{ ['А', 'Б', 'В', 'Г'][index] }}</span>
            <span class="answer-text">{{ answer }}</span>
          </button>
        </div>
        
        <div v-if="showResult" class="card-result" :class="resultClass">
          <div class="result-icon">{{ isCorrect ? '✦' : '✦' }}</div>
          <div class="result-text">
            {{ isCorrect ? 'Верно! Душа укрепляется.' : 'Неверно... страдание умножается.' }}
          </div>
        </div>
        
        <button v-if="showResult" class="card-close" @click="close">
          Продолжить путь
        </button>
      </div>
    </div>
  </template>
  
  <style scoped>
  .card-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 10, 10, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 900;
    padding: 20px;
  }
  
  .card-modal {
    background: linear-gradient(135deg, #f4e4c1 0%, #e8d5a3 100%);
    border: 3px solid #2c1810;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 0 60px rgba(139, 69, 19, 0.1);
    position: relative;
  }
  
  .card-modal::before,
  .card-modal::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border: 2px solid #2c1810;
  }
  
  .card-modal::before {
    top: 10px;
    left: 10px;
    border-right: none;
    border-bottom: none;
  }
  
  .card-modal::after {
    bottom: 10px;
    right: 10px;
    border-left: none;
    border-top: none;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #2c1810;
  }
  
  .card-circle {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    color: #2c1810;
    font-weight: bold;
  }
  
  .card-type {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .card-type.knowledge {
    background: #4a3728;
    color: #f4e4c1;
  }
  
  .card-type.logic {
    background: #2c4a3e;
    color: #f4e4c1;
  }
  
  .card-type.trial {
    background: #8b0000;
    color: #f4e4c1;
  }
  
  .card-creature-icon {
    text-align: center;
    margin-bottom: 15px;
  }
  
  .mini-creature {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    color: #2c1810;
    font-weight: bold;
    border: 2px solid #2c1810;
  }
  
  .card-question {
    margin-bottom: 25px;
  }
  
  .card-question h3 {
    font-family: 'Cinzel', serif;
    font-size: 20px;
    color: #2c1810;
    line-height: 1.4;
    margin-bottom: 10px;
  }
  
  .card-lore {
    font-size: 13px;
    color: #6b4423;
    font-style: italic;
    line-height: 1.5;
    padding-left: 15px;
    border-left: 3px solid #6b4423;
  }
  
  .card-answers {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .answer-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(44, 24, 16, 0.05);
    border: 2px solid #2c1810;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: left;
  }
  
  .answer-btn:hover:not(:disabled) {
    background: rgba(44, 24, 16, 0.15);
    transform: translateX(5px);
  }
  
  .answer-btn.selected {
    background: rgba(196, 30, 58, 0.1);
    border-color: #c41e3a;
  }
  
  .answer-btn.correct {
    background: rgba(34, 139, 34, 0.2);
    border-color: #228b22;
  }
  
  .answer-btn.wrong {
    background: rgba(139, 0, 0, 0.2);
    border-color: #8b0000;
    animation: shake 0.5s;
  }
  
  .answer-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .answer-letter {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2c1810;
    color: #f4e4c1;
    border-radius: 50%;
    font-weight: bold;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .answer-text {
    font-size: 15px;
    color: #2c1810;
    line-height: 1.4;
  }
  
  .card-result {
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .card-result.success {
    background: rgba(34, 139, 34, 0.15);
    border: 2px solid #228b22;
  }
  
  .card-result.failure {
    background: rgba(139, 0, 0, 0.15);
    border: 2px solid #8b0000;
  }
  
  .result-icon {
    font-size: 36px;
    margin-bottom: 10px;
  }
  
  .result-text {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    color: #2c1810;
  }
  
  .card-close {
    width: 100%;
    padding: 14px;
    background: #2c1810;
    color: #f4e4c1;
    border: none;
    border-radius: 8px;
    font-family: 'Cinzel', serif;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .card-close:hover {
    background: #8b0000;
  }
  </style>