import { getCurrentPositionAsync, 
  requestForegroundPermissionsAsync, 
  LocationObject, 
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';
import { View } from 'react-native';
import { styles } from './styles';
import { useEffect, useRef, useState } from 'react';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition)
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
          altitude: 200,
        },
        { duration: 1000 }
        );
        });
      }
    );
  }, []);

  return ( <View style={styles.container}>
    {location && (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
        />
      </MapView>
    )}
  </View>) ;
}