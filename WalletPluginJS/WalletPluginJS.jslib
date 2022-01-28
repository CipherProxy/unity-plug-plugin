// Creating functions for the Unity
mergeInto(LibraryManager.library, {

  PlugConnect: function () {

    // Plug window object
    window.ic.plug.requestConnect().then(function (publicKey) {
      console.log("The connected user's public key is:", publicKey);
    })
      .catch(function (error) {
        console.log(error);
      });
  }
});