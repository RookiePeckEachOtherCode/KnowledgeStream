// components/CustomDatePicker.jsx
import {DatePicker} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from "dayjs";

interface CustomDatePickerProps {
    value: string | null;
    onChange: (newValue: Dayjs | null) => void;
    minDate?: Dayjs;
    error?: boolean;
    helperText?: string;
}

export const CustomDatePicker = ({
                                     value,
                                     onChange,
                                     minDate,
                                     error,
                                     helperText,
                                 }: CustomDatePickerProps) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            value={value ? dayjs(value) : null}
            onChange={onChange}
            format="YYYY-MM-DD"
            minDate={minDate}
            className="w-full"
            slotProps={{
                textField: {
                    error: !!error,
                    helperText: helperText,
                    className: 'bg-secondary-container rounded-lg',
                    sx: {
                        '& .MuiInputBase-input': {
                            color: 'var(--color-on-primary-container) !important',
                        },
                        '& .MuiInputLabel-root': {color: 'var(--color-on-surface-variant)'},
                        backgroundColor: 'var(--color-surface-container)',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--color-outline)'
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'var(--color-on-surface-variant)',
                            '&:hover': {color: 'var(--color-primary)'}
                        }
                    }
                },
                popper: {
                    sx: {
                        '& .MuiPaper-root': {
                            backgroundColor: 'var(--color-surface-container-high)',
                            color: 'var(--color-on-surface)',

                            // 新增星期标题样式
                            '& .MuiDayCalendar-weekDayLabel': {
                                color: 'var(--color-on-primary-container) !important',
                            },

                            '& .MuiPickersCalendarHeader-root': {
                                '& .MuiTypography-root': {
                                    color: 'var(--color-on-surface-variant)'
                                },
                                '& .MuiIconButton-root': {
                                    color: 'var(--color-on-surface-variant)',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-surface-container-highest)'
                                    }
                                }
                            },
                            '& .MuiPickersDay-root': {
                                color: 'var(--color-on-surface)',
                                '&:hover': {backgroundColor: 'var(--color-tertiary-container)'},
                                '&.Mui-selected': {
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-on-primary)',
                                    '&:hover': {backgroundColor: 'var(--color-primary-container)'}
                                },
                                '&.Mui-disabled': {color: 'var(--color-on-error)'}
                            },
                            '& .MuiDialogActions-root': {
                                borderColor: 'var(--color-outline)',
                                '& .MuiButton-root': {
                                    color: 'var(--color-primary)',
                                    '&:hover': {backgroundColor: 'var(--color-surface-container-high)'}
                                }
                            }
                        }
                    }
                }
            }}
        />
    </LocalizationProvider>
);