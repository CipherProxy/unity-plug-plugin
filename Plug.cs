using AOT;
using UnityEngine;
using UnityEngine.Events;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public static class Plug
{
    [DllImport("__Internal")]
    private static extern void PlugRequestConnect(int callbackID, string whitelistJson, string host, RequestCallback callbackPtr);

    [DllImport("__Internal")]
    private static extern void PlugIsConnected(int callbackID, RequestCallback callbackPtr);

    [DllImport("__Internal")]
    private static extern void PlugGetPrincipalId(int callbackID, RequestCallback callbackPtr);

    [DllImport("__Internal")]
    private static extern void PlugRequestBalance(int callbackID, RequestCallback callbackPtr);

    // This is the callback, whose pointer we'll send to javascript and is called by emscripten's Runtime.dynCall.
    public delegate void RequestCallback(int callbackID, string response, string error);

    /// Keeps track of pending callbacks by their id, once callback is received it is executed and removed from the book.
    static Dictionary<int, Action<string, string>> callbacksBook = new Dictionary<int, Action<string, string>>();
    static int callbackIDIncrementer = 0;

    /// Called from the javascript side, this is the function whose pointer we passed to lookup
    /// This must match the return type and arguments of RequestCallback
    [MonoPInvokeCallback(typeof(Action))]
    private static void GlobalCallback(int callbackID, string response, string error)
    {
        if (callbacksBook.TryGetValue(callbackID, out Action<string, string> callback))
        {
            callback?.Invoke(response, error);

        }
        // Remove this request from the tracker as it is done.
        callbacksBook.Remove(callbackID);
    }


    /// Setup the callback. Returns the callbackID
    private static int SetupCallback(Action<string, string> callback) 
    {
        int callbackID = callbackIDIncrementer;
        callbackIDIncrementer++;
        callbacksBook.Add(callbackID, callback);
        return callbackID;
    }

    public static void RequestConnect(string[] whitelist, string host, Action<string, string> callback)
    {
        // Now call the javascript function and when it is done it'll callback the C# GlobalCallback function.
        PlugRequestConnect(SetupCallback(callback), JsonUtility.ToJson(whitelist), host, GlobalCallback);
    }

    public static void IsConnected(Action<string, string> callback)
    {
        // Now call the javascript function and when it is done it'll callback the C# GlobalCallback function.
        PlugIsConnected(SetupCallback(callback), GlobalCallback);
    }

    public static void GetPrincipalId(Action<string, string> callback)
    {
        // Now call the javascript function and when it is done it'll callback the C# GlobalCallback function.
        PlugGetPrincipalId(SetupCallback(callback), GlobalCallback);
    }

    public static void RequestBalance(Action<string, string> callback)
    {
        // Now call the javascript function and when it is done it'll callback the C# GlobalCallback function.
        PlugGetPrincipalId(SetupCallback(callback), GlobalCallback);
    }
}