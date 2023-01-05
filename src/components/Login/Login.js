import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { authUser,getAllItems,getAllSales } from '../../lib/sari-api';
import { useDispatch } from 'react-redux';
import { userActions } from '../../store/user-slice';
import { salesActions } from '../../store/sales-slice';
import { debtActions } from '../../store/debt-slice';
import { itemsActions } from '../../store/items-slice';
import { useHistory } from 'react-router-dom';
import './Login.css'
import LoginModal from './LoginModal';

const Login = () =>{

    const [username,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [userValid,setUserValid] = useState(false);
    const [show,setShow] = useState(false);
    const [message,setMessage] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();

    const handleShow = () =>{
        setShow(true);
    }

    const handleHide= () =>{
        setShow(false);
    }

    const handleLogin = async (event) =>{
        event.preventDefault();
        setMessage('');
        if(username===""){
            setMessage('Username is empty!');
            handleShow();
            return;
        }
        if(password===""){
            setMessage('Password is empty!');
            handleShow();
            return;
        }
   
        const userObject = {
            username:username,
            password:password
        }
        if(userValid){
            setUserValid(!userValid);
        }
        else{
            setUserValid(!userValid);
        }

        const result = await authUser(userObject);
        try{
            if(result.data.token){
                dispatch(userActions.saveToken({
                    token:result.data.token
                }));
                localStorage.setItem('token',result.data.token);
    
                //getAllItems from dummy-api and replace items on slice
                getAllItems(result.data.token).then(items=>{
                dispatch(itemsActions.replaceItems(
                    items
                ));
                }
                );
            
                //getAllSales from dummy-api and replace sales and debt on slice
                getAllSales(result.data.token).then(sales=>{
                dispatch(salesActions.replaceSales(
                    sales.sales
                ));
                dispatch(debtActions.replaceDebt(
                    sales.debt
                ));
                }
                );
    
                history.replace('/inventory');//move to /inventory
            }
            else{
                setMessage(result.data.message);
                handleShow();
            }
        }
        catch(err){
            setMessage(result.message);
            handleShow();
        }
        
        //console.log(result.data.token);
    }

    const userNameChangeHandler = (event) =>{
        setUserName(event.target.value);
    }

    const passwordChangeHandler = (event) =>{
        setPassword(event.target.value);
    }

    return (
        <div className='login-card'>
            <Card>
                <Card.Header as="h5">Login</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label><b>Username</b></Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Username" 
                                value={username}
                                onChange={userNameChangeHandler}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label><b>Password</b></Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={passwordChangeHandler}
                                />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit"
                            onClick={handleLogin}
                        >
                            Sign In
                        </Button>
                </Form>
                </Card.Body>
            </Card>
            <div>
                <LoginModal
                    show={show} 
                    message={message}
                    handleClose={handleHide}
                />
            </div>
        </div>
    )
}

export default Login;