import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const initialFollowUps = [
  {
    id: '1',
    name: 'Amit Sharma',
    company: 'Sharma Enterprises',
    phone: '9876543210',
    service: 'Website Development',
    stage: 'Interested',
    date: '07 Nov 2026',
    time: '11:30 AM',
    note: 'Discuss website design and pricing',
    status: 'Overdue',
    color: '#E74C3C',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    company: 'Verma Traders',
    phone: '9876543211',
    service: 'CRM Software',
    stage: 'Negotiation',
    date: '07 Nov 2026',
    time: '03:00 PM',
    note: 'Share final quotation',
    status: 'Today',
    color: '#E99B22',
  },
  {
    id: '3',
    name: 'Priya Singh',
    company: 'PS Solutions',
    phone: '9876543212',
    service: 'Mobile App Development',
    stage: 'Contacted',
    date: '08 Nov 2026',
    time: '10:00 AM',
    note: 'Take project requirements',
    status: 'Upcoming',
    color: '#2485D8',
  },
  {
    id: '4',
    name: 'Manish Kumar',
    company: 'MK Enterprises',
    phone: '9876543213',
    service: 'Digital Marketing',
    stage: 'Qualified',
    date: '10 Nov 2026',
    time: '12:00 PM',
    note: 'Follow up for campaign approval',
    status: 'Upcoming',
    color: '#2485D8',
  },
];

const filters = ['All', 'Overdue', 'Today', 'Upcoming'];

export default function FollowUpScreen({navigation}) {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredFollowUps = useMemo(() => {
    return followUps.filter(item => {
      const matchesFilter =
        activeFilter === 'All' || item.status === activeFilter;

      const query = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.phone.includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [followUps, activeFilter, search]);

  const overdueCount = followUps.filter(
    item => item.status === 'Overdue',
  ).length;

  const todayCount = followUps.filter(
    item => item.status === 'Today',
  ).length;

  const upcomingCount = followUps.filter(
    item => item.status === 'Upcoming',
  ).length;

  const callLead = phone => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Unable to open dialer'),
    );
  };

  const whatsappLead = phone => {
    Linking.openURL(`https://wa.me/91${phone}`).catch(() =>
      Alert.alert('Error', 'Unable to open WhatsApp'),
    );
  };

  const completeFollowUp = id => {
    Alert.alert(
      'Complete Follow-Up',
      'Have you completed this follow-up?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Yes, Complete',
          onPress: () => {
            setFollowUps(prev => prev.filter(item => item.id !== id));
          },
        },
      ],
    );
  };

  const openReschedule = item => {
    setSelectedItem(item);
    setRescheduleDate(item.date);
    setRescheduleTime(item.time);
    setModalVisible(true);
  };

  const saveReschedule = () => {
    if (!rescheduleDate.trim() || !rescheduleTime.trim()) {
      Alert.alert('Required', 'Please enter date and time');
      return;
    }

    setFollowUps(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              date: rescheduleDate,
              time: rescheduleTime,
              status: 'Upcoming',
            }
          : item,
      ),
    );

    setModalVisible(false);
    Alert.alert('Success', 'Follow-up rescheduled successfully');
  };

  const renderFollowUp = item => (
    <View style={styles.leadCard} key={item.id}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{item.name}</Text>
          <Text style={styles.company}>{item.company}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {backgroundColor: `${item.color}18`},
          ]}>
          <Text style={[styles.statusText, {color: item.color}]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.serviceRow}>
        <Ionicons name="briefcase-outline" size={15} color="#8063B2" />
        <Text style={styles.serviceText}>{item.service}</Text>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#77718A" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#77718A" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.noteBox}>
        <Ionicons name="document-text-outline" size={16} color="#7952B4" />
        <Text style={styles.noteText}>{item.note}</Text>
      </View>

      <View style={styles.stageRow}>
        <Text style={styles.stageLabel}>Pipeline Stage</Text>
        <Text style={styles.stageValue}>{item.stage}</Text>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => callLead(item.phone)}>
          <Ionicons name="call-outline" size={17} color="#268A58" />
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => whatsappLead(item.phone)}>
          <Ionicons name="logo-whatsapp" size={17} color="#1A9B65" />
          <Text style={styles.whatsappText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openReschedule(item)}>
          <Ionicons name="calendar-outline" size={17} color="#7040C0" />
          <Text style={styles.rescheduleText}>Reschedule</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => completeFollowUp(item.id)}>
        <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
        <Text style={styles.completeText}>Mark as Completed</Text>
      </TouchableOpacity>
    </View>
  );

  const navigate = screen => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}   edges={['top']}>
      <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

      <LinearGradient
        colors={['#8739EB', '#5719B9']}
        style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Follow-Ups</Text>
          <Text style={styles.headerSubtitle}>
            Manage your lead follow-up activities
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, {backgroundColor: '#FDECEC'}]}>
              <Ionicons name="alert-circle-outline" size={21} color="#E34E4E" />
            </View>
            <Text style={styles.summaryNumber}>{overdueCount}</Text>
            <Text style={styles.summaryLabel}>Overdue</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, {backgroundColor: '#FFF4DF'}]}>
              <Ionicons name="today-outline" size={21} color="#E99B22" />
            </View>
            <Text style={styles.summaryNumber}>{todayCount}</Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, {backgroundColor: '#EAF3FF'}]}>
              <Ionicons name="calendar-outline" size={21} color="#3288D8" />
            </View>
            <Text style={styles.summaryNumber}>{upcomingCount}</Text>
            <Text style={styles.summaryLabel}>Upcoming</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#9288A5" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, company or mobile..."
            placeholderTextColor="#A49BB3"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={19} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilter,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List Heading */}
        <View style={styles.listHeading}>
          <View>
            <Text style={styles.sectionTitle}>Follow-Up List</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredFollowUps.length} follow-ups found
            </Text>
          </View>
          <Ionicons name="options-outline" size={22} color="#7040C0" />
        </View>

        {filteredFollowUps.length > 0 ? (
          filteredFollowUps.map(renderFollowUp)
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons
              name="calendar-clear-outline"
              size={48}
              color="#B8A5D7"
            />
            <Text style={styles.emptyTitle}>No Follow-Ups Found</Text>
            <Text style={styles.emptySubtitle}>
              There are no follow-ups matching your search.
            </Text>
          </View>
        )}

        {/* Building Illustration */}
        <Text style={styles.footerText}>BondCRM • Grow Your Business</Text>
      </ScrollView>


      {/* Reschedule Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reschedule Follow-Up</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Follow-Up Date</Text>
            <TextInput
              style={styles.modalInput}
              value={rescheduleDate}
              onChangeText={setRescheduleDate}
              placeholder="DD MMM YYYY"
              placeholderTextColor="#A49BB3"
            />

            <Text style={styles.inputLabel}>Follow-Up Time</Text>
            <TextInput
              style={styles.modalInput}
              value={rescheduleTime}
              onChangeText={setRescheduleTime}
              placeholder="e.g. 03:00 PM"
              placeholderTextColor="#A49BB3"
            />

            <TouchableOpacity onPress={saveReschedule}>
              <LinearGradient
                colors={['#8739EB', '#5719B9']}
                style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    minHeight: 78,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#E8D9FF',
    fontSize: 12,
    marginTop: 3,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#FFCF55',
    position: 'absolute',
    top: 8,
    right: 9,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  summaryIcon: {
    height: 38,
    width: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#34234D',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#898196',
    marginTop: 2,
    fontWeight: '600',
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 14,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#33234A',
    marginLeft: 9,
    paddingVertical: 0,
  },
  filterScroll: {
    flexGrow: 0,
    marginBottom: 17,
  },
  filterButton: {
    paddingHorizontal: 19,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EAE2F5',
  },
  activeFilter: {
    backgroundColor: '#692ACB',
    borderColor: '#692ACB',
  },
  filterText: {
    color: '#766A89',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#33234A',
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#92899F',
    fontSize: 11,
    marginTop: 3,
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 14,
    marginBottom: 13,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0EAF8',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#EDE2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#6A2CC5',
  },
  leadInfo: {
    flex: 1,
    marginLeft: 10,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#34234D',
  },
  company: {
    fontSize: 11,
    color: '#92899F',
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 7,
  },
  serviceText: {
    fontSize: 12,
    color: '#625475',
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 13,
    gap: 18,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 11,
    color: '#746A83',
  },
  noteBox: {
    backgroundColor: '#F8F4FF',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 13,
  },
  noteText: {
    flex: 1,
    color: '#68557E',
    fontSize: 11,
  },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
  },
  stageLabel: {
    fontSize: 11,
    color: '#91889E',
  },
  stageValue: {
    fontSize: 11,
    color: '#6729C5',
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0EBF5',
    marginVertical: 13,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
  },
  callText: {
    color: '#268A58',
    fontSize: 10,
    fontWeight: '700',
  },
  whatsappText: {
    color: '#1A9B65',
    fontSize: 10,
    fontWeight: '700',
  },
  rescheduleText: {
    color: '#7040C0',
    fontSize: 10,
    fontWeight: '700',
  },
  completeButton: {
    backgroundColor: '#692ACB',
    height: 39,
    borderRadius: 10,
    marginTop: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  completeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    marginTop: 5,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#45335D',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#92899F',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
  buildingArea: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.55,
  },
  buildingOne: {
    width: 62,
    height: 55,
    backgroundColor: '#D7C3F3',
    padding: 9,
    gap: 7,
  },
  buildingTwo: {
    width: 75,
    height: 82,
    backgroundColor: '#B99AE8',
    padding: 9,
    gap: 7,
  },
  buildingThree: {
    width: 62,
    height: 63,
    backgroundColor: '#D7C3F3',
    padding: 9,
    gap: 7,
  },
  buildingWindowRow: {
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
    textAlign: 'center',
    color: '#A397B7',
    fontSize: 10,
    marginTop: 8,
    marginBottom: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 22,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#34234D',
  },
  inputLabel: {
    fontSize: 12,
    color: '#5F526F',
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E7DDF3',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    color: '#34234D',
    fontSize: 13,
  },
  saveButton: {
    height: 46,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
