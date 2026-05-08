/**
 * Reusable Select dropdown component.
 */
export default function Select({
  label,
  name,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  error,
  required = false,
  className = '',
  ...props
}) {
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-danger-500' : 'border-surface-300 hover:border-surface-400'}
          cursor-pointer`}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
}
