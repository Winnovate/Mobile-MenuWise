import {VStack, Text, Box, Heading, Button} from 'native-base';
import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';

import LayoutWrapper from '../wrappers/LayoutWrapper';

const Permission = ({handleActiveScreen}) => {
  //   const [, ] = useState();
  const {width, height} = Dimensions.get('window');

  const getPermissions = async () => {
    const {width, height} = Dimensions.get('window');
    try {
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then(statuses => {
        console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
        console.log('Microphone', statuses[PERMISSIONS.ANDROID.RECORD_AUDIO]);
        console.log('GPS', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
        handleActiveScreen(1);
      });
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <LayoutWrapper noFlex>
      <Box flex="1" flexDirection={'column'} justifyContent="space-between">
        <Box>
          <VStack marginTop="6" marginBottom="6">
            <Heading size={'md'} color="white">
              Location
            </Heading>
            <Text color="white">
              We use location to fetch menu based on your location
            </Text>
          </VStack>
          <VStack marginBottom="8">
            <Heading size={'md'} color="white">
              Camera
            </Heading>
            <Text color="white">
              We use camaera Permission to scan qr code to fetch menu.
            </Text>
          </VStack>

          <VStack marginBottom="8">
            <Heading size={'md'} color="white">
              Microphone
            </Heading>
            <Text color="white">
              We use microphone Permission to take user input using speech to
              text.
            </Text>
          </VStack>
        </Box>
        <Box>
          <Button onPress={getPermissions}>Set Permissions</Button>
        </Box>
      </Box>
    </LayoutWrapper>
  );
};

export default Permission;
