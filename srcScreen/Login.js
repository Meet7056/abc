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

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const username = await AsyncStorage.getItem('username');


            
            if (username) {
                
                console.log(username)
                navigation.navigate('Main');
            }else{
                console.log("not found ")
            }
        };

        checkLoginStatus();
    }, [isLoggedIn]);

    const [modalVisible, setModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false)

    const [otp, setOTP] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const Memail = email.trim();
    const Mpassword = password.trim();

    const dataToSend = {
        name: Memail,
        passWord: Mpassword,
    };

    const handleLogin = async () => {
        setLoading(true);
        const response = await axios.post(
            'https://cms-sparrow.herokuapp.com/eng-apk-api/login',
            {
                name: Memail,
                passWord: Mpassword,
            }
        );
        const { data } = response;
        setLoading(false);
        if (data.statusCode == 200) {
            console.log("Success....")
            await AsyncStorage.multiSet([['isLoggedIn', 'true'], ['username', Memail]]); // Store the username in AsyncStorage

            Alert.alert('Login Success!', 'You are Logged in!', [
                { text: 'OK' },
            ])
            navigation.navigate('Main')
        } else {
            Alert.alert('login failed!')
        }
    };

    // const handleSubmit = async () => {
    //     if (otp.length !== 6) {
    //         Alert.alert('OTP code should be 6 digits long');
    //     }
    //     const response = await axios.post(
    //         'https://cms-sparrow.herokuapp.com/eng-apk-api/verify-otp',
    //         {
    //             name: Memail,
    //             passWord: Mpassword,
    //             otp,
    //         }
    //     );
    //     const { data } = response;
    //     console.log("successfully sent to api", Memail,Mpassword)
    //     if (data.statusCode == 200) {
    // await AsyncStorage.multiSet([['isLoggedIn', 'true'], ['username', Memail]]); // Store the username in AsyncStorage

    //         Alert.alert('Login Success!', 'You are Logged in!', [
    //             { text: 'OK', onPress: () => navigation.navigate('Main') },
    //         ]);
    //     } else {
    //         Alert.alert('Incorrect OTP!');
    //     }
    // };

    if (isLoggedIn == true) {
        navigation.navigate('Main')
    } else {
        return (
            loading == true ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator />
                </View>
            ) : (
                <ScrollView
                    style={{
                        width: '100%', alignSelf: 'center', marginTop: 40,
                        backgroundColor: "white"
                    }}>
                    <View style={styles.container}>
                        {/* <Modal
                            animationType="slide"
                            transparent={false}
                            visible={modalVisible}>
                            <View style={styles.container}>
                                <Text style={styles.title}>Enter the OTP code</Text>
                                <TextInput
                                    style={styles.input}
                                    maxLength={6}
                                    keyboardType="number-pad"
                                    onChangeText={setOTP}
                                    value={otp}
                                />
                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View></Modal> */}
                        <View style={styles.container2}>
                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    marginBottom: 100,
                                    marginTop: 40,
                                }}>
                                <Image
                                    style={{
                                        width: 130,
                                        height: 95,
                                        padding: 5,
                                        paddingRight: 5,
                                    }}
                                    source={require('../assets/logo-sparrow-2.png')}
                                />
                            </View>
                            <View style={styles.myHead}>
                                <Text style={styles.myHeadText}>Welcome!</Text>
                            </View>
                            <View style={styles.inputView}>
                                <TextInput
                                    placeholder="Name"
                                    onChangeText={(value) => setEmail(value)}
                                    value={email}
                                    style={styles.TextInput}
                                />
                            </View>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.TextInput}
                                    placeholder="Password"
                                    onChangeText={(value) => setPassword(value)}
                                    value={password}
                                    secureTextEntry={true}
                                />
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.forgot_button}>forgot password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleLogin}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <View style={styles.loginBtn}>
                                    <Text style={styles.loginText}>LOGIN</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            )
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '90%',
        marginTop: 50,
        marginBottom: 50,
    },
    myHead: {
        float: 'left',
        alignSelf: 'center',
        width: '80%',
    },
    myHeadText: {
        marginBottom: 30,
        color: "black",
        fontSize: 25,
    },
    inputView: {
        backgroundColor: 'white',
        borderRadius: 5,
        width: '80%',
        height: 45,
        marginBottom: 30,
        borderWidth: 1,
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 5,
    },
    forgot_button: {
        height: 30,
        marginBottom: 30,
        color: 'black',
        fontWeight: "bold"
    },
    loginBtn: {
        width: '70%',
        borderRadius: 5,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: 'purple',
        marginBottom: 50,
    },
    loginText: {
        color: "white"
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: 200,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        fontSize: 24,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
