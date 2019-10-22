// импортируем переменную необходимую для работыэтому классу
import {api} from './index.js';
// класс, создающий карточку
export class Card {
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
