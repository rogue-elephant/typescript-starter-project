import { expect } from 'chai';
import { ExamplerDoesSomethinger } from "../index";

describe('DoesSomethinger.doSomething', () => {
    it('should return 4', () => {
        const foo = new ExamplerDoesSomethinger();
        expect(foo.doSomething(2)).to.equal(4);
    });
    it('should not return 3', () => {
        const foo = new ExamplerDoesSomethinger();
        expect(foo.doSomething(9)).not.to.equal(3);
    })
})