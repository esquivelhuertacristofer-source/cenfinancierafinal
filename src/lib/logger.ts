/**
 * @file logger.ts
 * @description Sistema de logging estructurado para auditoría y debugging
 * @author CEN Platform Team
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export interface LogEntry {
    timestamp: string;
    level: string;
    context: string;
    message: string;
    data?: Record<string, unknown>;
    userId?: string;
}

class Logger {
    private static instance: Logger;
    private minLevel: LogLevel = LogLevel.INFO;
    private logs: LogEntry[] = [];
    private maxLogs = 1000;

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLevel(level: LogLevel): void {
        this.minLevel = level;
    }

    private formatEntry(level: string, context: string, message: string, data?: Record<string, unknown>, userId?: string): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            context,
            message,
            data,
            userId,
        };
    }

    private addLog(entry: LogEntry): void {
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    debug(context: string, message: string, data?: Record<string, unknown>, userId?: string): void {
        if (this.minLevel <= LogLevel.DEBUG) {
            const entry = this.formatEntry('DEBUG', context, message, data, userId);
            this.addLog(entry);
            console.debug(`[${context}] ${message}`, data || '');
        }
    }

    info(context: string, message: string, data?: Record<string, unknown>, userId?: string): void {
        if (this.minLevel <= LogLevel.INFO) {
            const entry = this.formatEntry('INFO', context, message, data, userId);
            this.addLog(entry);
            console.info(`[${context}] ${message}`, data || '');
        }
    }

    warn(context: string, message: string, data?: Record<string, unknown>, userId?: string): void {
        if (this.minLevel <= LogLevel.WARN) {
            const entry = this.formatEntry('WARN', context, message, data, userId);
            this.addLog(entry);
            console.warn(`[${context}] ${message}`, data || '');
        }
    }

    error(context: string, message: string, error?: Error, userId?: string): void {
        if (this.minLevel <= LogLevel.ERROR) {
            const entry = this.formatEntry('ERROR', context, message, {
                message: error?.message,
                stack: error?.stack,
            }, userId);
            this.addLog(entry);
            console.error(`[${context}] ${message}`, error);
        }
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    getLogsByLevel(level: string): LogEntry[] {
        return this.logs.filter(log => log.level === level);
    }

    getLogsByContext(context: string): LogEntry[] {
        return this.logs.filter(log => log.context === context);
    }

    clear(): void {
        this.logs = [];
    }

    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }
}

export const logger = Logger.getInstance();

// Contextos de logging predefinidos
export const LogContexts = {
    AUTH: 'AUTH',
    DATABASE: 'DATABASE',
    API: 'API',
    UI: 'UI',
    SECURITY: 'SECURITY',
    PROGRESS: 'PROGRESS',
} as const;
