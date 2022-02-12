import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Club from '../screens/Club';
import Home from '../screens/Home';
import MyClub from '../screens/MyClub';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    initialRouteName='Home'
    screenOptions={{headerShown: false}}
    // screenOptions={{ tabBarShowLabel: false }}
  >
    <Tab.Screen
      name='Home'
      component={Home}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? 'home' : 'home-outline'}
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name='Club'
      component={Club}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? 'search' : 'search-outline'}
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name='MyClub'
      component={MyClub}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? 'md-list' : 'md-list-outline'}
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name='Profile'
      component={Profile}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? 'person' : 'person-outline'}
            size={size}
            color={color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default Tabs;
