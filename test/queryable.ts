import { expect } from 'chai';
import { RiotComponent } from 'riot';

import sinon, { SinonStub } from 'sinon';

import { makeQueryable } from '../lib';

const component: any = {
    state: { something: 'intheway' },
    update: sinon.stub() as RiotComponent['update']
};

describe('Make Queryable', function () {

    afterEach(() => {

        sinon.resetHistory();
    });

    it('should merge existing state with queryable state', function () {

        const queryable = makeQueryable(component);

        expect(queryable.state).to.contain({
            isFetching: false,
            fetchError: null,
            something: 'intheway'
        })
    });

    it('should set loading to true when setFetching', async () => {

        expect(component.setFetching).to.be.a('function');

        const fake = sinon.stub().returns({ some: 'state' });

        await component.setFetching(fake);

        sinon.assert.calledOnce(fake);

        const update = component.update as SinonStub;

        sinon.assert.calledWithExactly(
            update,
            { isFetching: true, fetchError: null }
        );

        sinon.assert.calledWithExactly(
            update,
            { isFetching: false, some: 'state' }
        );
    });

    it('should capture errors thrown when setFetching', async () => {

        const fake = sinon.stub().rejects(Error('some error'));

        await component.setFetching(fake);

        const update = component.update as SinonStub;

        sinon.assert.calledWithExactly(
            update,
            { isFetching: true, fetchError: null }
        );

        const { args: [call]} = update.getCall(1);

        expect(call).to.contain({ isFetching: false });
        expect(call.fetchError.message).to.eq('some error');
    });

    it('should convert a function into a fetchable function', async () => {

        const fake = sinon.stub().returns({ some: 'state' });

        component.someFunction = component.fnWillFetch(fake);

        await component.someFunction('a', 'b', 'c');

        const update = component.update as SinonStub;

        sinon.assert.calledWithExactly(
            update,
            { isFetching: true, fetchError: null }
        );

        sinon.assert.calledWithExactly(
            update,
            { isFetching: false, some: 'state' }
        );

        sinon.assert.calledWithExactly(
            fake,
            'a', 'b', 'c'
        );
    });
});



