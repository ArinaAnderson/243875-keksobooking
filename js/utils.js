'use strict';
(function () {
  var ESC_KEYCODE = 27;
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
    }
  };
})();
