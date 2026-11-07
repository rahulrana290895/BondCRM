import React, {useState, useEffect} from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, ScrollView, KeyboardAvoidingView, Platform,
  Modal, Alert, ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BASE_URL} from './config/config';

export default function CompanySetup({navigation, route}) {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [industry, setIndustry] = useState('');
  const [industryId, setIndustryId] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(false);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [showIndustry, setShowIndustry] = useState(false);

  // Fetch industries from database
  const fetchIndustries = async () => {
    try {
      setLoadingIndustries(true);

      const response = await fetch(`${BASE_URL}/industries.php`);
      const result = await response.json();

      if (result.status) {
        setIndustries(result.data || []);
      } else {
        setIndustries([]);
        Alert.alert('Error', result.message || 'Industries not found');
      }

    } catch (error) {
      console.log('Industry API Error:', error);
      Alert.alert('Error', 'Unable to load industries');
    } finally {
      setLoadingIndustries(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  // Save company details
  const handleSave = () => {
    if (
      !companyName.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pinCode.trim() ||
      !industryId ||
      !mobile.trim() ||
      !email.trim()
    ) {
      Alert.alert('Required', 'Please fill all required fields.');
      return;
    }

    if (pinCode.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter valid 6 digit PIN code.');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Invalid Mobile', 'Please enter valid mobile number.');
      return;
    }

    const companyData = {
      companyName,
      address,
      city,
      pinCode,
      industryId,
      industry,
      mobile,
      email,
      fullName: route?.params?.fullName || '',
    };

    navigation.navigate('CompanyRegistration', companyData);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FCFAFF', '#F0E8FF']}
      locations={[0, 0.5, 1]}
      style={styles.gradient}>

      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}>
              <Ionicons name="arrow-back" size={25} color="#5018B9" />
            </TouchableOpacity>

            <View style={styles.logoSection}>
              <Text style={styles.heading}>Company Setup</Text>
              <Text style={styles.subHeading}>
                Complete your company profile
              </Text>
            </View>

            <View style={styles.formContainer}>

              {/* Company Name */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="business-outline"
                  size={24}
                  color="#62538D"
                />

                <View style={styles.inputContent}>
                  <Text style={styles.fieldLabel}>Company Name *</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter Company Name"
                    placeholderTextColor="#AAA3B9"
                    value={companyName}
                    onChangeText={setCompanyName}
                  />
                </View>
              </View>

              {/* Address */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={25}
                  color="#62538D"
                />

                <View style={styles.inputContent}>
                  <Text style={styles.fieldLabel}>Address *</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter Company Address"
                    placeholderTextColor="#AAA3B9"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>
              </View>

              {/* City and PIN */}
              <View style={styles.rowInputs}>

                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Ionicons
                    name="business-outline"
                    size={23}
                    color="#62538D"
                  />

                  <View style={styles.inputContent}>
                    <Text style={styles.fieldLabel}>City *</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="City"
                      placeholderTextColor="#AAA3B9"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                </View>

                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Ionicons
                    name="location-outline"
                    size={23}
                    color="#62538D"
                  />

                  <View style={styles.inputContent}>
                    <Text style={styles.fieldLabel}>PIN Code *</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="PIN Code"
                      placeholderTextColor="#AAA3B9"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={pinCode}
                      onChangeText={t =>
                        setPinCode(t.replace(/[^0-9]/g, ''))
                      }
                    />
                  </View>
                </View>

              </View>

              {/* Industry */}
              <TouchableOpacity
                style={styles.inputContainer}
                activeOpacity={0.8}
                onPress={() => setShowIndustry(true)}>

                <Ionicons
                  name="briefcase-outline"
                  size={24}
                  color="#62538D"
                />

                <View style={styles.inputContent}>
                  <Text style={styles.fieldLabel}>Industry *</Text>

                  <Text
                    style={[
                      styles.input,
                      {paddingTop: 5},
                      !industry && {color: '#AAA3B9'},
                    ]}>
                    {industry || 'Select Industry'}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={22}
                  color="#62538D"
                />
              </TouchableOpacity>

              {/* Mobile */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={24}
                  color="#62538D"
                />

                <View style={styles.inputContent}>
                  <Text style={styles.fieldLabel}>Company Mobile *</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="+91 Enter Mobile Number"
                    placeholderTextColor="#AAA3B9"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobile}
                    onChangeText={t =>
                      setMobile(t.replace(/[^0-9]/g, ''))
                    }
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={25}
                  color="#62538D"
                />

                <View style={styles.inputContent}>
                  <Text style={styles.fieldLabel}>Company Email *</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter Company Email"
                    placeholderTextColor="#AAA3B9"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={handleSave}>

                <LinearGradient
                  colors={['#7731E5', '#5318C5', '#8434EF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.saveGradient}>

                  <Text style={styles.saveText}>Save & Continue</Text>

                  <Ionicons
                    name="arrow-forward"
                    size={27}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </TouchableOpacity>

            </View>

            {/* Building Illustration */}
            <View style={styles.buildingSection}>
              <View style={styles.buildingGroup}>
                {[
                  ['buildingOne', 8],
                  ['buildingTwo', 12],
                  ['buildingThree', 8],
                  ['buildingFour', 4],
                ].map(([building, count]) => (
                  <View key={building} style={styles[building]}>
                    <View style={styles.windows}>
                      {Array.from({length: count}).map((_, i) => (
                        <View key={i} style={styles.window} />
                      ))}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.groundLine} />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>

        {/* Industry Modal */}
        <Modal
          visible={showIndustry}
          transparent
          animationType="slide"
          onRequestClose={() => setShowIndustry(false)}>

          <View style={styles.modalBackground}>

            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowIndustry(false)}
            />

            <View style={styles.modalContent}>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Industry</Text>

                <TouchableOpacity
                  onPress={() => setShowIndustry(false)}>
                  <Ionicons
                    name="close-circle"
                    size={27}
                    color="#77718A"
                  />
                </TouchableOpacity>
              </View>

              {loadingIndustries ? (
                <ActivityIndicator
                  size="large"
                  color="#6329D1"
                />
              ) : industries.length === 0 ? (
                <TouchableOpacity onPress={fetchIndustries}>
                  <Text style={styles.industryText}>
                    No industries found. Tap to retry.
                  </Text>
                </TouchableOpacity>
              ) : (
                <ScrollView>
                  {industries.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.industryItem}
                      onPress={() => {
                        setIndustry(item.name);
                        setIndustryId(item.id);
                        setShowIndustry(false);
                      }}>

                      <Text style={styles.industryText}>
                        {item.name}
                      </Text>

                      {industryId === item.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color="#6329D1"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {flex: 1},
  safeArea: {flex: 1},

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: 2,
  },

  logoSection: {
    alignItems: 'center',
    marginTop: 0,
  },

  heading: {
    fontSize: 27,
    fontWeight: '800',
    color: '#35117F',
    marginTop: 15,
  },

  subHeading: {
    fontSize: 17,
    color: '#39304D',
    marginTop: 5,
  },

  formContainer: {
    width: '100%',
    marginTop: 20,
  },

  inputContainer: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: '#BDB0E0',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 13,
    backgroundColor: 'rgba(255,255,255,0.42)',
    gap: 13,
  },

  inputContent: {
    flex: 1,
    justifyContent: 'center',
  },

  fieldLabel: {
    fontSize: 14,
    color: '#493B70',
    fontWeight: '500',
  },

  input: {
    height: 33,
    fontSize: 17,
    color: '#171324',
    padding: 0,
    marginTop: 2,
  },

  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },

  halfInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 10,
    gap: 7,
  },

  saveButton: {
    height: 60,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
  },

  saveGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  buildingSection: {
    height: 115,
    marginHorizontal: -22,
    marginTop: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(230,218,255,0.35)',
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
    width: '17%',
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
    width: 10,
    height: 10,
    backgroundColor: '#F0E9FF',
    borderRadius: 2,
  },

  groundLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#C8B7F1',
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
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
    maxHeight: '70%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#35117F',
  },

  industryItem: {
    height: 49,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  industryText: {
    fontSize: 15,
    color: '#352B49',
  },
});