'use strict';
(function () {
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  var successMessage;
  var errorMessage;
  var main = document.querySelector('main');

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

  window.notifications = {
    notifyOfSuccess: function () {
      successMessage = successMessageTemplate.cloneNode(true);
      main.appendChild(successMessage);
      document.addEventListener('keydown', successPopupEscPressHandler);
      document.addEventListener('click', successPopupClickHandler);
    },
    notifyOfError: function (errorText) {
      errorMessage = errorMessageTemplate.cloneNode(true);
      var errorExplanation = errorMessage.querySelector('.error__message');
      errorExplanation.textContent = errorText;
      main.appendChild(errorMessage);
      document.addEventListener('keydown', errorPopupEscPressHandler);
      document.addEventListener('click', errorPopupClickHandler);
    }
  };
})();
