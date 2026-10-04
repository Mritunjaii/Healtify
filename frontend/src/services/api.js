const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('healtify_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name, email, password, goals) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, goals })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updatePreferences(data) {
    const res = await fetch(`${BASE_URL}/auth/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Habits (8 categories)
  async logHabit(habitData) {
    const res = await fetch(`${BASE_URL}/habits`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(habitData)
    });
    return res.json();
  },

  async getHabits(limit = 30) {
    const res = await fetch(`${BASE_URL}/habits?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getHabitByDate(date) {
    const res = await fetch(`${BASE_URL}/habits/${date}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Score
  async getScores() {
    const res = await fetch(`${BASE_URL}/score`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Dashboard
  async getDashboardData() {
    const res = await fetch(`${BASE_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Insights (Gemini key strictly processed by backend)
  async generateInsight(period = 'daily') {
    const res = await fetch(`${BASE_URL}/insights`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ period })
    });
    return res.json();
  },

  async getInsightHistory() {
    const res = await fetch(`${BASE_URL}/insights/history`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
