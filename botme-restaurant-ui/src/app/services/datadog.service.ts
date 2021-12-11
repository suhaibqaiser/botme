
import { Injectable } from '@angular/core';
import { datadogLogs as datadog } from '@datadog/browser-logs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DataDogLoggingService {
    private initialized = false;

    constructor() {
        if (!environment?.datadog) {
            return;
        }

        datadog.init({
            applicationId: environment.datadog.applicationId,
            clientToken: environment.datadog.clientToken,
            site: environment.datadog.site,
            service: environment.datadog.service,
            forwardErrorsToLogs: true,
            trackInteractions: true,
            sampleRate: 100,
            env: environment.datadog.env
        });
        this.initialized = true;

        // datadog.startSessionReplayRecording();
    }



    public debug(message: string, context?: { [x: string]: any }): void {
        if (this.initialized) {
            datadog.logger.debug(message, context);
        }
    }

    public info(message: string, context?: { [x: string]: any }): void {
        if (this.initialized) {
            datadog.logger.info(message, context);
        }
    }

    public warn(message: string, context?: { [x: string]: any }): void {
        if (this.initialized) {
            datadog.logger.warn(message, context);
        }
    }

    public error(message: string, context?: { [x: string]: any }): void {
        if (this.initialized) {
            datadog.logger.error(message, context);
        }
    }
}