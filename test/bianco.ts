import {
    HtmlViewport,
    HtmlCss,
    HtmlEvents,
    HtmlAttr,
    $
} from '../lib';


import { expect } from 'chai';
import sinon from 'sinon';

const document = window.document;


const stub: {
    sampleCss?: Partial<CSSStyleDeclaration>
} = {};

describe('HtmlViewport', function () {

    it('scrollbarWidth is a number', function () {
        const result = HtmlViewport.scrollbarWidth;
        expect(typeof result).to.equal('number');
        expect(Number.isNaN(result)).to.equal(false);
    });

    it('documentHeight is a number', function () {
        const result = HtmlViewport.documentHeight;
        expect(typeof result).to.equal('number');
        expect(Number.isNaN(result)).to.equal(false);
    });

    it('documentWidth is a number', function () {
        const result = HtmlViewport.documentWidth;
        expect(typeof result).to.equal('number');
        expect(Number.isNaN(result)).to.equal(false);
    });

    it('scrollTop is a number', function () {
        const result = HtmlViewport.scrollTop;
        expect(typeof result).to.equal('number');
        expect(Number.isNaN(result)).to.equal(false);
    });

    it('scrollLeft is a number', function () {
        const result = HtmlViewport.scrollLeft;
        expect(typeof result).to.equal('number');
        expect(Number.isNaN(result)).to.equal(false);
    });

    it('elementOffsetTop is a number', function () {
        const div = document.createElement('div')
        const result = HtmlViewport.elementOffsetTop(div);
        expect(typeof result).to.equal('number');
        expect(Number.isNaN(result)).to.equal(false);
    });

    it('elementOffsetLeft is a number', function () {
        const div = document.createElement('div')
        const result = HtmlViewport.elementOffsetLeft(div);
        expect(typeof result).to.equal('number');
        expect(Number.isNaN(result)).to.equal(false);
    });
});


describe('HtmlCss', function () {

    stub.sampleCss = {
        color: 'red',
        fontSize: '12px'
    }

    it('it can set a style attribute', function () {

        const div = document.createElement('div');
        HtmlCss.set(div, stub.sampleCss!);

        expect(div.style.fontSize).to.equal(stub.sampleCss!.fontSize);
        expect(div.style.color).to.equal(stub.sampleCss!.color);
    });

    it('it can set a style attribute on many nodes', function () {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlCss.set([div, span], stub.sampleCss!);

        expect(div.style.fontSize).to.equal(stub.sampleCss!.fontSize);
        expect(div.style.color).to.equal(stub.sampleCss!.color);

        expect(span.style.fontSize).to.equal(stub.sampleCss!.fontSize);
        expect(span.style.color).to.equal(stub.sampleCss!.color);
    });

    it('it can get style attributes', function () {

        const div = document.createElement('div');
        HtmlCss.set(div, stub.sampleCss!);

        expect(HtmlCss.get(div, 'color')).to.equal(stub.sampleCss!.color);

    });

    it('it can get style attributes on many nodes', function () {

        const div = document.createElement('div');
        const span = document.createElement('span');

        HtmlCss.set([div, span], stub.sampleCss!);

        const result = HtmlCss.get([div, span], 'color');

        expect(result[0]).to.include(stub.sampleCss!.color);
        expect(result[1]).to.include(stub.sampleCss!.color);
    });

    it('it can get many style attributes', function () {

        const div = document.createElement('div');
        HtmlCss.set(div, stub.sampleCss!);

        expect(HtmlCss.get(div, ['color', 'fontSize'])).to.include(stub.sampleCss!);

    });

    it('it can get many style attributes on many nodes', function () {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlCss.set([div, span], stub.sampleCss!);

        const results = HtmlCss.get([div, span], ['color', 'fontSize']);

        expect(results[0]).to.include(stub.sampleCss!);
        expect(results[1]).to.include(stub.sampleCss!);
    });

    it('it can remove style attributes', function () {

        const div = document.createElement('div');
        HtmlCss.set(div, stub.sampleCss!);

        HtmlCss.remove(div, 'color');

        expect(div.style.color).to.be.empty;
    });

    it('it can remove style attributes from many nodes', function () {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlCss.set([div, span], stub.sampleCss!);

        HtmlCss.remove([div, span], 'color');

        expect(div.style.color).to.be.empty;
        expect(span.style.color).to.be.empty;

    });

    it('it can remove many style attributes from many nodes', function () {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlCss.set([div, span], stub.sampleCss!);

        HtmlCss.remove([div, span], Object.keys(stub.sampleCss!));

        expect(div.style.color).to.be.empty;
        expect(div.style.fontSize).to.be.empty;
        expect(span.style.color).to.be.empty;
        expect(span.style.fontSize).to.be.empty;
    });
});


describe('Bianco query ($)', function () {

    before(function () {
        const div = document.createElement('div')

        div.innerHTML = `
            <ul>
                <li class='item'></li>
                <li class='item'></li>
            </ul>
        `
        document.body.appendChild(div)
    });

    it('It can query the DOM properly', function () {
        const div = $('div')
        expect(Array.isArray(div)).to.equal(true);
        expect(div.length).to.equal(1);
        expect($('.item', div[0]).length).to.equal(2);
    });

    it('No matched queries return empty arrays', function () {
        const els = $('.foo')
        expect(Array.isArray(els)).to.equal(true)
        expect(typeof els).to.equal('object')
        expect(els.length).to.equal(0)
    });
});

describe('HtmlEvents', () => {

    afterEach(() => {

        sinon.resetBehavior();
    });

    it('should add a single event', () => {

        const div = document.createElement('div');
        const listener = sinon.fake();

        sinon.spy(div);

        HtmlEvents.on(div, 'click', listener);


        const addEventListener = div.addEventListener as sinon.SinonSpy;

        expect(addEventListener.calledOnce).to.be.true;
        expect(addEventListener.calledWith('click', listener)).to.be.true;
    });

    it('should add a single event to many elements', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        const listener = sinon.fake();

        sinon.spy(div);
        sinon.spy(span);

        HtmlEvents.on([div, span], 'click', listener);

        const addEvents = [
            div.addEventListener as sinon.SinonSpy,
            span.addEventListener as sinon.SinonSpy
        ];

        for (const addEventListener of addEvents) {

            expect(addEventListener.calledOnce).to.be.true;
            expect(addEventListener.calledWith('click', listener)).to.be.true;
        }
    });

    it('should add many events', () => {

        const div = document.createElement('div');
        const listener = sinon.fake();

        sinon.spy(div);

        HtmlEvents.on(div, ['click', 'mousedown', 'blur'], listener);

        const addEventListener = div.addEventListener as sinon.SinonSpy;

        expect(addEventListener.calledThrice).to.be.true;
        expect(addEventListener.calledWith('click', listener)).to.be.true;
        expect(addEventListener.calledWith('mousedown', listener)).to.be.true;
        expect(addEventListener.calledWith('blur', listener)).to.be.true;
    });

    it('should add many events to many elements', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        const listener = sinon.fake();

        sinon.spy(div);
        sinon.spy(span);

        HtmlEvents.on([div, span], ['click', 'mousedown', 'blur'], listener);

        const addEvents = [
            div.addEventListener as sinon.SinonSpy,
            span.addEventListener as sinon.SinonSpy
        ];

        for (const addEventListener of addEvents) {

            expect(addEventListener.calledThrice).to.be.true;
            expect(addEventListener.calledWith('click', listener)).to.be.true;
            expect(addEventListener.calledWith('mousedown', listener)).to.be.true;
            expect(addEventListener.calledWith('blur', listener)).to.be.true;
        }
    });

    it('should remove a single event', () => {

        const div = document.createElement('div');
        const listener = sinon.fake();

        sinon.spy(div);

        HtmlEvents.on(div, 'click', listener);
        HtmlEvents.off(div, 'click', listener);

        const removeEventListener = div.removeEventListener as sinon.SinonSpy;

        expect(removeEventListener.calledOnce).to.be.true;
        expect(removeEventListener.calledWith('click', listener)).to.be.true;
    });

    it('should remove many events for many elements', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        const listener = sinon.fake();

        sinon.spy(div);
        sinon.spy(span);

        HtmlEvents.on([div, span], ['click', 'mousedown', 'blur'], listener);
        HtmlEvents.off([div, span], ['click', 'mousedown', 'blur'], listener);

        const addEvents = [
            div.removeEventListener as sinon.SinonSpy,
            span.removeEventListener as sinon.SinonSpy
        ];

        for (const removeEventListener of addEvents) {

            expect(removeEventListener.calledThrice).to.be.true;
            expect(removeEventListener.calledWith('click', listener)).to.be.true;
            expect(removeEventListener.calledWith('mousedown', listener)).to.be.true;
            expect(removeEventListener.calledWith('blur', listener)).to.be.true;
        }
    });

    it('should trigger a single event with data', () => {

        const div = document.createElement('div');
        const listener = sinon.fake();

        sinon.spy(div);

        HtmlEvents.on(div, 'click', listener);
        HtmlEvents.trigger(div, 'click', { data: true });

        const dispatchEvent = div.dispatchEvent as sinon.SinonSpy;

        expect(dispatchEvent.calledOnce).to.be.true;

        const { args: [args] } = dispatchEvent.getCall(0);

        expect(args).to.be.an.instanceOf(window.CustomEvent);

        expect(args.detail).to.include({ data: true });
        expect(listener.calledOnce).to.be.true;
    });

    it('should only trigger an event once', () => {

        const div = document.createElement('div');
        const listener = sinon.fake();

        sinon.spy(div);

        HtmlEvents.one(div, 'click', listener);
        HtmlEvents.trigger(div, 'click');
        HtmlEvents.trigger(div, 'click');
        HtmlEvents.trigger(div, 'click');

        expect(listener.calledOnce).to.be.true;
    });

    it('should only trigger many event once on many elements', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        const listener = sinon.fake();

        HtmlEvents.one([div, span], ['click', 'blur', 'focus'], listener);
        HtmlEvents.trigger([div, span], 'click');
        HtmlEvents.trigger([div, span], 'click');
        HtmlEvents.trigger([div, span], 'blur');
        HtmlEvents.trigger([div, span], 'blur');
        HtmlEvents.trigger([div, span], 'focus');
        HtmlEvents.trigger([div, span], 'focus');

        expect(listener.callCount).to.eq(6);
    });
});

describe('HtmlAttr', () => {

    it('it can set an attribute', () => {

        const div = document.createElement('div');
        HtmlAttr.set(div, { hidden: 'true' })

        expect(div.getAttribute('hidden')).to.equal('true');
    });

    it('it can set an attribute on many nodes', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlAttr.set([div, span], { hidden: 'true' })

        expect(div.getAttribute('hidden')).to.equal('true');
        expect(span.getAttribute('hidden')).to.equal('true');
    });

    it('it can set many attributes', () => {

        const div = document.createElement('div');
        HtmlAttr.set(div, { hidden: 'true', data: 'false' });

        expect(div.getAttribute('hidden')).to.equal('true');
        expect(div.getAttribute('data')).to.equal('false');
    });

    it('it can set many attributes on many nodes', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlAttr.set([div, span], { hidden: 'true', data: 'false' });

        expect(div.getAttribute('hidden')).to.equal('true');
        expect(div.getAttribute('data')).to.equal('false');

        expect(span.getAttribute('hidden')).to.equal('true');
        expect(span.getAttribute('data')).to.equal('false');
    });

    it('it can get attributes', () => {

        const div = document.createElement('div');
        HtmlAttr.set(div, { hidden: 'true' })

        expect(HtmlAttr.get(div, 'hidden')).to.equal('true');
    });

    it('it can get attributes on many nodes', () => {

        const div = document.createElement('div');
        const span = document.createElement('div');
        HtmlAttr.set([div, span], { hidden: 'true' })

        const result = HtmlAttr.get([div, span], 'hidden');

        expect(result[0]).to.equal('true');
        expect(result[1]).to.equal('true');
    });


    it('it can get many attributes on many nodes', () => {

        const div = document.createElement('div');
        const span = document.createElement('div');

        const attrs = {
            hidden: 'true',
            data: 'false'
        };

        HtmlAttr.set([div, span], attrs)

        const result = HtmlAttr.get([div, span], ['hidden', 'data']);

        expect(result[0]).to.include(attrs);
        expect(result[1]).to.include(attrs);
    });

    it('it can remove attributes', () => {

        const div = document.createElement('div');
        HtmlAttr.set(div, { hidden: 'true' })

        HtmlAttr.remove(div, 'hidden');

        expect(div.getAttribute('hidden')).to.equal(null);
    });

    it('it can remove attributes from many nodes', () => {

        const div = document.createElement('div');
        const span = document.createElement('div');

        HtmlAttr.set([div, span], { hidden: 'true', data: 'false' })
        HtmlAttr.remove([div, span], ['hidden', 'data']);

        const result = HtmlAttr.get([div, span], ['hidden', 'data']);

        const nope = {
            hidden: null,
            data: null
        };

        expect(result[0]).to.include(nope);
        expect(result[1]).to.include(nope);
    });

    it('it can detect attributes', () => {

        const div = document.createElement('div');
        HtmlAttr.set(div, { hidden: 'true' })

        expect(HtmlAttr.has(div, 'hidden')).to.equal(true);
        expect(HtmlAttr.has(div, 'poops')).to.equal(false);
    });

    it('it can detect attributes on many nodes', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlAttr.set([div, span], { hidden: 'true' })

        const result = HtmlAttr.has([div, span], 'hidden');
        expect(result[0]).to.equal(true);
        expect(result[1]).to.equal(true);
    });

    it('it can detect many attributes on many nodes', () => {

        const div = document.createElement('div');
        const span = document.createElement('span');
        HtmlAttr.set([div, span], { hidden: 'true', data: 'false' })

        const attrs = {
            hidden: true,
            data: true
        };

        const result = HtmlAttr.has([div, span], ['hidden', 'data']);
        expect(result[0]).to.include(attrs);
        expect(result[1]).to.include(attrs);
    });

})