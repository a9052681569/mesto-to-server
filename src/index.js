
// импорты

import {CardList} from './cardList.js';
import {PopupAdd} from './popupAdd.js';
import {PopupEdit} from './popupEdit.js';
import {PopupAvatar} from './popupAvatar.js';
import "./style.css";




// класс отвечающий за запросы к серверу
class Api {
  constructor(options) {
    this.options = options;
    this.deleteCard = this.deleteCard.bind(this);
    this.like = this.like.bind(this);
    this.editAvatar = this.editAvatar.bind(this);
  }
  // метод добавляющий карточки с сервера
  getInitialCards() {
    return fetch(`${this.options.baseUrl}/cards`, {
      headers: this.options.headers
      })
    // если запрос успешный преобразовываем в json
      .then((res) => {
        if(res.ok) {
          return res.json();
        }
        // если не успешный скидываем в ошибку
        return Promise.reject(res.status);
      })
  }
  // метод заменяет имя и информацию на введенные пользователем
  userEdit(name, about) {
    // запрос на изменение данных
    return fetch(`${this.options.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.options.headers,
      body: JSON.stringify({
        // изменяем данные на сервере
        name: name.value,
        about: about.value
      })  
    })
  }
  // метод запрашивает имя пользователя и информацию о себе с сервера
  sayMyName() {
    return fetch(`${this.options.baseUrl}/users/me`, {
      headers: this.options.headers
    })
      .then((res) => {
        if(res.ok){
          return res.json();
        }
        return Promise.reject();
      })
  }
  // метод загружает карточку на сервер
  cardToServer(name, link) {
    return fetch(`${this.options.baseUrl}/cards`, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
  }
  
  // метод удаляет карточку
  deleteCard(event) {
    // подтвержаем действие
    if(confirm('Вы действительно хотите удалить эту карточку?')) {
      fetch(`${this.options.baseUrl}/cards/${event.target.closest('.place-card').id}`, {
        method: 'DELETE',
        headers: {
            authorization: 'a1bdf41b-4236-4cf5-a3db-bc1de4f3cc4b',
            'Content-Type': 'application/json'
        }
      })
      // если запрос на удаление с сервера прошел успешно - удаляем карточку из разметки
      .then((res) => {
        if(res.ok) {
          event.target.closest('.place-card').querySelector('.place-card__like-icon').removeEventListener('click', api.like);
          event.target.removeEventListener('click', api.deleteCard);
          event.target.closest('.place-card').remove();
        }
      })
      .catch(err => console.log(err));
    }
  }
  // метод, ставящий лайк
  like(event) {
    if(!event.target.classList.contains('place-card__like-icon_liked')) {
      fetch(`${this.options.baseUrl}/cards/like/${event.target.closest('.place-card').id}`, {
        method: 'PUT',
        headers: {
            authorization: 'a1bdf41b-4236-4cf5-a3db-bc1de4f3cc4b',
            'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        if(res.ok) {
          event.target.classList.add('place-card__like-icon_liked');
          return res.json();
        }
      })
      .then((res) => {
        event.target.nextElementSibling.textContent = res.likes.length;
      })
      .catch(err => console.log(err));
    } else {
      fetch(`${this.options.baseUrl}/cards/like/${event.target.closest('.place-card').id}`, {
        method: 'DELETE',
        headers: {
            authorization: 'a1bdf41b-4236-4cf5-a3db-bc1de4f3cc4b',
            'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        if(res.ok) {
          event.target.classList.remove('place-card__like-icon_liked');
          return res.json();
        }
      })
      .then((res) => {
        event.target.nextElementSibling.textContent = res.likes.length;
      })
      .catch(err => console.log(err));
    }
  }
  // меняем аватар
  editAvatar(event) {
    // избегаю перезагрузки
    event.preventDefault();
    // пока идет загрузка на сервер кнопка меняет текст
    document.querySelector('.popup__button_avatar').textContent = 'Загрузка...';
    //загружаем новый аватар на сервер
    fetch(`${this.options.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
          authorization: 'a1bdf41b-4236-4cf5-a3db-bc1de4f3cc4b',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // значение берет из поля ввода
        avatar: formAvatar.elements.link.value
      })
    })
    // если с запросом все хорошо - делаю json объект, если нет, отклоняю промис
    .then((res) => {
      if(res.ok) {
        return res.json();
      }
      return Promise.reject();
    })
    .then((res) => {
      // поменяв данные на сервере пришло время поменять их на странице
      document.querySelector('.user-info__photo').style.backgroundImage = `url(${res.avatar})`;
      //ну и после закрыть и перезагрузить форму
      popupAvatar.toggle();
      formAvatar.reset();
    })
    .catch(err => console.log(err))
    .finally((res) => {
      // наконец вернем кнопке "сохранить" ее первозданный вид
      document.querySelector('.popup__button_avatar').textContent = 'Сохранить';
    });
  }
}


// объявление переменных

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort3' : 'https://praktikum.tk/cohort3';
export const api = new Api({
  baseUrl: serverUrl,
  headers: {
    authorization: 'a1bdf41b-4236-4cf5-a3db-bc1de4f3cc4b',
    'Content-Type': 'application/json'
  }
});
export const { new: formAddCard, edit: formEditUser, avatar: formAvatar } = document.forms;
let placesList = api.getInitialCards()
 // этом этапе res - это массив карточек, отрисовываем их
  .then(res => new CardList(document.querySelector('.places-list'), res))
  .catch(err => console.log(err));
export const popupEdit = new PopupEdit(document.querySelector('.popup__edit'), document.querySelector('.user-info__button_edit'));
export const popupAdd = new PopupAdd(document.querySelector('.popup__add'), document.querySelector('.user-info__button_add'));
export const popupAvatar = new PopupAvatar(document.querySelector('.popup__avatar'), document.querySelector('.user-info__photo'));








