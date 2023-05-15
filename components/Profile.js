

import React, { useState, useEffect } from 'react';

import { View, StyleSheet, Text, Image, ScrollView, ActivityIndicator, BackHandler } from 'react-native';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
  const [username, setUsername] = useState('');

  const [engId, setEngId] = useState('');
  const [engCity, setEngCity] = useState('');
  const [engPhone, setEngPhone] = useState('');
  const [engExpertise, setEngExpertise] = useState('');
  const [loading, setLoading] = useState(true);

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
    // Retrieve the user's name from AsyncStorage
    const getUsername = async () => {
      try {
        const value = await AsyncStorage.getItem('username');
        if (value !== null) {
          setUsername(value);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsername();
  }, []);

  useEffect(() => {
    axios
      .post('https://cms-sparrow.herokuapp.com/eng-apk-api/engineer_profile', {
        name: username,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.statusCode == 200) {
          setEngId(response.data.engProfile.engId);
          setEngCity(response.data.engProfile.engineerCity);
          setEngPhone(response.data.engProfile.mobileNumber);
          setEngExpertise(response.data.engProfile.machineType);
        }
      });
  });

  return (loading == true ? (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={styles.container}>
      <View
        name={'Heading'}
        style={{
          alignItems: 'center',
          padding: 15,
          backgroundColor: 'white',
          borderRadius: 8,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          elevation: 7,
        }}>
        <Image
          style={{ width: 120, height: 120 }}
          source={require('../assets/ProfileDP.png')}
        />
        <View style={{ alignItems: 'flex-end' }}>
          {engId && <Text style={styles.nameHeadingId}>{engId}</Text>}
          {username && <Text style={styles.nameHeading}>{username}</Text>}
        </View>
      </View>
      <View style={styles.subContent}>
        <View>
          <Image
            source={require('../icons/phoneIcon.png')}
            style={styles.icon}
          />
        </View>
        <View
          name={'phone'}
        >
          <Text style={{ opacity: 0.7 }}>Phone </Text>

          {engPhone && <Text style={styles.nameHeading}>{engPhone}</Text>}
        </View>
      </View>
      <View style={styles.subContent}>
        <View>
          <Image
            source={require('../icons/cityIcon.png')}
            style={styles.icon}
          />
        </View>
        <View
          name={'city'}
        >
          <Text style={{ opacity: 0.7 }}>City</Text>

          {engPhone && <Text style={styles.nameHeading}>{engCity}</Text>}
        </View>
      </View>
      <View style={styles.subContent}>


        <View>
          <Image
            source={require('../icons/expertIcon.png')}
            style={[styles.icon,{marginTop:-30}]}
          />
        </View>
        <View
          name={'expertise'}
          >
          <Text style={{ opacity: 0.7, marginTop: 10 }}>
            Engineer Expertise
          </Text>
          {engExpertise &&
            engExpertise?.map((engExpertise, id) => {
              return (
                <Text key={id} style={[styles.nameHeading, { marginTop: 10 }]}>
                  {id + 1}. {engExpertise}
                  {id === 1 ||
                    id === 2 ||
                    id === 3 ||
                    id === 4 ||
                    id === 5 ||
                    id === 6 ||
                    id === 7 ||
                    id === 8
                    ? '\n'
                    : ''}
                </Text>
              );
            })}
        </View>
      </View>
    </View>)
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20
  },
  nameHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nameHeadingId: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  subContent: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    elevation: 7,
    flexDirection: "row",
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 14,
    opacity: 0.4
  }
});
