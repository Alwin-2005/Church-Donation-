const User = require("../../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

async function handleGetAllUsersInfo(req, res) {
    const Result = await User.find({});
    return res.status(201).json({ Result });
}

async function handleAddNewUsers(req, res) {
    const phoneRegex = /^[6-9]\d{9}$/;
    const status = "enabled";
    const { fullname, email, phoneNo, gender, dob, address, password, role } = req.body;
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (phoneNo && !phoneRegex.test(phoneNo)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }

    try {
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNo,
            gender,
            dob,
            address,
            role,
            passwordHash,
            status,
        });
        return res.status(200).json({ msg: "User created successfully" });
    }

    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }

}

async function handleAddBulkUsers(req, res) {
    const phoneRegex = /^[6-9]\d{9}$/;
    const { users } = req.body; // Expecting array of user objects

    if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ message: "Invalid users array" });
    }

    const results = {
        success: 0,
        failed: 0,
        errors: []
    };

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        try {
            // Validate email
            if (!validator.isEmail(user.email)) {
                throw new Error(`Row ${i + 1}: Invalid email format`);
            }

            // Validate phone (optional field)
            if (user.phoneNo && !phoneRegex.test(user.phoneNo)) {
                throw new Error(`Row ${i + 1}: Invalid phone number`);
            }

            // Hash password
            const passwordHash = await bcrypt.hash(user.password, 10);

            // Create user
            await User.create({
                fullname: user.fullname,
                email: user.email,
                phoneNo: user.phoneNo || "",
                gender: user.gender,
                dob: user.dob,
                address: user.address || "",
                role: user.role,
                passwordHash,
                status: "enabled"
            });

            results.success++;
        } catch (err) {
            results.failed++;
            results.errors.push({
                row: i + 1,
                email: user.email,
                error: err.message
            });
        }
    }

    return res.status(200).json({
        message: `Bulk upload completed: ${results.success} created, ${results.failed} failed`,
        results
    });
}


module.exports = {
    handleGetAllUsersInfo,
    handleAddNewUsers,
    handleAddBulkUsers,
};