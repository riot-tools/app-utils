import { expect } from 'chai';

import { OptionsValidator } from '../lib';

const stub: {[k: string]: any} = {
    schema: {
        opt1: true, // required
        opt2: 'String', // must be a string
        opt3: 'Object' ,// must be an object
        opt4: (val) => (val === 'test' || 'does not eq test'), // return true or err message
        opt5: [false, 'String'], // Optional, but must be a string
        opt6: [true, 'String'], // required, and must be a string
        opt7: {
            a: 'String',
            b: 'Boolean'
        }, // must be an object that matches nested schema
        opt8: [true, {
            a: 'String',
            b: 'Boolean'
        }] // required and must be an object that matches nested schema
    }
}


describe('Options Validator', function () {

    it('should not instantiate with bad schemas', () => {

        const willFail = [
            { fails: undefined },
            { fails: null },
            { nested: { fails: undefined } },
            { nested: { fails: null } }
        ]

        for (const schema of willFail) {

            expect(() => (

                new OptionsValidator(schema as any)
            )).to.throw();
        }

    });

    it('should create an options validator', () => {

        new OptionsValidator(stub.schema);
    });

    it('enforces strings', () => {

        const validator = new OptionsValidator({ test: 'String' });

        expect(() => validator.validate({ test: 1 })).to.throw(/must be a String/);
        expect(() => validator.validate({ test: '1' })).not.to.throw();
    });

    it('enforces booleans', () => {

        const validator = new OptionsValidator({ test: 'Boolean' });

        expect(() => validator.validate({ test: 1 })).to.throw(/must be a Boolean/);
        expect(() => validator.validate({ test: true })).not.to.throw();
    });

    it('enforces numbers', () => {

        const validator = new OptionsValidator({ test: 'Number' });

        expect(() => validator.validate({ test: '1' })).to.throw(/must be a Number/);
        expect(() => validator.validate({ test: 1 })).not.to.throw();
    });

    it('enforces arrays', () => {

        const validator = new OptionsValidator({ test: 'Array' });

        expect(() => validator.validate({ test: '1' })).to.throw(/must be a Array/);
        expect(() => validator.validate({ test: [] })).not.to.throw();
    });

    it('enforces objects', () => {

        const validator = new OptionsValidator({ test: 'Object' });

        expect(() => validator.validate({ test: '1' })).to.throw(/must be a Object/);
        expect(() => validator.validate({ test: {} })).not.to.throw();
    });

    it('enforces functions', () => {

        const validator = new OptionsValidator({ test: 'Function' });

        expect(() => validator.validate({ test: '1' })).to.throw(/must be a Function/);
        expect(() => validator.validate({ test: () => {} })).not.to.throw();
    });

    it('enforces custom validators', () => {

        const fn = (val) => val === 5 || 'not eq 5';
        const validator = new OptionsValidator({ test: fn });

        expect(() => validator.validate({ test: 1 })).to.throw(/not eq 5/);
        expect(() => validator.validate({ test: 5 })).not.to.throw();
    });

    it('enforces multiple values', () => {

        const schema = {
            str: 'String',
            num: 'Number',
            bool: 'Boolean',
            arr: 'Array',
            obj: 'Object',
            fn: 'Function'
        };

        const validator = new OptionsValidator({ test: 'Function' });

        const goodValue = {
            str: 'str',
            num: 1,
            bool: true,
            arr: [],
            obj: {},
            fn: () => {}
        };

        const invalids = [
            { ...goodValue, str: 1 },
            { ...goodValue, num: '1' },
            { ...goodValue, bool: 1 },
            { ...goodValue, arr: 1 },
            { ...goodValue, obj: 1 },
            { ...goodValue, fn: 1 }
        ]

        for (const invalid of invalids) {

            expect(() => validator.validate(invalid)).to.throw();
        }
    });

    it('enforces required values', () => {

        const validator = new OptionsValidator(stub.schema);

        const willFail = [
            {},
            { opt1: 1 },
            { opt1: 1, opt6: 'something' },
        ];

        const goodVaue = {
            opt1: 1,
            opt6: 'str',
            opt8: { a: 'a', b: true }
        };

        for (const value of willFail) {

            expect(() => validator.validate(value)).to.throw(/required/);
        }

        expect(() => validator.validate(goodVaue)).not.to.throw();
    });

    it('enforces nested schemas', () => {

        const validator = new OptionsValidator <any>({
            poo: [
                true,
                {
                    a: true,
                    b: 'String'
                }
            ]
        });

        expect(() => validator.validate({})).to.throw(/required/);
        expect(() => validator.validate({ poo: { b: '' }})).to.throw(/required/);
        expect(() => validator.validate({ poo: { a: '' }})).not.to.throw();
    })
});
