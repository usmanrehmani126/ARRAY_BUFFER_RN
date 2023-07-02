import React, {useState, useEffect} from 'react';
import {FlatList, Image, View, Text, ActivityIndicator} from 'react-native';

const ImageComponent = ({url, loading, setLoading}) => {
  const [isBuffer, setIsBuffer] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (url.includes('array buffer')) {
      setIsBuffer(true);
      setLoading(true);
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const base64 = btoa(
            new Uint8Array(buffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
            ),
          );
          setImageData(`data:image/jpeg;base64,${base64}`);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    } else {
      setImageData(url);
    }
  }, [url]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#F20" style={{marginTop: 40}} />
      ) : (
        <>
          <Image
            style={{width: 300, height: 200, alignSelf: 'center', margin: 10}} // Set the desired dimensions
            source={isBuffer ?  {uri: imageData} : require('./assets/pc.jpg')}
          />
        </>
      )}
    </View>
  );
};

const App = () => {
  const imageUrls = [
    'https://ayae52i9de.execute-api.us-east-1.amazonaws.com/prod/s3?key=elephant-trax/google_103236758783646644108/04252023032040_00148466-6020-496d-879a-01edabd564d1',
    'https://ayae52i9de.execute-api.us-east-1.amazonaws.com/prod/s3?key=elephant-trax/google_103236758783646644108/01232022112248_69365b28-43e0-406f-a0ce-8e6716146f61',
  ];
  const [loading, setLoading] = useState(false);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={imageUrls}
        contentContainerStyle={{paddingVertical: 20}}
        keyExtractor={index => index.toString()}
        renderItem={({item}) => (
          <ImageComponent
            url={item}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      />
    </View>
  );
};

export default App;
