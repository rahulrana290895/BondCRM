import React from 'react';
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

const defaultLead = {
  id: '1',
  name: 'Amit Sharma',
  number: '9876543210',
  whatsapp: '9876543210',
  interested_in_name: 'Website Development',
  pipeline_stage: 'Interested',
  date: '05 Nov 2026',
  follow_up_date: '08 Nov 2026',
  follow_up_time: '11:30 AM',
  note: 'Client is interested in a business website.',
};

export default function LeadDetailScreen({navigation, route}) {
  const lead = route?.params?.lead || defaultLead;

  const leadName = lead.name || lead.lead_name || 'Lead Name';

  const phone =
    lead.number ||
    lead.phone ||
    lead.mobile ||
    lead.mobile_number ||
    '';

  const whatsapp =
    lead.whatsapp ||
    lead.whatsapp_number ||
    phone;

  const service =
    lead.interested_in_name ||
    lead.service ||
    lead.product ||
    lead.item_name ||
    'Not Available';

  const stage =
    lead.stage ||
    lead.stage_name ||
    lead.pipeline_stage_name ||
    lead.pipeline_stage ||
    'New Lead';

  const notes = lead.note || lead.notes || 'No notes available';

  const followUpDate =
    lead.followUpDate ||
    lead.follow_up_date ||
    'Not Scheduled';

  const followUpTime =
    lead.followUpTime ||
    lead.follow_up_time ||
    '--';

  const createdDate =
    lead.date ||
    lead.created_at ||
    'Not Available';

  // CALL LEAD
  const callLead = () => {
    if (!phone) {
      Alert.alert('Mobile Number', 'Mobile number is not available');
      return;
    }

    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Unable to open phone dialer'),
    );
  };

  // WHATSAPP LEAD
  const whatsappLead = () => {
    if (!whatsapp) {
      Alert.alert('WhatsApp Number', 'WhatsApp number is not available');
      return;
    }

    const cleanPhone = String(whatsapp).replace(/\D/g, '');

    const whatsappPhone =
      cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    Linking.openURL(`https://wa.me/${whatsappPhone}`).catch(() =>
      Alert.alert('Error', 'Unable to open WhatsApp'),
    );
  };

  // EDIT LEAD
  const editLead = () => {
    navigation.navigate('AddLead', {
      lead,
      isEdit: true,
    });
  };

  // OVERVIEW
  const renderOverview = () => (
    <>
      {/* LEAD INFORMATION */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lead Information</Text>

          <TouchableOpacity onPress={editLead}>
            <Ionicons name="create-outline" size={21} color="#702ACB" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoGrid}>
          <InfoItem
            icon="person-outline"
            label="Name"
            value={leadName}
          />

          <InfoItem
            icon="call-outline"
            label="Number"
            value={phone || 'Not Available'}
          />

          <InfoItem
            icon="logo-whatsapp"
            label="WhatsApp"
            value={whatsapp || 'Not Available'}
          />

          <InfoItem
            icon="briefcase-outline"
            label="Interested In"
            value={service}
          />

          <InfoItem
            icon="calendar-outline"
            label="Created Date"
            value={createdDate}
          />
        </View>
      </View>

      {/* FOLLOW-UP */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Reminder</Text>

          <View style={styles.followBadge}>
            <Text style={styles.followBadgeText}>Scheduled</Text>
          </View>
        </View>

        <View style={styles.followContent}>
          <View style={styles.followIcon}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#702ACB"
            />
          </View>

          <View style={{flex: 1}}>
            <Text style={styles.followDate}>{followUpDate}</Text>
            <Text style={styles.followTime}>{followUpTime}</Text>
          </View>
        </View>
      </View>

      {/* NOTES */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Lead Notes</Text>

        <View style={styles.notesBox}>
          <Ionicons
            name="document-text-outline"
            size={19}
            color="#7951B3"
          />

          <Text style={styles.notesText}>{notes}</Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}   edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#6425C8" barStyle="light-content" />

      {/* HEADER */}
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
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* PROFILE CARD */}
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

            <Text style={styles.profileCompany}>
              {phone || 'No Number'}
            </Text>

            <View style={styles.profileStage}>
              <Text style={styles.profileStageText}>{stage}</Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={callLead}>
            <View style={[styles.quickIcon, {backgroundColor: '#E8F7EE'}]}>
              <Ionicons name="call-outline" size={21} color="#26935C" />
            </View>

            <Text style={styles.quickText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={whatsappLead}>
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
        </View>

        {renderOverview()}

        {/* BUILDING DECORATION */}
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
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
          icon="git-branch-outline"
          label="Pipeline"
          onPress={() => navigation.navigate('LeadPipeline')}
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

// INFO ITEM
function InfoItem({icon, label, value}) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={17} color="#7541B9" />
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue} numberOfLines={2}>
          {String(value)}
        </Text>
      </View>
    </View>
  );
}

// BOTTOM NAV ITEM
function NavItem({icon, label, onPress}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#9991A8" />

      <Text style={styles.navText}>{label}</Text>
    </TouchableOpacity>
  );
}

// STYLES
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
