import NavigationView from "./view/navigation.js";
import ProfileView from "./view/profile.js";
import StatisticView from "./view/statistic.js";
import MoviesModel from "./model/movies.js";
import {generateMovie} from "./mock/movie.js";
import {generateCountMovies} from "./mock/statistics.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils/render.js";
import MovieListPresenter from "./presenter/movie-list.js";

const CARD_COUNT = 18;

const movies = new Array(CARD_COUNT).fill().map(generateMovie);
const filters = generateFilters(movies);
const allMovies = generateCountMovies();

const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

render(siteHeaderElement, new ProfileView(filters));
render(siteMainElement, new NavigationView(filters));

const movieListPresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel);
movieListPresenter.init();

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteStatisticsElement, new StatisticView(allMovies));
