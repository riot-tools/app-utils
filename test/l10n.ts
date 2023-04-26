import {
    L10n,
    L10nLang,
    L10nOpts
} from '../lib';

import { expect } from 'chai';
import sinon from 'sinon';
import { DeepOptional } from '../lib/_helpers';

const english = {

    some: {
        nested: {
            label: 'what'
        },
        more: 'cookies'
    },
    food: {
        breakfast: 'I like {mainDish} with {sideDish} and {juice}.',
        lunch: 'I will usually have a {sandwichType} sandwich with {drink}.',
        dinner: 'Light dinners of {mainDish} and {sideDish} are my go-to.'
    },
};

const spanish: typeof english = {

    some: {
        nested: {
            label: 'que'
        },
        more: 'galletas dulce'
    },
    food: {
        breakfast: 'Me gusta {mainDish} con {sideDish} y {juice}.',
        lunch: 'Yo normalmente como un sandwich de {sandwichType} con {drink}.',
        dinner: 'Comida liviana de {mainDish} con {sideDish} son lo normal para mi.'
    },
};

const portugues: DeepOptional<typeof english> = {

    some: {
        more: 'galletas dulce'
    },
    food: {
        breakfast: 'Eu gusto de {mainDish} com {sideDish} e {juice}.',
        lunch: 'Eu normalmente como um sandwich de {sandwichType} com {drink}.',
        dinner: 'Comida levi de {mainDish} com {sideDish} são normal pra mim.'
    },
}

const labelsByCode = {
    en: english,
    es: spanish,
    pt: portugues
};

type Codes = keyof typeof labelsByCode;
type Lang = typeof english;

const langs: L10nOpts<Lang, Codes>['langs'] = {
    en: { code: 'en', text: 'English (America)', labels: english },
    es: { code: 'es', text: 'Spanish', labels: spanish },
    pt: { code: 'pt', text: 'Português', labels: portugues }
};

describe('L10n', function () {

    const l10nConfig: L10nOpts<Lang, Codes> = {

        current: 'en',
        fallback: 'en',
        langs
    }

    let l10bMngr: L10n<Lang, Codes>;

    it('requires a proper config', () => {

        expect(
            () => (

                new L10n <Lang, Codes>({
                    // current: 'en',
                    fallback: 'en',
                    langs
                } as any)
            )
        ).to.throw(/current lang.+not set/i)

        expect(
            () => (

                new L10n <Lang, Codes>({
                    current: 'en',
                    // fallback: 'en',
                    langs
                } as any)
            )
        ).to.throw(/fallback lang.+not set/i)

        expect(
            () => (

                new L10n <Lang, Codes>({
                    current: 'en',
                    fallback: 'en',
                    // langs
                } as any)
            )
        ).to.throw(/config.+not set/i)

        expect(
            () => (

                new L10n <Lang, Codes>({
                    current: 'en',
                    fallback: 'en',
                    langs: 'wee'
                } as any)
            )
        ).to.throw(/config.+not an object/i)

        expect(
            () => (

                new L10n <Lang, Codes>({
                    current: 'en',
                    fallback: 'en',
                    langs: []
                } as any)
            )
        ).to.throw(/config.+can not.+array/i)
    });

    it('instantiates', () => {

        l10bMngr = new L10n <Lang, Codes>({
            current: 'en',
            fallback: 'en',
            langs
        })
    });

    it('gets a text label', () => {

        expect(l10bMngr.text('some.more')).to.eq(english.some.more);
        expect(l10bMngr.text('some.nested.label')).to.eq(english.some.nested.label);
    });

    it('changes language', () => {

        l10bMngr.changeTo('es');

        expect(l10bMngr.text('some.more')).to.eq(spanish.some.more);
        expect(l10bMngr.text('some.nested.label')).to.eq(spanish.some.nested.label);
    });

    it('has events', () => {

        const stub = sinon.stub();

        l10bMngr.on('language-change', stub);
        l10bMngr.changeTo('en');

        const [[event]] = stub.args;

        expect(event.type).to.eq('language-change');
        expect(event.code).to.eq('en');

        l10bMngr.off('language-change', stub);
        l10bMngr.changeTo('en');

        expect(stub.calledOnce).to.be.true;
    });

    it('replaces variables', () => {

        const mainDish = 'lamb';
        const sideDish = 'peas';
        const juice = 'orange';
        const sandwichType = 'ham';
        const drink = 'coke';

        const replaceWith = { mainDish, sideDish, juice, sandwichType, drink };

        const tests = {
            en: [

                ['breakfast', `I like ${mainDish} with ${sideDish} and ${juice}.`,],
                ['lunch', `I will usually have a ${sandwichType} sandwich with ${drink}.`,],
                ['dinner', `Light dinners of ${mainDish} and ${sideDish} are my go-to.`],
            ],
            es: [

                ['breakfast', `Me gusta ${mainDish} con ${sideDish} y ${juice}.`,],
                ['lunch', `Yo normalmente como un sandwich de ${sandwichType} con ${drink}.`,],
                ['dinner', `Comida liviana de ${mainDish} con ${sideDish} son lo normal para mi.`],
            ],
            pt: [

                ['breakfast', `Eu gusto de ${mainDish} com ${sideDish} e ${juice}.`,],
                ['lunch', `Eu normalmente como um sandwich de ${sandwichType} com ${drink}.`,],
                ['dinner', `Comida levi de ${mainDish} com ${sideDish} são normal pra mim.`],
            ]
        };

        for (const c in tests) {

            const vals = tests[c];
            const code = c as Codes;
            l10bMngr.changeTo(code);

            for (const [key, val] of vals) {

                const food = l10bMngr.text(`food.${key}` as any, replaceWith);
                expect(food, code).to.eq(val);
            }
        }
    });

    it('has a fallback language when labels are missing', () => {

        l10bMngr.changeTo('pt');
        expect(l10bMngr.text('some.more')).to.eq(portugues.some.more);
        expect(l10bMngr.text('some.nested.label')).to.eq(english.some.nested.label);
    });

    it('gives a list of languages', () => {

        console.log(l10bMngr.languages);
    });

});