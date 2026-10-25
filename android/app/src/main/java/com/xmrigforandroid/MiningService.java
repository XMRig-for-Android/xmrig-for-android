package com.xmrigforandroid;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import com.xmrigforandroid.data.serialization.XMRigFork;
import com.xmrigforandroid.events.MinerStartEvent;
import com.xmrigforandroid.events.MinerStopEvent;
import com.xmrigforandroid.events.StdoutEvent;
import com.xmrigforandroid.utils.ProcessExitDetector;

import org.greenrobot.eventbus.EventBus;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MiningService extends Service {

    private static final String LOG_TAG = "MiningSvc";
    private static final String NOTIFICATION_CHANNEL_ID = "com.xmrigforandroid.service";
    private static final String NOTIFICATION_CHANNEL_NAME = "XMRig Service";
    private static final int NOTIFICATION_ID = 200;
    private static final long NOTIFICATION_UPDATE_INTERVAL_MS = 1000L;

    private Notification.Builder notificationbuilder;
    private Process process;
    private OutputReaderThread outputHandler;
    private ProcessExitDetector processExitDetector;
    private PowerManager.WakeLock wakeLock;
    private int miningGeneration = 0;
    private long lastNotificationUpdate = 0L;

    private final String ansiRegex = "\\e\\[[\\d;]*[^\\d;]";
    private final Pattern ansiRegexPattern = Pattern.compile(ansiRegex);

    @Override
    public void onCreate() {
        super.onCreate();

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                notificationIntent,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        notificationbuilder =
                new Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
                        .setContentTitle("XMRig for Android")
                        .setContentText("XMRig for Android Service")
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentIntent(pendingIntent)
                        .setTicker("XMRig for Android Service")
                        .setOngoing(true)
                        .setOnlyAlertOnce(true);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationChannel channel = new NotificationChannel(NOTIFICATION_CHANNEL_ID,
                NOTIFICATION_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW);
        notificationManager.createNotificationChannel(channel);

        Notification notification = notificationbuilder.build();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                    NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    private final IMiningService.Stub binder = new IMiningService.Stub() {
        @Override
        public void startMiner(String configPath, String xmrigFork) {
            startMining(configPath, xmrigFork);
        }

        @Override
        public void stopMiner() {
            stopMining();
        }
    };

    @Override
    public void onDestroy() {
        stopMiningInternal(false);
        releaseWakeLock();
        super.onDestroy();
    }

    public void stopMining() {
        stopMiningInternal(true);
    }

    private void stopMiningInternal(boolean notify) {
        boolean wasRunning = process != null;
        int stoppedGeneration = miningGeneration;
        miningGeneration++;

        if (outputHandler != null) {
            outputHandler.interrupt();
            outputHandler = null;
        }
        if (processExitDetector != null) {
            processExitDetector.interrupt();
            processExitDetector = null;
        }
        if (process != null) {
            process.destroy();
            process = null;
            Log.i(LOG_TAG, "stopped");
        }
        releaseWakeLock();
        if (notify && wasRunning) {
            EventBus.getDefault().post(new MinerStopEvent());
        }
        Log.d(LOG_TAG, "stop generation " + stoppedGeneration);
    }

    public void startMining(String configPath, String xmrigFork) {
        stopMiningInternal(false);
        acquireWakeLock();

        Log.i(LOG_TAG, "starting...");
        String xmrigBin = xmrigFork.equals(XMRigFork.MONEROOCEAN.toString()) ? "libxmrig-mo.so" : "libxmrig.so";
        File executable = new File(getApplicationInfo().nativeLibraryDir, xmrigBin);
        Log.d(LOG_TAG, "libxmrig: " + executable.getAbsolutePath());

        final int generation = miningGeneration;
        try {
            String[] args = {
                    executable.getAbsolutePath(),
                    "-c", configPath,
                    "--http-host=127.0.0.1",
                    "--http-port=50080",
                    "--http-access-token=XMRigForAndroid",
                    "--http-no-restricted"
            };
            ProcessBuilder pb = new ProcessBuilder(args);
            pb.redirectErrorStream(true);

            process = pb.start();
            final Process startedProcess = process;

            processExitDetector = new ProcessExitDetector(startedProcess);
            processExitDetector.addProcessListener(finished -> {
                if (generation != miningGeneration || finished != process) {
                    return;
                }
                process = null;
                releaseWakeLock();
                EventBus.getDefault().post(new MinerStopEvent());
            });
            processExitDetector.start();

            outputHandler = new OutputReaderThread(process.getInputStream(), generation);
            outputHandler.start();

            EventBus.getDefault().post(new MinerStartEvent());
        } catch (Exception e) {
            Log.e(LOG_TAG, "exception:", e);
            process = null;
            releaseWakeLock();
            EventBus.getDefault().post(new MinerStopEvent());
        }
    }

    private void acquireWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            return;
        }
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "XMRigForAndroid::MinerWakeLock");
        wakeLock.setReferenceCounted(false);
        wakeLock.acquire();
    }

    private void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        wakeLock = null;
    }

    public synchronized void updateNotification(String str) {
        long now = System.currentTimeMillis();
        if (now - lastNotificationUpdate < NOTIFICATION_UPDATE_INTERVAL_MS) {
            return;
        }
        lastNotificationUpdate = now;

        Matcher matcher = ansiRegexPattern.matcher(str);
        notificationbuilder.setContentText(matcher.replaceAll(""));

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NOTIFICATION_ID, notificationbuilder.build());
    }

    private class OutputReaderThread extends Thread {

        private final InputStream inputStream;
        private final int generation;

        OutputReaderThread(InputStream inputStream, int generation) {
            this.inputStream = inputStream;
            this.generation = generation;
        }

        public void run() {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (generation != miningGeneration || currentThread().isInterrupted()) {
                        return;
                    }
                    updateNotification(line);
                    EventBus.getDefault().post(new StdoutEvent(line));
                    Log.d(LOG_TAG, line);
                }
            } catch (IOException e) {
                if (generation == miningGeneration && !currentThread().isInterrupted()) {
                    Log.w(LOG_TAG, "exception", e);
                }
            }
        }
    }
}
