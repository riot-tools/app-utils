import { RiotComponent } from "riot";

interface MakeHook {

    /**
     * Creates a
     * @param component riot component to make hook on
     * @param fn hook function
     * @param runAfter whether to run hook function before or after original
     */
    <T>(component: T, fn: Function, runAfter?: boolean): void
};

type RiotHookComponent = (
    'onBeforeMount' |
    'onMounted' |
    'onBeforeUpdate' |
    'onUpdated' |
    'onBeforeUnmount' |
    'onUnmounted' |
    'onAsyncRendering'
);


/**
 * Closure to implement stackable hooks
 * @param {RiotHookComponent} hook
 * @returns {MakeHook}
 */
export const mkHook = (hook: RiotHookComponent): MakeHook => (

    <T>(component: T, fn: Function, runAfter = false) => {

        const original = component[hook];

        if (!fn || typeof fn !== 'function') {

            throw TypeError('hook must be a function');
        }

        component[hook] = function (...args) {

            !runAfter && original?.call(this, ...args);

            fn.call(this, ...args);

            runAfter && original?.call(this, ...args);
        };
    }
);

export const makeOnBeforeMount = mkHook('onBeforeMount');
export const makeOnMounted = mkHook('onMounted');
export const makeOnBeforeUpdate = mkHook('onBeforeUpdate');
export const makeOnUpdated = mkHook('onUpdated');
export const makeOnBeforeUnmount = mkHook('onBeforeUnmount');
export const makeOnUnmounted = mkHook('onUnmounted');

export const mergeState = <T>(component: T & RiotComponent, state: object) => {

    component.state = {

        ...(component.state || {}),
        ...state
    };
};
