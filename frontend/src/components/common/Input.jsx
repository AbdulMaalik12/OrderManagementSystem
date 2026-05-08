import { forwardRef } from 'react';

/**
 * Reusable Input component with label and error display.
 */
const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    placeholder,
    error,
    required = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-surface-700"
        >
          {label}
          {required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : 'border-surface-300 hover:border-surface-400'}
          placeholder:text-surface-400`}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger-500 mt-1">{error}</p>
      )}
    </div>
  );
});

export default Input;
