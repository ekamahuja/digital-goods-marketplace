import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = mongoose.schema(
  {
      name: {
          type: String,
          required: true,
      }, 
      username: {
          type: String,
          required: true,
      },
      password: {
          type: String,
          required: true,
      },
      role: {
          type: String,
          enum: ['admin', 'reseller'],
          required: true,
      }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



export const User = mongoose.model('User', userSchema)