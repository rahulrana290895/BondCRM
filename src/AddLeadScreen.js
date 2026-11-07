
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const products = [
  'Website Development',
  'App Development',
  'Software Development',
  'Digital Marketing',
  'CRM Software',
  'ERP Software',
  'E-Commerce Website',
];

const stages = [
  'New Lead',
  'Contacted',
  'Interested',
  'Qualified',
  'Meeting',
  'Negotiation',
  'Won',
  'Lost',
];

const priorities = ['Low', 'Medium', 'High'];

export default function AddLeadScreen({navigation, route}) {

  const editingLead = route?.params?.lead;
  const isEdit = route?.params?.isEdit;

  const [leadName, setLeadName] = useState(editingLead?.name || '');
  const [mobile, setMobile] = useState(editingLead?.phone || '');
  const [email, setEmail] = useState(editingLead?.email || '');
  const [company, setCompany] = useState(editingLead?.company || '');
  const [product, setProduct] = useState(editingLead?.service || '');
  const [stage, setStage] = useState(editingLead?.stage || 'New Lead');
  const [leadValue, setLeadValue] = useState(editingLead?.value || '');
  const [followUp, setFollowUp] = useState(editingLead?.date || '');
  const [priority, setPriority] = useState(editingLead?.priority || 'Medium');
  const [notes, setNotes] = useState('');

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const openDropdown = (type, options) => {
    setDropdownType(type);
    setDropdownOptions(options);
    setDropdownVisible(true);
  };

  const selectDropdown = value => {
    if (dropdownType === 'product') setProduct(value);
    if (dropdownType === 'stage') setStage(value);
    if (dropdownType === 'priority') setPriority(value);

    setDropdownVisible(false);
  };

  const saveLead = () => {

    if (!leadName.trim()) {
      Alert.alert('Required', 'Please enter lead name.');
      return;
    }

    if (!mobile.trim() || mobile.length !== 10) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10 digit mobile number.');
      return;
    }

    if (!product) {
      Alert.alert('Required', 'Please select product / service / project.');
      return;
    }

    if (!stage) {
      Alert.alert('Required', 'Please select pipeline stage.');
      return;
    }

    const leadData = {
      id: editingLead?.id || Date.now().toString(),
      name: leadName.trim(),
      phone: mobile,
      email: email.trim(),
      company: company.trim(),
      service: product,
      stage,
      value: leadValue || '0',
      date: followUp,
      priority,
      notes,
    };

    // Replace this with your PHP API POST request.
    console.log('Lead Data:', leadData);

    Alert.alert(
      'Success',
      isEdit ? 'Lead updated successfully.' : 'Lead added successfully.',
      [
        {
          text: 'OK',
          onPress: () => navigation?.goBack(),
        },
      ]
    );
  };

  const renderInput = (
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    required = false
  ) => (
    <View style={styles.fieldContainer}>

      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <View style={styles.inputBox}>
        <Ionicons name={icon} size={21} color="#68528D" />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9288A5"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />

      </View>
    </View>
  );

  const renderDropdown = (label, icon, value, placeholder, onPress, required = false) => (
    <View style={styles.fieldContainer}>

      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity
        style={styles.inputBox}
        onPress={onPress}>

        <Ionicons name={icon} size={21} color="#68528D" />

        <Text
          style={[
            styles.dropdownText,
            !value && {color: '#9288A5'},
          ]}>
          {value || placeholder}
        </Text>

        <Ionicons name="chevron-down" size={21} color="#6425CC" />

      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <StatusBar backgroundColor="#6422C9" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={['#8739EB', '#5018B9']}
        style={styles.header}>

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
          <LinearGradient
            colors={['#FFFFFF', '#F0E7FF']}
            style={styles.introCard}>

            <View style={styles.introIcon}>
              <Ionicons name="person-add" size={33} color="#FFFFFF" />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.introTitle}>Add New Lead</Text>
              <Text style={styles.introSubtitle}>
                Capture lead details and add to your pipeline
              </Text>
            </View>

          </LinearGradient>

          {/* FORM CARD */}
          <View style={styles.formCard}>

            {/* NAME + MOBILE */}
            <View style={styles.twoColumns}>

              <View style={styles.column}>
                {renderInput(
                  'Lead Name',
                  'person-outline',
                  'Enter lead name',
                  leadName,
                  setLeadName,
                  'default',
                  true
                )}
              </View>

              <View style={styles.column}>
                {renderInput(
                  'Mobile Number',
                  'call-outline',
                  'Enter mobile number',
                  mobile,
                  value => setMobile(value.replace(/[^0-9]/g, '').slice(0, 10)),
                  'phone-pad',
                  true
                )}
              </View>

            </View>

            {/* EMAIL + COMPANY */}
            <View style={styles.twoColumns}>

              <View style={styles.column}>
                {renderInput(
                  'Email Address',
                  'mail-outline',
                  'Enter email address',
                  email,
                  setEmail,
                  'email-address'
                )}
              </View>

              <View style={styles.column}>
                {renderInput(
                  'Company / Organization',
                  'business-outline',
                  'Enter company name',
                  company,
                  setCompany
                )}
              </View>

            </View>

            {/* PRODUCT */}
            {renderDropdown(
              'Interested In (Product / Service / Project)',
              'layers-outline',
              product,
              'Select product / service / project',
              () => openDropdown('product', products),
              true
            )}

            {/* STAGE + VALUE */}
            <View style={styles.twoColumns}>

              <View style={styles.column}>
                {renderDropdown(
                  'Pipeline Stage',
                  'git-branch-outline',
                  stage,
                  'Select stage',
                  () => openDropdown('stage', stages),
                  true
                )}
              </View>

              <View style={styles.column}>
                {renderInput(
                  'Lead Value (₹)',
                  'cash-outline',
                  'Enter lead value',
                  leadValue,
                  setLeadValue,
                  'numeric'
                )}
              </View>

            </View>

            {/* FOLLOW UP + PRIORITY */}
            <View style={styles.twoColumns}>

              <View style={styles.column}>
                {renderInput(
                  'Follow-up Date',
                  'calendar-outline',
                  'DD/MM/YYYY',
                  followUp,
                  setFollowUp
                )}
              </View>

              <View style={styles.column}>
                {renderDropdown(
                  'Priority',
                  'flag-outline',
                  priority,
                  'Select priority',
                  () => openDropdown('priority', priorities)
                )}
              </View>

            </View>

            {/* NOTES */}
            <View style={styles.fieldContainer}>

              <Text style={styles.label}>Notes / Description</Text>

              <View style={styles.notesBox}>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Enter notes or additional details..."
                  placeholderTextColor="#9288A5"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  textAlignVertical="top"
                />
              </View>

            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveLead}
              activeOpacity={0.85}>

              <LinearGradient
                colors={['#913EED', '#5719C1']}
                style={styles.saveGradient}>

                <Ionicons name="save-outline" size={24} color="#FFFFFF" />

                <Text style={styles.saveText}>
                  {isEdit ? 'Update Lead' : 'Save Lead'}
                </Text>

              </LinearGradient>

            </TouchableOpacity>

          </View>

          {/* BUILDING */}
          <View style={styles.buildingSection}>

            <View style={styles.buildingGroup}>

              <View style={styles.buildingOne}>
                <View style={styles.windows}>
                  {Array.from({length: 6}).map((_, i) => (
                    <View key={i} style={styles.window} />
                  ))}
                </View>
              </View>

              <View style={styles.buildingTwo}>
                <View style={styles.windows}>
                  {Array.from({length: 12}).map((_, i) => (
                    <View key={i} style={styles.window} />
                  ))}
                </View>
              </View>

              <View style={styles.buildingThree}>
                <View style={styles.windows}>
                  {Array.from({length: 8}).map((_, i) => (
                    <View key={i} style={styles.window} />
                  ))}
                </View>
              </View>

              <View style={styles.buildingFour}>
                <View style={styles.windows}>
                  {Array.from({length: 4}).map((_, i) => (
                    <View key={i} style={styles.window} />
                  ))}
                </View>
              </View>

            </View>

            <View style={styles.groundLine} />

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
              <LinearGradient
                colors={['#8739EB', '#5719C1']}
                style={styles.addNavButton}>
                <Ionicons name="add" size={29} color="#FFFFFF" />
              </LinearGradient>
            ) : (
              <Ionicons
                name={item.icon}
                size={22}
                color="#655C7B"
              />
            )}

            <Text
              style={[
                styles.navText,
                index === 2 && styles.activeNavText,
              ]}>
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
                Select {dropdownType === 'product'
                  ? 'Product / Service'
                  : dropdownType === 'stage'
                  ? 'Pipeline Stage'
                  : 'Priority'}
              </Text>

              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Ionicons name="close-circle" size={27} color="#887D9C" />
              </TouchableOpacity>
            </View>

            {dropdownOptions.map(item => (

              <TouchableOpacity
                key={item}
                style={styles.dropdownOption}
                onPress={() => selectDropdown(item)}>

                <Text style={styles.dropdownOptionText}>{item}</Text>

                <Ionicons
                  name={
                    (dropdownType === 'product' && product === item) ||
                    (dropdownType === 'stage' && stage === item) ||
                    (dropdownType === 'priority' && priority === item)
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={21}
                  color="#6825CB"
                />

              </TouchableOpacity>

            ))}

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9F6FF',
  },

  header: {
    height: 62,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },

  // INTRO
  introCard: {
    minHeight: 105,
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: '#E8DCFF',
  },

  introIcon: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#8539E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  introTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#35117F',
  },

  introSubtitle: {
    fontSize: 11,
    color: '#725A99',
    marginTop: 5,
  },

  // FORM
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 13,
    elevation: 2,
    shadowColor: '#62419A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  twoColumns: {
    flexDirection: 'row',
    gap: 10,
  },

  column: {
    flex: 1,
    minWidth: 0,
  },

  fieldContainer: {
    flex: 1,
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#35117F',
    marginBottom: 8,
  },

  required: {
    color: '#EF365A',
  },

  inputBox: {
    height: 49,
    borderWidth: 1,
    borderColor: '#BCA2E9',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    gap: 7,
    backgroundColor: '#FFFEFF',
  },

  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    color: '#30234C',
    paddingVertical: 0,
  },

  dropdownText: {
    flex: 1,
    fontSize: 11,
    color: '#49376B',
  },

  // NOTES
  notesBox: {
    height: 95,
    borderWidth: 1,
    borderColor: '#BCA2E9',
    borderRadius: 11,
    padding: 11,
  },

  notesInput: {
    flex: 1,
    fontSize: 12,
    color: '#30234C',
  },

  // SAVE
  saveButton: {
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 3,
    marginBottom: 5,
  },

  saveGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  // BUILDING
  buildingSection: {
    height: 115,
    marginHorizontal: -15,
    marginTop: 22,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F0E9FF',
    overflow: 'hidden',
  },

  buildingGroup: {
    width: '85%',
    height: '95%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },

  buildingOne: {
    width: '18%',
    height: '60%',
    backgroundColor: '#DCD0FC',
    padding: 6,
  },

  buildingTwo: {
    width: '23%',
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
    width: 8,
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

  activeNavText: {
    color: '#6825CB',
    fontWeight: '800',
  },

  addNavButton: {
    width: 43,
    height: 43,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -19,
    elevation: 5,
  },

  // MODAL
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(25,10,55,0.4)',
    padding: 20,
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  dropdownModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    maxHeight: '75%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#35117F',
  },

  dropdownOption: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF6',
    paddingVertical: 10,
  },

  dropdownOptionText: {
    fontSize: 13,
    color: '#45345F',
    fontWeight: '600',
  },

});
