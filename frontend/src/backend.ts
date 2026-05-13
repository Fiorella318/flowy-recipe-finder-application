import { type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { backend as _backend, createActor as _createActor, canisterId as _canisterId, CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> {
    return {
        __kind__: "Some",
        value: value
    };
}
function none(): None {
    return {
        __kind__: "None"
    };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) {
        throw new Error("unwrap: none");
    }
    return option.value;
}
function candid_some<T>(value: T): [T] {
    return [
        value
    ];
}
function candid_none<T>(): [] {
    return [];
}
function record_opt_to_undefined<T>(arg: T | null): T | undefined {
    return arg == null ? undefined : arg;
}
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
export function createActor(canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never): backendInterface {
    const actor = _createActor(canisterId, options);
    return new Backend(actor, processError);
}
export const canisterId = _canisterId;
export interface backendInterface {
    getRegistrations(): Promise<Array<Registration>>;
    getSampleRecipes(): Promise<Array<Recipe>>;
    registerForUpdates(name: string, email: string): Promise<void>;
}
import type { Ingredient as _Ingredient, Recipe as _Recipe } from "declarations/backend/backend.did.d.ts";
class Backend implements backendInterface {
    private actor: ActorSubclass<_SERVICE>;
    constructor(actor?: ActorSubclass<_SERVICE>, private processError?: (error: unknown) => never){
        this.actor = actor ?? _backend;
    }
    async getRegistrations(): Promise<Array<Registration>> {
        if (this.processError) {
            try {
                const result = await this.actor.getRegistrations();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getRegistrations();
            return result;
        }
    }
    async getSampleRecipes(): Promise<Array<Recipe>> {
        if (this.processError) {
            try {
                const result = await this.actor.getSampleRecipes();
                return from_candid_vec_n1(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getSampleRecipes();
            return from_candid_vec_n1(result);
        }
    }
    async registerForUpdates(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.registerForUpdates(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.registerForUpdates(arg0, arg1);
            return result;
        }
    }
}
export const backend: backendInterface = new Backend();
function from_candid_Ingredient_n5(value: _Ingredient): Ingredient {
    return from_candid_record_n6(value);
}
function from_candid_Recipe_n2(value: _Recipe): Recipe {
    return from_candid_record_n3(value);
}
function from_candid_opt_n7(value: [] | [string]): string | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_record_n3(value: {
    title: string;
    cookingTime: bigint;
    instructions: string;
    image: string;
    ingredients: Array<_Ingredient>;
}): {
    title: string;
    cookingTime: bigint;
    instructions: string;
    image: string;
    ingredients: Array<Ingredient>;
} {
    return {
        title: value.title,
        cookingTime: value.cookingTime,
        instructions: value.instructions,
        image: value.image,
        ingredients: from_candid_vec_n4(value.ingredients)
    };
}
function from_candid_record_n6(value: {
    name: string;
    quantity: [] | [string];
}): {
    name: string;
    quantity?: string;
} {
    return {
        name: value.name,
        quantity: record_opt_to_undefined(from_candid_opt_n7(value.quantity))
    };
}
function from_candid_vec_n1(value: Array<_Recipe>): Array<Recipe> {
    return value.map((x)=>from_candid_Recipe_n2(x));
}
function from_candid_vec_n4(value: Array<_Ingredient>): Array<Ingredient> {
    return value.map((x)=>from_candid_Ingredient_n5(x));
}

