import { NonFunctionProps, assert } from "../_helpers";
import { makeOnBeforeMount } from "../meta";

type ResponseBodyFunctions = keyof Omit<Body, NonFunctionProps<Body>>;
type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | string;

type RequestOptions = Omit<RequestInit, 'headers'>

/**
 * Override this interface with the headers you intend
 * to use and set throughout your app.
 */
export interface FetchHeaders {
    authorization?: string;
    'content-type'?: string;
};

export type RequestHeaders = Record<string, string> & FetchHeaders;

type FetchHeaderKeys = keyof RequestHeaders;

export type FetchReqOpts = RequestOptions &  {
    controller: AbortController,
    headers?: RequestHeaders,
    timeout?: number
};

type FetchFactoryLifecycle = {
    onError?: (err: FetchError) => void | Promise<void>
    onBeforeReq?: (opts: FetchReqOpts) => void | Promise<void>
    onAfterReq?: (response: Response, opts: FetchReqOpts) => void | Promise<void>
};

type FetchFactoryOptions<State = {}> = (

    Omit<
    FetchReqOpts,
        'method' | 'body' | 'integrity' | 'controller'
    > &

    {
        modifyOptions?: (opts: FetchReqOpts, state: State) => FetchReqOpts
        baseUrl: string,
        type: ResponseBodyFunctions,
        headers?: RequestHeaders,
        timeout?: number
    }
);

interface AbortablePromise<T> extends Promise<T> {

    abort(reason?: string): void
}

export type FetchFactoryRequestOptions = (
    FetchFactoryLifecycle &
    Omit<FetchReqOpts, 'body' | 'method' | 'controller'>
);

export interface FetchError<T = {}> extends Error {
    data: T | null;
    status: number;
    method: HttpMethods;
    path: string;
    aborted?: boolean;
}

export class FetchError<T = {}> extends Error {}

export class  FetchEvent<State = {}> extends Event {
    state: State
    url?: string
    method?: HttpMethods
    headers?: FetchHeaders
    options?: FetchReqOpts
    data?: any
    payload?: any
    response?: Response
    error?: FetchError

    constructor(
        event: FetchEventName,
        opts: {
            state: State,
            url?: string,
            method?: HttpMethods,
            headers?: FetchHeaders,
            error?: FetchError,
            response?: Response,
            data?: any,
            payload?: any
        },
        initDict?: EventInit
    ) {

        super(event, initDict);

        const mkDef = (value: any) => ({

            configurable: false,
            enumerable: true,
            writable: false,
            value
        })

        Object.defineProperties(
            this,
            {
                url: mkDef(opts.url),
                state: mkDef(opts.state),
                error: mkDef(opts.error),
                response: mkDef(opts.response),
                method: mkDef(opts.method),
                headers: mkDef(opts.headers),
                data: mkDef(opts.data),
                payload: mkDef(opts.payload),
            }
        )
    }
}

export enum FetchEventNames {

    'fetch-before' = 'fetch-before',
    'fetch-after' = 'fetch-after',
    'fetch-abort' = 'fetch-abort',
    'fetch-error' = 'fetch-error',
    'fetch-response' = 'fetch-response',
    'fetch-header-add' = 'fetch-header-add',
    'fetch-header-remove' = 'fetch-header-remove',
    'fetch-state-set' = 'fetch-state-set',
    'fetch-state-reset' = 'fetch-state-reset',
    'fetch-url-change' = 'fetch-url-change',
};

export type FetchEventName = keyof typeof FetchEventNames;
/**
 * Creates a wrapper around `window.fetch` that allows
 * certain overrides of default fetch options. Implements
 * an abort controller per request that can be intercepted
 * using `opts.signal.abort()`.
 *
 * * See abort controller:
 * * * https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
 * * * https://github.com/facebook/react-native/blob/0.67-stable/packages/rn-tester/js/examples/XHR/XHRExampleAbortController.js
 *
 * @example
 *
 * const api = new FetchFactory({
 *      baseUrl: 'http://website.com'
 *      type: 'json',
 *      headers: { 'content-type': 'application/json' }
 * })
 */
export class FetchFactory<State = {}> extends EventTarget {

    private _baseUrl: URL;
    private _options: Partial<FetchReqOpts>;
    private _headers: RequestHeaders;
    private _type: ResponseBodyFunctions;

    private modifyOptions?: FetchFactoryOptions<State>['modifyOptions'];

    /**
     * For saving values that may be needed to craft requests as the
     * application progresses; for example: as you login, you get a
     * token of some sort which is used to generate an hmac.
     */
    private _state: State = {} as State;

    /**
     *
     * @param opts
     */
    constructor({ baseUrl, type, ...opts }: FetchFactoryOptions<State>) {

        super()

        assert(!!baseUrl, 'baseUrl is required');
        assert(!!type, 'type is required');

        assert(
            ['json', 'arrayBuffer', 'blob', 'formData', 'text'].includes(type),
            'invalid type'
        );

        if (opts.timeout) {

            assert(opts.timeout > -1, 'timeout must be positive number');
        }

        this._baseUrl = new URL(baseUrl);
        this._type = type;

        const { modifyOptions, ...rest } = opts;

        this._options = rest;
        this._headers = opts.headers as RequestHeaders || {};

        this.modifyOptions = modifyOptions;
    }


    /**
     * Executes a function if it exists
     * @param maybeFn
     * @param maybeArgs
     */
    private execIfExists <
        T extends (...args: any) => any,
        A extends Parameters<T>
    >(maybeFn: T | undefined | null, args: A): ReturnType<T> | undefined {

        if (typeof maybeFn === 'function') {

            return maybeFn.apply(maybeFn, args || []);
        }
    }

    /**
     * Makes headers
     * @param override
     * @returns
     */
    private makeHeaders(override: RequestHeaders = {}) {

        return {
            ...this._headers,
            ...override
        };
    }

    /**
     * Makes url based on basePath
     * @param path
     */
    private makeUrl(path: string) {

        path = path?.replace(/^\/{1,}/, '');
        const url = this._baseUrl.toString().replace(/\/$/, '');

        return `${url}/${path}`;
    }

    /**
     * Makes an API call using fetch
     * @returns
     */
    private async makeCall <Res, Err>(
        method: HttpMethods,
        path: string,
        options: (
            FetchFactoryRequestOptions &
            FetchFactoryLifecycle &
            {
                payload?: any,
                controller: AbortController,
                cancelTimeout: NodeJS.Timeout
            }
        )
    ) {

        const {
            payload,
            controller,
            cancelTimeout,
            onAfterReq: onAfterRequest,
            onBeforeReq: onBeforeRequest,
            onError,
            timeout = this._options.timeout,
            ...rest
        } = options;

        const url = this.makeUrl(path);

        const {
            _type: type,
            _options: defaultOptions,
            _state: state,
            modifyOptions
        } = this;

        let opts: FetchReqOpts = {
            method: method.toUpperCase(),
            signal: rest.signal || controller.signal,
            controller,
            ...defaultOptions,
            ...rest,
        };

        opts.headers = this.makeHeaders(opts.headers);

        if (/put|post|patch|delete/i.test(method)) {

            if (type === 'json') {

                opts.body = JSON.stringify(payload);
            }
            else {

                opts.body = payload;
            }
        }

        let error: FetchError;
        let response: Response;

        opts = modifyOptions ? modifyOptions(opts, state) : opts;


        try {

            this.dispatchEvent(
                new FetchEvent(FetchEventNames['fetch-before'], {
                    ...opts,
                    payload,
                    url,
                    state: this._state
                })
            );

            onBeforeRequest && onBeforeRequest(opts);

            response = await fetch(url, opts) as Response;

            const contentType = response.headers.get('content-type');

            clearTimeout(cancelTimeout);

            this.dispatchEvent(
                new FetchEvent(FetchEventNames['fetch-after'], {
                    ...opts,
                    payload,
                    url,
                    state: this._state,
                    response: response.clone()
                })
            );

            onAfterRequest && onAfterRequest(response.clone(), opts);

            let data: unknown;
            let { status, statusText } = response;

            if (contentType) {


                if (/text/.test(contentType!)) {

                    data = await response.text() as any;
                }
                else if (/json/.test(contentType!)) {

                    data = await response.json();
                }
                else {

                    data = await response[type as any]() as Res;
                }

                if (response.ok) {

                    this.dispatchEvent(

                        new FetchEvent(FetchEventNames['fetch-response'], {
                            ...opts,
                            payload,
                            url,
                            state: this._state,
                            response,
                            data
                        })
                    );

                    return data as Res;
                }
            }
            else {

                data = 'No content type.'
                statusText = 'No content type. Possible response cancellation by the server.'
                status = 997;
            }


            error = new FetchError(statusText);
            error.data = data as Err;
            error.status = status;
            error.method = method;
            error.path = path;
            error.aborted = options.controller.signal.aborted;

            throw error;
        }
        catch (e: any) {

            if (!(e instanceof FetchError)) {

                error = new FetchError(e.message);
            }

            let statusCode = error.status || 999;
            const name = e.name;
            const message = (
                options.controller.signal.reason ||
                e.message ||
                name
            );

            if (options.controller.signal.aborted) {

                statusCode = 998;
                error.message = message
            }

            error.status = statusCode;
            error.data = { message };
            error.method = method;
            error.path = path;
            error.aborted = options.controller.signal.aborted;
        }


        if (options.controller.signal.aborted) {

            this.dispatchEvent(
                new FetchEvent(FetchEventNames['fetch-abort'], {
                    ...opts,
                    payload,
                    url,
                    state: this._state
                })
            );
        }
        else {

            this.dispatchEvent(
                new FetchEvent(FetchEventNames['fetch-error'], {
                    ...opts,
                    payload,
                    url,
                    state: this._state,
                    error
                })
            );
        }

        onError && onError(error);

        throw error;
    }

    /**
     * Makes a request
     * @param method
     * @param path
     * @param options
     */
    request <Res = any, Data = any, Err = any>(
        method: HttpMethods,
        path: string,
        options: FetchFactoryRequestOptions & { payload?: Data } = {}
    ): AbortablePromise<Res> {


        // https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
        const controller = new AbortController();

        let cancelTimeout: NodeJS.Timeout;
        const timeout = options.timeout || this._options.timeout;

        if (timeout) {

            assert(timeout > -1, 'timeout must be positive number');

            cancelTimeout = setTimeout(() => (

                controller.abort(`Timeout after ${timeout}ms`)
            ), timeout);
        }


        const call = this.makeCall <Res, Err>(method, path, {
            ...options,
            controller,
            cancelTimeout
        }) as AbortablePromise<Res>;

        call.abort = (reason?: string) => {

            clearTimeout(cancelTimeout);
            controller.abort(reason);
        };

        return call;
    }

    /**
     * Makes a options request
     * @param path
     * @param headers
     * @returns
     */
    options <Res = any, Err = any>(path: string, options: FetchFactoryRequestOptions = {}) {

        return this.request <Res, null, Err>('options', path, options);
    }

    /**
     * Makes a get request
     * @param path
     * @param headers
     * @returns
     */
    get <Res = any, Err = any>(path: string, options: FetchFactoryRequestOptions = {}) {

        return this.request <Res, null, Err>('get', path, options);
    }

    /**
     * Makes a delete request
     * @param path
     * @param headers
     * @returns
     */
    delete <Res = any, Data = any, Err = any>(path: string, payload: Data | null = null, options: FetchFactoryRequestOptions = {}) {

        return this.request <Res, Data, Err>('delete', path, { ...options, payload });
    }

    /**
     * Makes a post request
     * @param path
     * @param headers
     * @returns
     */
    post <Res = any, Data = any, Err = any>(path: string, payload: Data | null = null, options: FetchFactoryRequestOptions = {}) {

        return this.request <Res, Data, Err>('post', path, { ...options, payload });
    }

    /**
     * Makes a put request
     * @param path
     * @param headers
     * @returns
     */
    put <Res = any, Data = any, Err = any>(path: string, payload: Data | null = null, options: FetchFactoryRequestOptions = {}) {

        return this.request <Res, Data, Err>('put', path, { ...options, payload });
    }

    /**
     * Makes a patch request
     * @param path
     * @param headers
     * @returns
     */
    patch <Res = any, Data = any, Err = any>(path: string, payload: Data | null = null, options: FetchFactoryRequestOptions = {}) {

        return this.request <Res, Data, Err>('patch', path, { ...options, payload });
    }

    /**
     * Set an object of headers
     * @param headers
     */
    addHeader(headers: RequestHeaders) {

        Object.assign(this._headers, headers);

        this.dispatchEvent(
            new FetchEvent(FetchEventNames['fetch-header-add'], {
                state: this._state,
                data: headers
            })
        );
    }

    /**
     * Remove headers by reference, array of names, or single name
     * @param headers
     */
    rmHeader(headers: RequestHeaders | FetchHeaderKeys[] | FetchHeaderKeys) {


        if (typeof headers === 'string') {

            delete this._headers[headers];
        }

        let _names = headers as FetchHeaderKeys[];

        if (!Array.isArray(headers)) {

            _names = Object.keys(headers);
        }

        for (const name of _names) {
            delete this._headers[name];
        }

        this.dispatchEvent(
            new FetchEvent(FetchEventNames['fetch-header-remove'], {
                state: this._state,
                data: headers
            })
        );
    }

    /**
     * Checks if header is set
     * @param name
     * @returns
     */
    hasHeader(name: FetchHeaderKeys) {

        return this._headers.hasOwnProperty(name);
    }

    /**
     * Merges a state and its values into the fetch state
     * @param conf
     */
    setState(conf: Partial<State>) {

        Object.assign(this._state || {}, conf);

        this.dispatchEvent(
            new FetchEvent(FetchEventNames['fetch-state-set'], {
                state: this._state,
                data: conf
            })
        );
    }

    /**
     * Resets the state to an empty object
     */
    resetState() {

        this._state = {} as State;

        this.dispatchEvent(
            new FetchEvent(FetchEventNames['fetch-state-reset'], {
                state: this._state,
            })
        );
    }

    /**
     * Returns the fetch internal state
     */
    getState() {

        return this._state;
    }

    /**
     * Changes the base URL for this fetch instance
     * @param url
     */
    changeBaseUrl(url: string) {

        this._baseUrl = new URL(url);

        this.dispatchEvent(
            new FetchEvent(FetchEventNames['fetch-url-change'], {
                state: this._state,
                data: url
            })
        );
    }

    /**
     * Listen for events on this FetchFactory instance
     * @param ev
     * @param listener
     * @param once
     */
    on(
        ev: FetchEventName | '*',
        listener: (
            e: (
                FetchEvent<State>
            )
        ) => void,
        once = false
    ) {

        if (ev === '*') {
            for (const _e in FetchEventNames) {

                this.addEventListener(_e, listener, { once });
            }

            return;
        }

        this.addEventListener(ev, listener, { once });
    }

    /**
     * Remove events listeners from this FetchFactory instance
     * @param ev
     * @param listener
     */
    off (ev: FetchEventName | '*', listener: EventListenerOrEventListenerObject) {

        if (ev === '*') {
            for (const _e in FetchEventNames) {

                this.removeEventListener(_e, listener);
            }

            return;
        }

        this.removeEventListener(ev, listener);
    }
}