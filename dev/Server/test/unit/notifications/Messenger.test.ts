import {expect} from 'chai';
import { Messenger } from '../../../src/DomainLayer/notifications/Messenger';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { MakeAppointment } from '../../../src/DomainLayer/user/MakeAppointment';
import { ACTION, Permission } from '../../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../../src/Result';

describe('Messenger tests' , function() 
{
    var messenger : Messenger = undefined;

    beforeEach(function () {
        Messenger.set_send_func( (_userId,_message) => Promise.reject());
        var messenger = Messenger.get_instance()
    })
    
    it('avi registers for updates from store', function() {
        let avi = new Subscriber("avi");
        messenger.register_store(123,avi);
        expect(messenger.get_store_subscribers().size).to.equal(1);

    });

    it('register same store twice', function() {
        let avi = new Subscriber("avi");
        messenger.register_store(123,avi);
        messenger.register_store(123,avi);
        expect(messenger.get_store_subscribers().size).to.equal(1);
    });

    it('unregister store test', function() {
        let avi = new Subscriber("avi");
        messenger.register_store(123,avi);
        messenger.unregister_store(123,avi);
        expect(messenger.get_store_subscribers().size).to.equal(0);

    });

    it('send message', function(){
        Messenger.set_send_func( (_userId,_message) => Promise.resolve(3));
        let avi = new Subscriber("avi");
        messenger.register_store(123,avi);
        messenger.send_message(avi,{"key" : 3});
        expect(avi.getMessages().length).to.equal(0);
    });

    it('fail to send message', function() {
        let avi = new Subscriber("avi");
        messenger.register_store(123,avi);
        messenger.send_message(avi,{"key" : 3});
        expect(avi.getMessages().length).to.equal(1)
    });

    it('fail to send 3 message', function() {
        let avi = new Subscriber("avi");
        messenger.register_store(123,avi);
        messenger.send_message(avi,{"key" : 3});
        messenger.send_message(avi,{"key" : 3});
        messenger.send_message(avi,{"key" : 3});
        expect(avi.getMessages().length).to.equal(3)
    });

})