package com.xmrigforandroid.utils;

import java.util.EventListener;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Detects when a process is finished and invokes the associated listeners.
 */
public class ProcessExitDetector extends Thread {

    public interface ProcessListener extends EventListener {
        void processFinished(Process process);
    }

    /** The process for which we have to detect the end. */
    private Process process;
    /** The associated listeners to be invoked at the end of the process. */
    private final List<ProcessListener> listeners = new CopyOnWriteArrayList<ProcessListener>();

    /**
     * Starts the detection for the given process
     * @param process the process for which we have to detect when it is finished
     */
    public ProcessExitDetector(Process process) {
        try {
            // test if the process is finished
            process.exitValue();
            throw new IllegalArgumentException("The process is already ended");
        } catch (IllegalThreadStateException exc) {
            this.process = process;
        }
    }

    /** @return the process that it is watched by this detector. */
    public Process getProcess() {
        return process;
    }

    public void run() {
        try {
            // wait for the process to finish
            process.waitFor();
            // invokes the listeners
            for (ProcessListener listener : listeners) {
                listener.processFinished(process);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /** Adds a process listener.
     * @param listener the listener to be added
     */
    public void addProcessListener(ProcessListener listener) {
        listeners.add(listener);
    }

    /** Removes a process listener.
     * @param listener the listener to be removed
     */
    public void removeProcessListener(ProcessListener listener) {
        listeners.remove(listener);
    }
}