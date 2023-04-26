export type OneOrManyElements<T extends Node = Element> = T | T[];

export const itemsToArray = <T>(els: T | T[]): T[] => {

    if (!Array.isArray(els)) {

        els = [els];
    }

    return els;
};

export interface StringProps { [key: string]: string };

export interface BoolProps { [key: string]: boolean };

export const oneOrMany = <T>(items: T[]): T | T[] => {

    if (items.length === 1) {
        return items[0]
    }

    return items;
};
