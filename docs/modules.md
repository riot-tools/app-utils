[@riot-tools/sak](README.md) / Exports

# @riot-tools/sak

## Table of contents

### Classes

- [HtmlAttr](classes/HtmlAttr.md)
- [HtmlCss](classes/HtmlCss.md)
- [HtmlEvents](classes/HtmlEvents.md)
- [HtmlViewport](classes/HtmlViewport.md)
- [Observable](classes/Observable.md)
- [OptionsValidator](classes/OptionsValidator.md)

### Interfaces

- [CustomValidatorFunction](interfaces/CustomValidatorFunction.md)
- [EmitterFn](interfaces/EmitterFn.md)
- [ListenFn](interfaces/ListenFn.md)
- [ObservableEventPrefix](interfaces/ObservableEventPrefix.md)
- [ObservableEvents](interfaces/ObservableEvents.md)
- [QueryableComponent](interfaces/QueryableComponent.md)

### Type Aliases

- [ObservableInstance](modules.md#observableinstance)
- [ObservableInstanceChild](modules.md#observableinstancechild)
- [ObservedComponent](modules.md#observedcomponent)
- [QueryableState](modules.md#queryablestate)

### Functions

- [$](modules.md#$)
- [appendMany](modules.md#appendmany)
- [displayBlock](modules.md#displayblock)
- [formSubmitClone](modules.md#formsubmitclone)
- [isHtmlElement](modules.md#ishtmlelement)
- [makeOnBeforeMount](modules.md#makeonbeforemount)
- [makeOnBeforeUnmount](modules.md#makeonbeforeunmount)
- [makeOnBeforeUpdate](modules.md#makeonbeforeupdate)
- [makeOnMounted](modules.md#makeonmounted)
- [makeOnUnmounted](modules.md#makeonunmounted)
- [makeOnUpdated](modules.md#makeonupdated)
- [makeQueryable](modules.md#makequeryable)
- [mergeState](modules.md#mergestate)
- [mkHook](modules.md#mkhook)
- [setVisible](modules.md#setvisible)

## Type Aliases

### ObservableInstance

Ƭ **ObservableInstance**<`T`, `U`\>: [`ObservedComponent`](modules.md#observedcomponent)<`U`\> & { `$_observer`: [`Observable`](classes/Observable.md)<`T`, `U`\> ; `$_ref?`: `String` ; `$_spy?`: `ObserverSpy`<`T`, `U`\> ; `observe`: [`Observable`](classes/Observable.md)<`T`, `U`\>[``"observe"``]  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `U` | [`ObservableEvents`](interfaces/ObservableEvents.md) |

#### Defined in

[observable.ts:62](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L62)

___

### ObservableInstanceChild

Ƭ **ObservableInstanceChild**<`T`, `U`\>: `T` & [`ObservedComponent`](modules.md#observedcomponent)<`U`\> & `Cleanup`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `U` | [`ObservableEvents`](interfaces/ObservableEvents.md) |

#### Defined in

[observable.ts:60](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L60)

___

### ObservedComponent

Ƭ **ObservedComponent**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`ObservableEvents`](interfaces/ObservableEvents.md) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `emit` | [`EmitterFn`](interfaces/EmitterFn.md)<`T`\> |
| `off` | [`ListenFn`](interfaces/ListenFn.md)<`T`\> |
| `on` | [`ListenFn`](interfaces/ListenFn.md)<`T`, `Cleanup`\> |
| `once` | [`ListenFn`](interfaces/ListenFn.md)<`T`\> |
| `one` | [`ListenFn`](interfaces/ListenFn.md)<`T`\> |
| `trigger` | [`EmitterFn`](interfaces/EmitterFn.md)<`T`\> |

#### Defined in

[observable.ts:51](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L51)

___

### QueryableState

Ƭ **QueryableState**<`S`\>: `S` & { `fetchError?`: `Error` \| ``null`` ; `isFetching?`: `boolean`  }

#### Type parameters

| Name |
| :------ |
| `S` |

#### Defined in

[queryable.ts:4](https://github.com/riot-tools/sak/blob/741d242/lib/queryable.ts#L4)

## Functions

### $

▸ **$**(`selector`, `ctx?`): `Element`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `string` |
| `ctx?` | `Element` |

#### Returns

`Element`[]

#### Defined in

[bianco.ts:3](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L3)

___

### appendMany

▸ **appendMany**(`root`, `...children`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Element` |
| `...children` | `Element`[] |

#### Returns

`void`

#### Defined in

[dom.ts:29](https://github.com/riot-tools/sak/blob/741d242/lib/dom.ts#L29)

___

### displayBlock

▸ **displayBlock**(`el`, `visible`): `ManyElements`<`Element`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `Element` |
| `visible` | `boolean` |

#### Returns

`ManyElements`<`Element`\>

#### Defined in

[dom.ts:39](https://github.com/riot-tools/sak/blob/741d242/lib/dom.ts#L39)

___

### formSubmitClone

▸ **formSubmitClone**(`form`, `cb`): `void`

Receives a form to clone, and a callback to manipulate the clone.
Appends a hidden form to DOM and then submits.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `form` | `HTMLFormElement` | The form element |
| `cb` | `Function` | The callback that will be passed cloned form |

#### Returns

`void`

#### Defined in

[dom.ts:9](https://github.com/riot-tools/sak/blob/741d242/lib/dom.ts#L9)

___

### isHtmlElement

▸ **isHtmlElement**(`target`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Element` |

#### Returns

`boolean`

#### Defined in

[dom.ts:42](https://github.com/riot-tools/sak/blob/741d242/lib/dom.ts#L42)

___

### makeOnBeforeMount

▸ **makeOnBeforeMount**<`P`, `S`, `T`\>(`component`, `fn`, `runAfter?`): `void`

Creates a

#### Type parameters

| Name |
| :------ |
| `P` |
| `S` |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `T` | riot component to make hook on |
| `fn` | `RiotHookComponent`<`P`, `S`\> | hook function |
| `runAfter?` | `boolean` | whether to run hook function before or after original |

#### Returns

`void`

#### Defined in

[meta.ts:26](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L26)

___

### makeOnBeforeUnmount

▸ **makeOnBeforeUnmount**<`P`, `S`, `T`\>(`component`, `fn`, `runAfter?`): `void`

Creates a

#### Type parameters

| Name |
| :------ |
| `P` |
| `S` |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `T` | riot component to make hook on |
| `fn` | `RiotHookComponent`<`P`, `S`\> | hook function |
| `runAfter?` | `boolean` | whether to run hook function before or after original |

#### Returns

`void`

#### Defined in

[meta.ts:26](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L26)

___

### makeOnBeforeUpdate

▸ **makeOnBeforeUpdate**<`P`, `S`, `T`\>(`component`, `fn`, `runAfter?`): `void`

Creates a

#### Type parameters

| Name |
| :------ |
| `P` |
| `S` |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `T` | riot component to make hook on |
| `fn` | `RiotHookComponent`<`P`, `S`\> | hook function |
| `runAfter?` | `boolean` | whether to run hook function before or after original |

#### Returns

`void`

#### Defined in

[meta.ts:26](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L26)

___

### makeOnMounted

▸ **makeOnMounted**<`P`, `S`, `T`\>(`component`, `fn`, `runAfter?`): `void`

Creates a

#### Type parameters

| Name |
| :------ |
| `P` |
| `S` |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `T` | riot component to make hook on |
| `fn` | `RiotHookComponent`<`P`, `S`\> | hook function |
| `runAfter?` | `boolean` | whether to run hook function before or after original |

#### Returns

`void`

#### Defined in

[meta.ts:26](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L26)

___

### makeOnUnmounted

▸ **makeOnUnmounted**<`P`, `S`, `T`\>(`component`, `fn`, `runAfter?`): `void`

Creates a

#### Type parameters

| Name |
| :------ |
| `P` |
| `S` |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `T` | riot component to make hook on |
| `fn` | `RiotHookComponent`<`P`, `S`\> | hook function |
| `runAfter?` | `boolean` | whether to run hook function before or after original |

#### Returns

`void`

#### Defined in

[meta.ts:26](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L26)

___

### makeOnUpdated

▸ **makeOnUpdated**<`P`, `S`, `T`\>(`component`, `fn`, `runAfter?`): `void`

Creates a

#### Type parameters

| Name |
| :------ |
| `P` |
| `S` |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `T` | riot component to make hook on |
| `fn` | `RiotHookComponent`<`P`, `S`\> | hook function |
| `runAfter?` | `boolean` | whether to run hook function before or after original |

#### Returns

`void`

#### Defined in

[meta.ts:26](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L26)

___

### makeQueryable

▸ **makeQueryable**<`T`, `Props`, `State`\>(`component`): `T` & [`QueryableComponent`](interfaces/QueryableComponent.md)<`State`\>

Adds functionality to riot components that allow them to
set its own state to isFetching while an async call is being made.
Any errors are recorded in the state's `fetchError` property

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Partial`<`RiotComponent`<`Props`, `State`\>\> |
| `Props` | {} |
| `State` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `T` |

#### Returns

`T` & [`QueryableComponent`](interfaces/QueryableComponent.md)<`State`\>

component with a fetchable interface

#### Defined in

[queryable.ts:51](https://github.com/riot-tools/sak/blob/741d242/lib/queryable.ts#L51)

___

### mergeState

▸ **mergeState**<`Component`, `State`\>(`component`, `state`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Component` | extends `Partial`<`RiotComponent`<`any`, `any`\>\> |
| `State` | extends `object` = {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `Component` |
| `state` | `State` |

#### Returns

`void`

#### Defined in

[meta.ts:64](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L64)

___

### mkHook

▸ **mkHook**<`P`, `S`\>(`hook`): `MakeHook`

Closure to implement stackable hooks

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `any` |
| `S` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `hook` | `HookKeys` |

#### Returns

`MakeHook`

#### Defined in

[meta.ts:35](https://github.com/riot-tools/sak/blob/741d242/lib/meta.ts#L35)

___

### setVisible

▸ **setVisible**(`el`, `visible`): `ManyElements`<`Element`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `Element` |
| `visible` | `boolean` |

#### Returns

`ManyElements`<`Element`\>

#### Defined in

[dom.ts:40](https://github.com/riot-tools/sak/blob/741d242/lib/dom.ts#L40)
