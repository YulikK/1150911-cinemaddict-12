
import {createElement} from "../utils.js";

const createStatisticsTemplate = (allMovies) => {
  return (
    `<p>${allMovies} movies inside</p>`
  );
};

export default class Statistic {
  constructor(allMovies) {
    this._allMovies = allMovies;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._allMovies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

