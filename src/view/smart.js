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
      restoreCallback = this._callback.favoriteClick;
      elementTemplate = this.getFavoriteTemplate();

    } else if (!prevMovie.isWatched === this._movie.isWatched) {

      selectorUpdateElement = updateDetails ? `input[id=watched]` : `.film-card__controls-item--mark-as-watched`;
      restoreCallback = this._callback.watchedClick;
      elementTemplate = this.getWatchedTemplate();

    } else if (!prevMovie.isWatchList === this._movie.isWatchList) {

      selectorUpdateElement = updateDetails ? `input[id=watchlist]` : `.film-card__controls-item--add-to-watchlist`;
      restoreCallback = this._callback.addWatchListClick;
      elementTemplate = this.getWatchListTemplate();

    } else if (prevMovie.comments !== this._movie.comments) {

      selectorUpdateElement = `.film-card__comments`;
      restoreCallback = this._callback.movieClick;
      elementTemplate = this.getCommentsTemplate();


    }

    this.updateElement(selectorUpdateElement, restoreCallback, elementTemplate);
  }

  updateElement(selectorUpdateElement, restoreCallback, elementTemplate) {

    const element = this.getElement();

    const newElement = createElement(elementTemplate);

    replace(newElement, element.querySelector(selectorUpdateElement));

    this.restoreHandlers(element, selectorUpdateElement, restoreCallback);

  }

  restoreHandlers(element, selectorClass, restoreCallback) {
    element
        .querySelector(selectorClass)
        .addEventListener(`click`, restoreCallback);
  }
}
