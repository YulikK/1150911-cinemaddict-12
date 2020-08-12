const getDescriptionView = (description) => {
  return description.length > 140
    ? description.substr(0, 139) + `...`
    : description;
};

export const createFilmCardTemplate = (filmCard) => {
  const {title, poster, description, comments} = filmCard;
  const descriptionView = getDescriptionView(description);
  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">8.3</p>
        <p class="film-card__info">
          <span class="film-card__year">1929</span>
          <span class="film-card__duration">1h 55m</span>
          <span class="film-card__genre">Musical</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${descriptionView}/p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
      </article>`
  );
};
