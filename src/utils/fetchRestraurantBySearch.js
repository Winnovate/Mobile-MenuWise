import database from '@react-native-firebase/database';
import Fuse from 'fuse.js';

export const fetchRestraurantBySearch = async searchValues => {
  const restList = await database()
    .ref('/restruants/')
    .once('value')
    .then(snapShot => {
      console.log(snapShot.val(), 'Dsdsvdsvcsd');
      return {...snapShot.val(), status: true};
    })
    .catch(error => {
      console.log(error);
      return {status: false};
    });
  console.log(restList, 'DSfsdfsdfsdf');

  const restNameID = [];
  Object.keys(restList).forEach(restId => {
    if (restList[restId]?.['general-info']?.name) {
      restNameID.push({
        name: restList[restId]?.['general-info']?.name
          ? restList[restId]?.['general-info']?.name
          : '',
        id: restId,
        generalInfo: restList[restId]?.['general-info'],
      });
    }
  });
  const options = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ['name'],
  };

  const fuse = new Fuse(restNameID, options);

  // Change the pattern
  const res = fuse.search(searchValues[0]);

  return res;
};
