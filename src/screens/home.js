import React, {useEffect, useState} from 'react';
import {Box, Button, Flex,  HStack, Stack, Text, VStack} from 'native-base';
import { Linking} from "react-native";
import {getAllData} from '../utils/user';
// import {Notifications} from 'react-native-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../apptheme';
import Header from '../components/common/header';
import Profile from '../components/common/profile';
import {useStore} from '../../zustand/store/useStore';
import PetcareModal from '../components/petcareModal';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Tts from 'react-native-tts';
import MultiTap from 'react-native-multitap'
import { fetchRestaurantFirebase } from '../utils/restaurant';


const HomeScreen = ({navigation}) => {
  const userEmail = useStore(state => state.user.email);
  const user = useStore(state =>state.user)
  const isAuthenticated = useStore(state => state.user.isAuthenticated)
  // const setPetDetails = useStore(state => state.updatePetInfo)
  // const setVaccineData = useStore(state => state.updateVaccine)
  // const setAppointmets = useStore(state => state.updateAppointments)
  // const [petModal, setPetModal] = useState(false)
  const setRestaurantData = useStore(state => state.setRestaurantData)
  const restaurantId = useStore(state => state.restaurantId)
  const setRestaurantId = useStore(state => state.setRestaurantId)
  const [active, setActive] = useState(1)
  const invokesFuntions = {
    1: () => {
      navigation.navigate('QRScanner')
    },
    2: () => {
      console.log("someData")
    },
    singleTapRepeat: () => {
      Tts.speak(componentArray[active-1].text);
    }
  }
  
  useEffect(() => {
    if(isAuthenticated && user?.uid){
      getAllData(user.uid).then(res => {
      });
    }
  }, [user?.uid, isAuthenticated])

  useEffect(() => {
    console.log("Activate changed")
    Tts.speak(componentArray[active-1].text);
  }, [active])

  useEffect(() => {
    if(typeof restaurantId === "string" && restaurantId.length > 0){
      fetchRestaurantFirebase(restaurantId, setRestaurantData).then(res => {
        if(res.status){
          navigation.navigate('MenuCat')
        }
      })
    }
  }, [restaurantId])

  const handleUrl = async (url) => {
    await Linking.openURL(url);
  }

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        if(active === 1){
          setActive(2)
        }else{
          setActive(1)
        }
        break;
      case SWIPE_DOWN:
        if(active === 2){
          setActive(1)
        }else{
          setActive(2)
        }
        break;
      case SWIPE_LEFT:
        alert("Left")
        break;
      case SWIPE_RIGHT:
       alert('right')
        break;
    }
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  //Handles notification sending for feeding the pet
  const handleQRScanner = () => {
    navigation.navigate('QRScanner')
  }

  const handleDoubleTap = () => {
    if(active === 1){
      invokesFuntions[1]();
    }else if(active === 2){
      invokesFuntions[2]();
    }
  }

  const handleSingleTap = () => {
    invokesFuntions['singleTapRepeat']();
  }

  const componentArray = [
    {
      id: 1,
      text: "Scan qr code to fetch the menu",
      component: (
        <HStack flex= "1">
        <Button onPress = {handleQRScanner}  width="full"  backgroundColor={colors.backgroundLight}  >
          <Ionicons name="qr-code-outline" color={colors.headeline} size={120} />
          <Text color="white">Qr Scanner </Text>
        </Button>
        </HStack>
      )
    },
    {
      id: 2,
      text: "Search by Speaking",
      component: (
        <HStack flex= "1" >
        <Button onPress={() => handleUrl('https://miteshgabani.github.io/Temperature/')}  width="full" height={"full"} backgroundColor={colors.backgroundLight} >
          <VStack  alignItems="center">
            <Ionicons name="mic" color={colors.headeline} size={120} />
            <Text color="white">Speak to Search</Text>
          </VStack>
        </Button>
        </HStack>
      )
    }
  ]

  return (
    <Box
      safeArea
      paddingX={4}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        color: 'white',
      }}>
      <Flex
        flexDirection={'row'}
        justifyContent={'space-between'}
        marginBottom="6">
        <Header label={'Welcome to MenuWise'}>
          <Ionicons name="heart" color={colors.headeline} size={20} />
        </Header>
        <Profile email={userEmail} navigation={navigation} />
      </Flex>
      <Stack marginTop={6}  height="80%"   >
        {
          componentArray?.map(com => {
            return (
              <Box mb="2" borderRadius={10} flex={1} key = {com.id} borderWidth={3} borderColor = {active === com.id ? 'red.400' : '#3b3b44'}>
                {com.component}
              </Box>
            )
          })
        }
        
      <GestureRecognizer
        onSwipe={(direction, state) => onSwipe(direction, state)}
        config={config}
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.1)"
        }}
        >
          <MultiTap
            onDoubleTap={() => handleDoubleTap()}
            onSingleTap={() => handleSingleTap()}
            onTripleTap={() => alert("Triple tapped")}
            onNTaps={(n) => { alert("I was tapped " + n + " times") }}
            onLongPress={() => alert("Long pressed")}
            delay={300}>
            <Box  height={'full'}>
                <Text>Tap Me</Text>
            </Box>
        </MultiTap>
        {/* <Text>onSwipe callback received gesture: {this.state.gestureName}</Text> */}
        </GestureRecognizer>
        </Stack>
    </Box>
  );
};
export default HomeScreen;
