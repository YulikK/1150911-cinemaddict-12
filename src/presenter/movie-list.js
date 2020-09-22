import {CARD_COUNT_PER_STEP} from "../const.js";
import MoviePresenter from "./movie.js";
import SortView from "../view/sort.js";
import MovieSectionView from "../view/movies.js";
import MovieListView from "../view/movie-list.js";
import NoMovieView from "../view/no-movie.js";
import TopListView from "../view/movies-top.js";
import MovieListContainerView from "../view/movie-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import LoadingView from "../view/loading.js";
import {render, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {sortByDate, sortByRating, getTopRatedMovies} from "../utils/movie.js";
import {SortType, UpdateType, UserAction} from "../const.js";

export default class MovieList {
  constructor(movieContainer, movieDetailsContainer, moviesModel, filterModel, api) {

    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._movieContainer = movieContainer;
    this._movieDetailsContainer = movieDetailsContainer;
    this._api = api;

    this._movieSectionComponent = new MovieSectionView();
    this._movieListComponent = new MovieListView();
    this._movieListContainerComponent = new MovieListContainerView();
    this._noMovieComponent = new NoMovieView();
    this._loadingComponent = new LoadingView();

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._topRatedComponent = null;
    this._mostRecommentedComponent = null;
    this._topRatedContainer = null;

    this._renderedMovieCount = CARD_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._moviePresenter = {};
    this._movieTopPresenter = {};
    this._isLoading = true;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

  }

  init() {

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();

  }

  destroy() {

    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._movieListComponent);
    remove(this._movieSectionComponent);

    this._moviesModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filtredMovies.sort(sortByDate);
      case SortType.BY_RATING:
        return filtredMovies.sort(sortByRating);
    }
    return filtredMovies;
  }

  _handleViewAction(actionType, updateType, update, container) {
    switch (actionType) {
      case UserAction.UPDATE:
        this._api.updateMovie(update)
        .then((movie) =>
          this._api.getComments(movie)
          .then((movieUpdate) => {
            this._moviesModel.updateMovie(updateType, movieUpdate);
          }))
          .catch(() => {
            if (container === this._topRatedContainer) {
              this._movieTopPresenter[update.id].setAborting();
            } else {
              this._moviePresenter[update.id].setAborting();
            }
          });
        break;
      case UserAction.UPDATE_LOCAL:
        this._moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._moviePresenter[data.id] !== undefined) {
          this._moviePresenter[data.id].update(data);
        }

        if (this._movieTopPresenter[data.id] !== undefined) {
          this._movieTopPresenter[data.id].update(data);
        }
        break;
      case UpdateType.PATCH_CARD:
        if (this._moviePresenter[data.id] !== undefined) {
          this._moviePresenter[data.id].updateCard(data);
        }

        if (this._movieTopPresenter[data.id] !== undefined) {
          this._movieTopPresenter[data.id].updateCard(data);
        }
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedMovieCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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

  _renderMovie(movie, container, presenter) {

    const moviePresenter = new MoviePresenter(
        container, // this._movieListContainerComponent,
        this._movieDetailsContainer,
        this._handleViewAction,
        this._handleModeChange,
        this._filterModel.getFilter(),
        this._api
    );

    moviePresenter.init(movie);
    presenter[movie.id] = moviePresenter;

  }

  _renderMovies(movies, container, presenter) {
    movies.forEach((movie) => this._renderMovie(movie, container, presenter));
  }

  _renderNoMovies() {
    render(this._movieListContainerComponent, this._noMovieComponent);
  }

  _renderLoading() {
    render(this._movieContainer, this._loadingComponent);
  }

  _handleShowMoreButtonClick() {

    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedMovieCount + CARD_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovieCount, newRenderedMovieCount);

    this._renderMovies(movies, this._movieListContainerComponent, this._moviePresenter);
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
    this._movieTopPresenter = {};

    remove(this._sortComponent);
    remove(this._noMovieComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);
    remove(this._topRatedComponent);

    if (resetRenderedMovieCount) {
      this._renderedMovieCount = CARD_COUNT_PER_STEP;
    } else {
      this._renderedMovieCount = Math.min(movieCount, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const movies = this._getMovies();
    const movieCount = movies.length;

    this._renderSort();

    render(this._movieContainer, this._movieSectionComponent);
    render(this._movieSectionComponent, this._movieListComponent);
    render(this._movieListComponent, this._movieListContainerComponent);

    if (movieCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderMovies(movies.slice(0, Math.min(movieCount, this._renderedMovieCount)), this._movieListContainerComponent, this._moviePresenter);

    if (movieCount > this._renderedMovieCount) {
      this._renderShowMoreButton();
    }

    const topRatedMovies = getTopRatedMovies(this._moviesModel.getMovies());

    if (topRatedMovies.length !== 0) {

      this._renderExtraList(topRatedMovies);
    }

  }

  _renderExtraList(topRatedMovies) {

    if (this._topRatedComponent !== null) {
      this._topRatedComponent = null;
    }

    this._topRatedComponent = new TopListView();
    render(this._movieSectionComponent, this._topRatedComponent);
    this._topRatedContainer = this._topRatedComponent.getContainer();

    this._renderMovies(topRatedMovies, this._topRatedContainer, this._movieTopPresenter);

  }

}
