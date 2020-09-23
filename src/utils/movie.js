import moment from "moment";
import {getRandomInteger, makeItemsUnique} from "../utils/common.js";

export const formatMovieDuration = (duration) => {
  const hours = moment.duration(duration, `minutes`).hours();
  const minutes = moment.duration(duration, `minutes`).minutes();
  return `${hours === 0 ? `` : hours}${hours === 0 ? `` : `h `}${minutes}m`;
};

export const formatMovieDate = (date, format) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(format);
};

export const formatCommentDate = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).fromNow(moment());
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortByDate = (movieA, movieB) => {

  const weight = getWeightForNullDate(movieA.date, movieB.date);

  if (weight !== null) {
    return weight;
  }

  return movieB.date.getTime() - movieA.date.getTime();
};

export const sortByRating = (movieA, movieB) => {
  const weight = getWeightForNullDate(movieA.rating, movieB.rating);

  if (weight !== null) {
    return weight;
  }

  return movieB.rating - movieA.rating;
};

export const sortByCount = (ratingA, ratingB) => {
  const weight = getWeightForNullDate(ratingA, ratingB);

  if (weight !== null) {
    return weight;
  }

  return ratingB - ratingA;
};

export const getRandomName = () => {
  const autors = [
    `Igor`,
    `Maks`,
    `Anna`
  ];
  return autors[getRandomInteger(0, autors.length - 1)];
};

export const getTopRatedMovies = (movies) => {

  const topRatedMovies = [];
  let moviesLast = movies.map((item) => item);

  const movieRating = [].concat(...movies.map((movie) => movie.rating));
  const uniqueRating = makeItemsUnique(movieRating);
  uniqueRating.sort(sortByCount);

  uniqueRating.forEach((rating) => {

    if (rating > 0) {
      const sameRateMovie = moviesLast.filter((movie) => movie.rating === rating);

      for (let i = 0; i <= sameRateMovie.length; i++) {
        let indexRandomMovie = Math.floor(Math.random() * sameRateMovie.length);
        if (topRatedMovies.length < 2) {
          topRatedMovies.push(sameRateMovie[indexRandomMovie]);
        }
        sameRateMovie.splice(indexRandomMovie, 1);
      }

    }
  });

  return topRatedMovies;

};

export const getMostRecommentedMovies = (movies) => {

  const mostRecommentedMovies = [];
  let moviesLast = movies.map((item) => item);

  const movieCommentsCount = [].concat(...movies.map((movie) => movie.comments.length));
  const uniqueCommentsCount = makeItemsUnique(movieCommentsCount);
  uniqueCommentsCount.sort(sortByCount);

  uniqueCommentsCount.forEach((commentsCount) => {

    if (commentsCount > 0) {
      const sameCommentsCountMovie = moviesLast.filter((movie) => movie.comments.length === commentsCount);

      for (let i = 0; i <= sameCommentsCountMovie.length; i++) {
        let indexRandomMovie = Math.floor(Math.random() * sameCommentsCountMovie.length);
        if (mostRecommentedMovies.length < 2) {
          mostRecommentedMovies.push(sameCommentsCountMovie[indexRandomMovie]);
        }
        sameCommentsCountMovie.splice(indexRandomMovie, 1);
      }

    }
  });

  return mostRecommentedMovies;

};

export const formatMovieDescription = (description) => {
  if (description.length > 140) {
    return description.slice(0, 139) + `...`;
  } else {
    return description;
  }
};
