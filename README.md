## List of utility functions

- `noop(): void` - A no-operation function that does nothing
- `ignorePromise(promise: Promise<any>): void` - Helps to suppress unhandled promise rejections
- `chunk<T>(array: T[], size: number): T[][]` - Splits array into chunks of the specified size
- `isObjectEmpty(obj: object): boolean` - Checks if the given object is empty (contains no own properties)
- `wait(ms: number): Promise<void>` - Returns a promise that resolves after the specified amount of time in milliseconds
- `getValidatedJSON(json: string|Jsonifiable, schema: ZodSchema)` - Parses and validates a JSON string or an object against a specified Zod schema. Returns error as a third member of a returned tuple
