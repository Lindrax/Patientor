"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = void 0;
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isGender = (param) => {
    return Object.values(types_1.Gender)
        .map((g) => g.toString())
        .includes(param);
};
const isRating = (param) => {
    return Object.values(types_1.HealthCheckRating).includes(param);
};
const parseRating = (rating) => {
    const numericRating = Number(rating); // Convert string to number
    if (!isRating(numericRating)) {
        throw new Error('Incorrect rating');
    }
    return numericRating; // Return as HealthCheckRating
};
const parseName = (name) => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name');
    }
    return name;
};
const parseDateOfBirth = (date) => {
    if (!date || !isString(date)) {
        throw new Error('Incorrect or missing date of birth');
    }
    return date;
};
const parseSsn = (ssn) => {
    if (!ssn || !isString(ssn)) {
        throw new Error('Incorrect or missing ssn');
    }
    return ssn;
};
const parseGender = (gender) => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender');
    }
    return gender;
};
const parseOccupation = (occupation) => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation');
    }
    return occupation;
};
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        // we will just trust the data to be in correct form
        return [];
    }
    return object.diagnosisCodes;
};
const toNewEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('type' in object &&
        'description' in object &&
        'date' in object &&
        'specialist' in object) {
        switch (object.type) {
            case 'Hospital':
                if ('discharge' in object) {
                    let newEntry = {
                        type: 'Hospital',
                        description: object.description,
                        date: object.date,
                        specialist: object.specialist,
                        discharge: object.discharge,
                    };
                    if ('diagnosisCodes' in object) {
                        newEntry = Object.assign(Object.assign({}, newEntry), { diagnosisCodes: parseDiagnosisCodes(object) });
                        console.log('shit');
                    }
                    console.log('case', newEntry);
                    return newEntry;
                }
                break;
            case 'OccupationalHealthcare':
                if ('employerName' in object) {
                    let newEntry = {
                        type: 'OccupationalHealthcare',
                        description: object.description,
                        date: object.date,
                        specialist: object.specialist,
                        employerName: object.employerName,
                    };
                    if ('diagnosisCodes' in object) {
                        newEntry = Object.assign(Object.assign({}, newEntry), { diagnosisCodes: parseDiagnosisCodes(object) });
                    }
                    if ('sickLeave' in object) {
                        return Object.assign(Object.assign({}, newEntry), { sickLeave: object.sickLeave });
                    }
                    console.log('case', newEntry);
                    return newEntry;
                }
                break;
            case 'HealthCheck':
                if ('healthCheckRating' in object) {
                    let newEntry = {
                        type: 'HealthCheck',
                        description: object.description,
                        date: object.date,
                        specialist: object.specialist,
                        healthCheckRating: parseRating(object.healthCheckRating),
                    };
                    if ('diagnosisCodes' in object) {
                        newEntry = Object.assign(Object.assign({}, newEntry), { diagnosisCodes: parseDiagnosisCodes(object) });
                    }
                    console.log('case', newEntry);
                    return newEntry;
                }
                break;
        }
    }
    throw new Error('Incorrect data: a field missing');
};
exports.toNewEntry = toNewEntry;
const toNewPatientEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('name' in object &&
        'dateOfBirth' in object &&
        'ssn' in object &&
        'gender' in object &&
        'occupation' in object &&
        'entries' in object) {
        const newPatient = {
            name: parseName(object.name),
            dateOfBirth: parseDateOfBirth(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
            entries: [],
        };
        return newPatient;
    }
    throw new Error('Incorrect data: a field missing');
};
exports.default = toNewPatientEntry;
