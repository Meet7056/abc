import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    View,
    ActivityIndicator,
    Image,
    ScrollView,
    Alert,
    Modal
} from 'react-native';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({ navigation }) {

    useEffect(() => {
        const checkLoginStatus = async () => {
            const username = await AsyncStorage.getItem('username');

            if (username) {

                navigation.navigate('Main');
            }else{
                navigation.navigate('Login')
            }
        };

        checkLoginStatus();
    }, []);

}