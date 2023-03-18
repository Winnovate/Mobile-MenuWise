import database from '@react-native-firebase/database';
import getDistance from './getDistance';

export const fetchRestraurantByLocation = async coords => {
  const restList = await database()
    .ref('/restruants/')
    .once('value')
    .then(snapShot => {
      return {...snapShot.val(), status: true};
    })
    .catch(error => {
      console.log(error);
      return {status: false};
    });
  let restLocCoords = [];
  Object.keys(restList).forEach(restId => {
    if (restList[restId]?.['general-info']?.['coordinates']) {
      const resCoords = {
        latitude:
          restList[restId]?.['general-info']?.['coordinates']?.split(',')[0],
        longitude:
          restList[restId]?.['general-info']?.['coordinates']?.split(',')[1],
      };
      restLocCoords.push({
        name: restList[restId]?.['general-info']?.name
          ? restList[restId]?.['general-info']?.name
          : '',
        id: restId,
        generalInfo: restList[restId]?.['general-info'],
        distance: getDistance({...coords}, {...resCoords}),
      });
    }
  });

  restLocCoords = restLocCoords
    ?.filter(res => res?.distance <= 60)
    ?.sort((r1, r2) => r1?.distance - r2?.distance);

  return restLocCoords;
};
