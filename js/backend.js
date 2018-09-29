'use strict';
(function () {
  var SUCCESS_RESP_STATUS = 200;
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  var successMessage;
  var errorMessage;
  var main = document.querySelector('main');

  var createXhrRequest = function (onLoad, onError, badStatusText) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_RESP_STATUS) {
        onLoad(xhr.response);
      } else {
        onError(badStatusText + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    return xhr;
  };

  function errorPopupEscPressHandler(evt) {
    window.utils.isEscPress(evt, function () {
      errorMessage.classList.add('hidden');
      document.removeEventListener('keydown', errorPopupEscPressHandler);
    });
  }
  function errorPopupClickHandler() {
    errorMessage.classList.add('hidden');
    document.removeEventListener('click', errorPopupClickHandler);
  }

  function successPopupEscPressHandler(evt) {
    window.utils.isEscPress(evt, function () {
      successMessage.classList.add('hidden');
      document.removeEventListener('keydown', successPopupEscPressHandler);
    });
  }
  function successPopupClickHandler() {
    successMessage.classList.add('hidden');
    document.removeEventListener('click', successPopupClickHandler);
  }

  window.backend = {
    save: function (onLoad, onError, data) {
      var badStatusText = 'Ошибка загрузки объявления: ';
      var xhr = createXhrRequest(onLoad, onError, badStatusText);
      xhr.open('POST', URL_POST);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var badStatusText = 'Статус загрузки похожих объявлений: ';
      var xhr = createXhrRequest(onLoad, onError, badStatusText);
      xhr.open('GET', URL_GET);
      xhr.send();
    },
    notifyOfSuccess: function () {
      successMessage = successMessageTemplate.cloneNode(true);
      main.appendChild(successMessage);
      document.addEventListener('keydown', successPopupEscPressHandler);
      document.addEventListener('click', successPopupClickHandler);
    },
    errorHandler: function (errorText) {
      errorMessage = errorMessageTemplate.cloneNode(true);
      var errorExplanation = errorMessage.querySelector('.error__message');
      errorExplanation.textContent = errorText;
      main.appendChild(errorMessage);
      document.addEventListener('keydown', errorPopupEscPressHandler);
      document.addEventListener('click', errorPopupClickHandler);
    }
  };
})();
