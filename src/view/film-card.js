import AbstractView from "./abstract.js";
import {humanizeFilmDuration, humanizeFilmShortDate} from "../utils/film-card.js";

const createFilmCardTemplate = (filmCard) => {
  const {title, poster, description, comments, rating, date, duration, genres, isWatchlist, isWatched, isFavorite} = filmCard;
  const markTemplate = ` film-card__controls-item--active`;

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
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${isWatchlist ? markTemplate : ``}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${isWatched ? markTemplate : ``}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite${isFavorite ? markTemplate : ``}">Mark as favorite</button>
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
