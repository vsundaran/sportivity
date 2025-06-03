import React from 'react';
import { StyleSheet, View } from 'react-native';

const Skeleton = ({ style }: { style?: any }) => (
    <View style={[styles.skeleton, style]} />
);

const SkillAssessmentSummary = () => (
    <>
        <View style={{ ...styles.container, gap: 10, alignItems: "center", justifyContent: "center", }}>
            <Skeleton style={styles.avatar} />
            <Skeleton style={{
                width: '70%',
                height: 60,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                marginBottom: 20,
            }} />
        </View>
        <View style={{ ...styles.container, gap: 10, alignItems: "center", justifyContent: "center" }}>
            <Skeleton style={styles.avatar} />
            <Skeleton style={{
                width: '70%',
                height: 60,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                marginBottom: 20,
            }} />
        </View>
        <View style={{ padding: 24 }}>
            {
                [1, 2, 3, 4, 5, 6,].map((_, index) => (
                    <Skeleton key={index} style={{ ...styles.field, width: '100%' }} />
                ))
            }

        </View>


    </>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        display: "flex",
        flexDirection: "row",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: '#e0e0e0',
        marginBottom: 20,
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

export default SkillAssessmentSummary;
