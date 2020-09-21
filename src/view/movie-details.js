import {formatMovieDuration, formatMovieDate} from "../utils/movie.js";
import SmartView from "./smart.js";

const createGenreTemplate = (genres) => {

  return (
    `<span class="film-details__genre">${genres}</span>`
  );

};

const createWatchedTemplate = (isWatched) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>`
  );
};

const createWatchListTemplate = (isWatchList) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList ? `checked` : ``}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>`
  );
};

const createFavoriteTemplate = (isFavorite) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`
  );
};

const createMovieDetailsTemplate = (movie) => {
  const {title, original, poster, age, description, rating, date, duration, genres, director, writers, actors, country, isWatchList, isWatched, isFavorite} = movie;
  const genresTemplate = genres
    .map((genre) => createGenreTemplate(genre))
    .join(``);

  const watchedTemplate = createWatchedTemplate(isWatched);
  const watchListTemplate = createWatchListTemplate(isWatchList);
  const favoriteTemplate = createFavoriteTemplate(isFavorite);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${original}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tbody><tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatMovieDate(date, `D MMMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatMovieDuration(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genres.lenght === 1 ? `Genre` : `Genres`}</td>
                  <td class="film-details__cell">
                    ${genresTemplate}
                  </td>
                </tr>
              </tbody></table>

              <p class="film-details__film-description">
              ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${watchListTemplate}

            ${watchedTemplate}

            ${favoriteTemplate}
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MovieDetails extends SmartView {
  constructor(movie) {
    super();
    this._movie = movie;

    this.setState();

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addWatchListClickHandler = this._addWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  setState(isDisabled = false) {
    if (isDisabled) {
      this.getElement().querySelector(`.film-details__inner`).setAttribute(`disabled`, `disabled`);
    } else {
      this.getElement().querySelector(`.film-details__inner`).removeAttribute(`disabled`);
    }
  }

  getTemplate() {
    return createMovieDetailsTemplate(this._movie);
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

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick(this._movie);
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

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`input[id=favorite]`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`input[id=watched]`).addEventListener(`click`, this._watchedClickHandler);
  }

  setAddWatchListClickHandler(callback) {
    this._callback.addWatchListClick = callback;
    this.getElement().querySelector(`input[id=watchlist]`).addEventListener(`click`, this._addWatchListClickHandler);
  }

}

