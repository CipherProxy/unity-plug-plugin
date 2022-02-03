var candid_interface = {
	$contextObject: {
		// Notifies C# that the link is received for the function that request it.
		SendResult: function (callbackID, link, error, callback) {
			var linkBytes = this.AllocateString(link);
			var errorBytes = this.AllocateString(error);

			// Calls a C# function using its pointer 'callback',
			// 'v' means it is a void function, the count of 'i's if the count of arguments this function accepts in our case 3 arguments, request id, the link and an error.
			Module["dynCall_viii"](callback, callbackID, linkBytes, errorBytes);

			// Free up the allocated bytes by the strings
			if (linkBytes) _free(linkBytes);
			if (errorBytes) _free(errorBytes);
		},

		// Utility function to convert javascript string to C# string.
		// Handles if the string is null or empty.
		AllocateString: function (str) {
			if (str) {
				var length = lengthBytesUTF8(str) + 1;
				var buff = _malloc(length);

				stringToUTF8Array(str, HEAPU8, buff, length);

				return buff;
			}
			return 0;
		},
	},

	PlugRequestConnect: function (callbackID, whitelistJsonPtr, host, callbackPtr) {
		// Plug window object
		window.ic.plug
			.requestConnect({whitelist: JSON.parse(whitelistJsonPtr)[0], host: UTF8ToString(host)})
			.then(function (publicKey) {
				console.log(publicKey); // Log users public key when connection is made to plug
				contextObject.SendResult(
					callbackID,
					JSON.stringify(publicKey),
					null,
					callbackPtr
				);
				
			})
			.catch(function (error) {
				console.log("[js-client] error: " + error); // Log error if user fails or declines to connect
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(error),
					callbackPtr
				);
			});
	},

	/*  
	// Canister Ids
		

		// isConnected
		window.ic.plug.isConnected().then(function (result) {
			console.log("Plug connection is:", result); // Log whether the plug wallet connection is true or false
			console.log("The host is:", host); // Log the host of the connected Agent
			console.log("The whitelisted canisters are:", whitelist); // Log the whitelisted canisters
		});

		// Persisting a connection
		const connected = window.ic.plug.isConnected();
		if (!connected)
			window.ic.plug.requestConnect(whitelist, host).then(function () {
				console.log("Whitelist approved!"); // Logs and Confirms whitelist
			});

		// Verify Connection
		const verifyConnection = window.ic.plug.isConnected();
		if (!verifyConnection)
			window.ic.plug.requestConnect(whitelist, host).then(function () {
				console.log("Verified Connection!");
			});

		// useEffect().then(function () {
		//   console.log("Verified!");
		// })

		//// Gettings the users Principal Id
		// window.ic.plug.agent.getPrincipal().then(function (principalId) {
		//   console.log("Plug's user principle Id is:", principalId); // Log the users Principal Id
		// })
	*/

	// Lookup a key in motoko canister
	/*lookup: function (callbackID, keyPtr, callback) {
		Candid.motoko_canister
			.lookup(UTF8ToString(keyPtr))
			.then(function (responseObj) {
				// Send the link to the communicator to send it to a C# callback.
				contextObject.SendResult(
					callbackID,
					JSON.stringify(responseObj),
					null,
					callback
				);
			})
			.catch(function (error) {
				// Send the error to the communicator to send to a C# callback.
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(error),
					callback
				);
			});
	},*/

};

autoAddDeps(candid_interface, "$contextObject"); // tell emscripten about this dependency
mergeInto(LibraryManager.library, candid_interface);
