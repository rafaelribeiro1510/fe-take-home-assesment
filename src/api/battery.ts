
import api from '@/services/api';


// TODO split this single point of interaction with all the data into 
// separate functions for each "endpoint" (or data entity)
export async function getAllData() {
	const response = await api.get('/battery.json');
	return response.data;
}