// Example controller
exports.getUsers = async (req, res) => {
  try {
    // placeholder logic
    res.json({ message: 'Get users' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
