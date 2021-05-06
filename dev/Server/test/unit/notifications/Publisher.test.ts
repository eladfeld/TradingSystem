import {expect} from 'chai';
import { Publisher } from '../../../src/DomainLayer/notifications/Publisher';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { MakeAppointment } from '../../../src/DomainLayer/user/MakeAppointment';
import { ACTION, Permission } from '../../../src/DomainLayer/user/Permission';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../../src/Result';

describe('Publisher tests' , function() 
{
    var publisher : Publisher = Publisher.get_instance();
    publisher.set_send_func((_userId:number,_message:{}) => Promise.reject());

    beforeEach(function () {
        publisher.clear();
    })
    
    it('avi registers for updates from store', function() {
        let avi = new Subscriber("avi", 13);
        publisher.register_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(1);
    });

    it('register same store twice', function() {
        let avi = new Subscriber("avi", 13);
        publisher.register_store(123,avi);
        publisher.register_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(1);
    });

    it('unregister store test', function() {
        let avi = new Subscriber("avi", 13);
        publisher.register_store(123,avi);
        publisher.unregister_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(0);
    });

    it('send message worked', function(){
        publisher.set_send_func( (_userId:number,_message:{}) => Promise.resolve(3));
        let avi = new Subscriber("avi", 13);
        publisher.register_store(123,avi);
        publisher.notify_store_update(123,{"key" : 3});
        expect(avi.getMessages().length).to.equal(0);
    });

    it('fail to send message',function() {
        let avi = new Subscriber("avi", 13);
        publisher.register_store(123,avi);
        publisher.notify_store_update(123,{"key" : 3})[0].then( _result => {
            expect(avi.getMessages().length).to.equal(1)
        });
        
    });

    it('fail to send 3 message', function() {
        let avi = new Subscriber("avi", 13);
        publisher.register_store(123,avi);
        publisher.notify_store_update(123,{"key" : 3})[0].then( _ =>{
            publisher.notify_store_update(123,{"key" : 3})[0].then( _ =>{
                publisher.notify_store_update(123,{"key" : 3})[0].then (_ =>{
                    expect(avi.getMessages().length).to.equal(3)
                });
            });
        });
    });

    it('send pending messages to user', function() {
        publisher.set_send_func( (_userId:number,_message:{}) => Promise.resolve(3));
        let avi = new Subscriber("avi", 13);
        avi.addMessage({"msg" : "test msg 1"});
        avi.addMessage({"msg" : "test msg 2"});
        avi.addMessage({"msg" : "test msg 3"});
        let promises = publisher.send_pending_messages(avi);
        Promise.all(promises).then( _=> expect(avi.getMessages().length).to.equal(0))
    });
})