const express = require('express');
const path = require('path');
const { User, userSchemCheck } = require('../dbUtils/modelClasses');
const dbOperations = require('../dbUtils/dbOperationsMockup');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

const missingStatus = 401;

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
            res.status(missingStatus).json({ error: 'Missing body.' });
            return;
        }
        if(!req.body.email){
            res.status(missingStatus).json({ error: 'Missing Email.' });
            return;
        }
        if ( dbOperations.findUserByEmail(req.body.email) ){
            res.status(500).json({ error: `Email ${req.body.email} is already in use.` });
            return;
        }
        try{
            let u = new User(req.body.email, req.body.name, req.body.password, req.body.birthdate, req.body.roles);
            dbOperations.storeUser(u);
            // console.log(u.cloneWithoutPasswornd())
            res.status(200).json(u.cloneWithoutPasswornd());
        }
        catch {
            res.status(403).json({ error: 'Bad body format.' });
        }
    }
    catch{
        res.status(500).send();
    }
});

// GET /customers/byEmail/{email}
router.get("/byEmail/:email", async (req, res) => {
    try{
        // console.log(req.params.email);
        let u = dbOperations.findUserByEmail(req.params.email)
        if( !u ){
            res.status(404).json({ error: `There is no user with the email ${req.params.email}.` });
        }
        else{
            res.status(200).json( u.cloneWithoutPasswornd() );
        }
    }
    catch{
        res.status(500).send();
    }
});

// GET /customers/login/{email}?password={password}
router.get("/login/:email", async (req, res) => {
    try{
        let u = dbOperations.validateUser(req.params.email, req.query.password);
        // console.log(req.params.email, req.query.password);
        if( !u ){
            res.status(404).json({ error: `Email or Password incorrect.` });
        }
        else{
            res.status(200).json( u.cloneWithoutPasswornd() );
        }
    }
    catch {
        res.status(500).send();
    }
});

// PUT /customers/{email}
router.put("/:email", async (req, res) => {
    try{
        if(!req.body){
            res.status(200);
            return;
        }
        if(req.body.email){
            res.status(missingStatus).json({ error: 'Email cant be change.' });
            return;
        }
        //req.body.email, req.body.name, req.body.password, req.body.birthdate, req.body.roles
        let u = dbOperations.findUserByEmail(req.params.email);
        if( !u ){
            res.status(404).json({ error: `There is no user with the email ${req.params.email}.` });
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
                res.status(200).send();
            }
            catch(e) {
                console.log(e)
                res.status(403).send();
            }
        }
    }
    catch {
        res.status(500).send();
    }
});

// PUT /customers/{email}/friends

// GET /customers/{email}/friends?size={size}&page={page}

// DELETE /customers
router.delete("/", async (req, res) => {
    try{
        dbOperations.deleteAllUsers();
        res.status(200).send();
    }
    catch (e){
        console.log(e)
        res.status(500).send();
    }
});

// GET /customers/search?size={size}&page={page}&sortBy={sortAttribute}&sortOrder={order}

// GET /customers/search?criteriaType=byEmailDomain&criteriaValue={value}&size={size}&page={page}&sortBy={sortAttribute}&sortOrder={order}

// GET /customers/search?criteriaType=byBirthYear&criteriaValue={value}&size={size}&page={page}&sortBy={sortAttribute}&sortOrder={order}

module.exports = router;