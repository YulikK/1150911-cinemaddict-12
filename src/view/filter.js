import {ucFirst} from "../utils/common.js";
import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${name}"
      class="main-navigation__item ${type === currentFilterType ? ` main-navigation__item--active` : ``}" data-filter-type="${type}">
      ${name === `All` ? ucFirst(name) + ` movies` : ucFirst(name)}
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
      <a href="#stats" class="main-navigation__additional">Stats</a>
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

  _filterTypeClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeClickHandler);
  }

}
