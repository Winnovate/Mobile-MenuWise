import React, {useEffect, useState} from 'react';
import {Box, Flex, HStack, ScrollView, Stack, Text} from 'native-base';
import {StyleSheet} from 'react-native';
import {useStore} from '../../zustand/store/useStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../apptheme';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Tts from 'react-native-tts';
import MultiTap from 'react-native-multitap';
import {useRef} from 'react';

const MenuCatScreen = ({navigation}) => {
  const setRestaurantId = useStore(state => state.setRestaurantId);
  const restaurantData = useStore(state => state.restaurantData);
  const setcatSelectedId = useStore(state => state.setcatSelectedId);
  const [menuCat, setMenuCat] = useState([]);
  const [active, setActive] = useState(0);
  const initialLoadRed = useRef(true);

  useEffect(() => {
    if (restaurantData) {
      const menuCat = Object.keys(restaurantData?.['menu-categories']).map(
        cat => {
          return {
            ...restaurantData?.['menu-categories'][cat],
            text: restaurantData?.['menu-categories'][cat]['name'],
          };
        },
      );
      setMenuCat(menuCat);
      Tts.speak(
        `${restaurantData?.['general-info'].name} menu loaded. Swipe down to explore menu categories. Double tap to open selected category.`,
      );
      handleTextToSpeech(menuCat);
    }
  }, [restaurantData]);

  useEffect(() => {
    return () => {
      setRestaurantId('');
    };
  }, []);

  useEffect(() => {
    if (menuCat[active]?.text) {
      handleTextToSpeech(menuCat);
    }
  }, [active]);

  const handleTextToSpeech = menuCat => {
    Tts.speak(menuCat[active]?.text);
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        let catLen = menuCat?.length;
        if (active === 0) {
          return setActive(catLen - 1);
        } else {
          const newActive = active - 1;
          return setActive(newActive);
        }
      case SWIPE_DOWN:
        console.log(active, menuCat?.length, 'scasdadasd');
        if (active === menuCat?.length) {
          return setActive(0);
        } else {
          const newActive = active + 1;
          return setActive(newActive);
        }
      case SWIPE_LEFT:
        alert('Left');
        break;
      case SWIPE_RIGHT:
        alert('right');
        break;
    }
  };

  const handleDoubleTap = () => {
    setcatSelectedId(menuCat[active]['id']);
    navigation.navigate('Items');
  };

  const handleSingleTap = () => {
    invokesFuntions['singleTapRepeat']();
  };

  return (
    <>
      <Box
        safeArea
        paddingX={4}
        style={{
          flex: 1,
          backgroundColor: colors.background,
          color: 'white',
        }}>
        <ScrollView marginTop={3}>
          {Boolean(menuCat.length) &&
            menuCat.map((cat, idx) => {
              return (
                <HStack
                  key={cat?.id}
                  borderRadius="md"
                  mb="2"
                  backgroundColor={colors.backgroundLight}
                  justifyContent="space-between"
                  borderWidth={3}
                  borderColor={active === idx ? 'white' : '#3b3b44'}
                  alignItems={'center'}
                  paddingX={3}
                  paddingY={3}>
                  <Text color={'white'}>{cat?.name}</Text>
                  <Ionicons
                    name="ios-arrow-down-circle-sharp"
                    color={colors.headeline}
                    size={30}
                  />
                </HStack>
              );
            })}
          <HStack></HStack>
        </ScrollView>
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
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
          <MultiTap
            onDoubleTap={() => handleDoubleTap()}
            onSingleTap={() => handleSingleTap()}
            onTripleTap={() => alert('Triple tapped')}
            onNTaps={n => {
              alert('I was tapped ' + n + ' times');
            }}
            onLongPress={() => alert('Long pressed')}
            delay={300}>
            <Box height={'full'}>{/* <Text>Tap Me</Text> */}</Box>
          </MultiTap>
          {/* <Text>onSwipe callback received gesture: {this.state.gestureName}</Text> */}
        </GestureRecognizer>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  qrScannerContainer: {
    marginTop: '15%',
  },
});

export default MenuCatScreen;
