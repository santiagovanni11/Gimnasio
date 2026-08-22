export default function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  minLength,
  disabled = false,
  maxLength,
  inputMode,
  pattern,
  title,
  name,
  autoFocus,
  children,
}) {
  if (type === "select") {
    return (
      <div className="input-group">
        <label>{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
        >
          {children}
        </select>
      </div>
    );
  }

  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
        inputMode={inputMode}
        pattern={pattern}
        title={title}
        autoFocus={autoFocus}
      />
    </div>
  );
}
