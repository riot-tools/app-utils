import { makeOnBeforeMount, makeOnBeforeUnmount, makeOnMounted } from "..";

import {
    DeepOptional,
    PathsToValues,
    assert
} from '../_helpers';

import {
    deepMerge,
    getMessage,
    L10nLang,
    L10nFormatArgs,
    L10nEvent,
    L10nEventName,
    L10nListener,
    LANG_CHANGE,
    LANG_INSTALL,
    LANG_UNINSTALL,
} from "./_helpers";

type ManyLangs<Lang extends L10nLang, Code extends string> = {
    [P in Code]: {
        code: Code,
        text: string,
        labels: Lang | DeepOptional<Lang>
    }
}

export type L10nComponent<
    Lang extends L10nLang,
    Code extends string = string
> = {
    t: L10n<Lang, Code>['t']
}

export type L10nOpts<
    Lang extends L10nLang,
    Code extends string = string
> = {

    current: Code,
    fallback: Code
    langs: ManyLangs<Lang, Code>
}

/**
 * Module for handling text and labels throughout your app and within components.
 *
 * @example
 *
 * const english = {
 *      my: { nested: {
 *          key: '{0}, I like bacon. {1}, I like eggs.'
 *          key2: '{first}, I like steak. {second}, I like rice.'
 *      }}
 * }
 *
 * const spanish = {
 *      my: { nested: {
 *          key: '{0}, me gusta el bacon. {1}, me gustan los huevos.'
 *          key2: '{first}, me gusta la carne de res. {second}, me gusta el arroz.'
 *      }}
 * }
 *
 * const langMngr = new L10n({
 *      current: 'en',
 *      fallback: 'en'
 *      langs: {
 *          en: english,
 *          es: spanish
 *      }
 * });
 *
 * langMngr.t('my.nested.key', ['Yes', 'No']);
 * // > "Yes, I like bacon. No, I like eggs."
 *
 * langMngr.t('my.nested.key2', { first: 'Ofcourse', second: 'Obviously' });
 * // > "Ofcourse, I like steak. Obviously, I like rice."
 *
 * const onChange = (e) => sendToAnalytics(e.code);
 *
 * langMng.on('language-change', onChange);
 *
 * langMngr.changeTo('es');
 *
 * langMngr.t('my.nested.key2', { first: 'Claro', second: 'Obviamente' });
 * // > "Claro, me gusta la carne de res. Obviamente, me gusta el arroz."
 *
 * langMng.off('language-change', onChange);
 */
export class L10n<
    Lang extends L10nLang,
    Code extends string = string
> extends EventTarget {

    langs: ManyLangs<Lang, Code>;
    fallback: Code;
    current: Code;

    /**
     * Returns a label with replaceable variables
     *
     * @example
     *
     * const theLang = {
     *      my: { nested: {
     *          key: '{0}, I like bacon. {1}, I like eggs.'
     *          key2: '{first}, I like steak. {second}, I like rice.'
     *      }}
     * }
     *
     * t('my.nested.key', ['Yes', 'No']);
     * // > "Yes, I like bacon. No, I like eggs."
     *
     * t('my.nested.key2', { first: 'Ofcourse', second: 'Obviously' });
     * // > "Ofcourse, I like steak. Obviously, I like rice."
     */
    t: L10n<Lang, Code>['text'];

    private _lang: Lang;


    constructor(opts: L10nOpts<Lang, Code>) {

        super();

        assert(!!opts.current, 'Current language not set');
        assert(!!opts.fallback, 'Fallback language not set');
        assert(!!opts.langs, 'Languages config is not set');
        assert(typeof opts.langs === 'object', 'Languages config is not an object');
        assert(!Array.isArray(opts.langs), 'Languages config can not be an array');

        this.langs = opts.langs;
        this.current = opts.current;
        this.fallback = opts.fallback;

        this.t = this.text.bind(this);

        this.mergeLangs();
    }

    on(
        ev: L10nEventName,
        listener: L10nListener<Code>,
        once = false
    ) {

        this.addEventListener(ev, listener, { once });
    }

    off(ev: L10nEventName, listener: EventListenerOrEventListenerObject) {

        this.removeEventListener(ev, listener);
    }

    private mergeLangs() {

        const fallback = this.langs[this.fallback];
        const current = this.langs[this.current];

        this._lang = deepMerge(
            {} as any,
            fallback.labels as Lang,
            current.labels as Lang
        );
    }


    get languages() {

        type LangConf = ManyLangs<Lang, Code>;

        const values = Object.values(this.langs) as LangConf[Code][];

        return values.map(
            ({ code, text }) => ({ code, text })
        )
    }

    text <K extends PathsToValues<Lang>>(key: K, values?: L10nFormatArgs) {

        return getMessage(this._lang, key, values);
    }

    changeTo(code: Code) {

        this.current = code;
        this.mergeLangs();

        const event = new L10nEvent<Code>(LANG_CHANGE);
        event.code = code;

        this.dispatchEvent(event);
    }

    install <C>(_component: C) {

        const component = _component as C & L10nComponent<Lang, Code>
        const self = this;

        let updateComponent: EventListenerOrEventListenerObject;

        makeOnBeforeMount(component, function () {

            component.t = self.t.bind(self);
        });

        makeOnMounted(component, function(this: C) {

            const thisComponent = this;


            const event = new L10nEvent<Code, C>(LANG_INSTALL);
            event.code = self.current;
            event.component = thisComponent;

            self.dispatchEvent(event);

            updateComponent = () => (thisComponent as any).update();

            self.addEventListener(LANG_CHANGE, updateComponent);
        });

        makeOnBeforeUnmount(component, function (this: C) {

            const thisComponent = this;

            const event = new L10nEvent<Code, C>(LANG_UNINSTALL);
            event.code = self.current;
            event.component = thisComponent;

            self.dispatchEvent(event);

            self.removeEventListener(LANG_CHANGE, updateComponent);
        });

        return component;
    }
}


const lang1 = {
    test: 'test',
    toot: {
        tit: {
            tats: 1
        }
    },
};

const l = new L10n<typeof lang1, 'es' | 'en'>({
    current: 'en',
    fallback: 'en',
    langs: {
        en: {
            code: 'en',
            text: 'English',
            labels: lang1
        },

        es: {
            code: 'es',
            text: 'Spanish',
            labels: lang1
        },
    },
})

l.t('toot.tit.tats');

l.changeTo('es');

l.on('language-change', (e) => {

    e.component
});