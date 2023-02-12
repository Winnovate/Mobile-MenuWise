import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const fetchRestaurantFirebase = (payload, setRestaurantData) => {
    return database()
    .ref('/restruants/'+ payload)
    .once('value')
    .then(snapShot => {
      console.log(payload,snapShot.val(), "Dsdsvdsvcsd")
      setRestaurantData({...snapShot.val(), status: true})
      return {...snapShot.val(), status: true};
    })
    .catch(error => {
      return {status: false};
    });
}