import React from 'react';
import {Box, Flex, Stack, } from 'native-base';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { StyleSheet } from 'react-native';
import { useStore } from '../../zustand/store/useStore';


const QrScannerScreen = ({navigation}) => {
  const setRestaurantId = useStore(state => state.setRestaurantId)

    const onSuccess = (data) => {
        console.log(data);
        setRestaurantId(data?.data);
        navigation.goBack();
    }

    setTimeout(()=>{
      const data = {
        data: "0d73ce9a-63bf-425a-b051-858ce0e3b249"
      }
      onSuccess(data)
    }, 5000)

    return (
        <>
    <Box
      safeArea
      style={{
        flex: 1,
        backgroundColor: "black",
        color: 'white',
      }}>
      <Flex
        flexDirection={'row'}
        justifyContent={'space-between'}
        marginBottom="6">
        
      </Flex>
      <Stack marginTop={3} >
      <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.off}
      containerStyle = {styles.qrScannerContainer}
      cameraContainerStyle = {styles.qrScannerContainer}
      />

      </Stack>
    </Box>
        </>
    )
}
const styles = StyleSheet.create({
    qrScannerContainer: {
        marginTop: "15%",
    },
  });

export default QrScannerScreen