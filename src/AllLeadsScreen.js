import React, {useState, useEffect, useCallback} from 'react';
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
  ActivityIndicator,
  Modal,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config/config';

export default function AllLeadsScreen({navigation}) {
  const [leads, setLeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Stage modal states
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [selectedLeadForStage, setSelectedLeadForStage] = useState(null);
  const [updatingStage, setUpdatingStage] = useState(false);

  // FETCH LEADS AND CATEGORIES
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const companyId = await AsyncStorage.getItem('company_id');

      if (!companyId) {
        throw new Error('Company ID not found. Please login again.');
      }

      const [leadResponse, categoryResponse] = await Promise.all([
        fetch(`${BASE_URL}/leads.php`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            action: 'list',
            company_id: companyId,
          }),
        }),

        fetch(`${BASE_URL}/get_pipeline_categories.php`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            company_id: companyId,
          }),
        }),
      ]);

      const leadResult = await leadResponse.json();
      const categoryResult = await categoryResponse.json();

      if (!leadResult.success) {
        throw new Error(leadResult.message || 'Unable to load leads');
      }

      if (!categoryResult.success) {
        throw new Error(categoryResult.message || 'Unable to load categories');
      }

      setLeads(leadResult.data || []);

      // GLOBAL + COMPANY CATEGORIES
      const allCategories = categoryResult.data || [];

      // Global company_id 0 first, then company categories
      allCategories.sort((a, b) => {
        const companyCompare =
          Number(a.company_id) - Number(b.company_id);

        return companyCompare || Number(a.id) - Number(b.id);
      });

      setCategories(allCategories);

    } catch (error) {
      console.log('All Leads Error:', error);
      Alert.alert('Error', error.message || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const unsubscribe = navigation?.addListener('focus', fetchData);

    return unsubscribe;
  }, [navigation, fetchData]);

  // GET STAGE NAME
  const getStageName = item => {
    const category = categories.find(
      c => String(c.id) === String(item.pipeline_stage),
    );

    return item.stage_name || category?.name || 'Unknown';
  };

  // FILTER LEADS
  const filteredLeads = leads.filter(item => {
    const matchesTab =
      activeTab === 'ALL' ||
      String(item.pipeline_stage) === String(activeTab);

    const q = search.toLowerCase();

    const matchesSearch = [
      item.name,
      item.number,
      item.whatsapp,
      item.interested_in_name,
      item.note,
      getStageName(item),
    ].some(value =>
      String(value || '').toLowerCase().includes(q),
    );

    return matchesTab && matchesSearch;
  });

  // CATEGORY COUNT
  const getCategoryCount = category =>
    leads.filter(
      item => String(item.pipeline_stage) === String(category.id),
    ).length;

  // SUMMARY
  const newLeads = leads.filter(
    item => getStageName(item).toLowerCase() === 'new leads',
  ).length;

  const wonLeads = leads.filter(item =>
    ['win', 'won'].includes(getStageName(item).toLowerCase()),
  ).length;

  // DATE FORMAT
  const formatDate = value => {
    if (!value) return '-';

    const parts = String(value).split('-');

    return parts.length === 3
      ? `${parts[2]}/${parts[1]}/${parts[0]}`
      : value;
  };

  // STAGE COLOR
  const getStageColor = name => {
    const stage = String(name || '').toLowerCase();

    if (stage.includes('new')) return '#3979ED';
    if (stage.includes('follow')) return '#8B5CF6';
    if (stage === 'win' || stage === 'won') return '#129968';
    if (stage === 'loss' || stage === 'lost') return '#E34B58';

    return '#81718F';
  };

  // CALL
  const callLead = number => {
    if (!number) {
      return Alert.alert('Error', 'Number not available');
    }

    Linking.openURL(`tel:${number}`).catch(() =>
      Alert.alert('Error', 'Unable to open phone dialer'),
    );
  };

  // WHATSAPP
  const whatsappLead = number => {
    if (!number) {
      return Alert.alert('Error', 'Number not available');
    }

    const cleanNumber = String(number).replace(/[^0-9]/g, '');

    Linking.openURL(`https://wa.me/${cleanNumber}`).catch(() =>
      Alert.alert('Error', 'Unable to open WhatsApp'),
    );
  };

  // DETAILS
  const openLeadDetails = item => {
    navigation.navigate('LeadDetail', {lead: item});
  };

  // EDIT
  const editLead = item => {
    navigation.navigate('AddLead', {
      lead: item,
      isEdit: true,
    });
  };

  // OPEN SELECT STAGE POPUP
  const changeStage = item => {
    if (!categories.length) {
      return Alert.alert('Error', 'No pipeline categories found');
    }

    setSelectedLeadForStage(item);
    setStageModalVisible(true);
  };

  // UPDATE LEAD STAGE
  const updateLeadStage = async category => {
    if (!selectedLeadForStage || updatingStage) return;

    try {
      setUpdatingStage(true);

      const companyId = await AsyncStorage.getItem('company_id');

      const response = await fetch(`${BASE_URL}/leads.php`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'update_stage',
          id: selectedLeadForStage.id,
          company_id: companyId,
          pipeline_stage: category.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStageModalVisible(false);
        setSelectedLeadForStage(null);

        await fetchData();

        Alert.alert('Success', 'Pipeline stage updated successfully');
      } else {
        Alert.alert('Error', result.message || 'Stage update failed');
      }
    } catch (error) {
      console.log('Update Stage Error:', error);
      Alert.alert('Error', 'Unable to update stage');
    } finally {
      setUpdatingStage(false);
    }
  };

  // SUMMARY CARD
  const renderSummary = (title, count, icon, color, bg) => (
    <View style={[styles.summaryCard, {backgroundColor: bg}]}>
      <View style={[styles.summaryIcon, {backgroundColor: color + '20'}]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <Text style={styles.summaryNumber}>{count}</Text>
      <Text style={styles.summaryTitle}>{title}</Text>
    </View>
  );

  const activeCategory = categories.find(
    c => String(c.id) === String(activeTab),
  );

  return (
    <SafeAreaView style={styles.container}   edges={['top']}>
      <StatusBar backgroundColor="#6422C9" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient colors={['#8739EB', '#5018B9']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>All Leads</Text>

        <TouchableOpacity onPress={fetchData}>
          <Ionicons name="refresh" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* HEADING */}
        <View style={styles.headingSection}>
          <View>
            <Text style={styles.heading}>Manage Your Leads</Text>
            <Text style={styles.subHeading}>
              Track and manage all your business leads
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddLead')}>
            <LinearGradient
              colors={['#8739EB', '#5719C1']}
              style={styles.addGradient}>
              <Ionicons name="add" size={23} color="#FFFFFF" />
              <Text style={styles.addText}>Add Lead</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryRow}>
          {renderSummary(
            'Total Leads',
            leads.length,
            'people',
            '#3979ED',
            '#EAF0FF',
          )}

          {renderSummary(
            'New Leads',
            newLeads,
            'person-add',
            '#D99420',
            '#FFF5E3',
          )}

          {renderSummary(
            'Won',
            wonLeads,
            'checkmark-circle',
            '#129968',
            '#E3F8EF',
          )}
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={22} color="#81758F" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search name, number or interested in..."
            placeholderTextColor="#9992A5"
            value={search}
            onChangeText={setSearch}
          />

          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* ALL + GLOBAL + COMPANY TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}>

          {/* ALL TAB */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeTab === 'ALL' && styles.activeFilter,
            ]}
            onPress={() => setActiveTab('ALL')}>

            <Text
              style={[
                styles.filterText,
                activeTab === 'ALL' && styles.activeFilterText,
              ]}>
              ALL
            </Text>

            <Text
              style={[
                styles.filterCount,
                activeTab === 'ALL' && styles.activeFilterText,
              ]}>
              {leads.length}
            </Text>
          </TouchableOpacity>

          {/* DATABASE CATEGORIES */}
          {categories.map(category => {
            const selected = String(activeTab) === String(category.id);
            const color = getStageColor(category.name);
            const isGlobal = Number(category.company_id) === 0;

            return (
              <TouchableOpacity
                key={String(category.id)}
                style={[
                  styles.filterButton,
                  selected && {
                    backgroundColor: color,
                    borderColor: color,
                  },
                ]}
                onPress={() => setActiveTab(String(category.id))}>

                <Text
                  style={[
                    styles.filterText,
                    selected && styles.activeFilterText,
                  ]}>
                  {category.name}
                </Text>

                <Text
                  style={[
                    styles.filterCountBadge,
                    selected && styles.activeFilterText,
                  ]}>
                  {getCategoryCount(category)}
                </Text>

                {!selected && (
                  <View
                    style={[
                      styles.categoryDot,
                      {
                        backgroundColor: isGlobal
                          ? '#3979ED'
                          : '#D99420',
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ACTIVE TAB HEADING */}
        <View style={styles.filterHeading}>
          <Text style={styles.filterTitle}>
            {activeTab === 'ALL'
              ? 'All Leads'
              : activeCategory?.name || 'Leads'}
          </Text>

          <Text style={styles.filterCount}>
            {filteredLeads.length} Leads
          </Text>
        </View>

        {/* LEADS */}
        <View style={styles.leadsContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#6425CC"
              style={{marginTop: 35}}
            />
          ) : categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="git-branch-outline"
                size={50}
                color="#BBA9DD"
              />
              <Text style={styles.emptyTitle}>No Categories Found</Text>
            </View>
          ) : filteredLeads.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="people-outline"
                size={50}
                color="#BBA9DD"
              />

              <Text style={styles.emptyTitle}>No Leads Found</Text>

              <Text style={styles.emptySubtitle}>
                No leads available in this category.
              </Text>

              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => navigation.navigate('AddLead')}>
                <Text style={styles.emptyAddText}>+ Add New Lead</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredLeads.map(item => {
              const stage = getStageName(item);
              const color = getStageColor(stage);

              return (
                <View key={String(item.id)} style={styles.leadCard}>

                  {/* LEAD HEADER */}
                  <View style={styles.cardTop}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {(item.name || 'L').charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.leadInfo}>
                      <Text style={styles.leadName}>{item.name}</Text>

                      <Text style={styles.companyName}>
                        Lead #{item.id} · {formatDate(item.date)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.stageBadge,
                        {backgroundColor: color + '18'},
                      ]}>
                      <Text style={[styles.stageText, {color}]}>
                        {stage}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  {/* PHONE */}
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="call-outline"
                        size={15}
                        color="#82758F"
                      />

                      <Text style={styles.detailText}>
                        {item.number || '-'}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Ionicons
                        name="logo-whatsapp"
                        size={15}
                        color="#159968"
                      />

                      <Text style={styles.detailText}>
                        {item.whatsapp || '-'}
                      </Text>
                    </View>
                  </View>

                  {/* INTERESTED AND PRIORITY */}
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="briefcase-outline"
                        size={15}
                        color="#82758F"
                      />

                      <Text style={styles.detailText} numberOfLines={1}>
                        {item.interested_in_name || 'N/A'}
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
                        {item.priority || 'Medium'}
                      </Text>
                    </View>
                  </View>

                  {/* NOTE */}
                  {!!item.note && (
                    <View style={styles.noteBox}>
                      <Text style={styles.noteLabel}>Note</Text>
                      <Text style={styles.noteText}>{item.note}</Text>
                    </View>
                  )}

                  <View style={styles.cardDivider} />

                  {/* ACTIONS */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => callLead(item.number)}>
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
                      onPress={() =>
                        whatsappLead(item.whatsapp || item.number)
                      }>
                      <Ionicons
                        name="logo-whatsapp"
                        size={17}
                        color="#159968"
                      />
                      <Text style={[styles.actionText, {color: '#159968'}]}>
                        WhatsApp
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
              );
            })
          )}
        </View>

      </ScrollView>

      {/* SELECT PIPELINE STAGE MODAL */}
      <Modal
        visible={stageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStageModalVisible(false)}>

        <View style={styles.stageModalOverlay}>
          <View style={styles.stageModalContainer}>

            <View style={styles.stageModalHeader}>
              <View>
                <Text style={styles.stageModalTitle}>Select Stage</Text>

                <Text style={styles.stageModalSubtitle}>
                  {selectedLeadForStage?.name ||
                    'Select lead pipeline stage'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setStageModalVisible(false)}
                style={styles.stageCloseButton}
                disabled={updatingStage}>
                <Ionicons name="close" size={23} color="#625775" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.stageList}
              showsVerticalScrollIndicator={true}>

              {categories.map(category => {
                const selected =
                  String(selectedLeadForStage?.pipeline_stage) ===
                  String(category.id);

                const color = getStageColor(category.name);

                return (
                  <TouchableOpacity
                    key={String(category.id)}
                    style={[
                      styles.stageOption,
                      selected && {
                        backgroundColor: color + '15',
                        borderColor: color,
                      },
                    ]}
                    disabled={updatingStage}
                    onPress={() => updateLeadStage(category)}>

                    <View style={styles.stageOptionLeft}>
                      <View
                        style={[
                          styles.stageOptionDot,
                          {backgroundColor: color},
                        ]}
                      />

                      <View>
                        <Text
                          style={[
                            styles.stageOptionText,
                            selected && {color},
                          ]}>
                          {category.name}
                        </Text>

                        <Text style={styles.stageOptionType}>
                          {Number(category.company_id) === 0
                            ? 'Global Stage'
                            : 'Company Stage'}
                        </Text>
                      </View>
                    </View>

                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={21}
                        color={color}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {updatingStage && (
              <View style={styles.stageLoading}>
                <ActivityIndicator
                  size="small"
                  color="#6425CC"
                />

                <Text style={styles.stageLoadingText}>
                  Updating stage...
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.stageCancelButton}
              onPress={() => setStageModalVisible(false)}
              disabled={updatingStage}>
              <Text style={styles.stageCancelText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* BOTTOM NAVIGATION */}

    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

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
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 10,
  },

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

  filterScroll: {
    marginBottom: 16,
  },

  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 10,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4DDEE',
  },

  filterText: {
    fontSize: 11,
    color: '#6C637C',
    fontWeight: '700',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  filterCountBadge: {
    fontSize: 10,
    color: '#6C637C',
    fontWeight: '800',
  },

  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
  },

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

  leadsContainer: {
    gap: 13,
  },

  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    marginBottom: 13,
    elevation: 2,
    shadowColor: '#62419A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
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

  noteBox: {
    backgroundColor: '#F8F5FC',
    padding: 10,
    borderRadius: 9,
    marginTop: 2,
  },

  noteLabel: {
    fontSize: 10,
    color: '#6425CC',
    fontWeight: '800',
    marginBottom: 4,
  },

  noteText: {
    fontSize: 11,
    color: '#625775',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
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

  activeFilter: {
    backgroundColor: '#6C3FC5',
    borderColor: '#6C3FC5',
  },

  // STAGE MODAL STYLES
  stageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 10, 35, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  stageModalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
  },

  stageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  stageModalTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#29174F',
  },

  stageModalSubtitle: {
    fontSize: 11,
    color: '#82758F',
    marginTop: 4,
  },

  stageCloseButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#F3EFF9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stageList: {
    maxHeight: 420,
  },

  stageOption: {
    minHeight: 62,
    borderWidth: 1,
    borderColor: '#E9E2F2',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },

  stageOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  stageOptionDot: {
    width: 11,
    height: 11,
    borderRadius: 10,
  },

  stageOptionText: {
    fontSize: 13,
    color: '#30234C',
    fontWeight: '800',
  },

  stageOptionType: {
    fontSize: 10,
    color: '#9389A6',
    marginTop: 3,
  },

  stageLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    padding: 10,
  },

  stageLoadingText: {
    color: '#6425CC',
    fontSize: 12,
    fontWeight: '700',
  },

  stageCancelButton: {
    marginTop: 10,
    padding: 13,
    borderRadius: 11,
    backgroundColor: '#F2ECFA',
    alignItems: 'center',
  },

  stageCancelText: {
    color: '#6425CC',
    fontWeight: '800',
    fontSize: 13,
  },
});