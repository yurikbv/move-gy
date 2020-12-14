import React, {Fragment, useState,useEffect} from 'react';
import ToggleButton from 'react-toggle-button';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {watchVehiclePosition, clearVehiclePosition, activeVehicle} from '../../store/actions/vehicle';
import { getDistanceAndSpeedFromLatLonInKm } from '../../helpers/auth';

const borderRadiusStyle = { borderRadius: 2 };

const VehicleItem = (props) => {
  
  let watchId;
  const [lastPosition, setLastPosition] = useState({});
  
  
  useEffect(() => {
    if(props.vehicle.isActive) {
      let average = (props.vehicle.average_speed.reduce((total,num) => total + num.toFixed(4)))
        * props.vehicle.average_speed.length;
      setLastPosition({
        latitude: props.vehicle.latitude,
        longitude: props.vehicle.longitude,
        speed: props.vehicle.speed,
        average_speed: average
      });
    }
    
  },[props.vehicle])

  const handleTracker = async (id, trigger) => {
    
    if (trigger) {
      await props.dispatch(activeVehicle(id));
      if(!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition( async (position) => {
          await props.dispatch(watchVehiclePosition(id, position.coords));
        })
        watchId = navigator.geolocation.watchPosition( async (position) => {
            await props.dispatch(watchVehiclePosition(id, position.coords));
          },(error) => console.log(error),
          {
            timeout: 20000,
            maximumAge: 60000,
            distanceFilter: 1
          })
      }
    } else {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      setLastPosition({})
      await props.dispatch(clearVehiclePosition(id));
    }
  }

  return (
    <Fragment>
      <span style={{margin: '0 3px'}}>{props.vehicle.type_of_vehicle}</span> /
      <span style={{margin: '0 3px'}}>{props.vehicle.plate}</span> / 
      {props.service ? props.service : <Link to="/add_service" style={{margin: '0 3px'}}>Add Service
      </Link>} / 
      <span style={{margin: '0 3px'}}> Tracker</span>
      <div style={{marginLeft: '3px'}}>
        <ToggleButton style={{display: 'inline'}}
          value={props.vehicle.isActive}
          thumbStyle={borderRadiusStyle}
          trackStyle={borderRadiusStyle}
        onToggle={(value) => {handleTracker(props.vehicle._id, !value)}}
        />
      </div>
      
        {lastPosition.latitude && lastPosition.longitude && 
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <span style={{fontWeight: '700', marginLeft: '10px', display: 'block'}}>
            {`lat: ${lastPosition.latitude}`}
          </span>
          <span style={{fontWeight: '700', marginLeft: '10px', display: 'block'}}>
            {`lng: ${lastPosition.longitude}`}
          </span>
          <span style={{fontWeight: '700', marginLeft: '10px', display: 'block'}}>
            {`speed: ${lastPosition.speed}`}
          </span>
          <span style={{fontWeight: '700', marginLeft: '10px', display: 'block'}}>
            {`average speed: ${lastPosition.average_speed}`}
          </span>
        </div>}
    </Fragment>
  )
}

export default connect()(VehicleItem);
