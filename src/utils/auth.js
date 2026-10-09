const USERS_KEY = 'mc_users';
const SESSION_KEY = 'mc_session';

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = (username, password) => {
  if (!username || !password) {
    return { success: false, error: 'Username and password required' };
  }
  if (username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }
  if (password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters' };
  }

  const users = getUsers();
  if (users[username]) {
    return { success: false, error: 'Username already exists' };
  }

  users[username] = {
    username,
    password,
    createdAt: new Date().toISOString(),
    missions: [],
    achievements: [],
  };
  saveUsers(users);

  // Auto login
  localStorage.setItem(SESSION_KEY, username);
  return { success: true, user: users[username] };
};

export const login = (username, password) => {
  const users = getUsers();
  const user = users[username];

  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid username or password' };
  }

  localStorage.setItem(SESSION_KEY, username);
  return { success: true, user };
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = () => {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return null;
  const users = getUsers();
  return users[username] || null;
};

export const saveMission = (mission) => {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return { success: false, error: 'Not logged in' };

  const users = getUsers();
  if (!users[username]) return { success: false, error: 'User not found' };

  const newMission = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...mission,
  };

  users[username].missions = [newMission, ...(users[username].missions || [])].slice(0, 20);
  saveUsers(users);
  return { success: true, mission: newMission };
};

export const getMissions = () => {
  const user = getCurrentUser();
  return user?.missions || [];
};

export const deleteMission = (id) => {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return;

  const users = getUsers();
  if (!users[username]) return;

  users[username].missions = (users[username].missions || []).filter((m) => m.id !== id);
  saveUsers(users);
};
