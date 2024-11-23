// src/components/GuestForm.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const IDENTIFICATION_TYPES = [
    'passport',
    'national_id',
    'drivers_license',
    'other'
];

const GuestForm = ({ guest, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        country: '',
        identification_type: '',
        identification_number: '',
        date_of_birth: null,
        special_requests: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (guest) {
            setFormData({
                ...guest,
                date_of_birth: guest.date_of_birth ? dayjs(guest.date_of_birth) : null
            });
        }
    }, [guest]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            date_of_birth: date
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                ...formData,
                date_of_birth: formData.date_of_birth ? formData.date_of_birth.format('YYYY-MM-DD') : null
            };
            onSubmit(submitData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>
                {guest ? 'Edit Guest' : 'Add New Guest'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="first_name"
                                label="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="last_name"
                                label="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="phone_number"
                                label="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!!errors.phone_number}
                                helperText={errors.phone_number}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="address"
                                label="Address"
                                value={formData.address}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="city"
                                label="City"
                                value={formData.city}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="country"
                                label="Country"
                                value={formData.country}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>ID Type</InputLabel>
                                <Select
                                    name="identification_type"
                                    value={formData.identification_type}
                                    onChange={handleChange}
                                    label="ID Type"
                                >
                                    {IDENTIFICATION_TYPES.map(type => (
                                        <MenuItem key={type} value={type}>
                                            {type.split('_').map(word => 
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="identification_number"
                                label="ID Number"
                                value={formData.identification_number}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={formData.date_of_birth}
                                    onChange={handleDateChange}
                                    maxDate={dayjs()}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="special_requests"
                                label="Special Requests"
                                value={formData.special_requests}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained">
                    {guest ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </form>
    );
};

export default GuestForm;