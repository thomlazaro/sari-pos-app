import './NotFound.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';

const NotFound = () => {
    const history = useHistory();

    const navigateToHome = () =>{
        
        history.replace('/home')
    }

    return(
        <div className='container'>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <h1 className='not-found'>Page does not exist!</h1>
                </Form.Group>
                <Button variant="primary" type="button" onClick={navigateToHome}>
                    Back to Home
                </Button>
            </Form>
        </div>
    )
}

export default NotFound;