import React from 'react';
import { StyleSheet, View } from 'react-native';

const Skeleton = ({ style }: { style?: any }) => (
    <View style={[styles.skeleton, style]} />
);

const ProfileFormLoadingSkeleton = () => (
    <View style={styles.container}>
        <Skeleton style={styles.avatar} />
        {[...Array(8)].map((_, i) => (
            <Skeleton key={i} style={styles.field} />
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 100,
        backgroundColor: '#e0e0e0',
        marginBottom: 32,
    },
    field: {
        width: '100%',
        height: 60,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
        marginBottom: 20,
    },
    skeleton: {
        backgroundColor: '#e0e0e0',
        overflow: 'hidden',
    },
});

export default ProfileFormLoadingSkeleton;
