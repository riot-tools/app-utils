class OptionsValidatorError extends Error {}

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

type OptionsValidatorSchemaValueRequired<V> = [
    boolean,
    OptionsValidatorSchemaValue<V> | OptionsValidatorSchema<V>
]

export interface CustomValidatorFunction<V> {
    (val: PropType<V, keyof V>): boolean | string
}

type OptionsValidatorSchemaValue<V> = (
    boolean |
    string |
    CustomValidatorFunction<V> |
    OptionsValidatorSchemaValueRequired<V>
);

type OptionsValidatorSchema<V> = Record<
    keyof V,
    OptionsValidatorSchemaValue<V>
>;

export class OptionsValidator<V> {

    validators = new Map();
    requiredKeys: Set<string> = new Set();
    name = ''

    /**
     * Validates a function or classes's incoming options using
     * a simple js type checker. Validates against constructors,
     * primitives and custom functions. Schema is validated
     * recursively, therefore nested validators is supported.
     *
     * @param schema Schema shape that your options should accept
     * @param name Name of implementation
     *
     *
     * @example
     *
     * ```js
     * const schema = {
     *     opt1: true, // required
     *     opt2: String, // must be a string
     *     opt3: Object ,// must be an object
     *     opt4: (val) => val === 'test' || 'does not eq test', // return true or err message
     *     opt5: [false, String], // Optional, but must be a string
     *     opt6: [true, String], // required, and must be a string
     *     opt7: {
     *         a: String,
     *         b: Boolean
     *     }, // must be an object that matches nested schema
     *     opt8: [true, {
     *         a: String,
     *         b: Boolean
     *     }] // required and must be an object that matches nested schema
     * };
     *
     * const validator = new OptionsValidator(schema, 'my component');
     *
     * validator.validate(myOptionsObject);
     * ```
     */
    constructor(schema: OptionsValidatorSchema<V>, name?: string) {

        if (name) {
            this.name = name;
        }

        const entries = Object.entries<OptionsValidatorSchemaValue<V>>(schema);

        for (const [key, type] of entries) {

            this._makeValidator(key, type);
        }
    }

    _msg(...args: string[]) {

        return [this.name, ...args].join(' ').trim();
    }

    _throw(...args: string[]) {

        throw new OptionsValidatorError(

            this._msg(...args)
        );
    }

    _assertType(key: string, type: any, value: any) {

        if (
            value === undefined ||
            value === null ||
            value.constructor.name !== type
        ) {

            this._throw(
                key,
                'must be a',
                type
            );
        }
    }

    _customAssertion(key: string, type: Function, value: any) {

        const result = type(value);

        if (result !== true) {

            const msg = [result];

            if (typeof result !== 'string') {

                msg.pop();
                msg.push(key, 'failed to validate and returned an emtpy message');
            }

            this._throw(...msg);
        }
    }

    _setFunction(key: string, type: any) {

        this.validators.set(
            key,
            (value: any) => (

                this._customAssertion(key, type, value)
            )
        );
    }

    _setRequired(key: string, opts: OptionsValidatorSchemaValueRequired<V>) {

        const [required, type] = opts;

        if (required) {
            this.requiredKeys.add(key);
        }

        this.validators.set(key, (value: any) => {

            // Assert required
            if (required && (value === undefined || value === null)) {

                this._throw(key, 'is required');

            }

            // Assert nested
            if (type.constructor === Object) {

                return {
                    validator: new OptionsValidator(type as OptionsValidatorSchema<V>),
                    value
                };
            }

            // Assert function
            if (typeof type === 'function') {

                this._customAssertion(key, type, value);
                return;
            }

            // Assert type
            this._assertType(key, type, value);
        });
    }

    _makeValidator(
        key: string,
        type: OptionsValidatorSchemaValue<V> | OptionsValidatorSchema<V>
    ) {

        // Validate schema config is valid
        if (type === null || type === undefined) {

            this._throw(key, 'cannot be null or undefined when defining a options schema');
        }

        // Assert required values
        if (type === true) {

            this.requiredKeys.add(key);
            this.validators.set(key, (value: any) => {

                if (value === undefined || value === null) {

                    this._throw(key, 'must be present');
                }
            });
            return;
        }

        // Assert custom assertions
        if (typeof type === 'function') {

            this._setFunction(key, type);
            return;
        }

        // Assert optional/required types
        if (type.constructor === Array) {

            this._setRequired(key, type);
            return;
        }

        // Create nested schemas
        if (type.constructor === Object) {

            this.validators.set(key, new OptionsValidator(type as OptionsValidatorSchema<V>));
            return;
        }

        this.validators.set(
            key,
            (value: any) => {

                if (value.constructor.name !== type) {

                    this._throw(key, 'must be a', type.toString());
                }
            }
        );
    }

    validate(props: object, parentKey?: string) {

        const entries = Object.entries(props);
        const keys = Object.keys(props);

        for (const key of this.requiredKeys) {

            if (!keys.includes(key)) {

                const $_key = parentKey ? `${parentKey}.${key}` : key;

                this._throw(
                    `(${$_key})`,
                    'options are required:',
                    [...this.requiredKeys].join(', ')
                );
            }
        }


        for (const [key, value] of entries) {

            const validator = this.validators.get(key);


            if (validator instanceof OptionsValidator) {

                validator.validate(
                    value,
                    parentKey ? `${parentKey}.${key}` : key
                );

                continue;
            }

            const nested = validator(value);

            if (nested && nested.validator) {

                nested.validator.validate(
                    nested.value
                );
            }
        }
    }
};

export default OptionsValidator;


