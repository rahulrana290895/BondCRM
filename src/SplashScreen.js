import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');

export default function SplashScreen({navigation, onGetStarted}) {
const handleGetStarted = async () => {
  try {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        navigation.replace('MainTabs');
    } else {
      navigation.replace('Login');
    }
  } catch (error) {
    console.log('Login Check Error:', error);
    navigation.replace('Login');
  }
};

  return (
    <LinearGradient
      colors={['#8515F5', '#4300B8', '#6515D9', '#7817E8']}
      locations={[0, 0.4, 0.75, 1]}
      style={styles.container}>

      <StatusBar
        backgroundColor="#8515F5"
        barStyle="light-content"
        translucent={false}
      />

      <SafeAreaView style={styles.safeArea}  edges={['top', 'bottom']}>
        {/* Decorative Background */}
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.logoTitle}>BondCRM</Text>

          <Text style={styles.logoSubtitle}>
            Lead Management CRM
          </Text>
        </View>

        {/* Center Illustration */}
        <View style={styles.illustrationSection}>
          <View style={styles.leafOne} />
          <View style={styles.leafTwo} />
          {/* Dashboard Card */}
          <View style={styles.dashboardCard}>
            <LinearGradient
              colors={['#A15AFF', '#6E25E9']}
              style={styles.dashboardHeader}>
              <View style={styles.headerLine} />
            </LinearGradient>

            <View style={styles.chartContent}>
              <View style={styles.chartLines}>
                <View style={styles.lineOne} />
                <View style={styles.lineTwo} />
                <View style={styles.lineThree} />
              </View>

              {/* Chart Bars */}
              <View style={styles.chartBars}>
                {[45, 65, 85, 110, 135, 160].map(
                  (item, index) => (
                    <LinearGradient
                      key={index}
                      colors={['#A020F0', '#5147F5']}
                      style={[
                        styles.bar,
                        {height: item},
                      ]}
                    />
                  ),
                )}
              </View>
            </View>
          </View>

          {/* Target Illustration */}
          <View style={styles.target}>
            <View style={styles.targetOuter}>
              <View style={styles.targetMiddle}>
                <View style={styles.targetInner}>
                  <View style={styles.targetCenter} />
                </View>
              </View>
            </View>
            <View style={styles.arrow}>
              <View style={styles.arrowHead} />
              <View style={styles.arrowBody} />
            </View>
          </View>

        </View>

        {/* Tagline */}
        <View style={styles.taglineSection}>
          <Text style={styles.tagline}>
            Manage Leads, Pipeline,
          </Text>
          <Text style={styles.tagline}>
            Follow-ups and Grow
          </Text>
          <Text style={styles.tagline}>
            Your Business
          </Text>
        </View>

        {/* Page Indicator */}

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={handleGetStarted}>

            <Text style={styles.buttonText}>
              Get Started
            </Text>

            <Text style={styles.arrowText}>→</Text>

          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingHorizontal: 22,
  },

  circleTop: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -height * 0.78,
    left: -width * 0.45,
  },

  circleBottom: {
    position: 'absolute',
    width: width * 1.3,
    height: width * 1.3,
    borderRadius: width,
    backgroundColor: 'rgba(255,255,255,0.045)',
    bottom: -height * 0.65,
    right: -width * 0.6,
  },

  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.055,
  },

  logo: {
    width: 85,
    height: 85,
    marginBottom: 8,
  },

  logoTitle: {
    color: '#FFFFFF',
    fontSize: 43,
    fontWeight: '900',
    letterSpacing: -1.5,
  },

  logoSubtitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '400',
    marginTop: 5,
  },

  illustrationSection: {
    width: width * 0.76,
    height: height * 0.255,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  dashboardCard: {
    width: '88%',
    height: '75%',
    backgroundColor: '#F9F5FF',
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#E8D6FF',
    elevation: 12,
    transform: [{rotate: '-5deg'}],
  },

  dashboardHeader: {
    height: 37,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  headerLine: {
    width: 65,
    height: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  chartContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  chartLines: {
    gap: 9,
  },

  lineOne: {
    width: '42%',
    height: 10,
    borderRadius: 10,
    backgroundColor: '#D8C2FF',
  },

  lineTwo: {
    width: '28%',
    height: 8,
    borderRadius: 10,
    backgroundColor: '#D8C2FF',
  },

  lineThree: {
    width: '18%',
    height: 7,
    borderRadius: 10,
    backgroundColor: '#D8C2FF',
  },

  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },

  bar: {
    width: 19,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  leafOne: {
    position: 'absolute',
    width: 48,
    height: 105,
    backgroundColor: '#B66AFF',
    opacity: 0.8,
    borderRadius: 45,
    left: -5,
    bottom: 15,
    transform: [{rotate: '-40deg'}],
  },

  leafTwo: {
    position: 'absolute',
    width: 42,
    height: 85,
    backgroundColor: '#D29AFF',
    opacity: 0.65,
    borderRadius: 40,
    left: 2,
    bottom: 0,
    transform: [{rotate: '-50deg'}],
  },

  target: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    width: 105,
    height: 105,
    alignItems: 'center',
    justifyContent: 'center',
  },

  targetOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },

  targetMiddle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#FF4B9B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  targetInner: {
    width: 57,
    height: 57,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  targetCenter: {
    width: 31,
    height: 31,
    borderRadius: 20,
    backgroundColor: '#FF4B9B',
  },

  arrow: {
    position: 'absolute',
    top: -3,
    right: 13,
    transform: [{rotate: '45deg'}],
  },

  arrowBody: {
    width: 9,
    height: 56,
    backgroundColor: '#FFCB49',
    borderRadius: 5,
  },

  arrowHead: {
    width: 20,
    height: 20,
    backgroundColor: '#FFCB49',
    transform: [{rotate: '45deg'}],
    position: 'absolute',
    top: -7,
    left: -5,
  },

  taglineSection: {
    alignItems: 'center',
    marginTop: -5,
  },

  tagline: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 35,
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  dot: {
    width: 13,
    height: 13,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 15,
    height: 15,
  },

  buttonContainer: {
    width: '100%',
    marginBottom: 12,
  },

  button: {
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },

  buttonText: {
    color: '#5014C5',
    fontSize: 27,
    fontWeight: '800',
  },

  arrowText: {
    color: '#5014C5',
    fontSize: 38,
    fontWeight: '600',
    marginLeft: 15,
    marginTop: -4,
  },
});