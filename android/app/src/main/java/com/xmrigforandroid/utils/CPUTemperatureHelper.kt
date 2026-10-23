package com.xmrigforandroid.utils

import java.io.File
import java.io.RandomAccessFile

class CPUTemperatureHelper {
    companion object {
        var tempPath: String = ""

        fun searchCpuTemperature(): Float {
            val dirs = File("/sys/devices/virtual/thermal/").listFiles()
            dirs?.forEach { zone ->
                try {
                    val type = readLine(zone.resolve("type")) ?: return@forEach
                    if (type.lowercase().contains("cpu")) {
                        val temp = readLine(zone.resolve("temp"))?.toFloatOrNull() ?: return@forEach
                        tempPath = zone.resolve("temp").toString()
                        return temp / 1000.0f
                    }
                } catch (e: Exception) {
                }
            }
            tempPath = "not_found"
            return 0.0f
        }

        fun getCpuTemperature(): Float {
            if (tempPath == "not_found") {
                return 0.0f
            }
            if (tempPath == "") {
                return searchCpuTemperature()
            }
            return try {
                val temp = readLine(File(tempPath))?.toFloatOrNull() ?: return 0.0f
                temp / 1000.0f
            } catch (e: Exception) {
                0.0f
            }
        }

        private fun readLine(file: File): String? {
            RandomAccessFile(file, "r").use { reader ->
                return reader.readLine()
            }
        }
    }
}
