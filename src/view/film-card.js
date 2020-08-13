import {humanizeFilmDuration, humanizeFilmShortDate} from "../utils.js";

export const createFilmCardTemplate = (filmCard) => {
  const {title, poster, description, comments, rating, date, duration, genres, isWatchlist, isWatched, isFavorite} = filmCard;
  const markTemplate = ` film-card__controls-item--active`;

  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${humanizeFilmShortDate(date)}</span>
          <span class="film-card__duration">${humanizeFilmDuration(duration)}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${isWatchlist ? markTemplate : ``}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${isWatched ? markTemplate : ``}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite${isFavorite ? markTemplate : ``}">Mark as favorite</button>
        </form>
      </article>`
  );
};
