import React,{ useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addRoute, updateRoute } from './Store/routeSlice';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import GooglePlacesAutocomplete ,{ geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete'
import "./addRoute.css";

function AddRoute() {
    const dispatch = useDispatch();
    const routes = useSelector((state) => state.routes.routes);
    const { id } = useParams();
    const navigate=useNavigate();

    // State for route data, including default stops: Start Point and End Point
    const [routeData, setRoute] = useState({
        routeName: '',
        direction: 'UP',
        stops: [
            { StopId: 1, stopName: 'Start Point', latitude: '', longitude: '' },
            { StopId: 2, stopName: 'End Point', latitude: '', longitude: '' }
        ],
        status: "Active",
    });

    useEffect(() => {
        if (id) {
            const selectedRoute = routes.find(route => route.routeId == id);
            if (selectedRoute) {
                setRoute(selectedRoute);
            }
        }
    }, [id, routes]);

    const handleChange = (e) => {
        setRoute({ ...routeData, [e.target.name]: e.target.value });
    };

    // Handle Google Places Autocomplete for stops
    const handleStopSelect = (value, index) => {
        const newStops = [...routeData.stops];
        geocodeByPlaceId(value.value.place_id)
        .then(results=>getLatLng(results[0]))
        .then(({lat,lng})=>{
            newStops[index] = {
                ...newStops[index],
                stopName: value.label,
                latitude: lat.toString(),
                longitude: lng.toString()
            };
            setRoute({ ...routeData, stops: newStops });
        })
        
    };

    // Add a new stop between the start and end
    const addStop = () => {
        let max=0;
        routeData.stops.forEach(s=>{
            if(s.StopId>max)
                max=s.StopId;
        })
        const newStop = { StopId: max+1, stopName: '', latitude: '', longitude: '' };
        const newStops = [...routeData.stops];
        newStops.splice(newStops.length - 1, 0, newStop); 
        setRoute({ ...routeData, stops: newStops });
    };

    // Delete a stop, but prevent deletion of the first (Start) and last (End) stops
    const deleteStop = (index) => {
        const newStops = routeData.stops.filter((_, i) => i !== index);
        setRoute({ ...routeData, stops: newStops });
    };

    const handleStatusChange = (status) => {
        setRoute({ ...routeData, status: status });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const routeNameValid = routeData.routeName.trim()==""
        const invalidStop = routeData.stops.some(stop => 
            (stop.latitude === '' || stop.longitude === '')
        );
    
        if (invalidStop || routeNameValid) {
            alert("Please fill in latitude and longitude for all stops and give a route name if not given");
            return; 
        }
        if(id)
            dispatch(updateRoute({routeId:id,updatedRoute:routeData}));
        else
            dispatch(addRoute(routeData))
        navigate('/')
    };

    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData("text/plain");
        const draggedStop = routeData.stops[draggedIndex];
        const newStops = [...routeData.stops];
        newStops.splice(draggedIndex, 1);
        newStops.splice(index, 0, draggedStop);

        setRoute({ ...routeData, stops: newStops });
    };

    function cancel(){
        navigate('/')
    }

    return (
        <form className="add-route-form" onSubmit={handleSubmit}>
            <div>
                <label>Route Name</label>
                <input 
                    name="routeName" 
                    value={routeData.routeName} 
                    onChange={handleChange} 
                    placeholder="Route Name" 
                />
            </div>
            <div>
                <label>Direction</label>
                <select name="direction" value={routeData.direction} onChange={handleChange}>
                    <option value="UP">UP</option>
                    <option value="DOWN">DOWN</option>
                </select>
            </div>

            {/* Render stops with Google Places Autocomplete */}
            <div className="stop-list">
                {routeData.stops.map((stop, index) => (
                    <div key={stop.StopId} 
                        className="stop-container" 
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        <label>{stop.stopName || `Stop ${index + 1}`}</label>
                        <GooglePlacesAutocomplete
                            key={`autocomplete-${stop.StopId}`}
                            apiKey="AIzaSyC5uvToAecLTUq1ZLmy6OelB_zl_LljEVk"
                            selectProps={{
                                className:"auto-complete-cls",
                                onChange: (value) => handleStopSelect(value, index),
                                placeholder: `Select stop ${index + 1}`,
                            }}
                        />

                        {/* Delete button, disabled for start and end points */}
                        {routeData.stops.length>2 && (
                            <button type="button" onClick={() => deleteStop(index)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>



            <div>
                <button type="button" onClick={addStop}>Add Stop</button>
            </div>

            <div className="status-btns">
                <button type="button" onClick={() => handleStatusChange("Active")} className={routeData.status === "Active" ? "active-status" : ""}>Active</button>
                <button type="button" onClick={() => handleStatusChange("Inactive")} className={routeData.status === "Inactive" ? "inactive-status" : ""}>Inactive</button>
            </div>
            <div style={{'margin':'auto'}}>
                <button type="submit">{id? "Update Route" : "Save Route"}</button>
                <button onClick={cancel}>Cancel</button>
            </div>
            
        </form>
    );
}

export default AddRoute;
