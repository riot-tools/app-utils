/**
 * Originally https://github.com/riot/observable
 *
 * Revamped to include strong type support, OOP, nested observers, and debugging tools
 */

import { makeOnBeforeUnmount } from "./meta";
import OptionsValidator from "./options-validator";

const ALL_CALLBACKS = '*'
const define = Object.defineProperties

type CallbacksSet = Set<Function>;
type EventCallbacksMap = Map<string, CallbacksSet>

export interface ListenFn<RT = void> {
    (event: string, fn: Function): RT
}

export interface EmitterFn {
    (event: string, ...args: any[]): void
}

type Cleanup = {
    cleanup: () => void
}

export type ObservedComponent = {
    on: ListenFn<Cleanup>,
    one: ListenFn,
    off: ListenFn,
    trigger: EmitterFn
};

export type ObservableInstanceChild<T> = T & ObservedComponent & Cleanup

export type ObservableInstance<T> = ObservedComponent & {
    observe: Observable<T>['observe'],
    $_spy?: ObserverSpy<T>;
    $_ref?: String;
    $_observer: Observable<T>
}


/**
 * Defines an object's properties and makes them non-enumerable
 * or configurable.
 * @param value
 * @returns object define property values
 */
const defineOpts = <T>(value: T, configurable = false) => ({

    enumerable: false,
    writable: false,
    configurable,
    value
});

type ObservableFunctionName = 'on' | 'one' | 'off' | 'trigger';

type OberverSpyOptions = {
    event: string,
    listener?: Function,
    args?: any[],
};

type ObserverSpyEvent<T> = OberverSpyOptions & {
    fn: ObservableFunctionName,
    context: Observable<T>
}

interface ObserverSpy<T> {
    (event: ObserverSpyEvent<T>): void
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

type ObservableOptions<T> = {
    ref?: string,
    spy?: ObserverSpy<T>
};

const validator = new OptionsValidator({
    ref: 'String',
    spy: 'Function'
});

export class Observable<T> {

    $_callbacks: EventCallbacksMap = new Map();
    $_target: any = null;
    $_spy?: ObserverSpy<T>;
    $_ref?: String;

    constructor(target?: T, options?: ObservableOptions<T>) {

        const self = this;
        this.$_target = target || this;

        // Make these functions non-enumerable
        define(this, {
            on: defineOpts(this.on),
            one: defineOpts(this.one),
            off: defineOpts(this.off),
            trigger: defineOpts(this.trigger),
            observe: defineOpts(this.observe),
            $_callbacks: defineOpts(this.$_callbacks),
            $_target: defineOpts(this.$_target),
            $_spy: defineOpts(this.$_spy, true),
            $_ref: defineOpts(this.$_ref, true)
        });

        // Validate option if exists
        if (options) {

            validator.validate(options);

            options.ref && define(this, { $_ref: defineOpts(options.ref) });
            options.spy && define(this, { $_spy: defineOpts(options.spy) });
        }

        // Wrapper functions if you want to observe a target
        // Defined to make them non-enumerable
        if (target) {

            define(target, {
                on: defineOpts((ev: string, fn: Function) => self.on(ev, fn)),
                one: defineOpts((ev: string, fn: Function) => self.one(ev, fn)),
                off: defineOpts((ev: string, fn: Function) => self.off(ev, fn)),
                trigger: defineOpts((ev: string, ...args: any[]) => self.trigger(ev, ...args)),
                observe: defineOpts((component: any, prefix?: string) => self.observe(component, prefix)),
                $_observer: defineOpts(self)
            });
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
    observe<C>(component: C, prefix?: string) {

        const self = this;

        let namedEvent = (ev: string) => {

            return `${prefix}-${ev}`;
        };

        if (!prefix) {

            namedEvent = (ev) => ev;
        }

        // Simple tacking for simple cleanup for now
        // TODO: figure out a way to track parent `off` to avoid tracking
        const listenerTracker: Set<[string, Function]> = new Set();

        const trackListener = (event, fn) => {

            listenerTracker.add([event, fn]);

            return fn
        };

        define(component, {

            on: defineOpts(
                (ev: string, fn: Function) => {

                    return self.on(
                        namedEvent(ev),
                        trackListener(ev, fn)
                    );
                }
            ),

            one: defineOpts(
                (ev: string, fn: Function) => {

                    return self.one(
                        namedEvent(ev),
                        trackListener(ev, fn)
                    );
                }
            ),

            off: defineOpts(
                (ev: string, fn?: Function) => {

                    const tracked = [...listenerTracker.values()];

                    // Handle removing all callbacks from this instance related to child observable. Only all of the child instance's callbacks should be removed.
                    if (ev === ALL_CALLBACKS) {

                        for (const entry of tracked) {

                            const [ev, listener] = entry;
                            listenerTracker.delete(entry);
                            self.off(namedEvent(ev), listener);
                        }
                    }
                    else {

                        const entry = tracked.find(([e, f]) => (
                            ev === e && fn === f
                        ));
                        listenerTracker.delete(entry);
                        self.off(namedEvent(ev), fn);
                    }
                }
            ),

            trigger: defineOpts(
                (ev: string, ...args: any[]) => {

                    return self.trigger(namedEvent(ev), ...args);
                }
            ),

            cleanup: defineOpts(
                () => {

                    (component as any).off('*');
                }
            )
        });

        return component as ObservableInstanceChild<C>;
    }

    /**
     * Riot install this event emitter onto given riot component. To be used with `riot.install`, or independently on an as-needed basis.
     * @param component Riot component
     * @returns component with an obserable interface
     */
    install<C>(component: C) {

        const observed = this.observe(component);

        makeOnBeforeUnmount(observed, () => {

            observed.cleanup();
        });

        return observed;
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

            this.$_callbacks.clear();
            return;
        }

        if (listener) {

            const fns = this.$_callbacks.get(event);

            if (fns) {

                fns.delete(listener);
                if (fns.size === 0) this.$_callbacks.delete(event);
            }

            return;
        }

        this.$_callbacks.delete(event);
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