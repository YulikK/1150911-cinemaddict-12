import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createStatisTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__additional">Stats</a>`
  );
};

export default class Statis extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createStatisTemplate();
  }

  setActiveMenuElement() {

    this.getElement().classList.add(`main-navigation__additional--active`);

  }

  removeActiveMenuElement() {

    this.getElement().classList.remove(`main-navigation__additional--active`);

  }

  setClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATISTICS);
  }

}
