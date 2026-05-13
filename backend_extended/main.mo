import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
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
        "https:
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
        "https:
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
        "https:
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

type __CAFFEINE_STORAGE_RefillInformation = {
    proposed_top_up_amount: ?Nat;
};

type __CAFFEINE_STORAGE_RefillResult = {
    success: ?Bool;
    topped_up_amount: ?Nat;
};

    public shared (msg) func __CAFFEINE_STORAGE_refillCashier(refill_information: ?__CAFFEINE_STORAGE_RefillInformation) : async __CAFFEINE_STORAGE_RefillResult {
    let cashier = Principal.fromText("72ch2-fiaaa-aaaar-qbsvq-cai");
    
    assert (cashier == msg.caller);
    
    let current_balance = Cycles.balance();
    let reserved_cycles : Nat = 400_000_000_000;
    
    let current_free_cycles_count : Nat = Nat.sub(current_balance, reserved_cycles);
    
    let cycles_to_send : Nat = switch (refill_information) {
        case null { current_free_cycles_count };
        case (?info) {
            switch (info.proposed_top_up_amount) {
                case null { current_free_cycles_count };
                case (?proposed) { Nat.min(proposed, current_free_cycles_count) };
            }
        };
    };

    let target_canister = actor(Principal.toText(cashier)) : actor {
        account_top_up_v1 : ({ account : Principal }) -> async ();
    };
    
    let current_principal = Principal.fromActor(Flowy);
    
    await (with cycles = cycles_to_send) target_canister.account_top_up_v1({ account = current_principal });
    
    return {
        success = ?true;
        topped_up_amount = ?cycles_to_send;
    };
};
};
