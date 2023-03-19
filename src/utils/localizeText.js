import translate from 'translate-google-api';

const localizeText = async (to, data) => {
  const result = await translate(data, {
    from: 'en',
    to: 'fr',
  });

  return result;
};

export default localizeText;
