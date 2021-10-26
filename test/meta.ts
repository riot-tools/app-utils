import { expect } from 'chai';
import sinon from 'sinon';

import {
    mkHook,
    makeOnBeforeMount,
    makeOnMounted,
    makeOnBeforeUpdate,
    makeOnUpdated,
    makeOnBeforeUnmount,
    makeOnUnmounted,
    mergeState
} from '../lib';

describe('Meta', function () {

    afterEach(() => {

        sinon.resetHistory();
    });

    it('should make custom hooks', function () {

        const original = sinon.stub();
        const override = sinon.stub();

        const hook = mkHook('onBeforeMount');

        const component = {
            onBeforeMount: original
        };

        hook(component, override);

        component.onBeforeMount();

        expect(original.calledOnce).to.be.true;
        expect(override.calledOnce).to.be.true;
    });

    it('should not error if hook does not exist', () => {

        const override = sinon.stub();

        const hook = mkHook('onBeforeMount');

        const component: any = {};

        hook(component, override);

        expect(() => component.onBeforeMount()).not.to.throw();
        expect(override.calledOnce).to.be.true;
    });

    it('should run hooks before or after', function () {

        const original = sinon.stub();
        const before = sinon.stub();
        const after = sinon.stub();

        const hook = mkHook('onBeforeMount');

        const component = {
            onBeforeMount: original
        };


        hook(component, before);

        component.onBeforeMount();
        expect(before.calledOnce, 'runBefore - before').to.be.true;
        expect(after.calledOnce, 'runBefore - after').to.be.false;

        sinon.resetHistory();

        component.onBeforeMount = original;

        hook(component, after, true);

        component.onBeforeMount();
        expect(before.calledOnce, 'runAfter - before').to.be.false;
        expect(after.calledOnce, 'runAfter - after').to.be.true;
    });

    it('should make riot lifecycle hooks', () => {

        const original = sinon.stub();
        const override = sinon.stub();

        const hooks = [
            'onBeforeMount',
            'onMounted',
            'onBeforeUpdate',
            'onUpdated',
            'onBeforeUnmount',
            'onUnmounted'
        ];

        const component: any = {};

        for (const hook of hooks) {

            component[hook] = original;
        }

        makeOnBeforeMount(component, override);
        makeOnMounted(component, override);
        makeOnBeforeUpdate(component, override);
        makeOnUpdated(component, override);
        makeOnBeforeUnmount(component, override);
        makeOnUnmounted(component, override);

        component.onBeforeMount();
        component.onMounted();
        component.onBeforeUpdate();
        component.onUpdated();
        component.onBeforeUnmount();
        component.onUnmounted();

        expect(original.callCount).to.eq(6);
        expect(override.callCount).to.eq(6);
    });

    it('should merge a components state', () => {

        const component: any = {
            state: { pepe: true }
        };

        mergeState(component, { pupu: 'papa' });

        expect(component.state).to.include({
            pepe: true,
            pupu: 'papa'
        });
    });
});



