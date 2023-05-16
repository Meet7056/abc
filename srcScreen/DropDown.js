import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Image
} from 'react-native';
import Constants from 'expo-constants';

import Geolocation from '@react-native-community/geolocation';

import React, { useState, useCallback, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useForm, Controller } from 'react-hook-form';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [username, setUsername] = useState('');

  const [monthAndYear, setMonthAndYear] = useState('');
  const getUsername = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        setUsername(value);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUsername();
  }, [getUsername]);

  //Location api ---------------------------------------------------------------------------------------

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        if (error.code === 2) {
             //Show alert or something here that GPS need to turned on.
             Alert.alert("Turn On Location!")
          }
      },
    );
  }, []);

  const getAddressFromCoordinates = (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const address = `${data.address.road}, ${data.address.city}, ${data.address.state}, ${data.address.postcode}, ${data.address.country}`;
        setAddress(address)
        return address;
      })
      .catch(error => {
        console.error(error);
      });
  };
  if (latitude && longitude) {

    getAddressFromCoordinates(latitude, longitude);

  }


  // setModal--------------------------------------------------------------------------------------------------------------
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleModalClose = () => {
    setIsModalVisible(false);
  };

  // Current Date

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    setCurrentDate(`${year}-${month}-${day}`);
    setMonthAndYear(`${month}-${year}`);
  }, []);
  // current time
  const [currentTime, setCurrentTime] = useState('');

  // Actions

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [gender, setGender] = useState([
    { label: 'Punch In', value: 'Punch In' },
    { label: 'Lunch Out', value: 'Lunch Out' },
    { label: 'Lunch In', value: 'Lunch In' },
    { label: 'Personal Out', value: 'Personal Out' },
    { label: 'Personal In', value: 'Personal In' },
    { label: 'Punch Out', value: 'Punch Out' },
  ]);
  const { handleSubmit, control } = useForm();

  useEffect(() => {
    const now = new Date();

    const formatTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    setCurrentTime(formatTime);
  });

  // main output function------------------------------------------------------------------------------------------------------------------
  const onSubmit = async () => {
    if (genderValue) {
      if (latitude && longitude) {
        Alert.alert(genderValue + ' SuccessFully!');
        setIsModalVisible(false);
        const data = {
          name: username,
          status: genderValue,
          time: currentTime,
          currentDate,
          address,
          longitude,
          latitude,
          monthAndYear,
        }
        fetch('https://cms-sparrow.herokuapp.com/attendance/add_engineer_attendance', { method: 'POST', body: JSON.stringify(data) })
          .then(response => response.json())
          .catch(error => console.error(error));
      } else {
        Alert.alert("Failed to get Location!")
      }
    } else {
      Alert.alert("Please select Action (punch in)")
    }
  };

  // -----------------------------------------------------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        {genderValue ?
          (
            <View style={[styles.actionBtnText, { marginRight: 50, marginLeft: 3, }]}>

              <Text style={{ fontWeight: 'bold', color: "black", paddingHorizontal: 0, }}>   {genderValue}   </Text>
            </View>
          ) :
          (
            <View style={styles.actionBtn}>
              <Image
                source={require('../icons/punchinIcon.png')}
                style={{ height: 25, width: 25 }}
              />
            </View>

          )}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={toggleModal}>
          <View style={styles.modal}>
            <View style={{ marginBottom: -100 }}>
              <Image
                style={{ width: 350, height: 350 }}
                source={require('../assets/punchInGif.gif')}
              />
            </View>
            <View style={[styles.container]}>

              <View>
                <Controller
                  name="gender"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.dropdownGender}>
                      <DropDownPicker
                        style={styles.dropdown}
                        open={genderOpen}
                        value={genderValue} //genderValue
                        items={gender}
                        setOpen={setGenderOpen}
                        setValue={setGenderValue}
                        setItems={setGender}
                        placeholder="Select Action"
                        placeholderStyle={styles.placeholderStyles}
                        onChangeValue={onChange}
                        zIndex={3000}
                        zIndexInverse={1000}
                      />
                    </View>
                  )}
                />
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#0E24A5',
                  padding: 10,
                  borderRadius: 5,
                  margin: 15,
                  width: 150,
                  alignItems: "center"
                }}
                onPress={onSubmit}>
                {genderValue ?
                    (
                      <Text style={{fontWeight:"bold", color:"white"}}>{genderValue} now!</Text>
                    ) :
                    (
                      <Text style={{fontWeight:"bold", color:"white"}}>Submit</Text>

                    )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    padding: 8,
  },
  actionBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#8fc5e3',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 50,
  },
  placeholderStyles: {
    color: 'grey',
  },
  dropdownGender: {
    width: '100%',
    marginBottom: 15,
  },
  dropdown: {
    borderColor: '#B7B7B7',
    height: 50,
  },
  getStarted: {
    backgroundColor: '#5188E3',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  actionBtnText: {
    backgroundColor: '#8fc5e3',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 100,
  },
});
