import { HtmlCss } from './bianco'

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

export const appendMany = (root: Element, ...children: Element[]) => {

    while (children.length) {

        // https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
        const child = children.shift()!;
        root.appendChild(child);
    }
};

export const displayBlock = (el: Element, visible: boolean) => HtmlCss.set(el, { display: visible ? 'block' : 'none' });
export const setVisible = (el: Element, visible: boolean) => HtmlCss.set(el, { visibility: visible ? 'visible' : 'hidden' });

export const isHtmlElement = (target: Element) => target instanceof HTMLElement;
