import AbstractView from "./abstract.js";

const createMovieTopListTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};


export default class TopList extends AbstractView {

  getTemplate() {
    return createMovieTopListTemplate();
  }

  getContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
