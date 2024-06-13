import React, { useState, useRef, useEffect, MouseEvent } from 'react';
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
  const [removeButton, setremoveButton] = useState(true);
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
      draggable: true,
    };
    
    setMarkers((prevMarkers) => {
      const newMarkers = [...prevMarkers, newMarker];
      localStorage.setItem('markers', JSON.stringify(newMarkers)); // Save to localStorage
      return newMarkers;
    });
  };

  const clearMarkers = () => {
    setMarkers([]);
    localStorage.setItem('markers', JSON.stringify([])); // Clear localStorage
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
      
      localStorage.setItem('markers', JSON.stringify(updatedMarkers)); // Save to localStorage
      return updatedMarkers;
    });

  };

  // Function to remove a marker by its ID
  const handleRemoveMarker = (markerId: any) => {
    // Filter out the marker with the given ID
    const filteredMarkers = markers.filter((marker) => marker.id !== markerId);
    // Update the markers state
    setMarkers(filteredMarkers);
  };

  const setDefaultMarkers = (gordoList: any[]) => {
    const defaultMarkers = gordoList.map((item, index) => ({
      id: index + 1,
      latitude: item.latitude, // Assuming latitude property exists in gordoList items
      longitude: item.longitude, // Assuming longitude property exists in gordoList items
      item: item, // Store the item data
      draggable: false,
    }));
  
    setMarkers(defaultMarkers);
  };

  useEffect(() => {
    if (data.gordoList) {
      setDefaultMarkers(data.gordoList);
    }
  }, [data.gordoList]);

  useEffect(() => {
    const savedMarkers = localStorage.getItem('markers');
    if (savedMarkers) {
      setMarkers(JSON.parse(savedMarkers));
    }
  }, []);

  return (
    <div className="h-screen">
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Slime Rancher Assistant</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              This project is built by <a className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300" href="https://bronwynwaterhouse.com" target="_blank">Bronwyn</a> with ❤ to provide a visual assistant for the Slime Rancher game.
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
        clearMarkers={clearMarkers}
      />
      <MapComponent
        mapRef={mapRef}
        markers={markers}
        onExistingMarkerDragEnd={handleMarkerDragEnd}
        onExisitingMarkerRemove={handleRemoveMarker}
      />
    </div>
  )
}

async function fetchData(type: string): Promise<SanityDocument[]> {
  const query = `*[_type == "${type}"] | order(_createdAt asc) { _id, name, icon, latitude, longitude }`;
  return await client.fetch<SanityDocument[]>(query);
}

export async function getStaticProps() {
  const [slimesList, foodList, buildingList, gadgetList, gordoList] = await Promise.all([
    fetchData("slime"),
    fetchData("food"),
    fetchData("building"),
    fetchData("gadget"),
    fetchData("gordo"),
  ]);

  const data = { slimesList, foodList, buildingList, gadgetList, gordoList };

  return {
    props: {
      data,
    },
  };
}

export default Home