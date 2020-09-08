import FilmCardView from "../view/film-card.js";
import FilmCardDetailsView from "../view/film-details.js";
import {render, hideDetails, showDetails, remove} from "../utils/render.js";
import {Mode} from "../const.js";

export default class FilmCard {
  constructor(filmCardContainer, filmCardDetailsContainer, changeData, changeMode) {
    this._filmCardContainer = filmCardContainer;
    this._filmCardDetailsContainer = filmCardDetailsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmCardDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleAddWatchListClick = this._handleAddWatchListClick.bind(this);
    this._handleEmojiChange = this._handleEmojiChange.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }
  init(film) {
    this._film = film;

    this._filmCardComponent = new FilmCardView(film);
    this._filmCardDetailsComponent = new FilmCardDetailsView(film);

    this._setListenersComponent();

    render(this._filmCardContainer, this._filmCardComponent);

  }

  update(film) {
    this._film = film;
    this._filmCardComponent.update(this._film);
    this._filmCardDetailsComponent.update(this._film, true);

  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideFilmDetails();
    }
  }

  _setListenersComponent() {
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick);
    this._filmCardDetailsComponent.setCloseClickHandler(this._handleCloseButtonClick);
    this._filmCardDetailsComponent.setEmojiClickHandler(this._handleEmojiChange);

    this._setCommonListeners(this._filmCardComponent);
    this._setCommonListeners(this._filmCardDetailsComponent);

  }

  _setCommonListeners(component) {
    component.setFavoriteClickHandler(this._handleFavoriteClick);
    component.setWatchedClickHandler(this._handleWatchedClick);
    component.setAddWatchListClickHandler(this._handleAddWatchListClick);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmCardDetailsComponent);
  }

  _showFilmDetails() {
    showDetails(this._filmCardDetailsContainer, this._filmCardDetailsComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.DETAILS;
  }

  _hideFilmDetails() {
    hideDetails(this._filmCardDetailsContainer, this._filmCardDetailsComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleAddWatchListClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatchList: !this._film.isWatchList
            }
        )
    );
  }

  _handleFilmCardClick() {
    this._showFilmDetails();
  }

  _handleCloseButtonClick() {
    this._hideFilmDetails();
  }

  _handleEmojiChange(newEmoji) {
    this._filmCardDetailsComponent.changeEmoji(newEmoji);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._hideFilmDetails();
    }
  }
}
