// src/components/BookingReceipt.jsx
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
    Box, 
    Paper, 
    Typography, 
    Divider, 
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { ContactSupportOutlined, Print as PrintIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

const BookingReceipt = ({ booking, billing, onFinish }) => {
    
    console.log(booking);
    console.log(billing);
    const contentRef = useRef();

    const handlePrint = useReactToPrint({
         contentRef,
        onAfterPrint: () => {
            if (onFinish) onFinish();
        },
    });

    const ReceiptContent = () => (
        <Box  ref={contentRef} sx={{ p: 4, backgroundColor: 'white' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Hotel Management System
                </Typography>
                <Typography variant="subtitle1">
                    Invoice #{billing.invoice_number}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Date: {dayjs().format('MMMM D, YYYY')}
                </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Guest Information:</Typography>
                <Typography>Name: {booking.guest.first_name} {booking.guest.last_name}</Typography>
                <Typography>Email: {booking.guest.email}</Typography>
                <Typography>Phone: {booking.guest.phone_number}</Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Booking Details:</Typography>
                <Typography>Room Number: {booking.room.room_number}</Typography>
                <Typography>Room Type: {booking.room.type}</Typography>
                <Typography>Check-in: {dayjs(booking.check_in).format('MMM D, YYYY HH:mm')}</Typography>
                <Typography>Check-out: {dayjs(booking.check_out).format('MMM D, YYYY HH:mm')}</Typography>
                <Typography>Number of Guests: {booking.number_of_guests}</Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Room Charges</TableCell>
                            <TableCell align="right">${Number(billing.room_charges).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell align="right">${Number(billing.tax_amount).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                   ${Number(billing.total_amount).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Payment Information:</Typography>
                <Typography>Status: {billing.payment_status}</Typography>
                <Typography>Method: {billing.payment_method}</Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Thank you for choosing our hotel!
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box>
            {/* Hidden receipt content for printing */}
            <Box sx={{ display: 'none' }}>
                <Box>
                    <ReceiptContent />
                </Box>
            </Box>

            {/* Visible receipt preview */}
            <Paper elevation={3}>
                <ReceiptContent />
            </Paper>

            {/* Action buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 ,mb:3 }}>
                <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                >
                    Print Receipt
                </Button>
                {onFinish && (
                    <Button onClick={onFinish}>
                        Close
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default BookingReceipt;