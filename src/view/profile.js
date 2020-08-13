import {RATING} from "../const.js";

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

export const createProfileTemplate = (filters, profile) => {
  const {avatar} = profile;
  const rating = getRating(filters);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
    </section>`
  );
};
