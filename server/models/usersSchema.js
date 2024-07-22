// usersSchema.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const keysecret = process.env.JWT_SECRET

// Doctor Schema
const doctorSchema = new mongoose.Schema({
  fname: { type: String, required: true, trim: true },
  specialization: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email format');
      }
    }
  },
  password: { type: String, required: true },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  pdfs: [{ type: String }] ,
  tokens: [
    {
        token: {
            type: String,
            required: true,
        }
    }
]

  //token should come here may be
});

// Hash the password before saving to the database for Doctor
doctorSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

// token generate
doctorSchema.methods.generateAuthtoken = async function () {
  try {
      let token23 = jwt.sign({ _id: this._id }, keysecret, {
          expiresIn: "1d"
      });

      this.tokens = this.tokens.concat({ token: token23 });
      await this.save();
      return token23;
  } catch (error) {
      res.status(422).json(error)
  }
}

const Doctor = mongoose.model('Doctor', doctorSchema);

// Patient Schema
const patientSchema = new mongoose.Schema({
  fname: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email format');
      }
    }
  },
  password: { type: String, required: true },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {
  Doctor,
  Patient
};
