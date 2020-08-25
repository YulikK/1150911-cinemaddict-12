import NavigationView from "./view/navigation.js";
import ProfileView from "./view/profile.js";
import StatisticView from "./view/statistic.js";
import {generateFilmCard} from "./mock/film-card.js";
import {generateCountMovies} from "./mock/statistics.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils/render.js";
import MovieListPresenter from "./presenter/movie-list.js";

const CARD_COUNT = 18;

const filmCards = new Array(CARD_COUNT).fill().map(generateFilmCard);
const filters = generateFilters(filmCards);
const allMovies = generateCountMovies();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

render(siteHeaderElement, new ProfileView(filters));
render(siteMainElement, new NavigationView(filters));

const movieListPresenter = new MovieListPresenter(siteMainElement, siteBodyElement);
movieListPresenter.init(filmCards);

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteStatisticsElement, new StatisticView(allMovies));
