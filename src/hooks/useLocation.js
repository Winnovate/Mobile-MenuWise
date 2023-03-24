import {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const useLocation = () => {
  const [granted, setGranted] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (granted === null) {
      requestLocationPermission();
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Location permission to show restruant menu based on your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setGranted(true);
        const watchId = Geolocation.watchPosition(
          position => {
            console.log(position, '-----------------------------------');
            if (position?.coords?.accuracy < 100) {
              setCoords({
                latitude: position?.coords?.latitude,
                longitude: position?.coords?.longitude,
              });
            }
          },
          error => alert('WatchPosition Error', JSON.stringify(error)),
          {
            interval: 1000,
            // enableHighAccuracy: true,
            distanceFilter: 0,
          },
        );
        setWatchId(watchId);
      } else {
        setGranted(false);
        alert('Please allow location access');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return [granted, coords, watchId];
};

export default useLocation;
