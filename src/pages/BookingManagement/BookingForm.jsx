// src/pages/Booking/BookingForm.jsx
import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    MenuItem,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    InputAdornment,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@mui/material';
import {
    Search as SearchIcon,
    KingBed as KingBedIcon,
    Person as PersonIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import BookingReceipt from './BookingReceipt';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { roomService } from '../../services/roomService';
import { guestService } from '../../services/guestService';
import RoomSkeleton from '../../components/RoomSkeleton';

const steps = ['Select Room', 'Booking Details'];
const BOOKING_STATUS = ['confirmed', 'checked_in', 'checked_out', 'cancelled'];

const BookingForm = ({ booking, onSubmit, onCancel ,onFinish  }) => {
    const [bookingResponse, setBookingResponse] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [billingData, setBillingData] = useState(null);
    const TAX_RATE = 0.10; // 10% tax rate
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        room_id: '',
        guest_id: '',
        check_in: dayjs(),
        check_out: dayjs().add(1, 'day'),
        number_of_guests: 1,
        status: 'confirmed',
        notes: '',
    });

    const [rooms, setRooms] = useState([]);
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [roomSearch, setRoomSearch] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    
    

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsResponse, guestsResponse] = await Promise.all([
                    roomService.getRooms(),
                    guestService.getGuests()
                ]);
                setRooms(roomsResponse.data);
                setGuests(guestsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        if (booking) {
            setFormData({
                ...booking,
                check_in: dayjs(booking.check_in),
                check_out: dayjs(booking.check_out)
            });
            const room = rooms.find(r => r.id === booking.room_id);
            setSelectedRoom(room);
            setActiveStep(1);
        }
    }, [booking]);


    useEffect(() => {
        if (selectedRoom && formData.check_in && formData.check_out) {
            const days = dayjs(formData.check_out).diff(formData.check_in, 'day');
            const roomCharges = selectedRoom.price_per_night * days;
            const taxAmount = roomCharges * TAX_RATE;
            const totalAmount = roomCharges + taxAmount;
    
            setBillingData({
                room_charges: roomCharges,
                tax_amount: taxAmount,
                total_amount: totalAmount
            });
        }
    }, [selectedRoom, formData.check_in, formData.check_out]);

    const handlePrint = () => {
        const printContent = document.getElementById('receipt-content');
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        
        // Call onFinish after printing
        onFinish();
    };

    const handleNext = () => {
        if (activeStep === 0 && !selectedRoom) {
            setErrors({ room: 'Please select a room' });
            return;
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        setFormData(prev => ({ ...prev, room_id: room.id }));
        setErrors({ ...errors, room: '' });
    };

    const filteredRooms = rooms.filter(room => 
        (room.room_number.toLowerCase().includes(roomSearch.toLowerCase()) ||
        room.type.toLowerCase().includes(roomSearch.toLowerCase())) &&
        (room.status === 'available' || room.id === formData.room_id)
    );

    const validateForm = () => {
        const newErrors = {};
        if (!formData.guest_id) newErrors.guest_id = 'Guest is required';
        if (!formData.check_in) newErrors.check_in = 'Check-in date is required';
        if (!formData.check_out) newErrors.check_out = 'Check-out date is required';
        if (formData.check_in && formData.check_out && 
            dayjs(formData.check_out).isBefore(dayjs(formData.check_in))) {
            newErrors.check_out = 'Check-out must be after check-in';
        }
        if (!formData.number_of_guests || formData.number_of_guests < 1) {
            newErrors.number_of_guests = 'At least 1 guest is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const submitData = {
                    ...formData,
                    check_in: formData.check_in.format('YYYY-MM-DD HH:mm:ss'),
                    check_out: formData.check_out.format('YYYY-MM-DD HH:mm:ss'),
                    billing: {
                        ...billingData,
                        payment_method: 'cash', // You can add payment method selection if needed
                        payment_status: 'paid'
                    }
                };
                
                const response = await onSubmit(submitData);
                console.log(response);
                
                if (response.data.success) {
                    setBookingResponse(response.data);
                    setBillingData({
                        ...billingData,
                        invoice_number: response.data.billing.invoice_number,
                        payment_status: response.data.billing.payment_status,
                        payment_method: response.data.billing.payment_method
                    });
                    setShowReceipt(true);
                }
            } catch (error) {
                console.error('Error saving booking:', error);
            }
        }
    };

    const RoomSelectionStep = () => (
        <Box>
            <TextField
                fullWidth
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                placeholder="Search rooms by number or type..."
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            {loading ? (
                <RoomSkeleton count={6} />
            ) : (
            <Grid container spacing={2}>
                {filteredRooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                border: selectedRoom?.id === room.id ? 2 : 0,
                                borderColor: 'primary.main',
                            }}
                            onClick={() => handleRoomSelect(room)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Room {room.room_number}</Typography>
                                    <Chip
                                        label={room.status}
                                        color={room.status === 'available' ? 'success' : 'error'}
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <KingBedIcon />
                                        <Typography>{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon />
                                        <Typography>Capacity: {room.capacity}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MoneyIcon />
                                        <Typography>${room.price_per_night}/night</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            )}
            {errors.room && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {errors.room}
                </Typography>
            )}
        </Box>
    );

    const AmountSummary = () => (
        <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Amount Summary</Typography>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Room Charges</TableCell>
                        <TableCell align="right">
                            ${billingData?.room_charges.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Tax ({(TAX_RATE * 100)}%)</TableCell>
                        <TableCell align="right">
                            ${billingData?.tax_amount.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1"><strong>Total Amount</strong></Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="subtitle1">
                                <strong>${billingData?.total_amount.toFixed(2)}</strong>
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );

    const BookingDetailsStep = () => (
        <>
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Autocomplete
                        options={guests}
                        getOptionLabel={(guest) => `${guest.first_name} ${guest.last_name} (${guest.email})`}
                        value={guests.find(g => g.id === formData.guest_id) || null}
                        onChange={(_, newValue) => {
                            setFormData(prev => ({
                                ...prev,
                                guest_id: newValue?.id || ''
                            }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Guest"
                                error={!!errors.guest_id}
                                helperText={errors.guest_id}
                                required
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DateTimePicker
                        label="Check In"
                        value={formData.check_in}
                        onChange={(newValue) => {
                            setFormData(prev => ({ ...prev, check_in: newValue }));
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.check_in,
                                helperText: errors.check_in
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DateTimePicker
                        label="Check Out"
                        value={formData.check_out}
                        onChange={(newValue) => {
                            setFormData(prev => ({ ...prev, check_out: newValue }));
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.check_out,
                                helperText: errors.check_out
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="number_of_guests"
                        label="Number of Guests"
                        type="number"
                        value={formData.number_of_guests}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            number_of_guests: e.target.value
                        }))}
                        fullWidth
                        InputProps={{ inputProps: { min: 1 } }}
                        error={!!errors.number_of_guests}
                        helperText={errors.number_of_guests}
                    />
                </Grid>
                {booking && (
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.value
                                }))}
                                label="Status"
                            >
                                {BOOKING_STATUS.map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status.replace('_', ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <TextField
                        name="notes"
                        label="Notes"
                        multiline
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            notes: e.target.value
                        }))}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Box>
        {billingData && <AmountSummary />}
       </>
    );

    return (
        <>
        {!showReceipt ? (  <form onSubmit={handleSubmit}>
            <DialogTitle>
                {booking ? 'Edit Booking' : 'New Booking'}
            </DialogTitle>
            <DialogContent sx={{ minHeight: '70vh' }}>
                <Box sx={{ width: '100%', mb: 4 }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                {activeStep === 0 ? <RoomSelectionStep /> : <BookingDetailsStep />}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
                {activeStep === steps.length - 1 ? (
                    <Button type="submit" variant="contained">
                        {booking ? 'Update' : 'Create Booking'}
                    </Button>
                ) : (
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </DialogActions>
        </form>
    ) : (
        <BookingReceipt 
        booking={bookingResponse.booking}
        billing={bookingResponse.billing}
        onFinish={onFinish}
        />
    )}
    </>
    );
};

export default BookingForm;