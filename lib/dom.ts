const Css = require('bianco.css');
const BiancoEvents = require('bianco.events');
const Viewport = require('bianco.viewport');

/**
 * Receives a form to clone, and a callback to manipulate the clone.
 * Appends a hidden form to DOM and then submits.
 * @param {HTMLFormElement} form The form element
 * @param {Function} cb The callback that will be passed cloned form
 */
export const formSubmitClone = (
    form: HTMLFormElement,
    cb: Function
) => {


    form.addEventListener('submit', (e) => {

        e.preventDefault();
        const clone = form.cloneNode(true) as HTMLFormElement;

        cb && cb(clone);

        clone.style.display = 'none';
        document.body.appendChild(clone);

        clone.submit();
    });
};

export const appendMany = (root: HTMLElement, ...children: HTMLElement[]) => {

    while (children.length) {

        // https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
        const child = children.shift()!;
        root.appendChild(child);
    }
};

export const displayBlock = (el: HTMLElement, visible: boolean) => Css.set(el, { display: visible ? 'block' : 'none' });
export const setVisible = (el: HTMLElement, visible: boolean) => Css.set(el, { visibility: visible ? 'visible' : 'hidden' });

export const isHtmlElement = (target: HTMLElement) => target instanceof HTMLElement;

export const viewport = () => {

    const documentWidth = Viewport.documentWidth();

    return {

        isMobile: documentWidth < 750,
        isTablet: documentWidth >= 750 && documentWidth <= 1080,
        isDesktop: documentWidth > 1080
    };
};


export const $ = (selector: string, ctx?: HTMLElement): Element[] => {

    const elements = (ctx || document).querySelectorAll(selector);

    return Array.from(elements);
};


type ManyElements = Element|Element[];

const _itemsToArray = <T>(els: T|T[]): T[] => {

    if (!Array.isArray(els)) {

        els = [els as T];
    }

    return els;
}

export class HtmlEvents {

    static _split = e => e.split(/\s/);

    static _eachEvent (events: string, callback: Function) {

        this._split(events).forEach(callback);
    }

    static _eachElement(els: ManyElements, evs: string, callback: Function) {

        const elements = _itemsToArray(els);

        for (const element of elements) {

            this._eachEvent(evs, (event) => (

                callback(element, event)
            ));
        }
    }


    static on(els: ManyElements, events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.addEventListener(event, callback, opts || false);
        });
    }

    static one(els: ManyElements, events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.addEventListener(event, callback, {
                ...(opts || {}),
                once: true
            })
        });
    }

    static off(els: ManyElements, events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.removeEventListener(event, callback, opts || false);
        });
    }
}

type StringProps = { [key: string]: string };

export class HtmlAttr {


    static get(els: ManyElements, name: string): string|string[] {

        let elements = _itemsToArray(els);

        const result = [...elements].map(el => (el as Element).getAttribute(name))

        if (result.length === 1) {
            return result[0]
        }

        return result;
    }

    static set(els: ManyElements, props: StringProps): ManyElements {

        const elements = _itemsToArray(els);
        const entries = Object.entries(props);

        for (const [key, value] of entries) {

            elements.forEach((el) => (el as Element).setAttribute(key, value));
        }

        return elements as Element[];
    }


    static remove(els: ManyElements, names: string|string[]) {

        const elements = _itemsToArray(els);

        names = _itemsToArray(names);

        const props = names.reduce((list, prop) => {

            list[prop] = '';
            return list;
        }, {});

        this.set(els, props);

        return elements;
    }

    static has(els: ManyElements, name: string): boolean|boolean[] {

        let elements = _itemsToArray(els);

        const result = [...elements].map(el => (el as Element).hasAttribute(name))

        if (result.length === 1) {
            return result[0]
        }

        return result;
    }
}

export class HtmlCss {


    static _sanitize(name) {

        return name === 'float' ? 'cssFloat' : name.replace(/(.+)-(.)/, (s, m1, m2) => m1 + m2.toUpperCase());
    }

    static get(els: ManyElements, names: string|string[]): object|object[] {

        const elements = _itemsToArray(els);
        const properties = _itemsToArray(names);

        const result = [...elements].map(el => properties.reduce((list, prop) => {

            prop = this._sanitize(prop);
            const style = window.getComputedStyle(el);
            list[prop] = style[prop];

            return list;
        }, {}))

        if (result.length === 1) {
            return result[0]
        }

        return result;
    }

    static set(els: ManyElements, props: StringProps): ManyElements {

        const elements = _itemsToArray(els);
        const entries = Object.entries(props);

        for (const [key, value] of entries) {

            const prop = this._sanitize(key);
            elements.map((el) => (el as HTMLElement).style[prop] = value);
        }

        return elements;
    }


    static remove(els: ManyElements, names: string|string[]) {

        const elements = _itemsToArray(els);

        names = typeof names === 'string' ? [names] : names;

        const props = names.reduce((list, prop) => {

            prop = this._sanitize(prop);
            list[prop] = '';
            return list;
        }, {});

        this.set(els, props);

        return elements;
    }

}