import {
    StrOrNum,
    PathsToValues
} from '../_helpers';

export type L10nLang = {
    [K in StrOrNum]: StrOrNum | L10nLang;
};

export const reachIn = <T = any>(obj: L10nLang, path: PathsToValues<L10nLang>, defValue: any): T => {

    // If path is not defined or it has false value
    if (!path) return undefined

    // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

    // Find value
    const result = pathArray.reduce(
        (prevObj, key) => prevObj && prevObj[key],
        obj as any
    );

    // If found value is undefined return default value; otherwise return the value
    return result === undefined ? defValue : result
}

export const deepMerge = <T extends L10nLang>(target: T, ...sources: T[]) => {

    for (const source of sources) {

        for (const k in source) {

            if (typeof source[k] === 'object') {

                const _t = (target || {}) as L10nLang;

                target[k] = deepMerge(
                    (_t)[k] || {},
                    source[k] as L10nLang
                ) as any;
            }
            else {

                target[k] = source[k];
            }
        }
    }


    return target;
}


export type L10nReacher<T> = PathsToValues<T>;
export type L10nFormatArgs = Array<StrOrNum> | Record<StrOrNum, StrOrNum>;
export const format = (str: string, values: L10nFormatArgs) => {

    const args = Object.entries(values);

    for (const [key, value] of args) {
        str = str?.replace(new RegExp(`\\{${key}\\}`, 'gi'), value.toString());
    }

    return str;
};

export const getMessage = <L extends L10nLang>(
    lang: L,
    reach: L10nReacher<L>,
    values?: L10nFormatArgs
) => {

    const str = reachIn(lang, reach, '?') as string;

    return format(str, values || []);
};


export const LANG_CHANGE = 'language-change';
export const LANG_INSTALL = 'language-install';
export const LANG_UNINSTALL = 'language-uninstall';

export class L10nEvent<Code extends string = string, C = any> extends Event {
    component?: C;
    code: Code;
}

export type L10nEventName = (
    'language-change' |
    'language-install' |
    'language-uninstall'
);

export type L10nListener<Code extends string = string> = (e: L10nEvent<Code, any>) => void;