
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

// Authentication Screens
import SplashScreen from './src/SplashScreen';
import LoginScreen from './src/LoginScreen';
import CompanyRegistration from './src/CompanyRegistration';
import CompanySetup from './src/CompanySetup';

// Main Screens
import DashboardScreen from './src/DashboardScreen';
import MoreScreen from './src/MoreScreen';
import StaffScreen from './src/StaffScreen';
import ProductsServicesProjects from './src/ProductsServicesProjects';
import PipelineCategoryScreen from './src/PipelineCategoryScreen';
import AllLeadsScreen from './src/AllLeadsScreen';
import AddLeadScreen from './src/AddLeadScreen';
import FollowUpScreen from './src/FollowUpScreen';
import LeadDetailScreen from './src/LeadDetailScreen';
import ProfileScreen from './src/ProfileScreen';
import LeadPipelineScreen from './src/LeadPipelineScreen';
import CompanyProfile from './src/CompanyProfile';

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// DASHBOARD STACK
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AddStaff" component={StaffScreen} />
      <Stack.Screen
        name="ProductsServicesProjects"
        component={ProductsServicesProjects}
      />
      <Stack.Screen
        name="PipelineCategory"
        component={PipelineCategoryScreen}
      />
      <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
    </Stack.Navigator>
  );
}

// LEADS STACK
function LeadsStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AllLeads" component={AllLeadsScreen} />
      <Stack.Screen name="AddLead" component={AddLeadScreen} />
      <Stack.Screen name="LeadDetail" component={LeadDetailScreen} />
    </Stack.Navigator>
  );
}

// PIPELINE STACK
function PipelineStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LeadPipeline" component={LeadPipelineScreen} />
    </Stack.Navigator>
  );
}

// FOLLOW UP STACK
function FollowUpStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="FollowUp" component={FollowUpScreen} />
    </Stack.Navigator>
  );
}

// COMMON BOTTOM TAB NAVIGATION
function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#6425CC',
        tabBarInactiveTintColor: '#817A90',

        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EEE9F5',
          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },

        tabBarIcon: ({color, focused}) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;

            case 'AllLeads':
              iconName = focused ? 'people' : 'people-outline';
              break;

            case 'AddLead':
              iconName = 'add-circle';
              break;

            case 'LeadPipeline':
              iconName = focused ? 'git-branch' : 'git-branch-outline';
              break;

            case 'FollowUp':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;

            default:
              iconName = 'ellipse-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={route.name === 'AddLead' ? 30 : 23}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{tabBarLabel: 'Dashboard'}}
      />

      <Tab.Screen
        name="AllLeads"
        component={LeadsStack}
        options={{tabBarLabel: 'All Leads'}}
      />

      <Tab.Screen
        name="AddLead"
        component={AddLeadScreen}
        options={{tabBarLabel: 'Add Lead'}}
      />

      <Tab.Screen
        name="LeadPipeline"
        component={PipelineStack}
        options={{tabBarLabel: 'Pipeline'}}
      />

      <Tab.Screen
        name="FollowUp"
        component={FollowUpStack}
        options={{tabBarLabel: 'Follow Up'}}
      />
    </Tab.Navigator>
  );
}

// MAIN APP
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{headerShown: false}}
        >
          {/* AUTHENTICATION */}
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />

          <RootStack.Screen
            name="CompanyRegistration"
            component={CompanyRegistration}
          />

          <RootStack.Screen
            name="CompanySetup"
            component={CompanySetup}
          />

          {/* MAIN APP WITH COMMON TABS */}
          <RootStack.Screen
            name="MainTabs"
            component={MainTabNavigator}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
