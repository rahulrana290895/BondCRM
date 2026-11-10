import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const pipeline = [
  {name: 'New Lead', count: 280, color: '#4385F5'},
  {name: 'Contacted', count: 250, color: '#8B5CF6'},
  {name: 'Interested', count: 220, color: '#F59E0B'},
  {name: 'Qualified', count: 180, color: '#06B6D4'},
  {name: 'Meeting / Demo', count: 120, color: '#EC4899'},
  {name: 'Negotiation', count: 80, color: '#F97316'},
  {name: 'Won', count: 70, color: '#10B981'},
  {name: 'Lost', count: 50, color: '#EF4444'},
];

const recentLeads = [
  {
    name: 'Ravi Sharma',
    phone: '+91 98765 43210',
    status: 'Interested',
    color: '#E8F5E9',
    textColor: '#159447',
    time: 'Today',
    initial: 'R',
  },
  {
    name: 'Priya Verma',
    phone: '+91 91234 56789',
    status: 'Contacted',
    color: '#EDE9FE',
    textColor: '#7136C8',
    time: 'Today',
    initial: 'P',
  },
  {
    name: 'Amit Singh',
    phone: '+91 98765 12345',
    status: 'Negotiation',
    color: '#FFF0E2',
    textColor: '#D97706',
    time: 'Yesterday',
    initial: 'A',
  },
];

export default function DashboardScreen({navigation}) {

  const totalLeads = 1250;
  const stats = [
    {
      title: 'Total Leads',
      value: '1,250',
      icon: 'people',
      color: '#3979ED',
      bg: '#E9F0FF',
    },
    {
      title: 'Converted',
      value: '320',
      icon: 'checkmark-circle',
      color: '#0EAA72',
      bg: '#E4F8EF',
    },
    {
      title: "Today's Follow-ups",
      value: '48',
      icon: 'time',
      color: '#E89A19',
      bg: '#FFF4DF',
    },
    {
      title: 'Overdue',
      value: '12',
      icon: 'alert-circle',
      color: '#E84B59',
      bg: '#FFE9EC',
    },
  ];

  const handleNavigation = screen => {
    if (screen === 'Dashboard') return;
    if (screen === 'AddLead') {
      navigation?.navigate('AddLead');
    } else {
      navigation?.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>

      <StatusBar
        backgroundColor="#5520C6"
        barStyle="light-content"
      />

      {/* HEADER */}
      <LinearGradient
        colors={['#7029DD', '#4A16B5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>

        <View style={styles.headerLeft}>

          <TouchableOpacity
            onPress={() => navigation?.navigate('MoreScreen')}
            style={styles.headerIcon}>
            <Ionicons name="menu" size={27} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandLogo}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandName}>BondCRM</Text>

        </View>

        <View style={styles.headerRight}>

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation?.navigate('Notifications')}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#FFFFFF"
            />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation?.navigate('Profile')}>
            <Ionicons
              name="person"
              size={19}
              color="#5C24C5"
            />
          </TouchableOpacity>

        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* GREETING */}
        <View style={styles.greetingRow}>

          <View>
            <Text style={styles.greeting}>
              Good Afternoon!
            </Text>

            <Text style={styles.companyName}>
              Your Company Name
            </Text>
          </View>

          <TouchableOpacity style={styles.dateButton}>
            <Text style={styles.dateText}>This Month</Text>
            <Ionicons
              name="chevron-down"
              size={15}
              color="#5D35A3"
            />
          </TouchableOpacity>

        </View>

        {/* STATS CARDS */}
        <View style={styles.statsGrid}>

          {stats.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              style={[
                styles.statCard,
                {backgroundColor: item.bg},
              ]}>

              <View style={styles.statTop}>
                <Ionicons
                  name={item.icon}
                  size={23}
                  color={item.color}
                />
              </View>

              <Text style={styles.statValue}>
                {item.value}
              </Text>

              <Text style={styles.statTitle}>
                {item.title}
              </Text>

            </TouchableOpacity>
          ))}

        </View>

        {/* LEAD PIPELINE */}
        <View style={styles.sectionCard}>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Lead Pipeline
              </Text>
              <Text style={styles.sectionSubtitle}>
                Track your lead progress
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation?.navigate('LeadPipeline')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Total Leads Circle */}
          <View style={styles.pipelineSummary}>

            <View style={styles.totalCircle}>
              <View style={styles.totalCircleInner}>
                <Text style={styles.totalNumber}>1,250</Text>
                <Text style={styles.totalLabel}>Total Leads</Text>
              </View>
            </View>

            <View style={styles.pipelineLegend}>
              {pipeline.map((item, index) => (
                <View key={index} style={styles.legendRow}>

                  <View
                    style={[
                      styles.legendDot,
                      {backgroundColor: item.color},
                    ]}
                  />

                  <Text style={styles.legendName}>
                    {item.name}
                  </Text>

                  <Text style={styles.legendCount}>
                    {item.count}
                  </Text>

                </View>
              ))}
            </View>

          </View>

          {/* Pipeline Progress */}
          <View style={styles.progressSection}>

            {pipeline.map((item, index) => (
              <View key={index} style={styles.progressItem}>

                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressName}>
                    {item.name}
                  </Text>

                  <Text style={styles.progressCount}>
                    {item.count}
                  </Text>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(item.count / totalLeads) * 100}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>

              </View>
            ))}

          </View>

        </View>

        {/* RECENT LEADS */}
        <View style={styles.sectionCard}>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Recent Leads
              </Text>

              <Text style={styles.sectionSubtitle}>
                Latest added leads
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation?.navigate('AllLeads')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentLeads.map((lead, index) => (
            <TouchableOpacity
              key={index}
              style={styles.leadItem}
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('LeadDetails')}>

              <View style={styles.leadAvatar}>
                <Text style={styles.avatarText}>
                  {lead.initial}
                </Text>
              </View>

              <View style={styles.leadInfo}>

                <Text style={styles.leadName}>
                  {lead.name}
                </Text>

                <Text style={styles.leadPhone}>
                  {lead.phone}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: lead.color},
                  ]}>

                  <Text
                    style={[
                      styles.statusText,
                      {color: lead.textColor},
                    ]}>
                    {lead.status}
                  </Text>

                </View>

              </View>

              <View style={styles.leadRight}>
                <Text style={styles.leadTime}>
                  {lead.time}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#AAA2B9"
                />
              </View>

            </TouchableOpacity>
          ))}

        </View>

        {/* FOLLOW-UP REMINDER */}
        <View style={styles.followCard}>

          <View style={styles.followIcon}>
            <Ionicons
              name="calendar"
              size={25}
              color="#FFFFFF"
            />
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.followTitle}>
              Upcoming Follow-ups
            </Text>

            <Text style={styles.followSubtitle}>
              You have 48 follow-ups scheduled today.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation?.navigate('FollowUp')}>
            <Ionicons
              name="arrow-forward-circle"
              size={30}
              color="#FFFFFF"
            />
          </TouchableOpacity>

        </View>

        <Text style={styles.footerText}>
          Powered by BondCRM
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F6FC',
  },

  // HEADER
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  headerIcon: {
    position: 'relative',
    padding: 4,
  },

  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  headerLogo: {
    width: 25,
    height: 25,
  },

  brandName: {
    fontSize: 19,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },

  notificationDot: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 8,
    height: 8,
    backgroundColor: '#FF6B75',
    borderRadius: 5,
  },

  profileButton: {
    width: 33,
    height: 33,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 19,
    paddingBottom: 20,
  },

  // GREETING
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  greeting: {
    fontSize: 19,
    fontWeight: '800',
    color: '#25144B',
  },

  companyName: {
    fontSize: 12,
    color: '#77718A',
    marginTop: 4,
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E1F3',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 9,
  },

  dateText: {
    fontSize: 11,
    color: '#5D35A3',
    fontWeight: '600',
  },

  // STATS
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 11,
    marginBottom: 17,
  },

  statCard: {
    width: '48.2%',
    minHeight: 108,
    borderRadius: 14,
    padding: 13,
    justifyContent: 'center',
  },

  statTop: {
    marginBottom: 5,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#24164A',
  },

  statTitle: {
    fontSize: 11,
    color: '#625B70',
    marginTop: 3,
    fontWeight: '500',
  },

  // SECTION CARD
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#5A3B91',
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: {width: 0, height: 3},
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#25144B',
  },

  sectionSubtitle: {
    fontSize: 11,
    color: '#9992A7',
    marginTop: 3,
  },

  viewAll: {
    fontSize: 12,
    color: '#6627CC',
    fontWeight: '700',
  },

  // PIPELINE
  pipelineSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 15,
  },

  totalCircle: {
    width: width * 0.30,
    height: width * 0.30,
    maxWidth: 115,
    maxHeight: 115,
    borderRadius: 100,
    borderWidth: 12,
    borderTopColor: '#4385F5',
    borderRightColor: '#8B5CF6',
    borderBottomColor: '#10B981',
    borderLeftColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  totalCircleInner: {
    alignItems: 'center',
  },

  totalNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#25144B',
  },

  totalLabel: {
    fontSize: 9,
    color: '#827A91',
    marginTop: 2,
  },

  pipelineLegend: {
    flex: 1,
    gap: 9,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginRight: 7,
  },

  legendName: {
    fontSize: 10,
    color: '#554D64',
    flex: 1,
  },

  legendCount: {
    fontSize: 10,
    color: '#302347',
    fontWeight: '700',
  },

  progressSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EDF5',
    paddingTop: 15,
    gap: 13,
  },

  progressItem: {
    gap: 6,
  },

  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressName: {
    fontSize: 11,
    color: '#615970',
  },

  progressCount: {
    fontSize: 11,
    color: '#33264D',
    fontWeight: '700',
  },

  progressBackground: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#F0EDF5',
    overflow: 'hidden',
  },

  progressFill: {
    height: 7,
    borderRadius: 10,
  },

  // RECENT LEADS
  leadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2EFF6',
  },

  leadAvatar: {
    width: 43,
    height: 43,
    borderRadius: 25,
    backgroundColor: '#EDE6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#5B22C3',
  },

  leadInfo: {
    flex: 1,
    marginLeft: 11,
  },

  leadName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#25144B',
  },

  leadPhone: {
    fontSize: 10,
    color: '#888194',
    marginTop: 3,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 5,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },

  leadRight: {
    alignItems: 'flex-end',
    gap: 9,
  },

  leadTime: {
    fontSize: 10,
    color: '#9992A7',
  },

  // FOLLOW UP CARD
  followCard: {
    backgroundColor: '#6324C8',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },

  followIcon: {
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  followTitle: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  followSubtitle: {
    fontSize: 10,
    color: '#E7D9FF',
    marginTop: 5,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#A69BB9',
    marginVertical: 10,
  },


});
