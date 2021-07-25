import mongoose from "mongoose";
import faker from "faker";

export function generateUniqueEmail() {
  const ObjectID = mongoose.Types.ObjectId;

  return `e2e_${new ObjectID().toString()}_${faker.internet.email()}`;
}
