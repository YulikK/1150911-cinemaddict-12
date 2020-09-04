import AbstractView from "./abstract.js";
import {humanizeFilmDuration, humanizeFilmShortDate} from "../utils/film-card.js";
import {replace, createElement} from "../utils/render.js";

const markTemplate = ` film-card__controls-item--active`;

const createWatchedTemplate = (isWatched) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--mark-as-watched${isWatched ? markTemplate : ``}">Mark as watched</button>`
  );
};

const createWatchlistTemplate = (isWatchlist) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${isWatchlist ? markTemplate : ``}">Add to watchlist</button>`
  );
};

const createFavoriteTemplate = (isFavorite) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--favorite${isFavorite ? markTemplate : ``}">Mark as favorite</button>`
  );
};

const createFilmCardTemplate = (filmCard) => {
  const {title, poster, description, comments, rating, date, duration, genres, isWatchlist, isWatched, isFavorite} = filmCard;

  const watchedTemplate = createWatchedTemplate(isWatched);
  const watchlistTemplate = createWatchlistTemplate(isWatchlist);
  const favoriteTemplate = createFavoriteTemplate(isFavorite);
  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${humanizeFilmShortDate(date)}</span>
          <span class="film-card__duration">${humanizeFilmDuration(duration)}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          ${watchlistTemplate}
          ${watchedTemplate}
          ${favoriteTemplate}
        </form>
      </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addWatchListClickHandler = this._addWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  update(filmCard) {

    const prevFilmCard = this._filmCard;

    this._filmCard = filmCard;

    if (!prevFilmCard.isFavorite === this._filmCard.isFavorite) {

      this._updateFavorite();

    } else if (!prevFilmCard.isWatched === this._filmCard.isWatched) {

      this._updateWatched();

    } else if (!prevFilmCard.isWatchlist === this._filmCard.isWatchlist) {

      this._updateWatchList();

    }

  }

  _updateFavorite() {

    const element = this.getElement();
    const selectorClass = `.film-card__controls-item--favorite`;

    const favoriteTemplate = createFavoriteTemplate(this._filmCard.isFavorite);
    const favoriteElement = createElement(favoriteTemplate);

    replace(favoriteElement, element.querySelector(selectorClass));

    element
        .querySelector(selectorClass)
        .addEventListener(`click`, this._callback.favoriteClick);

  }

  _updateWatched() {

    const element = this.getElement();
    const selectorClass = `.film-card__controls-item--mark-as-watched`;

    const watchedTemplate = createWatchedTemplate(this._filmCard.isWatched);
    const watchedElement = createElement(watchedTemplate);

    replace(watchedElement, element.querySelector(selectorClass));

    element
        .querySelector(selectorClass)
        .addEventListener(`click`, this._callback.watchedClick);

  }

  _updateWatchList() {

    const element = this.getElement();
    const selectorClass = `.film-card__controls-item--add-to-watchlist`;

    const watchListTemplate = createWatchlistTemplate(this._filmCard.isWatchlist);
    const watchListElement = createElement(watchListTemplate);

    replace(watchListElement, element.querySelector(selectorClass));

    element
        .querySelector(selectorClass)
        .addEventListener(`click`, this._callback.addWatchListClick);

  }

  _filmCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.filmCardClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _addWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addWatchListClick();
  }

  setFilmCardClickHandler(callback) {
    this._callback.filmCardClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._filmCardClickHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._filmCardClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._filmCardClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setAddWatchListClickHandler(callback) {
    this._callback.addWatchListClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._addWatchListClickHandler);
  }
}
