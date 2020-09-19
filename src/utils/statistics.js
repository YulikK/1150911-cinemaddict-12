import moment from "moment";
import {StatisticsType} from "../const.js";
import {getCurrentDate} from "./common.js";

export const getCountWatchedMovieByGenre = (movies, genre) => {
  return movies.filter((movie) => movie.genres.includes(genre)).length;
};

export const getWatchedMovieInTime = (movie, filterType) => {

  if (!movie.isWatched) {
    return false;
  }

  const currentDate = getCurrentDate();
  let time = null;
  switch (filterType) {
    case StatisticsType.ALL:
      return true;
    case StatisticsType.TODAY:
      time = `day`;
      break;
    case StatisticsType.WEEK:
      time = `week`;
      break;
    case StatisticsType.MONTH:
      time = `month`;
      break;
    case StatisticsType.YEAR:
      time = `year`;
      break;
  }

  return moment(movie.watchingDate).isSame(currentDate, time);

};

export const countDuration = (movies) => {
  return movies.reduce((counter, movie) => {
    if (movie.duration === null) {
      return counter;
    }
    return counter + movie.duration;
  }, 0);
};

export const getHours = (duration) => {
  return moment.duration(duration, `minutes`).hours();
};

export const getMinuts = (duration) => {
  return moment.duration(duration, `minutes`).minutes();
};
