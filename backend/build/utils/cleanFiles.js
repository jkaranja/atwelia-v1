"use strict";
/**
 *
 * @param files - Raw File[]: req.files
 * @returns  - Clean File[]
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cleanFiles = (files) => {
    if (Array.isArray(files)) {
        return files?.map((file) => ({
            path: `${file.destination}/${file.filename}`,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
        }));
    }
    return [];
};
exports.default = cleanFiles;
