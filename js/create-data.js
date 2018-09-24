'use strict';
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

  function getImageAddress(varPart) {
    var constPartNumber = varPart < 10 ? '0' : '';
    return 'img/avatars/user' + constPartNumber + varPart + '.png';
  }

  window.createData = function (num) {
    var x = window.utils.getRandomNumber(locationParams.PIN_WIDTH / 2, locationParams.BLOCK_MAX_WIDTH + 1 - locationParams.PIN_WIDTH / 2);
    var y = window.utils.getRandomNumber(locationParams.LOCATION_Y_BOTTOM, locationParams.LOCATION_Y_TOP + 1);
    return {
      author: {
        avatar: getImageAddress(num + 1)
      },
      offer: {
        title: OFFER_TITILES[num],
        address: '' + x + ', ' + y,
        price: window.utils.getRandomNumber(MIN_PRICE, MAX_PRICE + 1),
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        rooms: '' + window.utils.getRandomNumber(MIN_ROOM_NUM, MAX_ROOM_NUM + 1),
        guests: '' + window.utils.getRandomNumber(MIN_GUESTS_NUM, MAX_GUESTS_NUM + 1),
        checkin: CHECKINS[Math.floor(Math.random() * CHECKINS.length)],
        checkout: CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)],
        features: window.utils.shuffleArray(FEATURES).slice(0, window.utils.getRandomNumber(1, num)),
        description: '',
        photos: window.utils.shuffleArray(PHOTOS)
      },
      location: {
        x: x,
        y: y
      }
    };
  };
})();
