import {createBoardTemplate} from "./view/board.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createFilmsListTemplate} from "./view/films-list.js";
import {createFilmsRecomendListTemplate} from "./view/films-recomend-list.js";
import {createFilmsTopListTemplate} from "./view/films-top-list.js";
import {createNavigationTemplate} from "./view/navigation.js";
import {createProfileTemplate} from "./view/profile.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createStatisticsTemplate} from "./view/statistic.js";

const CARD_COUNT = 5;
const CARD_EXTRA_COUNT = 2;

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

const renderRecomendsSection = () => {

  render(siteFilmsElement, createFilmsRecomendListTemplate());

  const siteFilmsRecomendsContainerElement = siteFilmsElement.querySelector(`.films-list--extra:last-child .films-list__container`);

  renderCards(siteFilmsRecomendsContainerElement, CARD_EXTRA_COUNT);

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

renderCards(siteFilmsContainerElement, CARD_COUNT);

render(siteFilmsListElement, createShowMoreButtonTemplate());

renderTopSection();

renderRecomendsSection();

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(siteStatisticsElement, createStatisticsTemplate());

