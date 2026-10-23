package com.xmrigforandroid;

import android.Manifest;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

  private static final int POST_NOTIFICATIONS_REQUEST = 1001;
  private PowerMonitorReceiver powerMonitorReceiver;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "XMRigForAndroid";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    requestNotificationPermission();

    powerMonitorReceiver = new PowerMonitorReceiver();
    IntentFilter batterFilters = new IntentFilter();
    batterFilters.addAction(android.content.Intent.ACTION_BATTERY_CHANGED);
    batterFilters.addAction(android.content.Intent.ACTION_BATTERY_LOW);
    batterFilters.addAction(android.content.Intent.ACTION_BATTERY_OKAY);
    batterFilters.addAction(android.content.Intent.ACTION_POWER_CONNECTED);
    batterFilters.addAction(android.content.Intent.ACTION_POWER_DISCONNECTED);
    ContextCompat.registerReceiver(
        this,
        powerMonitorReceiver,
        batterFilters,
        ContextCompat.RECEIVER_NOT_EXPORTED);
  }

  @Override
  protected void onDestroy() {
    if (powerMonitorReceiver != null) {
      unregisterReceiver(powerMonitorReceiver);
      powerMonitorReceiver = null;
    }
    super.onDestroy();
  }

  private void requestNotificationPermission() {
    if (Build.VERSION.SDK_INT < 33) {
      return;
    }
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
        == PackageManager.PERMISSION_GRANTED) {
      return;
    }
    ActivityCompat.requestPermissions(
        this,
        new String[] {Manifest.permission.POST_NOTIFICATIONS},
        POST_NOTIFICATIONS_REQUEST);
  }
}
