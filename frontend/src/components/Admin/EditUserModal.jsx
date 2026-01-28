import Modal from "../UI/Modal";
import CommonUserForm from "../CommonUserForm";

const EditUserModal = ({ user, onClose }) => {

  const handleUpdate = async (data) => {
    await axios.put(`/api/admin/users/${user._id}`, data);
    onClose();
  };

  return (
    <Modal title="Edit User" onClose={onClose}>
      <CommonUserForm
        initialData={user}
        onSubmit={handleUpdate}
        isAdmin={true}
      />
    </Modal>
  );
};

export default EditUserModal;
