const { AbilityBuilder, Ability } = require("@casl/ability");

function defineAbilityFor(user) {
  if (!user) {
    throw new Error("User is not defined");
  }

  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === "admin") {
    can("manage", "all");
  } else if (user.role === "owner") {
    can("read", "Book");
    can("create", "Book");
    can("update", "Book", { ownerId: user.id });
    can("delete", "Book", { ownerId: user.id });
  } else {
    can("read", "Book", { available: true });
    can("rent", "Book", { available: true });

  }

  return build();
}

module.exports = { defineAbilityFor };
