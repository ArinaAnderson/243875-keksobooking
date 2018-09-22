'use strict';
// Модуль utils.js
(function () {
  var ESC_KEYCODE = 27;
  window.utils = {
    isEscPress: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterPress: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    manageElemDisabledState(elementList, disable) {
      for (var i = 0; i < elementList.length; i++) {
        elementList[i].disabled = disable;
      }
    }
  };
})();


function setupMainPin(x, y) {
  mainPin.style.left = x;
  mainPin.style.top = y;
}
