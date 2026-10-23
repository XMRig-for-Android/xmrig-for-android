package com.xmrigforandroid.workers

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

class XMRigJsonRpcWorker(appContext: Context, workerParams: WorkerParameters) :
    CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val method = inputData.getString("METHOD") ?: return Result.failure()
        Log.d(LOG_TAG, "Sending JSON RPC to XMRig: $method")
        val requestBody = "{\"method\":\"$method\", \"id\": 1}"
        val request = Request.Builder()
            .url("http://127.0.0.1:50080/json_rpc")
            .method("POST", requestBody.toRequestBody(JSON_MEDIA_TYPE))
            .addHeader("Content-Type", "application/json")
            .addHeader("Authorization", "Bearer XMRigForAndroid")
            .build()

        return try {
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    Log.e(LOG_TAG, response.body?.string().orEmpty())
                    Result.failure()
                } else {
                    Result.success()
                }
            }
        } catch (e: Exception) {
            Log.e(LOG_TAG, e.message.toString())
            Result.failure()
        }
    }

    companion object {
        private const val LOG_TAG = "XMRigJsonRpcWorker"
        private val JSON_MEDIA_TYPE = "application/json".toMediaType()
        private val client = OkHttpClient()
    }
}
