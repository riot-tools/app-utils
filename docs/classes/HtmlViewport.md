[@riot-tools/sak](../README.md) / [Exports](../modules.md) / HtmlViewport

# Class: HtmlViewport

## Table of contents

### Constructors

- [constructor](HtmlViewport.md#constructor)

### Accessors

- [documentHeight](HtmlViewport.md#documentheight)
- [documentWidth](HtmlViewport.md#documentwidth)
- [scrollLeft](HtmlViewport.md#scrollleft)
- [scrollTop](HtmlViewport.md#scrolltop)
- [scrollbarWidth](HtmlViewport.md#scrollbarwidth)

### Methods

- [elementOffsetLeft](HtmlViewport.md#elementoffsetleft)
- [elementOffsetTop](HtmlViewport.md#elementoffsettop)

## Constructors

### constructor

• **new HtmlViewport**()

## Accessors

### documentHeight

• `Static` `get` **documentHeight**(): `number`

Get the height of the whole page

#### Returns

`number`

height in px of the document

#### Defined in

[bianco.ts:538](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L538)

___

### documentWidth

• `Static` `get` **documentWidth**(): `number`

Get the width of the whole page

#### Returns

`number`

width in px of the document

#### Defined in

[bianco.ts:553](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L553)

___

### scrollLeft

• `Static` `get` **scrollLeft**(): `number`

Return amount of px scrolled from the left of the document

#### Returns

`number`

scroll left value in px

#### Defined in

[bianco.ts:581](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L581)

___

### scrollTop

• `Static` `get` **scrollTop**(): `number`

Return amount of px scrolled from the top of the document

#### Returns

`number`

scroll top value in px

#### Defined in

[bianco.ts:568](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L568)

___

### scrollbarWidth

• `Static` `get` **scrollbarWidth**(): `number`

Return the size of the scrollbar that depends on the browser or device used on the client

#### Returns

`number`

- the browser scrollbar width

#### Defined in

[bianco.ts:510](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L510)

## Methods

### elementOffsetLeft

▸ `Static` **elementOffsetLeft**(`el`): `number`

Get the offset left of any DOM element

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `el` | `any` | the element we need to check |

#### Returns

`number`

the element x position in px

#### Defined in

[bianco.ts:605](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L605)

___

### elementOffsetTop

▸ `Static` **elementOffsetTop**(`el`): `number`

Get the offset top of any DOM element

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `el` | `any` | the element we need to check |

#### Returns

`number`

the element y position in px

#### Defined in

[bianco.ts:595](https://github.com/riot-tools/sak/blob/741d242/lib/bianco.ts#L595)
