import React from 'react';
import {NativeBaseProvider} from 'native-base';
import Navigator from './src/navigators/navigator';

export default function App() {
  return (
    <NativeBaseProvider>
      <Navigator />
    </NativeBaseProvider>
  );
}
