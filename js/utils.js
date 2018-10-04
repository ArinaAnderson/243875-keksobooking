'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INT = 500;
  window.utils = {
    isEscPress: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    toggleDisableAttr: function (elementList, disable) {
      for (var i = 0; i < elementList.length; i++) {
        elementList[i].disabled = disable;
      }
    },
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },
    shuffleArray: function (list) {
      for (var i = list.length - 1; i > 0; i--) {
        var randomNum = Math.floor(Math.random() * (i + 1));
        var randomElement = list[randomNum];
        list[randomNum] = list[i];
        list[i] = randomElement;
      }
      return list;
    },
    debounce: function (cb) {
      var lastTimeout = null;
      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, args);
        }, DEBOUNCE_INT);
      };
    }
  };
})();
