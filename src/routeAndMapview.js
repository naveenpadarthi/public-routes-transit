import { useState ,useEffect} from "react";
import { deleteRoute } from "./Store/routeSlice";
import { useDispatch,useSelector } from "react-redux";
import "./routeAndMapView.css"
import { useNavigate } from "react-router-dom";
import { Map} from "@vis.gl/react-google-maps";
import Directions from "./directions";

function RouteAndMapView() {
    const routes = useSelector((state) => state.routes.routes);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [route,setRoute]=useState(null);

    useEffect(()=>{
        if(routes && routes.length>0)
            setRoute(routes[0]);
    },[routes])


    function changeRoute(type,id){
        if(id)
            navigate(`${type}/${id}`);
        else
            navigate(type)
    }

    function changeDisplay(index){
        setRoute(routes[index]);
    }

    return ( 
        <div className="container">
            <div className="left-box">
                {routes.map((route,id)=>
                    <div key={id} className="outer-box" onClick={()=>changeDisplay(id)}>
                        <h2>{route.routeName}</h2>
                        <p className="route-stops">
                            {route.stops.map((stop, index) => (
                                <span key={stop.StopId}>
                                    {stop.stopName} 
                                    {index < route.stops.length - 1 && " -> "}
                                </span>
                            ))}
                        </p>
                        <button className={route.status === "Active" ? "active-status" : "inactive-status"}>{route.status=="Active"?'Active':'Inactive'}</button>
                        <div className="edit-opt">
                            <button onClick={()=>changeRoute('edit',route.routeId)}>Edit</button>
                            <button onClick={()=>dispatch(deleteRoute(route.routeId))}>Delete</button>
                        </div>
                    </div>)
                } 
                <div className="add-route-btn">
                    <button onClick={()=>changeRoute('create')}>Add Route</button>
                </div>
            </div>
            
            <div className="load-map">
                <Map
                    mapId={process.env.REACT_APP_MAP_ID}
                    defaultCenter={{lat: 22.54992, lng: 0}}
                    defaultZoom={3}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    <Directions route={route}/>
                </Map>
            </div>
        </div> 
    );
}

export default RouteAndMapView;