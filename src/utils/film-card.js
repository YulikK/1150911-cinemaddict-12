export const humanizeFilmDuration = (duration) => {
  return Math.floor(duration) + `h ` + Math.floor((duration - Math.floor(duration)) * 100) + `m`;
};

export const humanizeFilmDate = (date) => {
  return date.toLocaleString(`en-US`, {day: `numeric`, month: `long`, year: `numeric`}, `dd mmmm yyyy`);
};

export const humanizeFilmShortDate = (date) => {
  return date.toLocaleString(`en-US`, {year: `numeric`});
};
