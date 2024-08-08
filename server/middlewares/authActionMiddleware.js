const { defineAbilityFor } = require("../utils/abilities");

function authorize(action, subject) {
  return (req, res, next) => {
    const ability = defineAbilityFor(req.user); // Assuming req.user contains the authenticated user's info

    if (ability.can(action, subject)) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  };
}

module.exports = authorize;
