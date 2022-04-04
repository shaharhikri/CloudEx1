class User {
    constructor(email, name, password, birthdate, roles) {
        this.email = email;
        this.name = name;
        this.password = password;
        // console.log(birthdate)
        this.birthdate = new Date(reverseDate(birthdate));
        this.roles = roles;
        if(!userSchemCheck(this)){
            throw new Error('User constructor error: One or more of your fields is not in the scheme');
        }
    }

    cloneWithoutPasswornd() {
        // console.log(this.birthdate.toLocaleDateString("he-IL").toString())
        let clone = new User(this.email, this.name, this.password, this.birthdate.toLocaleDateString("he-IL").toString(), this.roles);
        delete clone.password;
        return clone;
    }

}

class Friends {
    constructor(email) {
        this.email = email;
        if(!FriendSchemCheck(this)){
            throw new Error('Friend constructor error: Email field is invalid');
        }
    }
}

function FriendSchemCheck(obj){
    try{
        if( !obj.email) {
            return false;
        }
        if(typeof obj.email !== 'string') {
            return false;
        }
        return true;
    }
    catch {
        return false;
    }
}

function reverseDate(dateAsStr){
    try{
        if (dateAsStr.includes('-')) {
            a = dateAsStr.split('-').reverse();
        }
        else if (dateAsStr.includes('/')) {
            a = dateAsStr.split('/').reverse();
        }
        else if (dateAsStr.includes('.')) {
            a = dateAsStr.split('.').reverse();
        }
        else{
            return '';
        }
        s = '';
        for (let i = 0; i < a.length-1; i++) {
            s = s+a[i]+'-';
        }
        s += a[a.length-1];
        return s;
    }
    catch{
        return '';
    }

}

function userSchemCheck(obj){
    try{
        if( !obj.email || !obj.name || !obj.password || !obj.birthdate || !obj.roles) {
            return false;
        }
        // console.log(1)
        if(typeof obj.email !== 'string' || typeof obj.password !== 'string') {
            return false;
        }
        // console.log(2)
        if(!obj.name.first || !obj.name.last) {
            return false;
        }
        // console.log(3)
        if(typeof obj.name.first !== 'string' || typeof obj.name.last !== 'string' ) {
            return false;
        }
        // console.log(4,obj.birthdate)
        if(isNaN(obj.birthdate)) {
            return false;
        }
        // console.log(5,obj.roles)
        if(!Array.isArray(obj.roles)){
            return false;
        }
        for (let i = 0; i < obj.roles.length; i++) {
            if(!obj.roles[i] || typeof obj.roles[i] !== 'string' || obj.roles[i] === '' ){
                return false;
            }
        }
        return true;
    }
    catch {
        return false;
    }
}

module.exports = { 
    User,
    Friends,
    userSchemCheck,
    FriendSchemCheck
};