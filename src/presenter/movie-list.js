import {CARD_COUNT_PER_STEP} from "../const.js";
import FilmPresenter from "../presenter/film-card.js";
import SortView from "../view/sort.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import FilmsListContainerView from "../view/films-list-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import {render, remove} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/film-card.js";

export default class MovieList {
  constructor(movieContainer, movieDetailsContainer) {
    this._movieContainer = movieContainer;
    this._movieDetailsContainer = movieDetailsContainer;
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._noFilmComponent = new NoFilmView();
    this._sortComponent = new SortView();
    this._renderedFilmCount = CARD_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._filmPresenter = {};

    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._boardFilms = films.slice();
    this._sourcedBoardFilms = films.slice();

    this._renderSort();

    render(this._movieContainer, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderBoard();
  }

  _handleFilmCardChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);
    // this._filmPresenter[updatedFilm.id].init(updatedFilm);
    this._filmPresenter[updatedFilm.id].update(updatedFilm);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._boardFilms.sort(sortByDate);
        break;
      case SortType.BY_RATING:
        this._boardFilms.sort(sortByRating);
        break;
      default:
        this._boardFilms = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _setActiveSortElement(sortType) {
    const sortComponent = this._sortComponent.getElement();
    const oldSortElement = sortComponent.querySelector(`a[data-sort-type="${this._currentSortType}"]`);
    const newSortElement = sortComponent.querySelector(`a[data-sort-type="${sortType}"]`);
    oldSortElement.classList.remove(`sort__button--active`);
    newSortElement.classList.add(`sort__button--active`);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._setActiveSortElement(sortType);
    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderSort() {
    render(this._movieContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCard(filmCard) {
    const filmPresenter = new FilmPresenter(this._filmsListContainerComponent, this._movieDetailsContainer, this._handleFilmCardChange);
    filmPresenter.init(filmCard);
    this._filmPresenter[filmCard.id] = filmPresenter;
  }

  _renderFilmCards(from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilmCard(boardFilm));
  }

  _renderNoFilm() {
    render(this._filmsListContainerComponent, this._noFilmComponent);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmCount, this._renderedFilmCount + CARD_COUNT_PER_STEP);
    this._renderedFilmCount += CARD_COUNT_PER_STEP;
    if (this._renderedFilmCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent);
    }

  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
    .values(this._filmPresenter)
    .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = CARD_COUNT_PER_STEP;
  }

  _renderFilmList() {
    this._renderFilmCards(0, Math.min(this._boardFilms.length, CARD_COUNT_PER_STEP));
    if (this._boardFilms.length > CARD_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderBoard() {

    if (this._boardFilms.length === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderFilmList();
  }
}
