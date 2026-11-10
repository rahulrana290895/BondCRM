import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BASE_URL} from './config/config';

const API_URL = `${BASE_URL}/products_services_projects.php`;

const tabDetails = {
  Products: {
    type: 'product',
    icon: 'cube-outline',
    singular: 'Product',
    color: '#3979ED',
    bg: '#E9F0FF',
  },
  Services: {
    type: 'service',
    icon: 'settings-outline',
    singular: 'Service',
    color: '#109B65',
    bg: '#E5F8EF',
  },
  Projects: {
    type: 'project',
    icon: 'layers-outline',
    singular: 'Project',
    color: '#E04455',
    bg: '#FFECEF',
  },
};

export default function ProductsServicesProjects({navigation}) {
  const [activeTab, setActiveTab] = useState('Products');

  const [data, setData] = useState({
    Products: [],
    Services: [],
    Projects: [],
  });

  const [companyId, setCompanyId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // GET COMPANY ID
  const getCompanyId = async () => {
    try {
      let id = await AsyncStorage.getItem('company_id');

      if (!id) {
        const userData = await AsyncStorage.getItem('@bondcrm_user');

        if (userData) {
          const user = JSON.parse(userData);
          id = user.company_id?.toString();
        }
      }

      if (!id) {
        const userData = await AsyncStorage.getItem('@bondcrm_user');
        if (userData) {
          const user = JSON.parse(userData);
          id = user.company_id?.toString();
        }
      }

      if (!id) {
        throw new Error('Company ID not found. Please login again.');
      }

      setCompanyId(id);
      return id;
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to get company ID');
      return null;
    }
  };

  // API REQUEST
  const apiRequest = async (formData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  };

  // LOAD ALL ITEMS
  const loadItems = useCallback(async (id = companyId) => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('action', 'list');
      formData.append('company_id', id);

      const result = await apiRequest(formData);
      const items = Array.isArray(result.data) ? result.data : [];

      setData({
        Products: items
          .filter(item => item.type === 'product')
          .map(item => ({
            ...item,
            active: Number(item.status) === 1,
          })),

        Services: items
          .filter(item => item.type === 'service')
          .map(item => ({
            ...item,
            active: Number(item.status) === 1,
          })),

        Projects: items
          .filter(item => item.type === 'project')
          .map(item => ({
            ...item,
            active: Number(item.status) === 1,
          })),
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to load items');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  // INITIAL LOAD
  useEffect(() => {
    const initialize = async () => {
      const id = await getCompanyId();
      if (id) {
        await loadItems(id);
      } else {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const currentItems = data[activeTab] || [];

  const filteredItems = currentItems.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalProducts = data.Products.length;
  const totalServices = data.Services.length;
  const totalProjects = data.Projects.length;

  const formatPrice = value =>
    '₹ ' + Number(value || 0).toLocaleString('en-IN');

  // ADD MODAL
  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setModalVisible(true);
  };

  // EDIT MODAL
  const openEditModal = item => {
    setEditingId(item.id.toString());
    setName(item.name);
    setPrice(item.price.toString());
    setModalVisible(true);
  };

  // SAVE ITEM
  const saveItem = async () => {
    if (!name.trim() || price.trim() === '') {
      Alert.alert('Required', 'Please enter name and price.');
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    if (!companyId) {
      Alert.alert('Error', 'Company ID not found. Please login again.');
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append('action', editingId ? 'update' : 'add');
      formData.append('company_id', companyId);
      formData.append('name', name.trim());
      formData.append('type', tabDetails[activeTab].type);
      formData.append('price', price.trim());

      if (editingId) {
        formData.append('id', editingId);
      }

      const result = await apiRequest(formData);

      setModalVisible(false);
      setName('');
      setPrice('');
      setEditingId(null);

      await loadItems();

      Alert.alert(
        'Success',
        result.message ||
          (editingId ? 'Updated successfully' : 'Added successfully'),
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to save item');
    } finally {
      setSaving(false);
    }
  };

  // DELETE ITEM
  const deleteItem = id => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append('action', 'delete');
              formData.append('company_id', companyId);
              formData.append('id', id.toString());

              const result = await apiRequest(formData);

              await loadItems();

              Alert.alert('Success', result.message || 'Item deleted');
            } catch (error) {
              Alert.alert('Error', error.message || 'Unable to delete item');
            }
          },
        },
      ],
    );
  };

  // ACTIVE / INACTIVE
  const toggleStatus = async item => {
    try {
      const formData = new FormData();
      formData.append('action', 'toggle_status');
      formData.append('company_id', companyId);
      formData.append('id', item.id.toString());

      await apiRequest(formData);
      await loadItems();
    } catch (error) {
      Alert.alert('Error', error.message || 'Unable to update status');
    }
  };

  // SUMMARY CARD
  const renderSummaryCard = (title, count, icon, color, bg) => (
    <View style={[styles.summaryCard, {backgroundColor: bg}]}>
      <View style={[styles.summaryIcon, {backgroundColor: color + '18'}]}>
        <Ionicons name={icon} size={27} color={color} />
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={styles.summaryCount}>{count}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}   edges={['top']}>
      <StatusBar backgroundColor="#6322C9" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={['#883CEB', '#5117B9']}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Products / Services / Projects
        </Text>

      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>

        <Text style={styles.pageHeading}>
          Add & Manage your Products, Services and Projects
        </Text>

        {/* SUMMARY */}
        <View style={styles.summaryRow}>
          {renderSummaryCard(
            'Products',
            totalProducts,
            'cube-outline',
            '#3979ED',
            '#EFF1FF',
          )}

          {renderSummaryCard(
            'Services',
            totalServices,
            'settings-outline',
            '#109B65',
            '#E9FAF3',
          )}

          {renderSummaryCard(
            'Projects',
            totalProjects,
            'layers-outline',
            '#E04455',
            '#FFF0F3',
          )}
        </View>

        {/* TABS */}
        <View style={styles.tabContainer}>
          {['Products', 'Services', 'Projects'].map(tab => {
            const selected = activeTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, selected && styles.activeTab]}
                onPress={() => {
                  setActiveTab(tab);
                  setSearch('');
                }}>
                {selected ? (
                  <LinearGradient
                    colors={['#8739EB', '#5719C1']}
                    style={styles.activeTabGradient}>
                    <Ionicons
                      name={tabDetails[tab].icon}
                      size={23}
                      color="#FFFFFF"
                    />
                    <Text style={styles.activeTabText}>{tab}</Text>
                  </LinearGradient>
                ) : (
                  <>
                    <Ionicons
                      name={tabDetails[tab].icon}
                      size={23}
                      color="#51496B"
                    />
                    <Text style={styles.tabText}>{tab}</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SEARCH + ADD */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={23} color="#655B7B" />

            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${activeTab.toLowerCase()} by name`}
              placeholderTextColor="#88809E"
              value={search}
              onChangeText={setSearch}
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={19} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.85}
            onPress={openAddModal}>
            <LinearGradient
              colors={['#913EED', '#601CC7']}
              style={styles.addGradient}>
              <Ionicons name="add" size={25} color="#FFFFFF" />
              <Text style={styles.addText}>
                Add {tabDetails[activeTab].singular}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ITEM LIST */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#6824CB" />
              <Text style={styles.loadingText}>Loading items...</Text>
            </View>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#BBA9DD" />
              <Text style={styles.emptyTitle}>No {activeTab} Found</Text>
              <Text style={styles.emptySubtitle}>
                Add your first {tabDetails[activeTab].singular.toLowerCase()}.
              </Text>
            </View>
          ) : (
            filteredItems.map((item, index) => (
              <View
                key={item.id.toString()}
                style={[
                  styles.itemRow,
                  index === filteredItems.length - 1 && styles.lastItem,
                ]}>
                {/* ITEM ICON */}
                <View
                  style={[
                    styles.itemImage,
                    {backgroundColor: tabDetails[activeTab].bg},
                  ]}>
                  <Ionicons
                    name={tabDetails[activeTab].icon}
                    size={35}
                    color={tabDetails[activeTab].color}
                  />
                </View>

                {/* ITEM NAME */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>

                {/* PRICE + STATUS */}
                <View style={styles.priceSection}>
                  <Text style={styles.price}>
                    {formatPrice(item.price)}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: item.active ? '#DFF5EA' : '#FFE7E9',
                      },
                    ]}
                    onPress={() => toggleStatus(item)}>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: item.active ? '#0A9255' : '#D93440',
                        },
                      ]}>
                      {item.active ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(item)}>
                    <Ionicons
                      name="create-outline"
                      size={22}
                      color="#6623CB"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem(item.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={22}
                      color="#E53945"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* BUILDINGS */}
      </ScrollView>



      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Edit' : 'Add'}{' '}
                  {tabDetails[activeTab].singular}
                </Text>
                <Text style={styles.modalSubtitle}>
                  Enter {tabDetails[activeTab].singular.toLowerCase()} details
                </Text>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#887D9C" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.modalInput}>
                <Ionicons
                  name="cube-outline"
                  size={20}
                  color="#77718A"
                />
                <TextInput
                  style={styles.modalTextInput}
                  placeholder={`${tabDetails[activeTab].singular} Name`}
                  placeholderTextColor="#9994A5"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.modalInput}>
                <Ionicons name="cash-outline" size={20} color="#77718A" />
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Price (₹)"
                  placeholderTextColor="#9994A5"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveItem}
                disabled={saving}
                activeOpacity={0.85}>
                <LinearGradient
                  colors={['#8739EB', '#5719C1']}
                  style={styles.saveGradient}>
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={21}
                        color="#FFFFFF"
                      />
                      <Text style={styles.saveText}>
                        {editingId ? 'Update' : 'Save'}{' '}
                        {tabDetails[activeTab].singular}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    height: 64,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginHorizontal: 8,
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 15,
    paddingBottom: 10,
  },

  pageHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F367B',
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 27,
  },

  summaryCard: {
    flex: 1,
    minHeight: 105,
    borderRadius: 17,
    padding: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  summaryTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#51466C',
    textAlign: 'center',
  },

  summaryCount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#30254B',
    textAlign: 'center',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9C9F5',
    borderRadius: 17,
    padding: 4,
    marginBottom: 20,
  },

  tabButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 13,
  },

  activeTab: {
    overflow: 'hidden',
  },

  activeTabGradient: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 13,
  },

  activeTabText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  tabText: {
    fontSize: 12,
    color: '#51496B',
    fontWeight: '700',
  },

  searchRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 20,
  },

  searchBox: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: '#CDBBEF',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#30254B',
    marginLeft: 8,
    paddingVertical: 0,
  },

  addButton: {
    height: 52,
    minWidth: 112,
    borderRadius: 13,
    overflow: 'hidden',
  },

  addGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  addText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: '#62419A',
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: {width: 0, height: 3},
  },

  loadingBox: {
    paddingVertical: 45,
    alignItems: 'center',
  },

  loadingText: {
    color: '#655C7B',
    marginTop: 10,
    fontSize: 12,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E3F1',
    gap: 9,
  },

  lastItem: {
    borderBottomWidth: 0,
  },

  itemImage: {
    width: 50,
    height: 58,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemInfo: {
    flex: 1,
    minWidth: 0,
  },

  itemName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#21172F',
  },

  priceSection: {
    alignItems: 'center',
    minWidth: 70,
  },

  price: {
    fontSize: 12,
    color: '#6221BD',
    fontWeight: '900',
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 8,
    minWidth: 65,
    alignItems: 'center',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  actions: {
    gap: 8,
    paddingLeft: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#F0EDF5',
  },

  editButton: {
    width: 35,
    height: 37,
    borderWidth: 1,
    borderColor: '#D5C4F3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButton: {
    width: 35,
    height: 37,
    borderWidth: 1,
    borderColor: '#FFC9C9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: {
    paddingVertical: 55,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    color: '#30254B',
    fontWeight: '800',
    marginTop: 12,
  },

  emptySubtitle: {
    fontSize: 11,
    color: '#9389A6',
    marginTop: 5,
  },

  buildingSection: {
    height: 145,
    marginHorizontal: -14,
    marginTop: 25,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(231,219,255,0.45)',
    overflow: 'hidden',
  },

  buildingGroup: {
    height: '95%',
    width: '82%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 9,
  },

  buildingOne: {
    width: '18%',
    height: '58%',
    backgroundColor: '#DFD1FF',
    padding: 7,
  },

  buildingTwo: {
    width: '23%',
    height: '100%',
    backgroundColor: '#CEBAFC',
    padding: 8,
  },

  buildingThree: {
    width: '21%',
    height: '70%',
    backgroundColor: '#DCCBFF',
    padding: 7,
  },

  buildingFour: {
    width: '17%',
    height: '50%',
    backgroundColor: '#E4D9FF',
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
    backgroundColor: '#F5F0FF',
    borderRadius: 2,
  },

  groundLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#CDB9F3',
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
    color: '#655C7B',
    fontWeight: '500',
  },

  addNavButton: {
    width: 44,
    height: 44,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    elevation: 5,
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
    padding: 22,
    paddingBottom: 35,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    color: '#35117F',
    fontWeight: '900',
  },

  modalSubtitle: {
    fontSize: 11,
    color: '#90869F',
    marginTop: 4,
  },

  modalInput: {
    height: 53,
    borderWidth: 1,
    borderColor: '#DED6EA',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 12,
    gap: 10,
  },

  modalTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#30234C',
  },

  saveButton: {
    height: 53,
    borderRadius: 11,
    overflow: 'hidden',
    marginTop: 8,
  },

  saveGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
