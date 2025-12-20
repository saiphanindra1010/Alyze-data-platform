import mongoose from "mongoose";

const connectionSchema = mongoose.Schema(
  {
    name: { type: String, required : true },
    email: { type: String, required : true},
    types:  { type: String, required : true},
    host: { type: String, required : true },
    port:{ type: String, required : true },
    username: { type: String, required : true },
    password:{ type: String, required : true },
    salt:{type:String},
    user_id:{type:String},
    advanced:{
        ssl:{type:Boolean}
    }
  },
  {
    timestamps: true,
  }
);

connectionSchema.methods.matchPassword=async function(uipassword)
{
  return await bcrypt.compare(uipassword,this.password)
}

const Connections = mongoose.model("Connections", connectionSchema);

export default Connections;
