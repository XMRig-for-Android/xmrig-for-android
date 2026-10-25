package com.xmrigforandroid.services

import android.app.Service
import android.content.Intent
import android.os.CountDownTimer
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.workDataOf
import com.xmrigforandroid.workers.XMRigJsonRpcWorker
import com.xmrigforandroid.workers.XMRigSummaryUpdateWorker

class XMRigAPIService : Service() {
    private val summaryUpdateWorkerRequest = OneTimeWorkRequestBuilder<XMRigSummaryUpdateWorker>()
    private val mainHandler = Handler(Looper.getMainLooper())

    var isSummaryUpdate = false

    private val summaryUpdateTimer = object : CountDownTimer(10000, 10000) {
        override fun onTick(millisUntilFinished: Long) {
        }

        override fun onFinish() {
            Log.d(LOG_TAG, "summaryUpdateTimer::Finish")
            WorkManager.getInstance(applicationContext).enqueue(
                summaryUpdateWorkerRequest.build()
            )
            if (isSummaryUpdate) {
                this.start()
            }
        }
    }

    private fun onMain(block: () -> Unit) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            block()
        } else {
            mainHandler.post(block)
        }
    }

    fun sendJSONRpcCommand(method: String) {
        Log.d(LOG_TAG, "sendJSONRpcCommand: $method")
        val jsonRpcWorkerRequest = OneTimeWorkRequestBuilder<XMRigJsonRpcWorker>()
            .setInputData(workDataOf("METHOD" to method))
            .build()
        WorkManager
            .getInstance(applicationContext)
            .enqueue(jsonRpcWorkerRequest)
    }

    private val binder = object : IXMRigAPIService.Stub() {
        override fun pauseMiner() {
            Log.d(LOG_TAG, "pauseMiner")
            sendJSONRpcCommand("pause")
        }

        override fun resumeMiner() {
            Log.d(LOG_TAG, "resumeMiner")
            sendJSONRpcCommand("resume")
        }

        override fun startSummaryUpdates() {
            Log.d(LOG_TAG, "startSummaryUpdates")
            onMain {
                isSummaryUpdate = true
                summaryUpdateTimer.cancel()
                summaryUpdateTimer.start()
            }
        }

        override fun stopSummaryUpdates() {
            Log.d(LOG_TAG, "stopSummaryUpdates")
            onMain {
                isSummaryUpdate = false
                summaryUpdateTimer.cancel()
            }
        }
    }

    override fun onBind(intent: Intent): IBinder {
        return binder
    }

    override fun onDestroy() {
        summaryUpdateTimer.cancel()
        super.onDestroy()
    }

    companion object {
        private const val LOG_TAG = "XMRigAPIService"
    }
}
