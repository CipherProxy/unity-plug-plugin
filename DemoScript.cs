using UnityEngine;
using static Plug;

public class DemoScript : MonoBehaviour
{
    private void Start()
    {
        Plug.RequestConnectWithAgent(new string[] { "cnoib-2yaaa-aaaaf-qadja-cai", "qoctq-giaaa-aaaaa-aaaea-cai" }, "https://mainnet.dfinity.network", (r, e) =>
          {
              if (r != null)
              {
                  Debug.Log("[unity] public key: " + r);

                  Plug.RequestBalance((r, e) =>
                  {
                      Debug.Log("[unity] Balances: " + r);
                  });

                  Plug.GetPrincipal((r, e) =>
                  {
                      Debug.Log("[unity] Principal ID: " + r);
                  });
              }
              else
              {
                  Debug.Log("[unity] error: " + e);
              }
          });
    }
}