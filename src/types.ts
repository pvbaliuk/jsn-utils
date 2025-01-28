type JsonPrimitive = string | number | boolean | null;
type JsonifiableObject = {[Key in string]?: Jsonifiable} | {toJSON: () => Jsonifiable};
type JsonifiableArray = readonly Jsonifiable[];

export type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray;
