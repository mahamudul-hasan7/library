// local-storage.js - localStorage wrapper for browser storage

(function () {
  window.brainrootStorage = {
    // Read JSON from localStorage
    readJson(key, defaultValue) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
      }
    },

    // Write JSON to localStorage
    writeJson(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
        return false;
      }
    },

    // Remove from localStorage
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
        return false;
      }
    },

    // Clear all localStorage
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
      }
    }
  };
})();
