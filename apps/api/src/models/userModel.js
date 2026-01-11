import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema(
  {
    licensesType:{type: String, required: true},
    totalGenerations: { type: String, required: true },
  },
  {
    _id: false // This prevents Mongoose from creating an _id field for each subdocument
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    licenses: {
      type: [licenseSchema], required: true,
      default: () => [
        {
          licensesType: "trial",
          totalGenerations: "5"
        }
      ]
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
