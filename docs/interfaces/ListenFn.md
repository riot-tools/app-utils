[@riot-tools/sak](../README.md) / [Exports](../modules.md) / ListenFn

# Interface: ListenFn<T, RT\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `RT` | `void` |

## Callable

### ListenFn

▸ **ListenFn**<`E`\>(`event`, `fn`): `RT`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `E` |
| `fn` | `EventCallback`<`T`, `E`\> |

#### Returns

`RT`

#### Defined in

[observable.ts:40](https://github.com/riot-tools/sak/blob/741d242/lib/observable.ts#L40)
