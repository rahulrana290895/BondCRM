import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BASE_URL} from './config/config';

const API_URL = `${BASE_URL}/company_profile.php`;

export default function CompanyProfile({navigation}) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get company ID from AsyncStorage
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

  // API call
  const callAPI = async params => {
    const formData = new FormData();

    Object.keys(params).forEach(key => {
      formData.append(key, String(params[key] ?? ''));
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Server error');
    }

    return result;
  };

  // Load company details
  const loadCompany = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const companyId = await getCompanyId();

      if (!companyId) {
        Alert.alert(
          'Company ID Missing',
          'Company ID AsyncStorage mein nahi mila. Login data check karein.',
        );
        return;
      }

      const result = await callAPI({
        action: 'get',
        company_id: companyId,
      });

      if (!result.success) {
        throw new Error(result.message || 'Company details load failed');
      }

      setCompany(result.data);
    } catch (error) {
      console.log('Company Profile Error:', error);

      Alert.alert(
        'Error',
        error.message || 'Unable to load company details',
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

  // Date format DD/MM/YYYY
  const formatDate = value => {
    if (!value || value === '0000-00-00') {
      return 'Not Available';
    }

    const parts = String(value).split('-');

    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    return value;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

        <ActivityIndicator size="large" color="#702ACB" />

        <Text style={styles.loadingText}>
          Loading Company Details...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#8739EB', '#5719B9']}
        style={styles.header}>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Company Profile
          </Text>

          <Text style={styles.headerSubtitle}>
            View your registered company details
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="business-outline"
            size={23}
            color="#FFFFFF"
          />
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

        {company && (
          <>
            {/* Company Main Card */}
            <LinearGradient
              colors={['#8739EB', '#6425C8', '#5018A9']}
              style={styles.companyCard}>

              <View style={styles.companyAvatar}>
                <Ionicons
                  name="business"
                  size={42}
                  color="#702ACB"
                />
              </View>

              <Text style={styles.companyName}>
                {company.company_name || 'Company Name'}
              </Text>

              <Text style={styles.companyLocation}>
                {company.city || 'City Not Available'}
              </Text>

              <View style={styles.companyBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={13}
                  color="#FFE49A"
                />

                <Text style={styles.companyBadgeText}>
                  Registered Company
                </Text>
              </View>
            </LinearGradient>

            {/* Basic Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#7040C0"
                  />
                </View>

                <View>
                  <Text style={styles.sectionTitle}>
                    Basic Information
                  </Text>

                  <Text style={styles.sectionSubtitle}>
                    Company registration details
                  </Text>
                </View>
              </View>

              <InfoRow
                icon="business-outline"
                label="Company Name"
                value={company.company_name}
              />

              <InfoRow
                icon="layers-outline"
                label="Industry ID"
                value={company.industry_name}
              />

              <InfoRow
                icon="calendar-outline"
                label="Registration Date"
                value={formatDate(company.start_date)}
                last
              />
            </View>

            {/* Contact Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="call-outline"
                    size={21}
                    color="#7040C0"
                  />
                </View>

                <View>
                  <Text style={styles.sectionTitle}>
                    Contact Information
                  </Text>

                  <Text style={styles.sectionSubtitle}>
                    Company's contact details
                  </Text>
                </View>
              </View>

              <InfoRow
                icon="call-outline"
                label="Mobile Number"
                value={company.mobile}
              />

              <InfoRow
                icon="mail-outline"
                label="Email Address"
                value={company.email}
                last
              />
            </View>

            {/* Address Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="location-outline"
                    size={22}
                    color="#7040C0"
                  />
                </View>

                <View>
                  <Text style={styles.sectionTitle}>
                    Address Information
                  </Text>

                  <Text style={styles.sectionSubtitle}>
                    Registered business address
                  </Text>
                </View>
              </View>

              <InfoRow
                icon="location-outline"
                label="Address"
                value={company.address}
              />

              <InfoRow
                icon="map-outline"
                label="City"
                value={company.city}
              />

              <InfoRow
                icon="navigate-outline"
                label="PIN Code"
                value={company.pin_code}
                last
              />
            </View>

            {/* Subscription Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color="#7040C0"
                  />
                </View>

                <View>
                  <Text style={styles.sectionTitle}>
                    Subscription Information
                  </Text>

                  <Text style={styles.sectionSubtitle}>
                    Company validity details
                  </Text>
                </View>
              </View>

              <InfoRow
                icon="calendar-outline"
                label="Start Date"
                value={formatDate(company.start_date)}
              />

              <InfoRow
                icon="calendar"
                label="Renewal Date"
                value={formatDate(company.renewal_date)}
                last
              />
            </View>

            {/* Company ID */}
            <View style={styles.companyIdCard}>
              <Text style={styles.companyIdLabel}>
                COMPANY ID
              </Text>

              <Text style={styles.companyIdValue}>
                #{company.company_id}
              </Text>
            </View>
          </>
        )}

        {/* Footer */}
        <Text style={styles.footerText}>
          BondCRM • Version 1.0.0
        </Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem
          icon="home-outline"
          label="Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
        />

        <NavItem
          icon="people-outline"
          label="All Leads"
          onPress={() => navigation.navigate('AllLeads')}
        />

        <TouchableOpacity
          style={styles.addNavItem}
          onPress={() => navigation.navigate('AddLead')}>

          <LinearGradient
            colors={['#8739EB', '#5719B9']}
            style={styles.addNavCircle}>

            <Ionicons name="add" size={30} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.navText}>Add Lead</Text>
        </TouchableOpacity>

        <NavItem
          icon="git-branch-outline"
          label="Pipeline"
          onPress={() => navigation.navigate('LeadPipeline')}
        />

        <NavItem
          icon="person-outline"
          label="Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
    </SafeAreaView>
  );
}

// Information Row
function InfoRow({icon, label, value, last}) {
  return (
    <View
      style={[
        styles.infoRow,
        last && {borderBottomWidth: 0},
      ]}>

      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={18}
          color="#7541B9"
        />
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value !== null && value !== undefined && String(value).trim()
            ? String(value)
            : 'Not Available'}
        </Text>
      </View>
    </View>
  );
}

// Bottom Navigation
function NavItem({icon, label, onPress, active}) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}>

      <Ionicons
        name={icon}
        size={22}
        color={active ? '#702ACB' : '#9991A8'}
      />

      <Text style={[
        styles.navText,
        active && {color: '#702ACB'},
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6FF',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#702ACB',
    fontSize: 13,
    fontWeight: '700',
  },

  header: {
    minHeight: 75,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: '#E8D9FF',
    fontSize: 11,
    marginTop: 4,
  },

  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    padding: 15,
    paddingBottom: 20,
  },

  companyCard: {
    borderRadius: 19,
    padding: 23,
    alignItems: 'center',
    elevation: 4,
  },

  companyAvatar: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF70',
  },

  companyName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },

  companyLocation: {
    color: '#E7D9FF',
    fontSize: 12,
    marginTop: 6,
  },

  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 13,
    backgroundColor: '#FFFFFF22',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  companyBadgeText: {
    color: '#FFE49A',
    fontSize: 10,
    fontWeight: '700',
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginTop: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0EAF8',
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 12,
  },

  sectionIcon: {
    height: 42,
    width: 42,
    borderRadius: 12,
    backgroundColor: '#F0E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34234D',
  },

  sectionSubtitle: {
    fontSize: 10,
    color: '#968CA3',
    marginTop: 4,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F1ECF6',
    gap: 11,
  },

  infoIcon: {
    height: 37,
    width: 37,
    borderRadius: 11,
    backgroundColor: '#F0E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoLabel: {
    fontSize: 10,
    color: '#948AA1',
  },

  infoValue: {
    fontSize: 12,
    color: '#443353',
    fontWeight: '700',
    marginTop: 4,
  },

  companyIdCard: {
    backgroundColor: '#F0E8FF',
    borderRadius: 13,
    padding: 15,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  companyIdLabel: {
    fontSize: 11,
    color: '#7541B9',
    fontWeight: '800',
  },

  companyIdValue: {
    fontSize: 15,
    color: '#6425C8',
    fontWeight: '900',
  },

  footerText: {
    textAlign: 'center',
    color: '#A397B7',
    fontSize: 10,
    marginTop: 18,
    marginBottom: 5,
  },

  bottomNav: {
    height: 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEE8F5',
    paddingHorizontal: 3,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  navText: {
    fontSize: 9,
    color: '#9991A8',
    fontWeight: '600',
  },

  addNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -17,
  },

  addNavCircle: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    marginBottom: 2,
  },
});
