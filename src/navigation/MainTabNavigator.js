import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import DashboardScreen from '../DashboardScreen';
import AllLeadsScreen from '../AllLeadsScreen';
import AddLeadScreen from '../AddLeadScreen';
import LeadPipelineScreen from '../LeadPipelineScreen';
import FollowUpScreen from '../FollowUpScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6425CC',
        tabBarInactiveTintColor: '#817A90',
        tabBarStyle: {
          height: 65 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 7,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEE9F5',
        },
        tabBarIcon: ({color, size, focused}) => {
          const icons = {
            Dashboard: focused ? 'grid' : 'grid-outline',
            AllLeads: focused ? 'people' : 'people-outline',
            AddLead: 'add-circle',
            LeadPipeline: focused ? 'git-branch' : 'git-branch-outline',
            FollowUp: focused ? 'calendar' : 'calendar-outline',
          };

          return (
            <Ionicons
              name={icons[route.name]}
              size={route.name === 'AddLead' ? 29 : size}
              color={color}
            />
          );
        },
      })}>

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarLabel: 'Dashboard'}}
      />

      <Tab.Screen
        name="AllLeads"
        component={AllLeadsScreen}
        options={{tabBarLabel: 'All Leads'}}
      />

      <Tab.Screen
        name="AddLead"
        component={AddLeadScreen}
        options={{tabBarLabel: 'Add Lead'}}
      />

      <Tab.Screen
        name="LeadPipeline"
        component={LeadPipelineScreen}
        options={{tabBarLabel: 'Pipeline'}}
      />

      <Tab.Screen
        name="FollowUp"
        component={FollowUpScreen}
        options={{tabBarLabel: 'Follow Up'}}
      />

    </Tab.Navigator>
  );
}
