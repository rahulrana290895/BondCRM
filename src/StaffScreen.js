import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config/config';

const API_URL = `${BASE_URL.replace(/\/+$/, '')}/staff.php`;

export default function StaffScreen({navigation}) {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('Staff');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================
  // GET COMPANY ID FROM ASYNC STORAGE
  // =====================================
  const getCompanyId = async () => {
    let id = await AsyncStorage.getItem('company_id');

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
          id =
            id ||
            user.company_id ||
            user.companyId ||
            '';
        }
      } catch (error) {
        console.log('Storage parse error:', error);
      }
    }

    return String(id || '');
  };

  // =====================================
  // API REQUEST
  // =====================================
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

  // =====================================
  // LOAD STAFF FROM DATABASE
  // =====================================
  const loadStaff = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      let currentCompanyId = companyId;

      if (!currentCompanyId) {
        currentCompanyId = await getCompanyId();
        setCompanyId(currentCompanyId);
      }

      if (!currentCompanyId) {
        Alert.alert(
          'Company ID Missing',
          'Company ID AsyncStorage mein nahi mila. Login data check karein.',
        );
        setStaff([]);
        return;
      }

      const result = await callAPI({
        action: 'list',
        company_id: currentCompanyId,
        filter: 'All',
      });

      if (!result.success) {
        throw new Error(result.message || 'Staff list failed');
      }

      const staffList = result.data?.staff || [];

      setStaff(
        staffList.map(item => ({
          ...item,
          id: String(item.id),
          phone: String(item.number || item.phone || ''),
          active: Number(item.status) === 1,
          role: item.role || 'Staff',
        })),
      );
    } catch (error) {
      console.log('Load Staff Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Unable to load staff.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStaff(false);
  };

  // =====================================
  // SUMMARY
  // =====================================
  const totalStaff = staff.length;
  const activeStaff = staff.filter(item => item.active).length;
  const inactiveStaff = totalStaff - activeStaff;

  // =====================================
  // SEARCH AND FILTER
  // =====================================
  const filteredStaff = staff.filter(item => {
    const searchText = search.toLowerCase();

    const matchSearch =
      String(item.name || '').toLowerCase().includes(searchText) ||
      String(item.designation || '').toLowerCase().includes(searchText) ||
      String(item.phone || '').includes(searchText) ||
      String(item.email || '').toLowerCase().includes(searchText);

    const matchFilter =
      filter === 'All' ||
      (filter === 'Active' && item.active) ||
      (filter === 'Inactive' && !item.active);

    return matchSearch && matchFilter;
  });

  // =====================================
  // RESET FORM
  // =====================================
  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setDesignation('');
    setRole('Staff');
    setPassword('');
    setShowPassword(false);
  };

  // =====================================
  // ADD STAFF MODAL
  // =====================================
  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // =====================================
  // EDIT STAFF MODAL
  // =====================================
  const openEditModal = item => {
    setEditingId(item.id);
    setName(item.name || '');
    setPhone(item.phone || '');
    setEmail(item.email || '');
    setDesignation(item.designation || '');
    setRole(
      String(item.role).toLowerCase() === 'admin'
        ? 'Admin'
        : 'Staff',
    );
    setPassword('');
    setShowPassword(false);
    setModalVisible(true);
  };

  // =====================================
  // SAVE STAFF - ADD / UPDATE API
  // =====================================
  const saveStaff = async () => {
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !designation.trim()
    ) {
      Alert.alert('Required', 'Please fill all staff details.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      Alert.alert('Invalid Mobile', 'Enter valid 10 digit mobile number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!editingId && !password.trim()) {
      Alert.alert('Required', 'Please enter staff password.');
      return;
    }

    if (password.trim() && password.trim().length < 6) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 6 characters.',
      );
      return;
    }

    if (!companyId) {
      Alert.alert('Error', 'Company ID not found.');
      return;
    }

    setSaving(true);

    try {
      const params = {
        action: editingId ? 'update' : 'add',
        company_id: companyId,
        name: name.trim(),
        designation: designation.trim(),
        number: phone.trim(),
        email: email.trim().toLowerCase(),
        role: role,
        password: password.trim(),
      };

      if (editingId) {
        params.id = editingId;
      }

      const result = await callAPI(params);

      if (!result.success) {
        throw new Error(result.message || 'Unable to save staff.');
      }

      setModalVisible(false);
      resetForm();

      Alert.alert(
        'Success',
        result.message ||
          (editingId
            ? 'Staff updated successfully.'
            : 'Staff added successfully.'),
      );

      await loadStaff(false);
    } catch (error) {
      console.log('Save Staff Error:', error);
      Alert.alert('Error', error.message || 'Staff save failed.');
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // TOGGLE ACTIVE / INACTIVE
  // =====================================
  const toggleStatus = item => {
    const newStatus = item.active ? 'Inactive' : 'Active';

    Alert.alert(
      'Change Staff Status',
      `Are you sure you want to ${newStatus.toLowerCase()} this staff member?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const result = await callAPI({
                action: 'toggle_status',
                company_id: companyId,
                id: item.id,
              });

              if (!result.success) {
                throw new Error(result.message || 'Status update failed.');
              }

              await loadStaff(false);

              Alert.alert('Success', result.message);
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  // =====================================
  // DELETE STAFF
  // =====================================
  const deleteStaff = id => {
    Alert.alert(
      'Delete Staff',
      'Are you sure you want to delete this staff member?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await callAPI({
                action: 'delete',
                company_id: companyId,
                id: id,
              });

              if (!result.success) {
                throw new Error(result.message || 'Delete failed.');
              }

              await loadStaff(false);

              Alert.alert('Success', result.message);
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  // =====================================
  // LOADING SCREEN
  // =====================================
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor="#6422CB" barStyle="light-content" />
        <ActivityIndicator size="large" color="#702ACB" />
        <Text style={styles.loadingText}>Loading Staff...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>

      <StatusBar backgroundColor="#6422CB" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={['#8139EC', '#5018B9']}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Staff Management</Text>

        <View style={{width: 25}} />
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

        {/* PAGE TITLE */}
        <View style={styles.headingSection}>
          <Text style={styles.heading}>Manage Your Team</Text>
          <Text style={styles.subHeading}>
            Manage your team members
          </Text>
        </View>

        {/* SUMMARY CARDS */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, {backgroundColor: '#EAF0FF'}]}>
            <View style={[styles.statIcon, {backgroundColor: '#DCE8FF'}]}>
              <Ionicons name="people" size={23} color="#3979ED" />
            </View>
            <Text style={styles.statLabel}>Total Staff</Text>
            <Text style={styles.statNumber}>{totalStaff}</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: '#E5F8EF'}]}>
            <View style={[styles.statIcon, {backgroundColor: '#D1F1E1'}]}>
              <Ionicons name="checkmark-circle" size={23} color="#10A36B" />
            </View>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statNumber}>{activeStaff}</Text>
          </View>

          <View style={[styles.statCard, {backgroundColor: '#FFECEF'}]}>
            <View style={[styles.statIcon, {backgroundColor: '#FFDDE3'}]}>
              <Ionicons name="close-circle" size={23} color="#E44B60" />
            </View>
            <Text style={styles.statLabel}>Inactive</Text>
            <Text style={styles.statNumber}>{inactiveStaff}</Text>
          </View>
        </View>

        {/* SEARCH AND ADD */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={22} color="#77718A" />

            <TextInput
              style={styles.searchInput}
              placeholder="Search staff by name or role"
              placeholderTextColor="#9994A5"
              value={search}
              onChangeText={setSearch}
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={19} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addButton}
            onPress={openAddModal}>
            <LinearGradient
              colors={['#853BEF', '#581AC5']}
              style={styles.addGradient}>
              <Ionicons name="add" size={23} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* FILTERS */}
        <View style={styles.filterRow}>
          {['All', 'Active', 'Inactive'].map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filterButton,
                filter === item && styles.activeFilter,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeFilterText,
                ]}>
                {item}
              </Text>

              {item === 'All' && (
                <Text
                  style={[
                    styles.filterCount,
                    filter === item && styles.activeFilterText,
                  ]}>
                  {totalStaff}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* STAFF LIST */}
        <View style={styles.staffListCard}>
          <View style={styles.listHeading}>
            <Text style={styles.listTitle}>All Staff Members</Text>
            <Text style={styles.listCount}>
              {filteredStaff.length} Members
            </Text>
          </View>

          {filteredStaff.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#B6A7D2" />
              <Text style={styles.emptyTitle}>No Staff Found</Text>
              <Text style={styles.emptySubtitle}>
                Add a new staff member to get started.
              </Text>
            </View>
          ) : (
            filteredStaff.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.staffItem,
                  index === filteredStaff.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}>

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(item.name || 'S').charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.staffInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.staffName}>{item.name}</Text>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: item.active
                            ? '#E0F6EB'
                            : '#FFE5E9',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: item.active ? '#129764' : '#D94358',
                          },
                        ]}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.designation}>
                    {item.designation}
                  </Text>

                  <View style={styles.contactRow}>
                    <Ionicons
                      name="call-outline"
                      size={14}
                      color="#77718A"
                    />
                    <Text style={styles.contactText}>
                      +91 {item.phone}
                    </Text>
                  </View>

                  <View style={styles.contactRow}>
                    <Ionicons
                      name="mail-outline"
                      size={14}
                      color="#77718A"
                    />
                    <Text style={styles.contactText} numberOfLines={1}>
                      {item.email}
                    </Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openEditModal(item)}>
                      <Ionicons
                        name="create-outline"
                        size={15}
                        color="#6127C6"
                      />
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.statusAction}
                      onPress={() => toggleStatus(item)}>
                      <Ionicons
                        name={
                          item.active
                            ? 'pause-circle-outline'
                            : 'play-circle-outline'
                        }
                        size={15}
                        color={item.active ? '#D28A19' : '#159568'}
                      />
                      <Text
                        style={[
                          styles.actionText,
                          {color: item.active ? '#D28A19' : '#159568'},
                        ]}>
                        {item.active ? 'Deactivate' : 'Activate'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => deleteStaff(item.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#E34A59"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footer}>Powered by BondCRM</Text>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNavigation}>
        {[
          {name: 'Dashboard', icon: 'grid-outline', route: 'Dashboard'},
          {name: 'All Leads', icon: 'people-outline', route: 'AllLeads'},
          {name: 'Add Lead', icon: 'add', route: 'AddLead'},
          {name: 'Pipeline', icon: 'git-branch-outline', route: 'LeadPipeline'},
          {name: 'Follow Up', icon: 'calendar-outline', route: 'FollowUp'},
        ].map((item, index) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation?.navigate(item.route)}>
            {index === 2 ? (
              <LinearGradient
                colors={['#853BEF', '#581AC5']}
                style={styles.addNavButton}>
                <Ionicons name="add" size={29} color="#FFFFFF" />
              </LinearGradient>
            ) : (
              <Ionicons
                name={item.icon}
                size={22}
                color="#817A90"
              />
            )}
            <Text style={styles.navText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ADD / EDIT STAFF MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>

        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Edit Staff' : 'Add New Staff'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  Enter staff member details
                </Text>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name="close-circle"
                  size={28}
                  color="#8B829B"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              {[
                {
                  label: 'Full Name *',
                  icon: 'person-outline',
                  value: name,
                  set: setName,
                  keyboard: 'default',
                },
                {
                  label: 'Designation *',
                  icon: 'briefcase-outline',
                  value: designation,
                  set: setDesignation,
                  keyboard: 'default',
                },
                {
                  label: 'Mobile Number *',
                  icon: 'call-outline',
                  value: phone,
                  set: text =>
                    setPhone(text.replace(/[^0-9]/g, '').slice(0, 10)),
                  keyboard: 'phone-pad',
                },
                {
                  label: 'Email Address *',
                  icon: 'mail-outline',
                  value: email,
                  set: setEmail,
                  keyboard: 'email-address',
                },
              ].map((field, index) => (
                <View style={styles.modalInput} key={index}>
                  <Ionicons
                    name={field.icon}
                    size={20}
                    color="#77718A"
                  />

                  <TextInput
                    style={styles.modalTextInput}
                    placeholder={field.label}
                    placeholderTextColor="#9994A5"
                    value={field.value}
                    onChangeText={field.set}
                    keyboardType={field.keyboard}
                    autoCapitalize={
                      field.keyboard === 'email-address' ? 'none' : 'words'
                    }
                  />
                </View>
              ))}

              {/* PASSWORD FIELD */}
              <View style={styles.modalInput}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#77718A"
                />

                <TextInput
                  style={styles.modalTextInput}
                  placeholder={
                    editingId
                      ? 'New Password (Optional)'
                      : 'Password *'
                  }
                  placeholderTextColor="#9994A5"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color="#77718A"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.passwordHint}>
                {editingId
                  ? 'Leave blank to keep the existing password.'
                  : 'Minimum 6 characters required.'}
              </Text>

              <Text style={styles.roleLabel}>Staff Role</Text>

              <View style={styles.roleRow}>
                {['Admin', 'Staff'].map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setRole(item)}
                    style={[
                      styles.roleButton,
                      role === item && styles.selectedRole,
                    ]}>
                    <Text
                      style={[
                        styles.roleText,
                        role === item && styles.selectedRoleText,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  saving && {opacity: 0.7},
                ]}
                activeOpacity={0.85}
                disabled={saving}
                onPress={saveStaff}>
                <LinearGradient
                  colors={['#8138EC', '#541BC2']}
                  style={styles.saveGradient}>
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text style={styles.saveText}>
                        {editingId ? 'Update Staff' : 'Save Staff'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F6FC',
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
    height: 62,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 25,
  },
  headingSection: {
    marginBottom: 17,
  },
  heading: {
    fontSize: 20,
    color: '#29174F',
    fontWeight: '800',
  },
  subHeading: {
    color: '#8C849C',
    fontSize: 12,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 14,
    padding: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: 39,
    height: 39,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#625B70',
  },
  statNumber: {
    fontSize: 23,
    color: '#30234C',
    fontWeight: '900',
    marginTop: 1,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 13,
  },
  searchBox: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#CFC3E7',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    color: '#30234C',
    paddingVertical: 0,
  },
  addButton: {
    width: 92,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  addButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E0F1',
  },
  activeFilter: {
    backgroundColor: '#6425CC',
    borderColor: '#6425CC',
  },
  filterText: {
    fontSize: 11,
    color: '#6C637C',
    fontWeight: '600',
  },
  filterCount: {
    fontSize: 10,
    color: '#6C637C',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  staffListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 13,
    paddingTop: 16,
    elevation: 2,
    shadowColor: '#5A3B91',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  listTitle: {
    fontSize: 15,
    color: '#30234C',
    fontWeight: '800',
  },
  listCount: {
    fontSize: 10,
    color: '#8A8298',
  },
  staffItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE8F4',
    gap: 11,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: '#EEE7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#6228C6',
    fontSize: 23,
    fontWeight: '900',
  },
  staffInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },
  staffName: {
    flex: 1,
    fontSize: 15,
    color: '#251A3B',
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  designation: {
    fontSize: 12,
    color: '#70677F',
    marginTop: 4,
    marginBottom: 7,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },
  contactText: {
    flex: 1,
    fontSize: 10,
    color: '#5F566F',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 9,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 10,
    color: '#6127C6',
    fontWeight: '700',
  },
  statusAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 45,
  },
  emptyTitle: {
    color: '#37264E',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#9990A7',
    fontSize: 11,
    marginTop: 5,
  },
  footer: {
    textAlign: 'center',
    color: '#AAA1B9',
    fontSize: 10,
    marginTop: 20,
  },
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
  addNavButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -19,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(25,10,55,0.35)',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 22,
    paddingBottom: 35,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#35117F',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#90869F',
    marginTop: 4,
  },
  modalInput: {
    minHeight: 53,
    borderWidth: 1,
    borderColor: '#DED6EA',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 12,
    gap: 10,
  },
  modalTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#30234C',
    paddingVertical: 12,
  },
  passwordHint: {
    color: '#8C849C',
    fontSize: 10,
    marginTop: -5,
    marginBottom: 14,
    marginLeft: 4,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#514365',
    marginTop: 5,
    marginBottom: 10,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DED6EA',
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#6425CC',
    borderColor: '#6425CC',
  },
  roleText: {
    color: '#635A72',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedRoleText: {
    color: '#FFFFFF',
  },
  saveButton: {
    height: 53,
    borderRadius: 11,
    overflow: 'hidden',
    elevation: 3,
  },
  saveGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
