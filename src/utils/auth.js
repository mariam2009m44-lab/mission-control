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

const hashPassword = (password) => {
  let hash = 5381;
  const salted = 'mc_salt_' + password;
  for (let i = 0; i < salted.length; i++) {
    hash = ((hash << 5) + hash + salted.charCodeAt(i)) >>> 0;
  }
  return 'h' + hash.toString(36);
};

const normalize = (username) => (username || '').trim().toLowerCase();

export const register = (username, password) => {
  const name = normalize(username);
  if (!name || !password) {
    return { success: false, error: 'Username and password required' };
  }
  if (name.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }
  if (password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters' };
  }

  const users = getUsers();
  if (users[name]) {
    return { success: false, error: 'Username already exists' };
  }

  users[name] = {
    username: name,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    missions: [],
    achievements: [],
  };
  saveUsers(users);

  localStorage.setItem(SESSION_KEY, name);
  return { success: true, user: users[name] };
};

export const login = (username, password) => {
  const users = getUsers();
  const user = users[normalize(username)];

    (plain text)
  const validOld = user && user.password === password;
  const validNew = user && user.passwordHash === hashPassword(password);

  if (!user || (!validOld && !validNew)) {
    return { success: false, error: 'Invalid username or password' };
  }

  
  if (validOld && !user.passwordHash) {
    user.passwordHash = hashPassword(password);
    delete user.password;
    saveUsers(users);
  }

  localStorage.setItem(SESSION_KEY, user.username);
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
