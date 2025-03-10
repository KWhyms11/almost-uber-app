import { RidePriority, RideShareService, RideProvider, LatLong } from './types';
import onFetch from '../utils/onFetch';

export default class UberRideShareService implements RideShareService {
  private PROVIDER: RideProvider = RideProvider.UBER;
  private URL_BASE = 'https://sandbox-api.uber.com/v1';

  constructor() {}

  // Request a trip via the Uber API
  async requestTrip(startLatLong: LatLong, endLatLong: LatLong, fareId: string): Promise<any> {
    const url = `${this.URL_BASE}/requests`;
    const requestType = 'POST';
    const requestBody = {
      start_latitude: startLatLong.latitude,
      start_longitude: startLatLong.longitude,
      end_latitude: endLatLong.latitude,
      end_longitude: endLatLong.longitude,
    };

    // need to add parameter for request body or "options";
    return onFetch(url, requestType, this.getAuthHeaders());
  };

  // Cancel a trip via the Uber API
  async cancelTrip(tripId: string): Promise<any> {
    const url = `${this.URL_BASE}/requests/${tripId}`;
    const requestType = 'DELETE';
    return onFetch(url, requestType, this.getAuthHeaders());
  };

  // Check the status of a trip through the Uber API
  async getTripStatus(tripId: string): Promise<any> {
    const url = `${this.URL_BASE}/requests/${tripId}/map`;
    const requestType = 'GET';
    return onFetch(url, requestType, this.getAuthHeaders());
  };

  // Get trip details through the Uber API
  async getTripDetails(tripId: string): Promise<any> {
    const url = `${this.URL_BASE}/requests/${tripId}`;
    const requestType = 'GET';
    return onFetch(url, requestType, this.getAuthHeaders());
  };

  async getPriceEstimates(startLatLong: LatLong, endLatLong: LatLong): Promise<any> {
    const startLatitude = startLatLong.latitude;
    const startLongitude = startLatLong.longitude;
    const endLatitude = endLatLong.latitude;
    const endLongitude = endLatLong.longitude;

    const url = `${this.URL_BASE}/estimates/price?start_latitude=${startLatitude}&start_longitude=${startLongitude}&end_latitude=${endLatitude}&endLongitude=${endLongitude}`;
    const requestType = 'GET';
    return onFetch(url, requestType, this.getAuthHeaders());
  };

  async getTimeEstimates(startLatLong: LatLong): Promise<any> {
    const { latitude, longitude } = startLatLong;
    const url = `${this.URL_BASE}/estimates/time?start_latitude=${latitude}&start_longitude=${longitude}`;
    const requestType = 'GET';
    return onFetch(url, requestType, this.getAuthHeaders());
  }

  async getProducts(startLatLong: LatLong): Promise<any> {
    const { latitude, longitude } = startLatLong;
    const url = `${this.URL_BASE}/products?latitude=${latitude}&longitude=${longitude}`;
    const requestType = 'GET';
    return onFetch(url, requestType, this.getAuthHeaders());
  }

  // Validate the request for ride creation
  validateCreateRideRequest(request: any): boolean {
    const {
      ridePriority,
      startLatLong,
      endLatLong,
      productId,
      upfrontFareEnabled,
      fareId,
      localRequstId,
      provider,
    } = request.body;

    // Check to see if we get a valid RidePriority
    if (!ridePriority || !(Object.values(RidePriority).includes(ridePriority))) {
      console.error('Invalid ride priority!');
      return false;
    }

    // Check to see if we get a valid provider
    if (provider !== this.PROVIDER) {
      console.error('Incompatible ride provider!');
      return false;
    }

    // Check to see if we get a valid start location
    if (!startLatLong || !startLatLong.latitude || !startLatLong.longitude) {
      console.error('Invalid start location!');
      return false;
    }

    // Check to see if we get a valid end location
    if (!endLatLong || !endLatLong.latitude || !endLatLong.longitude) {
      console.error('Invalid end location!');
      return false;
    }

    // Check to see if we get a valid product ID
    if (!productId || !productId.trim()) {
      console.error('Invalid product ID');
      return false;
    }

    if (upfrontFareEnabled && !fareId) {
      console.error('Fare ID required when upfront fare enabled');
      return false;
    }

    return true;
  }

  // Validate the request for ride cancelation
  validateCancelRideRequest(request: any): boolean {
    const { tripId } = request.params;

    if (!tripId || !tripId.trim()) {
      console.error('Invalid ride ID!');
      return false;
    }

    return true;
  }

  // Validate the request for checking trip status
  validateTripStatusRequest(request: any): boolean {
    const { tripId } = request.params;
    const { localRequestId } = request.body;

    if (!tripId && !localRequestId) {
      console.error('Trip ID or local request ID required!');
      return false;
    }

    return true;
  }

  // Validate the request for getting trip details
  validateTripDetailsRequest(request: any): boolean {
    const { tripId } = request.params;

    if (!tripId && !tripId.trim()) {
      console.error('Invalid ride ID');
      return false;
    }

    return true;
  }

  private getAuthHeaders() {
    const headers: any = {};
    headers['Content-Type'] = 'application/json';
    headers['Authorization'] = 'Bearer IA.VUNmGAAAAAAAEgASAAAABwAIAAwAAAAAAAAAEgAAAAAAAAGsAAAAFAAAAAAADgAQAAQAAAAIAAwAAAAOAAAAgAAAABwAAAAEAAAAEAAAAEfPb5d7S3FnYVrRpIqzz-hcAAAAMf1qEj-pSexKLBmaRCcp9QBWp9FxSrmp9s2pJHx1uUQJPuRuKfQ7hh3IRJv1wDljF2e08JdgoruscMe6jpGTwc4ov6eWxc4bwjpeqvO6qMwFdyf1ecC957ACcWYMAAAAUdVybc3TNsN9FpOjJAAAAGIwZDg1ODAzLTM4YTAtNDJiMy04MDZlLTdhNGNmOGUxOTZlZQ';
    return headers;
  }
}
