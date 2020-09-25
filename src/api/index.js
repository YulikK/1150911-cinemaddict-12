import MoviesModel from "../model/movies.js";
import CommentsModel from "../model/comments.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Index {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    const moviesData = this._load({url: `movies`})
    .then(Index.toJSON)
    .then((movies) => movies.map(MoviesModel.adaptToClient));

    return moviesData;
  }

  getComments(movie) {
    return this._load({url: `comments/${movie.id}`})
      .then(Index.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Index.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  addComment(movie, comment) {
    return this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Index.toJSON)
      .then((response) => response.comments.map(CommentsModel.adaptToClient));
  }

  deleteComment(comment) {
    return this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Index.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Index.checkStatus)
      .catch(Index.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
