'use strict';
(function () {
  var locationParams = {
    PIN_WIDTH: 40,
    PIN_HEIGHT: 40,
  };

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters-container');
  var activePin;
  var activeCard;

  function activatePin(pin) {
    deactivatePin();
    pin.classList.add('map__pin--active');
  }

  function deactivatePin() {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      activePin.focus();
    }
  }

  function addCard(offerData) {
    var fragment = document.createDocumentFragment();
    activeCard = fragment.appendChild(window.cardData(offerData));
    map.insertBefore(fragment, mapFilters);

    var btn = activeCard.querySelector('.popup__close');
    btn.focus();
    btn.addEventListener('click', clickCardBtnHandler);

    document.addEventListener('keydown', cardEscPressHandler);
  }

  function removeCard() {
    if (activeCard) {
      activeCard.parentElement.removeChild(activeCard);
    }
    activeCard = null;
    document.removeEventListener('keydown', cardEscPressHandler);
  }

  function cardEscPressHandler(evt) {
    window.utils.isEscPress(evt, function () {
      removeCard();
      deactivatePin();
    });
  }
  function clickCardBtnHandler() {
    removeCard();
    deactivatePin();
  }

  function renderPin(offerData) {
    var pin = pinTemplate.cloneNode(true);
    pin.style = 'left: ' + (offerData.location.x - locationParams.PIN_WIDTH / 2) +
    'px; top: ' + (offerData.location.y - locationParams.PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = offerData.author.avatar;
    pin.querySelector('img').alt = offerData.offer.title;
    pin.addEventListener('click', function (evt) {
      activatePin(pin);
      removeCard();
      activePin = evt.currentTarget;
      addCard(offerData);
    });
    return pin;
  }

  window.pinRendering = {
    renderPins: function (offersData) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < offersData.length; i++) {
        fragment.appendChild(renderPin(offersData[i]));
      }
      mapPins.appendChild(fragment);
    },
    deletePins: function (elem) {
      var nextBtn = elem.nextElementSibling;
      while (nextBtn) {
        nextBtn.parentElement.removeChild(nextBtn);
        nextBtn = elem.nextElementSibling;
      }
      removeCard();
    }
  };
})();
