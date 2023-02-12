import React from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../../apptheme';
import HomeScreen from '../screens/home';
import SettingsScreen from '../screens/settings';
import AppointmentScreen from '../screens/appointment';
import QrScannerScreen from '../screens/qrScanner';
import MenuCatScreen from '../screens/menuCat';
import MenuItmesScreen from '../screens/items';



const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerTintColor: colors.text,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
        <Stack.Screen
          name="Appointment"
          component={AppointmentScreen}
          options={{
            title: 'Appointments',
            headerTintColor: colors.text,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />

        <Stack.Screen
          name="QRScanner"
          component={QrScannerScreen}
          options={{
            title: 'QrScanner',
            headerTintColor: colors.text,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />

        <Stack.Screen
          name="MenuCat"
          component={MenuCatScreen}
          options={{
            title: 'Menu',
            headerTintColor: colors.text,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />

        <Stack.Screen
          name="Items"
          component={MenuItmesScreen}
          options={{
            title: 'Menu',
            headerTintColor: colors.text,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
};
export default AppNavigator;
