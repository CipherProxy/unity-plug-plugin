// Create functions to merge with Unity library
mergeInto(LibraryManager.library, {

  // Import the PlugConnect funtion
  PlugConnect: function () {

    // Canister Ids
    const cipherCanisterId = "cnoib-2yaaa-aaaaf-qadja-cai"
    const nnsCanisterId = "qoctq-giaaa-aaaaa-aaaea-cai"

    // Whitelist
    const whitelist = [
      cipherCanisterId,
      nnsCanisterId,
    ];

    // Host
    const host = "https://mainnet.dfinity.network";

    // Plug window object
    window.ic.plug.requestConnect(whitelist, host).then(function (publicKey) {
      console.log("The connected user's public key is:", publicKey); // Log users public key when connection is made to plug
    })
      .catch(function (error) {
        console.log(error); // Log error if user fails or declines to connect
      });

    // isConnected  
    window.ic.plug.isConnected().then(function (result) {
      console.log("Plug connection is:", result); // Log whether the plug wallet connection is true or false
      console.log("The host is:", host); // Log the host of the connected Agent
      console.log("The whitelisted canisters are:", whitelist); // Log the whitelisted canisters
    })

    // Persisting a connection
    const connected = window.ic.plug.isConnected()
    if (!connected) window.ic.plug.requestConnect(whitelist, host).then(function () {
      console.log("Whitelist approved!") // Logs and Confirms whitelist
    })
  }
});