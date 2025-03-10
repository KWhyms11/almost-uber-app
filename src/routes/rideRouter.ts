import express from 'express';
import { LatLong, RidePriority, RideProvider, RideStatus } from '../types/types';
import getRideShareProvider from '../utils/getRideShareProvider';

const router = express.Router();

const onError = (res: any, e: any) => res.status(e.status).json({ message: e.statusText });
const onValidationFailure = (res: any) => res.status(400).json({ error: 'Could not validate input!' });

// Request a trip
router.post('/api/ride', async (req: any, res: any) => {
  const { provider, ridePriority } = req.body;
  const service = getRideShareProvider(provider);

  if (!service.validateCreateRideRequest(req)) {
    return onValidationFailure(res);
  }

  // Request Redis lock for requesting user to prevent double booking before proceeding
  // Create local request ID so we have a way of polling for status of queued items (waiting for lambda worker to finish)
  const localRequestId = '298js3h233';  // Actually generate a real requestId
  if (ridePriority === RidePriority.EMERGENCY) {
    // here is where we would send off the request directly to the RideShare API
    try {
      const { startLatLong, endLatLong, fareId } = req.body;
      const result = await service.requestTrip(startLatLong, endLatLong, fareId);
      return result;
    } catch (e: any) {
      return onError(res, e);
    }
  } else {
    // generate local request ID
    // queue the request in SQS and allow our lambda worker to handle it
    // return pending status if successful or error if unsuccessful
    // frontend can poll for final result via GET /ride/:tripId/status
    return res.status(200).json({ message: 'Pending...', localRequestId });
  }
})

// Check the status of the ride from our storage
router.post('/api/ride/:tripId/status', async (req: any, res: any) => {
  const { provider } = req.body;
  const service = getRideShareProvider(provider);

  if (!service.validateTripStatusRequest(req)) {
    return onValidationFailure(res);
  }

  /*
      1. Check Redis cache first for trip info (use TTL to avoid stale reads)
      2. Pull from Uber API if info not available in Redis and update both Dynamo and Redis cache
      3. Return trip status
  */
  const inCache = false;
  if (inCache) {
    return res.status(200).json({ status: 'SOME_STATUS' });
  }


  try {
    const { tripId } = req.params;
    const result = await service.getTripStatus(tripId);
    return result;
  } catch (e: any) {
    return onError(res, e);
  }
});

// Get time estimates
router.post('/api/ride/estimates/time', async (req: any, res: any) => {
  const { provider, startLatLong } = req.body;
  const service = getRideShareProvider(provider);

  try {
    const result = await service.getTimeEstimates(startLatLong);
    return result;
  } catch (e) {
    return onError(res, e);
  }
});

// Get price estimates
router.post('/api/ride/estimates/price', async (req: any, res: any) => {
  const { provider, startLatLong, endLatLong } = req.body;
  const service = getRideShareProvider(provider);

  try {
    const result = await service.getPriceEstimates(startLatLong, endLatLong);
    return result;
  } catch (e) {
    return onError(res, e);
  }
});

// Get list of products for current location
router.post('/api/ride/products', async (req: any, res: any) => {
  const { provider, startLatLong } = req.body;
  const service = getRideShareProvider(provider);

  try {
    const result = await service.getProducts(startLatLong);
    return result;
  } catch (e) {
    return onError(res, e);
  }

});

// Cancel a ride
router.delete('/api/ride/:tripId', async (req: any, res: any) => {
  const { provider } = req.body;
  const service = getRideShareProvider(provider);

  if (!service.validateCancelRideRequest(req)) {
    return onValidationFailure(res);
  }

  // Check the trip status
  const { tripId } = req.params;
  const currentStatus = await service.getTripStatus(tripId);

  // If the status is already inactive wehave nothing to do
  if (currentStatus === RideStatus.CANCELED) {
    return res.status(200).json({ message: 'Trip was already canceled' })
  } else if ((currentStatus === RideStatus.DROPPING_OFF) || (currentStatus === RideStatus.COMPLETED)) {
    // I feel like this may be some kind of error case but maybe we don't need to check it at all
    // Is it possible for this to happen?
  } else {
    try {
      await service.cancelTrip(tripId);
      return res.status(200)
    } catch (e: any) {
      return onError(res, e);
    }
  }
});

export default router;
