const filmsToFilterMap = {
  all: (films) => films.filter((film) => film).length,
  watchlist: (films) => films
    .filter((film) => film.isWatchlist).length,
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
