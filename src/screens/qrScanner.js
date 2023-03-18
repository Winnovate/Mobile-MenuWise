import React from 'react';
import {Box, Flex, Stack} from 'native-base';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {StyleSheet} from 'react-native';
import {useStore} from '../../zustand/store/useStore';

const QrScannerScreen = ({navigation}) => {
  const setRestaurantId = useStore(state => state.setRestaurantId);

  const onSuccess = data => {
    setRestaurantId(data?.data);
    navigation.goBack();
  };

  return (
    <>
      <Box
        safeArea
        style={{
          flex: 1,
          backgroundColor: 'black',
          color: 'white',
        }}>
        <Flex
          flexDirection={'row'}
          justifyContent={'space-between'}
          marginBottom="6"></Flex>
        <Stack marginTop={3}>
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
            containerStyle={styles.qrScannerContainer}
            cameraContainerStyle={styles.qrScannerContainer}
          />
        </Stack>
      </Box>
    </>
  );
};
const styles = StyleSheet.create({
  qrScannerContainer: {
    marginTop: '15%',
  },
});

export default QrScannerScreen;
