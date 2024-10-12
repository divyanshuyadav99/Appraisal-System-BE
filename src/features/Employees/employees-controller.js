import User from '../user/user-model.js';

export const getAllEmployees = async (req, res) => {
    try {
      // Find all users except those with the role of "Admin"
      const users = await User.find({ role: { $ne: 'Admin' } });
      
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' }); // Handle errors
    }
  };
  
export const mapEmployeeToSupervisor = async (req, res) => {
    const { supervisorName, employeeName } = req.body;

    try {
        // Find the supervisor by name
        const supervisor = await User.findOne({ name: supervisorName });
        if (!supervisor) {
            return res.status(404).json({ message: 'Supervisor not found' });
        }

        // Find the employee by name
        const employee = await User.findOne({ name: employeeName });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if the employee is already mapped under the supervisor
        const isAlreadyMapped = supervisor.employees.some(emp => emp.userId === employee.userId);
        if (isAlreadyMapped) {
            return res.status(400).json({ message: 'Employee is already mapped to this supervisor' });
        }

        // Map the employee under the supervisor
        supervisor.employees.push({ userId: employee.userId, name: employee.name });
        await supervisor.save();

        res.status(200).json({ message: 'Employee successfully mapped to supervisor!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); // Handle errors
    }
};