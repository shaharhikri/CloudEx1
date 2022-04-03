const express = require('express');
const path = require('path');
const { User, Friends } = require('../dbUtils/modelClasses');
const dbOperations = require('../dbUtils/dbOperationsMockup');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

const okStatus = 200
const badreqStatus = 400;
const forbiddenStatus = 403;
const unauthorizedStatus = 401;
const notfoundStatus = 404;
const servererrorStatus = 500;

// Custumer example:
// {
//     "email":"customer1@afeka.ac.il",
//     "name":{"first":"Cynthia", "last":"Chambers"},
//     "password":"ab4de",
//     "birthdate":"19-11-1963",
//     "roles":["goldCustomer","platinumClub","primeService"]
// }

// POST /customers
router.post("/", async (req, res) => {
    try{
        if(!req.body){
            res.status(badreqStatus).json({ error: 'Missing body.' });
            return;
        }
        if(Object.keys(req.body).length != 5){
            // console.log('Object.keys(req.body).length')
            res.status(badreqStatus).json({ error: 'Bad body format.' });
            return;
        }
        if(!req.body.email){
            res.status(badreqStatus).json({ error: 'Missing Email.' });
            return;
        }
        if ( dbOperations.findUserByEmail(req.body.email) ){
            res.status(forbiddenStatus).json({ error: `Email ${req.body.email} is already in use.` });
            return;
        }
        try{
            let u = new User(req.body.email, req.body.name, req.body.password, req.body.birthdate, req.body.roles);
            dbOperations.storeUser(u);
            // console.log(u.cloneWithoutPasswornd())
            res.status(okStatus).json(u.cloneWithoutPasswornd());
        }
        catch {
            console.log('badreqStatus')
            res.status(badreqStatus).json({ error: 'Bad body format.' });
        }
    }
    catch{
        res.status(servererrorStatus).send();
    }
});

// GET /customers/byEmail/{email}
router.get("/byEmail/:email", async (req, res) => {
    try{
        // console.log(req.params.email);
        let u = dbOperations.findUserByEmail(req.params.email)
        if( !u ){
            res.status(notfoundStatus).json({ error: `There is no user with the email ${req.params.email}.` });
        }
        else{
            res.status(okStatus).json( u.cloneWithoutPasswornd() );
        }
    }
    catch{
        res.status(servererrorStatus).send();
    }
});

// GET /customers/login/{email}?password={password}
router.get("/login/:email", async (req, res) => {
    try{
        if ( !req.query.password ){
            res.status(badreqStatus).json({ error: `Password url param required.` });
        }

        let u = dbOperations.validateUser(req.params.email, req.query.password);
        // console.log(req.params.email, req.query.password);
        if( !u ){
            res.status(unauthorizedStatus).json({ error: `Email or Password incorrect.` });
        }
        else{
            res.status(okStatus).json( u.cloneWithoutPasswornd() );
        }
    }
    catch {
        res.status(servererrorStatus).send();
    }
});

// PUT /customers/{email}
router.put("/:email", async (req, res) => {
    try{
        if(!req.body){
            res.status(badreqStatus).json({ error: 'Missing body.' });
            return;
        }
        if(req.body.email){
            res.status(forbiddenStatus).json({ error: 'Email cant be change.' });
            return;
        }
        //req.body.email, req.body.name, req.body.password, req.body.birthdate, req.body.roles
        let u = dbOperations.findUserByEmail(req.params.email);
        if( !u ){
            res.status(notfoundStatus).json({ error: `There is no user with the email ${req.params.email}.` });
        }
        else{
            let email = u.email;
            let name = u.name;
            let password = u.password;
            let birthdate = u.birthdate.toLocaleDateString("he-IL").toString();
            let roles = u.roles;

            if(req.body.name){
                name = req.body.name;
            }
            if(req.body.password){
                password = req.body.password;
            }
            if(req.body.birthdate){
                birthdate = req.body.birthdate;
            }
            if(req.body.roles){
                roles = req.body.roles;
            }
            
            try{
                let updated_u = new User(email, name, password, birthdate, roles);
                dbOperations.updateUser(updated_u);
                res.status(okStatus).send();
            }
            catch(e) {
                // console.log(e)
                res.status(forbiddenStatus).send();
            }
        }
    }
    catch {
        res.status(servererrorStatus).send();
    }
});

// PUT /customers/{email}/friends
router.put("/:email/friends", async (req, res) => {
    try {
        if (!req.body) {
            res.status(badreqStatus).json({ error: 'Missing body.' });
            return;
        }

        if(!req.body.email){
            res.status(badreqStatus).json({ error: 'Missing Email.' });
            return;
        }
        if (! dbOperations.findUserByEmail(req.params.email) ){
            res.status(forbiddenStatus).json({ error: `There's no customer with Email ${req.body.email}.` });
            return;
        }
        if (! dbOperations.findUserByEmail(req.body.email) ){
            res.status(forbiddenStatus).json({ error: `There's no customer with Email ${req.body.email}.` });
            return;
        }
        try{
            let friendEmail = new Friends(req.body.email)
            let customerEmail = new Friends(req.params.email)
            dbOperations.storeFriends(customerEmail, friendEmail);
            res.status(okStatus).send();
        }
        catch {
            console.log('badreqStatus')
            res.status(badreqStatus).json({ error: 'Bad body format.' });
        }
    }
    catch {

        res.status(servererrorStatus).send();
    }
})

// GET /customers/{email}/friends?size={size}&page={page}
router.get("/:email/friends", async (req, res) => {
    try{
        size = req.query.size;
        page = req.query.page;
        sortBy = dbOperations.sortByValues[0];
        sortOrder = dbOperations.sortOrderValues[0];
        if(!size){
            res.status(badreqStatus).json({ error: 'Missing size param.' });
            return;
        }
        if(!page){
            res.status(badreqStatus).json({ error: 'Missing page param.' });
            return;
        }
        
        if(!req.params.email){
            res.status(badreqStatus).json({ error: 'Missing Email.' });
            return;
        }
        let customerFriends = dbOperations.searchFriends(req.params.email, size, page, sortBy, sortOrder, 1);
        if (!customerFriends){
            res.status(servererrorStatus).send();
        }else{
            res.status(okStatus).json( customerFriends );
        }
    }
    catch(err) {
        res.status(servererrorStatus).send();
    }
});

// GET /customers/{email}/friends/secondLevel?size={size}&page={page}
router.get("/:email/friends/secondLevel", async (req, res) => {
    try{
        size = req.query.size;
        page = req.query.page;
        sortBy = dbOperations.sortByValues[0];
        sortOrder = dbOperations.sortOrderValues[0];
        if(!size){
            res.status(badreqStatus).json({ error: 'Missing size param.' });
            return;
        }
        if(!page){
            res.status(badreqStatus).json({ error: 'Missing page param.' });
            return;
        }
        
        if(!req.params.email){
            res.status(badreqStatus).json({ error: 'Missing Email.' });
            return;
        }
        let customerFriends = dbOperations.searchFriends(req.params.email, size, page, sortBy, sortOrder, 2);
        if (!customerFriends){
            res.status(servererrorStatus).send();
        }else{
            res.status(okStatus).json( customerFriends );
        }
    }
    catch(err) {
        res.status(servererrorStatus).send();
    }
});

// DELETE /customers
router.delete("/", async (req, res) => {
    try{
        dbOperations.deleteAllUsers();
        res.status(okStatus).send();
    }
    catch (e){
        // console.log(e)
        res.status(servererrorStatus).send();
    }
});

// GET /customers/search?size={size}&page={page}&sortBy={sortAttribute}&sortOrder={order}
// GET /customers/search?criteriaType=byEmailDomain&criteriaValue={value}&size={size}&page={page}&sortBy={sortAttribute}&sortOrder={order}
// GET /customers/search?criteriaType=byBirthYear&criteriaValue={value}&size={size}&page={page}&sortBy={sortAttribute}&sortOrder={order}
router.get("/search", async (req, res) => {
    let criteriaType, criteriaValue, size, page, sortBy, sortOrder;
    try{
        criteriaType = req.query.criteriaType;
        criteriaValue = req.query.criteriaValue;
        size = req.query.size;
        page = req.query.page;
        sortBy = req.query.sortBy;
        sortOrder = req.query.sortOrder;
        if(!size){
            res.status(badreqStatus).json({ error: 'Missing size param.' });
            return;
        }
        if(!page){
            res.status(badreqStatus).json({ error: 'Missing page param.' });
            return;
        }
        if (!criteriaType){
            criteriaType = dbOperations.criteriaTypes[0];
        }
        else if (!criteriaValue){
            res.status(badreqStatus).json({ error: 'Missing criteriaValue param.' });
            return;
        }
        if (!sortBy){
            sortBy = dbOperations.sortByValues[0];
        }
        if(!sortOrder){
            sortOrder = dbOperations.sortOrderValues[0];
        }

        if(!dbOperations.criteriaTypes.includes(criteriaType)){
            res.status(badreqStatus).json({ error: 'criteriaType is invalid.' });
            return;
        }
        if(!dbOperations.sortByValues.includes(sortBy)){
            res.status(badreqStatus).json({ error: 'sortBy is invalid.' });
            return;
        }
        if(!dbOperations.sortOrderValues.includes(sortOrder)){
            res.status(badreqStatus).json({ error: 'sortOrder is invalid.' });
            return;
        }
        
        let UsersResponse = dbOperations.searchUsers(criteriaType, criteriaValue, size, page, sortBy, sortOrder);
        if (!UsersResponse){
            res.status(servererrorStatus).send();
        }else{
            res.status(okStatus).json( UsersResponse );
        }
    }
    catch(err) {
        res.status(servererrorStatus).send();
    }
});

module.exports = router;