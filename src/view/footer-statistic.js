
import AbstractView from "./abstract.js";

const createStatisticsTemplate = (allMovies) => {
  return (
    `<p>${allMovies} movies inside</p>`
  );
};

export default class Statistic extends AbstractView {
  constructor(allMovies) {
    super();
    this._allMovies = allMovies;
  }

  getTemplate() {
    return createStatisticsTemplate(this._allMovies);
  }

}

