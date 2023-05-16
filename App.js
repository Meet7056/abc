// In App.js in a new project
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { requestUserPermission } from "./src/utils/notificationHeloper";

import SplashActivity from './src/utils/SplashActivity';

const Stack = createNativeStackNavigator();

import CheckerScreen from './srcScreen/usernameChecker';
import LoginScreen from './srcScreen/Login';
import MainScreen from './srcScreen/Main';

const App = () => {

  useEffect(() => {
    requestUserPermission();
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashActivity}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="UserChecker" component={CheckerScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
