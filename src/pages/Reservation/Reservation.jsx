import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useEffect, useState } from "react";
import { CarContext } from '../../context/CarContext';

import './Reservation.scss';
import { useNavigate } from "react-router-dom";

export default function Reservation() {
    const { carData, vehicleTypes, carModels } = useContext(CarContext);
    const [reservationId, setReservationId] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [weeks, setWeeks] = useState(0);
    const [duration, setDuration] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [discount, setDiscount] = useState(0);
    const [selectedVehicleType, setSelectedVehicleType] = useState('');
    const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
    const [vehicleRate, setVehicleRate] = useState({ hourly: 0, daily: 0, weekly: 0 });
    const [totalCost, setTotalCost] = useState(0);
    const [additionalCharges, setAdditionalCharges] = useState({
        collision: false,
        liability: false,
        rental: false
    });

    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',

    });
    
    const navigate = useNavigate();

    // Generating reservation ID randomly
    useEffect(() => {
        const generateId = () => {
            const chars = '0123456789';
            let id = '';
            for (let i = 0; i < 7; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setReservationId(id);
        };
        generateId();
    }, []);

    // Calculating duration from return to start date
    useEffect(() => {
        const difference = returnDate - startDate;

        if (difference < 0) {
            if (startDate && returnDate) {
                setError(true)
                setErrorMessage("Return date cannot be before pickup date.");
                setReturnDate(null);
            }
        } else {
            setError(false);
            const timeDifferenceInHours = difference / (1000 * 3600);

            const days = Math.floor(timeDifferenceInHours / 24);
            const remainingHours = Math.floor(timeDifferenceInHours % 24);

            let result = "";
            let weeks = "";

            if (days > 6) {
                weeks = Math.floor(days / 7);
                const remainingDays = days % 7;
                result += `${weeks} w${weeks > 1 ? "s" : ""}`;
                if (remainingDays > 0) {
                    result += ` ${remainingDays} d${remainingDays > 1 ? "s" : ""}`;
                }
            } else {
                result += `${days} d${days > 1 ? "s" : ""}`;
            }

            if (remainingHours > 0) {
                result += ` ${remainingHours} h${remainingHours > 1 ? "s" : ""}`;
            }

            setDuration(result);
            setDays(days % 7);
            setHours(remainingHours);
            setWeeks(weeks === "" ? 0 : weeks);
        }
    }, [startDate, returnDate]);


    const handleChange = (date, whichDate) => {
        if (whichDate === 'startDate') {
            setStartDate(date);
        } else {
            setReturnDate(date);
        }
    };

    // Preventing negative values
    const handleNegativeValue = (e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, '');
        setDiscount(newValue ? parseInt(newValue) : 0);
    };

    // Handle the selection of vehicle type
    const handleVehicleTypeChange = (e) => {
        setSelectedVehicleType(e.target.value);
        setSelectedVehicleModel('');
        setVehicleRate({ hourly: 0, daily: 0, weekly: 0 });
    };

    // Handle the selection of vehicle model
    const handleVehicleModelChange = (e) => {
        setSelectedVehicleModel(e.target.value);
        const selectedVehicle = carData.find(car => car.model === e.target.value);
        if (selectedVehicle) {
            setVehicleRate(selectedVehicle.rates);
        }
    };

    // Handle Customer Data
    const handleCustomerData = (e) => {
        const { name, value } = e.target;
        setCustomerData({
            ...customerData,
            [name]: value,
        });
    };

    // Handle the selection of additional charges
    const handleAdditionalChargeChange = (e) => {
        setAdditionalCharges({
            ...additionalCharges,
            [e.target.name]: e.target.checked
        });
    };

    // Calculate total cost
    useEffect(() => {
        if (vehicleRate) {
            const dailyCost = days * vehicleRate.daily;
            const hourlyCost = hours * vehicleRate.hourly;
            const weeklyCost = weeks * vehicleRate.weekly;

            let additionalCost = 0;
            if (additionalCharges.collision) additionalCost += 9;
            if (additionalCharges.liability) additionalCost += 15;
            if (additionalCharges.rental) additionalCost += 11.5;

            const total = dailyCost + hourlyCost + weeklyCost + additionalCost - discount;
            setTotalCost(total);
        }
    }, [days, hours, weeks, vehicleRate, additionalCharges, discount]);

    // Print Button Handle Function
    const handlePrintbtn = () => {
        if (customerData.firstName && customerData.lastName && customerData.email && customerData.phone) {
            const invoiceData = {
                customerData,
                pickupTime: startDate,
                returnTime: returnDate,
                carModel: selectedVehicleModel,
                carType: selectedVehicleType,
                rates: vehicleRate,
                duration,
                totalCost,
                additionalCharges,
                discount
            };
            navigate("/invoice", { state: { data: invoiceData } });
        } else {
            setError(true);
            setErrorMessage("Please fill-up all required fields!!");
        }
    }

    return (
        <>
            <div className="container">
                <div className="reservation-container">

                    {/* ==========Reservation Header========== */}
                    <header className='reservation-header'>
                        <h3>Reservation</h3>
                        {error && <p className="error-message" style={{ color: "red" }}>{errorMessage}</p>}
                        <button onClick={handlePrintbtn} className='print-btn'>Print/ Download</button>
                        
                    </header>

                    {/* ==========Reservation Main========== */}
                    <main className='reservation-main'>

                        <div className="reservation-details-section">

                            {/* Reservation Details */}
                            <div className="title">
                                <h4>Reservation Details</h4>
                            </div>

                            <div className='reservation-form'>

                                {/* ID Field */}
                                <div>
                                    <label htmlFor="reservationId">Reservation ID</label> <br />
                                    <input type="text" value={reservationId} name="reservationId" id="reservationId" readOnly />
                                </div>

                                {/* Pickup Date Field */}
                                <div>
                                    <label htmlFor="pickupDate">Pickup Date <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                    <DatePicker wrapperClassName="input"
                                        selected={startDate}
                                        onChange={(date) => handleChange(date, 'startDate')}
                                        showTimeSelect
                                        timeFormat="h:mm a"
                                        dateFormat="yyyy-MM-dd, h:mm a"
                                        placeholderText="Select Date and Time"
                                        required
                                    />
                                </div>

                                {/* Return Date Field */}
                                <div>
                                    <label htmlFor="returnDate">Return Date <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                    <DatePicker wrapperClassName="input"
                                        selected={returnDate}
                                        onChange={(date) => handleChange(date, 'returnDate')}
                                        showTimeSelect
                                        timeFormat="h:mm a"
                                        dateFormat="yyyy-MM-dd, h:mm a"
                                        placeholderText="Select Date and Time"
                                        required
                                    />
                                </div>

                                {/* Duration Field */}
                                <div>
                                    <label htmlFor="duration">Duration</label> <br />
                                    <input type="text" name="duration" id="duration" value={duration} readOnly />
                                </div>

                                {/* Discount Field */}
                                <div>
                                    <label htmlFor="discount">Discount</label> <br />
                                    <input
                                        type="number"
                                        name="discount"
                                        id="discount"
                                        value={discount}
                                        onChange={handleNegativeValue}
                                    />
                                </div>
                            </div>

                            {/* Vehicle Information */}
                            <div className="vehicle-info-section">
                                <div className="title">
                                    <h4>Vehicle Information</h4>
                                </div>

                                {/* Vehicle Type Field */}
                                <div className="vehicle-form">
                                    <div>
                                        <label htmlFor="vehicleType">Vehicle Type <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                        <select className="select-input" value={selectedVehicleType} onChange={handleVehicleTypeChange}>
                                            <option value="">Select Vehicle Type</option>
                                            {vehicleTypes.map((type, index) => (
                                                <option required key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="vehicleModel">Vehicle <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                        <select className="select-input" value={selectedVehicleModel} onChange={handleVehicleModelChange}>
                                            <option value="">Select Vehicle</option>
                                            {carModels.map((model, index) => (
                                                <option required key={index} value={model}>{model}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="customer-info-section">
                            <div className="title">
                                <h4>Customer Information</h4>
                            </div>

                            <div className="customer-form">
                                {/* First Name Field */}
                                <div>
                                    <label htmlFor="firstName">First Name <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                    <input type="text" name="firstName" id="firstName" value={customerData.firstName} onChange={handleCustomerData} required />
                                </div>

                                {/* Last Name Field */}
                                <div>
                                    <label htmlFor="lastName">Last Name <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                    <input type="text" name="lastName" id="lastName" value={customerData.lastName} onChange={handleCustomerData} required />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email">Email <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                    <input type="email" name="email" id="email" value={customerData.email} onChange={handleCustomerData} required />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone">Phone <span style={{ color: 'red', fontSize: '16px' }}>*</span></label> <br />
                                    <input type="tel" name="phone" id="phone" value={customerData.phone} onChange={handleCustomerData} required />
                                </div>
                            </div>

                            {/* Additional Charges */}
                            <div className="additional-charges">
                                <div className="title">
                                    <h4>Additional Charges</h4>
                                </div>

                                <div className="additional-form">
                                    <div className="charges">
                                        <div>
                                            <input type="checkbox" name="collision" id="collision" onChange={handleAdditionalChargeChange} />
                                            <label htmlFor="collision"> Collision Damage Waiver</label>
                                        </div>
                                        <div>
                                            <p>$9.00</p>
                                        </div>
                                    </div>

                                    {/* Liability Insurance */}
                                    <div className="charges">
                                        <div>
                                            <input type="checkbox" name="liability" id="liability" onChange={handleAdditionalChargeChange} />
                                            <label htmlFor="liability"> Liability Insurance</label>
                                        </div>
                                        <div>
                                            <p>$15.00</p>
                                        </div>
                                    </div>

                                    {/* Rental Tax */}
                                    <div className="charges">
                                        <div>
                                            <input type="checkbox" name="rental" id="rental" onChange={handleAdditionalChargeChange} />
                                            <label htmlFor="rental"> Rental Tax</label>
                                        </div>
                                        <div>
                                            <p>$11.50</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charges Summary */}
                        <div className="charges-summary-section">
                            <div className="title">
                                <h4>Charges Summary</h4>
                            </div>

                            {/* Charges Table */}
                            <table>
                                <thead>
                                    <tr className="thead-row">
                                        <th>Charge</th>
                                        <th>Unit</th>
                                        <th>Rate</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Daily</td>
                                        <td>{days}</td>
                                        <td>${vehicleRate.daily}</td>
                                        <td>${days * vehicleRate.daily}</td>
                                    </tr>
                                    <tr>
                                        <td>Hourly</td>
                                        <td>{hours}</td>
                                        <td>${vehicleRate.hourly}</td>
                                        <td>${hours * vehicleRate.hourly}</td>
                                    </tr>
                                    <tr>
                                        <td>Weekly</td>
                                        <td>{weeks}</td>
                                        <td>${vehicleRate.weekly}</td>
                                        <td>${weeks * vehicleRate.weekly}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">Collision: ${additionalCharges.collision ? 9 : 0}, Liability: ${additionalCharges.liability ? 15 : 0}, Rental Tax: ${additionalCharges.rental ? 11.5 : 0}</td>
                                        <td>${(additionalCharges.collision ? 9 : 0) + (additionalCharges.liability ? 15 : 0) + (additionalCharges.rental ? 11.5 : 0)}</td>
                                    </tr>
                                    <tr>
                                        <td>Discount</td>
                                        <td colSpan="2"></td>
                                        <td>-${discount}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Cost</td>
                                        <td colSpan="2"></td>
                                        <td>${totalCost}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div >
            </div >
        </>
    );
}
