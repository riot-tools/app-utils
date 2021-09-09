/**
 * Originally https://github.com/riot/observable
 *
 * Revamped to include strong type support, OOP, nested observers, and debugging tools
 */

import OptionsValidator from "./options-validator";

const ALL_CALLBACKS = '*'
const define = Object.defineProperties

type CallbacksSet = Set<Function>;
type EventCallbacksMap = Map<string, CallbacksSet>

export interface ListenFn {
    (event: string, fn: Function): void
}

export interface EmitterFn {
    (event: string, ...args: any[]): void
}

type Cleanup = {
    cleanup: () => void
}

export type ObservedComponent = {
    on: ListenFn & Cleanup,
    one: ListenFn,
    off: ListenFn,
    trigger: EmitterFn
};

export type ObservableInstanceChild = ObservedComponent & Cleanup


const freezeProp = () => ({

    enumerable: false,
    writable: false,
    configurable: false,
})

const defineOpts = (value: any) => ({

    ...freezeProp(),
    value
});

type ObservableFunctionName = 'on' | 'one' | 'off' | 'trigger';

type OberverSpyOptions = {
    event: string,
    listener?: Function,
    args?: any[],
};

type ObserverSpyEvent = OberverSpyOptions & {
    fn: ObservableFunctionName,
    context: Observable<any>
}

interface ObserverSpy {
    (event: ObserverSpyEvent): void
}

const sendToSpy = (
    fn: string,
    context: any,
    {
        event,
        listener = null,
        args = null
    }: OberverSpyOptions
) => {

    if (context.$_spy) {

        context.$_spy.call(context.$_spy, {
            fn,
            event,
            listener,
            context,
            args
        });
    }
}

type ObservableOptions = {
    ref?: string,
    spy?: Function
};

const validator = new OptionsValidator({
    ref: 'String',
    spy: 'Function'
});

export default class Observable<T> {

    $_callbacks: EventCallbacksMap = new Map();
    $_target: any = null;
    $_spy?: ObserverSpy;
    $_ref?: String;

    constructor(target?: T, options?: ObservableOptions) {

        const self = this;
        this.$_target = target || this;

        if (target) {

            define(target, {
                on: defineOpts((ev: string, fn: Function) => self.on(ev, fn)),
                one: defineOpts((ev: string, fn: Function) => self.one(ev, fn)),
                off: defineOpts((ev: string, fn: Function) => self.off(ev, fn)),
                trigger: defineOpts((ev: string, ...args: any[]) => self.trigger(ev, ...args)),
                observe: defineOpts((component: any, prefix?: string) => self.observe(component, prefix)),
            });
        }
        else {

            define(this, {
                on: defineOpts(this.on),
                one: defineOpts(this.one),
                off: defineOpts(this.off),
                trigger: defineOpts(this.trigger),
                observe: defineOpts(this.observe),
                $_callbacks: defineOpts(this.$_callbacks),
                $_target: defineOpts(this.$_target)
            });
        }

        if (options) {

            validator.validate(options);

            options.ref && define(this, { $_ref: defineOpts(options.ref) });
            options.spy && define(this, { $_spy: defineOpts(options.spy) });
        }

        return this.$_target;
    }


    /**
     * Observes given component as an extension of this observable instance.
     * Optionally prefix for dispatching within it's own context, while still
     * being able to be triggered by the original instance's events.
     * @param component Component to wrap events around
     * @param prefix Prefix this component will dispatch and listen to
     *
     * @example
     *
     * const obs = new Observable();
     *
     * const modal = {};
     *
     * obs.observe(modal, 'modal');
     *
     * modal.on('open', () => {});
     *
     * obs.trigger('modal-open'); // opens modal
     * modal.trigger('open'); // calls the same event
     *
     * modal.cleanup(); // clears all event listeners
     */
    observe<C>(component: C, prefix?: string): C & ObservableInstanceChild {

        const self = this;

        let namedEvent = (ev: string) => {

            return `${prefix}-${ev}`;
        };

        if (!prefix) {

            namedEvent = (ev) => ev;
        }

        const observer = new Observable({}, {
            ref: `${this.$_ref || 'parent'}-${prefix || 'child'}`,
            spy: this.$_spy
        });

        define(component, {

            on: defineOpts(
                (ev: string, fn: Function) => {

                    const { cleanup: cleanupChild } = observer.on(ev, fn);
                    const { cleanup: cleanupParent } = self.on(namedEvent(ev), fn);

                    return {
                        cleanup: () => (cleanupChild(), cleanupParent())
                    };
                }
            ),

            one: defineOpts(
                (ev: string, fn: Function) => {

                    observer.one(ev, fn);
                    self.one(namedEvent(ev), fn);
                }
            ),

            off: defineOpts(
                (ev: string, fn?: Function) => {

                    // Handle removing all callbacks from this instance related to child observable. Only all of the child instance's callbacks should be removed.
                    if (ev === ALL_CALLBACKS) {

                        for (const [ev, listeners] of observer.$_callbacks.entries()) {

                            for (const listener of listeners) {

                                self.off(ev, listener);
                            }
                        }
                    }
                    else {

                        self.off(namedEvent(ev), fn);
                    }

                    observer.off(ev, fn);
                }
            ),

            trigger: defineOpts(
                (ev: string, ...args: any[]) => {

                    observer.trigger(ev, ...args);
                    self.trigger(namedEvent(ev), ...args);
                }
            ),

            cleanup: defineOpts(
                () => {

                    observer.off('*');
                }
            )
        });

        return component as C & ObservableInstanceChild;
    }

    /**
     * Riot install this event emitter onto given riot component. To be used with `riot.install`, or independently on an as-needed basis.
     * @param component Riot component
     * @returns component with an obserable interface
     */
    install<C>(component: C) {

        return this.observe(component);
    }

    /**
     * Listen for an event
     * @param event
     * @param listener
     * @returns {Cleanup}
     */
    on(event: string, listener: Function): Cleanup {

        if (this.$_spy) {

            sendToSpy('on', this, { event, listener });
        }

        const stored = this.$_callbacks.get(event);

        if (stored && !stored.has(listener)) {
            stored.add(listener);
        }

        if (!stored) {

            this.$_callbacks.set(event, new Set([listener]));
        }

        return {
            cleanup: () => this.off(event, listener)
        };
    }

    /**
     * Listen for an event once
     * @param event
     * @param listener
     */
    one(event: string, listener: Function) {

        if (this.$_spy) {

            sendToSpy('one', this, { event, listener });
        }

        const self = this;

        function on(...args: any[]) {

            self.off(event, on);
            listener.apply(self, args)
        }

        return self.on(event, on);
    }

    /**
     * Stop listening for an event
     * @param event
     * @param listener
     */
    off(event: string, listener?: Function) {

        if (this.$_spy) {

            sendToSpy('off', this, { event, listener });
        }

        if (event === ALL_CALLBACKS && !listener) {

            this.$_callbacks.clear()
        } else {

            if (listener) {
                const fns = this.$_callbacks.get(event)

                if (fns) {

                    fns.delete(listener)
                    if (fns.size === 0) this.$_callbacks.delete(event)
                }
            } else this.$_callbacks.delete(event)
        }
    }

    /**
     * Emits an event
     * @param event
     * @param args
     */
    trigger(event: string, ...args: any[]) {

        if (this.$_spy) {

            sendToSpy('trigger', this, { event, args });
        }

        const fns = this.$_callbacks.get(event)

        if (fns) fns.forEach(fn => fn.apply(this, args))

        if (this.$_callbacks.get(ALL_CALLBACKS) && event !== ALL_CALLBACKS) {
            this.trigger(ALL_CALLBACKS, event, ...args)
        }
    }
}