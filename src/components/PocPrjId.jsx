// src/components/PocPrjId.jsx
import React, { useState, useEffect } from 'react';
import Dropdown from './DropDown';
import TextInput from './TextInput';
import Button from './Button';
import './PocPrjId.css';
import companyLogo from '../components/Images/companyLogo.png';
import axios from 'axios';
import { IconButton, Box, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PocPrjId = ({ onClose, onSuccess }) => {
    // Form states
    const [pocId, setPocId] = useState('');
    const [pocName, setPocName] = useState('');
    const [entityType, setEntityType] = useState('');
    const [entityName, setEntityName] = useState('');
    const [salesPerson, setSalesPerson] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [remark, setRemark] = useState('');
    const [region, setRegion] = useState('');
    const [isBillable, setIsBillable] = useState('');
    const [pocType, setPocType] = useState('');
    const [spocEmail, setSpocEmail] = useState('');
    const [spocDesignation, setSpocDesignation] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiLoading, setApiLoading] = useState(true);

    // Dropdown options
    const [salesPersons, setSalesPersons] = useState([]);
    const [regions, setRegions] = useState([]);
    const [users, setUsers] = useState([]);
    const [createdByOptions, setCreatedByOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    // Error states
    const [errors, setErrors] = useState({});

    // Function to get username from localStorage
    const getUsername = () => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.username || user.email || '';
            } catch (e) {
                console.error('Error parsing user data:', e);
                return '';
            }
        }
        return '';
    };

    // Function to extract name from object with various possible properties
    const extractName = (item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
            return item.fullName || item.name || item.username || item.email || 
                   `${item.firstName || ''} ${item.lastName || ''}`.trim() ||
                   Object.values(item).find(val => typeof val === 'string') || '';
        }
        return String(item);
    };

    // Function to process API response data into dropdown options
    const processApiData = (data) => {
        if (!data) return [];
        
        let processedData = [];
        
        // Handle different response formats
        if (Array.isArray(data)) {
            processedData = data.map(item => extractName(item)).filter(name => name);
        } else if (typeof data === 'object') {
            // Check for common response structures
            if (data.data && Array.isArray(data.data)) {
                processedData = data.data.map(item => extractName(item)).filter(name => name);
            } else if (data.users && Array.isArray(data.users)) {
                processedData = data.users.map(item => extractName(item)).filter(name => name);
            } else if (data.assignTo && Array.isArray(data.assignTo)) {
                processedData = data.assignTo.map(item => extractName(item)).filter(name => name);
            } else {
                // Try to extract array from object values
                const values = Object.values(data);
                if (values.length > 0 && Array.isArray(values[0])) {
                    processedData = values[0].map(item => extractName(item)).filter(name => name);
                } else {
                    // Try to extract all string values from the object
                    const stringValues = Object.values(data).filter(
                        value => typeof value === 'string' && value.trim() !== ''
                    );
                    processedData = stringValues;
                }
            }
        } else if (typeof data === 'string') {
            processedData = [data];
        }
        
        return processedData;
    };

    // Load dropdown data from APIs
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                setApiLoading(true);
                const token = localStorage.getItem('authToken');
                const username = getUsername();

                // Fetch sales persons from API
                try {
                    const salesResponse = await axios.get('http://localhost:5050/poc/getAllSalesPerson', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    console.log('Sales Persons API Response:', salesResponse.data);
                    const salesData = processApiData(salesResponse.data);
                    console.log('Processed Sales Persons:', salesData);
                    setSalesPersons(salesData.length > 0 ? salesData : ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']);
                } catch (salesError) {
                    console.error('Error fetching sales persons:', salesError);
                    setSalesPersons(['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']);
                }

                // Fetch Assigned To options from API
                try {
                    const assignToResponse = await axios.get('http://localhost:5050/poc/getAllAssignTo', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    console.log('Assigned To API Response:', assignToResponse.data);
                    const assignToData = processApiData(assignToResponse.data);
                    console.log('Processed Assigned To Data:', assignToData);
                    setUsers(assignToData.length > 0 ? assignToData : ['admin', 'manager', 'developer', 'tester', 'analyst']);
                } catch (assignToError) {
                    console.error('Error fetching assigned to options:', assignToError);
                    setUsers(['admin', 'manager', 'developer', 'tester', 'analyst']);
                }

                // Fetch Created By options from API with username parameter
                if (username) {
                    try {
                        const createdByResponse = await axios.get(`http://localhost:5050/poc/getCreatedBy?username=${encodeURIComponent(username)}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        console.log('Created By API Response:', createdByResponse.data);
                        const createdByData = processApiData(createdByResponse.data);
                        console.log('Processed Created By Data:', createdByData);
                        setCreatedByOptions(createdByData.length > 0 ? createdByData : [username]);
                    } catch (createdByError) {
                        console.error('Error fetching created by options:', createdByError);
                        setCreatedByOptions([username]);
                    }
                } else {
                    console.warn('Username not found. Using default options.');
                    setCreatedByOptions(['admin', 'manager', 'user']);
                }

                // Load other dropdown data
                setRegions(['ROW', 'ISSARC', 'America', 'Other']);
                setTagOptions(['GenAI', 'Agentic AI', 'SAP', 'RPA', 'Chatbot', 'DodEdge', 'Mainframe', 'Other']);

            } catch (error) {
                console.error('Error fetching dropdown data:', error);
                // Fallback to dummy data if API fails
                setSalesPersons(['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']);
                setRegions(['ROW', 'ISSARC', 'America', 'Other']);
                setUsers(['admin', 'manager', 'developer', 'tester', 'analyst']);
                setCreatedByOptions(['admin', 'manager', 'user']);
                setTagOptions(['GenAI', 'Agentic AI', 'SAP', 'RPA', 'Chatbot', 'DodEdge', 'Mainframe', 'Other']);
            } finally {
                setApiLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!pocId) newErrors.pocId = 'POC/Project ID is required';
        if (!pocName) newErrors.pocName = 'POC/Project Name is required';
        if (!entityType) newErrors.entityType = 'Client Type is required';
        if (!entityName) newErrors.entityName = 'Company Name is required';
        if (!salesPerson) newErrors.salesPerson = 'Sales Person is required';
        if (!assignedTo) newErrors.assignedTo = 'Assigned To is required';
        if (!createdBy) newErrors.createdBy = 'Created By is required';
        if (!startDate) newErrors.startDate = 'Start Date is required';
        if (!endDate) newErrors.endDate = 'End Date is required';
        if (!region) newErrors.region = 'Region is required';
        if (!isBillable) newErrors.isBillable = 'Billable status is required';
        if (!pocType) newErrors.pocType = 'POC Type is required';
        if (tags.length === 0) newErrors.tags = 'At least one tag is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);

            try {
                // Prepare form data for database
                const formData = {
                    pocId,
                    pocName,
                    entityType,
                    entityName,
                    salesPerson,
                    description,
                    assignedTo,
                    createdBy,
                    startDate,
                    endDate,
                    remark,
                    region,
                    isBillable: isBillable === 'Yes',
                    pocType,
                    spocEmail,
                    spocDesignation,
                    tags: tags.join(',')
                };

                // Get authentication token
                const token = localStorage.getItem('authToken');

                // Make API call to save the data
                const response = await axios.post('http://localhost:5050/poc/savepocprjid', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    alert('POC Code created successfully!');
                    resetForm();
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    alert('Failed to create POC Code: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error saving POC Code:', error);
                if (error.response?.status === 401) {
                    alert('Session expired. Please login again.');
                } else {
                    alert('Error saving POC Code. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setPocId('');
        setPocName('');
        setEntityType('');
        setEntityName('');
        setSalesPerson('');
        setDescription('');
        setAssignedTo('');
        setCreatedBy('');
        setStartDate('');
        setEndDate('');
        setRemark('');
        setRegion('');
        setIsBillable('');
        setPocType('');
        setSpocEmail('');
        setSpocDesignation('');
        setTags([]);
        setErrors({});
    };

    const handleTagSelect = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
            if (errors.tags) {
                setErrors({ ...errors, tags: null });
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header with close button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                        src={companyLogo}
                        alt="Company Logo"
                        style={{ height: '40px' }}
                    />
                    <Typography variant="h5" component="h2">
                        POC Code Creation
                    </Typography>
                </Box>
                <IconButton onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Form content */}
            <Paper sx={{ p: 3, flex: 1, overflow: 'auto' }}>
                <form onSubmit={handleSubmit} className="poc-prj-form">
                    <div className="form-section">
                        <h3>Add New POC ID</h3>

                        {apiLoading && (
                            <div style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
                                Loading data...
                            </div>
                        )}

                        <div className="form-row">
                            <TextInput
                                label="POC, Project ID: "
                                value={pocId}
                                onChange={setPocId}
                                error={errors.pocId}
                                placeholder="Enter POC/Project ID"
                                required
                            />

                            <TextInput
                                label="POC, Project Name: "
                                value={pocName}
                                onChange={setPocName}
                                error={errors.pocName}
                                placeholder="Enter POC/Project Name"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Dropdown
                                label="Partner, Client, Internal: "
                                options={['Partner', 'Client', 'Internal']}
                                value={entityType}
                                onChange={setEntityType}
                                error={errors.entityType}
                                placeholder="Select Client Type"
                                required
                            />

                            <TextInput
                                label="Name of Partner, Client, Internal: "
                                value={entityName}
                                onChange={setEntityName}
                                error={errors.entityName}
                                placeholder="Enter Name"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Dropdown
                                label="Sales Person: "
                                options={salesPersons}
                                value={salesPerson}
                                onChange={setSalesPerson}
                                error={errors.salesPerson}
                                placeholder="Choose Sales Person"
                                required
                                loading={apiLoading}
                            />

                            <TextInput
                                label="Description:"
                                value={description}
                                onChange={setDescription}
                                placeholder="Enter Description"
                                multiline
                                rows={3}
                            />
                        </div>

                        <div className="form-row">
                            <Dropdown
                                label="Assigned To: "
                                options={users}
                                value={assignedTo}
                                onChange={setAssignedTo}
                                error={errors.assignedTo}
                                placeholder="Select Assignee"
                                required
                                loading={apiLoading}
                            />

                            <Dropdown
                                label="Created By: "
                                options={createdByOptions}
                                value={createdBy}
                                onChange={setCreatedBy}
                                error={errors.createdBy}
                                placeholder="Select Creator"
                                required
                                loading={apiLoading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date: <span className="required-asterisk">*</span></label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={errors.startDate ? 'error' : ''}
                                />
                                {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                            </div>

                            <div className="form-group">
                                <label>End Date: <span className="required-asterisk">*</span></label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={errors.endDate ? 'error' : ''}
                                />
                                {errors.endDate && <span className='error-text'>{errors.endDate}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <TextInput
                                label="Remark:"
                                value={remark}
                                onChange={setRemark}
                                placeholder="Enter Remarks"
                                multiline
                                rows={2}
                            />

                            <Dropdown
                                label="Region: "
                                options={regions}
                                value={region}
                                onChange={setRegion}
                                error={errors.region}
                                placeholder="Select Region"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Dropdown
                                label="Is Billable: "
                                options={['Yes', 'No']}
                                value={isBillable}
                                onChange={setIsBillable}
                                error={errors.isBillable}
                                placeholder="Select Billable Status"
                                required
                            />

                            <Dropdown
                                label="POC Type: "
                                options={[
                                    'POC',
                                    'POP',
                                    'Partner Support',
                                    'Feasibility Check',
                                    'Operational Support',
                                    'R&D',
                                    'Solution Consultation',
                                    'Efforts Estimation',
                                    'Task',
                                    'Demo',
                                    'Internal',
                                    'Event',
                                    'Workshop'
                                ]}
                                value={pocType}
                                onChange={setPocType}
                                error={errors.pocType}
                                placeholder="Select POC Type"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <TextInput
                                label="SPOC Email Address:"
                                value={spocEmail}
                                onChange={setSpocEmail}
                                placeholder="Enter SPOC Email"
                                type="email"
                            />

                            <TextInput
                                label="SPOC Designation:"
                                value={spocDesignation}
                                onChange={setSpocDesignation}
                                placeholder="Enter SPOC Designation"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tags <span className="required-asterisk">*</span></label>
                                <div className={`tags-container ${errors.tags ? 'tags-error-border' : ''}`}>
                                    <Dropdown
                                        options={tagOptions}
                                        value=""
                                        onChange={handleTagSelect}
                                        placeholder="Select Tags"
                                        showLabel={false}
                                    />
                                    <div className="selected-tags">
                                        {tags.map(tag => (
                                            <span key={tag} className="tag">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {errors.tags && <span className="error-text">{errors.tags}</span>}
                            </div>

                            <div></div>
                        </div>

                        <div className="form-actions">
                            <Button
                                type="submit"
                                label={loading ? "Saving..." : "Submit"}
                                disabled={loading || apiLoading}
                            />
                            <Button
                                type="button"
                                label="Cancel"
                                variant="secondary"
                                onClick={onClose}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </form>
            </Paper>
        </Box>
    );
};

export default PocPrjId;