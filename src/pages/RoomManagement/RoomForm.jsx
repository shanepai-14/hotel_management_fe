
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Autocomplete,
    Chip,
} from '@mui/material';

const ROOM_TYPES = ['standard', 'deluxe', 'suite'];
const ROOM_STATUS = ['available', 'occupied', 'maintenance'];
const AMENITIES = [
    'WiFi',
    'TV',
    'Air Conditioning',
    'Mini Bar',
    'Safe',
    'Balcony',
    'Ocean View',
    'Room Service'
];

const RoomForm = ({ room, onSubmit, onCancel , nextRoomNumber }) => {
    const [formData, setFormData] = useState({
        room_number: '',
        type: 'standard',
        capacity: 1,
        price_per_night: '',
        status: 'available',
        description: '',
        amenities: []
    });

    useEffect(() => {
        if (room) {
            // If editing existing room
            setFormData(room);
        } else {
            // If creating new room, get the next room number
        
            setFormData(prev => ({
                ...prev,
                room_number: nextRoomNumber
            }));
        }
    }, [room]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>
                {room ? 'Edit Room' : 'Add New Rooms'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        name="room_number"
                        label="Room Number"
                        value={formData.room_number}
                        onChange={handleChange}
                        required
                        helperText={!room ? "Room number is automatically generated" : ""}
                    />

                    {/* Rest of the form fields remain the same */}
                    <TextField
                        name="type"
                        label="Room Type"
                        select
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        {ROOM_TYPES.map(type => (
                            <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        name="capacity"
                        label="Capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        InputProps={{ inputProps: { min: 1 } }}
                    />

                    <TextField
                        name="price_per_night"
                        label="Price per Night"
                        type="number"
                        value={formData.price_per_night}
                        onChange={handleChange}
                        required
                        InputProps={{
                            startAdornment: '$',
                            inputProps: { min: 0, step: '0.01' }
                        }}
                    />

                    <TextField
                        name="status"
                        label="Status"
                        select
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        {ROOM_STATUS.map(status => (
                            <MenuItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        name="description"
                        label="Description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <Autocomplete
                        multiple
                        options={AMENITIES}
                        value={formData.amenities}
                        onChange={(_, newValue) => {
                            setFormData(prev => ({
                                ...prev,
                                amenities: newValue
                            }));
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Amenities"
                                placeholder="Select amenities"
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained">
                    {room ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </form>
    );
};

export default RoomForm;