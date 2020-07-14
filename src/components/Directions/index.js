import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

// import { Container } from './styles';

const Directions = ({ destination, origin, onReady }) => (
  <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey='AIzaSyBbboRUE6QH6yXO01xhb72VsQ3eUDkmLUQ'
    strokeWidth={3}
    strokeColor="#222"
  />);


export default Directions;