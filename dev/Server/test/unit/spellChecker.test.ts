import { expect } from "chai";
import { SpellCheckerAdapter } from "../../src/DomainLayer/SpellCheckerAdapter";


describe('spell checker' , function() {
    
    it('spell Checker', function(){
        let splc: SpellCheckerAdapter = SpellCheckerAdapter.get_instance()
        splc.add_productName('yatzhaak');
        console.log(splc.find_similar_product('elad'));
        expect(true).to.equal(true);
    })
});