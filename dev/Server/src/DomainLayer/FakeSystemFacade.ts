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
        .then(enterId =>{
            const JOE: string = 'joe'
            this.facade.register(JOE,PWD,30)
            .then((regRespStr) =>{
                this.facade.login(enterId,JOE,PWD)
                .then(joeSubscriber =>{
                    const joeId: number = joeSubscriber.getUserId();
                    this.facade.openStore(joeId,'joes_store',BANK_ACCT, ADRS)
                    .then(joesStore =>{
                        const joesStoreId: number = joesStore.getStoreId();
                        this.facade.addNewProduct(joeId,joesStoreId,'apple',[],1,100)
                        .then(appleId =>{
                            this.facade.addNewProduct(joeId,joesStoreId,'banana',[],2,100)
                            .then(bananaId =>{
                                this.facade.addNewProduct(joeId,joesStoreId,'orange',[],3,100)
                                .then(orangeId =>{
                                    this.enterRegisterAndLogin('john', (jonhSubscriber:Subscriber) =>{
                                        this.enterRegisterAndLogin('josh', (joshSubscriber)=>{
                                            this.facade.appointStoreOwner(joeId,joesStoreId,jonhSubscriber.getUserId())
                                            .then(s =>{
                                                this.facade.appointStoreOwner(joeId, joesStoreId, joshSubscriber.getUserId())
                                                .then(s => {
                                                    this.enterRegisterAndLogin('jack', (jackSubscriber)=>{
                                                        this.enterRegisterAndLogin('jim', (jimSubscriber)=>{
                                                            this.facade.appointStoreManager(joeId,joesStoreId,jackSubscriber.getUserId())
                                                            .then(s =>{
                                                                this.facade.appointStoreManager(joeId,joesStoreId,jimSubscriber.getUserId())
                                                                .then(s =>{
                                                                    this.enterRegisterAndLogin('tupac', (tupacSubscriber)=>{
                                                                        const tupacId = tupacSubscriber.getUserId();
                                                                        this.facade.addProductTocart(tupacId,joesStoreId,appleId,10)
                                                                        .then(s =>{
                                                                            this.facade.addProductTocart(tupacId,joesStoreId,bananaId,20)
                                                                            .then((s) =>{
                                                                                this.facade.addProductTocart(tupacId,joesStoreId,orangeId,25)
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