import React, { useEffect } from 'react';
import { View } from 'react-native';

const SplashActivity = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('UserChecker');
        }, 2000);
    }, []);

    return <View />;
};

export default SplashActivity;
