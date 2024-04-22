const authMiddleware = (requiredRole) => { 
  return (req, res, next) => {

    if (req.user.role !== requiredRole) {
      //console.log(req.user)
      return res.status(403).json({ message: 'Unauthorized User' });
    }
    next();
  };
};

export default authMiddleware;

