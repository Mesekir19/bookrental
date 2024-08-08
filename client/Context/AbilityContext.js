import React, { createContext, useContext } from "react";
import { PureAbility } from "@casl/ability";

export const AbilityContext = createContext(new PureAbility([]));

export const AbilityProvider = ({ ability, children }) => {
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => {
  return useContext(AbilityContext);
};
