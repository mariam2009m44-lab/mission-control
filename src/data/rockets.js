export const rockets = [
  {
    id: 'small',
    name: 'Small Lifter',
    icon: '🚀',
    maxPayload: 200,
    cost: 30,
    reliability: 0.92,
    description: 'Light payloads to LEO only',
  },
  {
    id: 'medium',
    name: 'Medium Lifter',
    icon: '🚀',
    maxPayload: 500,
    cost: 65,
    reliability: 0.95,
    description: 'Standard missions to Moon or Mars',
  },
  {
    id: 'heavy',
    name: 'Heavy Lifter',
    icon: '🛸',
    maxPayload: 1000,
    cost: 120,
    reliability: 0.97,
    description: 'Deep space missions with heavy payloads',
  },
];

export const getRocket = (id) => rockets.find((r) => r.id === id);
