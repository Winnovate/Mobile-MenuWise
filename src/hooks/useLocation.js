import React, {useState} from 'react';
import {useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';

const useLocation = () => {
  const [granted, setGranted] = useState(null);

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
        console.log('You can use the camera');
        setGranted(true);
      } else {
        setGranted(false);
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return granted;
};

export default useLocation;
