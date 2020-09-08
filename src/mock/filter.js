const filmsToFilterMap = {
  all: (films) => films.filter((film) => film).length,
  watchList: (films) => films
    .filter((film) => film.isWatchList).length,
  history: (films) => films
    .filter((film) => film.isWatched).length,
  favorites: (films) => films
    .filter((film) => film.isFavorite).length,
};

export const generateFilters = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
