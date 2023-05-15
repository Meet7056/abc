import React, { useState, useEffect } from 'react';
import { Button, Text, StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';

import HomeScreen from './MyHome';
import All from '../Complaints/AllComplaints';
import Pending from '../Complaints/TodayStartComplaint';
import Review from '../Complaints/ReviewComplaint';
import Completed from '../Complaints/CompleteComplaints';
import Repeat from '../Complaints/RepeatComplaints';
import Today from '../Complaints/TodayComplaints';
import ProfileScreen from '../components/Profile';
import AttendanceReport from '../components/AttendenceReport';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

export default function App({ navigation, route }) {
  // get value from async storage
  const [username, setUsername] = useState('');

  useEffect(() => {
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

  const showConfirmationAlert = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async() => {navigation.navigate('Login');
        try {
          await AsyncStorage.removeItem('username');
        } catch (error) {
          console.log(error);
        }} },
      ],
      { cancelable: false }
    );
  };

  function ReturnProfile() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Profile </Text>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={showConfirmationAlert}>
            <Image
              style={styles.styleHeaderImageLogout}
              source={require('../icons/logoutIcon2.png')}
            />
          </TouchableOpacity>
          <Image
            style={[styles.styleHeaderImage, { marginLeft: 10 }]}
            source={require('../assets/logo-sparrow.png')}
          />
        </View>
      </View>
    );
  }

  function LogoTitle() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Home </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function AtLogoTitle() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Attendence Report </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function LogoTitle2() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> All Complaints </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function LogoTitle3() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Pending Complaints </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function LogoTitle4() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Completed Complaints </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function LogoTitle5() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Repeated Complaints </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function LogoTitle6() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Today Complaints </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function LogoTitle8() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Review Complaints </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }
  function LogoTitle7() {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Logout </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }


  function Header(title) {
    return (
      <View style={styles.styleHeader}>
        <Text style={styles.styleHeaderText}> Logout </Text>
        <Image
          style={styles.styleHeaderImage}
          source={require('../assets/logo-sparrow.png')}
        />
      </View>
    );
  }

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                style={{
                  width: 150,
                  height: 150,
                  margin: 45,
                  marginBottom: 20,
                  marginTop: 20,
                }}
                source={require('../assets/ProfileDP.png')}
              />
            </View>
          ),
          headerTitle: (props) => <ReturnProfile {...props} />,
        }}
      />
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ focused }) => (
            // focused ? (
            //   <Image

            //     source={require('../icons/homeIconBlue.png')}
            //     style={styles.icon}
            //   />
            // ) : (
            <Image
              source={require('../icons/homeIcon.png')}
              style={styles.icon}
            />
            // )

          ),
          headerTitle: (props) => <LogoTitle {...props} />,
        }}
      />

      <Drawer.Screen
        name="Attendence Report"
        component={AttendanceReport}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require('../icons/punchinIcon.png')}
              style={styles.icon}
            />
          ),
          headerTitle: (props) => <AtLogoTitle {...props} />,
        }}
      />
      <Drawer.Screen
        name="All Complaints"
        component={All}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require('../icons/allIcon.png')}
              style={styles.icon}
            />
          ),
          headerTitle: (props) => <LogoTitle2 {...props} />,
        }}
      />
      <Drawer.Screen
        name="Pending Complaints"
        component={Pending}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require('../icons/pendingIcon.png')}
              style={styles.icon}
            />
          ),
          headerTitle: (props) => <LogoTitle3 {...props} />,
        }}
      />
      <Drawer.Screen
        name="Review Complaints"
        component={Review}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require('../icons/reviewIcon.png')}
              style={styles.icon}
            />
          ),
          headerTitle: (props) => <LogoTitle8 {...props} />,
        }}
      />
      <Drawer.Screen
        name="Completed Complaints"
        component={Completed}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require('../icons/completeIcon.png')}
              style={styles.icon}
            />
          ),
          headerTitle: (props) => <LogoTitle4 {...props} />,
        }}
      />
      <Drawer.Screen
        name="Repeat Complaints"
        component={Repeat}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require('../icons/repeatIcon.png')}
              style={styles.icon}
            />
          ),
          headerTitle: (props) => <LogoTitle5 {...props} />,
        }}
      />
      <Drawer.Screen
        name="Today Complaints"
        component={Today}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require('../icons/todayIcon.png')}
              style={styles.icon}
            />
          ),
          headerTitle: (props) => <LogoTitle6 {...props} />,
        }}
      />
      {/* <Drawer.Screen
        name="Logout"
        options={
          ({ title: 'Logout' },
          {
            drawerIcon: ({ focused }) => (
              <Image
                source={require('../icons/logoutIcon.png')}
                style={styles.icon}
              />
            ),
            headerTitle: (props) => <LogoTitle7 {...props} />,
          })
        }>
        {() => (
          <View style={styles.logoutButtonContainer}>
            <Button
              style={styles.logoutButton}
              title="Logout Now"
              onPress={handleLogout}
            />
          </View>
        )}
      </Drawer.Screen> */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutButton: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  styleHeader: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  styleHeaderText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: -20,
  },
  styleHeaderImage: {
    width: 40,
    height: 40,
    padding: 5,
    paddingRight: 5,
  },
  styleHeaderImageLogout: {
    width: 30,
    height: 30,
    padding: 5,
    paddingRight: 5,
  },
  icon: {
    width: 25,
    height: 25,
  }
});
