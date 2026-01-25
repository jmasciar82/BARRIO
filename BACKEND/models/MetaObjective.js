import mongoose from 'mongoose';

const metaObjectiveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UsersMetas',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    default: ''
  },
  peso: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  activo: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('MetaObjective', metaObjectiveSchema);
