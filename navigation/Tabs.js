import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Group from '../screens/Search';
import Home from '../screens/Home';
import Clubs from '../screens/Clubs';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    initialRouteName='Home'
    screenOptions={{headerShown: false,tabBarShowLabel: false}}
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
      name='Group'
      component={Group}
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
      component={Clubs}
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
