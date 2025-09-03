// components/drawers/TodayReportsDrawer.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  RefreshControl 
} from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import SideDrawer from './SideDrawer';
import { getTodayWorkSessions } from '../../database';

const TodayReportsDrawer = ({ 
  isOpen, 
  onClose, 
  currentUser,
  onError 
}) => {
  const [todayReports, setTodayReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load today's work session reports
   */
  const loadTodayReports = async (showRefreshing = false) => {
    if (!currentUser) return;
    
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Get today's start and end timestamps
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfDay = today.getTime();
      
      today.setHours(23, 59, 59, 999);
      const endOfDay = today.getTime();
      
      // Fetch today's sessions
      const sessions = await getTodayWorkSessions(currentUser.id, startOfDay, endOfDay);
      setTodayReports(sessions || []);
    } catch (error) {
      console.error('Error loading today reports:', error);
      if (onError) {
        onError('Failed to load today\'s reports');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load reports when drawer opens
  useEffect(() => {
    if (isOpen && currentUser) {
      loadTodayReports();
    }
  }, [isOpen, currentUser]);

  /**
   * Handle pull to refresh
   */
  const onRefresh = () => {
    loadTodayReports(true);
  };

  /**
   * Format duration for display
   */
  const formatDuration = (startTime, endTime) => {
    if (!startTime) return 'Invalid';
    if (!endTime) return 'In Progress';
    
    const duration = endTime - startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  /**
   * Format time for display
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  /**
   * Calculate total hours worked today
   */
  const getTotalHoursToday = () => {
    const totalMs = todayReports.reduce((total, session) => {
      if (session.end_work_time && session.start_work_time) {
        return total + (session.end_work_time - session.start_work_time);
      }
      return total;
    }, 0);
    
    const hours = totalMs / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  /**
   * Get today's date string
   */
  const getTodayString = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SideDrawer 
      isOpen={isOpen} 
      onClose={onClose}
      width={320}
      side="left"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Today's Work Reports</Text>
          <Text style={styles.date}>{getTodayString()}</Text>
          <Text style={styles.totalHours}>
            Total: {getTotalHoursToday()} hours
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appStyleConstants.COLOR_PRIMARY || '#007AFF']}
          />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        ) : todayReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No work sessions today</Text>
            <Text style={styles.emptySubText}>
              Start working on a project to see reports here
            </Text>
          </View>
        ) : (
          <>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{todayReports.length}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getTotalHoursToday()}</Text>
                <Text style={styles.statLabel}>Hours</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {todayReports.filter(s => s.end_work_time).length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            {/* Reports List */}
            <View style={styles.reportsContainer}>
              <Text style={styles.sectionTitle}>Work Sessions</Text>
              {todayReports.map((session, index) => (
                <View key={session.id || index} style={styles.reportItem}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.projectName} numberOfLines={1}>
                      {session.project_name}
                    </Text>
                    <View style={styles.durationContainer}>
                      <Text style={[
                        styles.duration,
                        !session.end_work_time && styles.inProgress
                      ]}>
                        {formatDuration(session.start_work_time, session.end_work_time)}
                      </Text>
                      {!session.end_work_time && (
                        <View style={styles.activeDot} />
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.reportDetails}>
                    <Text style={styles.timeRange}>
                      {formatTime(session.start_work_time)} - {formatTime(session.end_work_time)}
                    </Text>
                    {session.notes && (
                      <Text style={styles.notes} numberOfLines={2}>
                        {session.notes}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SideDrawer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: appStyleConstants.SIZE_16,
    paddingTop: appStyleConstants.SIZE_20,
    backgroundColor: appStyleConstants.COLOR_PRIMARY || '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  totalHours: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: appStyleConstants.SIZE_12,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: appStyleConstants.SIZE_32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    padding: appStyleConstants.SIZE_32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999999',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#BBBBBB',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: appStyleConstants.SIZE_16,
    backgroundColor: '#F8F9FA',
    margin: appStyleConstants.SIZE_16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appStyleConstants.COLOR_PRIMARY || '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  reportsContainer: {
    padding: appStyleConstants.SIZE_16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: appStyleConstants.SIZE_12,
  },
  reportItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: appStyleConstants.SIZE_16,
    marginBottom: appStyleConstants.SIZE_12,
    borderLeftWidth: 4,
    borderLeftColor: appStyleConstants.COLOR_PRIMARY || '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appStyleConstants.COLOR_PRIMARY || '#007AFF',
  },
  inProgress: {
    color: '#FF6B35',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginLeft: 6,
  },
  reportDetails: {
    marginTop: 4,
  },
  timeRange: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  notes: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default TodayReportsDrawer;