export const humanizeFilmDuration = (duration) => {
  return Math.floor(duration) + `h ` + Math.floor((duration - Math.floor(duration)) * 100) + `m`;
};

export const humanizeFilmDate = (date) => {
  return date.toLocaleString(`en-US`, {day: `numeric`, month: `long`, year: `numeric`}, `dd mmmm yyyy`);
};

export const humanizeFilmShortDate = (date) => {
  return date.toLocaleString(`en-US`, {year: `numeric`});
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
