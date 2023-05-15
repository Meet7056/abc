import React, { useState, useEffect } from 'react';

import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
  Image
} from 'react-native';

import Dropdown from './DropDown';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyHome({ navigation }) {
  const [allCompaint, setAllCompaint] = useState('');
  const [pendingCompaint, setPendingCompaint] = useState('');
  const [reviewCompaint, setReviewCompaint] = useState('');
  const [completedCompaint, setCompletedCompaint] = useState('');
  const [repeatingCompaint, setRepeatingCompaint] = useState('');
  const [todayComplaint, setTodayCompaint] = useState('');

  const [loading, setLoading] = useState(true)

  // retrieve name from async storage
  const [username, setUsername] = useState('');

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
      .post('https://cms-sparrow.herokuapp.com/eng-apk-api/engineer_count', {
        name: username,
      })
      .then((response) => {
        if (response.data.statusCode == 200) {
          setAllCompaint(response.data.allCompaint);
          setPendingCompaint(response.data.pendingCompaint);
          setReviewCompaint(response.data.reviewCompaint);
          setCompletedCompaint(response.data.completedCompaint);
          setRepeatingCompaint(response.data.repeatingCompaint);
          setTodayCompaint(response.data.TodayComplaint);
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // Handle All Complaints

  function handleAllComp() {
    navigation.navigate('All Complaints');
  }
  function handlePendingComp() {
    navigation.navigate('Pending Complaints');
  }
  function completePendingComp() {
    navigation.navigate('Completed Complaints');
  }
  function reviewPendingComp() {
    navigation.navigate('Review Complaints');
  }
  function repeatPendingComp() {
    navigation.navigate('Repeat Complaints');
  }
  function todayPendingComp() {
    navigation.navigate('Today Complaints');
  }

  // UI

  return (

    <View style={{ flex: 1, }}>
      <View style={styles.cardContainer}>
        <View style={styles.card1}>
          <TouchableOpacity onPress={handleAllComp}>
            <View style={styles.cardContent}>
              <Image
                source={require('../icons/allIcon.png')}
                style={styles.cardIconGreen}
              />
              <Text style={styles.cardText1Green}> {allCompaint} </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.cardText1Green}>
              <Text style={styles.cardTextGreen}>All Complaints</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card2}>
          <TouchableOpacity onPress={handlePendingComp}>
            <View style={styles.cardContent}>
              <Image
                source={require('../icons/pendingIcon.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText1}> {pendingCompaint} </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.cardText1}>
              <Text style={styles.cardText}>Pending Complaints</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card2}>
          <TouchableOpacity onPress={reviewPendingComp}>
            <View style={styles.cardContent}>
              <Image
                source={require('../icons/reviewIcon.png')}
                style={styles.cardIconGreen}
              />
              <Text style={styles.cardText1}> {reviewCompaint} </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.cardText1}>
            <Text style={styles.cardText}>Review Complaints</Text>
          </View>
        </View>

        <View style={styles.card1}>
          <TouchableOpacity onPress={completePendingComp}>
            <View style={styles.cardContent}>
              <Image
                source={require('../icons/completeIcon.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText1Green}> {completedCompaint} </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.cardText1Green}>
            <Text style={styles.cardTextGreen}>Completed Complaint</Text>
          </View>
        </View>

        <View style={styles.card1}>
          <TouchableOpacity onPress={repeatPendingComp}>
            <View style={styles.cardContent}>
              <Image
                source={require('../icons/repeatIcon.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText1Green}> {repeatingCompaint} </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.cardText1Green}>
            <Text style={styles.cardTextGreen}>Repeating Complaints</Text>
          </View>
        </View>

        <View style={styles.card2}>
          <TouchableOpacity onPress={todayPendingComp}>
            <View style={styles.cardContent}>
              <Image
                source={require('../icons/todayIcon.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText1}> {todayComplaint} </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.cardText1}>
            <Text style={styles.cardText}>Today Complaints</Text>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: "flex-end", alignItems: "flex-end", marginLeft:"75%" }}>
        <Dropdown />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: "center",
  },
  loaderContainer: {
    marginTop: 20
  },
  card1: {
    margin: "4%",
    height: 137,
    width: 137,
    backgroundColor: '#8fc5e3',
    borderRadius: 15,
    justifyContent: 'center',
    alignitems: 'center',
    flexDirection: 'column',
    padding: 5,
    elevation: 2,
  },
  card2: {
    margin: "4%",
    height: 137,
    width: 137,
    backgroundColor: '#fcacac',
    borderRadius: 15,
    justifyContent: 'center',
    alignitems: 'center',
    flexDirection: 'column',

    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  cardText: {
    color: '#6e2626',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 13,
  },
  cardIcon: {
    color: '#26546e',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 30,
    height: 30,
    opacity: 0.6,
    marginLeft: 5,
    marginTop: 5,
    marginRight: 5
  },
  cardText1: {
    color: '#6e2626',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 40,
  },
  cardTextGreen: {
    color: '#26546e',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 13,
  },
  cardIconGreen: {
    color: '#26546e',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 35,
    height: 35,
    opacity: 0.6,
    marginLeft: 5,
    marginTop: 5
  },
  cardText1Green: {
    color: '#26546e',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 40,
  },
  exitButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
});
