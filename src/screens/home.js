import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from 'native-base';
import {Linking} from 'react-native';
import {getAllData} from '../utils/user';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../apptheme';
import {useStore} from '../../zustand/store/useStore';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Tts from 'react-native-tts';
import MultiTap from 'react-native-multitap';
import {fetchRestaurantFirebase} from '../utils/restaurant';
import LayoutWrapper from '../components/common/LayoutWrapper';
import useLocation from '../hooks/useLocation';
import Geolocation from '@react-native-community/geolocation';
import {fetchRestraurantByLocation} from '../utils/fetchRestraurantByLocation';

const HomeScreen = ({navigation}) => {
  const isGranted = useLocation();
  const user = useStore(state => state.user);
  const isAuthenticated = useStore(state => state.user.isAuthenticated);
  const setRestaurantId = useStore(state => state.setRestaurantId);
  const setRestaurantData = useStore(state => state.setRestaurantData);
  const restaurantId = useStore(state => state.restaurantId);
  const [active, setActive] = useState(0);
  const [coords, setCoords] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [resByLoc, setResByLoc] = useState(null);
  const invokesFuntions = {
    1: () => {
      navigation.navigate('QRScanner');
    },
    2: () => {
      navigation.navigate('SpeakToText');
    },
    singleTapRepeat: () => {
      if (active === 0) {
        Tts.speak(
          `You are at ${resByLoc?.name}}. Double tap to confirm it. Single tap to replay. Swipe up for other options.`,
        );
      } else {
        Tts.speak(componentArray[active - 1].text);
      }
    },
    0: () => {
      setRestaurantId(resByLoc?.id);
    },
  };

  Tts.setDefaultLanguage('fr-FR');

  useEffect(() => {
    if (isGranted === true) {
      // Geolocation.getCurrentPosition(info => console.log(info));
      const watchId = Geolocation.watchPosition(
        position => {
          console.log(position);
          if (position?.coords?.accuracy < 20) {
            setCoords({
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
            });
            console.log({
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
            });
          }
        },
        error => Alert.alert('WatchPosition Error', JSON.stringify(error)),
        {
          interval: 1000,
          enableHighAccuracy: true,
          distanceFilter: 10,
        },
      );
      setWatchId(watchId);
    } else if (isGranted === false) {
      alert('Please allow location access');
    }
  }, [isGranted]);

  useEffect(() => {
    if (active === 0) {
      if (coords?.latitude && coords?.longitude) {
        Geolocation.clearWatch(watchId);
        fetchRestraurantByLocation(coords).then(res => {
          if (res?.length) {
            // Tts.stop();
            Tts.speak(
              `We found your location, You are at ${res[0]?.name}}. Double tap to confirm it. Single tap to replay. Swipe up for other options.`,
            );
            setResByLoc(res[0]);
          } else {
            Tts.speak(`Problem detecting restraunt`);
          }
        });
      }
    }
  }, [coords, active]);

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      getAllData(user.uid).then(res => {});
    }
  }, [user?.uid, isAuthenticated]);

  useEffect(() => {
    Tts.stop();
    if (active === 0) {
      Tts.speak(
        'Welcome to Menu Wise, detecting restaurant by location. Please wait...',
      );
    } else {
      Tts.speak(componentArray[active - 1].text);
    }
  }, [active]);

  useEffect(() => {
    if (typeof restaurantId === 'string' && restaurantId.length > 0) {
      fetchRestaurantFirebase(restaurantId, setRestaurantData).then(res => {
        if (res.status) {
          navigation.navigate('MenuCat');
        }
      });
    }
  }, [restaurantId]);

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        if (active === 0) setActive(2);
        else setActive(active - 1);

        break;
      case SWIPE_DOWN:
        if (active === 2) setActive(0);
        else setActive(active + 1);
        break;
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const handleDoubleTap = () => {
    if (active === 0) {
      invokesFuntions[0]();
    } else if (active === 1) {
      invokesFuntions[1]();
    } else if (active === 2) {
      invokesFuntions[2]();
    }
  };

  const handleSingleTap = () => {
    invokesFuntions['singleTapRepeat']();
  };

  const componentArray = [
    {
      id: 1,
      text: 'Double tap to scan qr code.',
      component: (
        <HStack flex="1">
          <Button width="full" backgroundColor={colors.backgroundLight}>
            <Ionicons
              name="qr-code-outline"
              color={colors.headeline}
              size={120}
            />
            <Text alignSelf={'center'} color="white">
              Qr Scanner{' '}
            </Text>
          </Button>
        </HStack>
      ),
    },
    {
      id: 2,
      text: 'Double tap to search by speech',
      component: (
        <HStack flex="1">
          <Button
            width="full"
            height={'full'}
            backgroundColor={colors.backgroundLight}>
            <VStack alignItems="center">
              <Ionicons name="mic" color={colors.headeline} size={120} />
              <Text color="white">Speak to Search</Text>
            </VStack>
          </Button>
        </HStack>
      ),
    },
  ];

  return (
    <LayoutWrapper>
      {active === 0 ? (
        <Box
          flex={1}
          width="100%"
          flexDirection="column"
          alignItems={'center'}
          justifyContent="space-around"
          backgroundColor={colors.background}>
          <Ionicons
            name="location-outline"
            color={colors.headeline}
            size={120}
          />
          <Box
            flex={1}
            // justifyItems="center"
            width="100%"
            justifyContent={'center'}
            alignItems={'center'}>
            {resByLoc ? (
              <VStack justifyContent={'center'} alignItems="center">
                <Text fontSize={'2xl'} color={'white'} fontWeight="semibold">
                  {resByLoc?.name}
                </Text>
                <Text fontSize={'2xl'} color={'white'}>
                  {resByLoc?.generalInfo?.address}
                </Text>
              </VStack>
            ) : (
              <Text fontSize={'2xl'} color={'white'} fontWeight="semibold">
                Please Wait...
              </Text>
            )}
          </Box>
        </Box>
      ) : (
        componentArray?.map(com => {
          return (
            <Box
              mb="2"
              borderRadius={10}
              flex={1}
              key={com.id}
              borderWidth={3}
              borderColor={active === com.id ? 'white' : '#3b3b44'}>
              {com.component}
            </Box>
          );
        })
      )}

      <GestureRecognizer
        onSwipe={(direction, state) => onSwipe(direction, state)}
        config={config}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0)',
        }}>
        <MultiTap
          onDoubleTap={() => handleDoubleTap()}
          onSingleTap={() => handleSingleTap()}
          delay={300}>
          <Box height={'full'}>{/* <Text>Tap Me</Text> */}</Box>
        </MultiTap>
        {/* <Text>onSwipe callback received gesture: {this.state.gestureName}</Text> */}
      </GestureRecognizer>
    </LayoutWrapper>
  );
};
export default HomeScreen;
