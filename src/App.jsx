import React, { useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Form from './components/Form';
import Map from './components/Map';
import Logo from './assets/logo.png';

const App = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA5ARmJnmqEe3HOJPUdjgp-wP1TtZRdniA"
  });

  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [stop, setStop] = useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [travelMode, setTravelMode] = useState('WALKING');

  const onLoad = useCallback(map => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const directionsCallback = response => {
    if (response) {
      if (response.status === 'OK') {
        setDirectionsResponse(response);
        const route = response.routes[0];
        const distanceInMeters = route.legs.reduce((acc, leg) => acc + leg.distance.value, 0);
        const distanceInKm = distanceInMeters / 1000;
        setDistance(distanceInKm.toFixed(2));
      } else {
        console.error('response: ', response);
      }
    }
  };

  const toggleTravelMode = (mode) => {
    setTravelMode(mode);
  };

  return (
    <div className='min-h-screen w-screen pb-20 bg-[#F4F8FA]'>
      <nav className='flex items-center px-5 h-20 w-screen bg-white'>
        <img src={Logo} className='h-14 w-auto' alt="Logo" />
      </nav>
      <h1 className='text-blue-700 text-center mt-10 text-2xl'>Let's calculate <b>distance</b> from Google maps</h1>

      <div className='flex justify-center mt-4'>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            travelMode === 'WALKING' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => toggleTravelMode('WALKING')}
        >
          Walking
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            travelMode === 'DRIVING' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => toggleTravelMode('DRIVING')}
        >
          Driving
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            travelMode === 'TWO_WHEELER' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => toggleTravelMode('TWO_WHEELER')}
        >
          Two Wheeler
        </button>
      </div>

      <div className='flex md:flex-row flex-col-reverse w-screen'>
        <Form
          setOrigin={setOrigin}
          setDestination={setDestination}
          setStop={setStop}
          setDistance={setDistance}
          setDirectionsResponse={setDirectionsResponse}
          distance={distance}
        />
        <Map
          isLoaded={isLoaded}
          map={map}
          onLoad={onLoad}
          onUnmount={onUnmount}
          origin={origin}
          destination={destination}
          stop={stop}
          directionsResponse={directionsResponse}
          directionsCallback={directionsCallback}
          travelMode={travelMode}
        />
      </div>
    </div>
  );
}

export default App;
