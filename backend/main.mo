import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Debug "mo:base/Debug";

actor Flowy {
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  public type Ingredient = {
    name : Text;
    quantity : ?Text;
  };

  public type Recipe = {
    title : Text;
    image : Text;
    cookingTime : Nat;
    ingredients : [Ingredient];
    instructions : Text;
  };

  public type SearchPreferences = {
    ingredients : [Ingredient];
    tastePreference : Text;
    additionalPreferences : Text;
    timeAvailable : ?Nat;
  };

  public type Registration = {
    name : Text;
    email : Text;
  };

  var registrations : List.List<Registration> = List.nil<Registration>();

  public func getSampleRecipes() : async [Recipe] {
    let sampleRecipes = [
      (
        "Spaghetti Carbonara",
        "https://example.com/carbonara.jpg",
        30,
        [
          ("spaghetti", null),
          ("bacon", null),
          ("eggs", null),
          ("parmesan cheese", null),
        ],
        "Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine all ingredients.",
      ),
      (
        "Chicken Stir Fry",
        "https://example.com/stirfry.jpg",
        25,
        [
          ("chicken breast", null),
          ("vegetables", null),
          ("soy sauce", null),
          ("rice", null),
        ],
        "Cook chicken. Add vegetables and soy sauce. Serve with rice.",
      ),
      (
        "Pancakes",
        "https://example.com/pancakes.jpg",
        20,
        [
          ("flour", null),
          ("milk", null),
          ("eggs", null),
          ("sugar", null),
        ],
        "Mix ingredients. Cook on griddle. Serve with syrup.",
      ),
    ];

    let recipes = Iter.toArray(
      Iter.map<(Text, Text, Nat, [(Text, ?Text)], Text), Recipe>(
        Iter.fromArray(sampleRecipes),
        func(recipeData) {
          let (title, image, cookingTime, ingredientsData, instructions) = recipeData;
          let ingredients = Iter.toArray(
            Iter.map<(Text, ?Text), Ingredient>(
              Iter.fromArray(ingredientsData),
              func(ingredientData) {
                let (name, quantity) = ingredientData;
                { name; quantity };
              },
            )
          );
          {
            title;
            image;
            cookingTime;
            ingredients;
            instructions;
          };
        },
      )
    );

    recipes;
  };

  public func registerForUpdates(name : Text, email : Text) : async () {
    if (Text.size(name) == 0 or Text.size(email) == 0) {
      Debug.trap("Name and email cannot be empty");
    };

    let registration : Registration = {
      name;
      email;
    };

    registrations := List.push(registration, registrations);
  };

  public query func getRegistrations() : async [Registration] {
    List.toArray(registrations);
  };
};
