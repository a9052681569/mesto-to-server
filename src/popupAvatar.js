// импортируем переменные и классы, необходимые для работы этому классу
import {formAvatar, api} from './index.js';
import {Popup} from './popup.js';

// класс, отвечающий за смену аватара 
export class PopupAvatar extends Popup {
    constructor(popup, btn) {
      super(popup, btn);
  
      this.button.addEventListener('click', () => {
        formAvatar.elements.link.nextElementSibling.textContent = 'Это обязательное поле';
        this.toggle();
        this.handler();
      })
  
      formAvatar.addEventListener('input', this.handler);
      formAvatar.addEventListener('submit', api.editAvatar)
    }
  
    handler() {
      const { link } = formAvatar.elements;
      
      const btnSubmit = document.querySelector('.popup__button_avatar');
      link.nextElementSibling.textContent = '';
      if (!link.validity.valid) {
        btnSubmit.setAttribute('disabled', true);
        btnSubmit.setAttribute('style', 'background-color: transparent');
        btnSubmit.style.color = 'rgba(0, 0, 0, .2)';
      } else {
        btnSubmit.removeAttribute('disabled');
        btnSubmit.setAttribute('style', 'background-color: black');
        btnSubmit.style.color = 'white';
      }
      if (link.validity.valueMissing) {
        link.nextElementSibling.textContent = 'Это обязательное поле';
      } else if (link.validity.typeMismatch) {
        link.nextElementSibling.textContent = 'Здесь должна быть ссылка';
      } else {
        link.nextElementSibling.textContent = '';
      }
      
    }
  }