export const spacecraftTypes = {
  scout: {
    id: 'scout',
    name: 'Scout',
    icon: '🛰️',
    description: 'Fast and lightweight explorer',
    visual: {
      color: '#00d4ff',
      shape: 'sleek',
    },
    baseStats: {
      mass: 80,
      power: 200,
      science: 10,
      communication: 40,
      mobility: 80,
      protection: 10,
      baseCost: 10,
    },
    specialty: 'Fast, lightweight, cheap',
    recommendedFor: ['lunar', 'earth'],
  },
  science: {
    id: 'science',
    name: 'Science Vessel',
    icon: '🔬',
    description: 'Heavy duty research platform',
    visual: {
      color: '#00ff88',
      shape: 'bulky',
    },
    baseStats: {
      mass: 180,
      power: 400,
      science: 40,
      communication: 60,
      mobility: 20,
      protection: 30,
      baseCost: 30,
    },
    specialty: 'Best for science, heavy',
    recommendedFor: ['mars', 'lunar'],
  },
  hauler: {
    id: 'hauler',
    name: 'Hauler',
    icon: '🚛',
    description: 'Heavy cargo and construction',
    visual: {
      color: '#ffb800',
      shape: 'rugged',
    },
    baseStats: {
      mass: 300,
      power: 600,
      science: 20,
      communication: 50,
      mobility: 10,
      protection: 60,
      baseCost: 50,
    },
    specialty: 'Can carry extra mass',
    recommendedFor: ['mars'],
  },
};

export const getSpacecraftType = (id) => spacecraftTypes[id] || spacecraftTypes.scout;
export const spacecraftList = Object.values(spacecraftTypes);
