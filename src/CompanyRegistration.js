import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config/config';

export default function CompanyRegistration({navigation, route}) {
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const companyData = route?.params || {};

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !designation.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Required', 'Please fill all required fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Password Error',
        'Password must be at least 6 characters',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match');
      return;
    }

    if (
      !companyData.companyName ||
      !companyData.industryId ||
      !companyData.mobile ||
      !companyData.email
    ) {
      Alert.alert(
        'Company Details Missing',
        'Please complete Company Setup again.',
      );
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Company Details
      formData.append('companyName', companyData.companyName);
      formData.append('address', companyData.address || '');
      formData.append('city', companyData.city || '');
      formData.append('pinCode', companyData.pinCode || '');
      formData.append('industryId', String(companyData.industryId));
      formData.append('mobile', companyData.mobile);
      formData.append('email', companyData.email);

      // Owner Details
      formData.append('fullName', fullName.trim());
      formData.append('designation', designation.trim());
      formData.append('password', password);

      const apiUrl = `${BASE_URL}/register_company.php`;

      console.log('Registration API:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      console.log('HTTP STATUS:', response.status);
      console.log('SERVER RESPONSE:', responseText);

      if (!responseText.trim()) {
        throw new Error('Server returned empty response.');
      }

      let result;

      try {
        result = JSON.parse(responseText);
      } catch (error) {
        throw new Error(
          'Invalid server response: ' + responseText.substring(0, 300),
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP Error ${response.status}`,
        );
      }

      if (result.status) {
        const userData = {
          id: String(result.data.id),
          company_id: String(result.data.company_id),
          name: result.data.name,
          designation: result.data.designation,
          role: result.data.role,
        };


        await AsyncStorage.setItem('@bondcrm_user', JSON.stringify(userData));
        await AsyncStorage.setItem('id', userData.id);
        await AsyncStorage.setItem('company_id', userData.company_id);
        await AsyncStorage.setItem('name', userData.name);
        await AsyncStorage.setItem('designation', userData.designation);
        await AsyncStorage.setItem('role', userData.role);
        await AsyncStorage.setItem('isLoggedIn', 'true');


        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully!',
          [
            {
              text: 'Continue',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Dashboard'}],
                });
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Registration Failed',
          result.message || 'Something went wrong.',
        );
      }
    } catch (error) {
      console.log('Registration Error:', error);

      Alert.alert(
        'Registration Error',
        error.message || 'Unable to connect to server.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FCFAFF', '#F0E8FF']}
      locations={[0, 0.52, 1]}
      style={styles.gradient}>

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={
            Platform.OS === 'ios' ? 'padding' : undefined
          }>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>

            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              disabled={isLoading}
              onPress={() => navigation?.goBack()}>

              <Ionicons
                name="arrow-back"
                size={23}
                color="#43209A"
              />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.logoSection}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="business"
                  size={35}
                  color="#7135D8"
                />
              </View>

              <Text style={styles.heading}>
                Company Registration
              </Text>

              <Text style={styles.subHeading}>
                Create your owner account
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>

              {/* Full Name */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#77718A"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Your Full Name *"
                  placeholderTextColor="#9994A5"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                  autoCapitalize="words"
                />
              </View>

              {/* Designation */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="briefcase-outline"
                  size={21}
                  color="#77718A"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Designation *"
                  placeholderTextColor="#9994A5"
                  value={designation}
                  onChangeText={setDesignation}
                  editable={!isLoading}
                  autoCapitalize="words"
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#77718A"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password *"
                  placeholderTextColor="#9994A5"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />

                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }>

                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={21}
                    color="#77718A"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={21}
                  color="#77718A"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password *"
                  placeholderTextColor="#9994A5"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                />

                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }>

                  <Ionicons
                    name={
                      showConfirmPassword
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={21}
                    color="#77718A"
                  />
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.registerButton,
                  isLoading && {opacity: 0.75},
                ]}
                onPress={handleRegister}
                disabled={isLoading}>

                <LinearGradient
                  colors={['#7938E8', '#5420C8']}
                  style={styles.registerGradient}>

                  {isLoading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />

                      <Text style={styles.registerText}>
                        Registering...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.registerText}>
                        Register Company
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={21}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login */}
              <View style={styles.loginRow}>
                <Text style={styles.loginLabel}>
                  Already have an account?
                </Text>

                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() =>
                    navigation?.navigate('Login')
                  }>

                  <Text style={styles.loginLink}>
                    {' '}Login
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 25,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 5,
  },

  logoSection: {
    alignItems: 'center',
    marginTop: 12,
  },

  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#EEE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#24164A',
    marginTop: 8,
  },

  subHeading: {
    fontSize: 14,
    color: '#77718A',
    marginTop: 5,
  },

  formContainer: {
    marginTop: 28,
  },

  inputContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: '#DAD5E8',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 11,
    fontSize: 14,
    color: '#24164A',
  },

  registerButton: {
    height: 54,
    borderRadius: 11,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 4,
  },

  registerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  registerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginLabel: {
    fontSize: 13,
    color: '#77718A',
  },

  loginLink: {
    fontSize: 14,
    color: '#5420C8',
    fontWeight: '700',
  },
});