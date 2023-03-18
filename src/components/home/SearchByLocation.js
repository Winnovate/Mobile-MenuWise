import React, {useState} from 'react';
import {Box, VStack, Text} from 'native-base';
import {colors} from '../../../apptheme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchByLocation = ({name, address}) => {
  const [,] = useState();
  return (
    <Box
      flex={1}
      width="100%"
      flexDirection="column"
      alignItems={'center'}
      justifyContent="space-around"
      backgroundColor={colors.background}>
      <Ionicons name="location-outline" color={colors.headeline} size={120} />
      <Box
        flex={1}
        width="100%"
        justifyContent={'center'}
        alignItems={'center'}>
        {name ? (
          <VStack justifyContent={'center'} alignItems="center">
            <Text fontSize={'2xl'} color={'white'} fontWeight="semibold">
              {name}
            </Text>
            <Text fontSize={'2xl'} color={'white'}>
              {address}
            </Text>
          </VStack>
        ) : (
          <Text fontSize={'2xl'} color={'white'} fontWeight="semibold">
            Please Wait...
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default SearchByLocation;
