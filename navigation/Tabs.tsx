import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Club from '../screens/Clubs';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
      initialRouteName="Home"
    sceneContainerStyle={{ backgroundColor: "white" }}
    screenOptions={{ tabBarShowLabel: false, headerShown: false}}
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
      name='Search'
      component={Search}
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
      name='Club'
      component={Club}
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
