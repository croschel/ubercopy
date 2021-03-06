import React, { Component, Fragment } from 'react';
import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Search from '../Search';
import Directions from '../Directions';
import { getPixelSize } from '../../utils';
import MarkerImage from '../../assets/marker.png';
import backimage from '../../assets/back.png';

import { Back, LocationBox, LocationText, LocationTimeBox, LocationTimeText, LocationTimeTextSmall } from './styles';
import Geocoder from 'react-native-geocoding';
import Details from '../Details';

Geocoder.init("googleapikey");


export default class Map extends Component {
  state = {
    region: null,
    destination: null,
    duration: null,
    location: null,
  }


  handleLocationSelected = (data, { geometry }) => {
    const { location: { lat: latitude, lng: longitude } } = geometry;

    this.setState(
      {
        destination: {
          latitude,
          longitude,
          title: data.structured_formatting.main_text,
        }
      }
    )
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {

        Geocoder.from({ latitude, longitude })
          .then(resp => {
            const address = resp.results[0].formatted_address;
            const location = address.substring(0, address.indexOf(','));
            this.setState({
              location
            })
          })
          .catch(error => console.warn(error));
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0143
          }
        })
      },
      () => { },
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000
      }
    );
  }

  handleBack = () => {
    this.setState({
      destination: null
    })
  }

  render() {

    const { region, destination, duration, location } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => this.MapView = el}
        >
          {
            destination && (
              <Fragment>
                <Directions
                  origin={region}
                  destination={destination}
                  onReady={(result) => {
                    this.setState({ duration: Math.floor(result.duration) });
                    this.MapView.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: getPixelSize(50),
                        left: getPixelSize(50),
                        top: getPixelSize(50),
                        bottom: getPixelSize(350),
                      }
                    });
                  }}
                />
                <Marker
                  coordinate={destination}
                  anchor={{ x: 0, y: 0 }}
                  image={MarkerImage}
                >
                  <LocationBox>
                    <LocationText>{destination.title}</LocationText>
                  </LocationBox>
                </Marker>
                <Marker
                  coordinate={region}
                  anchor={{ x: 0, y: 0 }}
                >
                  <LocationBox>
                    <LocationTimeBox>
                      <LocationTimeText>{duration}</LocationTimeText>
                      <LocationTimeTextSmall>Min</LocationTimeTextSmall>
                    </LocationTimeBox>
                    <LocationText>{location}</LocationText>
                  </LocationBox>
                </Marker>
              </Fragment>
            )
          }
        </MapView>
        {destination
          ? (
            <Fragment>
              <Back onPress={this.handleBack}>
                <Image source={backimage} />
              </Back>
              <Details />
            </Fragment>
          )
          : (<Search onLocationSelected={this.handleLocationSelected} />)}

      </View >
    )
  };
}

