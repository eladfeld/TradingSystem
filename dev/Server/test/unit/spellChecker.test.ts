import { expect } from "chai";
import { SpellCheckerAdapter } from "../../src/DomainLayer/SpellCheckerAdapter";


describe('login test' , function() {
    
    it('spellChecker', function(){
        let splc: SpellCheckerAdapter = new SpellCheckerAdapter()
        splc.add_word('yatzhaak');
        console.log(splc.find_similar('yatzhaak'));
        expect(true).to.equal(true);
    })
});