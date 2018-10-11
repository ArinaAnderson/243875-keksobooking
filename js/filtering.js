'use strict';
(function () {
  var selectFilters = document.querySelectorAll('.map__filter');
  var features = [];

  // для функции filterTypeRoomGuest(pin, field), которая заменяет три старые filterType(pin),
  // filterRoom(pin) и filterGuest(pin)
  var fieldToPinProperty = {
    'housing-type': 'type',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };

  // при переборе массива полей с value НЕ 'any' вызывать соответствующие функции:
  var fieldToFunction = {
    'housing-type': filterTypeRoomGuest,
    'housing-rooms': filterTypeRoomGuest,
    'housing-guests': filterTypeRoomGuest,
    'housing-price': priceValueToPriceRange
  };

  /* заменить три старых фильтра по типу, комнатам и гостям одной функцией, просто передавая поле не получается, потому что в первом случае
  текст сравнивается с текстом, а в других - с числами, значит, чтобы привести эти три функции к одной я должна использовать
  один формат - я выбрала toString(): там, где у пинов числа, я конвертирую в текст. Но тогда мы имеем излишнюю конвертацию текста в текст
  в pin.offer.type. Еще эти три функции различаются свойствами пинов,  по которым идет сравнение с полем, поэтому мне понадобился объект fieldToPinProperty */
  function filterTypeRoomGuest(pin, field) {
    return pin.offer[fieldToPinProperty[field.id]].toString() === field.value;
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

  var notAnyFields;

  window.filtering = {
    filterPins: function (loadedData) {
      return loadedData.filter(function (pin) {
        return notAnyFields.forEach(function (item) {
          if (fieldToFunction[item.id] === filterTypeRoomGuest) {
            return filterTypeRoomGuest(pin, item);
          } else {
            return priceValueToPriceRange[item.value](pin);
          }
        }) && filterFeatures(pin);
      });
    },

    filterSelectChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      notAnyFields = Array.prototype.filter.call(selectFilters, function (item) {
        return item.value !== 'any';
      });
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
