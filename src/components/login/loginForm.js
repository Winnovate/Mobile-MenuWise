import {
  Box,
  Stack,
  Input,
  Icon,
  Button,
  Text,
  Image,
  Flex,
  Heading,
} from 'native-base';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import {colors} from '../../../apptheme';
import {useStore} from '../../../zustand/store/useStore';
import Tts from 'react-native-tts';
import MultiTap from 'react-native-multitap';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import {View, Vibration} from 'react-native';

const LoginForm = () => {
  const [name, setName] = useState('');
  const setUserData = useStore(state => state.manageUser);
  const [voiceData, setVoiceData] = useState({
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
  });

  useEffect(() => {
    Tts.stop();
    Tts.speak(
      'Welcome to Menu Wise, Long press the screen and Speak your name to setup the app.',
    );
  }, []);

  useEffect(() => {
    initVoiceService();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

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
    Tts.speak(
      `Welcome ${event?.value[0]}. To comfirm double tap the screen your name`,
    );
    setName(event?.value[0]);
  };

  const startRecognizing = async () => {
    Tts.stop();
    Vibration.vibrate();
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
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    Vibration.vibrate();
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDoubleTap = async () => {
    try {
      await AsyncStorage.setItem('@name', name);
      setUserData({name, isAuthenticated: true});
    } catch (e) {
      // saving error
    }
  };
  return (
    <Stack space={4} w="100%" flex={1} justifyContent="center">
      <Heading mb={'18'} letterSpacing={2} size={'xl'} color={colors.text}>
        Welcome to MenuWise
      </Heading>
      <Input
        borderWidth="1"
        borderColor="gray.500"
        fontSize="16px"
        background={colors.background}
        placeholder="Name"
        color={colors.text}
        height={12}
        onChangeText={setName}
        value={name}
      />
      <Text color={colors.text} textAlign="center"></Text>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}>
        <MultiTap
          onDoubleTap={() => handleDoubleTap()}
          onLongPress={() => startRecognizing()}
          delay={300}>
          <Box height={'full'}>{/* <Text>Tap Me</Text> */}</Box>
        </MultiTap>
      </View>
    </Stack>
  );
};
export default LoginForm;
