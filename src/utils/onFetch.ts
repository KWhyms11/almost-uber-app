// How do we handle retries?
const onFetch = (url: string, requestType: string, headers: any) =>
  new Promise(async (resolve: any, reject: any) => {
    try {
      const response = await fetch(url, {
        method: requestType,
        headers,
      });

      if (response.ok) {
        resolve(response.json());
      } else {
        reject(response);
      }
    } catch(e) {
      reject(e);
    }
  });

export default onFetch;
