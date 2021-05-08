import { servicesVersion } from "typescript";
import { SystemFacade } from "./SystemFacade";
import { Subscriber } from "./user/Subscriber";

const PWD: string = 'pwd';
const BANK_ACCT: number = 12345678;
const ADRS: string = '313 8 Mile Road, Detroit'

export default class FakeSystemFacade extends SystemFacade{
    // private logged_guest_users : User[];
    // private logged_subscribers : Subscriber[];
    // private logged_system_managers : Subscriber[];
    private facade: SystemFacade;



    public constructor()
    {
        super();
        this.facade = new SystemFacade();

        this.facade.enter()
        .then(joe_sessionId =>{
            const JOE: string = 'joe'
            this.facade.register(JOE,PWD,30)
            .then((regRespStr) =>{
                this.facade.login(joe_sessionId,JOE,PWD)
                .then(joeSubscriber =>{
                     "12313546";
                    this.facade.openStore(joe_sessionId,'joes_store',BANK_ACCT, ADRS)
                    .then(joesStore =>{
                        const joesStoreId: number = joesStore.getStoreId();
                        this.facade.addNewProduct(joe_sessionId,joesStoreId,'apple',[],1,100)
                        .then(appleId =>{
                            this.facade.addNewProduct(joe_sessionId,joesStoreId,'banana',[],2,100)
                            .then(bananaId =>{
                                this.facade.addNewProduct(joe_sessionId,joesStoreId,'orange',[],3,100)
                                .then(orangeId =>{
                                    this.enterRegisterAndLogin('john', (jonhSubscriber:Subscriber) =>{
                                        this.enterRegisterAndLogin('josh', (joshSubscriber)=>{
                                            this.facade.appointStoreOwner(joe_sessionId,joesStoreId,jonhSubscriber.getUserId())
                                            .then(s =>{
                                                this.facade.appointStoreOwner(joe_sessionId, joesStoreId, joshSubscriber.getUserId())
                                                .then(s => {
                                                    this.enterRegisterAndLogin('jack', (jackSubscriber)=>{
                                                        this.enterRegisterAndLogin('jim', (jimSubscriber)=>{
                                                            this.facade.appointStoreManager(joe_sessionId,joesStoreId,jackSubscriber.getUserId())
                                                            .then(s =>{
                                                                this.facade.appointStoreManager(joe_sessionId,joesStoreId,jimSubscriber.getUserId())
                                                                .then(s =>{
                                                                    this.facade.enter().then( topac_session_id => {
                                                                    this.enterRegisterAndLogin('tupac', (tupacSubscriber)=>{
                                                                        const tupacId = tupacSubscriber.getUserId();
                                                                        this.facade.addProductTocart(topac_session_id,joesStoreId,appleId,10)
                                                                        .then(s =>{
                                                                            this.facade.addProductTocart(topac_session_id,joesStoreId,bananaId,20)
                                                                            .then((s) =>{
                                                                                this.facade.addProductTocart(topac_session_id,joesStoreId,orangeId,25)
                                                                                .then(s => console.log('system initialized'))
                                                                            })
                                                                        })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }).catch((e) => console.log(e));

    }



    private enterRegisterAndLogin = (userName: string, andThen: (x:Subscriber)=>void) =>{
        this.facade.enter()
        .then(enterId =>{
            this.facade.register(userName,PWD,30)
            .then((regRespStr) =>{
                this.facade.login(enterId,userName,PWD)
                .then(subscriber => andThen(subscriber));
            });
        });
    }

    public getFacade = () => this.facade;
}