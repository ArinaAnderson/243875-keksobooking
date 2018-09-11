'use strict';

var OFFERS_NUMBER = 8;
var OFFER_TITILES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
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
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var locationParams = {
  BLOCK_MAX_WIDTH: 1200,
  PIN_WIDTH: 40,
  PIN_HEIGHT: 40,
  LOCATION_Y_TOP: 130,
  LOCATION_Y_BOTTOM: 630
};
var offerTypesTranslation = {
  'flat': 'Квартира',
  'palace': 'Дворец',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapFilters = document.querySelector('.map__filters-container');

// получение случайного числа в пределах указанного диапазона
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function getImageAddress(constPart, varPart, format) {
  var constPartNumber = varPart < 10 ? '0' : '';
  return 'img' + constPart + constPartNumber + varPart + '.' + format;
}

// создание нового элемента изображения
function addNewImage(src, alt, width, height, elemClass) {
  var image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  image.width = width;
  image.height = height;
  image.classList.add(elemClass);
  return image;
}

// создание нового элемента нового пункта списка
function addListItem(elemClass, modifier) {
  var li = document.createElement('li');
  for (var i = 0; i < 2; i++) {
    li.classList.add(elemClass);
    elemClass += '--' + modifier;
  }
  return li;
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

function createOfferData(ava, num) {
  var x = getRandomNumber(locationParams.PIN_WIDTH / 2, locationParams.BLOCK_MAX_WIDTH + 1 - locationParams.PIN_WIDTH / 2);
  var y = getRandomNumber(locationParams.LOCATION_Y_BOTTOM, locationParams.LOCATION_Y_TOP + 1);
  return {
    author: {
      avatar: getImageAddress('/avatars/user', ava, 'png')
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
}

function renderPin(offerData) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: ' + (offerData.location.x - locationParams.PIN_WIDTH / 2) +
  'px; top: ' + (offerData.location.y - locationParams.PIN_HEIGHT) + 'px';
  pin.querySelector('img').src = offerData.author.avatar;
  pin.querySelector('img').alt = offerData.offer.title;
  return pin;
}

function renderCard(offerData) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = offerData.offer.title;
  card.querySelector('.popup__text--address').textContent = offerData.offer.address;
  card.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
  card.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  card.querySelector('.popup__type').textContent = offerTypesTranslation[offerData.offer.type];
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  for (var i = 0; i < offerData.offer.features.length; i++) {
    var newLi = addListItem('popup__feature', offerData.offer.features[i]);
    card.querySelector('.popup__features').appendChild(newLi);
  }
  card.querySelector('.popup__description').textContent = offerData.offer.description;
  for (var j = 0; j < offerData.offer.photos.length; j++) {
    var newImg = addNewImage(offerData.offer.photos[j], 'Фотография жилья', '45', '40', 'popup__photo');
    card.querySelector('.popup__photos').appendChild(newImg);
  }
  card.querySelector('.popup__avatar').src = offerData.author.avatar;
  return card;
}

function createOffersList(number) {
  var offers = [];
  for (var i = 0; i < number; i++) {
    offers.push(createOfferData(i + 1, i));
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
