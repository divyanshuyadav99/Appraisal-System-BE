import mongoose from 'mongoose';

const appraisalSchema = new mongoose.Schema({
  seqId: { type: Number, unique: true }, // Add this field for sequential ID
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Supervisor', 'Peer', 'Junior'], required: true },
  questions: [
    {
      question: String,
      answer: String,
    },
  ],
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // New field added
});

const Appraisal = mongoose.model('Appraisal', appraisalSchema);

export default Appraisal;
