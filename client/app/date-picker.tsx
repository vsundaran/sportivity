import React, { useState } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const EnhancedDateTimePicker = () => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<any>('date');

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;

        if (event.type === 'dismissed') {
            console.log('Picker was dismissed');
        } else if (event.type === 'neutralButtonPressed') {
            console.log('Neutral button pressed');
            setDate(new Date(0));
        } else {
            setDate(currentDate);
        }

        if (Platform.OS === 'ios') {
            setShow(true);
        };

        if (mode === 'date') {
            showPicker('time');
            console.log('Selected date:', currentDate.toLocaleDateString());
        }
    };

    const showPicker = (currentMode: any) => {
        setMode(currentMode);

        if (Platform.OS === 'android') {
            const androidProps = {
                value: date,
                onChange,
                mode: currentMode,
                is24Hour: true,
                minimumDate: new Date(2020, 0, 1),
                maximumDate: new Date(2030, 11, 31),
                positiveButton: { label: 'OK', textColor: 'green' },
                negativeButton: { label: 'Cancel', textColor: 'red' },
                neutralButton: { label: 'Reset', textColor: 'gray' },
            };

            // Set appropriate display based on mode
            if (currentMode === 'date') {
                // androidProps?.display = 'calendar';
            } else {
                // androidProps?.display = 'clock';
            }

            DateTimePickerAndroid.open(androidProps);
        } else {
            setShow(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    title="Select Date"
                    onPress={() => showPicker('date')}
                    color="#0066cc"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Select Time"
                    onPress={() => showPicker('time')}
                    color="#0066cc"
                />
            </View>

            <Text style={styles.selectedText}>
                Selected: {date.toLocaleString()}
            </Text>

            {show && Platform.OS === 'ios' && (
                <DateTimePicker
                    value={date}
                    mode={mode}
                    display="inline" // Works for both date and time on iOS
                    onChange={onChange}
                    minimumDate={mode === 'date' ? new Date(2020, 0, 1) : undefined}
                    maximumDate={mode === 'date' ? new Date(2030, 11, 31) : undefined}
                    minuteInterval={15}
                    themeVariant="light"
                    style={styles.picker}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    buttonContainer: {
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
    },
    selectedText: {
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
    },
    picker: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 10,
    },
});

export default EnhancedDateTimePicker;