import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = mongoose.Schema(
  {
      id: {
          type: Number,
          required: true,
          default: "0"
      },
      firstName: {
          type: String,
          required: true,
          trim: true
      }, 
      lastName: {
        type: String,
        required: true,
        trim: true
      }, 
      userName: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true
      },
      email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true
      },
      password: {
          type: String,
          required: true,
      },
      role: {
          type: String,
          enum: ['admin', 'moderator', 'reseller', 'affilate'],
          required: true,
          default: 'affilate'
      }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
    if (!this.id) {
        const amountOfUsers = await this.constructor.countDocuments({})
        this.id = amountOfUsers + 1
    }

    return next()
})


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}                                                                                                               


export const User = mongoose.model('User', userSchema)