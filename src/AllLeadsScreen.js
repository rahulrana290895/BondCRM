
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const initialLeads = [
  {
    id: '1',
    name: 'Amit Sharma',
    company: 'ABC Technologies',
    phone: '9876543210',
    email: 'amit@example.com',
    service: 'Website Development',
    stage: 'New Lead',
    value: '25000',
    date: '08 Nov 2026',
    priority: 'High',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    company: 'Verma Enterprises',
    phone: '9876543211',
    email: 'rahul@example.com',
    service: 'App Development',
    stage: 'Contacted',
    value: '50000',
    date: '09 Nov 2026',
    priority: 'Medium',
  },
  {
    id: '3',
    name: 'Priya Singh',
    company: 'PS Solutions',
    phone: '9876543212',
    email: 'priya@example.com',
    service: 'Digital Marketing',
    stage: 'Interested',
    value: '15000',
    date: '10 Nov 2026',
    priority: 'High',
  },
  {
    id: '4',
    name: 'Vikash Kumar',
    company: 'VK Industries',
    phone: '9876543213',
    email: 'vikash@example.com',
    service: 'CRM Software',
    stage: 'Won',
    value: '75000',
    date: '11 Nov 2026',
    priority: 'Low',
  },
  {
    id: '5',
    name: 'Neha Gupta',
    company: 'NG Enterprises',
    phone: '9876543214',
    email: 'neha@example.com',
    service: 'E-Commerce Website',
    stage: 'Lost',
    value: '35000',
    date: '12 Nov 2026',
    priority: 'Medium',
  },
];

const filters = [
  'All',
  'New Lead',
  'Contacted',
  'Interested',
  'Won',
  'Lost',
];

const stageColors = {
  'New Lead': '#3979ED',
  Contacted: '#8B5CF6',
  Interested: '#D99420',
  Qualified: '#0C9CA8',
  'Meeting': '#D94C99',
  Negotiation: '#E67B28',
  Won: '#129968',
  Lost: '#E34B58',
};

export default function AllLeadsScreen({navigation}) {

  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);

  const totalLeads = leads.length;
  const newLeads = leads.filter(item => item.stage === 'New Lead').length;
  const wonLeads = leads.filter(item => item.stage === 'Won').length;

  const filteredLeads = leads.filter(item => {

    const searchText = search.toLowerCase();

    const matchSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.company.toLowerCase().includes(searchText) ||
      item.phone.includes(search) ||
      item.service.toLowerCase().includes(searchText);

    const matchFilter =
      activeFilter === 'All' || item.stage === activeFilter;

    return matchSearch && matchFilter;
  });

  const formatPrice = value =>
    '₹' + Number(value || 0).toLocaleString('en-IN');

  const getStageColor = stage =>
    stageColors[stage] || '#81718F';

  const callLead = phone => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to open phone dialer.');
    });
  };

  const openLeadDetails = item => {
    setSelectedLead(item);
    navigation?.navigate('LeadDetail', {lead: item});
  };

  const editLead = item => {
    navigation?.navigate('AddLead', {
      lead: item,
      isEdit: true,
    });
  };

  const changeStage = item => {
    const options = [
      'New Lead',
      'Contacted',
      'Interested',
      'Qualified',
      'Meeting',
      'Negotiation',
      'Won',
      'Lost',
    ];

    Alert.alert(
      'Change Pipeline Stage',
      `Select stage for ${item.name}`,
      [
        ...options.map(stage => ({
          text: stage,
          onPress: () => {
            setLeads(previous =>
              previous.map(lead =>
                lead.id === item.id
                  ? {...lead, stage}
                  : lead
              )
            );
          },
        })),
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const renderSummary = (title, count, icon, color, bg) => (
    <View style={[styles.summaryCard, {backgroundColor: bg}]}>

      <View style={[styles.summaryIcon, {backgroundColor: color + '20'}]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <Text style={styles.summaryNumber}>{count}</Text>
      <Text style={styles.summaryTitle}>{title}</Text>

    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <StatusBar
        backgroundColor="#6422C9"
        barStyle="light-content"
      />

      {/* HEADER */}
      <LinearGradient colors={['#8739EB', '#5018B9']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Leads</Text>
        <View style={{width: 25}} />
      </LinearGradient>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* PAGE HEADING */}
        <View style={styles.headingSection}>

          <View>
            <Text style={styles.heading}>Manage Your Leads</Text>
            <Text style={styles.subHeading}>
              Track and manage all your business leads
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation?.navigate('AddLead')}>

            <LinearGradient
              colors={['#8739EB', '#5719C1']}
              style={styles.addGradient}>

              <Ionicons name="add" size={23} color="#FFFFFF" />
              <Text style={styles.addText}>Add Lead</Text>

            </LinearGradient>

          </TouchableOpacity>

        </View>

        {/* SUMMARY CARDS */}
        <View style={styles.summaryRow}>

          {renderSummary(
            'Total Leads',
            totalLeads,
            'people',
            '#3979ED',
            '#EAF0FF'
          )}

          {renderSummary(
            'New Leads',
            newLeads,
            'person-add',
            '#D99420',
            '#FFF5E3'
          )}

          {renderSummary(
            'Converted',
            wonLeads,
            'checkmark-circle',
            '#129968',
            '#E3F8EF'
          )}

        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>

          <Ionicons name="search-outline" size={22} color="#81758F" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search name, company or mobile..."
            placeholderTextColor="#9992A5"
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}

        </View>

        {/* FILTERS */}
        <View style={styles.filterHeading}>
          <Text style={styles.filterTitle}>Lead Pipeline</Text>

          <Text style={styles.filterCount}>
            {filteredLeads.length} Leads
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}>

          {filters.map(item => {

            const selected = activeFilter === item;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  selected && styles.activeFilter,
                ]}
                onPress={() => setActiveFilter(item)}>

                <Text
                  style={[
                    styles.filterText,
                    selected && styles.activeFilterText,
                  ]}>
                  {item}
                </Text>

                {item === 'All' && (
                  <Text
                    style={[
                      styles.filterCountBadge,
                      selected && styles.activeFilterText,
                    ]}>
                    {totalLeads}
                  </Text>
                )}

              </TouchableOpacity>
            );
          })}

        </ScrollView>

        {/* LEADS LIST */}
        <View style={styles.leadsContainer}>

          {filteredLeads.length === 0 ? (

            <View style={styles.emptyState}>
              <Ionicons
                name="people-outline"
                size={50}
                color="#BBA9DD"
              />

              <Text style={styles.emptyTitle}>No Leads Found</Text>

              <Text style={styles.emptySubtitle}>
                Try changing your search or add a new lead.
              </Text>

              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation?.navigate('AddLead')}>

                <Text style={styles.emptyAddText}>+ Add New Lead</Text>

              </TouchableOpacity>
            </View>

          ) : (

            filteredLeads.map((item, index) => (

              <View
                key={item.id}
                style={[
                  styles.leadCard,
                  index === filteredLeads.length - 1 && {
                    marginBottom: 0,
                  },
                ]}>

                {/* CARD TOP */}
                <View style={styles.cardTop}>

                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.leadInfo}>

                    <Text style={styles.leadName}>
                      {item.name}
                    </Text>

                    <Text style={styles.companyName}>
                      {item.company}
                    </Text>

                  </View>

                  <View
                    style={[
                      styles.stageBadge,
                      {
                        backgroundColor: getStageColor(item.stage) + '18',
                      },
                    ]}>

                    <Text
                      style={[
                        styles.stageText,
                        {color: getStageColor(item.stage)},
                      ]}>
                      {item.stage}
                    </Text>

                  </View>

                </View>

                <View style={styles.cardDivider} />

                {/* CONTACT DETAILS */}
                <View style={styles.detailsRow}>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="call-outline"
                      size={15}
                      color="#82758F"
                    />
                    <Text style={styles.detailText}>
                      {item.phone}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color="#82758F"
                    />
                    <Text style={styles.detailText}>
                      {item.date}
                    </Text>
                  </View>

                </View>

                <View style={styles.detailsRow}>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="briefcase-outline"
                      size={15}
                      color="#82758F"
                    />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {item.service}
                    </Text>
                  </View>

                </View>

                {/* VALUE + PRIORITY */}
                <View style={styles.valueRow}>

                  <View>
                    <Text style={styles.valueLabel}>Lead Value</Text>
                    <Text style={styles.valueText}>
                      {formatPrice(item.value)}
                    </Text>
                  </View>

                  <View style={styles.priorityContainer}>
                    <View
                      style={[
                        styles.priorityDot,
                        {
                          backgroundColor:
                            item.priority === 'High'
                              ? '#E44B55'
                              : item.priority === 'Medium'
                              ? '#E5A126'
                              : '#159968',
                        },
                      ]}
                    />

                    <Text style={styles.priorityText}>
                      {item.priority} Priority
                    </Text>
                  </View>

                </View>

                <View style={styles.cardDivider} />

                {/* ACTIONS */}
                <View style={styles.actionRow}>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => callLead(item.phone)}>

                    <Ionicons
                      name="call-outline"
                      size={17}
                      color="#129968"
                    />

                    <Text style={[styles.actionText, {color: '#129968'}]}>
                      Call
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => editLead(item)}>

                    <Ionicons
                      name="create-outline"
                      size={17}
                      color="#6425CC"
                    />

                    <Text style={[styles.actionText, {color: '#6425CC'}]}>
                      Edit
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openLeadDetails(item)}>

                    <Ionicons
                      name="eye-outline"
                      size={18}
                      color="#3979ED"
                    />

                    <Text style={[styles.actionText, {color: '#3979ED'}]}>
                      Details
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.stageAction}
                    onPress={() => changeStage(item)}>

                    <Ionicons
                      name="git-branch-outline"
                      size={17}
                      color="#D28A19"
                    />

                  </TouchableOpacity>

                </View>

              </View>

            ))
          )}

        </View>

        {/* BUILDING ILLUSTRATION */}

      </ScrollView>

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
                color={item.name === 'All Leads' ? '#6825CB' : '#817A90'}
              />
            )}

            <Text
              style={[
                styles.navText,
                item.name === 'All Leads' && styles.activeNavText,
              ]}>
              {item.name}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F9F6FF',
  },

  // HEADER
  header: {
    height: 62,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  headerNotification: {
    position: 'relative',
  },

  notificationDot: {
    position: 'absolute',
    right: 1,
    top: 1,
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#FFCB45',
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 10,
  },

  // HEADING
  headingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 19,
  },

  heading: {
    fontSize: 18,
    color: '#29174F',
    fontWeight: '900',
  },

  subHeading: {
    fontSize: 10,
    color: '#888194',
    marginTop: 5,
  },

  addButton: {
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },

  addGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    gap: 2,
  },

  addText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // SUMMARY
  summaryRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 19,
  },

  summaryCard: {
    flex: 1,
    minHeight: 108,
    borderRadius: 14,
    padding: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  summaryNumber: {
    fontSize: 22,
    color: '#30234C',
    fontWeight: '900',
  },

  summaryTitle: {
    fontSize: 10,
    color: '#625B70',
    fontWeight: '600',
    marginTop: 2,
  },

  // SEARCH
  searchBox: {
    height: 51,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2C4E9',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 19,
  },

  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#30234C',
    marginLeft: 9,
    paddingVertical: 0,
  },

  // FILTERS
  filterHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },

  filterTitle: {
    fontSize: 15,
    color: '#30234C',
    fontWeight: '800',
  },

  filterCount: {
    fontSize: 11,
    color: '#8A8298',
  },

  filterScroll: {
    marginBottom: 16,
  },

  filterContainer: {
    gap: 8,
    paddingRight: 10,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4DDEE',
  },

  activeFilter: {
    backgroundColor: '#6425CC',
    borderColor: '#6425CC',
  },

  filterText: {
    fontSize: 10,
    color: '#6C637C',
    fontWeight: '700',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  filterCountBadge: {
    fontSize: 10,
    color: '#6C637C',
  },

  // LEAD CARDS
  leadsContainer: {
    gap: 13,
  },

  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    elevation: 2,
    shadowColor: '#62419A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 25,
    backgroundColor: '#EEE6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 21,
    color: '#6825CB',
    fontWeight: '900',
  },

  leadInfo: {
    flex: 1,
  },

  leadName: {
    fontSize: 14,
    color: '#291A43',
    fontWeight: '900',
  },

  companyName: {
    fontSize: 10,
    color: '#82768F',
    marginTop: 4,
  },

  stageBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
  },

  stageText: {
    fontSize: 9,
    fontWeight: '800',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#EEEAF3',
    marginVertical: 12,
  },

  // DETAILS
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
    gap: 10,
  },

  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  detailText: {
    flex: 1,
    fontSize: 10,
    color: '#625775',
  },

  // VALUE
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },

  valueLabel: {
    fontSize: 9,
    color: '#958BA3',
  },

  valueText: {
    fontSize: 16,
    color: '#6425CC',
    fontWeight: '900',
    marginTop: 3,
  },

  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },

  priorityText: {
    fontSize: 10,
    color: '#71677E',
    fontWeight: '600',
  },

  // ACTIONS
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 5,
  },

  actionText: {
    fontSize: 10,
    fontWeight: '700',
  },

  stageAction: {
    width: 32,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFF5E3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // EMPTY STATE
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 45,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    color: '#30234C',
    fontWeight: '800',
    marginTop: 12,
  },

  emptySubtitle: {
    fontSize: 11,
    color: '#9389A6',
    marginTop: 5,
    textAlign: 'center',
  },

  emptyAddButton: {
    marginTop: 15,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#6425CC',
  },

  emptyAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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

  // BOTTOM NAVIGATION
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

});
