'use strict';

var OFFERS_NUMBER = 8;
var AVA_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var OFFER_TITILES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var MAX_PRICE = 1000000;
var MIN_PRICE = 1000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOM_NUM = 1;
var MAX_ROOM_NUM = 5;
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = '';
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var BLOCK_MAX_WIDTH = 1200;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var LOCATION_Y_TOP = 130;
var LOCATION_Y_BOTTOM = 630;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapFilters = document.querySelector('.map__filters-container');

var takenAvas = [];
var takenTitles = [];

// получение случайного не повторяющегося значения из массива
function getUniqueRandom(takenPositions, dataList) {
  var position = position = Math.floor(Math.random() * dataList.length);
  while (takenPositions.indexOf(position) >= 0) {
    position = Math.floor(Math.random() * dataList.length);
  }
  takenPositions.push(position);
  return position;
}

// получение случайного числа в пределах указанного диапазона
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

// получение массива случайной длины
function getRandomLengthArray(dataList) {
  var list = [];
  var count = Math.floor(Math.random() * dataList.length);
  for (var i = 0; i < count; i++) {
    list.push(dataList[i]);
  }
  return list;
}

// расположить элементы массива в произвольном порядке
function mixArray(dataList) {
  var takenIndexes = [];
  var mixedList = [];
  for (var i = 0; i < dataList.length; i++) {
    mixedList.push(dataList[getUniqueRandom(takenIndexes, dataList)]);
  }
  return mixedList;
}

function createOfferData() {
  var x = getRandomNumber(PIN_WIDTH * 0.5, BLOCK_MAX_WIDTH - PIN_WIDTH * 0.5);
  var y = getRandomNumber(LOCATION_Y_BOTTOM, LOCATION_Y_TOP);
  return {
    author: {
      avatar: 'img/avatars/user' + AVA_NUMBERS[getUniqueRandom(takenAvas, AVA_NUMBERS)] + '.png'
    },
    offer: {
      title: OFFER_TITILES[getUniqueRandom(takenTitles, OFFER_TITILES)],
      address: '' + x + ', ' + y,
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      rooms: '' + getRandomNumber(MIN_ROOM_NUM, MAX_ROOM_NUM),
      guests: '' + getRandomNumber(1, 100),
      checkin: CHECKINS[Math.floor(Math.random() * CHECKINS.length)],
      checkout: CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)],
      features: getRandomLengthArray(FEATURES),
      description: DESCRIPTION,
      photos: mixArray(PHOTOS)
    },
    location: {
      x: x,
      y: y
    }
  };
}

function renderPin(offerData) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: ' + (offerData.location.x - 0.5 * PIN_WIDTH) + 'px; top: ' + (offerData.location.y - PIN_HEIGHT) + 'px';
  pin.querySelector('img').src = offerData.author.avatar;
  pin.querySelector('img').alt = offerData.offer.title;
  return pin;
}

function renderCard(offerData) {
  var card = cardTemplate.cloneNode(true);
  var placeType = '';
  var featuresList = card.querySelector('.popup__features');
  var features = card.querySelectorAll('.popup__feature');
  card.querySelector('.popup__title').textContent = offerData.offer.title;
  card.querySelector('.popup__text--address').textContent = offerData.offer.address;
  card.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
  switch (offerData.offer.type) {
    case 'palace':
      placeType = 'Дворец';
      break;
    case 'flat':
      placeType = 'Квартира';
      break;
    case 'bungalo':
      placeType = 'Бунгало';
      break;
    case 'house':
      placeType = 'Дом';
      break;
  }
  card.querySelector('.popup__type').textContent = placeType;
  card.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;

  for (var i = 0; i < offerData.offer.features.length; i++) {
    switch (offerData.offer.features[i]) {
      case 'wifi':
        featuresList.querySelector('.popup__feature--wifi').textContent = 'wifi';
        break;
      case 'dishwasher':
        featuresList.querySelector('.popup__feature--dishwasher').textContent = 'dishwasher';
        break;
      case 'parking':
        featuresList.querySelector('.popup__feature--parking').textContent = 'parking';
        break;
      case 'washer':
        featuresList.querySelector('.popup__feature--washer').textContent = 'washer';
        break;
      case 'elevator':
        featuresList.querySelector('.popup__feature--elevator').textContent = 'elevator';
        break;
      case 'conditioner':
        featuresList.querySelector('.popup__feature--conditioner').textContent = 'conditioner';
        break;
    }
  }
  for (var n = 0; n < features.length; n++) {
    if (!features[n].textContent) {
      featuresList.removeChild(features[n]);
    }
  }


  card.querySelector('.popup__description').textContent = offerData.offer.description;

  for (var j = 0; j < offerData.offer.photos.length; j++) {
    var img = card.querySelector('.popup__photos').querySelector('img').cloneNode(true);
    img.src = offerData.offer.photos[j];
  }
  card.querySelector('.popup__photos').removeChild(card.querySelector('.popup__photos').querySelector('img'));// удаление певорго img


  card.querySelector('.popup__avatar').src = offerData.author.avatar;

  return card;
}

function createOffersList(number) {
  var offers = [];
  for (var i = 0; i < number; i++) {
    offers.push(createOfferData());
  }
  return offers;
}

function renderPins(offersData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    fragment.appendChild(renderPin(offersData[i]));
  }
  mapPins.appendChild(fragment);
}

function renderCards(offersData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    fragment.appendChild(renderCard(offersData[i]));
  }
  map.insertBefore(fragment, mapFilters);
}

var offers = createOffersList(OFFERS_NUMBER);
renderPins(offers);
renderCards(offers);
