[@riot-tools/sak](../README.md) / [Exports](../modules.md) / HtmlCss

# Class: HtmlCss

## Table of contents

### Constructors

- [constructor](HtmlCss.md#constructor)

### Methods

- [\_sanitize](HtmlCss.md#_sanitize)
- [get](HtmlCss.md#get)
- [remove](HtmlCss.md#remove)
- [set](HtmlCss.md#set)

## Constructors

### constructor

• **new HtmlCss**()

## Methods

### \_sanitize

▸ `Static` `Private` **_sanitize**(`name`): `string`

Sanitize css properties; Kebab case to camel case.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | css property |

#### Returns

`string`

#### Defined in

[bianco.ts:380](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L380)

___

### get

▸ `Static` **get**(`els`, `propNames`): `string` \| `Partial`<`CSSStyleDeclaration`\> \| `Partial`<`CSSStyleDeclaration`\>[]

Gets one or many css properties from one or many html elements.

**`Example`**

```ts
HtmlCss.get(div, 'color');
// > 'red'

HtmlCss.get([div, span], 'color');
// > ['red', 'blue']

HtmlCss.get(div, ['color', 'fontSize']);
// > { color: 'red', fontSize: '12px' }

HtmlCss.get([div, span], ['color', 'fontSize']);
// > [{ color: 'red', fontSize: '12px' }, { color: 'blue', fontSize: '10px' }]
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `propNames` | `string` \| `string`[] | property name or array of property names |

#### Returns

`string` \| `Partial`<`CSSStyleDeclaration`\> \| `Partial`<`CSSStyleDeclaration`\>[]

#### Defined in

[bianco.ts:412](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L412)

___

### remove

▸ `Static` **remove**(`els`, `propNames`): `Element`[]

Removes properties from html elements

**`Example`**

```ts
HtmlCss.remove(div, 'color');
HtmlCss.remove([div, span], 'color');
HtmlCss.remove(div, ['color', 'fontSize']);
HtmlCss.remove([div, span], ['color', 'fontSize']);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `propNames` | `string` \| `string`[] | property name or array of property names |

#### Returns

`Element`[]

#### Defined in

[bianco.ts:477](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L477)

___

### set

▸ `Static` **set**(`els`, `props`): `ManyElements`<`Element`\>

**`Example`**

```ts
HtmlCss.set([div, span], {
     color: 'blue',
     paddingRight: '10px'
});

HtmlCss.set(div, {
     color: 'blue',
     paddingRight: '10px'
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `props` | `Partial`<`CSSStyleDeclaration`\> | CSS style props (div.style.fontSize); |

#### Returns

`ManyElements`<`Element`\>

#### Defined in

[bianco.ts:451](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L451)
