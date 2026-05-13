import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Ingredient { 'name' : string, 'quantity' : [] | [string] }
export interface Recipe {
  'title' : string,
  'cookingTime' : bigint,
  'instructions' : string,
  'image' : string,
  'ingredients' : Array<Ingredient>,
}
export interface Registration { 'name' : string, 'email' : string }
export interface _SERVICE {
  'getRegistrations' : ActorMethod<[], Array<Registration>>,
  'getSampleRecipes' : ActorMethod<[], Array<Recipe>>,
  'registerForUpdates' : ActorMethod<[string, string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
