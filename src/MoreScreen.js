import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const menuItems = [
  {
    title: 'Company Profile',
    subtitle: 'View & Edit Company Details',
    icon: 'business',
    color: '#7138D5',
    bg: '#F0E9FF',
    route: 'CompanySetup',
  },
  {
    title: 'Staff Management',
    subtitle: 'Add & Manage Staff',
    icon: 'people',
    color: '#2584E8',
    bg: '#E8F2FF',
    route: 'AddStaff',
  },
  {
    title: 'Products / Services / Projects',
    subtitle: 'Add & Manage Items',
    icon: 'cube',
    color: '#10A77B',
    bg: '#E4F8F0',
    route: 'ProductsServicesProjects',
  },
  {
    title: 'Pipeline Category',
    subtitle: 'Create & Manage Pipeline Stages',
    icon: 'git-branch',
    color: '#D78B16',
    bg: '#FFF4E0',
    route: 'PipelineCategory',
  },
];

export default function MoreScreen({navigation}) {

  const handleMenu = route => {
    navigation?.navigate(route);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Logout API and token clearing will be added here
            navigation?.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <StatusBar
        backgroundColor="#5520C6"
        barStyle="light-content"
      />

      {/* HEADER */}
      <LinearGradient
        colors={['#7935E8', '#5018B9']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>

        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={25}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>More</Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => handleMenu('CompanySetup')}>
          <Ionicons
            name="person"
            size={20}
            color="#5C24C5"
          />
        </TouchableOpacity>

      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* PROFILE CARD */}
        <LinearGradient
          colors={['#7635DF', '#501BB9']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.profileCard}>

          <View style={styles.profileLogo}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.companyName}>
              Your Company Name
            </Text>

            <Text style={styles.companyEmail}>
              company@example.com
            </Text>

            <View style={styles.accountBadge}>
              <Ionicons
                name="checkmark-circle"
                size={13}
                color="#FFFFFF"
              />
              <Text style={styles.accountBadgeText}>
                Company Account
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleMenu('CompanySetup')}>
            <Ionicons
              name="create-outline"
              size={23}
              color="#FFFFFF"
            />
          </TouchableOpacity>

        </LinearGradient>

        {/* SECTION TITLE */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            Manage Your Business
          </Text>

          <Text style={styles.sectionSubtitle}>
            Access all your CRM settings and modules
          </Text>
        </View>

        {/* MENU ITEMS */}
        <View style={styles.menuContainer}>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.75}
              onPress={() => handleMenu(item.route)}>

              <View
                style={[
                  styles.menuIcon,
                  {backgroundColor: item.bg},
                ]}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.color}
                />
              </View>

              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>
                  {item.title}
                </Text>

                <Text style={styles.menuSubtitle}>
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#A59CB6"
              />

            </TouchableOpacity>
          ))}

        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}>

          <Ionicons
            name="log-out-outline"
            size={23}
            color="#E04444"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>

        {/* APP VERSION */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            BondCRM
          </Text>

          <Text style={styles.footerSubtitle}>
            Lead Management CRM
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>

      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNavigation}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate('Dashboard')}>
          <Ionicons
            name="grid-outline"
            size={22}
            color="#817A90"
          />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate('AllLeads')}>
          <Ionicons
            name="people-outline"
            size={22}
            color="#817A90"
          />
          <Text style={styles.navText}>All Leads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addNavItem}
          onPress={() => navigation?.navigate('AddLead')}>
          <LinearGradient
            colors={['#8239EC', '#5017BC']}
            style={styles.addNavButton}>
            <Ionicons
              name="add"
              size={30}
              color="#FFFFFF"
            />
          </LinearGradient>
          <Text style={styles.navText}>Add Lead</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate('LeadPipeline')}>
          <Ionicons
            name="git-branch-outline"
            size={22}
            color="#817A90"
          />
          <Text style={styles.navText}>Pipeline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate('FollowUp')}>
          <Ionicons
            name="calendar-outline"
            size={22}
            color="#817A90"
          />
          <Text style={styles.navText}>Follow Up</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F6FC',
  },

  // HEADER
  header: {
    height: 60,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 15,
  },

  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },

  // PROFILE CARD
  profileCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },

  profileLogo: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 40,
    height: 40,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 13,
  },

  companyName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  companyEmail: {
    color: '#E7D9FF',
    fontSize: 11,
    marginTop: 4,
  },

  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 7,
  },

  accountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  // SECTION
  sectionHeading: {
    marginTop: 25,
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#26164A',
    fontSize: 18,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#888194',
    fontSize: 11,
    marginTop: 4,
  },

  // MENU
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 13,
    elevation: 2,
    shadowColor: '#5A3B91',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },

  menuItem: {
    minHeight: 79,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF5',
    paddingVertical: 10,
  },

  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuInfo: {
    flex: 1,
    marginLeft: 13,
  },

  menuTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2C2047',
  },

  menuSubtitle: {
    fontSize: 10,
    color: '#938BA2',
    marginTop: 5,
  },

  // LOGOUT
  logoutButton: {
    height: 57,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#FFE1E1',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    gap: 12,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E04444',
  },

  // FOOTER
  footer: {
    alignItems: 'center',
    marginTop: 22,
  },

  footerTitle: {
    color: '#5820B8',
    fontSize: 17,
    fontWeight: '900',
  },

  footerSubtitle: {
    color: '#9288A4',
    fontSize: 11,
    marginTop: 3,
  },

  version: {
    fontSize: 10,
    color: '#B0A8BD',
    marginTop: 5,
  },

  // BUILDINGS
  buildingSection: {
    height: 90,
    marginHorizontal: -16,
    marginTop: 15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F0E9FF',
    overflow: 'hidden',
  },

  buildingGroup: {
    width: '85%',
    height: '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
  },

  buildingOne: {
    width: '18%',
    height: '65%',
    backgroundColor: '#DCD0FC',
    padding: 7,
  },

  buildingTwo: {
    width: '22%',
    height: '100%',
    backgroundColor: '#CFC0FB',
    padding: 8,
  },

  buildingThree: {
    width: '20%',
    height: '72%',
    backgroundColor: '#DAD0FC',
    padding: 7,
  },

  buildingFour: {
    width: '17%',
    height: '50%',
    backgroundColor: '#E1D7FC',
    padding: 6,
  },

  windows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 7,
  },

  window: {
    width: 9,
    height: 9,
    backgroundColor: '#F0E9FF',
    borderRadius: 2,
  },

  groundLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#C8B7F1',
  },

  // BOTTOM NAV
  bottomNavigation: {
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEE9F5',
    paddingHorizontal: 4,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  navText: {
    fontSize: 9,
    color: '#817A90',
    fontWeight: '500',
  },

  addNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },

  addNavButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -19,
    elevation: 5,
  },

});
