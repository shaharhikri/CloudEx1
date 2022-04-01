const { User } = require('../dbUtils/modelClasses');


const users = []

function storeUser(userEntity){
    users.push(userEntity);
}

function findUserByEmail(email){
    // console.log(users)
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


const criteriaTypes = ['Default', 'byEmailDomain', 'byBirthYear', 'byRole'];
const sortByValues = ['email', 'fname', 'lname', 'birthdate'];
const sortOrderValues = ['ASC', 'DESC'];

function criteriaTypeCase(criteriaType, criteriaValue){
    let output = [];
    switch (criteriaType) {
        case 'Default':
            output = users;
            break;
        case 'byEmailDomain':
            if(!criteriaValue){
                output = undefined;
            }
            else{
                users.forEach(user => {
                    if((user.email).includes(criteriaValue)){
                        output.push(user);
                    }
                });
            }
            break;
        case 'byBirthYear':
            if(!criteriaValue){
                output = undefined;
            }
            else{
                users.forEach(user => {
                    if((user.birthdate).getFullYear() == criteriaValue){
                        output.push(user);
                    }
                });
            }
            
            break;
        case 'byRole':
            if(!criteriaValue){
                output = undefined;
            }
            else{
                users.forEach(user => {
                    if((user.roles).includes(criteriaValue)){
                        output.push(user);
                    }
                });                
            }
            break;
    
        default:
            output = users;
            break;
    }

    return output
}

function sortByCase(arr, sortBy){
    switch (sortBy) {
        case 'email':
            arr.sort((a, b) => b.email - a.email);
            break;

        case 'fname':
            arr.sort((a, b) => b.name.first - a.name.first);
            break;

        case 'lname':
            arr.sort((a, b) => b.name.last - a.name.last);
            break;

        case 'birthdate':
            arr.sort((a, b) => b.birthdate - a.birthdate);
            break;    
            
        default:
            arr = undefined;
            break;
    }

    return arr;
}


function searchUsers(criteriaType, criteriaValue, size, page, sortBy, sortOrder){
    let output = [];
    output = criteriaTypeCase(criteriaType, criteriaValue);
    // console.log(sortBy);
    output = sortByCase(output, sortBy);
    
    // TODO Checking undefined
    if (output === undefined){
        return undefined;
    }


    if (sortOrder === 'DESC'){
        output.reverse();
    }
    
    // implement pagination
    output = output.slice(size*page, size*page + size);
    
    for (let i = 0; i < output.length; i++) {
        output[i] = output[i].cloneWithoutPasswornd()
    }
    return output;
}

function deleteAllUsers() {
    while(users.length > 0) {
        users.pop();
    }
}

module.exports = {
    criteriaTypes,
    sortByValues,
    sortOrderValues,
    storeUser,
    findUserByEmail, 
    validateUser, 
    updateUser,
    searchUsers,
    deleteAllUsers
}