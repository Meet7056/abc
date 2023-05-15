import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import { Entypo } from '@expo/vector-icons';

import axios from 'axios';

import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({navigation}) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const today = useMemo(() => new Date(), []);
  const maxDate = today.toISOString().slice(0, 10);
  const minDate = '2023-01-01';
  const [data, setData] = useState();
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const [name, setUsername] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home');
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const value = await AsyncStorage.getItem('username');
      } catch (error) {
        console.log(error);
      }
    };
    getUsername();
  }, []);
  const handleDateSelect = useCallback(
    (date) => {
      setSelectedDate(date.dateString);
      setShowModal(true);
      axios
        .post('https://cms-sparrow.herokuapp.com/eng-apk-api/eng_attendance', {
          name: name,
        })
        .then((response) => {
          setData(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [setSelectedDate, setShowModal, setData, name]
  );

  const filteredData = useMemo(
    () =>
      selectedDate
        ? data?.filter((item) => item.currentDate === selectedDate)
        : data,
    [selectedDate, data]
  );

  const totalDiff = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return null;
    }
    const { totalDuration, LunchTime, totalTravelingTime, totalWorkingTime } =
      filteredData[0];
    return moment
      .duration(totalDuration)
      .subtract(LunchTime ?? 0)
      .subtract(totalTravelingTime ?? 0)
      .subtract(totalWorkingTime ?? 0);
  }, [filteredData]);

  const finalWestageTime = useMemo(() => {
    if (!totalDiff) {
      return null;
    }
    const hours = Math.floor(totalDiff.asHours());
    const minutes = totalDiff.minutes();
    return moment({ hour: hours, minute: minutes }).format('HH:mm:ss');
  }, [totalDiff]);

  // rest of the code remains the same

  return (
    <View style={styles.container}>
      <Calendar
        style={{ width: '100%', borderWidth: 1, borderRadius: 8, padding: 20 }}
        onDayPress={handleDateSelect}
        maxDate={maxDate}
        minDate={minDate}
        markedDates={{ [selectedDate]: { selected: true } }}
      />
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{justifyContent:"flex-start", alignItems:"center"}}>
              <Text style={{color:'black'}}>
                {selectedDate}
              </Text>
            </View>
            <View style={styles.cross}>
              <TouchableOpacity onPress={handleClose}>
                <View style={{ width: 25, height: 25 }}>
                  <Entypo name="squared-cross" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
            {filteredData != 0 ? (
              <View
                style={[
                  styles.container,
                  { width: '100%', marginTop: 30, textAlign: 'left' },
                ]}>
                <View style={styles.popUpWidget}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Total Duration Time:{' '}
                    {filteredData && filteredData.length > 0
                      ? filteredData[0].totalDuration
                      : null}
                  </Text>
                </View>
                <View style={styles.popUpWidget}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Lunch Time:{' '}
                    {filteredData && filteredData.length > 0
                      ? filteredData[0].LunchTime
                      : null}
                  </Text>
                </View>
                <View style={styles.popUpWidget}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Travelling Time:{' '}
                    {filteredData && filteredData.length > 0
                      ? filteredData[0].totalTravelingTime
                      : null}
                  </Text>
                </View>
                <View style={styles.popUpWidget}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Total Working Time:{' '}
                    {filteredData && filteredData.length > 0
                      ? filteredData[0].totalWorkingTime
                      : null}
                  </Text>
                </View>
                {finalWestageTime ? (
                  <View style={styles.popUpWidget}>
                    <Text style={{ fontWeight: 'bold' }}>
                      Total Wastage Time: {finalWestageTime}
                    </Text>
                  </View>
                ) : (
                  <Text style={{ display: 'none' }}></Text>
                )}
              </View>
            ) : (
              <Text style={{ fontWeight: 'bold', textAlign: 'left', color:"black" }}>
                Today's Attendance Not Found
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    height: '90%',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    margin: 20,
    right: -5,
    top: -5,
  },
  popUpWidget: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'skyblue',
    margin: 10,
    paddingLeft: 15,
    borderRadius: 10,
  },
});
