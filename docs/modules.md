[@riot-tools/sak](README.md) / Exports

# @riot-tools/sak

## Table of contents

### Classes

- [Observable](classes/Observable.md)
- [OptionsValidator](classes/OptionsValidator.md)

### Interfaces

- [CustomValidatorFunction](interfaces/CustomValidatorFunction.md)
- [EmitterFn](interfaces/EmitterFn.md)
- [ListenFn](interfaces/ListenFn.md)
- [QueryableComponent](interfaces/QueryableComponent.md)

### Type aliases

- [ObservableInstance](modules.md#observableinstance)
- [ObservableInstanceChild](modules.md#observableinstancechild)
- [ObservedComponent](modules.md#observedcomponent)

### Functions

- [makeOnBeforeMount](modules.md#makeonbeforemount)
- [makeOnBeforeUnmount](modules.md#makeonbeforeunmount)
- [makeOnBeforeUpdate](modules.md#makeonbeforeupdate)
- [makeOnMounted](modules.md#makeonmounted)
- [makeOnUnmounted](modules.md#makeonunmounted)
- [makeOnUpdated](modules.md#makeonupdated)
- [makeQueryable](modules.md#makequeryable)
- [mergeState](modules.md#mergestate)
- [mkHook](modules.md#mkhook)

## Type aliases

### ObservableInstance

Ƭ **ObservableInstance**<`T`\>: [`ObservedComponent`](modules.md#observedcomponent) & { `$_observer`: [`Observable`](classes/Observable.md)<`T`\> ; `$_ref?`: `String` ; `$_spy?`: `ObserverSpy` ; `observe`: [`Observable`](classes/Observable.md)<`T`\>[``"observe"``]  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[observable.ts:37](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L37)

___

### ObservableInstanceChild

Ƭ **ObservableInstanceChild**: [`ObservedComponent`](modules.md#observedcomponent) & `Cleanup`

#### Defined in

[observable.ts:35](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L35)

___

### ObservedComponent

Ƭ **ObservedComponent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `off` | [`ListenFn`](interfaces/ListenFn.md) |
| `on` | [`ListenFn`](interfaces/ListenFn.md) & `Cleanup` |
| `one` | [`ListenFn`](interfaces/ListenFn.md) |
| `trigger` | [`EmitterFn`](interfaces/EmitterFn.md) |

#### Defined in

[observable.ts:28](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L28)

## Functions

### makeOnBeforeMount

▸ `Const` **makeOnBeforeMount**<`T`\>(`component`, `fn`, `runAfter?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |
| `fn` | `Function` |
| `runAfter?` | `boolean` |

#### Returns

`void`

#### Defined in

[meta.ts:52](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L52)

___

### makeOnBeforeUnmount

▸ `Const` **makeOnBeforeUnmount**<`T`\>(`component`, `fn`, `runAfter?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |
| `fn` | `Function` |
| `runAfter?` | `boolean` |

#### Returns

`void`

#### Defined in

[meta.ts:56](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L56)

___

### makeOnBeforeUpdate

▸ `Const` **makeOnBeforeUpdate**<`T`\>(`component`, `fn`, `runAfter?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |
| `fn` | `Function` |
| `runAfter?` | `boolean` |

#### Returns

`void`

#### Defined in

[meta.ts:54](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L54)

___

### makeOnMounted

▸ `Const` **makeOnMounted**<`T`\>(`component`, `fn`, `runAfter?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |
| `fn` | `Function` |
| `runAfter?` | `boolean` |

#### Returns

`void`

#### Defined in

[meta.ts:53](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L53)

___

### makeOnUnmounted

▸ `Const` **makeOnUnmounted**<`T`\>(`component`, `fn`, `runAfter?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |
| `fn` | `Function` |
| `runAfter?` | `boolean` |

#### Returns

`void`

#### Defined in

[meta.ts:57](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L57)

___

### makeOnUpdated

▸ `Const` **makeOnUpdated**<`T`\>(`component`, `fn`, `runAfter?`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |
| `fn` | `Function` |
| `runAfter?` | `boolean` |

#### Returns

`void`

#### Defined in

[meta.ts:55](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L55)

___

### makeQueryable

▸ `Const` **makeQueryable**<`T`\>(`component`): `T` & [`QueryableComponent`](interfaces/QueryableComponent.md) & `RiotComponent`<`any`, `any`\>

Adds functionality to riot components that allow them to
set its own state to isFetching while an async call is being made.
Any errors are recorded in the state's `fetchError` property

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |

#### Returns

`T` & [`QueryableComponent`](interfaces/QueryableComponent.md) & `RiotComponent`<`any`, `any`\>

component with a fetchable interface

#### Defined in

[queryable.ts:36](https://github.com/riot-tools/sak/blob/8a50b76/lib/queryable.ts#L36)

___

### mergeState

▸ `Const` **mergeState**<`T`\>(`component`, `state`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` & `RiotComponent`<`any`, `any`\> |
| `state` | `object` |

#### Returns

`void`

#### Defined in

[meta.ts:59](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L59)

___

### mkHook

▸ `Const` **mkHook**(`hook`): `MakeHook`

Closure to implement stackable hooks

#### Parameters

| Name | Type |
| :------ | :------ |
| `hook` | `RiotHookComponent` |

#### Returns

`MakeHook`

#### Defined in

[meta.ts:30](https://github.com/riot-tools/sak/blob/8a50b76/lib/meta.ts#L30)
