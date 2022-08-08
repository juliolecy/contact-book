const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = []; // it must be empty
        this.user = null;
    }

    //LOGIN
    async login(){
        this.check()
        if(this.errors.length > 0 ) return;
        this.user = await LoginModel.findOne({email: this.body.email});

        if(!this.user) { this.errors.push("User doesn't exist");
        return;
    }

        //bcrypt validation
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Invalid password');
            this.user = null;
            return;
        }

    }

    //REGISTER
    async register(){
        this.check()

        if(this.errors.length > 0 ) return;

       await this.userExists();

       
            // Hash for password
            const salt = bcryptjs.genSaltSync();                                
            this.body.password = bcryptjs.hashSync(this.body.password, salt);

            // Mandando objeto já verificado para a base de dados
            this.user = await LoginModel.create(this.body)
           
    }

    //CHECKING IF THE USER EXISTS
    async userExists(){

         // Finding a register in database wich already exists
         this.user = await LoginModel.findOne({email: this.body.email});

        if(this.user) this.errors.push('This user already exist');
    }
 
    //VALIDATION
    check(){ 
        this.cleanUp()

        //EMAIL VALIDATION
        if(!validator.isEmail(this.body.email)) this.errors.push('Invalid email');

        //PASSWORD VALIDATION
        if(this.body.password.length < 3 || this.body.password.length > 50){this.errors.push('Password must be between 3 and 50 characters')};
    }


    cleanUp(){
        for(const key in this.body){
           if(typeof this.body[key] !== 'string'){
            this.body[key] = '';
           }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }


}

module.exports = Login;
