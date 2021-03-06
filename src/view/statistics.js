import SmartView from "./smart.js";
import {setFirstCapital} from "../utils/common.js";
import {getUniqueItems} from "../utils/movie.js";
import {getWatchedMovieInTime, getCountWatchedMovieByGenre, countDuration, getHours, getMinuts} from "../utils/statistics.js";
import {StatisticsType, SelectionType, BAR_HEIGHT} from "../const.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const renderGenresChart = (genresCtx, uniqueGenres, countMovies) => {

  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: uniqueGenres,
      datasets: [{
        data: countMovies,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });

};

const createStatisticsFilterTemplate = (statisticFilter, checked) => {
  return (`
  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${StatisticsType[statisticFilter]}" value="${StatisticsType[statisticFilter]}" ${checked ? `checked=""` : ``}>
  <label for="statistic-${StatisticsType[statisticFilter]}" class="statistic__filters-label">${setFirstCapital(StatisticsType[statisticFilter])}</label>`);
};

const createStatisticsTemplate = (data) => {
  const statisticFilters = Object.keys(StatisticsType)
  .map((filterType) => createStatisticsFilterTemplate(filterType, StatisticsType[filterType] === data.filterType))
  .join(``);

  const moviesWatched = data.movies.filter((movie) => getWatchedMovieInTime(movie, data.filterType));
  const countDurationWatched = countDuration(moviesWatched);
  const durationH = getHours(countDurationWatched);
  const durationM = getMinuts(countDurationWatched);
  const uniqueGenres = getUniqueItems(moviesWatched, SelectionType.GENRES);
  const countMovies = uniqueGenres.map((genre) => getCountWatchedMovieByGenre(moviesWatched, genre));
  const topGenre = moviesWatched.length === 0 ? `` : uniqueGenres[countMovies.indexOf(Math.max(...countMovies))];

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${statisticFilters}

    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${moviesWatched.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${durationH} <span class="statistic__item-description">h</span> ${durationM} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Statistic extends SmartView {
  constructor(movies) {
    super();

    this._data = {
      movies,
      filterType: StatisticsType.ALL
    };

    this._genresCart = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._setCharts();
    this._setFilterChangeHandler(this._filterChangeHandler);
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  removeElement() {

    super.removeElement();

    if (this._genresCart !== null) {
      this._genresCart = null;
    }


  }

  restoreHandlers() {
    this._setCharts();
    this._setFilterChangeHandler(this._filterChangeHandler);
  }

  _setCharts() {
    if (this._genresCart !== null) {
      this._genresCart = null;
    }

    const {movies, filterType} = this._data;
    const genresCtx = this.getElement().querySelector(`.statistic__chart`);

    const moviesWatched = movies.filter((movie) => getWatchedMovieInTime(movie, filterType));
    const uniqueGenres = getUniqueItems(moviesWatched, SelectionType.GENRES);

    const countMovies = uniqueGenres.map((genre) => getCountWatchedMovieByGenre(moviesWatched, genre));

    if (uniqueGenres.length !== 0) {

      genresCtx.height = BAR_HEIGHT * uniqueGenres.length;
      this._genresCart = renderGenresChart(genresCtx, uniqueGenres, countMovies);

    }
  }

  _setFilterChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    const filterItems = this.getElement().querySelectorAll(`input[name=statistic-filter]`);
    filterItems
    .forEach((filterItem) => filterItem.addEventListener(`click`, this._filterChangeHandler));
  }

  _filterChangeHandler(evt) {

    const prevFilterType = this._data.filterType;

    if (prevFilterType === evt.target.value) {
      return;
    }

    this.updateData({
      filterType: evt.target.value
    });

    this.restoreHandlers();

  }

}
