
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const stages = [
  {name: 'New Lead', color: '#4389D5', icon: 'person-add-outline'},
  {name: 'Contacted', color: '#279B80', icon: 'call-outline'},
  {name: 'Interested', color: '#A16BD5', icon: 'heart-outline'},
  {name: 'Qualified', color: '#E49B32', icon: 'checkmark-circle-outline'},
  {name: 'Meeting', color: '#3688C9', icon: 'people-outline'},
  {name: 'Negotiation', color: '#D17B39', icon: 'chatbubbles-outline'},
  {name: 'Won', color: '#278A59', icon: 'trophy-outline'},
  {name: 'Lost', color: '#D9534F', icon: 'close-circle-outline'},
];

const initialLeads = [
  {
    id: '1',
    name: 'Amit Sharma',
    company: 'Sharma Enterprises',
    phone: '9876543210',
    service: 'Website Development',
    stage: 'New Lead',
    value: 25000,
    priority: 'High',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    company: 'Verma Traders',
    phone: '9876543211',
    service: 'CRM Software',
    stage: 'Contacted',
    value: 45000,
    priority: 'Medium',
  },
  {
    id: '3',
    name: 'Priya Singh',
    company: 'PS Solutions',
    phone: '9876543212',
    service: 'Mobile App Development',
    stage: 'Interested',
    value: 65000,
    priority: 'High',
  },
  {
    id: '4',
    name: 'Manish Kumar',
    company: 'MK Enterprises',
    phone: '9876543213',
    service: 'Digital Marketing',
    stage: 'Qualified',
    value: 30000,
    priority: 'Low',
  },
  {
    id: '5',
    name: 'Neha Gupta',
    company: 'NG Enterprises',
    phone: '9876543214',
    service: 'E-Commerce Website',
    stage: 'Meeting',
    value: 55000,
    priority: 'High',
  },
  {
    id: '6',
    name: 'Vikas Mehta',
    company: 'Mehta Group',
    phone: '9876543215',
    service: 'ERP Software',
    stage: 'Negotiation',
    value: 85000,
    priority: 'Medium',
  },
  {
    id: '7',
    name: 'Ankit Malhotra',
    company: 'AM Solutions',
    phone: '9876543216',
    service: 'Website Development',
    stage: 'Won',
    value: 40000,
    priority: 'High',
  },
  {
    id: '8',
    name: 'Sandeep Gill',
    company: 'Gill Enterprises',
    phone: '9876543217',
    service: 'CRM Software',
    stage: 'Lost',
    value: 35000,
    priority: 'Low',
  },
];

const formatCurrency = amount =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function LeadPipelineScreen({navigation}) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeStage, setActiveStage] = useState('All');
  const [search, setSearch] = useState('');

  const totalValue = leads.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0,
  );

  const wonLeads = leads.filter(item => item.stage === 'Won').length;
  const openLeads = leads.filter(
    item => !['Won', 'Lost'].includes(item.stage),
  ).length;

  const filteredLeads = useMemo(() => {
    return leads.filter(item => {
      const matchesStage =
        activeStage === 'All' || item.stage === activeStage;

      const query = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.service.toLowerCase().includes(query) ||
        item.phone.includes(search);

      return matchesStage && matchesSearch;
    });
  }, [leads, activeStage, search]);

  const getStageData = stage =>
    leads.filter(item => item.stage === stage);

  const getStageValue = stage =>
    getStageData(stage).reduce(
      (sum, item) => sum + Number(item.value || 0),
      0,
    );

  const moveLead = item => {
    const currentIndex = stages.findIndex(s => s.name === item.stage);

    if (currentIndex === -1 || currentIndex === stages.length - 1) {
      Alert.alert('Pipeline', 'This lead is already in the last stage.');
      return;
    }

    const nextStage = stages[currentIndex + 1].name;

    Alert.alert(
      'Move Lead',
      `Move ${item.name} to ${nextStage}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Move',
          onPress: () => {
            setLeads(prev =>
              prev.map(lead =>
                lead.id === item.id
                  ? {...lead, stage: nextStage}
                  : lead,
              ),
            );
          },
        },
      ],
    );
  };

  const renderLeadCard = item => {
    const stageInfo = stages.find(s => s.name === item.stage);
    const priorityColor =
      item.priority === 'High'
        ? '#E34C4C'
        : item.priority === 'Low'
        ? '#268A58'
        : '#E49B32';

    return (
      <View style={styles.leadCard} key={item.id}>
        <TouchableOpacity
          style={styles.leadMain}
          onPress={() =>
            navigation.navigate('LeadDetail', {lead: item})
          }>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0)}
            </Text>
          </View>

          <View style={styles.leadInfo}>
            <Text style={styles.leadName}>{item.name}</Text>
            <Text style={styles.company}>{item.company}</Text>
          </View>

          <View
            style={[
              styles.stageBadge,
              {backgroundColor: `${stageInfo?.color || '#7040C0'}18`},
            ]}>
            <Text
              style={[
                styles.stageBadgeText,
                {color: stageInfo?.color || '#7040C0'},
              ]}>
              {item.stage}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.serviceRow}>
          <Ionicons name="briefcase-outline" size={14} color="#88799B" />
          <Text style={styles.serviceText}>{item.service}</Text>
        </View>

        <View style={styles.leadBottom}>
          <View>
            <Text style={styles.valueLabel}>Lead Value</Text>
            <Text style={styles.leadValue}>
              {formatCurrency(item.value)}
            </Text>
          </View>

          <View style={styles.priorityContainer}>
            <View
              style={[
                styles.priorityDot,
                {backgroundColor: priorityColor},
              ]}
            />
            <Text style={[styles.priorityText, {color: priorityColor}]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              navigation.navigate('LeadDetail', {lead: item})
            }>
            <Ionicons name="eye-outline" size={16} color="#702ACB" />
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>

          {!['Won', 'Lost'].includes(item.stage) && (
            <TouchableOpacity
              style={styles.moveButton}
              onPress={() => moveLead(item)}>
              <Text style={styles.moveButtonText}>Move Next</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

      <LinearGradient
        colors={['#8739EB', '#5719B9']}
        style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Lead Pipeline</Text>
          <Text style={styles.headerSubtitle}>
            Track your leads at every stage
          </Text>
        </View>

      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, {backgroundColor: '#EEE5FF'}]}>
              <Ionicons name="people-outline" size={20} color="#702ACB" />
            </View>
            <Text style={styles.summaryNumber}>{leads.length}</Text>
            <Text style={styles.summaryLabel}>Total Leads</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, {backgroundColor: '#E8F3FF'}]}>
              <Ionicons name="trending-up-outline" size={20} color="#3989D4" />
            </View>
            <Text style={styles.summaryNumber}>{openLeads}</Text>
            <Text style={styles.summaryLabel}>Open Leads</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, {backgroundColor: '#E8F7ED'}]}>
              <Ionicons name="trophy-outline" size={20} color="#278A59" />
            </View>
            <Text style={styles.summaryNumber}>{wonLeads}</Text>
            <Text style={styles.summaryLabel}>Won Leads</Text>
          </View>
        </View>

        {/* Pipeline Value */}
        <View style={styles.valueCard}>
          <View style={styles.valueCardLeft}>
            <Text style={styles.valueCardLabel}>Total Pipeline Value</Text>
            <Text style={styles.valueCardAmount}>
              {formatCurrency(totalValue)}
            </Text>
            <Text style={styles.valueCardCaption}>
              Across all pipeline stages
            </Text>
          </View>
          <View style={styles.valueCardIcon}>
            <Ionicons name="wallet-outline" size={29} color="#FFFFFF" />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#9288A5" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads..."
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

        {/* Stage Filters */}
        <Text style={styles.sectionTitle}>Pipeline Stages</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.stageScroll}>
          <TouchableOpacity
            style={[
              styles.stageFilter,
              activeStage === 'All' && styles.activeStageFilter,
            ]}
            onPress={() => setActiveStage('All')}>
            <Text
              style={[
                styles.stageFilterText,
                activeStage === 'All' && styles.activeStageFilterText,
              ]}>
              All ({leads.length})
            </Text>
          </TouchableOpacity>

          {stages.map(stage => {
            const count = getStageData(stage.name).length;
            const active = activeStage === stage.name;

            return (
              <TouchableOpacity
                key={stage.name}
                style={[
                  styles.stageFilter,
                  active && styles.activeStageFilter,
                ]}
                onPress={() => setActiveStage(stage.name)}>
                <Text
                  style={[
                    styles.stageFilterText,
                    active && styles.activeStageFilterText,
                  ]}>
                  {stage.name} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stage Overview */}
        <Text style={styles.sectionTitle}>Stage Overview</Text>

        <View style={styles.stageOverviewCard}>
          {stages.map((stage, index) => {
            const count = getStageData(stage.name).length;
            const amount = getStageValue(stage.name);

            return (
              <TouchableOpacity
                key={stage.name}
                style={[
                  styles.stageOverviewRow,
                  index === stages.length - 1 && {borderBottomWidth: 0},
                ]}
                onPress={() => setActiveStage(stage.name)}>
                <View
                  style={[
                    styles.stageOverviewIcon,
                    {backgroundColor: `${stage.color}18`},
                  ]}>
                  <Ionicons
                    name={stage.icon}
                    size={18}
                    color={stage.color}
                  />
                </View>

                <View style={styles.stageOverviewInfo}>
                  <Text style={styles.stageOverviewName}>{stage.name}</Text>
                  <Text style={styles.stageOverviewAmount}>
                    {formatCurrency(amount)}
                  </Text>
                </View>

                <View style={styles.stageCount}>
                  <Text style={styles.stageCountText}>{count}</Text>
                </View>

                <Ionicons name="chevron-forward" size={17} color="#A89CB8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lead List */}
        <View style={styles.listHeading}>
          <View>
            <Text style={styles.sectionTitle}>Pipeline Leads</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredLeads.length} leads found
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddLead')}
            style={styles.addButton}>
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Lead</Text>
          </TouchableOpacity>
        </View>

        {filteredLeads.length > 0 ? (
          filteredLeads.map(renderLeadCard)
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons name="git-branch-outline" size={45} color="#B8A5D7" />
            <Text style={styles.emptyTitle}>No Leads Found</Text>
            <Text style={styles.emptySubtitle}>
              No leads are available in this stage.
            </Text>
          </View>
        )}

        {/* Building Illustration */}
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
        <NavItem
          icon="home-outline"
          label="Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
        />
        <NavItem
          icon="people-outline"
          label="All Leads"
          onPress={() => navigation.navigate('AllLeads')}
        />

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

        <NavItem
          icon="git-branch"
          label="Pipeline"
          active
          onPress={() => {}}
        />
        <NavItem
          icon="calendar-outline"
          label="Follow Up"
          onPress={() => navigation.navigate('FollowUp')}
        />
      </View>
    </SafeAreaView>
  );
}

function NavItem({icon, label, onPress, active}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={active ? '#702ACB' : '#9991A8'}
      />
      <Text style={[styles.navText, active && {color: '#702ACB'}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6FF',
  },
  header: {
    minHeight: 72,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#E8D9FF',
    fontSize: 11,
    marginTop: 3,
  },
  notificationButton: {
    height: 42,
    width: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    height: 7,
    width: 7,
    borderRadius: 5,
    backgroundColor: '#FFCF55',
    position: 'absolute',
    top: 8,
    right: 9,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 13,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  summaryNumber: {
    fontSize: 20,
    color: '#34234D',
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#92899F',
    marginTop: 3,
  },
  valueCard: {
    backgroundColor: '#6825CB',
    borderRadius: 16,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  valueCardLabel: {
    fontSize: 11,
    color: '#E7D9FF',
  },
  valueCardAmount: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 5,
  },
  valueCardCaption: {
    color: '#E7D9FF',
    fontSize: 10,
    marginTop: 4,
  },
  valueCardIcon: {
    height: 49,
    width: 49,
    borderRadius: 15,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    height: 47,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 17,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#34234D',
    marginLeft: 9,
    paddingVertical: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#34234D',
  },
  stageScroll: {
    flexGrow: 0,
    marginTop: 11,
    marginBottom: 18,
  },
  stageFilter: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE2F5',
    marginRight: 8,
  },
  activeStageFilter: {
    backgroundColor: '#692ACB',
    borderColor: '#692ACB',
  },
  stageFilterText: {
    color: '#766A89',
    fontSize: 11,
    fontWeight: '700',
  },
  activeStageFilterText: {
    color: '#FFFFFF',
  },
  stageOverviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 4,
    marginTop: 12,
    marginBottom: 19,
    elevation: 2,
  },
  stageOverviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: '#F1ECF6',
    gap: 10,
  },
  stageOverviewIcon: {
    height: 36,
    width: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageOverviewInfo: {
    flex: 1,
  },
  stageOverviewName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#453453',
  },
  stageOverviewAmount: {
    fontSize: 10,
    color: '#968BA3',
    marginTop: 4,
  },
  stageCount: {
    backgroundColor: '#F1EAFE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 30,
    alignItems: 'center',
  },
  stageCountText: {
    fontSize: 11,
    color: '#702ACB',
    fontWeight: '800',
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionSubtitle: {
    color: '#92899F',
    fontSize: 11,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#702ACB',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0EAF8',
  },
  leadMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 42,
    width: 42,
    borderRadius: 13,
    backgroundColor: '#EDE2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#6A2CC5',
    fontSize: 19,
    fontWeight: '800',
  },
  leadInfo: {
    flex: 1,
    marginLeft: 10,
  },
  leadName: {
    color: '#34234D',
    fontSize: 13,
    fontWeight: '800',
  },
  company: {
    color: '#92899F',
    fontSize: 10,
    marginTop: 3,
  },
  stageBadge: {
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  stageBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 13,
  },
  serviceText: {
    color: '#776A88',
    fontSize: 11,
  },
  leadBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
  },
  valueLabel: {
    fontSize: 10,
    color: '#948AA1',
  },
  leadValue: {
    color: '#34234D',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF8FC',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0EAF5',
    marginVertical: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewButtonText: {
    color: '#702ACB',
    fontSize: 11,
    fontWeight: '700',
  },
  moveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#702ACB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
  },
  moveButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderRadius: 16,
    padding: 30,
  },
  emptyTitle: {
    fontSize: 14,
    color: '#453453',
    fontWeight: '800',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#92899F',
    marginTop: 5,
  },
  buildingArea: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    opacity: 0.55,
    marginTop: 15,
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
