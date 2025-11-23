const API_KEY = 'd0a1494d0df7103558e9588ca9ccb73c'
const API_URL = 'https://blackbox.net.ua/api_v2'

export const checkClientInBlackbox = async clientData => {
	try {
		const requestData = {
			api_key: API_KEY,
			id: Date.now().toString(),
			method: 'add',
			phonenumber: clientData.phone || '',
			ttn: clientData.ttn || '',
			last_name: clientData.lastName || '',
			first_name: clientData.firstName || '',
			type_track: '1',
			comment: clientData.comment || '',
			city: clientData.city || '',
			date: clientData.date || '',
			cost: clientData.cost || '',
		}

		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(requestData),
		})

		const result = await response.json()

		if (result.success) {
			return {
				isBlacklisted: true,
				requestId: result.request_id,
				remainingQueries: result.count_query,
			}
		} else {
			if (result.error_code === 152) {
				return {
					isBlacklisted: true,
					errorCode: result.error_code,
					message: 'Клієнт знаходится у чорному спискі',
				}
			}

			return {
				isBlacklisted: false,
				errorCode: result.error_code,
				message: 'Клієнт відсутній у чорному спискі',
			}
		}
	} catch (error) {
		console.error('Помилка обробки даних з Blackbox:', error)
		return {
			isBlacklisted: false,
			error: error.message,
		}
	}
}
