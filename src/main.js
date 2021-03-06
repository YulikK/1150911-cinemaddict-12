import ProfileView from "./view/profile.js";
import StatisticsView from "./view/statistics.js";
import FooterStatisticView from "./view/footer-statistic.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {render, remove} from "./utils/render.js";
import {MenuItem, UpdateType} from "./const.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilterPresenter from "./presenter/filter.js";
import IndexApi from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic i83jha8f73jhtn3po`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

let menuItem = null;

const api = new IndexApi(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);
const siteStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

const profileElement = new ProfileView();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const movieListPresenter = new MovieListPresenter(profileElement, siteMainElement, siteBodyElement, moviesModel, filterModel, apiWithProvider);

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

render(siteHeaderElement, profileElement);
movieListPresenter.init();

apiWithProvider.getMovies()
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
    moviesModel.setMovies(UpdateType.INIT, null, moviesArray);
    filterPresenter.init();
    filterPresenter.setClickHandler(handleSiteMenuClick);
    render(siteStatisticsElement, new FooterStatisticView(moviesArray.length));

  })

  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, null, []);
    filterPresenter.init();
    filterPresenter.setClickHandler(handleSiteMenuClick);

  });
});

window.addEventListener(`load`, () => navigator.serviceWorker.register(`/sw.js`));

window.addEventListener(`online`, () => {
  document.title = document.title.replace(`[offline] `, ``);
  apiWithProvider.sync();
  movieListPresenter.updateState(true);
});

window.addEventListener(`offline`, () => {
  document.title = `[offline] ` + document.title;
  movieListPresenter.updateState(false);
});
