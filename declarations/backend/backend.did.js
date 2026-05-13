export const idlFactory = ({ IDL }) => {
  const Registration = IDL.Record({ 'name' : IDL.Text, 'email' : IDL.Text });
  const Ingredient = IDL.Record({
    'name' : IDL.Text,
    'quantity' : IDL.Opt(IDL.Text),
  });
  const Recipe = IDL.Record({
    'title' : IDL.Text,
    'cookingTime' : IDL.Nat,
    'instructions' : IDL.Text,
    'image' : IDL.Text,
    'ingredients' : IDL.Vec(Ingredient),
  });
  return IDL.Service({
    'getRegistrations' : IDL.Func([], [IDL.Vec(Registration)], ['query']),
    'getSampleRecipes' : IDL.Func([], [IDL.Vec(Recipe)], []),
    'registerForUpdates' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
