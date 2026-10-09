const XP_PER_LEVEL = [0, 100, 250, 500, 900, 1500, 2300, 3400, 5000, 7000];
export const MAX_LEVEL = XP_PER_LEVEL.length - 1;
export const calculateLevel = (xp) => {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i;
  }
  return 0;
};
export const xpForNextLevel = (currentLevel) => {
  if (currentLevel >= MAX_LEVEL) return null;
  return XP_PER_LEVEL[currentLevel + 1];
};
export const xpProgress = (xp) => {
  const level = calculateLevel(xp);
  const currentLevelXP = XP_PER_LEVEL[level];
  const nextLevelXP = XP_PER_LEVEL[level + 1] || currentLevelXP;
  const progress = nextLevelXP - currentLevelXP === 0
    ? 100
    : ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, progress, currentLevelXP, nextLevelXP };
};
export const awardXP = (mission, status) => {
  let xp = 50;
  if (status === 'SUCCESS') xp += 150;
  else if (status === 'PARTIAL') xp += 80;
  if (mission.objective === 'mars') xp += 100;
  else if (mission.objective === 'lunar') xp += 50;
  if (mission.score > 150) xp += 100;
  return xp;
};
export const unlocksByLevel = { 0: ['scout', 'science', 'hauler'] };
export const getUnlockedTypes = (level) => ['scout', 'science', 'hauler'];
