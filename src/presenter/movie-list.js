import {CARD_COUNT_PER_STEP} from "../const.js";
import SortView from "../view/sort.js";
import FilmCardView from "../view/film-card.js";
import FilmsListView from "../view/films-list.js";
import NoFilmView from "../view/no-film.js";
import FilmsListContainerView from "../view/films-list-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmCardDetailsView from "../view/film-details.js";
import {render, hideDetails, showDetails, remove} from "../utils/render.js";

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

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._boardFilms = films.slice();
    this._sourcedBoardFilms = films.slice();

    this._renderSort();

    render(this._movieContainer, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListContainerComponent);

    this._renderBoard();
  }

  _renderSort() {
    render(this._movieContainer, this._sortComponent);
  }

  _renderFilmCard(filmCard) {
    const filmCardComponent = new FilmCardView(filmCard);
    const filmCardDetailsComponent = new FilmCardDetailsView(filmCard);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        hideDetails(this._movieDetailsContainer, filmCardDetailsComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onFilmCardClick = () => {
      showDetails(this._movieDetailsContainer, filmCardDetailsComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onCloseButtonClick = () => {
      hideDetails(this._movieDetailsContainer, filmCardDetailsComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    filmCardComponent.setFilmCardClickHandler(onFilmCardClick);

    filmCardDetailsComponent.setCloseClickHandler(onCloseButtonClick);

    render(this._filmsListContainerComponent, filmCardComponent);
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
