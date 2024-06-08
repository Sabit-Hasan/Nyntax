import { useContext } from "react";
import CarDetails from "../../components/CarDetails/CarDetails";
import './Home.scss'
import { Link } from "react-router-dom";
import { CarContext } from "../../context/CarContext";

export default function Home() {
    const { carData } = useContext(CarContext);
    
    return (
        <>
            <div className="container">
                <div className="home-container">
                    <div className="home-title">
                        <h3>Available Cars</h3>
                        <Link to="/reservation"><button className="reservation-btn">Reservation</button></Link>
                    </div>
                    <div className="card-group">
                        {
                            carData && carData.map((car, index) => (<CarDetails key={index} car={car} />))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}