'use strict';
// Модуль data.js
(function () {
  var OFFER_TITILES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var MAX_PRICE = 1000000;
  var MIN_PRICE = 1000;
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var MIN_ROOM_NUM = 1;
  var MAX_ROOM_NUM = 5;
  var MAX_GUESTS_NUM = 100;
  var MIN_GUESTS_NUM = 1;
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var locationParams = {
    BLOCK_MAX_WIDTH: 1200,
    PIN_WIDTH: 40,
    PIN_HEIGHT: 40,
    LOCATION_Y_TOP: 130, // верхняя граница доступной области главного маркера
    LOCATION_Y_BOTTOM: 630, // нижняя граница доступной области главного маркера
  };

  // получение случайного числа в пределах указанного диапазона
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  function getImageAddress(varPart) {
    var constPartNumber = varPart < 10 ? '0' : '';
    return 'img/avatars/user' + constPartNumber + varPart + '.png';
  }

  function shuffleArray(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var randomNum = Math.floor(Math.random() * (i + 1));
      var randomElement = list[randomNum];
      list[randomNum] = list[i];
      list[i] = randomElement;
    }
    return list;
  }

  window.data = function (num) { // createOfferData(num)
    var x = getRandomNumber(locationParams.PIN_WIDTH / 2, locationParams.BLOCK_MAX_WIDTH + 1 - locationParams.PIN_WIDTH / 2);
    var y = getRandomNumber(locationParams.LOCATION_Y_BOTTOM, locationParams.LOCATION_Y_TOP + 1);
    return {
      author: {
        avatar: getImageAddress(num + 1)
      },
      offer: {
        title: OFFER_TITILES[num],
        address: '' + x + ', ' + y,
        price: getRandomNumber(MIN_PRICE, MAX_PRICE + 1),
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        rooms: '' + getRandomNumber(MIN_ROOM_NUM, MAX_ROOM_NUM + 1),
        guests: '' + getRandomNumber(MIN_GUESTS_NUM, MAX_GUESTS_NUM + 1),
        checkin: CHECKINS[Math.floor(Math.random() * CHECKINS.length)],
        checkout: CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)],
        features: shuffleArray(FEATURES).slice(0, getRandomNumber(1, num)),
        description: '',
        photos: shuffleArray(PHOTOS)
      },
      location: {
        x: x,
        y: y
      }
    };
  };
})();
