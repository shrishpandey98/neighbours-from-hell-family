// Persistence / LocalStorage Manager for Neighbours from Hell: Family Edition

const STORAGE_KEYS = {
  PLAYER_NAME: 'nfh_player_name',
  PLAYER_AVATAR: 'nfh_player_avatar',
  UNLOCKED_LEVELS: 'nfh_unlocked_levels',
  COMPLETED_LEVELS: 'nfh_completed_levels',
  LEVEL_SCORES: 'nfh_level_scores',
  LEVEL_STARS: 'nfh_level_stars',
  SELECTED_HOUSE: 'nfh_selected_house'
};

class StorageManager {
  constructor() {
    this.initDefaults();
  }

  initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS)) {
      // Level 1 initially unlocked
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify([1]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEVEL_SCORES)) {
      localStorage.setItem(STORAGE_KEYS.LEVEL_SCORES, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEVEL_STARS)) {
      localStorage.setItem(STORAGE_KEYS.LEVEL_STARS, JSON.stringify({}));
    }
  }

  getPlayerProfile() {
    return {
      name: localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || 'Chintu',
      avatarId: localStorage.getItem(STORAGE_KEYS.PLAYER_AVATAR) || 'chintu'
    };
  }

  savePlayerProfile(name, avatarId) {
    if (name) localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name.trim());
    if (avatarId) localStorage.setItem(STORAGE_KEYS.PLAYER_AVATAR, avatarId);
  }

  hasCreatedPlayer() {
    return !!localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
  }

  getUnlockedLevels() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS)) || [1];
    } catch {
      return [1];
    }
  }

  isLevelUnlocked(levelId) {
    const list = this.getUnlockedLevels();
    return list.includes(levelId);
  }

  unlockLevel(levelId) {
    const list = this.getUnlockedLevels();
    if (!list.includes(levelId)) {
      list.push(levelId);
      list.sort((a, b) => a - b);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(list));
    }
  }

  getCompletedLevels() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS)) || [];
    } catch {
      return [];
    }
  }

  getLevelScore(levelId) {
    try {
      const scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_SCORES)) || {};
      return scores[levelId] || 0;
    } catch {
      return 0;
    }
  }

  getLevelStars(levelId) {
    try {
      const stars = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_STARS)) || {};
      return stars[levelId] || 0;
    } catch {
      return 0;
    }
  }

  saveLevelProgress(levelId, score, stars) {
    try {
      // Completed list
      const completed = this.getCompletedLevels();
      if (!completed.includes(levelId)) {
        completed.push(levelId);
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify(completed));
      }

      // Best score
      const scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_SCORES)) || {};
      if (!scores[levelId] || score > scores[levelId]) {
        scores[levelId] = score;
        localStorage.setItem(STORAGE_KEYS.LEVEL_SCORES, JSON.stringify(scores));
      }

      // Best stars
      const starsMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_STARS)) || {};
      if (!starsMap[levelId] || stars > starsMap[levelId]) {
        starsMap[levelId] = stars;
        localStorage.setItem(STORAGE_KEYS.LEVEL_STARS, JSON.stringify(starsMap));
      }

      // Automatically unlock next level if levelId < 10
      if (levelId < 10) {
        this.unlockLevel(levelId + 1);
      }
    } catch (e) {
      console.warn('Failed to save level progress:', e);
    }
  }

  resetProgress() {
    localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME);
    localStorage.removeItem(STORAGE_KEYS.PLAYER_AVATAR);
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify([1]));
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LEVEL_SCORES, JSON.stringify({}));
    localStorage.setItem(STORAGE_KEYS.LEVEL_STARS, JSON.stringify({}));
  }
}

export const storage = new StorageManager();
