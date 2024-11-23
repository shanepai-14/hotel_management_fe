import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Dialog,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    CheckCircle as CheckCircleIcon,
    ExitToApp as ExitToAppIcon,
    Cancel as CancelIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { bookingService } from '../../services/bookingService';
import BookingForm from './BookingForm';
import BookingReceipt from './BookingReceipt';
import dayjs from 'dayjs';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedActionBooking, setSelectedActionBooking] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleAddBooking = () => {
        setSelectedBooking(null);
        setOpenDialog(true);
    };

    const handleEditBooking = (booking) => {
        setSelectedBooking(booking);
        setOpenDialog(true);
    };

    const handleDeleteBooking = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await bookingService.deleteBooking(id);
                fetchBookings();
            } catch (error) {
                console.error('Error deleting booking:', error);
            }
        }
    };

    const handleSubmit = async (bookingData) => {
        try {
            let response;
            if (selectedBooking) {
                response = await bookingService.updateBooking(selectedBooking.id, bookingData);
            } else {
                response = await bookingService.createBooking(bookingData);
            }
            
            // Only close dialog and fetch bookings after receipt is printed
            if (!response.data) {
                setOpenDialog(false);
                fetchBookings();
            }
            
            // Return the response to the BookingForm component
            return response;
        } catch (error) {
            console.error('Error saving booking:', error);
            throw error;
        }
    };

    const handleActionClick = (event, booking) => {
        console.log(booking);
        setAnchorEl(event.currentTarget);
        setSelectedActionBooking(booking);
        
    };

    const handleActionClose = () => {
        setAnchorEl(null);
        // setSelectedActionBooking(null);
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await bookingService.updateBooking(selectedActionBooking.id, {
                ...selectedActionBooking,
                status: newStatus
            });
    

            fetchBookings();
            handleActionClose();
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };
    const handleViewReceipt = () => {
        setShowReceipt(true);
        handleActionClose();
    };

    const getAvailableActions = (status) => {
        switch (status) {
            case 'confirmed':
                return ['checkout', 'cancel', 'receipt'];
            case 'checked_in':
                return ['checkout', 'cancel', 'receipt'];
            case 'checked_out':
            case 'cancelled':
                return ['receipt'];
            default:
                return ['receipt'];
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'primary';
            case 'checked_in':
                return 'success';
            case 'checked_out':
                return 'default';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const ActionMenu = () => {
        if (!selectedActionBooking) return null;
    
        const currentStatus = selectedActionBooking.status;
    
        return (
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleActionClose}
            >
                {/* Only show checkout option if status is confirmed or checked_in */}
                {(currentStatus === 'confirmed' || currentStatus === 'checked_in') && (
                    <MenuItem onClick={() => handleStatusChange('checked_out')}>
                        <ListItemIcon>
                            <ExitToAppIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>Check Out</ListItemText>
                    </MenuItem>
                )}
    
                {/* Only show cancel option if not already checked out or cancelled */}
                {(currentStatus === 'confirmed' || currentStatus === 'checked_in') && (
                    <MenuItem onClick={() => handleStatusChange('cancelled')}>
                        <ListItemIcon>
                            <CancelIcon color="error" />
                        </ListItemIcon>
                        <ListItemText>Cancel Booking</ListItemText>
                    </MenuItem>
                )}
    
                {/* View Receipt always available */}
                <MenuItem onClick={handleViewReceipt}>
                    <ListItemIcon>
                        <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText>View Receipt</ListItemText>
                </MenuItem>
            </Menu>
        );
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Bookings</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddBooking}
                >
                    New Booking
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Room</TableCell>
                            <TableCell>Guest</TableCell>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell>Guests</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    Room {booking.room.room_number}
                                </TableCell>
                                <TableCell>
                                    {`${booking.guest.first_name} ${booking.guest.last_name}`}
                                </TableCell>
                                <TableCell>
                                    {dayjs(booking.check_in).format('MMM D, YYYY')}
                                </TableCell>
                                <TableCell>
                                    {dayjs(booking.check_out).format('MMM D, YYYY')}
                                </TableCell>
                                <TableCell>
                                    {booking.number_of_guests}
                                </TableCell>
                                <TableCell>
                                    ${booking.total_price}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={booking.status.replace('_', ' ')}
                                        color={getStatusColor(booking.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEditBooking(booking)}
                                    disabled={booking.status === 'checked_out' || booking.status === 'cancelled'}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    disabled={booking.status === 'checked_out' || booking.status === 'cancelled'}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton
                                    onClick={(e) => handleActionClick(e, booking)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ActionMenu />

            {/* Booking Form Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <BookingForm
                    booking={selectedBooking}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpenDialog(false)}
                    onFinish={() => {
                        setOpenDialog(false);
                        fetchBookings();
                    }}
                />
            </Dialog>

            {/* Receipt Dialog */}
            <Dialog
                open={showReceipt}
                onClose={() => setShowReceipt(false)}
                maxWidth="md"
                fullWidth
            >
                {showReceipt && (
                <BookingReceipt
                    booking={selectedActionBooking}
                    billing={{
                        invoice_number: `INV-${selectedActionBooking?.id}`,
                        room_charges: selectedActionBooking?.total_price,
                        tax_amount: selectedActionBooking?.total_price * 0.1,
                        total_amount: selectedActionBooking?.total_price * 1.1,
                        payment_status: 'paid',
                        payment_method: 'cash'
                    }}
                    onFinish={() => setShowReceipt(false)}
                />
            )}
            </Dialog>
        </Box>
    );
};

export default BookingManagement;