import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { BackHandler } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyHome = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [name, setUsername] = useState('');
  const [data, setData] = useState([]);

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
        if (value !== null) {
          setUsername(value);
        } else {
          console.log('username is null');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsername();

    axios
      .post(
        'http://cms-sparrow.herokuapp.com/eng-apk-api/engineer_review_compaint',
        {
          name: name,
        }
      )
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [name]);

  return (
        <ScrollView>
          {loading ? (
            <View style={styles.container}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={{ display: 'none' }}></View>
          )}
          <View style={styles.container}>


            {data.map((item, index) => (
              <TouchableOpacity onPress={() => navigation.navigate('Pending Complaints')} >

                <View style={styles.card} key={index}>
                  <View style={styles.iconR}>
                    {item.isCompleted === 'Review' ? (
                      <View style={styles.lineOncard}>
                        <Ionicons name="warning" size={24} color="black" />
                      </View>
                    ) : item.isCompleted === 'Completed' ? (
                      <View style={styles.lineOncardGreen}>
                        <AntDesign name="checkcircle" size={24} color="black" />
                      </View>
                    ) : (
                      <View style={styles.lineOncardRed}>
                        <Ionicons name="alert-circle" size={24} color="black" />
                      </View>
                    )}
                  </View>

                  <View style={styles.cardHeader}>
                    <Text style={styles.cardHeaderText}>{item.partyName}</Text>
                  </View>
                  <View style={styles.cardcontent}>
                    {item?._id && <Text>ID: {item?._id}</Text>}

                    {item?.cmp_id && <Text>Company ID: {item?.cmp_id}</Text>}

                    {item?.partyCity && <Text>Party City: {item?.partyCity}</Text>}

                    {item?.engineerCity && (
                      <Text>Engineer City: {item?.engineerCity}</Text>
                    )}

                    {item?.machineNo && <Text>Machine No: {item?.machineNo}</Text>}

                    <Text>Details: {item?.details}</Text>

                    {item?.details1 && <Text>Other Details: {item?.details1}</Text>}

                    <Text>Call By: {item?.callBy}</Text>

                    <Text>Log By: {item?.logBy}</Text>

                    <Text>Engineer Name: {item?.engineerName}</Text>

                    <Text>Create Date At: {item?.createDateAt}</Text>

                    <Text>Create Time At: {item?.createTimeAt}</Text>

                    <Text>Update Date At: {item?.upadateDateAt}</Text>

                    <Text>Update Time At: {item?.upadateTimeAt}</Text>

                    <Text>Completed: {item?.isCompleted}</Text>

                    {item?.isAdmin && <Text>Admin: True</Text>}

                    <Text>
                      Repeat Complaint Number: {item?.repeatComplaintNumber}
                    </Text>

                    <Text>Machine Type: {item?.machineType}</Text>

                    <Text>Update At: {item?.upadateAt}</Text>

                    <Text>End Time: {item?.endTime}</Text>

                    <Text>Solution: {item?.solution}</Text>

                    {item?.anaysisCompaint?.compId && (
                      <Text>
                        Analysis Complaint ID: {item?.anaysisCompaint?.compId}
                      </Text>
                    )}

                    {item?.anaysisCompaint?.supportEngName && (
                      <Text>
                        Support Engineer Name: {item?.anaysisCompaint?.supportEngName}
                      </Text>
                    )}

                    {item?.anaysisCompaint?.supportEngNameCreateDate && (
                      <Text>
                        Support Engineer Name Create Date:{' '}
                        {item?.anaysisCompaint?.supportEngNameCreateDate}
                      </Text>
                    )}

                    {item?.anaysisCompaint?.anaId && (
                      <Text>Analysis ID: {item?.anaysisCompaint?.anaId}</Text>
                    )}

                    <Text>V: {item?.__v}</Text>

                    {item?.startComplaintLocation?.address && (
                      <Text>
                        Start Complaint Location:{' '}
                        {item?.startComplaintLocation?.address}
                      </Text>
                    )}

                    {item?.startTime && <Text>Start Time: {item?.startTime}</Text>}

                    <Text>
                      End Complaint Location: {item?.endComplaintLocation?.address}
                    </Text>

                    <Text>
                      Start and End Time Duration: {item?.startAndEndTimeDuration}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

            ))}
          </View>
        </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#c5d4e3',
    borderRadius: 10,
    margin: 5,
    marginBottom: 10,
    padding: 10,
    paddingBottom: 15,
    paddingTop: 15,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#a7b4c2',
    paddingBottom: 5,
    borderRadius: 5,
    marginBottom: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    fontWeight: 'bold',
    padding: 10,
    paddingBottom: 2,
  },
  cardcontent: {
    paddingLeft: 5,
  },
  iconR: {
    paddingBottom: 10,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  lineOncard: {
    width: 100,
    height: 30,
    zIndex: 1,
    borderWidth: 1, // sets the width of the border
    borderColor: 'black', // sets the color of the border
    transform: [{ rotate: '-45deg' }],
    overflow: 'hidden',
    backgroundColor: 'yellow',
    textAlign: 'center',
    marginLeft: -35,
    marginTop: -5,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineOncardGreen: {
    width: 100,
    height: 30,
    zIndex: 1,
    borderWidth: 1, // sets the width of the border
    borderColor: 'black', // sets the color of the border
    transform: [{ rotate: '-45deg' }],
    overflow: 'hidden',
    backgroundColor: 'green',
    textAlign: 'center',
    marginLeft: -35,
    marginTop: -5,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineOncardRed: {
    width: 100,
    height: 30,
    zIndex: 1,
    borderWidth: 1, // sets the width of the border
    borderColor: 'black', // sets the color of the border
    transform: [{ rotate: '-45deg' }],
    overflow: 'hidden',
    backgroundColor: 'red',
    textAlign: 'center',
    marginLeft: -35,
    marginTop: -5,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyHome;
