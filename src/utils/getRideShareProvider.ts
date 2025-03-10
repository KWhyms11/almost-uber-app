import { RideProvider } from '../types/types';
import UberRideShareService from '../types/UberRideShareService';

const getRideshareProvider = (rideProvider: RideProvider) => {
  switch (rideProvider) {
    case RideProvider.UBER: {
      return new UberRideShareService();
    }
    default: {
      throw new Error('Unknown Rideshare Provider!');
    }
  }
};

export default getRideshareProvider;
