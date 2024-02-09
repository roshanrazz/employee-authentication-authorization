const express = require('express')
const employeeModel = require('../model/employeeModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../verifyToken')


const router = express.Router()
const jwtSecret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'


// Register employee

router.post('/', (req,res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        // Store hash in your password DB
        if (err){
            res.status(500).json({Error: err.message})
        } else{
            req.body.password = hash
            employeeModel.create(req.body).then(employee => {
                res.json(employee)
            }).catch(err => {
                res.status(500).json({Error: err.message})
            })

        }
    });
    
})

// Get employees
router.get('/',verifyToken.checkAdmin,(req,res) => {
    employeeModel.find().then(employee => {
        if (employee.length > 0){
            res.status(200).json(employee)
        } else{
            res.status(404).json({Error: "No Employee Found"})
        }
    }).catch(err => {
        res.status(500).json({Error: err.message})
    })
})

// Get single employee
router.get('/:username',verifyToken.checkAnyRole,(req,res) =>{
    const loggedInUsername = req.user.username
    const requestedUsername = req.params.username
    if (requestedUsername !== loggedInUsername){
        return res.status(403).json({Error: "Access Denied...You can only view your own details"})
    }
    employeeModel.findOne({username:requestedUsername}).then(employee => {
        if (employee){
            res.status(200).json({"Employee Details":employee})
        } else{
            res.status(404).json({Error:"No employee found"})
        }
    }).catch(err => {
        res.status(500).json({Error: err.message})
    })
})


// Delete employee

router.delete('/:username',verifyToken.checkAdmin,verifyToken.checkAdmin, (req,res) => {
    employeeModel.findOneAndDelete({username: req.params.username}).then(employee => {
        if (employee){
            res.status(200).json(employee)
        } else{
            res.status(404).json({Error: "No Employee Found"})
        }
    }).catch(err => {
        res.status(500).json({Error: err.message})
    })
})

// User login

router.post('/login',(req,res) => {
    employeeModel.findOne({username:req.body.username}).then(employee => {
        if (employee){
            bcrypt.compare(req.body.password, employee.password, function(err, result) {
                if (result){

                    const token = jwt.sign({
                        name:employee.name,
                        username:employee.username,
                        email:employee.email,
                        userType:employee.userType
                    },
                    jwtSecret,
                    {
                        expiresIn:"5h"
                    }
                    )

                    res.status(200).json({
                        name:employee.name,
                        username:employee.username,
                        email:employee.email,
                        userType:employee.userType,
                        token:token
                    })
                } else{
                    res.status(401).json("Invalid username/password")
                }
            });
        } else{
            res.status(404).json({Error: "No Employee Found with that username"})
        }
    }).catch(err => {
        res.status(500).json({Error: err.message})
    })
})

module.exports = router