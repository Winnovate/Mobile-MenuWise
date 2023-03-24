import {Heading, HStack, VStack, Box} from 'native-base';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GestureTapWrapper from '../wrappers/GestureTapWrapper';
import {swipeDirections} from 'react-native-swipe-gestures';
import {useStore} from '../../../zustand/store/useStore';
import Tts from 'react-native-tts';
import {useEffect} from 'react';

const LanguageSelector = ({navigation}) => {
  const [active, setActive] = useState('en');
  const setLang = useStore(state => state.setLang);

  useEffect(() => {
    Tts.stop();
    Tts.speak(
      'Welcome to Menu Wise. Default language is English. Swipe down to explore other languages',
    );
  }, []);

  useEffect(() => {
    Tts.stop();
    if (active === 'en') {
      Tts.setDefaultLanguage('en');
      Tts.speak('English. Double tap to select English');
    } else {
      Tts.setDefaultLanguage('fr');
      Tts.speak('French. Appuyez deux fois pour sélectionner le français');
    }
  }, [active]);

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN} = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        if (active === 'en') setActive('fr');
        else setActive('en');
        break;
      case SWIPE_DOWN:
        if (active === 'fr') setActive('en');
        else setActive('fr');
        break;
    }
  };

  const handleDoubleTap = async () => {
    setLang(active);
    await AsyncStorage.setItem('@lang', active);
    navigation.navigate('login');
  };

  const handleSingleTap = () => {};

  return (
    <GestureTapWrapper
      onSwipe={onSwipe}
      handleDoubleTap={handleDoubleTap}
      handleSingleTap={handleSingleTap}>
      <VStack flex="1" width={'100%'}>
        <HStack
          borderColor={active === 'en' ? 'white' : 'blue.900'}
          borderWidth={4}
          backgroundColor={'blue.900'}
          flex={1}
          justifyContent="center"
          alignItems={'center'}>
          <Heading color={'white'}>English</Heading>
        </HStack>
        <HStack
          borderColor={active === 'fr' ? 'white' : 'red.400'}
          borderWidth={4}
          flex={1}
          backgroundColor={'red.400'}
          justifyContent="center"
          alignItems={'center'}>
          <Heading color={'white'}>French</Heading>
        </HStack>
      </VStack>
    </GestureTapWrapper>
  );
};

export default LanguageSelector;
