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
 * Validates a JSON object against a specified Zod schema and returns the validation result.
 *
 * @template O - The Zod schema type.
 * @param {Jsonifiable} json - The input JSON object to be validated. Can be a JSON string or a JSON-compatible object.
 * @param {O} schema - A Zod schema used to validate the JSON object.
 * @param {boolean} [asJSONString=false] - A flag indicating if the input `json` should be parsed as a JSON string when it's of type string. Defaults to `false`.
 * @returns {SuccessOutput<O> | FailureOutput} An array where the first element is a boolean indicating success,
 * the second element is the validated data (if successful) or `null` (if failed),
 * and the third element is additional error details in case of validation failure.
 */
export const getValidatedJSON = <O extends z.ZodTypeAny>(json: Jsonifiable, schema: O, asJSONString: boolean = false): SuccessOutput<O> | FailureOutput => {
    let jsonObj: any|null = typeof json === 'string' ? null : json;
    if(typeof json === 'string' && asJSONString){
        try{
            jsonObj = JSON.parse(json);
        }catch(e){
            return [false, null, {}];
        }
    }

    if(typeof json === 'string' && asJSONString && !jsonObj)
        return [false, null, {}];

    try{
        const data = schema.parse(typeof json === 'string' && !asJSONString ? json : jsonObj);
        return [true, data, null];
    }catch(e){
        return [false, null, e instanceof z.ZodError ? {
            zodError: e,
            validationError: fromZodError(e)
        } : {}];
    }
}
