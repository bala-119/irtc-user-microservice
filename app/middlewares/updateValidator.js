const validateUpdateInput = (data) => {
  const errors = {};

  //  No fields sent
  if (Object.keys(data).length === 0) {
    return {
      isValid: false,
      errors: { general: "At least one field is required to update" }
    };
  }

  //  Full Name
  if ("fullName" in data) {
    if (!data.fullName || data.fullName.trim() === "") {
      errors.fullName = "Full name cannot be empty";
    } else {
      const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
      if (!nameRegex.test(data.fullName.trim())) {
        errors.fullName = "Invalid full name";
      }
    }
  }

  //  Email
  if ("email" in data) {
    if (!data.email || data.email.trim() === "") {
      errors.email = "Email cannot be empty";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Invalid email format";
      }
    }
  }

  //  Phone
  if ("phone" in data) {
    if (!data.phone || data.phone.trim() === "") {
      errors.phone = "Phone cannot be empty";
    } else {
      const phoneRegex = /^\+91[6-9]\d{9}$/;
      if (!phoneRegex.test(data.phone)) {
        errors.phone = "Invalid phone format";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = validateUpdateInput;