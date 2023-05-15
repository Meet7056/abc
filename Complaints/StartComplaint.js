import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import { BackHandler } from 'react-native';

import axios from 'axios';

const MyComponent = ({ navigation, route }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [startAddress, setstartAddress] = useState(null);
  const [endAddress, setendAddress] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleStartButtonPress = async () => {
    setStartTime(new Date());

    Geolocation.getCurrentPosition(
      position => {
        const { coords } = position;
        setStartLocation(coords);
      });
  };

  const handleEndButtonPress = async () => {
    if (text == '') {
      Alert.alert('Please Enter Solution!');
    } else {
      Geolocation.getCurrentPosition(
        position => {
          const { coords } = position;
          setEndLocation(coords);
        });
      setEndTime(new Date());

    }
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US');
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600000)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((duration / 60000) % 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor((duration / 1000) % 60)
      .toString()
      .padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const duration =
    startTime && endTime ? endTime.getTime() - startTime.getTime() : null;

  const handleTodayCmp = () => {
    navigation.goBack();
  };

  const getAddressFromCoordinatesStart = (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const address = `${data.address.road}, ${data.address.city}, ${data.address.state}, ${data.address.postcode}, ${data.address.country}`;
        setstartAddress(address)
        return address;
      })
      .catch(error => {
        console.error(error);
      });
  };

  if (startLocation) {

    getAddressFromCoordinatesStart(startLocation.latitude, startLocation.longitude);

  }

  const getAddressFromCoordinatesEnd = (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const address = `${data.address.road}, ${data.address.city}, ${data.address.state}, ${data.address.postcode}, ${data.address.country}`;
        setendAddress(address)
        return address;
      })
      .catch(error => {
        console.error(error);
      });
  };

  if (endLocation) {

    getAddressFromCoordinatesEnd(endLocation.latitude, endLocation.longitude);

  }

  // Get Data From ITEM -----------------------------------------------------------------------------------------------------------------------------------
  const itemId = route.params.item._id;
  const itemCreateDate = route.params.item.createDateAt;
  const itemUpdateDate = route.params.item.upadateDateAt;
  const itemNo = route.params.item.machineNo;
  const itemType = route.params.item.machineType;
  const partyName = route.params.item.partyName;
  const itemDetails = route.params.item.details;
  const itemOtherDetails = route.params.item.details1;

  const dataFromRouteFromTodayScreen = route.params.item;

  const handleSubmit = async () => {
    if (startLocation && endLocation) {
      const myStartTime = formatTime(startTime);
      const myEndTime = formatTime(endTime);
      const myDurationTime = formatDuration(duration);

      const myEndLocationLat = (endLocation?.latitude).toString();
      const myEndLocationLong = (endLocation?.longitude).toString();
      const myEndAddress = endAddress;

      const dataToSend = {
        endTime: myEndTime,
        solution: text,
        startTime: myStartTime,
        startAndEndTimeDuration: myDurationTime,
        startComplaintLocation: {
          address: startAddress.toString(),
          longitude: (startLocation?.longitude).toString(),
          latitude: (startLocation?.latitude).toString(),
        },
        endComplaintLocation: {
          address: myEndAddress,
          longitude: myEndLocationLong,
          latitude: myEndLocationLat,
        },
      };

      const response = await axios.put(
        `https://cms-sparrow.herokuapp.com/eng-apk-api/engineer_complaint_data/${itemId}`,
        dataToSend
      );
      const { data } = response;
      if (data.statusCode == 200) {
        Alert.alert('Complaint Submitted Successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Falied To get Location!');
      }
    } else {
      Alert.alert('Falied To get Location!');
    }
  };

  function handleAddPartsBtn() {
    navigation.navigate('AddPartsScreen', { dataFromRouteFromTodayScreen });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: 20,
      }}>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          alignSelf: 'center',
          width: '100%'
        }}>
        <View
          style={{
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
            textAlign: 'left',
            padding: 25,

            backgroundColor: '#c5d4e3',
            borderRadius: 10,
            width: '100%',
            justifyContent: 'space-between',
            elevation: 2,

          }}>
          <View style={{ marginBottom: 10 }}>
            <Text>ID - <Text style={styles.nameHeading}>{itemId}</Text></Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text>Date - <Text style={styles.nameHeading}>{itemCreateDate}</Text></Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text>Updated Date - <Text style={styles.nameHeading}>{itemUpdateDate}</Text></Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text>Machine Number - <Text style={styles.nameHeading}>{itemNo}</Text></Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text>Machine Type - <Text style={styles.nameHeading}>{itemType}</Text></Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text>Party Name - <Text style={styles.nameHeading}>{partyName}</Text></Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text >Details - <Text style={styles.nameHeading}>{itemDetails}</Text></Text>
          </View>

          {itemOtherDetails ? (<View style={{ marginBottom: 10 }}>
            <Text>Other Details </Text><Text style={styles.nameHeading}>{itemOtherDetails}</Text>


          </View>) : (<View style={{ display: "none" }}>
          </View>)}

        </View>

        <View
          style={{
            paddingTop: 30,
            padding: 5,
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}>
          {startTime && <Text>Time: {formatTime(startTime)}</Text>}
          {startLocation && (
            <>
              <Text>Location Latitude: {startLocation.latitude}</Text>
              <Text>Location Longitude: {startLocation.longitude}</Text>
            </>
          )}
          {startAddress && <Text>Location: {startAddress}</Text>}
        </View>

        <View
          style={{
            paddingTop: 30,
            padding: 5,
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
          }}>
          {endTime && <Text>Time: {formatTime(endTime)}</Text>}
          {endLocation && (
            <>
              <Text>Location Latitude: {endLocation.latitude}</Text>
              <Text>Location Longitude: {endLocation.longitude}</Text>
            </>
          )}
          {endAddress && <Text>Location: {endAddress}</Text>}
        </View>

        <View
          style={{
            paddingTop: 30,
            padding: 5,
            textAlign: 'left',
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
          }}>
          {duration && <Text>Duration time: {formatDuration(duration)}</Text>}
          {text && <Text style={{ paddingTop: 30 }}>Solution: {text}</Text>}
        </View>
      </View>

      <View style={{ alignSelf: 'flex-start' }}>
        {!startTime && (
          <TouchableOpacity
            style={{
              backgroundColor: '#99d98c',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              margin: 5
            }}
            onPress={handleStartButtonPress}>
            <Text style={{ color: 'black', fontStyle: "bold" }}>
              <Image
                source={require('../icons/startIcon.png')}
                style={styles.icon}
              /> Start</Text>
          </TouchableOpacity>
        )}
        {startTime && !endTime && (
          <>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#99d98c',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'flex-start',
                  margin: 5,
                  width: 90,
                }}
                onPress={handleAddPartsBtn}>
                <Text style={{ color: 'black', fontStyle: "bold", alignItems: "center" }}>Add Parts</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#99d98c',
                padding: 10,
                borderRadius: 5,
                alignItems: 'flex-start',
                margin: 5
              }}
              onPress={handleEndButtonPress}>
              <Text style={{ color: 'black', fontStyle: "bold" }}> <Image
                source={require('../icons/endIcon.png')}
                style={styles.icon}
              /> End</Text>
            </TouchableOpacity>

          </>
        )}
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          textAlign: 'left',
        }}>
        <View>
          {startTime && !endTime && (
            <>
              <TextInput
                style={styles.input}
                placeholder={"Solution..."}
                onChangeText={handleTextChange}
                value={text}
              />
            </>
          )}
        </View>
      </View>
      <View style={{ width: "100%", alignItems: "center", justifyContent: "flex-end" }}>

        <TouchableOpacity
          style={{
            backgroundColor: '#99d98c',
            padding: 10,
            borderRadius: 5,
            margin: 5,
            width: 150,
            alignItems: "center"
          }}
          onPress={handleSubmit}>
          <Text style={{ color: 'black', fontStyle: "bold" }}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
    width: 370,
    marginTop: 10,
  },
  nameHeading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  icon: {
    height: 20,
    width: 20,
    opacity: 0.4
  }
});

export default MyComponent;
