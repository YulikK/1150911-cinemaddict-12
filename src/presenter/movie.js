import MovieView from "../view/movie.js";
import MovieDetailsView from "../view/movie-details.js";
import CommentsView from "../view/comments.js";
import CommentsModel from "../model/comments.js";
import {generateId} from "../mock/movie.js";
import {render, hideDetails, showDetails, remove} from "../utils/render.js";
import {getRandomName} from "../utils/movie.js";
import {Mode, UserAction, UpdateType, FilterType} from "../const.js";

export default class Movie {
  constructor(
      movieContainer,
      movieDetailsContainer,
      changeData,
      changeMode,
      changeFilter
  ) {
    this._movieContainer = movieContainer;
    this._movieDetailsContainer = movieDetailsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._changeFilter = changeFilter;

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
    this._handleModelEvent = this._handleModelEvent.bind(this);


  }

  init(movie) {
    this._movie = movie;

    const commentsModel = new CommentsModel();
    commentsModel.setComments(this._movie.comments);

    this._commentsModel = commentsModel;
    this._movieComponent = new MovieView(movie);

    this._initPopup();

    this._setListenersComponent();

    this._commentsModel.addObserver(this._handleModelEvent);

    render(this._movieContainer, this._movieComponent);

  }

  _initPopup() {
    this._movieDetailsComponent = new MovieDetailsView(this._movie, this._commentsModel.getComments());
    this._renderComments();
  }

  update(movie) {
    this._movie = movie;
    this._movieComponent.update(this._movie);
    this._movieDetailsComponent.update(this._movie, true);

  }

  updateCard(movie) {
    this._movie = movie;
    this._movieComponent.update(this._movie);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideMovieDetails();
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD:
        this._commentsModel.addComment(updateType, update);
        this._changeData(
            UserAction.UPDATE,
            UpdateType.PATCH_CARD,
            Object.assign(
                {},
                this._movie,
                {
                  comments: this._commentsModel.getComments()
                }
            )
        );
        break;
      case UserAction.DELETE:
        this._commentsModel.deleteComment(updateType, update);
        this._changeData(
            UserAction.UPDATE,
            UpdateType.PATCH_CARD,
            Object.assign(
                {},
                this._movie,
                {
                  comments: this._commentsModel.getComments()
                }
            )
        );
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearComments();
        this._renderComments();
        break;
    }
  }

  _setListenersComponent() {
    this._movieComponent.setMovieClickHandler(this._handleMovieClick);
    this._movieDetailsComponent.setCloseClickHandler(this._handleCloseButtonClick);

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
    document.addEventListener(`keydown`, this._enterKeyDownHandler);
    this._changeMode();
    this._mode = Mode.DETAILS;
  }

  _renderComments() {

    if (this._commentsComponent !== null) {
      this._commentsComponent = null;
    }

    this._commentsComponent = new CommentsView(this._commentsModel.getComments());
    this._commentsComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._commentsComponent.setEmojiClickHandler(this._handleEmojiChange);

    render(this._movieDetailsComponent, this._commentsComponent);

  }

  _clearComments() {

    remove(this._commentsComponent);

  }


  _hideMovieDetails() {
    const preMode = this._mode;
    hideDetails(this._movieDetailsContainer, this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    document.removeEventListener(`keydown`, this._enterKeyDownHandler);
    this._mode = Mode.DEFAULT;

    if (preMode === Mode.DETAILS & this._changeFilter !== FilterType.ALL) {
      this._changeData(
          UserAction.UPDATE,
          UpdateType.MINOR,
          this._movie
      );
    }
    this._initPopup();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE,
        this._changeFilter === FilterType.ALL || this._mode === Mode.DETAILS ? UpdateType.PATCH : UpdateType.MINOR,
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
        this._changeFilter === FilterType.ALL || this._mode === Mode.DETAILS ? UpdateType.PATCH : UpdateType.MINOR,
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
        this._changeFilter === FilterType.ALL || this._mode === Mode.DETAILS ? UpdateType.PATCH : UpdateType.MINOR,
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
      evt.preventDefault();
      const update = {
        id: generateId(),
        autor: getRandomName(),
        text: this._commentsComponent.getNewComment(),
        emotion: this._commentsComponent.getNewEmoji(),
        date: new Date(),
      };
      this._handleAddComment(update);
    }
  }

  _handleDeleteClick(update) {
    this._handleViewAction(UserAction.DELETE, UpdateType.MINOR, update);
  }

  _handleAddComment(update) {
    this._handleViewAction(UserAction.ADD, UpdateType.MINOR, update);
  }
}
