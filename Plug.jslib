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

	PlugRequestConnect: function (
		callbackID,
		whitelistJsonPtr,
		host,
		callbackPtr
	) {
		// Plug window object
		window.ic.plug
			.requestConnect({
				whitelist: JSON.parse(whitelistJsonPtr)[0],
				host: UTF8ToString(host),
			})
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

	PlugIsConnected: function (callbackID, callbackPtr) {
		window.ic.plug
			.isConnected()
			.then(function (result) {
				contextObject.SendResult(
					callbackID,
					JSON.stringify(result),
					null,
					callbackPtr
				);
			})
			.catch(function (error) {
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(error),
					callbackPtr
				);
			});
	},

	// Gets principal ID. Automatically checks for connection
	PlugGetPrincipalID: function (callbackID, callbackPtr) {
		window.ic.plug.agent
			.getPrincipal()
			.then(function (principalId) {
				contextObject.SendResult(
					callbackID,
					JSON.stringify(principalId),
					null,
					callbackPtr
				);
			})
			.catch(function (error) {
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(error),
					callbackPtr
				);
			});
	},

	PlugRequestBalance: function (callbackID, callbackPtr) {
		window.ic.plug
			.requestBalance()
			.then(function (result) {
				contextObject.SendResult(
					callbackID,
					JSON.stringify(result),
					null,
					callbackPtr
				);
			})
			.catch(function (error) {
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(error),
					callbackPtr
				);
			});
	},
};

autoAddDeps(candid_interface, "$contextObject"); // tell emscripten about this dependency
mergeInto(LibraryManager.library, candid_interface);
