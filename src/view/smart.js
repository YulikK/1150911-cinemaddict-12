import Abstract from "./abstract";
import {replace, createElement} from "../utils/render.js";

export default class Smart extends Abstract {

  update(filmCard, updateDetails = false) {

    const prevFilmCard = this._filmCard;

    this._filmCard = filmCard;

    let selectorUpdateElement = ``;
    let restoreCallback;
    let elementTemplate;

    if (!prevFilmCard.isFavorite === this._filmCard.isFavorite) {

      selectorUpdateElement = updateDetails ? `input[id=favorite]` : `.film-card__controls-item--favorite`;
      restoreCallback = this._callback.favoriteClick;
      elementTemplate = this.getFavoriteTemplate();

    } else if (!prevFilmCard.isWatched === this._filmCard.isWatched) {

      selectorUpdateElement = updateDetails ? `input[id=watched]` : `.film-card__controls-item--mark-as-watched`;
      restoreCallback = this._callback.watchedClick;
      elementTemplate = this.getWatchedTemplate();

    } else if (!prevFilmCard.isWatchList === this._filmCard.isWatchList) {

      selectorUpdateElement = updateDetails ? `input[id=watchlist]` : `.film-card__controls-item--add-to-watchlist`;
      restoreCallback = this._callback.addWatchListClick;
      elementTemplate = this.getWatchListTemplate();

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
