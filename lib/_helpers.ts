
type Func = (...args: any) => any;
type Klass = { new: Func }
export type NonFunctionProps<T> = { [K in keyof T]: T[K] extends Func | Klass ? never : K }[keyof T];
export type FunctionProps<T> = { [K in keyof T]: T[K] extends Func | Klass ? K : never }[keyof T];

export class AssertationError extends Error {}

export const assert = (test: boolean, message?: string) => {

    if (test === false) {

        throw new AssertationError(message || 'assertion failed');
    }
};

export type DeepOptional<T> = {

    [K in keyof T]?: T[K] extends object ? DeepOptional<T[K]> : T[K]
};

type _Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type _Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}${
                  '' extends P
                  ? ''
                  : '.'
                }${P}`
        : never
    : never
;

/**
 * @example
 *
 * type MyObject = {
 *      some: { nested: { path: true } }
 * }
 *
 * const x: PathsToValues<MyObject> = 'some.nested.path'; // good
 * const y: PathsToValues<MyObject> = 'some.nested'; // will error
 */
export type PathsToValues<
    T,
    Depth extends number = 5
> = [Depth] extends [never]
    ? never
    : T extends object
        ? {
            [K in keyof T]-?: _Join<K, PathsToValues<T[K], _Prev[Depth]>>
        }[keyof T]
        : ''
;


export type StrOrNum = string | number