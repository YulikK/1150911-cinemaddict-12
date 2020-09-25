import Abstract from "./abstract";
import {replace, createElement} from "../utils/render.js";

export default class Smart extends Abstract {

  update(movie, updateDetails = false) {

    const prevMovie = this._movie;

    this._movie = movie;

    let selectorUpdateElement = ``;
    let restoreCallback;
    let elementTemplate;

    if (!prevMovie.isFavorite === this._movie.isFavorite) {

      selectorUpdateElement = updateDetails ? `input[id=favorite]` : `.film-card__controls-item--favorite`;
      restoreCallback = this._favoriteClickHandler;
      elementTemplate = this.getFavoriteTemplate();

    } else if (!prevMovie.isWatched === this._movie.isWatched) {

      selectorUpdateElement = updateDetails ? `input[id=watched]` : `.film-card__controls-item--mark-as-watched`;
      restoreCallback = this._watchedClickHandler;
      elementTemplate = this.getWatchedTemplate();

    } else if (!prevMovie.isWatchList === this._movie.isWatchList) {

      selectorUpdateElement = updateDetails ? `input[id=watchlist]` : `.film-card__controls-item--add-to-watchlist`;
      restoreCallback = this._addWatchListClickHandler;
      elementTemplate = this.getWatchListTemplate();

    } else if (JSON.stringify(prevMovie.comments) !== JSON.stringify(this._movie.comments)) {

      selectorUpdateElement = `.film-card__comments`;
      restoreCallback = this._movieClickHandler;
      elementTemplate = this.getCommentsTemplate();


    }

    if (selectorUpdateElement !== ``) {
      this.updateMovieElement(selectorUpdateElement, restoreCallback, elementTemplate);
    }
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    this.updateElement();
  }

  updateMovieElement(selectorUpdateElement, restoreCallback, elementTemplate) {

    const element = this.getElement();

    const newElement = createElement(elementTemplate);

    replace(newElement, element.querySelector(selectorUpdateElement));

    this.restoreHandlersMovieElement(element, selectorUpdateElement, restoreCallback);

  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;
  }

  restoreHandlersMovieElement(element, selectorClass, restoreCallback) {
    element
        .querySelector(selectorClass)
        .addEventListener(`click`, restoreCallback);
  }
}
