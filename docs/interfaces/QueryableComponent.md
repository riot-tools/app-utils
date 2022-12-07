[@riot-tools/sak](../README.md) / [Exports](../modules.md) / QueryableComponent

# Interface: QueryableComponent<S\>

## Type parameters

| Name |
| :------ |
| `S` |

## Table of contents

### Properties

- [fnWillFetch](QueryableComponent.md#fnwillfetch)
- [makeFetching](QueryableComponent.md#makefetching)
- [state](QueryableComponent.md#state)

### Methods

- [setFetching](QueryableComponent.md#setfetching)
- [toggleFetching](QueryableComponent.md#togglefetching)

## Properties

### fnWillFetch

• **fnWillFetch**: <T\>(`fn`: `T`) => <T\>(`fn`: `T`) => `object` \| `Error`

#### Type declaration

▸ <`T`\>(`fn`): <T\>(`fn`: `T`) => `object` \| `Error`

Creates a closure that will execute given function and toggle
state to `isFetching` when it does. Captures errors and can
update state given a return value. Useful for onclick handlers
and event bindings.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Function` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `T` | function to be executed |

##### Returns

`fn`

▸ <`T`\>(`fn`): `object` \| `Error`

Sets component's state to isFetching true and captures any
errors caused by the function fetching. Useful for use inside
of other functions.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Function` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `T` | function to be executed |

##### Returns

`object` \| `Error`

#### Defined in

[queryable.ts:41](https://github.com/riot-tools/sak/blob/741d242/lib/queryable.ts#L41)

___

### makeFetching

• **makeFetching**: `string`[]

Names of the functions to make queryable on before mount

#### Defined in

[queryable.ts:16](https://github.com/riot-tools/sak/blob/741d242/lib/queryable.ts#L16)

___

### state

• **state**: [`QueryableState`](../modules.md#queryablestate)<`S`\>

#### Defined in

[queryable.ts:11](https://github.com/riot-tools/sak/blob/741d242/lib/queryable.ts#L11)

## Methods

### setFetching

▸ **setFetching**<`T`\>(`fn`): `object` \| `Error`

Sets component's state to isFetching true and captures any
errors caused by the function fetching. Useful for use inside
of other functions.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Function` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `T` | function to be executed |

#### Returns

`object` \| `Error`

#### Defined in

[queryable.ts:31](https://github.com/riot-tools/sak/blob/741d242/lib/queryable.ts#L31)

___

### toggleFetching

▸ **toggleFetching**(`isFetching?`): `void`

Toggle or set isFetching. Useful for when, for example,
binding functions to events.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `isFetching?` | `boolean` | set is fetching |

#### Returns

`void`

#### Defined in

[queryable.ts:23](https://github.com/riot-tools/sak/blob/741d242/lib/queryable.ts#L23)
