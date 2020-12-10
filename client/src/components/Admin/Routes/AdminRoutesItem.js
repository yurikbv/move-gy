import React, {Fragment} from 'react';
import {useHistory} from "react-router";

function AdminRoutesItem({route, deleteRoute}) {

  const history = useHistory();

  return (
    <Fragment >
      <td>{route.city}</td>
      <td colSpan="2">{route.name}</td>
      <td>
        <button type="button" className="details_edit--button"
          onClick={() => history.push(`/admin/route_detail_edit/${route._id}`)}
        >Edit</button>
      </td>
      <td>
        <div className="users__form--btns">
          <button type="button" onClick={() => history.push(`/admin/route_add_edit/${route._id}`)}>
            Edit
          </button>
          <button type="button">Active</button>
          <button type="button" onClick={() => deleteRoute(route._id)}>Delete</button>
        </div>
      </td>
    </Fragment>
  )
}

export default AdminRoutesItem;
