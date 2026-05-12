export const events = [
    {
      id: 1,
      name: 'Туман Санзу',
      description: 'Река затянула туманом. Все игроки теряются на 1 ход.',
      effect: 'skip',
      target: 'all',
      circle: [1, 2]
    },
    {
      id: 2,
      name: 'Пир сёдзё',
      description: 'Сёдзё устраивает пир! Все игроки бросают кость — 4+ получают +1 HP.',
      effect: 'heal_all',
      target: 'all',
      circle: [2, 3]
    },
    {
      id: 3,
      name: 'Охота они',
      description: 'Они устроили охоту! Все игроки должны ответить на вопрос сложности 3.',
      effect: 'forced_question',
      target: 'all',
      circle: [3, 4]
    },
    {
      id: 4,
      name: 'Сон баку',
      description: 'Баку проходит мимо. Можешь позволить ему съесть кошмар (сбросить отриц. карму).',
      effect: 'choice',
      target: 'current',
      circle: [4, 5]
    },
    {
      id: 5,
      name: 'Суд Эмма-О',
      description: 'Эмма-О лично судит! Проверка кармы — 5+ спасает, меньше — -2 HP.',
      effect: 'karma_check',
      target: 'current',
      circle: [5, 6, 7, 8]
    },
    {
      id: 6,
      name: 'Круги ада',
      description: 'Землетрясение в Дзигоку! Все игроки откатываются на 1 круг назад.',
      effect: 'move_back',
      target: 'all',
      circle: [3, 4, 5, 6, 7, 8]
    }
  ];
  
  export const getRandomEvent = (circle) => {
    const available = events.filter(e => e.circle.includes(circle));
    return available.length > 0 
      ? available[Math.floor(Math.random() * available.length)] 
      : null;
  };