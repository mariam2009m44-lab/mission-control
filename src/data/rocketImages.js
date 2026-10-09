export const rocketImages = {
  small: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Electron_rocket_launch_%28cropped%29.jpg/400px-Electron_rocket_launch_%28cropped%29.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Electron_rocket_launch_%28cropped%29.jpg',
    realName: 'Rocket Lab Electron',
    credit: 'Rocket Lab',
  },
  medium: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Falcon_9_Demo-2_Launch_%283x2%29.jpg/400px-Falcon_9_Demo-2_Launch_%283x2%29.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Falcon_9_Demo-2_Launch_%283x2%29.jpg',
    realName: 'SpaceX Falcon 9',
    credit: 'SpaceX / NASA',
  },
  heavy: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Artemis_1_Launch_%28NHQ202211160009%29.jpg/400px-Artemis_1_Launch_%28NHQ202211160009%29.jpg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Artemis_1_Launch_%28NHQ202211160009%29.jpg',
    realName: 'NASA SLS',
    credit: 'NASA / Joel Kowsky',
  },
};

export const getRocketImage = (id) => rocketImages[id] || rocketImages.small;
