
// импорты

import {CardList} from './cardList';
import {popupAdd} from './popupAdd';
import {popupEdit} from './popupEdit';
import {api} from './api';
import "./style.css";







// объявление переменных
let placesList = api.getInitialCards()
 // этом этапе res - это массив карточек, отрисовываем их
  .then(res => new CardList(document.querySelector('.places-list'), res))
  .catch(err => console.log(err));