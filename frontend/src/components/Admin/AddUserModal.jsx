import CommonUserForm from "../CommonUserForm";

const AdminAddUser = ({ closeForm }) => {
  const handleAddUser = (data) => {
    console.log("Admin Adding User:", data);
    // API call here
    closeForm();
  };

  return (
    <CommonUserForm
      onSubmit={handleAddUser}
      isAdmin={true}
      onClose={closeForm}
      submitText="Add Member"
    />
  );
};

export default AdminAddUser;
