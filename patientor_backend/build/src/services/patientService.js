"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const patients_1 = __importDefault(require("../../data/patients"));
const patients = patients_1.default;
const getEntries = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};
const getAll = () => {
    return patients;
};
const addEntry = (entry, id) => {
    const newEntry = Object.assign({ id: (0, uuid_1.v1)() }, entry);
    console.log('service', newEntry);
    const patient = patients.find((p) => p.id === id);
    console.log(patient);
    patient === null || patient === void 0 ? void 0 : patient.entries.push(newEntry);
    return newEntry;
};
const addPatient = (entry) => {
    const NewPatientEntry = Object.assign({ id: (0, uuid_1.v1)() }, entry);
    patients.push(NewPatientEntry);
    return NewPatientEntry;
};
exports.default = {
    getEntries,
    addPatient,
    getAll,
    addEntry,
};
