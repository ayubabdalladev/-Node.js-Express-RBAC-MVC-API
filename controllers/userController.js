exports.profile = async (req, res) => {
  res.json({
    message: "Profile data ✅",
    userFromToken: req.user, // id + role
  });
};

exports.adminDashboard = async (req, res) => {
  res.json({
    message: "Welcome Admin ✅",
    userFromToken: req.user,
  });
};
