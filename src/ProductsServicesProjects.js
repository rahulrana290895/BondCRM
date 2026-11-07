import React, {useState} from 'react';
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
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const initialData = {
  Products: [
    {id: '1', name: 'Laptop (Dell Inspiron)', code: 'PRD001', category: 'Hardware', price: '55000', active: true},
    {id: '2', name: 'Smartphone (Samsung)', code: 'PRD002', category: 'Mobile', price: '24999', active: true},
    {id: '3', name: 'LED Monitor (24 Inch)', code: 'PRD003', category: 'Accessories', price: '12500', active: true},
    {id: '4', name: 'Printer (HP LaserJet)', code: 'PRD004', category: 'Peripherals', price: '18000', active: false},
  ],
  Services: [
    {id: '5', name: 'Website Development', code: 'SRV001', category: 'Development', price: '25000', active: true},
    {id: '6', name: 'App Development', code: 'SRV002', category: 'Mobile App', price: '50000', active: true},
    {id: '7', name: 'Digital Marketing', code: 'SRV003', category: 'Marketing', price: '15000', active: true},
  ],
  Projects: [
    {id: '8', name: 'CRM Software Project', code: 'PRJ001', category: 'Software', price: '150000', active: true},
    {id: '9', name: 'E-Commerce Website', code: 'PRJ002', category: 'Website', price: '75000', active: true},
  ],
};

const tabDetails = {
  Products: {
    icon: 'cube-outline',
    singular: 'Product',
    color: '#3979ED',
    bg: '#E9F0FF',
    prefix: 'PRD',
  },
  Services: {
    icon: 'settings-outline',
    singular: 'Service',
    color: '#109B65',
    bg: '#E5F8EF',
    prefix: 'SRV',
  },
  Projects: {
    icon: 'layers-outline',
    singular: 'Project',
    color: '#E04455',
    bg: '#FFECEF',
    prefix: 'PRJ',
  },
};

export default function ProductsServicesProjects({navigation}) {
  const [activeTab, setActiveTab] = useState('Products');
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const currentItems = data[activeTab];

  const totalProducts = data.Products.length;
  const totalServices = data.Services.length;
  const totalProjects = data.Projects.length;

  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = value =>
    '₹ ' + Number(value || 0).toLocaleString('en-IN');

  // ADD ITEM
  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCode('');
    setCategory('');
    setPrice('');
    setModalVisible(true);
  };

  // EDIT ITEM
  const openEditModal = item => {
    setEditingId(item.id);
    setName(item.name);
    setCode(item.code);
    setCategory(item.category);
    setPrice(item.price);
    setModalVisible(true);
  };

  // SAVE ITEM
  const saveItem = () => {
    if (!name.trim() || !code.trim() || !category.trim() || !price.trim()) {
      Alert.alert('Required', 'Please fill all fields.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    const newItem = {
      id: editingId || Date.now().toString(),
      name: name.trim(),
      code: code.trim(),
      category: category.trim(),
      price: price.trim(),
      active: true,
    };

    setData(previous => ({
      ...previous,
      [activeTab]: editingId
        ? previous[activeTab].map(item =>
            item.id === editingId ? {...item, ...newItem, active: item.active} : item
          )
        : [...previous[activeTab], newItem],
    }));

    setModalVisible(false);
    Alert.alert('Success', editingId ? 'Updated successfully.' : 'Added successfully.');
  };

  // DELETE ITEM
  const deleteItem = id => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setData(previous => ({
              ...previous,
              [activeTab]: previous[activeTab].filter(item => item.id !== id),
            }));
          },
        },
      ],
    );
  };

  // ACTIVE / INACTIVE
  const toggleStatus = id => {
    setData(previous => ({
      ...previous,
      [activeTab]: previous[activeTab].map(item =>
        item.id === id ? {...item, active: !item.active} : item
      ),
    }));
  };

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
    <SafeAreaView style={styles.container} edges={['top']}>

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

        <TouchableOpacity onPress={() => setSearch('')}>
          <Ionicons name="search-outline" size={25} color="#FFFFFF" />
        </TouchableOpacity>

      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* PAGE HEADING */}
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
            '#EFF1FF'
          )}

          {renderSummaryCard(
            'Services',
            totalServices,
            'settings-outline',
            '#109B65',
            '#E9FAF3'
          )}

          {renderSummaryCard(
            'Projects',
            totalProjects,
            'layers-outline',
            '#E04455',
            '#FFF0F3'
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
              placeholder={`Search ${activeTab.toLowerCase()} by name or code`}
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
              <Text style={styles.addText}>Add {tabDetails[activeTab].singular}</Text>

            </LinearGradient>
          </TouchableOpacity>

        </View>

        {/* ITEM LIST */}
        <View style={styles.listContainer}>

          {filteredItems.length === 0 ? (
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
                key={item.id}
                style={[
                  styles.itemRow,
                  index === filteredItems.length - 1 && styles.lastItem,
                ]}>

                {/* ITEM ICON */}
                <View style={styles.itemImage}>
                  <Ionicons
                    name={tabDetails[activeTab].icon}
                    size={35}
                    color={tabDetails[activeTab].color}
                  />
                </View>

                {/* ITEM DETAILS */}
                <View style={styles.itemInfo}>

                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <Text style={styles.itemCode}>
                    Code: {item.code}
                  </Text>

                  <Text style={styles.itemCategory}>
                    Category: {item.category}
                  </Text>

                </View>

                {/* PRICE AND STATUS */}
                <View style={styles.priceSection}>

                  <Text style={styles.price}>
                    {formatPrice(item.price)}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      {backgroundColor: item.active ? '#DFF5EA' : '#FFE7E9'},
                    ]}
                    onPress={() => toggleStatus(item.id)}>

                    <Text style={[
                      styles.statusText,
                      {color: item.active ? '#0A9255' : '#D93440'},
                    ]}>
                      {item.active ? 'Active' : 'Inactive'}
                    </Text>

                  </TouchableOpacity>

                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actions}>

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(item)}>
                    <Ionicons name="create-outline" size={22} color="#6623CB" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="#E53945" />
                  </TouchableOpacity>

                </View>

              </View>
            ))
          )}

        </View>

        {/* BOTTOM BUILDINGS */}
        <View style={styles.buildingSection}>

          <View style={styles.buildingGroup}>

            <View style={styles.buildingOne}>
              <View style={styles.windows}>
                {Array.from({length: 6}).map((_, i) => (
                  <View key={i} style={styles.window} />
                ))}
              </View>
            </View>

            <View style={styles.buildingTwo}>
              <View style={styles.windows}>
                {Array.from({length: 12}).map((_, i) => (
                  <View key={i} style={styles.window} />
                ))}
              </View>
            </View>

            <View style={styles.buildingThree}>
              <View style={styles.windows}>
                {Array.from({length: 8}).map((_, i) => (
                  <View key={i} style={styles.window} />
                ))}
              </View>
            </View>

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
              <Ionicons name={item.icon} size={23} color="#655C7B" />
            )}

            <Text style={styles.navText}>{item.name}</Text>
          </TouchableOpacity>
        ))}

      </View>

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
                  {editingId ? 'Edit' : 'Add'} {tabDetails[activeTab].singular}
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
                <Ionicons name="cube-outline" size={20} color="#77718A" />
                <TextInput
                  style={styles.modalTextInput}
                  placeholder={`${tabDetails[activeTab].singular} Name`}
                  placeholderTextColor="#9994A5"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.modalInput}>
                <Ionicons name="barcode-outline" size={20} color="#77718A" />
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Item Code"
                  placeholderTextColor="#9994A5"
                  value={code}
                  onChangeText={setCode}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.modalInput}>
                <Ionicons name="list-outline" size={20} color="#77718A" />
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Category"
                  placeholderTextColor="#9994A5"
                  value={category}
                  onChangeText={setCategory}
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
                activeOpacity={0.85}>

                <LinearGradient
                  colors={['#8739EB', '#5719C1']}
                  style={styles.saveGradient}>

                  <Ionicons name="checkmark-circle-outline" size={21} color="#FFFFFF" />
                  <Text style={styles.saveText}>
                    {editingId ? 'Update' : 'Save'} {tabDetails[activeTab].singular}
                  </Text>

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

  // SUMMARY CARDS
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

  // TABS
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

  // SEARCH
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

  // LIST
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
    width: 58,
    height: 65,
    backgroundColor: '#F0EAFF',
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

  itemCode: {
    fontSize: 10,
    color: '#605477',
    marginTop: 5,
  },

  itemCategory: {
    fontSize: 10,
    color: '#605477',
    marginTop: 4,
  },

  priceSection: {
    alignItems: 'center',
    minWidth: 70,
  },

  price: {
    fontSize: 13,
    color: '#6221BD',
    fontWeight: '900',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 8,
    minWidth: 68,
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
    width: 37,
    height: 39,
    borderWidth: 1,
    borderColor: '#D5C4F3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButton: {
    width: 37,
    height: 39,
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

  // BUILDING
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

  // MODAL
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
