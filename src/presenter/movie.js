import MovieView from "../view/movie.js";
import MovieDetailsView from "../view/movie-details.js";
import CommentsView from "../view/comments.js";
import CommentsModel from "../model/comments.js";
import Provider from "../api/provider.js";
import {render, hideDetails, showDetails, remove} from "../utils/render.js";
import {Mode, UserAction, UpdateType, FilterType} from "../const.js";

export default class Movie {
  constructor(
      movieContainer,
      movieDetailsContainer,
      changeData,
      changeMode,
      changeFilter,
      api
  ) {
    this._movieContainer = movieContainer;
    this._movieDetailsContainer = movieDetailsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._changeFilter = changeFilter;
    this._api = api;
    this._needUpdateBoard = false;

    this._movieComponent = null;
    this._movieDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._commentsModel = null;

    this._handleMovieClick = this._handleMovieClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleAddWatchListClick = this._handleAddWatchListClick.bind(this);
    this._handleEmojiChange = this._handleEmojiChange.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._enterKeyDownHandler = this._enterKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

  }

  init(movie) {
    this._movie = movie;

    const commentsModel = new CommentsModel();
    commentsModel.setComments(this._movie.comments);

    this._commentsModel = commentsModel;
    this._movieComponent = new MovieView(movie);

    this._initPopup();

    this._setListenersCardComponent();

    render(this._movieContainer, this._movieComponent);

  }

  _initPopup() {
    this._movieDetailsComponent = new MovieDetailsView(this._movie, this._commentsModel.getComments());
    this._renderComments();
    this._setListenersDetailsComponent();
  }

  updateCard(movie) {
    if (movie instanceof Object) {
      this._movie = movie;
      this._movieComponent.update(movie);
    }

  }

  updatePopup(movie) {
    if (movie instanceof Object) {
      this._movie = movie;
      this._movieDetailsComponent.update(movie, true);
    }
  }

  updateComments() {
    this._clearComments();
    this._renderComments();
  }

  isDetailsMode() {
    return this._mode === Mode.DETAILS;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideMovieDetails();
    }
  }

  getCard() {
    return this._movieComponent.getElement();
  }

  setAborting() {
    const resetFormState = () => {
      this._movieDetailsComponent.setState();
      this._movieComponent.setState();
    };

    this._movieDetailsComponent.shake(resetFormState);
    this._movieComponent.shake(resetFormState);
  }

  _handleViewAction(actionType, updateTypeCard, updateTypeDetails, update) {
    const resetFormState = () => {
      this._movieDetailsComponent.setState();
    };

    const resetButtonState = () => {
      this._commentsComponent.setDeletingState(update, false);
    };

    switch (actionType) {
      case UserAction.ADD:
        this._api.addComment(this._movie, update)
        .then((response) => {
          this._commentsModel.addComment(updateTypeCard, updateTypeDetails, response);
          this._changeData(
              UserAction.UPDATE,
              updateTypeCard, // карточка
              updateTypeDetails, // попап
              Object.assign(
                  {},
                  this._movie,
                  {
                    comments: this._commentsModel.getComments()
                  }
              ),
              this._movieContainer,
              true
          );
          this._movieDetailsComponent.setState();
        })
        .catch((err) => {
          console.log(err); // eslint-disable-line
          this._movieDetailsComponent.shake(resetFormState);
        });
        break;
      case UserAction.DELETE:
        this._api.deleteComment(update)
        .then(() => {
          this._commentsModel.deleteComment(updateTypeCard, updateTypeDetails, update);
          this._changeData(
              UserAction.UPDATE,
              updateTypeCard, // карточка
              updateTypeDetails, // попап
              Object.assign(
                  {},
                  this._movie,
                  {
                    comments: this._commentsModel.getComments()
                  }
              ),
              this._movieContainer,
              true
          );
        })
        .catch((err) => {
          console.log(err); // eslint-disable-line
          this._commentsComponent.shake(resetButtonState);
        });
        break;
    }
  }

  _setListenersCardComponent() {
    this._movieComponent.setMovieClickHandler(this._handleMovieClick);
    this._setCommonListeners(this._movieComponent);
  }

  _setListenersDetailsComponent() {
    this._movieDetailsComponent.setCloseClickHandler(this._handleCloseButtonClick);
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
    this.setCommentsState(Provider.isOnline());
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    document.addEventListener(`keydown`, this._enterKeyDownHandler);
    this._changeMode();
    this._mode = Mode.DETAILS;
  }

  setCommentsState(isOnline) {
    this._commentsComponent.setCommentsState(isOnline);
  }

  _renderComments() {

    if (this._commentsComponent !== null) {
      this._commentsComponent = null;
    }

    this._commentsComponent = new CommentsView(this._commentsModel.getComments());
    this._commentsComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._commentsComponent.setEmojiClickHandler(this._handleEmojiChange);

    render(this._movieDetailsComponent.getElement().querySelector(`.film-details__inner`), this._commentsComponent);
  }

  _clearComments() {

    remove(this._commentsComponent);

  }

  _hideMovieDetails() {
    hideDetails(this._movieDetailsContainer, this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    document.removeEventListener(`keydown`, this._enterKeyDownHandler);
    this._mode = Mode.DEFAULT;

    if (this._needUpdateBoard) {
      this._changeData(
          UserAction.UPDATE,
          UpdateType.MINOR,
          UpdateType.NOT,
          this._movie,
          this._movieContainer
      );
      this._needUpdateBoard = false;
    }
    this._initPopup();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE,
        this._changeFilter !== FilterType.FAVORITES || this._mode === Mode.DETAILS ? UpdateType.PATCH : UpdateType.MINOR, // карточка
        UpdateType.PATCH, // попап
        Object.assign(
            {},
            this._movie,
            {
              isFavorite: !this._movie.isFavorite
            }
        ),
        this._movieContainer
    );
    this._needUpdateBoard = this._changeFilter === FilterType.FAVORITES && this._mode === Mode.DETAILS;
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE,
        this._changeFilter !== FilterType.HISTORY || this._mode === Mode.DETAILS ? UpdateType.PATCH : UpdateType.MINOR, // карточка
        UpdateType.PATCH, // попап
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched,
              watchingDate: this._movie.isWatched ? null : new Date()
            }
        ),
        this._movieContainer
    );
    this._needUpdateBoard = this._changeFilter === FilterType.HISTORY && this._mode === Mode.DETAILS;
  }

  _handleAddWatchListClick() {
    this._changeData(
        UserAction.UPDATE,
        this._changeFilter !== FilterType.WATCHLIST || this._mode === Mode.DETAILS ? UpdateType.PATCH : UpdateType.MINOR, // карточка
        UpdateType.PATCH, // попап
        Object.assign(
            {},
            this._movie,
            {
              isWatchList: !this._movie.isWatchList
            }
        ),
        this._movieContainer
    );
    this._needUpdateBoard = this._changeFilter === FilterType.WATCHLIST && this._mode === Mode.DETAILS;
  }

  _handleMovieClick() {
    this._showMovieDetails();
  }

  _handleCloseButtonClick() {
    this._hideMovieDetails();
  }

  _handleEmojiChange(newEmoji) {
    this._commentsComponent.changeEmoji(newEmoji);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._hideMovieDetails();
    }
  }

  _enterKeyDownHandler(evt) {

    if ((evt.ctrlKey) && ((evt.keyCode === 0xA) || (evt.keyCode === 0xD))) {
      if (Provider.isOnline()) {
        this._movieDetailsComponent.setState(true);
        evt.preventDefault();
        const update = {
          text: this._commentsComponent.getNewComment(),
          emotion: this._commentsComponent.getNewEmoji(),
          date: new Date(),
        };
        this._handleAddComment(update);
      } else {
        this.setAborting();
      }
    }
  }

  _handleDeleteClick(update) {
    this._handleViewAction(UserAction.DELETE, UpdateType.PATCH, UpdateType.MINOR, update);
  }

  _handleAddComment(update) {
    this._handleViewAction(UserAction.ADD, UpdateType.PATCH, UpdateType.MINOR, update);
  }
}
