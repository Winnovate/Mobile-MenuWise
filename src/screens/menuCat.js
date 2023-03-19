import React, {useEffect, useState, useRef} from 'react';
import {HStack, ScrollView, Text} from 'native-base';
import {useStore} from '../../zustand/store/useStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../apptheme';
import {swipeDirections} from 'react-native-swipe-gestures';
import Tts from 'react-native-tts';
import SkeletonLoader from '../components/menuCat/skeleton';
import LayoutWrapper from '../components/wrappers/LayoutWrapper';
import GestureTapWrapper from '../components/wrappers/GestureTapWrapper';

const MenuCatScreen = ({navigation}) => {
  const lang = useStore(state => state.app.lang);
  const setRestaurantId = useStore(state => state.setRestaurantId);
  const restaurantData = useStore(state => state.restaurantData);
  const setcatSelectedId = useStore(state => state.setcatSelectedId);
  const [menuCat, setMenuCat] = useState([]);
  const [active, setActive] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurantData) {
      setLoading(false);
      const menuCat = Object.keys(restaurantData?.['menu-categories']).map(
        cat => {
          return {
            ...restaurantData?.['menu-categories'][cat],
            text: restaurantData?.['menu-categories'][cat]['name'],
          };
        },
      );
      setMenuCat(menuCat);
      if (lang === 'fr') {
        Tts.speak(
          `Menu ${restaurantData?.['general-info'].name} chargé. Balayez vers le bas pour explorer les catégories de menu. Appuyez deux fois pour ouvrir la catégorie sélectionnée`,
        );
      } else {
        Tts.speak(
          `${restaurantData?.['general-info'].name} menu loaded. Swipe down to explore menu categories. Double tap to open selected category.`,
        );
      }
      handleTextToSpeech(menuCat);
    } else {
      setLoading(true);
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
    if (menuCat[active]?.text) {
      handleTextToSpeech(menuCat);
    }
  };

  return (
    <LayoutWrapper noFlex>
      <GestureTapWrapper
        onSwipe={onSwipe}
        handleDoubleTap={handleDoubleTap}
        handleSingleTap={handleSingleTap}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
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
        )}
      </GestureTapWrapper>
    </LayoutWrapper>
  );
};

export default MenuCatScreen;
