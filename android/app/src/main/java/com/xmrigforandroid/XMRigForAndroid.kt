package com.xmrigforandroid

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.BatteryManager
import android.os.FileObserver
import android.os.IBinder
import android.os.RemoteException
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.xmrigforandroid.data.serialization.Configuration
import com.xmrigforandroid.events.MinerStartEvent
import com.xmrigforandroid.events.MinerStopEvent
import com.xmrigforandroid.events.MinerSummaryEvent
import com.xmrigforandroid.events.PowerEvent
import com.xmrigforandroid.events.PowerEventAction
import com.xmrigforandroid.events.StdoutEvent
import com.xmrigforandroid.events.ThermalEvent
import com.xmrigforandroid.services.IXMRigAPIService
import com.xmrigforandroid.services.ThermalService
import com.xmrigforandroid.services.XMRigAPIService
import com.xmrigforandroid.utils.XMRigConfigBuilder
import kotlinx.serialization.json.Json
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode
import java.io.File
import java.util.Locale

class XMRigForAndroid(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    var miningService: IMiningService? = null
    var xmrigAPIService: IXMRigAPIService? = null
    val configBuilder = XMRigConfigBuilder(this.reactApplicationContext.applicationContext)
    var isMining = false
    private var servicesStarted = false

    private val serverConnection = object : ServiceConnection {
        override fun onServiceConnected(className: ComponentName?, service: IBinder?) {
            if (className != null) {
                Log.d("className", className.className)
            }
            when (className?.className) {
                "com.xmrigforandroid.MiningService" -> {
                    miningService = IMiningService.Stub.asInterface(service)
                }
                "com.xmrigforandroid.services.XMRigAPIService" -> {
                    xmrigAPIService = IXMRigAPIService.Stub.asInterface(service)
                }
            }
        }

        override fun onServiceDisconnected(className: ComponentName?) {
            when (className?.className) {
                "com.xmrigforandroid.MiningService" -> {
                    miningService = null
                }
                "com.xmrigforandroid.services.XMRigAPIService" -> {
                    xmrigAPIService = null
                }
            }
        }
    }

    private val fileObserver: FileObserver = object : FileObserver(File(configBuilder.getConfigPath()), MODIFY) {
        override fun onEvent(event: Int, path: String?) {
            Log.d("FileObserver", "fileObserver: $event $path | isMining: $isMining")
            if (!isMining) {
                return
            }
            val payload = Arguments.createMap()
            payload.putString("config", configBuilder.readConfigFromDisk())
            reactApplicationContext
                .getJSModule(RCTDeviceEventEmitter::class.java)
                .emit("onConfigUpdate", payload)
        }
    }

    private fun ensureServices() {
        if (servicesStarted) {
            return
        }
        servicesStarted = true
        val appContext = reactApplicationContext.applicationContext
        val miningIntent = Intent(appContext, MiningService::class.java)
        val apiIntent = Intent(appContext, XMRigAPIService::class.java)
        val thermalIntent = Intent(appContext, ThermalService::class.java)

        appContext.bindService(miningIntent, serverConnection, Context.BIND_AUTO_CREATE)
        appContext.bindService(apiIntent, serverConnection, Context.BIND_AUTO_CREATE)
        try {
            appContext.startForegroundService(miningIntent)
        } catch (e: Exception) {
            Log.e(name, "Unable to start MiningService", e)
        }
        appContext.startService(apiIntent)
        appContext.startService(thermalIntent)
    }

    private fun releaseServices() {
        fileObserver.stopWatching()
        if (!servicesStarted) {
            return
        }
        val appContext = reactApplicationContext.applicationContext
        try {
            appContext.unbindService(serverConnection)
        } catch (e: IllegalArgumentException) {
            Log.w(name, "Service was not bound", e)
        }
        servicesStarted = false
        miningService = null
        xmrigAPIService = null
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onMessageEvent(event: StdoutEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        val payload = Arguments.createMap()
        val strArr = arrayOf(event.value)
        payload.putArray("log", Arguments.fromArray(strArr))
        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("onLog", payload)
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onMinerStartEvent(event: MinerStartEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        this.isMining = true
        xmrigAPIService?.startSummaryUpdates()

        val payload = Arguments.createMap()
        payload.putBoolean("isWorking", true)
        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("onStatusChange", payload)
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onMinerStopEvent(event: MinerStopEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        this.isMining = false
        xmrigAPIService?.stopSummaryUpdates()

        val payload = Arguments.createMap()
        payload.putBoolean("isWorking", false)
        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("onStatusChange", payload)
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onPowerEvent(event: PowerEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        val payload = Arguments.createMap()
        payload.putString("action", event.action.value)
        if (event.value != null) {
            payload.putDouble("value", event.value!!.toDouble())
        }
        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("onPower", payload)
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onMinerSummaryEvent(event: MinerSummaryEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        if (event.value != null) {
            val payload = Arguments.createMap()
            payload.putString("data", event.value)

            reactApplicationContext
                .getJSModule(RCTDeviceEventEmitter::class.java)
                .emit("onSummary", payload)
        }
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    fun onThermalEvent(event: ThermalEvent) {
        Log.d(this.name, "event name: " + event.javaClass.simpleName)
        val payload = Arguments.createMap()
        payload.putDouble("cpuTemperature", event.cpuTemperature.toDouble())

        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("onThermal", payload)
    }

    @ReactMethod
    fun start(configurationJSON: String) {
        ensureServices()
        val jsonFormat = Json {
            explicitNulls = false
            ignoreUnknownKeys = true
        }
        val data = jsonFormat.decodeFromString<Configuration>(configurationJSON)

        Log.d(this.name, "Start XMRig (${data.xmrig_fork.toString().lowercase(Locale.getDefault())}) $configurationJSON")

        configBuilder.reset()
        configBuilder.setConfiguration(data)
        val configPath = configBuilder.writeConfig()
        fileObserver.stopWatching()
        fileObserver.startWatching()
        Log.d(this.name, configBuilder.getConfigString())
        try {
            miningService?.startMiner(configPath, data.xmrig_fork.toString())
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun stop() {
        Log.d(this.name, "Stop has been called from RN")
        fileObserver.stopWatching()
        try {
            if (miningService == null) {
                EventBus.getDefault().post(MinerStopEvent())
            } else {
                miningService?.stopMiner()
            }
            xmrigAPIService?.stopSummaryUpdates()
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun availableProcessors(promise: Promise) {
        Log.d(this.name, "availableProcessors=" + Runtime.getRuntime().availableProcessors().toString())
        try {
            val availableProcessors = Integer.valueOf(Runtime.getRuntime().availableProcessors())
            promise.resolve(availableProcessors)
        } catch (e: Exception) {
            promise.reject("Runtime.getRuntime().availableProcessors()", e)
        }
    }

    @ReactMethod
    fun pauseMiner() {
        xmrigAPIService?.pauseMiner()
    }

    @ReactMethod
    fun resumeMiner() {
        xmrigAPIService?.resumeMiner()
    }

    override fun getName(): String {
        return "XMRigForAndroid"
    }

    override fun initialize() {
        super.initialize()
        EventBus.getDefault().register(this)
        ensureServices()
    }

    override fun invalidate() {
        releaseServices()
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this)
        }
        super.invalidate()
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        when (eventName) {
            "onPower" -> {
                val bm = reactApplicationContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
                val batteryLevel = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
                val charging = bm.isCharging

                EventBus.getDefault().post(PowerEvent(PowerEventAction.BATTERY_CHANGED, batteryLevel))
                if (charging) {
                    EventBus.getDefault().post(PowerEvent(PowerEventAction.POWER_CONNECTED))
                } else {
                    EventBus.getDefault().post(PowerEvent(PowerEventAction.POWER_DISCONNECTED))
                }
            }
        }
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}
