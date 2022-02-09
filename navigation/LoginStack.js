import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity } from 'react-native';

const NativeStack = createNativeStackNavigator();

const Login = ({ navigation: { navigate } }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <TouchableOpacity onPress={() => navigate('Tabs', { screen: 'Home' })}>
      <Text>Login</Text>
    </TouchableOpacity>
  </View>
);

const LoginStack = () => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name='Login' component={Login} />
  </NativeStack.Navigator>
);

export default LoginStack;
