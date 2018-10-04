'use strict';
(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var filterValues = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'features': []
  };

  function filterType(pin) {
    return filterValues['housing-type'] !== 'any' ? pin.offer.type === filterValues['housing-type'] : true;
  }

  function filterRoom(pin) {
    return filterValues['housing-rooms'] !== 'any' ? pin.offer.rooms === (filterValues['housing-rooms'] * 1) : true;
  }

  function filterGuest(pin) {
    return filterValues['housing-guests'] !== 'any' ? pin.offer.guests === (filterValues['housing-guests'] * 1) : true;
  }

  function filterPrice(pin) {
    switch (filterValues['housing-price']) {
      case 'low':
        return pin.offer.price < 10000;
      case 'middle':
        return pin.offer.price >= 10000 && pin.offer.price <= 50000;
      case 'high':
        return pin.offer.price > 50000;
      default:
        return true;
    }
  }

  function filterFeatures(pin) {
    for (var i = 0; i < filterValues['features'].length; i++) {
      if (pin.offer.features.indexOf(filterValues['features'][i]) === -1) {
        return false;
      }
    }
    return true;
  }

  window.filtering = {
    updatePins: function (loadedPins) {
      window.card.remove();
      window.pin.delete(mainPin);

      var selectedPins = loadedPins.filter(filterType).filter(filterPrice).filter(filterRoom)
        .filter(filterGuest).filter(filterFeatures);// .filter(filterFeatures)
      var uniquePins = selectedPins.filter(function (pin, index) {
        return selectedPins.indexOf(pin) === index;
      });
      window.pin.render(uniquePins);
    },
    filterSelectChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      filterValues[evt.target.id] = evt.target.value;
      window.filtering.updatePins(loadedPins);
    }),
    filterFeatureChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      if (evt.target.checked) {
        filterValues['features'].push(evt.target.value);
      } else {
        filterValues['features'].splice(filterValues['features'].indexOf(evt.target.value), 1);
      }
      window.filtering.updatePins(loadedPins);
    })
  };
})();
