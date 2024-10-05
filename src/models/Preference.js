import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  wakeup_time: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time! Use HH:mm format.`
    }
  },
  sleep_time: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time! Use HH:mm format.`
    }
  },
  early_bird: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  night_owl: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  }
}, {
  collection: 'preferences',
});

const Preference = mongoose.models.Preference || mongoose.model('Preference', preferenceSchema);

export default Preference;
