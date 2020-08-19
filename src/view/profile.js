import {RATING} from "../const.js";
import {createElement} from "../utils.js";

const getRating = (filters) => {

  const countWatched = filters.find(
      (filter) => {
        return filter.name === `history`;
      }).count;

  let ratingProfile = ``;

  const keys = Object.keys(RATING);

  keys.forEach((key) => {

    if (key <= countWatched) {
      ratingProfile = RATING[key];
    }

  });

  return ratingProfile;

};

const createProfileTemplate = (filters) => {
  const rating = getRating(filters);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

