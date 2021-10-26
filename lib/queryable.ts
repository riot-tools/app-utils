import { RiotComponent } from 'riot';
import { mergeState } from './meta';

export type QueryableState<S> = S & {
    isFetching?: boolean,
    fetchError?: Error|null;
};

export interface QueryableComponent<S> {

    state: QueryableState<S>;

    /**
     * Names of the functions to make queryable on before mount
     */
    makeFetching: string[],

    /**
     * Toggle or set isFetching. Useful for when, for example,
     * binding functions to events.
     * @param isFetching set is fetching
     */
    toggleFetching(isFetching?: boolean): void,

    /**
     * Sets component's state to isFetching true and captures any
     * errors caused by the function fetching. Useful for use inside
     * of other functions.
     * @param {function} fn function to be executed
     */
    setFetching<T extends Function>(fn: T): object|Error;

    /**
     * Creates a closure that will execute given function and toggle
     * state to `isFetching` when it does. Captures errors and can
     * update state given a return value. Useful for onclick handlers
     * and event bindings.
     * @param {Function} fn function to be executed
     * @returns {function}
     */
    fnWillFetch: <T extends Function>(fn: T) => QueryableComponent<S>['setFetching'];
}

/**
 * Adds functionality to riot components that allow them to
 * set its own state to isFetching while an async call is being made.
 * Any errors are recorded in the state's `fetchError` property
 * @param implement
 * @returns component with a fetchable interface
 */
export const makeQueryable = function <
    T extends Partial<RiotComponent<Props, State>>,
    Props = {},
    State = {}
>(component: T): T & QueryableComponent<State> {

    const implement = component as T & QueryableComponent<State>;

    mergeState(implement, {
        isFetching: false,
        fetchError: null
    });

    implement.toggleFetching = function (isFetching?: boolean) {

        const change = { isFetching: !this.state.isFetching }

        if (isFetching !== undefined) {

            change.isFetching = isFetching;
        }

        this.update(change as QueryableState<State>);
    }

    implement.setFetching = async function <F extends Function>(fn: F) {

        const state = {
            isFetching: true,
            fetchError: null
        } as QueryableState<State>;

        this.update({ ...state });

        state.isFetching = false;

        try {

            const update = await fn() || {};

            implement.update({ ...state, ...update });
        }
        catch (fetchError) {

            implement.update({ ...state, fetchError });
        }
    };

    implement.fnWillFetch = function <F extends Function>(fn: F) {

        const self = this;

        return (...args) => (

            implement.setFetching(() => fn.apply(self, args))
        )
    };

    if (implement.makeFetching?.length) {

        for (const fn of implement.makeFetching) {

            if (typeof implement[fn] === 'function') {

                implement[fn] = implement.fnWillFetch(implement[fn]);
            }
        }
    }

    return implement;
};
