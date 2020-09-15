import {RATING} from "../const.js";
import AbstractView from "./abstract.js";

const getRating = (watched) => {

  let ratingProfile = ``;

  const keys = Object.keys(RATING);

  keys.forEach((key) => {

    if (key <= watched) {
      ratingProfile = RATING[key];
    }

  });

  return ratingProfile;

};

const createProfileTemplate = (watched) => {
  const rating = getRating(watched);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractView {
  constructor(watched) {
    super();
    this._watched = watched;
  }

  getTemplate() {
    return createProfileTemplate(this._watched);
  }

}

