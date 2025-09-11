// src/components/PocPrjId.jsx
import React, { useState, useEffect } from 'react';
import Dropdown from './DropDown';
import TextInput from './TextInput';
import Button from './Button';
import './PocPrjId.css';

const PocPrjId = ({ onBack }) => {
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

    // Dropdown options (dummy data - replace with API calls)
    const [salesPersons, setSalesPersons] = useState([]);
    const [regions, setRegions] = useState([]);
    const [users, setUsers] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    // Error states
    const [errors, setErrors] = useState({});

    // Load dropdown data
    useEffect(() => {
        // Dummy data - replace with API calls
        setSalesPersons(['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']);
        setRegions(['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa']);
        setUsers(['admin', 'manager', 'developer', 'tester', 'analyst']);
        setTagOptions(['Urgent', 'High Priority', 'Low Priority', 'Internal', 'External', 'Critical']);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!pocId) newErrors.pocId = 'POC/Project ID is required';
        if (!pocName) newErrors.pocName = 'POC/Project Name is required';
        if (!entityType) newErrors.entityType = 'Entity Type is required';
        if (!entityName) newErrors.entityName = 'Entity Name is required';
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
            // Submit form data
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
                isBillable,
                pocType,
                spocEmail,
                spocDesignation,
                tags
            };

            console.log('Form submitted:', formData);
            // Here you would make API call to save the data
            alert('POC Code created successfully!');
        }
    };

    const handleTagSelect = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
            // Clear tag error when a tag is selected
            if (errors.tags) {
                setErrors({ ...errors, tags: null });
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="poc-prj-container">
            <div className="header-bar">
                <h2>POC Code Creation</h2>
                <button onClick={onBack} className="back-btn">Back to Dashboard</button>
            </div>

            <div className="poc-prj-content">
                <form onSubmit={handleSubmit} className="poc-prj-form">
                    <div className="form-section">
                        <h3>Add New POC ID</h3>

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
                                placeholder="Select Entity Type"
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
                            />

                            <Dropdown
                                label="Created By: "
                                options={users}
                                value={createdBy}
                                onChange={setCreatedBy}
                                error={errors.createdBy}
                                placeholder="Select Creator"
                                required
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
                                {errors.endDate && <span className="error-text">{errors.endDate}</span>}
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
                                options={['Technical', 'Commercial', 'Strategic', 'Trial']}
                                value={pocType}
                                onChange={setPocType}
                                error={errors.pocType}
                                placeholder="Select POC Type"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">

                                <div className={`tags-container ${errors.tags ? 'tags-error-border' : ''}`}> {/* Use a different class for border */}
                                    <Dropdown
                                        label="Tags"
                                        options={tagOptions}
                                        value=""
                                        onChange={handleTagSelect}
                                        placeholder="Select Tags"
                                        showLabel={false}
                                    // error={errors.tags} // Remove error prop from Dropdown itself if you handle it externally
                                    />
                                    <div className="selected-tags">
                                        {tags.map(tag => (
                                            <span key={tag} className="tag">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                    {/* REMOVED: {errors.tags && <span className="error-text">{errors.tags}</span>} */}
                                </div>
                                {/* MOVED: Place error text directly below the tags-container, but still within form-group */}
                                {errors.tags && <span className="error-text">{errors.tags}</span>}
                            </div>

                            {/* Empty div to maintain 2-column layout */}
                            <div></div>
                        </div>

                        <div className="form-actions">
                            <Button type="submit" label="Submit" />
                            <Button type="button" label="I'm done!" variant="secondary" onClick={onBack} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PocPrjId;