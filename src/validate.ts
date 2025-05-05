import {z, ZodError} from 'zod';
import type {Jsonifiable} from './types';

type SuccessReturn<O extends z.ZodTypeAny> = {
    is_ok: true;
    value: z.output<O>;
    error?: never;
    prettyError?: never;
};

type ErrorReturn = {
    is_ok: false;
    value?: never;
    error: ZodError|SyntaxError;
    prettyError: string;
};

/**
 * Validates a JSON string against a provided Zod schema.
 *
 * @param {string} json - The JSON string to be validated.
 * @param {O} schema - The Zod schema used to validate the JSON content.
 * @return {SuccessReturn<O> | ErrorReturn} Returns a success object if validation passes,
 * or an error object if the JSON is invalid or doesn't conform to the schema.
 */
export function safeParseJSON<O extends z.ZodTypeAny>(json: string, schema: O): SuccessReturn<O>|ErrorReturn{
    let parsed: Jsonifiable|null = null;
    try{
        parsed = JSON.parse(json);
    }catch(e){
        return {
            is_ok: false,
            error: e,
            prettyError: 'Invalid JSON'
        };
    }

    return safeParseValue(parsed, schema);
}

/**
 * Validates the given value against the provided Zod schema.
 *
 * @param {Jsonifiable} value - The value to be validated. This should be a JSON-serializable object.
 * @param {O} schema - The Zod schema to use for validation.
 * @return {SuccessReturn<O>|ErrorReturn} An object indicating whether the validation was successful.
 * If successful, it contains the parsed value. If unsuccessful, it contains the validation error and a prettified error message.
 */
export function safeParseValue<O extends z.ZodTypeAny>(value: Jsonifiable, schema: O): SuccessReturn<O>|ErrorReturn{
    const {data, error, success} = schema.safeParse(value);
    if(success){
        return {
            is_ok: true,
            value: data
        };
    }

    return {
        is_ok: false,
        error: error,
        prettyError: z.prettifyError(error)
    };
}
