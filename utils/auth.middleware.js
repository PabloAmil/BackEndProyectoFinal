const authMiddleware = (requiredRole) => { 
  return (req, res, next) => {

    console.log('estamos creando el role');
    console.log(req.user)
    if (req.user.role !== requiredRole && req.user.role !== "Admin" ) {
      return res.status(403).json({ message: 'Unauthorized User' });
    }

    next();
  };
};

export default authMiddleware;

