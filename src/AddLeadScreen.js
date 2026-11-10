import React, {useState, useEffect} from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Modal, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config/config';

const priorities = ['Low', 'Medium', 'High'];
export default function AddLeadScreen({navigation, route}) {
  const editingLead = route?.params?.lead;
  const isEdit = !!route?.params?.isEdit;

  const [leadName, setLeadName] = useState(editingLead?.name || '');
  const [mobile, setMobile] = useState(editingLead?.number || editingLead?.phone || '');
  const [whatsapp, setWhatsapp] = useState(editingLead?.whatsapp || '');
  const [interestedIn, setInterestedIn] = useState(editingLead?.interested_in_name || editingLead?.interested_in || '');
  const [interestedInId, setInterestedInId] = useState(
    editingLead?.interested_in_id ? String(editingLead.interested_in_id) : 'NA',
  );
  const [priority, setPriority] = useState(editingLead?.priority || 'Medium');
  const [note, setNote] = useState(editingLead?.note || editingLead?.notes || '');

  const [interestedOptions, setInterestedOptions] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // FETCH COMPANY ITEMS
  const fetchCompanyItems = async () => {
    try {
      setItemsLoading(true);

      const companyId = await AsyncStorage.getItem('company_id');

      if (!companyId) {
        Alert.alert('Error', 'Company ID not found. Please login again.');
        return;
      }

      const formData = new FormData();
      formData.append('company_id', companyId);

      const response = await fetch(`${BASE_URL}/get_company_items.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const options = [
          {id: 'NA', name: 'N/A', type: 'na'},
          ...(result.data || []).map(item => ({
            id: String(item.id),
            name: item.name,
            type: item.type,
          })),
        ];

        setInterestedOptions(options);

        const selected = options.find(
          item => item.id === String(editingLead?.interested_in_id || 'NA'),
        );

        if (selected) {
          setInterestedIn(selected.name);
          setInterestedInId(selected.id);
        }
      } else {
        Alert.alert('Error', result.message || 'Unable to load items');
      }
    } catch (error) {
      console.log('Items Error:', error);
      Alert.alert('Connection Error', 'Unable to load company items');
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyItems();
  }, []);

  // DROPDOWN
  const openDropdown = (type, options) => {
    setDropdownType(type);
    setDropdownOptions(options);
    setDropdownVisible(true);
  };

  const selectDropdown = item => {
    if (dropdownType === 'interested') {
      setInterestedIn(item.name);
      setInterestedInId(String(item.id));
    } else {
      setPriority(item);
    }
    setDropdownVisible(false);
  };

  // SAVE / UPDATE LEAD
  const saveLead = async () => {
    if (!leadName.trim() || !mobile.trim()) {
      return Alert.alert('Required', 'Name and Number are required');
    }


    try {
      setSaving(true);

      const companyId = await AsyncStorage.getItem('company_id');

      if (!companyId) {
        Alert.alert('Error', 'Company ID not found. Please login again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/leads.php`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: isEdit ? 'update' : 'add',
          id: editingLead?.id,
          company_id: companyId,
          name: leadName.trim(),
          number: mobile.trim(),
          whatsapp: whatsapp.trim(),
          interested_in_id: interestedInId || 'NA',
          priority,
          note: note.trim(),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        return Alert.alert('Error', result.message || 'Unable to save lead');
      }

      Alert.alert('Success', result.message || 'Lead saved successfully', [
        {text: 'OK', onPress: () => navigation?.goBack()},
      ]);
    } catch (error) {
      console.log('Save Lead Error:', error);
      Alert.alert('Connection Error', 'Unable to connect to server');
    } finally {
      setSaving(false);
    }
  };

  // INPUT COMPONENT
  const renderInput = (
    label, icon, placeholder, value, onChangeText,
    keyboardType = 'default', required = false, maxLength,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label}{required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.inputBox}>
        <Ionicons name={icon} size={20} color="#68528D" />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9288A5"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  // DROPDOWN COMPONENT
  const renderDropdown = (
    label, icon, value, placeholder, onPress, required = false, loading = false,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label}{required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={styles.inputBox}
        onPress={onPress}
        activeOpacity={0.75}
        disabled={loading}>
        <Ionicons name={icon} size={20} color="#68528D" />

        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {loading ? 'Loading items...' : value || placeholder}
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#6425CC" />
        ) : (
          <Ionicons name="chevron-down" size={20} color="#6425CC" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#6422C9" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient colors={['#8739EB', '#5018B9']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Lead' : 'Add Lead'}
        </Text>

        <View style={{width: 25}} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          {/* INTRO CARD */}
          <LinearGradient colors={['#FFFFFF', '#F0E7FF']} style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="person-add" size={30} color="#FFFFFF" />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.introTitle}>Add New Lead</Text>
              <Text style={styles.introSubtitle}>
                Enter contact details and add the lead to your pipeline
              </Text>
            </View>
          </LinearGradient>

          {/* FORM */}
          <View style={styles.formCard}>
            {renderInput(
              'Name', 'person-outline', 'Enter lead name',
              leadName, setLeadName, 'default', true,
            )}

            {renderInput(
              'Number',
              'call-outline',
              'Enter mobile number (up to 15 digits)',
              mobile,
              value => setMobile(value.replace(/[^0-9]/g, '').slice(0, 15)),
              'phone-pad',
              true,
              15,
            )}

            {renderInput(
              'WhatsApp Number',
              'logo-whatsapp',
              'Enter WhatsApp number (up to 15 digits)',
              whatsapp,
              value => setWhatsapp(value.replace(/[^0-9]/g, '').slice(0, 15)),
              'phone-pad',
              false,
              15,
            )}

            {renderDropdown(
              'Interested In', 'layers-outline', interestedIn,
              'Select product / service / project',
              () => openDropdown('interested', interestedOptions),
              true, itemsLoading,
            )}

            {renderDropdown(
              'Priority', 'flag-outline', priority,
              'Select priority',
              () => openDropdown('priority', priorities),
              true,
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Note</Text>
              <View style={styles.notesBox}>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Enter note or additional details..."
                  placeholderTextColor="#9288A5"
                  value={note}
                  onChangeText={setNote}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveLead}
              activeOpacity={0.85}
              disabled={saving}>
              <LinearGradient colors={['#913EED', '#5719C1']} style={styles.saveGradient}>
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.saveText}>
                      {isEdit ? 'Update Lead' : 'Save Lead'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNavigation}>
        {[
          {name: 'Dashboard', icon: 'home-outline', route: 'Dashboard'},
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
              <LinearGradient colors={['#8739EB', '#5719C1']} style={styles.addNavButton}>
                <Ionicons name="add" size={29} color="#FFFFFF" />
              </LinearGradient>
            ) : (
              <Ionicons name={item.icon} size={22} color="#655C7B" />
            )}

            <Text style={[styles.navText, index === 2 && styles.activeNavText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DROPDOWN MODAL */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          />

          <View style={styles.dropdownModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {dropdownType === 'interested' ? 'Interested In' : 'Priority'}
              </Text>

              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Ionicons name="close-circle" size={27} color="#887D9C" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {dropdownOptions.map(item => {
                const itemName = dropdownType === 'interested' ? item.name : item;
                const itemKey = dropdownType === 'interested' ? item.id : item;
                const selected = dropdownType === 'interested'
                  ? interestedInId === String(item.id)
                  : priority === item;

                return (
                  <TouchableOpacity
                    key={itemKey}
                    style={styles.dropdownOption}
                    onPress={() => selectDropdown(item)}>
                    <View style={{flex: 1}}>
                      <Text style={styles.dropdownOptionText}>{itemName}</Text>
                      {dropdownType === 'interested' && item.type !== 'na' && (
                        <Text style={styles.itemType}>{item.type}</Text>
                      )}
                    </View>

                    <Ionicons
                      name={selected ? 'radio-button-on' : 'radio-button-off'}
                      size={21}
                      color="#6825CB"
                    />
                  </TouchableOpacity>
                );
              })}

              {dropdownOptions.length === 0 && (
                <Text style={styles.emptyText}>No items available.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F6FF'},

  header: {
    height: 62, paddingHorizontal: 17, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },

  headerTitle: {
    flex: 1, color: '#FFFFFF', fontSize: 19,
    fontWeight: '800', textAlign: 'center',
  },

  scrollContent: {paddingHorizontal: 15, paddingTop: 15, paddingBottom: 18},

  introCard: {
    minHeight: 100, borderRadius: 17, padding: 15,
    flexDirection: 'row', alignItems: 'center', gap: 13,
    marginBottom: 17, borderWidth: 1, borderColor: '#E8DCFF',
  },

  introIcon: {
    width: 58, height: 58, borderRadius: 30,
    backgroundColor: '#8539E6', alignItems: 'center',
    justifyContent: 'center',
  },

  introTitle: {fontSize: 18, fontWeight: '900', color: '#35117F'},

  introSubtitle: {
    fontSize: 12, color: '#725A99', marginTop: 5, lineHeight: 17,
  },

  formCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 15,
    elevation: 2, shadowColor: '#62419A', shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  fieldContainer: {marginBottom: 16},

  label: {
    fontSize: 13, fontWeight: '800', color: '#35117F', marginBottom: 8,
  },

  required: {color: '#EF365A'},

  inputBox: {
    minHeight: 50, borderWidth: 1, borderColor: '#BCA2E9',
    borderRadius: 11, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, gap: 9, backgroundColor: '#FFFEFF',
  },

  input: {
    flex: 1, minWidth: 0, fontSize: 14,
    color: '#30234C', paddingVertical: 10,
  },

  dropdownText: {
    flex: 1, fontSize: 14, color: '#49376B', paddingVertical: 14,
  },

  placeholderText: {color: '#9288A5'},

  notesBox: {
    minHeight: 105, borderWidth: 1,
    borderColor: '#BCA2E9', borderRadius: 11, padding: 11,
  },

  notesInput: {minHeight: 80, fontSize: 14, color: '#30234C'},

  saveButton: {
    height: 54, borderRadius: 12, overflow: 'hidden',
    marginTop: 3, marginBottom: 5,
  },

  saveGradient: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },

  saveText: {color: '#FFFFFF', fontSize: 16, fontWeight: '900'},

  bottomNavigation: {
    height: 70, backgroundColor: '#FFFFFF', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-around',
    borderTopWidth: 1, borderTopColor: '#EEE9F5', paddingHorizontal: 4,
  },

  navItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4,
  },

  navText: {fontSize: 9, color: '#817A90', fontWeight: '500'},

  activeNavText: {color: '#6825CB', fontWeight: '800'},

  addNavButton: {
    width: 43, height: 43, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    marginTop: -19, elevation: 5,
  },

  modalBackground: {
    flex: 1, justifyContent: 'center',
    backgroundColor: 'rgba(25,10,55,0.4)', padding: 20,
  },

  modalOverlay: {...StyleSheet.absoluteFillObject},

  dropdownModal: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    padding: 17, maxHeight: '75%',
  },

  modalHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },

  modalTitle: {fontSize: 17, fontWeight: '900', color: '#35117F'},

  dropdownOption: {
    minHeight: 49, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', borderBottomWidth: 1,
    borderBottomColor: '#F0EBF6', paddingVertical: 10,
  },

  dropdownOptionText: {fontSize: 14, color: '#45345F', fontWeight: '600'},

  itemType: {
    fontSize: 11, color: '#9288A5', marginTop: 3, textTransform: 'capitalize',
  },

  emptyText: {
    fontSize: 13, color: '#9288A5', textAlign: 'center', padding: 20,
  },
});