/**
 * Originally https://github.com/riot/observable
 *
 * Revamped to include strong type support, OOP, nested observers, and debugging tools
 */

import { makeOnBeforeUnmount } from "./meta";
import OptionsValidator from "./options-validator";

/**
 * Overrideable interface
 */
export interface ObservableEvents {
    '*': any
}

/**
 * Extendible event prefixes
 */
export interface ObservableEventPrefix { }
type PrefixNames = keyof ObservableEventPrefix;

type EventNames<T> = keyof T;

// type EventNames = EventNames | `${PrefixNames}-${EventNames}`;
type EventType<T, E extends EventNames<T>> = T[E]

interface EventCallback<T, E extends EventNames<T>> {
    (data: EventType<T, E>): void
}


const ALL_CALLBACKS = '*'
const define = Object.defineProperties

type CallbacksSet = Set<Function>;
type EventCallbacksMap = Map<string, CallbacksSet>

export interface ListenFn<T, RT = void> {
    <E extends EventNames<T>>(event: E, fn: EventCallback<T, E>): RT
}

export interface EmitterFn<T> {
    <E extends EventNames<T>>(event: E, ...args: EventType<T, E>[]): void
}

type Cleanup = {
    cleanup: () => void
}

export type ObservedComponent<T = ObservableEvents> = {
    on: ListenFn<T, Cleanup>,
    one: ListenFn<T>,
    once: ListenFn<T>,
    off: ListenFn<T>,
    trigger: EmitterFn<T>,
    emit: EmitterFn<T>,
};

export type ObservableInstanceChild<T, U = ObservableEvents> = T & ObservedComponent<U> & Cleanup

export type ObservableInstance<T, U = ObservableEvents> = ObservedComponent<U> & {
    observe: Observable<T, U>['observe'],
    $_spy?: ObserverSpy<T, U>;
    $_ref?: String;
    $_observer: Observable<T, U>
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

type OberverSpyOptions<T> = {
    event: keyof T,
    listener?: Function,
    args?: any[],
};

type ObserverSpyEvent<T, U> = OberverSpyOptions<U> & {
    fn: ObservableFunctionName,
    context: Observable<T, U>
}

interface ObserverSpy<T, U> {
    (event: ObserverSpyEvent<T, U>): void
}

const sendToSpy = <U>(
    fn: string,
    context: any,
    {
        event,
        listener = null,
        args = null
    }: OberverSpyOptions<U>
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

type ObservableOptions<T, U> = {
    ref?: string,
    spy?: ObserverSpy<T, U>
};

const validator = new OptionsValidator({
    ref: 'String',
    spy: 'Function'
});

export class Observable<T, U = ObservableEvents> {

    $_callbacks: EventCallbacksMap = new Map();
    $_target: any = null;
    $_spy?: ObserverSpy<T, U>;
    $_ref?: String;

    /**
     * Same as `observable.one`
     */
    once: Observable<T, U>['one'];

    /**
     * Same as `observable.trigger`
     */
    emit: Observable<T, U>['trigger'];

    constructor(target?: T, options?: ObservableOptions<T, U>) {

        const self = this;
        this.$_target = target || this;

        // Make these functions non-enumerable
        define(this, {
            on: defineOpts(this.on),
            one: defineOpts(this.one),
            once: defineOpts(this.one),
            off: defineOpts(this.off),
            trigger: defineOpts(this.trigger),
            emit: defineOpts(this.trigger),
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
                on: defineOpts(<E extends EventNames<U>>(ev: E, fn: EventCallback<U, E>) => self.on(ev, fn)),
                one: defineOpts(<E extends EventNames<U>>(ev: E, fn: EventCallback<U, E>) => self.one(ev, fn)),
                off: defineOpts(<E extends EventNames<U>>(ev: E, fn: EventCallback<U, E>) => self.off(ev, fn)),
                trigger: defineOpts(<E extends EventNames<U>>(ev: E, ...args: EventType<U, E>[]) => self.trigger(ev, ...args)),
                observe: defineOpts((component: any, prefix?: PrefixNames) => self.observe(component, prefix)),
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
    observe<C>(component: C, prefix?: PrefixNames) {

        const self = this;

        interface PrefixCallback {
            <E extends EventNames<U>>(event: E): EventNames<U>
        }

        let namedEvent: PrefixCallback = (ev) => `${prefix}-${ev as string}` as any;

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
                <E extends EventNames<U>>(ev: E, fn: EventCallback<U, E>) => {

                    return self.on(
                        namedEvent(ev),
                        trackListener(ev, fn)
                    );
                }
            ),

            one: defineOpts(
                <E extends EventNames<U>>(ev: E, fn: EventCallback<U, E>) => {

                    return self.one(
                        namedEvent(ev),
                        trackListener(ev, fn)
                    );
                }
            ),

            off: defineOpts(
                <E extends EventNames<U>>(ev: E, fn: EventCallback<U, E>) => {

                    const tracked = [...listenerTracker.values()];

                    // Handle removing all callbacks from this instance related to child observable. Only all of the child instance's callbacks should be removed.
                    if (ev === ALL_CALLBACKS) {

                        for (const entry of tracked) {

                            const [ev, listener] = entry as [EventNames<U>, EventCallback<U, any>];
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
                <E extends EventNames<U>>(ev: E, ...args: EventType<U, E>[]) => {

                    return self.trigger(namedEvent(ev), ...args);
                }
            ),

            cleanup: defineOpts(
                () => {

                    (component as any).off('*');
                }
            )
        });

        const observed = component as ObservableInstanceChild<C>;

        define(observed, {
            once: defineOpts(observed.one),
            emit: defineOpts(observed.trigger),
        });

        return observed;
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
    on<E extends EventNames<U>>(event: E, listener: EventCallback<U, E>): Cleanup {

        if (this.$_spy) {

            sendToSpy <U>('on', this, { event, listener });
        }

        const stored = this.$_callbacks.get(event as string);

        if (stored && !stored.has(listener)) {
            stored.add(listener);
        }

        if (!stored) {

            this.$_callbacks.set(event as string, new Set([listener]));
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
    one<E extends EventNames<U>>(event: E, listener: EventCallback<U, E>) {

        if (this.$_spy) {

            sendToSpy <U>('one', this, { event, listener });
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
    off<E extends EventNames<U>>(event: E, listener?: EventCallback<U, E>) {

        if (this.$_spy) {

            sendToSpy <U>('off', this, { event, listener });
        }

        if (event === ALL_CALLBACKS && !listener) {

            this.$_callbacks.clear();
            return;
        }

        if (listener) {

            const fns = this.$_callbacks.get(event as string);

            if (fns) {

                fns.delete(listener);
                if (fns.size === 0) this.$_callbacks.delete(event as string);
            }

            return;
        }

        this.$_callbacks.delete(event as string);
    }

    /**
     * Emits an event
     * @param event
     * @param args
     */
    trigger<E extends EventNames<U>>(event: E, ...args: EventType<U, E>[]) {

        if (this.$_spy) {

            sendToSpy <U>('trigger', this, { event, args });
        }

        const fns = this.$_callbacks.get(event as string)

        if (fns) fns.forEach(fn => fn.apply(this, args))

        if (this.$_callbacks.get(ALL_CALLBACKS) && event !== ALL_CALLBACKS) {
            this.trigger(
                ALL_CALLBACKS as EventNames<U>,
                event as any,
                ...args
            )
        }
    }
}
