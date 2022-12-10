import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useHistory } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { userActions } from '../../store/user-slice';
import { Fragment } from 'react';

function Header() {

  const history = useHistory();
  const userState = useSelector(state=>state.user); 
  const dispatch = useDispatch();
  const navigateDropDown = (navigate) =>{
    if(navigate==='/logout'){
      //console.log(userState.token.trim().length);
      dispatch(userActions.removeToken());
      localStorage.removeItem('token');
      history.replace('/login');
      return;
    }
    history.replace(navigate);
  }  

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Link to='/home'>
            <Navbar.Brand>Sari-Sari POS</Navbar.Brand>
        </Link>
        {userState.token.trim().length!==0&& <Fragment>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Menu" id="basic-nav-dropdown">  
                <NavDropdown.Item>
                    <div onClick={()=>navigateDropDown('/home')}>Home</div>
                </NavDropdown.Item>
              <NavDropdown.Item>
                    <div onClick={()=>navigateDropDown('/inventory')}>Inventory</div>
              </NavDropdown.Item>   
                <NavDropdown.Item>
                    <div onClick={()=>navigateDropDown('/cart')}>Cart</div>
                </NavDropdown.Item>
              <NavDropdown.Divider />           
                <NavDropdown.Item>
                    <div onClick={()=>navigateDropDown('/sales')}>Sales</div>
                </NavDropdown.Item>  
                <NavDropdown.Item>
                    <div onClick={()=>navigateDropDown('/debt')}>Debt</div>
                </NavDropdown.Item>
                <NavDropdown.Divider /> 
                <NavDropdown.Item>
                    <div onClick={()=>navigateDropDown('/logout')}>Logout</div>
                </NavDropdown.Item> 
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        </Fragment>}
      </Container>
    </Navbar>
  );
}

export default Header;