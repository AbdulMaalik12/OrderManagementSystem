export default function Select({
  label, name, options = [], value, onChange,
  placeholder = 'Select...', error, required = false, className = '', ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-dark-200 uppercase tracking-widest">
          {label}{required && <span className="text-primary-400 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={name} name={name} value={value} onChange={onChange}
        className={`input-neon w-full px-4 py-3 rounded-xl text-sm cursor-pointer ${error ? 'error' : ''}`}
        style={{ appearance: 'none' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}
            style={{ background: '#0d1117', color: '#e2e8f0' }}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
    </div>
  );
}
