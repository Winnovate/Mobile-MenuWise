import React, {useEffect, useState} from 'react';
import LanguageSelector from '../components/initial/languageSelector';
import LayoutWrapper from '../components/wrappers/LayoutWrapper';
import Permission from '../components/initial/Permission';

const InitialScreen = ({navigation}) => {
  const [activeScreen, setActiveScreen] = useState(0);
  return (
    <LayoutWrapper noFlex>
      {activeScreen === 0 ? (
        <Permission handleActiveScreen={setActiveScreen} />
      ) : null}
      {activeScreen === 1 ? <LanguageSelector navigation={navigation} /> : null}
    </LayoutWrapper>
  );
};

export default InitialScreen;
