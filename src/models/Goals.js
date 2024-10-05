import mongoose from 'mongoose';

const goalsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  end: {
    type: Date,
    required: false,
  },
//   commitment: {
//     type: Number,
//     min: 1,
//     max: 10,
//     required: false
//   },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    required: false
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: false
  },
  preferred_time: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time! Use HH:mm format.`
    }
  }
}, {
  collection: 'events',
});

const Goals = mongoose.models.Goals || mongoose.model('Goals', goalsSchema);

export default Goals;
