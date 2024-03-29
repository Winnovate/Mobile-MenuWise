import React from 'react';
import {Box, Flex, Stack} from 'native-base';
import {colors} from '../../../apptheme';

const LayoutWrapper = ({
  children,
  justify = 'space-between',
  flexDirection = 'column',
  noFlex,
}) => {
  return (
    <Box
      safeArea
      paddingX={4}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        color: 'white',
      }}>
      {noFlex ? (
        <Stack marginTop={6} flex={1}>
          {children}
        </Stack>
      ) : (
        <Stack
          marginTop={6}
          flexDirection={flexDirection}
          justifyContent={flexDirection === 'row' ? justify : 'flex-start'}
          alignItems={flexDirection === 'column' ? justify : 'flex-start'}
          flex={1}>
          {children}
        </Stack>
      )}
    </Box>
  );
};

export default LayoutWrapper;
