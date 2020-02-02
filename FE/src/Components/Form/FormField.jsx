import React from 'react';

export default ({ label, input, type, required, meta }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input className="form-control" type={type} required={required} {...input} />
            {meta.error && meta.touched &&
                <div className="mt-2 text-danger">{meta.error}</div>
            }
        </div>
    )
}