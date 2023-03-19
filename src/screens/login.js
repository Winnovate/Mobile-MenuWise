import {Box} from 'native-base';
import {StatusBar} from 'react-native';
import React from 'react';
import {colors} from '../../apptheme';
import LoginForm from '../components/login/loginForm';

const Login = ({navigation}) => {
  return (
    <Box background={colors.background} flex={'1'} paddingX={5} safeArea>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <Box flex={1}>
        <LoginForm navigation={navigation} />
      </Box>
    </Box>
  );
};
export default Login;
