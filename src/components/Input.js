import React from 'react';

const Input = props => {

    const {
        className,
        title,
        type,
        value,
        onChange,
        suffix,
        placeholder,
        optional,
        disabled
    } = props;

    return (
        <div className={`input-default ${className ? className : ""}`}>
            {title && <span className="label">{title} {optional ? <span className="time">(optional)</span> : ""} </span>}
            <input disabled={disabled ? true : false}  type={type} value={value} onChange={onChange} spellCheck={false} placeholder={placeholder}/>
            {suffix && <span className="suffix">{suffix}</span>}
        </div>
    );
};

export default Input;