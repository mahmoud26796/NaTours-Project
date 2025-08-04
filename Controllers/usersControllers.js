const fs = require('fs');
// users resource 
// reading users data from txt file
const users = JSON.parse(
    fs.readFileSync(`./dev-data/data/users.json`)
);
exports.getAllUsers = (req, res) => {
    res.status(200).json({
         status: 'success',
        results: users.length,
        data: {
            users
        }
    });
};