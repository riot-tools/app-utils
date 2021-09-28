const document = window.document;

export const $ = (selector: string, ctx?: Element): Element[] => {

    const elements = (ctx || document).querySelectorAll(selector);

    return Array.from(elements);
};


type ManyElements = Element | Element[] | NodeListOf<Element>;

const _itemsToArray = <T>(els: T | T[]): T[] => {

    if (!Array.isArray(els)) {

        els = [els as T];
    }

    return els;
};

const _split = e => e.split(/\s/);
export class HtmlEvents {


    private static _eachItem(events: string, callback: Function) {

        _split(events).forEach(callback);
    }

    private static _eachElement(els: ManyElements, evs: string, callback: Function) {

        const elements = _itemsToArray(els);

        for (const element of elements) {

            this._eachItem(evs, (event) => (

                callback(element, event)
            ));
        }
    }

    /**
     * Adds event listeners to dom event interfaces
     * @param els list of html elements
     * @param events events separated by space
     * @param callback
     * @param opts options to pass to addEventListener
     *
     * @example
     *
     * HtmlEvents.on(div, 'click', () => {});
     * HtmlEvents.on(div, 'focus blur', () => {});
     * HtmlEvents.on([div, input], 'focus blur', () => {});
     */
    static on(els: ManyElements, events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.addEventListener(event, callback, opts || false);
        });
    }

    /**
     * Adds event listeners to dom event interfaces that only run once
     * @param els list of html elements
     * @param events events separated by space
     * @param callback
     * @param opts options to pass to addEventListener
     *
     * @example
     *
     * HtmlEvents.one(div, 'click', () => {});
     * HtmlEvents.one(div, 'focus blur', () => {});
     * HtmlEvents.one([div, input], 'focus blur', () => {});
     */
    static one(els: ManyElements, events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.addEventListener(event, callback, {
                ...(opts || {}),
                once: true
            })
        });
    }

    /**
     * Removes event listeners on dom event interfaces
     * @param els list of html elements
     * @param events events separated by space
     * @param callback
     * @param opts options to pass to addEventListener
     *
     * @example
     *
     * HtmlEvents.off(div, 'click', callback);
     * HtmlEvents.off(div, 'focus blur', callback);
     * HtmlEvents.off([div, input], 'focus blur', callback);
     */
    static off(els: ManyElements, events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.removeEventListener(event, callback, opts || false);
        });
    }

    /**
     *
     * @param els list of html elements
     * @param event a single event
     * @param data Optional data to pass via `event.detail`
     */
    static trigger(els: ManyElements, event: string | Event, data?: any) {

        const elements = _itemsToArray(els) as HTMLElement[];

        for (const element of elements) {

            if (typeof event === 'string') {

                event = new window.CustomEvent(event, { detail: data });
            }

            element.dispatchEvent(event);
        }
    }
}

type StringProps = { [key: string]: string };


// TODO: This should be similar to events where _eachItem and _eachElement
// TODO: are the things that handle iterating over props or elements
export class HtmlAttr {

    private static _eachItem(propNames: string, callback: Function) {

        return _split(propNames).map(callback);
    }

    private static _eachElement(els: ManyElements, propNames: string, callback: Function) {

        const elements = _itemsToArray(els);

        return elements.map((element) => this._eachItem(propNames, (props: string[]) => (

        )));

        for (const element of elements) {

            this._eachItem(propNames, (event) => (

                callback(element, event)
            ));
        }
    }

    /**
     * Returns attributes on one or many html elements
     * @param els list of html elements
     * @param name attribute
     *
     * @example
     *
     * HtmlAttr.get(form, 'method');
     * // > 'post'
     *
     * HtmlAttr.get([select, input], 'name');
     * // > ['role', 'full_name']
     */
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

    /**
     * Sanitize css properties; Kebab case to camel case.
     * @param name css property
     */
     private static _sanitize(name: string): string {

        const isFloat = name === 'float';

        if (isFloat) {

            return 'cssFloat';
        }

        return name.replace(/(.+)-(.)/, (_s, m1, m2) => m1 + m2.toUpperCase())
    }

    /**
     * Gets one or many css properties from one or many html elements.
     * @param els list of html elements
     * @param propNames property name or array of property names
     *
     * @example
     *
     * HtmlCss.get(div, 'color');
     * // > 'red'
     *
     * HtmlCss.get([div, span], 'color');
     * // > ['red', 'blue']
     *
     * HtmlCss.get(div, ['color', 'fontSize']);
     * // > { color: 'red', fontSize: '12px' }
     *
     * HtmlCss.get([div, span], ['color', 'fontSize']);
     * // > [{ color: 'red', fontSize: '12px' }, { color: 'blue', fontSize: '10px' }]
     *
     */
    static get(els: ManyElements, propNames: string | string[]): string | object | object[] {

        const elements = _itemsToArray(els);
        const properties = _itemsToArray(propNames);

        let result = [...elements].map(el => properties.reduce((list, prop) => {

            prop = this._sanitize(prop);
            const style = global.window.getComputedStyle(el as HTMLElement);
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

    /**
     *
     * @param els list of html elements
     * @param props CSS style props (div.style.fontSize);
     *
     * @example
     *
     * HtmlCss.set([div, span], {
     *      color: 'blue',
     *      paddingRight: '10px'
     * });
     *
     * HtmlCss.set(div, {
     *      color: 'blue',
     *      paddingRight: '10px'
     * });
     */
    static set(els: ManyElements, props: Partial<CSSStyleDeclaration>): ManyElements {

        const elements = _itemsToArray(els);
        const entries = Object.entries(props);

        for (const [key, value] of entries) {

            const prop = this._sanitize(key);
            elements.map((el) => (el as HTMLElement).style[prop] = value);
        }

        return elements as Element[];
    }

    /**
     * Removes properties from html elements
     * @param els list of html elements
     * @param propNames property name or array of property names
     *
     * @example
     *
     * HtmlCss.remove(div, 'color');
     * HtmlCss.remove([div, span], 'color');
     * HtmlCss.remove(div, ['color', 'fontSize']);
     * HtmlCss.remove([div, span], ['color', 'fontSize']);
     */
    static remove(els: ManyElements, propNames: string | string[]) {

        const elements = _itemsToArray(els);

        propNames = typeof propNames === 'string' ? [propNames] : propNames;

        const props = propNames.reduce((list, prop) => {

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