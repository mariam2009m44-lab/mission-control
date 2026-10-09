export const achievements = [
  {
    id: 'first_mission',
    name: 'First Steps',
    icon: '🥇',
    description: 'Launch your first mission',
    condition: (stats) => stats.totalMissions >= 1,
  },
  {
    id: 'first_success',
    name: 'Success!',
    icon: '🎉',
    description: 'Complete a mission successfully',
    condition: (stats) => stats.successfulMissions >= 1,
  },
  {
    id: 'five_missions',
    name: 'Explorer',
    icon: '🧭',
    description: 'Launch 5 missions',
    condition: (stats) => stats.totalMissions >= 5,
  },
  {
    id: 'three_success',
    name: 'Veteran',
    icon: '🏅',
    description: 'Complete 3 successful missions',
    condition: (stats) => stats.successfulMissions >= 3,
  },
  {
    id: 'planet_visitor',
    name: 'World Traveler',
    icon: '🌍',
    description: 'Visit 3 different planets',
    condition: (stats) => stats.visitedPlanets.length >= 3,
  },
  {
    id: 'all_planets',
    name: 'Galaxy Explorer',
    icon: '🌌',
    description: 'Visit all 6 celestial bodies',
    condition: (stats) => stats.visitedPlanets.length >= 6,
  },
  {
    id: 'heavy_lifter',
    name: 'Heavy Hitter',
    icon: '🛸',
    description: 'Use the Heavy Lifter rocket',
    condition: (stats) => stats.usedRockets.includes('heavy'),
  },
  {
    id: 'science_master',
    name: 'Science Master',
    icon: '🔬',
    description: 'Achieve 100+ science score',
    condition: (stats) => stats.bestScience >= 100,
  },
  {
    id: 'budget_master',
    name: 'Budget Master',
    icon: '💰',
    description: 'Complete a mission under $60M',
    condition: (stats) => stats.bestBudget !== null && stats.bestBudget <= 60,
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    icon: '⭐',
    description: 'Achieve 200+ mission score',
    condition: (stats) => stats.bestScore >= 200,
  },
];

export const getAchievement = (id) => achievements.find((a) => a.id === id);

export const checkNewAchievements = (stats, unlockedIds) => {
  const newOnes = [];
  achievements.forEach((a) => {
    if (!unlockedIds.includes(a.id) && a.condition(stats)) {
      newOnes.push(a);
    }
  });
  return newOnes;
};
