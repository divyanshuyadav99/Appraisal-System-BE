import Appraisal from "./appraisal-model.js"; // Adjust the path as necessary
import User from "../user/user-model.js"; // Import your User model


// Create a new appraisal
export const createAppraisal = async (req, res) => {
  console.log("user:", req.user);
  const { participantUserId, evaluatorUserId, role, questions } = req.body;

  try {
    // Find the participant and evaluator using userId
    const participant = await User.findOne({ userId: participantUserId });
    const evaluator = await User.findOne({ userId: evaluatorUserId });

    // Check if both participant and evaluator exist
    if (!participant || !evaluator) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the participant exists in the evaluator's employees array
    console.log("participant:", participant.userId);
    console.log("evaluator:", evaluator.userId);

    if (!evaluator.employees || 
        !evaluator.employees.some(employee => employee.userId == participant.userId)) {
      return res.status(400).json({
        message: "The participant is not mapped under the supervisor you provided.",
      });
    }

    // Find the maximum seqId currently in use
    const lastAppraisal = await Appraisal.findOne().sort({ seqId: -1 });
    const seqId = lastAppraisal ? lastAppraisal.seqId + 1 : 1; // Increment or start from 1

    // Create the appraisal object
    const appraisal = new Appraisal({
      seqId,
      participant: participant._id, // Use the ObjectId of the participant
      evaluator: evaluator._id,     // Use the ObjectId of the evaluator
      role,
      questions,
      submitted_by: req.user.id,
    });

    // Save the new appraisal to the database
    await appraisal.save();

    res.status(201).json({ message: "Appraisal created successfully", appraisal });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({ message: error.message });
  }
};
  
// Get all appraisals
export const getAllAppraisals = async (req, res) => {
  try {
    const appraisals = await Appraisal.find().populate("participant evaluator"); // Populating to get user details
    res.status(200).json(appraisals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single appraisal by ID
export const getAppraisalById = async (req, res) => {
    const { seqId } = req.params; // Expecting seqId as a route parameter

    try {
      // Use findOne to locate the appraisal by seqId
      console.log("seqId:",seqId)
      const appraisal = await Appraisal.findOne({ seqId }).populate(
        'participant evaluator'
      );
  
      // Check if appraisal was found
      if (!appraisal) {
        return res.status(404).json({ message: 'Appraisal not found' });
      }
  
      // Return the found appraisal
      res.status(200).json(appraisal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Update an appraisal by ID
export const updateAppraisal = async (req, res) => {
    const { id } = req.params; // Assuming `id` is the `seqId` in the URL
    const { participant, evaluator, role, questions } = req.body;
  
    try {
      // Find the appraisal by `seqId` and update it
      const appraisal = await Appraisal.findOneAndUpdate(
        { seqId: id }, // Using `seqId` instead of `_id`
        { participant, evaluator, role, questions },
        { new: true, runValidators: true } // Returns the updated document
      );
  
      if (!appraisal) {
        return res.status(404).json({ message: "Appraisal not found" });
      }
  
      res.status(200).json({ message: "Appraisal updated successfully", appraisal });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
// Delete an appraisal by ID
export const deleteAppraisal = async (req, res) => {
    const { id } = req.params; // Assuming you're sending seqId as a route parameter
    console.log("seqId:", id);
    try {
      // Find and delete the appraisal by seqId
      const appraisal = await Appraisal.findOneAndDelete({ seqId: id });
  
      // Check if the appraisal was found and deleted
      if (!appraisal) {
        return res.status(404).json({ message: "Appraisal not found" });
      }
  
      res.status(200).json({ message: "Appraisal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getEvaluatorAppraisal = async (req, res) => {
    const { id } = req.body; // Assuming evaluator userId is passed as a route parameter
    try {
      // Find all appraisals where evaluator matches the passed userId
      const appraisals = await Appraisal.find({
        $or: [
          { evaluator: id },
          { submitted_by: id } // Check for the submitted_by field as well
        ]
      });
      
  
      // Check if any appraisals were found
      if (appraisals.length === 0) {
        return res.status(404).json({ message: "No appraisals found for this evaluator" });
      }
  
      res.status(200).json(appraisals); // Return the appraisals found
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
