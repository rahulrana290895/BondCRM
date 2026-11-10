import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './config/config';

export default function PipelineCategoryScreen({navigation}) {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const [companyId, setCompanyId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = `${BASE_URL}/pipeline_categories.php`;

  // API REQUEST
  const callAPI = async (action, extraData = {}) => {
    const formData = new FormData();

    formData.append('action', action);
    formData.append('company_id', companyId);

    Object.keys(extraData).forEach(key => {
      formData.append(key, String(extraData[key]));
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();

    if (!responseText.trim()) {
      throw new Error('Server returned empty response.');
    }

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (error) {
      throw new Error('Invalid server response: ' + responseText.substring(0, 200));
    }

    if (!response.ok) {
      throw new Error(result.message || 'Server error.');
    }

    return result;
  };

  // FETCH CATEGORIES
  const fetchCategories = useCallback(async (currentCompanyId) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('action', 'list');
      formData.append('company_id', currentCompanyId);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error('Server returned empty response.');
      }

      const result = JSON.parse(responseText);

      if (result.status) {
        setCategories(Array.isArray(result.data) ? result.data : []);
      } else {
        setCategories([]);
        Alert.alert('Error', result.message || 'Unable to fetch categories.');
      }
    } catch (error) {
      console.log('Fetch Categories Error:', error);
      Alert.alert('Error', error.message || 'Unable to fetch categories.');
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // LOAD COMPANY ID
  useEffect(() => {
    const initialize = async () => {
      try {
        const savedCompanyId = await AsyncStorage.getItem('company_id');

        if (!savedCompanyId) {
          Alert.alert('Error', 'Company ID not found. Please login again.');
          setIsLoading(false);
          return;
        }

        setCompanyId(savedCompanyId);
        await fetchCategories(savedCompanyId);

      } catch (error) {
        console.log('Company ID Error:', error);
        setIsLoading(false);
      }
    };

    initialize();
  }, [fetchCategories]);

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingId(null);
    setCategoryName('');
    setModalVisible(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = item => {
    setEditingId(String(item.id));
    setCategoryName(item.name);
    setModalVisible(true);
  };

  // ADD / UPDATE CATEGORY
  const saveCategory = async () => {
    const name = categoryName.trim();

    if (!name) {
      Alert.alert('Required', 'Please enter category name.');
      return;
    }

    const duplicate = categories.some(
      item =>
        item.name.toLowerCase() === name.toLowerCase() &&
        String(item.id) !== String(editingId),
    );

    if (duplicate) {
      Alert.alert('Already Exists', 'Category already exists.');
      return;
    }

    try {
      setIsSaving(true);

      const action = editingId ? 'update' : 'add';

      const extraData = editingId
        ? {id: editingId, name}
        : {name};

      const result = await callAPI(action, extraData);

      if (result.status) {
        setModalVisible(false);
        setCategoryName('');
        setEditingId(null);

        await fetchCategories(companyId);

      } else {
        Alert.alert('Error', result.message || 'Unable to save category.');
      }
    } catch (error) {
      console.log('Save Category Error:', error);
      Alert.alert('Error', error.message || 'Unable to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE CATEGORY
  const deleteCategory = id => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
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
              const result = await callAPI('delete', {id});

              if (result.status) {
                await fetchCategories(companyId);

                Alert.alert(
                  'Success',
                  result.message || 'Category deleted successfully.',
                );
              } else {
                Alert.alert('Error', result.message || 'Delete failed.');
              }
            } catch (error) {
              console.log('Delete Category Error:', error);
              Alert.alert('Error', error.message || 'Unable to delete category.');
            }
          },
        },
      ],
    );
  };

  // SEARCH
  const filteredCategories = categories.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}   edges={['top']}>
      <StatusBar
        backgroundColor="#6422C9"
        barStyle="light-content"
      />

      {/* HEADER */}
      <LinearGradient
        colors={['#8739EB', '#5018B9']}
        style={styles.header}>

        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pipeline Category</Text>

        <Ionicons name="git-branch-outline" size={25} color="#FFFFFF" />

      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* TITLE */}
        <View style={styles.headingSection}>
          <Text style={styles.heading}>Pipeline Categories</Text>
          <Text style={styles.subHeading}>
            Add and manage your lead pipeline categories
          </Text>
        </View>

        {/* COUNT CARD */}
        <LinearGradient
          colors={['#8239E9', '#5419BB']}
          style={styles.countCard}>

          <View>
            <Text style={styles.countLabel}>Total Categories</Text>
            <Text style={styles.countNumber}>{categories.length}</Text>
          </View>

          <View style={styles.countIcon}>
            <Ionicons name="git-branch" size={35} color="#FFFFFF" />
          </View>

        </LinearGradient>

        {/* SEARCH + ADD */}
        <View style={styles.searchRow}>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={21} color="#77718A" />

            <TextInput
              style={styles.searchInput}
              placeholder="Search category..."
              placeholderTextColor="#9994A5"
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
            onPress={openAddModal}
            disabled={isLoading}>

            <LinearGradient
              colors={['#8739EB', '#5719C1']}
              style={styles.addGradient}>

              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addText}>Add</Text>

            </LinearGradient>
          </TouchableOpacity>

        </View>

        {/* CATEGORY LIST */}
        <View style={styles.listContainer}>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>All Categories</Text>
            <Text style={styles.listCount}>
              {filteredCategories.length} Categories
            </Text>
          </View>

          {isLoading ? (

            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#6829CD" />
              <Text style={styles.emptyText}>Loading categories...</Text>
            </View>

          ) : filteredCategories.length === 0 ? (

            <View style={styles.emptyState}>
              <Ionicons
                name="git-branch-outline"
                size={45}
                color="#BBA9DD"
              />

              <Text style={styles.emptyTitle}>No Category Found</Text>

              <Text style={styles.emptyText}>
                Add a new category to get started.
              </Text>
            </View>

          ) : (

            filteredCategories.map((item, index) => (

              <View
                key={String(item.id)}
                style={[
                  styles.categoryItem,
                  index === filteredCategories.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}>

                <View style={styles.categoryIcon}>
                  <Ionicons
                    name="git-branch-outline"
                    size={23}
                    color="#6829CD"
                  />
                </View>

                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>
                    {item.name}
                  </Text>

                  <Text style={styles.categoryNumber}>
                    Category #{index + 1}
                  </Text>
                </View>

                {/* EDIT */}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(item)}>

                  <Ionicons
                    name="create-outline"
                    size={21}
                    color="#6425CC"
                  />
                </TouchableOpacity>

                {/* DELETE */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteCategory(item.id)}>

                  <Ionicons
                    name="trash-outline"
                    size={21}
                    color="#E04444"
                  />
                </TouchableOpacity>

              </View>
            ))
          )}

        </View>



      </ScrollView>


      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !isSaving && setModalVisible(false)}>

        <View style={styles.modalBackground}>

          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => !isSaving && setModalVisible(false)}
          />

          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>

              <View>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Edit Category' : 'Add Category'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  Enter pipeline category name
                </Text>
              </View>

              <TouchableOpacity
                disabled={isSaving}
                onPress={() => setModalVisible(false)}>

                <Ionicons
                  name="close-circle"
                  size={28}
                  color="#887D9C"
                />
              </TouchableOpacity>

            </View>

            <Text style={styles.inputLabel}>Category Name *</Text>

            <View style={styles.modalInput}>

              <Ionicons
                name="git-branch-outline"
                size={21}
                color="#77718A"
              />

              <TextInput
                style={styles.modalTextInput}
                placeholder="Enter category name"
                placeholderTextColor="#9994A5"
                value={categoryName}
                onChangeText={setCategoryName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={saveCategory}
                editable={!isSaving}
              />

            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveCategory}
              activeOpacity={0.85}
              disabled={isSaving}>

              <LinearGradient
                colors={['#8739EB', '#5719C1']}
                style={styles.saveGradient}>

                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={21}
                    color="#FFFFFF"
                  />
                )}

                <Text style={styles.saveText}>
                  {isSaving
                    ? 'Please Wait...'
                    : editingId
                    ? 'Update Category'
                    : 'Save Category'}
                </Text>

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
    height: 62,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 19,
    paddingBottom: 10,
  },

  headingSection: {
    marginBottom: 18,
  },

  heading: {
    fontSize: 20,
    color: '#29174F',
    fontWeight: '800',
  },

  subHeading: {
    fontSize: 11,
    color: '#888194',
    marginTop: 5,
  },

  countCard: {
    height: 105,
    borderRadius: 17,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    elevation: 4,
  },

  countLabel: {
    color: '#E7DAFF',
    fontSize: 12,
    fontWeight: '600',
  },

  countNumber: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 3,
  },

  countIcon: {
    width: 57,
    height: 57,
    borderRadius: 16,
    backgroundColor: '#FFFFFF25',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 17,
  },

  searchBox: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2C4E9',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#30234C',
    marginLeft: 8,
    paddingVertical: 0,
  },

  addButton: {
    width: 88,
    height: 50,
    borderRadius: 11,
    overflow: 'hidden',
  },

  addGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  addText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 16,
    elevation: 2,
    shadowColor: '#62419A',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  listTitle: {
    fontSize: 15,
    color: '#30234C',
    fontWeight: '800',
  },

  listCount: {
    fontSize: 10,
    color: '#8A8298',
  },

  categoryItem: {
    minHeight: 75,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE9F5',
    gap: 11,
    paddingVertical: 12,
  },

  categoryIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#F0E9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 14,
    color: '#2C2047',
    fontWeight: '800',
  },

  categoryNumber: {
    fontSize: 10,
    color: '#9990A5',
    marginTop: 5,
  },

  editButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#D8C8F2',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#FFCACA',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 45,
  },

  emptyTitle: {
    fontSize: 15,
    color: '#30234C',
    fontWeight: '800',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 11,
    color: '#9389A6',
    marginTop: 8,
  },

  buildingSection: {
    height: 110,
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

  addNavButton: {
    width: 43,
    height: 43,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -19,
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
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#35117F',
  },

  modalSubtitle: {
    fontSize: 11,
    color: '#90869F',
    marginTop: 4,
  },

  inputLabel: {
    fontSize: 12,
    color: '#514365',
    fontWeight: '700',
    marginBottom: 9,
  },

  modalInput: {
    height: 53,
    borderWidth: 1,
    borderColor: '#DED6EA',
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 20,
    gap: 10,
  },

  modalTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#30234C',
  },

  saveButton: {
    height: 53,
    borderRadius: 11,
    overflow: 'hidden',
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
