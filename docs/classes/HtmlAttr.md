[@riot-tools/sak](../README.md) / [Exports](../modules.md) / HtmlAttr

# Class: HtmlAttr

## Table of contents

### Constructors

- [constructor](HtmlAttr.md#constructor)

### Methods

- [\_eachElement](HtmlAttr.md#_eachelement)
- [\_eachItem](HtmlAttr.md#_eachitem)
- [get](HtmlAttr.md#get)
- [has](HtmlAttr.md#has)
- [remove](HtmlAttr.md#remove)
- [set](HtmlAttr.md#set)

## Constructors

### constructor

• **new HtmlAttr**()

## Methods

### \_eachElement

▸ `Static` `Private` **_eachElement**(`els`, `propNames`, `callback`): `any`[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `els` | `ManyElements`<`Element`\> |
| `propNames` | `string` \| `string`[] \| `string`[][] |
| `callback` | (`element`: `Element`, `prop`: `string` \| [`string`, `string`]) => `unknown` |

#### Returns

`any`[][]

#### Defined in

[bianco.ts:220](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L220)

___

### \_eachItem

▸ `Static` `Private` **_eachItem**(`propNames`, `callback`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `propNames` | `string`[] \| `string`[][] |
| `callback` | `Function` |

#### Returns

`any`[]

#### Defined in

[bianco.ts:215](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L215)

___

### get

▸ `Static` **get**(`els`, `propNames`): `string` \| `string`[] \| `StringProps` \| `StringProps`[]

Returns attributes on one or many html elements

**`Example`**

```ts
HtmlAttr.get(form, 'method');
// > 'post'

HtmlAttr.get([select, input], 'name');
// > ['role', 'full_name']

HtmlAttr.get(form, ['method', 'action']);
// > { method: 'post', action: '/' }

HtmlAttr.get([select, input], ['name', 'value']);
// > [{ name: '', value: '' }, { name: '', value: '' }]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `propNames` | `string` \| `string`[] | attribute |

#### Returns

`string` \| `string`[] \| `StringProps` \| `StringProps`[]

#### Defined in

[bianco.ts:254](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L254)

___

### has

▸ `Static` **has**(`els`, `propNames`): `boolean` \| `boolean`[] \| `BoolProps` \| `BoolProps`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> |  |
| `propNames` | `string` \| `string`[] | HtmlAttr.has(form, 'method'); // > true HtmlAttr.has([select, input], 'name'); // > [true, true] HtmlAttr.has(form, ['method', 'action']); // > { method: true, action: true } HtmlAttr.has([select, input], ['name', 'value']); // > [{ name: true, value: true }, { name: true, value: true }] |

#### Returns

`boolean` \| `boolean`[] \| `BoolProps` \| `BoolProps`[]

#### Defined in

[bianco.ts:339](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L339)

___

### remove

▸ `Static` **remove**(`els`, `propNames`): `ManyElements`<`Element`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `els` | `ManyElements`<`Element`\> |
| `propNames` | `string` \| `string`[] |

#### Returns

`ManyElements`<`Element`\>

#### Defined in

[bianco.ts:307](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L307)

___

### set

▸ `Static` **set**(`els`, `props`): `ManyElements`<`Element`\>

**`Example`**

```ts
HtmlAttr.set(input, { name: 'full_name' });
HtmlAttr.set([div, div, div], { 'data-show': 'false' });
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `els` | `ManyElements`<`Element`\> |
| `props` | `StringProps` |

#### Returns

`ManyElements`<`Element`\>

#### Defined in

[bianco.ts:292](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L292)
