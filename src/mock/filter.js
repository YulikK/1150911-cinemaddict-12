const moviesToFilterMap = {
  all: (movies) => movies.filter((movie) => movie).length,
  watchList: (movies) => movies
    .filter((movie) => movie.isWatchList).length,
  history: (movies) => movies
    .filter((movie) => movie.isWatched).length,
  favorites: (movies) => movies
    .filter((movie) => movie.isFavorite).length,
};

export const generateFilters = (movies) => {
  return Object.entries(moviesToFilterMap).map(([filterName, countMovies]) => {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
