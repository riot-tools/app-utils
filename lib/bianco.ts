const document = window.document;

export const $ = (selector: string, ctx?: Element): Element[] => {

    const elements = (ctx || document).querySelectorAll(selector);

    return Array.from(elements);
};


type ManyElements = Element | Element[];

const _itemsToArray = <T>(els: T | T[]): T[] => {

    if (!Array.isArray(els)) {

        els = [els as T];
    }

    return els;
}

export class HtmlEvents {

    static _split = e => e.split(/\s/);

    static _eachEvent(events: string, callback: Function) {

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


    static get(els: ManyElements, name: string): string | string[] {

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


    static remove(els: ManyElements, names: string | string[]) {

        const elements = _itemsToArray(els);

        names = _itemsToArray(names);

        const props = names.reduce((list, prop) => {

            list[prop] = '';
            return list;
        }, {});

        this.set(els, props);

        return elements;
    }

    static has(els: ManyElements, name: string): boolean | boolean[] {

        let elements = _itemsToArray(els);

        const result = [...elements].map(el => (el as Element).hasAttribute(name))

        if (result.length === 1) {
            return result[0]
        }

        return result;
    }
}

export class HtmlCss {


    static _sanitize(name: string): string {

        const isFloat = name === 'float';

        if (isFloat) {

            return 'cssFloat';
        }

        return name.replace(/(.+)-(.)/, (_s, m1, m2) => m1 + m2.toUpperCase())
    }

    static get(els: ManyElements, names: string | string[]): string | object | object[] {

        const elements = _itemsToArray(els);
        const properties = _itemsToArray(names);

        let result = [...elements].map(el => properties.reduce((list, prop) => {

            prop = this._sanitize(prop);
            const style = global.window.getComputedStyle(el);
            list[prop] = style[prop];

            return list;
        }, {}))

        if (properties.length === 1) {

            result = result.map(value => value[properties[0]]);
        }

        if (result.length === 1) {
            return result[0];
        }

        return result;
    }

    static set(els: ManyElements, props: Partial<CSSStyleDeclaration>): ManyElements {

        const elements = _itemsToArray(els);
        const entries = Object.entries(props);

        for (const [key, value] of entries) {

            const prop = this._sanitize(key);
            elements.map((el) => (el as HTMLElement).style[prop] = value);
        }

        return elements;
    }


    static remove(els: ManyElements, names: string | string[]) {

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

/**
 * Get the max value from a list of arguments filtering the falsy values
 * @private
 * @param   {...number} args - list of numbers
 * @returns { number } the highest value
 */
const max = (...args) => Math.max(0, ...args.filter((v => !!v)), 0);

export class HtmlViewport {

    /**
     * Return the size of the scrollbar that depends on the browser or device used on the client
     * @returns { number } - the browser scrollbar width
     */
    static get scrollbarWidth() {

        // Create the measurement node
        const div = document.createElement('div')

        Object.assign(div.style, {
            width: '100px',
            height: '100px',
            overflow: 'scroll',
            position: 'fixed',
            opacity: '0'
        });

        document.body.appendChild(div);

        // Read values
        const { offsetWidth, clientWidth } = div;

        // Delete helper element
        document.body.removeChild(div);

        return max(offsetWidth - clientWidth);
    }

    /**
     * Get the height of the whole page
     * @returns { number } height in px of the document
     */
    static get documentHeight() {

        return max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
    }

    /**
     * Get the width of the whole page
     * @returns { number } width in px of the document
     */
    static get documentWidth() {

        return max(
            document.body.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.clientWidth,
            document.documentElement.scrollWidth,
            document.documentElement.offsetWidth
        );
    }

    /**
     * Return amount of px scrolled from the top of the document
     * @returns { number } scroll top value in px
     */
    static get scrollTop() {

        return max(
            global.window.scrollY,
            global.window.pageYOffset,
            document.documentElement.scrollTop
        );
    }

    /**
     * Return amount of px scrolled from the left of the document
     * @returns { number } scroll left value in px
     */
    static get scrollLeft() {
        return max(
            global.window.scrollX,
            global.window.pageXOffset,
            document.documentElement.scrollLeft
        );
    }


    /**
     * Get the offset top of any DOM element
     * @param { HTMLElement } el - the element we need to check
     * @returns { number } the element y position in px
     */
    static elementOffsetTop(el) {

        return max(this.scrollTop + el.getBoundingClientRect().top)
    }

    /**
     * Get the offset left of any DOM element
     * @param { HTMLElement } el - the element we need to check
     * @returns { number } the element x position in px
     */
    static elementOffsetLeft(el) {

        return max(this.scrollLeft + el.getBoundingClientRect().left)
    }

}