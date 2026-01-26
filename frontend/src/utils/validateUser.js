export const validateUserForm = (formInput, context = "user") => {
  const inputError = {};

  // Full Name
  if (!formInput.fullName?.trim()) {
    inputError.fullName = "Full name is required";
  } else if (formInput.fullName.trim().length < 3) {
    inputError.fullName = "Full name must be at least 3 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(formInput.fullName)) {
    inputError.fullName = "Full name should contain only letters";
  }

  // Email
  if (!formInput.email?.trim()) {
    inputError.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formInput.email)) {
    inputError.email = "Please enter a valid email address";
  }

  // Phone Number
  if (!formInput.phoneNo?.trim()) {
    inputError.phoneNo = "Phone number is required";
  } else if (!/^\d{10}$/.test(formInput.phoneNo)) {
    inputError.phoneNo = "Phone number must be exactly 10 digits";
  }

  // Password (only required for user registration)
  if (context === "user") {
    if (!formInput.password) {
      inputError.password = "Password is required";
    } else if (formInput.password.length < 8) {
      inputError.password = "Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(
        formInput.password
      )
    ) {
      inputError.password =
        "Password must contain uppercase, lowercase, number & special character";
    }

    // Confirm Password
    if (!formInput.confirmPassword) {
      inputError.confirmPassword = "Confirm password is required";
    } else if (formInput.password !== formInput.confirmPassword) {
      inputError.confirmPassword = "Passwords do not match";
    }
  }

  // Gender
  if (!formInput.gender) {
    inputError.gender = "Please select gender";
  }

  // Date of Birth
  if (!formInput.dob) {
    inputError.dob = "Date of birth is required";
  } else {
    const dob = new Date(formInput.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      inputError.dob = "You must be at least 18 years old";
    }
  }

  return inputError;
};
