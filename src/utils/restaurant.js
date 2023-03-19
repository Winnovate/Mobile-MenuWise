import database from '@react-native-firebase/database';
import localizeText from './localizeText';

export const fetchRestaurantFirebase = (
  payload,
  setRestaurantData,
  language,
) => {
  return database()
    .ref('/restruants/' + payload)
    .once('value')
    .then(async snapShot => {
      console.log(payload, snapShot.val(), 'Dsdsvdsvcsd');
      let finalData = snapShot.val();
      if (language != 'en') {
        const itemConverted = await Promise.all(
          snapShot.val()?.items?.map(async item => {
            return {
              ...item,
              details: await localizeText('fr', item?.details),
            };
          }),
        );

        const catConverted = await Promise.all(
          Object.keys(snapShot.val()?.['menu-categories'])?.map(
            async catKey => {
              return {
                id: catKey,
                name: await localizeText(
                  'fr',
                  snapShot.val()?.['menu-categories']?.[catKey]?.name,
                ),
              };
            },
          ),
        );
        const catConvertedObj = {};
        catConverted.forEach(element => {
          catConvertedObj[element?.id] = {
            id: element?.id,
            name: element?.name?.[0],
          };
        });

        finalData = {
          ...snapShot.val(),
          items: itemConverted.map(item => ({
            ...item,
            details: item?.details[0],
          })),
          ['menu-categories']: catConvertedObj,
        };
      }
      console.log(finalData, 'dsfsdfsdfsdfsdfdfffffffffffffffff');
      setRestaurantData({...finalData, status: true});
      return {...finalData, status: true};
    })
    .catch(error => {
      return {status: false};
    });
};

export const postOrdersFirebase = (payload, resId, orderid) => {
  return database()
    .ref('/restruants/' + resId + '/orders/' + orderid)
    .set(payload)
    .then(() => {
      return {status: true};
    })
    .catch(err => {
      throw err;
    });
};
