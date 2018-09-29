'use strict';
(function () {
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var fieldsets = document.querySelectorAll('fieldset');
  var selectItems = document.querySelectorAll('select');
  var addressInput = adForm.querySelector('input[name="address"]');
  var priceInput = document.querySelector('input[name="price"]');
  var typeSelect = document.querySelector('select[name="type"]');
  var offerTypePrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var checkinSelect = document.querySelector('select[name="timein"]');
  var checkoutSelect = document.querySelector('select[name="timeout"]');
  var roomsSelect = document.querySelector('select[name="rooms"]');
  var guestsSelect = document.querySelector('select[name="capacity"]');
  var guestsAvailable = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  // создание текста ошибок для конкретного значения поля Кол-во комнат
  function getErrorText() {
    var errorText = [];
    for (var i = 0; i < guestsAvailable[roomsSelect.value].length; i++) {
      errorText.push(guestsSelect.querySelector('option[value="' + guestsAvailable[roomsSelect.value][i] + '"]').textContent);
    }
    return errorText;
  }

  // проверка выбора количества гостей в соответствии с количеством комнат
  function validateGuestNum() {
    if (guestsAvailable[roomsSelect.value].indexOf(guestsSelect.value) < 0) {
      guestsSelect.setCustomValidity('Такое количество комнат предусмотрено ' + getErrorText().join(', или '));
    } else {
      guestsSelect.setCustomValidity('');
    }
  }

  // установка минимальной цены в зависимости от выбранного типа жилья
  function setPriceMin() {
    var typeValue = typeSelect.value;
    priceInput.min = offerTypePrices[typeValue];
    priceInput.placeholder = offerTypePrices[typeValue];
  }

  // установка соответствия времени заезда и выезда
  function validateCheckout() {
    if (checkoutSelect.value !== checkinSelect.value) {
      checkoutSelect.setCustomValidity('Время выезда должно быть ' + checkinSelect.value);
    } else {
      checkoutSelect.setCustomValidity('');
    }
  }

  // обработчик изменения полей времения выезда и заезда
  function timeSelectHandler() {
    validateCheckout();
  }

  // обработчик изменения поля типа жилья
  function typeSelectHandler() {
    setPriceMin();
  }

  // обработчик изменения полей числа комнат и количества гостей
  function guestNumSelectHandler() {
    validateGuestNum();
  }

  function validateFormFields() {
    typeSelect.addEventListener('change', typeSelectHandler);
    checkinSelect.addEventListener('change', timeSelectHandler);
    checkoutSelect.addEventListener('change', timeSelectHandler);
    roomsSelect.addEventListener('change', guestNumSelectHandler);
    guestsSelect.addEventListener('change', guestNumSelectHandler);
  }
  window.form = {
    fillAddressInput: function (x, y) {
      addressInput.value = x + ', ' + y;
    },
    activate: function () {
      validateFormFields();
      window.utils.toggleDisableAttr(fieldsets, false);
      window.utils.toggleDisableAttr(selectItems, false);
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
    },
    deactivate: function () {
      window.utils.toggleDisableAttr(fieldsets, true);
      window.utils.toggleDisableAttr(selectItems, true);
      adForm.classList.add('ad-form--disabled');
      filterForm.reset();
      adForm.reset();
      setPriceMin();
      map.classList.add('map--faded');
    }
  };

  function formSubmitHandler() {
    window.main.deactivate();
    window.backend.notifyOfSuccess();
  }
  adForm.addEventListener('submit', function (evt) {
    window.backend.save(formSubmitHandler, window.backend.errorHandler, new FormData(adForm));
    evt.preventDefault();
  });
  adForm.addEventListener('reset', function () {
    window.main.deactivate();
  });
})();
