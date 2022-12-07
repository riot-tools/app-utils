[@riot-tools/sak](../README.md) / [Exports](../modules.md) / EmitterFn

# Interface: EmitterFn<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Callable

### EmitterFn

▸ **EmitterFn**<`E`\>(`event`, `...args`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `...args` | `EventType`<`T`, `E`\>[] |

#### Returns

`void`

#### Defined in

[observable.ts:44](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L44)
