import SmartView from "./smart.js";
import {formatMovieDuration, formatMovieDate, formatMovieDescription} from "../utils/movie.js";

const markTemplate = ` film-card__controls-item--active`;

const createWatchedTemplate = (isWatched) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--mark-as-watched${isWatched ? markTemplate : ``}">Mark as watched</button>`
  );
};

const createWatchListTemplate = (isWatchList) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${isWatchList ? markTemplate : ``}">Add to watchlist</button>`
  );
};

const createFavoriteTemplate = (isFavorite) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--favorite${isFavorite ? markTemplate : ``}">Mark as favorite</button>`
  );
};

const createCommentsTemplate = (comments) => {
  return (
    `<a class="film-card__comments">${comments.length} comments</a>`
  );
};

const createMovieTemplate = (movie) => {
  const {title, poster, description, comments, rating, date, duration, genres, isWatchList, isWatched, isFavorite} = movie;
  const watchedTemplate = createWatchedTemplate(isWatched);
  const watchListTemplate = createWatchListTemplate(isWatchList);
  const favoriteTemplate = createFavoriteTemplate(isFavorite);
  const commentsTemplate = createCommentsTemplate(comments);
  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${formatMovieDate(date, `YYYY`)}</span>
          <span class="film-card__duration">${formatMovieDuration(duration)}</span>
          <span class="film-card__genre">${genres.length > 0 ? genres[0] : ``}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${formatMovieDescription(description)}</p>
        ${commentsTemplate}
        <form class="film-card__controls">
          ${watchListTemplate}
          ${watchedTemplate}
          ${favoriteTemplate}
        </form>
      </article>`
  );
};

export default class Movie extends SmartView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._movieClickHandler = this._movieClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addWatchListClickHandler = this._addWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createMovieTemplate(this._movie);
  }

  getFavoriteTemplate() {
    return createFavoriteTemplate(this._movie.isFavorite);
  }

  getWatchedTemplate() {
    return createWatchedTemplate(this._movie.isWatched);
  }

  getWatchListTemplate() {
    return createWatchListTemplate(this._movie.isWatchList);
  }

  getCommentsTemplate() {
    return createCommentsTemplate(this._movie.comments);
  }

  setState(isDisabled = false) {
    if (isDisabled) {
      this.getElement().setAttribute(`disabled`, `disabled`);
    } else {
      this.getElement().removeAttribute(`disabled`);
    }
  }

  _movieClickHandler(evt) {
    evt.preventDefault();
    this._callback.movieClick();
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

  setMovieClickHandler(callback) {
    this._callback.movieClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._movieClickHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._movieClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._movieClickHandler);
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
