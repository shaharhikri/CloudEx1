const { User } = require('../dbUtils/modelClasses');

users = []

function storeUser(userEntity){
    users.push(userEntity);
}

function findUserByEmail(email){
    console.log(users)
    return users.find(u => u.email === email)
}

function findUserByEmail(email){
    console.log(users)
    return users.find(u => u.email === email)
}

function validateUser(email, password){
    let u = users.find(u => u.email === email);
    if (u && u.password === password){
        return u;
    }
    else {
        return null;
    }
}

function updateUser(user){
    let old_user = users.find(u => u.email === user.email);
    if(old_user){
        if(user.name){
            old_user.name = user.name;
        }
        if(user.password){
            old_user.password = user.password;
        }
        if(user.birthdate){
            old_user.birthdate = user.birthdate;
        }
        if(user.roles){
            old_user.roles = user.roles;
        }
    }
}

function deleteAllUsers() {
    while(users.length > 0) {
        users.pop();
    }
}

module.exports.storeUser = storeUser;
module.exports.findUserByEmail = findUserByEmail;
module.exports.validateUser = validateUser;
module.exports.updateUser = updateUser;
module.exports.deleteAllUsers = deleteAllUsers;