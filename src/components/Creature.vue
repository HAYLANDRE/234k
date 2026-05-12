 <script setup>
  import { computed } from 'vue';
  import { useGameStore } from '../stores/gameStore.js';
  
  const store = useGameStore();
  const creature = computed(() => store.currentCreature);
  
  const close = () => {
    store.showCreature = false;
  };
  </script>

<template>
    <div v-if="creature" class="creature-overlay" @click.self="close">
      <div class="creature-modal animate-fade-in">
        <div class="creature-visual" :style="{ backgroundColor: creature.skinColor }">
          <svg viewBox="0 0 200 200" class="creature-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Сёдзё -->
            <g v-if="creature.id === 'shojo'" class="shojo">
              <path d="M60,80 Q40,60 50,40 Q70,20 100,30 Q130,20 150,40 Q160,60 140,80" 
                    fill="#ff4500" stroke="#8b0000" stroke-width="2"/>
              <ellipse cx="100" cy="100" rx="35" ry="40" fill="#ffb7c5"/>
              <ellipse cx="85" cy="95" rx="8" ry="10" fill="#fff"/>
              <ellipse cx="115" cy="95" rx="8" ry="10" fill="#fff"/>
              <circle cx="87" cy="97" r="4" fill="#2c1810"/>
              <circle cx="113" cy="97" r="4" fill="#2c1810"/>
              <path d="M85,115 Q100,125 115,115" fill="none" stroke="#c41e3a" stroke-width="2"/>
              <path d="M70,140 Q60,160 80,170 M130,140 Q140,160 120,170" 
                    fill="none" stroke="#228b22" stroke-width="3"/>
              <path d="M90,150 L110,150 L105,165 L95,165 Z" fill="#d4af37"/>
            </g>
            
            <!-- Они -->
            <g v-if="creature.id === 'oni'" class="oni">
              <path d="M70,60 L60,30 L80,50" fill="#4a0000" stroke="#000" stroke-width="2"/>
              <path d="M130,60 L140,30 L120,50" fill="#4a0000" stroke="#000" stroke-width="2"/>
              <circle cx="100" cy="90" r="40" fill="#8b0000"/>
              <path d="M75,85 L85,95 M125,85 L115,95" stroke="#000" stroke-width="3"/>
              <circle cx="85" cy="85" r="6" fill="#ffd700"/>
              <circle cx="115" cy="85" r="6" fill="#ffd700"/>
              <path d="M90,110 L95,120 L100,110 M110,110 L105,120 L100,110" fill="#fff"/>
              <rect x="140" y="60" width="8" height="60" fill="#4a4a4a" transform="rotate(30 144 90)"/>
              <circle cx="160" cy="50" r="12" fill="#8b0000"/>
            </g>
            
            <!-- Баку -->
            <g v-if="creature.id === 'baku'" class="baku">
              <ellipse cx="100" cy="120" rx="50" ry="40" fill="#808080"/>
              <path d="M50,100 Q30,80 50,60 Q70,40 100,50 Q130,40 150,60 Q170,80 150,100" 
                    fill="#a0a0a0"/>
              <path d="M100,100 Q80,80 70,60 Q60,50 80,55 Q90,60 100,80" 
                    fill="#a0a0a0" stroke="#666" stroke-width="2"/>
              <ellipse cx="90" cy="90" rx="10" ry="8" fill="#fff"/>
              <circle cx="88" cy="90" r="4" fill="#2c1810"/>
              <circle cx="70" cy="130" r="8" fill="#fff" opacity="0.6"/>
              <circle cx="130" cy="130" r="8" fill="#fff" opacity="0.6"/>
              <circle cx="100" cy="150" r="6" fill="#fff" opacity="0.6"/>
            </g>
            
            <!-- Эмма-О -->
            <g v-if="creature.id === 'emma'" class="emma">
              <path d="M70,50 L100,30 L130,50 L120,70 L80,70 Z" fill="#d4af37"/>
              <text x="95" y="58" font-size="14" fill="#8b0000" font-weight="bold">王</text>
              <ellipse cx="100" cy="90" rx="30" ry="35" fill="#2c1810"/>
              <path d="M80,85 L95,90 M105,90 L120,85" stroke="#d4af37" stroke-width="2"/>
              <path d="M85,110 Q100,140 115,110" fill="#4a4a4a"/>
              <rect x="130" y="70" width="6" height="50" fill="#8b4513" transform="rotate(20 133 95)"/>
              <circle cx="145" cy="65" r="10" fill="#d4af37"/>
              <circle cx="60" cy="80" r="15" fill="#c0c0c0" opacity="0.8"/>
            </g>
          </svg>
        </div>
        
        <div class="creature-info">
          <h3 class="creature-name">
            {{ creature.name }}
            <span class="creature-name-jp">{{ creature.nameJp }}</span>
          </h3>
          <p class="creature-desc">{{ creature.description }}</p>
          <div class="creature-quote">"{{ creature.quote }}"</div>
          <div class="creature-effects">
            <div class="effect good">
              <span class="effect-label">Добро:</span>
              {{ creature.effect.good }}
            </div>
            <div class="effect bad">
              <span class="effect-label">Зло:</span>
              {{ creature.effect.bad }}
            </div>
          </div>
        </div>
        
        <button class="creature-close" @click="close">Продолжить</button>
      </div>
    </div>
  </template>
    
  <style scoped>
  .creature-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }
  
  .creature-modal {
    background: linear-gradient(135deg, #1a0a0a 0%, #0a0a0a 100%);
    border: 2px solid #d4af37;
    border-radius: 16px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 0 40px rgba(196, 30, 58, 0.3);
  }
  
  .creature-visual {
    width: 200px;
    height: 200px;
    margin: 0 auto 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
  }
  
  .creature-svg {
    width: 180px;
    height: 180px;
  }
  
  .creature-name {
    font-family: 'Cinzel', serif;
    font-size: 24px;
    color: #d4af37;
    text-align: center;
    margin-bottom: 5px;
  }
  
  .creature-name-jp {
    display: block;
    font-size: 14px;
    color: #c41e3a;
    margin-top: 5px;
  }
  
  .creature-desc {
    color: #f4e4c1;
    text-align: center;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 15px;
    opacity: 0.9;
  }
  
  .creature-quote {
    font-style: italic;
    color: #c41e3a;
    text-align: center;
    padding: 10px;
    border-left: 3px solid #c41e3a;
    margin-bottom: 15px;
    font-size: 14px;
  }
  
  .creature-effects {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .effect {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
  }
  
  .effect.good {
    background: rgba(0, 128, 0, 0.2);
    border-left: 3px solid #228b22;
  }
  
  .effect.bad {
    background: rgba(139, 0, 0, 0.2);
    border-left: 3px solid #8b0000;
  }
  
  .effect-label {
    font-weight: bold;
    margin-right: 5px;
  }
  
  .creature-close {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%);
    color: #f4e4c1;
    border: none;
    border-radius: 8px;
    font-family: 'Cinzel', serif;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .creature-close:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(196, 30, 58, 0.4);
  }
  
  .shojo { animation: float 3s ease-in-out infinite; }
  .oni { animation: pulse 2s ease-in-out infinite; }
  .baku { animation: float 4s ease-in-out infinite; }
  .emma { animation: glow 3s ease-in-out infinite; }
  </style>