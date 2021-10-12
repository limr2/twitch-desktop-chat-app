const { ApiClient } = require('twitch');

apiClient = new ApiClient()

async function isStreamLive(userName) {
	const user = await apiClient.helix.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await apiClient.helix.streams.getStreamByUserId(user.id) !== null;
}


console.log(isStreamLive('QarthO'))