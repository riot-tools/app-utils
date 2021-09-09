import { expect } from 'chai';

import sinon from 'sinon';

import { makeQueryable } from '../lib';

const stub = {
    component: {
        state: { something: 'intheway' },
        update: sinon.fake()
    }
};

describe('Make Queryable', function () {

    it('should merge existing state with queryable state', function () {

        //
    });
});

