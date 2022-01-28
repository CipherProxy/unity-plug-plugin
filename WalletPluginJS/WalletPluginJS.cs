using UnityEngine;
using System.Runtime.InteropServices;

/// <summary>
/// Class with a JS Plugin functions for WebGL.
/// </summary>
public class WalletPluginJS : MonoBehaviour
{
    /// Importing "PlugConnect"
    [DllImport("__Internal")]
    private static extern void PlugConnect();

    private void Start()
    {
        PlugConnect();
    }
}
