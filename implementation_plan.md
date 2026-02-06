# Auto-Generate User Password

## Goal
Enhance the user creation process for admins by removing the manual password entry. Instead, the system will automatically generate a secure password and email it to the new user.

## Proposed Changes

### Backend
#### [MODIFY] [manageUser.js](file:///c:/Users/User/Documents/SDP/Church-Donation-/Backend/controllers/admin/manageUser.js)
- Import `crypto` (native) and `sendEmail`.
- In `handleAddNewUsers`:
    - Remove the hard dependency on `req.body.password`.
    - If `password` is NOT provided:
        - Generate a random 10-character string (e.g., `crypto.randomBytes(6).toString('hex')`).
    - Use this generated password for hashing.
    - After successful creation, use `sendEmail` to send the credentials to the user.
    - Log success/failure of email sending (make it non-blocking for the HTTP response if possible, or handle gracefully).

### Frontend
#### [MODIFY] [AdminUsers.jsx](file:///c:/Users/User/Documents/SDP/Church-Donation-/frontend/src/components/Admin/AdminUsers.jsx)
- **Add Single User Form**:
    - Remove the "Password" input field.
    - Display a note: "A secure password will be generated and emailed to the user."
    - Update input handlers to ignore password field.
    - Update initial state to remove `password`.

## Verification Plan
1.  **Frontend**: Open "Add Single User" modal. Confirm "Password" field is gone and helper text is present.
2.  **Backend**: Submit the form.
3.  **Validation**:
    -   Check database (via getting user list) to see if user is created.
    -   Check server console logs for "Email sent" confirmation (since we are likely in dev mode or using a real transporter).

Note: The `sendEmail` utility uses `nodemailer` with Gmail service. We assume the environment variables are set correctly as per `passwordReset.js` usage.
