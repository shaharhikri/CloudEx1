const express = require('express');
const path = require('path');
const { User, userSchemCheck } = require('../dbUtils/modelClasses');
const dbOperations = require('../dbUtils/dbOperationsMockup');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

const okStatus = 200
const badreqStatus = 400;
const forbiddenStatus = 403;
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
            res.status(forbiddenStatus).json({ error: `Email or Password incorrect.` });
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
            let name=u.name;
            let password = u.password;
            let birthdate=u.birthdate.toLocaleDateString("he-IL").toString();
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

// GET /customers/{email}/friends?size={size}&page={page}

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

module.exports = router;