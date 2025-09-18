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
    const [idPrefix, setIdPrefix] = useState('');
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
    const [idLoading, setIdLoading] = useState(false);

    // Dropdown options
    const [salesPersons, setSalesPersons] = useState([]);
    const [regions, setRegions] = useState([]);
    const [users, setUsers] = useState([]);
    const [createdByOptions, setCreatedByOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    // Error states
    const [errors, setErrors] = useState({});

    // ID prefix options
    const idPrefixOptions = [
        'POC',
        'POP',
        'PartnerSupport',
        'FeasibilityCheck',
        'OperationalSupport',
        'R&D',
        'SolutionConsultation',
        'EffortsEstimation',
        'Task',
        'Demo',
        'Internal',
        'Event',
        'Workshop'
    ];

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

    // Function to fetch next available ID for the selected prefix
    const fetchNextId = async (prefix) => {
        if (!prefix) {
            setPocId('');
            return;
        }

        try {
            setIdLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `http://localhost:5050/poc/next-id/${prefix}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            setPocId(response.data.nextId);
        } catch (error) {
            console.error('Error fetching next ID:', error);
            // Fallback: show prefix without number if API fails
            setPocId(`${prefix}-01`);
        } finally {
            setIdLoading(false);
        }
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

    // Fetch next ID when prefix changes
    // Remove or modify this useEffect
    useEffect(() => {
        if (idPrefix) {
            // Just show the prefix in the UI, backend will generate the full ID
            setPocId(`${idPrefix}-XX`); // Show placeholder
        } else {
            setPocId('');
        }
    }, [idPrefix]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation - remove pocId validation since we're generating it on backend
        const newErrors = {};
        if (!idPrefix) newErrors.idPrefix = 'ID Prefix is required';
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
                // Prepare form data - send only the prefix, not the generated ID
                const formData = {
                    pocId: idPrefix, // Send only the prefix now
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

                const token = localStorage.getItem('authToken');

                const response = await axios.post('http://localhost:5050/poc/savepocprjid', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    alert('POC Code created successfully!');
                    // Update the local pocId with the generated ID from backend
                    setPocId(response.data.data.pocId);
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
        setIdPrefix('');
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
                            <Dropdown
                                label="ID Prefix: "
                                options={idPrefixOptions}
                                value={idPrefix}
                                onChange={setIdPrefix}
                                error={errors.idPrefix}
                                placeholder="Select ID Prefix"
                                required
                            />

                            <div className="form-group">
                                <label>POC, Project ID: <span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    value={pocId || `${idPrefix ? idPrefix + '-XX' : ''}`}
                                    readOnly
                                    className={errors.pocId ? 'error' : ''}
                                    placeholder="ID will be auto-generated after submission"
                                />
                                <div className="help-text">ID will be auto-generated when you submit</div>
                            </div>
                        </div>

                        <div className="form-row">
                            <TextInput
                                label="POC, Project Name: "
                                value={pocName}
                                onChange={setPocName}
                                error={errors.pocName}
                                placeholder="Enter POC/Project Name"
                                required
                            />

                            <Dropdown
                                label="Partner, Client, Internal: "
                                options={['Partner', 'Client', 'Internal']}
                                value={entityType}
                                onChange={setEntityType}
                                error={errors.entityType}
                                placeholder="Select Client Type"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <TextInput
                                label="Name of Partner, Client, Internal: "
                                value={entityName}
                                onChange={setEntityName}
                                error={errors.entityName}
                                placeholder="Enter Name"
                                required
                            />

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
                        </div>

                        <div className="form-row">
                            <TextInput
                                label="Description:"
                                value={description}
                                onChange={setDescription}
                                placeholder="Enter Description"
                                multiline
                                rows={3}
                            />

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
                        </div>

                        <div className="form-row">
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
                        </div>

                        <div className="form-row">
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

                            <TextInput
                                label="Remark:"
                                value={remark}
                                onChange={setRemark}
                                placeholder="Enter Remarks"
                                multiline
                                rows={2}
                            />
                        </div>

                        <div className="form-row">
                            <Dropdown
                                label="Region: "
                                options={regions}
                                value={region}
                                onChange={setRegion}
                                error={errors.region}
                                placeholder="Select Region"
                                required
                            />

                            <Dropdown
                                label="Is Billable: "
                                options={['Yes', 'No']}
                                value={isBillable}
                                onChange={setIsBillable}
                                error={errors.isBillable}
                                placeholder="Select Billable Status"
                                required
                            />
                        </div>

                        <div className="form-row">
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

                            <TextInput
                                label="SPOC Email Address:"
                                value={spocEmail}
                                onChange={setSpocEmail}
                                placeholder="Enter SPOC Email"
                                type="email"
                            />
                        </div>

                        <div className="form-row">
                            <TextInput
                                label="SPOC Designation:"
                                value={spocDesignation}
                                onChange={setSpocDesignation}
                                placeholder="Enter SPOC Designation"
                            />

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
                        </div>

                        <div className="form-actions">
                            <Button
                                type="submit"
                                label={loading ? "Saving..." : "Submit"}
                                disabled={loading || apiLoading || idLoading}
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