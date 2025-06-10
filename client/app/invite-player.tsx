import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface User {
    id: string;
    name: string;
    location: string;
    rating: number;
    activities: number;
    avatar: string;
    isSelected: boolean;
}

const InvitePlayersScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('RECENTLY PLAYED');
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: 'Jessica Cabello',
            location: 'East coast park, Singapore',
            rating: 4.5,
            activities: 10,
            avatar: '/placeholder.svg?height=60&width=60',
            isSelected: true,
        },
        {
            id: '2',
            name: 'Miguel Murphy',
            location: 'East coast park, Singapore',
            rating: 4.5,
            activities: 10,
            avatar: '/placeholder.svg?height=60&width=60',
            isSelected: true,
        },
        {
            id: '3',
            name: 'Blake White',
            location: 'East coast park, Singapore',
            rating: 4.5,
            activities: 10,
            avatar: '/placeholder.svg?height=60&width=60',
            isSelected: false,
        },
        {
            id: '4',
            name: 'Adeline Joseph',
            location: 'East coast park, Singapore',
            rating: 4.5,
            activities: 10,
            avatar: '/placeholder.svg?height=60&width=60',
            isSelected: false,
        },
        {
            id: '5',
            name: 'Adeline Joseph',
            location: 'East coast park, Singapore',
            rating: 4.5,
            activities: 10,
            avatar: '/placeholder.svg?height=60&width=60',
            isSelected: false,
        },
    ]);

    const selectedUsers = users.filter(user => user.isSelected);
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUserSelection = (userId: string) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, isSelected: !user.isSelected } : user
            )
        );
    };

    const removeSelectedUser = (userId: string) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, isSelected: false } : user
            )
        );
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Ionicons
                key={index}
                name={index < Math.floor(rating) ? 'star' : index < rating ? 'star-half' : 'star-outline'}
                size={12}
                color="#FF9500"
            />
        ));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invite Players</Text>
                <View style={styles.headerSpacer} />
            </View> */}

            {/* Selected Users Chips */}
            {selectedUsers.length > 0 && (
                <View style={styles.selectedUsersContainer}>
                    <Text style={styles.inviteLabel}>Invite:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                        {selectedUsers.map(user => (
                            <View key={user.id} style={styles.chip}>
                                <Text style={styles.chipText}>{user.name.split(' ')[0]}</Text>
                                <TouchableOpacity onPress={() => removeSelectedUser(user.id)}>
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
                {filteredUsers.map(user => (
                    <TouchableOpacity
                        key={user.id}
                        style={styles.userItem}
                        onPress={() => toggleUserSelection(user.id)}
                    >
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userLocation}>{user.location}</Text>
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
                ))}
            </ScrollView>

            {/* Invite Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.inviteButton}>
                    <Link href={"/activity-list"}>
                        <Text style={styles.inviteButtonText}>INVITE PLAYERS</Text>
                    </Link>
                </TouchableOpacity>
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
        backgroundColor: '#007AFF',
        borderRadius: 16,
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
        borderRadius: 12,
        backgroundColor: '#007AFF',
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
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
    },
    inviteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default InvitePlayersScreen;