import {z} from 'zod';
import {fromZodError, ValidationError} from 'zod-validation-error';
import type {Jsonifiable} from './types';
export {ValidationError} from 'zod-validation-error';

type SuccessOutput<O extends z.ZodTypeAny> = [true, z.output<O>, null];
type FailureOutput = [false, null, (
    {
        zodError: z.ZodError;
        validationError: ValidationError;
    } | {
        zodError?: never;
        validationError?: never;
    }
)];

/**
 * Validates and parses a JSON string or a Jsonifiable object against a specified Zod schema.
 *
 * @template O - The Zod schema type used for validation.
 * @param {string | Jsonifiable} json - The JSON input, either as a string or a Jsonifiable object.
 * @param {O} schema - The Zod schema instance to validate the input against.
 * @returns {SuccessOutput<O> | FailureOutput} A tuple representing the validation result.
 *          If validation is successful, the first element is `true`, the second element is the parsed data, and the third is `null`.
 *          If validation fails, the first element is `false`, the second is `null`, and the third is an error object containing validation details.
 */
export const getValidatedJSON = <O extends z.ZodTypeAny>(json: string|Jsonifiable, schema: O): SuccessOutput<O> | FailureOutput => {
    let jsonObj: any|null = typeof json === 'string' ? null : json;
    if(typeof json === 'string'){
        try{
            jsonObj = JSON.parse(json);
        }catch(e){
            return [false, null, {}];
        }
    }

    if(!jsonObj)
        return [false, null, {}];

    try{
        const data = schema.parse(jsonObj);
        return [true, data, null];
    }catch(e){
        return [false, null, e instanceof z.ZodError ? {
            zodError: e,
            validationError: fromZodError(e)
        } : {}];
    }
}
