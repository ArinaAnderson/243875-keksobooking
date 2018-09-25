'use strict';
(function () {
  var locationParams = {
    PIN_WIDTH: 40,
    PIN_HEIGHT: 40,
  };

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var activePin;

  function activatePin(pin) {
    window.pin.deactivate();
    pin.classList.add('map__pin--active');
  }

  function renderPin(offerData) {
    var pin = pinTemplate.cloneNode(true);
    pin.style = 'left: ' + (offerData.location.x - locationParams.PIN_WIDTH / 2) +
    'px; top: ' + (offerData.location.y - locationParams.PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = offerData.author.avatar;
    pin.querySelector('img').alt = offerData.offer.title;
    pin.addEventListener('click', function (evt) {
      activatePin(pin);
      window.card.remove();
      activePin = evt.currentTarget;
      window.card.add(offerData);
    });
    return pin;
  }

  window.pin = {
    render: function (offersData) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < offersData.length; i++) {
        fragment.appendChild(renderPin(offersData[i]));
      }
      mapPins.appendChild(fragment);
    },
    delete: function (elem) {
      var nextBtn = elem.nextElementSibling;
      while (nextBtn) {
        nextBtn.parentElement.removeChild(nextBtn);
        nextBtn = elem.nextElementSibling;
      }
      window.card.remove();
    },
    deactivate: function () {
      if (activePin) {
        activePin.classList.remove('map__pin--active');
        activePin.focus();
      }
    }
  };
})();
