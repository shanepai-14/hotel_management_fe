import { 
    Grid, 
    Card, 
    CardContent, 
    Box,
    Skeleton
} from '@mui/material';

const RoomSkeleton = ({ count = 6 }) => {
    return (
        <Grid container spacing={2}>
            {[...Array(count)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Skeleton variant="text" width={100} height={32} /> {/* Room number */}
                                <Skeleton variant="rounded" width={80} height={24} /> {/* Status chip */}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Skeleton variant="circular" width={24} height={24} /> {/* Icon */}
                                    <Skeleton variant="text" width={120} /> {/* Room type */}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Skeleton variant="circular" width={24} height={24} /> {/* Icon */}
                                    <Skeleton variant="text" width={140} /> {/* Capacity */}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Skeleton variant="circular" width={24} height={24} /> {/* Icon */}
                                    <Skeleton variant="text" width={100} /> {/* Price */}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default RoomSkeleton;