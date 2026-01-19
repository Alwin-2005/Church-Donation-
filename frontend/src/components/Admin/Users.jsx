import UserCard from "./UserCard";
import axios from "axios";
const Users = () => {
    const users = [
        {
            "fullname": "xyz",
            "email": "xyz@gmail.com",
            "phoneNo": "8128247264",
            "gender": "Male",
            "dob": {
                "$date": "2005-08-23T00:00:00.000Z"
            },
            "role": "externalMember",
            "passwordHash": "$2b$10$VHqey3RSom8reVjvE2TSzuqaHc5Oxf.vCCwfaklrQukJNfLHquFeC",
            "status": "enabled",
            "createdAt": {
                "$date": "2026-01-06T15:20:01.935Z"
            },
            "updatedAt": {
                "$date": "2026-01-06T15:20:01.935Z"
            },
            "__v": 0
            },

            {
            "fullname": "xyz",
            "email": "xyz@gmail.com",
            "phoneNo": "8128247264",
            "gender": "Male",
            "dob": {
                "$date": "2005-08-23T00:00:00.000Z"
            },
            "role": "externalMember",
            "passwordHash": "$2b$10$VHqey3RSom8reVjvE2TSzuqaHc5Oxf.vCCwfaklrQukJNfLHquFeC",
            "status": "enabled",
            "createdAt": {
                "$date": "2026-01-06T15:20:01.935Z"
            },
            "updatedAt": {
                "$date": "2026-01-06T15:20:01.935Z"
            },
            "__v": 0
            },

            {
            "fullname": "xyz",
            "email": "xyz@gmail.com",
            "phoneNo": "8128247264",
            "gender": "Male",
            "dob": {
                "$date": "2005-08-23T00:00:00.000Z"
            },
            "role": "externalMember",
            "passwordHash": "$2b$10$VHqey3RSom8reVjvE2TSzuqaHc5Oxf.vCCwfaklrQukJNfLHquFeC",
            "status": "enabled",
            "createdAt": {
                "$date": "2026-01-06T15:20:01.935Z"
            },
            "updatedAt": {
                "$date": "2026-01-06T15:20:01.935Z"
            },
            "__v": 0
            }
    ];
    
     

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user,idx) => (
        <UserCard key={idx} user={user} />
      ))}
    </div>
    
  );

}

export default Users;