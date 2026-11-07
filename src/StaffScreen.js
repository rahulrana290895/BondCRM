
import React, {useState} from 'react';
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
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const initialStaff = [
  {
    id: '1',
    name: 'Amit Kumar',
    designation: 'Admin',
    phone: '9876543210',
    email: 'amit@example.com',
    role: 'Admin',
    active: true,
  },
  {
    id: '2',
    name: 'Priya Verma',
    designation: 'Sales Executive',
    phone: '9123456789',
    email: 'priya@example.com',
    role: 'Staff',
    active: true,
  },
  {
    id: '3',
    name: 'Rahul Singh',
    designation: 'Team Leader',
    phone: '9876512345',
    email: 'rahul@example.com',
    role: 'Staff',
    active: false,
  },
  {
    id: '4',
    name: 'Neha Sharma',
    designation: 'Sales Executive',
    phone: '9988766554',
    email: 'neha@example.com',
    role: 'Staff',
    active: true,
  },
];

export default function StaffScreen({navigation}) {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('Staff');

  const totalStaff = staff.length;
  const activeStaff = staff.filter(item => item.active).length;
  const inactiveStaff = totalStaff - activeStaff;

  const filteredStaff = staff.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.designation.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search);

    const matchFilter =
      filter === 'All' ||
      (filter === 'Active' && item.active) ||
      (filter === 'Inactive' && !item.active);

    return matchSearch && matchFilter;
  });

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setDesignation('');
    setRole('Staff');
    setModalVisible(true);
  };

  const openEditModal = item => {
    setEditingId(item.id);
    setName(item.name);
    setPhone(item.phone);
    setEmail(item.email);
    setDesignation(item.designation);
    setRole(item.role);
    setModalVisible(true);
  };

  const saveStaff = () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !designation.trim()) {
      Alert.alert('Required', 'Please fill all staff details.');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Invalid Mobile', 'Enter valid 10 digit mobile number.');
      return;
    }

    const staffData = {
      name: name.trim(),
      phone,
      email: email.trim(),
      designation: designation.trim(),
      role,
      active: true,
    };

    if (editingId) {
      setStaff(previous =>
        previous.map(item =>
          item.id === editingId
            ? {...item, ...staffData}
            : item,
        ),
      );
    } else {
      setStaff(previous => [
        ...previous,
        {...staffData, id: Date.now().toString()},
      ]);
    }

    setModalVisible(false);
    Alert.alert('Success', editingId ? 'Staff updated successfully.' : 'Staff added successfully.');
  };

  const toggleStatus = id => {
    setStaff(previous =>
      previous.map(item =>
        item.id === id
          ? {...item, active: !item.active}
          : item,
      ),
    );
  };

  const deleteStaff = id => {
    Alert.alert(
      'Delete Staff',
      'Are you sure you want to delete this staff member?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setStaff(previous =>
              previous.filter(item => item.id !== id),
            ),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <StatusBar
        backgroundColor="#6422CB"
        barStyle="light-content"
      />

      {/* HEADER */}
      <LinearGradient
        colors={['#8139EC', '#5018B9']}
        style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Staff Management</Text>

        <TouchableOpacity
          onPress={() => navigation?.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={29} color="#FFFFFF" />
        </TouchableOpacity>

      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

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
                <Text style={[
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
            <Text style={styles.listCount}>{filteredStaff.length} Members</Text>
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

                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {/* Staff Info */}
                <View style={styles.staffInfo}>

                  <View style={styles.nameRow}>
                    <Text style={styles.staffName}>{item.name}</Text>

                    <View style={[
                      styles.statusBadge,
                      {backgroundColor: item.active ? '#E0F6EB' : '#FFE5E9'},
                    ]}>
                      <Text style={[
                        styles.statusText,
                        {color: item.active ? '#129764' : '#D94358'},
                      ]}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.designation}>{item.designation}</Text>

                  <View style={styles.contactRow}>
                    <Ionicons name="call-outline" size={14} color="#77718A" />
                    <Text style={styles.contactText}>+91 {item.phone}</Text>
                  </View>

                  <View style={styles.contactRow}>
                    <Ionicons name="mail-outline" size={14} color="#77718A" />
                    <Text style={styles.contactText} numberOfLines={1}>
                      {item.email}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionRow}>

                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openEditModal(item)}>
                      <Ionicons name="create-outline" size={15} color="#6127C6" />
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.statusAction}
                      onPress={() => toggleStatus(item.id)}>
                      <Ionicons
                        name={item.active ? 'pause-circle-outline' : 'play-circle-outline'}
                        size={15}
                        color={item.active ? '#D28A19' : '#159568'}
                      />
                      <Text style={[
                        styles.actionText,
                        {color: item.active ? '#D28A19' : '#159568'},
                      ]}>
                        {item.active ? 'Deactivate' : 'Activate'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteStaff(item.id)}>
                      <Ionicons name="trash-outline" size={18} color="#E34A59" />
                    </TouchableOpacity>

                  </View>

                </View>
              </View>
            ))
          )}

        </View>

        {/* FOOTER */}
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
                <Ionicons name="close-circle" size={28} color="#8B829B" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">

              {[
                {
                  label: 'Full Name *',
                  icon: 'person-outline',
                  value: name,
                  set: setName,
                  keyboard: 'default',
                },
                {
                  label: 'Mobile Number *',
                  icon: 'call-outline',
                  value: phone,
                  set: text => setPhone(text.replace(/[^0-9]/g, '').slice(0, 10)),
                  keyboard: 'phone-pad',
                },
                {
                  label: 'Email Address *',
                  icon: 'mail-outline',
                  value: email,
                  set: setEmail,
                  keyboard: 'email-address',
                },
                {
                  label: 'Designation *',
                  icon: 'briefcase-outline',
                  value: designation,
                  set: setDesignation,
                  keyboard: 'default',
                },
              ].map((field, index) => (
                <View style={styles.modalInput} key={index}>
                  <Ionicons name={field.icon} size={20} color="#77718A" />
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder={field.label}
                    placeholderTextColor="#9994A5"
                    value={field.value}
                    onChangeText={field.set}
                    keyboardType={field.keyboard}
                    autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
                  />
                </View>
              ))}

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
                    <Text style={[
                      styles.roleText,
                      role === item && styles.selectedRoleText,
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={saveStaff}>

                <LinearGradient
                  colors={['#8138EC', '#541BC2']}
                  style={styles.saveGradient}>

                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />

                  <Text style={styles.saveText}>
                    {editingId ? 'Update Staff' : 'Save Staff'}
                  </Text>

                </LinearGradient>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FC',
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

  // SUMMARY
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

  // SEARCH
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

  // FILTER
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

  // STAFF LIST
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

  addNavButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -19,
    elevation: 5,
  },

  // ADD STAFF MODAL
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
    maxHeight: '85%',
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
    height: 53,
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
