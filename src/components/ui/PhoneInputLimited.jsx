import 'react-phone-number-input/style.css';
import PhoneInputBase from 'react-phone-number-input';

export default function PhoneInputLimited({ value, onChange, ...props }) {
  // Only allow up to 13 digits (excluding non-digits)
  const handleChange = (val) => {
    if (!val) return onChange("");
    // Remove all non-digits
    const digits = val.replace(/\D/g, "");
    // Truncate to 13 digits
    const limitedDigits = digits.slice(0, 13);
    // Rebuild the value with the country code and limited digits
    let formatted = val;
    if (digits.length > 13) {
      // Try to preserve country code and formatting
      // Remove all digits, then insert limitedDigits
      formatted = val.replace(/\d/g, "");
      formatted = formatted.replace(/[^\d]/g, (m) => m); // keep non-digits
      for (let i = 0; i < limitedDigits.length; i++) {
        formatted += limitedDigits[i];
      }
    } else {
      formatted = val;
    }
    onChange(formatted);
  };
  // Prevent typing more than 13 digits
  const handleKeyDown = (e) => {
    if (value) {
      const digits = value.replace(/\D/g, "");
      if (digits.length >= 13 && /\d/.test(e.key) && window.getSelection().toString().length === 0) {
        e.preventDefault();
      }
    }
  };
  return (
    <PhoneInputBase
      {...props}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
