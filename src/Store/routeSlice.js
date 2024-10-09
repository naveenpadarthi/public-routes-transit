import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  routes: [{
    routeId:1,
    routeName: "Hyderabad to Ongole",
    direction: "UP",
    stops: [
        {
            StopId: 1,
            stopName: "Hyderabad, Telangana, India",
            latitude: "17.406498",
            longitude: "78.47724389999999"
        },
        {
            StopId: 2,
            stopName: "Ongole, Andhra Pradesh, India",
            latitude: "15.5057232",
            longitude: "80.049922"
        }
    ],
    status: "Active"
}]
}

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    addRoute: (state, action) => {
      let id;
      if (state.routes.length === 0) {
        id = 1;
      } else {
        id = state.routes[state.routes.length - 1].routeId + 1; 
      }
      state.routes.push({ ...action.payload, routeId: id });
    },
    
    deleteRoute: (state, action) => {
      state.routes = state.routes.filter(route => route.routeId !== action.payload);
    },
    updateRoute: (state, action) => {
      const { routeId, updatedRoute } = action.payload;
      const routeIndex = state.routes.findIndex(route => String(route.routeId) === String(routeId));
      if (routeIndex !== -1) {
        state.routes[routeIndex] = updatedRoute;
      }
    }
  }
});

export const { addRoute, deleteRoute, updateRoute } = routeSlice.actions;

export default routeSlice.reducer;
