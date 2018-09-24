'use strict';
(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapFilters = document.querySelector('.map__filters-container');
  var map = document.querySelector('.map');
  var activeCard;
  var offerTypesTranslation = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

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

  function cardEscPressHandler(evt) {
    window.utils.isEscPress(evt, function () {
      window.card.remove();
      window.pin.deactivate();
    });
  }
  function clickCardBtnHandler() {
    window.card.remove();
    window.pin.deactivate();
  }

  window.card = {
    add: function (offerData) {
      var fragment = document.createDocumentFragment();
      activeCard = fragment.appendChild(renderCard(offerData));
      map.insertBefore(fragment, mapFilters);

      var btn = activeCard.querySelector('.popup__close');
      btn.focus();
      btn.addEventListener('click', function () {
        clickCardBtnHandler();
      });

      document.addEventListener('keydown', function (evt) {
        cardEscPressHandler(evt);
      });
    },
    remove: function () {
      if (activeCard) {
        activeCard.parentElement.removeChild(activeCard);
      }
      activeCard = null;
      document.removeEventListener('keydown', cardEscPressHandler);
    }
  };
})();
