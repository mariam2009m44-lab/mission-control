import { getObjective } from './objectives';
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
  const obj = getObjective(mission.objective);
  if (obj) xp += obj.difficulty * 20;
  if (mission.score > 150) xp += 100;
  return xp;
};
export const unlocksByLevel = { 0: ['scout'], 1: ['science'], 2: ['hauler'] };
export const getUnlockedTypes = (level) => Array.from({length: level+1}, (_,i) => unlocksByLevel[i] || []).flat();
