import classes from './navbar.module.css'
import Logo from './Logo/Logo'
import Hamburger from './Hamburger/Hamburger'
import DesktopNavMenu from './DesktopNavMenu/DesktopNavMenu'
import {useLocation} from 'react-router-dom'
import Avatar from './Avatar/Avatar'

const Navbar=()=>{
    let {pathname}=useLocation();
    return(
        <nav>
            <div className={classes["navbar"]}>
                {pathname.slice(0,9)==="/catagory"&&<Hamburger/>}
                {pathname.slice(0,9)!=="/catagory"&&<Logo/>}
                <Avatar/>
            </div>
            <DesktopNavMenu/>
        </nav>
    )

}

export default Navbar;