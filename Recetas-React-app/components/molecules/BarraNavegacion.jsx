import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import MyRecipesPage from '../pages/MyRecipesPage';
import ExplorePage from '../pages/ExplorePage';
import GroupsPage from '../pages/GroupsPage';
import Home from '../pages/Home';
import ProfilePage from '../pages/ProfilePage';

const Tab = createBottomTabNavigator();

export default function BarraNavegacion() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#0B2F1A',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E6E6E6' },
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: '#7A8A86',
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size - 2, color, fontWeight: '700' }}>H</Text>
            ),
        }}
      />
      
      <Tab.Screen 
        name="Mis Recetas" 
        component={MyRecipesPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 2, color, fontWeight: '700' }}>R</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Explorar" 
        component={ExplorePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 2, color, fontWeight: '700' }}>E</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Grupos" 
        component={GroupsPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 2, color, fontWeight: '700' }}>G</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 2, color, fontWeight: '700' }}>P</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}