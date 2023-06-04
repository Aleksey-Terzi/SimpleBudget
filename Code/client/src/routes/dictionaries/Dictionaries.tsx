import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Dictionaries() {
    return (
        <Card>
            <Card.Header>
                <Card.Title>Dictionaries</Card.Title>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md="4">
                        <Link className="btn btn-outline-secondary w-100 d-block mb-3" to="/categories">
                            Categories
                        </Link>
                        <Link className="btn btn-outline-secondary w-100 d-block mb-3" to="/companies">
                            Companies
                        </Link>
                        <Link className="btn btn-outline-secondary w-100 d-block mb-3" to="/currencies">
                            Currencies
                        </Link>
                        <Link className="btn btn-outline-secondary w-100 d-block mb-3" to="/taxes">
                            Taxes
                        </Link>
                        <Link className="btn btn-outline-secondary w-100 d-block mb-3" to="/wallets">
                            Wallets
                        </Link>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}