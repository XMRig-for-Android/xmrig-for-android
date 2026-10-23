package com.xmrigforandroid.data.serialization

import androidx.annotation.Keep
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Keep
@Serializable
enum class ConfigurationMode {
    @SerialName("simple") SIMPLE,
    @SerialName("advanced") ADVANCE
}

@Keep
@Serializable
enum class XMRigFork {
    @SerialName("original") ORIGINAL,
    @SerialName("moneroocean") MONEROOCEAN
}

@Keep
@Serializable
enum class RandomXMode {
    @SerialName("auto") AUTO,
    @SerialName("fast") FAST,
    @SerialName("light") LIGHT
}

@Keep
@Serializable
data class SimpleConfigurationPropertiesPool (
        val hostname: String,
        val username: String = "",
        val port: Int,
        val password: String?,
        val sslEnabled: Boolean = false
)

@Keep
@Serializable
data class SimpleConfigurationPropertiesCPU (
        val yield: Boolean,
        val priority: Int?,
        val max_threads_hint: Int? = 100,
        val random_x_mode: RandomXMode?
)

@Keep
@Serializable
data class ConfigurationProperties(
        val wallet: String?,
        val pool: SimpleConfigurationPropertiesPool?,
        val cpu: SimpleConfigurationPropertiesCPU?,
        val algos: String? = ""
)

@Keep
@Serializable
data class Configuration(
        val id: String,
        val name: String,
        val mode: ConfigurationMode,
        val xmrig_fork: XMRigFork = XMRigFork.ORIGINAL,
        val properties: ConfigurationProperties?,
        val config: String?
)
