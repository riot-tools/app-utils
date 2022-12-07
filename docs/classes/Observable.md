[@riot-tools/sak](../README.md) / [Exports](../modules.md) / Observable

# Class: Observable<T, U\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `U` | [`ObservableEvents`](../interfaces/ObservableEvents.md) |

## Table of contents

### Constructors

- [constructor](Observable.md#constructor)

### Properties

- [$\_callbacks](Observable.md#$_callbacks)
- [$\_ref](Observable.md#$_ref)
- [$\_spy](Observable.md#$_spy)
- [$\_target](Observable.md#$_target)
- [emit](Observable.md#emit)
- [once](Observable.md#once)

### Methods

- [install](Observable.md#install)
- [observe](Observable.md#observe)
- [off](Observable.md#off)
- [on](Observable.md#on)
- [one](Observable.md#one)
- [trigger](Observable.md#trigger)

## Constructors

### constructor

• **new Observable**<`T`, `U`\>(`target?`, `options?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `U` | [`ObservableEvents`](../interfaces/ObservableEvents.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target?` | `T` |
| `options?` | `ObservableOptions`<`T`, `U`\> |

#### Defined in

[observable.ts:149](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L149)

## Properties

### $\_callbacks

• **$\_callbacks**: `EventCallbacksMap`

#### Defined in

[observable.ts:134](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L134)

___

### $\_ref

• `Optional` **$\_ref**: `String`

#### Defined in

[observable.ts:137](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L137)

___

### $\_spy

• `Optional` **$\_spy**: `ObserverSpy`<`T`, `U`\>

#### Defined in

[observable.ts:136](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L136)

___

### $\_target

• **$\_target**: `any` = `null`

#### Defined in

[observable.ts:135](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L135)

___

### emit

• **emit**: <E\>(`event`: `E`, ...`args`: `EventType`<`U`, `E`\>[]) => `void`

#### Type declaration

▸ <`E`\>(`event`, `...args`): `void`

Emits an event

##### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `...args` | `EventType`<`U`, `E`\>[] |

##### Returns

`void`

#### Defined in

[observable.ts:147](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L147)

___

### once

• **once**: <E\>(`event`: `E`, `listener`: `EventCallback`<`U`, `E`\>) => `Cleanup`

#### Type declaration

▸ <`E`\>(`event`, `listener`): `Cleanup`

Listen for an event once

##### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `listener` | `EventCallback`<`U`, `E`\> |

##### Returns

`Cleanup`

#### Defined in

[observable.ts:142](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L142)

## Methods

### install

▸ **install**<`C`\>(`component`): [`ObservableInstanceChild`](../modules.md#observableinstancechild)<`C`, [`ObservableEvents`](../interfaces/ObservableEvents.md)\>

Riot install this event emitter onto given riot component. To be used with `riot.install`, or independently on an as-needed basis.

#### Type parameters

| Name |
| :------ |
| `C` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `C` | Riot component |

#### Returns

[`ObservableInstanceChild`](../modules.md#observableinstancechild)<`C`, [`ObservableEvents`](../interfaces/ObservableEvents.md)\>

component with an obserable interface

#### Defined in

[observable.ts:323](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L323)

___

### observe

▸ **observe**<`C`\>(`component`, `prefix?`): [`ObservableInstanceChild`](../modules.md#observableinstancechild)<`C`, [`ObservableEvents`](../interfaces/ObservableEvents.md)\>

Observes given component as an extension of this observable instance.
Optionally prefix for dispatching within it's own context, while still
being able to be triggered by the original instance's events.

**`Example`**

```ts
const obs = new Observable();

const modal = {};

obs.observe(modal, 'modal');

modal.on('open', () => {});

obs.trigger('modal-open'); // opens modal
modal.trigger('open'); // calls the same event

modal.cleanup(); // clears all event listeners
```

#### Type parameters

| Name |
| :------ |
| `C` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `C` | Component to wrap events around |
| `prefix?` | `never` | Prefix this component will dispatch and listen to |

#### Returns

[`ObservableInstanceChild`](../modules.md#observableinstancechild)<`C`, [`ObservableEvents`](../interfaces/ObservableEvents.md)\>

#### Defined in

[observable.ts:219](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L219)

___

### off

▸ **off**<`E`\>(`event`, `listener?`): `void`

Stop listening for an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `listener?` | `EventCallback`<`U`, `E`\> |

#### Returns

`void`

#### Defined in

[observable.ts:392](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L392)

___

### on

▸ **on**<`E`\>(`event`, `listener`): `Cleanup`

Listen for an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `listener` | `EventCallback`<`U`, `E`\> |

#### Returns

`Cleanup`

#### Defined in

[observable.ts:341](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L341)

___

### one

▸ **one**<`E`\>(`event`, `listener`): `Cleanup`

Listen for an event once

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `listener` | `EventCallback`<`U`, `E`\> |

#### Returns

`Cleanup`

#### Defined in

[observable.ts:369](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L369)

___

### trigger

▸ **trigger**<`E`\>(`event`, `...args`): `void`

Emits an event

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `...args` | `EventType`<`U`, `E`\>[] |

#### Returns

`void`

#### Defined in

[observable.ts:426](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L426)
