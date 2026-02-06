# Auto-Generated User Passwords

I have successfully implemented the auto-generated password feature for the "Add Single User" form in the Admin panel.

## Changes Implemented

### Backend (`Backend/controllers/admin/manageUser.js`)
-   Updated `handleAddNewUsers` to check if a password is provided.
-   If no password is provided, a secure 8-character random password is generated.
-   The generated password is hashed and stored in the database.
-   The **plain text password** is emailed to the user's provided email address using the existing `sendEmail` utility.

### Frontend (`frontend/src/components/Admin/AdminUsers.jsx`)
-   Removed the **Password** input field from the "Add Single User" modal.
-   Added a blue informational box informing the admin that the password will be auto-generated and emailed.
-   Updated the form state and submission logic to exclude the manual password field.

## Verification
1.  **Add User**: Open the "Add User" -> "Single User" form.
2.  **View**: Confirm the password field is gone and the notice is visible.
3.  **Submit**: Fill in user details (fullname, email, etc.) and submit.
4.  **Confirm**:
    -   User is created in the database.
    -   Check the server console or the recipient email inbox for the "Your Account Credentials" email containing the new password.
