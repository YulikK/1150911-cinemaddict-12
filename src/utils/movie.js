import moment from "moment";
import {makeItemsUnique} from "../utils/common.js";
import {SelectionType, CARD_EXTRA_COUNT, MAX_DESCRIPTION_LENGTH} from "../const.js";

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
  return moment(date).fromNow();
};

export const formatMovieDescription = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return description.slice(0, MAX_DESCRIPTION_LENGTH - 1) + `...`;
  } else {
    return description;
  }
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

export const getUniqueItems = (movies, type) => {

  const allValues = [].concat(...movies.map((movie) => {
    let selectedValue;
    switch (type) {
      case SelectionType.RATING:
        selectedValue = movie.rating;
        break;
      case SelectionType.COMMENTS:
        selectedValue = movie.comments.length;
        break;
      case SelectionType.GENRES:
        selectedValue = movie.genres;
    }
    return selectedValue;
  }));

  const uniqueValues = makeItemsUnique(allValues);
  return uniqueValues.sort(sortByCount);

};

const getExtraMovieItems = (movies, uniqueValues, type) => {

  const extraMoviList = [];
  const moviesLast = movies.map((item) => item);

  let uniqueValueIndex = 0;

  while (extraMoviList.length < CARD_EXTRA_COUNT) {
    const currentUniqueValue = uniqueValues[uniqueValueIndex];

    if (currentUniqueValue > 0) {

      const sameMovieValues = moviesLast.filter((movie) => {
        let selectedValue;
        switch (type) {
          case SelectionType.RATING:
            selectedValue = movie.rating;
            break;
          case SelectionType.COMMENTS:
            selectedValue = movie.comments.length;
            break;
        }
        return selectedValue === currentUniqueValue;
      });

      for (let i = 0; i <= Math.min(sameMovieValues.length, CARD_EXTRA_COUNT - extraMoviList.length); i++) {
        const indexRandomMovie = Math.floor(Math.random() * sameMovieValues.length);
        extraMoviList.push(sameMovieValues[indexRandomMovie]);
        sameMovieValues.splice(indexRandomMovie, 1);
      }

    }

    uniqueValueIndex++;

  }

  return extraMoviList;

};

export const getExtraMovies = (movies, type) => {

  const uniqueCommentsCount = getUniqueItems(movies, type);

  return getExtraMovieItems(movies, uniqueCommentsCount, type);

};
