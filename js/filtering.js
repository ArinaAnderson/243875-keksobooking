'use strict';
(function () {
  // var selectFilters = document.querySelectorAll('.map__filter');
  var selectType = document.querySelector('#housing-type');
  var selectRooms = document.querySelector('#housing-rooms');
  var selectGuests = document.querySelector('#housing-guests');
  var selectPrice = document.querySelector('#housing-price');
  var features = [];

  // для функции filterTypeRoomGuest(pin, field), которая заменяет три старые filterType(pin),
  // filterRoom(pin) и filterGuest(pin)
  var fieldToPinProperty = {
    'housing-type': 'type',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };

  function filterTypeRoomGuest(pin, field) {
    return field.value !== 'any' ? pin.offer[fieldToPinProperty[field.id]].toString() === field.value : true;
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
    for (var i = 0; i < features.length; i++) {
      if (pin.offer.features.indexOf(features[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  window.filtering = {
    filterPins: function (loadedData) {
      return loadedData.filter(function (pin) {
        return filterTypeRoomGuest(pin, selectType) && priceValueToPriceRange[selectPrice.value](pin) && filterTypeRoomGuest(pin, selectRooms)
          && filterTypeRoomGuest(pin, selectGuests) && filterFeatures(pin);
      });
    },

    filterSelectChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      window.pin.update(loadedPins);
    }),

    filterFeatureChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      if (evt.target.checked) {
        features.push(evt.target.value);
      } else {
        features.splice(features.indexOf(evt.target.value), 1);
      }
      window.pin.update(loadedPins);
    })
  };
})();
