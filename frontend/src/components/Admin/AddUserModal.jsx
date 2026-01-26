import CommonUserForm from '../../components/CommonUserForm';

const AdminAddUser = ({ closeForm }) => {
  const handleAddUser = (data) => {
    console.log("Admin Adding User:", data);
    // API call here
    closeForm(); // close after submit
  };

  return (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeForm}
        >
            <div onClick={(e) => e.stopPropagation()}>
               <CommonUserForm
                  onSubmit={handleAddUser}
                  isAdmin={true}
                  onClose={closeForm}
                  submitText="Add Member"
               />
            </div>
        </div>

  );
};

export default AdminAddUser;
