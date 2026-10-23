package com.xmrigforandroid

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.xmrigforandroid.events.PowerEvent
import com.xmrigforandroid.events.PowerEventAction
import org.greenrobot.eventbus.EventBus
import android.os.BatteryManager




class PowerMonitorReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(this.javaClass.name, "PowerMonitorReceiver -> onReceive")
        val action = intent.action

        when (action) {
            Intent.ACTION_BATTERY_LOW -> {
                Log.d(this.javaClass.name, "ACTION_BATTERY_LOW")
                EventBus.getDefault().post(PowerEvent(PowerEventAction.BATTERY_LOW))
            }
            Intent.ACTION_BATTERY_OKAY -> {
                Log.d(this.javaClass.name, "ACTION_BATTERY_OKAY")
                EventBus.getDefault().post(PowerEvent(PowerEventAction.BATTERY_OKAY))
            }
            Intent.ACTION_POWER_CONNECTED -> {
                Log.d(this.javaClass.name, "ACTION_POWER_CONNECTED")
                EventBus.getDefault().post(PowerEvent(PowerEventAction.POWER_CONNECTED))
            }
            Intent.ACTION_POWER_DISCONNECTED -> {
                Log.d(this.javaClass.name, "ACTION_POWER_DISCONNECTED")
                EventBus.getDefault().post(PowerEvent(PowerEventAction.POWER_DISCONNECTED))
            }
            Intent.ACTION_BATTERY_CHANGED -> {
                Log.d(this.javaClass.name, "ACTION_BATTERY_CHANGED")
                val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
                val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
                if (level >= 0 && scale > 0) {
                    val currentBatteryLevel = level * 100 / scale.toFloat()
                    EventBus.getDefault().post(PowerEvent(PowerEventAction.BATTERY_CHANGED, currentBatteryLevel))
                }
            }
            else -> {
                Log.d(this.javaClass.name, "Unhandled power action: $action")
            }
        }
    }
}