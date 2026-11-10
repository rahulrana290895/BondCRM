import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BASE_URL} from './config/config';

const API_URL = `${BASE_URL}/profile.php`;

const initialProfile = {
  staff_id: '',
  company_id: '',
  name: '',
  designation: '',
  email: '',
  number: '',
  role: '',
  company_name: '',
  company_address: '',
  city: '',
  pin_code: '',
  industry_id: '',
  company_mobile: '',
  company_email: '',
  start_date: '',
  renewal_date: '',
};

export default function ProfileScreen({navigation}) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Get login IDs from AsyncStorage
  const getLoginData = async () => {
    let staffId = await AsyncStorage.getItem('staff_id');
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
          staffId =
            staffId ||
            user.staff_id ||
            user.user_id ||
            user.id ||
            '';

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

    return {
      staff_id: String(staffId || ''),
      company_id: String(companyId || ''),
    };
  };

  // API request
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

  // Load profile
  const loadProfile = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const loginData = await getLoginData();

      if (!loginData.staff_id || !loginData.company_id) {
        Alert.alert(
          'Login Details Missing',
          'Staff ID ya Company ID AsyncStorage mein nahi mila.',
        );
        return;
      }

      const result = await callAPI({
        action: 'get',
        staff_id: loginData.staff_id,
        company_id: loginData.company_id,
      });

      if (!result.success) {
        throw new Error(result.message || 'Profile load failed');
      }

      setProfile({
        ...initialProfile,
        ...result.data,
      });
    } catch (error) {
      console.log('Profile Error:', error);
      Alert.alert('Error', error.message || 'Unable to load profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile(false);
  };

  // Change password
  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Required', 'Please fill all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Error',
        'New password and confirm password do not match',
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Password Error',
        'Password must be at least 6 characters',
      );
      return;
    }

    setChangingPassword(true);

    try {
      const result = await callAPI({
        action: 'change_password',
        staff_id: profile.staff_id,
        company_id: profile.company_id,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (!result.success) {
        throw new Error(result.message || 'Password update failed');
      }

      setPasswordVisible(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert(
        'Success',
        result.message || 'Password changed successfully',
      );
    } catch (error) {
      console.log('Password Error:', error);
      Alert.alert('Error', error.message || 'Unable to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // Logout
  const logout = () => {
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
            await AsyncStorage.removeItem('isLoggedIn');

            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
        },
      ],
    );
  };

  // Date format dd/mm/yyyy
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

        <Text style={styles.loadingText}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

      {/* Header - No Edit Button */}
      <LinearGradient
        colors={['#8739EB', '#5719B9']}
        style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>
            Your account and company details
          </Text>
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

        {/* Profile Card */}
        <LinearGradient
          colors={['#8739EB', '#6425C8', '#5018A9']}
          style={styles.profileCard}>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileName}>
            {profile.name || 'User'}
          </Text>

          <Text style={styles.profileDesignation}>
            {profile.designation || 'Staff'}
          </Text>

          <View style={styles.memberBadge}>
            <Ionicons
              name="shield-checkmark"
              size={13}
              color="#FFE49A"
            />

            <Text style={styles.memberBadgeText}>
              {profile.role === 'Admin' ? 'Admin Account' : 'Staff Account'}
            </Text>
          </View>
        </LinearGradient>

        {/* Personal Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Personal Information
          </Text>

          <ProfileInfo
            icon="person-outline"
            label="Full Name"
            value={profile.name}
          />

          <ProfileInfo
            icon="call-outline"
            label="Mobile Number"
            value={profile.number}
          />

          <ProfileInfo
            icon="mail-outline"
            label="Email Address"
            value={profile.email}
          />

          <ProfileInfo
            icon="briefcase-outline"
            label="Designation"
            value={profile.designation}
          />

          <ProfileInfo
            icon="shield-checkmark-outline"
            label="Account Role"
            value={profile.role}
            last
          />
        </View>

        {/* Company Information */}
        <View style={styles.sectionCard}>
          <View style={styles.companyHeading}>
            <View style={styles.companyIcon}>
              <Ionicons
                name="business-outline"
                size={23}
                color="#7040C0"
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.sectionTitle}>
                Company Information
              </Text>

              <Text style={styles.companySubtitle}>
                Registered company details
              </Text>
            </View>
          </View>

          <View style={styles.companyNameBox}>
            <Text style={styles.companyName}>
              {profile.company_name || 'Company Name'}
            </Text>
          </View>

          <ProfileInfo
            icon="location-outline"
            label="Company Address"
            value={profile.company_address}
          />

          <ProfileInfo
            icon="map-outline"
            label="City"
            value={profile.city}
          />

          <ProfileInfo
            icon="navigate-outline"
            label="PIN Code"
            value={profile.pin_code}
          />

          <ProfileInfo
            icon="call-outline"
            label="Company Mobile"
            value={profile.company_mobile}
          />

          <ProfileInfo
            icon="mail-outline"
            label="Company Email"
            value={profile.company_email}
          />
        </View>

        {/* Account Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Account Settings
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setPasswordVisible(true)}>

            <View style={styles.menuIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#7040C0"
              />
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Change Password
              </Text>

              <Text style={styles.menuSubtitle}>
                Update your account password
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#AAA0B8"
            />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}>

          <Ionicons
            name="log-out-outline"
            size={20}
            color="#E14B4B"
          />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

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
          icon="calendar-outline"
          label="FollowUp"
          active
          onPress={() => navigation.navigate('FollowUp')}
        />
      </View>

      {/* Change Password Modal Only */}
      <Modal
        visible={passwordVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordVisible(false)}>

        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Change Password
                </Text>

                <Text style={styles.modalSubtitle}>
                  Enter your current and new password
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setPasswordVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <FormInput
              label="Current Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
            />

            <FormInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <FormInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              disabled={changingPassword}
              onPress={changePassword}>

              <LinearGradient
                colors={['#8739EB', '#5719B9']}
                style={styles.saveButton}>

                {changingPassword ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    Update Password
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Profile Information Row
function ProfileInfo({icon, label, value, last}) {
  return (
    <View
      style={[
        styles.profileInfoRow,
        last && {borderBottomWidth: 0},
      ]}>

      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color="#7541B9" />
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>
          {value !== null && value !== undefined && String(value).trim()
            ? String(value)
            : 'Not Available'}
        </Text>
      </View>
    </View>
  );
}

// Form Input
function FormInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
}) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#A49BB3"
        autoCapitalize="none"
      />
    </View>
  );
}

// Bottom Navigation Item
function NavItem({icon, label, onPress, active}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={active ? '#702ACB' : '#9991A8'}
      />

      <Text style={[styles.navText, active && {color: '#702ACB'}]}>
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
    minHeight: 68,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: '#E8D9FF',
    fontSize: 11,
    marginTop: 3,
  },

  scrollContent: {
    padding: 15,
    paddingBottom: 20,
  },

  profileCard: {
    borderRadius: 19,
    padding: 21,
    alignItems: 'center',
    elevation: 4,
  },

  avatar: {
    width: 83,
    height: 83,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF70',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 35,
    fontWeight: '800',
    color: '#702ACB',
  },

  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 3,
  },

  profileDesignation: {
    color: '#E7D9FF',
    fontSize: 12,
    marginTop: 4,
  },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
    backgroundColor: '#FFFFFF22',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  memberBadgeText: {
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

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34234D',
  },

  companyHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 13,
  },

  companyIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#F0E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  companySubtitle: {
    fontSize: 10,
    color: '#968CA3',
    marginTop: 4,
  },

  companyNameBox: {
    backgroundColor: '#F7F1FF',
    borderRadius: 11,
    padding: 13,
    marginBottom: 5,
  },

  companyName: {
    color: '#6425C8',
    fontSize: 15,
    fontWeight: '800',
  },

  profileInfoRow: {
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

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 11,
  },

  menuIcon: {
    height: 39,
    width: 39,
    borderRadius: 12,
    backgroundColor: '#F0E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    color: '#403052',
    fontSize: 12,
    fontWeight: '800',
  },

  menuSubtitle: {
    color: '#968CA3',
    fontSize: 10,
    marginTop: 4,
  },

  logoutButton: {
    backgroundColor: '#FFF0F0',
    borderRadius: 13,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 15,
  },

  logoutText: {
    color: '#E14B4B',
    fontSize: 13,
    fontWeight: '800',
  },

  footerText: {
    textAlign: 'center',
    color: '#A397B7',
    fontSize: 10,
    marginTop: 17,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 19,
    maxHeight: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#34234D',
  },

  modalSubtitle: {
    fontSize: 11,
    color: '#968CA3',
    marginTop: 4,
  },

  formGroup: {
    marginBottom: 13,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#625475',
    marginBottom: 7,
  },

  formInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E7DDF3',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#34234D',
    fontSize: 13,
  },

  saveButton: {
    height: 47,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
    marginBottom: 5,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
