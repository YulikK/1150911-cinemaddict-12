import {humanizeFilmDuration, humanizeFilmDate} from "../utils/film-card.js";
import {EMOTIONS} from "../const.js";
import {replace, createElement} from "../utils/render.js";
import AbstractView from "./abstract.js";

const createGenreTemplate = (genres) => {

  return (
    `<span class="film-details__genre">${genres}</span>`
  );

};

const createCommentTemplate = (comment) => {
  const {text, emotion, autor, date} = comment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${autor}</span>
          <span class="film-details__comment-day">${humanizeFilmDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );

};

const createCommentsTemplate = (comments) => {

  const commentTemplate = comments
  .map((comment) => createCommentTemplate(comment))
  .join(``);

  return (
    `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list">
        ${commentTemplate}
      </ul>`
  );

};

const createEmotionTemplate = (emotion) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`
  );

};

const createEmojiListTemplate = () => {

  const emotionTemplate = EMOTIONS
  .map((emotion) => createEmotionTemplate(emotion))
  .join(``);

  return (
    `<div class="film-details__emoji-list">
      ${emotionTemplate}
    </div>`
  );

};

const createWatchedTemplate = (isWatched) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>`
  );
};

const createWatchlistTemplate = (isWatchlist) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>`
  );
};

const createFavoriteTemplate = (isFavorite) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`
  );
};

const createFilmCardDetailsTemplate = (filmCard) => {
  const {title, original, poster, age, description, comments, rating, date, duration, genres, director, writers, actors, country, isWatchlist, isWatched, isFavorite} = filmCard;
  const genresTemplate = genres
    .map((genre) => createGenreTemplate(genre))
    .join(``);

  const watchedTemplate = createWatchedTemplate(isWatched);
  const watchlistTemplate = createWatchlistTemplate(isWatchlist);
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
                  <td class="film-details__cell">${humanizeFilmDate(date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${humanizeFilmDuration(duration)}</td>
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
            ${watchlistTemplate}

            ${watchedTemplate}

            ${favoriteTemplate}
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            ${createCommentsTemplate(comments)}
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              ${createEmojiListTemplate()}
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmCardDetails extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addWatchListClickHandler = this._addWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardDetailsTemplate(this._filmCard);
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
    const selectorClass = `input[id=favorite]`;

    const favoriteTemplate = createFavoriteTemplate(this._filmCard.isFavorite);
    const favoriteElement = createElement(favoriteTemplate);

    replace(favoriteElement, element.querySelector(selectorClass));

    element
        .querySelector(selectorClass)
        .addEventListener(`click`, this._callback.favoriteClick);

  }

  _updateWatched() {

    const element = this.getElement();
    const selectorClass = `input[id=watched]`;

    const watchedTemplate = createWatchedTemplate(this._filmCard.isWatched);
    const watchedElement = createElement(watchedTemplate);

    replace(watchedElement, element.querySelector(selectorClass));

    element
        .querySelector(selectorClass)
        .addEventListener(`click`, this._callback.watchedClick);

  }

  _updateWatchList() {

    const element = this.getElement();
    const selectorClass = `input[id=watchlist]`;

    const watchListTemplate = createWatchlistTemplate(this._filmCard.isWatchlist);
    const watchListElement = createElement(watchListTemplate);

    replace(watchListElement, element.querySelector(selectorClass));

    element
        .querySelector(selectorClass)
        .addEventListener(`click`, this._callback.addWatchListClick);

  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick(this._filmCard);
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

