// src/components/PocTable.jsx
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Modal from '@mui/material/Modal';
import PocPrjId from './PocPrjId';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    TablePagination,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography as MuiTypography,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const PocTable = ({ onNavigate, onLogout, user }) => {
    const [open, setOpen] = React.useState(false);
    const [pocData, setPocData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedPoc, setSelectedPoc] = React.useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Fetch POC data
    const fetchPocData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5050/poc/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPocData(response.data);
        } catch (error) {
            console.error('Error fetching POC data:', error);
            alert('Failed to fetch POC data');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPocData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter data based on search term
    const filteredData = pocData.filter(poc =>
        poc.pocId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.pocName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.salesPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.entityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleViewDetails = (poc) => {
        setSelectedPoc(poc);
        setDetailDialogOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailDialogOpen(false);
        setSelectedPoc(null);
    };

    // Style for the modal
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 0,
        overflow: 'auto',
        borderRadius: '8px'
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'in progress': return 'warning';
            case 'pending': return 'default';
            case 'draft': return 'secondary';
            default: return 'default';
        }
    };

    const getBillableChip = (isBillable) => {
        return (
            <Chip
                label={isBillable ? 'Billable' : 'Non-Billable'}
                color={isBillable ? 'success' : 'default'}
                size="small"
            />
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return '-';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => onNavigate('dashboard')}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        POC Code Management
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Welcome, {user?.username}
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={handleOpen}
                        sx={{ mr: 1 }}
                    >
                        Create POC
                    </Button>

                    <Button color="inherit" onClick={onLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            {/* Modal for PocPrjId */}
      
            <Modal
                open={open}
                onClose={handleClose}  // Add this line to handle backdrop clicks
                aria-labelledby="poc-creation-modal"
                aria-describedby="poc-creation-form"
            >
                <Box sx={modalStyle}>
                    <PocPrjId
                        onClose={handleClose}  // Pass the close function
                        onSuccess={() => {
                            handleClose();
                            fetchPocData();
                        }}
                    />
                </Box>
            </Modal>

            {/* Detail Dialog */}
            <Dialog open={detailDialogOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
                <DialogTitle>POC Details - {selectedPoc?.pocId}</DialogTitle>
                <DialogContent dividers>
                    {selectedPoc && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <DetailItem label="POC ID" value={selectedPoc.pocId} />
                            <DetailItem label="POC Name" value={selectedPoc.pocName} />
                            <DetailItem label="Entity Type" value={selectedPoc.entityType} />
                            <DetailItem label="Entity Name" value={selectedPoc.entityName} />
                            <DetailItem label="Sales Person" value={selectedPoc.salesPerson} />
                            <DetailItem label="Region" value={selectedPoc.region} />
                            <DetailItem label="Billable" value={selectedPoc.isBillable ? 'Yes' : 'No'} />
                            <DetailItem label="POC Type" value={selectedPoc.pocType} />
                            <DetailItem label="Assigned To" value={selectedPoc.assignedTo} />
                            <DetailItem label="Created By" value={selectedPoc.createdBy} />
                            <DetailItem label="Start Date" value={formatDate(selectedPoc.startDate)} />
                            <DetailItem label="End Date" value={formatDate(selectedPoc.endDate)} />
                            <DetailItem label="SPOC Email" value={selectedPoc.spocEmail || '-'} />
                            <DetailItem label="SPOC Designation" value={selectedPoc.spocDesignation || '-'} />
                            <DetailItem label="Tags" value={selectedPoc.tags || '-'} />
                            <DetailItem label="Description" value={selectedPoc.description || '-'} />
                            <DetailItem label="Remark" value={selectedPoc.remark || '-'} />
                            <DetailItem label="Status" value={selectedPoc.status || 'Draft'} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Main content */}
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        POC Code List ({pocData.length})
                    </Typography>

                    <TextField
                        placeholder="Search POC codes..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                </Box>

                {loading ? (
                    <Typography>Loading POC data...</Typography>
                ) : (
                    <>
                        <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)', overflowX: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 1800 }} aria-label="poc table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>POC ID</strong></TableCell>
                                        <TableCell><strong>Project Name</strong></TableCell>
                                        <TableCell><strong>Entity Type</strong></TableCell>
                                        <TableCell><strong>Entity Name</strong></TableCell>
                                        <TableCell><strong>Sales Person</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell><strong>Assigned To</strong></TableCell>
                                        <TableCell><strong>Created By</strong></TableCell>
                                        <TableCell><strong>Start Date</strong></TableCell>
                                        <TableCell><strong>End Date</strong></TableCell>
                                        <TableCell><strong>Remark</strong></TableCell>
                                        <TableCell><strong>Region</strong></TableCell>
                                        <TableCell><strong>Billable</strong></TableCell>
                                        <TableCell><strong>POC Type</strong></TableCell>
                                        <TableCell><strong>SPOC Email</strong></TableCell>
                                        <TableCell><strong>SPOC Designation</strong></TableCell>
                                        <TableCell><strong>Tags</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Actions</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={19} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    {searchTerm ? 'No matching POC codes found' : 'No POC codes available. Click "Create POC" to get started.'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.map((poc) => (
                                            <TableRow key={poc.pocId} hover>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{poc.pocId}</TableCell>
                                                <TableCell>{poc.pocName}</TableCell>
                                                <TableCell>{poc.entityType}</TableCell>
                                                <TableCell>{poc.entityName}</TableCell>
                                                <TableCell>{poc.salesPerson}</TableCell>
                                                <TableCell>
                                                    <Tooltip title={poc.description || '-'}>
                                                        <span>{truncateText(poc.description, 20)}</span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>{poc.assignedTo}</TableCell>
                                                <TableCell>{poc.createdBy}</TableCell>
                                                <TableCell>{formatDate(poc.startDate)}</TableCell>
                                                <TableCell>{formatDate(poc.endDate)}</TableCell>
                                                <TableCell>
                                                    <Tooltip title={poc.remark || '-'}>
                                                        <span>{truncateText(poc.remark, 15)}</span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>{poc.region}</TableCell>
                                                <TableCell>{getBillableChip(poc.isBillable)}</TableCell>
                                                <TableCell>{poc.pocType}</TableCell>
                                                <TableCell>{poc.spocEmail || '-'}</TableCell>
                                                <TableCell>
                                                    <Tooltip title={poc.spocDesignation || '-'}>
                                                        <span>{truncateText(poc.spocDesignation, 15)}</span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title={poc.tags || '-'}>
                                                        <span>{truncateText(poc.tags, 15)}</span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={poc.status || 'Draft'}
                                                        color={getStatusColor(poc.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewDetails(poc)}
                                                        color="primary"
                                                        title="View Details"
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="secondary" title="Edit">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" title="Delete">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ mt: 2 }}
                        />
                    </>
                )}
            </Box>
        </Box>
    );
};

// Helper component for detail view
const DetailItem = ({ label, value }) => (
    <Box sx={{ mb: 1 }}>
        <MuiTypography variant="subtitle2" color="textSecondary" gutterBottom>
            {label}:
        </MuiTypography>
        <MuiTypography variant="body1">
            {value || '-'}
        </MuiTypography>
    </Box>
);

export default PocTable;