const bcryptjs = require('bcryptjs')
const users = require('../data/users.json')
const { check,body } = require('express-validator')


module.exports = [

    check('email')
        .notEmpty().withMessage('Debes ingresar un email').bail()
        .isEmail().withMessage('Debe ser un email valido'),
        

    body('password')
        .notEmpty().withMessage('Debes ingresar tu contraseña')
        .custom((value,{req}) => {
            const user = users.find(user => user.email === req.body.email)
            if(!user) {
               return false 
            }else{
                if(!bcryptjs.compareSync(value,user.password)) {
                    return false
                }
            }
            return true
        }).withMessage('Credenciales invalidas'),
]