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
import OrdersScreen from '../screens/orders';
import SpeakToSearchScreen from '../screens/speakToSearch';

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

        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            title: 'Order Cart',
            headerTintColor: colors.text,
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />

        <Stack.Screen
          name="SpeakToText"
          component={SpeakToSearchScreen}
          options={{
            title: 'Speak to Search',
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
