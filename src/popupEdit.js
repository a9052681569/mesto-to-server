// импортируем переменные и классы, необходимые для работы этому классу
import {api} from './api';
import {Popup} from './popup';


// класс попапа редактирования профиля
class PopupEdit extends Popup {
    constructor(popup, btn) {
      super(popup, btn);
      this.api = api;
      this.editor = this.editor.bind(this);
      // слушатель клика по кнопке Edit открывает форму ввода данных пользователя
      this.button.addEventListener('click', function() {
        popupEdit.toggle();
        // очищаем поля ошибок при открытии формы
        formEditUser.elements.name.nextElementSibling.textContent = '';
        formEditUser.elements.about.nextElementSibling.textContent = '';
        // в открывшейся форме поле ввода "имя" занято введенным именем пользователя
        formEditUser.elements.name.value = document.querySelector('.user-info__name').textContent;
        // а поле "о себе" - введенной информацией о себе
        formEditUser.elements.about.value = document.querySelector('.user-info__job').textContent;
      });
    // запрашиваем имя пользователя и информацию о себе с сервера
      this.api.sayMyName()
        // в этом then result - объект с данными пользователя
        .then((result) => {
          // вставляем данные в нужные поля
            document.querySelector('.user-info__name').textContent = result.name;
            document.querySelector('.user-info__job').textContent = result.about;
            document.querySelector('.user-info__photo').style.backgroundImage = `url(${result.avatar})`;
        })
        .catch(err => console.log(err));
    // слушатель, меняющий имя и информацию о себе на введенные пользователем
      formEditUser.addEventListener('submit', this.editor);
    // слушатель валидирующий форму ввода данных пользователя
      formEditUser.addEventListener('input', this.handler);
      
    }
  // валидатор формы данных пользователя
    handler() {
      const { name, about } = formEditUser.elements;
      const btnSubmit = document.querySelector('div.popup__edit .popup__button');
      const formError = event.target.nextElementSibling;
      if (!name.validity.valid || !about.validity.valid) {
        btnSubmit.setAttribute('disabled', true);
        btnSubmit.setAttribute('style', 'background-color: transparent');
        btnSubmit.style.color = 'rgba(0, 0, 0, .2)';
      } else {
        btnSubmit.removeAttribute('disabled');
        btnSubmit.setAttribute('style', 'background-color: black');
        btnSubmit.style.color = 'white';
      }
      if (event.target.validity.valueMissing) {
        formError.textContent = 'Это обязательное поле';
      } else if (event.target.validity.tooShort || event.target.validity.tooLong) {
        formError.textContent = 'Должно быть от 2 до 30 символов';
      } else {
        formError.textContent = '';
      }
    }
  // метод, меняющий имя и информацию о себе на введенные пользователем
    editor(event) {
      // избегаем перезагрузки страници
      event.preventDefault();
      // добавляем в константы путь к полям ввода
      const { name, about } = formEditUser.elements;
      // пока идет обновление данных кнопка "Сохранить" меняет свой текст на "Загрузка..."
      document.querySelector('.popup__button_edit').textContent = 'Загрузка...';     
      // заменяем имя и информацию на введенные пользователем
      this.api.userEdit(name, about)
        // если прошел запрос на сервер - заменяем имя и информацию (на странице) на введенные пользователем
        .then((res) => {
          if(res.ok) {
              document.querySelector('.user-info__name').textContent = name.value;
              document.querySelector('.user-info__job').textContent = about.value;
          }
          // автоматически закрываем форму после загрузки
          if(res.status === 200) {
            this.toggle();
          }
        })
        // в случае ошибки закрываем форму и выводим сообщение об ошибке
        .catch((err) => {
          this.toggle();
          console.log(`Ошибка: ${err}`);
        })
        // в любом случае после окончания обработки запроса возвращаем кнопке "Сохранить" изначальный вид
        .finally((res) => {
          document.querySelector('.popup__button_edit').textContent = 'Сохранить';
        })
    }
}

const { edit: formEditUser} = document.forms;
export const popupEdit = new PopupEdit(document.querySelector('.popup__edit'), document.querySelector('.user-info__button_edit'));