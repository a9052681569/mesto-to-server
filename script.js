// ОБЪЯВЛЕНИЕ КЛАССОВ


// класс, создающий карточку
class Card {
  constructor(name, link, id) {
    this.name = name; 
    this.link = link;
    this.id = id;
  // добавляем карточку в свойство объекта
    this.cardElement = this.create();
  // добавляем карточке слушатель лайка
    this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', api.like);
  // добавляем карточке слушатель удаления
    this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', api.deleteCard)
  }
// верстаем карточку
  create() {
    const placeCard = document.createElement('div');
    placeCard.classList.add('place-card');
    placeCard.insertAdjacentHTML('afterbegin', `<div class="place-card__image">
    <button class="place-card__delete-icon"></button>
  </div>
  <div class="place-card__description">
    <h3 class="place-card__name"></h3>
    <div class="place-card__like-container">
      <button class="place-card__like-icon"></button>
      <div class="place-card__like-amount"></div>
    </div>
  </div>`);
    placeCard.querySelector(".place-card__name").textContent = this.name;
    placeCard.querySelector(".place-card__image").style.backgroundImage = `url(${this.link})`;
    placeCard.setAttribute('id', this.id);
  // если ссылка не на картинку вставляем картинку по умолчанию
    if(!placeCard.querySelector(".place-card__image").style.backgroundImage.endsWith('jpg")' || 'jpeg")')) {
      placeCard.querySelector(".place-card__image").style.backgroundImage = `url(https://pp.userapi.com/c858336/v858336812/17a16/kX2anhtj5Fs.jpg?ava=1)`;
    }
    return placeCard;
  }
}

// класс для хранения и отрисовки карточек
class CardList {
  constructor(container, cards) {
  // добавляем контейнер в свойство объекта
    this.container = container;
  // добавляем массив карточек в свойство объекта
    this.cards = cards;
    // отрисовываем "базовые" карточки
    this.render();
  // слушатель клика на картинке открывает ее в попапе
    this.container.addEventListener('click', function(event) {
      if (event.target.classList.contains('place-card__image')) {
        /* агрумент функции берет ссылку на картинку из свойства bgimage карточки на которую мы нажимаем и
        подставляет ее в свойство src тега img*/
        popupImg.getImage(event.target.style.backgroundImage.substr(5, event.target.style.backgroundImage.substr(4).length - 3));
      }
    });
  }
  // метод добавления карточек на страницу
  addCard(name, link, id) {
    const { cardElement } = new Card(name, link, id);
    this.container.appendChild(cardElement);
  }
  // метод, отрисовывающий карточки
  render() {
    this.cards.forEach((item, index) => {
      this.addCard(item.name, item.link, item._id)
      // когда карточки готовы - отрисовываем лайки и иконки удалить
      document.querySelectorAll(`.place-card__like-amount`)[index].textContent = item.likes.length;
      if(item.owner.name === userName.textContent) {
        document.querySelectorAll('.place-card__delete-icon')[index].style.display = 'block';
      }
     // если на сервере карточка уже мной лайкнута, то сердечко на странице должно быть сразу закрашено
      item.likes.forEach((item) => {
        if(item.name === userName.textContent) {
          document.querySelectorAll('.place-card__like-icon')[index].classList.add('place-card__like-icon_liked');
        }
      });
    });
    
  }
}

// класс для всплывающего окна
class Popup {
  constructor(popup) {
    this.popup = popup;
    this.popup.querySelector('.popup__close').addEventListener('click', this.close);
  }
// метод, закрывающий попап по кнопке крестик
  close(event) {
    event.target.closest('.popup').classList.remove('popup_is-opened');
  }
// метод, открывающий\закрывающий попапы
  toggle() {
    this.popup.classList.toggle('popup_is-opened')
  }
// вызывает попап с картинкой
  getImage(link) {
    // ставим фоном картинку
    this.popup.querySelector('.popup__img').src = link;
    // делаем видимым 
    this.toggle();
  }
}
// класс попапа добавления карточки
class PopupAdd extends Popup {
  constructor(popup) {
    super(popup);
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

// класс попапа редактирования профиля
class PopupEdit extends Popup {
  constructor(popup) {
    super(popup);
  // запрашиваем имя пользователя и информацию о себе с сервера
    api.sayMyName()
      // в этом then result - объект с данными пользователя
      .then((result) => {
        // вставляем данные в нужные поля
          userName.textContent = result.name;
          userAbout.textContent = result.about;
          document.querySelector('.user-info__photo').style.backgroundImage = `url(${result.avatar})`;
      })
      .catch(err => console.log(err));
  // слушатель, меняющий имя и информацию о себе на введенные пользователем
    this.editor();
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
  editor() {
    formEditUser.addEventListener('submit', function(event) {
      // избегаем перезагрузки страници
      event.preventDefault();
      // добавляем в константы путь к полям ввода
      const { name, about } = formEditUser.elements;
      // пока идет обновление данных кнопка "Сохранить" меняет свой текст на "Загрузка..."
      document.querySelector('.popup__button_edit').textContent = 'Загрузка...';     
      // заменяем имя и информацию на введенные пользователем
      api.userEdit(name, about)
        // если прошел запрос на сервер - заменяем имя и информацию (на странице) на введенные пользователем
        .then((res) => {
          if(res.ok) {
            userName.textContent = name.value;
            userAbout.textContent = about.value;
          }
          // автоматически закрываем форму после загрузки
          if(res.status === 200) {
            popupEdit.toggle();
          }
        })
        // в случае ошибки закрываем форму и выводим сообщение об ошибке
        .catch((err) => {
          popupEdit.toggle();
          alert(`Ошибка: ${err}`);
        })
        // в любом случае после окончания обработки запроса возвращаем кнопке "Сохранить" изначальный вид
        .finally((res) => {
          document.querySelector('.popup__button_edit').textContent = 'Сохранить';
        })
    });
  }
}

class PopupAvatar extends Popup {
  constructor(popup, btn) {
    super(popup);

    this.button = btn;

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
// 
class Api {
  constructor(options) {
    this.options = options;
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
      fetch(`http://95.216.175.5/cohort3/cards/${event.target.closest('.place-card').id}`, {
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
      fetch(`http://95.216.175.5/cohort3/cards/like/${event.target.closest('.place-card').id}`, {
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
      fetch(`http://95.216.175.5/cohort3/cards/like/${event.target.closest('.place-card').id}`, {
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
    fetch('http://95.216.175.5/cohort3/users/me/avatar', {
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


const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort3',
  headers: {
    authorization: 'a1bdf41b-4236-4cf5-a3db-bc1de4f3cc4b',
    'Content-Type': 'application/json'
  }
});
const userName = document.querySelector('.user-info__name');
const userAbout = document.querySelector('.user-info__job');
const { new: formAddCard, edit: formEditUser, avatar: formAvatar } = document.forms;
let placesList = api.getInitialCards()
 // этом этапе res - это массив карточек, отрисовываем их
  .then(res => new CardList(document.querySelector('.places-list'), res))
  .catch(err => console.log(err));
const popupEdit = new PopupEdit(document.querySelector('.popup__edit'));
const popupImg = new Popup(document.querySelector('.popup_image'));
const popupAdd = new PopupAdd(document.querySelector('.popup__add'));
const popupAvatar = new PopupAvatar(document.querySelector('.popup__avatar'), document.querySelector('.user-info__photo'));

// слушатели событий

// слушатель клика по кнопке добавить карточку ("+") открывает форму добавления
document.querySelector('.user-info__button_add').addEventListener('click', () => {
  formAddCard.elements.link.nextElementSibling.textContent = 'Это обязательное поле';
  formAddCard.elements.name.nextElementSibling.textContent = 'Это обязательное поле';
  popupAdd.toggle();
  popupAdd.handler();
});


// слушатель клика по кнопке Edit открывает форму ввода данных пользователя
document.querySelector('.user-info__button_edit').addEventListener('click', function() {
  popupEdit.toggle();
  // очищаем поля ошибок при открытии формы
  formEditUser.elements.name.nextElementSibling.textContent = '';
  formEditUser.elements.about.nextElementSibling.textContent = '';
  // в открывшейся форме поле ввода "имя" занято введенным именем пользователя
  formEditUser.elements.name.value = userName.textContent;
  // а поле "о себе" - введенной информацией о себе
  formEditUser.elements.about.value = userAbout.textContent;
});