import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, name, type = 'text', placeholder, error, required = false, className = '', ...props },
  ref
) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-dark-200 uppercase tracking-widest">
          {label}{required && <span className="text-primary-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`input-neon w-full px-4 py-3 rounded-xl text-sm ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-danger-400 mt-1 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-danger-400 inline-block" />
        {error}
      </p>}
    </div>
  );
});

export default Input;
