import PropTypes from 'prop-types';
import './CarDetails.scss';

export default function CarDetails({ car }) {
    return (
        <>
            <div className="card">
                <div className="img"><img src={car?.imageURL} alt="car image" /></div>
                <div className='card-details-section'>
                    <h5>Manufacturer: <span className="car-details">{car?.make}</span></h5>
                    <h5>Model: <span className="car-details">{car?.model}</span></h5>
                    <h5>Manufacturing Year: <span className="car-details">{car?.year}</span></h5>
                    <h5>Category: <span className="car-details">{car?.type}</span></h5>
                    <h5>Seats: <span className="car-details">{car?.seats}</span></h5>
                    <h5>Bags: <span className="car-details">{car?.bags}</span></h5>
                    <h5>Features: <span className="car-details">{car.features?.join(', ')}</span></h5>
                    <h5>Rate:
                        <ul>
                            <li className='car-details'>Daily Rate: {car.rates.daily}$</li>
                            <li className='car-details'>Hourly Rate: {car.rates.hourly}$</li>
                            <li className='car-details'>Weekly Rate: {car.rates.weekly}$</li>
                        </ul>
                    </h5>
                </div>
            </div>
        </>
    );
}

CarDetails.propTypes = {
    car: PropTypes.shape({
        imageURL: PropTypes.string,
        make: PropTypes.string,
        model: PropTypes.string,
        year: PropTypes.number,
        type: PropTypes.string,
        seats: PropTypes.number,
        bags: PropTypes.number,
        features: PropTypes.arrayOf(PropTypes.string),
        rates: PropTypes.shape({
            daily: PropTypes.number,
            hourly: PropTypes.number,
            weekly: PropTypes.number
        })
    }).isRequired
};