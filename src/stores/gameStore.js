import { reactive } from 'vue';
import { getRandomCard } from '../data/cards.js';
import { getCreature } from '../data/creatures.js';
import { getRandomEvent } from '../data/events.js';

// Создаём единый объект состояния и действий
const store = reactive({
  // === Состояние ===
  gameState: 'start',
  players: [],
  currentPlayerIndex: 0,
  currentCard: null,
  currentEvent: null,
  currentCreature: null,
  diceResult: null,
  maxCircles: 8,
  turnCount: 0,
  message: '',
  messageType: 'info',
  showCreature: false,
  animatingDice: false,
  lastAnswerCorrect: null,

  // === Геттеры (как computed, но в reactive) ===
  get currentPlayer() {
    return this.players[this.currentPlayerIndex] || null;
  },
  
  get allPlayersDead() {
    return this.players.every(p => p.hp <= 0);
  },
  
  get allPlayersFinished() {
    return this.players.every(p => p.position >= this.maxCircles);
  },
  
  get isGameOver() {
    return this.gameState === 'victory' || this.gameState === 'defeat';
  },
  
  get currentCircle() {
    const player = this.players[this.currentPlayerIndex];
    return player ? Math.min(player.position + 1, this.maxCircles) : 1;
  },

  // === Действия ===
  initGame(playerNames) {
    console.log('=== initGame called ===');
    console.log('playerNames:', playerNames);
    
    this.players = playerNames.map((name, index) => ({
      id: index + 1,
      name: name || `Душа ${index + 1}`,
      position: 0,
      hp: 5,
      maxHp: 5,
      karma: 0,
      status: 'alive',
      effects: []
    }));
    
    this.currentPlayerIndex = 0;
    this.turnCount = 0;
    this.gameState = 'playing';
    
    console.log('gameState changed to:', this.gameState);
    console.log('players:', this.players);
    
    this.setMessage('Добро пожаловать в Дзигоку. Бросьте кость, чтобы начать путь.', 'info');
  },

  rollDice() {
    if (this.gameState !== 'playing') {
      console.log('Cannot roll, gameState:', this.gameState);
      return;
    }
    
    this.animatingDice = true;
    this.diceResult = null;
    
    setTimeout(() => {
      this.diceResult = Math.floor(Math.random() * 6) + 1;
      this.animatingDice = false;
      
      const player = this.currentPlayer;
      const newPosition = Math.min(player.position + this.diceResult, this.maxCircles);
      
      player.position = newPosition;
      this.turnCount++;
      
      console.log('Rolled:', this.diceResult, 'New position:', newPosition);
      
      const event = getRandomEvent(this.currentCircle);
      if (event && Math.random() > 0.7) {
        this.triggerEvent(event);
      } else {
        this.drawCard();
      }
    }, 1000);
  },

  drawCard() {
    const card = getRandomCard(this.currentCircle);
    this.currentCard = card;
    
    if (card.creature) {
      this.currentCreature = getCreature(card.creature);
      this.showCreature = true;
    } else {
      this.currentCreature = null;
      this.showCreature = false;
    }
    
    this.gameState = 'question';
    this.setMessage(`Круг ${this.currentCircle}: ${card.question.substring(0, 50)}...`, 'info');
  },

  answerQuestion(answerIndex) {
    if (!this.currentCard || this.gameState !== 'question') return;
    
    const correct = this.currentCard.correct === answerIndex;
    const player = this.currentPlayer;
    this.lastAnswerCorrect = correct;
    
    if (correct) {
      player.karma += 1;
      
      if (this.currentCreature?.id === 'shojo') {
        player.hp = Math.min(player.hp + 1, player.maxHp);
        this.setMessage('Сёдзё улыбается. Сакэ дарит молодость! +1 HP', 'success');
      } else if (this.currentCreature?.id === 'baku') {
        player.effects.push('protected');
        this.setMessage('Баку доволен. Кошмар съеден. Защита на 1 ход.', 'success');
      } else {
        this.setMessage('Верно! Карма возрастает.', 'success');
      }
    } else {
      player.hp -= 1;
      
      if (this.currentCreature?.id === 'shojo') {
        player.hp -= 1;
        this.setMessage('Сёдзё хмурится. Сакэ превратился в яд! -2 HP', 'danger');
      } else if (this.currentCreature?.id === 'oni') {
        player.position = Math.max(player.position - 1, 0);
        this.setMessage('Они разгневан! Тебя отбросило назад! -1 HP', 'danger');
      } else {
        this.setMessage('Неверно. Душа страдает. -1 HP', 'warning');
      }
    }
    
    if (player.hp <= 0) {
      player.hp = 0;
      player.status = 'dead';
      this.setMessage(`${player.name} погибла в круге ${this.currentCircle}...`, 'danger');
    }
    
    if (player.position >= this.maxCircles) {
      player.status = 'escaped';
      this.setMessage(`${player.name} вышла из Дзигоку!`, 'success');
    }
    
    this.checkGameEnd();
    
    if (!this.isGameOver) {
      setTimeout(() => this.nextTurn(), 2000);
    }
  },

  triggerEvent(event) {
    this.currentEvent = event;
    this.gameState = 'event';
    this.setMessage(`Событие: ${event.name}!`, 'warning');
    
    setTimeout(() => {
      this.resolveEvent(event);
    }, 2000);
  },

  resolveEvent(event) {
    switch (event.effect) {
      case 'skip':
        this.players.forEach(p => {
          if (p.status === 'alive') p.effects.push('skipped');
        });
        this.setMessage('Все пропускают ход...', 'warning');
        break;
      case 'heal_all':
        this.players.forEach(p => {
          if (p.status === 'alive') p.hp = Math.min(p.hp + 1, p.maxHp);
        });
        this.setMessage('Сёдзё щедра! Все исцелены.', 'success');
        break;
      case 'forced_question':
        this.setMessage('Они не дают покоя! Все отвечают на вопрос.', 'danger');
        this.drawCard();
        return;
      case 'choice':
        this.setMessage('Баку предлагает сделку...', 'info');
        return;
      case 'karma_check':
        const player = this.currentPlayer;
        if (player.karma >= 5) {
          this.setMessage('Эмма-О кивает. Карма чиста.', 'success');
        } else {
          player.hp -= 2;
          this.setMessage('Эмма-О хмурится. -2 HP за грехи.', 'danger');
        }
        break;
      case 'move_back':
        this.players.forEach(p => {
          if (p.status === 'alive') p.position = Math.max(p.position - 1, 0);
        });
        this.setMessage('Круги ада сдвинулись! Все назад.', 'danger');
        break;
    }
    
    this.checkGameEnd();
    if (!this.isGameOver) {
      setTimeout(() => this.nextTurn(), 2000);
    }
  },

  acceptBakuDeal() {
    const player = this.currentPlayer;
    player.karma = Math.max(player.karma - 1, 0);
    player.hp = Math.min(player.hp + 2, player.maxHp);
    this.setMessage('Баку съел кошмар. Ты чувствуешь облегчение.', 'success');
    setTimeout(() => this.nextTurn(), 1500);
  },

  refuseBakuDeal() {
    this.setMessage('Ты отказался. Баку уходит, хмурясь.', 'info');
    setTimeout(() => this.nextTurn(), 1500);
  },

  nextTurn() {
    this.currentCard = null;
    this.currentEvent = null;
    this.currentCreature = null;
    this.showCreature = false;
    this.diceResult = null;
    this.lastAnswerCorrect = null;
    
    let attempts = 0;
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      attempts++;
    } while (
      this.players[this.currentPlayerIndex].status !== 'alive' && 
      attempts < this.players.length
    );
    
    const nextPlayer = this.currentPlayer;
    if (nextPlayer.effects.includes('skipped')) {
      nextPlayer.effects = nextPlayer.effects.filter(e => e !== 'skipped');
      this.setMessage(`${nextPlayer.name} пропускает ход...`, 'warning');
      setTimeout(() => this.nextTurn(), 1500);
      return;
    }
    
    this.gameState = 'playing';
    this.setMessage(`Ход ${nextPlayer.name}. Бросьте кость.`, 'info');
  },

  checkGameEnd() {
    if (this.allPlayersDead) {
      this.gameState = 'defeat';
      this.setMessage('Все души погибли в Дзигоку...', 'danger');
    } else if (this.allPlayersFinished) {
      this.gameState = 'victory';
      const survivors = this.players.filter(p => p.status === 'escaped');
      this.setMessage(`${survivors.map(p => p.name).join(', ')} вышли из ада!`, 'success');
    }
  },

  setMessage(text, type = 'info') {
    this.message = text;
    this.messageType = type;
  },

  resetGame() {
    this.gameState = 'start';
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentCard = null;
    this.currentEvent = null;
    this.currentCreature = null;
    this.diceResult = null;
    this.turnCount = 0;
    this.message = '';
    this.messageType = 'info';
    this.showCreature = false;
    this.animatingDice = false;
    this.lastAnswerCorrect = null;
  }
});

// Экспортируем как singleton
export function useGameStore() {
  return store;
}