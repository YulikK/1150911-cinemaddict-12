import {CARD_COUNT_PER_STEP} from "./const.js";
import Sort from "./view/sort.js";
import FilmCard from "./view/film-card.js";
import FilmsList from "./view/films-list.js";
import FilmsListContainer from "./view/films-list-container.js";
import Navigation from "./view/navigation.js";
import Profile from "./view/profile.js";
import ShowMoreButton from "./view/show-more-button.js";
import Statistic from "./view/statistic.js";
import FilmCardDetails from "./view/film-details.js";
import {generateFilmCard} from "./mock/film-card.js";
import {generateCountMovies} from "./mock/statistics.js";
import {generateFilters} from "./mock/filter.js";
import {renderElement} from "./utils.js";

const CARD_COUNT = 18;

const filmCards = new Array(CARD_COUNT).fill().map(generateFilmCard);
const filters = generateFilters(filmCards);
const allMovies = generateCountMovies();

const renderFilmCard = (filmCardContainer, filmDetailsContainer, filmCard) => {
  const filmCardComponent = new FilmCard(filmCard);
  const filmCardDetailsComponent = new FilmCardDetails(filmCard);

  const replaceCardToDetails = () => {
    filmDetailsContainer.appendChild(filmCardDetailsComponent.getElement());
    filmCardContainer.removeChild(filmCardComponent.getElement());
    filmDetailsContainer.classList.add(`hide-overflow`);
  };

  const replaceDetailsToCard = () => {
    filmDetailsContainer.removeChild(filmCardDetailsComponent.getElement());
    filmCardContainer.appendChild(filmCardComponent.getElement());
    filmDetailsContainer.classList.remove(`hide-overflow`);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceDetailsToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onFilmCardClick = () => {
    replaceCardToDetails();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onCloseButtonClick = (evt) => {
    evt.preventDefault();
    replaceDetailsToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  filmCardComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, onFilmCardClick);
  filmCardComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, onFilmCardClick);
  filmCardComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, onFilmCardClick);

  filmCardDetailsComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onCloseButtonClick);

  renderElement(filmCardContainer, filmCardComponent.getElement());
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

renderElement(siteHeaderElement, new Profile(filters).getElement());
renderElement(siteMainElement, new Navigation(filters).getElement());
renderElement(siteMainElement, new Sort().getElement());

const filmsListComponent = new FilmsList();
const filmsListContainerComponent = new FilmsListContainer();
renderElement(siteMainElement, filmsListComponent.getElement());
renderElement(filmsListComponent.getElement(), filmsListContainerComponent.getElement());

const renderStartFilmList = () => {
  for (let i = 0; i < Math.min(filmCards.length, CARD_COUNT_PER_STEP); i++) {
    renderFilmCard(filmsListContainerComponent.getElement(), siteBodyElement, filmCards[i]);
  }
};

renderStartFilmList();

if (filmCards.length > CARD_COUNT_PER_STEP) {

  const showMoreButtonComponent = new ShowMoreButton();
  renderElement(filmsListComponent.getElement(), showMoreButtonComponent.getElement());
  let renderedFilmsCount = CARD_COUNT_PER_STEP;

  const onShowMore = (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + CARD_COUNT_PER_STEP)
      .forEach((filmCard) => renderFilmCard(filmsListContainerComponent.getElement(), siteBodyElement, filmCard));

    renderedFilmsCount += CARD_COUNT_PER_STEP;

    if (renderedFilmsCount >= filmCards.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  };

  showMoreButtonComponent.getElement().addEventListener(`click`, onShowMore);

}

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

renderElement(siteStatisticsElement, new Statistic(allMovies).getElement());
