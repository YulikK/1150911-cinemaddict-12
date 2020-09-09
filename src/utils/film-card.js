import moment from "moment";

export const formatFilmDuration = (duration) => {
  const hours = moment.duration(duration, `minutes`).hours();
  const minutes = moment.duration(duration, `minutes`).minutes();
  return `${hours === 0 ? `` : hours}${hours === 0 ? `` : `h `}${minutes}m`;
};

export const formatFilmDate = (date, format) => {
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

export const sortByDate = (filmA, filmB) => {

  const weight = getWeightForNullDate(filmA.date, filmB.date);

  if (weight !== null) {
    return weight;
  }

  return filmA.date.getTime() - filmB.date.getTime();
};

export const sortByRating = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.rating, filmB.rating);

  if (weight !== null) {
    return weight;
  }

  return filmB.rating - filmA.rating;
};
