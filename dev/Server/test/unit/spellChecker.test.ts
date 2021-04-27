import { expect } from "chai";
import { SpellCheckerAdapter } from "../../src/DomainLayer/SpellCheckerAdapter";


describe('spell checker' , function() {
    
    it('spell Checker', function(){
        let splc: SpellCheckerAdapter = new SpellCheckerAdapter()
        splc.add_word('yatzhaak');
        console.log(splc.find_similar('elad'));
        expect(true).to.equal(true);
    })
});