import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const CarContext = createContext();

export const CarDataProvider = ({ children }) => {
    const [carData, setCarData] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [carModels, setCarModels] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get('https://exam-server-7c41747804bf.herokuapp.com/carsList');
                setCarData(response.data.data);

                const types = [...new Set(response.data.data.map(car => car.type))];
                const models = [...new Set(response.data.data.map(car => car.model))];
                
                setVehicleTypes(types);
                setCarModels(models);
            } catch (error) {
                console.error('Error fetching car data:', error.message);
            }
        };

        fetchCars();
    }, []);

    return (
        <CarContext.Provider value={{ carData, vehicleTypes, carModels }}>
            {children}
        </CarContext.Provider>
    );
};

CarDataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};