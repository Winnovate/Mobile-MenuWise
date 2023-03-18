import React from 'react';
import MultiTap from 'react-native-multitap';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {Text, Box} from 'native-base';

const GestureTapWrapper = ({
  onSwipe,
  handleDoubleTap,
  handleSingleTap,
  handleLongPress,
  children,
}) => {
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const double = () => {
    alert('double');
  };
  return (
    <>
      {children}
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
          handleLongPress={() => handleLongPress()}
          delay={300}>
          <Box height={'full'}></Box>
        </MultiTap>
      </GestureRecognizer>
    </>
  );
};

export default GestureTapWrapper;
