'use strict';
(function () {
  var OFFERS_NUMBER = 8;
  var locationParams = {
    BLOCK_MAX_WIDTH: 1200,
    PIN_WIDTH: 40,
    PIN_HEIGHT: 40,
    MAIN_PIN_WIDTH: 40,
    MAIN_PIN_HEIGHT: 44,
    LOCATION_Y_TOP: 130, // верхняя граница доступной области главного маркера
    LOCATION_Y_BOTTOM: 630, // нижняя граница доступной области главного маркера
    MAIN_PIN_X: 570, // изначальное состояние main-pin до активации страницы (style="left 570px")
    MAIN_PIN_Y: 375, // изначальное состояние main-pin до активации страницы (style="top 375px")
  };
  var offers;
  var isPageActivated;
  var mainPin = document.querySelector('.map__pin--main');
  // var adForm = document.querySelector('.ad-form');

  function createOffersList(number) {
    var offersArray = [];
    for (var i = 0; i < number; i++) {
      offersArray.push(window.createData(i));
    }
    return offersArray;
  }

  function deactivatePage() {
    isPageActivated = true;
    offers = createOffersList(OFFERS_NUMBER);
    window.form.deactivate();
    mainPin.style.left = locationParams.MAIN_PIN_X;
    mainPin.style.top = locationParams.MAIN_PIN_Y;
    window.form.fillAddressInput(parseInt(mainPin.style.left, 10) + locationParams.MAIN_PIN_WIDTH / 2,
        parseInt(mainPin.style.top, 10) + locationParams.MAIN_PIN_HEIGHT / 2);
    window.pin.delete(mainPin);
  }


  // функция проверяет, не выходит ли за границы доступной области main-pin
  function validateCoord(coord, minValue, maxValue) {
    coord = coord < minValue ? minValue : coord;
    coord = coord > maxValue ? maxValue : coord;
    return coord;
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
      var validatedX = validateCoord(mainPin.offsetLeft - shift.x, 0 - mainPin.offsetWidth / 2, locationParams.BLOCK_MAX_WIDTH - mainPin.offsetWidth / 2);
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
        window.form.activate();
        window.pin.render(offers);
      }
      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      isPageActivated = false;
    }
    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  deactivatePage();
  mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
})();
