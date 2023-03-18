import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useStore} from '../../zustand/store/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../screens/splashScreen';
import AppNavigator from './appNavigator';
import AuthNavigator from './authNavigator';

const Navigator = ({setUser}) => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useStore(state => state.user.isAuthenticated);

  const setUserData = useStore(state => state.manageUser);
  useEffect(() => {
    getUserName();
  }, []);

  const getUserName = async () => {
    try {
      const value = await AsyncStorage.getItem('@name');
      if (value !== null) {
        setUserData({name: value, isAuthenticated: true});
      } else {
        setUserData({name: '', isAuthenticated: false});
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};
export default Navigator;
