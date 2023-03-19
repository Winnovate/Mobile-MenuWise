import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/login';
import InitialScreen from '../screens/initialScreeen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
      })}>
      <Stack.Screen name="initialScreen" component={InitialScreen} />
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
};
export default AuthNavigator;
