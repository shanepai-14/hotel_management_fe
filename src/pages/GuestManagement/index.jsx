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
    TextField,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { guestService } from '../../services/guestService';
import GuestForm from './GuestForm';

const GuestManagement = () => {
    const [guests, setGuests] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const response = await guestService.getGuests();
            setGuests(response.data);
        } catch (error) {
            console.error('Error fetching guests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGuest = () => {
        setSelectedGuest(null);
        setOpenDialog(true);
    };

    const handleEditGuest = (guest) => {
        setSelectedGuest(guest);
        setOpenDialog(true);
    };

    const handleDeleteGuest = async (id) => {
        if (window.confirm('Are you sure you want to delete this guest?')) {
            try {
                await guestService.deleteGuest(id);
                fetchGuests();
            } catch (error) {
                console.error('Error deleting guest:', error);
            }
        }
    };

    const handleSubmit = async (guestData) => {
        try {
            if (selectedGuest) {
                await guestService.updateGuest(selectedGuest.id, guestData);
            } else {
                await guestService.createGuest(guestData);
            }
            setOpenDialog(false);
            fetchGuests();
        } catch (error) {
            console.error('Error saving guest:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Guest Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddGuest}
                >
                    Add Guest
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guests.map((guest) => (
                            <TableRow key={guest.id}>
                                <TableCell>{`${guest.first_name} ${guest.last_name}`}</TableCell>
                                <TableCell>{guest.email}</TableCell>
                                <TableCell>{guest.phone_number}</TableCell>
                                <TableCell>{guest.country}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEditGuest(guest)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteGuest(guest.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <GuestForm
                    guest={selectedGuest}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpenDialog(false)}
                />
            </Dialog>
        </Box>
    );
};

export default GuestManagement;