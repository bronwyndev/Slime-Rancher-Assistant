import React, { useState, useRef, MouseEvent } from 'react';
import client from '../client'
import SidebarComponent from '../components/organisms/Sidebar';
import MapComponent from '../components/organisms/Map';
import { Button, Modal } from "flowbite-react";
import { SanityDocument } from '@sanity/client';

interface HomeProps {
  data: any;
}

const Home = ({ data }: HomeProps) => {
  
  const [openModal, setOpenModal] = useState(true);
  const [markers, setMarkers] = useState<any[]>([]);
  const mapRef = useRef<any | null>(null);

  const getCoordinates = (marker: any, isLatitude: boolean) => {
    const mapInstance = mapRef.current?.getMap();
    // Convert pixel coordinates to geographical coordinates
    const coordinates = mapInstance.unproject([marker.clientX, marker.clientY]);
    
    return isLatitude ? coordinates.lat : coordinates.lng;
  };

  const handleNewMarkerDragEnd = (item: any, event: MouseEvent) => {

    // Create a new marker based on the clicked item and cursor's position
    const newMarker = {
      id: markers.length + 1,
      latitude: getCoordinates(event, true),
      longitude: getCoordinates(event, false),
      x: event.pageX,
      y: event.pageY,
      item: item, // Store the item data
    };

    setMarkers([...markers, newMarker]);
  };

  const handleMarkerDragEnd = (markerId: any, newCoordinates: any, event: MouseEvent) => {
    // Update the coordinates of the dragged marker
    setMarkers((prevMarkers) => {
      const updatedMarkers = prevMarkers.map((marker) => {
        const updatedMarker = marker.id === markerId
          ? { ...marker, latitude: newCoordinates.lat, longitude: newCoordinates.lng }
          : marker;
  
        return updatedMarker;
      });
      
      return updatedMarkers;
    });

  };

  return (
    <div className="h-screen">
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Slime Rancher Assistant</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              This project is built by <a className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300" href="https://motherofchownz.github.io/portfolio/" target="_blank">Bronwyn</a> with ❤ to provide a visual assistant for the Slime Rancher game.
              No profit is being made from this project and all assets are owned by <a className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300" href="http://www.monomipark.com/" target="_blank">Monomi Park</a>.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              To get started, drag the icons from the sidebar onto the map.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Let's get started!</Button>
        </Modal.Footer>
      </Modal>
      <SidebarComponent 
        data={data} 
        onNewMarkerDragEnd={handleNewMarkerDragEnd} 
      />
      <MapComponent
        mapRef={mapRef}
        markers={markers}
        onExistingMarkerDragEnd={handleMarkerDragEnd}
      />
    </div>
  )
}

export async function getStaticProps() {
  const slimesQuery = `*[_type == "slime"] | order(date desc) { _id, name, icon, date }`;
  const slimesList = await client.fetch<SanityDocument[]>(slimesQuery);

  const foodQuery = `*[_type == "food"] | order(date desc) { _id, name, icon, date }`;
  const foodList = await client.fetch<SanityDocument[]>(foodQuery);

  const buildingQuery = `*[_type == "building"] | order(date desc) { _id, name, icon, date }`;
  const buildingList = await client.fetch<SanityDocument[]>(buildingQuery);

  const gadgetQuery = `*[_type == "gadget"] | order(date desc) { _id, name, icon, date }`;
  const gadgetList = await client.fetch<SanityDocument[]>(gadgetQuery);
  return {
    props: {
      data: {
        slimesList, // pass slimesList as data
        foodList, // pass foodList as data
        buildingList, // pass buildingList as data
        gadgetList, // pass gadgetList as data
      }
    }
  }
}

export default Home