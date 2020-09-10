import MovieView from "../view/movie.js";
import MovieDetailsView from "../view/movie-details.js";
import {render, hideDetails, showDetails, remove} from "../utils/render.js";
import {Mode} from "../const.js";
import {UserAction, UpdateType} from "../const.js";

export default class Movie {
  constructor(movieContainer, movieDetailsContainer, changeData, changeMode) {
    this._movieContainer = movieContainer;
    this._movieDetailsContainer = movieDetailsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._movieComponent = null;
    this._movieDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleMovieClick = this._handleMovieClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleAddWatchListClick = this._handleAddWatchListClick.bind(this);
    this._handleEmojiChange = this._handleEmojiChange.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;

    this._movieComponent = new MovieView(movie);
    this._movieDetailsComponent = new MovieDetailsView(movie);

    this._setListenersComponent();

    render(this._movieContainer, this._movieComponent);

  }

  update(movie) {
    this._movie = movie;
    this._movieComponent.update(this._movie);
    this._movieDetailsComponent.update(this._movie, true);

  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideMovieDetails();
    }
  }

  _setListenersComponent() {
    this._movieComponent.setMovieClickHandler(this._handleMovieClick);
    this._movieDetailsComponent.setCloseClickHandler(this._handleCloseButtonClick);
    this._movieDetailsComponent.setEmojiClickHandler(this._handleEmojiChange);

    this._setCommonListeners(this._movieComponent);
    this._setCommonListeners(this._movieDetailsComponent);

  }

  _setCommonListeners(component) {
    component.setFavoriteClickHandler(this._handleFavoriteClick);
    component.setWatchedClickHandler(this._handleWatchedClick);
    component.setAddWatchListClickHandler(this._handleAddWatchListClick);
  }

  destroy() {
    remove(this._movieComponent);
    remove(this._movieDetailsComponent);
  }

  _showMovieDetails() {
    showDetails(this._movieDetailsContainer, this._movieDetailsComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.DETAILS;
  }

  _hideMovieDetails() {
    hideDetails(this._movieDetailsContainer, this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isFavorite: !this._movie.isFavorite
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched
            }
        )
    );
  }

  _handleAddWatchListClick() {
    this._changeData(
        UserAction.UPDATE,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isWatchList: !this._movie.isWatchList
            }
        )
    );
  }

  _handleMovieClick() {
    this._showMovieDetails();
  }

  _handleCloseButtonClick() {
    this._hideMovieDetails();
  }

  _handleEmojiChange(newEmoji) {
    this._movieDetailsComponent.changeEmoji(newEmoji);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._hideMovieDetails();
    }
  }
}
