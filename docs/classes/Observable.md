[@riot-tools/sak](../README.md) / [Exports](../modules.md) / Observable

# Class: Observable<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Constructors

- [constructor](Observable.md#constructor)

### Properties

- [$\_callbacks](Observable.md#$_callbacks)
- [$\_ref](Observable.md#$_ref)
- [$\_spy](Observable.md#$_spy)
- [$\_target](Observable.md#$_target)

### Methods

- [install](Observable.md#install)
- [observe](Observable.md#observe)
- [off](Observable.md#off)
- [on](Observable.md#on)
- [one](Observable.md#one)
- [trigger](Observable.md#trigger)

## Constructors

### constructor

• **new Observable**<`T`\>(`target?`, `options?`)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target?` | `T` |
| `options?` | `ObservableOptions` |

#### Defined in

[observable.ts:121](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L121)

## Properties

### $\_callbacks

• **$\_callbacks**: `EventCallbacksMap`

#### Defined in

[observable.ts:116](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L116)

___

### $\_ref

• `Optional` **$\_ref**: `String`

#### Defined in

[observable.ts:119](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L119)

___

### $\_spy

• `Optional` **$\_spy**: `ObserverSpy`

#### Defined in

[observable.ts:118](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L118)

___

### $\_target

• **$\_target**: `any` = `null`

#### Defined in

[observable.ts:117](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L117)

## Methods

### install

▸ **install**<`C`\>(`component`): `C` & [`ObservedComponent`](../modules.md#observedcomponent) & `Cleanup`

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

`C` & [`ObservedComponent`](../modules.md#observedcomponent) & `Cleanup`

component with an obserable interface

#### Defined in

[observable.ts:285](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L285)

___

### observe

▸ **observe**<`C`\>(`component`, `prefix?`): `C` & [`ObservedComponent`](../modules.md#observedcomponent) & `Cleanup`

Observes given component as an extension of this observable instance.
Optionally prefix for dispatching within it's own context, while still
being able to be triggered by the original instance's events.

**`example`**

const obs = new Observable();

const modal = {};

obs.observe(modal, 'modal');

modal.on('open', () => {});

obs.trigger('modal-open'); // opens modal
modal.trigger('open'); // calls the same event

modal.cleanup(); // clears all event listeners

#### Type parameters

| Name |
| :------ |
| `C` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `C` | Component to wrap events around |
| `prefix?` | `string` | Prefix this component will dispatch and listen to |

#### Returns

`C` & [`ObservedComponent`](../modules.md#observedcomponent) & `Cleanup`

#### Defined in

[observable.ts:189](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L189)

___

### off

▸ **off**(`event`, `listener?`): `void`

Stop listening for an event

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener?` | `Function` |

#### Returns

`void`

#### Defined in

[observable.ts:352](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L352)

___

### on

▸ **on**(`event`, `listener`): `Cleanup`

Listen for an event

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `Function` |

#### Returns

`Cleanup`

#### Defined in

[observable.ts:301](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L301)

___

### one

▸ **one**(`event`, `listener`): `Cleanup`

Listen for an event once

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `Function` |

#### Returns

`Cleanup`

#### Defined in

[observable.ts:329](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L329)

___

### trigger

▸ **trigger**(`event`, ...`args`): `void`

Emits an event

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[observable.ts:386](https://github.com/riot-tools/sak/blob/8a50b76/lib/observable.ts#L386)
