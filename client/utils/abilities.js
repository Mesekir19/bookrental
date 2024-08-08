import { AbilityBuilder, PureAbility } from "@casl/ability";

export function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(PureAbility);

  if (user.role === "admin") {
    can("manage", "all"); // Admins can manage everything
  } else if (user.role === "owner") {
    can("read", "Book");
    can("create", "Book");
    can("update", "Book", { ownerId: user.id });
    can("delete", "Book", { ownerId: user.id });
    cannot("manage", "Owner");
    can("read", "Owner", { id: user.id });
    can("read", "Revenue");
  }

  return build();
}
