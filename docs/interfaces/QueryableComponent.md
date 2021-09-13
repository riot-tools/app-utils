[@riot-tools/sak](../README.md) / [Exports](../modules.md) / QueryableComponent

# Interface: QueryableComponent

## Table of contents

### Properties

- [setFetching](QueryableComponent.md#setfetching)

### Methods

- [fnWillFetch](QueryableComponent.md#fnwillfetch)

## Properties

### setFetching

• **setFetching**: `SetFetchingFunction`

Sets component's state to isFetching true and captures any
errors caused by the function fetching. Useful for use inside
of other functions.

**`param`** function to be executed

#### Defined in

[queryable.ts:16](https://github.com/riot-tools/sak/blob/8a50b76/lib/queryable.ts#L16)

## Methods

### fnWillFetch

▸ **fnWillFetch**(`fn`): `SetFetchingFunction`

Creates a closure that will execute given function and toggle
state to `isFetching` when it does. Captures errors and can
update state given a return value. Useful for onclick handlers
and event bindings.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | `Function` | function to be executed |

#### Returns

`SetFetchingFunction`

#### Defined in

[queryable.ts:26](https://github.com/riot-tools/sak/blob/8a50b76/lib/queryable.ts#L26)
