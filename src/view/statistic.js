const getCountAllFilms = (filters) => {

  return filters.find(
      (filter) => {
        return filter.name === `all`;
      }).count;

};

export const createStatisticsTemplate = (filters) => {
  const countFilms = getCountAllFilms(filters);
  return (
    `<p>${countFilms} movies inside</p>`
  );
};
