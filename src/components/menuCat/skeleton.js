import React from 'react';
import {Center, VStack, Skeleton} from 'native-base';
import {colors} from '../../../apptheme';

const SkeletonLoader = () => {
  return (
    <Center w="100%">
      <VStack w="100%" space={2} overflow="hidden" rounded="md">
        <Skeleton h="14" startColor={colors.backgroundLight} />
        <Skeleton h="14" startColor={colors.backgroundLight} />
        <Skeleton h="14" startColor={colors.backgroundLight} />
        <Skeleton h="14" startColor={colors.backgroundLight} />
      </VStack>
    </Center>
  );
};

export default SkeletonLoader;
