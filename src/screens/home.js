import React, {useEffect, useState} from 'react';
import {Box, Button, HStack, Text, VStack} from 'native-base';
import {getAllData} from '../utils/user';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../apptheme';
import Tts from 'react-native-tts';
import LayoutWrapper from '../components/wrappers/LayoutWrapper';
import useLocation from '../hooks/useLocation';
import Geolocation from '@react-native-community/geolocation';
import GestureTapWrapper from '../components/wrappers/GestureTapWrapper';
import {useStore} from '../../zustand/store/useStore';
import {fetchRestaurantFirebase} from '../utils/restaurant';
import {fetchRestraurantByLocation} from '../utils/fetchRestraurantByLocation';
import {swipeDirections} from 'react-native-swipe-gestures';
import SearchByLocation from '../components/home/SearchByLocation';

const HomeScreen = ({navigation}) => {
  const [isGranted, coords, watchId] = useLocation();
  const user = useStore(state => state.user);
  const isAuthenticated = useStore(state => state.user.isAuthenticated);
  const setRestaurantId = useStore(state => state.setRestaurantId);
  const setRestaurantData = useStore(state => state.setRestaurantData);
  const restaurantId = useStore(state => state.restaurantId);
  const [active, setActive] = useState(0);
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

  useEffect(() => {
    Tts.stop();
  }, []);

  useEffect(() => {
    if (active === 0 && isGranted) {
      if (coords?.latitude && coords?.longitude) {
        Geolocation.clearWatch(watchId);
        fetchRestraurantByLocation(coords).then(res => {
          if (res?.length) {
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
  }, [coords, active, isGranted]);

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      getAllData(user.uid).then(res => {});
    }
  }, [user?.uid, isAuthenticated]);

  useEffect(() => {
    Tts.stop();
    if (active === 0) {
      Tts.speak('Welcome to Menu Wise, detecting restaurant by location...');
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
    const {SWIPE_UP, SWIPE_DOWN} = swipeDirections;
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
      <GestureTapWrapper
        onSwipe={onSwipe}
        handleDoubleTap={handleDoubleTap}
        handleSingleTap={handleSingleTap}>
        {active === 0 ? (
          <SearchByLocation
            name={resByLoc?.name}
            address={resByLoc?.generalInfo?.address}
          />
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
      </GestureTapWrapper>
    </LayoutWrapper>
  );
};
export default HomeScreen;
