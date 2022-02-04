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
			.then(function (r) {
				contextObject.SendResult(
					callbackID,
					JSON.stringify(r),
					null,
					callbackPtr
				);
			})
			.catch(function (e) {
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(e),
					callbackPtr
				);
			});
	},

	PlugIsConnected: function (callbackID, callbackPtr) {
		window.ic.plug
			.isConnected()
			.then(function (r) {
				contextObject.SendResult(
					callbackID,
					JSON.stringify(r),
					null,
					callbackPtr
				);
			})
			.catch(function (e) {
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(e),
					callbackPtr
				);
			});
	},

	// Gets principal ID. Automatically checks for connection
	PlugGetPrincipal: function (callbackID, callbackPtr) {
		window.ic.plug
			.getPrincipal()
			.then(function (r) {
				contextObject.SendResult(
					callbackID,
					JSON.stringify(r),
					null,
					callbackPtr
				);
			})
			.catch(function (e) {
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(e),
					callbackPtr
				);
			});
	},

	PlugRequestBalance: function (callbackID, callbackPtr) {
		window.ic.plug
			.requestBalance()
			.then(function (r) {
				contextObject.SendResult(
					callbackID,
					JSON.stringify(r),
					null,
					callbackPtr
				);
			})
			.catch(function (e) {
				contextObject.SendResult(
					callbackID,
					null,
					JSON.stringify(e),
					callbackPtr
				);
			});
	},
};

autoAddDeps(candid_interface, "$contextObject"); // tell emscripten about this dependency
mergeInto(LibraryManager.library, candid_interface);
