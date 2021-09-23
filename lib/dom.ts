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

class HtmlEvents {

    _split = e => e.split(/\s/);

    _elements(els: Element|Element[]) {
        if (!Array.isArray(els)) {

            els = [els];
        }

        return els;
    }

    _eachEvent (events: string, callback: Function) {

        this._split(events).forEach(callback);
    }

    _eachElement(els: Element|Element[], evs: string, callback: Function) {

        const elements = this._elements(els);

        for (const element of elements) {

            this._eachEvent(evs, (event) => (

                callback(element, event)
            ));
        }
    }


    on(els: Element|Element[], events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.addEventListener(event, callback, opts || false);
        });
    }

    one(els: Element|Element[], events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.addEventListener(event, callback, {
                ...(opts || {}),
                once: true
            })
        });
    }

    off(els: Element|Element[], events: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOptions) {

        this._eachElement(els, events, (element, event) => {

            element.removeEventListener(event, callback, opts || false);
        });
    }
}

export const htmlEvents = new HtmlEvents();