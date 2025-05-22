const {validationResult} = require("express-validator");
const UserModel = require("../models/User");
const {hashedPassword, createToken,comparePassword} = require("../services/authServices");

// @route POST /api/register
// @access Public
// @desc Create user and return a token

module.exports.register = async (req, res) => {
    console.log(`[Register] Processing registration request`);
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const {name, email, password} = req.body;
        console.log(`[Register] Validated input for email: ${email}`);
        
        try {
            // Set timeout for database operations
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database operation timed out')), 10000)
            );
            
            console.log(`[Register] Checking if email already exists: ${email}`);
            const emailExistPromise = UserModel.findOne({email});
            const emailExist = await Promise.race([emailExistPromise, timeoutPromise]);
            
            if(!emailExist) {
                console.log(`[Register] Email is available, proceeding to hash password`);
                const hashed = await Promise.race([
                    hashedPassword(password),
                    timeoutPromise
                ]);
                
                console.log(`[Register] Creating new user in database: ${email}`);
                const userCreatePromise = UserModel.create({
                    name,
                    email,
                    password: hashed
                });
                
                const user = await Promise.race([userCreatePromise, timeoutPromise]);
                console.log(`[Register] User created successfully with ID: ${user._id}`);
                
                console.log(`[Register] Generating authentication token`);
                const token = createToken({id: user._id, name: user.name});
                
                console.log(`[Register] Registration complete for: ${email}`);
                return res.status(201).json({msg: 'Your account has been created!', token});
            } else {
                // email already taken
                console.log(`[Register] Email already exists: ${email}`);
                return res.status(400).json({errors: [{msg: `${email} is already taken`, param: 'email'}]})
            }
        } catch (error) {
            console.error(`[Register] Error during registration process:`, error);
            
            // Provide more specific error messages based on the error type
            if (error.message === 'Database operation timed out') {
                return res.status(504).json({
                    error: "Gateway Timeout", 
                    message: "Database operation timed out. Please try again later."
                });
            } else if (error.name === 'MongooseError' || error.name === 'MongoError') {
                console.error(`[Register] Database error details:`, error);
                return res.status(500).json({
                    error: "Database Error", 
                    message: "Failed to connect to database. Please try again later."
                });
            } else {
                return res.status(500).json({
                    error: "Server Error", 
                    message: "An unexpected error occurred during registration."
                });
            }
        }
    } else {
        // validations failed
        return res.status(400).json({errors: errors.array()})
    }
}

// @route POST /api/login
// @access Public
// @desc Login user and return a token

module.exports.login = async (req, res) => {
     const {email, password} = req.body;
     const errors = validationResult(req);
     if(errors.isEmpty()) {
         try {
             const user = await UserModel.findOne({email});
             if(user) {
                  if(await comparePassword(password, user.password)) {
                     const token = createToken({id: user._id, name: user.name});
                     if(user.admin) {
                        return res.status(201).json({token, admin: true});
                     } else {
                        return res.status(201).json({token, admin: false});
                     }
                  } else {
                      return res.status(400).json({errors: [{msg: 'password not matched!', param: 'password'}]})
                  }
             } else {
                 return res.status(400).json({errors: [{msg: `${email} is not found!`, param: 'email'}]});
             }
         } catch (error) {
             console.error(`[Login] Error during login process:`, error);
             return res.status(500).json({
                 error: "Server Error",
                 message: "An unexpected error occurred during login."
             });
         }
     } else {
        //  validations failed
        return res.status(400).json({errors: errors.array()})
     }
}
