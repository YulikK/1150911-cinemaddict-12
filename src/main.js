import {createBoardTemplate} from "./view/board.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createFilmsRecommendListTemplate} from "./view/films-recommend-list.js";
import {createFilmsTopListTemplate} from "./view/films-top-list.js";
import {createNavigationTemplate} from "./view/navigation.js";
import {createProfileTemplate} from "./view/profile.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createStatisticsTemplate} from "./view/statistic.js";
import {generateFilmCard} from "./mock/film-card.js";

const CARD_COUNT = 18;
const CARD_EXTRA_COUNT = 2;
const CARD_COUNT_PER_STEP = 5;

const filmCards = new Array(CARD_COUNT).fill().map(generateFilmCard);

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const renderCards = (container, count) => {
  for (let i = 0; i < count; i++) {
    render(container, createFilmCardTemplate());
  }
};

const renderTopSection = () => {

  render(siteFilmsElement, createFilmsTopListTemplate());

  const siteFilmsTopContainerElement = siteFilmsElement.querySelector(`.films-list--extra .films-list__container`);

  renderCards(siteFilmsTopContainerElement, CARD_EXTRA_COUNT);

};

const renderRecommendsSection = () => {

  render(siteFilmsElement, createFilmsRecommendListTemplate());

  const siteFilmsRecommendsContainerElement = siteFilmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

  renderCards(siteFilmsRecommendsContainerElement, CARD_EXTRA_COUNT);

};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createNavigationTemplate());
render(siteMainElement, createBoardTemplate());
render(siteMainElement, createFilmsListTemplate());

const siteFilmsElement = siteMainElement.querySelector(`.films`);
const siteFilmsListElement = siteFilmsElement.querySelector(`.films-list`);
const siteFilmsContainerElement = siteFilmsElement.querySelector(`.films-list__container`);

for (let i = 1; i <= Math.min(filmCards.length, CARD_COUNT_PER_STEP); i++) {
  render(siteFilmsContainerElement, createFilmCardTemplate(filmCards[i]));
}

if (filmCards.length > CARD_COUNT_PER_STEP) {
  let renderedFilmsCount = CARD_COUNT_PER_STEP;

  render(siteFilmsListElement, createShowMoreButtonTemplate(), `beforeend`);

  const ShowMoreButton = siteFilmsListElement.querySelector(`.films-list__show-more`);

  ShowMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + CARD_COUNT_PER_STEP)
      .forEach((filmCard) => render(siteFilmsContainerElement, createFilmCardTemplate(filmCard)));

    renderedFilmsCount += CARD_COUNT_PER_STEP;

    if (renderedFilmsCount >= filmCards.length) {
      ShowMoreButton.remove();
    }
  });
}

// renderTopSection();

// renderRecommendsSection();

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteStatisticsElement, createStatisticsTemplate());
