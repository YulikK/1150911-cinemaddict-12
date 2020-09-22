import moment from "moment";
import {getRandomInteger} from "../utils/common.js";

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

export const getRandomName = () => {
  const autors = [
    `Igor`,
    `Maks`,
    `Anna`
  ];
  return autors[getRandomInteger(0, autors.length - 1)];
};
