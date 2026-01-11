import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true},
    company: { type: String, require: true},
    password: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword=async function(uipassword)
{
  return await bcrypt.compare(uipassword,this.password)
}

userSchema.pre('save',async function(next)
{
  if(!this.isModified)
    {
      next()
    }
    
    const salt = await bcrypt.genSalt(10); // Generate a new salt for each save
    this.password = await bcrypt.hash(this.password, salt);
} )
const User = mongoose.model("User", userSchema);

export default User;
