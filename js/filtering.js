'use strict';
(function () {
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
    return filterValues['housing-rooms'] !== 'any' ? pin.offer.rooms === +filterValues['housing-rooms'] : true;
  }

  function filterGuest(pin) {
    return filterValues['housing-guests'] !== 'any' ? pin.offer.guests === +filterValues['housing-guests'] : true;
  }

  var priceValueToPriceRange = {
    'low': function (pin) {
      return pin.offer.price < 10000;
    },
    'middle': function (pin) {
      return pin.offer.price >= 10000 && pin.offer.price <= 50000;
    },
    'high': function (pin) {
      return pin.offer.price > 50000;
    },
    'any': function () {
      return true;
    }
  };

  function filterFeatures(pin) {
    for (var i = 0; i < filterValues['features'].length; i++) {
      if (pin.offer.features.indexOf(filterValues['features'][i]) === -1) {
        return false;
      }
    }
    return true;
  }

  window.filtering = {
    filterPins: function (loadedData) {
      return loadedData.filter(filterType).filter(priceValueToPriceRange[filterValues['housing-price']])
        .filter(filterRoom).filter(filterGuest).filter(filterFeatures);
    },

    filterSelectChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      filterValues[evt.target.id] = evt.target.value;
      window.pin.update(loadedPins);
    }),

    filterFeatureChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      if (evt.target.checked) {
        filterValues['features'].push(evt.target.value);
      } else {
        filterValues['features'].splice(filterValues['features'].indexOf(evt.target.value), 1);
      }
      window.pin.update(loadedPins);
    })
  };
})();
