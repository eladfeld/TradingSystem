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
        let avi = new Subscriber("avi");
        publisher.register_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(1);

    });

    it('register same store twice', function() {
        let avi = new Subscriber("avi");
        publisher.register_store(123,avi);
        publisher.register_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(1);
    });

    it('unregister store test', function() {
        let avi = new Subscriber("avi");
        publisher.register_store(123,avi);
        publisher.unregister_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(0);
    });

    it('send message', function(){
        publisher.set_send_func( (_userId:number,_message:{}) => Promise.resolve(3));
        let avi = new Subscriber("avi");
        publisher.register_store(123,avi);
        publisher.send_message(avi,{"key" : 3});
        expect(avi.getMessages().length).to.equal(0);
    });

    it('fail to send message',function() {
        let avi = new Subscriber("avi");
        publisher.register_store(123,avi);
        publisher.send_message(avi,{"key" : 3}).then( _result => {
            expect(avi.getMessages().length).to.equal(1)
        });
        
    });

    it('fail to send 3 message', function() {
        let avi = new Subscriber("avi");
        publisher.register_store(123,avi);
        publisher.send_message(avi,{"key" : 3}).then( _ =>{
            publisher.send_message(avi,{"key" : 3}).then( _ =>{
                publisher.send_message(avi,{"key" : 3}).then (_ =>{
                    expect(avi.getMessages().length).to.equal(3)
                });
            });
        });
    });


})