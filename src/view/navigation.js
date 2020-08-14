import {ucFirst} from "../utils.js";

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}"
      class="main-navigation__item ${isChecked ? ` main-navigation__item--active` : ``}">
      ${name === `all` ? ucFirst(name) + ` movies` : ucFirst(name)}
      ${name === `all` ? `` : ` <span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

export const createNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
