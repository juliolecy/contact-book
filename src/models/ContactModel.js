const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: ''},
  phone: { type: String, required:false, default: '' },
  createData: { type: Date, default: Date.now},
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body){
  this.body = body;
  this.errors = [];
  this.contact = null;
}


Contact.prototype.register = async function(){
  this.check();

  if(this.errors.length > 0 ) return;

  this.contact = await ContactModel.create(this.body);
}

Contact.prototype.check = function(){ 
  this.cleanUp()

  //EMAIL VALIDATION
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Invalid email');
  if(!this.body.name) this.errors.push("Name is required")
  if(!this.body.email && !this.body.phone) {
    this.errors.push("You must complete email or phone")
}
}


Contact.prototype.cleanUp = function(){
  for(const key in this.body){
     if(typeof this.body[key] !== 'string'){
      this.body[key] = '';
     }
  }
  this.body = {
      name: this.body.name,
      lastname: this.body.lastname,
      email: this.body.email,
      phone: this.body.phone,
  };
}

Contact.prototype.edit = async function(id){
  if(typeof id !== 'string') return;
  this.check();
  if(this.errors.length > 0 ) return;

  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {new: true});
}

//STATIC METHODS
Contact.searchId = async function(id){
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findById(id);
  return contact;
};

Contact.searchContacs = async function(id){
  const contact = await ContactModel.find()
  .sort({createdData: -1})
  return contact;
};

Contact.delete = async function(id){
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findOneAndDelete({_id: id})
  return contact;
};

module.exports = Contact;
