## 3.0.0-beta.1
It uses zod@4-beta (zod@next) under the hood for `safeParseJSON` and `safeParseValue` functions

## List of utility functions

- `noop(): void` - A no-operation function that does nothing
- `ignorePromise(promise: Promise<any>): void` - Helps to suppress unhandled promise rejections
- `chunk<T>(array: T[], size: number): T[][]` - Splits array into chunks of the specified size
- `isObjectEmpty(obj: object): boolean` - Checks if the given object is empty (contains no own properties)
- `wait(ms: number): Promise<void>` - Returns a promise that resolves after the specified amount of time in milliseconds
- `safeParseJSON(json: string, schema: ZodSchema)` - Parses and validates a JSON string against a specified Zod schema
- `safeParseValue(value: Jsonifiable, schema: ZodSchema)` - Validates a Jsonifiable value (string, bool, object, etc.) against a specified Zod schema
