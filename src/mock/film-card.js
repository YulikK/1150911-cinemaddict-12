import {getRandomInteger, getRandomFloat} from "../utils.js";
import {EMOTIONS, POSTERS_FOLDER} from "../const.js";

const generateTitle = () => {
  const titles = [
    `Made for each other`,
    `Popeye meets sinbad`,
    `Sagebrush trail`,
    `Santa claus conquers the martians`,
    `The dance of life`,
    `The great flamarion`,
    `The man with the golden arm`,
  ];

  return titles[getRandomInteger(0, titles.length - 1)];
};

const generateOriginalName = () => {
  const originalNames = [
    `Made for each other`,
    `Popeye meets sinbad`,
    `Sagebrush trail`,
    `Santa claus conquers the martians`,
    `The dance of life`,
    `The great flamarion`,
    `The man with the golden arm`,
  ];

  return originalNames[getRandomInteger(0, originalNames.length - 1)];
};

const generatePoster = () => {
  const posters = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`,
  ];

  return POSTERS_FOLDER + posters[getRandomInteger(0, posters.length - 1)];

};
const generateDescription = () => {
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];

  const randomCount = getRandomInteger(1, 5);

  let description = ``;


  for (let i = 0; i < randomCount; i++) {
    description += descriptions[getRandomInteger(0, descriptions.length - 1)] + (i < randomCount - 1 ? ` ` : ``);
  }
  return description;
};

const generateDate = () => {

  const maxDaysGap = 365 * 50;
  const daysGap = getRandomInteger(0, maxDaysGap);
  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() - daysGap);

  return new Date(currentDate);
};

const generateComments = () => {
  const texts = [
    `Booo`,
    `Wow!`,
    `Greate!`,
  ];

  const autors = [
    `Igor`,
    `Maks`,
    `Anna`
  ];

  const commentsCount = getRandomInteger(0, 5);

  const comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments.push(
        {
          autor: autors[getRandomInteger(0, autors.length - 1)],
          text: texts[getRandomInteger(0, texts.length - 1)],
          emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
          date: generateDate(),
        }
    );
  }

  return comments;
};

const generateRating = () => {

  return getRandomFloat(1, 10, 1);

};

const generateDuration = () => {

  return getRandomFloat(1, 2);

};

const generateGenre = () => {
  const genres = [
    `Сomedy`,
    `Romcom`,
    `sci-fi`,
    `Horror`,
    `Documentary`,
    `Action`,
    `Adventure`,
  ];

  const randomCount = getRandomInteger(1, 3);

  let genre = [];

  for (let i = 0; i < randomCount; i++) {
    genre.push(genres[getRandomInteger(0, genres.length - 1)]);
  }
  return genre;
};

const generateDirector = () => {
  const directors = [
    `Steven Spielberg`,
    `Alfred Hitchcock`,
    `Martin Scorsese`,
    `Christopher Nolan`,
    `James Cameron`
  ];
  return directors[getRandomInteger(0, directors.length - 1)];
};

const generateCountry = () => {
  const countrys = [
    `USA`,
    `Canada`,
    `India`,
    `Germany`
  ];
  return countrys[getRandomInteger(0, countrys.length - 1)];
};


const generateWriters = () => {
  const writersAll = [
    `Anne Wigton`,
    `Heinz Herald`,
    `Richard Weil`,
  ];

  const randomCount = getRandomInteger(1, 3);

  let writers = ``;


  for (let i = 0; i < randomCount; i++) {
    writers += writersAll[getRandomInteger(0, writersAll.length - 1)] + (i < randomCount - 1 ? `, ` : ``);
  }
  return writers;
};

const generateActors = () => {
  const actorsAll = [
    `Johnny Depp`,
    `Al Pacino`,
    `Robert De Niro`,
  ];

  const randomCount = getRandomInteger(1, 3);

  let actors = ``;


  for (let i = 0; i < randomCount; i++) {
    actors += actorsAll[getRandomInteger(0, actorsAll.length - 1)] + (i < randomCount - 1 ? `, ` : ``);
  }
  return actors;
};

export const generateFilmCard = () => {
  return {
    title: generateTitle(),
    original: generateOriginalName(),
    poster: generatePoster(),
    age: getRandomInteger(0, 18) + `+`,
    description: generateDescription(),
    comments: generateComments(),
    rating: generateRating(),
    date: generateDate(),
    duration: generateDuration(),
    genres: generateGenre(),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    country: generateCountry(),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
