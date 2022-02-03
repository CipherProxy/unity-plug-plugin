using UnityEngine;
using static Plug;

/// <summary>
/// Class with a JS Plugin functions for WebGL.
/// </summary>

public class DemoScript : MonoBehaviour
{
    private void Start()
    {
        Plug.RequestConnect(new string[] {"cnoib-2yaaa-aaaaf-qadja-cai", "qoctq-giaaa-aaaaa-aaaea-cai"}, "https://mainnet.dfinity.network", (response, error) =>
        {
            if (response != null) {
                Debug.Log("[unity] public key: " + response);
            } else {
                Debug.Log("[unity] error: " + error);
            }
        });
    }
}