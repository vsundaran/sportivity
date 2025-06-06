import { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

type ModeType = 'date' | 'time';

type MinuteInterval = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;

type PickerOptions = {
    minimumDate?: Date;
    maximumDate?: Date;
    is24Hour?: boolean;
    minuteInterval?: MinuteInterval;
    display?: 'default' | 'spinner' | 'clock' | 'calendar';
};
const useDateTimePicker = (
    initialDate: Date = new Date(),
    options: PickerOptions = {
        minimumDate: new Date(2020, 0, 1),
        maximumDate: new Date(2030, 11, 31),
        is24Hour: true,
        minuteInterval: 15,
    }
) => {
    const [date, setDate] = useState<Date>(initialDate);
    const [show, setShow] = useState<boolean>(false);
    const [mode, setMode] = useState<ModeType>('date');

    const onChange = (event: any, selectedDate?: Date) => {
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
        }

        if (mode === 'date') {
            showPicker('time');
        }
    };

    const showPicker = (currentMode: ModeType) => {
        setMode(currentMode);

        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: date,
                onChange,
                mode: currentMode,
                is24Hour: options.is24Hour,
                minimumDate: options.minimumDate,
                maximumDate: options.maximumDate,
                positiveButton: { label: 'OK', textColor: 'green' },
                negativeButton: { label: 'Cancel', textColor: 'red' },
                neutralButton: { label: 'Reset', textColor: 'gray' },
                display: options.display || (currentMode === 'date' ? 'default' : 'default'),
            });
        } else {
            setShow(true);
        }
    };

    const renderPicker = () => {
        if (show && Platform.OS === 'ios') {
            return (
                <DateTimePicker
                    value={date}
                    mode={mode}
                    display="inline"
                    onChange={onChange}
                    minimumDate={mode === 'date' ? options.minimumDate : undefined}
                    maximumDate={mode === 'date' ? options.maximumDate : undefined}
                    minuteInterval={options.minuteInterval}
                    themeVariant="light"
                />
            );
        }
        return null;
    };

    return {
        date,
        showDatePicker: () => showPicker('date'),
        showTimePicker: () => showPicker('time'),
        renderPicker,
    };
};

export default useDateTimePicker;