import Banner from "./Banner";

export const Complain = ({getAppState, setAppState}) => {
    return(
        <div>
            <Banner getAppState={getAppState} setAppState={setAppState} />
            Complain Page
        </div>
    );
};