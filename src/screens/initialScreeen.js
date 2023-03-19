import {Heading} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import LanguageSelector from '../components/initial/languageSelector';
import LayoutWrapper from '../components/wrappers/LayoutWrapper';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';

const InitialScreen = ({navigation}) => {
  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then(statuses => {
        console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
        console.log('Microphone', statuses[PERMISSIONS.ANDROID.RECORD_AUDIO]);
        console.log('GPS', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <LayoutWrapper>
      <LanguageSelector navigation={navigation} />
    </LayoutWrapper>
  );
};

export default InitialScreen;
