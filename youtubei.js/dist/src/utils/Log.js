const YTJS_TAG = 'YOUTUBEJS';
export const Level = {
    NONE: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4
};
const log_map = {
    [Level.ERROR]: (...args) => console.error(...args),
    [Level.WARNING]: (...args) => console.warn(...args),
    [Level.INFO]: (...args) => console.info(...args),
    [Level.DEBUG]: (...args) => console.debug(...args)
};
let log_level = [Level.WARNING];
const one_time_warnings_issued = new Set();
function doLog(level, tag, args) {
    if (!log_map[level] || !log_level.includes(level))
        return;
    const tags = [`[${YTJS_TAG}]`];
    if (tag)
        tags.push(`[${tag}]`);
    log_map[level](`${tags.join('')}:`, ...(args || []));
}
export const warnOnce = (id, ...args) => {
    if (one_time_warnings_issued.has(id))
        return;
    doLog(Level.WARNING, id, args);
    one_time_warnings_issued.add(id);
};
export const warn = (tag, ...args) => doLog(Level.WARNING, tag, args);
export const error = (tag, ...args) => doLog(Level.ERROR, tag, args);
export const info = (tag, ...args) => doLog(Level.INFO, tag, args);
export const debug = (tag, ...args) => doLog(Level.DEBUG, tag, args);
export function setLevel(...args) {
    log_level = args;
}
//# sourceMappingURL=Log.js.map