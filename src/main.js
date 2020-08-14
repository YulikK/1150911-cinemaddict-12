import {CARD_COUNT_PER_STEP} from "./const.js";
import {createBoardTemplate} from "./view/board.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createNavigationTemplate} from "./view/navigation.js";
import {createProfileTemplate} from "./view/profile.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createStatisticsTemplate} from "./view/statistic.js";
import {createFilmDetailsTemplate} from "./view/film-details.js";
import {generateFilmCard} from "./mock/film-card.js";
import {generateCountMovies} from "./mock/statistics.js";
import {generateFilters} from "./mock/filter.js";

const CARD_COUNT = 18;

const filmCards = new Array(CARD_COUNT).fill().map(generateFilmCard);
const filters = generateFilters(filmCards);
const allMovies = generateCountMovies();
const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const renderPopupDetails = (container, filmCard) => {
  render(container, createFilmDetailsTemplate(filmCard));
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createProfileTemplate(filters));
render(siteMainElement, createNavigationTemplate(filters));
render(siteMainElement, createBoardTemplate());
renderPopupDetails(siteMainElement, filmCards[0]);
render(siteMainElement, createFilmsListTemplate());

const siteFilmsElement = siteMainElement.querySelector(`.films`);
const siteFilmsListElement = siteFilmsElement.querySelector(`.films-list`);
const siteFilmsContainerElement = siteFilmsElement.querySelector(`.films-list__container`);

const renderStartFilmList = () => {
  for (let i = 0; i < Math.min(filmCards.length, CARD_COUNT_PER_STEP); i++) {
    render(siteFilmsContainerElement, createFilmCardTemplate(filmCards[i]));
  }
};

renderStartFilmList();

if (filmCards.length > CARD_COUNT_PER_STEP) {

  render(siteFilmsListElement, createShowMoreButtonTemplate());
  let renderedFilmsCount = CARD_COUNT_PER_STEP;
  const showMoreButton = siteFilmsListElement.querySelector(`.films-list__show-more`);

  const onShowMore = (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + CARD_COUNT_PER_STEP)
      .forEach((filmCard) => render(siteFilmsContainerElement, createFilmCardTemplate(filmCard)));

    renderedFilmsCount += CARD_COUNT_PER_STEP;

    if (renderedFilmsCount >= filmCards.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener(`click`, onShowMore);

}

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteStatisticsElement, createStatisticsTemplate(allMovies));
