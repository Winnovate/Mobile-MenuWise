import React, {useEffect, useState} from 'react';
import {Box, Button, Flex, HStack, ScrollView, Stack, Text} from 'native-base';
import {StyleSheet} from 'react-native';
import {useStore} from '../../zustand/store/useStore';
import {colors} from '../../apptheme';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Tts from 'react-native-tts';
import MultiTap from 'react-native-multitap';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import {postOrdersFirebase} from '../utils/restaurant';
import {ordersText} from '../localize/languages';

const OrdersScreen = ({navigation}) => {
  const lang = useStore(state => state.app.lang);
  const restaurantId = useStore(state => state.restaurantId);
  const [activeSection, setActiveSection] = useState('name');
  const [active, setActive] = useState(0);
  const orders = useStore(state => state.orders);
  const username = useStore(state => state.user.name);

  useEffect(() => {
    Tts.stop();
    if (orders && orders?.length) {
      let text = orders?.map(order => order?.name).join(',');
      text =
        ordersText['Your-order-contains'][lang] +
        text +
        '. ' +
        ordersText['long-press-to-confirm-your-order'][lang];
      Tts.speak(text);
    }
  }, [orders]);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        return;
      case SWIPE_DOWN:
        return;
      case SWIPE_LEFT:
        alert('Left');
        break;
      case SWIPE_RIGHT:
        alert('right');
        break;
    }
  };

  const handleDoubleTap = () => {
    alert('Double Tap');
  };

  const handleSingleTap = () => {
    alert('Single Tap');
  };

  const handleLongPress = () => {
    const orderItemsToString = orders?.map(order => order?.name).join(',');
    const orderID = uuid.v4();
    const orderPayload = {
      customerName: username,
      orderItems: orderItemsToString,
      orderStatus: 'Pending',
      'order-id': orderID,
      timestamp: new Date().toUTCString(),
    };

    postOrdersFirebase(orderPayload, restaurantId, orderID).then(res => {
      if (res.status) {
        Tts.speak(
          ordersText['order-is-confirmed.-Enjoy-your-meal.-Have-a-nice-day'][
            lang
          ],
        );
        alert(ordersText['order-is-confirmed'][lang]);
      }
    });
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
          paddingTop: 6,
        }}>
        {orders?.map(order => {
          return (
            <HStack
              key={order.id}
              borderRadius="md"
              mb="2"
              backgroundColor={colors.backgroundLight}
              justifyContent="space-between"
              alignItems={'center'}
              paddingX={3}
              paddingY={3}>
              <Text color={colors.headeline}>{order?.name}</Text>
              <Button backgroundColor={'red.900'}>Remove</Button>
            </HStack>
          );
        })}

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
            onLongPress={() => handleLongPress()}
            delay={300}>
            <Box height={'full'}>{/* <Text>Tap Me</Text> */}</Box>
          </MultiTap>
        </GestureRecognizer>
      </Box>
    </>
  );
};

export default OrdersScreen;
