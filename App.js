import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/SplashScreen';
import LoginScreen from './src/LoginScreen';
import CompanyRegistration from './src/CompanyRegistration';
import CompanySetup from './src/CompanySetup';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen}/>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="CompanyRegistration" component={CompanyRegistration} options={{headerShown: false}} />
          <Stack.Screen name="CompanySetup" component={CompanySetup} options={{headerShown: false}} />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MoreScreen"
              component={MoreScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddStaff"
              component={StaffScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProductsServicesProjects"
              component={ProductsServicesProjects}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PipelineCategory"
              component={PipelineCategoryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AllLeads"
              component={AllLeadsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddLead"
              component={AddLeadScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FollowUp"
              component={FollowUpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LeadDetail"
              component={LeadDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LeadPipeline"
              component={LeadPipelineScreen}
              options={{headerShown: false}}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
