import { RiotComponent } from 'riot';
import { mergeState } from './meta';

interface SetFetchingFunction {
    <T extends Function>(fn: T): object|Error;
}

export interface QueryableComponent {

    /**
     * Sets component's state to isFetching true and captures any
     * errors caused by the function fetching. Useful for use inside
     * of other functions.
     * @param {function} fn function to be executed
     */
    setFetching: SetFetchingFunction;

    /**
     * Creates a closure that will execute given function and toggle
     * state to `isFetching` when it does. Captures errors and can
     * update state given a return value. Useful for onclick handlers
     * and event bindings.
     * @param {Function} fn function to be executed
     * @returns {function}
     */
    fnWillFetch: (fn: Function) => SetFetchingFunction;
}

/**
 * Adds functionality to riot components that allow them to
 * set its own state to isFetching while an async call is being made.
 * Any errors are recorded in the state's `fetchError` property
 * @param component
 * @returns component with a fetchable interface
 */
export const makeQueryable = function <P = any, S = any, T>(component: T) {

    const queryable = component as T & QueryableComponent & RiotComponent<P, S>;

    mergeState <P, S, T>(queryable, {
        isFetching: false,
        fetchError: null
    });


    queryable.setFetching = async function (fn: Function) {

        this.update({ isFetching: true, fetchError: null });

        try {

            const state = await fn() || {};
            this.update({ isFetching: false, ...state });
        }
        catch (fetchError) {

            this.update({ isFetching: false, fetchError });
        }
    };

    queryable.fnWillFetch = (fn: Function) => (

        (...args) => (

            queryable.setFetching(() => fn(...args))
        )
    );

    return queryable;
};