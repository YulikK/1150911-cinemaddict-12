import ProfileView from "./view/profile.js";
import StatisticView from "./view/statistic.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {generateMovie} from "./mock/movie.js";
import {generateCountMovies} from "./mock/statistics.js";
import {render} from "./utils/render.js";
import {filter} from "./utils/filter.js";
import {FilterType} from "./const.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilterPresenter from "./presenter/filter.js";

const CARD_COUNT = 18;

const movies = new Array(CARD_COUNT).fill().map(generateMovie);
const allMovies = generateCountMovies();

const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const filterModel = new FilterModel();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

render(siteHeaderElement, new ProfileView(filter[FilterType.HISTORY](moviesModel.getMovies()).length));
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

const movieListPresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel, filterModel);
movieListPresenter.init();

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteStatisticsElement, new StatisticView(allMovies));
