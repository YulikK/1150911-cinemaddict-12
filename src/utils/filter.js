import {FilterType} from "../const";

export const filter = {
  [FilterType.ALL]: (movies) => movies.slice(),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isWatchList),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite)
};
