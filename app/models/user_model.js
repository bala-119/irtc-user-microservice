const mongoose = require('mongoose');

class UserModel {
  constructor() {
    const schema = new mongoose.Schema({
      fullName: { type: String, required: true },
      user_name:{type : String,required :true,unique :true},
      email: { type: String, required: true, unique: true },
      email_verified :{type:Boolean,default: false},
      phone:{type:String,required:true,unique:true},
      phone_verified :{type:Boolean,default: false},
      mpin :{type:String,default : null},
      password: { type: String, required: true },
      role: { type: String, enum: ['admin', 'user'], default: 'user' },
      aadhaarId: {
  type: String,
  match: [/^\d{12}$/, "Aadhaar ID must be exactly 12 digits"]},
aadhaarId_verified: { type: Boolean, default: false }
      

    },{ timestamps : 
    {  createdAt: 'created_at', 
        updatedAt: 'updated_at' 
   } 

});

    this.model = mongoose.model('User', schema);
  }

  getModel() {
    return this.model;
  }
}

module.exports = new UserModel().getModel();
