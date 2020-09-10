import {CARD_COUNT_PER_STEP} from "../const.js";
import MoviePresenter from "./movie.js";
import SortView from "../view/sort.js";
import MovieListView from "../view/movies.js";
import NoMovieView from "../view/no-movie.js";
import MovieListContainerView from "../view/movie-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import {render, remove} from "../utils/render.js";
import {SortType, UpdateType, UserAction} from "../const.js";
import {sortByDate, sortByRating} from "../utils/movie.js";

export default class MovieList {
  constructor(movieContainer, movieDetailsContainer, moviesModel) {

    this._moviesModel = moviesModel;
    this._movieContainer = movieContainer;
    this._movieDetailsContainer = movieDetailsContainer;

    this._movieListComponent = new MovieListView();
    this._movieListContainerComponent = new MovieListContainerView();
    this._noMovieComponent = new NoMovieView();

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._renderedMovieCount = CARD_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._moviePresenter = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {

    this._renderBoard();

  }

  _getMovies() {
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return this._moviesModel.getMovies().slice().sort(sortByDate);
      case SortType.BY_RATING:
        return this._moviesModel.getMovies().slice().sort(sortByRating);
    }
    return this._moviesModel.getMovies();
  }

  _handleViewAction(actionType, updateType, update) {
    // this._moviePresenter[updatedMovie.id].update(updatedMovie);
    switch (actionType) {
      case UserAction.UPDATE:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD:
        // this._tasksModel.addTask(updateType, update);///**оставлю для реализации комментариев */
        break;
      case UserAction.DELETE:
        // this._tasksModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenter[data.id].update(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({resetRenderedMovieCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }


  _handleModeChange() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetRenderedMovieCount: true});
    this._renderBoard();
  }

  _renderSort() {

    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._movieContainer, this._sortComponent);

  }

  _renderMovie(movie) {
    const moviePresenter = new MoviePresenter(this._movieListContainerComponent, this._movieDetailsContainer, this._handleViewAction, this._handleModeChange);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderMovies(movies) {
    movies.forEach((movie) => this._renderMovie(movie));
  }

  _renderNoMovies() {
    render(this._movieListContainerComponent, this._noMovieComponent);
  }

  _handleShowMoreButtonClick() {

    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedMovieCount + CARD_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovieCount, newRenderedMovieCount);

    this._renderMovies(movies);
    this._renderedMovieCount = newRenderedMovieCount;

    if (this._renderedMovieCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }

  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._movieListComponent, this._showMoreButtonComponent);
  }

  _clearBoard({resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};

    remove(this._sortComponent);
    remove(this._noMovieComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedMovieCount) {
      this._renderedMovieCount = CARD_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedMovieCount = Math.min(movieCount, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {

    const movies = this._getMovies();
    const movieCount = movies.length;

    if (movieCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    render(this._movieContainer, this._movieListComponent);
    render(this._movieListComponent, this._movieListContainerComponent);

    // Теперь, когда _renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу CARD_COUNT_PER_STEP на свойство _renderedMovieCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this._renderMovies(movies.slice(0, Math.min(movieCount, this._renderedMovieCount)));

    if (movieCount > this._renderedMovieCount) {
      this._renderShowMoreButton();
    }

  }
}
