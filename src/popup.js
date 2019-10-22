
// класс для всплывающего окна
export class Popup {
    constructor(popup, btn) {
      this.popup = popup;
      this.button = btn;
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