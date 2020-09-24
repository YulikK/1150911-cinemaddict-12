import AbstractView from "./abstract.js";

export const createRecommendedTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class RecommendedList extends AbstractView {

  getTemplate() {
    return createRecommendedTemplate();
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
