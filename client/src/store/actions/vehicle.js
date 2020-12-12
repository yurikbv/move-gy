import axios from 'axios';
import { isAuth } from '../../helpers/auth';
import {REACT_APP_API_URL} from '../../helpers/misc';
import { toast } from 'react-toastify';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const addVehicle = (vehicle) => async dispatch => {
  try {
    const res = await axios.post(`${REACT_APP_API_URL}/vehicle/${isAuth()._id}`, vehicle, config);
    dispatch({
      type: 'ADD_VEHICLE_SUCCESS',
      payload: res.data
    })
    toast.success('Vehicle was added');
  } catch (error) {
    dispatch({
      type: 'ADD_VEHICLE_ERROR',
      payload: error
    });
    toast.error('Error to add the vehicle to DB');
  }
}

export const getVehiclesForDriver = () => async dispatch => {
  try {
    const res = await axios.get(`${REACT_APP_API_URL}/vehicles/${isAuth()._id}`);
    dispatch({
      type: 'GET_VEHICLES_FOR_DRIVER',
      payload: res.data
    });
  } catch (error) {
    console.error(error);
    dispatch({type: 'GET_VEHICLES_FOR_DRIVER_ERROR'});
  }
}

export const watchVehiclePosition = (id, position) => async dispatch => {
  console.log('watchVehiclePosition: ', position);
  const body = {id: id, latitude: position.latitude, longitude: position.longitude, speed: position.speed};
  try {
    const res = await axios.put(`${REACT_APP_API_URL}/vehicle/location`, body);
    dispatch({
      type: 'SET_VEHICLE_POSITION',
      payload: res.data
    })
  } catch (error) {
    dispatch({type: 'SET_VEHICLE_POSITION_ERROR'})
  }
}

export const clearVehiclePosition = (id) => async dispatch => {
  try {
    const res = await axios.put(`${REACT_APP_API_URL}/vehicle/clear_location`, {id});
    dispatch({
      type: 'CLEAR_VEHICLE_POSITION',
      payload: res.data
    })
  } catch (error) {
    console.log(error);
  }
}

export const activeVehicle = (id) => async dispatch => {
  try {
    const res = await axios.put(`${REACT_APP_API_URL}/vehicle/active/${id}`);
    dispatch({
      type: 'ACTIVE_VEHICLE',
      payload: res.data
    })
  } catch (error) {
    console.log(error);
  }
}
