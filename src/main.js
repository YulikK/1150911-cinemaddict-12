import ProfileView from "./view/profile.js";
// import StatsView from "./view/stats.js";
import StatisticsView from "./view/statistics.js";
import FooterStatisticView from "./view/footer-statistic.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {generateCountMovies} from "./mock/statistics.js";
import {render, remove} from "./utils/render.js";
import {filter} from "./utils/filter.js";
import {FilterType, MenuItem, UpdateType} from "./const.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilterPresenter from "./presenter/filter.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic i83jha8f73jhtn3po`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
let menuItem = null;

const api = new Api(END_POINT, AUTHORIZATION);

const allMovies = generateCountMovies();

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

render(siteHeaderElement, new ProfileView(filter[FilterType.HISTORY](moviesModel.getMovies()).length));
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

const movieListPresenter = new MovieListPresenter(siteMainElement, siteBodyElement, moviesModel, filterModel, api);

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

movieListPresenter.init();

api.getMovies()
.then((movies) => {

  const promisComment = movies.map((movie) => api.getComments(movie));

  Promise.all(promisComment)
  .then((comments) => {
    movies.forEach((movie) => {
      movie.comments = comments[movies.indexOf(movie)];
    });
    return movies;
  })

  .then((moviesArray) => {
    moviesModel.setMovies(UpdateType.INIT, moviesArray);
    filterPresenter.init();
    filterPresenter.setClickHandler(handleSiteMenuClick);

  })

  .catch(() => {

    moviesModel.setMovies(UpdateType.INIT, []);
    filterPresenter.init();
    filterPresenter.setClickHandler(handleSiteMenuClick);

  });
});

