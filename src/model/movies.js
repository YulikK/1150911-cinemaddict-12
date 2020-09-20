import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          title: movie.film_info.title,
          original: movie.film_info.alternative_title,
          rating: movie.film_info.total_rating,
          poster: movie.film_info.poster,
          age: movie.film_info.age_rating,
          director: movie.film_info.director,
          writers: movie.film_info.writers,
          actors: movie.film_info.actors,
          date: new Date(movie.film_info.release.date),
          country: movie.film_info.release.release_country,
          duration: movie.film_info.runtime,
          genres: movie.film_info.genre,
          description: movie.film_info.description,
          isWatchList: movie.user_details.watchlist,
          isWatched: movie.user_details.already_watched,
          watchingDate: movie.user_details.watching_date !== null
            ? new Date(movie.user_details.watching_date)
            : movie.user_details.watching_date,
          isFavorite: movie.user_details.favorite,
        }
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;
    return adaptedMovie;

  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          "film_info": {
            "title": movie.title,
            "alternative_title": movie.original,
            "total_rating": movie.rating,
            "poster": movie.poster,
            "age_rating": movie.age,
            "director": movie.director,
            "writers": movie.writers,
            "actors": movie.actors,
            "release": {
              "date": movie.date.toISOString(),
              "release_country": movie.country
            },
            "runtime": movie.duration,
            "genre": movie.genres,
            "description": movie.description
          },
          "user_details": {
            "watchlist": movie.isWatchList,
            "already_watched": movie.isWatched,
            "watching_date": movie.watchingDate instanceof Date ? movie.watchingDate.toISOString() : null,
            "favorite": movie.isFavorite
          },
          "comments": Movies._adaptComments(movie.comments)
        }
    );

    delete adaptedMovie.title;
    delete adaptedMovie.original;
    delete adaptedMovie.rating;
    delete adaptedMovie.poster;
    delete adaptedMovie.age;
    delete adaptedMovie.director;
    delete adaptedMovie.writers;
    delete adaptedMovie.actors;
    delete adaptedMovie.date;
    delete adaptedMovie.country;
    delete adaptedMovie.genres;
    delete adaptedMovie.duration;
    delete adaptedMovie.description;
    delete adaptedMovie.isWatchList;
    delete adaptedMovie.isWatched;
    delete adaptedMovie.watchingDate;
    delete adaptedMovie.isFavorite;

    return adaptedMovie;
  }

  static _adaptComments(comments) {
    return comments.map((comment) => comment.id);
  }


}
