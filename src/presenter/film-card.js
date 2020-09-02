import FilmCardView from "../view/film-card.js";
import FilmCardDetailsView from "../view/film-details.js";
import {render, hideDetails, showDetails, replace, remove} from "../utils/render.js";

export default class FilmCard {
  constructor(filmCardContainer, filmCardDetailsContainer) {
    this._filmCardContainer = filmCardContainer;
    this._filmCardDetailsContainer = filmCardDetailsContainer;

    this._filmCardComponent = null;
    this._filmCardDetailsComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }
  init(film) {
    this._film = film;

    const prevfilmCardComponent = this._filmCardComponent;
    const prevfilmCardDetailsComponent = this._filmCardDetailsComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmCardDetailsComponent = new FilmCardDetailsView(film);

    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick);
    this._filmCardDetailsComponent.setCloseClickHandler(this._handleCloseButtonClick);

    if (prevfilmCardComponent === null || prevfilmCardDetailsComponent === null) {
      render(this._filmCardContainer, this._filmCardComponent);
      return;
    }

    if (this._filmCardContainer.getElement().contains(prevfilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevfilmCardComponent);
    }

    if (this._filmCardContainer.getElement().contains(prevfilmCardDetailsComponent.getElement())) {
      replace(this._filmCardDetailsComponent, prevfilmCardDetailsComponent);
    }

    remove(prevfilmCardComponent);
    remove(prevfilmCardDetailsComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmCardDetailsComponent);
  }

  _showFilmDetails() {
    showDetails(this._filmCardDetailsContainer, this._filmCardDetailsComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _hideFilmDetails() {
    hideDetails(this._filmCardDetailsContainer, this._filmCardDetailsComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFilmCardClick() {
    this._showFilmDetails();
  }

  _handleCloseButtonClick() {
    this._hideFilmDetails();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._hideFilmDetails();
    }
  }
}
