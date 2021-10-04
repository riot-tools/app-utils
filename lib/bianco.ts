const document = window.document;

export const $ = (selector: string, ctx?: Element): Element[] => {

    const elements = (ctx || document).querySelectorAll(selector);

    return Array.from(elements);
};


type ManyElements = EventTarget | EventTarget[] | NodeListOf<Element>;

const _itemsToArray = <T>(els: T | T[]): T[] => {

    if (!Array.isArray(els)) {

        els = [els as T];
    }

    return els;
};

const _split = e => e.split(/\s/);

type DomEvent = (
    EventModifierInit |
    KeyboardEvent |
    MouseEvent |
    TouchEvent
);
interface EventCallback {
    <T extends DomEvent>(event: T): any;
}

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
    static on(els: ManyElements, events: string, callback: EventCallback, opts?: EventListenerOptions) {

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
    static one(els: ManyElements, events: string, callback: EventCallback, opts?: EventListenerOptions) {

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
    static off(els: ManyElements, events: string, callback: EventCallback, opts?: EventListenerOptions) {

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
};

interface StringProps { [key: string]: string };
interface BoolProps { [key: string]: boolean };

const oneOrMany = <T extends { length: number }>(items: T): T => {

    if (items.length === 1) {
        return items[0]
    }

    return items;
};

export class HtmlAttr {

    private static _eachItem(propNames: string[] | string[][], callback: Function) {

        return propNames.map(item => callback(item));
    }

    private static _eachElement(
        els: ManyElements,
        propNames: string | string[] | string[][],
        callback: (element: Element, prop: string | [string, string]) => unknown
    ) {

        const elements = _itemsToArray(els) as Element[];
        const props = _itemsToArray(propNames as string);

        return elements.map((element) => this._eachItem(props, (prop: string) => (

            callback(element, prop)
        )));
    }

    /**
     * Returns attributes on one or many html elements
     * @param els list of html elements
     * @param propNames attribute
     *
     * @example
     *
     * HtmlAttr.get(form, 'method');
     * // > 'post'
     *
     * HtmlAttr.get([select, input], 'name');
     * // > ['role', 'full_name']
     *
     * HtmlAttr.get(form, ['method', 'action']);
     * // > { method: 'post', action: '/' }
     *
     * HtmlAttr.get([select, input], ['name', 'value']);
     * // > [{ name: '', value: '' }, { name: '', value: '' }]
     */
    static get(els: ManyElements, propNames: string |  string[]): (
        string | string[] |
        StringProps | StringProps[]
    ) {

        const entries = this._eachElement(
            els,
            propNames,
            function (element, prop) {

                return [prop, element.getAttribute(prop as string)];
            }
        );

        if (typeof propNames === 'string') {

            const results = entries.map((props) => props[0][1]) as string[];

            return oneOrMany(results);
        }

        if (Array.isArray(propNames)) {

            const results = entries.map((props) => Object.fromEntries(props)) as StringProps[];
            return oneOrMany(results);
        }
    }

    /**
     *
     * @param els
     * @param props
     *
     * @example
     *
     * HtmlAttr.set(input, { name: 'full_name' });
     * HtmlAttr.set([div, div, div], { 'data-show': 'false' });
     */
    static set(els: ManyElements, props: StringProps): ManyElements {

        this._eachElement(
            els,
            Object.entries(props),
            (element, [name, value]) => {

                element.setAttribute(name, value);
            }
        );

        return els;
    }


    static remove(els: ManyElements, propNames: string | string[]) {


        this._eachElement(
            els,
            propNames,
            (element, prop) => {

                element.removeAttribute(prop as string);
            }
        );

        return els;
    }

    /**
     *
     * @param els
     * @param propNames
     *
     * HtmlAttr.has(form, 'method');
     * // > true
     *
     * HtmlAttr.has([select, input], 'name');
     * // > [true, true]
     *
     * HtmlAttr.has(form, ['method', 'action']);
     * // > { method: true, action: true }
     *
     * HtmlAttr.has([select, input], ['name', 'value']);
     * // > [{ name: true, value: true }, { name: true, value: true }]
     */
    static has(
        els: ManyElements,
        propNames: string | string[]
    ): (
        boolean | boolean[] |
        BoolProps | BoolProps[]
    ) {


        const entries = this._eachElement(
            els,
            propNames,
            (element, prop) => (

                [prop, element.hasAttribute(prop as string)]
            )
        );


        if (typeof propNames === 'string') {

            const results = entries.map((props) => props[0][1]) as boolean[];

            return oneOrMany(results);
        }

        if (Array.isArray(propNames)) {

            const results = entries.map((props) => Object.fromEntries(props)) as BoolProps[];
            return oneOrMany(results);
        }

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
    static get(els: ManyElements, propNames: string | string[]): string | Partial<CSSStyleDeclaration> | Partial<CSSStyleDeclaration>[] {

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

        return oneOrMany(result);
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