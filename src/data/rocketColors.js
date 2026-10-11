export const rocketColors = [
  { id: 'default', name: 'Default', primary: '#e0e0e0', secondary: '#cc3333' },
  { id: 'midnight', name: 'Midnight', primary: '#1a1a2e', secondary: '#00d4ff' },
  { id: 'emerald', name: 'Emerald', primary: '#e8ffe8', secondary: '#00ff88' },
  { id: 'solar', name: 'Solar', primary: '#fff5e0', secondary: '#ffaa00' },
  { id: 'martian', name: 'Martian', primary: '#f5e0d0', secondary: '#c1440e' },
  { id: 'void', name: 'Void', primary: '#2a2a3a', secondary: '#9d4edd' },
];

export const getRocketColor = (id) => rocketColors.find(c => c.id === id) || rocketColors[0];
