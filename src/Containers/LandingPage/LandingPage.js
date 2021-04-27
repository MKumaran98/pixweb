import Navbar from './NavBar/navbar/navbar'
import MobileNavBar from './NavBar/MobileNavBar/MobileNavBar'
import HomePage from '../HomePage/HomePage'
import {Redirect, Route,Switch,useLocation} from 'react-router-dom'
import Catagories from '../Catagories/Catagories'
import {useCatagory} from '../../Store/CatagoriesReducer'
import {useAuth} from '../../Store/AuthReducer'
import PlaylistPage from '../PlaylistPage/PlaylistPage'
import {useEffect} from 'react'
import VideoPlayer from '../Catagories/VideoPlayer/VideoPlayer'
import HistoryPage from '../History/History'
import LoginPage from '../LoginPage/LoginPage'
import Spinner from '../../UI/Spinner/Spinner'

const VideoPlayerRoute=({...props})=>{
    const {selectedVideo}=useCatagory()
    return(
        selectedVideo?<Route {...props}/>:<Redirect to="/"/>
    )
}

const PrivateLink=({...props})=>{
    const {token}=useAuth()
    return(
        token?<Route {...props}/>:<Redirect to="/login"/>
    )
}

const LockLogin=({...props})=>{
    const {token}=useAuth()
    return(
        token?<Redirect to="/"/>:<Route {...props}/>
    )
}

const LandingPage=()=>{
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    const {catagoriesLoading}=useCatagory()
    const {authLoading}=useAuth()

    return(
        <div>
            <Navbar/>
            {(catagoriesLoading||authLoading)&&<Spinner/>}
            <Switch>
                <Route path="/catagory/:id" component={Catagories}/>
                <PrivateLink path="/my-playlist" component={PlaylistPage}/>
                <VideoPlayerRoute path="/video-player" component={VideoPlayer}/>
                <PrivateLink path="/history" component={HistoryPage}/>
                <LockLogin path="/login" component={LoginPage}/>
                <Route path="/" component={HomePage}/>
            </Switch>
            <MobileNavBar/>
        </div>
    )
}

export default LandingPage;