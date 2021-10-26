import { RiotComponent } from "riot";

type HookKeys =
'onBeforeMount' |
'onMounted' |
'onBeforeUpdate' |
'onUpdated' |
'onBeforeUnmount' |
'onUnmounted';

type HookFunctions<P, S> = Pick<
    RiotComponent<P, S>,
    HookKeys
>

type RiotHookComponent<P, S> = HookFunctions<P, S>[keyof HookFunctions<P, S>]

interface MakeHook {

    /**
     * Creates a
     * @param component riot component to make hook on
     * @param fn hook function
     * @param runAfter whether to run hook function before or after original
     */
    <P, S, T>(component: T, fn: RiotHookComponent<P, S>, runAfter?: boolean): void
};


/**
 * Closure to implement stackable hooks
 * @param {RiotHookFn} hook
 * @returns {MakeHook}
 */
export const mkHook = <P = any, S = any>(hook: HookKeys): MakeHook => (

    (component, fn, runAfter = false) => {

        const original = component[hook];

        if (!fn || typeof fn !== 'function') {

            throw TypeError('hook must be a function');
        }

        component[hook] = function (props: P, state: S) {

            !runAfter && original?.call(this, props, state);

            fn.call(this, props, state);

            runAfter && original?.call(this, props, state);
        };
    }
);

export const makeOnBeforeMount = mkHook('onBeforeMount');
export const makeOnMounted = mkHook('onMounted');
export const makeOnBeforeUpdate = mkHook('onBeforeUpdate');
export const makeOnUpdated = mkHook('onUpdated');
export const makeOnBeforeUnmount = mkHook('onBeforeUnmount');
export const makeOnUnmounted = mkHook('onUnmounted');

export const mergeState = <Component extends Partial<RiotComponent>, State extends object = {}>(component: Component, state: State) => {

    component.state = {
        ...(component.state || {}),
        ...state
    };
};
