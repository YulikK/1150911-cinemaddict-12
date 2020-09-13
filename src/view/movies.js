import AbstractView from "./abstract.js";

const createMovieSectionTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class MovieSection extends AbstractView {

  getTemplate() {
    return createMovieSectionTemplate();
  }

}
