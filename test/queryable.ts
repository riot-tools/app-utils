import { expect } from 'chai';
import { Test } from 'mocha';
import { RiotComponent } from 'riot';

import sinon, { SinonStub, stub } from 'sinon';

import { makeQueryable, QueryableComponent } from '../lib';

type TestState = {
    something: string
}

const makeComponent = (): (
    Partial<QueryableComponent<TestState>> &
    Partial<RiotComponent<{}, TestState>> & {

        someFunction?: Function,
        fake1?: Function,
        fake2?: Function,
    }
 ) => ({
    state: { something: 'intheway' },
    update: sinon.stub()
});

describe('Make Queryable', function () {

    it('should merge existing state with queryable state', function () {

        const queryable = makeQueryable(makeComponent());

        expect(queryable.state).to.contain({
            isFetching: false,
            fetchError: null,
            something: 'intheway'
        })
    });

    it('should set loading to true when setFetching', async () => {

        const component = makeQueryable(makeComponent());

        expect(component.setFetching).to.be.a('function');

        const fake = sinon.stub().resolves({ some: 'state' });

        await component.setFetching(fake);

        sinon.assert.calledOnce(fake);

        const update = component.update as SinonStub;

        expect(
            update.calledWith({ isFetching: true, fetchError: null })
        ).to.be.true;

        expect(
            update.calledWith({ isFetching: false, fetchError: null, some: 'state' })
        ).to.be.true;

    });

    it('should capture errors thrown when setFetching', async () => {

        const component = makeQueryable(makeComponent());

        const fake = sinon.stub().rejects(Error('some error'));

        await component.setFetching(fake);

        const update = component.update as SinonStub;

        sinon.assert.calledWith(
            update,
            { isFetching: true, fetchError: null }
        );

        const { args: [call]} = update.getCall(1);

        expect(call).to.contain({ isFetching: false });
        expect(call.fetchError.message).to.eq('some error');
    });

    it('should convert a function into a fetchable function', async () => {

        const component = makeQueryable(makeComponent());

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
            { isFetching: false, fetchError: null, some: 'state' }
        );

        sinon.assert.calledWithExactly(
            fake,
            'a', 'b', 'c'
        );
    });

    it('should convert an array of functions into fetchables', async () => {

        const component = makeComponent();

        const fake1 = sinon.stub().returns({ some: 'state' });
        const fake2 = sinon.stub().returns({ soom: 'staat' });

        component.fake1 = fake1;
        component.fake2 = fake2;

        component.makeFetching = ['fake1', 'fake2'];

        const queryable = makeQueryable(component);

        await queryable.fake1();
        await queryable.fake2();

        const update = component.update as SinonStub;

        const [load1, res1, load2, res2] = update.getCalls();

        expect(load1.args[0]).to.include({ isFetching: true, fetchError: null });
        expect(load2.args[0]).to.include({ isFetching: true, fetchError: null });

        expect(res1.args[0]).to.include({ isFetching: false, fetchError: null, some: 'state' });
        expect(res2.args[0]).to.include({ isFetching: false, fetchError: null, soom: 'staat' });
    });

    it('should toggle fetching', async () => {

        const component = makeQueryable(makeComponent());

        const update = component.update as SinonStub;

        component.toggleFetching();

        sinon.assert.calledWith(update, { isFetching: true });

        component.toggleFetching(false);
        sinon.assert.calledWith(update, { isFetching: false });

        component.toggleFetching(false);
        sinon.assert.calledWith(update, { isFetching: false });

        component.toggleFetching(true);
        sinon.assert.calledWith(update, { isFetching: true });

        component.toggleFetching(true);
        sinon.assert.calledWith(update, { isFetching: true });

        component.toggleFetching();
        sinon.assert.calledWith(update, { isFetching: false });
    });

    it('should initialize with a fetching state', () => {

        const component = makeComponent();

        component.state.isFetching = true;

        const queryable = makeQueryable(component);

        expect(queryable.state.isFetching).to.be.true;

    })
});



