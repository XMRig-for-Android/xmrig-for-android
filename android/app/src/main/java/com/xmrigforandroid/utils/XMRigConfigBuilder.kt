package com.xmrigforandroid.utils

import android.content.Context
import android.util.Base64
import android.util.Log
import com.xmrigforandroid.data.serialization.Configuration
import java.io.File
import java.io.IOException
import java.nio.charset.StandardCharsets

class XMRigConfigBuilder(val context: Context) {

    var config: String = loadConfigTemplate()

    fun reset() {
        config = loadConfigTemplate()
    }

    fun getConfigPath(): String = "${context.filesDir.absolutePath}/config.json"

    fun loadConfigTemplate(): String {
        return context.assets.open("config.json").bufferedReader(StandardCharsets.UTF_8).use { reader ->
            reader.readText()
        }
    }

    fun readConfigFromDisk(): String {
        return File(getConfigPath()).readText(StandardCharsets.UTF_8)
    }

    fun setConfiguration(data: Configuration) {
        val encoded = data.config ?: throw IllegalArgumentException("Missing XMRig config payload")
        val configByte = Base64.decode(encoded, Base64.DEFAULT)
        config = String(configByte, StandardCharsets.UTF_8)
    }

    fun getConfigString(): String {
        return config
    }

    fun writeConfig(configContent: String? = null, customPath: String? = null): String {
        val privatePath = customPath ?: context.filesDir.absolutePath
        val file = File("$privatePath/config.json")
        Log.d(this.javaClass.name, "Write to $file")
        try {
            file.writeText(configContent ?: config, StandardCharsets.UTF_8)
        } catch (e: IOException) {
            throw RuntimeException(e)
        }
        return file.absolutePath
    }
}
