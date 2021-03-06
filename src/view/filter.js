import {setFirstCapital} from "../utils/common.js";
import {MenuItem} from "../const.js";
import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${name}"
      class="main-navigation__item ${type === currentFilterType ? ` main-navigation__item--active` : ``}" data-filter-type="${type}">
      ${name === `All` ? setFirstCapital(name) + ` movies` : setFirstCapital(name)}
      ${name === `All` ? `` : ` <span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
    </nav>`
  );
};

export default class Navigation extends AbstractView {
  constructor(filterItems, currentFilterType) {
    super();

    this._filterItems = filterItems;
    this._currentFilter = currentFilterType;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._filterItems, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._filterTypeClickHandler);
  }

  setFilterClikHandler(callback) {
    this._callback.menuItemClick = callback;
  }

  _filterTypeClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
    if (this._currentFilter === null) {
      this._callback.menuItemClick(MenuItem.MOVIES);
    }


  }
}
