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
    Tooltip,
    Snackbar,
    Alert
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
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [pocToDelete, setPocToDelete] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

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
            showSnackbar('Failed to fetch POC data', 'error');
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
        poc.tags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.approvedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poc.status?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleDeleteClick = (poc) => {
        setPocToDelete(poc);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!pocToDelete) return;

        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:5050/poc/delete/${pocToDelete.pocId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Remove the deleted item from local state
            setPocData(prevData => prevData.filter(item => item.pocId !== pocToDelete.pocId));
            showSnackbar('POC record deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting POC:', error);
            showSnackbar('Failed to delete POC record', 'error');
        } finally {
            setDeleteConfirmOpen(false);
            setPocToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setPocToDelete(null);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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

    const formatNumber = (number) => {
        if (number === null || number === undefined) return '-';
        return number.toString();
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
                onClose={handleClose}
                aria-labelledby="poc-creation-modal"
                aria-describedby="poc-creation-form"
            >
                <Box sx={modalStyle}>
                    <PocPrjId
                        onClose={handleClose}
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
                            <DetailItem label="Client Type" value={selectedPoc.entityType} />
                            <DetailItem label="Company Name" value={selectedPoc.entityName} />
                            <DetailItem label="Sales Person" value={selectedPoc.salesPerson} />
                            <DetailItem label="Region" value={selectedPoc.region} />
                            <DetailItem label="Billable" value={selectedPoc.isBillable ? 'Yes' : 'No'} />
                            <DetailItem label="POC Type" value={selectedPoc.pocType} />
                            <DetailItem label="Assigned To" value={selectedPoc.assignedTo} />
                            <DetailItem label="Created By" value={selectedPoc.createdBy} />
                            <DetailItem label="Start Date" value={formatDate(selectedPoc.startDate)} />
                            <DetailItem label="End Date" value={formatDate(selectedPoc.endDate)} />
                            <DetailItem label="Actual Start Date" value={formatDate(selectedPoc.actualStartDate)} />
                            <DetailItem label="Actual End Date" value={formatDate(selectedPoc.actualEndDate)} />
                            <DetailItem label="Estimated Efforts" value={formatNumber(selectedPoc.estimatedEfforts)} />
                            <DetailItem label="Total Efforts" value={formatNumber(selectedPoc.totalEfforts)} />
                            <DetailItem label="Variance Days" value={formatNumber(selectedPoc.varianceDays)} />
                            <DetailItem label="Approved By" value={selectedPoc.approvedBy || '-'} />
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete POC <strong>{pocToDelete?.pocId}</strong> - {pocToDelete?.pocName}?
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

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
                            <Table stickyHeader sx={{ minWidth: 2400 }} aria-label="poc table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>POC ID</strong></TableCell>
                                        <TableCell><strong>Project Name</strong></TableCell>
                                        <TableCell><strong>Client Type</strong></TableCell>
                                        <TableCell><strong>Company Name</strong></TableCell>
                                        <TableCell><strong>Sales Person</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell><strong>Assigned To</strong></TableCell>
                                        <TableCell><strong>Created By</strong></TableCell>
                                        <TableCell><strong>Start Date</strong></TableCell>
                                        <TableCell><strong>End Date</strong></TableCell>
                                        <TableCell><strong>Actual Start Date</strong></TableCell>
                                        <TableCell><strong>Actual End Date</strong></TableCell>
                                        <TableCell><strong>Estimated Efforts</strong></TableCell>
                                        <TableCell><strong>Total Efforts</strong></TableCell>
                                        <TableCell><strong>Variance Days</strong></TableCell>
                                        <TableCell><strong>Approved By</strong></TableCell>
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
                                            <TableCell colSpan={25} align="center" sx={{ py: 3 }}>
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
                                                <TableCell>{formatDate(poc.actualStartDate)}</TableCell>
                                                <TableCell>{formatDate(poc.actualEndDate)}</TableCell>
                                                <TableCell>{formatNumber(poc.estimatedEfforts)}</TableCell>
                                                <TableCell>{formatNumber(poc.totalEfforts)}</TableCell>
                                                <TableCell>{formatNumber(poc.varianceDays)}</TableCell>
                                                <TableCell>{poc.approvedBy || '-'}</TableCell>
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
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        title="Delete"
                                                        onClick={() => handleDeleteClick(poc)}
                                                    >
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