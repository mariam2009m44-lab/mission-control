export const objectives = [
  {
    id: 'lunar',
    name: 'Lunar Exploration',
    icon: '🌙',
    description: 'Explore the Moon surface and gather geological data',
    difficulty: 3,
    minBudget: 80,
    scienceTarget: 60,
  },
  {
    id: 'mars',
    name: 'Mars Exploration',
    icon: '🔴',
    description: 'Study the Martian surface and atmosphere',
    difficulty: 5,
    minBudget: 150,
    scienceTarget: 100,
  },
  {
    id: 'earth',
    name: 'Earth Observation',
    icon: '🌍',
    description: 'Monitor climate and environmental changes',
    difficulty: 2,
    minBudget: 60,
    scienceTarget: 40,
  },
];

export const getObjective = (id) => objectives.find((o) => o.id === id);
