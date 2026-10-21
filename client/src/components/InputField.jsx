function InputField({ label, type, id, placeholder, onChange, required }) {
  return (
    <div className="userInfo">
      <label htmlFor={id}>{label}</label>
      <br />
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="userInput"
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default InputField;
