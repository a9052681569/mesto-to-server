// импортируем переменные и классы, необходимые для работы этому классу
import {formAddCard, api, popupAdd} from './index.js';
import {Popup} from './popup.js';
import {CardList} from './cardList.js';
// класс попапа добавления карточки
export class PopupAdd extends Popup {
    constructor(popup, btn) {
      super(popup, btn);
      // слушатель клика по кнопке добавить карточку ("+") открывает форму добавления
      this.button.addEventListener('click', () => {
        formAddCard.elements.link.nextElementSibling.textContent = 'Это обязательное поле';
        formAddCard.elements.name.nextElementSibling.textContent = 'Это обязательное поле';
        popupAdd.toggle();
        popupAdd.handler();
      });
    // слушатель, добавляющий карточку, с введенными в поля ввода названием и картинкой
      formAddCard.addEventListener('submit', function(event) {
        // избегаем перезагрузки страници
          event.preventDefault();
          document.querySelector('.popup__button').textContent = 'Загрузка...';
        // добавляем в константы путь к данным из полей ввода
          const name = formAddCard.elements.name.value;
          const link = formAddCard.elements.link.value;
        // добавляем карточку (берем название места и ссылку на картинку из аргументов)
          api.cardToServer(name, link)
            // после загрузки на сервер добавляем карточку на страницу
            .then((res) => {
              if(res.ok) {
                document.querySelector('.places-list').innerHTML = '';
                api.getInitialCards()
                // этом этапе res - это массив карточек, отрисовываем их
                .then(res => new CardList(document.querySelector('.places-list'), res))
                .catch(err => console.log(err));
              }
            // после успешной обработки запроса закрываем и сбрасываем форму
              if(res.status === 200) {
                popupAdd.toggle();
                formAddCard.reset();
              }
            })
            // в случае ошибки закрываем и сбрасываем форму, выводим сообщение об ошибке
            .catch((err) => {
              popupAdd.toggle();
              formAddCard.reset();
              alert(`Ошибка: ${err}`);
            })
            .finally((res) => {
              document.querySelector('.popup__button').textContent = '+';
            })
      });
    // слушатель, валидирующий форму ввода карточки
      formAddCard.addEventListener('input', this.handler);
    }
  // валидатор формы ввода карточки
    handler() {
      const { name, link } = formAddCard.elements;
      
      const btnSubmit = document.querySelector('.popup__button');
      name.nextElementSibling.textContent = '';
      link.nextElementSibling.textContent = '';
      if (!name.validity.valid || !link.validity.valid) {
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
      if (name.validity.valueMissing) {
        name.nextElementSibling.textContent = 'Это обязательное поле';
      } else if (name.validity.tooShort || name.validity.tooLong) {
        name.nextElementSibling.textContent = 'Должно быть от 2 до 30 символов';
      } else {
        name.nextElementSibling.textContent = '';
      }
    }
  }