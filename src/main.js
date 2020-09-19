import ProfileView from "./view/profile.js";
// import StatsView from "./view/stats.js";
import StatisticsView from "./view/statistics.js";
import FooterStatisticView from "./view/footer-statistic.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {generateMovie} from "./mock/movie.js";
import {generateCountMovies} from "./mock/statistics.js";
import {render, remove} from "./utils/render.js";
import {filter} from "./utils/filter.js";
import {FilterType, MenuItem} from "./const.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilterPresenter from "./presenter/filter.js";

const CARD_COUNT = 18;
let menuItem = null;

const movies = new Array(CARD_COUNT).fill().map(generateMovie);
const allMovies = generateCountMovies();

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

moviesModel.setMovies(movies);

render(siteHeaderElement, new ProfileView(filter[FilterType.HISTORY](moviesModel.getMovies()).length));
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
filterPresenter.init();

const movieListPresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel, filterModel);

const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);
render(siteStatisticsElement, new FooterStatisticView(allMovies));

let statisticsComponent = null;

const handleSiteMenuClick = (newMenuItem) => {

  if (menuItem === newMenuItem) {
    return;
  }

  menuItem = newMenuItem;
  switch (menuItem) {
    case MenuItem.MOVIES:
      remove(statisticsComponent);
      movieListPresenter.init();
      filterPresenter.setActiveMenuItem(menuItem);
      break;
    case MenuItem.STATISTICS:
      movieListPresenter.destroy();
      filterPresenter.setActiveMenuItem(menuItem);
      statisticsComponent = new StatisticsView(moviesModel.getMovies());
      render(siteMainElement, statisticsComponent);
      break;
  }
};

// statsComponent.setClickHandler(handleSiteMenuClick);
filterPresenter.setClickHandler(handleSiteMenuClick);
handleSiteMenuClick(MenuItem.MOVIES);

