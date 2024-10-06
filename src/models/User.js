import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  garminConnection: {
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    lastSynced: { type: Date, required: false },
    activities: [{
      type: mongoose.Schema.Types.Mixed,
      required: false
    }],
  },
    }, {
    collection: 'users',
    
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
