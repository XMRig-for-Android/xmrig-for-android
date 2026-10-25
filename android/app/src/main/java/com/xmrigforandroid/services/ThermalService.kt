package com.xmrigforandroid.services

import android.app.Service
import android.content.Intent
import android.os.CountDownTimer
import android.os.IBinder
import android.util.Log
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.xmrigforandroid.workers.ThermalWorker

class ThermalService : Service() {

    private val thermalWorkRequest = OneTimeWorkRequestBuilder<ThermalWorker>()

    private val updateTimer = object : CountDownTimer(15000, 15000) {
        override fun onTick(millisUntilFinished: Long) {
        }

        override fun onFinish() {
            Log.d(LOG_TAG, "updateTimer")
            WorkManager.getInstance(applicationContext).enqueue(thermalWorkRequest.build())
            this.start()
        }
    }

    override fun onCreate() {
        super.onCreate()
        updateTimer.start()
    }

    override fun onDestroy() {
        updateTimer.cancel()
        super.onDestroy()
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    companion object {
        private const val LOG_TAG = "ThermalService"
    }
}
