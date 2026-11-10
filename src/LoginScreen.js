import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config/config';

const {width, height} = Dimensions.get('window');

export default function LoginScreen({navigation}) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  if (!mobile || !password) {
    Alert.alert('Error', 'Enter mobile number and password');
    return;
  }

  if (mobile.length !== 10) {
    Alert.alert('Error', 'Enter valid 10 digit mobile number');
    return;
  }

  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('password', password);
    const API_URL = `${BASE_URL}login.php`;

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
    const text = await response.text();
    const result = JSON.parse(text);

    if (result.success === true) {
      const user = result.data;
    await AsyncStorage.setItem('@bondcrm_user', JSON.stringify(user));
      await AsyncStorage.setItem('id', String(user.id));
      await AsyncStorage.setItem('company_id', String(user.company_id));
      await AsyncStorage.setItem('name', user.name);
      await AsyncStorage.setItem('designation', user.designation);
      await AsyncStorage.setItem('role', user.role);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs'}],
      });
    }

  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Server connection failed. Check API URL.');
  }

  setIsLoading(false);
};

return (
<LinearGradient
  colors={['#FFFFFF', '#FAF7FF', '#F0E8FF']}
  locations={[0, 0.55, 1]}
  style={{flex: 1}}>

  <StatusBar
    backgroundColor="#FFFFFF"
    barStyle="dark-content"
  />

    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appName}>BondCRM</Text>

          <Text style={styles.heading}>
            Login to Your Account
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>

          {/* Mobile Number Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={21}
              color="#77718A"
            />

            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#9994A5"
              value={mobile}
              onChangeText={value =>
                setMobile(value.replace(/[^0-9]/g, '').slice(0, 10))
              }
              keyboardType="number-pad"
              maxLength={10}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#77718A"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9994A5"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={21}
                color="#77718A"
              />
            </TouchableOpacity>
          </View>

          {/* Remember & Forgot Password */}
          <View style={styles.optionsRow}>

            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRemember(!remember)}
              disabled={isLoading}>

              <View
                style={[
                  styles.checkbox,
                  remember && styles.checkboxActive,
                ]}>
                {remember && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#FFFFFF"
                  />
                )}
              </View>

              <Text style={styles.rememberText}>
                Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isLoading}
              onPress={() => navigation?.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

          </View>

          {/* Login Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}>

            <LinearGradient
              colors={['#7938E8', '#5420C8']}
              style={styles.loginGradient}>

              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              )}

            </LinearGradient>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Create Account */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.createButton}
            disabled={isLoading}
            onPress={() => navigation?.navigate('CompanySetup')}>

            <Text style={styles.createButtonText}>
              Create Company Account
            </Text>

          </TouchableOpacity>

        </View>

        {/* Bottom Building Illustration */}
        <View style={styles.buildingSection}>

          <View style={styles.buildingGroup}>

            {/* Left Building */}
            <View style={styles.buildingOne}>
              <View style={styles.windows}>
                {Array.from({length: 8}).map((_, i) => (
                  <View key={i} style={styles.window} />
                ))}
              </View>
            </View>

            {/* Middle Building */}
            <View style={styles.buildingTwo}>
              <View style={styles.windows}>
                {Array.from({length: 12}).map((_, i) => (
                  <View key={i} style={styles.window} />
                ))}
              </View>
            </View>

            {/* Right Building */}
            <View style={styles.buildingThree}>
              <View style={styles.windows}>
                {Array.from({length: 6}).map((_, i) => (
                  <View key={i} style={styles.window} />
                ))}
              </View>
            </View>

            {/* Small Building */}
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
  </SafeAreaView>
</LinearGradient>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },

  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.045,
  },

  logoCircle: {
    width: 65,
    height: 65,
    backgroundColor: '#F0E9FF',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  logo: {
    width: 42,
    height: 42,
  },

  appName: {
    fontSize: 31,
    fontWeight: '900',
    color: '#4215A8',
    marginTop: 2,
  },

  heading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#24164A',
    marginTop: 25,
  },

  formContainer: {
    marginTop: 32,
  },

  inputContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 17,
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    fontSize: 15,
    color: '#000',
  },

  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 1,
    marginBottom: 23,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1,
    borderColor: '#B9B2C9',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxActive: {
    backgroundColor: '#6329D1',
    borderColor: '#6329D1',
  },

  rememberText: {
    fontSize: 13,
    color: '#443D55',
    marginLeft: 7,
  },

  forgotText: {
    fontSize: 13,
    color: '#5922D0',
    fontWeight: '600',
  },

  loginButton: {
    height: 53,
    borderRadius: 11,
    overflow: 'hidden',
    elevation: 4,
  },

  loginGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD8E8',
  },

  orText: {
    color: '#77718A',
    fontSize: 14,
    marginHorizontal: 14,
  },

  createButton: {
    height: 53,
    borderWidth: 1,
    borderColor: '#D2C9E8',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createButtonText: {
    color: '#35117F',
    fontSize: 15,
    fontWeight: '600',
  },

  // Building Illustration
  buildingSection: {
    height: height * 0.19,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 25,
    marginHorizontal: -25,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  buildingGroup: {
    height: '85%',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 7,
  },

  buildingOne: {
    width: '19%',
    height: '62%',
    backgroundColor: '#E8E1FA',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 7,
  },

  buildingTwo: {
    width: '23%',
    height: '90%',
    backgroundColor: '#DDD3F7',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 8,
  },

  buildingThree: {
    width: '21%',
    height: '72%',
    backgroundColor: '#E7DFF8',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 7,
  },

  buildingFour: {
    width: '16%',
    height: '52%',
    backgroundColor: '#EDE7FA',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 6,
  },

  windows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 7,
  },

  window: {
    width: 9,
    height: 11,
    backgroundColor: '#BDA9EC',
    borderRadius: 2,
  },

  groundLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#D7C9F4',
  },

  bottomText: {
    fontSize: 11,
    color: '#A49AB9',
    marginVertical: 5,
  },
});