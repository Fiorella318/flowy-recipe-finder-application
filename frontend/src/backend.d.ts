import { type HttpAgentOptions, type ActorConfig, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Recipe {
    title: string;
    cookingTime: bigint;
    instructions: string;
    image: string;
    ingredients: Array<Ingredient>;
}
export interface Ingredient {
    name: string;
    quantity?: string;
}
export interface Registration {
    name: string;
    email: string;
}
export declare const createActor: (canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never) => backendInterface;
export declare const canisterId: string;
export interface backendInterface {
    getRegistrations(): Promise<Array<Registration>>;
    getSampleRecipes(): Promise<Array<Recipe>>;
    registerForUpdates(name: string, email: string): Promise<void>;
}

