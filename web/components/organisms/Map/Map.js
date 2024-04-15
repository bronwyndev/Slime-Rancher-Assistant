import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import customMapStyle from './styles.json';
import client from '../../../client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({
  ...client.config(),
  baseUrl: 'https://cdn.sanity.io',
})

function urlFor(source) {
  return builder.image(source)
}

const MapComponent = ({ mapRef, markers, onExistingMarkerDragEnd }) => {

  const [viewport, setViewport] = useState({
      width: '100vw',
      height: '100vh',
      latitude: -75, // Initial map center latitude
      longitude: -80, // Initial map center longitude
      zoom: 2.7, // Initial zoom level
  });
  
    return (
      <Map
        ref={mapRef}
        renderWorldCopies={false}
        initialViewState={viewport}
        mapStyle={customMapStyle}
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        mapboxAccessToken="pk.eyJ1IjoibW90aGVyb2ZjaG93bnoiLCJhIjoiY2xvbzd4OTc5MWplZDJxbW9tM3hveDQ1diJ9.3LXtYaK0r3Wzwt2nKJch9g" //{process.env.REACT_APP_MAPBOX_TOKEN}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            latitude={marker.latitude}
            longitude={marker.longitude}
            style={{
              zIndex: 100,
            }}
            draggable
            onDragEnd={(event) => onExistingMarkerDragEnd(marker.id, event.lngLat, event)}
          >
            <div>
              <img 
                src={urlFor(marker.item.icon).url()} 
                alt={marker.item.name}
                className="w-8"
              />
            </div>
          </Marker>
        ))}
      </Map>
    );
  }
  
export default MapComponent;