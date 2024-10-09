import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  routes: [{ routeName:"Amalapuram to Eluru",direction: "DOWN",routeId:1, stops: [

    {
        stopId: 1,
        stopName: "Amalapuram",
        latitude:" 16.5775",
        longitude:" 82.1031"
    },
    {
        stopId: 3,
        stopName: "Eluru",
        latitude:" 16.678059984033368",
        longitude:" 81.02370874262965"
    }],
    status: "Active",
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
      state.routes = state.routes.filter(route => route.routeId != action.payload);
    },
    updateRoute: (state, action) => {
      const { routeId, updatedRoute } = action.payload;
      const routeIndex = state.routes.findIndex(route => route.routeId == routeId);
      if (routeIndex != -1) {
        state.routes[routeIndex] = updatedRoute;
      }
    }
  }
});

export const { addRoute, deleteRoute, updateRoute } = routeSlice.actions;

export default routeSlice.reducer;
