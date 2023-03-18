import {Icon, InfoIcon, Input, Text, Button, VStack, Box} from 'native-base';
import React from 'react';
import {Vibration} from 'react-native';
import LayoutWrapper from '../components/common/LayoutWrapper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../apptheme';
import Tts from 'react-native-tts';
import MultiTap from 'react-native-multitap';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useStore} from '../../zustand/store/useStore';

import Voice from '@react-native-voice/voice';
import {useState, useEffect} from 'react';

import {fetchRestraurantBySearch} from '../utils/fetchRestraurantBySearch';

const SpeakToSearchScreen = ({navigation}) => {
  const setRestaurantId = useStore(state => state.setRestaurantId);
  const [voiceData, setVoiceData] = useState({
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
  });
  const [restList, setRestList] = useState([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (active === -1) {
      Tts.stop();
      Tts.speak(
        'Press and hold screen, start speaking the restaurant name to search it.',
      );
    } else if (active > -1 && restList?.length) {
      Tts.stop();
      Tts.speak(
        `${restList[active]?.['item']?.['name']} at ${restList[active]?.['item']?.['generalInfo']?.['address']}. Double tap to select. Single tap to listen again.`,
      );
    }
  }, [active]);

  useEffect(() => {
    initVoiceService();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  Tts.addEventListener('tts-finish', event => {
    if (active === -2) {
      setActive(0);
    }
  });

  const onSpeechStart = event => {
    console.log('onSpeechStart', event);
  };

  const onSpeechRecognized = event => {
    console.log('onSpeechRecognized', event);
  };

  const onSpeechEnd = event => {
    console.log('onSpeechEnd', event);
  };

  const onSpeechPartialResults = event => {
    console.log('onSpeechPartialResults', event);
  };

  const onSpeechResults = event => {
    fetchRestraurantBySearch(event?.['value']).then(res => {
      setRestList(res);
      Tts.speak(`We have found ${res?.length} result.`);
      setActive(-2);
    });
  };

  const initVoiceService = async () => {
    const isVoiceAvailable = await Voice.isAvailable();
    console.log(isVoiceAvailable);
    if (isVoiceAvailable) {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechRecognized = onSpeechRecognized;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechPartialResults = onSpeechPartialResults;
      Voice.onSpeechResults = onSpeechResults;
    } else {
      alert('error starting speech to text');
    }
  };

  const startRecognizing = async () => {
    if (active !== -1) return;
    Tts.stop();
    Vibration.vibrate();
    setRestList([]);
    setVoiceData({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });

    try {
      await Voice.start('en-US').then(res => console.log(res));
      setTimeout(() => {
        stopRecognizing();
      }, 6000);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    if (active !== -1) return;
    Vibration.vibrate();
    try {
      console.log('Hellooo stopped recording ');
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setVoiceData({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };

  const handleDoubleTap = () => {
    setRestaurantId(restList[active]?.['item']?.['id']);
    navigation.goBack();
  };

  const handleSingleTap = () => {};

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        if (active === -1) {
          setActive(-1);
        } else {
          setActive(active - 1);
        }
        break;
      case SWIPE_DOWN:
        if (restList?.length > 0) {
          if (active === restList.length - 1) {
            setActive(-1);
          } else {
            setActive(active + 1);
          }
        }
        break;
      case SWIPE_LEFT:
        alert('Left');
        break;
      case SWIPE_RIGHT:
        alert('right');
        break;
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <LayoutWrapper justify="center" flexDirection="column">
      <Button
        onPressIn={startRecognizing}
        onPressOut={stopRecognizing}
        backgroundColor={colors.primary}
        borderWidth={3}
        borderColor={active === -1 ? 'white' : `${colors.primary}`}
        width={'32'}
        height="32"
        borderRadius={'full'}>
        <Ionicons name="mic" color={colors.headeline} size={36} />
      </Button>
      {restList?.length ? (
        <Box width="full" mt={6}>
          <Text
            fontSize={'xl'}
            mb="3"
            fontWeight={'hairline'}
            color={colors.headeline}>
            Search Result:
          </Text>
          {restList?.map((res, idx) => {
            return (
              <VStack
                borderWidth={3}
                borderColor={active === idx ? 'white' : '#3b3b44'}
                key={res?.['item']?.['id']}
                p="4"
                pl={3}
                backgroundColor={colors.backgroundLight}
                borderRadius={6}>
                <Text
                  fontWeight={'bold'}
                  fontSize={16}
                  color={colors.headeline}>
                  {res?.['item']?.['name']}
                </Text>
                <Text
                  fontWeight={'thin'}
                  fontStyle="italic"
                  fontSize={12}
                  color={colors.headeline}>
                  {res?.['item']?.['generalInfo']?.['address']}
                </Text>
              </VStack>
            );
          })}
        </Box>
      ) : null}

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
          onPressIn={startRecognizing}
          onPressOut={stopRecognizing}
          delay={300}>
          <Box height={'full'}>{/* <Text>Tap Me</Text> */}</Box>
        </MultiTap>
        {/* <Text>onSwipe callback received gesture: {this.state.gestureName}</Text> */}
      </GestureRecognizer>
    </LayoutWrapper>
  );
};

export default SpeakToSearchScreen;
