import React, { memo, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '90%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const Map = ({ isLoaded, onLoad, onUnmount, origin, destination, stop, directionsResponse, directionsCallback, travelMode}) => {
  
  return (
    <div className='w-full flex items-center justify-center mt-10 md:mx-5'>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {origin && destination && (
            <DirectionsService
              options={{
                origin: origin,
                destination: destination,
                waypoints: stop,
                travelMode: travelMode
              }}
              callback={directionsCallback}
            />
          )}
          {directionsResponse && <DirectionsRenderer options={{ directions: directionsResponse }} />}
        </GoogleMap>
      ) : null}
    </div>
  );
};

export default Map;
