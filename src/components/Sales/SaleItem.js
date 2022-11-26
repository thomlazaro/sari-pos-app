import Form from 'react-bootstrap/Form';

const SaleItem = (props)=>{

    return(
        <Form.Group className="mb-3" controlId={`addItemForm.${props.item.id}`}>
            <div>
                <Form.Label><b>{props.item.name}</b></Form.Label>
            </div>
            <div>
                <Form.Label>Price per unit: <b>P{props.item.selling_price}</b></Form.Label>
            </div>
            <Form.Label><i>Quantity: </i><b>{props.item.buy_count}</b></Form.Label> 
            <div>
            <Form.Label><i>Paying Price: </i><b>P{props.item.buy_count*props.item.selling_price}</b></Form.Label>                
            </div> 
            <hr />         
        </Form.Group>
    )
}

export default SaleItem;