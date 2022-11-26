import Card from 'react-bootstrap/Card';

const HomeCard = (props) =>{
    return(
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{props.subtitle}</Card.Subtitle>
                <Card.Title><b><i>{props.text}</i></b></Card.Title>
            </Card.Body>
      </Card>
    )
}

export default HomeCard;