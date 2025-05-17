export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // Se asume que req.user está seteado por middleware de autenticación previo
    if (!user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'No autorizado para acceder a este recurso' });
    }
    next();
  };
};
