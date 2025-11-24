import { User } from "../models/user.model.js";

export const deleteUnverifiedUsers = async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const result = await User.deleteMany({
    verified: false,
    createdAt: { $lt: tenMinutesAgo }
  });

  if (result.deletedCount > 0) {
    console.log(`Deleted ${result.deletedCount} unverified users`);
  }
};