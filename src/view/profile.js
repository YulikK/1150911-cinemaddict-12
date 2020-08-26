import {RATING} from "../const.js";
import AbstractView from "./abstract.js";

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

export default class Profile extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createProfileTemplate(this._filters);
  }

}

