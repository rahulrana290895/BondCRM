
import React, {useState} from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const initialProfile = {
  name: 'Rahul Sharma',
  designation: 'Administrator',
  email: 'rahul@example.com',
  phone: '9876543210',
  company: 'ABC Technologies',
  address: 'Chandigarh, India',
};

export default function ProfileScreen({navigation}) {
  const [profile, setProfile] = useState(initialProfile);
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [company, setCompany] = useState(profile.company);
  const [address, setAddress] = useState(profile.address);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const saveProfile = () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Required', 'Name, mobile and email are required');
      return;
    }

    setProfile({
      ...profile,
      name,
      email,
      phone,
      company,
      address,
    });

    setEditVisible(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Required', 'Please fill all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password Error', 'New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Password Error', 'Password must be at least 6 characters');
      return;
    }

    setPasswordVisible(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Success', 'Password change request submitted');
  };

  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
        },
      ],
    );
  };

  const openEdit = () => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setCompany(profile.company);
    setAddress(profile.address);
    setEditVisible(true);
  };

  const menuItems = [
    {
      icon: 'lock-closed-outline',
      title: 'Change Password',
      subtitle: 'Update your account password',
      onPress: () => setPasswordVisible(true),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

      <LinearGradient
        colors={['#8739EB', '#5719B9']}
        style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>
            Manage your account and settings
          </Text>
        </View>

        <TouchableOpacity style={styles.headerIcon} onPress={openEdit}>
          <Ionicons name="create-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Profile Card */}
        <LinearGradient
          colors={['#8739EB', '#6425C8', '#5018A9']}
          style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => Alert.alert('Profile Photo', 'Photo upload will be connected later.')}>
              <Ionicons name="camera" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileDesignation}>{profile.designation}</Text>

          <View style={styles.memberBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#FFE49A" />
            <Text style={styles.memberBadgeText}>Administrator Account</Text>
          </View>

          <TouchableOpacity style={styles.editProfileButton} onPress={openEdit}>
            <Ionicons name="create-outline" size={16} color="#6425C8" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Account Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <ProfileInfo icon="person-outline" label="Full Name" value={profile.name} />
          <ProfileInfo icon="call-outline" label="Mobile Number" value={profile.phone} />
          <ProfileInfo icon="mail-outline" label="Email Address" value={profile.email} />
          <ProfileInfo icon="briefcase-outline" label="Designation" value={profile.designation} last />
        </View>


        {/* Account Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && {borderBottomWidth: 0},
              ]}
              onPress={item.onPress}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={20} color="#7040C0" />
              </View>

              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#AAA0B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#E14B4B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.buildingArea}>
          <View style={styles.buildingOne}>
            <View style={styles.windowRow}>
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
            <View style={styles.windowRow}>
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
          </View>
          <View style={styles.buildingTwo}>
            <View style={styles.windowRow}>
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
            <View style={styles.windowRow}>
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
            <View style={styles.windowRow}>
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
          </View>
          <View style={styles.buildingThree}>
            <View style={styles.windowRow}>
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
            <View style={styles.windowRow}>
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>BondCRM • Version 1.0.0</Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="home-outline" label="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
        <NavItem icon="people-outline" label="All Leads" onPress={() => navigation.navigate('AllLeads')} />

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

        <NavItem icon="git-branch-outline" label="Pipeline" onPress={() => navigation.navigate('LeadPipeline')} />
        <NavItem icon="calendar-outline" label="FollowUp" active onPress={() => navigation.navigate('FollowUp')} />

+
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FormInput label="Full Name" value={name} onChangeText={setName} />
              <FormInput label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <FormInput label="Mobile Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <FormInput label="Company Name" value={company} onChangeText={setCompany} />
              <FormInput label="Address" value={address} onChangeText={setAddress} />

              <TouchableOpacity onPress={saveProfile}>
                <LinearGradient
                  colors={['#8739EB', '#5719B9']}
                  style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={passwordVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setPasswordVisible(false)}>
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

            <TouchableOpacity onPress={changePassword}>
              <LinearGradient
                colors={['#8739EB', '#5719B9']}
                style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Update Password</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ProfileInfo({icon, label, value, last}) {
  return (
    <View style={[styles.profileInfoRow, last && {borderBottomWidth: 0}]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color="#7541B9" />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Not Available'}</Text>
      </View>
    </View>
  );
}

function FormInput({label, value, onChangeText, secureTextEntry, keyboardType}) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#A49BB3"
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      />
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6FF',
  },
  header: {
    minHeight: 68,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
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
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
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
  },
  avatarText: {
    fontSize: 35,
    fontWeight: '800',
    color: '#702ACB',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -3,
    right: -5,
    height: 28,
    width: 28,
    borderRadius: 10,
    backgroundColor: '#E9A83D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 17,
  },
  editProfileText: {
    color: '#6425C8',
    fontWeight: '800',
    fontSize: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewText: {
    color: '#702ACB',
    fontSize: 12,
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
    borderBottomWidth: 1,
    borderColor: '#F1ECF6',
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
  buildingArea: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    opacity: 0.55,
    marginTop: 15,
  },
  buildingOne: {
    width: 60,
    height: 55,
    backgroundColor: '#D7C3F3',
    padding: 9,
    gap: 7,
  },
  buildingTwo: {
    width: 72,
    height: 80,
    backgroundColor: '#B99AE8',
    padding: 9,
    gap: 7,
  },
  buildingThree: {
    width: 60,
    height: 63,
    backgroundColor: '#D7C3F3',
    padding: 9,
    gap: 7,
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  window: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  footerText: {
    textAlign: 'center',
    color: '#A397B7',
    fontSize: 10,
    marginTop: 8,
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
    marginBottom: 17,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#34234D',
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
