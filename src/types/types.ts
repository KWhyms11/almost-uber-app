export enum RidePriority {
  EMERGENCY='EMERGENCY',
  NORMAL='NORMAL',
}

export enum RideProvider {
  UBER='UBER',
}

export interface LatLong {
  latitude: string;
  longitude: string;
}

export enum RideStatus {
  PENDING="PENDING",
  PICKING_UP="PICKING UP",
  IN_TRANSIT="IN TRANSIT",
  DROPPING_OFF="DROPPING_OFF",
  COMPLETED="COMPLETED",
  CANCELED="CANCELED",
  ERROR="ERROR", // still a bit on the fence about this one
}

export interface RideShareService {
  requestTrip(startLatLong: LatLong, endLatLong: LatLong, fareId: string): Promise<any>;
  cancelTrip(tripId: string): Promise<any>;
  getTripStatus(tripId: string): Promise<any>;
  getTripDetails(tripId: string): Promise<any>;
  getTimeEstimates(startLatLong: LatLong): Promise<any>;
  getPriceEstimates(startLatLon: LatLong, endLatLong: LatLong): Promise<any>;
  getProducts(startLatLong: LatLong): Promise<any>;
  validateCreateRideRequest(request: any): boolean;
  validateCancelRideRequest(request: any): boolean;
  validateTripStatusRequest(request: any): boolean;
  validateTripDetailsRequest(request: any): boolean;
}
