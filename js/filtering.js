'use strict';
(function () {
  var fieldsToFunctions = {
    'housing-type': filterType,
    'housing-rooms': filterRoom,
    'housing-guests': filterGuest,
  };

  // var fieldsToFilter = [];  -получала список полей для фильтрования, потом
  // переделала на сразу получения списка фил-ров, котор. надо применить к пинам
  var filtersToApply = [];


  // непосредственно фильтры по типу, гостям и комнатам:

  function filterType(pin) {
    return pin.offer.type === document.querySelector('#housing-type').value;
  }

  function filterRoom(pin) {
    return pin.offer.rooms === +document.querySelector('#housing-rooms').value;
  }

  function filterGuest(pin) {
    return pin.offer.guests === +document.querySelector('#housing-guests').value;
  }

  window.filtering = {
    // обработчик изменения поля select, в котором ведется работа с списком filtersToApply в зависимости от value поля ('any' или не 'any'):
    filterSelectChangeHandler: window.utils.debounce(function (evt, loadedPins) {

      if (evt.target.value !== 'any') {
        filtersToApply.push(fieldsToFunctions[evt.target.id]);
      } else {
        filtersToApply.splice(filtersToApply.indexOf(fieldsToFunctions[evt.target.id]), 1);
      }

      window.pin.update(loadedPins);
    }),

    // и вот тут я застряла, тк не понимаю как вызвать только те фильтры, которые в списке функций filtersToApply  вот в этой функции:
    filterPins: function (loadedData) {
      return loadedData.filter(function (pin) {
        return filterType(pin) && filterRoom(pin) && filterGuest(pin);
      });
    }
  };
})();
