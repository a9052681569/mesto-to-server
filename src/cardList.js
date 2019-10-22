// импортируем переменные и классы, необходимые для работы этому классу
import {Card} from './card.js';
import {Popup} from './popup.js';
// класс для хранения и отрисовки карточек
export class CardList {
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
          new Popup(document.querySelector('.popup_image')).getImage(event.target.style.backgroundImage.substr(5, event.target.style.backgroundImage.substr(4).length - 3));
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
        if(item.owner.name === document.querySelector('.user-info__name').textContent) {
          document.querySelectorAll('.place-card__delete-icon')[index].style.display = 'block';
        }
       // если на сервере карточка уже мной лайкнута, то сердечко на странице должно быть сразу закрашено
        item.likes.forEach((item) => {
          if(item.name === document.querySelector('.user-info__name').textContent) {
            document.querySelectorAll('.place-card__like-icon')[index].classList.add('place-card__like-icon_liked');
          }
        });
      });
      
    }
}