package com.xmrigforandroid.workers

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.xmrigforandroid.events.MinerSummaryEvent
import okhttp3.OkHttpClient
import okhttp3.Request
import org.greenrobot.eventbus.EventBus
import java.io.IOException

class XMRigSummaryUpdateWorker(appContext: Context, workerParams: WorkerParameters) :
    CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        Log.d(LOG_TAG, "doSummaryUpdate")
        val request = Request.Builder()
            .url("http://127.0.0.1:50080/2/summary")
            .addHeader("Content-Type", "application/json")
            .addHeader("Authorization", "Bearer XMRigForAndroid")
            .build()

        return try {
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    Log.e(LOG_TAG, "Unexpected code $response")
                    return@use Result.failure()
                }
                val body = response.body?.string()
                if (body == null) {
                    Result.failure()
                } else {
                    EventBus.getDefault().post(MinerSummaryEvent(body))
                    Result.success()
                }
            }
        } catch (e: IOException) {
            Log.w(LOG_TAG, "XMRig summary is not available yet", e)
            Result.failure()
        }
    }

    companion object {
        private const val LOG_TAG = "XMRigSummaryUpdateWorker"
        private val client = OkHttpClient()
    }
}
