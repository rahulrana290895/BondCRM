import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config/config';

const API_URL = `${BASE_URL.replace(/\/+$/, '')}/more_company.php`;

const menuItems = [
  {
    title: 'Profile',
    subtitle: 'View & Edit Profile',
    icon: 'person',
    color: '#ff3456',
    bg: '#ffeeee',
    route: 'Profile',
  },
  {
    title: 'Company Profile',
    subtitle: 'View & Edit Company Details',
    icon: 'business',
    color: '#7138D5',
    bg: '#F0E9FF',
    route: 'CompanyProfile',
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
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================
  // GET COMPANY ID
  // =====================================
  const getCompanyId = async () => {
    let companyId = await AsyncStorage.getItem('company_id');

    const possibleKeys = [
      '@bondcrm_user',
      'user',
      'user_data',
      'login_data',
      'userData',
    ];

    for (const key of possibleKeys) {
      const stored = await AsyncStorage.getItem(key);

      if (!stored) {
        continue;
      }

      try {
        const user = JSON.parse(stored);

        if (user && typeof user === 'object') {
          companyId =
            companyId ||
            user.company_id ||
            user.companyId ||
            '';
        }
      } catch (error) {
        console.log('Storage parse error:', error);
      }
    }

    return String(companyId || '');
  };

  // =====================================
  // LOAD COMPANY FROM BACKEND
  // =====================================
  const loadCompany = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const companyId = await getCompanyId();

      if (!companyId) {
        setCompany(null);
        Alert.alert(
          'Company ID Missing',
          'Company ID AsyncStorage mein nahi mila. Login data check karein.',
        );
        return;
      }

      const formData = new FormData();
      formData.append('action', 'get');
      formData.append('company_id', companyId);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Company details load nahi ho payi.',
        );
      }

      setCompany(result.data);
    } catch (error) {
      console.log('Company API Error:', error);

      Alert.alert(
        'Error',
        error.message || 'Unable to load company details.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCompany(false);
  };

  // =====================================
  // MENU NAVIGATION
  // =====================================
  const handleMenu = route => {
    navigation?.navigate(route);
  };

  // =====================================
  // LOGOUT
  // =====================================
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
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'isLoggedIn',
                'company_id',
                '@bondcrm_user',
                'user',
                'user_data',
                'login_data',
                'userData',
              ]);
            } catch (error) {
              console.log('Logout storage error:', error);
            }

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
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
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

      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#702ACB']}
          />
        }>

        {/* DYNAMIC COMPANY CARD */}
        <LinearGradient
          colors={['#7635DF', '#501BB9']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.profileCard}>

          {/* COMPANY ICON - NO LOGO */}
          <View style={styles.profileLogo}>
            <Ionicons
              name="business"
              size={29}
              color="#7138D5"
            />
          </View>

          <View style={styles.profileInfo}>

            {loading ? (
              <View style={styles.companyLoading}>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
                <Text style={styles.companyEmail}>
                  Loading company...
                </Text>
              </View>
            ) : (
              <>
                <Text
                  style={styles.companyName}
                  numberOfLines={2}>
                  {company?.company_name || 'Company Name'}
                </Text>

                <Text
                  style={styles.companyEmail}
                  numberOfLines={1}>
                  {company?.email || 'Email not available'}
                </Text>

                {!!company?.city && (
                  <View style={styles.cityRow}>
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#E7D9FF"
                    />
                    <Text style={styles.companyCity}>
                      {company.city}
                    </Text>
                  </View>
                )}

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
              </>
            )}

          </View>


        </LinearGradient>

        {/* COMPANY ID */}
        {!loading && company?.company_id && (
          <View style={styles.companyIdRow}>
            <Text style={styles.companyIdLabel}>
              Company ID
            </Text>

            <Text style={styles.companyIdValue}>
              #{company.company_id}
            </Text>
          </View>
        )}

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

// =====================================
// STYLES
// =====================================
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

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },

  // COMPANY CARD
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

  companyLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },

  companyCity: {
    color: '#E7D9FF',
    fontSize: 10,
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

  companyIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 9,
    paddingHorizontal: 5,
  },

  companyIdLabel: {
    color: '#8B829B',
    fontSize: 10,
  },

  companyIdValue: {
    color: '#702ACB',
    fontSize: 10,
    fontWeight: '800',
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
