const authMiddleware = (requiredRole) => { 
  return (req, res, next) => {

    if (req.user.role !== requiredRole && req.user.role !== "Admin" ) {
      //console.log(req.user)
      return res.status(403).json({ message: 'Unauthorized User' });
    }

    next();
  };
};

export default authMiddleware;

