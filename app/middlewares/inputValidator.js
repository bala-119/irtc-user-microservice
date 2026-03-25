const validateInput = ({ fullName, email, phone,password }) => {
  const errors = {};

  //  Name validation (only letters & spaces, min 2 chars)
  const nameRegex = /^[A-Za-z.]+(?:\s[A-Za-z.]+)*$/;
  if (!fullName || !nameRegex.test(fullName.trim())) {
    errors.name = "Name must contain only letters and at least 2 characters";
  }

  //  Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  // Phone validation (+91 followed by exactly 10 digits)
  const phoneRegex = /^\+91\d{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.phone = "Phone must be in format +91XXXXXXXXXX";
  }
   const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password && !passwordRegex.test(password)) {
    errors.password =
      "Password must be 8+ chars with uppercase, lowercase, number, and special character";
  }


  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


const passwordValidator = (password) => {
  const errors = {};

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!password || password.trim() === "") {
    errors.password = "Password is required";
  } else if (!passwordRegex.test(password)) {
    errors.password =
      "Password must be 8+ chars with uppercase, lowercase, number, and special character";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const phoneValidator = (phone) => {
  const errors = {};

  //  Indian phone validation (+91 + 10 digits starting 6-9)
  const phoneRegex = /^\+91[6-9]\d{9}$/;

  if (!phone || phone.trim() === "") {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(phone)) {
    errors.phone = "Phone must be in format +91XXXXXXXXXX";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
const emailValidator = (email) => {
  const errors = {};

  //  Indian phone validation (+91 + 10 digits starting 6-9)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  

  if (!email || email.trim() === "") {
    errors.email = "email is required";
  } else if (!email || !emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


module.exports = {
  validateInput,
  passwordValidator,phoneValidator,emailValidator
};