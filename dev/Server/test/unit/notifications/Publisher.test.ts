import {expect} from 'chai';
import { Publisher } from '../../../src/DomainLayer/notifications/Publisher';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import {failIfAnyRejected, failIfRejected, failTest, HASHED_PASSWORD} from '../../testUtil';

describe('Publisher tests' , function() 
{
    var publisher : Publisher = Publisher.get_instance();
    publisher.set_send_func((_userId:number,_message:{}) => Promise.reject());

    beforeEach(function () {
        publisher.clear();
    })
    
    it('avi registers for updates from store', function() {
        let avi = new Subscriber("avi",HASHED_PASSWORD, 13);
        publisher.register_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(1);
    });

    it('register same store twice', function() {
        let avi = new Subscriber("avi",HASHED_PASSWORD, 13);
        publisher.register_store(123,avi);
        publisher.register_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(1);
    });

    it('unregister store test', function() {
        let avi = new Subscriber("avi",HASHED_PASSWORD, 13);
        publisher.register_store(123,avi);
        publisher.unregister_store(123,avi);
        expect(publisher.get_store_subscribers(123).length).to.equal(0);
    });

    it('send message worked', async function(){
        publisher.set_send_func( (_userId:number,_message:{}) => Promise.resolve(""));
        let avi = new Subscriber("avi",HASHED_PASSWORD, 13);
        publisher.register_store(123,avi);
        await failIfAnyRejected(() =>publisher.notify_store_update(123,"hello"))    
        expect(avi.getMessages().length).to.equal(0);
    });

    it('fail to send message',function() {
        try{
            let avi = new Subscriber("avi",HASHED_PASSWORD, 13);
            publisher.register_store(123,avi);
            publisher.notify_store_update(123,"hello")[0].then( _result => {
                expect(avi.getMessages().length).to.equal(1)
            });        
        }catch(e){
            failTest(`${e}`);
        }
    });

    it('fail to send 3 message', function() {
        try{
            let avi = new Subscriber("avi",HASHED_PASSWORD, 13);
            publisher.register_store(123,avi);
            publisher.notify_store_update(123,"hello")[0].then( _ =>{
                publisher.notify_store_update(123,"hello")[0].then( _ =>{
                    publisher.notify_store_update(123,"hello")[0].then (_ =>{
                        expect(avi.getMessages().length).to.equal(3)
                    });
                });
            });
        }catch(e){
            failTest(`${e}`);
        }
    });

    it('send pending messages to user', function() {
        try{
            publisher.set_send_func( (_userId:number,_message:{}) => Promise.resolve(""));
            let avi = new Subscriber("avi",HASHED_PASSWORD, 13);
            avi.addMessage("hello");
            avi.addMessage("hello");
            avi.addMessage("hello");
            let promises = publisher.send_pending_messages(avi);
            Promise.all(promises).then( _=> expect(avi.getMessages().length).to.equal(0))
        }catch(e){
            failTest(`${e}`);
        }
    });
})