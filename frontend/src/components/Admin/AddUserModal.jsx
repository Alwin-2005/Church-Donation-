import CommonUserForm from '../../components/CommonUserForm';
import Modal from '../UI/Modal';

const AddUserModal = ({ onClose }) => {

  const handleCreate = async (data) => {
    await axios.post("/api/admin/users", data);
    onClose();
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <CommonUserForm
        onSubmit={handleCreate}
        isAdmin={true}
        isCreate
      />
    </Modal>
  );
};


export default AddUserModal;
