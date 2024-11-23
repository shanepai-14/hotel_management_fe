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
    Chip,
    Dialog,
    Grid,
    Card,
    CardContent,
    CardActions,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ViewList as ListIcon,
    ViewModule as GridIcon,
} from '@mui/icons-material';
import { roomService } from '../../services/roomService.js';
import RoomForm from './RoomForm.jsx';
import RoomSkeleton from '../../components/RoomSkeleton.jsx';
const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card');
    const [nextRoomNumber, setNextRoomNumber] = useState(null);

    const fetchRooms = async () => {
        try {
            const response = await roomService.getRooms();
            setRooms(response.data);
            generateNextRoomNumber(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const generateNextRoomNumber = async (rooms) => {
     
            // Extract room numbers and convert them to numbers
            const roomNumbers = rooms.map(room => parseInt(room.room_number));
            
            // Find the highest room number
            const maxRoomNumber = Math.max(0, ...roomNumbers);
            
            // Generate next room number with leading zeros (3 digits)
            const nextRoomNumber = String(maxRoomNumber + 1).padStart(3, '0');

            setNextRoomNumber(nextRoomNumber);

    };

    const handleAddRoom = () => {
        setSelectedRoom(null);
        setOpenDialog(true);
    };

    const handleEditRoom = (room) => {
        setSelectedRoom(room);
        setOpenDialog(true);
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await roomService.deleteRoom(id);
                fetchRooms();
            } catch (error) {
                console.error('Error deleting room:', error);
            }
        }
    };

    const handleSubmit = async (roomData) => {
        try {
            if (selectedRoom) {
                await roomService.updateRoom(selectedRoom.id, roomData);
            } else {
                await roomService.createRoom(roomData);
            }
            setOpenDialog(false);
            fetchRooms();
        } catch (error) {
            console.error('Error saving room:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'success';
            case 'occupied':
                return 'error';
            case 'maintenance':
                return 'warning';
            default:
                return 'default';
        }
    };

    const TableView = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Room Number</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Price/Night</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rooms.map((room) => (
                        <TableRow key={room.id}>
                            <TableCell>{room.room_number}</TableCell>
                            <TableCell>{room.type}</TableCell>
                            <TableCell>{room.capacity}</TableCell>
                            <TableCell>${room.price_per_night}</TableCell>
                            <TableCell>
                                <Chip
                                    label={room.status}
                                    color={getStatusColor(room.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell align="right">
                                <IconButton color="primary" onClick={() => handleEditRoom(room)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDeleteRoom(room.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const CardView = () => (
        <>
        {loading ? (
            <RoomSkeleton count={6} />
        ) : (
        <Grid container spacing={3}>
            {rooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Room {room.room_number}</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body1">
                                    Type: {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                                </Typography>
                                <Typography variant="body1">
                                    Capacity: {room.capacity} persons
                                </Typography>
                                <Typography variant="body1">
                                    Price: ${room.price_per_night}/night
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Chip
                                        label={room.status}
                                        color={getStatusColor(room.status)}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => handleEditRoom(room)}>
                                Edit
                            </Button>
                            <Button size="small" color="error" onClick={() => handleDeleteRoom(room.id)}>
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
        )}
       </>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Room Management</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, newView) => newView && setViewMode(newView)}
                        size="small"
                    >
                        <ToggleButton value="table">
                            <ListIcon />
                        </ToggleButton>
                        <ToggleButton value="card">
                            <GridIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddRoom}
                    >
                        Add Room
                    </Button>
                </Box>
            </Box>

            {viewMode === 'table' ? <TableView /> : <CardView />}

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <RoomForm
                    room={selectedRoom}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpenDialog(false)}
                    nextRoomNumber={nextRoomNumber}
                />
            </Dialog>
        </Box>
    );
};

export default RoomManagement;