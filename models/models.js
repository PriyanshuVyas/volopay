import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    user: { type: String, required: true },
    department: { type: String, required: true },
    software: { type: String, required: true },
    seats: { type: Number, required: true },
    amount: { type: Number, required: true },
  });
  
  const Item = mongoose.model('Item', itemSchema);

  export default Item;