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
  MAIN_PIN_HEIGHT: 44,
  MAIN_PIN_WIDTH: 40,
  LOCATION_Y_TOP: 130,
  LOCATION_Y_BOTTOM: 630,
  MAIN_PIN_X: 570,
  MAIN_PIN_Y: 375
};
var ESC_KEYCODE = 27;
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
var fieldsets = document.querySelectorAll('fieldset');
var selectItems = document.querySelectorAll('select');
var mainPin = document.querySelector('.map__pin--main');
var offerForm = document.querySelector('.ad-form');
var addressInput = offerForm.querySelector('input[name="address"]');
var mainPinClickCount;
var offers;
var pinToDeactivate;
var cardToAdd;

// получение случайного числа в пределах указанного диапазона
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function getImageAddress(varPart) {
  var constPartNumber = varPart < 10 ? '0' : '';
  return 'img/avatars/user' + constPartNumber + varPart + '.png';
}

// создание нового элемента изображения
function addNewImage(src) {
  var image = document.createElement('img');
  image.src = src;
  image.alt = 'Фотография жилья';
  image.width = '45';
  image.height = '40';
  image.classList.add('popup__photo');
  return image;
}

// создание нового элемента нового пункта списка
function addListItem(elemClass, modifier) {
  var li = document.createElement('li');
  li.classList.add(elemClass);
  elemClass += '--' + modifier;
  li.classList.add(elemClass);
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

function createOfferData(num) {
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
}

function renderPin(offerData) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: ' + (offerData.location.x - locationParams.PIN_WIDTH / 2) +
  'px; top: ' + (offerData.location.y - locationParams.PIN_HEIGHT) + 'px';
  pin.querySelector('img').src = offerData.author.avatar;
  pin.querySelector('img').alt = offerData.offer.title;
  pin.addEventListener('click', function (evt) {
    deactivatePin();
    removeCard();
    pinToDeactivate = evt.currentTarget;
    addCard(offerData);
    activatePin(pin);
  });
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
    var newImg = addNewImage(offerData.offer.photos[j]);
    card.querySelector('.popup__photos').appendChild(newImg);
  }
  card.querySelector('.popup__avatar').src = offerData.author.avatar;
  return card;
}

function createOffersList(number) {
  var offersArray = [];
  for (var i = 0; i < number; i++) {
    offersArray.push(createOfferData(i));
  }
  return offersArray;
}

function renderPins(offersData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    fragment.appendChild(renderPin(offersData[i]));
  }
  mapPins.appendChild(fragment);
}

/* function renderCards(offersData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    fragment.appendChild(renderCard(offersData[i])); // offerData
  }
  map.insertBefore(fragment, mapFilters);
}*/

function activatePin(pin) {
  pin.classList.add('map__pin--active');
}

function deactivatePin() {
  if (pinToDeactivate) {
    pinToDeactivate.classList.remove('map__pin--active');
    pinToDeactivate.focus();
  }
}

function addCard(offerData) {
  var fragment = document.createDocumentFragment();
  cardToAdd = fragment.appendChild(renderCard(offerData));
  map.insertBefore(fragment, mapFilters);

  var btn = cardToAdd.querySelector('.popup__close');
  btn.focus();
  btn.addEventListener('click', clickCardBtnHandler);

  document.addEventListener('keydown', cardEscPressHandler);
}

function cardEscPressHandler(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeCard();
    deactivatePin();
  }
}

function removeCard() {
  if (cardToAdd) {
    cardToAdd.parentElement.removeChild(cardToAdd);
  }
  cardToAdd = null;
}

function clickCardBtnHandler() {
  removeCard();
  deactivatePin();
}

function manageFormElems(elementList, disable) {
  for (var i = 0; i < elementList.length; i++) {
    elementList[i].disabled = disable;
  }
}

function activateForms() {
  manageFormElems(fieldsets, false);
  manageFormElems(selectItems, false);
  map.classList.remove('map--faded');
  offerForm.classList.remove('ad-form--disabled');
}

function deactivateForms() {
  manageFormElems(fieldsets, true);
  manageFormElems(selectItems, true);
  map.classList.add('map--faded');
  offerForm.classList.add('ad-form--disabled');
}

function fillAddressInput(x, y, correctionX, correctionY) {
  addressInput.value = (x + correctionX) + ', ' + (y + correctionY);
}

function setupMainPin(x, y) {
  mainPin.style.left = x;
  mainPin.style.top = y;
}

function deletePins() {
  var nextBtn = mainPin.nextElementSibling;
  while (nextBtn) {
    nextBtn.parentElement.removeChild(nextBtn);
    nextBtn = mainPin.nextElementSibling;
  }
}

function restartPage() {
  mainPinClickCount = 0;
  offers = createOffersList(OFFERS_NUMBER);
  deactivateForms();
  setupMainPin(locationParams.MAIN_PIN_X, locationParams.MAIN_PIN_Y);
  fillAddressInput(parseInt(mainPin.style.left, 10), parseInt(mainPin.style.top, 10),
      locationParams.MAIN_PIN_WIDTH / 2, locationParams.MAIN_PIN_HEIGHT / 2);
  deletePins();
  removeCard();
}

restartPage();

mainPin.addEventListener('mouseup', function (evt) {
  if (mainPinClickCount === 0) {
    activateForms();
    renderPins(offers);
    fillAddressInput(evt.pageX, evt.pageY, locationParams.MAIN_PIN_WIDTH / 2,
        locationParams.MAIN_PIN_HEIGHT);
  }
  mainPinClickCount++;
});
