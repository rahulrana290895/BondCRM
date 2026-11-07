import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const sampleHistory = [
  {
    id: '1',
    title: 'Lead Created',
    description: 'New lead added to the system',
    date: '05 Nov 2026',
    time: '10:30 AM',
    user: 'Admin',
    icon: 'person-add-outline',
    color: '#278A59',
  },
  {
    id: '2',
    title: 'Stage Changed',
    description: 'New Lead → Contacted',
    date: '05 Nov 2026',
    time: '11:15 AM',
    user: 'Sales Executive',
    icon: 'git-branch-outline',
    color: '#4389D5',
  },
  {
    id: '3',
    title: 'Call Activity',
    description: 'Discussed project requirements with client',
    date: '06 Nov 2026',
    time: '12:00 PM',
    user: 'Sales Executive',
    icon: 'call-outline',
    color: '#279B80',
  },
  {
    id: '4',
    title: 'Follow-Up Scheduled',
    description: 'Next follow-up scheduled for 07 Nov 2026',
    date: '06 Nov 2026',
    time: '02:30 PM',
    user: 'Sales Executive',
    icon: 'calendar-outline',
    color: '#A16BD5',
  },
  {
    id: '5',
    title: 'Lead Updated',
    description: 'Lead value and notes updated',
    date: '07 Nov 2026',
    time: '09:45 AM',
    user: 'Admin',
    icon: 'create-outline',
    color: '#E49B32',
  },
];

const defaultLead = {
  id: '1',
  name: 'Amit Sharma',
  company: 'Sharma Enterprises',
  phone: '9876543210',
  email: 'amit@example.com',
  service: 'Website Development',
  stage: 'Interested',
  value: '25000',
  priority: 'High',
  date: '05 Nov 2026',
  followUpDate: '08 Nov 2026',
  followUpTime: '11:30 AM',
  notes: 'Client is interested in a business website. Discuss pricing and design.',
  assignedTo: 'Rahul',
};

export default function LeadDetailScreen({navigation, route}) {
  const lead = route?.params?.lead || defaultLead;

  const [activeTab, setActiveTab] = useState('Overview');
  const [history, setHistory] = useState(
    route?.params?.lead?.history || sampleHistory,
  );

  const leadName = lead.name || lead.lead_name || 'Lead Name';
  const phone = lead.phone || lead.mobile || lead.mobile_number || '';
  const email = lead.email || '';
  const company = lead.company || lead.company_name || 'Not Available';
  const service = lead.service || lead.product || 'Not Available';
  const stage = lead.stage || lead.pipeline_stage || 'New Lead';
  const value = lead.value || lead.lead_value || '0';
  const priority = lead.priority || 'Medium';
  const notes = lead.notes || 'No notes available';
  const followUpDate = lead.followUpDate || lead.follow_up_date || 'Not Scheduled';
  const followUpTime = lead.followUpTime || lead.follow_up_time || '--';
  const assignedTo = lead.assignedTo || lead.assigned_to || 'Not Assigned';
  const createdDate = lead.date || lead.created_at || 'Not Available';

  const callLead = () => {
    if (!phone) {
      Alert.alert('Mobile Number', 'Mobile number is not available');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const whatsappLead = () => {
    if (!phone) {
      Alert.alert('Mobile Number', 'Mobile number is not available');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappPhone =
      cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    Linking.openURL(`https://wa.me/${whatsappPhone}`);
  };

  const editLead = () => {
    navigation.navigate('AddLead', {
      lead,
      isEdit: true,
    });
  };

  const addHistory = () => {
    Alert.alert(
      'Add Activity',
      'Select activity type',
      [
        {
          text: 'Call',
          onPress: () => addActivity('Call Activity', 'Call with client'),
        },
        {
          text: 'Meeting',
          onPress: () => addActivity('Meeting', 'Meeting activity added'),
        },
        {
          text: 'Note',
          onPress: () => addActivity('Note Added', 'New note added'),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };

  const addActivity = (title, description) => {
    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      date: '07 Nov 2026',
      time: '02:30 PM',
      user: 'You',
      icon: 'time-outline',
      color: '#7040C0',
    };

    setHistory(prev => [newItem, ...prev]);
    Alert.alert('Success', 'Activity added to lead history');
  };

  const priorityColor =
    priority.toLowerCase() === 'high'
      ? '#E34C4C'
      : priority.toLowerCase() === 'low'
      ? '#268A58'
      : '#E49B32';

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

  const currentStageIndex = stages.indexOf(stage);

  const renderOverview = () => (
    <>
      {/* Lead Information */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lead Information</Text>
          <TouchableOpacity onPress={editLead}>
            <Ionicons name="create-outline" size={21} color="#702ACB" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoGrid}>
          <InfoItem icon="person-outline" label="Lead Name" value={leadName} />
          <InfoItem icon="business-outline" label="Company" value={company} />
          <InfoItem icon="call-outline" label="Mobile Number" value={phone || 'Not Available'} />
          <InfoItem icon="mail-outline" label="Email Address" value={email || 'Not Available'} />
          <InfoItem icon="briefcase-outline" label="Interested In" value={service} />
          <InfoItem icon="cash-outline" label="Lead Value" value={`₹${Number(value || 0).toLocaleString('en-IN')}`} />
          <InfoItem icon="person-circle-outline" label="Assigned To" value={assignedTo} />
          <InfoItem icon="calendar-outline" label="Created Date" value={createdDate} />
        </View>

        <View style={styles.priorityRow}>
          <Text style={styles.smallLabel}>Priority</Text>
          <View style={[styles.priorityBadge, {backgroundColor: `${priorityColor}18`}]}>
            <View style={[styles.priorityDot, {backgroundColor: priorityColor}]} />
            <Text style={[styles.priorityText, {color: priorityColor}]}>
              {priority}
            </Text>
          </View>
        </View>
      </View>

      {/* Pipeline */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Pipeline Progress</Text>
        <Text style={styles.sectionSubtitle}>
          Current stage: {stage}
        </Text>

        <View style={styles.pipelineContainer}>
          {stages.map((item, index) => {
            const isCompleted =
              currentStageIndex >= 0 && index <= currentStageIndex;
            const isCurrent = item === stage;

            return (
              <View style={styles.pipelineItem} key={item}>
                <View
                  style={[
                    styles.pipelineCircle,
                    isCompleted && styles.pipelineCircleActive,
                  ]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.pipelineNumber}>{index + 1}</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.pipelineText,
                    isCurrent && styles.pipelineTextActive,
                  ]}>
                  {item}
                </Text>
                {index !== stages.length - 1 && (
                  <View
                    style={[
                      styles.pipelineLine,
                      isCompleted && styles.pipelineLineActive,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Follow-Up */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Follow-Up</Text>
          <View style={styles.followBadge}>
            <Text style={styles.followBadgeText}>Scheduled</Text>
          </View>
        </View>

        <View style={styles.followContent}>
          <View style={styles.followIcon}>
            <Ionicons name="calendar-outline" size={24} color="#702ACB" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.followDate}>{followUpDate}</Text>
            <Text style={styles.followTime}>{followUpTime}</Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Lead Notes</Text>
        <View style={styles.notesBox}>
          <Ionicons name="document-text-outline" size={19} color="#7951B3" />
          <Text style={styles.notesText}>{notes}</Text>
        </View>
      </View>
    </>
  );

  const renderHistory = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Lead History</Text>
          <Text style={styles.sectionSubtitle}>
            Complete activity timeline
          </Text>
        </View>
        <TouchableOpacity style={styles.addActivityButton} onPress={addHistory}>
          <Ionicons name="add" size={17} color="#FFFFFF" />
          <Text style={styles.addActivityText}>Add</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyHistory}>
          <Ionicons name="time-outline" size={42} color="#B9A5D8" />
          <Text style={styles.emptyTitle}>No History Available</Text>
          <Text style={styles.emptySubtitle}>
            Activities will appear here.
          </Text>
        </View>
      ) : (
        <View style={styles.timeline}>
          {history.map((item, index) => (
            <View style={styles.timelineItem} key={item.id}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineIcon,
                    {backgroundColor: `${item.color}18`},
                  ]}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={item.color}
                  />
                </View>
                {index !== history.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              <View style={styles.timelineContent}>
                <View style={styles.timelineTop}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                </View>

                <Text style={styles.historyDescription}>
                  {item.description}
                </Text>

                <View style={styles.historyMeta}>
                  <Ionicons name="calendar-outline" size={12} color="#9489A4" />
                  <Text style={styles.historyMetaText}>{item.date}</Text>
                  <Ionicons
                    name="person-outline"
                    size={12}
                    color="#9489A4"
                    style={{marginLeft: 9}}
                  />
                  <Text style={styles.historyMetaText}>{item.user}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

      <LinearGradient
        colors={['#8739EB', '#5719B9']}
        style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>Lead Details</Text>
          <Text style={styles.headerSubtitle}>View lead information</Text>
        </View>

        <TouchableOpacity style={styles.headerEdit} onPress={editLead}>
          <Ionicons name="create-outline" size={21} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#8739EB', '#6425C8']}
            style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {leadName.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{leadName}</Text>
            <Text style={styles.profileCompany}>{company}</Text>
            <View style={styles.profileStage}>
              <Text style={styles.profileStageText}>{stage}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={callLead}>
            <View style={[styles.quickIcon, {backgroundColor: '#E8F7EE'}]}>
              <Ionicons name="call-outline" size={21} color="#26935C" />
            </View>
            <Text style={styles.quickText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} onPress={whatsappLead}>
            <View style={[styles.quickIcon, {backgroundColor: '#E5F8ED'}]}>
              <Ionicons name="logo-whatsapp" size={21} color="#1B9C65" />
            </View>
            <Text style={styles.quickText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} onPress={editLead}>
            <View style={[styles.quickIcon, {backgroundColor: '#F0E8FF'}]}>
              <Ionicons name="create-outline" size={21} color="#702ACB" />
            </View>
            <Text style={styles.quickText}>Edit Lead</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setActiveTab('History')}>
            <View style={[styles.quickIcon, {backgroundColor: '#FFF2DF'}]}>
              <Ionicons name="time-outline" size={21} color="#D18B27" />
            </View>
            <Text style={styles.quickText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['Overview', 'History'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab === 'History' ? `History (${history.length})` : 'Overview'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Overview' ? renderOverview() : renderHistory()}

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

        <Text style={styles.footerText}>BondCRM • Grow Your Business</Text>
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
        <NavItem icon="ellipsis-horizontal" label="More" onPress={() => navigation.navigate('More')} />
      </View>
    </SafeAreaView>
  );
}

function InfoItem({icon, label, value}) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={17} color="#7541B9" />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={2}>{String(value)}</Text>
      </View>
    </View>
  );
}

function NavItem({icon, label, onPress}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#9991A8" />
      <Text style={styles.navText}>{label}</Text>
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#E8D9FF',
    fontSize: 11,
    marginTop: 2,
  },
  headerEdit: {
    height: 38,
    width: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  profileAvatar: {
    height: 62,
    width: 62,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 27,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: 13,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#34234D',
  },
  profileCompany: {
    fontSize: 12,
    color: '#8D849A',
    marginTop: 4,
  },
  profileStage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    marginTop: 8,
  },
  profileStageText: {
    color: '#702ACB',
    fontSize: 10,
    fontWeight: '800',
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 14,
    marginTop: 13,
    marginBottom: 16,
    justifyContent: 'space-around',
    elevation: 1,
  },
  quickAction: {
    alignItems: 'center',
    gap: 6,
  },
  quickIcon: {
    height: 42,
    width: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: {
    fontSize: 10,
    color: '#625475',
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#EDE6F7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabText: {
    color: '#8C829D',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#6825CB',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 13,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0EAF8',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34234D',
  },
  sectionSubtitle: {
    color: '#93899F',
    fontSize: 11,
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
    gap: 8,
  },
  infoIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: '#F1E9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    color: '#9990A4',
    fontSize: 10,
  },
  infoValue: {
    color: '#453453',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F0EAF5',
    paddingTop: 13,
  },
  smallLabel: {
    fontSize: 11,
    color: '#8D849A',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priorityDot: {
    height: 7,
    width: 7,
    borderRadius: 5,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pipelineContainer: {
    marginTop: 19,
  },
  pipelineItem: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pipelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D8CDE7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  pipelineCircleActive: {
    backgroundColor: '#702ACB',
    borderColor: '#702ACB',
  },
  pipelineNumber: {
    color: '#A69AB7',
    fontSize: 10,
    fontWeight: '700',
  },
  pipelineText: {
    color: '#A097AD',
    fontSize: 11,
    marginLeft: 11,
  },
  pipelineTextActive: {
    color: '#702ACB',
    fontWeight: '800',
  },
  pipelineLine: {
    position: 'absolute',
    width: 2,
    height: 14,
    backgroundColor: '#E5DCEE',
    left: 11,
    top: 30,
  },
  pipelineLineActive: {
    backgroundColor: '#A87BE3',
  },
  followBadge: {
    backgroundColor: '#EAF7EF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },
  followBadgeText: {
    color: '#278A59',
    fontSize: 10,
    fontWeight: '700',
  },
  followContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F4FF',
    padding: 13,
    borderRadius: 12,
  },
  followIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#EEE3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followDate: {
    fontSize: 13,
    fontWeight: '800',
    color: '#453453',
  },
  followTime: {
    color: '#8F839E',
    fontSize: 11,
    marginTop: 4,
  },
  notesBox: {
    flexDirection: 'row',
    gap: 9,
    backgroundColor: '#F8F4FF',
    borderRadius: 11,
    padding: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: '#695A7C',
  },
  addActivityButton: {
    backgroundColor: '#702ACB',
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addActivityText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  timeline: {
    marginTop: 5,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 88,
  },
  timelineLeft: {
    width: 42,
    alignItems: 'center',
  },
  timelineIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    backgroundColor: '#E9E0F2',
    top: 35,
    bottom: 0,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 17,
    paddingLeft: 7,
  },
  timelineTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTitle: {
    color: '#403052',
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  historyTime: {
    color: '#9A90A7',
    fontSize: 10,
  },
  historyDescription: {
    color: '#766B86',
    fontSize: 11,
    marginTop: 5,
    lineHeight: 17,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  historyMetaText: {
    fontSize: 9,
    color: '#9489A4',
    marginLeft: 4,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyTitle: {
    color: '#453453',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySubtitle: {
    color: '#93899F',
    fontSize: 11,
    marginTop: 5,
  },
  buildingArea: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    opacity: 0.55,
    marginTop: 8,
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
    color: '#A397B7',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
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
});
