[@riot-tools/sak](../README.md) / [Exports](../modules.md) / HtmlEvents

# Class: HtmlEvents

## Table of contents

### Constructors

- [constructor](HtmlEvents.md#constructor)

### Methods

- [\_eachElement](HtmlEvents.md#_eachelement)
- [off](HtmlEvents.md#off)
- [on](HtmlEvents.md#on)
- [one](HtmlEvents.md#one)
- [trigger](HtmlEvents.md#trigger)

## Constructors

### constructor

• **new HtmlEvents**()

## Methods

### \_eachElement

▸ `Static` `Private` **_eachElement**(`els`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `els` | `ManyElements`<`Element`\> |
| `callback` | `EachElementCb` |

#### Returns

`void`

#### Defined in

[bianco.ts:34](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L34)

___

### off

▸ `Static` **off**(`els`, `event`, `callback`, `opts?`): `void`

Removes event listeners on dom event interfaces

**`Example`**

```ts
HtmlEvents.off(div, 'click', callback);
HtmlEvents.off(div, ['focus', 'blur'], callback);
HtmlEvents.off([div, input], ['focus', 'blur'], callback);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `event` | keyof `DocumentEventMap` \| keyof `DocumentEventMap`[] | - |
| `callback` | `EventListener` |  |
| `opts?` | `EventListenerOptions` | options to pass to addEventListener |

#### Returns

`void`

#### Defined in

[bianco.ts:148](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L148)

___

### on

▸ `Static` **on**(`els`, `event`, `callback`, `opts?`): `void`

Adds event listeners to dom event interfaces

**`Example`**

```ts
HtmlEvents.on(div, 'click', () => {});
HtmlEvents.on(div, ['focus', 'blur'], () => {});
HtmlEvents.on([div, input], ['focus', 'blur'], () => {});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `event` | keyof `DocumentEventMap` \| keyof `DocumentEventMap`[] | - |
| `callback` | `BiancoEventListener` |  |
| `opts?` | `EventListenerOptions` | options to pass to addEventListener |

#### Returns

`void`

#### Defined in

[bianco.ts:57](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L57)

___

### one

▸ `Static` **one**(`els`, `event`, `callback`, `opts?`): `void`

Adds event listeners to dom event interfaces that only run once

**`Example`**

```ts
HtmlEvents.one(div, 'click', () => {});
HtmlEvents.one(div, ['focus', 'blur'], () => {});
HtmlEvents.one([div, input], ['focus', 'blur'], () => {});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `event` | keyof `DocumentEventMap` \| keyof `DocumentEventMap`[] | - |
| `callback` | `EventListener` |  |
| `opts?` | `AddEventListenerOptions` | options to pass to addEventListener |

#### Returns

`void`

#### Defined in

[bianco.ts:99](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L99)

___

### trigger

▸ `Static` **trigger**(`els`, `event`, `data?`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `els` | `ManyElements`<`Element`\> | list of html elements |
| `event` | `Event` \| keyof `DocumentEventMap` | a single event |
| `data?` | `any` | Optional data to pass via `event.detail` |

#### Returns

`void`

#### Defined in

[bianco.ts:185](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L185)
