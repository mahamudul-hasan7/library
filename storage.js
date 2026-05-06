(function () {
  function getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeItem(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function readJson(key, fallbackValue) {
    var raw = getItem(key);
    if (raw === null) {
      return fallbackValue;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallbackValue;
    }
  }

  function writeJson(key, value) {
    return setItem(key, JSON.stringify(value));
  }

  window.brainrootStorage = {
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    readJson: readJson,
    writeJson: writeJson
  };
})();


