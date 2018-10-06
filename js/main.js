'use strict';
(function () {
  var locationParams = {
    BLOCK_MAX_WIDTH: 1200,
    MAIN_PIN_WIDTH: 40,
    MAIN_PIN_HEIGHT: 44,
    LOCATION_Y_TOP: 130, // верхняя граница доступной области главного маркера
    LOCATION_Y_BOTTOM: 630, // нижняя граница доступной области главного маркера
    MAIN_PIN_INIT_X: 570, // изначальное состояние main-pin до активации страницы (style="left 570px")
    MAIN_PIN_INIT_Y: 375, // изначальное состояние main-pin до активации страницы (style="top 375px")
  };
  var isPageActivated;
  var mainPin = document.querySelector('.map__pin--main');

  var loadedPins = [];
  var filterForm = document.querySelector('.map__filters');
  var selectFeatures = document.querySelector('#housing-features');

  // функция проверяет, не выходит ли за границы доступной области main-pin
  function validateCoord(coord, minValue, maxValue) {
    coord = coord < minValue ? minValue : coord;
    coord = coord > maxValue ? maxValue : coord;
    return coord;
  }

  // обработчик удачной загрузки похожих объявлений
  function succesLoadHandler(data) {
    loadedPins = data;
    window.pin.render(window.utils.shuffleArray(loadedPins));
  }

  // обработчик клика на main-pin
  function mainPinMouseDownHandler(evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function mainPinMouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var validatedX = validateCoord(mainPin.offsetLeft - shift.x, 0 - mainPin.offsetWidth / 2,
          locationParams.BLOCK_MAX_WIDTH - mainPin.offsetWidth / 2);
      mainPin.style.left = validatedX + 'px';

      var validatedY = validateCoord(mainPin.offsetTop - shift.y, locationParams.LOCATION_Y_TOP - mainPin.offsetHeight,
          locationParams.LOCATION_Y_BOTTOM - mainPin.offsetHeight);
      mainPin.style.top = validatedY + 'px';

      window.form.fillAddressInput(parseInt(mainPin.style.left, 10) + mainPin.offsetWidth / 2,
          parseInt(mainPin.style.top, 10) + mainPin.offsetHeight);

    }

    function mainPinMouseUpHandler(upEvt) {
      upEvt.preventDefault();
      if (isPageActivated) {
        window.backend.load(succesLoadHandler, window.notifications.notifyOfError);
        window.form.activate();
      }
      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
      isPageActivated = false;
    }
    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  window.main = {
    deactivate: function () {
      isPageActivated = true;
      window.form.deactivate();
      mainPin.style.left = locationParams.MAIN_PIN_INIT_X + 'px';
      mainPin.style.top = locationParams.MAIN_PIN_INIT_Y + 'px';

      window.form.fillAddressInput(parseInt(mainPin.style.left, 10) + locationParams.MAIN_PIN_WIDTH / 2,
          parseInt(mainPin.style.top, 10) + locationParams.MAIN_PIN_HEIGHT / 2);

      window.pin.delete(mainPin);
    }
  };

  window.main.deactivate();
  mainPin.addEventListener('mousedown', mainPinMouseDownHandler);

  filterForm.addEventListener('change', function (evt) {
    window.filtering.filterSelectChangeHandler(evt, loadedPins);
  });
  selectFeatures.addEventListener('change', function (evt) {
    window.filtering.filterFeatureChangeHandler(evt, loadedPins);
  });
})();
