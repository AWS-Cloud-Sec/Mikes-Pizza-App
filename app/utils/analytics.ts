import axios from 'axios';

const measurementId = 'G-B87G43NDYF';
const apiSecret = 'YOUR_API_SECRET'; // Get this from GA4

export const sendGA4Event = async (eventName: string, params: any) => {
  try {
    await axios.post(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        client_id: 'YOUR_CLIENT_ID', // Generate this or get from cookie
        events: [{
          name: eventName,
          params: params
        }]
      }
    );
  } catch (error) {
    console.error('Error sending GA4 event:', error);
  }
};

// Helper function to generate a client ID
export const generateClientId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Example usage:
// await sendGA4Event('purchase', {
//   currency: 'USD',
//   value: 99.99,
//   items: [{
//     item_id: 'SKU_12345',
//     item_name: 'Product Name'
//   }]
// }); 