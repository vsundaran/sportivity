import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { GetPlayers } from '@/API/apiHandler';
import { useDispatch, useSelector } from 'react-redux';
import { addSelectedPlayer, removeSelectedPlayer } from '@/redux/slices/playersSlice';
// import { addSelectedPlayer, removeSelectedPlayer, clearSelectedPlayers } from '@/store/playersSlice';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    shortBio: string;
    country: string;
    rating: number;
    activities: number;
    avatar: string;
    isSelected: boolean;
    profileImage: string;
    location: {
        address: string,
    }
}

const InvitePlayersScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [activeTab, setActiveTab] = useState('RECENTLY PLAYED');
    const [users, setUsers] = useState<User[]>([]);

    // Redux state management
    const dispatch = useDispatch();
    const selectedPlayers = useSelector((state: any) => state.players.selectedPlayers);

    // Debounce search query
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // 500ms debounce delay

        return () => {
            clearTimeout(timerId);
        };
    }, [searchQuery]);

    // Fetch players using React Query
    const { data: fetchedPlayers = {}, isLoading } = useQuery({
        queryKey: ['players', debouncedQuery, activeTab],
        queryFn: () => GetPlayers(debouncedQuery, activeTab),
    });
    const fetchedPlayersData: any = fetchedPlayers || {}
    const players:any =fetchedPlayersData.users
    // Update users when new data is fetched or when selectedPlayers changes
    useEffect(() => {
        if (players) {
            setUsers(players.map((player: any) => ({
                ...player,
                isSelected: selectedPlayers.some((selected: User) => selected._id === player._id)
            })));
        }
    }, [fetchedPlayers, selectedPlayers]);

    const toggleUserSelection = (user: User) => {
        if (user.isSelected) {
            dispatch(removeSelectedPlayer(user._id));
        } else {
            dispatch(addSelectedPlayer(user));
        }
    };

    const removeSelectedUser = (userId: string) => {
        dispatch(removeSelectedPlayer(userId));
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
                key={i}
                name={i < Math.floor(rating) ? 'star' : 'star-outline'}
                size={12}
                color="white"
            />
        ));
    };

    return (
        <View style={styles.container}>
            {selectedPlayers.length > 0 && (
                <View style={styles.selectedUsersContainer}>
                    <Text style={styles.inviteLabel}>Invite:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                        {selectedPlayers.map((user: User) => (
                            <View key={user._id} style={styles.chip}>
                                <Text style={styles.chipText}>{`${user.firstName} ${user.lastName}`}</Text>
                                <TouchableOpacity onPress={() => removeSelectedUser(user._id)}>
                                    <Ionicons name="close" size={16} color="#fff" style={styles.chipClose} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search players..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
                {isLoading && <ActivityIndicator size="small" color="#999" style={styles.loadingIndicator} />}
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'RECENTLY PLAYED' && styles.activeTab]}
                    onPress={() => setActiveTab('RECENTLY PLAYED')}
                >
                    <Text style={[styles.tabText, activeTab === 'RECENTLY PLAYED' && styles.activeTabText]}>
                        RECENTLY PLAYED
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'DISCOVER PLAYERS' && styles.activeTab]}
                    onPress={() => setActiveTab('DISCOVER PLAYERS')}
                >
                    <Text style={[styles.tabText, activeTab === 'DISCOVER PLAYERS' && styles.activeTabText]}>
                        DISCOVER PLAYERS
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Users List */}
            <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
                {isLoading && !users.length ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2598f4" />
                    </View>
                ) : users.length > 0 ? (
                    users.map(user => (
                        <TouchableOpacity
                            key={user._id}
                            style={styles.userItem}
                            onPress={() => toggleUserSelection(user)}
                        >
                            <Image source={{ uri: user?.profileImage || `https://avatar.iran.liara.run/username?username=${user.firstName}+${user.lastName}` }} style={styles.avatar} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
                                <Text style={styles.userLocation}>{user.location.address}</Text>
                                <View style={styles.userStats}>
                                    <View style={styles.ratingContainer}>
                                        <Text style={styles.ratingText}>{user.rating}</Text>
                                        <View style={styles.starsContainer}>
                                            {renderStars(user.rating)}
                                        </View>
                                    </View>
                                    <View style={styles.activitiesContainer}>
                                        <Ionicons name="fitness" size={14} color="#666" />
                                        <Text style={styles.activitiesText}>{user.activities} Activities</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.checkContainer}>
                                {user.isSelected ? (
                                    <View style={styles.checkedCircle}>
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    </View>
                                ) : (
                                    <View style={styles.uncheckedCircle} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>Search players to get the list of users</Text>
                    </View>
                )}
            </ScrollView>

            {/* Invite Button */}
            <View style={styles.buttonContainer}>
                <Link href={"/create-activity"}>
                    <TouchableOpacity
                        style={[styles.inviteButton, selectedPlayers.length === 0 && styles.disabledButton]}
                        disabled={selectedPlayers.length === 0}
                    >
                        <Text style={styles.inviteButtonText}>INVITE PLAYERS</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#007AFF',
    },
    headerSpacer: {
        width: 32,
    },
    selectedUsersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inviteLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginRight: 12,
    },
    chipsContainer: {
        flex: 1,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: "#2196f3",
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    chipText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    chipClose: {
        marginLeft: 6,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    loadingIndicator: {
        marginLeft: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginRight: 24,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    activeTabText: {
        color: '#007AFF',
    },
    usersList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    userLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    userStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF9500',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 12,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginRight: 4,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    activitiesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activitiesText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    checkContainer: {
        marginLeft: 12,
    },
    checkedCircle: {
        width: 24,
        height: 24,
        borderRadius: 100,
        backgroundColor: '#2598f4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uncheckedCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 32,
    },
    inviteButton: {
        backgroundColor: '#2598f4',
        borderRadius: 8,
        width:'100%',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent:"center",
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    inviteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign:"center"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
    },
});

export default InvitePlayersScreen;