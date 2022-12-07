[@riot-tools/sak](../README.md) / [Exports](../modules.md) / OptionsValidator

# Class: OptionsValidator<V\>

## Type parameters

| Name |
| :------ |
| `V` |

## Table of contents

### Constructors

- [constructor](OptionsValidator.md#constructor)

### Properties

- [name](OptionsValidator.md#name)
- [requiredKeys](OptionsValidator.md#requiredkeys)
- [validators](OptionsValidator.md#validators)

### Methods

- [\_assertType](OptionsValidator.md#_asserttype)
- [\_customAssertion](OptionsValidator.md#_customassertion)
- [\_makeValidator](OptionsValidator.md#_makevalidator)
- [\_msg](OptionsValidator.md#_msg)
- [\_setFunction](OptionsValidator.md#_setfunction)
- [\_setRequired](OptionsValidator.md#_setrequired)
- [\_throw](OptionsValidator.md#_throw)
- [validate](OptionsValidator.md#validate)

## Constructors

### constructor

• **new OptionsValidator**<`V`\>(`schema`, `name?`)

Validates a function or classes's incoming options using
a simple js type checker. Validates against constructors,
primitives and custom functions. Schema is validated
recursively, therefore nested validators is supported.

**`Example`**

```js
const schema = {
    opt1: true, // required
    opt2: String, // must be a string
    opt3: Object ,// must be an object
    opt4: (val) => val === 'test' || 'does not eq test', // return true or err message
    opt5: [false, String], // Optional, but must be a string
    opt6: [true, String], // required, and must be a string
    opt7: {
        a: String,
        b: Boolean
    }, // must be an object that matches nested schema
    opt8: [true, {
        a: String,
        b: Boolean
    }] // required and must be an object that matches nested schema
};

const validator = new OptionsValidator(schema, 'my component');

validator.validate(myOptionsObject);
```

#### Type parameters

| Name |
| :------ |
| `V` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | `OptionsValidatorSchema`<`V`\> | Schema shape that your options should accept |
| `name?` | `string` | Name of implementation |

#### Defined in

[options-validator.ts:67](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L67)

## Properties

### name

• **name**: `string` = `''`

#### Defined in

[options-validator.ts:30](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L30)

___

### requiredKeys

• **requiredKeys**: `Set`<`string`\>

#### Defined in

[options-validator.ts:29](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L29)

___

### validators

• **validators**: `Map`<`any`, `any`\>

#### Defined in

[options-validator.ts:28](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L28)

## Methods

### \_assertType

▸ **_assertType**(`key`, `type`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `type` | `any` |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[options-validator.ts:94](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L94)

___

### \_customAssertion

▸ **_customAssertion**(`key`, `type`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `type` | `Function` |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[options-validator.ts:110](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L110)

___

### \_makeValidator

▸ **_makeValidator**(`key`, `type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `type` | `OptionsValidatorSchemaValue`<`V`\> \| `OptionsValidatorSchema`<`V`\> |

#### Returns

`void`

#### Defined in

[options-validator.ts:177](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L177)

___

### \_msg

▸ **_msg**(`...args`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `string`[] |

#### Returns

`string`

#### Defined in

[options-validator.ts:81](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L81)

___

### \_setFunction

▸ **_setFunction**(`key`, `type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `type` | `any` |

#### Returns

`void`

#### Defined in

[options-validator.ts:128](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L128)

___

### \_setRequired

▸ **_setRequired**(`key`, `opts`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `opts` | `OptionsValidatorSchemaValueRequired`<`V`\> |

#### Returns

`void`

#### Defined in

[options-validator.ts:139](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L139)

___

### \_throw

▸ **_throw**(`...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `string`[] |

#### Returns

`void`

#### Defined in

[options-validator.ts:86](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L86)

___

### validate

▸ **validate**(`props`, `parentKey?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `object` |
| `parentKey?` | `string` |

#### Returns

`void`

#### Defined in

[options-validator.ts:235](https://github.com/riot-tools/sak/blob/741d242/lib/options-validator.ts#L235)
