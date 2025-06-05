import React from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';

const ITEM_COUNT = 8;

// Simple skeleton shimmer effect
const Skeleton = ({ width, height, style }: { width: number | string, height: number, style?: any }) => {
    const shimmer = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, [shimmer]);

    const backgroundColor = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e0e0e0', '#f5f5f5'],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor,
                },
                style,
            ]}
        />
    );
};

const ActivityListSkeleton = () => {
    const renderItem = () => (
        <View style={styles.itemContainer}>
            <Skeleton width={60} height={60} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Skeleton width="80%" height={16} style={styles.title} />
                <Skeleton width="60%" height={12} style={styles.subtitle} />
            </View>
        </View>
    );

    return (
        <FlatList
            data={Array.from({ length: ITEM_COUNT })}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        borderRadius: 30,
        marginRight: 16,
        overflow: 'hidden',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        marginBottom: 8,
        borderRadius: 4,
    },
    subtitle: {
        borderRadius: 4,
    },
});

export default ActivityListSkeleton;