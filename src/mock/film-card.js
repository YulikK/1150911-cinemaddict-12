import {getRandomInteger, getRandomFloat} from "../utils.js";

const generateFilm = () => {
  const films = [
    {
      title: `Made for each other`,
      original: `Made for each other`,
      poster: `./images/posters/made-for-each-other.png`,
    },
    {
      title: `Popeye meets sinbad`,
      original: `Popeye meets sinbad`,
      poster: `./images/posters/popeye-meets-sinbad.png`,
    },
    {
      title: `Sagebrush trail`,
      original: `Sagebrush trail`,
      poster: `./images/posters/sagebrush-trail.jpg`,
    },
    {
      title: `Santa claus conquers the martians`,
      original: `Santa claus conquers the martians`,
      poster: `./images/posters/santa-claus-conquers-the-martians.jpg`,
    },
    {
      title: `The dance of life`,
      original: `The dance of life`,
      poster: `./images/posters/the-dance-of-life.jpg`,
    },
    {
      title: `The great flamarion`,
      original: `The great flamarion`,
      poster: `./images/posters/the-great-flamarion.jpg`,
    },
    {
      title: `The man with the golden arm`,
      original: `The man with the golden arm`,
      poster: `./images/posters/the-man-with-the-golden-arm.jpg`,
    },
  ];

  const randomIndex = getRandomInteger(0, films.length - 1);

  return films[randomIndex];
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

  const emoutions = [
    `smile`,
    `sleeping`,
    `puke`,
    `angry`
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
          emoution: emoutions[getRandomInteger(0, emoutions.length - 1)],
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

  let ganre = [];

  for (let i = 0; i < randomCount; i++) {
    ganre.push(genres[getRandomInteger(0, genres.length - 1)]);
  }
  return ganre;
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
  const film = generateFilm();
  const {title, poster, original} = film;

  return {
    title,
    original,
    poster,
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
