import React, {useEffect, useState} from 'react';
import {Box, Button, VStack, Text} from 'native-base';
import {useStore} from '../../zustand/store/useStore';
import {colors} from '../../apptheme';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Tts from 'react-native-tts';
import MultiTap from 'react-native-multitap';
import LocalizeText from '../utils/localizeText';
import {itemsText} from '../localize/languages';

const MenuItmesScreen = ({navigation}) => {
  const lang = useStore(state => state.app.lang);
  const setRestaurantId = useStore(state => state.setRestaurantId);
  const catSelectedId = useStore(state => state.catSelectedId);
  const menuItems = useStore(state => state.restaurantData?.items);
  const [menuItemsByCat, setMenuItemsByCat] = useState([]);
  const [activeSection, setActiveSection] = useState('name');
  const setOrders = useStore(state => state.setOrders);
  const [isInOrderList, setIsInOrderList] = useState([]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (menuItems && catSelectedId) {
      const filteredByCat = menuItems?.filter(
        cat => cat.cat_id === catSelectedId,
      );
      setMenuItemsByCat(filteredByCat);
    }
  }, [menuItems, catSelectedId]);

  useEffect(() => {
    return () => {
      setRestaurantId('');
    };
  }, []);

  useEffect(() => {
    if (menuItemsByCat?.length) {
      Tts.stop();
      if (activeSection === 'addToOrder') {
        if (isInOrderList.includes(active)) {
          Tts.speak(
            menuItemsByCat[active]['name'] +
              ` ${itemsText['already-added-to-order'][lang]}, ${itemsText['double tap to remove it'][lang]}. ${itemsText['If-you-want-to-go-to-order-screen-long-press-the-screen'][lang]} `,
          );
        } else {
          Tts.speak('Double tap to order ' + menuItemsByCat[active]['name']);
        }
      } else if (activeSection === 'details') {
        Tts.speak(menuItemsByCat[active]['details']);
      } else if (activeSection === 'name') {
        Tts.speak(menuItemsByCat[active]?.['name']);
      }
    }
  }, [activeSection, menuItemsByCat, active]);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        if (activeSection === 'name') {
          setActive(active - 1);
          return setActiveSection('name');
        } else {
          if (activeSection === 'details') {
            return setActiveSection('name');
          } else if (activeSection === 'addToOrder') {
            return setActiveSection('details');
          }
        }
      case SWIPE_DOWN:
        if (activeSection === 'addToOrder') {
          setActive(active + 1);
          return setActiveSection('name');
        } else {
          if (activeSection === 'name') {
            return setActiveSection('details');
          } else if (activeSection === 'details') {
            return setActiveSection('addToOrder');
          }
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
    if (activeSection === 'addToOrder') {
      if (!isInOrderList.includes(active)) {
        setOrders({data: menuItemsByCat[active], action: 'add'});
        setIsInOrderList([...isInOrderList, active]);
        Tts.speak(
          menuItemsByCat[active]?.name +
            itemsText[
              'is-added-to-your-order-list.-Long-press-to-go-to-order-list'
            ][lang],
        );
      } else {
        setOrders({data: menuItemsByCat[active], action: 'delete'});
        const updatedList = isInOrderList.filter(id => id !== active);
        setIsInOrderList(updatedList);
        Tts.speak(
          menuItemsByCat[active]?.name +
            itemsText['is-removed-from-your-order-list'][lang],
        );
      }
    }
  };

  const handleLocalize = async () => {
    console.log(
      await LocalizeText(
        (to = 'fr'),
        (from = 'en'),
        (dataArray = [menuItemsByCat[active]?.details]),
      ),
    );
  };

  handleLocalize();

  const handleSingleTap = () => {
    alert('Single Tap');
  };

  const handleLongPress = () => {
    navigation.navigate('Orders');
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
        <VStack
          flex="1"
          key={menuItemsByCat['active']?.id}
          borderRadius="md"
          mb="2"
          backgroundColor={colors.backgroundLight}
          justifyContent="space-evenly"
          alignItems={'center'}
          paddingX={3}
          paddingY={3}>
          <Text
            p={3}
            borderWidth={3}
            borderColor={activeSection === 'name' ? 'white' : '#3b3b44'}
            fontSize={28}
            color={'white'}
            fontWeight="bold">
            {menuItemsByCat[active]?.name}
          </Text>
          <Text
            p={3}
            borderWidth={3}
            borderColor={activeSection === 'details' ? 'white' : '#3b3b44'}
            color={'white'}>
            {menuItemsByCat[active]?.details}
          </Text>
          <Button
            p={3}
            borderWidth={3}
            borderColor={activeSection === 'addToOrder' ? 'white' : '#3b3b44'}
            background={colors.primary}>
            {!isInOrderList.includes(active)
              ? itemsText['add-to-order'][lang]
              : itemsText['Added-to-the-Order-List'][lang] + '✅'}
          </Button>
        </VStack>
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

export default MenuItmesScreen;
