// Real NASA images from public sources (Wikimedia Commons - NASA originals)
export const planetImages = {
  lunar: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/500px-FullMoon2010.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg',
    credit: 'NASA / Gregory H. Revera',
  },
  mars: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/500px-OSIRIS_Mars_true_color.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
    credit: 'ESA / OSIRIS Team',
  },
  earth: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/500px-The_Earth_seen_from_Apollo_17.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
    credit: 'NASA / Apollo 17',
  },
  jupiter: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/500px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    credit: 'NASA / Hubble',
  },
  saturn: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/500px-Saturn_during_Equinox.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
    credit: 'NASA / Cassini',
  },
};

export const getPlanetImage = (id) => planetImages[id] || planetImages.earth;
