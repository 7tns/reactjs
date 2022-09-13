'use strict';
/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
const path = require('path');
const fs = require('fs');
const mkdirp = require('make-dir');
const supportsColor = require('supports-color');

/**
 * Base class for writing content
 * @class ContentWriter
 * @constructor
 */
class ContentWriter {
    /**
     * returns the colorized version of a string. Typically,
     * content writers that write to files will return the
     * same string and ones writing to a tty will wrap it in
     * appropriate escape sequences.
     * @param {String} str the string to colorize
     * @param {String} clazz one of `high`, `medium` or `low`
     * @returns {String} the colorized form of the string
     */
    colorize(str /*, clazz*/) {
        return str;
    }

    /**
     * writes a string appended with a newline to the destination
     * @param {String} str the string to write
     */
    println(str) {
        this.write(`${str}\n`);
    }

    /**
     * closes this content writer. Should be called after all writes are complete.
     */
    close() {}
}

/**
 * a content writer that writes to a file
 * @param {Number} fd - the file descriptor
 * @extends ContentWriter
 * @constructor
 */
class FileContentWriter extends ContentWriter {
    constructor(fd) {
        super();

        this.fd = fd;
    }

    write(str) {
        fs.writeSync(this.fd, str);
    }

    close() {
        fs.closeSync(this.fd);
    }
}

// allow stdout to be captured for tests.
let capture = false;
let output = '';

/**
 * a content writer that writes to the console
 * @extends ContentWriter
 * @constructor
 */
class ConsoleWriter extends ContentWriter {
    write(str) {
        if (capture) {
            output += str;
        } else {
            process.stdout.write(str);
        }
    }

    colorize(str, clazz) {
        const colors = {
            low: '31;1',
            medium: '33;1',
            high: '32;1'
        };

        /* istanbul ignore next: different modes for CI and local */
        if (supportsColor.stdout && colors[clazz]) {
            return `\u001b[${colors[clazz]}m${str}\u001b[0m`;
        }
        return str;
    }
}

/**
 * utility for writing files under a specific directory
 * @class FileWriter
 * @param {String} baseDir the base directory under which files should be written
 * @constructor
 */
class FileWriter {
    constructor(baseDir) {
        if (!baseDir) {
            throw new Error('baseDir must be specified');
        }
        this.baseDir = baseDir;
    }

    /**
     * static helpers for capturing stdout report output;
     * super useful for tests!
     */
    static startCapture() {
        capture = true;
    }

    static stopCapture() {
        capture = false;
    }

    static getOutput() {
        return output;
    }

    static resetOutput() {
        output = '';
    }

    /**
     * returns a FileWriter that is rooted at the supplied subdirectory
     * @param {String} subdir the subdirectory under which to root the
     *  returned FileWriter
     * @returns {FileWriter}
     */
    writerForDir(subdir) {
        if (path.isAbsolute(subdir)) {
            throw new Error(
                `Cannot create subdir writer for absolute path: ${subdir}`
            );
        }
        return new FileWriter(`${this.baseDir}/${subdir}`);
    }

    /**
     * copies a file from a source directory to a destination name
     * @param {String} source path to source file
     * @param {String} dest relative path to destination file
     * @param {String} [header=undefined] optional text to prepend to destination
     *  (e.g., an "this file is autogenerated" comment, copyright notice, etc.)
     */
    copyFile(source, dest, header) {
        if (path.isAbsolute(dest)) {
            throw new Error(`Cannot write to absolute path: ${dest}`);
        }
        dest = path.resolve(this.baseDir, dest);
        mkdirp.sync(path.dirname(dest));
        let contents;
        if (header) {
            contents = header + fs.readFileSync(source, 'utf8');
        } else {
            contents = fs.readFileSync(source);
        }
        fs.writeFileSync(dest, contents);
    }

    /**
     * returns a content writer for writing content to the supplied file.
     * @param {String|null} file the relative path to the file or the special
     *  values `"-"` or `null` for writing to the console
     * @returns {ContentWriter}
     */
    writeFile(file) {
        if (file === null || file === '-') {
            return new ConsoleWriter();
        }
        if (path.isAbsolute(file)) {
            throw new Error(`Cannot write to absolute path: ${file}`);
        }
        file = path.resolve(this.baseDir, file);
        mkdirp.sync(path.dirname(file));
        return new FileContentWriter(fs.openSync(file, 'w'));
    }
}

module.exports = FileWriter;
